/**
 * mcp-paste — 粘贴添加 MCP Server：JSON / DSH 原生 YAML → mcp-client 行。
 *
 * JSON 形态对齐其它 harness（Claude Code / Codex / Roo 等）的 `.mcp.json`：
 *   { "mcpServers": { <name>: { command|url, args, env, cwd, headers } } }
 * 也接受裸映射 `{ <name>: {...} }`。transport 推断：显式 `type`/`transport`
 * 优先（http/sse 归一 streamable-http），否则 `command` → stdio、`url` → http。
 * 字符串里的 `${VAR}` 占位在落盘时转成 `!!js` 模板表达式（loader 求值）。
 *
 * YAML 形态（DSH 原生方言，js-yaml 解析，报错带行号）额外接受插件行写法：
 *   - id: mcp-x
 *     name: '@deepseek-ai/dsh-mcp-client'
 *     config: { serverName: x, transport: stdio, command: npx }
 * 以及 `- insert:` 包裹的 patch 片段（整段原样取其中的 mcp-client 行）；
 * config 值里的 `!!js` 表达式以标记对象原样保留，写回时重新加标签。
 *
 * 输出统一为插件的行结构（{ id, name, config }），再按目标序列化：
 *   - rowsToPresetYaml：预设组合文件形态（顶层行）；
 *   - rowsToPatchYaml：profile patch 形态（`- insert:` 包裹）。
 * 零副作用纯函数 + 一条 `POST /api/triad/mcp-preview` 校验路由。
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
// js-yaml 不自带类型声明（无 tsc 门禁）；版本与 DSH 对齐（v4 的 Type/DEFAULT_SCHEMA API）。
// @ts-expect-error -- untyped dependency
import { DEFAULT_SCHEMA, Type, load } from 'js-yaml'
import { loopbackAllowed, writeJsonResponse } from './mcp-recommended.ts'

const ROUTE_PREFIX = '/api/triad/mcp-preview'
const MAX_BODY_BYTES = 256 * 1024

/** dsh-mcp-client 的插件包名。 */
export const MCP_CLIENT_NAME = '@deepseek-ai/dsh-mcp-client'
/** serverName 约束（与 dsh-mcp-client 一致）。 */
const SERVER_NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/
/** `${VAR}` 环境变量占位。 */
const ENV_REF = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g

/** `!!js` 表达式占位：原样保留，写回时重新加标签。 */
export interface JsExpr {
  __js: string
}
/** 配置标量：普通字符串，或 `!!js` 表达式。 */
export type Scalar = string | JsExpr

/** 单个 MCP server 的规范化配置（与 dsh-mcp-client 的 config 形状对齐）。 */
export interface McpServerConfig {
  serverName: string
  transport: 'stdio' | 'streamable-http'
  command?: Scalar
  args?: Scalar[]
  env?: Record<string, Scalar>
  cwd?: Scalar
  url?: Scalar
  headers?: Record<string, Scalar>
  toolCallTimeoutMs?: number
}

/** serverName → 配置。 */
export type McpServers = Record<string, McpServerConfig>

/** dsh-mcp-client 插件行（loader entry 形状；config 值可含 JsExpr 标记）。 */
export interface McpRowConfig {
  id: string
  name: string
  config: Record<string, unknown>
}

/** 解析结果：可预览的 server 摘要 + 待写行 + 逐条错误 + 非致命警告。 */
export interface PasteOutcome {
  servers: Array<{ name: string; transport: string; summary: string }>
  rows: McpRowConfig[]
  errors: string[]
  warnings: string[]
}

/** 粘贴文本形态。 */
export type PasteFormat = 'json' | 'yaml'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isJsExpr(value: unknown): value is JsExpr {
  return isPlainObject(value) && typeof (value as { __js?: unknown }).__js === 'string'
}

/** 标量：string 原样；number/boolean 转字符串并记警告；JsExpr 保留；其它忽略。 */
function toScalar(value: unknown, warnings: string[], label: string): Scalar | undefined {
  if (typeof value === 'string') return value
  if (isJsExpr(value)) return value
  if (typeof value === 'number' || typeof value === 'boolean') {
    warnings.push(`${label}: ${typeof value} 值已转为字符串 "${String(value)}"`)
    return String(value)
  }
  return undefined
}

/** 标量数组：非标量项记警告跳过。 */
function toScalarArray(value: unknown, warnings: string[], label: string): Scalar[] | undefined {
  if (!Array.isArray(value)) return undefined
  const out: Scalar[] = []
  for (const item of value) {
    const scalar = toScalar(item, warnings, label)
    if (scalar === undefined) {
      warnings.push(`${label}: 忽略非标量项（${Array.isArray(item) ? 'array' : typeof item}）`)
      continue
    }
    out.push(scalar)
  }
  return out
}

/** 标量字典。 */
function toScalarDict(value: unknown, warnings: string[], label: string): Record<string, Scalar> | undefined {
  if (!isPlainObject(value)) return undefined
  const out: Record<string, Scalar> = {}
  for (const [key, item] of Object.entries(value)) {
    const scalar = toScalar(item, warnings, label)
    if (scalar === undefined) {
      warnings.push(`${label}.${key}: 忽略非标量值（${Array.isArray(item) ? 'array' : typeof item}）`)
      continue
    }
    out[key] = scalar
  }
  return out
}

/** 单行摘要（预览用）：stdio 显示 command，http 显示 url。 */
export function summaryOf(config: McpServerConfig): string {
  if (config.transport === 'stdio') {
    const command = config.command !== undefined && typeof config.command === 'string' ? config.command : '(!!js)'
    const args = (config.args ?? []).map(item => (typeof item === 'string' ? item : '(!!js)')).join(' ')
    return args === '' ? command : `${command} ${args}`
  }
  return config.url !== undefined && typeof config.url === 'string' ? config.url : '(!!js)'
}

/** 解析单个 server 配置；失败返回错误文案。 */
function parseServer(name: string, value: unknown, warnings: string[]): McpServerConfig | { error: string } {
  if (!SERVER_NAME_PATTERN.test(name)) {
    return { error: `server "${name}": serverName 需匹配 [A-Za-z0-9_-]{1,32}` }
  }
  if (!isPlainObject(value)) return { error: `server "${name}": 配置需为对象` }
  const cfg = value as Record<string, unknown>
  const explicit = String(cfg.type ?? cfg.transport ?? '').toLowerCase()
  const command = toScalar(cfg.command, warnings, `server "${name}".command`)
  const url = toScalar(cfg.url, warnings, `server "${name}".url`)
  let transport: McpServerConfig['transport'] | undefined
  if (explicit === 'stdio' || explicit === 'command') transport = 'stdio'
  else if (explicit === 'streamable-http' || explicit === 'streamable-http-sse' || explicit === 'http' || explicit === 'sse') transport = 'streamable-http'
  else if (command !== undefined) transport = 'stdio'
  else if (url !== undefined) transport = 'streamable-http'
  if (transport === undefined) {
    return { error: `server "${name}": 无法推断传输方式（stdio 需要 command，http 需要 url；可用 transport 显式声明）` }
  }
  const toolCallTimeoutMs = typeof cfg.toolCallTimeoutMs === 'number' && Number.isFinite(cfg.toolCallTimeoutMs)
    ? cfg.toolCallTimeoutMs
    : undefined
  if (transport === 'stdio') {
    if (command === undefined) return { error: `server "${name}": stdio 需要 command` }
    const label = `server "${name}"`
    return {
      serverName: name,
      transport,
      command,
      args: toScalarArray(cfg.args, warnings, `${label}.args`) ?? [],
      env: toScalarDict(cfg.env, warnings, `${label}.env`) ?? {},
      cwd: toScalar(cfg.cwd, warnings, `${label}.cwd`),
      toolCallTimeoutMs,
    }
  }
  if (url === undefined) return { error: `server "${name}": http 需要 url` }
  return {
    serverName: name,
    transport,
    url,
    headers: toScalarDict(cfg.headers, warnings, `server "${name}".headers`) ?? {},
    toolCallTimeoutMs,
  }
}

/** servers 映射 → 插件行。 */
export function serversToRows(servers: McpServers): McpRowConfig[] {
  const rows: McpRowConfig[] = []
  for (const server of Object.values(servers)) {
    const config: Record<string, unknown> = { serverName: server.serverName, transport: server.transport }
    if (server.transport === 'stdio') {
      config.command = server.command
      if (server.args !== undefined && server.args.length > 0) config.args = server.args
      if (server.env !== undefined && Object.keys(server.env).length > 0) config.env = server.env
      if (server.cwd !== undefined) config.cwd = server.cwd
    } else {
      config.url = server.url
      if (server.headers !== undefined && Object.keys(server.headers).length > 0) config.headers = server.headers
    }
    if (server.toolCallTimeoutMs !== undefined) config.toolCallTimeoutMs = server.toolCallTimeoutMs
    rows.push({ id: `mcp-${server.serverName}`, name: MCP_CLIENT_NAME, config })
  }
  return rows
}

/** 一行插件行对象 → 校验后的 McpRowConfig（YAML 行写法的入口）。 */
function parseRow(raw: unknown, warnings: string[], errors: string[]): McpRowConfig | undefined {
  if (!isPlainObject(raw)) {
    errors.push('行片段：每一项需为对象（- id: ... / name: ... / config: ...）')
    return undefined
  }
  const name = typeof raw.name === 'string' ? raw.name : ''
  if (name !== MCP_CLIENT_NAME) {
    errors.push(`行片段：只接受 name: '${MCP_CLIENT_NAME}' 的行（收到 ${name === '' ? '(缺 name)' : `"${name}"`}）`)
    return undefined
  }
  if (!isPlainObject(raw.config)) {
    errors.push('行片段：缺少 config 对象')
    return undefined
  }
  const shape = parseServer(
    typeof raw.config.serverName === 'string' ? raw.config.serverName : '',
    raw.config,
    warnings,
  )
  if ('error' in shape) {
    errors.push(shape.error)
    return undefined
  }
  // 行写法保留 config 的其他键（failOnStartupError / reconnect / maxInstructionBytes 等）。
  const config: Record<string, unknown> = { ...raw.config }
  config.serverName = shape.serverName
  config.transport = shape.transport
  const id = typeof raw.id === 'string' && /^[A-Za-z0-9_-]+$/.test(raw.id) ? raw.id : `mcp-${shape.serverName}`
  return { id, name: MCP_CLIENT_NAME, config }
}

/** 把任意解析出的文档归一为行列表（三种形态：mcpServers 映射 / 裸映射 / 行数组）。 */
function rowsOf(raw: unknown, warnings: string[], errors: string[]): McpRowConfig[] {
  if (Array.isArray(raw)) {
    const rows: McpRowConfig[] = []
    for (const entry of raw) {
      if (!isPlainObject(entry)) {
        errors.push('顶层数组：每一项需为 mcp-client 行或 `- insert:` 片段')
        continue
      }
      // patch 片段：- insert: [rows]
      if (Array.isArray(entry.insert)) {
        for (const nested of entry.insert) {
          const row = parseRow(nested, warnings, errors)
          if (row !== undefined) rows.push(row)
        }
        continue
      }
      const row = parseRow(entry, warnings, errors)
      if (row !== undefined) rows.push(row)
    }
    return rows
  }
  if (isPlainObject(raw)) {
    const map = isPlainObject(raw.mcpServers) ? raw.mcpServers : raw
    const servers: McpServers = {}
    for (const [name, value] of Object.entries(map)) {
      const parsed = parseServer(name, value, warnings)
      if ('error' in parsed) {
        errors.push(parsed.error)
        continue
      }
      servers[name] = parsed
    }
    return serversToRows(servers)
  }
  errors.push('期望 JSON/YAML 对象（mcpServers 映射）或 mcp-client 行数组')
  return []
}

/** `!!js` 标签：保留原始表达式文本（loader 求值，本模块不执行）。 */
const JS_TAG = new Type('tag:yaml.org,2002:js', {
  kind: 'scalar',
  construct: (data: unknown) => ({ __js: String(data) }) satisfies JsExpr,
})
const MCP_SCHEMA = DEFAULT_SCHEMA.extend([JS_TAG])

/** 解析粘贴文本（JSON 或 YAML）为行列表 + 错误/警告。 */
export function parseMcpPaste(format: PasteFormat, text: string): PasteOutcome {
  const warnings: string[] = []
  const errors: string[] = []
  let raw: unknown
  if (format === 'json') {
    try {
      raw = JSON.parse(text) as unknown
    } catch (error) {
      return { servers: [], rows: [], errors: [`JSON 解析失败: ${error instanceof Error ? error.message : String(error)}`], warnings }
    }
  } else {
    try {
      raw = load(text, { schema: MCP_SCHEMA }) as unknown
    } catch (error) {
      const mark = (error as { mark?: { line?: number } } | null)?.mark
      const at = typeof mark?.line === 'number' ? `（第 ${mark.line + 1} 行）` : ''
      return {
        servers: [],
        rows: [],
        errors: [`YAML 解析失败${at}: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`],
        warnings,
      }
    }
  }
  const rows = rowsOf(raw, warnings, errors)
  const servers = rows.map(row => ({
    name: String(row.config.serverName ?? ''),
    transport: String(row.config.transport ?? ''),
    summary: rowSummary(row.config),
  }))
  return { servers, rows, errors, warnings }
}

/** 行 config 的预览摘要。 */
function rowSummary(config: Record<string, unknown>): string {
  const transport = String(config.transport ?? '')
  if (transport === 'stdio') {
    const command = config.command
    const args = Array.isArray(config.args) ? config.args.map(item => describeScalar(item)).join(' ') : ''
    return args === '' ? describeScalar(command) : `${describeScalar(command)} ${args}`
  }
  return describeScalar(config.url)
}

function describeScalar(value: unknown): string {
  if (typeof value === 'string') return value
  if (isJsExpr(value)) return '!!js'
  return ''
}

/* ── 序列化（写回 YAML）：行 → 预设组合形态 / patch 形态 ─────────────────── */

/** 含 `${VAR}` 的字符串 → `!!js` 模板表达式体（`${VAR}` → `${process.env.VAR}`）。 */
function toJsTemplate(value: string): string {
  const escaped = value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/'/g, "\\'")
  const withEnv = escaped.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, '${process.env.$1}')
  return `\`${withEnv}\``
}

/** 可以不加引号且不被 YAML 误判类型的普通标量。 */
const PLAIN_SCALAR = /^[A-Za-z0-9_][A-Za-z0-9_.@:/+~-]*$/
/** YAML 会解释成非字符串的裸词与数值（保持字符串语义必须加引号）。 */
const YAML_AMBIGUOUS = /^(?:true|false|null|yes|no|on|off|~)$/i
const NUMERIC_LIKE = /^[+-]?(?:\d+\.?\d*|\.\d+)$/

/** 标量 → YAML 标量文本：JsExpr 原样 `!!js`；含 ${VAR} 的字符串 → `!!js` 模板；其余按需加引号。 */
function yamlScalarOf(value: unknown): string {
  if (isJsExpr(value)) return `!!js ${value.__js}`
  if (typeof value === 'string') {
    ENV_REF.lastIndex = 0
    if (ENV_REF.test(value)) return `!!js '${toJsTemplate(value).replace(/'/g, "''")}'`
    if (PLAIN_SCALAR.test(value) && !YAML_AMBIGUOUS.test(value) && !NUMERIC_LIKE.test(value)) return value
    return JSON.stringify(value)
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null) return 'null'
  return JSON.stringify(value) ?? 'null'
}

/** 迷你 YAML 发射器：对象/数组/标量（配置结构简单，无需完整 YAML 库）。 */
function emitYaml(value: Record<string, unknown>, indent: string): string[] {
  const out: string[] = []
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined) continue
    if (isPlainObject(item)) {
      out.push(`${indent}${key}:`)
      out.push(...emitYaml(item, `${indent}  `))
    } else if (Array.isArray(item)) {
      out.push(`${indent}${key}:`)
      for (const entry of item) out.push(`${indent}  - ${yamlScalarOf(entry)}`)
    } else {
      out.push(`${indent}${key}: ${yamlScalarOf(item)}`)
    }
  }
  return out
}

/** 行 → 预设组合文件形态（顶层行；保留注释与其余内容的调用方负责插入）。 */
export function rowsToPresetYaml(rows: readonly McpRowConfig[]): string {
  const lines: string[] = []
  for (const row of rows) {
    lines.push(`- id: ${row.id}`)
    lines.push(`  name: '${row.name}'`)
    lines.push('  config:')
    lines.push(...emitYaml(row.config, '    '))
  }
  return `${lines.join('\n')}\n`
}

/** 行 → profile patch 形态（`- insert:` 包裹，与面板既有配置片段一致）。 */
export function rowsToPatchYaml(rows: readonly McpRowConfig[]): string {
  const lines: string[] = []
  for (const row of rows) {
    lines.push('- insert:')
    lines.push(`    - id: ${row.id}`)
    lines.push(`      name: '${row.name}'`)
    lines.push('      config:')
    lines.push(...emitYaml(row.config, '        '))
  }
  return `${lines.join('\n')}\n`
}

/** 在 YAML 文本末尾追加行块（保留既有内容与行尾风格；空文本则只留块）。 */
export function appendRowsToText(content: string, block: string): string {
  const eol = content.includes('\r\n') ? '\r\n' : '\n'
  const trimmed = content.replace(/[\r\n\s]+$/, '')
  const blockText = block.replace(/\n+$/, '').split('\n').join(eol)
  if (trimmed === '') return `${blockText}${eol}`
  return `${trimmed}${eol}${eol}${blockText}${eol}`
}

/** 解析 JSON 请求体（带上限）。 */
function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolvePromise, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('request body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (chunks.length === 0) { resolvePromise({}); return }
      try {
        resolvePromise(JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>)
      } catch {
        reject(new Error('invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

/** 请求体字段 → (format, text)；缺失或非法时抛错。 */
export function pasteFieldsOf(body: Record<string, unknown>): { format: PasteFormat; text: string } {
  const format = body.format === 'yaml' ? 'yaml' : body.format === 'json' ? 'json' : undefined
  if (format === undefined) throw new Error('format must be "json" or "yaml"')
  if (typeof body.text !== 'string' || body.text.trim() === '') throw new Error('text must be a non-empty string')
  return { format, text: body.text }
}

/** 请求体 → (format, text)。 */
export async function readPasteBody(req: IncomingMessage): Promise<{ format: PasteFormat; text: string }> {
  return pasteFieldsOf(await readJsonBody(req))
}

/** 注册 POST /api/triad/mcp-preview（校验 + 预览宿主侧解析结果，不写任何文件）。 */
export function applyMcpPreviewRoute(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: (req: IncomingMessage, res: ServerResponse) => {
      void (async () => {
        if (!loopbackAllowed(req)) {
          writeJsonResponse(res, 403, { error: 'loopback-only' })
          return
        }
        try {
          const body = await readJsonBody(req)
          const target = body.target === 'global' ? 'global' : 'preset'
          const { format, text } = pasteFieldsOf(body)
          const outcome = parseMcpPaste(format, text)
          writeJsonResponse(res, 200, {
            ok: outcome.errors.length === 0,
            servers: outcome.servers,
            yaml: target === 'global' ? rowsToPatchYaml(outcome.rows) : rowsToPresetYaml(outcome.rows),
            errors: outcome.errors,
            warnings: outcome.warnings,
          })
        } catch (error) {
          writeJsonResponse(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
        }
      })()
    },
  }), 'triad: mcp-preview route')
}
