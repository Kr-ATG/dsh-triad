/**
 * dsh-triad — host half smoke test.
 *
 * Imports the real `lib/index.js` (so `@deepseek-ai/dsh-tools` and
 * `@deepseek-ai/dsh-llm` resolve against the live DSH profile) and asserts the
 * Cordis plugin contract, then runs `apply()` against a stub host context to
 * prove both halves mount and register their routes without touching the real
 * DSH runtime.
 *
 * Usage: node scripts/smoke-host.mjs
 */

import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

const fail = (msg) => { console.error(`FAIL  ${msg}`); process.exitCode = 1 }
const pass = (msg) => console.log(`ok    ${msg}`)

// ── 1. import the plugin ─────────────────────────────────────────────────
let mod
try {
  mod = await import(pathToFileURL(resolve(ROOT, 'lib/index.js')).href)
  pass('lib/index.js imported (@deepseek-ai/* resolved from the live profile)')
} catch (error) {
  fail(`cannot import lib/index.js: ${error?.stack ?? error}`)
  process.exit(process.exitCode ?? 1)
}

// ── 2. Cordis plugin contract ────────────────────────────────────────────
if (mod.name !== 'dsh-triad') fail(`expected name "dsh-triad", got ${JSON.stringify(mod.name)}`)
else pass(`name = ${JSON.stringify(mod.name)}`)

if (!Array.isArray(mod.inject)) fail('inject is not an array')
else pass(`inject = [${mod.inject.join(', ')}]`)

for (const svc of ['webServer', 'tools', 'credentials', 'sessions', 'sessionPersistence', 'settings', 'llm']) {
  if (!mod.inject.includes(svc)) fail(`inject is missing required service "${svc}"`)
}
pass('inject covers every service both halves reach for')

if (typeof mod.apply !== 'function') fail('apply is not a function')
else pass('apply is a function')

// ── 3. run apply() against a stub host context ───────────────────────────
const routes = new Map()
const listeners = new Map()
const tools = []
const logs = []

const ctx = {
  logger: { info: (m) => logs.push(['info', m]), warn: (m) => logs.push(['warn', m]), debug: () => {} },
  webServer: {
    register(route) {
      if (routes.has(route.path)) throw new Error(`duplicate route ${route.path}`)
      routes.set(route.path, route)
      return () => routes.delete(route.path)
    },
  },
  tools: {
    register(definition) {
      if (typeof definition.name !== 'string') throw new Error('tool without name')
      tools.push(definition.name)
      return () => { const i = tools.indexOf(definition.name); if (i >= 0) tools.splice(i, 1) }
    },
  },
  on: (event, handler) => {
    if (!listeners.has(event)) listeners.set(event, [])
    listeners.get(event).push(handler)
    return () => {}
  },
  get: (name) => ctx[name],
  effect: (fn) => { fn?.(); return () => {} },
  settings: { get: () => ({ providers: {} }), register: () => () => {} },
  credentials: {},
  sessions: {},
  sessionPersistence: {},
  llm: {},
}

try {
  await mod.apply(ctx, {})
  pass('apply(ctx) completed without throwing')
} catch (error) {
  fail(`apply(ctx) threw: ${error?.stack ?? error}`)
}

// ── 4. what actually got mounted ─────────────────────────────────────────
const paths = [...routes.keys()].sort()
console.log(`\n  routes (${paths.length}):`)
for (const p of paths) console.log(`    ${p}`)

console.log(`\n  tools (${tools.length}):`)
for (const t of tools) console.log(`    ${t}`)

console.log(`\n  listeners (${listeners.size}): ${[...listeners.keys()].join(', ')}`)

const need = (cond, msg) => (cond ? pass(msg) : fail(msg))
need(paths.some(p => p.startsWith('/api/dsh-memory')), 'memory routes registered (/api/dsh-memory/*)')
need(paths.some(p => p.startsWith('/api/usage-stats')), 'usage routes registered (/api/usage-stats/*)')
need(paths.some(p => p.startsWith('/api/skill-manager')), 'skill routes registered (/api/skill-manager/*)')
// 技能面板的开关与「Agent 预设」筛选条都打这条；漏了就全 404、面板顶部没有预设条。
need(paths.some(p => p.startsWith('/api/skill-toggles')), 'skill toggle routes registered (/api/skill-toggles/*)')
need(paths.some(p => p.startsWith('/api/triad-automation')), 'automation routes registered (/api/triad-automation/*)')
need(tools.includes('automation'), 'automation tool registered')
need(tools.includes('memory_search') && tools.includes('memory_remember'), 'memory tools registered')
need(listeners.has('agent/pre-step'), 'agent/pre-step injection hooked')
need(listeners.has('session/event'), 'session/event capture hooked')

const warns = logs.filter(([lvl]) => lvl === 'warn')
if (warns.length > 0) {
  console.log('\n  warnings during apply:')
  for (const [, m] of warns) console.log(`    ${m}`)
}

console.log(`\n${process.exitCode ? 'SMOKE FAILED' : 'SMOKE PASSED'} — ${resolve(ROOT, 'lib/index.js')}`)
process.exit(process.exitCode ?? 0)
