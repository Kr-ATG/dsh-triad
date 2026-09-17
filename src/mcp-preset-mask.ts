/**
 * mcp-preset-mask — 预设级遮蔽全局 MCP Server（L2b，host 半身）。
 *
 * 语义：某预设「关掉」一个全局 MCP Server = 对该预设（及其子代理）隐藏它的
 * 工具、服务器指令与资源读取；**全局连接照常运行**（要「不连接」应改用
 * 预设自带 Server，见 mcp-presets.ts）。与技能面板的预设层是同一套设计。
 *
 * 三处同名遮蔽，全部踩在 0.1.6 的作用域语义上（零官方源码改动）：
 *   1. 工具：agent 作用域 `ctx.tools.restrict({ deny })`（同名继承名被过滤；
 *      作用域自身注册豁免）；
 *   2. 服务器指令：agent 作用域注册同名空 section（`mcp:<server>`），
 *      按「scoped section shadows a global section with the same name」遮蔽；
 *   3. 资源：agent 作用域注册同名 stub provider，读取直接报「已对本预设禁用」。
 *
 * 安装时机：`agent/created` 时给每个 agent 装一组补丁；账本写入后对相关
 * preset 的活动 agent 重挂；`tools/change`（服务器晚连/重连/re-sync）去抖重挂，
 * 保证晚到的工具名同样被遮住、过期的 deny 名被替换。
 *
 * 同一安装器还承载**工具级禁用**（mcp-tool-disable 账本）的 deny：两者都
 * 要在 agent 作用域下调 `restrict`，合并成一次调用即可（restrict 的限制
 * 本身是求交的）。工具级账本变更时通过 `triad/mcp-tool-disable-change`
 * 事件触发全体重挂 —— 工具级禁用是全局语义，不分预设。
 *
 * 账本：`${DSH_HOME}/mcp/dsh-triad/preset-masks.json`
 *   `{ version: 1, presets: { <presetId>: { <serverName>: false } } }`
 * 只有显式 false 表示遮蔽；true/缺省 = 继承全局。
 *
 * 路由：`PUT /api/triad/mcp-masks/:preset/:serverName` `{ enabled }`
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import { loopbackAllowed, writeJsonResponse } from './mcp-recommended.ts'
import { listPresetServers } from './mcp-presets.ts'
import {
  computeDenyNames,
  isPresetId,
  isServerName,
  maskedServersOf,
  readMaskLedger,
  setMask,
  writeMaskLedger,
} from './mcp-mask-ledger.ts'
import {
  TOOL_DISABLE_CHANGE_EVENT,
  readToolLedger,
  rememberPresetOwnServers,
  restrictableToolDeny,
} from './mcp-tool-disable.ts'

const ROUTE_PREFIX = '/api/triad/mcp-masks'
const MAX_BODY_BYTES = 64 * 1024
/** 全局工具集变化后的重挂去抖窗口。 */
const REINSTALL_DEBOUNCE_MS = 300

/** 运行时才存在的服务在类型上放宽。 */
type PluginContext = any

/** ── 补丁安装诊断（面板据此判断遮蔽是否真的在运行期生效）────────────────── */

/**
 * 每个 agent 最近一次安装结果：deny 条数（0 = 没有可拒的工具）与失败原因。
 * 面板读它来解释「账本已写但工具还在」这类情况（以前失败只打日志，静默）。
 */
const agentOutcome = new Map<string, { presetId: string; deny: number; sections: number; error: string | null }>()

/** 某预设的安装汇总：几个活动 agent、其中几个真的挂了 deny、有哪几条错误。 */
export function maskInstallReportOf(presetId: string): { agents: number; deniedAgents: number; denyTotal: number; errors: string[] } {
  const errors = new Set<string>()
  let agents = 0
  let deniedAgents = 0
  let denyTotal = 0
  for (const outcome of agentOutcome.values()) {
    if (outcome.presetId !== presetId) continue
    agents += 1
    denyTotal += outcome.deny
    if (outcome.deny > 0) deniedAgents += 1
    if (outcome.error !== null) errors.add(outcome.error)
  }
  return { agents, deniedAgents, denyTotal, errors: [...errors] }
}

/** 全部预设的安装汇总（mcp-status 镜像给面板）。 */
export function maskInstallReport(): Record<string, { agents: number; deniedAgents: number; denyTotal: number; errors: string[] }> {
  const presets = new Set([...agentOutcome.values()].map(outcome => outcome.presetId))
  const out: Record<string, { agents: number; deniedAgents: number; denyTotal: number; errors: string[] }> = {}
  for (const presetId of presets) out[presetId] = maskInstallReportOf(presetId)
  return out
}

/** ── 补丁安装器 ─────────────────────────────────────────────────────────── */

interface AgentLike {
  id: string
  ctx: PluginContext
}

interface InstallerState {
  /** 每个 agent 已装的 disposer（agent 销毁或重挂时全部释放）。 */
  patches: Map<AgentLike, Array<() => void>>
  /** 每个 agent 的安装代次：异步读取被更新的安装取代时，旧安装放弃提交。 */
  versions: Map<AgentLike, number>
  /** 全局工具集变化的重挂去抖计时器。 */
  timer: ReturnType<typeof setTimeout> | undefined
  /** 是否已 dispose（apply 的清理）。 */
  stopped: boolean
}

/** 预设 id（服务或组合缺失时返回 undefined）。 */
function presetOf(ctx: PluginContext, agent: AgentLike): string | undefined {
  const presets = ctx.get?.('agentPresets')
  if (presets?.composedPreset === undefined) return undefined
  try {
    const id = presets.composedPreset(agent.ctx)
    return typeof id === 'string' && id !== '' ? id : undefined
  } catch {
    return undefined
  }
}

/** 释放一个 agent 的全部补丁。 */
function releasePatches(state: InstallerState, agent: AgentLike): void {
  const patches = state.patches.get(agent)
  if (patches === undefined) return
  state.patches.delete(agent)
  for (const dispose of patches) {
    try { dispose() } catch { /* 单个补丁失败不影响其它 */ }
  }
}

/** 该预设自带的 serverName 集合（自带与全局同名时，遮蔽让位于自带覆盖）。 */
async function ownServerNames(ctx: PluginContext, presetId: string): Promise<Set<string>> {
  const lib = await listPresetServers(ctx, presetId)
  return new Set((lib?.rows ?? []).map(row => row.serverName))
}

/**
 * 给一个 agent 重装遮蔽补丁：先释放旧补丁，再按当前账本与全局工具视图计算
 * deny 并注册三处同名遮蔽。异步（预设组合读取）；以代次防乱序提交。
 */
async function installAgent(ctx: PluginContext, state: InstallerState, agent: AgentLike): Promise<void> {
  const version = (state.versions.get(agent) ?? 0) + 1
  state.versions.set(agent, version)
  releasePatches(state, agent)
  if (state.stopped) return
  const presetId = presetOf(ctx, agent)
  if (presetId === undefined) return
  const masked = maskedServersOf(readMaskLedger(), presetId)
  // 工具级禁用是两层账本（全局层对所有预设生效，预设层只对本预设生效）：
  // 即使该预设没有遮蔽任何 server，也要为它挂上有效禁用名的 deny
  // （PTC 等非 native 模式靠这条才彻底）。
  const toolLedger = readToolLedger()
  const toolEntries = Object.keys(toolLedger.disabled).length + Object.keys(toolLedger.presets).length
  if (masked.size === 0 && toolEntries === 0) return
  const own = await ownServerNames(ctx, presetId)
  // 告诉工具级禁用模块「该预设自带哪些 server」：同名时由自带行提供工具，
  // 装配过滤据此只应用那条行的条目（同名彻底独立）。
  rememberPresetOwnServers(presetId, own)
  if (state.stopped || state.versions.get(agent) !== version) return

  const tools = agent.ctx.get?.('tools')
  const schemas: unknown = tools?.schemas?.() ?? []
  const globalNames = (Array.isArray(schemas) ? schemas : [])
    .map((schema: any) => (typeof schema?.name === 'string' ? schema.name : ''))
    .filter((name: string) => name !== '')
  const deny = [...new Set([
    ...computeDenyNames(globalNames, masked, own),
    // 有效禁用 = 全局层 ∪ 本预设层；预设自带（scope-local）的名字由
    // restrictableToolDeny 自行排除（restrict 会拒绝作用域内名字）。
    ...restrictableToolDeny(globalNames, own, presetId),
  ])]

  const patches: Array<() => void> = []
  const hidden = [...masked].filter(serverName => !own.has(serverName))

  /** 安装失败的原文：面板据此把「账本已写但没生效」讲清楚（以前只打日志）。 */
  let restrictError: string | null = null
  if (deny.length > 0 && typeof tools?.restrict === 'function') {
    try {
      patches.push(tools.restrict({ deny }))
    } catch (error) {
      restrictError = error instanceof Error ? error.message : String(error)
      ctx.logger?.warn?.(`[dsh-triad] mcp mask restrict failed for "${agent.id}": ${restrictError}`)
    }
  } else if (deny.length > 0) {
    restrictError = 'tools.restrict() unavailable on this agent scope'
    ctx.logger?.warn?.(`[dsh-triad] mcp mask: ${restrictError} (agent "${agent.id}")`)
  }

  const prompt = agent.ctx.get?.('systemPrompt')
  if (typeof prompt?.section === 'function' && typeof prompt?.getSectionOrder === 'function') {
    for (const serverName of hidden) {
      try {
        const order = prompt.getSectionOrder('MCP_SERVERS')
        patches.push(prompt.section({ name: `mcp:${serverName}`, order, interpolate: false, text: '' }))
      } catch (error) {
        ctx.logger?.warn?.(`[dsh-triad] mcp mask section failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  const resources = agent.ctx.get?.('mcpResources')
  if (typeof resources?.register === 'function') {
    for (const serverName of hidden) {
      try {
        patches.push(resources.register(serverName, {
          request: async () => {
            throw new Error(`MCP resource server "${serverName}" is disabled for agent preset "${presetId}"`)
          },
        }))
      } catch (error) {
        ctx.logger?.warn?.(`[dsh-triad] mcp mask resource stub failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  if (state.stopped || state.versions.get(agent) !== version) {
    for (const dispose of patches) {
      try { dispose() } catch { /* 已被取代：释放刚装的补丁 */ }
    }
    return
  }
  if (patches.length > 0) state.patches.set(agent, patches)
  agentOutcome.set(agent.id, {
    presetId,
    deny: deny.length,
    sections: hidden.length,
    error: restrictError,
  })
}

/** 对全部活动 agent 重装（账本变更 / 工具集变更）。 */
function reinstallAll(ctx: PluginContext, state: InstallerState, onlyPreset?: string): void {
  const agents = ctx.get?.('agents')
  const list: AgentLike[] = typeof agents?.list === 'function' ? agents.list() : []
  for (const agent of list) {
    if (agent === undefined || agent === null) continue
    if (onlyPreset !== undefined && presetOf(ctx, agent) !== onlyPreset) continue
    void installAgent(ctx, state, agent).catch(() => undefined)
  }
}

/** 安装器 + 路由 + 事件钩子。 */
export async function applyMcpPresetMask(ctx: PluginContext): Promise<void> {
  readMaskLedger(true)
  const state: InstallerState = { patches: new Map(), versions: new Map(), timer: undefined, stopped: false }

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: (req: IncomingMessage, res: ServerResponse) => {
      void handle(ctx, state, req, res)
    },
  }), 'triad: mcp-masks routes')

  ctx.effect(() => {
    const install = (agent: AgentLike): void => {
      if (agent === undefined || agent === null) return
      void installAgent(ctx, state, agent).catch(() => undefined)
    }
    const remove = (agent: AgentLike): void => {
      state.versions.delete(agent)
      releasePatches(state, agent)
      agentOutcome.delete(agent.id)
    }
    const agents = ctx.get?.('agents')
    if (typeof agents?.list === 'function') for (const agent of agents.list()) install(agent)
    const offCreated = ctx.on('agent/created', ({ agent }: { agent: AgentLike }) => { install(agent) })
    const offDisposed = ctx.on('agent/disposed', ({ agent }: { agent: AgentLike }) => { remove(agent) })
    return () => {
      offCreated()
      offDisposed()
      for (const agent of [...state.patches.keys()]) releasePatches(state, agent)
      state.versions.clear()
    }
  }, 'triad: mcp-masks agents')

  // 工具级禁用账本变更（面板点击工具名）：只重挂受影响的范围 ──
  // 全局层（presetId 缺省）全体重挂，预设层只重挂该预设的 agent。
  ctx.effect(() => ctx.on(TOOL_DISABLE_CHANGE_EVENT, (presetId?: string) => {
    if (state.stopped) return
    reinstallAll(ctx, state, typeof presetId === 'string' && presetId !== '' ? presetId : undefined)
  }), 'triad: mcp-masks tool-disable change')

  // 全局工具集变化（服务器晚连/重连/re-sync）：去抖后对装了遮蔽的 agent 重算。
  ctx.effect(() => ctx.on('tools/change', () => {
    if (state.timer !== undefined) clearTimeout(state.timer)
    state.timer = setTimeout(() => {
      state.timer = undefined
      if (state.stopped) return
      reinstallAll(ctx, state)
    }, REINSTALL_DEBOUNCE_MS)
  }), 'triad: mcp-masks tools/change')

  ctx.effect(() => () => {
    state.stopped = true
    if (state.timer !== undefined) clearTimeout(state.timer)
    for (const agent of [...state.patches.keys()]) releasePatches(state, agent)
    state.versions.clear()
  }, 'triad: mcp-masks teardown')
}

/** 处理一条 PUT /api/triad/mcp-masks/<preset>/<serverName>。 */
async function handle(ctx: PluginContext, state: InstallerState, req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!loopbackAllowed(req)) {
    writeJsonResponse(res, 403, { error: 'loopback-only' })
    return
  }
  const url = new URL(req.url ?? '/', 'http://localhost')
  const rest = url.pathname.slice(ROUTE_PREFIX.length)
  const method = req.method ?? 'GET'
  try {
    const match = /^\/([^/]+)\/([^/]+)$/.exec(rest)
    if (method === 'PUT' && match !== null) {
      const presetId = decodeURIComponent(match[1]!)
      const serverName = decodeURIComponent(match[2]!)
      if (!isPresetId(presetId)) throw new Error(`invalid preset id ${JSON.stringify(presetId)}`)
      if (!isServerName(serverName)) throw new Error(`invalid serverName ${JSON.stringify(serverName)}`)
      const body = await readJsonBody(req)
      const enabled = body.enabled
      if (typeof enabled !== 'boolean') throw new Error('enabled must be a boolean')
      const { ledger, changed } = setMask(readMaskLedger(), presetId, [serverName], enabled)
      if (changed > 0) writeMaskLedger(ledger)
      reinstallAll(ctx, state, presetId)
      writeJsonResponse(res, 200, {
        ok: true,
        preset: presetId,
        serverName,
        enabled,
        changed,
        // 安装诊断：面板据此提示「遮蔽已写但运行期还没拒到工具」这类情况。
        install: maskInstallReportOf(presetId),
      })
      return
    }
    writeJsonResponse(res, 404, { error: `no route for ${method} ${rest}` })
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
