# dsh-triad

**用量工作台 · 技能与 MCP Server 管理 · 长期记忆引擎** —— 一套插件装齐 DSH 三个工作台。

从 [statem-li/dsh-webui](https://github.com/statem-li/dsh-webui) v0.5.1 拆出这三个模块，
按 DSH `0.1.2-alpha.1` 的现行契约重写为独立插件。全部通过 `cordis.patch.yml` 的
bundle 机制挂载，**不碰官方源码一行**。

> 装完侧边栏多出一行三个入口：`[用量] [技能] [记忆]`。

---

## 一句话安装

```bash
dsh plugin --profile web add github:statem-li/dsh-triad
```

然后**重启 DSH**。

插件自带 bundle patch（`cordis.patch.yml`），`dsh plugin add` 会自动把它注册进
profile 的 bundle 层，**不需要手改任何配置文件**。

构建产物 `lib/` 随仓库一起提交，所以安装期无需执行构建脚本——pnpm ≥ 10 默认
拦截 git 依赖的 `prepare`/`postinstall`，带脚本会让上面那条命令直接失败。
想从源码构建见下方「从源码构建」。

### 卸载

```bash
dsh plugin --profile web remove dsh-triad
```

重启 DSH。内核 `ui-skill` 会随之恢复（它的停用声明也在同一个 patch 里）。

---

## 三个模块

### 记忆

| 能力 | 实现 |
| --- | --- |
| 自动抽取 | 挂 `session/event`，每 `extractEveryTurns` 轮用 LLM 抽一次；prompt 明确禁止入库会话流水账（commit/发版/版本号）、仓库可查到的信息（依赖/路径/配置）与通用编程知识，`minImportance`（默认 7）以下丢弃 |
| 语义检索 | 可选 embedding provider；关闭时退化为 TF-IDF 式打分 |
| 自动注入 | 挂 `agent/pre-step`，`{ prepend: true }`，预算 `injectTokenBudget` |
| 注入开关 | 对话框左端大脑按钮**悬停弹出**悬浮卡片（与 AI 浏览器 gate 同款，160ms 位移+淡入）：**本会话注入**（会话级覆盖，持久化 `state.json`）+ **默认开启**（`injectDefaultEnabled`，管新会话与未单独设置的会话）；悬停打开后点击可钉住（移开鼠标不收），外点/Esc 收起。单独设置过会显示角标并可一键「跟随默认」。同一开关也出现在面板「设置 · 注入」组 |
| 每日整合 | 衰减 + 命中加权 + 条目上限 + **闲置自动清理**（`pruneNeverHitDays`，默认 21 天：最后命中/创建距今满 N 天删除；置顶/已确认/手动/禁用豁免） |
| 语义整理 | 增量小批（默认最近更新 20 条/次，对齐 ReMe auto_dream 策略）+ 整理前快照 + 变更流汇总记录 + 整理专用模型（面板下拉，可选） + `consolidate.log` 诊断 |
| 相关记忆 | 详情面板「相关记忆」区：以目标条目内容为 query 走同一套 hybrid 检索，排除自身与已废弃（`GET /api/dsh-memory/related`） |
| 一键删今日 | 列表头「删今日」按钮：一次删除更新/创建于本地今天的记忆（`POST /api/dsh-memory/delete-today`，可选 `scope`/`projectHash` 跟随当前范围筛选）；置顶与已废弃条目保留，删前弹确认框（带今日计数），变更流记 `删除今日：` 前缀 |
| 计数口径 | 已废弃（回收站）条目一律不计入项目 / 分类 / 置顶 / 概览计数，也不会留在 md 产物里——条目删空的项目其 `memory.md` / `facts.md` / `pinned.md` 会被抹成空文件；面板导航计数用胶囊徽章呈现，≥1000 折成 `4.4k`（悬停看精确值），数值变化弹一下 |

工具：`memory_search` `memory_remember` `memory_pin` `memory_tag` `memory_forget`
`memory_revise` `memory_retire` `memory_consolidate`

路由：`/api/dsh-memory/*`（含 `/models` 模型目录、`/related` 相关记忆、`/delete-today` 一键删今日）

<p align="center">
  <img src="docs/screenshots/memory-panel.png" alt="记忆面板" width="720" />
  <br><em>记忆面板：全部记忆 / 变更 / 回收站，项目与分类，详情页含置顶、重要度、相关记忆与历史记录</em>
</p>

### 用量

四个 Tab：**用量 / 趋势 / 账户 / 信号**，含面积图、环形图、仪表、热力图、排名条。
与技能面板共用同一套 Skills Hub 风格共享视觉层（`usage/dashboard/hub.tsx`：
左侧分类导航 + 圆形渐变统计卡 + 搜索/排序工具栏 + 胶囊分段按钮）。

路由：`/api/usage-stats/{usage,balance,account,credentials,providers,subscriptions,signal,budget,day-sessions,deepseek-billing}`

### 技能

面板顶部 **SKILL / MCP** 双层顶层 tab：

- **SKILL**：`/` 触发源支持**二级分组**（`/<集合名>:` 后列出该集合下技能，含「散装技能」）、
  技能工具行、管理面板，以及**按 Agent 预设的开关覆盖**——同一个技能可以对
  `standard` 开、对 `code` 关。
- **技能查看器**：点技能卡标题打开，默认 **1280×880 大画幅**（随视口收缩，不再是一屏
  三分之一的小窗），工具条上可切**三档字号**（13.5 / 15 / 17px）与**全屏查看**，偏好写
  localStorage、下次打开自动恢复；正文按 em 缩放、标题走真实层级（`#` → h1），
  左侧文件树 252px 并高亮当前文件。
- **技能身份**：一个技能有两个名字 —— 目录名（文件系统身份）与 `SKILL.md` 的 `name`
  （DSH 内核调用用的规范名）。面板、账本、开关一律以规范名为准，同时带出目录名；
  读到历史上按目录名记的账本条目会**自愈**成规范名（`GET /list` 顺带改写 `.bundles.json`）。
  删除与查看文件两种名字都能定位，删除会把两个技能根下的同名目录一并清掉。
- **空技能包不再隐身**：0 成员的包（刚建的、成员被删光的）留在列表里并默认展开，
  给出「上传技能到此包」引导；账本里指向已删除技能的条目显示「N 个技能已不存在」
  并提供一键清理。旧实现把 0 成员的包一律过滤掉，建完包就像没建成。
- **导入**：拖整个技能文件夹不再多嵌一层目录（旧实现写成 `skill/my-skill/SKILL.md`，
  技能扫不到、面板里彻底消失）；Windows 打的反斜杠 zip 能认出 `SKILL.md`；目录名统一成
  面板里填的名字并同步改写 `SKILL.md` 的 `name`（弹窗里会预告这次改写），
  保证「目录名 = 技能名 = 账本键」三者一致。
- **技能包分类**：一个包可挂多个分类（自由填 + 预设建议），账本里存 `categories: string[]`，
  老账本没有该字段按「未分类」处理、改成员时整条透传不丢。顶栏出现「分类」胶囊行
  （全部分类 / 各分类 / 未分类，带包数，点已选中的取消），每个包标题行名旁挂主题蓝标签，
  点标签 = 筛到该类；「新建技能包」弹窗可同时挂分类，
  包的「更多」菜单有「设置分类」。分类只影响面板查找，不改技能启停。前端半身刷新即生效；
  分类写入走 `/api/skill-manager` host 路由，**改过 host 需重启 DSH 后才接受写入**。
- **操作回执**：安装/删除/归组/改名/开关的成败统一走面板右下角提示条（带入场与呼吸光点）。
  旧版把失败写进只在「添加技能」弹窗里渲染的字段，删除失败时面板上毫无反应。
- **关掉的技能不隐身**：状态筛选「全部」档一律列出所有技能（含已停用：卡片左侧灰条 +
  灰色「已停用」标签 + 标题降饱和，带过渡），只有切到「已启用 / 已停用」或搜索时才裁剪。
  旧版在「全部」档也按启用状态过滤，技能一关就从列表里消失，只能切档去捞回来。
  `/` 斜杠菜单仍只列可调用的技能（禁用 = 不可调用，与宿主闸门一致）。
- **MCP**：MCP Server 管理——添加/启停/会话自启动（localStorage 持久化）、
  **推荐 MCP Server 目录**（`GET /api/mcp-recommended`：官方 modelcontextprotocol/servers
  + 社区 MCP Registry 合并去重，离线兜底内置清单，5 分钟缓存）、联网搜索
  （`/search?q=`）、GitHub repo 解析（`/resolve?repo=`，用于一键「添加」）、
  真实注册列表（`GET/POST /api/triad/mcp-status{,/config}`）支持**启用/禁用与删除
  （移除 cordis.patch.yml 条目，热重载生效，删除前确认弹窗）**、
  工具列表 / 连接日志 / 配置模板、MCP 快速了解引导。

路由：`/api/skill-manager/*`（集合管理）、`/api/skill-toggles/*`（开关与预设覆盖）、
`/api/mcp-recommended{,/search,/resolve}`

<p align="center">
  <img src="docs/screenshots/skills-manager.png" alt="SKILL 技能管理" width="720" />
  <br><em>SKILL 视图：Agent 预设分类与快捷筛选、统计卡、技能包分组、技能卡（开关 / 全局 / 工具行）与快速上手指南</em>
  <br><br>
  <img src="docs/screenshots/mcp-manager.png" alt="MCP 管理" width="720" />
  <br><em>MCP 视图：MCP Server 总数 / 已启用 / 可用工具 / 运行中统计，Server 列表（启停、自启动、删除），推荐目录 / 工具列表 / 连接日志 / 配置模板</em>
</p>

> 技能在 webui 里原本是**两个独立 host 模块**（`skill-manager` 与 `skill-toggles`），
> 缺了后者技能面板的「Agent 预设」筛选条就会全部 404。这里两个都在。
>
> 两个模块共用同一套身份解析：`skill-toggles` 定位技能目录时先按目录名直取，
> 取不到再按 `SKILL.md` 的 `name` 扫一遍两个根 —— 否则目录名不一致的技能，
> 面板开关点了打不动、整包开关还会静默漏掉成员。

---

## 与内核 `ui-skill` 的关系

内核的 `ui-skill`（`packages/client/ui-skill`，纯客户端）与本插件的技能模块占
**同一对座位**，无法共存，重复注册会直接抛 `already registered`：

1. `inputTriggers` 的 `('/', 'skill')` 触发源座位
2. `tool.call.toolview` 的 key `skill` 工具行座位

安装时会自动停用 `ui-skill`。**宿主侧能力不受影响**：`@deepseek-ai/dsh-tool-skill`
在 base bundle 里，`ctx.remote.skills` 是宿主服务，技能调用链路完好——只是 `/`
菜单和工具行改由本插件提供（多了集合二级分组）。

不想用本插件的技能模块时，卸载即可自动恢复。

---

## 配置

在 profile 的 `cordis.patch.yml`（更高层，覆盖 bundle patch）里给 `dsh-triad` 加 `config`：

```yaml
- id: dsh-triad
  name: dsh-triad
  config:
    memory:
      embeddingProvider: openai        # off（默认）| openai | 其它
      embeddingModel: text-embedding-3-small
      injectTokenBudget: 6000
      extractEveryTurns: 1
      decayLambda: 0.02
    usage: {}
```

记忆引擎默认值（`src/memory/types.ts` 的 `DEFAULT_CONFIG`）：

```
extractEveryTurns 1      compileEveryTurns 10    compileThreshold 4.5
decayLambda 0.02         hitBonus 2              injectTokenBudget 6000
injectRefreshSteps 8     injectTopK 8            entryLimit 500
extractMaxChars 6000     minImportance 6         logApiRequests false
dailyCompileEnabled true consolidateEnabled true consolidateMaxEntries 200
consolidateTimeoutMs 60000                       embeddingProvider off
pruneNeverHitDays 21
```

---

## 从源码构建

```bash
git clone https://github.com/statem-li/dsh-triad.git
cd dsh-triad
pnpm install
pnpm build
```

改完源码后记得重新构建并提交 `lib/`，否则安装方拿到的还是旧产物。

产物：

| 文件 | 格式 | 说明 |
| --- | --- | --- |
| `lib/index.js` | ESM | 宿主半身，node 平台 |
| `lib/client.js` | CJS | 浏览器半身，包在 `window.__ModuleLoader__.load` 工厂里 |

esbuild 的解析分三档：插件自己的 `node_modules`（正常安装路径）→ 本地 DSH
checkout 的 pnpm store（贡献者便利）→ 明确报错提示 `pnpm install`。

### 外部化策略（刻意不同）

- **`lib/index.js`**：自包含。除 `node:*` 内置模块外，留给运行时解析的只有
  `@deepseek-ai/dsh-util-crypto`（一个零依赖的 UUID 工具，DSH 有真实产物）。
  `yauzl` 内联（配 `createRequire` banner 解决 CJS 依赖在 ESM 产物里的
  `Dynamic require`）。
- **`lib/client.js`**：`react` / `react-dom` / `react/jsx-runtime` /
  `@deepseek-ai/dsh-client-*` 全部 external，由 DSH 模块表提供同一份实例。

#### 为什么宿主半身不能 import 大部分 `@deepseek-ai/*`

这是本插件踩过的最大的坑，值得单独说清楚。

DSH 的 `@deepseek-ai/*` 包**只发源码，不发运行时产物**。装到 profile 的
`node_modules` 之后，`@deepseek-ai/dsh-llm` 的 `lib/` 里只有 `.d.ts` 和几个
手工入口——**没有 `lib/index.js`**，尽管 `package.json` 写着
`"main": "lib/index.js"`。

DSH 自己没事，是因为它跑在 tsx 下，靠 `tsconfig.base.json` 的 `paths` 把包名
映射回源码目录（`@deepseek-ai/dsh-llm` → `packages/llm/llm/src`）。而 tsx 的
`resolveTsPaths` **只对不在 `node_modules` 里的 importer 应用 `paths`**。实测：

| importer 位置 | `dsh-llm` | `dsh-tools` | `cordis` | `schemastery` |
| --- | --- | --- | --- | --- |
| DSH checkout 内 | ✅ | ✅ | ✅ | ✅ |
| profile 的 node_modules 内 | ❌ | ❌ | ✅ | ✅ |

于是：从源码跑一切正常，`dsh plugin add` 装进去之后启动就
`ERR_MODULE_NOT_FOUND`。**构建期的成功完全不能说明问题**——esbuild 把
`@deepseek-ai/*` 原样 external，checkout 里每个名字都能解析，只有装到别人机器上
才炸。

对策是把用到的**叶子模块**（不依赖 cordis、不注册服务、纯函数/纯类）逐字复制进
`vendor/`，详见 [`vendor/README.md`](vendor/README.md)。`build.mjs` 末尾的
`assertHostExternals()` 会扫描产物里所有留给运行时的裸导入，命中白名单之外就
**直接让构建失败**。

### 测试

```bash
# 宿主半身：产物自包含，裸 node 即可，不依赖 tsx
node scripts/smoke-host.mjs

# 浏览器半身：独立可跑
node scripts/smoke-client.mjs

# 技能管理回归（临时目录里跑，不碰真实 ~/.agents/skills）
pnpm test            # = 下面两条
node scripts/test-skill-manager.mjs   # 身份解析 / 账本自愈 / 导入 / 删除 / 越界名
node scripts/test-skill-toggles.mjs   # 目录名≠规范名时的单个与整包开关
```

想复现「已安装位置」的真实条件，可以把 `lib/` 同步到
`~/.dsh/profiles/<p>/node_modules/dsh-triad/lib/`，再在**那个目录**下裸跑
`node scripts/smoke-host.mjs`——这正是本次修复的验收方式。

---

## 设计约束

- **每个模块各自 try/catch 挂载**，一个挂了不影响另外两个。
- **记忆面板用自研轻量 markdown 渲染器**（`src/client/memory/markdown.tsx`）。
  webui 原版为一个静态调用点拖进 shiki + mermaid + katex + markstream（数 MB）；
  新渲染器零外部依赖，只构造 React 元素，不用 `dangerouslySetInnerHTML`。
- **侧边栏槽位全部自建**。webui 原版依赖一个被 DSH 0.1.2 删掉的
  `#dsh-automation-menu-host`（`grep` 全空），卸载 webui 后无人再建，导致
  技能/记忆入口永远拿不到 portal 目标。现在四个槽位由插件自己创建。
- **宿主半身不 import 未验证的 `@deepseek-ai/*`**。DSH 这些包只发源码，装进
  profile 后解析不到运行时入口；用到的叶子模块内联在 `vendor/`，并由构建末尾的
  `assertHostExternals()` 兜底。详见[外部化策略](#外部化策略刻意不同)。
- HTTP 路由全部 loopback-only，浏览器半身通过同源 fetch 取数。

## 环境

- DSH `0.1.2-alpha.1`
- Node >= 22

## 许可

MIT
