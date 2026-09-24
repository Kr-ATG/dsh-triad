/**
 * dsh-triad — build script.
 *
 * Two bundles from one esbuild run:
 *
 *   lib/index.js   host half    ESM,  node platform,  self-contained
 *   lib/client.js  browser half CJS,  browser platform, wrapped in the
 *                  `window.__ModuleLoader__.load` factory contract
 *
 * The host half must stay **resolvable from an installed location**, i.e. from
 * inside `~/.dsh/profiles/<p>/node_modules/`. That rules out importing most
 * `@deepseek-ai/*` packages at runtime: DSH ships those as source only (their
 * `lib/` holds `.d.ts` plus a couple of hand-built entries, no `lib/index.js`),
 * and resolves them at runtime through tsx + `tsconfig.base.json` `paths`.
 * tsx only applies `paths` to importers *outside* node_modules, so a plugin
 * that was installed with `dsh plugin add` gets plain node resolution and
 * lands on a missing file. See vendor/README.md for the full rule and
 * `assertHostExternals()` below for the guard that enforces it.
 *
 * Usage: node build.mjs
 */

import { createRequire } from 'node:module'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DSH_CHECKOUT = process.env.DSH_CHECKOUT ?? 'D:/AI/deepseek-harness'
const PLUGIN_ID = 'dsh-triad'

/**
 * Resolve esbuild.
 *
 * Three tiers, in order — the first two keep this plugin buildable both for
 * a fresh clone (`pnpm install` puts esbuild in node_modules) and for a
 * contributor hacking inside a DSH checkout:
 *
 *  1. the plugin's own `node_modules` (normal install path; esbuild is a
 *     devDependency so `pnpm install` provides it),
 *  2. a local DSH checkout's pnpm store (contributor convenience — pnpm's
 *     strict layout keeps esbuild out of the root node_modules, so scan
 *     `node_modules/.pnpm/esbuild@*` and take the highest version),
 *  3. a clear, actionable error.
 *
 * Tier 3 matters: a bare `require('esbuild')` failure message does not tell
 * the user to run `pnpm install`.
 */
function loadEsbuild() {
  const localRequire = createRequire(resolve(HERE, 'package.json'))
  try {
    return localRequire('esbuild')
  } catch {
    // Not installed locally; fall through to the checkout scan.
  }

  const store = join(DSH_CHECKOUT, 'node_modules', '.pnpm')
  const candidates = []
  if (existsSync(store)) {
    for (const entry of readdirSync(store)) {
      if (!entry.startsWith('esbuild@')) continue
      candidates.push(join(store, entry, 'node_modules', 'esbuild'))
    }
  }
  if (candidates.length > 0) {
    const pick = candidates.sort().at(-1)
    return createRequire(resolve(pick, 'package.json'))(pick)
  }

  throw new Error(
    'dsh-triad: cannot find esbuild.\n'
    + '  Run `pnpm install` in this directory (esbuild is a devDependency).\n'
    + `  Or set DSH_CHECKOUT to a DSH checkout to borrow its copy (currently: ${DSH_CHECKOUT}).`,
  )
}

const esbuild = loadEsbuild()

/** Platform packages + react come from the DSH module table at runtime. */
const CLIENT_EXTERNAL = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
]

/** Browser half: one CJS factory registered with the host module loader. */
const clientBundle = {
  entryPoints: [resolve(HERE, 'src/client/index.ts')],
  outfile: resolve(HERE, 'lib/client.js'),
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  sourcemap: true,
  logLevel: 'info',
  external: CLIENT_EXTERNAL,
  // Everything under @deepseek-ai/ stays a runtime require.
  plugins: [{
    name: 'triad-external-platform',
    setup(build) {
      build.onResolve({ filter: /^@deepseek-ai\// }, args => ({ path: args.path, external: true }))
    },
  }],
  banner: {
    js: [
      `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (__rawRequire) => {`,
      'const require = (id) => {',
      '  const mod = __rawRequire(id);',
      "  if (id === '@deepseek-ai/dsh-client-ui-primitives' && mod && typeof mod === 'object') {",
      '    return new Proxy(mod, {',
      '      get(target, prop) {',
      '        if (prop in target) return target[prop];',
      "        if (typeof prop === 'string') {",
      "          const regular = prop.replace(/\\d+$/, 'Regular');",
      '          if (regular in target) return target[regular];',
      "          const medium = prop.replace(/\\d+$/, 'Medium');",
      '          if (medium in target) return target[medium];',
      '        }',
      '        return target[prop];',
      '      }',
      '    });',
      '  }',
      '  return mod;',
      '};',
      'var module = { exports: {} };',
      'var exports = module.exports;',
      'Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });',
    ].join('\n'),
  },
  footer: {
    js: 'return module.exports; } });',
  },
}

/**
 * The only bare specifiers the host bundle may leave to runtime resolution.
 *
 * A plugin installed into a profile's node_modules can only resolve packages
 * that DSH actually ships runtime JS for. `@deepseek-ai/cordis` and
 * `@deepseek-ai/dsh-util-crypto` both do (and the latter has no imports of its
 * own). Anything else under `@deepseek-ai/` must be vendored into `vendor/`
 * instead — see vendor/README.md.
 *
 * This is an allowlist rather than "whatever resolved at build time" on
 * purpose: the build runs from a source checkout where *every* `@deepseek-ai/*`
 * name resolves to a source dir, so a build-time check would pass and the
 * installed plugin would still crash at startup.
 */
const HOST_RUNTIME_EXTERNAL_ALLOWLIST = new Set([
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-util-crypto',
])

/** Host half: ESM, self-contained except node builtins and the allowlist above. */
const hostBundle = {
  entryPoints: [resolve(HERE, 'src/host.ts')],
  outfile: resolve(HERE, 'lib/index.js'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  sourcemap: true,
  logLevel: 'info',
  // node:* builtins stay external. yauzl is bundled in on purpose: the
  // plugin's node_modules is a junction into the DSH profile (so @deepseek-ai/*
  // resolves to the very same module instances the host uses), and a junction
  // cannot also hold a private yauzl copy.
  //
  // `@deepseek-ai/*` is external *at bundle time* only so esbuild keeps the
  // names verbatim; `assertHostExternals()` then checks every surviving name
  // against the allowlist, so an unvendored dependency fails the build here
  // instead of at plugin startup on someone else's machine.
  external: [],
  // yauzl is inlined (see above) and is CJS: it calls bare `require('fs')`.
  // In an ESM bundle that throws "Dynamic require ... is not supported", so
  // hand the bundle a real CommonJS require bound to its own URL.
  banner: {
    js: [
      "import { createRequire as __triadCreateRequire } from 'node:module';",
      'const require = __triadCreateRequire(import.meta.url);',
    ].join('\n'),
  },
  plugins: [{
    name: 'triad-external-platform',
    setup(build) {
      build.onResolve({ filter: /^(@deepseek-ai\/|node:)/ }, args => ({ path: args.path, external: true }))
    },
  }],
}

/**
 * Fail the build if the host bundle still hands an unresolvable specifier to
 * runtime resolution.
 *
 * Catches exactly the regression that motivated `vendor/`: adding
 * `import { X } from '@deepseek-ai/dsh-llm'` to a host module looks fine on a
 * dev machine (esbuild externalises it, the source checkout resolves it, the
 * smoke test under tsx passes) and then throws ERR_MODULE_NOT_FOUND for every
 * user who installed the plugin.
 */
function assertHostExternals(outfile) {
  const source = readFileSync(outfile, 'utf8')
  const specifiers = new Set()
  for (const m of source.matchAll(/(?:^|[;\n])\s*(?:import|export)[\s\S]*?from\s*["']([^"']+)["']/g)) {
    specifiers.add(m[1])
  }
  for (const m of source.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)) {
    specifiers.add(m[1])
  }

  const violations = [...specifiers].filter((spec) => {
    if (spec.startsWith('node:')) return false
    return !HOST_RUNTIME_EXTERNAL_ALLOWLIST.has(spec)
  })

  if (violations.length > 0) {
    throw new Error(
      'dsh-triad: host bundle imports packages that an installed plugin cannot resolve.\n'
      + violations.map(v => `  - ${v}`).join('\n')
      + '\n\n'
      + 'DSH ships @deepseek-ai/* as source only; a plugin inside a profile\'s\n'
      + 'node_modules gets plain node resolution and finds no lib/index.js.\n'
      + 'Vendor the leaf modules you need into vendor/ (see vendor/README.md),\n'
      + `or add the name to HOST_RUNTIME_EXTERNAL_ALLOWLIST in ${basename(fileURLToPath(import.meta.url))}\n`
      + 'after verifying the package really ships runtime JS.',
    )
  }
  return [...specifiers]
}

await Promise.all([esbuild.build(clientBundle), esbuild.build(hostBundle)])
const hostExternals = assertHostExternals(resolve(HERE, 'lib/index.js'))
console.log('[dsh-triad] built lib/index.js + lib/client.js')
console.log(`[dsh-triad] host runtime imports: ${hostExternals.length === 0 ? '(none)' : hostExternals.join(', ')}`)
