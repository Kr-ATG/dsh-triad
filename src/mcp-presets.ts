/**
 * mcp-presets — 预设专属 MCP Server（L2a，host 半身）。
 *
 * 预设组合文件 `agent.cordis.yml` 里直接写 `@deepseek-ai/dsh-mcp-client` 行：
 * 该行的工具、服务器指令、资源 provider 都跟随预设作用域注册（0.1.6 作用域语义），
 * 因此只对该预设（及其子代理）可见；与全局同 serverName 时天然构成完整覆盖
 * （scoped 注册遮蔽同名全局）。
 *
 * 本模块做四件事：
 *   1. 解析预设组合文件路径（`agentPresets.list()` 的 `path`——**随 DSH 安装的
 *      默认预设与用户自写预设同等可读写**，不再区分"官方/我的"）；
 *   2. 从组合文本解析 mcp-client 行（serverName / transport 摘要）；
 *   3. 插入/删除行——文本级编辑保留注释，写前备份 + tmp/rename 原子写；
 *   4. 路由 `POST/DELETE /api/triad/mcp-presets/*`（POST 接受粘贴的
 *      JSON / DSH 原生 YAML，见 mcp-paste.ts）。
 *
 * 组合文本来源：优先 `agentPresets.list()` 给出的绝对路径；服务/路径缺失时
 * 回落到 `readDocument` 或用户根文件 `${DSH_HOME}/.agent-presets/<id>/`。
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import { loopbackAllowed, writeJsonResponse } from './mcp-recommended.ts'
import {
  appendRowsToText, parseMcpPaste, pasteFieldsOf, rowsToPresetYaml, serversToRows,
  type McpRowConfig, type McpServerConfig,
} from './mcp-paste.ts'

const ROUTE_PREFIX = '/api/triad/mcp-presets'
/** 预设组合文件名（与 dsh-agent-presets 的 COMPOSITION_FILE 一致）。 */
const COMPOSITION_FILE = 'agent.cordis.yml'
/** 用户自写预设根（与 dsh-agent-presets 的 USER_PRESET_DIR 一致）。 */
const USER_PRESET_DIR = '.agent-presets'
/** mcp-client 模块名（文件里 name 行精确匹配用）。 */
const MCP_CLIENT_NAME = `'@deepseek-ai/dsh-mcp-client'`
/** 备份文件名（固定名，覆盖式；保留最近一次切换前的版本）。 */
const BACKUP_SUFFIX = '.bak-last-mcp'
const MAX_BODY_BYTES = 256 * 1024

/** 运行时才存在的服务在类型上放宽。 */
type PluginContext = any

function dshHome(): string {
  const fromEnv = process.env['DSH_HOME']
  return fromEnv !== undefined && fromEnv.trim() !== '' ? fromEnv.trim() : join(homedir(), '.dsh')
}

/** 用户可写预设根。 */
export function userPresetRoot(): string {
  return join(dshHome(), USER_PRESET_DIR)
}

/** 某个预设的组合文件路径（用户根下；作为服务缺席时的回落）。 */
export function userCompositionPath(presetId: string): string {
  return join(userPresetRoot(), presetId, COMPOSITION_FILE)
}

/** 解析出的预设条目：组合文件绝对路径 + 信任来源。 */
export interface PresetEntry {
  id: string
  trust: string
  /** 组合文件绝对路径（随安装的默认预设 = 安装目录内的路径）。 */
  path: string
}

/**
 * 解析某预设的组合文件路径。
 * 优先 `agentPresets.list()`（host 侧 AgentPreset 带 path，覆盖默认预设与用户预设）；
 * 服务缺席或该预设没有路径时回落用户根文件。
 */
export async function presetEntryOf(ctx: PluginContext, presetId: string): Promise<PresetEntry | undefined> {
  const presets = ctx.get?.('agentPresets')
  if (presets?.list !== undefined) {
    try {
      const roster = await presets.list()
      for (const row of Array.isArray(roster) ? roster : []) {
        if (String((row as { id?: unknown })?.id ?? '') !== presetId) continue
        const path = (row as { path?: unknown }).path
        if (typeof path === 'string' && path !== '') {
          return { id: presetId, trust: String((row as { trust?: unknown }).trust ?? 'user'), path }
        }
      }
    } catch {
      // 服务读取失败：回落用户根。
    }
  }
  const fallback = userCompositionPath(presetId)
  if (existsSync(fallback)) return { id: presetId, trust: 'user', path: fallback }
  return undefined
}

/** preset id 形状（与 dsh-agent-presets 的目录名规则一致）。 */
function isPresetId(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(value)
}

/** serverName 形状（与 dsh-mcp-client 的校验一致）。 */
function isServerName(value: string): boolean {
  return /^[A-Za-z0-9_-]{1,32}$/.test(value)
}

/** 一条预设自带的 mcp-client 行（解析结果）。 */
export interface PresetMcpRow {
  /** 行 id（组合文件里的 entry id）。 */
  entryId: string
  serverName: string
  transport: string
  /** 摘要：stdio 显示 command，http 显示 url。 */
  summary: string
  /**
   * 该 server 的工具（由 mcp-status 富化）。预设自带的工具注册在预设作用域
   * 里，插件层（全局视图）看不到 —— 来自该预设的活动 agent，没有活动 agent
   * 时回退到工具名单缓存。
   */
  tools?: Array<{ name: string; description: string }>
  /**
   * 实际注册的工具数（由 mcp-status 富化，**不含**名单缓存）：
   * 面板据此判断该行是否已连上并注册完工具（自动等待的判据）。
   */
  registeredCount?: number
}

/**
 * 逐行扫描预设组合文本，解析所有 `@deepseek-ai/dsh-mcp-client` 行。
 * 与 mcp-status 的 patch 扫描同法：`- id:` 起块，块内缩进行找 name /
 * serverName / transport / command / url；块边界 = 下一个 0 缩进行。
 */
export function parseMcpRows(content: string): PresetMcpRow[] {
  const lines = content.split(/\r?\n/)
  const rows: PresetMcpRow[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trimStart()
    if (!trimmed.startsWith('- id:')) continue
    const idMatch = /^- id:\s*([A-Za-z0-9_-]+)/.exec(trimmed)
    if (idMatch === null) continue
    let nameLine = -1
    let serverName = ''
    let transport = ''
    let summary = ''
    for (let j = i + 1; j < lines.length; j += 1) {
      const line = lines[j]
      if (line.length === 0) continue
      if (!/^[ \t]/.test(line)) break
      const t = line.trimStart()
      if (nameLine === -1 && t.startsWith('name:') && line.includes(MCP_CLIENT_NAME)) nameLine = j
      if (nameLine === -1) continue
      if (serverName === '' && t.startsWith('serverName:')) {
        // 手工编辑的文件可能带引号：解析时容忍。
        const m = /^serverName:\s*["']?([A-Za-z0-9_-]{1,32})["']?\s*$/.exec(t)
        if (m !== null) serverName = m[1]!
      }
      if (transport === '' && t.startsWith('transport:')) {
        const m = /^transport:\s*["']?([a-z-]+)["']?\s*$/.exec(t)
        if (m !== null) transport = m[1]!
      }
      if (summary === '' && (t.startsWith('command:') || t.startsWith('url:'))) {
        summary = t.replace(/^(command|url):\s*/, '').replace(/^["']|["']$/g, '')
      }
    }
    if (nameLine === -1 || serverName === '') continue
    rows.push({ entryId: idMatch[1]!, serverName, transport: transport === '' ? 'stdio' : transport, summary })
  }
  return rows
}

/** 读取预设组合文本：优先 list() 给的绝对路径，再回落 readDocument / 用户根文件。 */
export async function compositionTextOf(ctx: PluginContext, presetId: string): Promise<{ content: string; trust: string } | undefined> {
  const entry = await presetEntryOf(ctx, presetId)
  if (entry !== undefined) {
    try {
      return { content: readFileSync(entry.path, 'utf8'), trust: entry.trust }
    } catch {
      // 路径不可读：继续尝试下方的服务读取。
    }
  }
  const presets = ctx.get?.('agentPresets')
  if (presets?.readDocument !== undefined) {
    try {
      const doc = await presets.readDocument(presetId)
      if (doc !== null && typeof doc === 'object' && typeof doc.content === 'string') {
        return { content: doc.content, trust: typeof doc.trust === 'string' ? doc.trust : 'user' }
      }
    } catch {
      // 服务缺失该预设 / 组合不可读：无可读来源。
    }
  }
  return undefined
}

/** 某预设自带的 mcp-client 行（含 trust，供面板提示存储位置）。 */
export async function listPresetServers(ctx: PluginContext, presetId: string): Promise<{ trust: string; rows: PresetMcpRow[] } | undefined> {
  const found = await compositionTextOf(ctx, presetId)
  if (found === undefined) return undefined
  return { trust: found.trust, rows: parseMcpRows(found.content) }
}

/** 全部预设的自带 MCP 行（键为 preset id；随安装的默认预设与用户预设同等对待）。 */
export async function collectPresetServers(ctx: PluginContext): Promise<Record<string, PresetMcpRow[]>> {
  const presets = ctx.get?.('agentPresets')
  const out: Record<string, PresetMcpRow[]> = {}
  if (presets?.list === undefined) return out
  let roster: unknown
  try {
    roster = await presets.list()
  } catch {
    return out
  }
  for (const row of Array.isArray(roster) ? roster : []) {
    const id = String((row as { id?: unknown })?.id ?? '')
    if (id === '') continue
    const found = await listPresetServers(ctx, id)
    if (found !== undefined) out[id] = found.rows
  }
  return out
}

/** 行在文本中的块范围：`- id:` 行到下一个 0 缩进行为止。 */
function rowBlock(lines: string[], idLine: number): { from: number; to: number } {
  let to = lines.length
  for (let j = idLine + 1; j < lines.length; j += 1) {
    if (lines[j].length === 0) continue
    if (!/^[ \t]/.test(lines[j])) { to = j; break }
  }
  return { from: idLine, to }
}

/** 默认行尾。 */
function lineEndingOf(content: string): string {
  return content.includes('\r\n') ? '\r\n' : '\n'
}

/** 删除一条 mcp-client 行（按 serverName 定位；只删块本身，上方注释保留）。 */
export function removeMcpRow(content: string, serverName: string): { content: string; removed: boolean } {
  const lines = content.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trimStart()
    if (!trimmed.startsWith('- id:')) continue
    const block = rowBlock(lines, i)
    const text = lines.slice(block.from, block.to).join('\n')
    if (!text.includes(MCP_CLIENT_NAME)) continue
    const match = /^\s*serverName:\s*["']?([A-Za-z0-9_-]{1,32})["']?\s*$/m.exec(text)
    if (match === null || match[1] !== serverName) continue
    // 连带该块后的一个空行一起删，避免留下连续空行。
    let to = block.to
    if (to < lines.length && lines[to].trim() === '') to += 1
    const next = lines.slice(0, block.from).concat(lines.slice(to)).join(lineEndingOf(content))
    return { content: next, removed: true }
  }
  return { content, removed: false }
}

/** 写文件：备份 + tmp/rename 原子写。 */
function writeComposition(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true })
  copyFileSync(path, `${path}${BACKUP_SUFFIX}`)
  const temp = `${path}.tmp`
  writeFileSync(temp, content, 'utf8')
  renameSync(temp, path)
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

/** 从请求体收敛一份 mcp-client 配置（旧的单条结构化入参，形状对齐 dsh-mcp-client）。 */
function configFromBody(body: Record<string, unknown>): { ok: true; value: McpServerConfig } | { ok: false; error: string } {
  const serverName = typeof body.serverName === 'string' ? body.serverName.trim() : ''
  if (!isServerName(serverName)) return { ok: false, error: 'serverName must match [A-Za-z0-9_-]{1,32}' }
  const transport = body.transport === 'streamable-http' ? 'streamable-http' : body.transport === 'stdio' ? 'stdio' : ''
  if (transport === '') return { ok: false, error: 'transport must be "stdio" or "streamable-http"' }
  if (transport === 'stdio') {
    const command = typeof body.command === 'string' ? body.command.trim() : ''
    if (command === '') return { ok: false, error: 'stdio requires a non-empty command' }
    const args = Array.isArray(body.args) ? body.args.filter((item): item is string => typeof item === 'string') : undefined
    const env = body.env !== null && typeof body.env === 'object' && !Array.isArray(body.env)
      ? Object.fromEntries(Object.entries(body.env as Record<string, unknown>).filter(([, v]) => typeof v === 'string') as Array<[string, string]>)
      : undefined
    const cwd = typeof body.cwd === 'string' ? body.cwd : undefined
    return { ok: true, value: { serverName, transport, command, args, env, cwd } }
  }
  const url = typeof body.url === 'string' ? body.url.trim() : ''
  if (url === '') return { ok: false, error: 'streamable-http requires a non-empty url' }
  const headers = body.headers !== null && typeof body.headers === 'object' && !Array.isArray(body.headers)
    ? Object.fromEntries(Object.entries(body.headers as Record<string, unknown>).filter(([, v]) => typeof v === 'string') as Array<[string, string]>)
    : undefined
  return { ok: true, value: { serverName, transport, url, headers } }
}



/** 处理一条 /api/triad/mcp-presets 请求。 */
async function handle(ctx: PluginContext, req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!loopbackAllowed(req)) {
    writeJsonResponse(res, 403, { error: 'loopback-only' })
    return
  }
  const url = new URL(req.url ?? '/', 'http://localhost')
  const rest = url.pathname.slice(ROUTE_PREFIX.length)
  const method = req.method ?? 'GET'
  try {
    const matchPost = /^\/([^/]+)\/servers$/.exec(rest)
    if (method === 'POST' && matchPost !== null) {
      const presetId = decodeURIComponent(matchPost[1]!)
      if (!isPresetId(presetId)) throw new Error(`invalid preset id ${JSON.stringify(presetId)}`)
      // 先读请求体再解析预设路径：请求形状错误立即返回，不必等文件/服务读取。
      const body = await readJsonBody(req)
      const entry = await presetEntryOf(ctx, presetId)
      if (entry === undefined) {
        writeJsonResponse(res, 404, { ok: false, error: 'preset-not-found', hint: `preset "${presetId}" 不在 agentPresets 名单里` })
        return
      }
      // 两种入参：粘贴文本 { format, text }（推荐，多条、重名跳过）
      // 或旧的单条结构化字段（单条、重名报错）。
      const bulk = typeof body.text === 'string'
      let outcome: { rows: McpRowConfig[]; errors: string[]; warnings: string[] }
      if (bulk) {
        const { format, text } = pasteFieldsOf(body)
        outcome = parseMcpPaste(format, text)
      } else {
        const legacy = configFromBody(body)
        if (!legacy.ok) throw new Error(legacy.error)
        outcome = { rows: serversToRows({ [legacy.value.serverName]: legacy.value }), errors: [], warnings: [] }
      }
      if (outcome.errors.length > 0) {
        writeJsonResponse(res, 400, { ok: false, errors: outcome.errors, warnings: outcome.warnings })
        return
      }
      if (outcome.rows.length === 0) {
        writeJsonResponse(res, 400, { ok: false, error: '未解析出任何 MCP server' })
        return
      }
      const content = readFileSync(entry.path, 'utf8')
      const existing = parseMcpRows(content)
      const takenServers = new Set(existing.map(row => row.serverName))
      const takenIds = new Set(existing.map(row => row.entryId))
      const added: string[] = []
      const skipped: string[] = []
      const fresh: McpRowConfig[] = []
      for (const row of outcome.rows) {
        const serverName = String(row.config.serverName ?? '')
        if (takenServers.has(serverName)) {
          if (!bulk) throw new Error(`serverName ${JSON.stringify(serverName)} already exists in preset "${presetId}"`)
          skipped.push(serverName)
          continue
        }
        let id = row.id
        let suffix = 2
        while (takenIds.has(id)) { id = `${row.id}-${suffix}`; suffix += 1 }
        takenIds.add(id)
        takenServers.add(serverName)
        added.push(serverName)
        fresh.push({ ...row, id })
      }
      if (fresh.length > 0) writeComposition(entry.path, appendRowsToText(content, rowsToPresetYaml(fresh)))
      writeJsonResponse(res, 200, { ok: true, preset: presetId, added, skipped, warnings: outcome.warnings })
      return
    }
    const matchDelete = /^\/([^/]+)\/servers\/([^/]+)$/.exec(rest)
    if (method === 'DELETE' && matchDelete !== null) {
      const presetId = decodeURIComponent(matchDelete[1]!)
      const serverName = decodeURIComponent(matchDelete[2]!)
      if (!isPresetId(presetId)) throw new Error(`invalid preset id ${JSON.stringify(presetId)}`)
      if (!isServerName(serverName)) throw new Error(`invalid serverName ${JSON.stringify(serverName)}`)
      const entry = await presetEntryOf(ctx, presetId)
      if (entry === undefined) {
        writeJsonResponse(res, 404, { ok: false, error: 'preset-not-found' })
        return
      }
      const content = readFileSync(entry.path, 'utf8')
      const result = removeMcpRow(content, serverName)
      if (!result.removed) throw new Error(`no mcp-client row for serverName ${JSON.stringify(serverName)} in preset "${presetId}"`)
      writeComposition(entry.path, result.content)
      writeJsonResponse(res, 200, { ok: true, preset: presetId, serverName })
      return
    }
    writeJsonResponse(res, 404, { error: `no route for ${method} ${rest}` })
  } catch (error) {
    writeJsonResponse(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
  }
}

/** 注册 /api/triad/mcp-presets/* 路由。 */
export function applyPresetServers(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: (req: IncomingMessage, res: ServerResponse) => {
      void handle(ctx as PluginContext, req, res)
    },
  }), 'triad: mcp-presets routes')
}
