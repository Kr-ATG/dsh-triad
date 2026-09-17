/**
 * SkillsPanel — 技能管理面板（自旧 client.js 的 dsh-skill-manager 区域原样提取）。
 *
 * UI 与逻辑保持与旧 bundle 完全一致：技能列表、bundle 管理（新建/重命名/删除/归入）、
 * zip/文件夹上传安装、删除技能、文件查看器。数据全部走 /api/skill-manager/*。
 * 旧代码的 React.createElement 树在此转写为 JSX，样式沿用旧 .skm-* 类名与 token。
 */
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  Button, IconAgentPresetOutline16, IconArchiveOutline20, IconCheckOutline16, IconChevronDownOutline14,
  IconChevronLeftOutline14, IconChevronRightOutline14, IconCloseOutline16, IconCodeOutline16, IconDataOutline16,
  IconEditOutline16, IconEllipsisOutline16, IconFolderOpenOutline16, IconPlusOutline16, IconRefreshOutline14,
  IconSkillOutline16, IconTrashOutline16, Menu, Modal, Tooltip,
  type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { modalStaggerClass } from '../../modal-animation'
import { ConfirmDialog } from '../../memory/ConfirmDialog'
import { PshBody, PopoverShell, type PopoverAnchor } from '../../popover-shell'

/** ---------------------------------------------------------------- 数据模型 */

interface SkillInfo {
  name: string
  description?: string
  files?: string[]
  fileCount?: number
  compatibility?: string
  /** 技能目录名：与 name 可以不一致（手工拷目录、改名导入），删除/查看走它。 */
  dir?: string
}

interface BundleInfo {
  id: string
  name: string
  skillCount: number
  skills: SkillInfo[]
  /** 账本里指向已消失技能的条目（面板给「清理失效引用」入口）。 */
  missingSkills?: string[]
  /** 技能包分类（一个包可挂多个）；老账本没有该字段时按未分类处理。 */
  categories?: string[]
}

interface SkillSnapshot {
  bundles: BundleInfo[]
  loose: SkillInfo[]
}

type PanelState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; snapshot: SkillSnapshot }

/** ---------------------------------------------------------------- 文案与参数 */

const SKILL_ZH: Record<string, string> = {
  entry: '能力', panelTitle: '能力管理', close: '关闭', loading: '正在读取技能…',
  error: '暂时无法读取技能。', retry: '重试',
  uploadHint: '拖入技能文件夹安装，或点击选择', uploadMeta: '{n} 个文件 · {folder}',
  fileCount: '{n} 文件', expandSkillFiles: '展开技能文件', previewLoading: '正在加载内容…', viewSkillFiles: '查看技能文件', viewerNav: '技能文件', viewerFont: '字号', viewerSmall: '小字号', viewerNormal: '标准字号', viewerLarge: '大字号', viewerFull: '全屏查看', viewerExitFull: '退出全屏', viewerFilesCount: '{n} 个文件', assignToBundle: '归入 Bundle', assignTitle: '将「{name}」归入', assignEmpty: '还没有技能包,先点「新建 Bundle」创建一个。', deleteSkillBtn: '删除技能',
  installName: '技能名称', installNamePlaceholder: '例如 my-skill', installDescription: '描述（可选）',
  installNameFromArchive: '技能名取自压缩包内的 SKILL.md',
  installNameInvalid: '技能名只能包含小写字母、数字和连字符（a-z 0-9 -）',
  installBundle: '归入 Bundle', installLoose: '不归组（散装）', installConfirm: '安装', installCancel: '取消',
  bundlesTitle: '技能包', bundlesEmpty: '还没有技能包，点「新建 Bundle」创建一个。',
  // 技能包分类
  bundleCatTitle: '分类', bundleCatAll: '全部分类', bundleCatNone: '未分类', bundleCatFilterAria: '按分类筛选技能包',
  bundleCatEdit: '设置分类', bundleCatEditTitle: '「{name}」的分类', bundleCatPlaceholder: '自定义分类，回车添加',
  bundleCatSaved: '已更新「{name}」的分类', bundleCatTip: '只看「{name}」分类 · 再点一次取消筛选',
  bundleCatLimit: '一个技能包最多 {n} 个分类', bundleCatDone: '保存', bundleCatAddPreset: '加入「{name}」',
  bundleCatEmptyHint: '还没分类。点下面的建议分类，或自己写一个 —— 分类只影响这里的查找，不改变技能本身。',
  bundleCatRemove: '移除分类「{name}」', bundleCatCustom: '自定义分类',
  bundleNoSkills: '还没有技能，可上传或从散装技能中归入。',
  newBundle: '新建技能包', newBundlePlaceholder: '技能包名称', create: '创建', cancel: '取消',
  renameBundlePlaceholder: '新的 Bundle 名称', rename: '重命名', delete: '删除',
  skillsCount: '{n} 个技能', removeSkill: '移出',
  looseTitle: '散装技能', looseEmpty: '没有散装 Skill',
  deleteBundleConfirm: '删除 Bundle「{name}」？其中的技能将变为散装。',
  deleteSkillConfirm: '删除技能「{name}」？此操作会删除它的文件。',
  enableSkill: '启用', disableSkill: '禁用',
  enableBundle: '启用全部', disableBundle: '禁用全部',
  toggleFailed: '切换失败：{message}',
  presetAll: '全部',
  presetAllName: '全部 Agent',
  presetStripLabel: 'Agent 预设',
  presetHintAll: '当前编辑「全部 Agent」：开关直接改技能文件，对所有预设生效。',
  presetHintScoped: '当前编辑「{name}」：只对该 Agent 预设生效，其它预设不受影响。',
  presetReset: '清空该预设的单独设置',
  presetDefaultTag: '默认',
  presetOverrideCount: '{n} 项单独设置',
  presetLockedByGlobal: '「全部 Agent」层已禁用，预设层无法打开',
  // 卡片（Skills Hub 风格）文案
  copySkillName: '复制技能名', copiedSkillName: '已复制', toolsLabel: '工具', scopeAll: '全局', tagLoose: '散装',
  // Skills Hub 页面文案
  hubSubtitle: 'Skill 管理工作区', hubWorkspace: '工作区', hubManage: '管理',
  hubMySkills: '我的技能', hubAddSkills: '添加技能', hubBundles: '技能包', hubPresets: 'Agent 预设', hubLoose: '散装技能',
  statManaged: '管理的技能', statEnabled: '全局启用', statLoose: '散装技能', statSync: '技能健康', statHealthy: '全部健康',
  statManagedDesc: '您创建和管理的技能总数', statEnabledDesc: '在所有 Agent 中启用的技能',
  statLooseDesc: '未分类的散装技能', statSyncDesc: '所有技能运行正常',
  statChecking: '检测中…', statIssues: '{n} 个问题', statUnknown: '检测失败', statPending: '待检测',
  searchPlaceholder: '搜索技能名称、描述或标签…', filterAll: '全部', filterBundles: '技能包', filterLoose: '散装技能', sortLabel: '名称',
  presetSelect: 'Agent 预设', viewList: '列表', viewGrid: '网格',
  bannerTitle: '添加技能', bannerSub: '拖入技能文件夹安装，或点击浏览选择',
  bannerDiscovered: '发现待导入技能', bannerFound: '发现 {n} 个文件（{folder}）待导入', bannerBtnBrowse: '浏览并导入', bannerBtnReview: '审查并导入',
  noMatch: '没有符合筛选条件的技能',
  // 左栏：Agent 预设分类 / 快捷筛选 / 添加技能卡
  presetCatTitle: 'Agent 预设分类', quickFilter: '快捷筛选',
  catAll: '全部', catStandard: '标准模式', catPtc: 'PTC 模式', catExtreme: '极限模式', catCreative: '创意模式',
  statusAll: '全部', statusOn: '已启用', statusOff: '已停用',
  toolAll: '全部工具', updatedAll: '最近更新', filterUpdated: '最近更新',
  addSkillsTitle: '添加技能', addSkillsSub: '拖入技能文件安装，或点击浏览选择',
  dropHere: '拖拽文件到此处', dropFormat: '支持 .zip .skill 等格式', browseImport: '浏览并导入',
  // 快速上手指南卡
  guideTitle: '快速上手指南',
  guideDesc1: '了解 Skill 的作用和使用方法',
  guideDesc2: '快速创建你的第一个 Skill',
  guideStart: '开始学习',
  guidePanelTitle: '快速上手',
  guideWhat: '什么是 Skill?',
  guideWhatDesc: 'Skill 是 Agent 的能力模块，可以让 Agent 学会特定任务、扩展更多能力。',
  guideCapUi: 'UI 设计', guideCapCode: '代码生成', guideCapDoc: '文档处理', guideCapData: '数据分析', guideCapTool: '工具调用',
  guideStep1: '创建 Skill', guideStep1Desc: '通过上传文件或配置规则，创建新的 Skill，让 Agent 学会新能力。',
  guideStep2: '配置 Skill', guideStep2Desc: '设置输入输出、参数和权限，确保 Skill 能正确被 Agent 调用。',
  guideStep3: '启用给 Agent', guideStep3Desc: '将 Skill 启用到 Agent 中，让 Agent 在对话中自动使用。',
  guideStep4: '查看效果', guideStep4Desc: '在对话中测试 Skill 的效果，持续优化技能表现。',
  guideFull: '查看完整指南',
  guideBest: '最佳实践',
  guideBest1: '一个 Skill 专注一个能力', guideBest2: '描述清楚输入和输出',
  guideBest3: '定期更新技能文件', guideBest4: '不要创建重复能力',
  guideMoreBest: '了解更多最佳实践',
  guideClose: '收起指南',
  // SKILL / MCP 顶层 tab
  kindSkill: 'SKILL', kindMcp: 'MCP',
  // MCP 视图
  mcpServer: 'MCP Server', mcpTools: '工具列表', mcpLog: '连接日志', mcpConfig: '配置模板',
  mcpRecommendMenu: '推荐 MCP Server', mcpRecommendTitle: '推荐 MCP Server', mcpAdd: '添加',
  // MCP Server 页（图一头部 + 统计卡）
  mcpTitle: 'MCP 管理', mcpProtocol: 'Model Contest Protocol',
  mcpSubtitle: '管理 MCP Server，扩展 Agent 能力边界',
  mcpMarketplace: 'MCP Marketplace', mcpAddServer: '添加 MCP Server',
  mcpStatTotal: 'MCP Server 总数', mcpStatTotalDesc: '已添加的 MCP Server',
  mcpStatEnabled: '已启用', mcpStatEnabledDesc: 'Agent 可使用',
  mcpStatTools: '可用工具', mcpStatToolsDesc: '通过 MCP 提供的工具',
  mcpStatRunning: '运行中', mcpStatRunningDesc: '当前连接正常',
  // 推荐 Skill
  skillRecommendTitle: '推荐 Skill',
  // MCP Server 列表（图二）
  mcpListTitle: 'MCP Server 列表', mcpEmptyList: '暂无 MCP Server，点击右上角「添加 MCP Server」开始接入。',
  mcpViewAll: '查看全部 {n} 个 MCP Server',
  mcpAdded: '已添加', mcpRemove: '移除',
  mcpAddModalTitle: '添加 MCP Server',
  mcpAddName: '名称', mcpAddNamePlaceholder: '例如 My MCP',
  mcpAddDesc: '描述（可选）', mcpAddDescPlaceholder: '简单描述这个 MCP 的用途',
  mcpAddType: '连接类型', mcpAddTypeStdio: 'stdio', mcpAddTypeHttp: 'http', mcpAddTypeSse: 'sse',
  mcpAddCommand: '启动命令', mcpAddCommandPlaceholder: '例如 npx -y @modelcontextprotocol/server-filesystem',
  mcpAddUrl: '接口地址', mcpAddUrlPlaceholder: '例如 https://example.com/mcp',
  mcpAddConfirm: '添加', mcpAddCat: '自定义',
  // 工具列表页
  mcpToolsTitle: '可用工具 · {n}',
  mcpToolsSearch: '搜索工具…',
  mcpToolsEmpty: '暂无可用工具：先添加并启用 MCP Server',
  // 推荐页联网搜索
  mcpSearchPlaceholder: '搜索 MCP Server，如 google / 钉钉 / 飞书…',
  mcpSearching: '正在搜索外部 MCP 目录…',
  mcpSearchResults: '搜索结果 · {n}',
  mcpSearchEmpty: '没有找到「{q}」相关的 MCP，换个关键词试试',
  mcpOpen: '打开',
  mcpOpenGitHub: 'GitHub 仓库',
  mcpOpenRegistry: 'MCP Registry',
  mcpResolving: '解析中…',
  mcpResolveFailed: '未能识别安装方式，请打开仓库查看配置',
  // 连接日志页
  mcpLogTitle: '连接日志',
  mcpLogEmpty: '暂无连接日志，接入 MCP Server 后自动记录',
  mcpLogClear: '清空日志',
  mcpLogAdd: '已添加', mcpLogEnable: '已启用', mcpLogDisable: '已禁用', mcpLogRemove: '已移除',
  // 配置模板页
  mcpConfigTitle: '配置模板',
  mcpConfigCopy: '复制', copied: '已复制',
  mcpTagOfficial: '官方', mcpTagCommunity: '社区',
  mcpStatusEnabled: '已启用', mcpStatusDisabled: '已禁用',
  mcpAutostart: '自启动',
  mcpAutostartTitle: '会话启动时自动拉起该 MCP 进程（关闭可节省内存）',
  // 真实注册状态（mcp-client 桥接）
  mcpLiveNote: '以下为 DSH 实际注册的 MCP Server·右上开关 = 启用/禁用（实时生效）·报 Session not found 时开关切一次（禁→启）即重连，无需重启 DSH',
  mcpLiveDisabled: '已禁用',
  mcpLiveToggleFailed: '切换失败（配置写保护或条目缺失）',
  mcpLiveEmpty: '未检测到已注册的 MCP Server：在 cordis.patch.yml 添加 mcp-client 条目并重启 DSH 后即可',
  mcpLiveUnavailable: '状态接口未就绪（host 改动需重启 DSH 服务）：桥接工具仍可用，此页暂无法读取注册表',
  mcpLiveRegistered: '已注册',
  mcpLiveRegisteredTitle: '已桥接',
  mcpLiveToolsOf: '工具',
  mcpLiveRefresh: '刷新',
  mcpLiveConfigHint: '添加：编辑 cordis.patch.yml（或使用「添加 MCP Server」生成配置片段）',
  // 预设维度（0.1.6）：全局 / 预设专属 / 遮蔽
  mcpScopeTitle: 'Agent 预设范围',
  mcpScopeHintAll: '当前查看全局 Server（所有预设共用）。选择某个预设，可管理它专属的 Server 与遮蔽。',
  mcpPresetGlobalSection: '继承的全局 Server',
  mcpPresetOwnSection: '该预设专属 Server',
  mcpPresetMasked: '已遮蔽',
  mcpPresetMaskState: '继承全局（未遮蔽）',
  mcpPresetMaskHint: '关掉开关 = 对该预设遮蔽：工具、服务器指令与资源读取都隐藏；全局连接保留（要「不连接」请改用「专属 Server」）。',
  mcpPresetCovered: '已被本预设同名 Server 覆盖',
  mcpPresetOwnHint: '专属 Server 写进该预设的组合文件：独立连接，仅该预设与其子代理可见。',
  mcpAddServerGlobal: '添加 MCP Server（全局）',
  mcpAddGlobalHint: '全局 Server 对所有预设生效；只想给当前预设用，请点左侧的「添加专属 Server」。',
  mcpOwnRemoveConfirmTitle: '移除该预设专属 Server？',
  mcpOwnRemoveConfirmMsg: '将从「{name}」的组合文件里删掉这一行 mcp-client 条目（改前自动备份），对该预设的新会话生效；全局的同名 Server 不受影响。',
  // 同名覆盖：预设自带同名 Server 时的遮蔽开关与提示
  mcpPresetCoveredSwitchHint: '遮蔽全局这一条。该预设自带同名 Server，工具仍由它提供 —— 要一起关掉请移除下方「该预设专属 Server」。',
  mcpPresetCoveredMasked: '已遮蔽全局这一条 · 工具仍由该预设同名 Server 提供',
  mcpPresetShadowGlobalTag: '同名全局',
  mcpPresetShadowGlobalTip: '全局也有一台同名 Server。本预设用自带的这台，两边的工具开关各记各的账（互不影响）。',
  mcpPresetOwnEmpty: '该预设还没有专属 Server',
  mcpPresetStorageHint: '该预设随 DSH 安装目录存放：一样可读写；升级 DSH 可能覆盖它。',
  mcpPresetAddOwn: '添加专属 Server',
  mcpPresetNewSession: '预设文件改动对新会话生效',
  mcpPresetFailed: '操作失败：{message}',
  // MCP 页（与技能页同构）：统计卡 / 提示行 / 工具条
  mcpStatManaged: '管理的 Server', mcpStatManagedDesc: '您接入的 MCP Server 总数',
  mcpStatGlobal: '全局 Server', mcpStatGlobalDesc: '所有 Agent 预设共用',
  mcpStatOwn: '预设专属', mcpStatOwnDesc: '只在某个预设内生效',
  mcpStatHealth: '连接状态', mcpStatHealthDesc: '已停用的条目不计入工具',
  mcpHealthOk: '全部运行中', mcpHealthWarn: '{n} 个已停用',
  mcpScopeAllTip: '全部 Agent：{n} 个全局 Server（所有预设共用）',
  mcpScopePresetTip: '该预设可见 {n} 个 Server',
  mcpScopeOverrideCount: '{n} 项单独设置',
  mcpScopeHintScoped: '当前编辑「{name}」：专属 Server 只对这个预设生效；开关 = 遮蔽它继承的全局 Server，其它预设不受影响。',
  mcpWaitingTools: '正在等待「{names}」连接并注册工具…（自动刷新中，无需手动点刷新）',
  mcpToolsPendingReg: '等待注册',
  mcpToolsPendingRegTip: '工具名来自历史缓存：进程还在连接，注册完成后数量会自动更新为实际值。',
  // 全局一票否决（工具级）
  mcpToolGlobalOff: '全局已停用',
  mcpToolGlobalOffTip: '全局已停用：该工具在「全部 Agent」层被关闭 —— 一票否决，所有预设都不可见、不可调用（预设层不可拨动）。各预设原有的个性化设置已保留，全局恢复后自动还原。',
  // 一键全禁 / 全开
  mcpToolAllAria: '「{name}」的全部工具',
  mcpToolAllEnable: '开启该 MCP 的全部工具',
  mcpToolAllDisable: '一键禁用该 MCP 的全部工具（只关工具，保留连接）',
  mcpToolAllPartial: '部分工具已禁用',
  // 遮蔽安装诊断
  mcpMaskInstallFailed: '遮蔽未在运行期生效：{message}',
  mcpMaskNoAgent: '遮蔽已写入，但该预设当前没有活动会话 —— 新会话起生效。',
  mcpMaskNoDeny: '遮蔽已写入，但运行期还没拒到任何工具（该 MCP 可能尚未注册工具）。若对话里仍能看到它的工具，请重开会话或重启 DSH。',
  mcpSearchServers: '搜索 Server 名称或工具…',
  mcpListFilteredEmpty: '没有符合筛选条件的 Server',
  mcpToolsUnavailable: '工具不可用',
  // 工具级启停（卡片上的工具 chips）
  mcpToolsHint: '点击工具名可单独启停：绿 = 启用，灰 = 禁用。',
  mcpToolChipsAria: '「{name}」提供的工具',
  mcpToolClickEnable: '点击启用该工具',
  mcpToolClickDisable: '点击禁用该工具',
  mcpToolDisabledCount: '{n} 个工具已禁用',
  // 粘贴添加（JSON / DSH 原生 YAML）
  mcpPasteHint: '粘贴其它 harness 的 JSON（.mcp.json 的 mcpServers 映射）或 DSH 原生 YAML（也接受 mcp-client 行片段）；写入 {scope}。',
  mcpPasteScopeGlobal: '全局 profile patch（所有预设共用，热重载即时生效）',
  mcpPasteScopePreset: '预设专属',
  mcpPasteFormat: '粘贴格式',
  mcpPasteNative: '原生',
  mcpPasteParsed: '解析出 {n} 个 server：{names}',
  mcpPasteCheck: '校验并预览',
  mcpPasteChecking: '校验中…',
  mcpPasteAdding: '写入中…',
  mcpPasteAdded: '已添加 {added} 个，跳过 {skipped} 个已存在',
  mcpPasteFailed: '添加失败',
  mcpRemoveConfirmTitle: '移除 MCP Server',
  mcpRemoveConfirmMsg: '将从 cordis.patch.yml 中删除「{name}」条目，其工具随即注销且不可恢复；如需恢复请重新添加。',
  mcpLiveRemoveFailed: '移除失败（配置写保护或条目缺失）',
  mcpCopyDone: '已复制 ✓',
  mcpCopyHint: '已复制配置片段，请粘贴到 cordis.patch.yml 后重启 DSH 生效',
  mcpLogNewNote: '桥接式 MCP（cordis.patch.yml 配置）无本地连接日志：连接状态以「MCP Server」页真实注册为准；此页仅展示旧版面板的本地记录。',
  // 右侧信息栏（图三）
  mcpWhatTitle: '什么是 MCP?',
  mcpWhatDesc: 'MCP (Model Contest Protocol) 是一个开放协议，它标准化了应用程序向 LLM 提供上下文和工具的方式。',
  mcpPoint1: '标准化', mcpPoint1Desc: '统一的协议规范',
  mcpPoint2: '安全可控', mcpPoint2Desc: '权限管理，安全访问',
  mcpPoint3: '可扩展', mcpPoint3Desc: '轻松集成新的工具和服务',
  mcpPoint4: '互操作', mcpPoint4Desc: '跨平台、跨服务兼容',
  mcpHowTitle: 'MCP 工作原理',
  mcpAgent: 'Agent', mcpClient: 'MCP Client', mcpServerNode: 'MCP Server',
  mcpReq: '请求', mcpResp: '响应', mcpCall: '调用', mcpExt: '外部工具 / 数据库 / 函数',
  mcpStartTitle: '快速上手',
  mcpStep1: '添加 MCP Server', mcpStep1Desc: '配置或导入 MCP Server 连接信息',
  mcpStep2: '授权与配置', mcpStep2Desc: '设置访问权限和必要的配置',
  mcpStep3: '使用与优化', mcpStep3Desc: '在对话中调用 MCP 工具，持续优化配置',
  mcpIntroTitle: 'MCP 快速了解', mcpIntroDesc: '了解 MCP 的作用、工作原理与快速上手',
  mcpIntroBtn: '了解 MCP', mcpOverlayTitle: '了解 MCP',
  mcpNavTitle: 'MCP',
  mcpComingDesc: '功能开发中，敬请期待',
  // 分组行 / 更多菜单 / 分页
  nameAsc: '升序', nameDesc: '降序', moreActions: '更多操作',
  totalItems: '共 {n} 条', pageSize: '{n} 条/页', pagePrev: '上一页', pageNext: '下一页',
  // 空技能包 / 失效引用 / 操作反馈
  bundleEmptyTitle: '这个技能包还是空的',
  bundleEmptyHint: '上传技能时在这里选它归组，或从散装技能卡片点「+」归入。',
  bundleUploadHere: '上传技能到此包',
  bundleMissingN: '账本里有 {n} 个技能已不存在',
  bundlePrune: '清理失效引用',
  pruned: '已清理失效引用',
  installedOk: '已安装技能「{name}」',
  deletedOk: '已删除技能「{name}」',
  removedOk: '已从技能包移出「{name}」',
  assignOk: '已把「{name}」归入技能包',
  bundleCreated: '已创建技能包「{name}」，上传技能时可直接归入它',
  bundleDeleted: '已删除技能包「{name}」，其中的技能变为散装',
  opFailed: '操作失败：{label} — {message}',
  installNameRewrite: 'SKILL.md 里写的是「{meta}」，安装时会统一改成「{name}」（目录名与技能名保持一致）。',
  deleteSkillDirNote: '（技能目录「{dir}」与技能名不同，会一并删除）',
  skillOffTag: '已停用',
  presetCountTip: '该预设下已启用 {n} 个 / 共 {total} 个技能',
}

function skillT(key: string, params?: Record<string, string | number>): string {
  let text = SKILL_ZH[key] ?? key
  if (params) {
    for (const k of Object.keys(params)) text = text.split(`{${k}}`).join(String(params[k]))
  }
  return text
}

/** ---------------------------------------------------------------- 技能包分类 */

/** 建议分类：点一下就挂上；也允许自己写，账本里存的就是字符串本身。 */
const PRESET_BUNDLE_CATEGORIES = ['开发', '设计', '办公协同', '文档知识', '数据', '自动化', '运维', '其他']

/** 分类筛选里代表「没挂任何分类的包」的哨兵值（不会是合法分类名）。 */
const UNCATEGORIZED = '\u0000none'

/** 一个技能包最多挂几个分类（与 host 的 CATEGORY_MAX_PER_BUNDLE 对齐）。 */
const MAX_BUNDLE_CATEGORIES = 8

/** 分类不做逐类配色：一个面板只有主题蓝一把刷子（彩虹色板实测太吵，已否）。 */

/** 分类名单排序：按挂载的包数从多到少，同数按名字。 */
function sortCategories(counts: Map<string, number>): string[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
    .map((entry) => entry[0])
}

/** ---------------------------------------------------------------- 统计卡图标（实心渐变，与设计稿一致） */

/** 蓝色实心立方体（管理的技能）。 */
function StatCubeIcon({ size = 20 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 3 20.4 7.4 12 11.8 3.6 7.4Z" fill="#6C92FF" />
      <path d="M12 11.8 20.4 7.4v9.2L12 21Z" fill="#2A55F2" />
      <path d="M12 11.8 3.6 7.4v9.2L12 21Z" fill="#174BFC" />
      <path d="M12 3 20.4 7.4 12 11.8 3.6 7.4Z" fill="none" stroke="#FFFFFF" strokeWidth="0.9" strokeLinejoin="round" opacity=".9" />
    </svg>
  )
}

/** 绿色实心圆 + 白色对勾（全局启用）。 */
function StatCheckCircleIcon({ size = 20 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="9.4" fill="#0FC566" />
      <path d="M7.9 12.3 10.7 15.1 16.2 9.2" fill="none" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** 紫色实心圆角方块 + 白色内格（散装技能）。 */
function StatSquareIcon({ size = 20 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.2" fill="#6C33F2" />
      <path d="M7.8 7.8h8.4v8.4H7.8Z" fill="#FFFFFF" opacity=".92" />
      <path d="M7.8 7.8h4.2v4.2H7.8ZM12 12h4.2v4.2H12Z" fill="#6C33F2" />
    </svg>
  )
}

/** 橙色实心心形 + 白色高光点（技能健康）。 */
function StatHeartIcon({ size = 20 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 20.6C7.2 17.2 3.9 14 3.9 10.2 3.9 7.3 6.2 5.2 8.8 5.2c1.4 0 2.6.6 3.2 1.6.6-1 1.8-1.6 3.2-1.6 2.6 0 4.9 2.1 4.9 5 0 3.8-3.3 7-8.1 10.4z" fill="#F4502A" />
      <circle cx="8.9" cy="9.3" r="1.6" fill="#FFFFFF" opacity=".95" />
    </svg>
  )
}

/** ---------------------------------------------------------------- 左栏/工具栏小图标（线框风格 currentColor） */

function catStroke(): { fill: 'none'; stroke: 'currentColor'; strokeWidth: number; strokeLinecap: 'round'; strokeLinejoin: 'round' } {
  return { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
}

/** 全部：蓝方内白四格（active 主导色）。 */
function CatAllIcon({ size = 16 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill="currentColor" />
      <path d="M9.2 9.2h5.6v5.6H9.2Z" fill="#FFFFFF" opacity=".92" />
    </svg>
  )
}

/** 小锁：该工具在「全部 Agent」层被停用（全局一票否决，预设层不可拨动）。 */
function LockGlyph({ size = 10 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...catStroke()} strokeWidth={2}>
      <rect x="5" y="10.5" width="14" height="9" rx="2.4" />
      <path d="M8.2 10.5V8.4a3.8 3.8 0 0 1 7.6 0v2.1" />
    </svg>
  )
}

/** 拖放云图标。 */
function CloudUpIcon({ size = 18 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...catStroke()}>
      <path d="M17.7 9.5A5.2 5.2 0 0 0 7.6 8.2 4 4 0 0 0 6.5 16h10.9a3.8 3.8 0 0 0 .5-7.6Z" />
      <path d="M12 17.5v-5M9.6 14.6 12 12.2l2.4 2.4" />
    </svg>
  )
}

/** 名称排序箭头（↑/↓）。 */
function SortDirIcon({ dir, size = 12 }: { dir: 'asc' | 'desc'; size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...catStroke()}>
      {dir === 'asc' ? <path d="M12 19V5M5.8 10.8 12 4.6l6.2 6.2" /> : <path d="M12 5v14M5.8 13.2 12 19.4l6.2-6.2" />}
    </svg>
  )
}

/** 分组行蓝色文件夹（实心）。 */
function FolderBlueIcon({ size = 17 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M3.5 7.2a2.2 2.2 0 0 1 2.2-2.2h4l2 2.1h6.6a2.2 2.2 0 0 1 2.2 2.2v7.5a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2Z" fill="var(--dsw-alias-state-business-primary,#3d6be5)" />
      <path d="M3.5 9.5h17v1.6a2.2 2.2 0 0 0-2.2-2.2H5.7a2.2 2.2 0 0 0-2.2 2Z" fill="#FFFFFF" opacity=".25" />
    </svg>
  )
}

/** 右箭头（指南按钮）。 */
function ArrowRightIcon({ size = 13 }: { size?: number }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...catStroke()}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}


/** 快速上手指南：底部 3D 书本插图 + 星点装饰。 */
function GuideArtIcon(): JSX.Element {
  return (
    <svg width="150" height="86" viewBox="0 0 150 86" aria-hidden="true">
      <defs>
        <linearGradient id="skm-guide-book" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9DB7F7" />
          <stop offset="1" stopColor="#6E8FF0" />
        </linearGradient>
        <linearGradient id="skm-guide-page" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D9E4FF" />
        </linearGradient>
      </defs>
      {/* 背面书页 (右) */}
      <path d="M96 34 L141 52 L120 66 L78 50 Z" fill="url(#skm-guide-page)" stroke="#C7D6F7" strokeWidth="1" />
      {/* 背面书页 (左) */}
      <path d="M84 32 L50 52 L28 44 L64 26 Z" fill="url(#skm-guide-page)" stroke="#C7D6F7" strokeWidth="1" />
      {/* 书封面底座 */}
      <path d="M64 26 L96 34 L78 50 L50 52 Z" fill="url(#skm-guide-book)" stroke="var(--dsw-alias-state-business-primary,#5b82e5)" strokeWidth="1" />
      <path d="M50 52 L28 44 L30 56 L52 66 Z" fill="#B7C9F5" stroke="var(--dsw-alias-state-business-primary,#5b82e5)" strokeWidth="1" />
      <path d="M78 50 L120 66 L118 78 L76 62 Z" fill="#A9BEF1" stroke="var(--dsw-alias-state-business-primary,#5b82e5)" strokeWidth="1" />
      {/* 封面上的圆形徽章 */}
      <circle cx="73" cy="44" r="9" fill="#FFFFFF" opacity=".85" />
      <circle cx="73" cy="44" r="5.5" fill="#6E8FF0" />
      {/* 星点装饰 */}
      <path d="M118 10c.6 2.6 1.6 3.6 4.2 4.2-2.6.6-3.6 1.6-4.2 4.2-.6-2.6-1.6-3.6-4.2-4.2 2.6-.6 3.6-1.6 4.2-4.2Z" fill="#BCCFFF" />
      <path d="M126 26c.4 1.7 1 2.3 2.7 2.7-1.7.4-2.3 1-2.7 2.7-.4-1.7-1-2.3-2.7-2.7 1.7-.4 2.3-1 2.7-2.7Z" fill="#C9D9FF" />
      <circle cx="111" cy="24" r="2" fill="#C9D9FF" />
    </svg>
  )
}

/** ---------------------------------------------------------------- 快速上手指南面板（右侧栏） */

/** 能力小卡图标（stroke currentColor）。 */
function CapIcon({ kind, size = 17 }: { kind: 'ui' | 'code' | 'doc' | 'data' | 'tool'; size?: number }): JSX.Element {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true } as const
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  if (kind === 'ui') {
    return (
      <svg {...common} {...s}><rect x="4" y="4" width="6.5" height="6.5" rx="1.4" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" /></svg>
    )
  }
  if (kind === 'code') {
    return (
      <svg {...common} {...s}><path d="M9 7.5 5.5 12 9 16.5M15 7.5 18.5 12 15 16.5" /></svg>
    )
  }
  if (kind === 'doc') {
    return (
      <svg {...common} {...s}><path d="M6.5 4.5h7l4 4v11h-11Z" /><path d="M13.5 4.5v4h4M9 13h6M9 16h4.5" /></svg>
    )
  }
  if (kind === 'data') {
    return (
      <svg {...common} {...s}><path d="M5 19h14M7 16v-5M12 16V8M17 16v-8.5" /></svg>
    )
  }
  return (
    <svg {...common} {...s}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
  )
}

/** 右侧指南浮层卡（点击「开始学习」出现，不压缩面板；参考设计稿窄栏内容）。 */
function GuidePanel({ t, onClose, left, top, height }: {
  t: (key: string) => string
  onClose: () => void
  left: number
  top: number
  height: number
}): JSX.Element {
  const caps: Array<[string, 'ui' | 'code' | 'doc' | 'data' | 'tool']> = [
    [t('guideCapUi'), 'ui'], [t('guideCapCode'), 'code'], [t('guideCapDoc'), 'doc'],
    [t('guideCapData'), 'data'], [t('guideCapTool'), 'tool'],
  ]
  const steps: Array<[number, string, string]> = [
    [1, t('guideStep1'), t('guideStep1Desc')],
    [2, t('guideStep2'), t('guideStep2Desc')],
    [3, t('guideStep3'), t('guideStep3Desc')],
    [4, t('guideStep4'), t('guideStep4Desc')],
  ]
  const bests = [t('guideBest1'), t('guideBest2'), t('guideBest3'), t('guideBest4')]
  return createPortal(
    <aside
      className={css.guidePanel}
      role="complementary"
      aria-label={t('guidePanelTitle')}
      style={{ left, top, height }}
    >
      <div className={css.guidePanelHead}>
        <span className={css.guidePanelLogo}><GuideArtIconSmall /></span>
        <span className={css.guidePanelTitle}>{t('guidePanelTitle')}</span>
        <button type="button" className={css.guidePanelClose} aria-label={t('guideClose')} onClick={onClose}>
          <IconCloseOutline16 size={14} aria-hidden="true" />
        </button>
      </div>

      <div className={css.guidePanelBody}>
        {/* 什么是 Skill */}
        <section className={css.guideSec}>
          <div className={css.guideSecHead}>
            <span className={css.guideSecIcon}><IconSkillOutline16 size={14} aria-hidden="true" /></span>
            <span className={css.guideSecTitle}>{t('guideWhat')}</span>
          </div>
          <p className={css.guideWhatDesc}>{t('guideWhatDesc')}</p>
          <div className={css.guideCaps}>
            {caps.map(([label, kind]) => (
              <span key={label} className={css.guideCap}>
                <span className={css.guideCapIcon}><CapIcon kind={kind} /></span>
                <span className={css.guideCapLabel}>{label}</span>
              </span>
            ))}
          </div>
        </section>

        {/* 四步流程 */}
        <section className={css.guideSec}>
          {steps.map(([num, title, desc]) => (
            <div key={num} className={css.guideStep}>
              <span className={css.guideStepNum}>{num}</span>
              <div className={css.guideStepBody}>
                <div className={css.guideStepTitleRow}>
                  <span className={css.guideStepTitle}>{title}</span>
                  <IconChevronRightOutline14 className={css.guideStepArrow} size={12} aria-hidden="true" />
                </div>
                <p className={css.guideStepDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* 最佳实践 */}
        <section className={css.guideBest}>
          <div className={css.guideBestTitle}>{t('guideBest')}</div>
          <ul className={css.guideBestList}>
            {bests.map((item) => (
              <li key={item} className={css.guideBestItem}>
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
          <button type="button" className={css.guideMoreBtn} onClick={onClose}>
            <span>{t('guideMoreBest')}</span>
            <ArrowRightIcon size={12} />
          </button>
          <span className={css.guideBestArt} aria-hidden="true"><GuideArtIcon /></span>
        </section>
      </div>
    </aside>,
    document.body,
  )
}



/**
 * MCP 顶栏：与技能页同构的预设 chips（全部 + 各预设，数字 = 该层可见 Server 数）
 * + 启用状态分段。摆在主区之上，与技能页同一位置、同一套类名。
 */
function McpTopBar({ t, live, scope, onScope, status, onStatus }: {
  t: (key: string, params?: Record<string, string | number>) => string
  live: LiveMcpStatus
  scope: string
  onScope: (value: string) => void
  status: 'all' | 'on' | 'off'
  onStatus: (value: 'all' | 'on' | 'off') => void
}): JSX.Element | null {
  if (live.state !== 'ready') return null
  const data = live.data
  const presets = data.presets ?? []
  if (presets.length === 0) return null
  const globals = data.servers ?? []
  const maskedOf = (presetId: string): Set<string> => new Set(
    Object.entries(data.masks?.[presetId] ?? {}).filter(([, on]) => on === false).map(([name]) => name),
  )
  /** 该预设可见的 Server 数 = 未被它遮蔽的全局 + 它自带的行。 */
  const visibleCount = (presetId: string): number => {
    const masked = maskedOf(presetId)
    return globals.filter(server => !masked.has(server.serverName)).length + (data.presetServers?.[presetId] ?? []).length
  }
  const chips: Array<{ id: string; label: string; count: number; overrides: number; icon: JSX.Element }> = [
    { id: '', label: t('presetAll'), count: globals.length, overrides: 0, icon: <CatAllIcon size={16} /> },
    ...presets.map(preset => ({
      id: preset.id,
      label: preset.name ?? preset.id,
      count: visibleCount(preset.id),
      overrides: maskedOf(preset.id).size,
      icon: <IconAgentPresetOutline16 size={15} />,
    })),
  ]
  return (
    <div className={css.topbar}>
      <div className={css.chipRow} role="group" aria-label={t('mcpScopeTitle')}>
        {chips.map(chip => (
          <button
            key={chip.id === '' ? '__all__' : chip.id}
            type="button"
            className={`${css.catItem} ${scope === chip.id ? css.catItemActive : ''}`}
            data-active={scope === chip.id || undefined}
            onClick={() => { onScope(chip.id) }}
          >
            <span className={css.catIcon} data-active={scope === chip.id || undefined}>{chip.icon}</span>
            <span className={css.catLabel}>{chip.label}</span>
            <span
              className={css.catCount}
              data-warn={chip.overrides > 0 || undefined}
              title={chip.id === ''
                ? t('mcpScopeAllTip', { n: chip.count })
                : t('mcpScopePresetTip', { n: chip.count })
                  + (chip.overrides > 0 ? ` · ${t('mcpScopeOverrideCount', { n: chip.overrides })}` : '')}
            >
              {chip.count}
            </span>
          </button>
        ))}
      </div>
      <div className={css.statusSeg} role="group" aria-label={t('statusAll')}>
        {([['all', t('statusAll')], ['on', t('statusOn')], ['off', t('statusOff')]] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`${css.statusSegBtn} ${status === value ? css.statusSegActive : ''}`}
            data-active={status === value || undefined}
            aria-pressed={status === value}
            onClick={() => { onStatus(value) }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * 工具 chips：卡片上列出该 MCP 提供的**全部**工具名，绿 = 启用、灰 = 禁用，
 * 点击即切换（单个工具级 disabled，见 host 的 mcp-tool-disable）。
 *
 * 名单 = 注册工具 ∪ 账本禁用名：被禁用的工具在 agent 作用域里已被隐藏
 * （restrict），但账本仍留着名字，所以还能点回来。
 */
/** 卡片要列出的工具全名：注册列表 ∪ 账本禁用名（被隐藏的也要能点回来）。 */
function mcpToolNames(tools: LiveMcpTool[], disabledTools: string[]): string[] {
  const known = new Set(tools.map(tool => tool.name))
  return [...tools.map(tool => tool.name), ...disabledTools.filter(name => !known.has(name))]
}

function McpToolChips({ t, serverName, tools, disabledTools, locked, busy, onToggle }: {
  t: (key: string, params?: Record<string, string | number>) => string
  serverName: string
  tools: LiveMcpTool[]
  disabledTools: string[]
  /** 预设范围下「全局层已禁用」的名字：预设层只能加禁，不能打开它们。 */
  locked?: ReadonlySet<string>
  busy: string | null
  onToggle: (fullName: string, enabled: boolean) => void
}): JSX.Element | null {
  const prefix = `mcp__${serverName}__`
  const names = mcpToolNames(tools, disabledTools)
  if (names.length === 0) return null
  const off = new Set(disabledTools)
  return (
    <div className={css.mcpToolChips} role="group" aria-label={t('mcpToolChipsAria', { name: serverName })}>
      {names.map((name) => {
        const disabled = off.has(name)
        const isLocked = locked?.has(name) === true
        const short = name.startsWith(prefix) ? name.slice(prefix.length) : name
        const description = tools.find(tool => tool.name === name)?.description ?? ''
        return (
          <button
            key={name}
            type="button"
            className={css.mcpToolChip}
            data-on={disabled ? undefined : 'true'}
            data-locked={isLocked || undefined}
            data-busy={busy === name || undefined}
            disabled={busy !== null || isLocked}
            aria-pressed={!disabled}
            title={isLocked
              ? `${t('mcpToolGlobalOffTip')}\n${name}`
              : `${disabled ? t('mcpToolClickEnable') : t('mcpToolClickDisable')}\n${name}${description === '' ? '' : `\n${description}`}`}
            onClick={() => { onToggle(name, disabled) }}
          >
            {isLocked && <LockGlyph size={9} />}
            {short}
          </button>
        )
      })}
    </div>
  )
}

/**
 * MCP 页（与技能页同构）：四张统计卡 + 当前编辑层提示行 + 工具条（搜索 / 刷新 /
 * 添加）+ Server 列表。列表固定两块——「继承的全局 Server」（预设层开关 = 遮蔽）
 * 与「该预设专属 Server」（写进该预设组合文件）；「全部 Agent」层只有前者，
 * 开关直接启用/禁用全局条目。
 */
function McpPage({ t, live, scope, query, onQuery, status, onAddCustom, onRefresh, waitingTools, onWatchTools }: {
  t: (key: string, params?: Record<string, string | number>) => string
  live: LiveMcpStatus
  scope: string
  query: string
  onQuery: (value: string) => void
  status: 'all' | 'on' | 'off'
  onAddCustom: () => void
  onRefresh: () => void
  /** 正在等待注册工具的 Server（面板在轮询，无需用户手动刷新）。 */
  waitingTools: string[]
  /** 让面板开始轮询这些 Server 的工具注册（启用后自动等）。 */
  onWatchTools: (names: string[]) => void
}): JSX.Element {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [addOwnOpen, setAddOwnOpen] = useState(false)
  /** 正在切换的工具全名（防连点）。 */
  const [toolBusy, setToolBusy] = useState<string | null>(null)
  /** 全局条目删除确认（null=关闭）。 */
  const [removeReq, setRemoveReq] = useState<string | null>(null)
  /** 预设专属行移除确认（null=关闭）。 */
  const [removeOwnReq, setRemoveOwnReq] = useState<string | null>(null)

  const ready = live.state === 'ready' ? live.data : null
  const globals = ready?.servers ?? []
  const presets = ready?.presets ?? []
  const scoped = scope === '' ? undefined : presets.find(preset => preset.id === scope)
  const masked = new Set(Object.entries(ready?.masks?.[scope] ?? {})
    .filter(([, on]) => on === false).map(([name]) => name))
  const ownRows = scope === '' ? [] : (ready?.presetServers?.[scope] ?? [])
  const ownNames = new Set(ownRows.map(row => row.serverName))
  /* 工具级禁用两层账本：有效禁用 = 全局层 ∪ 当前预设层（预设层只加禁，不打开）。
   * 预设自带的卡只看预设层 —— 与继承来的全局 Server 彻底分离（不同名前缀也不会互相牵连）。 */
  const globalOff = ready?.toolDisabled ?? {}
  const presetTables = ready?.toolDisabledByPreset ?? {}
  /**
   * 某条「行」的有效禁用集合（同名也彻底独立）：
   *   inherit（继承的全局行）= 全局层 ∪ inherit 条目；own（预设自带行）= 仅 own 条目。
   * 两条行各记一份账，互不牵连 —— 撤掉其中一条时另一条的设置各自生效。
   */
  const offOf = (serverName: string, owner: 'own' | 'inherit'): string[] => {
    const entry = presetTables[scope]?.[serverName]
    if (owner === 'own') return entry?.own ?? []
    if (scope === '') return globalOff[serverName] ?? []
    return [...new Set([...(globalOff[serverName] ?? []), ...(entry?.inherit ?? [])])]
  }
  /** 全局层已禁用的名字：继承行无法在预设层打开它（与技能面板同模型）。 */
  const lockedOf = (serverName: string): Set<string> => new Set(scope === '' ? [] : globalOff[serverName] ?? [])
  /**
   * 遮蔽诊断：账本里标了「已遮蔽」但运行期一个工具都没拒到（或安装报错）时
   * 给出说明 —— 以前这种情况是静默的，面板看着「已遮蔽」但模型端工具照旧可见。
   */
  const maskInstall = ready?.maskInstall?.[scope]
  const maskWarn: string | null = (() => {
    if (scope === '' || masked.size === 0 || maskInstall === undefined) return null
    if (maskInstall.errors.length > 0) return t('mcpMaskInstallFailed', { message: maskInstall.errors[0]! })
    if (maskInstall.agents === 0) return t('mcpMaskNoAgent')
    if (maskInstall.deniedAgents === 0) return t('mcpMaskNoDeny')
    return null
  })()

  /** 统一写请求：成功刷新数据，失败收集错误文案。 */
  const write = (token: string, url: string, payload: Record<string, unknown>): void => {
    if (busy !== null) return
    setBusy(token)
    setError(null)
    void fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
        if (response.ok && body?.ok === true) { onRefresh(); return }
        throw new Error(body?.error ?? String(response.status))
      })
      .catch((cause: unknown) => { setError(cause instanceof Error ? cause.message : String(cause)) })
      .finally(() => { setBusy(null) })
  }
  const toggleGlobal = (serverName: string, disabled: boolean): void => {
    write(`toggle:${serverName}`, '/api/triad/mcp-config', { serverName, disabled })
  }
  const removeGlobal = (serverName: string): void => {
    write(`remove:${serverName}`, '/api/triad/mcp-config', { serverName, action: 'remove' })
  }
  const setMasked = (serverName: string, enabled: boolean): void => {
    if (busy !== null) return
    setBusy(`mask:${serverName}`)
    setError(null)
    void fetch(`/api/triad/mcp-masks/${encodeURIComponent(scope)}/${encodeURIComponent(serverName)}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ enabled }),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
        if (response.ok && body?.ok === true) { onRefresh(); return }
        throw new Error(body?.error ?? String(response.status))
      })
      .catch((cause: unknown) => { setError(cause instanceof Error ? cause.message : String(cause)) })
      .finally(() => { setBusy(null) })
  }
  /**
   * 工具级启停（单条或多条一批）：`PUT /api/triad/mcp-tools/<server>`
   * `{ enabled, tools, preset?, source? }`。范围决定写哪条「行」：
   * 「全部 Agent」→ 全局行；某个预设 → 该预设层（`source` 指定哪条行）。
   */
  const putTools = (serverName: string, names: string[], enabled: boolean, source: 'own' | 'inherit'): void => {
    if (names.length === 0 || toolBusy !== null || busy !== null) return
    setToolBusy(names[0]!)
    setError(null)
    void fetch(`/api/triad/mcp-tools/${encodeURIComponent(serverName)}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ enabled, tools: names, ...(scope === '' ? {} : { preset: scope, source }) }),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
        if (response.ok && body?.ok === true) { onRefresh(); return }
        throw new Error(body?.error ?? String(response.status))
      })
      .catch((cause: unknown) => { setError(cause instanceof Error ? cause.message : String(cause)) })
      .finally(() => { setToolBusy(null) })
  }
  const toggleTool = (serverName: string, fullName: string, enabled: boolean, source: 'own' | 'inherit'): void => {
    putTools(serverName, [fullName], enabled, source)
  }
  const removeOwn = (serverName: string): void => {
    if (busy !== null) return
    setBusy(`own:${serverName}`)
    setError(null)
    void fetch(`/api/triad/mcp-presets/${encodeURIComponent(scope)}/servers/${encodeURIComponent(serverName)}`, {
      method: 'DELETE', headers: { accept: 'application/json' },
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
        if (response.ok && body?.ok === true) { onRefresh(); return }
        throw new Error(body?.error ?? String(response.status))
      })
      .catch((cause: unknown) => { setError(cause instanceof Error ? cause.message : String(cause)) })
      .finally(() => { setBusy(null) })
  }
  /** 一键清空该预设的遮蔽（顺序逐个取消，避免并发写账本互相覆盖）。 */
  const clearMasks = (): void => {
    if (busy !== null || masked.size === 0) return
    setBusy('mask:__all__')
    setError(null)
    const names = [...masked]
    void (async () => {
      for (const serverName of names) {
        const response = await fetch(`/api/triad/mcp-masks/${encodeURIComponent(scope)}/${encodeURIComponent(serverName)}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ enabled: true }),
        })
        const body = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
        if (!(response.ok && body?.ok === true)) throw new Error(body?.error ?? String(response.status))
      }
      onRefresh()
    })()
      .catch((cause: unknown) => { setError(cause instanceof Error ? cause.message : String(cause)) })
      .finally(() => { setBusy(null) })
  }

  /* 过滤：搜索命中 serverName 或工具名；状态档在全局层看启用状态、预设层看遮蔽。 */
  const needle = query.trim().toLowerCase()
  const shownGlobals = globals.filter(server => (needle === ''
    || server.serverName.toLowerCase().includes(needle)
    || server.tools.some(tool => tool.name.toLowerCase().includes(needle)))
    && (status === 'all'
      || (scope === '' ? (status === 'off' ? server.config.disabled : !server.config.disabled)
        : (status === 'off' ? masked.has(server.serverName) : !masked.has(server.serverName)))))
  const shownOwn = ownRows.filter(row => needle === ''
    || row.serverName.toLowerCase().includes(needle)
    || row.summary.toLowerCase().includes(needle))

  const ownTotal = Object.values(ready?.presetServers ?? {}).reduce((sum, rows) => sum + rows.length, 0)
  const disabledCount = globals.filter(server => server.config.disabled).length
  const statCards: Array<{ tone: string; icon: JSX.Element; label: string; value: string | number; desc: string; warn?: boolean }> = [
    { tone: 'blue', icon: <StatCubeIcon size={20} />, label: t('mcpStatManaged'), value: globals.length + ownRows.length, desc: t('mcpStatManagedDesc') },
    { tone: 'green', icon: <StatCheckCircleIcon size={20} />, label: t('mcpStatGlobal'), value: globals.length, desc: t('mcpStatGlobalDesc') },
    { tone: 'violet', icon: <StatSquareIcon size={20} />, label: t('mcpStatOwn'), value: ownTotal, desc: t('mcpStatOwnDesc') },
    {
      tone: 'orange',
      icon: <StatHeartIcon size={20} />,
      label: t('mcpStatHealth'),
      value: disabledCount === 0 ? t('mcpHealthOk') : t('mcpHealthWarn', { n: disabledCount }),
      desc: t('mcpStatHealthDesc'),
      warn: disabledCount > 0,
    },
  ]

  return (
    <div className={css.mcpServerMain}>
      {/* 统计行（与技能页同构的四张卡） */}
      <div className={css.statsRow} data-mcp="true">
        {statCards.map(card => (
          <div key={card.label} className={css.stat}>
            <span className={css.statIconCol}>
              <span className={css.statIcon} data-tone={card.tone}>{card.icon}</span>
              <i className={css.statGlow} data-tone={card.tone} aria-hidden="true" />
            </span>
            <span className={css.statBody}>
              <span className={css.statLabel}>{card.label}</span>
              <span className={css.statValueRow}>
                <span className={css.statValue} data-tone={card.warn === true ? 'warn' : undefined}>{card.value}</span>
              </span>
              <span className={css.statDesc}>{card.desc}</span>
            </span>
          </div>
        ))}
      </div>

      {/* 当前编辑层提示行（与技能页 hintRow 同构） */}
      <div className={css.hintRow}>
        <span className={css.hintRowText}>
          {scope === ''
            ? t('mcpScopeHintAll')
            : t('mcpScopeHintScoped', { name: scoped?.name ?? scope })}
        </span>
        {scope !== '' && masked.size > 0 && (
          <button type="button" className={css.presetReset} disabled={busy !== null} onClick={clearMasks}>
            {t('presetReset')}
          </button>
        )}
      </div>

      {/* 工具条：搜索 / 刷新 / 添加 */}
      <div className={css.toolbar}>
        <div className={css.searchBox}>
          <SearchIcon />
          <input
            className={css.searchInput}
            value={query}
            placeholder={t('mcpSearchServers')}
            aria-label={t('mcpSearchServers')}
            onChange={(event) => { onQuery(event.currentTarget.value) }}
          />
        </div>
        <span className={css.toolbarSpacer} />
        <button
          type="button"
          className={css.toolButton}
          style={{ height: 34, alignSelf: 'center' }}
          onClick={onRefresh}
        >
          {t('mcpLiveRefresh')}
        </button>
        {scope !== '' && (
          <button
            type="button"
            className={css.newBundleBtn}
            style={{ width: 'auto', marginTop: 0, height: 34, fontSize: 12 }}
            onClick={() => { setAddOwnOpen(true) }}
          >
            <IconPlusOutline16 size={14} aria-hidden="true" />
            {t('mcpPresetAddOwn')}
          </button>
        )}
        <button
          type="button"
          className={css.addBtn}
          style={{ height: 34, alignSelf: 'center' }}
          aria-label={t('mcpAddServer')}
          title={scope === '' ? undefined : t('mcpAddGlobalHint')}
          onClick={onAddCustom}
        >
          <IconPlusOutline16 size={15} aria-hidden="true" />
          {/* 预设范围下写明这一条是全局的：只想给当前预设用请走左侧的「添加专属 Server」。 */}
          {scope === '' ? t('mcpAddServer') : t('mcpAddServerGlobal')}
        </button>
      </div>

      {error !== null && <p className={css.error} role="alert">{t('mcpPresetFailed', { message: error })}</p>}

      {/* 遮蔽诊断：账本写了但运行期没拒到工具/安装报错时，明确说出来 */}
      {maskWarn !== null && <p className={css.error} role="alert">{maskWarn}</p>}

      {/* 添加/启用后的自动等待：面板在轮询，用户不用再手动点「刷新」 */}
      {waitingTools.length > 0 && (
        <p className={css.mcpEmptyList} role="status">{t('mcpWaitingTools', { names: waitingTools.join('、') })}</p>
      )}

      {live.state === 'unavailable' ? (
        <p className={css.mcpEmptyList}>{t('mcpLiveUnavailable')}</p>
      ) : (
        <>
          {/* ① 继承的全局 Server（预设层开关 = 遮蔽） */}
          <section className={css.mcpListCard}>
            <div className={css.mcpListHead}>
              <span className={css.mcpListTitle}>{scope === '' ? t('mcpListTitle') : t('mcpPresetGlobalSection')}</span>
              <span className={css.mcpListCount}>{shownGlobals.length}</span>
            </div>
            {scope !== '' && <p className={css.mcpEmptyList}>{t('mcpPresetMaskHint')}</p>}
            {shownGlobals.length === 0 ? (
              <p className={css.mcpEmptyList}>{globals.length === 0 ? t('mcpLiveEmpty') : t('mcpListFilteredEmpty')}</p>
            ) : (
              <div className={css.mcpRecGrid}>
                {shownGlobals.map((server) => {
                  const isMasked = masked.has(server.serverName)
                  const covered = ownNames.has(server.serverName)
                  const offTools = offOf(server.serverName, 'inherit')
                  const lockedTools = lockedOf(server.serverName)
                  const listed = server.tools.length
                  const pendingReg = isToolRegistrationPending(server.toolCount, listed)
                  /** 被「全部 Agent」层一票否决的工具数（预设视图里才可能 > 0）。 */
                  const lockedCount = mcpToolNames(server.tools, offTools).filter(name => lockedTools.has(name)).length
                  return (
                    <section key={`global-${server.serverName}`} className={css.mcpRecCard}>
                      <div className={css.mcpRecCardHead}>
                        <span className={css.mcpRecCardTitleRow}>
                          <span className={css.mcpRecCardName}>{server.serverName}</span>
                          <span className={css.mcpRecCardTags}>
                            {/* 数量跟随卡片实际列出的工具：进程还在连时先按名单缓存显示，并标出「等待注册」 */}
                            <span className={css.mcpRecCatTag}>
                              {server.toolCount > 0 ? server.toolCount : listed} {t('mcpLiveToolsOf')}
                            </span>
                            {pendingReg && (
                              <span className={css.mcpRecCatTag} data-off="true" title={t('mcpToolsPendingRegTip')}>
                                {t('mcpToolsPendingReg')}
                              </span>
                            )}
                            {/* 全局一票否决：预设层这些工具被强制置灰、不可拨动 */}
                            {lockedCount > 0 && (
                              <span className={css.mcpRecCatTag} data-locked="true" title={t('mcpToolGlobalOffTip')}>
                                {t('mcpToolGlobalOff')}{lockedCount > 1 ? ` ${lockedCount}` : ''}
                              </span>
                            )}
                            {offTools.length > 0 && (
                              <span className={css.mcpRecCatTag} data-off="true">{t('mcpToolDisabledCount', { n: offTools.length })}</span>
                            )}
                            {scope === ''
                              ? (server.config.disabled ? <span className={css.mcpRecCatTag}>{t('mcpLiveDisabled')}</span> : null)
                              : (isMasked ? <span className={css.mcpRecCatTag}>{t('mcpPresetMasked')}</span> : null)}
                          </span>
                        </span>
                        <Tooltip
                          label={scope === ''
                            ? (server.config.disabled ? t('enableSkill') : t('mcpLiveDisabled'))
                            : covered
                              ? t('mcpPresetCoveredSwitchHint')
                              : isMasked ? t('enableSkill') : t('mcpPresetMasked')}
                          side="bottom"
                          delayMs={500}
                        >
                          <button
                            type="button"
                            role="switch"
                            aria-checked={scope === '' ? !server.config.disabled : !isMasked}
                            aria-label={scope === '' ? t('mcpLiveDisabled') : t('mcpPresetMasked')}
                            className={`${css.toggle} ${(scope === '' ? server.config.disabled : isMasked) ? css.toggleOff : css.toggleOn}`}
                            /* 预设层：即使该预设自带同名 Server，也允许遮蔽全局这一条 ——
                             * 遮蔽是「本预设不要全局那份」的持久表达，等自带的被移除后即刻生效。 */
                            disabled={busy !== null || (scope === '' && !server.config.editable)}
                            onClick={() => {
                              if (scope === '') {
                                const nextDisabled = !server.config.disabled
                                toggleGlobal(server.serverName, nextDisabled)
                                // 启用 = 重新拉起进程并注册工具：开始轮询，别让用户等 / 手点刷新。
                                if (!nextDisabled) onWatchTools([server.serverName])
                              } else setMasked(server.serverName, isMasked)
                            }}
                          >
                            <span className={css.toggleKnob} aria-hidden="true" />
                          </button>
                        </Tooltip>
                      </div>
                      <p className={css.mcpRecCardDesc}>
                        {server.config.disabled && scope === '' && server.tools.length === 0
                          ? `${t('mcpLiveDisabled')} · ${t('mcpToolsUnavailable')}`
                          : t('mcpToolsHint')}
                      </p>
                      <McpToolChips
                        t={t}
                        serverName={server.serverName}
                        tools={server.tools}
                        disabledTools={offTools}
                        locked={lockedTools}
                        busy={toolBusy}
                        onToggle={(fullName, enabled) => { toggleTool(server.serverName, fullName, enabled, 'inherit') }}
                      />
                      <div className={css.mcpCardFoot}>
                        <span className={css.mcpCardItem}>
                          <span className={css.mcpCardItemLabel}>
                            {scope === '' ? t('mcpLiveConfigHint')
                              : covered
                                ? (isMasked ? t('mcpPresetCoveredMasked') : t('mcpPresetCovered'))
                                : isMasked ? t('mcpPresetMasked') : t('mcpPresetMaskState')}
                          </span>
                        </span>
                        {scope === '' && server.config.editable ? (
                          <button
                            type="button"
                            className={css.mcpCardDelete}
                            title={t('mcpRemove')}
                            disabled={busy !== null}
                            onClick={() => { setRemoveReq(server.serverName) }}
                          >
                            <IconTrashOutline16 size={13} aria-hidden="true" />{t('mcpRemove')}
                          </button>
                        ) : null}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </section>

          {/* ② 该预设专属 Server（写进该预设组合文件） */}
          {scope !== '' && (
            <section className={css.mcpListCard} style={{ marginTop: 12 }}>
              <div className={css.mcpListHead}>
                <span className={css.mcpListTitle}>{t('mcpPresetOwnSection')}</span>
                <span className={css.mcpListCount}>{shownOwn.length}</span>
              </div>
              <p className={css.mcpEmptyList}>{t('mcpPresetOwnHint')}</p>
              {scoped?.trust === 'system' && <p className={css.mcpEmptyList}>{t('mcpPresetStorageHint')}</p>}
              {shownOwn.length === 0 ? (
                <p className={css.mcpEmptyList}>{ownRows.length === 0 ? t('mcpPresetOwnEmpty') : t('mcpListFilteredEmpty')}</p>
              ) : (
                <div className={css.mcpRecGrid}>
                  {shownOwn.map(row => {
                    /* 预设自带的这条行只认 own 条目：全局行/继承行的设置与它互不影响。 */
                    const offOwn = offOf(row.serverName, 'own')
                    /** 一键全禁/全开：一次请求带上该行的全部工具名。 */
                    const ownToolNames = (row.tools ?? []).map(tool => tool.name)
                    const allDisabled = ownToolNames.length > 0 && ownToolNames.every(name => offOwn.includes(name))
                    return (
                    <section key={`own-${row.serverName}`} className={css.mcpRecCard}>
                      <div className={css.mcpRecCardHead}>
                        <span className={css.mcpRecCardTitleRow}>
                          <span className={css.mcpRecCardName}>{row.serverName}</span>
                          <span className={css.mcpRecCardTags}>
                            <span className={css.mcpRecCatTag}>{row.transport}</span>
                            <span className={css.mcpRecCatTag}>
                              {(row.registeredCount ?? 0) > 0 ? row.registeredCount : (row.tools?.length ?? 0)} {t('mcpLiveToolsOf')}
                            </span>
                            {isToolRegistrationPending(row.registeredCount ?? 0, row.tools?.length ?? 0) && (
                              <span className={css.mcpRecCatTag} data-off="true" title={t('mcpToolsPendingRegTip')}>
                                {t('mcpToolsPendingReg')}
                              </span>
                            )}
                            {globals.some(item => item.serverName === row.serverName) && (
                              <span className={css.mcpRecCatTag} data-shadow="true" title={t('mcpPresetShadowGlobalTip')}>
                                {t('mcpPresetShadowGlobalTag')}
                              </span>
                            )}
                            {offOwn.length > 0 && (
                              <span className={css.mcpRecCatTag} data-off="true">{t('mcpToolDisabledCount', { n: offOwn.length })}</span>
                            )}
                          </span>
                        </span>
                        {/* 一键全禁/全开：预设自带这台的「快速禁用全部工具」滑块 */}
                        <Tooltip
                          label={ownToolNames.length === 0
                            ? t('mcpToolsPendingRegTip')
                            : allDisabled
                              ? t('mcpToolAllEnable')
                              : offOwn.length > 0
                                ? `${t('mcpToolAllPartial')} · ${t('mcpToolAllDisable')}`
                                : t('mcpToolAllDisable')}
                          side="bottom"
                          delayMs={400}
                        >
                          <button
                            type="button"
                            role="switch"
                            aria-checked={!allDisabled}
                            aria-label={t('mcpToolAllAria', { name: row.serverName })}
                            className={`${css.toggle} ${allDisabled ? css.toggleOff : css.toggleOn}`}
                            disabled={busy !== null || toolBusy !== null || ownToolNames.length === 0}
                            onClick={() => { putTools(row.serverName, ownToolNames, allDisabled, 'own') }}
                          >
                            <span className={css.toggleKnob} aria-hidden="true" />
                          </button>
                        </Tooltip>
                      </div>
                      <p className={css.mcpRecCardDesc}>{row.summary}</p>
                      <McpToolChips
                        t={t}
                        serverName={row.serverName}
                        tools={row.tools ?? []}
                        disabledTools={offOwn}
                        busy={toolBusy}
                        onToggle={(fullName, enabled) => { toggleTool(row.serverName, fullName, enabled, 'own') }}
                      />
                      <div className={css.mcpCardFoot}>
                        <span className={css.mcpCardItem}>
                          <span className={css.mcpCardItemLabel}>{t('mcpPresetNewSession')}</span>
                        </span>
                        <button
                          type="button"
                          className={css.mcpCardDelete}
                          disabled={busy !== null}
                          onClick={() => { setRemoveOwnReq(row.serverName) }}
                        >
                          <IconTrashOutline16 size={13} aria-hidden="true" />{t('mcpRemove')}
                        </button>
                      </div>
                    </section>
                    )
                  })}
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* 预设专属添加：粘贴 JSON / DSH 原生 YAML */}
      <Modal
        open={addOwnOpen}
        onClose={() => { setAddOwnOpen(false) }}
        closeLabel={t('close')}
        title={`${t('mcpPresetAddOwn')} · ${scoped?.name ?? scope}`}
      >
        <McpPasteAdd
          t={t}
          presetId={scope}
          onAdded={(added) => { onRefresh(); onWatchTools(added) }}
          onCancel={() => { setAddOwnOpen(false) }}
        />
      </Modal>

      {/* 全局条目删除确认 */}
      {removeReq !== null && (
        <ConfirmDialog
          open
          title={t('mcpRemoveConfirmTitle')}
          message={t('mcpRemoveConfirmMsg', { name: removeReq })}
          confirmLabel={t('mcpRemove')}
          cancelLabel={t('cancel')}
          danger
          onConfirm={() => { const name = removeReq; setRemoveReq(null); removeGlobal(name) }}
          onClose={() => { setRemoveReq(null) }}
        />
      )}

      {/* 预设专属行移除确认（同名全局条目不受影响） */}
      {removeOwnReq !== null && (
        <ConfirmDialog
          open
          title={t('mcpOwnRemoveConfirmTitle')}
          message={t('mcpOwnRemoveConfirmMsg', { name: removeOwnReq })}
          confirmLabel={t('mcpRemove')}
          cancelLabel={t('cancel')}
          danger
          onConfirm={() => { const name = removeOwnReq; setRemoveOwnReq(null); removeOwn(name) }}
          onClose={() => { setRemoveOwnReq(null) }}
        />
      )}
    </div>
  )
}



/** 真实 MCP 状态（host /api/triad/mcp-status：ctx.tools 中 mcp__* 工具分组）。 */
interface LiveMcpTool {
  name: string
  description: string
}
interface LiveMcpServer {
  serverName: string
  toolCount: number
  tools: LiveMcpTool[]
  /** 配置文件条目信息（启用/禁用开关用）。 */
  config: { entryId: string | null; disabled: boolean; editable: boolean }
  /** 0.1.6：作用域（当前恒为 global）。 */
  scope?: string
  /** 0.1.6：哪些 Agent 预设遮蔽了它（账本镜像）。 */
  maskedBy?: string[]
}
/** 预设自带的 mcp-client 行（host 从预设组合文本解析）。 */
interface PresetMcpRowWire {
  entryId: string
  serverName: string
  transport: string
  summary: string
  /** 该 server 的工具（活动 agent 作用域 ∪ 名单缓存；无数据时缺省）。 */
  tools?: LiveMcpTool[]
}
interface LiveMcpState {
  at: string
  serverCount: number
  toolCount: number
  servers: LiveMcpServer[]
  /** 0.1.6：Agent 预设名单。 */
  presets?: PresetRow[]
  /** 0.1.6：presetId → { serverName: false }（显式遮蔽；缺省 = 继承全局）。 */
  masks?: Record<string, Record<string, boolean>>
  /** 0.1.6：presetId → 该预设自带的 mcp-client 行。 */
  presetServers?: Record<string, PresetMcpRowWire[]>
  /** 工具级禁用·全局层镜像：serverName → 禁用工具全名（所有预设生效）。 */
  toolDisabled?: Record<string, string[]>
  /** 工具级禁用·预设层镜像（按「行」分账）：presetId → serverName → { own, inherit }。 */
  toolDisabledByPreset?: Record<string, Record<string, { own: string[]; inherit: string[] }>>
  /** 遮蔽补丁运行期安装诊断：presetId → 活动 agent 数与 deny 数、失败原因。 */
  maskInstall?: Record<string, { agents: number; deniedAgents: number; denyTotal: number; errors: string[] }>
}
type LiveMcpStatus =
  | { state: 'loading'; data: null }
  | { state: 'ready'; data: LiveMcpState }
  | { state: 'unavailable'; data: null }

/** 添加/启用后自动等工具注册的轮询间隔与总时长。 */
const MCP_TOOL_WATCH_INTERVAL_MS = 2000
// npx 首次拉包可能要一两分钟，等待窗口给足；期间卡片显示「等待注册」，超时后
// 用户仍可手动刷新（下一次添加/启用会重新开始等待）。
const MCP_TOOL_WATCH_TIMEOUT_MS = 150_000

/**
 * 状态里某 Server **实际注册**的工具数（全局条目 ∪ 各预设自带行，取最大）。
 *
 * 一定要用注册数（`toolCount` / `registeredCount`），不能用卡片上那份
 * 「注册 ∪ 名单缓存」的列表长度 —— 缓存会让还没连上的 Server 看起来已就绪，
 * 自动等待就会提前收工（表现就是卡在「0 工具」还得手动刷新）。
 */
function mcpRegisteredToolCountOf(data: LiveMcpState, serverName: string): number {
  let count = data.servers.find(server => server.serverName === serverName)?.toolCount ?? 0
  for (const rows of Object.values(data.presetServers ?? {})) {
    const row = rows.find(item => item.serverName === serverName)
    if (row !== undefined) count = Math.max(count, row.registeredCount ?? 0)
  }
  return count
}

/** 该 Server 是否还没注册出工具（卡片给「等待注册」标记用）。 */
function isToolRegistrationPending(registered: number, listed: number): boolean {
  return registered === 0 && listed > 0
}

/** 拉取真实 MCP 注册状态；失败（服务端未重启等）→ unavailable（界面引导重启）。 */
function useMcpLiveState(): [LiveMcpStatus, () => void] {
  const [status, setStatus] = useState<LiveMcpStatus>({ state: 'loading', data: null })
  const load = (): void => {
    setStatus((current) => (current.state === 'ready' ? current : { state: 'loading', data: null }))
    void fetch('/api/triad/mcp-status', { headers: { accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error(String(response.status)); return response.json() })
      .then((body) => {
        if (typeof body !== 'object' || body === null || !Array.isArray((body as { servers?: unknown }).servers)) throw new Error('bad shape')
        const data = body as LiveMcpState
        setStatus({ state: 'ready', data })
      })
      .catch(() => { setStatus({ state: 'unavailable', data: null }) })
  }
  useEffect(() => { load() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [])
  return [status, load]
}


/**
 * 粘贴添加 MCP：JSON（其它 harness 的 `.mcp.json` 形态）或 DSH 原生 YAML，
 * 先「校验并预览」（宿主解析，带行号报错），确认后写入目标（全局 patch / 预设）。
 * 一次粘贴可含多个 server；已存在的 serverName 自动跳过。
 */
function McpPasteAdd({ t, presetId, onAdded, onCancel }: {
  t: (key: string, params?: Record<string, string | number>) => string
  /** 目标预设；undefined = 全局 profile patch。 */
  presetId?: string
  /** 添加成功回调：带上本次新增的 serverName（面板据此自动等工具注册）。 */
  onAdded: (added: string[]) => void
  onCancel: () => void
}): JSX.Element {
  const [format, setFormat] = useState<'json' | 'yaml'>('json')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState<'preview' | 'add' | null>(null)
  const [preview, setPreview] = useState<{ names: string[]; yaml: string } | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const target = presetId === undefined ? 'global' : 'preset'
  const placeholder = format === 'json'
    ? '{ "mcpServers": { "my-server": { "command": "npx", "args": ["-y", "@scope/mcp-server"] } } }'
    : 'mcpServers:\n  my-server:\n    command: npx\n    args: ["-y", "@scope/mcp-server"]'
  const empty = text.trim() === ''

  const call = (path: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> =>
    fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      const body = await response.json().catch(() => null) as Record<string, unknown> | null
      return body ?? { ok: false, error: `HTTP ${response.status}` }
    })

  const reset = (): void => { setErrors([]); setWarnings([]); setNotice(null); setPreview(null) }

  const previewNow = (): void => {
    if (busy !== null || empty) return
    setBusy('preview'); reset()
    void call('/api/triad/mcp-preview', { format, text, target })
      .then((body) => {
        const list = Array.isArray(body.errors) ? (body.errors as string[]) : []
        setErrors(list)
        if (Array.isArray(body.warnings)) setWarnings(body.warnings as string[])
        if (typeof body.yaml === 'string') {
          const servers = Array.isArray(body.servers) ? (body.servers as Array<{ name?: unknown }>) : []
          setPreview({ names: servers.map(item => String(item.name ?? '')), yaml: body.yaml })
        }
        if (list.length === 0 && typeof body.error === 'string') setErrors([body.error])
      })
      .catch((error: unknown) => { setErrors([error instanceof Error ? error.message : String(error)]) })
      .finally(() => { setBusy(null) })
  }

  const addNow = (): void => {
    if (busy !== null || empty) return
    setBusy('add'); reset()
    const path = presetId === undefined
      ? '/api/triad/mcp-config'
      : `/api/triad/mcp-presets/${encodeURIComponent(presetId)}/servers`
    const payload = presetId === undefined ? { action: 'add', format, text } : { format, text }
    void call(path, payload)
      .then((body) => {
        const list = Array.isArray(body.errors) ? (body.errors as string[]) : []
        if (list.length > 0) {
          setErrors(list)
          if (Array.isArray(body.warnings)) setWarnings(body.warnings as string[])
          return
        }
        if (body.ok !== true) { setErrors([String(body.error ?? t('mcpPasteFailed'))]); return }
        const added = Array.isArray(body.added) ? (body.added as string[]) : []
        const skipped = Array.isArray(body.skipped) ? (body.skipped as number | string[]) : []
        setNotice(t('mcpPasteAdded', { added: added.length, skipped: Array.isArray(skipped) ? skipped.length : Number(skipped) }))
        if (Array.isArray(body.warnings)) setWarnings(body.warnings as string[])
        onAdded(added)
      })
      .catch((error: unknown) => { setErrors([error instanceof Error ? error.message : String(error)]) })
      .finally(() => { setBusy(null) })
  }

  return (
    <div className={css.mcpAddForm}>
      <p className={css.installHint}>
        {t('mcpPasteHint', { scope: presetId === undefined ? t('mcpPasteScopeGlobal') : `${t('mcpPasteScopePreset')} “${presetId}”` })}
      </p>
      <div className={css.installRow}>
        <div className={css.mcpAddTypeRow} role="group" aria-label={t('mcpPasteFormat')}>
          {(['json', 'yaml'] as const).map(value => (
            <button
              key={value}
              type="button"
              className={`${css.mcpAddTypeBtn} ${format === value ? css.mcpAddTypeActive : ''}`}
              data-active={format === value || undefined}
              aria-pressed={format === value}
              onClick={() => { setFormat(value); reset() }}
            >
              {value.toUpperCase()}{value === 'yaml' ? ` · ${t('mcpPasteNative')}` : ''}
            </button>
          ))}
        </div>
      </div>
      <textarea
        className={css.inlineInput}
        value={text}
        placeholder={placeholder}
        aria-label={t('mcpPasteFormat')}
        rows={8}
        spellCheck={false}
        autoFocus
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
          fontSize: 12,
          lineHeight: '18px',
          minHeight: 120,
          resize: 'vertical',
          whiteSpace: 'pre',
        }}
        onChange={(event) => { setText(event.currentTarget.value); reset() }}
      />
      {errors.length > 0 && (
        <div className={css.error} role="alert">
          {errors.map(item => <div key={item}>{item}</div>)}
        </div>
      )}
      {warnings.length > 0 && (
        <div className={css.installHint} role="status">
          {warnings.map(item => <div key={item}>· {item}</div>)}
        </div>
      )}
      {preview !== null && (
        <div>
          <p className={css.installHint}>{t('mcpPasteParsed', { n: preview.names.length, names: preview.names.join(', ') })}</p>
          <pre style={{
            margin: 0,
            maxHeight: 200,
            overflow: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
            fontSize: 11,
            lineHeight: '16px',
            whiteSpace: 'pre-wrap',
          }}>{preview.yaml}</pre>
        </div>
      )}
      {notice !== null && <p className={css.mcpCopyHint} role="status">{notice}</p>}
      <div className={css.inlineForm}>
        <Button variant="outline" type="button" disabled={busy !== null || empty} onClick={previewNow}>
          {busy === 'preview' ? t('mcpPasteChecking') : t('mcpPasteCheck')}
        </Button>
        <Button variant="primary" type="button" disabled={busy !== null || empty} onClick={addNow}>
          {busy === 'add' ? t('mcpPasteAdding') : t('mcpAddConfirm')}
        </Button>
        <Button variant="outline" type="button" onClick={onCancel}>{t('cancel')}</Button>
      </div>
    </div>
  )
}

/** 添加全局 MCP Server 弹窗：粘贴 JSON / DSH 原生 YAML，直接写入 profile patch。 */
function McpAddModal({ t, open, onClose, onAdded }: {
  t: (key: string) => string
  open: boolean
  onClose: () => void
  onAdded: (added: string[]) => void
}): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} closeLabel={t('close')} title={t('mcpAddModalTitle')}>
      <McpPasteAdd t={t} onAdded={onAdded} onCancel={onClose} />
    </Modal>
  )
}

/** 指南面板 logo：小书块。 */
function GuideArtIconSmall(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="2" width="13" height="12" rx="2.5" fill="var(--dsw-alias-state-business-primary,#3d6be5)" />
      <path d="M4.5 5h7M4.5 8h7M4.5 11h4.5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/** ---------------------------------------------------------------- API */

const SKILL_API_BASE = '/api/skill-manager'

async function skillRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(SKILL_API_BASE + path, options)
  const body = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok) throw new Error(body.error || 'request failed (' + String(response.status) + ')')
  return body
}

type InstallInput =
  | { archive: string; description: string; bundleId?: string }
  | { skillName: string; description: string; bundleId?: string; files: Array<{ path: string; data: string }> }

/** 技能目录健康检查（/api/skill-health 响应，host 只读扫描）。 */
interface HealthIssue {
  level: 'error' | 'warn'
  code: string
  skill?: string
  bundle?: string
  message: string
}

interface HealthReport {
  ok: boolean
  healthy: number
  issues: HealthIssue[]
}

/** 同步状态卡的展示态。 */
type HealthView =
  | { state: 'loading' }
  | { state: 'ok'; report: HealthReport }
  | { state: 'issue'; report: HealthReport }
  | { state: 'unavailable' }

/** 技能开关状态(/api/skill-toggles/status 响应)。 */
interface ToggleStatus {
  skills: Record<string, boolean>
  bundles: Record<string, boolean>
}

/** 一个 Agent 预设(host 从 ctx.agentPresets.list() 投影而来)。 */
interface PresetRow {
  id: string
  trust: 'system' | 'user'
  isDefault?: boolean
  name?: string
  description?: string
  order?: number
}

/** /api/skill-toggles/presets 响应:名单 + 各预设覆盖 + 全局层状态。 */
interface PresetStatus extends ToggleStatus {
  presets: PresetRow[]
  /** presetId → { skillName: false } —— 只有显式 false 才是「该预设下关闭」。 */
  overrides: Record<string, Record<string, boolean>>
}

const skillApi = {
  list: (): Promise<SkillSnapshot> => skillRequest<SkillSnapshot>('/list', { headers: { accept: 'application/json' } }),
  toggleStatus: (): Promise<ToggleStatus> =>
    fetch('/api/skill-toggles/status', { headers: { accept: 'application/json' } })
      .then((response) => response.json() as Promise<ToggleStatus & { error?: string }>)
      .then((body) => {
        if (typeof body !== 'object' || body === null || body.skills === undefined) {
          throw new Error('toggle status unavailable')
        }
        return body as ToggleStatus
      }),
  setSkillEnabled: (name: string, enabled: boolean): Promise<{ ok: boolean }> =>
    fetch(`/api/skill-toggles/skills/${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ enabled }),
    }).then((response) => response.json() as Promise<{ ok: boolean; error?: string }>)
      .then((body) => {
        if (!body.ok) throw new Error(body.error || 'toggle failed')
        return body
      }),
  setBundleEnabled: (bundleId: string, enabled: boolean): Promise<{ ok: boolean; handled?: number }> =>
    fetch(`/api/skill-toggles/bundles/${encodeURIComponent(bundleId)}`, {
      method: 'PUT',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ enabled }),
    }).then((response) => response.json() as Promise<{ ok: boolean; error?: string; handled?: number }>)
      .then((body) => {
        if (!body.ok) throw new Error(body.error || 'toggle failed')
        return body
      }),
  /** 预设名单 + 各预设覆盖 + 全局层状态(一次拉齐)。 */
  presetStatus: (): Promise<PresetStatus> =>
    fetch('/api/skill-toggles/presets', { headers: { accept: 'application/json' } })
      .then((response) => response.json() as Promise<PresetStatus & { error?: string }>)
      .then((body) => {
        if (typeof body !== 'object' || body === null || !Array.isArray(body.presets)) {
          throw new Error('preset status unavailable')
        }
        return body as PresetStatus
      }),
  setPresetSkillEnabled: (presetId: string, name: string, enabled: boolean): Promise<{ ok: boolean }> =>
    fetch(`/api/skill-toggles/presets/${encodeURIComponent(presetId)}/skills/${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ enabled }),
    }).then((response) => response.json() as Promise<{ ok: boolean; error?: string }>)
      .then((body) => {
        if (!body.ok) throw new Error(body.error || 'toggle failed')
        return body
      }),
  setPresetBundleEnabled: (presetId: string, bundleId: string, enabled: boolean): Promise<{ ok: boolean }> =>
    fetch(`/api/skill-toggles/presets/${encodeURIComponent(presetId)}/bundles/${encodeURIComponent(bundleId)}`, {
      method: 'PUT',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ enabled }),
    }).then((response) => response.json() as Promise<{ ok: boolean; error?: string }>)
      .then((body) => {
        if (!body.ok) throw new Error(body.error || 'toggle failed')
        return body
      }),
  resetPreset: (presetId: string): Promise<{ ok: boolean }> =>
    fetch(`/api/skill-toggles/presets/${encodeURIComponent(presetId)}/reset`, {
      method: 'POST',
      headers: { accept: 'application/json' },
    }).then((response) => response.json() as Promise<{ ok: boolean; error?: string }>)
      .then((body) => {
        if (!body.ok) throw new Error(body.error || 'reset failed')
        return body
      }),
  createBundle: (name: string, categories: string[] = []): Promise<Record<string, never>> =>
    skillRequest('/bundles', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ name, categories }) }),
  renameBundle: (bundleId: string, name: string): Promise<Record<string, never>> =>
    skillRequest(`/bundles/${encodeURIComponent(bundleId)}`, { method: 'PATCH', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ name }) }),
  /** 只改分类的 PATCH：host 侧 name 缺省即保持原值，不必回传包名。 */
  setBundleCategories: (bundleId: string, categories: string[]): Promise<Record<string, never>> =>
    skillRequest(`/bundles/${encodeURIComponent(bundleId)}`, { method: 'PATCH', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ categories }) }),
  deleteBundle: (bundleId: string): Promise<Record<string, never>> =>
    skillRequest(`/bundles/${encodeURIComponent(bundleId)}`, { method: 'DELETE', headers: { accept: 'application/json' } }),
  setBundleSkills: (bundleId: string, skillNames: string[]): Promise<Record<string, never>> =>
    skillRequest(`/bundles/${encodeURIComponent(bundleId)}/skills`, { method: 'PUT', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ skillNames }) }),
  deleteSkill: (name: string): Promise<Record<string, never>> =>
    skillRequest(`/skills/${encodeURIComponent(name)}`, { method: 'DELETE', headers: { accept: 'application/json' } }),
  installSkill: (input: InstallInput): Promise<{ name?: string; dir?: string; renamed?: boolean }> =>
    skillRequest('/skills', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify(input) }),
  /** 技能目录健康检查：只读扫描（缺 SKILL.md / frontmatter 无效 / 名称不一致 / 账本悬挂引用）。 */
  health: (): Promise<HealthReport> =>
    fetch('/api/skill-health', { headers: { accept: 'application/json' } })
      .then((response) => response.json() as Promise<HealthReport & { error?: string }>)
      .then((body) => {
        if (typeof body !== 'object' || body === null || !Array.isArray(body.issues)) {
          throw new Error('health unavailable')
        }
        return body as HealthReport
      }),
}

/** ---------------------------------------------------------------- 样式 */

const css = {
  entry: 'skm-entry',
  label: 'skm-label',
  // SKILL / MCP 顶层 tab + MCP 占位
  kindTabs: 'skm-kind-tabs',
  kindTab: 'skm-kind-tab',
  kindTabActive: 'skm-kind-tab-active',
  mcpEmpty: 'skm-mcp-empty',
  mcpEmptyIcon: 'skm-mcp-empty-icon',
  mcpEmptyTitle: 'skm-mcp-empty-title',
  mcpEmptyDesc: 'skm-mcp-empty-desc',
  mcpPage: 'skm-mcp-view-root',
  mcpViewRoot: 'skm-mcp-view-root',
  mcpSide: 'skm-mcp-side',
  mcpMain: 'skm-mcp-main',
  mcpServerLayout: 'skm-mcp-server-layout',
  mcpServerMain: 'skm-mcp-server-main',
  mcpHeader: 'skm-mcp-header',
  mcpHeaderText: 'skm-mcp-header-text',
  mcpHeaderTitleRow: 'skm-mcp-header-title-row',
  mcpHeaderTitle: 'skm-mcp-header-title',
  mcpHeaderBadge: 'skm-mcp-header-badge',
  mcpHeaderSub: 'skm-mcp-header-sub',
  mcpHeaderActions: 'skm-mcp-header-actions',
  mcpMarketBtn: 'skm-mcp-market-btn',
  mcpAddBtn: 'skm-mcp-add-btn',
  mcpBellBtn: 'skm-mcp-bell-btn',
  mcpListCard: 'skm-mcp-list-card',
  mcpListHead: 'skm-mcp-list-head',
  mcpListTitle: 'skm-mcp-list-title',
  mcpListCount: 'skm-mcp-list-count',
  mcpList: 'skm-mcp-list',
  mcpEmptyList: 'skm-mcp-empty-list',
  mcpCopyHint: 'skm-mcp-copy-hint',
  mcpIntroCard: 'skm-mcp-intro-card',
  mcpIntroBody: 'skm-mcp-intro-body',
  mcpIntroTitle: 'skm-mcp-intro-title',
  mcpIntroDesc: 'skm-mcp-intro-desc',
  mcpIntroBtn: 'skm-mcp-intro-btn',
  mcpInfoOverlay: 'skm-mcp-info-overlay',
  mcpInfoOverlayHead: 'skm-mcp-info-overlay-head',
  mcpInfoOverlayIcon: 'skm-mcp-info-overlay-icon',
  mcpInfoOverlayTitle: 'skm-mcp-info-overlay-title',
  mcpInfoOverlayBody: 'skm-mcp-info-overlay-body',
  mcpRow: 'skm-mcp-row',
  mcpRowLogo: 'skm-mcp-row-logo',
  mcpRowBody: 'skm-mcp-row-body',
  mcpRowNameRow: 'skm-mcp-row-name-row',
  mcpRowName: 'skm-mcp-row-name',
  mcpRowTag: 'skm-mcp-row-tag',
  mcpRowExt: 'skm-mcp-row-ext',
  mcpRowDesc: 'skm-mcp-row-desc',
  mcpRowStatus: 'skm-mcp-row-status',
  mcpViewAll: 'skm-mcp-view-all',
  mcpAddSmallBtn: 'skm-mcp-add-small-btn',
  mcpRecommendTitle: 'skm-mcp-recommend-title',
  mcpRecHead: 'skm-mcp-rec-head',
  mcpRecCatsRow: 'skm-mcp-rec-cats-row',
  mcpRecResultsTitle: 'skm-mcp-rec-results-title',
  mcpRecStars: 'skm-mcp-rec-stars',
  mcpOpenLink: 'skm-mcp-open-link',
  mcpRecCardExternal: 'skm-mcp-rec-card-external',
  mcpResolveErr: 'skm-mcp-resolve-err',
  mcpExtActions: 'skm-mcp-ext-actions',
  mcpCardFoot: 'skm-mcp-card-foot',
  mcpCardItem: 'skm-mcp-card-item',
  mcpCardItemLabel: 'skm-mcp-card-item-label',
  mcpCardItemMeta: 'skm-mcp-card-item-meta',
  mcpCardDelete: 'skm-mcp-card-delete',
  mcpToolChips: 'skm-mcp-tool-chips',
  mcpToolChip: 'skm-mcp-tool-chip',
  mcpRecCats: 'skm-mcp-rec-cats',
  mcpRecCat: 'skm-mcp-rec-cat',
  mcpRecCatActive: 'skm-mcp-rec-cat-active',
  mcpRecGrid: 'skm-mcp-rec-grid',
  mcpRecCard: 'skm-mcp-rec-card',
  mcpRecCardHead: 'skm-mcp-rec-card-head',
  mcpRecCardTitleRow: 'skm-mcp-rec-card-title-row',
  mcpRecCardName: 'skm-mcp-rec-card-name',
  mcpRecCardTags: 'skm-mcp-rec-card-tags',
  mcpRecCatTag: 'skm-mcp-rec-cat-tag',
  mcpRecCardDesc: 'skm-mcp-rec-card-desc',
  mcpRecCardFoot: 'skm-mcp-rec-card-foot',
  mcpRecCardMeta: 'skm-mcp-rec-card-meta',
  mcpAddedTag: 'skm-mcp-added-tag',
  mcpAddForm: 'skm-mcp-add-form',
  mcpAddTypeRow: 'skm-mcp-add-type-row',
  mcpAddTypeBtn: 'skm-mcp-add-type-btn',
  mcpAddTypeActive: 'skm-mcp-add-type-active',
  mcpToolSearch: 'skm-mcp-tool-search',
  mcpToolSearchInput: 'skm-mcp-tool-search-input',
  mcpLogRow: 'skm-mcp-log-row',
  mcpLogDot: 'skm-mcp-log-dot',
  mcpLogBody: 'skm-mcp-log-body',
  mcpLogText: 'skm-mcp-log-text',
  mcpLogClear: 'skm-mcp-log-clear',
  mcpConfigGrid: 'skm-mcp-config-grid',
  mcpConfigCard: 'skm-mcp-config-card',
  mcpConfigHead: 'skm-mcp-config-head',
  mcpConfigTitle: 'skm-mcp-config-title',
  mcpConfigCopy: 'skm-mcp-config-copy',
  mcpConfigCode: 'skm-mcp-config-code',
  mcpInfoCol: 'skm-mcp-info-col',
  mcpInfoCard: 'skm-mcp-info-card',
  mcpInfoCardTitle: 'skm-mcp-info-card-title',
  mcpInfoDesc: 'skm-mcp-info-desc',
  mcpInfoPoints: 'skm-mcp-info-points',
  mcpPoint: 'skm-mcp-point',
  mcpPointIcon: 'skm-mcp-point-icon',
  mcpPointBody: 'skm-mcp-point-body',
  mcpPointTitle: 'skm-mcp-point-title',
  mcpPointDesc: 'skm-mcp-point-desc',
  mcpFlow: 'skm-mcp-flow',
  mcpFlowNode: 'skm-mcp-flow-node',
  mcpFlowIcon: 'skm-mcp-flow-icon',
  mcpFlowLabel: 'skm-mcp-flow-label',
  mcpFlowArrow: 'skm-mcp-flow-arrow',
  mcpFlowArrowText: 'skm-mcp-flow-arrow-text',
  mcpFlowExt: 'skm-mcp-flow-ext',
  mcpFlowExtLabel: 'skm-mcp-flow-ext-label',
  mcpFlowExtIcons: 'skm-mcp-flow-ext-icons',
  mcpFlowExtIcon: 'skm-mcp-flow-ext-icon',
  mcpApiText: 'skm-mcp-api-text',
  mcpSteps: 'skm-mcp-steps',
  mcpStep: 'skm-mcp-step',
  mcpStepNum: 'skm-mcp-step-num',
  mcpStepBody: 'skm-mcp-step-body',
  mcpStepTitle: 'skm-mcp-step-title',
  mcpStepDesc: 'skm-mcp-step-desc',
  modal: 'skm-modal',
  modalBody: 'skm-modal-body',
  panel: 'skm-panel',
  topRow: 'skm-top-row',
  newBundleButton: 'skm-new-bundle',
  upload: 'skm-upload',
  uploadActive: 'skm-upload-active',
  hiddenInput: 'skm-hidden-input',
  installForm: 'skm-install-form',
  installRow: 'skm-install-row',
  inlineForm: 'skm-inline-form',
  // 技能包分类：顶栏胶囊行 / 包名旁标签 / 分类编辑器
  stackForm: 'skm-stack-form',
  catChipRow: 'skm-cat-chip-row',
  catChipLabel: 'skm-cat-chip-label',
  catChip: 'skm-cat-chip',
  catChipCount: 'skm-cat-chip-count',
  bundleCats: 'skm-bundle-cats',
  bundleCatTag: 'skm-bundle-cat-tag',
  catEditor: 'skm-cat-editor',
  catEmpty: 'skm-cat-empty',
  catSelected: 'skm-cat-selected',
  catSelectedTag: 'skm-cat-selected-tag',
  catSelectedName: 'skm-cat-selected-name',
  catRemove: 'skm-cat-remove',
  catSuggest: 'skm-cat-suggest',
  catPreset: 'skm-cat-preset',
  catPresetPlus: 'skm-cat-preset-plus',
  catInput: 'skm-cat-input',
  catLimit: 'skm-cat-limit',
  // 块级变体：改名输入行独占一整行（整行内容保留，表单追加在其下方）。
  inlineFormBlock: 'skm-inline-form-block',
  inlineInput: 'skm-inline-input',
  bundleSelect: 'skm-bundle-select',
  installMeta: 'skm-install-meta',
  installActions: 'skm-install-actions',
  sectionTitle: 'skm-section-title',
  status: 'skm-status',
  failure: 'skm-failure',
  error: 'skm-error',
  bundleList: 'skm-bundle-list',
  bundle: 'skm-bundle',
  bundleRow: 'skm-bundle-row',
  bundleName: 'skm-bundle-name',
  bundleCount: 'skm-bundle-count',
  chevron: 'skm-chevron',
  bundleActions: 'skm-bundle-actions',
  iconAction: 'skm-icon-action',
  skillList: 'skm-skill-list',
  skillItem: 'skm-skill-item',
  skillRow: 'skm-skill-row',
  skillLabel: 'skm-skill-label',
  skillName: 'skm-skill-name',
  skillDescription: 'skm-skill-desc',
  skillExpand: 'skm-skill-expand',
  skillCount: 'skm-skill-count',
  skillCompat: 'skm-skill-compat',
  // 技能卡片（Skills Hub 风格）
  skillGrid: 'skm-skill-grid',
  skillCard: 'skm-skill-card',
  skillCardHead: 'skm-skill-card-head',
  skillIcon: 'skm-skill-icon',
  skillBadge: 'skm-skill-badge',
  skillTitleWrap: 'skm-skill-title-wrap',
  skillTitle: 'skm-skill-title',
  skillCopy: 'skm-skill-copy',
  skillCardToggle: 'skm-skill-card-toggle',
  skillDesc: 'skm-skill-card-desc',
  skillTags: 'skm-skill-tags',
  tag: 'skm-tag',
  tagSource: 'skm-tag-source',
  tagScope: 'skm-tag-scope',
  skillMeta: 'skm-skill-meta',
  skillCardFoot: 'skm-skill-card-foot',
  skillFootLabel: 'skm-skill-foot-label',
  skillFootIcon: 'skm-skill-foot-icon',
  skillCardActions: 'skm-skill-card-actions',
  // Skills Hub 页面结构
  hub: 'skm-hub',
  hubRow: 'skm-hub-row',
  hubSide: 'skm-hub-side',
  topbar: 'skm-topbar',
  chipRow: 'skm-chip-row',
  hubBrand: 'skm-hub-brand',
  hubLogo: 'skm-hub-logo',
  hubBrandText: 'skm-hub-brand-text',
  hubBrandTitle: 'skm-hub-brand-title',
  hubBrandSub: 'skm-hub-brand-sub',
  hubGroup: 'skm-hub-group',
  hubItem: 'skm-hub-item',
  hubItemActive: 'skm-hub-item-active',
  hubItemIcon: 'skm-hub-item-icon',
  hubItemLabel: 'skm-hub-item-label',
  hubItemCount: 'skm-hub-item-count',
  // 左栏：技能分类 / 快捷筛选 / 添加技能卡
  catTitle: 'skm-cat-title',
  catItem: 'skm-cat-item',
  catItemActive: 'skm-cat-item-active',
  catIcon: 'skm-cat-icon',
  catLabel: 'skm-cat-label',
  catCount: 'skm-cat-count',
  filterBlock: 'skm-filter-block',
  filterRow: 'skm-filter-row',
  filterRowLabel: 'skm-filter-row-label',
  filterRowLabelStrong: 'skm-filter-row-label-strong',
  filterRowChevron: 'skm-filter-row-chevron',
  filterRowWrap: 'skm-filter-row-wrap',
  filterMenu: 'skm-filter-menu',
  filterOption: 'skm-filter-option',
  presetDot: 'skm-preset-dot',
  filtersTitle: 'skm-filters-title',
  statusSeg: 'skm-status-seg',
  statusSegBtn: 'skm-status-seg-btn',
  statusSegActive: 'skm-status-seg-active',
  addCard: 'skm-add-card',
  addCardHead: 'skm-add-card-head',
  addCardIcon: 'skm-add-card-icon',
  addCardTitle: 'skm-add-card-title',
  addCardSub: 'skm-add-card-sub',
  addDrop: 'skm-add-drop',
  addDropIcon: 'skm-add-drop-icon',
  addDropText: 'skm-add-drop-text',
  addDropHint: 'skm-add-drop-hint',
  addBtn: 'skm-add-btn',
  // 快速上手指南卡
  guideCard: 'skm-guide-card',
  guideTitle: 'skm-guide-title',
  guideDesc: 'skm-guide-desc',
  guideBtn: 'skm-guide-btn',
  guideArt: 'skm-guide-art',
  // 右侧指南栏
  guidePanel: 'skm-guide-panel',
  guidePanelHead: 'skm-guide-panel-head',
  guidePanelLogo: 'skm-guide-panel-logo',
  guidePanelTitle: 'skm-guide-panel-title',
  guidePanelClose: 'skm-guide-panel-close',
  guidePanelBody: 'skm-guide-panel-body',
  guideSec: 'skm-guide-sec',
  guideSecHead: 'skm-guide-sec-head',
  guideSecIcon: 'skm-guide-sec-icon',
  guideSecTitle: 'skm-guide-sec-title',
  guideWhatDesc: 'skm-guide-what-desc',
  guideCaps: 'skm-guide-caps',
  guideCap: 'skm-guide-cap',
  guideCapIcon: 'skm-guide-cap-icon',
  guideCapLabel: 'skm-guide-cap-label',
  guideStep: 'skm-guide-step',
  guideStepNum: 'skm-guide-step-num',
  guideStepBody: 'skm-guide-step-body',
  guideStepTitleRow: 'skm-guide-step-title-row',
  guideStepTitle: 'skm-guide-step-title',
  guideStepArrow: 'skm-guide-step-arrow',
  guideStepDesc: 'skm-guide-step-desc',
  guideFullBtn: 'skm-guide-full-btn',
  guideBest: 'skm-guide-best',
  guideBestTitle: 'skm-guide-best-title',
  guideBestList: 'skm-guide-best-list',
  guideBestItem: 'skm-guide-best-item',
  guideMoreBtn: 'skm-guide-more-btn',
  guideBestArt: 'skm-guide-best-art',
  hubMain: 'skm-hub-main',
  // 分组行
  bundleRowOuter: 'skm-bundle-row-outer',
  bundleIcon: 'skm-bundle-icon',
  bundleMore: 'skm-bundle-more',
  bundleMoreBtn: 'skm-bundle-more-btn',
  // 分页
  pagination: 'skm-pagination',
  pageInfo: 'skm-page-info',
  pageBtns: 'skm-page-btns',
  pageBtn: 'skm-page-btn',
  pageBtnActive: 'skm-page-btn-active',
  pageSizeSel: 'skm-page-size-sel',
  newBundleBtn: 'skm-new-bundle-btn',
  newBundleBtnOpen: 'skm-new-bundle-btn-open',
  statsRow: 'skm-stats-row',
  stat: 'skm-stat',
  statIconCol: 'skm-stat-icon-col',
  statIcon: 'skm-stat-icon',
  statGlow: 'skm-stat-glow',
  statBody: 'skm-stat-body',
  statLabel: 'skm-stat-label',
  statValue: 'skm-stat-value',
  statValueRow: 'skm-stat-value-row',
  statChevron: 'skm-stat-chevron',
  statDesc: 'skm-stat-desc',
  toolbar: 'skm-toolbar',
  searchBox: 'skm-search-box',
  searchInput: 'skm-search-input',
  toolSelectWrap: 'skm-tool-select-wrap',
  toolSelect: 'skm-tool-select',
  toolSelectChevron: 'skm-tool-select-chevron',
  dropWrap: 'skm-drop-wrap',
  dropMenu: 'skm-drop-menu',
  dropItem: 'skm-drop-item',
  dropCheck: 'skm-drop-check',
  dropBadge: 'skm-drop-badge',
  toolButton: 'skm-tool-button',
  toolbarSpacer: 'skm-toolbar-spacer',
  bulkOverlay: 'skm-bulk-overlay',
  presetPill: 'skm-preset-pill',
  presetSelect: 'skm-preset-select',
  presetPillChevron: 'skm-preset-pill-chevron',
  presetPillLabel: 'skm-preset-pill-label',
  viewToggle: 'skm-view-toggle',
  viewBtn: 'skm-view-btn',
  hintRow: 'skm-hint-row',
  hintRowText: 'skm-hint-row-text',
  banner: 'skm-banner',
  bannerActive: 'skm-banner-active',
  bannerIcon: 'skm-banner-icon',
  bannerText: 'skm-banner-text',
  bannerTitle: 'skm-banner-title',
  bannerSub: 'skm-banner-sub',
  bannerBtn: 'skm-banner-btn',
  mainScroll: 'skm-main-scroll',
  hubSection: 'skm-hub-section',
  hubSectionHead: 'skm-hub-section-head',
  skillGridList: 'skm-skill-grid-list',
  noResult: 'skm-no-result',
  // 归入技能包弹窗（卡片化）
  assignModal: 'skm-assign-modal',
  assignModalBody: 'skm-assign-modal-body',
  assignList: 'skm-assign-list',
  assignCard: 'skm-assign-card',
  assignCardIcon: 'skm-assign-card-icon',
  assignCardBody: 'skm-assign-card-body',
  assignCardName: 'skm-assign-card-name',
  assignCardDesc: 'skm-assign-card-desc',
  assignGo: 'skm-assign-go',
  // 同步状态健康检查
  healthNotice: 'skm-health-notice',
  healthNoticeTitle: 'skm-health-notice-title',
  skillFiles: 'skm-skill-files',
  skillFile: 'skm-skill-file',
  skillPreview: 'skm-skill-preview',
  viewerModal: 'skm-viewer-modal',
  viewerBody: 'skm-viewer-body',
  viewerLayout: 'skm-viewer-layout',
  viewerNav: 'skm-viewer-nav',
  viewerNavItem: 'skm-viewer-nav-item',
  viewerNavDir: 'skm-viewer-nav-dir',
  viewerContent: 'skm-viewer-content',
  viewerModalFull: 'skm-viewer-modal-full',
  viewerToolbar: 'skm-viewer-toolbar',
  viewerPath: 'skm-viewer-path',
  viewerToolGroup: 'skm-viewer-tool-group',
  viewerToolBtn: 'skm-viewer-tool-btn',
  viewerToolBtnA1: 'skm-viewer-tool-btn-a1',
  viewerToolBtnA3: 'skm-viewer-tool-btn-a3',
  viewerToolBtnFrame: 'skm-viewer-tool-btn-frame',
  looseEmpty: 'skm-loose-empty',
  visuallyHidden: 'skm-visually-hidden',
  // 技能/技能包开关
  toggle: 'skm-toggle',
  toggleOn: 'skm-toggle-on',
  toggleOff: 'skm-toggle-off',
  toggleKnob: 'skm-toggle-knob',
  bundleToggle: 'skm-bundle-toggle',
  // Agent 预设分类（圆球）
  presetStrip: 'skm-preset-strip',
  presetBallWrap: 'skm-preset-ball-wrap',
  presetBall: 'skm-preset-ball',
  presetBallLabel: 'skm-preset-ball-label',
  presetHint: 'skm-preset-hint',
  presetHintText: 'skm-preset-hint-text',
  presetReset: 'skm-preset-reset',
  // 空技能包 / 失效引用 / 面板级提示条
  toastStack: 'skm-toast-stack',
  toast: 'skm-toast',
  toastOk: 'skm-toast-ok',
  toastErr: 'skm-toast-err',
  toastDot: 'skm-toast-dot',
  bundleEmpty: 'skm-bundle-empty',
  bundleEmptyTitle: 'skm-bundle-empty-title',
  bundleEmptyHint: 'skm-bundle-empty-hint',
  bundleEmptyBtn: 'skm-bundle-empty-btn',
  bundleMissing: 'skm-bundle-missing',
  bundleMissingBtn: 'skm-bundle-missing-btn',
  installHint: 'skm-install-hint',
  tagStatus: 'skm-tag-status',
}

const STYLE_ID = 'dsh-skill-manager-styles'
const SHEET = `
.skm-entry{flex:1 1 50%;min-width:0;display:inline-flex;align-items:center;gap:8px;height:32px;box-sizing:border-box;border:none;border-radius:10px;padding:0 8px;background:transparent;cursor:pointer;color:var(--dsw-alias-label-primary,#eee);font-family:inherit;font-size:14px;line-height:20px;overflow:hidden}
.skm-entry:hover{background:transparent}
.skm-entry[aria-expanded='true']{background:transparent;color:var(--dsw-alias-label-primary,#eee)}
.skm-entry:focus,.skm-entry:focus-visible{outline:none;border:none}
.skm-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-modal-body{overflow:hidden;display:flex;flex-direction:column}
.skm-panel{flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;overflow-y:auto;padding:2px 2px 6px;box-sizing:border-box}
.skm-top-row{flex:none;display:flex;align-items:center;justify-content:flex-end;gap:8px}
.skm-new-bundle{flex:none;display:inline-flex;align-items:center;gap:4px;appearance:none;border:none;border-radius:12px;padding:4px 10px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#999);background:transparent;cursor:pointer}
.skm-new-bundle:hover,.skm-new-bundle[aria-expanded='true']{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06));color:var(--dsw-alias-label-primary,#eee)}
.skm-upload{flex:none;display:flex;align-items:center;justify-content:center;gap:8px;min-height:56px;padding:10px 12px;box-sizing:border-box;border:1px dashed var(--dsw-alias-border-l3,#444);border-radius:12px;color:var(--dsw-alias-label-tertiary,#888);font-size:12px;line-height:18px;text-align:center;cursor:pointer;user-select:none}
.skm-upload:hover{border-color:var(--dsw-alias-state-business-primary,#4a9eff);color:var(--dsw-alias-label-secondary,#bbb)}
.skm-upload-active{border-color:var(--dsw-alias-state-business-primary,#4a9eff);background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.skm-hidden-input{display:none}
.skm-install-form{flex:none;display:flex;flex-direction:column;gap:8px;padding:10px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:12px;background:var(--dsw-alias-bg-layer-1,#1c1f26)}
.skm-install-row{display:flex;flex-direction:column;gap:6px}
.skm-inline-form{flex:none;display:flex;align-items:center;gap:6px}
/* 块级变体：width:100% 让它在 .skm-bundle（flex-wrap）里自动换行独占一行，
   输入框因此能吃满整行宽度，不必被两个按钮挤到只剩默认 20 字符。 */
.skm-inline-form-block{width:100%;box-sizing:border-box;padding:0 8px 8px;animation:skm-form-in 160ms ease-out}
@keyframes skm-form-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
/* 改名成功：卡片边框高亮脉冲（1 秒后回落），与整体深色卡片节奏一致 */
.skm-bundle[data-renamed='true']{animation:skm-card-pop 900ms ease-out}
@keyframes skm-card-pop{0%{border-color:var(--dsw-alias-state-business-primary,#4a9eff);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary,#4a9eff)}55%{border-color:var(--dsw-alias-state-business-primary,#4a9eff);box-shadow:0 0 0 1px var(--dsw-alias-state-business-primary,#4a9eff)}100%{border-color:var(--dsw-alias-border-l1,rgba(255,255,255,.08));box-shadow:none}}
.skm-inline-input{flex:1;min-width:0;height:32px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:8px;padding:0 10px;font-size:13px;color:var(--dsw-alias-label-primary,#eee);background:var(--dsw-alias-bg-base,#0e1116)}
.skm-inline-input::placeholder{color:var(--dsw-alias-label-tertiary,#888)}
.skm-bundle-select{display:flex;align-items:center}
.skm-bundle-select select{flex:1;height:32px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:8px;padding:0 8px;font-size:13px;color:var(--dsw-alias-label-primary,#eee);background:var(--dsw-alias-bg-base,#0e1116)}
.skm-install-meta{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#888)}
.skm-install-actions{display:flex;align-items:center;gap:6px}
.skm-section-title{margin:6px 2px 0;font-size:12px;font-weight:600;line-height:18px;color:var(--dsw-alias-label-secondary,#bbb)}
.skm-status{margin:2px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-tertiary,#888)}
.skm-failure{display:flex;align-items:center;gap:8px}
.skm-failure p{margin:2px;font-size:13px;line-height:20px;color:var(--dsw-alias-state-error-primary,#e0434b)}
.skm-error{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-state-error-primary,#e0434b)}
.skm-bundle-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
/* 分组行（参考设计稿）：白底圆角行，蓝文件夹图标 + 名称 + 计数 pill + chevron + 更多 */
.skm-bundle-row-outer{flex:none;display:flex;align-items:center;gap:6px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:11px;background:var(--dsw-alias-bg-base,#fff);padding:2px 6px 2px 10px;min-height:40px;transition:border-color 160ms ease,box-shadow 160ms ease,background 160ms ease}
.skm-bundle-row-outer:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.14));box-shadow:0 2px 8px rgba(16,24,40,.06)}
.skm-bundle-row{flex:1;min-width:0;display:inline-flex;align-items:center;gap:10px;appearance:none;border:none;background:transparent;padding:6px 2px;font-size:14px;cursor:pointer;color:var(--dsw-alias-label-primary,#1f2430);font-family:inherit;border-radius:8px;text-align:left;transition:background 140ms ease}
.skm-bundle-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.02))}
.skm-bundle-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-bundle-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;display:inline-flex;align-items:center;gap:6px}
.skm-bundle-count{flex:none;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary,#61666b);background:var(--dsw-alias-bg-module-platform,#f1f3f5);border-radius:999px;padding:0 8px;white-space:nowrap}
/* ── 技能包分类：顶栏胶囊筛选 / 包名旁标签 / 分类编辑器 ─────────────────────── */
/* 配色只走主题蓝一把刷子（与 .skm-tag 同语言）；分类名不参与配色——
   彩虹色板实测视觉太吵，与面板其余部分打架，已否。 */
.skm-stack-form{display:flex;flex-direction:column;gap:10px}
.skm-cat-chip-row{flex:1 1 100%;order:3;display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding-top:2px;animation:skm-cat-row-in 220ms cubic-bezier(.2,.8,.2,1) both}
@keyframes skm-cat-row-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.skm-cat-chip-label{flex:none;font-size:11.5px;line-height:18px;letter-spacing:.02em;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-cat-chip{flex:none;display:inline-flex;align-items:center;gap:5px;height:26px;box-sizing:border-box;padding:0 9px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:999px;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-secondary,#61666b);font-family:inherit;font-size:12px;line-height:18px;cursor:pointer;transition:color 150ms ease,border-color 150ms ease,background 150ms ease,box-shadow 200ms ease,transform 120ms ease}
.skm-cat-chip:hover{border-color:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 52%,transparent);color:var(--dsw-alias-label-primary,#1f2430);transform:translateY(-1px)}
.skm-cat-chip:active{transform:translateY(0) scale(.97)}
.skm-cat-chip[data-active]{border-color:transparent;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 15%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-weight:600;box-shadow:0 0 0 1px color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 36%,transparent),0 2px 10px color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 20%,transparent)}
.skm-cat-chip-count{flex:none;min-width:16px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:var(--dsw-alias-bg-module-platform,rgba(0,0,0,.05));color:var(--dsw-alias-label-tertiary,#81858c);font-size:10.5px;line-height:16px;font-variant-numeric:tabular-nums;transition:background 160ms ease,color 160ms ease}
.skm-cat-chip[data-active] .skm-cat-chip-count{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 22%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
/* 包名旁标签：整颗可点（点在标题行里，由 JS 分流成筛选而非展开），带入场弹入。 */
.skm-bundle-cats{flex:none;display:inline-flex;align-items:center;gap:4px;flex-wrap:wrap;min-width:0}
.skm-bundle-cat-tag{display:inline-flex;align-items:center;gap:4px;height:19px;box-sizing:border-box;padding:0 7px;border-radius:999px;font-size:11px;line-height:17px;white-space:nowrap;cursor:pointer;color:var(--dsw-alias-state-business-primary,#3d6be5);background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 11%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 22%,transparent);animation:skm-cat-tag-in 200ms cubic-bezier(.2,.9,.3,1.1) both;transition:background 150ms ease,border-color 150ms ease,transform 120ms ease,box-shadow 180ms ease}
.skm-bundle-cat-tag:hover{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 20%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 45%,transparent);transform:translateY(-1px);box-shadow:0 2px 7px color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 22%,transparent)}
.skm-bundle-cat-tag[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:transparent;color:#fff;box-shadow:0 2px 9px color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 40%,transparent)}
@keyframes skm-cat-tag-in{from{opacity:0;transform:translateY(3px) scale(.94)}to{opacity:1;transform:none}}
/* 分类编辑器 */
.skm-cat-editor{display:flex;flex-direction:column;gap:8px;box-sizing:border-box;width:100%}
.skm-cat-empty{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-cat-selected{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:5px}
.skm-cat-selected-tag{display:inline-flex;align-items:center;gap:5px;height:24px;box-sizing:border-box;padding:0 4px 0 9px;border-radius:999px;font-size:12px;line-height:20px;color:var(--dsw-alias-state-business-primary,#3d6be5);background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);border:1px solid color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 26%,transparent);animation:skm-cat-tag-in 200ms cubic-bezier(.2,.9,.3,1.1) both}
.skm-cat-selected-name{white-space:nowrap}
.skm-cat-remove{flex:none;display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;padding:0;border:none;border-radius:50%;background:transparent;color:inherit;cursor:pointer;opacity:.6;transition:opacity 140ms ease,background 140ms ease,transform 140ms ease}
.skm-cat-remove:hover{opacity:1;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 22%,transparent)}
.skm-cat-remove:active{transform:scale(.9)}
.skm-cat-suggest{display:flex;flex-wrap:wrap;gap:4px}
.skm-cat-preset{display:inline-flex;align-items:center;gap:3px;height:23px;box-sizing:border-box;padding:0 8px;border:1px dashed var(--dsw-alias-border-l2,rgba(0,0,0,.16));border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary,#61666b);font-family:inherit;font-size:11.5px;line-height:19px;cursor:pointer;transition:color 140ms ease,border-color 140ms ease,background 140ms ease,transform 120ms ease}
.skm-cat-preset:hover:not(:disabled){color:var(--dsw-alias-state-business-primary,#3d6be5);border-color:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 55%,transparent);border-style:solid;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 9%,transparent);transform:translateY(-1px)}
.skm-cat-preset:active:not(:disabled){transform:translateY(0) scale(.96)}
.skm-cat-preset:disabled{opacity:.4;cursor:default}
.skm-cat-preset-plus{font-size:13px;line-height:16px;opacity:.7}
.skm-cat-input{box-sizing:border-box;width:100%;height:32px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:9px;padding:0 10px;font-family:inherit;font-size:12.5px;line-height:20px;color:var(--dsw-alias-label-primary,#1f2430);background:var(--dsw-alias-bg-base,#fff);transition:border-color 150ms ease,box-shadow 150ms ease}
.skm-cat-input:focus,.skm-cat-input:focus-visible{outline:none;border-color:var(--dsw-alias-state-business-primary,#3d6be5);box-shadow:0 0 0 3px rgba(61,107,229,.12)}
.skm-cat-limit{margin:0;font-size:11.5px;line-height:17px;color:var(--dsw-alias-label-tertiary,#81858c)}

.skm-chevron{flex:none;margin-left:auto;color:var(--dsw-alias-label-caption,#adb2b8);transition:transform 120ms}
.skm-bundle-row-outer[data-open='true'] .skm-chevron{transform:rotate(180deg)}
.skm-bundle-more{flex:none;display:flex;align-items:center}
.skm-bundle-more-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:8px;padding:0;background:transparent;cursor:pointer;color:var(--dsw-alias-label-caption,#adb2b8);transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-bundle-more-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-bundle-more-btn:active{transform:scale(.9)}
.skm-bundle-actions{margin-left:auto;display:flex;align-items:center;gap:2px;padding-right:2px}
.skm-icon-action{flex:none;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:none;border-radius:50%;padding:0;background:transparent;cursor:pointer;color:var(--dsw-alias-label-tertiary,#888);transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-icon-action:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05));color:var(--dsw-alias-label-primary,#0f1115)}
.skm-icon-action:active{transform:scale(.9)}

/* ── 技能卡片（Skills Hub 风格）：双列网格；列表视图切单列宽卡 ── */
.skm-skill-grid{list-style:none;margin:8px 0 0;padding:0;width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;box-sizing:border-box}
.skm-skill-grid-list{grid-template-columns:minmax(0,1fr)}
.skm-skill-grid > .skm-status{grid-column:1/-1;padding-top:4px}
.skm-skill-card{position:relative;min-width:0;display:flex;flex-direction:column;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:16px;background:var(--dsw-alias-bg-base,#fff);padding:14px 16px 0;overflow:hidden;opacity:0;animation:skm-card-in 260ms cubic-bezier(.2,.7,.3,1.06) forwards;animation-delay:calc(var(--skm-i,0)*40ms);transition:border-color 160ms ease,box-shadow 160ms ease,transform 160ms ease}
.skm-skill-card:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16));box-shadow:0 3px 14px rgba(16,24,40,.08);transform:translateY(-1px)}
@keyframes skm-card-in{from{opacity:0;transform:translateY(8px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
.skm-skill-card-head{display:flex;align-items:center;gap:10px;min-width:0}
.skm-skill-icon{flex:none;width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:12px;background:var(--dsw-alias-bg-module-platform,#f5f6f7);color:var(--dsw-alias-label-secondary,#61666b);transition:color 160ms ease,border-color 160ms ease,transform 160ms ease}
.skm-skill-badge{flex:none;display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:7px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:10.5px;font-weight:700;letter-spacing:.2px}
.skm-skill-title-wrap{flex:1;min-width:0;display:flex;align-items:center;gap:6px}
.skm-skill-title{flex:1;min-width:0;appearance:none;border:none;background:transparent;padding:0;text-align:left;font-family:inherit;font-size:15px;font-weight:600;line-height:22px;color:var(--dsw-alias-label-primary,#0f1115);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;border-radius:6px;transition:color 140ms ease}
.skm-skill-title:hover{color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-skill-title:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4176e6);outline-offset:1px}
.skm-skill-copy{flex:none;display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border:none;border-radius:6px;padding:0;background:transparent;cursor:pointer;color:var(--dsw-alias-label-caption,#adb2b8);opacity:.55;transition:opacity 140ms ease,color 140ms ease,background 140ms ease,transform 140ms ease}
.skm-skill-copy:hover{opacity:1;color:var(--dsw-alias-label-secondary,#61666b);background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));transform:scale(1.08)}
.skm-skill-copy:active{transform:scale(.9)}
.skm-skill-copy[data-copied='true']{opacity:1;color:var(--dsw-alias-state-business-primary,#4176e6)}
.skm-skill-card-toggle{flex:none;display:inline-flex;align-items:center}
.skm-skill-card-desc{margin:8px 0 0;appearance:none;border:none;background:transparent;padding:0;text-align:left;font-family:inherit;font-size:13px;line-height:19px;color:var(--dsw-alias-label-tertiary,#81858c);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;min-height:38px;cursor:pointer;transition:color 140ms ease}
.skm-skill-card-desc:hover{color:var(--dsw-alias-label-secondary,#61666b)}
.skm-skill-tags{display:flex;align-items:center;gap:8px;margin-top:12px;min-width:0}
.skm-tag{flex:none;display:inline-flex;align-items:center;height:22px;padding:0 10px;border-radius:999px;font-size:12px;line-height:20px;box-sizing:border-box;white-space:nowrap;transition:color 160ms ease,border-color 160ms ease,background 160ms ease}
.skm-tag-source{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-tag-scope{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-tag-scope[data-off='true']{border-color:var(--dsw-alias-border-l2,rgba(0,0,0,.12));color:var(--dsw-alias-label-tertiary,#81858c)}
/* 关掉的技能留在列表里，但要一眼看出是关的：左侧状态条 + 标题降饱和（带过渡） */
.skm-skill-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;transition:background 220ms ease}
.skm-skill-card[data-off='true']{background:var(--dsw-alias-bg-layer-1,rgba(0,0,0,.02))}
.skm-skill-card[data-off='true']::before{background:var(--dsw-alias-border-l3,rgba(0,0,0,.2))}
.skm-skill-card[data-off='true'] .skm-skill-badge,.skm-skill-card[data-off='true'] .skm-skill-title{color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-skill-card[data-off='true'] .skm-skill-card-desc{color:var(--dsw-alias-label-quaternary,#a5aab2)}
.skm-skill-badge,.skm-skill-title{transition:color 220ms ease}
.skm-tag-status{background:transparent;border:1px dashed var(--dsw-alias-border-l2,rgba(0,0,0,.18));color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-skill-meta{margin-left:auto;flex:none;font-size:12px;line-height:17px;color:var(--dsw-alias-label-caption,#adb2b8);white-space:nowrap}
.skm-skill-card-foot{display:flex;align-items:center;gap:6px;margin:12px -16px 0;padding:8px 14px 8px 16px;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.06))}
.skm-skill-foot-label{flex:none;font-size:12px;line-height:17px;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-skill-foot-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border:none;border-radius:8px;padding:0;background:transparent;cursor:pointer;color:var(--dsw-alias-label-secondary,#61666b);transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-skill-foot-icon:hover{background:var(--dsw-alias-interactive-bg-hover-solid,#f1f3f5);color:var(--dsw-alias-label-primary,#0f1115);transform:scale(1.05)}
.skm-skill-foot-icon:active{transform:scale(.92)}
.skm-skill-foot-icon:disabled{opacity:.38;cursor:default}
.skm-skill-foot-icon:disabled:hover{background:transparent;color:var(--dsw-alias-label-secondary,#61666b);transform:none}
.skm-skill-foot-icon-danger:hover{background:#fdebeb;color:var(--dsw-alias-state-error-primary,#e0434b)}
.skm-skill-card-actions{margin-left:auto;display:flex;align-items:center;gap:4px}

/* ── Skills Hub 页面骨架：左栏（分类/筛选/添加） / 统计行 / 工具栏 / tabs / 分组 / 卡片 ── */
.skm-hub{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;min-width:0;background:var(--dsw-alias-bg-base,#fff)}
.skm-topbar{flex:none;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05));background:var(--dsw-alias-bg-base,#fff)}
.skm-topbar[data-drop]{outline:2px dashed var(--dsw-alias-state-business-primary,#3d6be5);outline-offset:-2px}
.skm-chip-row{flex:1 1 auto;min-width:200px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.skm-topbar .skm-cat-item{flex:none;width:auto}
.skm-topbar .skm-new-bundle-btn{flex:none;width:auto;margin-top:0;height:32px;font-size:12px}
/* SKILL / MCP 顶层 tab（紧贴标题文字右侧） */
.skm-kind-tabs{flex:none;display:inline-flex;align-items:center;gap:4px;padding:2px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:999px;background:var(--dsw-alias-bg-module-platform,#f2f4f7)}
.skm-kind-tab{flex:none;display:inline-flex;align-items:center;justify-content:center;height:24px;box-sizing:border-box;border:none;border-radius:999px;background:transparent;padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-kind-tab:hover{color:var(--dsw-alias-label-primary,#1f2430)}
.skm-kind-tab:active{transform:scale(.96)}
.skm-kind-tab[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;box-shadow:0 1px 5px rgba(61,107,229,.3)}
/* MCP 视图根：左侧竖排菜单（同技能左栏风格）+ 内容区 */
.skm-mcp-view-root{flex:1;min-height:0;display:flex;min-width:0;overflow-y:auto;padding:14px 20px 22px 0}
.skm-mcp-side{flex:none;width:216px;box-sizing:border-box;padding:4px 12px 0 20px;border-right:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05));display:flex;flex-direction:column;gap:2px}
.skm-mcp-main{flex:1;min-width:0;padding:0 4px 0 18px;display:flex;flex-direction:column}
.skm-mcp-tabs{flex:none;display:flex;align-items:center;gap:10px}
.skm-mcp-tab{flex:none;display:inline-flex;align-items:center;justify-content:center;height:34px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:999px;background:var(--dsw-alias-bg-base,#fff);padding:0 18px;font-size:13px;font-weight:600;line-height:18px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-mcp-tab:hover{color:var(--dsw-alias-label-primary,#1f2430);border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16))}
.skm-mcp-tab:active{transform:scale(.97)}
.skm-mcp-tab[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;box-shadow:0 2px 8px rgba(61,107,229,.3)}
/* MCP Server 页：左主列 + 右信息列 */
.skm-mcp-server-layout{flex:none;display:flex;align-items:flex-start;gap:18px;min-width:0}
/* MCP 页主容器 = 滚动容器：卡片多了/工具多了都能滚到底（父层 .skm-hub-main 是 overflow:hidden）。 */
.skm-mcp-server-main{flex:1 1 auto;min-width:0;min-height:0;display:flex;flex-direction:column;gap:16px;overflow-y:auto;overflow-x:hidden;padding-right:6px;scrollbar-gutter:stable}
/* 图一：头部 */
.skm-mcp-header{flex:none;display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.skm-mcp-header-text{min-width:0;display:flex;flex-direction:column;gap:5px}
.skm-mcp-header-title-row{display:flex;align-items:center;gap:10px}
.skm-mcp-header-title{font-size:20px;font-weight:700;line-height:26px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-header-badge{flex:none;display:inline-flex;align-items:center;height:20px;padding:0 9px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:10.5px;font-weight:600;line-height:14px}
.skm-mcp-header-sub{font-size:12px;line-height:17px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-mcp-header-actions{flex:none;display:inline-flex;align-items:center;gap:8px}
.skm-mcp-market-btn{flex:none;display:inline-flex;align-items:center;height:34px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-base,#fff);padding:0 12px;font-size:13px;line-height:18px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:border-color 140ms ease,color 140ms ease,background 140ms ease,transform 140ms ease}
.skm-mcp-market-btn:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.18));color:var(--dsw-alias-label-primary,#1f2430);background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.02))}
.skm-mcp-market-btn:active{transform:scale(.98)}
.skm-mcp-add-btn{flex:none;display:inline-flex;align-items:center;height:34px;box-sizing:border-box;border:none;border-radius:10px;background:var(--dsw-alias-state-business-primary,#3d6be5);padding:0 14px;font-size:13px;font-weight:600;line-height:18px;font-family:inherit;color:#fff;cursor:pointer;box-shadow:0 2px 8px rgba(61,107,229,.3);transition:background 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-mcp-add-btn:hover{background:#3059cf;box-shadow:0 3px 12px rgba(61,107,229,.4);transform:translateY(-1px)}
.skm-mcp-add-btn:active{transform:translateY(0) scale(.98)}
.skm-mcp-bell-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-mcp-bell-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-bell-btn:active{transform:scale(.94)}
.skm-mcp-copy-hint{flex:none;margin:0;padding:8px 12px;border-radius:10px;background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#2fb344) 10%,transparent);color:var(--dsw-alias-state-success-primary,#2fb344);font-size:12px;line-height:17px}
/* 统计卡（复用技能统计卡样式，去掉列表页内边距） */
.skm-stats-row[data-mcp]{padding:0}
/* 图二：列表卡 */
.skm-mcp-list-card{flex:none;display:flex;flex-direction:column;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:16px;background:var(--dsw-alias-bg-base,#fff);padding:14px 16px 12px;box-shadow:0 1px 3px rgba(16,24,40,.04)}
.skm-mcp-list-head{flex:none;display:flex;align-items:center;gap:8px;padding:2px 2px 10px}
.skm-mcp-list-title{font-size:14px;font-weight:700;line-height:20px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-list-count{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:11px;font-weight:700;line-height:16px;padding:0 6px}
.skm-mcp-list-empty{flex:none;padding:26px 8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c)}
/* MCP 快速了解引导卡（左栏底部，点击右侧悬浮；同技能指南卡样式） */
.skm-mcp-intro-card{flex:none;display:flex;flex-direction:column;gap:5px;margin-top:auto;box-sizing:border-box;border:1px solid #e4e9f8;border-radius:14px;background:var(--dsw-alias-bg-module-platform,#f3f7ff);padding:14px;cursor:pointer;box-shadow:0 1px 2px rgba(16,24,40,.03);transition:border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-mcp-intro-card:hover{border-color:#cdd9f7;box-shadow:0 4px 14px rgba(61,107,229,.08)}
.skm-mcp-intro-title{font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-intro-desc{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-mcp-intro-btn{flex:none;align-self:flex-start;display:inline-flex;align-items:center;gap:5px;margin-top:4px;height:28px;box-sizing:border-box;border:none;border-radius:999px;background:var(--dsw-alias-state-business-primary,#3d6be5);padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:#fff;cursor:pointer;box-shadow:0 2px 6px rgba(61,107,229,.3);transition:background 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-mcp-intro-btn:hover{background:#3059cf;box-shadow:0 3px 10px rgba(61,107,229,.38);transform:translateY(-1px)}
.skm-mcp-intro-btn:active{transform:translateY(0) scale(.97)}
/* MCP 解释悬浮层（同技能指南浮层） */
.skm-mcp-info-overlay{position:fixed;z-index:1001;width:330px;max-height:calc(100vh - 24px);box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:16px;background:var(--dsw-alias-bg-base,#fff);box-shadow:0 12px 40px rgba(16,24,40,.16);display:flex;flex-direction:column;overflow:hidden;animation:skm-guide-in 240ms cubic-bezier(.2,.7,.3,1.06) both}
.skm-mcp-info-overlay-head{flex:none;display:flex;align-items:center;gap:8px;padding:12px 12px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05))}
.skm-mcp-info-overlay-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-info-overlay-title{flex:1;min-width:0;font-size:15px;font-weight:700;line-height:20px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-info-overlay-body{flex:1;min-height:0;overflow-y:auto;padding:12px 14px 20px;display:flex;flex-direction:column;gap:12px}
.skm-mcp-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.skm-mcp-row{display:flex;align-items:center;gap:10px;padding:10px 4px;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05))}
.skm-mcp-row:first-child{border-top:none}
.skm-mcp-row-logo{flex:none;width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:10px;background:var(--dsw-alias-bg-module-platform,#f5f6f7);color:var(--dsw-alias-label-secondary,#61666b)}
.skm-mcp-row-logo[data-kind='slack']{background:#fff}
.skm-mcp-row-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.skm-mcp-row-name-row{display:flex;align-items:center;gap:7px;min-width:0}
.skm-mcp-row-name{font-size:13px;font-weight:600;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-mcp-row-tag{flex:none;display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:999px;font-size:10px;line-height:14px;background:#f1f3f5;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-mcp-row-tag[data-official]{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-row-ext{flex:none;display:inline-flex;border:none;background:transparent;padding:2px;color:var(--dsw-alias-label-caption,#adb2b8);cursor:pointer;transition:color 140ms ease}
.skm-mcp-row-ext:hover{color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-row-desc{font-size:12px;line-height:17px;color:var(--dsw-alias-label-tertiary,#81858c);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-mcp-row-status{flex:none;display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:999px;font-size:11px;line-height:16px;background:#f0f4ee;color:#2f9e44}
.skm-mcp-row-status[data-on]{background:#e7f6ec}
.skm-mcp-row-status:not([data-on]){background:#f2f3f5;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-mcp-view-all{flex:none;align-self:center;display:inline-flex;align-items:center;gap:5px;margin-top:8px;border:none;background:transparent;padding:6px 10px;font-size:12px;line-height:17px;color:var(--dsw-alias-state-business-primary,#3d6be5);cursor:pointer;font-family:inherit;transition:color 140ms ease}
.skm-mcp-view-all:hover{color:#3059cf}
/* 推荐行「添加」小按钮 */
.skm-mcp-add-small-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;height:26px;box-sizing:border-box;border:1px solid #bccff5;border-radius:999px;background:#f4f8ff;padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:var(--dsw-alias-state-business-primary,#3d6be5);cursor:pointer;transition:background 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-add-small-btn:hover{border-color:#9db6ef;background:#e9f1ff}
.skm-mcp-add-small-btn:active{transform:scale(.96)}
/* 推荐 MCP Server 标题 */
.skm-mcp-recommend-title{flex:none;font-size:15px;font-weight:700;line-height:21px;color:var(--dsw-alias-state-business-primary,#3d6be5)}
/* 推荐区：标题行 + 分类 pills + 卡片网格 */
.skm-mcp-rec-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px}
.skm-mcp-rec-cats-row{flex:none;display:flex;align-items:center}
.skm-mcp-rec-results-title{flex:none;font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-rec-stars{flex:none;display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:999px;background:var(--dsw-alias-bg-module-platform,#f1f3f5);color:var(--dsw-alias-label-secondary,#61666b);font-size:10.5px;line-height:16px}
.skm-mcp-open-link{flex:none;display:inline-flex;align-items:center;gap:4px;height:26px;box-sizing:border-box;border:1px solid color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 30%,transparent);border-radius:999px;background:transparent;padding:0 11px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:var(--dsw-alias-state-business-primary,#3d6be5);text-decoration:none;cursor:pointer;transition:background 140ms ease,transform 140ms ease}
.skm-mcp-open-link:hover{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 10%,transparent)}
.skm-mcp-open-link:active{transform:scale(.96)}
.skm-mcp-rec-card-external{border-style:dashed}
.skm-mcp-resolve-err{flex:none;margin:0;font-size:11px;line-height:16px;color:var(--dsw-alias-state-warn-primary,#e0851c)}
.skm-mcp-ext-actions{flex:none;display:inline-flex;align-items:center;gap:6px}
/* MCP Server 卡：自启动/启用 设置行 */
.skm-mcp-card-foot{flex:none;display:flex;align-items:center;gap:12px;margin-top:auto;padding-top:8px;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05))}
.skm-mcp-card-item{flex:none;display:inline-flex;align-items:center;gap:6px}
.skm-mcp-card-item-label{font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-mcp-card-item-meta{flex:none;margin-left:auto;font-size:11px;line-height:16px;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-mcp-card-item-meta[data-on]{color:var(--dsw-alias-state-business-primary,#4176e6)}
.skm-mcp-card-delete{flex:none;margin-left:auto;display:inline-flex;align-items:center;gap:4px;height:26px;box-sizing:border-box;border:1px solid transparent;border-radius:8px;background:transparent;padding:0 8px;font:inherit;font-size:11.5px;font-weight:600;line-height:1;font-family:inherit;color:var(--dsw-alias-label-caption,#adb2b8);cursor:pointer;transition:background 140ms ease,color 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-card-delete:hover{background:#fdebeb;border-color:#f3c4c4;color:var(--dsw-alias-state-error-primary,#e0434b)}
.skm-mcp-card-delete:active{transform:scale(.94)}
.skm-mcp-card-delete:disabled{opacity:.5;cursor:default;transform:none}
.skm-mcp-rec-cats{flex:none;display:inline-flex;align-items:center;gap:6px}
.skm-mcp-rec-cat{flex:none;display:inline-flex;align-items:center;justify-content:center;height:28px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:999px;background:var(--dsw-alias-bg-base,#fff);padding:0 12px;font-size:12px;line-height:17px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-rec-cat:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-rec-cat:active{transform:scale(.96)}
.skm-mcp-rec-cat[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff}
.skm-mcp-rec-grid{flex:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.skm-mcp-rec-card{flex:none;min-width:0;display:flex;flex-direction:column;gap:9px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:14px;background:var(--dsw-alias-bg-base,#fff);padding:14px 16px;box-shadow:0 1px 2px rgba(16,24,40,.03);opacity:0;animation:skm-card-in 260ms cubic-bezier(.2,.7,.3,1.06) forwards;transition:border-color 160ms ease,box-shadow 160ms ease,transform 160ms ease}
.skm-mcp-rec-card:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.13));box-shadow:0 4px 14px rgba(16,24,40,.08);transform:translateY(-1px)}
.skm-mcp-rec-card-head{display:flex;align-items:center;gap:10px;min-width:0}
.skm-mcp-rec-card-title-row{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.skm-mcp-rec-card-name{font-size:14px;font-weight:600;line-height:20px;color:var(--dsw-alias-label-primary,#1f2430);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-mcp-rec-card-tags{display:flex;align-items:center;gap:6px}
.skm-mcp-rec-cat-tag{flex:none;display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:10px;line-height:14px}
.skm-mcp-rec-cat-tag[data-off]{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f5a524) 16%,transparent);color:var(--dsw-alias-state-warn-label,#b26b00)}
.skm-mcp-rec-cat-tag[data-shadow]{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 10%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);border:1px dashed color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 40%,transparent)}
.skm-mcp-rec-cat-tag[data-locked]{background:var(--dsw-alias-bg-module-platform,#f1f3f5);color:var(--dsw-alias-label-tertiary,#81858c);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08))}
.skm-mcp-tool-chip[data-locked]{text-decoration:line-through}
.skm-mcp-tool-chips{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 8px;max-height:132px;overflow-y:auto}
.skm-mcp-tool-chip[data-locked]{opacity:.5;cursor:not-allowed;text-decoration:line-through}
.skm-mcp-tool-chip{font:inherit;font-size:11px;line-height:16px;padding:1px 7px;border-radius:999px;cursor:pointer;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));background:var(--dsw-alias-bg-module-platform,#f1f3f5);color:var(--dsw-alias-label-tertiary,#81858c);transition:background .12s,color .12s,border-color .12s}
.skm-mcp-tool-chip[data-on]{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#2ba471) 12%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary,#2ba471) 34%,transparent);color:var(--dsw-alias-state-success-primary,#2ba471)}
.skm-mcp-tool-chip:hover:not(:disabled){border-color:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 50%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-tool-chip:disabled{opacity:.55;cursor:default}
.skm-mcp-tool-chip[data-busy]{opacity:.35}
.skm-mcp-rec-card-desc{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;min-height:36px}
.skm-mcp-rec-card-foot{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:6px}
.skm-mcp-rec-card-meta{flex:1;min-width:0;font-size:11px;line-height:16px;color:var(--dsw-alias-label-caption,#adb2b8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-mcp-added-tag{flex:none;display:inline-flex;align-items:center;gap:4px;height:26px;box-sizing:border-box;border:1px solid #b7e0c3;border-radius:999px;background:#e7f6ec;padding:0 10px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:#2f9e44;cursor:pointer;transition:background 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-added-tag:hover{border-color:#93cfa6;background:#d9f0e1}
.skm-mcp-added-tag:active{transform:scale(.96)}
/* 添加 MCP Server 表单 */
.skm-mcp-add-form{display:flex;flex-direction:column;gap:8px}
.skm-mcp-add-type-row{display:flex;align-items:center;gap:6px}
.skm-mcp-add-type-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;height:28px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:999px;background:var(--dsw-alias-bg-base,#fff);padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-add-type-btn:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-add-type-btn:active{transform:scale(.96)}
.skm-mcp-add-type-btn[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff}
/* 工具列表搜索框 */
.skm-mcp-tool-search{flex:none;display:flex;align-items:center;gap:8px;height:32px;width:260px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-base,#fff);padding:0 10px;color:var(--dsw-alias-label-caption,#adb2b8);transition:border-color 140ms ease,box-shadow 140ms ease}
.skm-mcp-tool-search:focus-within{border-color:var(--dsw-alias-state-business-primary,#3d6be5);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 14%,transparent)}
.skm-mcp-tool-search-input{flex:1;min-width:0;border:none;outline:none;background:transparent;font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430);font-family:inherit}
.skm-mcp-tool-search-input::placeholder{color:var(--dsw-alias-label-caption,#adb2b8)}
/* 连接日志行 */
.skm-mcp-log-row{display:flex;align-items:center;gap:10px;padding:9px 4px;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05))}
.skm-mcp-log-row:first-child{border-top:none}
.skm-mcp-log-dot{flex:none;width:9px;height:9px;border-radius:50%;background:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-log-dot[data-kind='enable']{background:#2fb26b}
.skm-mcp-log-dot[data-kind='disable']{background:var(--dsw-alias-state-warn-primary,#e8a33d)}
.skm-mcp-log-dot[data-kind='remove']{background:var(--dsw-alias-state-error-primary,#e0434b)}
.skm-mcp-log-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.skm-mcp-log-text{font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-log-text strong{font-weight:600}
.skm-mcp-log-clear{flex:none;display:inline-flex;align-items:center;height:28px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:999px;background:transparent;padding:0 12px;font-size:12px;line-height:17px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:border-color 140ms ease,color 140ms ease,transform 140ms ease}
.skm-mcp-log-clear:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.18));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-log-clear:active{transform:scale(.96)}
/* 配置模板卡 */
.skm-mcp-config-grid{flex:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.skm-mcp-config-card{flex:none;min-width:0;display:flex;flex-direction:column;gap:10px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:14px;background:var(--dsw-alias-bg-base,#fff);padding:12px 14px;box-shadow:0 1px 2px rgba(16,24,40,.03);transition:border-color 160ms ease,box-shadow 160ms ease}
.skm-mcp-config-card:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.13));box-shadow:0 3px 10px rgba(16,24,40,.07)}
.skm-mcp-config-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.skm-mcp-config-title{font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-config-copy{flex:none;display:inline-flex;align-items:center;height:24px;box-sizing:border-box;border:1px solid color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 30%,transparent);border-radius:999px;background:transparent;padding:0 10px;font-size:11px;line-height:16px;font-family:inherit;color:var(--dsw-alias-state-business-primary,#3d6be5);cursor:pointer;transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-mcp-config-copy:hover{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 10%,transparent)}
.skm-mcp-config-copy:active{transform:scale(.96)}
.skm-mcp-config-code{flex:none;margin:0;padding:10px 12px;border-radius:10px;background:var(--dsw-alias-bg-module-platform,#f5f6f7);color:var(--dsw-alias-label-secondary,#61666b);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:17px;overflow:auto}
/* 图三：右侧信息栏 */
.skm-mcp-info-col{flex:none;width:322px;display:flex;flex-direction:column;gap:12px}
.skm-mcp-info-card{flex:none;display:flex;flex-direction:column;gap:9px;box-sizing:border-box;border:1px solid #dfe8fa;border-radius:14px;background:var(--dsw-alias-bg-module-platform,#f1f5ff);padding:14px}
.skm-mcp-info-card-title{font-size:14px;font-weight:700;line-height:20px;color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-info-desc{margin:0;font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-mcp-info-points{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.skm-mcp-point{display:flex;gap:8px;align-items:flex-start}
.skm-mcp-point-icon{flex:none;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:#e7effe;color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-point-body{min-width:0;display:flex;flex-direction:column;gap:1px}
.skm-mcp-point-title{font-size:12px;font-weight:600;line-height:17px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-point-desc{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#81858c)}
/* 工作原理流程 */
.skm-mcp-flow{flex:none;display:flex;align-items:center;gap:4px}
.skm-mcp-flow-node{flex:none;width:64px;display:inline-flex;flex-direction:column;align-items:center;gap:4px}
.skm-mcp-flow-icon{flex:none;width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;background:#e7effe;color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-flow-icon[data-client]{background:#dbebfd;color:#2276d2}
.skm-mcp-flow-icon[data-server]{background:#eae8fa;color:#6b46e5}
.skm-mcp-flow-label{font-size:10px;line-height:14px;color:var(--dsw-alias-label-secondary,#61666b);white-space:nowrap}
.skm-mcp-flow-arrow{flex:1;min-width:0;display:inline-flex;flex-direction:column;align-items:center;gap:2px;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-mcp-flow-arrow-text{font-size:9px;line-height:12px;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-mcp-flow-ext{flex:none;display:flex;flex-direction:column;gap:6px;padding-top:6px;border-top:1px dashed var(--dsw-alias-border-l2,rgba(0,0,0,.1))}
.skm-mcp-flow-ext-label{font-size:10px;line-height:14px;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-mcp-flow-ext-icons{display:flex;gap:8px}
.skm-mcp-flow-ext-icon{flex:none;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.07));border-radius:8px;background:#fff;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-mcp-api-text{font-size:9px;font-weight:700;color:var(--dsw-alias-state-business-primary,#3d6be5)}
/* 快速上手 */
.skm-mcp-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.skm-mcp-step{display:flex;gap:8px;align-items:flex-start}
.skm-mcp-step-num{flex:none;width:22px;height:22px;border-radius:50%;background:#e7effe;color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:12px;font-weight:700;line-height:22px;text-align:center}
.skm-mcp-step-body{min-width:0;display:flex;flex-direction:column;gap:1px}
.skm-mcp-step-title{font-size:12px;font-weight:600;line-height:17px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-step-desc{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#81858c)}
/* MCP 空态（工具列表/连接日志/配置模板占位） */
.skm-mcp-empty{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px}
.skm-mcp-empty-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);box-shadow:0 4px 12px rgba(61,107,229,.1)}
.skm-mcp-empty-title{font-size:16px;font-weight:700;line-height:22px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-empty-desc{font-size:13px;line-height:19px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-hub-row{flex:1;min-height:0;min-width:0;display:flex}
/* 右侧指南浮层卡（点击「开始学习」出现，贴面板右缘，不压缩面板） */
.skm-guide-panel{position:fixed;z-index:1001;width:300px;max-height:calc(100vh - 24px);box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:16px;background:var(--dsw-alias-bg-base,#fff);box-shadow:0 12px 40px rgba(16,24,40,.16);display:flex;flex-direction:column;overflow:hidden;animation:skm-guide-in 240ms cubic-bezier(.2,.7,.3,1.06) both}
@keyframes skm-guide-in{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
.skm-guide-panel-head{flex:none;display:flex;align-items:center;gap:8px;padding:12px 12px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05))}
.skm-guide-panel-logo{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-guide-panel-title{flex:1;min-width:0;font-size:15px;font-weight:700;line-height:20px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-guide-panel-close{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-caption,#adb2b8);cursor:pointer;transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-guide-panel-close:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-guide-panel-close:active{transform:scale(.9)}
.skm-guide-panel-body{flex:1;min-height:0;overflow-y:auto;padding:12px 14px 20px;display:flex;flex-direction:column;gap:14px}
.skm-guide-sec{flex:none;display:flex;flex-direction:column;gap:8px}
.skm-guide-sec-head{display:flex;align-items:center;gap:7px}
.skm-guide-sec-icon{flex:none;display:inline-flex;width:22px;height:22px;align-items:center;justify-content:center;border-radius:7px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-guide-sec-title{font-size:14px;font-weight:700;line-height:20px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-guide-what-desc{margin:0;font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-guide-caps{display:flex;flex-wrap:wrap;gap:6px 10px}
.skm-guide-cap{flex:none;display:inline-flex;align-items:center;gap:4px}
.skm-guide-cap-icon{flex:none;display:inline-flex;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-guide-cap-label{font-size:10px;line-height:14px;color:var(--dsw-alias-label-tertiary,#81858c);white-space:nowrap}
.skm-guide-step{display:flex;gap:8px;padding:2px 0}
.skm-guide-step-num{flex:none;width:22px;height:22px;border-radius:50%;background:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;font-size:12px;font-weight:700;line-height:22px;text-align:center}
.skm-guide-step-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.skm-guide-step-title-row{display:flex;align-items:center;gap:6px}
.skm-guide-step-title{font-size:13px;font-weight:600;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-guide-step-arrow{margin-left:auto;flex:none;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-guide-step-desc{margin:0;font-size:11px;line-height:17px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-guide-full-btn{flex:none;align-self:stretch;display:inline-flex;align-items:center;justify-content:center;gap:6px;margin-top:6px;height:32px;box-sizing:border-box;border:1px solid #bccff5;border-radius:999px;background:#f4f8ff;color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:12px;font-weight:600;line-height:18px;font-family:inherit;padding:0 12px;cursor:pointer;transition:background 140ms ease,border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-guide-full-btn:hover{border-color:#9db6ef;background:#e9f1ff;box-shadow:0 2px 8px rgba(61,107,229,.1)}
.skm-guide-full-btn:active{transform:scale(.98)}
.skm-guide-best{flex:none;display:flex;flex-direction:column;gap:8px;box-sizing:border-box;border:1px solid #dbe6fb;border-radius:14px;background:var(--dsw-alias-bg-module-platform,#eef4ff);padding:12px 12px 0;overflow:hidden;position:relative}
.skm-guide-best-title{font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-guide-best-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.skm-guide-best-item{display:flex;align-items:center;gap:7px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-guide-best-item svg{flex:none;color:#2fb26b}
.skm-guide-more-btn{flex:none;align-self:flex-start;display:inline-flex;align-items:center;gap:5px;border:none;background:transparent;padding:2px 0;font-size:11px;line-height:16px;color:var(--dsw-alias-state-business-primary,#3d6be5);cursor:pointer;font-family:inherit;transition:color 140ms ease}
.skm-guide-more-btn:hover{color:#3059cf}
.skm-guide-best-art{flex:none;display:inline-flex;align-items:flex-end;justify-content:center;margin:2px -12px 0;transform:scale(.8);transform-origin:bottom right;pointer-events:none}
.skm-hub-side{flex:none;width:216px;box-sizing:border-box;padding:16px 14px 16px 16px;border-right:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05));background:var(--dsw-alias-bg-base,#fff);overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.skm-cat-title{flex:none;margin:0 6px 10px;font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-cat-list{flex:none;display:flex;flex-direction:column;gap:4px;max-height:190px;overflow-y:auto;padding-right:2px;box-sizing:border-box;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2,rgba(0,0,0,.18));--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2,rgba(0,0,0,.3))}
.skm-cat-item{flex:none;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;border:1px solid transparent;border-radius:10px;padding:8px 10px;background:transparent;cursor:pointer;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);transition:background 140ms ease,border-color 140ms ease,color 140ms ease,box-shadow 140ms ease}
.skm-cat-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.03));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-cat-item[data-active]{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);border-color:rgba(61,107,229,.10);color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-cat-icon{flex:none;display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;color:var(--dsw-alias-label-caption,#adb2b8);transition:color 140ms ease}
.skm-cat-icon[data-active]{color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-cat-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font-size:13px;font-weight:500;line-height:18px}
.skm-cat-item[data-active] .skm-cat-label{font-weight:600}
.skm-cat-count{flex:none;font-size:12px;line-height:16px;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-cat-item[data-active] .skm-cat-count{color:var(--dsw-alias-state-business-primary,#5b82e5)}
.skm-cat-count[data-warn]{color:#e0851c;font-weight:600}
.skm-filters-title{flex:none;margin:18px 6px 8px;font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-filter-block{flex:none;display:flex;flex-direction:column;gap:8px}
/* 启用状态：平铺三档分段按钮 */
.skm-status-seg{flex:none;display:flex;align-items:center;gap:6px;padding:0 2px}
.skm-status-seg-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;height:30px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:999px;background:var(--dsw-alias-bg-base,#fff);padding:0 10px;font-size:12px;line-height:17px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;white-space:nowrap;transition:background 140ms ease,color 140ms ease,border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-status-seg-btn:hover{color:var(--dsw-alias-label-primary,#1f2430);border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16))}
.skm-status-seg-btn:active{transform:scale(.96)}
.skm-status-seg-btn[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;box-shadow:0 2px 6px rgba(61,107,229,.28)}
.skm-filter-row-wrap{position:relative;flex:none}
.skm-filter-row{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;height:34px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:9px;background:var(--dsw-alias-bg-base,#fff);padding:0 10px;font-family:inherit;cursor:pointer;transition:border-color 140ms ease,box-shadow 140ms ease}
.skm-filter-row:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16))}
.skm-filter-row[aria-expanded='true']{border-color:var(--dsw-alias-state-business-primary,var(--dsw-alias-state-business-primary,#3d6be5));box-shadow:0 0 0 2px rgba(61,107,229,.12)}
.skm-filter-row-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font-size:12px;line-height:17px;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-filter-row-label-strong{font-weight:600;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-filter-row-chevron{flex:none;color:var(--dsw-alias-label-caption,#adb2b8);transition:transform 140ms ease}
.skm-filter-row-chevron[data-open]{transform:rotate(180deg)}
.skm-filter-menu{position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:60;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 8px 22px rgba(16,24,40,.12);padding:4px;display:flex;flex-direction:column;gap:2px;animation:skm-form-in 140ms ease-out}
.skm-filter-option{display:flex;align-items:center;gap:8px;width:100%;border:none;border-radius:8px;padding:7px 10px;background:transparent;font-size:13px;line-height:18px;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;font-family:inherit;text-align:left;white-space:nowrap;transition:background 120ms ease,color 120ms ease}
.skm-filter-option:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-preset-dot{flex:none;justify-content:center;width:8px;height:8px;border-radius:50%;background:transparent;margin-left:auto}
.skm-preset-dot[data-on]{background:var(--dsw-alias-state-business-primary,#e0851c)}
/* 新建技能包按钮（左栏，添加技能卡上方） */
.skm-new-bundle-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;width:100%;box-sizing:border-box;margin-top:18px;border:1px solid #c7d6f7;border-radius:10px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:13px;font-weight:600;line-height:18px;font-family:inherit;padding:0 12px;cursor:pointer;transition:background 140ms ease,border-color 140ms ease,color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-new-bundle-btn:hover{border-color:#9db6ef;background:#e3ecff;box-shadow:0 2px 8px rgba(61,107,229,.12)}
.skm-new-bundle-btn:active{transform:scale(.98)}
.skm-new-bundle-btn-open{border-color:var(--dsw-alias-state-business-primary,#3d6be5);background:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;box-shadow:0 2px 8px rgba(61,107,229,.3)}
.skm-new-bundle-btn-open:hover{background:#3059cf;border-color:#3059cf;color:#fff}
/* 添加技能卡 */
.skm-add-card{flex:none;display:flex;flex-direction:column;gap:8px;margin-top:18px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:14px;background:var(--dsw-alias-bg-base,#fff);padding:12px;cursor:pointer;box-shadow:0 1px 2px rgba(16,24,40,.04);transition:border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-add-card:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.14));box-shadow:0 4px 14px rgba(16,24,40,.08)}
.skm-add-card-active{border-color:var(--dsw-alias-state-business-primary,#3d6be5);box-shadow:0 0 0 2px rgba(61,107,229,.14)}
.skm-add-card-head{display:flex;align-items:center;gap:8px}
.skm-add-card-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;color:var(--dsw-alias-state-business-primary,#3d6be5);background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent)}
.skm-add-card-title{font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-add-card-sub{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-add-drop{flex:none;display:flex;flex-direction:column;align-items:center;gap:2px;border:1px dashed var(--dsw-alias-border-l3,rgba(0,0,0,.18));border-radius:10px;padding:12px 8px;color:var(--dsw-alias-label-tertiary,#81858c);background:var(--dsw-alias-bg-module-platform,#fafbfc);transition:border-color 140ms ease,background 140ms ease}
.skm-add-card:hover .skm-add-drop{border-color:rgba(61,107,229,.4);background:#f5f8ff}
.skm-add-drop-icon{flex:none;display:inline-flex}
.skm-add-drop-text{font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-add-drop-hint{font-size:10px;line-height:14px;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-add-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;height:32px;box-sizing:border-box;border:none;border-radius:9px;background:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;font-size:13px;font-weight:600;line-height:18px;font-family:inherit;padding:0 12px;cursor:pointer;box-shadow:0 1px 3px rgba(61,107,229,.35);transition:background 140ms ease,transform 140ms ease,box-shadow 140ms ease}
.skm-add-btn:hover{background:#3059cf;box-shadow:0 2px 8px rgba(61,107,229,.4);transform:translateY(-1px)}
.skm-add-btn:active{transform:translateY(0) scale(.98)}
/* 快速上手指南卡（添加技能卡下方） */
.skm-guide-card{flex:none;display:flex;flex-direction:column;gap:5px;margin-top:18px;box-sizing:border-box;border:1px solid #e4e9f8;border-radius:14px;background:var(--dsw-alias-bg-module-platform,#f3f7ff);padding:14px;overflow:hidden;position:relative;box-shadow:0 1px 2px rgba(16,24,40,.03);transition:border-color 140ms ease,box-shadow 140ms ease}
.skm-guide-card:hover{border-color:#cdd9f7;box-shadow:0 4px 14px rgba(61,107,229,.08)}
.skm-guide-title{font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-guide-desc{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-guide-btn{flex:none;align-self:flex-start;display:inline-flex;align-items:center;gap:5px;margin-top:4px;height:28px;box-sizing:border-box;border:none;border-radius:999px;background:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;font-size:12px;font-weight:600;line-height:18px;font-family:inherit;padding:0 12px;cursor:pointer;box-shadow:0 2px 6px rgba(61,107,229,.3);transition:background 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-guide-btn:hover{background:#3059cf;box-shadow:0 3px 10px rgba(61,107,229,.38);transform:translateY(-1px)}
.skm-guide-btn:active{transform:translateY(0) scale(.97)}
.skm-guide-art{flex:none;display:inline-flex;align-items:flex-end;justify-content:center;margin:8px -14px 0;padding-top:6px;background:linear-gradient(180deg,rgba(61,107,229,.06),rgba(61,107,229,.14))}
.skm-guide-modal-text{margin:0;font-size:13px;line-height:22px;color:var(--dsw-alias-label-secondary,#4a4f5a)}
.skm-hub-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden}
/* ── 统计卡（参考设计稿）：左圆形渐变图标 + 图标下光点，右侧标题/大数字/描述 ── */
.skm-stats-row{flex:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;padding:14px 16px 0}
.skm-stat{position:relative;min-width:0;display:flex;align-items:center;gap:14px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:15px;background:var(--dsw-alias-bg-base,#fff);padding:15px 18px;box-shadow:0 1px 2px rgba(16,24,40,.04);opacity:0;animation:skm-card-in 260ms cubic-bezier(.2,.7,.3,1.06) forwards;transition:box-shadow 160ms ease,transform 160ms ease,border-color 160ms ease}
.skm-stat:hover{box-shadow:0 6px 18px rgba(16,24,40,.09);transform:translateY(-1px);border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.13))}
.skm-stat-icon-col{flex:none;width:46px;display:flex;flex-direction:column;align-items:center;gap:9px}
.skm-stat-icon{flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.skm-stat-icon[data-tone='blue']{color:#4f6af5;background:color-mix(in srgb,#4f6af5 13%,transparent)}
.skm-stat-icon[data-tone='green']{color:#2fb26b;background:color-mix(in srgb,#2fb26b 13%,transparent)}
.skm-stat-icon[data-tone='violet']{color:#8b5cf6;background:color-mix(in srgb,#8b5cf6 13%,transparent)}
.skm-stat-icon[data-tone='orange']{color:#f28d0f;background:color-mix(in srgb,#f28d0f 13%,transparent)}
/* 图标正下方的渐变光点（与图标同色，向下淡出） */
.skm-stat-glow{flex:none;width:4px;height:11px;border-radius:99px}
.skm-stat-glow[data-tone='blue']{background:linear-gradient(to bottom,color-mix(in srgb,#4f6af5 65%,transparent),transparent)}
.skm-stat-glow[data-tone='green']{background:linear-gradient(to bottom,color-mix(in srgb,#2fb26b 60%,transparent),transparent)}
.skm-stat-glow[data-tone='violet']{background:linear-gradient(to bottom,color-mix(in srgb,#8b5cf6 60%,transparent),transparent)}
.skm-stat-glow[data-tone='orange']{background:linear-gradient(to bottom,color-mix(in srgb,#f28d0f 60%,transparent),transparent)}
.skm-stat-body{flex:1;min-width:0;display:flex;flex-direction:column;align-items:stretch}
.skm-stat-label{font-size:12px;line-height:17px;color:var(--dsw-alias-label-secondary,#8f96a3)}
.skm-stat-value{font-size:26px;font-weight:700;line-height:31px;letter-spacing:-.2px;color:var(--dsw-alias-label-primary,#23273a);font-variant-numeric:tabular-nums;white-space:nowrap}
.skm-stat-value-row{display:flex;align-items:center;gap:6px}
.skm-stat-chevron{flex:none;margin-left:auto;color:#c3c8d3;transition:transform 160ms ease,color 160ms ease}
.skm-stat:hover .skm-stat-chevron{color:#9aa2b3;transform:translateX(2px)}
.skm-stat-value[data-tone='warn']{color:#b45309}
.skm-stat-value[data-tone='pending']{color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-stat-desc{font-size:12px;line-height:17px;color:var(--dsw-alias-label-tertiary,#a5aab5);margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-health-notice{flex:none;margin:8px 16px 0;box-sizing:border-box;border:1px solid #f0cf9e;border-radius:10px;background:#fdf6e3;padding:8px 12px;display:flex;flex-direction:column;gap:4px;animation:skm-form-in 180ms ease-out}
.skm-health-notice-title{font-size:12px;font-weight:700;line-height:17px;color:#b45309}
.skm-health-notice ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.skm-health-notice li{font-size:12px;line-height:17px;color:#8a5a17}
.skm-toolbar{flex:none;display:flex;align-items:center;gap:8px;padding:12px 16px 4px;flex-wrap:wrap}
.skm-search-box{flex:1;min-width:170px;display:flex;align-items:center;gap:8px;height:36px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-base,#fff);padding:0 12px;color:var(--dsw-alias-label-caption,#adb2b8);transition:border-color 140ms ease,box-shadow 140ms ease}
.skm-search-box:focus-within{border-color:var(--dsw-alias-state-business-primary,#4176e6);box-shadow:0 0 0 3px rgba(65,118,230,.14)}
.skm-search-input{flex:1;min-width:0;border:none;outline:none;background:transparent;font-size:13px;line-height:18px;color:var(--dsw-alias-label-primary,#0f1115);font-family:inherit}
.skm-search-input::placeholder{color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-tool-select-wrap{position:relative;flex:none;display:inline-flex;align-items:center}
.skm-tool-select{appearance:none;-webkit-appearance:none;height:36px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-secondary,#61666b);font-size:13px;line-height:18px;font-family:inherit;padding:0 26px 0 12px;cursor:pointer;transition:border-color 140ms ease,background 140ms ease}
.skm-tool-select:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.18))}
.skm-tool-select:focus-visible{outline:none;border-color:var(--dsw-alias-state-business-primary,#4176e6)}
.skm-tool-select-chevron{position:absolute;right:9px;pointer-events:none;color:var(--dsw-alias-label-caption,#adb2b8)}
.skm-tool-button{flex:none;display:inline-flex;align-items:center;gap:6px;height:36px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-secondary,#61666b);font-size:13px;line-height:18px;font-family:inherit;padding:0 12px;cursor:pointer;transition:border-color 140ms ease,background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-tool-button:hover{background:var(--dsw-alias-interactive-bg-hover-solid,#f7f8f9);color:var(--dsw-alias-label-primary,#0f1115)}
.skm-tool-button:active{transform:scale(.97)}
.skm-tool-button:disabled{opacity:.5;cursor:default}
.skm-toolbar-spacer{flex:1 1 12px}
.skm-bulk-overlay{position:fixed;inset:0;z-index:995;border:none;background:transparent;cursor:default;padding:0}
.skm-preset-pill{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:36px;box-sizing:border-box;border:1px solid #c9d6f5;border-radius:10px;background:#eef3fd;color:#3b62d6;padding:0 10px;font-family:inherit;font-size:13px;line-height:18px;cursor:pointer;transition:border-color 140ms ease,background 140ms ease,transform 140ms ease}
.skm-preset-pill:active{transform:scale(.97)}
.skm-preset-pill-label{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-preset-select{appearance:none;-webkit-appearance:none;border:none;outline:none;background:transparent;color:inherit;font-size:13px;line-height:18px;font-family:inherit;padding:0 18px 0 0;cursor:pointer;max-width:150px}
.skm-preset-pill-chevron{pointer-events:none;color:#6f8cd6;transition:transform 140ms ease}
.skm-preset-pill[aria-expanded='true'] .skm-preset-pill-chevron{transform:rotate(180deg)}
.skm-drop-wrap{position:relative;flex:none}
.skm-drop-menu{position:absolute;top:calc(100% + 4px);left:0;z-index:996;min-width:180px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 6px 20px rgba(16,24,40,.12);padding:4px;display:flex;flex-direction:column;gap:2px;animation:skm-form-in 140ms ease-out;max-height:320px;overflow-y:auto}
.skm-drop-item{display:flex;align-items:center;gap:8px;border:none;border-radius:8px;padding:7px 10px;background:transparent;font-size:13px;line-height:18px;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;font-family:inherit;text-align:left;white-space:nowrap;transition:background 120ms ease,color 120ms ease}
.skm-drop-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));color:var(--dsw-alias-label-primary,#0f1115)}
.skm-drop-item[aria-checked='true']{color:var(--dsw-alias-label-primary,#0f1115);font-weight:600}
.skm-drop-check{flex:none;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--dsw-alias-state-business-primary,#4176e6);opacity:0;transform:scale(.6);transition:opacity 140ms ease,transform 140ms ease}
.skm-drop-check[data-on]{opacity:1;transform:scale(1)}
.skm-drop-badge{margin-left:auto;flex:none;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary,#61666b);background:var(--dsw-alias-bg-module-platform,#f1f3f5);border-radius:999px;padding:0 8px}
.skm-view-toggle{flex:none;display:inline-flex;align-items:center;gap:2px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-base,#fff);padding:3px;transition:border-color 140ms ease}
.skm-view-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;width:30px;height:28px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-caption,#adb2b8);cursor:pointer;transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-view-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));color:var(--dsw-alias-label-secondary,#61666b)}
.skm-view-btn[data-active]{background:var(--dsw-alias-bg-module-platform,#eef0f2);color:var(--dsw-alias-label-primary,#0f1115)}
.skm-view-btn:active{transform:scale(.94)}
.skm-hint-row{flex:none;display:flex;align-items:center;gap:10px;padding:6px 16px 0}
.skm-hint-row-text{flex:1;min-width:0;font-size:12px;line-height:17px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-banner{flex:none;display:flex;align-items:center;gap:12px;margin:10px 16px 0;box-sizing:border-box;border:1px solid #f2df9e;border-radius:14px;background:#fdf8e3;padding:10px 12px;cursor:pointer;transition:border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-banner:hover{border-color:#ecd58a;box-shadow:0 2px 8px rgba(232,163,61,.12)}
.skm-banner:active{transform:scale(.995)}
.skm-banner-active{border-color:#e8a33d;box-shadow:0 0 0 3px rgba(232,163,61,.18)}
.skm-banner-icon{flex:none;width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1.5px solid #e8a33d;color:#e8a33d;background:transparent}
.skm-banner-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.skm-banner-title{font-size:14px;font-weight:700;line-height:20px;color:#1f2937}
.skm-banner-sub{font-size:12px;line-height:17px;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-banner-btn{flex:none;display:inline-flex;align-items:center;height:32px;box-sizing:border-box;border:none;border-radius:10px;background:#e8850c;color:#fff;font-size:13px;font-weight:600;line-height:18px;font-family:inherit;padding:0 14px;cursor:pointer;box-shadow:0 1px 3px rgba(232,133,12,.35);transition:background 140ms ease,transform 140ms ease,box-shadow 140ms ease}
.skm-banner-btn:hover{background:#d67906;box-shadow:0 2px 8px rgba(232,133,12,.4);transform:translateY(-1px)}
.skm-banner-btn:active{transform:translateY(0) scale(.98)}
.skm-main-scroll{flex:1;min-height:0;overflow-y:auto;padding:12px 16px 20px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-content:start;align-items:start}
.skm-hub-section{min-width:0}
.skm-hub-section[data-open]{grid-column:1/-1}
.skm-main-scroll>.skm-status{grid-column:1/-1}
.skm-hub-section{display:flex;flex-direction:column;min-width:0}
.skm-hub-section-head{display:flex;align-items:center;gap:8px;min-width:0;padding:2px 4px 0}
.skm-no-result{padding:18px 4px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-tertiary,#81858c)}
/* 新建技能包入口（灰字按钮行） */
.skm-new-bundle-line{flex:none;align-self:flex-start;display:inline-flex;align-items:center;gap:4px;border:none;border-radius:8px;padding:6px 10px;margin:2px 0 0 4px;background:transparent;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c);cursor:pointer;font-family:inherit;transition:background 140ms ease,color 140ms ease}
.skm-new-bundle-line:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));color:var(--dsw-alias-label-secondary,#61666b)}
/* 分页行 */
.skm-pagination{flex:none;display:flex;align-items:center;gap:10px;padding:4px 4px 0}
.skm-page-info{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-page-btns{flex:1;display:flex;align-items:center;gap:4px}
.skm-page-btn{flex:none;min-width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:8px;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-secondary,#61666b);font-size:12px;line-height:18px;font-family:inherit;cursor:pointer;transition:border-color 140ms ease,color 140ms ease,background 140ms ease,transform 140ms ease}
.skm-page-btn:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-page-btn:active{transform:scale(.94)}
.skm-page-btn:disabled{opacity:.45;cursor:default}
.skm-page-btn[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff}
.skm-page-size-sel{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#61666b)}

/* ── 归入技能包弹窗（卡片化，与技能卡片同语言） ─────────────── */
.skm-assign-modal{width:min(560px,calc(100vw - 48px))}
.skm-assign-modal-body{overflow:hidden;display:flex;flex-direction:column;max-height:min(560px,calc(100vh - 180px))}
.skm-assign-list{list-style:none;margin:0;padding:4px 2px 2px;display:flex;flex-direction:column;gap:8px;overflow-y:auto}
.skm-assign-card{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));border-radius:12px;background:var(--dsw-alias-bg-base,#fff);padding:10px 12px;cursor:pointer;font-family:inherit;text-align:left;opacity:0;animation:skm-card-in 240ms cubic-bezier(.2,.7,.3,1.06) forwards;animation-delay:calc(var(--skm-i,0)*45ms);transition:border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-assign-card:hover{border-color:var(--dsw-alias-state-business-primary,#4176e6);box-shadow:0 2px 8px rgba(16,24,40,.07);transform:translateY(-1px)}
.skm-assign-card:active{transform:translateY(0) scale(.99)}
.skm-assign-card-icon{flex:none;width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:10px;background:var(--dsw-alias-bg-module-platform,#f5f6f7);color:var(--dsw-alias-label-secondary,#61666b);transition:color 140ms ease,border-color 140ms ease}
.skm-assign-card:hover .skm-assign-card-icon{color:var(--dsw-alias-label-primary,#0f1115);border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.14))}
.skm-assign-card-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.skm-assign-card-name{font-size:14px;font-weight:600;line-height:20px;color:var(--dsw-alias-label-primary,#0f1115);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-assign-card-desc{font-size:12px;line-height:17px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-assign-go{flex:none;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;color:var(--dsw-alias-label-caption,#adb2b8);transform:rotate(-90deg);transition:transform 160ms ease,background 140ms ease,color 140ms ease}
.skm-assign-card:hover .skm-assign-go{transform:rotate(-90deg) translateX(2px);color:var(--dsw-alias-state-business-primary,#4176e6);background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.03))}
.skm-skill-list{list-style:none;margin:0;padding:2px 6px 6px;width:100%;display:flex;flex-direction:column;gap:2px}
.skm-skill-item{display:flex;flex-direction:column;gap:2px;padding:2px 0;border-radius:8px}
.skm-skill-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.skm-skill-row{display:flex;align-items:center;gap:6px;padding:2px 6px;border-radius:8px}
.skm-skill-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.skm-skill-label{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}
.skm-skill-name{font-size:13px;line-height:18px;color:var(--dsw-alias-label-primary,#eee);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-skill-desc{font-size:12px;line-height:16px;color:var(--dsw-alias-label-tertiary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-skill-expand{flex:none;display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border:none;border-radius:6px;padding:0;background:transparent;cursor:pointer;color:var(--dsw-alias-label-tertiary,#888);transition:transform 120ms}
.skm-skill-expand:hover{color:var(--dsw-alias-label-primary,#eee);background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.skm-skill-expand[data-open='true']{transform:rotate(180deg)}
.skm-skill-count{flex:none;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#888);background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.05));border-radius:8px;padding:0 6px;white-space:nowrap}
.skm-skill-compat{flex:none;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:170px}
.skm-skill-files{list-style:none;margin:0 0 2px 10px;padding:2px 0 2px 10px;border-left:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.1));display:flex;flex-direction:column;gap:0}
.skm-skill-file{display:flex;align-items:center;gap:6px;padding:2px 6px;border-radius:6px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#bbb);font-family:ui-monospace,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.skm-skill-file:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.skm-skill-file[data-main='true']{color:var(--dsw-alias-label-primary,#eee);font-weight:500}
.skm-skill-dir{color:var(--dsw-alias-label-tertiary,#888)}
.skm-skill-preview{border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:10px;background:var(--dsw-alias-bg-base,#0e1116);padding:8px 12px;margin:0 0 2px 10px;font-size:12px;line-height:20px;color:var(--dsw-alias-label-primary,#eee);overflow:auto;max-height:280px;box-sizing:border-box}
.skm-skill-preview h3,.skm-skill-preview h4,.skm-skill-preview h5{margin:10px 0 4px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary,#eee)}
.skm-skill-preview p{margin:4px 0}
.skm-skill-preview pre{background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.05));border-radius:8px;padding:8px 10px;overflow:auto;font-family:ui-monospace,monospace;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary,#bbb);margin:6px 0}
.skm-skill-preview code{background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.05));border-radius:4px;padding:0 4px;font-family:ui-monospace,monospace;font-size:11px}
.skm-skill-preview a{color:var(--dsw-alias-state-business-primary,#4a9eff)}
.skm-skill-preview ul{margin:4px 0;padding-left:18px}
.skm-skill-preview li{margin:2px 0}
/* 查看器默认就是大画幅（1280×880 上限，随视口收缩），可一键全屏；宽/高带缓动过渡。 */
.skm-viewer-modal{width:min(1280px,calc(100vw - 64px));animation:skm-viewer-in 260ms cubic-bezier(.2,.7,.3,1.06);transition:width 320ms cubic-bezier(.22,.72,.24,1)}
.skm-viewer-modal-full{width:calc(100vw - 48px)}
@keyframes skm-viewer-in{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
.skm-viewer-body{overflow:hidden;display:flex;flex-direction:column;height:min(880px,calc(100vh - 96px));transition:height 320ms cubic-bezier(.22,.72,.24,1);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}
/* 官方 Modal 的 root 自带 24px 内边距、dialog 自带 24px 下内边距：
   全屏档按这两处留白收，免得被 flex-shrink 截断或上下溢出。 */
.skm-viewer-modal-full .skm-viewer-body{height:calc(100vh - 76px)}
/* 弹窗头部（官方 Modal 的 header 是本容器第一个 div）：随大画幅放大一档。 */
.skm-viewer-body > div:first-child{padding:20px 18px 0 26px}
.skm-viewer-body > div:first-child h2{font-size:17px;line-height:26px;font-weight:600}
.skm-viewer-body > div:nth-of-type(2){flex:1;min-height:0;display:flex;flex-direction:column;margin-top:2px;padding:0 20px 20px}
.skm-viewer-toolbar{flex:none;display:flex;align-items:center;gap:10px;padding:0 2px 12px}
.skm-viewer-path{flex:1;min-width:0;display:flex;align-items:center;gap:8px;font-size:12.5px;line-height:18px;font-family:ui-monospace,monospace;color:var(--dsw-alias-label-tertiary,#888);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.skm-viewer-path b{font-weight:600;color:var(--dsw-alias-label-secondary,#61666b)}
.skm-viewer-tool-group{flex:none;display:inline-flex;align-items:center;gap:2px;padding:2px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));border-radius:10px;background:var(--dsw-alias-bg-module-platform,#f5f6f7)}
.skm-viewer-tool-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:26px;padding:0 7px;box-sizing:border-box;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#61666b);font-family:inherit;font-weight:600;line-height:16px;cursor:pointer;transition:background 140ms ease,color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-viewer-tool-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-viewer-tool-btn:active{transform:scale(.93)}
.skm-viewer-tool-btn[data-active='true']{background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-state-business-primary,#4176e6);box-shadow:0 1px 3px rgba(16,24,40,.12)}
.skm-viewer-tool-btn-a1{font-size:11px}
.skm-viewer-tool-btn-a3{font-size:15px}
.skm-viewer-tool-btn-frame{border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));border-radius:10px;background:var(--dsw-alias-bg-base,#fff)}
.skm-viewer-tool-btn-frame[data-active='true']{border-color:var(--dsw-alias-state-business-primary,#4176e6);background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#4176e6) 10%,transparent);color:var(--dsw-alias-state-business-primary,#4176e6);box-shadow:none}
.skm-viewer-layout{flex:1;min-height:0;display:flex;border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));border-radius:14px;overflow:hidden}
.skm-viewer-nav{flex:none;width:252px;border-right:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));overflow-y:auto;padding:8px;box-sizing:border-box;background:var(--dsw-alias-bg-module-platform,#f5f6f7)}
.skm-viewer-nav-item{display:flex;align-items:center;gap:6px;padding:5px 9px;border-radius:8px;font-size:12.5px;line-height:20px;color:var(--dsw-alias-label-secondary,#bbb);font-family:ui-monospace,monospace;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:background 140ms ease,color 140ms ease,box-shadow 160ms ease}
.skm-viewer-nav-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.skm-viewer-nav-item[data-active='true']{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#4a9eff) 14%,transparent);color:var(--dsw-alias-label-primary,#eee);box-shadow:inset 2px 0 0 var(--dsw-alias-state-business-primary,#4a9eff)}
.skm-viewer-nav-dir{cursor:default;color:var(--dsw-alias-label-tertiary,#888)}
/* 正文全部走 em：--skm-vfs 一个变量驱动字号三档，切换时只过渡 font-size。 */
.skm-viewer-content{flex:1;min-width:0;overflow:auto;padding:26px 34px 48px;box-sizing:border-box;font-size:var(--skm-vfs,15px);line-height:1.75;color:var(--dsw-alias-label-primary,#eee);transition:font-size 180ms ease}
.skm-viewer-content > :first-child{margin-top:0}
.skm-viewer-content h1,.skm-viewer-content h2,.skm-viewer-content h3,.skm-viewer-content h4,.skm-viewer-content h5{margin:1.15em 0 .5em;line-height:1.35;font-weight:600;color:var(--dsw-alias-label-primary,#eee);max-width:84ch}
.skm-viewer-content h1{font-size:1.72em;letter-spacing:-.012em}
.skm-viewer-content h2{font-size:1.38em}
.skm-viewer-content h3{font-size:1.16em}
.skm-viewer-content h4,.skm-viewer-content h5{font-size:1.04em}
.skm-viewer-content p{margin:.62em 0;max-width:92ch}
.skm-viewer-content pre{background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.05));border-radius:10px;padding:14px 16px;overflow:auto;font-family:ui-monospace,monospace;font-size:.86em;line-height:1.7;color:var(--dsw-alias-label-secondary,#bbb)}
.skm-viewer-content code{background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.05));border-radius:5px;padding:1px 5px;font-family:ui-monospace,monospace;font-size:.86em}
.skm-viewer-content pre code{background:transparent;padding:0}
.skm-viewer-content a{color:var(--dsw-alias-state-business-primary,#4a9eff)}
.skm-viewer-content ul,.skm-viewer-content ol{margin:.62em 0;padding-left:1.6em}
.skm-viewer-content li{margin:.32em 0;max-width:92ch}
.skm-viewer-content blockquote{margin:.9em 0;padding:.25em 1em;border-left:3px solid var(--dsw-alias-border-l2,rgba(255,255,255,.12));color:var(--dsw-alias-label-secondary,#bbb);max-width:82ch}
.skm-viewer-content hr{border:none;border-top:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));margin:1.5em 0}
.skm-loose-empty{margin:2px;padding:4px 0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#888)}
.skm-visually-hidden{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

/* ── 技能/技能包开关（Skills Hub 风格：绿色胶囊 + 白色圆钮，回弹过渡） ── */
.skm-toggle{flex:none;display:inline-flex;align-items:center;width:34px;height:20px;box-sizing:border-box;border-radius:10px;padding:2px;appearance:none;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));background:var(--dsw-alias-bg-module-platform,#e9ebee);cursor:pointer;transition:background 160ms ease,border-color 160ms ease,filter 160ms ease}
.skm-toggle:hover{filter:brightness(1.03)}
.skm-toggle:disabled{opacity:.55;cursor:not-allowed;filter:none}
.skm-toggle:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4176e6);outline-offset:1px}
.skm-toggle-on{border-color:transparent;background:var(--dsw-alias-state-business-primary,#4176e6)}
.skm-toggle-off{background:var(--dsw-alias-bg-module-platform,#e9ebee);border-color:var(--dsw-alias-border-l2,rgba(0,0,0,.1))}
.skm-toggle-knob{display:block;width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform 180ms cubic-bezier(.3,1.4,.5,1)}
.skm-toggle-on .skm-toggle-knob{transform:translateX(14px)}
.skm-toggle-off .skm-toggle-knob{transform:translateX(0)}
.skm-bundle-toggle{flex:none;display:inline-flex;align-items:center;gap:4px;margin-left:0}

/* ── Agent 预设分类圆球条（弧形恢复，整列位于统计行与工具栏之间） ── */
.skm-preset-strip{flex:none;display:flex;align-items:flex-start;gap:10px;padding:12px 16px 0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
.skm-preset-strip::-webkit-scrollbar{display:none}
.skm-preset-ball-wrap{flex:none;display:flex;flex-direction:column;align-items:center;gap:6px;width:56px;border:none;background:transparent;padding:0;cursor:pointer;font-family:inherit}
.skm-preset-ball{position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;box-sizing:border-box;font-size:17px;font-weight:600;line-height:1;color:var(--dsw-alias-label-primary,#eee);text-transform:uppercase;background:var(--dsw-alias-bg-layer-2,#262b36);border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));transition:border-color 140ms,filter 140ms}
.skm-preset-ball-wrap:hover .skm-preset-ball{filter:brightness(1.15)}
.skm-preset-ball-wrap[data-active='true'] .skm-preset-ball{border-color:var(--dsw-alias-state-business-primary,#4a9eff);box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary,#4a9eff)}
.skm-preset-ball[data-dot='true']::after{content:'';position:absolute;right:-1px;bottom:-1px;width:12px;height:12px;border-radius:50%;background:var(--dsw-alias-state-business-primary,#4a9eff);border:2px solid var(--dsw-alias-bg-layer-1,#1c1f26);box-sizing:border-box}
.skm-preset-ball-label{max-width:56px;font-size:11px;line-height:15px;color:var(--dsw-alias-label-tertiary,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}
.skm-preset-ball-wrap[data-active='true'] .skm-preset-ball-label{color:var(--dsw-alias-label-primary,#eee)}
.skm-preset-hint{flex:none;display:flex;align-items:center;gap:8px;padding:0 2px 2px}
.skm-preset-hint-text{flex:1;min-width:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#888)}
.skm-preset-reset{flex:none;appearance:none;border:none;border-radius:12px;padding:2px 10px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#999);background:transparent;cursor:pointer;font-family:inherit}
.skm-preset-reset:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06));color:var(--dsw-alias-label-primary,#eee)}

/* ── 面板级提示条：删除/归组/改名/安装的成败都要让用户看见 ── */
.skm-toast-stack{position:absolute;right:18px;bottom:18px;z-index:6;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none}
.skm-toast{display:inline-flex;align-items:center;gap:8px;max-width:min(460px,72vw);box-sizing:border-box;padding:8px 14px;border-radius:10px;font-size:12.5px;line-height:18px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));background:var(--dsw-static-neutral-bluish-00,#fff);color:var(--dsw-alias-label-primary,#222);box-shadow:var(--dsw-shadow-lv2,0 6px 22px rgba(0,0,0,.16));animation:skm-toast-in 260ms cubic-bezier(.2,.9,.25,1) both}
.skm-toast-ok{border-color:rgba(35,160,90,.38);color:#1c7a45}
.skm-toast-err{border-color:rgba(226,80,64,.42);color:#b3271c}
.skm-toast-dot{flex:none;width:6px;height:6px;border-radius:50%;background:currentColor;animation:skm-toast-ping 1.7s ease-out infinite}
@keyframes skm-toast-in{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
@keyframes skm-toast-ping{0%{box-shadow:0 0 0 0 currentColor;opacity:.9}70%{box-shadow:0 0 0 7px rgba(0,0,0,0);opacity:.35}100%{box-shadow:0 0 0 0 rgba(0,0,0,0);opacity:1}}
body[data-ds-dark-theme] .skm-toast{background:var(--dsw-static-neutral-bluish-850,#2c2c2e)}
body[data-ds-dark-theme] .skm-toast-ok{color:#6ee7a8}
body[data-ds-dark-theme] .skm-toast-err{color:#ff8a7a}

/* ── 空技能包：可见 + 可操作（旧实现把 0 成员的包整段过滤掉，建完包就「消失」） ── */
.skm-bundle-empty{grid-column:1/-1;display:flex;align-items:center;gap:12px;flex-wrap:wrap;box-sizing:border-box;margin:2px 0 6px;padding:14px 16px;border:1px dashed var(--dsw-alias-border-l2,rgba(0,0,0,.18));border-radius:12px;background:var(--dsw-alias-bg-layer-1,rgba(0,0,0,.02));animation:skm-fade-up 260ms ease both}
.skm-bundle-empty-title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#333)}
.skm-bundle-empty-hint{flex:1 1 200px;min-width:160px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#8b9099)}
.skm-bundle-empty-btn{flex:none;display:inline-flex;align-items:center;gap:6px;appearance:none;border:1px solid var(--dsw-alias-state-business-primary,#4176e6);border-radius:9px;padding:5px 12px;font-size:12px;line-height:18px;font-family:inherit;cursor:pointer;color:var(--dsw-alias-state-business-primary,#4176e6);background:transparent;transition:background 160ms ease,color 160ms ease,transform 160ms ease,box-shadow 160ms ease}
.skm-bundle-empty-btn:hover{background:var(--dsw-alias-state-business-primary,#4176e6);color:#fff;transform:translateY(-1px);box-shadow:0 4px 14px rgba(65,118,230,.28)}
.skm-bundle-empty-btn:active{transform:translateY(0)}
@keyframes skm-fade-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* ── 账本失效引用：明说「包里有指向已删除技能的条目」并一键清理 ── */
.skm-bundle-missing{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 6px;padding:8px 12px;border-radius:10px;border:1px solid rgba(240,150,40,.38);background:rgba(240,150,40,.09);font-size:12px;line-height:18px;color:#8a5a12;animation:skm-fade-up 260ms ease both}
.skm-bundle-missing code{padding:1px 6px;border-radius:5px;background:rgba(240,150,40,.16);font-size:11.5px}
.skm-bundle-missing-btn{appearance:none;border:1px solid rgba(240,150,40,.55);background:transparent;border-radius:8px;padding:2px 9px;font-size:11.5px;line-height:18px;font-family:inherit;cursor:pointer;color:inherit;transition:background 140ms ease,transform 140ms ease}
.skm-bundle-missing-btn:hover{background:rgba(240,150,40,.2);transform:translateY(-1px)}
body[data-ds-dark-theme] .skm-bundle-missing{color:#f0c48a}
.skm-install-hint{margin:2px 0 0;font-size:11.5px;line-height:17px;color:var(--dsw-alias-label-tertiary,#8b9099)}

/* ── 移动端：侧栏收窄/隐藏、查看器上下堆叠、卡片网格单列 ───────── */
@media (max-width: 767.98px) {
  .skm-viewer-modal,.skm-viewer-modal-full{width:calc(100vw - 48px)}
  .skm-viewer-body,.skm-viewer-modal-full .skm-viewer-body{height:calc(100vh - 76px)}
  .skm-viewer-body > div:nth-of-type(2){padding:0 10px 10px}
  .skm-viewer-toolbar{flex-wrap:wrap;gap:6px;padding-bottom:8px}
  .skm-viewer-layout{flex-direction:column}
  .skm-viewer-nav{width:100%;border-right:none;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08));flex:none;max-height:38%}
  .skm-viewer-content{flex:1;min-height:0;padding:16px 14px 28px}
  .skm-hub-side{display:none}
  .skm-stats-row{grid-template-columns:repeat(2,minmax(0,1fr))}
  .skm-skill-grid{grid-template-columns:minmax(0,1fr)}
  .skm-toolbar{padding:12px 12px 4px}
  .skm-stats-row{padding:12px 12px 0}
  .skm-banner{margin:10px 12px 0}
  .skm-main-scroll{padding:12px 12px 20px;grid-template-columns:minmax(0,1fr)}
}

/* ── 减弱动效：卡片入场/悬停位移与开关回弹全部收敛 ───────────── */
@media (prefers-reduced-motion: reduce) {
  .skm-skill-card{animation:none;opacity:1;transition:none}
  .skm-stat{animation:none;opacity:1;transition:none}
  .skm-assign-card{animation:none;opacity:1;transition:none}
  .skm-drop-menu{animation:none}
  .skm-viewer-modal{animation:none}
  .skm-viewer-modal,.skm-viewer-body,.skm-viewer-content,.skm-viewer-nav-item,.skm-viewer-tool-btn{transition:none}
  .skm-toggle-knob{transition:none}
  .skm-toggle{transition:none}
  .skm-tag{transition:none}
  .skm-skill-copy,.skm-skill-icon,.skm-skill-foot-icon,.skm-icon-action,.skm-bundle,.skm-hub-item,.skm-tool-button,.skm-banner,.skm-banner-btn,.skm-view-btn,.skm-drop-item,.skm-assign-card{transition:none}
  .skm-toast{animation:none}
  .skm-toast-dot{animation:none}
  .skm-bundle-empty,.skm-bundle-missing{animation:none}
  .skm-bundle-empty-btn,.skm-bundle-missing-btn{transition:none}
  .skm-skill-card::before,.skm-skill-badge,.skm-skill-title,.skm-tag-status{transition:none}
  .skm-cat-chip-row{animation:none}
  .skm-bundle-cat-tag,.skm-cat-selected-tag{animation:none}
  .skm-cat-chip,.skm-bundle-cat-tag,.skm-cat-preset,.skm-cat-remove,.skm-cat-input,.skm-cat-chip-count{transition:none}
}
`

function ensureStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) return
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.textContent = SHEET
  document.head.appendChild(tag)
}

/** ---------------------------------------------------------------- 文件收集 */

function readEntryFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    entry.file(resolve, reject)
  })
}

interface CollectedFile { path: string; file: File }

async function collectEntry(entry: FileSystemEntry, prefix: string, out: CollectedFile[]): Promise<void> {
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry
    const file = await readEntryFile(fileEntry)
    const path = prefix === '' ? entry.name : `${prefix}/${entry.name}`
    out.push({ path, file })
    return
  }
  if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry
    const reader = dirEntry.createReader()
    const all: FileSystemEntry[] = []
    while (true) {
      const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
        reader.readEntries(resolve, reject)
      })
      if (batch.length === 0) break
      all.push(...batch)
    }
    const nextPrefix = prefix === '' ? entry.name : `${prefix}/${entry.name}`
    for (const child of all) await collectEntry(child, nextPrefix, out)
  }
}

function fileToBase64(file: File): Promise<string> {
  return file.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    const chunkSize = 32768
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
    }
    return btoa(binary)
  })
}

/** ---------------------------------------------------------------- markdown 预览 */

// 技能内容预览：极简 markdown 渲染（frontmatter 隐藏，标题/列表/代码块/粗体/行内代码/链接）。
function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineMd(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
}

function renderSkillMarkdown(text: string): string {
  const body = String(text).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  const lines = body.split('\n')
  let html = ''
  let inCode = false
  let codeBuf: string[] = []
  let inList = false
  let inQuote = false
  const closeList = (): void => {
    if (inList) { html += '</ul>'; inList = false }
  }
  const closeQuote = (): void => {
    if (inQuote) { html += '</blockquote>'; inQuote = false }
  }
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      if (inCode) {
        html += '<pre>' + escapeHtml(codeBuf.join('\n')) + '</pre>'
        codeBuf = []
        inCode = false
      } else {
        closeList(); closeQuote()
        inCode = true
      }
      continue
    }
    if (inCode) { codeBuf.push(line); continue }
    if (trimmed === '---' || trimmed === '***') {
      closeList(); closeQuote()
      html += '<hr>'
      continue
    }
    if (trimmed.startsWith('>')) {
      if (!inQuote) { closeList(); html += '<blockquote>'; inQuote = true }
      html += '<p>' + inlineMd(trimmed.replace(/^>\s?/, '')) + '</p>'
      continue
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (heading !== null) {
      closeList(); closeQuote()
      // 直接用真实层级（# → h1 …… ###### → h6）：查看器字号一档一档拉得开，
      // 旧写法把 # 压成 h3，一级标题只有 15px，整篇文档看起来像没放大。
      const level = Math.min(heading[1].length, 6)
      html += `<h${String(level)}>` + inlineMd(heading[2]) + `</h${String(level)}>`
      continue
    }
    const item = /^[-*]\s+(.*)$/.exec(trimmed)
    if (item !== null) {
      if (!inList) { closeQuote(); html += '<ul>'; inList = true }
      html += '<li>' + inlineMd(item[1]) + '</li>'
      continue
    }
    closeList(); closeQuote()
    if (trimmed === '') { html += '<p></p>'; continue }
    html += '<p>' + inlineMd(trimmed) + '</p>'
  }
  closeList(); closeQuote()
  if (inCode) html += '<pre>' + escapeHtml(codeBuf.join('\n')) + '</pre>'
  return html
}

/** ---------------------------------------------------------------- 预设圆球 */

/** 「全部 Agent」虚拟预设的哨兵 id（不会与真实 preset id 冲突：真实 id 不含 *）。 */
const ALL_PRESETS = '*'

/** 球内文字：中文取首字，拉丁取首字母。 */
function ballInitial(label: string): string {
  const trimmed = label.trim()
  if (trimmed === '') return '?'
  return [...trimmed][0] ?? '?'
}

/** 一个预设圆球（无底色，仅描边轮廓；有单独设置时右下角点亮小圆点）。 */
function PresetBall({ id, label, active, dot, title, onSelect }: {
  id: string
  label: string
  active: boolean
  dot: boolean
  title: string
  onSelect: () => void
}): JSX.Element {
  return (
    <button
      type="button"
      className={css.presetBallWrap}
      data-active={active ? 'true' : undefined}
      aria-pressed={active}
      title={title}
      onClick={onSelect}
    >
      <span className={css.presetBall} data-dot={dot ? 'true' : undefined}>
        {id === ALL_PRESETS ? <IconAgentPresetOutline16 size={18} aria-hidden="true" /> : ballInitial(label)}
      </span>
      <span className={css.presetBallLabel}>{label}</span>
    </button>
  )
}

/** ---------------------------------------------------------------- 技能行 */

/** ---------------------------------------------------------------- 查看器偏好 */

/** 字号三档（px）：小 / 标准 / 大。默认取中间一档。 */
const VIEWER_FONT_SIZES = [13.5, 15, 17]
const VIEWER_PREF_KEY = 'dsh.triad.skillViewer'
/** 三档字号的悬浮文案（与 VIEWER_FONT_SIZES 一一对应）。 */
const VIEWER_FONT_LABELS = ['小字号', '标准字号', '大字号']

interface ViewerPrefs { font: number; full: boolean }

/** 读查看器偏好（字号 + 全屏）；localStorage 不可用时回落到默认值。 */
function readViewerPrefs(): ViewerPrefs {
  try {
    const raw = localStorage.getItem(VIEWER_PREF_KEY)
    if (typeof raw !== 'string' || raw === '') return { font: 1, full: false }
    const parsed = JSON.parse(raw) as Partial<ViewerPrefs>
    const font = typeof parsed.font === 'number' && parsed.font >= 0 && parsed.font < VIEWER_FONT_SIZES.length
      ? Math.trunc(parsed.font)
      : 1
    return { font, full: parsed.full === true }
  } catch {
    return { font: 1, full: false }
  }
}

/** 写查看器偏好；隐私模式等写入失败时静默降级为「只活到本次刷新」。 */
function writeViewerPrefs(prefs: ViewerPrefs): void {
  try { localStorage.setItem(VIEWER_PREF_KEY, JSON.stringify(prefs)) } catch { /* 忽略 */ }
}

/** 全屏 / 还原：对角箭头，状态切换时靠 CSS 过渡翻转。 */
function ViewerExpandIcon({ full }: { full: boolean }): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {full
        ? <path d="M6.2 2.2v4h-4M9.8 2.2v4h4M6.2 13.8v-4h-4M9.8 13.8v-4h4" />
        : <path d="M2.2 6.2v-4h4M13.8 6.2v-4h-4M2.2 9.8v4h4M13.8 9.8v4h-4" />}
    </svg>
  )
}

interface ViewRow { kind: 'dir' | 'file'; path: string; depth: number; main: boolean }

function skillFileRows(files: string[]): ViewRow[] {
  const rows: ViewRow[] = []
  const seenDirs = new Set<string>()
  for (const path of files) {
    const parts = path.split('/')
    let dirPath = ''
    for (let i = 0; i < parts.length - 1; i += 1) {
      dirPath = dirPath === '' ? parts[i] : dirPath + '/' + parts[i]
      if (!seenDirs.has(dirPath)) {
        seenDirs.add(dirPath)
        rows.push({ kind: 'dir', path: dirPath + '/', depth: i, main: false })
      }
    }
    rows.push({ kind: 'file', path, depth: parts.length - 1, main: path === 'SKILL.md' })
  }
  return rows
}

/** 复制图标（Feather copy，线性描边，与导航手绘图标同风）。 */
function CopyIcon(): JSX.Element {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

/** 完成勾图标（Feather check）。 */
function CheckIcon(): JSX.Element {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── Skills Hub 页面图标（Feather 线性风） ─────────────── */

function SearchIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function TagIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function BulbIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
    </svg>
  )
}

/** 品牌字标：侧栏 Logo 区加粗「skill」文字 SVG（无底色，currentColor = 品牌蓝）。 */
function HubWordmarkIcon(): JSX.Element {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
      <text
        x="13"
        y="10"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="800"
        letterSpacing="-0.15"
        fontFamily="ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif"
        fill="currentColor"
      >skill</text>
    </svg>
  )
}

/** 技能字标：瓷片内的「skill」文字 SVG（替换原图标，随瓷片 currentColor 着色）。 */
function SkillWordmarkIcon(): JSX.Element {
  return (
    <svg width="34" height="15" viewBox="0 0 34 15" aria-hidden="true">
      <text
        x="17"
        y="12"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        letterSpacing="-0.2"
        fontFamily="ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif"
        fill="currentColor"
      >skill</text>
    </svg>
  )
}

/**
 * 技能卡片（Skills Hub 风格）：
 *   [图标瓷片] 标题(粗)  [复制钮]      [绿色开关]
 *   描述一行（省略号）
 *   [来源 pill][作用域 pill]        N 文件
 *   ────────────────────────────
 *   工具  [查看]  [查看文件按钮]   [归入/移出] [删除]
 */
/**
 * 分类编辑器：已选标签（可摘）+ 建议分类（点加）+ 自定义输入（回车加）。
 * 「新建技能包」与「设置分类」两处共用，值由父级持有。
 */
function CategoryEditor({ value, onChange, label }: {
  value: string[]
  onChange: (next: string[]) => void
  label: string
}): JSX.Element {
  const [draft, setDraft] = useState('')
  const full = value.length >= MAX_BUNDLE_CATEGORIES
  const add = (raw: string): void => {
    const name = raw.trim().slice(0, 24)
    setDraft('')
    if (name === '' || value.includes(name) || full) return
    onChange([...value, name])
  }
  return (
    <div className={css.catEditor}>
      {value.length === 0 ? (
        <p className={css.catEmpty}>{skillT('bundleCatEmptyHint')}</p>
      ) : (
        <ul className={css.catSelected} aria-label={label}>
          {value.map((name) => (
            <li key={name} className={css.catSelectedTag}>
              <span className={css.catSelectedName}>{name}</span>
              <button
                type="button"
                className={css.catRemove}
                aria-label={skillT('bundleCatRemove', { name })}
                onClick={() => { onChange(value.filter((item) => item !== name)) }}
              >
                <IconCloseOutline16 size={11} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={css.catSuggest} role="group" aria-label={skillT('bundleCatTitle')}>
        {PRESET_BUNDLE_CATEGORIES.filter((preset) => !value.includes(preset)).map((preset) => (
          <button
            type="button"
            key={preset}
            className={css.catPreset}
            disabled={full}
            title={skillT('bundleCatAddPreset', { name: preset })}
            onClick={() => { add(preset) }}
          >
            <span className={css.catPresetPlus} aria-hidden="true">+</span>{preset}
          </button>
        ))}
      </div>
      <input
        className={css.catInput}
        value={draft}
        placeholder={skillT('bundleCatPlaceholder')}
        aria-label={skillT('bundleCatCustom')}
        disabled={full}
        onChange={(event) => { setDraft(event.currentTarget.value) }}
        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); add(draft) } }}
      />
      {full && <p className={css.catLimit}>{skillT('bundleCatLimit', { n: MAX_BUNDLE_CATEGORIES })}</p>}
    </div>
  )
}

function SkillCard({ skill, bundleId, bundleName, enabled, lockedReason, scopeLabel, index, onToggle, onView, onAssign, onRemove, onDelete }: {
  skill: SkillInfo
  bundleId: string | null
  bundleName: string | null
  enabled: boolean
  /** 非空时开关被锁住（如：全局层已禁用，预设层无法打开），并显示原因。 */
  lockedReason?: string
  /** 当前作用域 pill 文案（「全部 Agent」= 全局）。 */
  scopeLabel: string
  /** 网格序号：入场错峰动画延时。 */
  index: number
  onToggle: (skill: SkillInfo, enabled: boolean) => void
  onView: (skill: SkillInfo) => void
  onAssign?: (skill: SkillInfo) => void
  onRemove?: (skill: SkillInfo) => void
  onDelete?: (skill: SkillInfo) => void
}): JSX.Element {
  const files = Array.isArray(skill.files) ? skill.files : []
  const description = skill.description ?? ''
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<number | null>(null)
  useEffect(() => () => {
    if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current)
  }, [])

  const flashCopied = (): void => {
    setCopied(true)
    if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(() => { setCopied(false) }, 1200)
  }
  /** 复制技能名：主用 clipboard API，回退一个隐藏 textarea + execCommand。 */
  const copyName = (): void => {
    const fallback = (): void => {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = skill.name
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch {
        /* 复制失败静默：按钮仍给出已复制反馈，无副作用。 */
      }
    }
    try {
      if (navigator.clipboard !== undefined) {
        void navigator.clipboard.writeText(skill.name).then(flashCopied, () => { fallback(); flashCopied() })
      } else {
        fallback()
        flashCopied()
      }
    } catch {
      fallback()
      flashCopied()
    }
  }

  const toggleLabel = lockedReason ?? (enabled ? skillT('disableSkill') : skillT('enableSkill'))
  const fileMeta = typeof skill.fileCount === 'number' ? skill.fileCount : files.length
  return (
    <li
      className={css.skillCard}
      data-off={enabled ? undefined : 'true'}
      style={{ '--skm-i': index } as CSSProperties}
    >
      <div className={css.skillCardHead}>
        <span className={css.skillBadge} aria-hidden="true">skill</span>
        <button
          type="button"
          className={css.skillTitle}
          title={skill.name}
          onClick={() => { onView(skill) }}
        >
          {skill.name}
        </button>
        <span className={css.skillCardToggle}>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={toggleLabel}
            title={toggleLabel}
            className={`${css.toggle} ${enabled ? css.toggleOn : css.toggleOff}`}
            disabled={lockedReason !== undefined}
            onClick={(event) => {
              event.stopPropagation()
              onToggle(skill, !enabled)
            }}
          >
            <span className={css.toggleKnob} aria-hidden="true" />
          </button>
        </span>
      </div>
      {description !== '' && (
        <button type="button" className={css.skillDesc} title={description} onClick={() => { onView(skill) }}>{description}</button>
      )}
      <div className={css.skillTags}>
        <span className={`${css.tag} ${css.tagSource}`}>{bundleName ?? skillT('tagLoose')}</span>
        <span className={`${css.tag} ${css.tagScope}`} data-off={enabled ? undefined : 'true'}>{scopeLabel}</span>
        {!enabled && <span className={`${css.tag} ${css.tagStatus}`}>{skillT('skillOffTag')}</span>}
        <span className={css.skillMeta}>{skillT('fileCount', { n: fileMeta })}</span>
      </div>
      <div className={css.skillCardFoot}>
        <span className={css.skillFootLabel}>{skillT('toolsLabel')}</span>
        <div className={css.skillCardActions}>
          <Tooltip label={skillT('copySkillName')} side="bottom" delayMs={500}>
            <button
              type="button"
              className={css.skillFootIcon}
              data-copied={copied ? 'true' : undefined}
              aria-label={copied ? skillT('copiedSkillName') : skillT('copySkillName')}
              title={copied ? skillT('copiedSkillName') : skillT('copySkillName')}
              onClick={copyName}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </Tooltip>
          {bundleId !== null ? (
            <Tooltip label={skillT('removeSkill')} side="bottom" delayMs={500}>
              <button type="button" className={css.skillFootIcon} aria-label={skillT('removeSkill')}
                title={skillT('removeSkill')} onClick={() => { onRemove?.(skill) }}>
                <IconCloseOutline16 size={14} aria-hidden="true" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip label={skillT('assignToBundle')} side="bottom" delayMs={500}>
              <button type="button" className={css.skillFootIcon} aria-label={skillT('assignToBundle')}
                title={skillT('assignToBundle')} onClick={() => { onAssign?.(skill) }}>
                <IconPlusOutline16 size={14} aria-hidden="true" />
              </button>
            </Tooltip>
          )}
          <Tooltip label={skillT('deleteSkillBtn')} side="bottom" delayMs={500}>
            <button type="button" className={`${css.skillFootIcon} ${css.skillFootIconDanger}`}
              aria-label={skillT('deleteSkillBtn')} title={skillT('deleteSkillBtn')}
              onClick={() => { onDelete?.(skill) }}>
              <IconTrashOutline16 size={14} aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </div>
    </li>
  )
}

/** ---------------------------------------------------------------- 面板 */

type ConfirmState =
  | { kind: 'bundle'; bundle: BundleInfo }
  | { kind: 'skill'; name: string; dir?: string }
type InstallState =
  | { archive: true; name: string; data: string; folderName: string }
  | { archive?: false; files: CollectedFile[]; folderName: string }
type ViewerState = { skill: SkillInfo; file: string; loading: boolean; error?: string; content?: string }

const SKILL_NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

/** 从 SKILL.md 文本里取 frontmatter 的 name（安装弹窗预览真实技能名用）。 */
function frontmatterName(text: string): string | null {
  const lines = text.split(/\r?\n/).slice(0, 80)
  if ((lines[0] ?? '').trim() !== '---') return null
  for (const line of lines.slice(1)) {
    if (line.trim() === '---') break
    const pair = /^\s*name\s*:\s*(.+?)\s*$/.exec(line)
    if (pair !== null) return (pair[1] ?? '').replace(/^["']|["']$/g, '')
  }
  return null
}

export function SkillsPanel({ onClose, closing = false, anchor = null, onCardMouseEnter, onCardMouseLeave }: { onClose: () => void; closing?: boolean; anchor?: PopoverAnchor | null; onCardMouseEnter?: () => void; onCardMouseLeave?: () => void }): JSX.Element {
  ensureStyles()
  const [state, setState] = useState<PanelState>({ status: 'loading' })
  const [reload, setReload] = useState(0)
  // 分区展开集合：默认空 = 全部收起（面板打开时只显示技能包标题行）。
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  // 散装技能区展开。
  const [looseOpen, setLooseExpanded] = useState(false)
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  /** 查看器偏好：字号档位 + 是否全屏（localStorage 持久化，跨会话记住）。 */
  const [viewerFont, setViewerFont] = useState<number>(() => readViewerPrefs().font)
  const [viewerFull, setViewerFull] = useState<boolean>(() => readViewerPrefs().full)
  const [assignTarget, setAssignTarget] = useState<SkillInfo | null>(null)
  const [newBundleOpen, setNewBundleOpen] = useState(false)
  const [newBundleName, setNewBundleName] = useState('')
  /** 新建技能包弹窗里同时挂的分类。 */
  const [newBundleCats, setNewBundleCats] = useState<string[]>([])
  const [creatingBundle, setCreatingBundle] = useState(false)
  const [renameTarget, setRenameTarget] = useState<{ bundleId: string; name: string } | null>(null)
  const [renaming, setRenaming] = useState(false)
  // 改名成功的卡片 id：触发一次高亮脉冲，随后自动清除。
  const [renamedFlash, setRenamedFlash] = useState<string | null>(null)
  const renamedTimer = useRef<number | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [install, setInstall] = useState<InstallState | null>(null)
  /** 添加技能弹窗开关（选完文件后同一弹窗内填表单）。 */
  const [addOpen, setAddOpen] = useState(false)
  const [installName, setInstallName] = useState('')
  const [installDescription, setInstallDescription] = useState('')
  const [installBundleId, setInstallBundleId] = useState<string | undefined>(undefined)
  const [installing, setInstalling] = useState(false)
  const [installError, setInstallError] = useState<string | null>(null)
  /**
   * 面板级提示条。旧实现把所有失败都塞进 installError，而它只在「添加技能」弹窗里
   * 渲染 —— 于是删除技能、归组、改名、开关失败时面板上什么都不显示，用户只看到
   * 「点了没反应」。成败反馈统一走这里。
   */
  const [toasts, setToasts] = useState<Array<{ id: number; tone: 'ok' | 'err'; text: string }>>([])
  const toastTimers = useRef<number[]>([])
  const pushToast = (tone: 'ok' | 'err', text: string): void => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current.slice(-2), { id, tone, text }])
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, tone === 'err' ? 6400 : 2800)
    toastTimers.current.push(timer)
  }
  /** 统一失败提示：label 说清是哪一步，message 用 host 原文。 */
  const failToast = (label: string, error: unknown): void => {
    pushToast('err', skillT('opFailed', { label, message: error instanceof Error ? error.message : String(error) }))
  }
  /** 文件夹导入时 SKILL.md 里写的技能名：与用户填的名字不一致时提前说明会改写。 */
  const [installMetaName, setInstallMetaName] = useState<string | null>(null)
  useEffect(() => {
    if (install === null || install.archive === true) { setInstallMetaName(null); return undefined }
    const entry = install.files.find((item) => item.path === 'SKILL.md')
    if (entry === undefined) { setInstallMetaName(null); return undefined }
    let current = true
    void entry.file.text().then((text) => {
      if (!current) return
      setInstallMetaName(frontmatterName(text))
    }, () => { if (current) setInstallMetaName(null) })
    return () => { current = false }
  }, [install])
  const [dropActive, setDropActive] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  // 技能/技能包开关状态（skillName → enabled；bundleId → enabled）
  const [toggles, setToggles] = useState<{ skills: Record<string, boolean>; bundles: Record<string, boolean> }>({ skills: {}, bundles: {} })
  // 切换进行中的 key（避免重复点击）
  const [toggling, setToggling] = useState<Set<string>>(new Set())
  // Agent 预设分类：名单 + 各预设覆盖 + 当前选中的预设（'*' = 全部 Agent）
  const [presets, setPresets] = useState<PresetRow[]>([])
  const [overrides, setOverrides] = useState<Record<string, Record<string, boolean>>>({})
  const [activePreset, setActivePreset] = useState<string>(ALL_PRESETS)
  // Skills Hub 工具栏：搜索词 / 来源筛选(全部=all|bundles|loose) / 名称排序 / 视图切换
  const [query, setQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'bundles' | 'loose'>('all')
  const [sortAsc, setSortAsc] = useState(true)
  const [viewMode] = useState<'grid' | 'list'>('grid')
  /** 左栏分类 / 筛选：启用状态 + Agent 预设（分类切换由左栏「Agent 预设分类」驱动）。 */
  const [statusFilter, setStatusFilter] = useState<'all' | 'on' | 'off'>('all')
  /** 技能包分类筛选：null = 不筛；分类名或 UNCATEGORIZED = 只看该类。 */
  const [catFilter, setCatFilter] = useState<string | null>(null)
  /** 「设置分类」弹窗的目标包（null = 关）；catDraft 是弹窗内的编辑副本。 */
  const [catTarget, setCatTarget] = useState<{ bundleId: string; name: string } | null>(null)
  const [catDraft, setCatDraft] = useState<string[]>([])
  const [savingCats, setSavingCats] = useState(false)
  /** 自定义下拉/菜单：来源筛选 / Agent 预设 / 名称排序 / 快捷筛选 / 行内更多菜单（哪个开着，null = 都关）。 */
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  /** 同步状态：/api/skill-health 只读扫描结果（缺 SKILL.md 等）。 */
  const [health, setHealth] = useState<HealthView>({ state: 'loading' })
  /** 快速上手指南弹窗开关。 */
  const [guideOpen, setGuideOpen] = useState(false)
  /** 左侧顶层 tab：SKILL（技能管理）/ MCP（MCP Server）。 */
  const [kind, setKind] = useState<'skill' | 'mcp'>('skill')
  /** MCP 页范围（'' = 全部 Agent）。 */
  const [mcpScope, setMcpScope] = useState('')
  /** MCP Server 搜索词。 */
  const [mcpQuery, setMcpQuery] = useState('')
  /** MCP 启用状态筛选（作用于全局条目）。 */
  const [mcpStatusFilter, setMcpStatusFilter] = useState<'all' | 'on' | 'off'>('all')
  /** 真实 MCP 注册状态（/api/triad/mcp-status）：MCP 页唯一数据源。 */
  const [mcpLive, mcpRefreshLive] = useMcpLiveState()
  /** 添加 MCP Server（粘贴 JSON / YAML）弹窗开关。 */
  const [mcpAddOpen, setMcpAddOpen] = useState(false)
  /* ── 添加/启用后自动等工具注册 ────────────────────────────────────────
   * 写配置只是让 DSH 热重载那一行；MCP 进程要晚几秒才连上并注册工具。
   * 之前只刷新一次 → 面板上 Server 有了但工具是空的，用户还得自己点「刷新」。
   * 这里按 2s 轮询，目标都报出工具（或 90s 超时）就收工。 */
  const mcpWatchTimer = useRef<number | null>(null)
  const [mcpWaitingTools, setMcpWaitingTools] = useState<string[]>([])
  /** 最新状态快照：定时器回调里读不到新的闭包值。 */
  const mcpLiveRef = useRef(mcpLive)
  useEffect(() => { mcpLiveRef.current = mcpLive }, [mcpLive])
  const stopMcpWatch = (): void => {
    if (mcpWatchTimer.current !== null) {
      window.clearInterval(mcpWatchTimer.current)
      mcpWatchTimer.current = null
    }
    setMcpWaitingTools([])
  }
  /** 立即刷新一次，然后轮询到这些 Server 注册出工具为止（超时/全部就绪即停）。 */
  const watchMcpTools = (names: string[]): void => {
    if (mcpWatchTimer.current !== null) {
      window.clearInterval(mcpWatchTimer.current)
      mcpWatchTimer.current = null
    }
    mcpRefreshLive()
    const pending = new Set(names.filter(name => name !== ''))
    if (pending.size === 0) { setMcpWaitingTools([]); return }
    setMcpWaitingTools([...pending])
    const startedAt = Date.now()
    mcpWatchTimer.current = window.setInterval(() => {
      const snapshot = mcpLiveRef.current
      if (snapshot.state === 'ready') {
        for (const name of [...pending]) {
          if (mcpRegisteredToolCountOf(snapshot.data, name) > 0) pending.delete(name)
        }
        setMcpWaitingTools([...pending])
      }
      if (pending.size === 0 || Date.now() - startedAt > MCP_TOOL_WATCH_TIMEOUT_MS) stopMcpWatch()
      else mcpRefreshLive()
    }, MCP_TOOL_WATCH_INTERVAL_MS)
  }

  const refresh = (): void => {
    // 技能目录变更后,同步失效 skill-source 的 slash 菜单快照缓存。
    void import('../../skill-source').then(({ invalidateSkillCache }) => invalidateSkillCache())
    setReload((value) => value + 1)
  }

  /** 静默同步：不置 loading，直接替换数据（自动同步机制用）。 */
  const silentSync = (): void => {
    void import('../../skill-source').then(({ invalidateSkillCache }) => invalidateSkillCache())
    void skillApi.list().then((snapshot) => {
      setState((current) => current.status === 'error'
        ? current
        : { status: 'ready', snapshot })
    }, () => { /* 保持当前显示 */ })
    void skillApi.presetStatus().then(
      (status) => {
        setToggles({ skills: status.skills, bundles: status.bundles })
        setOverrides(status.overrides)
        setPresets(status.presets)
      },
      () => {
        void skillApi.toggleStatus().then((status) => { setToggles(status) }, () => { /* 保持当前显示 */ })
      },
    )
    void skillApi.health().then(
      (report) => { setHealth(report.ok ? { state: 'ok', report } : { state: 'issue', report }) },
      () => { /* 保持当前显示 */ },
    )
  }

  /** 自动同步机制：面板打开期间 30s 轮询 + 页面重新可见/聚焦立即刷新（不闪烁）。 */
  useEffect(() => {
    const timer = window.setInterval(silentSync, 30_000)
    const onVis = (): void => { if (document.visibilityState === 'visible') silentSync() }
    const onFocus = (): void => { silentSync() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('focus', onFocus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** 开关切换后静默同步:仅失效 slash 缓存并重拉开关状态,不重载整个面板(避免闪烁)。 */
  const refreshTogglesOnly = (): void => {
    void import('../../skill-source').then(({ invalidateSkillCache }) => invalidateSkillCache())
    void skillApi.presetStatus().then(
      (status) => {
        setToggles({ skills: status.skills, bundles: status.bundles })
        setOverrides(status.overrides)
        setPresets(status.presets)
      },
      () => {
        // 预设接口不可用（老 host）时退回只读全局层状态。
        void skillApi.toggleStatus().then((status) => { setToggles(status) }, () => { /* 保持当前显示 */ })
      },
    )
  }

  const t = skillT

  useEffect(() => {
    let current = true
    setState({ status: 'loading' })
    void skillApi.list().then(
      (snapshot) => {
        if (current) setState({ status: 'ready', snapshot })
      },
      () => {
        if (current) setState({ status: 'error' })
      },
    )
    void skillApi.presetStatus().then(
      (status) => {
        if (!current) return
        setToggles({ skills: status.skills, bundles: status.bundles })
        setOverrides(status.overrides)
        setPresets(status.presets)
      },
      () => {
        // 预设接口不可用时退化为「只有全局层」：圆球条只剩「全部 Agent」。
        void skillApi.toggleStatus().then(
          (status) => { if (current) setToggles(status) },
          () => { /* 开关接口也不可用时保持空状态（开关仍可操作,失败会提示）。 */ },
        )
      },
    )
    // 同步状态：只读健康扫描（目录完整性 + 账本悬挂引用）。
    setHealth({ state: 'loading' })
    void skillApi.health().then(
      (report) => { if (current) setHealth(report.ok ? { state: 'ok', report } : { state: 'issue', report }) },
      () => { if (current) setHealth({ state: 'unavailable' }) },
    )
    return () => { current = false }
    // reload 拆分为变化键；open 恒 true（本组件在打开时才渲染）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  // 卸载时清掉改名高亮与提示条定时器，避免卸载后 setState。
  useEffect(() => () => {
    if (renamedTimer.current !== null) window.clearTimeout(renamedTimer.current)
    if (mcpWatchTimer.current !== null) window.clearInterval(mcpWatchTimer.current)
    for (const timer of toastTimers.current) window.clearTimeout(timer)
  }, [])

  /** 快速上手指南浮层的位置：贴着面板卡片右缘内侧（面板铺满主区，外侧已无空间）。 */
  const [guidePos, setGuidePos] = useState<{ left: number; top: number; height: number } | null>(null)
  useEffect(() => {
    if (!guideOpen) return
    const marker = document.querySelector('[data-skm-panel-marker]')
    const card = marker?.closest('.psh-card')
    if (!(card instanceof HTMLElement)) return
    const rect = card.getBoundingClientRect()
    const vh = window.innerHeight
    const top = Math.max(8, rect.top)
    const overlayW = 300
    setGuidePos({
      left: Math.max(rect.left + 12, rect.right - overlayW - 12),
      top,
      height: Math.min(rect.height, vh - top - 12),
    })
  }, [guideOpen])

  const runToggle = async (key: string, action: () => Promise<unknown>): Promise<void> => {
    if (toggling.has(key)) return
    setToggling((current) => new Set(current).add(key))
    setInstallError(null)
    try {
      await action()
      // 开关只改 frontmatter,技能列表结构不变:静默同步即可,不重载面板。
      refreshTogglesOnly()
    } catch (error) {
      pushToast('err', skillT('toggleFailed', { message: error instanceof Error ? error.message : String(error) }))
    } finally {
      setToggling((current) => {
        const next = new Set(current)
        next.delete(key)
        return next
      })
    }
  }

  const toggleSkill = (skill: SkillInfo, enabled: boolean): void => {
    if (activePreset === ALL_PRESETS) {
      void runToggle(`skill:${skill.name}`, () => skillApi.setSkillEnabled(skill.name, enabled))
      return
    }
    void runToggle(
      `skill:${skill.name}`,
      () => skillApi.setPresetSkillEnabled(activePreset, skill.name, enabled),
    )
  }

  const toggleBundle = (bundle: BundleInfo, enabled: boolean): void => {
    if (activePreset === ALL_PRESETS) {
      void runToggle(`bundle:${bundle.id}`, () => skillApi.setBundleEnabled(bundle.id, enabled))
      return
    }
    void runToggle(
      `bundle:${bundle.id}`,
      () => skillApi.setPresetBundleEnabled(activePreset, bundle.id, enabled),
    )
  }

  /** 该预设下被单独关掉的技能（'*' 视图下为空表）。 */
  const presetOverride = activePreset === ALL_PRESETS ? {} : (overrides[activePreset] ?? {})

  /**
   * 任一预设下技能的开关值（与 skillEnabledIn 同规则，供左栏分类计数）。
   *  - 「全部 Agent」：直接读全局层（SKILL.md frontmatter）；
   *  - 某个预设：全局层关掉的仍显示为关（预设层无法打开全局关掉的技能），
   *    否则看该预设是否有 false 覆盖。
   */
  const skillEnabledAt = (presetId: string, name: string): boolean => {
    if (toggles.skills[name] === false) return false
    if (presetId === ALL_PRESETS) return true
    return (overrides[presetId] ?? {})[name] !== false
  }

  /** 某预设下已启用的技能数（左栏「Agent 预设分类」计数）。 */
  const enabledCountFor = (presetId: string): number => {
    let n = 0
    for (const bundle of bundles) for (const skill of bundle.skills) if (skillEnabledAt(presetId, skill.name)) n += 1
    for (const skill of loose) if (skillEnabledAt(presetId, skill.name)) n += 1
    return n
  }

  /**
   * 当前视图里一个技能的开关值。
   *  - 「全部 Agent」：直接读全局层（SKILL.md frontmatter）；
   *  - 某个预设：全局层关掉的仍显示为关（预设层无法打开全局关掉的技能），
   *    否则看该预设是否有 false 覆盖。
   */
  const skillEnabledIn = (name: string): boolean => skillEnabledAt(activePreset, name)

  /** 技能包在当前视图下的开关值：内部技能全开才算开。 */
  const bundleEnabledIn = (bundle: BundleInfo): boolean => {
    if (activePreset === ALL_PRESETS) return toggles.bundles[bundle.id] !== false
    return bundle.skills.every((skill) => skillEnabledIn(skill.name))
  }

  /** 预设视图下，被全局层禁用的技能行锁住开关（预设层只能收窄，无法打开）。 */
  const skillLockedReason = (name: string): string | undefined =>
    activePreset !== ALL_PRESETS && toggles.skills[name] === false ? t('presetLockedByGlobal') : undefined

  /** 清空当前预设的全部单独设置。 */
  const resetActivePreset = (): void => {
    if (activePreset === ALL_PRESETS) return
    void runToggle(`reset:${activePreset}`, () => skillApi.resetPreset(activePreset))
  }

  const toggleExpanded = (bundleId: string): void => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(bundleId)) next.delete(bundleId)
      else next.add(bundleId)
      return next
    })
  }

  // Skills Hub 默认全展开（参考图整页可见）；用户手动收起后保持各自状态。

  const loadViewerContent = async (skillName: string, filePath: string): Promise<void> => {
    try {
      const res = await fetch(`/api/skill-manager/skills/${encodeURIComponent(skillName)}/files/${encodeURIComponent(filePath)}`)
      const body = await res.json() as { error?: unknown; content?: unknown }
      if (body.error !== undefined) throw new Error(String(body.error))
      setViewer((v) => v === null ? v : { ...v, loading: false, content: (body.content ?? '') as string })
    } catch (error) {
      setViewer((v) => v === null ? v : { ...v, loading: false, error: error instanceof Error ? error.message : String(error) })
    }
  }

  const openViewer = (skill: SkillInfo): void => {
    setViewer({ skill, file: 'SKILL.md', loading: true })
    void loadViewerContent(skill.name, 'SKILL.md')
  }

  /** 切字号档位（夹到合法区间）。 */
  const setViewerFontLevel = (level: number): void => {
    setViewerFont(Math.min(Math.max(level, 0), VIEWER_FONT_SIZES.length - 1))
  }

  /** 全屏 / 还原：弹窗宽高走 CSS 过渡，不重挂内容，滚动位置保持。 */
  const toggleViewerFull = (): void => {
    setViewerFull((current) => !current)
  }

  // 偏好统一在这里落盘：连点两个控件时，事件回调读到的是同一帧的旧闭包值，
  // 分开写会把其中一项存成旧值。
  useEffect(() => { writeViewerPrefs({ font: viewerFont, full: viewerFull }) }, [viewerFont, viewerFull])

  const selectViewerFile = (filePath: string): void => {
    if (viewer === null) return
    setViewer({ ...viewer, file: filePath, loading: true, error: undefined })
    void loadViewerContent(viewer.skill.name, filePath)
  }

  const doAssign = async (skill: SkillInfo, bundleId: string): Promise<void> => {
    try {
      if (state.status !== 'ready') return
      const bundle = state.snapshot.bundles.find((candidate) => candidate.id === bundleId)
      if (bundle === undefined) throw new Error('bundle not found')
      await skillApi.setBundleSkills(bundleId, [...bundle.skills.map((s) => s.name), skill.name])
      setAssignTarget(null)
      pushToast('ok', skillT('assignOk', { name: skill.name }))
      refresh()
    } catch (error) {
      failToast('归入技能包', error)
    }
  }

  const acceptFiles = (files: File[] | null): void => {
    if (files === null || files.length === 0) return
    const collected: CollectedFile[] = []
    for (const file of files) {
      const relative = file.webkitRelativePath
      if (relative === '') continue
      const parts = relative.split('/')
      if (parts.length < 2) continue
      collected.push({ path: parts.slice(1).join('/'), file })
    }
    if (collected.length === 0) return
    const zipCandidate = collected.length === 1 && collected[0].path.toLowerCase().endsWith('.zip') ? collected[0] : undefined
    if (zipCandidate !== undefined) {
      const reader = new FileReader()
      reader.onload = () => {
        const data = String(reader.result ?? '').split(',')[1] ?? ''
        setInstall({ archive: true, name: zipCandidate.path, data, folderName: zipCandidate.path })
        setInstallError(null)
        setAddOpen(true)
      }
      reader.readAsDataURL(zipCandidate.file)
      return
    }
    const rootName = collected[0]?.path.split('/')[0] ?? ''
    setInstallName(rootName)
    setInstallError(null)
    setInstall({ files: collected, folderName: rootName })
    setAddOpen(true)
  }

  const onDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    setDropActive(false)
    const collected: CollectedFile[] = []
    const items = event.dataTransfer.items
    if (items === undefined) return
    const pending: Array<Promise<void>> = []
    for (const item of Array.from(items)) {
      const entry = item.webkitGetAsEntry?.()
      if (entry !== undefined && entry !== null) pending.push(collectEntry(entry, '', collected))
    }
    await Promise.all(pending)
    if (collected.length === 0) return
    const zipCandidate = collected.length === 1 && collected[0].path.toLowerCase().endsWith('.zip') ? collected[0] : undefined
    if (zipCandidate !== undefined) {
      setInstall({ archive: true, name: zipCandidate.path, data: await fileToBase64(zipCandidate.file), folderName: zipCandidate.path })
      setInstallError(null)
      setAddOpen(true)
      return
    }
    const rootName = collected[0]?.path.split('/')[0] ?? ''
    setInstallName(rootName)
    setInstallError(null)
    setInstall({ files: collected, folderName: rootName })
    setAddOpen(true)
  }

  const confirmInstall = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (install === null || installing) return
    if (install.archive !== true && installName.trim() === '') return
    setInstalling(true)
    setInstallError(null)
    try {
      let installed: { name?: string } = {}
      if (install.archive === true) {
        installed = await skillApi.installSkill({
          archive: install.data,
          description: installDescription.trim(),
          ...installBundleId === undefined ? {} : { bundleId: installBundleId },
        })
      } else {
        const files = await Promise.all(install.files.map(async ({ path, file }) => ({
          path,
          data: await fileToBase64(file),
        })))
        installed = await skillApi.installSkill({
          skillName: installName.trim(),
          description: installDescription.trim(),
          ...installBundleId === undefined ? {} : { bundleId: installBundleId },
          files,
        })
      }
      // 名字以 host 落地的规范名为准：目录名与技能名不一致时，用户看得到装成了什么。
      pushToast('ok', skillT('installedOk', { name: installed.name ?? installName.trim() }))
      setInstall(null)
      setInstallName('')
      setInstallDescription('')
      setInstallBundleId(undefined)
      setAddOpen(false)
      refresh()
    } catch (error) {
      setInstallError(error instanceof Error ? error.message : String(error))
    } finally {
      setInstalling(false)
    }
  }

  const submitNewBundle = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (creatingBundle || newBundleName.trim() === '') return
    setCreatingBundle(true)
    try {
      const created = newBundleName.trim()
      await skillApi.createBundle(created, newBundleCats)
      setNewBundleName('')
      setNewBundleCats([])
      setNewBundleOpen(false)
      pushToast('ok', skillT('bundleCreated', { name: created }))
      refresh()
    } catch (error) {
      failToast('新建技能包', error)
    } finally {
      setCreatingBundle(false)
    }
  }

  /** 打开「设置分类」弹窗：草稿从快照里的当前值起步。 */
  const openCatEditor = (bundle: BundleInfo): void => {
    setCatTarget({ bundleId: bundle.id, name: bundle.name })
    setCatDraft([...(bundle.categories ?? [])])
  }

  /** 保存分类：PATCH 只带 categories；顺手把筛选跟到新值，避免改完包「消失」。 */
  const submitCategories = async (): Promise<void> => {
    if (catTarget === null || savingCats) return
    setSavingCats(true)
    try {
      await skillApi.setBundleCategories(catTarget.bundleId, catDraft)
      if (activeCat !== null && !catDraft.includes(activeCat) && activeCat !== UNCATEGORIZED) setCatFilter(null)
      pushToast('ok', skillT('bundleCatSaved', { name: catTarget.name }))
      setCatTarget(null)
      refresh()
    } catch (error) {
      failToast('设置分类', error)
    } finally {
      setSavingCats(false)
    }
  }

  const submitRename = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

    event.preventDefault()
    if (renaming || renameTarget === null || renameTarget.name.trim() === '') return
    setRenaming(true)
    try {
      await skillApi.renameBundle(renameTarget.bundleId, renameTarget.name.trim())
      // 改名成功后让卡片闪一下高亮（1600ms 后自动清除）。
      const renamedId = renameTarget.bundleId
      if (renamedTimer.current !== null) window.clearTimeout(renamedTimer.current)
      setRenamedFlash(renamedId)
      renamedTimer.current = window.setTimeout(() => { setRenamedFlash(null) }, 1600)
      setRenameTarget(null)
      refresh()
    } catch (error) {
      failToast('重命名技能包', error)
    } finally {
      setRenaming(false)
    }
  }

  const confirmDelete = async (): Promise<void> => {
    if (confirm === null || confirming) return
    setConfirming(true)
    const label = confirm.kind === 'bundle' ? confirm.bundle.name : confirm.name
    try {
      if (confirm.kind === 'bundle') await skillApi.deleteBundle(confirm.bundle.id)
      else await skillApi.deleteSkill(confirm.name)
      setConfirm(null)
      pushToast('ok', confirm.kind === 'bundle'
        ? skillT('bundleDeleted', { name: label })
        : skillT('deletedOk', { name: label }))
      refresh()
    } catch (error) {
      // 旧实现把失败写进只在安装弹窗里渲染的 installError：删除失败时面板上毫无反应。
      failToast(confirm.kind === 'bundle' ? '删除技能包' : '删除技能', error)
    } finally {
      setConfirming(false)
    }
  }

  const removeFromBundle = async (bundleId: string, name: string): Promise<void> => {
    try {
      if (state.status !== 'ready') return
      const bundle = state.snapshot.bundles.find((candidate) => candidate.id === bundleId)
      if (bundle === undefined) return
      await skillApi.setBundleSkills(bundleId, bundle.skills.map((skill) => skill.name).filter((skillName) => skillName !== name))
      pushToast('ok', skillT('removedOk', { name }))
      refresh()
    } catch (error) {
      failToast('移出技能包', error)
    }
  }

  /** 清理账本里指向已删除技能的条目（技能包显示「N 个失效引用」时用）。 */
  const pruneBundle = async (bundle: BundleInfo): Promise<void> => {
    try {
      // 必须回到未过滤的快照取成员：视图里的 bundle 可能已被搜索/状态筛选裁掉过。
      const full = state.status === 'ready'
        ? (state.snapshot.bundles.find((candidate) => candidate.id === bundle.id) ?? bundle)
        : bundle
      await skillApi.setBundleSkills(bundle.id, full.skills.map((skill) => skill.name))
      pushToast('ok', skillT('pruned'))
      refresh()
    } catch (error) {
      failToast('清理失效引用', error)
    }
  }

  /** 从空技能包的引导按钮直接进入「添加技能」，并把归组预选成它。 */
  const openInstallFor = (bundleId: string): void => {
    setInstall(null)
    setInstallError(null)
    setInstallBundleId(bundleId)
    setAddOpen(true)
  }

  const bundles = state.status === 'ready' ? state.snapshot.bundles : []
  const loose = state.status === 'ready' ? state.snapshot.loose : []
  /** 当前作用域 pill 文案：「全部 Agent」视图 = 全局（Global），预设视图 = 预设名。 */
  const scopeLabel = activePreset === ALL_PRESETS
    ? t('scopeAll')
    : (presets.find((preset) => preset.id === activePreset)?.name ?? activePreset)

  /* ── Skills Hub 派生数据：搜索 / Agent 预设 / 状态 / 排序 ── */
  const q = query.trim().toLowerCase()
  const qMatch = (skill: SkillInfo): boolean => {
    if (q === '') return true
    if (skill.name.toLowerCase().includes(q)) return true
    return (skill.description ?? '').toLowerCase().includes(q)
  }
  const statusMatch = (skill: SkillInfo): boolean => {
    // 「全部」= 不分启用状态一律显示。旧实现在这里也 return on，于是技能一关卡片就
    // 当场从列表里消失，想再打开只能切到「已停用」档去捞 —— 关掉即隐身。
    if (statusFilter === 'all') return true
    // 启用态按当前视图计算：全部 Agent = 全局层，预设视图 = 预设层（含全局锁定）。
    const on = activePreset === ALL_PRESETS
      ? toggles.skills[skill.name] !== false
      : skillEnabledAt(activePreset, skill.name)
    return statusFilter === 'on' ? on : !on
  }
  const sortedSkills = (list: SkillInfo[]): SkillInfo[] => [...list].sort((a, b) => {
    const order = a.name.localeCompare(b.name)
    return sortAsc ? order : -order
  })
  const filteredSkills = (list: SkillInfo[]): SkillInfo[] =>
    sortedSkills(list.filter((skill) =>
      qMatch(skill)
      && statusMatch(skill)))
  /**
   * 全量筛选结果（批量操作作用于全部）。
   * 空技能包必须留在列表里：旧实现一律 filter(skills.length > 0)，于是新建的包、
   * 以及账本按目录名记账导致成员解析不到的包，都会从面板上凭空消失 —— 既看不到
   * 也点不到，没法再往里归技能。只有真正带筛选条件时才按命中情况隐藏。
   */
  const filtering = q !== '' || statusFilter !== 'all'
  /**
   * 分类索引：分类名 → 挂了它的技能包数；没挂任何分类的包归到 UNCATEGORIZED 桶。
   * 顶栏胶囊与包名旁的标签都从这里取数，所以两边口径天然一致。
   */
  const categoryCounts = (() => {
    const counts = new Map<string, number>()
    for (const bundle of bundles) {
      const cats = bundle.categories ?? []
      if (cats.length === 0) {
        counts.set(UNCATEGORIZED, (counts.get(UNCATEGORIZED) ?? 0) + 1)
        continue
      }
      for (const cat of cats) counts.set(cat, (counts.get(cat) ?? 0) + 1)
    }
    return counts
  })()
  const categoryList = sortCategories(categoryCounts)
  /** 至少要有一个真分类（未分类桶不算）才值得占一行顶栏空间。 */
  const hasCategories = categoryList.some((cat) => cat !== UNCATEGORIZED)
  /** 选中的分类被最后一个包摘掉时自动回落「全部」，不留一个筛不出东西的死状态。 */
  const activeCat = catFilter !== null && categoryCounts.has(catFilter) ? catFilter : null
  const catMatch = (bundle: BundleInfo): boolean => {
    if (activeCat === null) return true
    const cats = bundle.categories ?? []
    return activeCat === UNCATEGORIZED ? cats.length === 0 : cats.includes(activeCat)
  }
  const visibleBundleAll = (sourceFilter === 'loose' ? [] : bundles)
    .filter((bundle) => catMatch(bundle))
    .map((bundle) => ({ ...bundle, skills: filteredSkills(bundle.skills) }))
    .filter((bundle) => bundle.skills.length > 0 || (bundle.skillCount === 0 && !filtering))
  const visibleLooseAll = sourceFilter === 'bundles' || activeCat !== null ? [] : filteredSkills(loose)
  const totalSkills = bundles.reduce((n, bundle) => n + bundle.skillCount, 0) + loose.length
  const bundleCount = bundles.length
  /** 同步状态卡展示模型：ok=绿点全健康；issue=橙点带数量；unavailable=灰点待检测（旧 host 未加载新路由）；loading=检测中。 */
  const healthView = health.state === 'ok'
    ? { tone: 'ok', label: t('statHealthy'), title: t('statHealthy') }
    : health.state === 'issue'
      ? { tone: 'warn', label: t('statIssues', { n: health.report.issues.length }), title: health.report.issues.map((issue) => issue.message).join('\n') }
      : health.state === 'unavailable'
        ? { tone: 'pending', label: t('statPending'), title: t('statPending') }
        : { tone: 'idle', label: t('statChecking'), title: '' }
  const enabledCount = (() => {
    let n = 0
    for (const bundle of bundles) for (const skill of bundle.skills) if (toggles.skills[skill.name] !== false) n += 1
    for (const skill of loose) if (toggles.skills[skill.name] !== false) n += 1
    return n
  })()
  const noResults = visibleBundleAll.length === 0 && visibleLooseAll.length === 0

  const trimmedName = installName.trim()
  const nameInvalid = trimmedName !== '' && !SKILL_NAME_PATTERN.test(trimmedName)

  const confirmTitle = confirm === null
    ? t('deleteSkillConfirm', { name: '' })
    : confirm.kind === 'bundle'
      ? t('deleteBundleConfirm', { name: confirm.bundle.name })
      : t('deleteSkillConfirm', { name: confirm.name })
        // 目录名与技能名不一致时说明白：删的是那个目录，避免用户以为删错东西。
          + (confirm.kind === 'skill' && confirm.dir !== undefined && confirm.dir !== confirm.name
            ? t('deleteSkillDirNote', { dir: confirm.dir }) : '')

  return (
    <PopoverShell
      solid
      closing={closing}
      onClose={() => {
        // 安装/确认进行中禁止关闭；二级弹窗（新建/添加/确认/查看器/归组）打开时 Esc 归二级弹窗。
        if (installing || confirming) return
        if (newBundleOpen || addOpen || confirm !== null || viewer !== null || assignTarget !== null || catTarget !== null) return
        onClose()
      }}
      anchor={anchor}
      onCardMouseEnter={onCardMouseEnter}
      onCardMouseLeave={onCardMouseLeave}
      size={{ width: 1150, height: 860 }}
      ariaLabel={t('panelTitle')}
    >
      {/* 头部：标题（能力管理）+ 紧贴文字右侧的 SKILL/MCP 顶层 tab + 关闭 */}
      <div className="psh-head">
        <span className="psh-title" style={{ flex: 'none' }}>{t('panelTitle')}</span>
        <div className={css.kindTabs} role="tablist" aria-label="SKILL / MCP">
          <button
            type="button"
            role="tab"
            aria-selected={kind === 'skill'}
            className={`${css.kindTab} ${kind === 'skill' ? css.kindTabActive : ''}`}
            data-active={kind === 'skill' || undefined}
            onClick={() => { setKind('skill') }}
          >
            {t('kindSkill')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={kind === 'mcp'}
            className={`${css.kindTab} ${kind === 'mcp' ? css.kindTabActive : ''}`}
            data-active={kind === 'mcp' || undefined}
            onClick={() => { setKind('mcp') }}
          >
            {t('kindMcp')}
          </button>
        </div>
      </div>
      <PshBody className={css.modalBody}>
      <span data-skm-panel-marker aria-hidden="true" style={{ display: 'none' }} />
      <div className={css.hub} aria-busy={state.status === 'loading'}>
        {/* ── 顶栏（仅 SKILL 视图）：预设 chips + 快捷筛选 + 新建/添加/指南 ── */}
        {kind === 'skill' && (
        <div
          className={css.topbar}
          data-drop={dropActive || undefined}
          onDragOver={(event) => { event.preventDefault(); setDropActive(true) }}
          onDragLeave={() => { setDropActive(false) }}
          onDrop={(event) => { void onDrop(event) }}
        >
          <div className={css.chipRow} role="group" aria-label={t('presetCatTitle')}>
            <button
              type="button"
              className={`${css.catItem} ${activePreset === ALL_PRESETS ? css.catItemActive : ''}`}
              data-active={activePreset === ALL_PRESETS || undefined}
              onClick={() => { setActivePreset(ALL_PRESETS) }}
            >
              <span className={css.catIcon} data-active={activePreset === ALL_PRESETS || undefined}><CatAllIcon size={16} /></span>
              <span className={css.catLabel}>{t('presetAll')}</span>
              <span className={css.catCount} title={t('presetCountTip', { n: enabledCountFor(ALL_PRESETS), total: totalSkills })}>{enabledCountFor(ALL_PRESETS)}</span>
            </button>
            {presets.map((preset) => {
              const overrideCount = Object.values(overrides[preset.id] ?? {}).filter((state2) => state2 === false).length
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`${css.catItem} ${activePreset === preset.id ? css.catItemActive : ''}`}
                  data-active={activePreset === preset.id || undefined}
                  onClick={() => { setActivePreset(preset.id) }}
                >
                  <span className={css.catIcon} data-active={activePreset === preset.id || undefined}><IconAgentPresetOutline16 size={15} /></span>
                  <span className={css.catLabel}>{preset.name ?? preset.id}</span>
                  <span className={css.catCount} data-warn={overrideCount > 0 || undefined}
                    title={t('presetCountTip', { n: enabledCountFor(preset.id), total: totalSkills })
                      + (overrideCount > 0 ? ` · ${t('presetOverrideCount', { n: overrideCount })}` : '')}>
                    {enabledCountFor(preset.id)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 技能包分类：胶囊即筛选（再点一次取消）。没有一个真分类时不占这一行。 */}
          {hasCategories && (
            <div className={css.catChipRow} role="group" aria-label={t('bundleCatFilterAria')}>
              <span className={css.catChipLabel}>{t('bundleCatTitle')}</span>
              <button
                type="button"
                className={css.catChip}
                data-active={activeCat === null || undefined}
                aria-pressed={activeCat === null}
                onClick={() => { setCatFilter(null) }}
              >
                {t('bundleCatAll')}
                <span className={css.catChipCount}>{bundleCount}</span>
              </button>
              {categoryList.map((cat) => {
                const none = cat === UNCATEGORIZED
                const active = activeCat === cat
                return (
                  <button
                    type="button"
                    key={cat}
                    className={css.catChip}
                    data-active={active || undefined}
                    aria-pressed={active}
                    onClick={() => { setCatFilter(active ? null : cat) }}
                  >
                    {none ? t('bundleCatNone') : cat}
                    <span className={css.catChipCount}>{categoryCounts.get(cat) ?? 0}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* 启用状态：三档分段 */}

          <div className={css.statusSeg} role="group" aria-label={t('statusAll')}>
            {([['all', t('statusAll')], ['on', t('statusOn')], ['off', t('statusOff')]] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`${css.statusSegBtn} ${statusFilter === value ? css.statusSegActive : ''}`}
                data-active={statusFilter === value || undefined}
                aria-pressed={statusFilter === value}
                onClick={() => { setStatusFilter(value) }}
              >
                {label}
              </button>
            ))}
          </div>

        </div>
        )}

        {/* ── 顶栏（MCP 视图）：与技能页同构的预设 chips + 状态分段 ── */}
        {kind === 'mcp' && (
          <McpTopBar
            t={t}
            live={mcpLive}
            scope={mcpScope}
            onScope={setMcpScope}
            status={mcpStatusFilter}
            onStatus={setMcpStatusFilter}
          />
        )}

        {/* ── 主区 ── */}
        <div className={css.hubMain}>
          {kind === 'mcp' ? (
            <McpPage
              t={t}
              live={mcpLive}
              scope={mcpScope}
              query={mcpQuery}
              onQuery={setMcpQuery}
              status={mcpStatusFilter}
              onAddCustom={() => { setMcpAddOpen(true) }}
              onRefresh={() => { mcpRefreshLive() }}
              waitingTools={mcpWaitingTools}
              onWatchTools={(names) => { watchMcpTools(names) }}
            />
          ) : (<>          {/* 统计行 */}
          <div className={css.statsRow}>
            <div className={css.stat}>
              <span className={css.statIconCol}>
                <span className={css.statIcon} data-tone="blue"><StatCubeIcon size={20} /></span>
                <i className={css.statGlow} data-tone="blue" aria-hidden="true" />
              </span>
              <span className={css.statBody}>
                <span className={css.statLabel}>{t('statManaged')}</span>
                <span className={css.statValueRow}>
                  <span className={css.statValue}>{totalSkills}</span>
                </span>
                <span className={css.statDesc}>{t('statManagedDesc')}</span>
              </span>
            </div>
            <div className={css.stat}>
              <span className={css.statIconCol}>
                <span className={css.statIcon} data-tone="green"><StatCheckCircleIcon size={20} /></span>
                <i className={css.statGlow} data-tone="green" aria-hidden="true" />
              </span>
              <span className={css.statBody}>
                <span className={css.statLabel}>{t('statEnabled')}</span>
                <span className={css.statValueRow}>
                  <span className={css.statValue}>{enabledCount}</span>
                </span>
                <span className={css.statDesc}>{t('statEnabledDesc')}</span>
              </span>
            </div>
            <div className={css.stat}>
              <span className={css.statIconCol}>
                <span className={css.statIcon} data-tone="violet"><StatSquareIcon size={20} /></span>
                <i className={css.statGlow} data-tone="violet" aria-hidden="true" />
              </span>
              <span className={css.statBody}>
                <span className={css.statLabel}>{t('statLoose')}</span>
                <span className={css.statValueRow}>
                  <span className={css.statValue}>{loose.length}</span>
                </span>
                <span className={css.statDesc}>{t('statLooseDesc')}</span>
              </span>
            </div>
            <div className={css.stat}>
              <span className={css.statIconCol}>
                <span className={css.statIcon} data-tone="orange"><StatHeartIcon size={20} /></span>
                <i className={css.statGlow} data-tone="orange" aria-hidden="true" />
              </span>
              <span className={css.statBody}>
                <span className={css.statLabel}>{t('statSync')}</span>
                <span className={css.statValueRow}>
                  <span
                    className={css.statValue}
                    data-tone={healthView.tone === 'warn' ? 'warn' : healthView.tone === 'pending' ? 'pending' : undefined}
                    title={healthView.title === '' ? undefined : healthView.title}
                  >
                    {healthView.label}
                  </span>
                  <IconChevronRightOutline14 className={css.statChevron} size={16} aria-hidden="true" />
                </span>
                <span className={css.statDesc}>{t('statSyncDesc')}</span>
              </span>
            </div>
          </div>

          {/* 同步问题明细：只读健康扫描发现 error 级问题时展示，悬停统计卡同看 */}
          {health.state === 'issue' && (
            <div className={css.healthNotice} role="status">
              <span className={css.healthNoticeTitle}>{t('statIssues', { n: health.report.issues.length })}</span>
              <ul>
                {health.report.issues.slice(0, 4).map((issue, index) => (
                  <li key={`${issue.code}-${String(index)}`}>{issue.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 预设提示行：当前编辑层说明 + 清空该预设的单独设置 */}
          <div className={css.hintRow}>
            <span className={css.hintRowText}>
              {activePreset === ALL_PRESETS
                ? t('presetHintAll')
                : t('presetHintScoped', { name: presets.find((preset) => preset.id === activePreset)?.name ?? activePreset })}
            </span>
            {activePreset !== ALL_PRESETS && Object.keys(presetOverride).length > 0 && (
              <button type="button" className={css.presetReset} onClick={resetActivePreset}>
                {t('presetReset')}
              </button>
            )}
          </div>

          {/* 工具栏：搜索 / 名称排序 / 批量 / 视图（参考设计稿） */}
          <div className={css.toolbar}>
            <div className={css.searchBox}>
              <SearchIcon />
              <input
                className={css.searchInput}
                value={query}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                onChange={(event) => { setQuery(event.currentTarget.value) }}
              />
            </div>
            <div className={css.dropWrap}>
              <button
                type="button"
                className={css.toolButton}
                aria-haspopup="menu"
                aria-expanded={openMenu === 'sort' || undefined}
                onClick={() => { setOpenMenu((value) => value === 'sort' ? null : 'sort') }}
              >
                {t('sortLabel')}
                <SortDirIcon dir={sortAsc ? 'asc' : 'desc'} size={12} />
                <IconChevronDownOutline14 size={11} aria-hidden="true" />
              </button>
              {openMenu === 'sort' && (
                <>
                  <button type="button" className={css.bulkOverlay} aria-label={t('close')} onClick={() => { setOpenMenu(null) }} />
                  <div className={css.dropMenu} role="menu">
                    <button type="button" role="menuitemradio" className={css.dropItem} aria-checked={sortAsc}
                      onClick={() => { setSortAsc(true); setOpenMenu(null) }}>
                      <span className={css.dropCheck} data-on={sortAsc || undefined} aria-hidden="true">{sortAsc ? '✓' : ''}</span>
                      {t('nameAsc')}
                    </button>
                    <button type="button" role="menuitemradio" className={css.dropItem} aria-checked={!sortAsc}
                      onClick={() => { setSortAsc(false); setOpenMenu(null) }}>
                      <span className={css.dropCheck} data-on={!sortAsc || undefined} aria-hidden="true">{!sortAsc ? '✓' : ''}</span>
                      {t('nameDesc')}
                    </button>
                  </div>
                </>
              )}
            </div>
            <span className={css.toolbarSpacer} />
            <button
              type="button"
              className={`${css.newBundleBtn} ${newBundleOpen ? css.newBundleBtnOpen : ''}`}
              style={{ width: 'auto', marginTop: 0, height: 34, fontSize: 12 }}
              aria-expanded={newBundleOpen || undefined}
              onClick={() => { setNewBundleOpen(true) }}
            >
              <IconPlusOutline16 size={14} aria-hidden="true" />
              {t('newBundle')}
            </button>
            <button
              type="button"
              className={css.addBtn}
              style={{ height: 34, alignSelf: 'center' }}
              aria-label={t('addSkillsTitle')}
              title={t('addSkillsSub')}
              onClick={() => { setInstall(null); setInstallError(null); setAddOpen(true) }}
            >
              <CloudUpIcon size={15} aria-hidden="true" />
              {t('addSkillsTitle')}
            </button>
            <input
              ref={fileInput}
              type="file"
              className={css.hiddenInput}
              multiple
              {...{ webkitdirectory: '' }}
              onChange={(event) => {
                acceptFiles(event.currentTarget.files === null ? null : Array.from(event.currentTarget.files))
              }}
            />
          </div>

          {/* 分类 tabs 已移除：与左栏「Agent 预设分类」重复（左栏控制预设切换） */}

          {/* 内容区：技能包 sections + 散装技能 */}
          <div className={`${css.mainScroll} ${modalStaggerClass}`}>
            {state.status === 'loading' ? <p className={css.status}>{t('loading')}</p> : null}
            {state.status === 'error' ? (
              <div className={css.failure}>
                <p role="alert">{t('error')}</p>
                <Button variant="outline" onClick={refresh}><IconRefreshOutline14 /> {t('retry')}</Button>
              </div>
            ) : null}

            {state.status === 'ready' && (
              noResults ? (
                <p className={css.noResult}>{t('noMatch')}</p>
              ) : (
                <>
                  {visibleBundleAll.map((bundle) => {
                    const open2 = expanded.has(bundle.id)
                    const renamingThis = renameTarget?.bundleId === bundle.id
                    const bundleEnabled = bundleEnabledIn(bundle)
                    const bundleToggling = toggling.has(`bundle:${bundle.id}`)
                    const gridClass = viewMode === 'list' ? `${css.skillGrid} ${css.skillGridList}` : css.skillGrid
                    const missing = bundle.missingSkills ?? []
                    const bundleCats = bundle.categories ?? []
                    const emptyBundle = bundle.skillCount === 0
                    // 空包默认展开显示引导：折叠着只剩一行标题，用户会以为包丢了。
                    const openView = open2 || emptyBundle
                    return (
                      <section key={bundle.id} className={css.hubSection} data-open={openView ? 'true' : undefined} data-empty={emptyBundle ? 'true' : undefined}>
                        <header
                          className={css.bundleRowOuter}
                          data-open={openView ? 'true' : undefined}
                        >
                          <button
                            type="button"
                            className={css.bundleRow}
                            aria-expanded={openView}
                            onClick={(event) => {
                              // 标题行里嵌着分类标签：点到标签就是筛选，不该顺手把包展开/收起。
                              // 标签本身是 span（按钮里不能再套按钮），键盘路径走顶栏分类胶囊。
                              const hit = (event.target as HTMLElement).closest('[data-skm-cat]') as HTMLElement | null
                              if (hit !== null) {
                                const cat = hit.dataset.skmCat ?? ''
                                setCatFilter(activeCat === cat ? null : cat)
                                return
                              }
                              toggleExpanded(bundle.id)
                            }}
                          >
                            <span className={css.bundleIcon} aria-hidden="true"><FolderBlueIcon size={17} /></span>
                            <span className={css.bundleName} title={bundle.name}>{bundle.name}</span>
                            <span className={css.bundleCount}>{t('skillsCount', { n: bundle.skillCount })}</span>
                            {bundleCats.length > 0 && (
                              <span className={css.bundleCats}>
                                {bundleCats.map((cat) => (
                                  <span
                                    key={cat}
                                    className={css.bundleCatTag}
                                    data-skm-cat={cat}
                                    data-active={activeCat === cat || undefined}
                                    title={t('bundleCatTip', { name: cat })}
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </span>
                            )}
                            <IconChevronDownOutline14 className={css.chevron} size={13} aria-hidden="true" />
                          </button>
                          {/* 技能包一键开关：整包启用/禁用 */}
                          <span className={css.bundleToggle}>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={bundleEnabled}
                              aria-label={bundleEnabled ? t('disableBundle') : t('enableBundle')}
                              title={bundleEnabled ? t('disableBundle') : t('enableBundle')}
                              className={`${css.toggle} ${bundleEnabled ? css.toggleOn : css.toggleOff}`}
                              disabled={bundleToggling || bundle.skillCount === 0}
                              onClick={(event) => {
                                event.stopPropagation()
                                toggleBundle(bundle, !bundleEnabled)
                              }}
                            >
                              <span className={css.toggleKnob} aria-hidden="true" />
                            </button>
                          </span>
                          <div className={css.bundleMore}>
                            <Menu
                              open={openMenu === `bundle:${bundle.id}`}
                              onClose={() => { setOpenMenu(null) }}
                              onSelect={(id) => {
                                setOpenMenu(null)
                                if (id === 'enable') toggleBundle(bundle, true)
                                else if (id === 'disable') toggleBundle(bundle, false)
                                else if (id === 'rename') setRenameTarget({ bundleId: bundle.id, name: bundle.name })
                                else if (id === 'cat') openCatEditor(bundle)
                                else if (id === 'delete') setConfirm({ kind: 'bundle', bundle })
                              }}
                              portal
                              items={[
                                { id: 'enable', label: t('enableBundle'), icon: <IconCheckOutline16 size={14} /> },
                                { id: 'disable', label: t('disableBundle'), icon: <IconCloseOutline16 size={14} /> },
                                { type: 'separator', id: 'gap' },
                                { id: 'rename', label: t('rename'), icon: <IconEditOutline16 size={14} /> },
                                { id: 'cat', label: t('bundleCatEdit'), icon: <TagIcon /> },
                                { id: 'delete', label: t('delete'), icon: <IconTrashOutline16 size={14} />, danger: true },
                              ]}
                              anchor={(
                                <button
                                  type="button"
                                  className={css.bundleMoreBtn}
                                  aria-label={t('moreActions')}
                                  aria-haspopup="menu"
                                  aria-expanded={openMenu === `bundle:${bundle.id}` || undefined}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setOpenMenu(openMenu === `bundle:${bundle.id}` ? null : `bundle:${bundle.id}`)
                                  }}
                                >
                                  <IconEllipsisOutline16 size={15} aria-hidden="true" />
                                </button>
                              )}
                            />
                          </div>
                        </header>
                        {renamingThis && renameTarget !== null && (
                          <form className={`${css.inlineForm} ${css.inlineFormBlock}`} onSubmit={(event) => { void submitRename(event) }}>
                            <input className={css.inlineInput} value={renameTarget.name} placeholder={t('renameBundlePlaceholder')}
                              aria-label={t('renameBundlePlaceholder')} autoFocus disabled={renaming}
                              onChange={(event) => {
                                // 先把值取出再进 setState 回调：React 合成事件在
                                // 回调执行完毕后会把 currentTarget 置空，若在函数式
                                // updater 里才读 event.currentTarget.value，渲染阶段
                                // 会抛 Cannot read properties of null，整个技能面板
                                // 被 ErrorBoundary 摘掉——表现就是「改名时卡片消失」。
                                const next = event.currentTarget.value
                                setRenameTarget((current) => current === null ? current : { ...current, name: next })
                              }} />
                            <Button variant="primary" type="submit" disabled={renaming || renameTarget.name.trim() === ''}>{t('rename')}</Button>
                            <Button variant="outline" type="button" disabled={renaming} onClick={() => { setRenameTarget(null) }}>{t('cancel')}</Button>
                          </form>
                        )}
                        {missing.length > 0 && (
                          <div className={css.bundleMissing} role="status">
                            <span>{t('bundleMissingN', { n: missing.length })}</span>
                            <code>{missing.join('、')}</code>
                            <button type="button" className={css.bundleMissingBtn} onClick={() => { void pruneBundle(bundle) }}>
                              {t('bundlePrune')}
                            </button>
                          </div>
                        )}
                        {openView && (
                          <ul className={gridClass} data-renamed={renamedFlash === bundle.id ? 'true' : undefined}>
                            {bundle.skills.length === 0 ? (
                              <li className={css.bundleEmpty}>
                                <span className={css.bundleEmptyTitle}>{t('bundleEmptyTitle')}</span>
                                <span className={css.bundleEmptyHint}>{t('bundleEmptyHint')}</span>
                                <button type="button" className={css.bundleEmptyBtn} onClick={() => { openInstallFor(bundle.id) }}>
                                  <CloudUpIcon size={14} />
                                  {t('bundleUploadHere')}
                                </button>
                              </li>
                            ) : bundle.skills.map((skill, index) => (
                              <SkillCard key={skill.name} skill={skill} bundleId={bundle.id} bundleName={bundle.name}
                                enabled={skillEnabledIn(skill.name)}
                                lockedReason={skillLockedReason(skill.name)}
                                scopeLabel={scopeLabel}
                                index={index}
                                onToggle={toggleSkill}
                                onView={openViewer}
                                onRemove={(s) => { void removeFromBundle(bundle.id, s.name) }}
                                onDelete={(s) => { setConfirm({ kind: 'skill', name: s.name, dir: s.dir }) }} />
                            ))}
                          </ul>
                        )}
                      </section>
                    )
                  })}

                  {visibleLooseAll.length > 0 && (
                    <section className={css.hubSection} data-open={looseOpen ? 'true' : undefined}>
                      <header
                        className={css.bundleRowOuter}
                        data-open={looseOpen ? 'true' : undefined}
                      >
                        <button
                          type="button"
                          className={css.bundleRow}
                          aria-expanded={looseOpen}
                          onClick={() => { setLooseExpanded((value) => !value) }}
                        >
                          <span className={css.bundleIcon} aria-hidden="true"><IconArchiveOutline20 size={16} /></span>
                          <span className={css.bundleName}>{t('looseTitle')}</span>
                          <span className={css.bundleCount}>{t('skillsCount', { n: visibleLooseAll.length })}</span>
                          <IconChevronDownOutline14 className={css.chevron} size={13} aria-hidden="true" />
                        </button>
                      </header>
                      {looseOpen && (
                        <ul className={viewMode === 'list' ? `${css.skillGrid} ${css.skillGridList}` : css.skillGrid}>
                          {visibleLooseAll.map((skill, index) => (
                            <SkillCard key={skill.name} skill={skill} bundleId={null} bundleName={null}
                              enabled={skillEnabledIn(skill.name)}
                              lockedReason={skillLockedReason(skill.name)}
                              scopeLabel={scopeLabel}
                              index={index}
                              onToggle={toggleSkill}
                              onView={openViewer}
                              onAssign={(s) => { setAssignTarget(s) }}
                              onDelete={(s) => { setConfirm({ kind: 'skill', name: s.name, dir: s.dir }) }} />
                          ))}
                        </ul>
                      )}
                    </section>
                  )}

                  {/* 新建技能包入口已移至左栏（newBundleBtn） */}
                </>
              )
            )}
          </div>
          </>) }
        </div>
      </div>
      </PshBody>
      {/* 操作回执：安装/删除/归组/开关的成败都从这里冒出来（面板右下角，自动收起） */}
      {toasts.length > 0 && (
        <div className={css.toastStack} role="status" aria-live="polite">
          {toasts.map((item) => (
            <span key={item.id} className={`${css.toast} ${item.tone === 'err' ? css.toastErr : css.toastOk}`} data-tone={item.tone}>
              <i className={css.toastDot} aria-hidden="true" />
              {item.text}
            </span>
          ))}
        </div>
      )}
      {/* 快速上手指南 / MCP 解释：面板右侧悬浮卡（portal 到 body，不压缩面板） */}
      {guideOpen && guidePos !== null && (
        <GuidePanel t={t} onClose={() => { setGuideOpen(false) }} left={guidePos.left} top={guidePos.top} height={guidePos.height} />
      )}


      <McpAddModal
        t={t}
        open={mcpAddOpen}
        onClose={() => { setMcpAddOpen(false) }}
        onAdded={(added) => { watchMcpTools(added) }}
      />

      {/* 新建技能包弹窗：名字与分类一起给，省得建完再进去设置一次。 */}
      <Modal
        open={newBundleOpen}
        onClose={() => { if (!creatingBundle) { setNewBundleOpen(false); setNewBundleCats([]) } }}
        closeLabel={t('close')}
        title={t('newBundle')}
      >
        <form className={css.stackForm} onSubmit={(event) => { void submitNewBundle(event) }}>
          <input className={css.inlineInput} value={newBundleName} placeholder={t('newBundlePlaceholder')}
            aria-label={t('newBundlePlaceholder')} autoFocus disabled={creatingBundle}
            onChange={(event) => { setNewBundleName(event.currentTarget.value) }} />
          <CategoryEditor value={newBundleCats} onChange={setNewBundleCats} label={t('newBundle')} />
          <div className={css.inlineForm}>
            <Button variant="primary" type="submit" disabled={creatingBundle || newBundleName.trim() === ''}>{t('create')}</Button>
            <Button variant="outline" type="button" disabled={creatingBundle} onClick={() => { setNewBundleOpen(false); setNewBundleCats([]) }}>{t('cancel')}</Button>
          </div>
        </form>
      </Modal>

      {/* 设置分类弹窗：与新建包共用同一个 CategoryEditor，值走草稿态，保存才落盘。 */}
      <Modal
        open={catTarget !== null}
        onClose={() => { if (!savingCats) setCatTarget(null) }}
        closeLabel={t('close')}
        title={t('bundleCatEditTitle', { name: catTarget?.name ?? '' })}
      >
        <div className={css.stackForm}>
          <CategoryEditor value={catDraft} onChange={setCatDraft} label={t('bundleCatEdit')} />
          <div className={css.inlineForm}>
            <Button variant="primary" type="button" disabled={savingCats} onClick={() => { void submitCategories() }}>{t('bundleCatDone')}</Button>
            <Button variant="outline" type="button" disabled={savingCats} onClick={() => { setCatTarget(null) }}>{t('cancel')}</Button>
          </div>
        </div>
      </Modal>

      {/* 添加技能弹窗：先拖放/浏览选文件，再填表单安装 */}
      <Modal
        open={addOpen}
        onClose={() => {
          if (installing) return
          setAddOpen(false)
          setInstall(null)
          setDropActive(false)
        }}
        closeLabel={t('close')}
        title={t('addSkillsTitle')}
      >
        {install === null ? (
          <div
            className={`${css.addCard} ${dropActive ? css.addCardActive : ''}`}
            role="button"
            tabIndex={0}
            aria-label={t('addSkillsTitle')}
            onClick={() => { fileInput.current?.click() }}
            onDragOver={(event) => { event.preventDefault(); setDropActive(true) }}
            onDragLeave={() => { setDropActive(false) }}
            onDrop={(event) => { void onDrop(event) }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                fileInput.current?.click()
              }
            }}
          >
            <span className={css.addCardHead}>
              <span className={css.addCardIcon}><CloudUpIcon size={22} /></span>
              <span className={css.addCardTitle}>{t('bannerTitle')}</span>
            </span>
            <span className={css.addCardSub}>{t('bannerSub')}</span>
            <span className={css.addDrop}>
              <CloudUpIcon size={18} />
              <span className={css.addDropText}>{t('dropHere')}</span>
              <span className={css.addDropHint}>{t('dropFormat')}</span>
            </span>
            <button type="button" className={css.addBtn} onClick={(event) => { event.stopPropagation(); fileInput.current?.click() }}>
              {t('browseImport')}
            </button>
            <input
              ref={fileInput}
              type="file"
              className={css.hiddenInput}
              multiple
              {...{ webkitdirectory: '' }}
              onChange={(event) => {
                acceptFiles(event.currentTarget.files === null ? null : Array.from(event.currentTarget.files))
              }}
            />
          </div>
        ) : (
          <form className={css.installForm} onSubmit={(event) => { void confirmInstall(event) }}>
            <div className={css.installRow}>
              <input className={css.inlineInput} value={installName}
                placeholder={install.archive === true ? t('installNameFromArchive') : t('installNamePlaceholder')}
                aria-label={t('installName')}
                disabled={installing || install.archive === true}
                onChange={(event) => { setInstallName(event.currentTarget.value) }} />
              <input className={css.inlineInput} value={installDescription} placeholder={t('installDescription')}
                aria-label={t('installDescription')} disabled={installing}
                onChange={(event) => { setInstallDescription(event.currentTarget.value) }} />
              <label className={css.bundleSelect}>
                <span className={css.visuallyHidden}>{t('installBundle')}</span>
                <select value={installBundleId ?? ''} disabled={installing}
                  onChange={(event) => { setInstallBundleId(event.currentTarget.value === '' ? undefined : event.currentTarget.value) }}>
                  <option value="">{t('installLoose')}</option>
                  {bundles.map((bundle) => <option key={bundle.id} value={bundle.id}>{bundle.name}</option>)}
                </select>
              </label>
              <span className={css.installMeta}>
                {install.archive === true
                  ? t('uploadMeta', { n: 1, folder: install.folderName })
                  : t('uploadMeta', { n: install.files.length, folder: install.folderName })}
              </span>
            </div>
            {install.archive !== true && nameInvalid && <p className={css.error} role="alert">{t('installNameInvalid')}</p>}
            {install.archive !== true && !nameInvalid && trimmedName !== '' && installMetaName !== null && installMetaName !== trimmedName && (
              <p className={css.installHint}>{t('installNameRewrite', { meta: installMetaName, name: trimmedName })}</p>
            )}
            <div className={css.installActions}>
              <Button variant="primary" type="submit" disabled={installing || (install.archive !== true && (trimmedName === '' || nameInvalid))}>{t('installConfirm')}</Button>
              <Button variant="outline" type="button" disabled={installing} onClick={() => { setInstall(null); setAddOpen(false) }}>{t('installCancel')}</Button>
            </div>
            {installError !== null && <p className={css.error} role="alert">{installError}</p>}
          </form>
        )}
      </Modal>

      <Modal
        open={confirm !== null}
        onClose={() => {
          if (!confirming) setConfirm(null)
        }}
        closeLabel={t('close')}
        title={confirmTitle}
        footer={
          <>
            <Button variant="outline" disabled={confirming} onClick={() => { setConfirm(null) }}>{t('cancel')}</Button>
            <Button variant="primary" disabled={confirming} onClick={() => { void confirmDelete() }}>{t('delete')}</Button>
          </>
        }
      />

      {viewer !== null && (
        <Modal
          open
          onClose={() => { setViewer(null) }}
          closeLabel={t('close')}
          title={viewer.skill.name + (viewer.file === 'SKILL.md' ? '' : ' · ' + viewer.file)}
          className={css.viewerModal + (viewerFull ? ' ' + css.viewerModalFull : '')}
          contentClassName={css.viewerBody}
        >
          {/* 工具条：当前文件 + 字号三档 + 全屏切换（偏好持久化） */}
          <div className={css.viewerToolbar}>
            <span className={css.viewerPath}>
              <b>{viewer.file}</b>
              <span>{t('viewerFilesCount', { n: Array.isArray(viewer.skill.files) ? viewer.skill.files.length : 0 })}</span>
            </span>
            <span className={css.viewerToolGroup} role="group" aria-label={t('viewerFont')}>
              {VIEWER_FONT_SIZES.map((size, level) => (
                <button
                  key={size}
                  type="button"
                  className={css.viewerToolBtn + (level === 0 ? ' ' + css.viewerToolBtnA1 : level === 2 ? ' ' + css.viewerToolBtnA3 : '')}
                  data-active={viewerFont === level ? 'true' : undefined}
                  title={VIEWER_FONT_LABELS[level]}
                  aria-label={VIEWER_FONT_LABELS[level]}
                  aria-pressed={viewerFont === level}
                  onClick={() => { setViewerFontLevel(level) }}
                >A</button>
              ))}
            </span>
            <button
              type="button"
              className={css.viewerToolBtn + ' ' + css.viewerToolBtnFrame}
              data-active={viewerFull ? 'true' : undefined}
              title={viewerFull ? t('viewerExitFull') : t('viewerFull')}
              aria-label={viewerFull ? t('viewerExitFull') : t('viewerFull')}
              aria-pressed={viewerFull}
              onClick={toggleViewerFull}
            >
              <ViewerExpandIcon full={viewerFull} />
            </button>
          </div>
          <div className={css.viewerLayout}>
            <nav className={css.viewerNav} aria-label={t('viewerNav')}>
              {skillFileRows(Array.isArray(viewer.skill.files) ? viewer.skill.files : []).map((row, index) => (
                <div
                  key={row.path + '-' + String(index)}
                  className={css.viewerNavItem + (row.kind === 'dir' ? ' ' + css.viewerNavDir : '')}
                  data-active={row.kind === 'file' && row.path === viewer.file ? 'true' : undefined}
                  data-dir={row.kind === 'dir' ? 'true' : undefined}
                  style={{ paddingLeft: 8 + row.depth * 14 }}
                  title={row.path}
                  onClick={row.kind === 'file' ? () => { selectViewerFile(row.path) } : undefined}
                >
                  {row.kind === 'dir' ? '📁 ' : '📄 '}
                  {row.path}
                </div>
              ))}
            </nav>
            <div className={css.viewerContent} style={{ '--skm-vfs': `${String(VIEWER_FONT_SIZES[viewerFont])}px` } as CSSProperties}>
              {viewer.loading === true
                ? t('previewLoading')
                : viewer.error !== undefined
                  ? viewer.error
                  : <div dangerouslySetInnerHTML={{ __html: renderSkillMarkdown(viewer.content ?? '') }} />}
            </div>
          </div>
        </Modal>
      )}

      {assignTarget !== null && (
        <Modal
          open
          onClose={() => { setAssignTarget(null) }}
          closeLabel={t('close')}
          title={t('assignTitle', { name: assignTarget.name })}
          className={css.assignModal}
          contentClassName={css.assignModalBody}
        >
          {bundles.length === 0 ? (
            <p className={css.looseEmpty}>{t('assignEmpty')}</p>
          ) : (
            <ul className={css.assignList}>
              {bundles.map((bundle, index) => (
                <li key={bundle.id} style={{ listStyle: 'none' }}>
                  <button
                    type="button"
                    className={css.assignCard}
                    style={{ '--skm-i': index } as CSSProperties}
                    onClick={() => { void doAssign(assignTarget, bundle.id) }}
                  >
                    <span className={css.assignCardIcon} aria-hidden="true"><IconFolderOpenOutline16 size={16} /></span>
                    <span className={css.assignCardBody}>
                      <span className={css.assignCardName}>{bundle.name}</span>
                      <span className={css.assignCardDesc}>{t('skillsCount', { n: bundle.skillCount })}</span>
                    </span>
                    <span className={css.assignGo} aria-hidden="true"><IconChevronDownOutline14 size={14} /></span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </PopoverShell>
  )
}
