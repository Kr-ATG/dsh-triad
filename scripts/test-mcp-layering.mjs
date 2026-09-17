/**
 * dsh-triad — MCP 全局/预设分层回归测试。
 *
 * 直接跑构建产物 lib/index.js：DSH_HOME / DSH_AGENTS_HOME 指到临时目录，
 * 不碰用户真实预设、技能与账本。覆盖：
 *   - 预设遮蔽账本（preset-masks.json）写入与镜像；
 *   - agent 作用域三层补丁（tools.restrict / 同名空 section / 资源 stub）；
 *   - deny 计算排除「预设自带 serverName」（自带覆盖优先于遮蔽）；
 *   - 预设专属 mcp-client 行的插入/删除（文本级，保留注释）；
 *   - 官方预设（无用户文件）写入拒绝（409）。
 *
 * Usage: node scripts/test-mcp-layering.mjs
 */

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { EventEmitter } from "node:events"

const sandbox = mkdtempSync(join(tmpdir(), "dsh-triad-mcp-"))
process.env.DSH_AGENTS_HOME = join(sandbox, "agents")
process.env.DSH_HOME = join(sandbox, "dsh")

const presetRoot = join(process.env.DSH_HOME, ".agent-presets")
const codePresetDir = join(presetRoot, "code")
mkdirSync(codePresetDir, { recursive: true })
const codeComposition = join(codePresetDir, "agent.cordis.yml")
writeFileSync(codeComposition, [
  "# 我的 code 预设",
  "- id: persona",
  "  name: '@deepseek-ai/dsh-persona'",
  "  config:",
  "    prefix: code agent",
  "",
].join("\n"))

const maskFile = join(process.env.DSH_HOME, "mcp", "dsh-triad", "preset-masks.json")

/* 随 DSH 安装的"默认预设"：与用户预设同等可读写（path 来自 agentPresets.list()）。 */
const minimalComposition = join(sandbox, "install-presets", "minimal", "agent.cordis.yml")
mkdirSync(join(sandbox, "install-presets", "minimal"), { recursive: true })
writeFileSync(minimalComposition, [
  "# shipped minimal preset",
  "- id: tool-fs",
  "  name: '@deepseek-ai/dsh-tool-fs'",
  "",
].join("\n"))

/* 全局 profile patch（全局添加 MCP 的写入目标）。 */
const patchFile = join(process.env.DSH_HOME, "profiles", "web", "cordis.patch.yml")
mkdirSync(join(process.env.DSH_HOME, "profiles", "web"), { recursive: true })
writeFileSync(patchFile, ["# my patch layer", "- id: some-plugin", "  disabled: true", ""].join("\n"))

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

/** 安装器是异步的（预设组合读取）：等一轮微任务 + 定时器再断言。 */
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

/* ── 假的宿主面 ─────────────────────────────────────────────────────── */
const routes = new Map()
const restrictCalls = []
const sections = []
const resourceStubs = []

const agentServices = {
  tools: {
    schemas: () => [
      { name: "mcp__github__search" },
      { name: "mcp__github__create_issue" },
      { name: "mcp__web__fetch" },
      { name: "read" },
    ],
    restrict: (filter) => {
      restrictCalls.push(filter)
      return () => {}
    },
  },
  systemPrompt: {
    getSectionOrder: () => 105,
    section: (section) => {
      sections.push(section)
      return () => {}
    },
  },
  mcpResources: {
    register: (serverName, provider) => {
      resourceStubs.push({ serverName, provider })
      return () => {}
    },
  },
}
const agent = {
  id: "agent-1",
  presetId: "code",
  ctx: {
    presetId: "code",
    get: (name) => agentServices[name],
    inject: () => () => {},
  },
}

const ctx = {
  logger: { info: () => {}, warn: () => {}, debug: () => {} },
  webServer: { register: (route) => { routes.set(route.path, route.handler); return () => {} } },
  tools: { register: () => () => {}, schemas: () => [] },
  on: () => () => {},
  effect: (fn) => { fn?.(); return () => {} },
  settings: { get: () => ({ providers: {} }), register: () => () => {} },
  credentials: {}, sessions: {}, sessionPersistence: {}, llm: {},
  get: (name) => {
    if (name === "agentPresets") {
      return {
        list: async () => [
          { id: "code", trust: "user", path: codeComposition },
          { id: "minimal", trust: "system", path: minimalComposition },
        ],
        composedPreset: (agentCtx) => agentCtx?.presetId,
      }
    }
    if (name === "agents") return { list: () => [agent] }
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
  // 用宏任务而不是微任务：让处理器的监听器先挂上（真实 socket 有缓冲，
  // 但假请求没有，微任务会在处理器 await 之后、readBody 之前抢先发数据）。
  const payload = body === undefined ? undefined : Buffer.from(JSON.stringify(body))
  if (payload !== undefined) {
    setTimeout(() => {
      req.emit("data", payload)
      req.emit("end")
    }, 0)
  } else {
    setTimeout(() => req.emit("end"), 0)
  }
  // 有的处理器用 `for await (const chunk of req)` 读体（mcp-config 路由）。
  req[Symbol.asyncIterator] = async function* () {
    if (payload !== undefined) yield payload
  }
  return req
}
function fakeRes() {
  const res = {
    status: 0,
    body: "",
    /** 路由 handler 是 void handle(...)：响应在异步体读完之后才写出，等 promise。 */
    settled: undefined,
  }
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
const callMask = (method, url, body) => callOn("/api/triad/mcp-masks", method, url, body)
const callPreset = (method, url, body) => callOn("/api/triad/mcp-presets", method, url, body)

/* ── 1. 遮蔽：账本写入 + 三层补丁 ───────────────────────────────────── */
await callMask("PUT", "/api/triad/mcp-masks/code/github", { enabled: false })
await settle()
const ledger = JSON.parse(readFileSync(maskFile, "utf8"))
check("遮蔽账本写入 preset-masks.json", ledger.presets?.code?.github === false)
check("restrict 的 deny 只含被遮蔽 server 的全局工具", restrictCalls.length === 1
  && restrictCalls[0].deny.includes("mcp__github__search")
  && restrictCalls[0].deny.includes("mcp__github__create_issue")
  && !restrictCalls[0].deny.some(name => name.startsWith("mcp__web__"))
  && !restrictCalls[0].deny.includes("read"))
check("同名空 section 遮蔽服务器指令", sections.length === 1
  && sections[0].name === "mcp:github" && sections[0].text === "")
check("资源 stub 注册同名 provider", resourceStubs.length === 1
  && resourceStubs[0].serverName === "github")
let stubError = ""
try { await resourceStubs[0].provider.request() } catch (error) { stubError = String(error?.message ?? error) }
check("资源 stub 读取报「已对本预设禁用」", stubError.includes("disabled for agent preset"))

/* ── 2. 自带 serverName 覆盖优先于遮蔽 ─────────────────────────────── */
writeFileSync(codeComposition, [
  "- id: persona",
  "  name: '@deepseek-ai/dsh-persona'",
  "- id: mcp-neo",
  "  name: '@deepseek-ai/dsh-mcp-client'",
  "  config:",
  "    serverName: neo",
  "    transport: streamable-http",
  "    url: \"http://127.0.0.1:9/mcp\"",
  "",
].join("\n"))
restrictCalls.length = 0
sections.length = 0
resourceStubs.length = 0
await callMask("PUT", "/api/triad/mcp-masks/code/github", { enabled: true })
await callMask("PUT", "/api/triad/mcp-masks/code/neo", { enabled: false })
await settle()
check("自带 serverName 不进入 deny（自带覆盖优先于遮蔽）",
  restrictCalls.every(call => !call.deny.some(name => name.startsWith("mcp__neo__"))))
check("全局视图无该 server 工具时不注册遮蔽补丁（deny 空 → 三处皆无）",
  restrictCalls.length === 0 && sections.length === 0 && resourceStubs.length === 0)

/* ── 3. 预设专属行：插入 / 删除 / 官方预设只读 ─────────────────────── */
const added = await callPreset("POST", "/api/triad/mcp-presets/code/servers", {
  serverName: "docs", transport: "stdio", command: "npx", args: ["-y", "@scope/mcp-docs"],
})
check("新增预设专属行返回 200", added.status === 200 && added.json?.ok === true)
const afterInsert = readFileSync(codeComposition, "utf8")
check("行已写入预设组合（id / name / transport）", afterInsert.includes("- id: mcp-docs")
  && afterInsert.includes("'@deepseek-ai/dsh-mcp-client'")
  && afterInsert.includes("transport: stdio"))
check("既有注释与行保留", afterInsert.includes("- id: mcp-neo") && afterInsert.includes("- id: persona"))
check("写前备份存在", readFileSync(`${codeComposition}.bak-last-mcp`, "utf8").includes("- id: mcp-neo"))

const dup = await callPreset("POST", "/api/triad/mcp-presets/code/servers", {
  serverName: "docs", transport: "stdio", command: "npx",
})
check("重复 serverName 被拒", dup.status === 400 && String(dup.json?.error).includes("already exists"))

const removed = await callPreset("DELETE", "/api/triad/mcp-presets/code/servers/docs")
check("删除预设专属行返回 200", removed.status === 200 && removed.json?.ok === true)
check("行已从组合移除", !readFileSync(codeComposition, "utf8").includes("mcp-docs"))

const shipped = await callPreset("POST", "/api/triad/mcp-presets/minimal/servers", {
  serverName: "x", transport: "stdio", command: "npx",
})
check("随安装的默认预设（path 来自 list）同样可写", shipped.status === 200 && shipped.json?.ok === true)
check("写入落在安装目录的预设文件里", readFileSync(minimalComposition, "utf8").includes("serverName: x"))

const missing = await callPreset("POST", "/api/triad/mcp-presets/nope/servers", { serverName: "y", transport: "stdio", command: "npx" })
check("名单外的预设返回 404", missing.status === 404 && missing.json?.error === 'preset-not-found')

/* ── 3b. 粘贴添加：JSON / YAML 校验与写入 ──────────────────────────── */
const previewRoute = "/api/triad/mcp-preview"
const preview = (body) => callOn(previewRoute, "POST", previewRoute, body)

const jsonPaste = JSON.stringify({
  mcpServers: {
    alpha: { command: "npx", args: ["-y", "@scope/alpha"] },
    beta: { url: "https://example.com/mcp" },
  },
})
const pv = await preview({ format: "json", text: jsonPaste, target: "preset" })
check("预览：JSON 多 server 解析成功", pv.status === 200 && pv.json?.ok === true && pv.json?.servers?.length === 2)
check("预览：返回待写入 YAML（serverName/transport）", String(pv.json?.yaml).includes("serverName: alpha")
  && String(pv.json?.yaml).includes("transport: streamable-http"))
check("预览：url 型 server 推断为 streamable-http",
  (pv.json?.servers ?? []).some(item => item.name === "beta" && item.transport === "streamable-http"))

const yamlPaste = [
  "mcpServers:",
  "  gamma:",
  "    command: npx",
  "    env:",
  "      TOKEN: ${MY_TOKEN}",
  "",
].join("\n")
const pvYaml = await preview({ format: "yaml", text: yamlPaste, target: "preset" })
check("预览：DSH 原生 YAML（mcpServers 形态）", pvYaml.status === 200 && pvYaml.json?.servers?.[0]?.name === "gamma")
check("预览：${VAR} 占位转 !!js 模板",
  String(pvYaml.json?.yaml).includes("!!js") && String(pvYaml.json?.yaml).includes("process.env.MY_TOKEN"))

const rowYaml = [
  "- id: mcp-delta",
  "  name: '@deepseek-ai/dsh-mcp-client'",
  "  config:",
  "    serverName: delta",
  "    transport: stdio",
  "    command: node",
  "    failOnStartupError: true",
  "",
].join("\n")
const pvRow = await preview({ format: "yaml", text: rowYaml, target: "preset" })
check("预览：mcp-client 行片段（保留额外 config 键）",
  pvRow.status === 200 && String(pvRow.json?.yaml).includes("failOnStartupError: true"))

const pvBadJson = await preview({ format: "json", text: "{ not json" })
check("预览：坏 JSON 给出解析错误", pvBadJson.json?.ok === false
  && String(pvBadJson.json?.errors?.[0]).includes("JSON 解析失败"))
const pvBadYaml = await preview({ format: "yaml", text: "mcpServers:\n  x:\n   - broken: [1,2\n" })
check("预览：坏 YAML 给出带行号的解析错误", pvBadYaml.json?.ok === false
  && String(pvBadYaml.json?.errors?.[0]).includes("YAML 解析失败"))

const pasted = await callPreset("POST", "/api/triad/mcp-presets/code/servers", { format: "json", text: jsonPaste })
check("粘贴写入预设：多 server 一次写入", pasted.status === 200 && (pasted.json?.added ?? []).length === 2)
const pastedAgain = await callPreset("POST", "/api/triad/mcp-presets/code/servers", { format: "json", text: jsonPaste })
check("重复粘贴：已存在的 serverName 跳过", pastedAgain.status === 200
  && (pastedAgain.json?.added ?? []).length === 0 && (pastedAgain.json?.skipped ?? []).length === 2)

const globalAdd = await callOn("/api/triad/mcp-config", "POST", "/api/triad/mcp-config", { action: "add", format: "yaml", text: yamlPaste })
check("全局粘贴写入 profile patch", globalAdd.status === 200 && (globalAdd.json?.added ?? []).includes("gamma"))
const patchText = readFileSync(patchFile, "utf8")
check("patch 保留原内容并追加 - insert: 块",
  patchText.includes("some-plugin") && patchText.includes("- insert:") && patchText.includes("serverName: gamma"))
check("patch 写前备份存在", readFileSync(`${patchFile}.bak-last-toggle`, "utf8").includes("some-plugin"))

/* ── 4. 非法输入拒绝 ───────────────────────────────────────────────── */
const badName = await callMask("PUT", "/api/triad/mcp-masks/code/bad.name", { enabled: false })
check("非法 serverName 被拒", badName.status === 400)
const badBody = await callMask("PUT", "/api/triad/mcp-masks/code/github", { enabled: "yes" })
check("enabled 非布尔被拒", badBody.status === 400)

rmSync(sandbox, { recursive: true, force: true })
if (failed > 0) {
  console.error(`\nMCP-LAYERING TEST FAILED (${failed})`)
  process.exit(1)
}
console.log("\nMCP-LAYERING TEST PASSED")
