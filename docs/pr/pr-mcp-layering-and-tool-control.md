# PR：MCP 全局/预设分层 · 单工具级启停 · DSH 0.1.6 兼容

| 项 | 值 |
|---|---|
| 仓库 / 分支 | `Kr-ATG/dsh-triad` ← `DreamsTOF:dsh-triad` · `feat/mcp-layering-tool-control` |
| 基线 | `master` @ `e73fbd9` |
| 目标宿主 | DSH `0.1.6-alpha.1`（按源码核验，**未改动 DSH 任何文件**） |
| 验证 | 4 套回归 + 2 个烟测全绿（新增 2 套，共 **64 项断言**；构建产物可复现） |
| 影响面 | 宿主侧新增 5 个模块 + 状态聚合成面板唯一数据源（全部插件注入）；客户端重写 MCP 页 |

---

## 一、背景与目标

`dsh-triad` 的「能力管理」面板里技能（SKILL）已有**两层模型**：全局层改
`SKILL.md` frontmatter，预设层用 agent 作用域闸门遮蔽；MCP 侧长期只有一层
（直接改 `~/.dsh/profiles/web/cordis.patch.yml` 的 `dsh-mcp-client` 行），
于是「在某个预设里单独控制某台 MCP」没有落点。

本 PR 把 MCP 补齐到与技能同构的两层模型，并在其上加一层更细的粒度：

1. **预设自带 Server** —— 行写进该预设的 `agent.cordis.yml`，只对该预设生效；
2. **预设遮蔽全局 Server** —— 全局连接保留，仅对该预设隐藏它的工具/指令/资源；
3. **单工具级启停（按「行」记账）** —— 每张卡片列出该 MCP 的全部工具名，
   绿=启用/灰=禁用，点击即切换，**全局行与预设自带行各记各的账**；
4. **一键全禁** —— 预设自带 MCP 卡片的「全部工具」滑块。

同时修正「预设界面添加全局 MCP 后无法在该预设内控制」的判定，并完成 DSH 0.1.6
前置兼容（`dsh-client-runtime` 已从宿主移除）。

---

## 二、改动总览

### 2.1 前置：DSH 0.1.6 兼容（不涉及行为变更）

`@deepseek-ai/dsh-client-runtime` 在 0.1.2-alpha.2 之后被移除，插件客户端
多处仍在引用它；`dsh.client.inject` 也挂着它。修正为 0.1.6 的正式来源：

| 位置 | 旧 | 新 |
|---|---|---|
| 8 个客户端文件（含 automation 四个）的 `import type { ClientContext }` | `@deepseek-ai/dsh-client-runtime/client` | `@deepseek-ai/cordis` 的 `Context as ClientContext` |
| `SessionId` 类型（automation/models） | 同上 | `@deepseek-ai/dsh-session/types` |
| `package.json` `dsh.client.inject` | `@deepseek-ai/dsh-client-runtime`、`@deepseek-ai/dsh-client-ui-locale` | `@deepseek-ai/dsh-client-ui-renderer`（`ctx.slots` 类型来源）、`@deepseek-ai/dsh-client-locale`（真名） |
| `js-yaml` | — | 列进 `dependencies`（`mcp-paste.ts` 解析粘贴的 YAML） |
| `automation/scheduler.ts` | `setInterval` 持有进程 | `timer.unref()`（短生命周期宿主不再被调度器吊住） |
| `skill-toggles.ts` | 内部 `readRoster` | 导出为 `readPresetRoster`，供 MCP 模块复用预设名单 |

### 2.2 宿主新模块（全部为插件注入，零官方源码改动）

| 模块 | 职责 | 关键接缝 |
|---|---|---|
| `src/mcp-presets.ts` | 预设自带 mcp-client 行的**文本级**增删（保留注释、备份、原子写） | `agentPresets.list()` 给出的组合文件路径 |
| `src/mcp-paste.ts` | 粘贴解析（`mcpServers` JSON / DSH 原生 YAML）→ 校验 + 预览 + 生成补丁行 | 纯函数 + 路由 |
| `src/mcp-mask-ledger.ts` | 遮蔽账本（纯数据，供执行侧与面板侧共读） | 无宿主依赖 |
| `src/mcp-preset-mask.ts` | 遮蔽执行：agent 作用域三处同名遮蔽 + 安装诊断 | `tools.restrict` / `systemPrompt.section` / `mcpResources.register`、`agent/created`、`tools/change` |
| `src/mcp-tool-disable.ts` | 工具级启停（两层账本 + 按行记账）+ 装配过滤 | `system-prompt/assemble`（`{ global: true }`）、`assembly.context.agent` |

`src/mcp-status.ts` 扩展为面板的**唯一数据源**（聚合补丁条目、注册工具、
预设名单、遮蔽账本、工具账本、名单缓存、安装诊断）。

### 2.3 两个运行期接缝（核心机制）

**缝 1 —— 装配过滤**（`system-prompt/assemble`）

- 以 `{ global: true }` 注册：装配派发是**按作用域过滤**的（`scopeTarget`），
  只有 global 监听器能收到每个 agent 的装配；
- 就地过滤 `assembly.tools`（权威工具目录）；
- 判定该次装配属于哪个预设：`assembly.context.agent` + `agentPresets.composedPreset()`；
- 覆盖「工具级禁用」与「预设遮蔽」两类账本，native 模式下一次组装即生效，
  **不依赖 per-agent 补丁是否安装成功**。

**缝 2 —— agent 作用域 `tools.restrict({ deny })`**

- 作用于「继承的全局层」：`view(scope).visible` 收敛，连 **PTC 现渲染的
  `tools:sdk` 文本**与执行一起失效；
- 约束（来自 0.1.6 源码）：必须在有作用域的 ctx 上调用；`deny` 只接受
  **restrictable（全局层）且已存在**的名字，未知/作用域内名字会抛错 ——
  因此预设自带（scope-local）的工具被显式排除在 deny 之外。

### 2.4 账本与写入协议

```
${DSH_HOME}/mcp/dsh-triad/preset-masks.json     # 遮蔽：{ version:1, presets:{ <preset>:{ <server>: false } } }
${DSH_HOME}/mcp/dsh-triad/tool-disable.json     # 工具：{ version:3, disabled, presets:{ p:{ s:{ own:[], inherit:[] } } }, known }
~/.dsh/profiles/web/cordis.patch.yml            # 全局行（改前备份 .bak-last-toggle）
${DSH_HOME}/.agent-presets/<id>/agent.cordis.yml# 预设自带行（改前备份 + 原子写）
```

| 路由 | 语义 |
|---|---|
| `GET /api/triad/mcp-status` | 面板数据源（含 `toolDisabled` / `toolDisabledByPreset` / `maskInstall`） |
| `POST /api/triad/mcp-config` | 全局行：`disabled` 开关 / `action:'remove'` / `action:'add'` |
| `PUT /api/triad/mcp-masks/:preset/:server` | 遮蔽开关（响应带安装诊断 `install`） |
| `POST/DELETE /api/triad/mcp-presets/:preset/servers[/:server]` | 预设自带行的增删 |
| `POST /api/triad/mcp-preview` | 粘贴校验与预览（不写盘） |
| `PUT /api/triad/mcp-tools/:server` | 工具级开关：`{ enabled, tools?, preset?, source? }` |

### 2.5 同名 Server：按「行」记账

预设里可能同时存在「继承的全局 `context7`」与「自带的 `context7`」。两者
在作用域里由**自带行覆盖全局行**（DSH 的作用域遮蔽语义），因此运行期只应用
**当前提供者那条行**的账目：

| 条目 | 归属 | 何时生效 |
|---|---|---|
| `disabled[s]` | 全局行 | 该作用域由全局行提供工具时（所有共享它的预设 + 无预设 agent） |
| `presets[p][s].inherit` | 预设 p 的「继承的全局行」 | 同上 |
| `presets[p][s].own` | 预设 p 的「自带的同名行」 | p 自带同名 Server 时 |

**结果**：两张卡片的工具开关互不牵连（点一边另一边不变），撤掉其中一条行时
另一条的设置各自生效。`owner` 判定用常驻内存缓存（覆盖语义），刷新点：
mask 安装器（`agent/created`）、状态路由读预设组合、工具路由写入前。

**全局一票否决与偏好记忆**（同一套账本上的语义约定）：

| 层 | 语义 |
|---|---|
| 全局层关闭某工具 | **所有预设一票否决**：彻底不可见、不可调用；预设层只能加禁、不能打开 |
| 全局层开启某工具 | 各预设独立判断：打开 = 继承使用，关闭 = 对该预设遮蔽 |
| 预设层写入（`enabled: true`）命中全局层已禁用 | 返回 **409**（附 `globalDisabled`），显式拒绝而非静默空操作 |
| 偏好记忆 | 全局层写入只改 `disabled`，预设层写入只改 `presets[p][s][owner]` —— 全局「关→开」往返不触碰预设条目，个性化遮蔽自动还原 |

### 2.6 面板（`src/client/usage/dashboard/SkillsPanel.tsx`）

- **MCP 页与技能页 1:1 同构**：顶部预设 chips（全部 + 各预设，数字 = 该层
  可见 Server 数）+ 全部/已启用/已停用分段；四张统计卡；编辑层提示行；
  搜索（Server 名或工具名）+ 刷新 + 添加。
- **列表两块**：继承的全局 Server（预设层开关 = 遮蔽）/ 该预设专属 Server
  （移除 + 「全部工具」一键全禁滑块）。
- **工具 chips**：全量工具名，绿=启用、灰=禁用；被禁用的工具仍可点回来（名单缓存兜底）。
- **级联置灰与标签**：命中全局层的工具在继承行上强制 `data-locked`（灰 + 删除线 +
  小锁 glyph，`disabled` 不可拨动），卡片头显示「**全局已停用**」（多个时带数量）标签，
  tooltip 说明一票否决与「偏好已保留」。
- **添加/启用后自动等工具注册**：写配置只是热重载那一行，进程要过几秒才注册
  工具 —— 面板 2s 轮询（按实际注册数判定，最长 150s），期间显示等待提示，
  卡片打「等待注册」标记，全程无需手动刷新。
- **删除与移除都有确认弹窗**；MCP 页主区自适应滚动（卡片/工具再多也能滚到底）。
- 旧 MCP 页的左侧导航与「工具列表 / 连接日志 / 配置模板」三个子页一并移除：
  模板对「复制一份改改就能用」的接入流程没有价值，连接日志与工具列表在卡片上
  已经有了。预设视图里的「+ 添加 MCP Server」明确标注 **（全局）**，避免误加。

---

## 三、设计取舍与已知边界

1. **遮蔽 ≠ 不连接**：遮蔽只隐藏工具/指令/资源，server 连接照旧。要「该预设才
   连接」请用「预设自带 Server」。
2. **PTC 模式的残余**：遮蔽的 PTC `tools:sdk` 文本仍依赖 agent 作用域
   `restrict`；该补丁失败时面板会显示诊断（不再静默），但装配过滤够不到 section。
3. **预设自带工具枚举**：只有该预设的**活动 agent** 作用域能枚举其工具；没有
   活动会话时回退到名单缓存（`known`），缓存可能列出已不存在的旧工具名
   （点一下即可清理）。
4. **账本向后兼容**：v1/v2 文件读入即归一化升级（v2 预设层数组双写为
   own+inherit，保住当时的可见状态）；`known` 缓存只增不减。
5. **预设组合文件改动对新会话生效**（DSH 的语义，非本插件限制）。
6. **同名行共用工具名**：工具全名仍是 `mcp__<server>__<tool>`，同名两行无法在
   模型侧区分；本 PR 做到的是**账目与面板互不牵连**。
7. 宿主侧保持「可安装」约束：构建产物只允许 `@deepseek-ai/cordis` 与
   `dsh-util-crypto` 作为运行时外部依赖，由 `build.mjs` 的
   `assertHostExternals()` 把关（新增模块全部只用 `node:*` 与 `import type`）。

---

## 四、验证

### 4.1 自动化

| 命令 | 结果 |
|---|---|
| `node build.mjs` | `built lib/index.js + lib/client.js`；host runtime imports 仅 node 内置 + 白名单两个包（重建后 `git status` 为空 → 产物可复现） |
| `npm test` | `SKILL-MANAGER PASSED` / `SKILL-TOGGLES PASSED` / `MCP-LAYERING PASSED` / `MCP-TOOL-DISABLE PASSED`（64 项断言） |
| `npm run smoke` | `SMOKE PASSED — lib/client.js`（模块装载契约） |
| `npm run smoke:host` | `SMOKE PASSED — lib/index.js` |

新增两套测试（`scripts/test-mcp-layering.mjs`、`scripts/test-mcp-tool-disable.mjs`）
都在**临时 `DSH_HOME` 沙箱**里跑构建产物，不触碰用户账本与预设，覆盖：
遮蔽三层补丁与 deny 计算、预设自带行增删（保留注释）、官方预设写入拒绝、
脏账本归一化与 v1/v2 升级、装配过滤按预设区分、同名两行分账与 owner 接管、
最长前缀 serverName 解析、名单缓存与无活动 agent 场景、遮蔽的装配兜底、
非法输入拒绝，以及**全局一票否决 + 偏好记忆的完整往返**（全局关 → 预设层写入
被 409 拒绝且偏好不变 → 全局开 → 个性化遮蔽自动还原、「继承使用」的预设恢复可见）。

### 4.2 手工验收清单（建议 reviewer 抽查）

- [ ] 「能力 → MCP」顶部与技能页同款 chips 与状态分段；卡片数量多时可滚动到底；
- [ ] 预设 A 中「+ 添加 MCP Server（全局）」添加后，卡片立即出现，工具数与
      chips **自动补齐**（有「等待注册」过渡标记），无需手动刷新；
- [ ] 在预设 A 里点工具 chips 变灰 → 切到预设 B，同工具仍为绿（仅 A 生效）；
- [ ] 预设 A 遮蔽某全局 Server → 下一轮对话的工具目录中该 `mcp__*` 消失
      （无需重开会话/重启）；面板若未生效会显示诊断原因；
- [ ] 「全部 Agent」层关掉某工具 → 任意预设视图里该 chip **置灰不可点**（灰 + 删除线 +
      小锁），卡片头出现「全局已停用」标签；把该预设原本遮蔽过的工具做一次全局关→开
      往返，回来仍是「该预设遮蔽、别的预设继承使用」；
- [ ] 同名场景：全局 `context7` + 预设自带 `context7` → 两张卡的工具开关
      互不影响；撤掉自带行后，全局行那条「不要」的设置开始生效；
- [ ] 预设自带 MCP 卡片「全部工具」滑块：一下全灰，再点全绿；
- [ ] 移除操作都有确认弹窗；遮蔽开关在同名覆盖时**可以点**。

---

## 五、改动文件清单

**新增（源码）**
```
src/mcp-mask-ledger.ts     遮蔽账本（纯数据）
src/mcp-paste.ts           粘贴解析/校验/预览
src/mcp-presets.ts         预设自带行增删（文本级）
src/mcp-preset-mask.ts     遮蔽执行 + 安装诊断
src/mcp-tool-disable.ts    工具级启停（两层账本 + 装配过滤）
scripts/test-mcp-layering.mjs       MCP 分层回归
scripts/test-mcp-tool-disable.mjs   工具级启停回归（64 项）
```

**修改（源码 / 配置）**
```
src/host.ts                挂载 5 个 MCP 模块（各自 try/catch，单模块失败不影响其它）
src/mcp-status.ts          状态聚合：预设维度、两层账本镜像、名单缓存、安装诊断
src/skill-toggles.ts       导出 readPresetRoster
src/client/index.ts        ClientContext 来源修正
src/client/usage/entry.tsx ClientContext 来源修正
src/client/memory/index.ts ClientContext 来源修正
src/client/skill-source/index.ts  ClientContext / SessionId 来源修正
src/client/automation/{index,AutomationApp,Notifier,models}.tsx 同上
src/automation/scheduler.ts  setInterval 不持有进程存活（unref）
src/client/usage/dashboard/SkillsPanel.tsx  MCP 页重写（与技能页同构）
package.json               inject 修正 + js-yaml 依赖 + test 脚本扩展
README.md                  MCP 能力与行为说明
lib/index.js, lib/client.js 构建产物（本仓库按 .gitignore 注释有意提交）
```

---

## 六、提交结构

| # | 提交 | 内容 |
|---|---|---|
| 1 | `6e69914` `fix(client)` | 适配 DSH 0.1.6：类型来源、`client.inject`、`js-yaml`、scheduler `unref` |
| 2 | `5ee9183` `feat(mcp)` | 全局/预设两层模型：5 个宿主模块 + 状态聚合 + host 挂载 |
| 3 | `0530747` `feat(panel)` | MCP 页与技能页同构、工具级启停、一键全禁、自动等待与诊断（含构建产物同步） |
| 4 | `193a1c7` `test(mcp)` | 两套回归（64 项）+ `npm test` 接入 |
| 5 | `178b75d` `docs` | PR 说明（本文） |

回滚：本 PR 不修改 DSH 任何文件，宿主侧全部为插件注入，回退插件版本即可；
账本文件向前兼容（旧版本会把 v3 的未知字段丢弃，不会崩）。
