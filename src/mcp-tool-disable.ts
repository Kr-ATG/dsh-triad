/**
 * mcp-tool-disable — MCP 单工具级启停（host 半身，两层账本 + 按「行」记账）。
 *
 * 语义：在「server 级启停」（cordis.patch.yml 的 disabled 标记）与「预设级遮蔽」
 * （mcp-preset-mask）之下，再给每个 MCP Server 的每一条工具一个开关。
 * 关掉的工具从**模型工具目录**里消失（模型看不到、PTC SDK 不再声明、直接调用
 * 被拒），而 server 连接、其它工具都不受影响。
 *
 * 三层条目，每条都绑定一条具体的「行」：
 *   - `disabled`              全局行（cordis.patch.yml 里那条 mcp-client）
 *   - `presets[p][s].inherit` 预设 p 里「继承的全局行」这一条（只对 p 生效）
 *   - `presets[p][s].own`     预设 p「自带的同名行」这一条（只对 p 生效）
 *
 * 生效口径（关键：同名也彻底独立）：某预设作用域里，某 serverName 的提供者
 * 只会是其中之一 —— 自带行存在时它覆盖全局行（DSH 的作用域遮蔽语义）。因此
 *   - 提供者是**自带行** → 只应用 `own` 条目（全局层与 `inherit` 条目都不参与，
 *     它们属于那条此刻不生效的全局行）；
 *   - 提供者是**全局行** → 应用 `disabled`（全局层，所有继承它的预设共用）∪ `inherit`；
 *   - 无预设的 agent 同「全局行」。
 * 于是「全局那台的工具开关」与「预设自带那台的工具开关」互不牵连：既不会一起
 * 变灰，撤掉某条行时另一条的设置也各自生效（`inherit` 是「本预设不要全局那份」
 * 的持久表达）。
 *
 * 两个缝（对照参考实现 dsh-mcp-skill-panel 的 system-prompt/assemble 过滤，
 * 并补上它在 PTC 模式下的缺口）：
 *   1. 装配过滤：`system-prompt/assemble` waterfall 里就地剔除
 *      `assembly.tools` 中命中的工具。监听器以 `{ global: true }` 注册 ——
 *      装配派发是按作用域过滤的（scopeTarget），只有 global 才能收到每个
 *      agent 的装配；`assembly.context.agent` 用来判定该次装配属于哪个预设。
 *   2. agent 作用域 restrict：由 mcp-preset-mask 的安装器把有效禁用名并进
 *      `tools.restrict({ deny })`。它作用于「继承的全局层」，因此
 *      `view(scope).visible` 直接少掉这些工具 —— native 目录与 **PTC 生成的
 *      SDK 文本**都随之收敛，执行也被拒。代价：`restrict` 拒绝作用域内
 *      （预设自带）的工具名，那部分只有缝 1 生效。
 *
 * 账本：`${DSH_HOME}/mcp/dsh-triad/tool-disable.json`
 *   `{ version: 3,
 *      disabled: { <server>: [<fullToolName>, …] },
 *      presets:  { <presetId>: { <server>: { own: […], inherit: […] } } },
 *      known:    { <server>: [<fullToolName>, …] } }`
 *   fullToolName = `mcp__<serverName>__<toolName>`（与注册表同构）。
 *   v1/v2 文件读入即归一化升级：v2 的预设层数组同时落到 own 与 inherit
 *   （保住当时「该预设下这些工具是关的」的可见状态，之后可各自调整）。
 *   `known` 只服务于面板展示：预设自带的工具注册在预设作用域里，没有活动
 *   agent 时枚举不到，靠这份缓存把工具名（尤其被禁用因而被隐藏的那些）
 *   继续列出来，用户才有得点。
 *
 * 路由：`PUT /api/triad/mcp-tools/:serverName` `{ enabled, tools?, preset?, source? }`
 *   - `preset` 省略 = 写全局行；给出 = 写该预设层；
 *   - `source`: 'own' | 'inherit'（预设层区分是哪条行；省略时按该预设是否
 *     自带同名 Server 推断）；
 *   - `tools` 省略 = 该 server 的全部工具（已注册集合 → 活动 agent 视图 →
 *     名单缓存，逐级回退）；给出 = 只改这些名字（不属于该 server 的忽略）。
 *
 * 内存索引是装配过滤的唯一数据源（同步读、零 IO），随写入刷新。
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import { loopbackAllowed, writeJsonResponse } from './mcp-recommended.ts'
import { listPresetServers } from './mcp-presets.ts'
import { maskedServersOf, readMaskLedger } from './mcp-mask-ledger.ts'


const ROUTE_PREFIX = '/api/triad/mcp-tools'
const LEDGER_FILE = 'tool-disable.json'
const MCP_PREFIX = 'mcp__'
/** 单个 serverName 的上限（与 mcp-client 的命名约束同量级）。 */
const MAX_SERVER_ENTRIES = 200
/** 单个条目的禁用名上限（防脏账本撑爆内存）。 */
const MAX_TOOLS_PER_SERVER = 500
/** 预设条目上限。 */
const MAX_PRESET_ENTRIES = 50
/** 工具全名长度上限。 */
const MAX_TOOL_NAME = 128
const MAX_BODY_BYTES = 64 * 1024
/** 账本变更通知（mcp-preset-mask 的安装器据此重挂 agent 作用域 deny）。 */
export const TOOL_DISABLE_CHANGE_EVENT = 'triad/mcp-tool-disable-change'

/** 运行时才存在的宿主面在类型上放宽（与 mcp-preset-mask 同惯例）。 */
type PluginContext = any

/** 一条「行」是哪一种：预设自带的同名行 / 继承来的全局行。 */
export type ToolOwner = 'own' | 'inherit'

/** 预设层里某 server 的两条行各自的禁用集合。 */
export interface ToolOwnerEntries {
  own: string[]
  inherit: string[]
}

/** 账本形状（v3：全局行 + 预设层（按行）+ 名单缓存）。 */
export interface ToolDisableLedger {
  version: 3
  disabled: Record<string, string[]>
  presets: Record<string, Record<string, ToolOwnerEntries>>
  known: Record<string, string[]>
}

function dshHome(): string {
  const fromEnv = process.env['DSH_HOME']
  return fromEnv !== undefined && fromEnv.trim() !== '' ? fromEnv.trim() : join(homedir(), '.dsh')
}

/** 工具级禁用账本路径。 */
export function toolDisableLedgerPath(): string {
  return join(dshHome(), 'mcp', 'dsh-triad', LEDGER_FILE)
}

function isServerName(value: string): boolean {
  return /^[A-Za-z0-9_-]{1,32}$/.test(value)
}

function isPresetId(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(value)
}

/** 该 server 的工具全名前缀。 */
function serverPrefix(serverName: string): string {
  return `${MCP_PREFIX}${serverName}__`
}

/** 一个工具全名是否属于该 server（严格前缀 + 至少一个字符的工具段）。 */
export function toolBelongsToServer(fullName: string, serverName: string): boolean {
  const prefix = serverPrefix(serverName)
  return fullName.startsWith(prefix) && fullName.length > prefix.length
}

/* ── serverName 解析（最长匹配，防 `my` / `my_server` 这类前缀连带）──────── */

/** 账本里出现过的全部 serverName（三层键的并集）。 */
function ledgerServerNames(ledger: ToolDisableLedger): Set<string> {
  const names = new Set<string>(Object.keys(ledger.disabled))
  for (const table of Object.values(ledger.presets)) for (const serverName of Object.keys(table)) names.add(serverName)
  for (const serverName of Object.keys(ledger.known)) names.add(serverName)
  return names
}

/** 进程内已知 serverName（账本 ∪ 注册表/预设行上报过的名字）。 */
const extraServerNames = new Set<string>()
let extraCandidates: string[] = []

/** 登记额外的 serverName（mcp-status 从配置条目/预设行拿到时上报）。 */
export function rememberServerNames(names: Iterable<string>): void {
  let grown = false
  for (const name of names) {
    if (!isServerName(name) || extraServerNames.has(name)) continue
    extraServerNames.add(name)
    grown = true
  }
  if (grown) extraCandidates = [...extraServerNames].sort((a, b) => b.length - a.length)
}

/**
 * 从工具全名解析 serverName：对候选名字做**最长前缀匹配**
 * （`mcp__my_server__x` 必须解析为 `my_server`，而不是 `my`）。
 * 候选 = 账本键 ∪ 已登记名字；都不命中时回退到第一个 `__` 切分。
 */
export function serverOfToolName(fullName: string, candidates?: Iterable<string>): string | undefined {
  if (!fullName.startsWith(MCP_PREFIX)) return undefined
  const pool = candidates === undefined
    ? [...extraCandidates, ...[...ledgerServerNames(readToolLedger())].sort((a, b) => b.length - a.length)]
    : [...candidates].sort((a, b) => b.length - a.length)
  for (const serverName of pool) {
    if (toolBelongsToServer(fullName, serverName)) return serverName
  }
  const rest = fullName.slice(MCP_PREFIX.length)
  const sep = rest.indexOf('__')
  if (sep <= 0) return undefined
  const serverName = rest.slice(0, sep)
  return isServerName(serverName) ? serverName : undefined
}

/* ── 归一化（含 v1/v2 升级）──────────────────────────────────────────── */

/** 归一化一张「server → 全名列表」表。 */
function normalizeList(serverName: string, names: unknown): string[] {
  if (!Array.isArray(names)) return []
  const list: string[] = []
  for (const name of names) {
    if (typeof name !== 'string' || name.length > MAX_TOOL_NAME) continue
    if (!toolBelongsToServer(name, serverName)) continue
    if (list.length >= MAX_TOOLS_PER_SERVER) break
    if (!list.includes(name)) list.push(name)
  }
  return list
}

function normalizeTable(input: unknown): Record<string, string[]> {
  const table: Record<string, string[]> = {}
  if (input === null || typeof input !== 'object') return table
  for (const [serverName, names] of Object.entries(input as Record<string, unknown>)) {
    if (!isServerName(serverName)) continue
    if (Object.keys(table).length >= MAX_SERVER_ENTRIES) break
    const list = normalizeList(serverName, names)
    if (list.length > 0) table[serverName] = list
  }
  return table
}

/** 归一化任意输入为合法账本（脏字段直接丢弃；v2 数组按 own+inherit 双写升级）。 */
export function normalizeToolLedger(input: unknown): ToolDisableLedger {
  const source = input !== null && typeof input === 'object' ? input as Record<string, unknown> : {}
  const presets: Record<string, Record<string, ToolOwnerEntries>> = {}
  const rawPresets = source.presets
  if (rawPresets !== null && typeof rawPresets === 'object') {
    for (const [presetId, table] of Object.entries(rawPresets as Record<string, unknown>)) {
      if (!isPresetId(presetId)) continue
      if (Object.keys(presets).length >= MAX_PRESET_ENTRIES) break
      if (table === null || typeof table !== 'object') continue
      const entries: Record<string, ToolOwnerEntries> = {}
      for (const [serverName, value] of Object.entries(table as Record<string, unknown>)) {
        if (!isServerName(serverName)) continue
        if (Array.isArray(value)) {
          // v2 升级：当时不区分「哪条行」，两边都写上以保住可见状态。
          const legacy = normalizeList(serverName, value)
          if (legacy.length > 0) entries[serverName] = { own: [...legacy], inherit: [...legacy] }
          continue
        }
        if (value === null || typeof value !== 'object') continue
        const own = normalizeList(serverName, (value as Record<string, unknown>).own)
        const inherit = normalizeList(serverName, (value as Record<string, unknown>).inherit)
        if (own.length > 0 || inherit.length > 0) entries[serverName] = { own, inherit }
      }
      if (Object.keys(entries).length > 0) presets[presetId] = entries
    }
  }
  return {
    version: 3,
    disabled: normalizeTable(source.disabled),
    presets,
    known: normalizeTable(source.known),
  }
}

/* ── 内存索引（装配过滤热路径）──────────────────────────────────────────── */

/** serverName → 全局行禁用全名集合。 */
let globalIndex = new Map<string, Set<string>>()
/** presetId → serverName → 两条行的禁用全名集合。 */
let presetIndex = new Map<string, Map<string, { own: Set<string>; inherit: Set<string> }>>()
/** serverName → 名单缓存。 */
let knownIndex = new Map<string, string[]>()
/** presetId → 该预设自带的 serverName（决定同名时由哪条行提供工具）。 */
const ownerCache = new Map<string, Set<string>>()

function reindex(ledger: ToolDisableLedger): void {
  globalIndex = new Map(Object.entries(ledger.disabled).map(([serverName, names]) => [serverName, new Set(names)]))
  presetIndex = new Map(Object.entries(ledger.presets).map(([presetId, table]) => [
    presetId,
    new Map(Object.entries(table).map(([serverName, entries]) => [
      serverName,
      { own: new Set(entries.own), inherit: new Set(entries.inherit) },
    ])),
  ]))
  knownIndex = new Map(Object.entries(ledger.known).map(([serverName, names]) => [serverName, [...names]]))
  rememberServerNames(Object.keys(ledger.known))
  rememberServerNames(Object.keys(ledger.disabled))
}

let ledgerCache: ToolDisableLedger | undefined

/** 读账本（缓存；`reload` 强制回读磁盘）。 */
export function readToolLedger(reload = false): ToolDisableLedger {
  if (ledgerCache !== undefined && !reload) return ledgerCache
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(toolDisableLedgerPath(), 'utf8')) as unknown
  } catch {
    parsed = undefined
  }
  ledgerCache = normalizeToolLedger(parsed)
  reindex(ledgerCache)
  return ledgerCache
}

/** 原子写账本 + 刷新内存索引。 */
export function writeToolLedger(next: ToolDisableLedger): void {
  const target = toolDisableLedgerPath()
  mkdirSync(dirname(target), { recursive: true })
  const temp = `${target}.tmp`
  writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  renameSync(temp, target)
  ledgerCache = next
  reindex(next)
}

/* ── 「哪条行在提供工具」的缓存 ─────────────────────────────────────────── */

/**
 * 登记某预设自带的 serverName 全集（决定同名时由自带行覆盖全局行）。
 * **覆盖语义**：调用方给的是该预设当前完整的自带列表，删掉的行必须随之消失，
 * 否则移除自带行后 owner 仍判成 own、那条 inherit 账目就永远不生效。
 * 由 mcp-preset-mask 的安装器（agent/created 时）、mcp-status（读预设组合时）
 * 与工具级路由（写预设层前）上报 —— 装配过滤在热路径上只读缓存，不做文件 IO。
 */
export function rememberPresetOwnServers(presetId: string, serverNames: Iterable<string>): void {
  if (!isPresetId(presetId)) return
  const next = new Set<string>()
  for (const name of serverNames) if (isServerName(name)) next.add(name)
  const current = ownerCache.get(presetId)
  if (current !== undefined && current.size === next.size && [...next].every(name => current.has(name))) return
  if (next.size === 0) ownerCache.delete(presetId)
  else ownerCache.set(presetId, next)
}

/**
 * 重新读一遍所有预设的自带 serverName（预设组合文件变动后调用）。
 * 预设自带行的增删都走这条刷新，保证 owner 判定与磁盘一致。
 */
export async function refreshPresetOwnServers(ctx: PluginContext): Promise<void> {
  const presets = ctx.get?.('agentPresets')
  if (typeof presets?.list !== 'function') return
  let roster: unknown
  try {
    roster = await presets.list()
  } catch {
    return
  }
  for (const row of Array.isArray(roster) ? roster : []) {
    const presetId = String((row as { id?: unknown })?.id ?? '')
    if (presetId === '') continue
    const found = await listPresetServers(ctx, presetId).catch(() => undefined)
    rememberPresetOwnServers(presetId, (found?.rows ?? []).map(item => item.serverName))
  }
}

/** 该预设是否自带某 serverName（无缓存记录时按「不带」处理）。 */
export function presetOwnsServer(presetId: string, serverName: string): boolean {
  return ownerCache.get(presetId)?.has(serverName) === true
}

/** 某预设作用域里该 server 的提供者：自带行存在则它覆盖全局行。 */
export function ownerOfServer(presetId: string | undefined, serverName: string): ToolOwner {
  return presetId !== undefined && presetOwnsServer(presetId, serverName) ? 'own' : 'inherit'
}

/* ── 查询 ──────────────────────────────────────────────────────────────── */

/** 全局行的禁用名（「全部 Agent」范围展示用）。 */
export function globalDisabledTools(serverName: string): string[] {
  return [...(globalIndex.get(serverName) ?? [])]
}

/** 预设层某条行的禁用名。 */
export function ownerDisabledTools(presetId: string, serverName: string, owner: ToolOwner): string[] {
  return [...(presetIndex.get(presetId)?.get(serverName)?.[owner] ?? [])]
}

/**
 * 面板展示用的「该预设这一条行」的有效禁用集合：
 *   inherit 行 → 全局层 ∪ inherit 条目；own 行 → 仅 own 条目。
 */
export function effectiveToolsFor(presetId: string | undefined, serverName: string, owner: ToolOwner): string[] {
  const entries = presetId === undefined ? undefined : presetIndex.get(presetId)?.get(serverName)
  const ownSide = entries?.[owner] ?? new Set<string>()
  if (owner === 'own') return [...ownSide]
  return [...new Set([...(globalIndex.get(serverName) ?? []), ...ownSide])]
}

/** 两层账本镜像（面板按范围/行取状态用）。 */
export function toolDisableTables(): { disabled: Record<string, string[]>; presets: Record<string, Record<string, ToolOwnerEntries>> } {
  const ledger = readToolLedger()
  return { disabled: ledger.disabled, presets: ledger.presets }
}

/** 账本键 ∪ 已登记名字：工具全名解析的最长匹配候选集。 */
export function ledgerServerNamesOf(): string[] {
  return [...new Set([...ledgerServerNames(readToolLedger()), ...extraServerNames])]
}

/** 名单缓存：该 server 见过的工具全名。 */
export function knownToolsOf(serverName: string): string[] {
  return [...(knownIndex.get(serverName) ?? [])]
}

/**
 * 工具全名在某预设作用域里是否被禁用（装配过滤热路径：纯内存，零 IO）。
 * 同名隔离的核心：由哪条行提供，就只应用那条行的条目。
 */
export function isToolDisabled(fullName: string, presetId?: string): boolean {
  if (globalIndex.size === 0 && presetIndex.size === 0) return false
  const serverName = serverOfToolName(fullName)
  if (serverName === undefined) return false
  if (presetId === undefined) return globalIndex.get(serverName)?.has(fullName) === true
  const owner = ownerOfServer(presetId, serverName)
  if (owner === 'inherit' && globalIndex.get(serverName)?.has(fullName) === true) return true
  return presetIndex.get(presetId)?.get(serverName)?.[owner]?.has(fullName) === true
}

/**
 * 计算可交给 `tools.restrict({ deny })` 的禁用名：只保留该 agent 全局视图里
 * 真实存在（restrictable）且不属于其预设自带 server 的名字 —— restrict 对
 * 未知名与作用域内名字都会抛错。
 */
export function restrictableToolDeny(
  globalNames: Iterable<string>,
  ownServers: ReadonlySet<string>,
  presetId?: string,
): string[] {
  if (globalIndex.size === 0 && (presetId === undefined || presetIndex.size === 0)) return []
  const deny: string[] = []
  for (const name of globalNames) {
    const serverName = serverOfToolName(name)
    if (serverName === undefined || ownServers.has(serverName)) continue
    // 自带行才提供该名字时，全局行的条目不该误伤它（同函已排除 own server，
    // 这里再按 owner 判定一次，保证语义一致）。
    if (presetId !== undefined && ownerOfServer(presetId, serverName) === 'own') continue
    if (isToolDisabled(name, presetId)) deny.push(name)
  }
  return deny
}

/* ── 写入 ──────────────────────────────────────────────────────────────── */

/**
 * 写入一批开关（纯函数）。
 * `target.preset` 省略 = 全局行；给出 = 该预设层，`target.owner` 指定哪条行。
 * `enabled=true` 放开（同时清掉脏名字），`false` 禁用。
 */
export function setToolsDisabled(
  ledger: ToolDisableLedger,
  target: { serverName: string; preset?: string; owner?: ToolOwner },
  fullNames: readonly string[],
  enabled: boolean,
): { ledger: ToolDisableLedger; changed: number } {
  const { serverName } = target
  if (!isServerName(serverName)) return { ledger, changed: 0 }
  if (target.preset !== undefined && !isPresetId(target.preset)) return { ledger, changed: 0 }
  const owner: ToolOwner = target.owner ?? 'inherit'
  const current = new Set(
    target.preset === undefined
      ? ledger.disabled[serverName] ?? []
      : ledger.presets[target.preset]?.[serverName]?.[owner] ?? [],
  )
  let changed = 0
  for (const name of fullNames) {
    if (!toolBelongsToServer(name, serverName)) continue
    if (enabled) {
      if (current.delete(name)) changed += 1
    } else if (!current.has(name)) {
      current.add(name)
      changed += 1
    }
  }
  if (changed === 0) return { ledger, changed }
  const next = [...current]
  if (target.preset === undefined) {
    const disabled = { ...ledger.disabled }
    if (next.length === 0) delete disabled[serverName]
    else disabled[serverName] = next
    return { ledger: { ...ledger, disabled }, changed }
  }
  const presetId = target.preset
  const table = { ...(ledger.presets[presetId] ?? {}) }
  const entries: ToolOwnerEntries = { own: [], inherit: [], ...(table[serverName] ?? {}) }
  entries[owner] = next
  if (entries.own.length === 0 && entries.inherit.length === 0) delete table[serverName]
  else table[serverName] = entries
  const presets = { ...ledger.presets }
  if (Object.keys(table).length === 0) delete presets[presetId]
  else presets[presetId] = table
  return { ledger: { ...ledger, presets }, changed }
}

/**
 * 把见到的工具名记进缓存（只增不减；有变化才写盘）。
 * 面板展示用：预设自带的工具在无活动 agent 时也能列出，被禁用隐藏的也能点回来。
 */
export function rememberKnownTools(entries: Record<string, readonly string[]>): boolean {
  const ledger = readToolLedger()
  const known = { ...ledger.known }
  let changed = false
  for (const [serverName, names] of Object.entries(entries)) {
    if (!isServerName(serverName)) continue
    const current = new Set(known[serverName] ?? [])
    const before = current.size
    for (const name of names) {
      if (typeof name !== 'string' || name.length > MAX_TOOL_NAME) continue
      if (toolBelongsToServer(name, serverName)) current.add(name)
    }
    if (current.size !== before) {
      known[serverName] = [...current].slice(0, MAX_TOOLS_PER_SERVER)
      changed = true
    }
  }
  if (changed) writeToolLedger({ ...ledger, known })
  return changed
}

/* ── 装配过滤 ──────────────────────────────────────────────────────────── */

interface PromptAssemblyLike {
  tools?: Array<{ name?: unknown }>
}

interface AssembleContextLike {
  agent?: { ctx?: unknown }
}

/** 该次装配属于哪个预设（取不到就按「无预设」= 只应用全局行）。 */
function presetOfAssembly(ctx: PluginContext, context: unknown): string | undefined {
  const agent = (context as AssembleContextLike | undefined)?.agent
  if (agent === undefined || agent === null) return undefined
  const presets = ctx.get?.('agentPresets')
  if (typeof presets?.composedPreset !== 'function') return undefined
  try {
    const presetId = presets.composedPreset(agent.ctx)
    return typeof presetId === 'string' && presetId !== '' ? presetId : undefined
  } catch {
    return undefined
  }
}

/**
 * 常开装配过滤：把「工具级禁用」与「预设遮蔽」命中的工具从模型目录剔除。
 *
 * 装配 waterfall 是按作用域派发的，`{ global: true }` 才能收到每个 agent 的装配。
 * 遮蔽在这里兜一道，是因为 agent 作用域的 `tools.restrict()` 一旦安装失败
 * （或安装时机与工具注册错位），账本看着是「已遮蔽」但工具照旧可见 ——
 * 装配过滤读同一份账本，native 目录这一层就稳了。
 */
function installAssembleFilter(ctx: PluginContext): void {
  ctx.effect(() => ctx.on(
    'system-prompt/assemble',
    (
      assembly: PromptAssemblyLike,
      context: unknown,
      next: () => Promise<unknown>,
    ): Promise<unknown> => {
      // 快通道：没有任何禁用项/遮蔽项时零开销放行（连预设判定都不做）。
      const maskLedger = readMaskLedger()
      const hasMasks = Object.keys(maskLedger.presets).length > 0
      if ((globalIndex.size > 0 || presetIndex.size > 0 || hasMasks) && Array.isArray(assembly?.tools)) {
        const presetId = presetOfAssembly(ctx, context)
        const masked = presetId === undefined ? undefined : maskedServersOf(maskLedger, presetId)
        for (let index = assembly.tools.length - 1; index >= 0; index -= 1) {
          const name = assembly.tools[index]?.name
          if (typeof name !== 'string') continue
          const serverName = serverOfToolName(name)
          // 遮蔽：该预设下这个 server 被关掉，且不是「自带同名行」在提供工具。
          if (presetId !== undefined && masked !== undefined && masked.size > 0 && serverName !== undefined
            && masked.has(serverName) && !presetOwnsServer(presetId, serverName)) {
            assembly.tools.splice(index, 1)
            continue
          }
          if (isToolDisabled(name, presetId)) assembly.tools.splice(index, 1)
        }
      }
      return next()
    },
    { global: true },
  ), 'triad: mcp tool disable filter')
}

/* ── 路由 ──────────────────────────────────────────────────────────────── */

/** 该 server 当前已注册的工具全名（全局视图）。 */
function registeredToolsOf(ctx: PluginContext, serverName: string): string[] {
  const schemas: unknown = ctx.tools?.schemas?.() ?? []
  if (!Array.isArray(schemas)) return []
  return schemas
    .map((schema: any) => (typeof schema?.name === 'string' ? schema.name : ''))
    .filter((name: string) => name !== '' && toolBelongsToServer(name, serverName))
}

/** 该预设的活动 agent 作用域里可见的该 server 工具（预设自带工具只能这样枚举）。 */
function scopedToolsOf(ctx: PluginContext, presetId: string, serverName: string): string[] {
  const agents = ctx.get?.('agents')
  const list: unknown = typeof agents?.list === 'function' ? agents.list() : []
  const presets = ctx.get?.('agentPresets')
  const names = new Set<string>()
  for (const agent of Array.isArray(list) ? list : []) {
    if (agent === null || typeof agent !== 'object') continue
    let agentPreset: unknown
    try {
      agentPreset = presets?.composedPreset?.((agent as { ctx?: unknown }).ctx)
    } catch {
      agentPreset = undefined
    }
    if (agentPreset !== presetId) continue
    const schemas: unknown = (agent as { ctx?: { get?: (name: string) => any } }).ctx?.get?.('tools')?.schemas?.() ?? []
    for (const schema of Array.isArray(schemas) ? schemas : []) {
      const name = typeof (schema as { name?: unknown })?.name === 'string' ? (schema as { name: string }).name : ''
      if (name !== '' && toolBelongsToServer(name, serverName)) names.add(name)
    }
  }
  return [...names]
}

/** 处理一条 PUT /api/triad/mcp-tools/<serverName>。 */
async function handle(ctx: PluginContext, req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!loopbackAllowed(req)) {
    writeJsonResponse(res, 403, { error: 'loopback-only' })
    return
  }
  const method = req.method ?? 'GET'
  const url = new URL(req.url ?? '/', 'http://localhost')
  const rest = url.pathname.slice(ROUTE_PREFIX.length)
  try {
    const match = /^\/([^/]+)$/.exec(rest)
    if (method !== 'PUT' || match === null) {
      writeJsonResponse(res, 404, { error: `no route for ${method} ${rest}` })
      return
    }
    const serverName = decodeURIComponent(match[1]!)
    if (!isServerName(serverName)) throw new Error(`invalid serverName ${JSON.stringify(serverName)}`)
    const body = await readJsonBody(req)
    const enabled = body.enabled
    if (typeof enabled !== 'boolean') throw new Error('enabled must be a boolean')
    const rawPreset = body.preset
    let presetId: string | undefined
    if (rawPreset !== undefined && rawPreset !== null && rawPreset !== '') {
      if (typeof rawPreset !== 'string' || !isPresetId(rawPreset)) {
        throw new Error(`invalid preset ${JSON.stringify(rawPreset)}`)
      }
      presetId = rawPreset
    }
    const rawSource = body.source
    let owner: ToolOwner = 'inherit'
    if (rawSource !== undefined && rawSource !== null && rawSource !== '') {
      if (rawSource !== 'own' && rawSource !== 'inherit') {
        throw new Error(`invalid source ${JSON.stringify(rawSource)} (expected "own" or "inherit")`)
      }
      owner = rawSource
    } else if (presetId !== undefined) {
      // 省略 source：按该预设是否自带同名 Server 推断（自带 → own）。
      owner = ownerOfServer(presetId, serverName)
    }

    const explicit = body.tools
    let targets: string[]
    if (explicit !== undefined) {
      if (!Array.isArray(explicit)) throw new Error('tools must be an array of tool names')
      targets = explicit.filter((name): name is string => typeof name === 'string'
        && toolBelongsToServer(name, serverName) && name.length <= MAX_TOOL_NAME)
      if (targets.length === 0) throw new Error(`tools must name at least one "${serverPrefix(serverName)}*" tool`)
    } else {
      // 省略 tools = 该 server 的全部工具：全局视图 → 预设作用域 → 名单缓存。
      targets = registeredToolsOf(ctx, serverName)
      if (targets.length === 0 && presetId !== undefined) targets = scopedToolsOf(ctx, presetId, serverName)
      if (targets.length === 0) targets = knownToolsOf(serverName)
      if (targets.length === 0) {
        throw new Error(`no known tools for server "${serverName}"; pass tools explicitly to clear a stale ledger entry`)
      }
    }

    // 写之前刷新「各预设自带哪些 server」的缓存：面板可能先于首个装配调用，
    // 且预设组合刚被增删过（自带行增删会改变同名归属）。
    await refreshPresetOwnServers(ctx)

    // 全局一票否决：全局层已停用的工具，预设层不能把它打开（先在那层放开）。
    // 显式拒绝而不是静默空操作 —— 否则调用方以为改成功了，偏好却原地不动。
    if (presetId !== undefined && enabled && owner === 'inherit') {
      const vetoed = targets.filter(name => globalIndex.get(serverName)?.has(name) === true)
      if (vetoed.length > 0) {
        writeJsonResponse(res, 409, {
          ok: false,
          error: `tool disabled in the "全部 Agent" scope: ${vetoed.join(', ')} — enable it there first`,
          serverName,
          preset: presetId,
          source: owner,
          globalDisabled: globalDisabledTools(serverName),
        })
        return
      }
    }

    const { ledger, changed } = setToolsDisabled(readToolLedger(), { serverName, preset: presetId, owner }, targets, enabled)
    if (changed > 0) writeToolLedger(ledger)
    // 名单缓存：无论开关方向都记住这些名字（被禁用的也要能再点回来）。
    rememberKnownTools({ [serverName]: targets })
    if (changed > 0) ctx.emit?.(TOOL_DISABLE_CHANGE_EVENT, presetId)
    writeJsonResponse(res, 200, {
      ok: true,
      serverName,
      preset: presetId ?? null,
      source: presetId === undefined ? 'global' : owner,
      enabled,
      changed,
      tools: targets,
      globalDisabled: globalDisabledTools(serverName),
      ownerDisabled: presetId === undefined ? [] : ownerDisabledTools(presetId, serverName, owner),
    })
  } catch (error) {
    writeJsonResponse(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
  }
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

/** 注册装配过滤 + `PUT /api/triad/mcp-tools/:serverName`。 */
export function applyMcpToolDisable(ctx: Context): void {
  readToolLedger(true)
  installAssembleFilter(ctx as PluginContext)
  ctx.effect(() => (ctx as PluginContext).webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: (req: IncomingMessage, res: ServerResponse) => { void handle(ctx as PluginContext, req, res) },
  }), 'triad: mcp-tools routes')
}
