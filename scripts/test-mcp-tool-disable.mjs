/**
 * dsh-triad — MCP 单工具级启停回归测试（两层账本 + 按「行」记账）。
 *
 * 直接跑构建产物 lib/index.js：DSH_HOME / DSH_AGENTS_HOME 指到临时目录，
 * 不碰用户真实账本与预设。覆盖：
 *   - 账本三层条目（全局行 / 预设层 inherit / 预设层 own）的写入、清除与响应字段；
 *   - 同名彻底独立：全局行、预设自带行各记一份账，谁也不牵连谁；
 *   - 生效口径「由哪条行提供工具，就只应用那条行的条目」（自带覆盖全局）；
 *   - 装配过滤按 agent 预设生效；restrict deny 排除预设自带（scope-local）名字；
 *   - 名单缓存 known：没有活动 agent 时也能列出/整台开关预设自带的工具；
 *   - serverName 最长匹配（`my` / `my_server`）；脏账本归一化与 v2 升级；
 *   - 同名覆盖时遮蔽开关（mask）仍可用。
 *
 * Usage: node scripts/test-mcp-tool-disable.mjs
 */

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { EventEmitter } from "node:events"

const sandbox = mkdtempSync(join(tmpdir(), "dsh-triad-tool-"))
process.env.DSH_AGENTS_HOME = join(sandbox, "agents")
process.env.DSH_HOME = join(sandbox, "dsh")

/* 用户预设 code：自带两台 MCP —— web（与全局同名）与 ownonly（全局没有）。 */
const presetDir = join(process.env.DSH_HOME, ".agent-presets", "code")
mkdirSync(presetDir, { recursive: true })
writeFileSync(join(presetDir, "agent.cordis.yml"), [
  "# 我的 code 预设",
  "- id: mcp-web",
  "  name: '@deepseek-ai/dsh-mcp-client'",
  "  config:",
  "    serverName: web",
  "    transport: stdio",
  "    command: npx",
  "- id: mcp-ownonly",
  "  name: '@deepseek-ai/dsh-mcp-client'",
  "  config:",
  "    serverName: ownonly",
  "    transport: stdio",
  "    command: npx",
  "",
].join("\n"))

/* 脏账本（v2 形状）：全局层 github、预设层 code/my_server（v2 数组 → 应升级成
 * own + inherit 两侧）；其余名字非法，该被丢弃。 */
const ledgerFile = join(process.env.DSH_HOME, "mcp", "dsh-triad", "tool-disable.json")
mkdirSync(join(process.env.DSH_HOME, "mcp", "dsh-triad"), { recursive: true })
writeFileSync(ledgerFile, JSON.stringify({
  version: 2,
  disabled: { github: ["mcp__github__search", "evil", "mcp__other__x", "mcp__github__"] },
  presets: { code: { my_server: ["mcp__my_server__deep"] } },
}))

const maskLedgerFile = join(process.env.DSH_HOME, "mcp", "dsh-triad", "preset-masks.json")

/* ── 断言小工具 ─────────────────────────────────────────────────────── */
let failed = 0
function check(label, condition) {
  if (condition) {
    console.log(`ok    ${label}`)
  } else {
    failed += 1
    console.error(`FAIL  ${label}`)
  }
}

const settle = () => new Promise(resolve => setTimeout(resolve, 20))

/* ── 假的宿主面 ─────────────────────────────────────────────────────── */
const routes = new Map()
const restrictCalls = []
const assembleHandlers = []
const eventHandlers = new Map()

const globalSchemas = [
  { name: "mcp__github__search", description: "search repos" },
  { name: "mcp__github__create_issue", description: "create an issue" },
  { name: "mcp__web__fetch", description: "fetch (全局那台)" },
  { name: "mcp__ownonly__sync", description: "sync (预设自带)" },
  { name: "mcp__maskme__alpha", description: "alpha" },
  { name: "mcp__maskme__beta", description: "beta" },
  { name: "mcp__my__ping", description: "ping" },
  { name: "mcp__my_server__deep", description: "deep" },
  { name: "read", description: "read a file" },
]

const agentServices = {
  tools: {
    schemas: () => globalSchemas,
    restrict: (filter) => {
      restrictCalls.push(filter)
      return () => {}
    },
  },
}
const codeAgent = { id: "agent-1", presetId: "code", ctx: { presetId: "code", get: (name) => agentServices[name], inject: () => () => {} } }
let liveAgents = [codeAgent]

const ctx = {
  logger: { info: () => {}, warn: () => {}, debug: () => {} },
  webServer: { register: (route) => { routes.set(route.path, route.handler); return () => {} } },
  tools: { register: () => () => {}, schemas: () => globalSchemas },
  on: (name, handler) => {
    if (name === "system-prompt/assemble") assembleHandlers.push(handler)
    const list = eventHandlers.get(name) ?? []
    list.push(handler)
    eventHandlers.set(name, list)
    return () => {}
  },
  emit: (name, ...args) => { for (const handler of eventHandlers.get(name) ?? []) handler(...args) },
  effect: (fn) => { fn?.(); return () => {} },
  settings: { get: () => ({ providers: {} }), register: () => () => {} },
  credentials: {}, sessions: {}, sessionPersistence: {}, llm: {},
  get: (name) => {
    if (name === "agentPresets") {
      return {
        list: async () => [
          { id: "code", trust: "user", path: join(presetDir, "agent.cordis.yml") },
          { id: "minimal", trust: "user", path: join(sandbox, "install-presets", "minimal", "agent.cordis.yml") },
        ],
        composedPreset: (agentCtx) => agentCtx?.presetId,
      }
    }
    if (name === "agents") return { list: () => liveAgents }
    return undefined
  },
}

const mod = await import(pathToFileURL(join(process.cwd(), "lib/index.js")).href)
await mod.apply(ctx, {})
await settle()

/* ── HTTP 小工具 ────────────────────────────────────────────────────── */
function fakeReq(method, url, body) {
  const req = new EventEmitter()
  req.method = method
  req.url = url
  req.socket = { remoteAddress: "127.0.0.1" }
  req.headers = { host: "localhost" }
  req.destroy = () => {}
  const payload = body === undefined ? undefined : Buffer.from(JSON.stringify(body))
  if (payload !== undefined) {
    setTimeout(() => { req.emit("data", payload); req.emit("end") }, 0)
  } else {
    setTimeout(() => req.emit("end"), 0)
  }
  req[Symbol.asyncIterator] = async function* () { if (payload !== undefined) yield payload }
  return req
}
function fakeRes() {
  const res = { status: 0, body: "" }
  res.settled = new Promise(resolve => { res.settle = resolve })
  res.writeHead = status => { res.status = status }
  res.end = body => { res.body = body; res.settle() }
  return res
}
async function callOn(routePath, method, url, body) {
  const res = fakeRes()
  routes.get(routePath)(fakeReq(method, url, body), res)
  await res.settled
  return { status: res.status, json: res.body === "" ? undefined : JSON.parse(res.body) }
}
const callTools = (method, url, body) => callOn("/api/triad/mcp-tools", method, url, body)
const callStatus = () => callOn("/api/triad/mcp-status", "GET", "/api/triad/mcp-status")

const readLedger = () => JSON.parse(readFileSync(ledgerFile, "utf8"))
/** 预设层某条行的禁用名。 */
const entryOf = (presetId, serverName, owner) => readLedger().presets?.[presetId]?.[serverName]?.[owner] ?? []

/** 跑一遍装配 waterfall（presetId 缺省 = 无预设，只应用全局行）。 */
async function assembleTools(names, presetId) {
  const assembly = { tools: names.map(name => ({ name })) }
  const handler = assembleHandlers[0]
  if (handler === undefined) throw new Error("no system-prompt/assemble listener registered")
  const context = presetId === undefined ? {} : { agent: { ctx: { presetId } } }
  let nextCalled = false
  await handler(assembly, context, async () => { nextCalled = true; return assembly })
  return { names: assembly.tools.map(tool => tool.name), nextCalled }
}

const visible = (list, name) => list.includes(name)
const ALL = [
  "mcp__github__search", "mcp__github__create_issue", "mcp__web__fetch", "mcp__ownonly__sync",
  "mcp__maskme__alpha", "mcp__maskme__beta", "mcp__my__ping", "mcp__my_server__deep", "read",
]

/* ── 1. 脏账本归一化 + v2 升级 + 装配过滤 ───────────────────────────── */
const before = await assembleTools(ALL, "minimal")
check("装配过滤可用（waterfall 放行 next）", before.nextCalled === true)
check("脏账本只保留合法条目：全局行禁用名被剔除", visible(before.names, "mcp__github__search") === false)
check("同名 server 的其它工具不动", visible(before.names, "mcp__github__create_issue") === true)
check("非 mcp 工具不动", visible(before.names, "read") === true)
// v2 的预设层数组在内存里升级成 own + inherit 两侧（磁盘要等首次写入才改写，
// 所以从 /api/triad/mcp-status 的镜像看）。
const upgradedNow = await callStatus()
const upgradedEntry = upgradedNow.json?.toolDisabledByPreset?.code?.my_server
check("v2 预设层数组升级为 own + inherit 两侧",
  Array.isArray(upgradedEntry?.own) && upgradedEntry.own.includes("mcp__my_server__deep")
  && Array.isArray(upgradedEntry?.inherit) && upgradedEntry.inherit.includes("mcp__my_server__deep"))

/* ── 2. 预设层只对所属预设生效 ─────────────────────────────────────── */
check("v2 升级条目对 code 生效（my_server）",
  visible((await assembleTools(ALL, "code")).names, "mcp__my_server__deep") === false)
check("同一个工具对别的预设不受影响（minimal）",
  visible((await assembleTools(ALL, "minimal")).names, "mcp__my_server__deep") === true)
check("无 agent 上下文的装配只应用全局行",
  visible((await assembleTools(ALL)).names, "mcp__my_server__deep") === true)

/* ── 3. serverName 最长匹配：my 与 my_server 不互相牵连 ─────────────── */
const pingOnly = await assembleTools(["mcp__my__ping", "mcp__my_server__deep"], "code")
check("下划线 server 只剔除自己的工具", visible(pingOnly.names, "mcp__my__ping") === true)
const status = await callStatus()
const statusServes = (status.json?.servers ?? []).map(server => server.serverName)
check("状态路由按最长匹配归组：my 与 my_server 各自成组",
  statusServes.includes("my") === true && statusServes.includes("my_server") === true)
const myGroup = (status.json?.servers ?? []).find(server => server.serverName === "my")
check("my 组里不含 my_server 的工具",
  Array.isArray(myGroup?.tools) && myGroup.tools.some(tool => tool.name === "mcp__my_server__deep") === false)
check("状态路由暴露按行分账的镜像（v3）",
  Array.isArray(entryOf("code", "my_server", "own"))
  && status.json?.toolDisabledByPreset?.code?.my_server?.inherit !== undefined)

/* ── 4. agent 作用域 deny：全局行 ∪ 本预设 inherit，排除自带 ────────── */
await settle()
const denyOf = () => restrictCalls.flatMap(call => call.deny ?? [])
check("全局行禁用名进 deny", denyOf().includes("mcp__github__search") === true)
check("预设 inherit 条目进 deny（code）", denyOf().includes("mcp__my_server__deep") === true)
check("预设自带工具不进 deny（作用域内名字会抛错）", denyOf().includes("mcp__web__fetch") === false)
check("预设自带工具也不因 inherit 条目进 deny", denyOf().includes("mcp__ownonly__sync") === false)

/* ── 5. 同名彻底独立（核心）──────────────────────────────────────────
 * code 自带 web（覆盖全局那条）：
 *   - own 条目 → 生效；inherit 条目 → 不生效（那条此刻不提供工具）；
 *   - 全局层禁用 → 对 code 不生效（提供者是自带行），对 minimal 生效。 */
const ownOff = await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: false, tools: ["mcp__web__fetch"], preset: "code", source: "own" })
check("自带行禁用：200，且响应标注 source=own", ownOff.status === 200 && ownOff.json?.source === "own")
check("写入 own 条目", entryOf("code", "web", "own").includes("mcp__web__fetch"))
check("inherit 条目未被动过", entryOf("code", "web", "inherit").length === 0)
check("自带行生效：code 的该工具被剔除", visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === false)

const inheritOff = await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: false, tools: ["mcp__web__fetch"], preset: "code", source: "inherit" })
check("继承行禁用：200，写入 inherit 条目", inheritOff.status === 200 && entryOf("code", "web", "inherit").includes("mcp__web__fetch"))
check("inherit 与 own 分账，互不覆盖", entryOf("code", "web", "own").includes("mcp__web__fetch") === true)
check("继承行此刻不生效（提供者是自带行）：工具仍被 own 条目剔除，而非被 inherit 影响",
  visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === false)

/* 只清 own，保留 inherit：自带行在时 inherit 不生效（各记各的账） */
await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: true, tools: ["mcp__web__fetch"], preset: "code", source: "own" })
check("清 own 后 inherit 条目仍在", entryOf("code", "web", "inherit").includes("mcp__web__fetch"))
check("自带行仍是提供者 → inherit 条目暂不生效：工具可见（两个开关各记各的账）",
  visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === true)
check("对别的预设（minimal，继承全局行）也不可见（那条只是 code 的 inherit，全局行没禁）",
  visible((await assembleTools(ALL, "minimal")).names, "mcp__web__fetch") === true)

/* 全局层禁用 web：对 minimal 生效，对自带同名的 code 不生效（彻底独立） */
await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: false, tools: ["mcp__web__fetch"] })
check("全局层禁用：minimal（继承全局行）不可见",
  visible((await assembleTools(ALL, "minimal")).names, "mcp__web__fetch") === false)
check("全局层禁用：code（自带同名行）不受影响 —— 同名彻底独立",
  visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === true)
await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: true, tools: ["mcp__web__fetch"] })

/* ── 6. 全局一票否决 + 个性化偏好记忆（全局关→开往返）───────────────── */
/* 个性化偏好：预设 code 单独遮蔽 create_issue */
await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: false, tools: ["mcp__github__create_issue"], preset: "code", source: "inherit" })
check("预设层写入个性化遮蔽偏好", entryOf("code", "github", "inherit").includes("mcp__github__create_issue"))
/* 全局关闭：一票否决，所有预设都不可见 */
await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: false, tools: ["mcp__github__create_issue"] })
check("全局关闭：code 不可见", visible((await assembleTools(ALL, "code")).names, "mcp__github__create_issue") === false)
check("全局关闭：minimal 同样不可见（一票否决覆盖所有预设）",
  visible((await assembleTools(ALL, "minimal")).names, "mcp__github__create_issue") === false)
/* 全局关闭期间：预设层不可拨动（显式拒绝，且不改写偏好）*/
const veto = await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: true, tools: ["mcp__github__create_issue"], preset: "code", source: "inherit" })
check("全局关闭期间预设层不能打开（409）", veto.status === 409 && veto.json?.ok === false)
check("被拒的请求不改写偏好（遮蔽条目仍在）", entryOf("code", "github", "inherit").includes("mcp__github__create_issue"))
const statusVeto = await callStatus()
check("面板数据仍标出全局层禁用（据此置灰 + 『全局已停用』标签）",
  (statusVeto.json?.toolDisabled?.github ?? []).includes("mcp__github__create_issue"))
/* 全局重新开启：偏好自动还原 */
await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: true, tools: ["mcp__github__create_issue"] })
check("全局恢复：个性化遮蔽自动还原（code 仍不可见）",
  visible((await assembleTools(ALL, "code")).names, "mcp__github__create_issue") === false)
check("全局恢复：未单独设置的预设回到「继承使用」（minimal 可见）",
  visible((await assembleTools(ALL, "minimal")).names, "mcp__github__create_issue") === true)
await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: true, tools: ["mcp__github__create_issue"], preset: "code", source: "inherit" })

/* ── 7. 预设自带 Server 的独立账目（ownonly 全局没有）──────────────── */
const ownOnlyOff = await callTools("PUT", "/api/triad/mcp-tools/ownonly", { enabled: false, tools: ["mcp__ownonly__sync"], preset: "code", source: "own" })
check("ownonly：写入 own 条目", ownOnlyOff.status === 200 && entryOf("code", "ownonly", "own").includes("mcp__ownonly__sync"))
check("ownonly：全局层没有任何条目", readLedger().disabled?.ownonly === undefined)
check("ownonly：code 不可见", visible((await assembleTools(ALL, "code")).names, "mcp__ownonly__sync") === false)
check("ownonly：minimal 本来就没有它，也不受影响", visible((await assembleTools(ALL, "minimal")).names, "mcp__ownonly__sync") === true)

/* ── 8. 名单缓存：没有活动 agent 也能列全并整台开关 ────────────────── */
liveAgents = []
const statusNoAgent = await callStatus()
const webRow = (statusNoAgent.json?.presetServers?.code ?? []).find(row => row.serverName === "web")
check("无活动 agent 时预设自带 Server 仍列出工具（缓存）",
  Array.isArray(webRow?.tools) && webRow.tools.some(tool => tool.name === "mcp__web__fetch"))
const wholeOff = await callTools("PUT", "/api/triad/mcp-tools/ownonly", { enabled: false, preset: "code", source: "own" })
check("无活动 agent 时也能整台关闭（tools 省略走缓存）",
  wholeOff.status === 200 && Array.isArray(wholeOff.json?.tools) && wholeOff.json.tools.includes("mcp__ownonly__sync"))
liveAgents = [codeAgent]

/* ── 9. 同名覆盖：遮蔽开关仍可用（面板现场反馈那个 case）────────────── */
const coveredMask = await callOn("/api/triad/mcp-masks", "PUT", "/api/triad/mcp-masks/code/web", { enabled: false })
await settle()
check("预设自带同名 Server 时，全局那一条仍可遮蔽（200）", coveredMask.status === 200 && coveredMask.json?.ok === true)
check("遮蔽账本写入 presets.code.web=false",
  JSON.parse(readFileSync(maskLedgerFile, "utf8")).presets?.code?.web === false)
check("遮蔽同名覆盖不误伤自带工具（deny 仍不含它）", denyOf().includes("mcp__web__fetch") === false)

/* ── 9b. 撤掉自带行 → inherit 账目接管（分账的实际意义）────────────── */
await callOn("/api/triad/mcp-masks", "PUT", "/api/triad/mcp-masks/code/web", { enabled: true })
await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: false, tools: ["mcp__web__fetch"], preset: "code", source: "inherit" })
check("自带行在时 inherit 条目仍不生效（工具可见）",
  visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === true)
const delOwn = await callOn("/api/triad/mcp-presets", "DELETE", "/api/triad/mcp-presets/code/servers/web")
check("移除预设自带行：200", delOwn.status === 200 && delOwn.json?.ok === true)
await callStatus()
check("撤掉自带行后 inherit 接管：工具不可见（全局行这条'不要'的账开始生效）",
  visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === false)
await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: true, tools: ["mcp__web__fetch"], preset: "code", source: "inherit" })
check("清 inherit 后可见恢复", visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === true)

/* ── 9c. 遮蔽经由装配过滤生效（面板反馈：遮蔽了但工具仍被注入）─────────
 * restrict 若安装失败或与工具注册错位，native 目录这一层靠装配过滤兜底。 */
const beforeMask = await assembleTools(ALL, "code")
check("遮蔽前：maskme 的工具在 code 可见（两条都在）",
  visible(beforeMask.names, "mcp__maskme__alpha") && visible(beforeMask.names, "mcp__maskme__beta"))
const maskPut = await callOn("/api/triad/mcp-masks", "PUT", "/api/triad/mcp-masks/code/maskme", { enabled: false })
await settle()
const afterMask = await assembleTools(ALL, "code")
check("遮蔽后：装配过滤把该 server 的工具全部剔除（不依赖 restrict）",
  visible(afterMask.names, "mcp__maskme__alpha") === false
  && visible(afterMask.names, "mcp__maskme__beta") === false)
check("遮蔽只对本预设生效：minimal 仍可见",
  visible((await assembleTools(ALL, "minimal")).names, "mcp__maskme__alpha") === true)
check("遮蔽 PUT 返回安装诊断",
  typeof maskPut.json?.install === "object" && maskPut.json.install !== null
  && typeof maskPut.json.install.agents === "number")
const statusMaskInstall = await callStatus()
check("状态路由暴露遮蔽安装诊断", typeof statusMaskInstall.json?.maskInstall?.code === "object")
/* 同名自带行在提供工具时，遮蔽全局那条不该误伤它（9b 删过自带 web 行，先加回来） */
const readdOwn = await callOn("/api/triad/mcp-presets", "POST", "/api/triad/mcp-presets/code/servers", {
  format: "json",
  text: JSON.stringify({ mcpServers: { web: { command: "npx", args: ["-y", "web-mcp"] } } }),
})
check("重新加回预设自带 web 行：200", readdOwn.status === 200 && readdOwn.json?.ok === true)
await callOn("/api/triad/mcp-masks", "PUT", "/api/triad/mcp-masks/code/web", { enabled: false })
await settle()
check("遮蔽被同名自带行覆盖的 server：工具仍可见（自带那台在提供）",
  visible((await assembleTools(ALL, "code")).names, "mcp__web__fetch") === true)
await callOn("/api/triad/mcp-masks", "PUT", "/api/triad/mcp-masks/code/web", { enabled: true })
await callOn("/api/triad/mcp-masks", "PUT", "/api/triad/mcp-masks/code/maskme", { enabled: true })
await settle()

/* ── 10. 非法输入 ──────────────────────────────────────────────────── */
check("非法 preset 被拒（400）", (await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: false, preset: "Bad Id" })).status === 400)
check("非法 source 被拒（400）", (await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: false, preset: "code", source: "both" })).status === 400)
check("不属于该 server 的名字被拒（400）", (await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: false, tools: ["mcp__other__x"] })).status === 400)
check("缺 enabled 被拒（400）", (await callTools("PUT", "/api/triad/mcp-tools/github", { tools: ["mcp__github__search"] })).status === 400)
check("GET 无路由（404）", (await callTools("GET", "/api/triad/mcp-tools/github")).status === 404)

/* ── 11. 清空所有条目 ──────────────────────────────────────────────── */
await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: true, tools: ["mcp__github__search", "mcp__github__create_issue"] })
await callTools("PUT", "/api/triad/mcp-tools/github", { enabled: true, tools: ["mcp__github__create_issue"], preset: "code", source: "inherit" })
await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: true, tools: ["mcp__web__fetch"], preset: "code", source: "inherit" })
await callTools("PUT", "/api/triad/mcp-tools/web", { enabled: true, tools: ["mcp__web__fetch"], preset: "code", source: "own" })
await callTools("PUT", "/api/triad/mcp-tools/ownonly", { enabled: true, tools: ["mcp__ownonly__sync"], preset: "code", source: "own" })
await callTools("PUT", "/api/triad/mcp-tools/my_server", { enabled: true, tools: ["mcp__my_server__deep"], preset: "code", source: "own" })
await callTools("PUT", "/api/triad/mcp-tools/my_server", { enabled: true, tools: ["mcp__my_server__deep"], preset: "code", source: "inherit" })
const emptyLedger = readLedger()
check("两层账本清空后无残留",
  Object.keys(emptyLedger.disabled ?? {}).length === 0
  && Object.values(emptyLedger.presets ?? {}).every(table => Object.keys(table).length === 0))
check("清空后装配目录完整", (await assembleTools(ALL, "code")).names.length === ALL.length)
check("名单缓存保留（下次打开面板仍能列出工具名）", (emptyLedger.known?.web ?? []).includes("mcp__web__fetch"))

rmSync(sandbox, { recursive: true, force: true })
if (failed > 0) {
  console.error(`\nMCP-TOOL-DISABLE TEST FAILED — ${failed} 项未通过`)
  process.exit(1)
}
console.log("\nMCP-TOOL-DISABLE TEST PASSED")
