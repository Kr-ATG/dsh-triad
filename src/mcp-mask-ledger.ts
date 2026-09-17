/**
 * mcp-mask-ledger — 预设级遮蔽账本（纯数据，无宿主依赖）。
 *
 * 从 mcp-preset-mask 抽出来单独成模块：遮蔽的**运行期执行**在
 * mcp-preset-mask（agent 作用域三层补丁）与 mcp-tool-disable（装配过滤，
 * 兜底与 native 目录）两处，两边都要读这份账本，抽出来避免循环依赖。
 *
 * 形状：`{ version: 1, presets: { <presetId>: { <serverName>: false } } }`
 * 只有显式 `false` 表示遮蔽；true/缺省 = 继承全局。
 * 落盘：`${DSH_HOME}/mcp/dsh-triad/preset-masks.json`（原子写）。
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const MASK_FILE = 'preset-masks.json'
const MAX_PRESET_ENTRIES = 50

/** 账本形状：只有显式 false 才在该预设下遮蔽。 */
export interface MaskLedger {
  version: 1
  presets: Record<string, Record<string, boolean>>
}

function dshHome(): string {
  const fromEnv = process.env['DSH_HOME']
  return fromEnv !== undefined && fromEnv.trim() !== '' ? fromEnv.trim() : join(homedir(), '.dsh')
}

/** 遮蔽账本路径。 */
export function maskLedgerPath(): string {
  return join(dshHome(), 'mcp', 'dsh-triad', MASK_FILE)
}

/** preset id 形状（与 dsh-agent-presets 的目录名规则一致）。 */
export function isPresetId(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(value)
}

/** serverName 形状（与 dsh-mcp-client 的校验一致）。 */
export function isServerName(value: string): boolean {
  return /^[A-Za-z0-9_-]{1,32}$/.test(value)
}

/** 工具全名是否属于该 server（严格前缀 + 至少一个字符的工具段）。 */
function toolBelongsToServer(fullName: string, serverName: string): boolean {
  const prefix = `mcp__${serverName}__`
  return fullName.startsWith(prefix) && fullName.length > prefix.length
}

/** 归一化任意输入为合法账本（脏字段直接丢弃）。 */
export function normalizeMaskLedger(input: unknown): MaskLedger {
  const presets: Record<string, Record<string, boolean>> = {}
  const raw = (input !== null && typeof input === 'object'
    ? (input as Record<string, unknown>).presets
    : undefined)
  if (raw !== null && typeof raw === 'object') {
    for (const [presetId, table] of Object.entries(raw as Record<string, unknown>)) {
      if (!isPresetId(presetId)) continue
      if (table === null || typeof table !== 'object') continue
      if (Object.keys(presets).length >= MAX_PRESET_ENTRIES) break
      const entries: Record<string, boolean> = {}
      for (const [serverName, state] of Object.entries(table as Record<string, unknown>)) {
        if (!isServerName(serverName) || typeof state !== 'boolean') continue
        entries[serverName] = state
      }
      presets[presetId] = entries
    }
  }
  return { version: 1, presets }
}

/** 该预设下被显式遮蔽的 serverName 集合（空集 = 完全继承全局）。 */
export function maskedServersOf(ledger: MaskLedger, presetId: string): Set<string> {
  const table = ledger.presets[presetId]
  const masked = new Set<string>()
  if (table === undefined) return masked
  for (const [serverName, state] of Object.entries(table)) {
    if (state === false) masked.add(serverName)
  }
  return masked
}

/** 写入一批「预设 → server → 开关」；enabled=true 时删除覆盖（回落继承）。 */
export function setMask(
  ledger: MaskLedger,
  presetId: string,
  serverNames: readonly string[],
  enabled: boolean,
): { ledger: MaskLedger; changed: number } {
  const table = { ...(ledger.presets[presetId] ?? {}) }
  let changed = 0
  for (const serverName of serverNames) {
    if (!isServerName(serverName)) continue
    if (enabled) {
      if (table[serverName] !== undefined) { delete table[serverName]; changed += 1 }
    } else if (table[serverName] !== false) {
      table[serverName] = false
      changed += 1
    }
  }
  if (changed === 0) return { ledger, changed }
  const presets = { ...ledger.presets }
  if (Object.keys(table).length === 0) delete presets[presetId]
  else presets[presetId] = table
  return { ledger: { version: 1, presets }, changed }
}

/**
 * 计算某 agent 需要 deny 的全局工具名：属于被遮蔽 server 的
 * `mcp__<server>__*`，排除该预设自带的 serverName 前缀（自带注册遮蔽全局，
 * 遮蔽它只会误伤自带的那份）。
 *
 * serverName 用**候选集最长匹配**解析（候选 = 被遮蔽的 ∪ 自带的），
 * 避免 `my` / `my_server` 这类前缀把工具算到别人头上。
 */
export function computeDenyNames(
  globalNames: readonly string[],
  maskedServers: ReadonlySet<string>,
  ownServers: ReadonlySet<string>,
): string[] {
  const candidates = [...new Set([...maskedServers, ...ownServers])].sort((a, b) => b.length - a.length)
  const deny: string[] = []
  for (const name of globalNames) {
    if (!name.startsWith('mcp__')) continue
    const serverName = candidates.find(candidate => toolBelongsToServer(name, candidate))
    if (serverName === undefined) continue
    if (!maskedServers.has(serverName) || ownServers.has(serverName)) continue
    deny.push(name)
  }
  return deny
}

/** 进程内账本缓存（首次读盘；文件缺失/损坏视为空账本）。 */
let ledgerCache: MaskLedger | undefined

/** 读账本（缓存；`reload` 强制回读磁盘）。 */
export function readMaskLedger(reload = false): MaskLedger {
  if (ledgerCache !== undefined && !reload) return ledgerCache
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(maskLedgerPath(), 'utf8')) as unknown
  } catch {
    parsed = undefined
  }
  ledgerCache = normalizeMaskLedger(parsed)
  return ledgerCache
}

/** 原子写账本 + 刷新内存副本。 */
export function writeMaskLedger(next: MaskLedger): void {
  const target = maskLedgerPath()
  mkdirSync(dirname(target), { recursive: true })
  const temp = `${target}.tmp`
  writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  renameSync(temp, target)
  ledgerCache = next
}
