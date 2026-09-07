/**
 * dsh-triad — host half entry.
 *
 * Mounts four modules on one Cordis plugin:
 *
 *  - memory     → local memory engine (LLM extraction, embedding retrieval,
 *                 `agent/pre-step` injection, tools, `/api/dsh-memory/*`)
 *  - automation → scheduled tasks: store + 60s scheduler + llm executor +
 *                 agent tool + `/api/triad-automation/*` (ported from dsh-webui)
 *  - usage      → token-usage analytics + provider balances (`/api/usage-stats/*`)
 *  - skills     → skill bundle management (`/api/skill-manager/*`)
 *
 * The usage + skills halves are the already-proven `dsh-usage-skill` host,
 * vendored under `vendor/usage-skill/`. The memory engine and the automation
 * module are ported from `dsh-webui`. No DSH source is modified.
 *
 * Each module mounts inside its own try/catch: a failure in one must never
 * stop the others from mounting.
 */

import type { Context } from '@deepseek-ai/cordis'
import { applyMemory } from './memory/index.js'
// @ts-expect-error — vendored JS half (no type declarations shipped)
import { apply as applyUsageHost } from '../vendor/usage-skill/index.js'
import { applyAutomationHost } from './automation/index.js'
import { apply as applySkillToggles } from './skill-toggles.js'
import { applySkillHealth } from './skill-health.js'
import { applyMcpRecommended } from './mcp-recommended.js'
import { applyMcpStatus } from './mcp-status.js'
import type { MemoryConfig } from './memory/types.js'

/** Stable Cordis plugin name. */
export const name = 'dsh-triad'

/**
 * Host services required before this plugin activates.
 *
 * Union of both halves:
 *  - memory → webServer, tools
 *  - usage  → webServer, credentials, sessions, sessionPersistence, settings, llm
 */
export const inject = [
  'webServer',
  'tools',
  'credentials',
  'sessions',
  'sessionPersistence',
  'settings',
  'llm',
]

/** Runtime config shape (supplied through `cordis.patch.yml`). */
export interface TriadConfig {
  /** Memory engine overrides; omitted keys fall back to DEFAULT_CONFIG. */
  memory?: Partial<MemoryConfig>
  /** Usage/account overrides forwarded to the vendored usage host. */
  usage?: Record<string, unknown>
}

export async function apply(ctx: Context, config: TriadConfig = {}): Promise<void> {
  // ── 记忆引擎 ────────────────────────────────────────────────────────
  try {
    applyMemory(ctx, config.memory)
    ctx.logger?.info?.('[dsh-triad] memory engine mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] memory engine failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 自动化（定时任务：存储 + 调度 + 执行 + 工具 + 路由）──────────────
  // /api/triad-automation/*：侧边栏首行「自动化」入口的数据面。
  try {
    applyAutomationHost(ctx)
    ctx.logger?.info?.('[dsh-triad] automation mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] automation failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 用量 + 技能 ─────────────────────────────────────────────────────
  try {
    await applyUsageHost(ctx, config.usage ?? {})
    ctx.logger?.info?.('[dsh-triad] usage + skills host mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] usage host failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 技能开关（全局层 + Agent 预设层）───────────────────────────────
  // /api/skill-toggles/*：技能面板的开关与「Agent 预设」筛选条都靠它。
  // 与 skill-manager（集合管理）是 webui 里两个独立模块，缺了这个
  // 面板顶部就没有预设条，且所有开关请求 404。
  try {
    await applySkillToggles(ctx)
    ctx.logger?.info?.('[dsh-triad] skill toggles mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] skill toggles failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 技能目录健康检查（同步状态卡片）────────────────────────────
  // GET /api/skill-health：只读扫描技能根目录 + bundle 账本，无写入。
  try {
    applySkillHealth(ctx)
    ctx.logger?.info?.('[dsh-triad] skill health mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] skill health failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── MCP Server 推荐数据源 ──────────────────────────────────────
  // GET /api/mcp-recommended：拉取官方/社区 MCP 目录（离线兜底内置清单）。
  try {
    applyMcpRecommended(ctx)
    ctx.logger?.info?.('[dsh-triad] mcp recommended mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] mcp recommended failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

  // ── 真实 MCP Server 状态（桥接注册的工具 + 分组）───────────────
  // GET /api/triad/mcp-status：只读 ctx.tools 中 mcp__* 工具，供
  // 「能力管理」面板 MCP 页显示真实注册状态（替代 localStorage 假数据）。
  try {
    applyMcpStatus(ctx)
    ctx.logger?.info?.('[dsh-triad] mcp status mounted')
  } catch (error) {
    ctx.logger?.warn?.(
      `[dsh-triad] mcp status failed to mount: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    )
  }

}
