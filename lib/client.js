window.__ModuleLoader__.load({ id: "dsh-triad", factory: (require) => {
var module = { exports: {} };
var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/client/skill-source/styles.ts
function injectSkillRowStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("dsh-webui-skill-source-styles") !== null) return;
  const style = document.createElement("style");
  style.id = "dsh-webui-skill-source-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}
var CSS, skillCss;
var init_styles = __esm({
  "src/client/skill-source/styles.ts"() {
    CSS = `
.webui-skill-card {
  display: flex;
  flex-direction: column;
}

.webui-skill-row {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 24px;
  min-width: 0;
}

.webui-skill-row[data-expandable] {
  cursor: pointer;
}

.webui-skill-card[data-state='running'] .webui-skill-row::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 300px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent) 55%,
    transparent 100%
  );
  animation: dsh-webui-skill-row-sweep 2.6s ease-out infinite;
  pointer-events: none;
}

@keyframes dsh-webui-skill-row-sweep {
  0% { left: -300px; }
  90%, 100% { left: 100%; }
}

.webui-skill-leading {
  position: relative;
  flex: none;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  color: var(--dsw-alias-label-tertiary);
}

.webui-skill-chevron {
  color: var(--dsw-alias-label-secondary);
}

.webui-skill-iconIdle {
  display: inline-flex;
  opacity: 1;
  transition: opacity 100ms ease;
}

.webui-skill-chevronHover {
  position: absolute;
  inset: 0;
  margin: auto;
  opacity: 0;
  transition: opacity 100ms ease;
}

.webui-skill-row:hover .webui-skill-iconIdle {
  opacity: 0;
}

.webui-skill-row:hover .webui-skill-chevronHover {
  opacity: 1;
}

.webui-skill-title {
  flex: none;
  font-size: 14px;
  line-height: 24px;
  color: var(--dsw-alias-label-secondary);
}

.webui-skill-separator {
  flex: none;
  width: 2px;
  height: 2px;
  border-radius: 1px;
  margin: 0 8px;
  background: var(--dsw-alias-label-caption);
}

.webui-skill-summary {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 24px;
  color: var(--dsw-alias-label-tertiary);
}

.webui-skill-errorSummary {
  color: var(--dsw-alias-state-error-primary);
}

.webui-skill-bodyWrap {
  display: flex;
  flex-direction: column;
}

.webui-skill-instructionsCard {
  display: flex;
  flex-direction: column;
  max-height: 260px;
  margin: 4px 0 4px 4px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-markdown-code-block);
}

.webui-skill-instructionsHeader {
  flex: none;
  padding: 8px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-markdown-code-block-banner);
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.webui-skill-instructions {
  min-height: 0;
  margin: 0;
  padding: 10px 12px 12px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font: var(--dsw-font-markdown-code-block-small);
  color: var(--dsw-alias-label-secondary);
}

.webui-skill-instructions[data-error] {
  color: var(--dsw-alias-state-error-primary);
}

.webui-skill-instructions::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 6px;
}

.webui-skill-instructions::-webkit-scrollbar-track {
  margin: 6px 0;
}

.webui-skill-inspectButton {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 4px;
  margin: 4px 0 2px 4px;
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 16px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 100ms ease;
}

.webui-skill-card:hover .webui-skill-inspectButton,
.webui-skill-inspectButton:focus-visible {
  opacity: 1;
}

.webui-skill-inspectButton:hover {
  background: var(--dsw-alias-interactive-bg-hover-solid);
  color: var(--dsw-alias-label-primary);
}

.webui-skill-visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .webui-skill-card[data-state='running'] .webui-skill-row::after {
    animation: none;
    display: none;
  }

  .webui-skill-iconIdle,
  .webui-skill-chevronHover,
  .webui-skill-inspectButton {
    transition: none;
  }
}
`;
    skillCss = {
      card: "webui-skill-card",
      row: "webui-skill-row",
      leading: "webui-skill-leading",
      chevron: "webui-skill-chevron",
      iconIdle: "webui-skill-iconIdle",
      chevronHover: "webui-skill-chevronHover",
      title: "webui-skill-title",
      separator: "webui-skill-separator",
      summary: "webui-skill-summary",
      errorSummary: "webui-skill-errorSummary",
      bodyWrap: "webui-skill-bodyWrap",
      instructionsCard: "webui-skill-instructionsCard",
      instructionsHeader: "webui-skill-instructionsHeader",
      instructions: "webui-skill-instructions",
      inspectButton: "webui-skill-inspectButton",
      visuallyHidden: "webui-skill-visuallyHidden"
    };
  }
});

// src/client/skill-source/SkillRow.tsx
function firstLine(text) {
  const newline = text.indexOf("\n");
  return newline === -1 ? text : text.slice(0, newline);
}
function skillName(argsRaw, callId) {
  try {
    const parsed = JSON.parse(argsRaw);
    if (typeof parsed === "object" && parsed !== null) {
      const name = parsed.name;
      if (typeof name === "string" && name !== "") return firstLine(name);
    }
  } catch {
  }
  return argsRaw === "" ? callId : firstLine(argsRaw);
}
function resultText(block) {
  if (!("kind" in block)) return null;
  const parts = [];
  for (const item of block.content) {
    parts.push(item.type === "text" ? item.text : JSON.stringify(item, null, 2));
  }
  if (parts.length === 0 && block.error !== void 0) {
    parts.push(`${block.error.name}: ${block.error.code}`);
  }
  return parts.join("\n") || null;
}
function skillRowModel(block) {
  const settled = "kind" in block;
  const argsRaw = (settled ? block.call?.argsRaw : block.argsRaw) ?? "";
  const state = !settled ? "running" : block.error?.code === "interrupted" ? "stopped" : block.isError ? "error" : "ok";
  const output = resultText(block);
  return {
    name: skillName(argsRaw, block.callId),
    output,
    errorSummary: state === "error" && output !== null ? firstLine(output) : null,
    state
  };
}
function leadingFor(state) {
  switch (state) {
    case "error":
      return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_dsh_client_ui_primitives5.StateDot, { state: "error" });
    case "stopped":
      return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_dsh_client_ui_primitives5.StateDot, { state: "warning" });
    default:
      return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_dsh_client_ui_primitives5.IconSkillOutline16, { size: 14 });
  }
}
function disclosureLeading(state, open, expandable) {
  if (open) return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_dsh_client_ui_primitives5.IconChevronDownOutline14, { className: skillCss.chevron });
  const icon = leadingFor(state);
  if (!expandable) return icon;
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(import_jsx_runtime34.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: skillCss.iconIdle, children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_dsh_client_ui_primitives5.IconChevronDownOutline14, { className: `${skillCss.chevron} ${skillCss.chevronHover}` })
  ] });
}
function stateStatus(state, t) {
  switch (state) {
    case "running":
      return t("row.running");
    case "error":
      return t("row.failed");
    case "stopped":
      return t("row.stopped");
    default:
      return null;
  }
}
function SkillRow({ block, inspect, t }) {
  const model = skillRowModel(block);
  const [expanded, setExpanded] = (0, import_react28.useState)(false);
  const expandable = model.output !== null;
  const open = expanded && expandable;
  const status = stateStatus(model.state, t);
  const summary = model.errorSummary ?? model.name;
  const toggleExpand = () => {
    setExpanded((value) => !value);
  };
  const toggleFromKeyboard = (event) => {
    if (!expandable || event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleExpand();
  };
  const disclosureProps = expandable ? {
    role: "button",
    tabIndex: 0,
    "aria-expanded": open,
    onClick: toggleExpand,
    onKeyDown: toggleFromKeyboard
  } : {};
  const leading = disclosureLeading(model.state, open, expandable);
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: skillCss.card, "data-tool": "skill", "data-state": model.state, children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
      "div",
      {
        className: skillCss.row,
        "data-expandable": expandable || void 0,
        ...disclosureProps,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: skillCss.leading, children: leading }),
          status !== null ? /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: skillCss.visuallyHidden, children: status }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: skillCss.title, children: "Skill" }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: skillCss.separator, "aria-hidden": true }),
          /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("span", { className: model.errorSummary === null ? skillCss.summary : `${skillCss.summary} ${skillCss.errorSummary}`, children: summary })
        ]
      }
    ),
    open ? /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: skillCss.bodyWrap, children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("section", { className: skillCss.instructionsCard, "aria-label": t("row.instructions"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: skillCss.instructionsHeader, children: t("row.instructions") }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("pre", { className: skillCss.instructions, "data-error": model.state === "error" || void 0, children: model.output })
      ] }),
      inspect !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("button", { type: "button", className: skillCss.inspectButton, onClick: inspect, children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_dsh_client_ui_primitives5.IconInspectOutline12, {}),
        "Inspect"
      ] }) : null
    ] }) : null
  ] });
}
var import_react28, import_dsh_client_ui_primitives5, import_jsx_runtime34;
var init_SkillRow = __esm({
  "src/client/skill-source/SkillRow.tsx"() {
    import_react28 = require("react");
    import_dsh_client_ui_primitives5 = require("@deepseek-ai/dsh-client-ui-primitives");
    init_styles();
    import_jsx_runtime34 = require("react/jsx-runtime");
  }
});

// src/client/skill-source/locales.ts
var NS2, zh2, en2;
var init_locales = __esm({
  "src/client/skill-source/locales.ts"() {
    NS2 = "skill";
    zh2 = {
      "row.running": "\u6B63\u5728\u52A0\u8F7D skill",
      "row.failed": "skill \u52A0\u8F7D\u5931\u8D25",
      "row.stopped": "skill \u52A0\u8F7D\u5DF2\u4E2D\u6B62",
      "row.instructions": "\u8BF4\u660E",
      "menu.userOnly": "\u4EC5\u7528\u6237"
    };
    en2 = {
      "row.running": "Loading skill",
      "row.failed": "Skill load failed",
      "row.stopped": "Skill load stopped",
      "row.instructions": "Instructions",
      "menu.userOnly": "user-only"
    };
  }
});

// src/client/skill-source/index.ts
var skill_source_exports = {};
__export(skill_source_exports, {
  apply: () => apply,
  invalidateSkillCache: () => invalidateSkillCache
});
function fetchPresets() {
  if (presetsCache !== void 0 && Date.now() - presetsCache.at < SNAPSHOT_TTL_MS) {
    return presetsCache.promise;
  }
  const promise = fetch("/api/skill-toggles/presets", {
    headers: { accept: "application/json" }
  }).then((response) => response.ok ? response.json() : null).catch(() => null);
  presetsCache = { at: Date.now(), promise };
  return promise;
}
function sessionPresetOf(sessionId) {
  try {
    const sessions = rootCtx?.get?.("sessions");
    const byId = sessions?.list?.getSnapshot?.()?.byId;
    const preset = byId?.[sessionId]?.agentPreset;
    return typeof preset === "string" && preset !== "" ? preset : void 0;
  } catch {
    return void 0;
  }
}
function notifyListeners(sessionId) {
  for (const listener of [...lexiconListeners.get(sessionId) ?? []]) {
    try {
      listener();
    } catch (error) {
      console.error("[skill-source] lexicon listener failed:", error);
    }
  }
}
function fetchSnapshot(sessionId) {
  const existing = fetches.get(sessionId);
  if (existing !== void 0 && Date.now() - existing.fetchedAt < SNAPSHOT_TTL_MS) {
    return existing.promise;
  }
  const abort = new AbortController();
  const entry = { promise: void 0, fetchedAt: Date.now(), abort };
  const promise = (async () => {
    const [listResponse, toggleResponse, presetWire] = await Promise.all([
      fetch("/api/skill-manager/list", {
        headers: { accept: "application/json" },
        signal: abort.signal
      }),
      fetch("/api/skill-toggles/status", {
        headers: { accept: "application/json" },
        signal: abort.signal
      }).catch(() => null),
      fetchPresets()
    ]);
    const body = await listResponse.json();
    if (!listResponse.ok) throw new Error(body.error ?? `skill list failed (${String(listResponse.status)})`);
    let enabled = {};
    if (toggleResponse !== null && toggleResponse.ok) {
      const toggles = await toggleResponse.json();
      if (toggles.skills !== void 0) enabled = toggles.skills;
    }
    const presetId = sessionPresetOf(sessionId);
    const overrides = presetId === void 0 ? void 0 : presetWire?.overrides?.[presetId];
    if (overrides !== void 0) {
      const merged = { ...enabled };
      for (const [name, state] of Object.entries(overrides)) {
        if (state === false) merged[name] = false;
      }
      enabled = merged;
    }
    return { ...body, enabled };
  })();
  entry.promise = promise;
  fetches.set(sessionId, entry);
  promise.then(
    (snapshot) => {
      entry.settled = snapshot;
      notifyListeners(sessionId);
    },
    () => {
      if (fetches.get(sessionId) === entry) fetches.delete(sessionId);
    }
  );
  return promise;
}
function invalidateSkillCache(sessionId) {
  presetsCache = void 0;
  if (sessionId === void 0) {
    for (const key of [...fetches.keys()]) {
      const entry2 = fetches.get(key);
      if (entry2 === void 0) continue;
      fetches.delete(key);
      entry2.abort.abort();
      notifyListeners(key);
    }
    return;
  }
  const entry = fetches.get(sessionId);
  if (entry === void 0) return;
  fetches.delete(sessionId);
  entry.abort.abort();
  notifyListeners(sessionId);
}
function skillEnabled(snapshot, name) {
  return snapshot.enabled[name] !== false;
}
function allSkillNames(snapshot) {
  const names = [];
  for (const bundle of snapshot.bundles) {
    for (const skill of bundle.skills) {
      if (skillEnabled(snapshot, skill.name)) names.push(skill.name);
    }
  }
  for (const skill of snapshot.loose) {
    if (skillEnabled(snapshot, skill.name)) names.push(skill.name);
  }
  return names;
}
function skillsOf(snapshot, bundleId) {
  const source = bundleId === LOOSE_ID ? snapshot.loose : snapshot.bundles.find((bundle) => bundle.id === bundleId)?.skills ?? [];
  return source.filter((skill) => skillEnabled(snapshot, skill.name));
}
function parseLevelQuery(query) {
  const match = /^([a-z0-9_-]+):(.*)$/.exec(query);
  if (match === null) return null;
  return { bundleId: match[1], rest: match[2] };
}
function skillCandidate(skill) {
  return { name: skill.name, description: skill.description, value: `${SKILL_MARK}${skill.name}` };
}
function bundleCandidate(snapshot, bundle) {
  const enabledCount = skillsOf(snapshot, bundle.id).length;
  if (enabledCount === 0) return null;
  return {
    name: bundle.name,
    description: `${String(enabledCount)} \u4E2A\u6280\u80FD`,
    value: `${BUNDLE_MARK}${bundle.id}`
  };
}
function apply(ctx) {
  rootCtx = ctx;
  ctx.effect(() => {
    return () => {
      if (rootCtx === ctx) rootCtx = void 0;
    };
  }, "skill-source: root ctx capture");
  ctx.effect(() => ctx.locale.register(NS2, { zh: zh2, en: en2 }), "skill-source: dictionaries");
  injectSkillRowStyles();
  ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
    { name: "tool.call.toolview", key: "skill", locale: NS2 },
    SkillRow
  ));
  const inputTriggers = ctx.get("inputTriggers");
  if (inputTriggers === void 0) {
    console.warn("[skill-source] inputTriggers \u670D\u52A1\u4E0D\u53EF\u7528,\u6280\u80FD slash \u6E90\u672A\u6CE8\u518C");
    return;
  }
  const source = {
    trigger: "/",
    name: "skill",
    order: 2,
    async candidates(session, req) {
      let snapshot;
      try {
        snapshot = await fetchSnapshot(session.sessionId);
      } catch {
        return [];
      }
      if (req.signal.aborted) return [];
      const level = parseLevelQuery(req.query);
      if (level !== null && skillsOf(snapshot, level.bundleId).length > 0) {
        return skillsOf(snapshot, level.bundleId).filter((skill) => skill.name.startsWith(level.rest)).map(skillCandidate);
      }
      const bundles = snapshot.bundles.filter((bundle) => bundle.name.startsWith(req.query) || bundle.id.startsWith(req.query)).map((bundle) => bundleCandidate(snapshot, bundle)).filter((candidate) => candidate !== null);
      const looseEnabled = skillsOf(snapshot, LOOSE_ID);
      if (looseEnabled.length > 0) {
        bundles.push({
          name: "\u6563\u88C5\u6280\u80FD",
          description: `${String(looseEnabled.length)} \u4E2A\u6280\u80FD`,
          value: `${BUNDLE_MARK}${LOOSE_ID}`
        });
      }
      return bundles;
    },
    warm(session) {
      fetchSnapshot(session.sessionId).catch(() => {
      });
    },
    lexicon(session) {
      const entry = fetches.get(session.sessionId);
      return entry?.settled === void 0 ? void 0 : allSkillNames(entry.settled);
    },
    subscribeLexicon(session, listener) {
      const key = session.sessionId;
      const listeners = lexiconListeners.get(key) ?? /* @__PURE__ */ new Set();
      listeners.add(listener);
      lexiconListeners.set(key, listeners);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) lexiconListeners.delete(key);
      };
    },
    onPick({ candidate }) {
      const value = candidate.value ?? "";
      if (value.startsWith(BUNDLE_MARK)) {
        const bundleId = value.slice(BUNDLE_MARK.length);
        return { text: `/${bundleId}:`, continue: true };
      }
      return { text: `/${candidate.name} ` };
    }
  };
  ctx.effect(() => {
    let unregister;
    try {
      unregister = inputTriggers.registerSource(source);
    } catch (error) {
      console.warn("[skill-source] /skill \u6E90\u6CE8\u518C\u5931\u8D25(\u53EF\u80FD\u5185\u6838 ui-skill \u4ECD\u6FC0\u6D3B):", error);
    }
    return () => {
      if (unregister !== void 0) unregister();
      for (const key of [...fetches.keys()]) {
        fetches.get(key)?.abort.abort();
        fetches.delete(key);
      }
      lexiconListeners.clear();
    };
  }, "skill-source: slash source");
}
var BUNDLE_MARK, SKILL_MARK, LOOSE_ID, SNAPSHOT_TTL_MS, fetches, lexiconListeners, rootCtx, presetsCache;
var init_skill_source = __esm({
  "src/client/skill-source/index.ts"() {
    init_SkillRow();
    init_locales();
    init_styles();
    BUNDLE_MARK = "bundle:";
    SKILL_MARK = "skill:";
    LOOSE_ID = "_loose";
    SNAPSHOT_TTL_MS = 30 * 1e3;
    fetches = /* @__PURE__ */ new Map();
    lexiconListeners = /* @__PURE__ */ new Map();
  }
});

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  ACTIVITY_COLUMNS: () => ACTIVITY_COLUMNS,
  activityColor: () => activityColor,
  apply: () => apply3,
  buildActivityGrid: () => buildActivityGrid,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/memory/index.ts
var import_react12 = require("react");
var import_client = require("react-dom/client");

// src/client/memory/Entry.tsx
var import_react10 = require("react");

// src/client/memory/api.ts
var API_BASE = "/api/dsh-memory";
var KIND_VALUES = ["identity", "preference", "fact", "decision", "gotcha", "session-summary"];
function normalizeEntry(entry) {
  return {
    ...entry,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    disabled: entry.disabled === true,
    deprecated: entry.deprecated === true,
    pinned: entry.pinned === true,
    importance: Number.isFinite(entry.importance) ? entry.importance : 0,
    version: Number.isFinite(entry.version) ? entry.version : 1,
    confidence: Number.isFinite(entry.confidence) ? entry.confidence : entry.source === "manual" ? 1 : 0.6,
    verified: entry.verified === true,
    kind: KIND_VALUES.includes(entry.kind) ? entry.kind : "fact",
    lastHitAt: typeof entry.lastHitAt === "string" ? entry.lastHitAt : null
  };
}
function normalizeSummary(summary) {
  const num = (value) => typeof value === "number" && Number.isFinite(value) ? value : 0;
  const opt = (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0;
  return {
    today: typeof summary.today === "string" ? summary.today : "",
    entryCount: num(summary.entryCount),
    projectCount: num(summary.projectCount),
    todayChanges: num(summary.todayChanges),
    changeCount: opt(summary.changeCount),
    pinnedCount: opt(summary.pinnedCount),
    disabledCount: opt(summary.disabledCount),
    // 回收站计数：早先这里漏了透传，host 明明返回了 deprecatedCount，
    // 面板拿到的永远是 undefined → 「回收站」后面光秃秃不显示数字。
    deprecatedCount: opt(summary.deprecatedCount),
    longtermCount: opt(summary.longtermCount),
    globalCount: opt(summary.globalCount),
    revisionCount: opt(summary.revisionCount)
  };
}
function withEntry(response) {
  return { ...response, entry: normalizeEntry(response.entry) };
}
async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`, { headers: { accept: "application/json" } });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? `request failed (${String(response.status)})`);
  return body;
}
async function sendJson(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? `request failed (${String(response.status)})`);
  return body;
}
function createMemoryApi() {
  return {
    list: (params = {}) => {
      const query = new URLSearchParams();
      if (params.scope !== void 0 && params.scope !== "") query.set("scope", params.scope);
      if (params.project !== void 0 && params.project !== "") query.set("project", params.project);
      if (params.q !== void 0 && params.q !== "") query.set("q", params.q);
      if (params.tag !== void 0 && params.tag !== "") query.set("tag", params.tag);
      if (params.includeDeprecated === true) query.set("includeDeprecated", "1");
      const suffix = query.toString() === "" ? "" : `?${query.toString()}`;
      return getJson(`/list${suffix}`).then((response) => ({
        ...response,
        entries: (response.entries ?? []).map(normalizeEntry),
        projects: response.projects ?? []
      }));
    },
    projects: () => getJson("/projects"),
    tags: () => getJson("/tags"),
    changes: (date) => getJson(`/changes${date !== void 0 ? `?date=${encodeURIComponent(date)}` : ""}`),
    summary: () => getJson("/summary").then(normalizeSummary),
    related: (entryId, limit) => getJson(
      `/related?entryId=${encodeURIComponent(entryId)}${limit !== void 0 ? `&limit=${limit}` : ""}`
    ).then((response) => ({ entries: (response.entries ?? []).map(normalizeEntry) })),
    pin: (entryId, pinned) => sendJson("/pin", { entryId, pinned }).then(withEntry),
    enable: (entryId, enabled) => sendJson("/enable", { entryId, enabled }).then(withEntry),
    update: (entryId, patch) => sendJson("/update", { entryId, ...patch }).then(withEntry),
    move: (entryId, target) => sendJson("/move", { entryId, ...target }).then(withEntry),
    deleteEntry: (entryId) => sendJson("/delete", { entryId }),
    deleteBatch: (entryIds) => sendJson("/delete-batch", { entryIds }),
    deleteProject: (projectHash) => sendJson("/delete-project", { projectHash }),
    meta: (projectHash, patch) => sendJson("/meta", { projectHash, ...patch }),
    remember: (input) => sendJson("/remember", input).then(withEntry),
    getInjectState: (sessionId) => getJson(`/inject-state?sessionId=${encodeURIComponent(sessionId)}`),
    setInjectState: (sessionId, enabled) => sendJson("/inject-state", { sessionId, enabled }),
    consolidate: (scope = "all", projectHash) => sendJson("/consolidate", { scope, projectHash }),
    revisions: () => getJson("/revisions"),
    rollback: (revisionId) => sendJson("/rollback", { revisionId }),
    getConfig: () => getJson("/config"),
    setConfig: (patch) => sendJson("/config", patch),
    resetConfig: () => sendJson("/config", { reset: true }),
    listModels: () => getJson("/models"),
    revise: (entryId, input) => sendJson("/revise", { entryId, ...input }).then(withEntry),
    retire: (entryId, reason) => sendJson("/retire", { entryId, reason }).then(withEntry),
    restore: (entryId) => sendJson("/restore", { entryId }).then(withEntry)
  };
}

// src/client/memory/Panel.tsx
var import_react6 = require("react");
var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/memory/markdown.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function renderInline(text, keyPrefix) {
  const nodes = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(~~[^~]+~~)|(\*[^*\n]+\*)|(_[^_\n]+_)|(\[[^\]]*\]\([^)\s]+\))/g;
  let cursor = 0;
  let match;
  let index = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-i${index}`;
    index += 1;
    if (token.startsWith("`")) {
      nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { className: "dsh-triad-md__code", children: token.slice(1, -1) }, key));
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: token.slice(2, -2) }, key));
    } else if (token.startsWith("~~")) {
      nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("del", { children: token.slice(2, -2) }, key));
    } else if (token.startsWith("[")) {
      const split = token.indexOf("](");
      const label = token.slice(1, split);
      const href = token.slice(split + 2, -1);
      nodes.push(
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href, target: "_blank", rel: "noreferrer noopener", className: "dsh-triad-md__link", children: label }, key)
      );
    } else {
      nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: token.slice(1, -1) }, key));
    }
    cursor = match.index + token.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
function renderFence(lines, key) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "dsh-triad-md__pre", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: lines.join("\n") }) }, key);
}
function renderList(lines, ordered, key) {
  const items = lines.map((line, itemIndex) => {
    const body = ordered ? line.replace(/^\s*\d+[.)]\s+/, "") : line.replace(/^\s*[-*+]\s+/, "");
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: renderInline(body, `${key}-l${itemIndex}`) }, `${key}-l${itemIndex}`);
  });
  return ordered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { className: "dsh-triad-md__list", children: items }, key) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "dsh-triad-md__list", children: items }, key);
}
function parse(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (/^\s*```/.test(line)) {
      const start2 = i + 1;
      let end = start2;
      while (end < lines.length && !/^\s*```/.test(lines[end] ?? "")) end += 1;
      out.push(renderFence(lines.slice(start2, end), `b${i}`));
      i = end + 1;
      continue;
    }
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "dsh-triad-md__hr" }, `b${i}`));
      i += 1;
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading !== null) {
      const level = Math.min(6, (heading[1]?.length ?? 1) + 2);
      const body = renderInline(heading[2] ?? "", `b${i}`);
      const Tag = `h${level}`;
      out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "dsh-triad-md__h", children: body }, `b${i}`));
      i += 1;
      continue;
    }
    if (/^\s*>/.test(line)) {
      const start2 = i;
      while (i < lines.length && /^\s*>/.test(lines[i] ?? "")) i += 1;
      const body = lines.slice(start2, i).map((l) => (l ?? "").replace(/^\s*>\s?/, "")).join(" ");
      out.push(
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { className: "dsh-triad-md__quote", children: renderInline(body, `b${start2}`) }, `b${start2}`)
      );
      continue;
    }
    const isBullet = (l) => /^\s*[-*+]\s+/.test(l);
    const isOrdered = (l) => /^\s*\d+[.)]\s+/.test(l);
    if (isBullet(line) || isOrdered(line)) {
      const ordered = isOrdered(line);
      const start2 = i;
      while (i < lines.length && (ordered ? isOrdered(lines[i] ?? "") : isBullet(lines[i] ?? ""))) i += 1;
      out.push(renderList(lines.slice(start2, i), ordered, `b${start2}`));
      continue;
    }
    const start = i;
    while (i < lines.length && (lines[i] ?? "").trim() !== "" && !/^\s*```/.test(lines[i] ?? "") && !/^(#{1,6})\s+/.test(lines[i] ?? "") && !/^\s*>/.test(lines[i] ?? "") && !isBullet(lines[i] ?? "") && !isOrdered(lines[i] ?? "")) i += 1;
    out.push(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-triad-md__p", children: renderInline(lines.slice(start, i).join(" "), `b${start}`) }, `b${start}`)
    );
  }
  return out;
}
var MarkstreamMarkdown = (0, import_react.memo)(function MarkstreamMarkdown2({ text }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-triad-md", children: parse(text ?? "") });
});

// src/client/memory/styles.ts
var css = {
  modalBody: "dsh-memory-modal-body",
  panel: "dsh-memory-panel",
  // ── 左栏 ──
  sidebar: "dsh-memory-sidebar",
  sidebarBrand: "dsh-memory-sidebar-brand",
  sidebarLogo: "dsh-memory-sidebar-logo",
  sidebarTitle: "dsh-memory-sidebar-title",
  sidebarAdd: "dsh-memory-sidebar-add",
  navList: "dsh-memory-nav-list",
  navItem: "dsh-memory-nav-item",
  navItemActive: "dsh-memory-nav-item-active",
  navIcon: "dsh-memory-nav-icon",
  navCount: "dsh-memory-nav-count",
  navCountZero: "dsh-memory-nav-count-zero",
  navCountPop: "dsh-memory-nav-count-pop",
  navChevron: "dsh-memory-nav-chevron",
  navCountInline: "dsh-memory-nav-count-inline",
  navSep: "dsh-memory-nav-sep",
  sectionHeader: "dsh-memory-section-header",
  sectionTitleTxt: "dsh-memory-section-title",
  sectionPlus: "dsh-memory-section-plus",
  projList: "dsh-memory-proj-list",
  projRow: "dsh-memory-proj-row",
  projRowActive: "dsh-memory-proj-row-active",
  catList: "dsh-memory-cat-list",
  catRow: "dsh-memory-cat-row",
  catRowActive: "dsh-memory-cat-row-active",
  catDot: "dsh-memory-cat-dot",
  catMore: "dsh-memory-cat-more",
  sidebarFoot: "dsh-memory-sidebar-foot",
  settingsNav: "dsh-memory-settings-nav",
  settingsNavActive: "dsh-memory-settings-nav-active",
  // ── 顶栏 ──
  topbar: "dsh-memory-topbar",
  topSearch: "dsh-memory-top-search",
  topSearchIcon: "dsh-memory-top-search-icon",
  topInput: "dsh-memory-top-input",
  topKbd: "dsh-memory-top-kbd",
  topStats: "dsh-memory-top-stats",
  topStat: "dsh-memory-top-stat",
  topStatVal: "dsh-memory-top-stat-val",
  topStatSep: "dsh-memory-top-stat-sep",
  topClose: "dsh-memory-top-close",
  // ── 筛选行 ──
  filterRow: "dsh-memory-filter-row",
  filterSelect: "dsh-memory-filter-select",
  filterTools: "dsh-memory-filter-tools",
  toolBtn: "dsh-memory-tool-btn",
  toolBtnIcon: "dsh-memory-tool-btn-icon",
  toolBtnDanger: "dsh-memory-tool-btn-danger",
  projContext: "dsh-memory-proj-context",
  projName: "dsh-memory-proj-name",
  // ── 主区 ──
  mainCol: "dsh-memory-main-col",
  cols: "dsh-memory-cols",
  listCol: "dsh-memory-list-col",
  detailCol: "dsh-memory-detail-col",
  viewFull: "dsh-memory-view-full",
  // ── 中栏列表 ──
  listHead: "dsh-memory-list-head",
  listHeadText: "dsh-memory-list-head-text",
  listSort: "dsh-memory-list-sort",
  groupSection: "dsh-memory-group-section",
  groupSectionCount: "dsh-memory-group-section-count",
  entryCard: "dsh-memory-entry-card",
  entryCardSel: "dsh-memory-entry-card-sel",
  entryTop: "dsh-memory-entry-top",
  entryIcon: "dsh-memory-entry-icon",
  entryTitleTxt: "dsh-memory-entry-title",
  entryChip: "dsh-memory-entry-chip",
  entryCheck: "dsh-memory-entry-check",
  entryCheckOn: "dsh-memory-entry-check-on",
  entrySnippet: "dsh-memory-entry-snippet",
  entryFootRow: "dsh-memory-entry-foot",
  entryTime: "dsh-memory-entry-time",
  entryDot: "dsh-memory-entry-dot",
  entryRow: "dsh-memory-entry-row",
  entryRowSel: "dsh-memory-entry-row-sel",
  entryRowIcon: "dsh-memory-entry-row-icon",
  // ── 右栏详情 ──
  detailHead: "dsh-memory-detail-head",
  detailTitle: "dsh-memory-detail-title",
  detailAnim: "dsh-memory-detail-anim",
  chips: "dsh-memory-chips",
  chipMute: "dsh-memory-chip-mute",
  chipAccent: "dsh-memory-chip-accent",
  chipWarn: "dsh-memory-chip-warn",
  chipOk: "dsh-memory-chip-ok",
  chipTime: "dsh-memory-chip-time",
  importanceRow: "dsh-memory-importance-row",
  importanceIcon: "dsh-memory-importance-icon",
  importanceLabel: "dsh-memory-importance-label",
  importanceBar: "dsh-memory-importance-bar",
  importanceValue: "dsh-memory-importance-value",
  detailBody: "dsh-memory-detail-body",
  detailTags: "dsh-memory-detail-tags",
  detailFoot: "dsh-memory-detail-foot",
  sectionTitle: "dsh-memory-section-title-lg",
  sectionLine: "dsh-memory-section-line",
  relationGrid: "dsh-memory-relation-grid",
  relationCard: "dsh-memory-relation-card",
  relationLabel: "dsh-memory-relation-label",
  relationMain: "dsh-memory-relation-main",
  relationSub: "dsh-memory-relation-sub",
  historyList: "dsh-memory-history-list",
  historyRow: "dsh-memory-history-row",
  historyTime: "dsh-memory-history-time",
  historyDesc: "dsh-memory-history-desc",
  historyLink: "dsh-memory-history-link",
  relatedGrid: "dsh-memory-related-grid",
  relatedCard: "dsh-memory-related-card",
  relatedTitleTxt: "dsh-memory-related-title",
  relatedSub: "dsh-memory-related-sub",
  relatedArrow: "dsh-memory-related-arrow",
  // ── 通用 ──
  searchRow: "dsh-memory-search-row",
  searchBox: "dsh-memory-search-box",
  searchIcon: "dsh-memory-search-icon",
  searchInput: "dsh-memory-search-input",
  searchClear: "dsh-memory-search-clear",
  tagSelect: "dsh-memory-tag-select",
  scopeSelect: "dsh-memory-scope-select",
  barSep: "dsh-memory-bar-sep",
  segment: "dsh-memory-segment",
  segmentItem: "dsh-memory-segment-item",
  segmentItemActive: "dsh-memory-segment-item-active",
  spacer: "dsh-memory-spacer",
  cardList: "dsh-memory-card-list",
  cardContent: "dsh-memory-card-content",
  cardMeta: "dsh-memory-card-meta",
  chip: "dsh-memory-chip",
  chipActive: "dsh-memory-chip-active",
  cardActions: "dsh-memory-card-actions",
  iconAction: "dsh-memory-icon-action",
  iconActionDanger: "dsh-memory-icon-action-danger",
  iconActionBusy: "dsh-memory-icon-action-busy",
  pinMark: "dsh-memory-pin-mark",
  empty: "dsh-memory-empty",
  emptyIcon: "dsh-memory-empty-icon",
  emptyText: "dsh-memory-empty-text",
  emptyHint: "dsh-memory-empty-hint",
  changeRow: "dsh-memory-change-row",
  changeMore: "dsh-memory-change-more",
  changeMain: "dsh-memory-change-main",
  changeBadge: "dsh-memory-change-badge",
  changeBadgeAdd: "dsh-memory-change-badge-add",
  changeBadgeDelete: "dsh-memory-change-badge-delete",
  changeBadgePromote: "dsh-memory-change-badge-promote",
  changeBadgeRevise: "dsh-memory-change-badge-revise",
  changeBadgeRetire: "dsh-memory-change-badge-retire",
  changeOld: "dsh-memory-change-old",
  changeNew: "dsh-memory-change-new",
  changeDiff: "dsh-memory-change-diff",
  changeDiffCol: "dsh-memory-change-diff-col",
  changeDiffDivider: "dsh-memory-change-diff-divider",
  stat: "dsh-memory-stat",
  statValue: "dsh-memory-stat-value",
  statDot: "dsh-memory-stat-dot",
  inlineInput: "dsh-memory-inline-input",
  inlineTextarea: "dsh-memory-inline-textarea",
  editButtons: "dsh-memory-edit-buttons",
  addMeta: "dsh-memory-add-meta",
  check: "dsh-memory-check",
  switch: "dsh-memory-switch",
  switchText: "dsh-memory-switch-text",
  switchLine: "dsh-memory-switch-line",
  batchCount: "dsh-memory-batch-count",
  error: "dsh-memory-error",
  notice: "dsh-memory-notice",
  detailForm: "dsh-memory-detail-form",
  formTitle: "dsh-memory-form-title",
  field: "dsh-memory-field",
  fieldLabel: "dsh-memory-field-label",
  fieldRow: "dsh-memory-field-row",
  revActions: "dsh-memory-rev-actions",
  disabledMark: "dsh-memory-disabled-mark",
  retiredMark: "dsh-memory-retired-mark",
  scopeBadge: "dsh-memory-scope-badge",
  settingsBody: "dsh-memory-settings-body",
  settingsGroup: "dsh-memory-settings-group",
  settingsGroupTitle: "dsh-memory-settings-group-title",
  settingsRow: "dsh-memory-settings-row",
  settingsMain: "dsh-memory-settings-main",
  settingsLabel: "dsh-memory-settings-label",
  settingsHint: "dsh-memory-settings-hint",
  settingsControl: "dsh-memory-settings-control",
  numberInput: "dsh-memory-number-input",
  settingsFoot: "dsh-memory-settings-foot",
  skeleton: "dsh-memory-skeleton",
  skeletonRow: "dsh-memory-skeleton-row",
  toggle: "dsh-memory-toggle",
  toggleOn: "dsh-memory-toggle-on",
  toggleOff: "dsh-memory-toggle-off"
};
var STYLE_ID = "dsh-memory-styles";
var SHEET = `
/* \u2500\u2500 \u4E3B\u9898\u53D8\u91CF\uFF08\u8DDF\u968F DSH \u660E/\u6697\u4E3B\u9898\uFF1Baccent \u6052\u4E3A\u4E3B\u9898\u84DD\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \u6240\u6709 --m-* \u6D3E\u751F\u81EA DSH \u4E3B\u9898 token\uFF08--dsw-alias-*\uFF09\uFF0C\u660E\u6697\u4E3B\u9898\u5207\u6362\u65F6
   \u9762\u677F\u81EA\u52A8\u8DDF\u8FDB\uFF1A\u6D45\u8272=\u767D\u5E95\uFF0C\u9AD8\u4EAE/\u84DD\u5B57\uFF1B\u6DF1\u8272=\u6697\u5E95\uFF0C\u4EAE\u5B57\u3002\u6570\u636E\u8272\u677F\u56FE\u6807
   \uFF08\u5206\u7C7B\u5706\u70B9/\u9879\u76EE\u6587\u4EF6\u5939/kind \u56FE\u6807\u8272\uFF09\u4E0D\u968F\u4E3B\u9898\u53D8\u3002 */
.dsh-memory-panel{
  --dsw-alias-state-business-primary:#4176e6;
  --dsw-alias-state-business-primary-hover:#2e5fc4;
  --m-primary:#4176e6;
  --m-primary-hover:#2e5fc4;
  --m-primary-soft:color-mix(in srgb,var(--m-primary) 14%,transparent);
  --m-primary-chip:color-mix(in srgb,var(--m-primary) 12%,transparent);
  --m-primary-bar:#4176e6;
  --m-accent-line:color-mix(in srgb,var(--m-primary) 55%,transparent);
  --m-card-bg-sel:color-mix(in srgb,var(--m-primary) 7%,var(--dsw-alias-bg-layer-1,#fff));
  --m-card-line:var(--dsw-alias-border-l2,rgba(255,255,255,.12));
  --m-text:var(--dsw-alias-label-primary,#eee);
  --m-text-2:var(--dsw-alias-label-secondary,#bbb);
  --m-text-3:var(--dsw-alias-label-tertiary,#888);
  --m-border:var(--dsw-alias-border-l1,rgba(255,255,255,.08));
  --m-border-2:var(--dsw-alias-border-l2,rgba(255,255,255,.12));
  --m-side:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.04));
  --m-side-line:var(--dsw-alias-border-l1,rgba(255,255,255,.08));
  --m-hover:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06));
  --m-soft:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.04));
  --m-ok:var(--dsw-alias-state-success-primary,#3aa675);
  --m-warn:var(--dsw-alias-state-warn-primary,#e8a33d);
  --m-err:var(--dsw-alias-state-error-primary,#e0434b);
  --m-ok-bg:color-mix(in srgb,var(--dsw-alias-state-success-primary,#3aa675) 12%,transparent);
  --m-warn-bg:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#e8a33d) 12%,transparent);
  --m-err-bg:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e0434b) 12%,transparent);
  --m-info:var(--dsw-alias-state-info-primary,#5b9dff);
  --m-info-bg:color-mix(in srgb,var(--dsw-alias-state-info-primary,#5b9dff) 12%,transparent);
  /* \u8BA1\u6570\u5FBD\u7AE0\u5E95\u8272\uFF08\u4E2D\u6027\u7070\uFF0C\u660E\u6697\u4E3B\u9898\u90FD\u6210\u7ACB\uFF09 */
  --m-count-bg:color-mix(in srgb,var(--m-text-3) 17%,transparent);
  --m-count-bg-hover:color-mix(in srgb,var(--m-text-3) 28%,transparent);
  background:var(--dsw-alias-bg-layer-1,#fff);
  color:var(--m-text);
}

/* \u2500\u2500 \u9762\u677F\u9AA8\u67B6 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-modal-body{overflow:hidden;display:flex;flex-direction:column}
.dsh-memory-panel{flex:1;min-height:0;display:flex;flex-direction:column;gap:0;overflow:hidden;padding:0;box-sizing:border-box}

/* \u2500\u2500 \u9876\u680F\uFF1A\u5BFC\u822A / \u9879\u76EE / \u5206\u7C7B\u6A2A\u6392\uFF08\u53D6\u4EE3\u65E7\u5DE6\u680F\uFF0C\u4E3B\u533A\u7EB5\u5411\u6392\u5E03\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-sidebar{flex:none;width:100%;max-height:132px;box-sizing:border-box;display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px;overflow-y:auto;overflow-x:hidden;padding:10px 14px;background:var(--m-side);border-right:none;border-bottom:1px solid var(--m-side-line)}
.dsh-memory-sidebar-brand{display:none}
.dsh-memory-sidebar-logo{flex:none;width:26px;height:26px;border-radius:8px;background:var(--m-primary);display:inline-flex;align-items:center;justify-content:center;color:#fff}
.dsh-memory-sidebar-title{font-size:16px;font-weight:700;line-height:24px;color:var(--m-text)}
.dsh-memory-sidebar-add{width:auto;height:34px;padding:0 14px;margin-bottom:0;border:none;border-radius:10px;background:var(--m-primary);color:#fff;font-size:13px;font-weight:600;line-height:20px;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;transition:background .16s cubic-bezier(.2,.8,.2,1),box-shadow .16s ease,transform .12s ease}
.dsh-memory-sidebar-add:hover{background:var(--m-primary-hover);box-shadow:0 4px 14px rgba(65,118,230,.28)}
.dsh-memory-sidebar-add:active{transform:scale(.985)}
.dsh-memory-sidebar-add:disabled{opacity:.5;cursor:default}
/* \u4E00\u7EA7\uFF1A\u89C6\u56FE tabs \u6536\u8FDB\u5206\u6BB5\u63A7\u4EF6\u5E95\u5EA7\uFF0C\u8DDF\u4E0B\u9762\u7684\u80F6\u56CA\u62C9\u5F00\u5C42\u7EA7 */
.dsh-memory-nav-list{display:flex;flex-direction:row;flex-wrap:wrap;gap:2px;background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.04));border:1px solid var(--m-border);border-radius:12px;padding:4px}
.dsh-memory-nav-item{display:flex;align-items:center;gap:8px;width:auto;flex:none;box-sizing:border-box;height:30px;border-radius:8px;padding:0 10px;border:none;border-radius:8px;background:transparent;color:var(--m-text-2);font-family:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer;transition:background .15s cubic-bezier(.2,.8,.2,1),color .15s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-nav-item:hover{background:rgba(65,118,230,.06);color:var(--m-text)}
.dsh-memory-nav-item-active,.dsh-memory-nav-item-active:hover{background:var(--m-primary-soft);color:var(--m-primary);font-weight:600}
.dsh-memory-nav-icon{flex:none;display:inline-flex;align-items:center;color:inherit}
/* \u8BA1\u6570\u5FBD\u7AE0\uFF1A\u53D6\u4EE3\u300C\u6807\u7B7E + \u88F8\u6570\u5B57\u300D\uFF08\u65E7\u6837\u5F0F\u5728 4 \u4F4D\u6570\u65F6\u628A\u6574\u6761\u5BFC\u822A\u6491\u5F97\u5F88\u96BE\u770B\uFF09\u3002
   \u5C0F\u80F6\u56CA + \u7D27\u51D1\u8BB0\u6570\uFF084407 \u2192 4.4k\uFF0C\u60AC\u505C\u770B\u7CBE\u786E\u503C\uFF09+ \u9009\u4E2D\u6001\u5B9E\u5FC3 + \u6570\u503C\u53D8\u5316\u5F39\u4E00\u4E0B\u3002 */
.dsh-memory-nav-count{margin-left:auto;flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:18px;box-sizing:border-box;padding:0 6px;border-radius:999px;background:var(--m-count-bg);color:var(--m-text-3);font-size:11px;font-weight:600;line-height:18px;letter-spacing:.2px;font-variant-numeric:tabular-nums;transition:background .18s cubic-bezier(.2,.8,.2,1),color .18s cubic-bezier(.2,.8,.2,1),box-shadow .18s ease}
.dsh-memory-nav-count-zero{min-width:16px;padding:0 4px;background:transparent;color:var(--m-text-3);opacity:.55;font-weight:500}
.dsh-memory-nav-item:hover .dsh-memory-nav-count,.dsh-memory-proj-row:hover .dsh-memory-nav-count,.dsh-memory-cat-row:hover .dsh-memory-nav-count{background:var(--m-count-bg-hover);color:var(--m-text-2)}
.dsh-memory-nav-item-active .dsh-memory-nav-count,.dsh-memory-proj-row-active .dsh-memory-nav-count,.dsh-memory-cat-row-active .dsh-memory-nav-count{background:var(--m-primary);color:#fff;box-shadow:0 2px 8px rgba(65,118,230,.32)}
.dsh-memory-nav-item-active:hover .dsh-memory-nav-count,.dsh-memory-proj-row-active:hover .dsh-memory-nav-count,.dsh-memory-cat-row-active:hover .dsh-memory-nav-count{background:var(--m-primary-hover);color:#fff}
.dsh-memory-nav-count-pop{animation:dsh-memory-count-pop .3s cubic-bezier(.2,.8,.2,1)}
@keyframes dsh-memory-count-pop{0%{transform:scale(.72);opacity:.25}55%{transform:scale(1.14)}100%{transform:scale(1);opacity:1}}
/* \u884C\u5185\u7528\u6CD5\uFF08\u8BE6\u60C5\u533A\u5C0F\u8282\u6807\u9898\uFF09\uFF1A\u4E0D\u9876\u5230\u884C\u5C3E */
.dsh-memory-nav-count-inline{margin-left:0}
/* \u300C\u66F4\u591A\u5206\u7C7B\u300D\u7684\u5C55\u5F00\u7BAD\u5934\u4E0D\u662F\u8BA1\u6570\uFF0C\u522B\u5957\u80F6\u56CA */
.dsh-memory-nav-chevron{margin-left:auto;flex:none;color:var(--m-text-3);font-size:11px;line-height:18px}
@media (prefers-reduced-motion:reduce){.dsh-memory-nav-count-pop{animation:none}}
.dsh-memory-nav-sep{display:none}
.dsh-memory-section-header{display:none}
.dsh-memory-section-title{font-size:13px;font-weight:500;line-height:20px;color:var(--m-text-2)}
.dsh-memory-section-plus{flex:none;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border:none;border-radius:6px;background:transparent;color:var(--m-text-3);cursor:pointer;transition:background .14s ease,color .14s ease}
.dsh-memory-section-plus:hover{background:rgba(65,118,230,.08);color:var(--m-primary)}
/* \u4E8C\u7EA7\u5E03\u5C40\uFF1A\u5BFC\u822A\u884C\u5360\u6EE1\u9996\u884C\uFF0C\u9879\u76EE / \u5206\u7C7B\u5404\u8D77\u65B0\u884C\uFF1B\u80F6\u56CA\u66F4\u5C0F\u66F4\u8F7B */
.dsh-memory-proj-list{display:flex;flex-direction:row;flex-wrap:wrap;gap:6px;flex:1 1 100%;order:2;margin-top:6px}
.dsh-memory-proj-row{display:flex;align-items:center;gap:6px;width:auto;flex:none;box-sizing:border-box;height:28px;font-size:12px;border:1px solid var(--m-border);border-radius:999px;padding:0 10px 0 8px;padding:0 8px 0 6px;border:none;border-radius:7px;background:transparent;color:var(--m-text-2);font-family:inherit;font-size:12.5px;line-height:19px;text-align:left;cursor:pointer;transition:background .15s cubic-bezier(.2,.8,.2,1),color .15s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-proj-row:hover{background:rgba(65,118,230,.06);color:var(--m-text)}
.dsh-memory-proj-row-active,.dsh-memory-proj-row-active:hover{background:var(--m-primary-soft);color:var(--m-primary);font-weight:600}
.dsh-memory-cat-list{display:flex;flex-direction:row;flex-wrap:wrap;gap:4px;flex:1 1 100%;order:2}
.dsh-memory-cat-row{display:flex;align-items:center;gap:6px;width:auto;flex:none;box-sizing:border-box;height:28px;font-size:12px;border:1px solid var(--m-border);border-radius:999px;padding:0 8px 0 8px;border:none;border-radius:6px;background:transparent;color:var(--m-text-2);font-family:inherit;font-size:12.5px;line-height:19px;text-align:left;cursor:pointer;transition:background .15s cubic-bezier(.2,.8,.2,1),color .15s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-cat-row:hover{background:rgba(65,118,230,.06);color:var(--m-text)}
.dsh-memory-cat-row-active,.dsh-memory-cat-row-active:hover{background:var(--m-primary-soft);color:var(--m-primary);font-weight:600}
.dsh-memory-cat-dot{flex:none;width:9px;height:9px;border-radius:50%;background:var(--dot,#5b8def)}
.dsh-memory-cat-more{color:var(--m-text-3)}
.dsh-memory-sidebar-foot{display:flex;margin:0 0 0 auto;padding:0;border:none;order:1}
.dsh-memory-settings-nav{display:flex;align-items:center;gap:8px;width:auto;flex:none;box-sizing:border-box;height:32px;padding:0 10px;border:none;border-radius:8px;background:transparent;color:var(--m-text-2);font-family:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer;transition:background .15s cubic-bezier(.2,.8,.2,1),color .15s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-settings-nav:hover{background:rgba(65,118,230,.06);color:var(--m-text)}
.dsh-memory-settings-nav-active,.dsh-memory-settings-nav-active:hover{background:var(--m-primary-soft);color:var(--m-primary);font-weight:600}

/* \u2500\u2500 \u9876\u680F\uFF1A\u641C\u7D22\u6846 + \u7EDF\u8BA1 + \u5173\u95ED \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-topbar{flex:none;display:flex;align-items:center;gap:14px;height:52px;padding:0 14px;background:var(--dsw-alias-bg-layer-1,#fff);border-bottom:1px solid var(--m-border)}
.dsh-memory-top-search{position:relative;flex:1;min-width:160px;max-width:430px;display:flex;align-items:center}
.dsh-memory-top-search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);display:inline-flex;color:var(--m-text-3);pointer-events:none}
.dsh-memory-top-input{flex:1;min-width:0;height:34px;box-sizing:border-box;border:1px solid transparent;border-radius:10px;padding:0 66px 0 34px;font-size:13px;line-height:20px;font-family:inherit;color:var(--m-text);background:var(--dsw-alias-bg-module-platform,rgba(255,255,255,.04));transition:border-color .16s ease,background .16s ease,box-shadow .16s ease}
.dsh-memory-top-input::placeholder{color:var(--m-text-3)}
.dsh-memory-top-input:focus,.dsh-memory-top-input:focus-visible{outline:none;border-color:var(--m-primary);background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 0 0 3px rgba(65,118,230,.12)}
.dsh-memory-top-kbd{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;padding:1px 6px;border:1px solid var(--dsw-alias-border-l3,rgba(255,255,255,.16));border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--m-text-3);font-size:11px;line-height:16px}
.dsh-memory-top-stats{display:flex;align-items:center;gap:8px;margin-left:auto;font-size:13px;line-height:20px;color:var(--m-text-2);white-space:nowrap}
.dsh-memory-top-stat{display:inline-flex;align-items:center;gap:4px;font-variant-numeric:tabular-nums}
.dsh-memory-top-stat .dsh-memory-top-stat-val{font-weight:600;color:var(--m-text)}
.dsh-memory-top-stat-sep{color:var(--m-text-3);font-size:12px}
.dsh-memory-top-close{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:8px;padding:0;background:transparent;color:var(--m-text-3);cursor:pointer;transition:background .14s ease,color .14s ease}
.dsh-memory-top-close:hover{background:var(--m-hover);color:var(--m-text)}

/* \u2500\u2500 \u7B5B\u9009\u884C \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-filter-row{flex:none;display:flex;align-items:center;gap:8px;height:54px;padding:0 14px;background:var(--dsw-alias-bg-layer-1,#fff);border-bottom:1px solid var(--m-border)}
.dsh-memory-filter-select{height:32px;box-sizing:border-box;border:1px solid var(--m-border-2);border-radius:10px;padding:0 30px 0 12px;font-size:13px;line-height:20px;font-family:inherit;color:var(--m-text);background-color:var(--dsw-alias-bg-layer-1,#fff);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:12px 12px;appearance:none;cursor:pointer;max-width:230px;transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-filter-select:hover{border-color:color-mix(in srgb,var(--m-text-3) 55%,transparent)}
.dsh-memory-filter-select:focus,.dsh-memory-filter-select:focus-visible{outline:none;border-color:var(--m-primary);box-shadow:0 0 0 2px rgba(65,118,230,.12)}
.dsh-memory-filter-tools{display:flex;align-items:center;gap:6px;margin-left:auto}
.dsh-memory-tool-btn{flex:none;display:inline-flex;align-items:center;gap:5px;height:32px;padding:0 12px;box-sizing:border-box;border:1px solid var(--m-border-2);border-radius:9px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--m-text-2);font-size:12.5px;font-weight:500;line-height:19px;font-family:inherit;cursor:pointer;transition:border-color .14s ease,color .14s ease,background .14s ease,transform .12s ease}
.dsh-memory-tool-btn:hover:not(:disabled){border-color:var(--m-primary);color:var(--m-primary);background:var(--m-card-bg-sel)}
.dsh-memory-tool-btn:active:not(:disabled){transform:scale(.97)}
.dsh-memory-tool-btn:disabled{opacity:.45;cursor:default}
.dsh-memory-tool-btn-icon{width:30px;padding:0;justify-content:center}
.dsh-memory-tool-btn-danger:hover:not(:disabled){border-color:var(--m-err);color:var(--m-err);background:var(--m-err-bg)}

/* \u2500\u2500 \u4E3B\u533A\uFF1A\u4E2D\u680F\u5217\u8868 / \u53F3\u680F\u8BE6\u60C5 / \u5168\u5BBD\u89C6\u56FE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-main-col{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column}
.dsh-memory-cols{flex:1;min-height:0;display:flex;align-items:stretch;box-sizing:border-box}
.dsh-memory-list-col{flex:none;width:420px;box-sizing:border-box;display:flex;flex-direction:column;min-height:0;overflow-y:auto;background:var(--dsw-alias-bg-layer-1,#fff);border-right:1px solid var(--m-border)}
.dsh-memory-detail-col{flex:1;min-width:0;overflow-y:auto;background:var(--dsw-alias-bg-layer-1,#fff)}
.dsh-memory-view-full{flex:1;min-height:0;overflow-y:auto;background:var(--dsw-alias-bg-layer-1,#fff);display:flex;flex-direction:column}

/* \u2500\u2500 \u4E2D\u680F\u5217\u8868\u5934\u90E8 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-list-head{flex:none;display:flex;align-items:center;gap:6px;padding:8px 14px 8px 16px;flex-wrap:wrap}
.dsh-memory-list-head-text{font-size:13px;line-height:20px;color:var(--m-text-2);font-variant-numeric:tabular-nums}
.dsh-memory-list-sort{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:8px;background:transparent;color:var(--m-text-3);cursor:pointer;transition:background .14s ease,color .14s ease,transform .14s ease}
.dsh-memory-list-sort:hover{background:var(--m-hover);color:var(--m-text)}
.dsh-memory-list-sort:active{transform:scale(.92)}
.dsh-memory-proj-context{flex:none;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:2px 14px 10px 16px;border-bottom:1px solid var(--m-border)}
.dsh-memory-proj-name{display:inline-flex;align-items:center;gap:5px;max-width:100%;font-size:12.5px;font-weight:600;line-height:19px;color:var(--m-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-memory-group-section{display:flex;align-items:center;gap:6px;padding:10px 16px 4px;font-size:13px;font-weight:600;line-height:20px;color:var(--m-text-2);animation:dsh-memory-section-in .24s cubic-bezier(.2,.8,.2,1) both}
.dsh-memory-group-section-count{font-variant-numeric:tabular-nums;font-weight:400;color:var(--m-text-3)}
@keyframes dsh-memory-section-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

/* \u2500\u2500 \u7F6E\u9876\u5361\uFF08\u5927\u5361\uFF1A\u56FE\u6807 + \u6807\u9898 + \u6458\u8981 + \u65F6\u95F4\u884C\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-entry-card{position:relative;display:flex;flex-direction:column;min-width:0;max-width:calc(100% - 16px);box-sizing:border-box;margin:0 8px 6px;padding:8px 12px 7px;border:1px solid var(--m-card-line);border-radius:10px;background:var(--dsw-alias-bg-layer-1,#fff);cursor:pointer;transition:border-color .15s cubic-bezier(.2,.8,.2,1),background .15s cubic-bezier(.2,.8,.2,1),box-shadow .15s cubic-bezier(.2,.8,.2,1),transform .15s cubic-bezier(.2,.8,.2,1);animation:dsh-memory-entry-in .22s cubic-bezier(.2,.8,.2,1) both}
.dsh-memory-entry-card:hover{border-color:var(--m-accent-line);box-shadow:0 2px 10px rgba(65,118,230,.07)}
.dsh-memory-entry-card-sel,.dsh-memory-entry-card-sel:hover{border-color:var(--m-accent-line);background:var(--m-card-bg-sel);box-shadow:0 2px 12px rgba(65,118,230,.10)}
@keyframes dsh-memory-entry-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
/* \u5361\u7247\u662F align-items:flex-start \u7684\u7EB5\u5411 flex\uFF1A\u4E0D\u7ED9 top \u884C\u663E\u5F0F stretch\uFF0C
   \u957F\u6807\u9898\uFF08white-space:nowrap\uFF09\u4F1A\u628A\u6574\u884C\u6491\u5230\u5361\u7247\u5916\uFF0C\u884C\u5C3E\u7684\u4F5C\u7528\u57DF\u5FBD\u7AE0
   \uFF08\u5168\u5C40 / \u9879\u76EE\u540D\uFF09\u76F4\u63A5\u88AB\u63A8\u51FA\u53EF\u89C6\u533A\u2014\u2014\u770B\u8D77\u6765\u5C31\u662F\u300C\u6807\u9898\u592A\u957F\u5C31\u4E0D\u663E\u793A\u6807\u7B7E\u300D\u3002
   align-self:stretch \u628A\u884C\u9501\u56DE\u5361\u7247\u5BBD\u5EA6\uFF0C\u6807\u9898\u518D\u6309 flex:1 \u7701\u7565\u53F7\u622A\u65AD\u3002 */
.dsh-memory-entry-top{display:flex;align-items:center;gap:7px;min-width:0;align-self:stretch;max-width:100%}
.dsh-memory-entry-icon{flex:none;display:inline-flex;align-items:center;color:var(--m-primary)}
.dsh-memory-entry-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px;font-weight:600;line-height:20px;color:var(--m-text)}
.dsh-memory-entry-chip{flex:none;display:inline-flex;align-items:center;gap:3px;max-width:88px;padding:1px 6px;border-radius:5px;background:var(--m-side);color:var(--m-text-2);font-size:10.5px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-memory-entry-chip svg{flex:none}
.dsh-memory-entry-check{flex:none;display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;box-sizing:border-box;border:1.5px solid var(--dsw-alias-border-l3,rgba(255,255,255,.16));border-radius:50%;background:var(--dsw-alias-bg-layer-1,#fff);color:#fff;transition:border-color .15s ease,background .15s ease,transform .15s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-entry-check-on,.dsh-memory-entry-check-on:hover{border-color:var(--m-primary);background:var(--m-primary)}
.dsh-memory-entry-card-sel .dsh-memory-entry-check{border-color:var(--m-primary);background:var(--m-primary)}
.dsh-memory-entry-snippet{margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12.5px;line-height:18px;color:var(--m-text-2)}
.dsh-memory-entry-foot{display:flex;align-items:center;gap:6px;margin-top:4px;font-size:11.5px;line-height:16px;color:var(--m-text-3)}
.dsh-memory-entry-dot{flex:none;width:6px;height:6px;border-radius:50%;background:var(--m-primary)}
.dsh-memory-entry-time{white-space:nowrap}

/* \u2500\u2500 \u7D27\u51D1\u884C\uFF08\u65F6\u95F4\u5206\u7EC4\u5185\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-entry-row{display:flex;align-items:center;gap:8px;width:auto;min-width:0;max-width:calc(100% - 16px);box-sizing:border-box;margin:0 8px 2px;padding:9px 10px;border:none;border-radius:9px;background:transparent;color:inherit;font-family:inherit;text-align:left;cursor:pointer;transition:background .14s cubic-bezier(.2,.8,.2,1),transform .14s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-entry-row:hover{background:var(--m-hover)}
.dsh-memory-entry-row-sel,.dsh-memory-entry-row-sel:hover{background:var(--m-primary-soft)}
.dsh-memory-entry-row-icon{flex:none;display:inline-flex;align-items:center;color:var(--m-text-3)}
.dsh-memory-entry-row-sel .dsh-memory-entry-row-icon{color:var(--m-primary)}
.dsh-memory-entry-row .dsh-memory-entry-title{font-weight:500}
.dsh-memory-entry-row-sel .dsh-memory-entry-title{color:var(--m-primary);font-weight:600}
.dsh-memory-entry-row .dsh-memory-entry-check{width:18px;height:18px}
.dsh-memory-entry-row-sel .dsh-memory-entry-check{border-color:var(--m-primary);background:var(--m-primary)}
.dsh-memory-entry-row:active{transform:scale(.99)}

/* \u2500\u2500 \u53F3\u680F\u8BE6\u60C5 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-detail-col{padding:18px 22px 22px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}
.dsh-memory-detail-anim{animation:dsh-memory-detail-in .18s cubic-bezier(.2,.8,.2,1) both;display:flex;flex-direction:column;gap:14px;min-width:0}
@keyframes dsh-memory-detail-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.dsh-memory-detail-head{display:flex;align-items:flex-start;gap:8px}
.dsh-memory-detail-title{flex:1;min-width:0;margin:0;font-size:18px;line-height:27px;font-weight:700;color:var(--m-text);word-break:break-word}
.dsh-memory-chips{display:flex;align-items:center;gap:5px;flex-wrap:wrap;font-size:12px;line-height:18px}
.dsh-memory-chip-mute{display:inline-flex;align-items:center;gap:4px;max-width:200px;padding:1px 7px;border-radius:6px;background:var(--m-side);color:var(--m-text-2);font-size:11px;line-height:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-memory-chip-accent{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:6px;background:var(--m-primary-chip);color:var(--m-primary);font-size:11px;line-height:17px;white-space:nowrap}
.dsh-memory-chip-warn{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:6px;background:var(--m-warn-bg);color:var(--m-warn);font-size:11px;line-height:17px;white-space:nowrap}
.dsh-memory-chip-ok{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:6px;background:var(--m-ok-bg);color:var(--m-ok);font-size:11px;line-height:17px;white-space:nowrap}
.dsh-memory-chip-time{margin-left:auto;font-size:12px;line-height:18px;color:var(--m-text-3);white-space:nowrap}
.dsh-memory-importance-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:11px 14px;border-radius:10px;background:var(--m-soft)}
.dsh-memory-importance-icon{flex:none;display:inline-flex;align-items:center;color:var(--m-primary)}
.dsh-memory-importance-label{font-size:13px;line-height:20px;color:var(--m-text-2)}
.dsh-memory-importance-bar{position:relative;flex:none;width:96px;height:6px;border-radius:3px;background:color-mix(in srgb,var(--m-primary) 16%,transparent);overflow:hidden}
.dsh-memory-importance-bar i{position:absolute;top:0;bottom:0;left:0;display:block;border-radius:3px;background:var(--m-primary-bar);transition:width .3s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-importance-value{font-variant-numeric:tabular-nums;font-size:13px;line-height:20px;font-weight:600;color:var(--m-text)}
.dsh-memory-importance-row .dsh-memory-top-stat-sep{margin:0 2px}
.dsh-memory-detail-body{min-width:0;font-size:14px;line-height:23px;color:var(--m-text);word-break:break-word}
.dsh-memory-detail-tags{display:flex;flex-wrap:wrap;gap:5px;padding-top:12px;border-top:1px solid var(--m-border)}
.dsh-memory-detail-foot{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--m-border);font-size:11.5px;line-height:17px;color:var(--m-text-3)}
/* \u8BE6\u60C5\u533A\u5C0F\u8282\u6807\u9898\uFF08\u5173\u8054\u4FE1\u606F / \u5386\u53F2\u8BB0\u5F55 / \u76F8\u5173\u8BB0\u5FC6\uFF09\u3002\u65E7\u5B9E\u73B0\u7684\u89C4\u5219\u5199\u5728\u4E86
   .dsh-memory-section-title \u4E0A\uFF0C\u800C\u9762\u677F\u7528\u7684\u662F -lg \u540E\u7F00\uFF0C\u7B49\u4E8E\u6CA1\u6837\u5F0F\u3002 */
.dsh-memory-section-title-lg{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;line-height:22px;color:var(--m-text);margin-top:12px}
.dsh-memory-section-title{font-size:15px;font-weight:600;line-height:22px;color:var(--m-text);margin-top:12px}
.dsh-memory-section-line{flex:none;width:28px;height:3px;border-radius:2px;background:#4176e6;margin:6px 0 8px}
.dsh-memory-stat{display:inline-flex;align-items:center;gap:4px;font-size:12.5px;line-height:19px;color:var(--m-text-2);white-space:nowrap}
.dsh-memory-stat-value{font-variant-numeric:tabular-nums;font-weight:600;color:var(--m-text)}
.dsh-memory-stat-dot{flex:none;width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-border-l3,rgba(255,255,255,.16))}
.dsh-memory-relation-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.dsh-memory-relation-card{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border:1px solid var(--m-card-line);border-radius:10px;box-sizing:border-box;background:var(--dsw-alias-bg-layer-1,#fff);transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-relation-card:hover{border-color:var(--m-accent-line);box-shadow:0 2px 8px rgba(65,118,230,.06)}
.dsh-memory-relation-label{font-size:12px;line-height:18px;color:var(--m-text-3)}
.dsh-memory-relation-main{display:flex;align-items:center;gap:6px;min-width:0;font-size:14px;font-weight:600;line-height:21px;color:var(--m-text)}
.dsh-memory-relation-sub{font-size:12.5px;line-height:19px;color:var(--m-text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-memory-history-list{display:flex;flex-direction:column;gap:7px}
.dsh-memory-history-row{display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:baseline}
.dsh-memory-history-time{font-size:12.5px;line-height:19px;color:var(--m-text-3);white-space:nowrap}
.dsh-memory-history-desc{min-width:0;font-size:13px;line-height:20px;color:var(--m-text-2);word-break:break-word}
.dsh-memory-history-link{display:inline-flex;align-items:center;gap:4px;margin-top:6px;padding:0;border:none;background:transparent;font-family:inherit;font-size:13px;line-height:20px;color:var(--m-primary);cursor:pointer;transition:color .13s ease}
.dsh-memory-history-link:hover{color:var(--m-primary-hover);text-decoration:underline}
.dsh-memory-change-more{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin:10px 0 2px;padding:9px 12px;box-sizing:border-box;border:1px solid var(--m-border);border-radius:10px;background:var(--m-side);color:var(--m-text-2);font-family:inherit;font-size:12.5px;line-height:18px;cursor:pointer;transition:border-color .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease}
.dsh-memory-change-more:hover{border-color:color-mix(in srgb,var(--m-primary) 55%,transparent);color:var(--m-primary);box-shadow:0 0 0 3px var(--m-primary-soft);transform:translateY(-1px)}
.dsh-memory-change-more:active{transform:translateY(0)}
.dsh-memory-change-more[disabled]{opacity:.55;cursor:default;transform:none;box-shadow:none}
.dsh-memory-related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.dsh-memory-related-card{position:relative;display:flex;flex-direction:column;gap:4px;padding:10px 12px;border:1px solid var(--m-card-line);border-radius:10px;box-sizing:border-box;background:var(--dsw-alias-bg-layer-1,#fff);cursor:pointer;text-align:left;font-family:inherit;transition:border-color .15s ease,box-shadow .15s ease,transform .15s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-related-card:hover{border-color:var(--m-accent-line);box-shadow:0 2px 8px rgba(65,118,230,.08);transform:translateY(-1px)}
.dsh-memory-related-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:600;line-height:20px;color:var(--m-text)}
.dsh-memory-related-sub{display:flex;align-items:center;gap:4px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;line-height:17px;color:var(--m-text-3)}
.dsh-memory-related-arrow{position:absolute;top:8px;right:9px;color:var(--m-text-3);opacity:0;transition:opacity .14s ease,color .14s ease}
.dsh-memory-related-card:hover .dsh-memory-related-arrow{opacity:.9;color:var(--m-primary)}

/* \u2500\u2500 \u901A\u7528 chip\uFF08\u8BE6\u60C5\u6807\u7B7E\u7B5B\u9009\u884C\u6CBF\u7528\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-chip{flex:none;display:inline-flex;align-items:center;padding:1px 7px;font-size:11px;line-height:16px;color:var(--m-text-2);border:1px solid var(--m-border-2);border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);cursor:pointer;font-family:inherit;transition:color .14s ease,border-color .14s ease,background .14s ease}
.dsh-memory-chip:hover{color:var(--m-primary);border-color:var(--m-primary)}
.dsh-memory-chip-active,.dsh-memory-chip-active:hover{color:var(--m-primary);border-color:var(--m-primary);background:var(--m-primary-chip)}

/* \u2500\u2500 \u56FE\u6807\u94AE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-card-actions{flex:none;display:flex;align-items:center;gap:2px;margin-left:auto}
.dsh-memory-icon-action{flex:none;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;border-radius:8px;padding:0;background:transparent;cursor:pointer;color:var(--m-text-2);box-sizing:border-box;transition:background .14s ease,color .14s ease,transform .12s ease}
.dsh-memory-icon-action:hover:not(:disabled){background:var(--m-hover);color:var(--m-text)}
.dsh-memory-icon-action:active:not(:disabled){transform:scale(.93)}
.dsh-memory-icon-action:disabled{opacity:.4;cursor:default}
.dsh-memory-icon-action-danger:hover:not(:disabled){background:var(--m-err-bg);color:var(--m-err)}
.dsh-memory-icon-action-busy svg{animation:dsh-memory-spin 900ms linear infinite}
@keyframes dsh-memory-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.dsh-memory-pin-mark{flex:none;display:inline-flex;align-items:center;color:var(--m-warn)}

/* \u2500\u2500 \u7A7A\u6001 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-empty{flex:1;min-height:120px;margin:16px;padding:24px 16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font-size:13px;line-height:20px;color:var(--m-text-3);text-align:center;border:1px dashed var(--m-border-2);border-radius:12px;box-sizing:border-box}
.dsh-memory-empty-icon{display:inline-flex;color:var(--m-text-3);opacity:.75}
.dsh-memory-empty-text{color:var(--m-text-2)}
.dsh-memory-empty-hint{font-size:12px;line-height:18px;color:var(--m-text-3);max-width:420px}

/* \u2500\u2500 \u53D8\u66F4 / \u4FEE\u8BA2\uFF08\u5168\u5BBD\u5217\u8868\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-card-list{flex:1;min-height:0;list-style:none;margin:0;padding:16px;display:flex;flex-direction:column;gap:8px;overflow-y:auto}
.dsh-memory-change-row{display:flex;align-items:flex-start;gap:10px;border:1px solid var(--m-border-2);border-radius:12px;padding:12px 14px;background:var(--dsw-alias-bg-layer-1,#fff);transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-change-row:hover{border-color:var(--m-accent-line)}
.dsh-memory-change-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.dsh-memory-change-badge{flex:none;margin-top:2px;padding:1px 7px;border:1px solid var(--m-border-2);border-radius:6px;font-size:11px;line-height:16px;color:var(--m-text-2);white-space:nowrap}
.dsh-memory-change-badge-add{border-color:var(--m-ok);color:var(--m-ok);background:var(--m-ok-bg)}
.dsh-memory-change-badge-promote{border-color:var(--m-warn);color:var(--m-warn);background:var(--m-warn-bg)}
.dsh-memory-change-badge-delete{border-color:var(--m-err);color:var(--m-err);background:var(--m-err-bg)}
.dsh-memory-change-badge-revise{border-color:var(--m-info);color:var(--m-info);background:var(--m-info-bg)}
.dsh-memory-change-badge-retire{border-color:var(--m-warn);color:var(--m-warn);background:var(--m-warn-bg)}
.dsh-memory-change-old{color:var(--m-text-3);text-decoration:line-through;opacity:.8}
.dsh-memory-change-new{color:var(--m-text)}
.dsh-memory-change-diff{flex:1;min-width:0;display:flex;align-items:stretch;gap:10px}
.dsh-memory-change-diff-col{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.dsh-memory-change-diff-divider{flex:none;width:1px;background:var(--m-border-2)}
.dsh-memory-card-content{min-width:0;font-size:13px;line-height:20px;color:var(--m-text);white-space:pre-wrap;word-break:break-word}
.dsh-memory-card-meta{display:flex;align-items:center;gap:6px;font-size:11px;line-height:16px;color:var(--m-text-3);flex-wrap:wrap}

/* \u2500\u2500 \u5DE5\u5177\u680F\uFF08\u53D8\u66F4\u89C6\u56FE\u6BB5\u63A7\u884C\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-search-row{flex:none;display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--m-border);background:var(--dsw-alias-bg-layer-1,#fff)}
.dsh-memory-search-box{position:relative;flex:1;min-width:160px;max-width:430px;display:flex;align-items:center}
.dsh-memory-search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);display:inline-flex;color:var(--m-text-3);pointer-events:none}
.dsh-memory-search-input{flex:1;min-width:0;height:32px;box-sizing:border-box;border:1px solid var(--m-border-2);border-radius:9px;padding:0 30px 0 32px;font-size:13px;line-height:20px;font-family:inherit;color:var(--m-text);background:var(--dsw-alias-bg-layer-1,#fff);transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-search-input::placeholder{color:var(--m-text-3)}
.dsh-memory-search-input:focus,.dsh-memory-search-input:focus-visible{outline:none;border-color:var(--m-primary);box-shadow:0 0 0 2px rgba(65,118,230,.12)}
.dsh-memory-search-clear{position:absolute;right:6px;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border:none;border-radius:5px;padding:0;background:transparent;color:var(--m-text-3);cursor:pointer;transition:background .13s ease,color .13s ease}
.dsh-memory-search-clear:hover{background:var(--m-hover);color:var(--m-text)}
.dsh-memory-tag-select{height:32px;box-sizing:border-box;border:1px solid var(--m-border-2);border-radius:9px;padding:0 30px 0 11px;font-size:13px;line-height:20px;font-family:inherit;color:var(--m-text);background-color:var(--dsw-alias-bg-layer-1,#fff);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:12px 12px;appearance:none;max-width:240px;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-tag-select:hover{border-color:color-mix(in srgb,var(--m-text-3) 55%,transparent)}
.dsh-memory-tag-select:focus,.dsh-memory-tag-select:focus-visible{outline:none;border-color:var(--m-primary);box-shadow:0 0 0 2px rgba(65,118,230,.12)}
.dsh-memory-scope-select{flex:none;max-width:190px}
.dsh-memory-bar-sep{flex:none;width:1px;height:20px;background:var(--m-border-2)}
.dsh-memory-segment{flex:none;display:inline-flex;align-items:center;gap:2px;padding:2px;height:32px;box-sizing:border-box;border-radius:9px;background:var(--m-side)}
.dsh-memory-segment-item{appearance:none;border:none;background:transparent;border-radius:7px;height:28px;padding:0 14px;font-size:12.5px;line-height:19px;font-family:inherit;color:var(--m-text-2);cursor:pointer;transition:background .15s ease,color .15s ease}
.dsh-memory-segment-item:hover{color:var(--m-text)}
.dsh-memory-segment-item-active,.dsh-memory-segment-item-active:hover{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--m-primary);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.dsh-memory-spacer{flex:1 1 auto;min-width:0}
.dsh-memory-batch-count{font-size:12.5px;line-height:19px;color:var(--m-text);font-variant-numeric:tabular-nums}

/* \u2500\u2500 \u8868\u5355\u4EF6\uFF08\u6DFB\u52A0 / \u7F16\u8F91 / \u79FB\u52A8\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-detail-form{display:flex;flex-direction:column;gap:14px;border-radius:12px;background:var(--m-side);padding:16px;box-sizing:border-box}
.dsh-memory-form-title{font-size:14px;line-height:22px;font-weight:600;color:var(--m-text)}
.dsh-memory-field{display:flex;flex-direction:column;gap:6px;min-width:0}
.dsh-memory-field-label{display:inline-flex;align-items:center;gap:8px;font-size:12px;line-height:18px;font-weight:500;color:var(--m-text-2)}
.dsh-memory-field-row{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}
.dsh-memory-detail-form textarea,.dsh-memory-detail-form .dsh-memory-inline-input{box-sizing:border-box}
.dsh-memory-inline-input{height:32px;box-sizing:border-box;border:1px solid var(--m-border-2);border-radius:9px;padding:0 10px;font-size:13px;line-height:20px;font-family:inherit;color:var(--m-text);background:var(--dsw-alias-bg-layer-1,#fff);transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-inline-input::placeholder{color:var(--m-text-3)}
.dsh-memory-inline-input:focus,.dsh-memory-inline-input:focus-visible{outline:none;border-color:var(--m-primary);box-shadow:0 0 0 2px rgba(65,118,230,.12)}
.dsh-memory-inline-textarea{min-height:64px;box-sizing:border-box;border:1px solid var(--m-border-2);border-radius:9px;padding:8px 10px;font-size:13px;line-height:20px;color:var(--m-text);background:var(--dsw-alias-bg-layer-1,#fff);resize:vertical;font-family:inherit;width:100%;transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-inline-textarea::placeholder{color:var(--m-text-3)}
.dsh-memory-inline-textarea:focus,.dsh-memory-inline-textarea:focus-visible{outline:none;border-color:var(--m-primary);box-shadow:0 0 0 2px rgba(65,118,230,.12)}
.dsh-memory-add-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dsh-memory-check{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;line-height:19px;color:var(--m-text-2);cursor:pointer}
.dsh-memory-check input{accent-color:var(--m-primary);margin:0}
.dsh-memory-edit-buttons{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.dsh-memory-switch-line{display:inline-flex;align-items:center;gap:8px}
.dsh-memory-switch{position:relative;flex:none;width:40px;height:22px;border:none;border-radius:11px;padding:0;background:var(--dsw-alias-border-l2,rgba(255,255,255,.14));cursor:pointer;transition:background .16s cubic-bezier(.2,.8,.2,1);box-sizing:border-box}
.dsh-memory-switch::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-tertiary,#81858c);box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .16s cubic-bezier(.2,.8,.2,1),background .16s cubic-bezier(.2,.8,.2,1)}
.dsh-memory-switch[aria-checked='true']{background:var(--m-primary)}
.dsh-memory-switch[aria-checked='true']::after{transform:translateX(18px);background:#fff}
.dsh-memory-switch:disabled{opacity:.5;cursor:default}
.dsh-memory-switch-text{font-size:12.5px;line-height:19px;color:var(--m-text-2)}

/* \u2500\u2500 \u901A\u77E5 / \u9519\u8BEF \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-error{flex:none;margin:12px 16px 0;padding:8px 12px;border-radius:9px;border:1px solid var(--m-err);background:var(--m-err-bg);font-size:12.5px;line-height:19px;color:var(--m-err)}
.dsh-memory-notice{flex:none;margin:12px 16px 0;padding:8px 12px;border-radius:9px;border:1px solid var(--m-ok);background:var(--m-ok-bg);font-size:12.5px;line-height:19px;color:var(--m-ok)}

/* \u2500\u2500 \u4FEE\u8BA2 / \u8BBE\u7F6E \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-rev-actions{display:flex;align-items:center;gap:8px}
.dsh-memory-settings-body{flex:1;min-height:0;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:20px}
.dsh-memory-settings-group{display:flex;flex-direction:column;gap:2px}
.dsh-memory-settings-group-title{padding:0 2px 6px;font-size:14px;font-weight:600;line-height:22px;color:var(--m-text)}
.dsh-memory-settings-row{display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--m-border-2);border-radius:12px;box-sizing:border-box;background:var(--dsw-alias-bg-layer-1,#fff);transition:border-color .15s ease}
.dsh-memory-settings-row:hover{border-color:var(--m-accent-line)}
.dsh-memory-settings-row+.dsh-memory-settings-row{margin-top:6px}
.dsh-memory-settings-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.dsh-memory-settings-label{font-size:13.5px;line-height:21px;font-weight:500;color:var(--m-text)}
.dsh-memory-settings-hint{font-size:12px;line-height:18px;color:var(--m-text-3)}
.dsh-memory-settings-control{flex:none;display:flex;align-items:center;gap:8px}
.dsh-memory-number-input{width:96px;height:32px;box-sizing:border-box;border:1px solid var(--m-border-2);border-radius:9px;padding:0 10px;font-size:13px;line-height:20px;font-family:inherit;font-variant-numeric:tabular-nums;color:var(--m-text);background:var(--dsw-alias-bg-layer-1,#fff);transition:border-color .15s ease,box-shadow .15s ease}
.dsh-memory-number-input:focus,.dsh-memory-number-input:focus-visible{outline:none;border-color:var(--m-primary);box-shadow:0 0 0 2px rgba(65,118,230,.12)}
.dsh-memory-settings-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:4px}

/* \u2500\u2500 \u9AA8\u67B6\u5C4F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-skeleton{flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;padding:16px}
.dsh-memory-skeleton-row{height:48px;border-radius:10px;background:var(--m-side);animation:dsh-memory-pulse 1.4s ease-in-out infinite}
.dsh-memory-skeleton-row:nth-child(2){animation-delay:.12s}
.dsh-memory-skeleton-row:nth-child(3){animation-delay:.24s}
.dsh-memory-skeleton-row:nth-child(4){animation-delay:.36s}
@keyframes dsh-memory-pulse{0%,100%{opacity:.45}50%{opacity:.9}}

/* \u2500\u2500 \u5FBD\u6807\uFF08\u7981\u7528 / \u5E9F\u5F03 / \u4F5C\u7528\u57DF\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-disabled-mark{flex:none;margin-left:2px;padding:0 5px;border:1px solid var(--m-border-2);border-radius:4px;font-size:10px;line-height:14px;color:var(--m-text-3);white-space:nowrap}
.dsh-memory-retired-mark{flex:none;margin-left:2px;padding:0 5px;border:1px solid var(--m-warn);border-radius:4px;font-size:10px;line-height:14px;color:var(--m-warn);background:var(--m-warn-bg);white-space:nowrap}
.dsh-memory-scope-badge{flex:none;display:inline-flex;align-items:center;gap:3px;max-width:88px;padding:1px 6px;border:1px solid var(--m-border-2);border-radius:5px;font-size:10.5px;line-height:15px;color:var(--m-text-2);background:var(--m-side);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-memory-scope-badge svg{flex:none}

/* \u2500\u2500 \u6CE8\u5165\u5F00\u5173\uFF08composer \u5DE5\u5177\u884C\uFF09\uFF1AiconButton \u89C4\u683C \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-toggle{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:6px;padding:0;background:transparent;cursor:pointer;color:var(--dsw-alias-label-tertiary,#9ca3af);box-sizing:border-box}
.dsh-memory-toggle:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(65,118,230,.07))}
.dsh-memory-toggle-on,.dsh-memory-toggle-on:hover{color:var(--dsw-alias-state-business-primary,#4176e6)}
.dsh-memory-toggle-off{color:var(--dsw-alias-label-tertiary,#9ca3af);opacity:.55}

/* \u2500\u2500 focus \u89C4\u8303 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.dsh-memory-nav-item:focus-visible,.dsh-memory-proj-row:focus-visible,.dsh-memory-cat-row:focus-visible,
.dsh-memory-settings-nav:focus-visible,.dsh-memory-section-plus:focus-visible,.dsh-memory-top-close:focus-visible,
.dsh-memory-list-sort:focus-visible,.dsh-memory-tool-btn:focus-visible,.dsh-memory-icon-action:focus-visible,
.dsh-memory-entry-card:focus-visible,.dsh-memory-entry-row:focus-visible,.dsh-memory-chip:focus-visible,
.dsh-memory-search-clear:focus-visible,.dsh-memory-related-card:focus-visible,.dsh-memory-history-link:focus-visible,.dsh-memory-change-more:focus-visible,
.dsh-memory-switch:focus-visible,.dsh-memory-toggle:focus-visible{outline:none;box-shadow:0 0 0 2px rgba(65,118,230,.35)}

/* \u2500\u2500 \u7A84\u5C4F\u9002\u914D \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (max-width: 1100px) {
  .dsh-memory-list-col{width:340px}
  .dsh-memory-related-grid{grid-template-columns:1fr}
}
@media (max-width: 900px) {
  .dsh-memory-top-stats .dsh-memory-top-stat-long{display:none}
}
@media (max-width: 767.98px) {
  .dsh-memory-panel{flex-direction:column}
  .dsh-memory-sidebar{width:100%;flex-direction:row;flex-wrap:wrap;gap:6px;padding:10px 12px;border-right:none;border-bottom:1px solid var(--m-side-line)}
  .dsh-memory-sidebar-brand{display:none}
  .dsh-memory-sidebar-add{width:auto;padding:0 14px;margin-bottom:0;height:34px}
  .dsh-memory-nav-list,.dsh-memory-proj-list,.dsh-memory-cat-list{flex-direction:row;flex-wrap:wrap;gap:4px}
  .dsh-memory-nav-item,.dsh-memory-proj-row,.dsh-memory-cat-row{width:auto;height:32px}
  .dsh-memory-nav-sep,.dsh-memory-section-header{display:none}
  .dsh-memory-cols{flex-direction:column}
  .dsh-memory-list-col{width:100%;max-height:42%;border-right:none;border-bottom:1px solid var(--m-border)}
  .dsh-memory-detail-col{padding:14px 14px 18px}
  .dsh-memory-related-grid{grid-template-columns:1fr}
  .dsh-memory-relation-grid{grid-template-columns:1fr}
}
@media (prefers-reduced-motion: reduce) {
  .dsh-memory-entry-card,.dsh-memory-entry-row,.dsh-memory-related-card,
  .dsh-memory-history-link,.dsh-memory-tool-btn,.dsh-memory-top-input,.dsh-memory-change-more{transition:none}
  .dsh-memory-entry-card,.dsh-memory-entry-row,.dsh-memory-group-section,.dsh-memory-detail-anim{animation:none}
  .dsh-memory-skeleton-row,.dsh-memory-icon-action-busy svg{animation:none}
  .dsh-memory-importance-bar i{transition:none}
}

/* \u2500\u2500 \u8BB0\u5FC6\u6B63\u6587\u7684\u8F7B\u91CF Markdown\uFF08\u66FF\u4EE3 webui \u5168\u91CF\u6E32\u67D3\u5668\uFF0C\u89C1 markdown.tsx\uFF09 \u2500\u2500 */
.dsh-triad-md{font-size:14px;line-height:1.7;color:var(--m-text);word-break:break-word}
.dsh-triad-md>*:first-child{margin-top:0}
.dsh-triad-md>*:last-child{margin-bottom:0}
.dsh-triad-md__p{margin:0 0 8px}
.dsh-triad-md__h{margin:16px 0 8px;font-weight:600;line-height:1.4}
.dsh-triad-md__h:first-child{margin-top:0}
.dsh-triad-md__list{margin:0 0 8px;padding-left:20px}
.dsh-triad-md__list li{margin:2px 0}
.dsh-triad-md__quote{margin:0 0 8px;padding:2px 0 2px 10px;border-left:2px solid var(--m-border-2);color:var(--m-text-2)}
.dsh-triad-md__code{padding:1px 5px;border-radius:4px;background:var(--m-side);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em}
.dsh-triad-md__pre{margin:0 0 8px;padding:10px 12px;border-radius:8px;overflow-x:auto;background:var(--m-side);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.6;white-space:pre}
.dsh-triad-md__pre code{background:none;padding:0}
.dsh-triad-md__hr{margin:12px 0;border:0;border-top:1px solid var(--m-border-2)}
.dsh-triad-md__link{color:var(--m-primary);text-decoration:none}
.dsh-triad-md__link:hover{text-decoration:underline}
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.dataset.plugin = "dsh-triad";
  tag.textContent = SHEET;
  document.head.appendChild(tag);
}

// src/client/memory/SettingsTab.tsx
var import_react2 = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime2 = require("react/jsx-runtime");
var BOUNDS = {
  extractEveryTurns: { min: 1, max: 100, step: 1 },
  compileEveryTurns: { min: 1, max: 500, step: 1 },
  compileThreshold: { min: 0, max: 20, step: 0.5 },
  decayLambda: { min: 0, max: 0.5, step: 0.01 },
  hitBonus: { min: 0, max: 10, step: 0.5 },
  injectTokenBudget: { min: 1e3, max: 6e4, step: 500 },
  extractMaxChars: { min: 500, max: 6e4, step: 500 },
  minImportance: { min: 1, max: 10, step: 0.5 },
  consolidateMaxEntries: { min: 10, max: 2e3, step: 10 },
  consolidateTimeoutMs: { min: 5e3, max: 6e5, step: 5e3 },
  injectTopK: { min: 1, max: 50, step: 1 },
  entryLimit: { min: 50, max: 1e5, step: 50 },
  pruneNeverHitDays: { min: 0, max: 3650, step: 1 }
};
function Row({ label, hint, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: css.settingsRow, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: css.settingsMain, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: css.settingsLabel, children: label }),
      hint !== void 0 && hint !== "" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: css.settingsHint, children: hint })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: css.settingsControl, children })
  ] });
}
function TextRow({ label, hint, value, placeholder, disabled, type = "text", onCommit }) {
  const [draft, setDraft] = (0, import_react2.useState)(value ?? "");
  (0, import_react2.useEffect)(() => {
    setDraft(value ?? "");
  }, [value]);
  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed !== (value ?? "")) onCommit(trimmed);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Row, { label, hint, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "input",
    {
      type,
      className: css.inlineInput,
      style: { width: 200 },
      "aria-label": label,
      placeholder,
      value: draft,
      disabled,
      onChange: (event) => {
        setDraft(event.currentTarget.value);
      },
      onBlur: commit,
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }
      }
    }
  ) });
}
function SwitchRow({ label, hint, value, disabled, onChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Row, { label, hint, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": value,
      "aria-label": label,
      disabled,
      className: css.switch,
      onClick: () => {
        onChange(!value);
      }
    }
  ) });
}
function NumberRow({ label, hint, field, value, t, onCommit }) {
  const bounds = BOUNDS[field];
  const [draft, setDraft] = (0, import_react2.useState)(value === void 0 ? "" : String(value));
  (0, import_react2.useEffect)(() => {
    setDraft(value === void 0 ? "" : String(value));
  }, [value]);
  const commit = () => {
    const parsed = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(parsed)) {
      setDraft(value === void 0 ? "" : String(value));
      return;
    }
    const clamped = Math.min(bounds.max, Math.max(bounds.min, parsed));
    setDraft(String(clamped));
    if (clamped !== value) onCommit(clamped);
  };
  const rangeHint = t("rangeHint", { min: bounds.min, max: bounds.max });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Row, { label, hint: hint !== void 0 && hint !== "" ? `${hint} ${rangeHint}` : rangeHint, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "input",
    {
      type: "number",
      className: css.numberInput,
      "aria-label": label,
      min: bounds.min,
      max: bounds.max,
      step: bounds.step,
      value: draft,
      onChange: (event) => {
        setDraft(event.currentTarget.value);
      },
      onBlur: commit,
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }
      }
    }
  ) });
}
function SettingsTab({ config, busy = false, t, onPatch, onReset, listModels }) {
  const [catalog, setCatalog] = (0, import_react2.useState)([]);
  (0, import_react2.useEffect)(() => {
    let alive = true;
    void listModels().then((models) => {
      if (alive) setCatalog(Array.isArray(models) ? models : []);
    }).catch(() => {
      if (alive) setCatalog([]);
    });
    return () => {
      alive = false;
    };
  }, [listModels]);
  if (config === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: css.skeleton, "aria-busy": "true", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: css.skeletonRow }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: css.skeletonRow }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: css.skeletonRow }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: css.skeletonRow })
    ] });
  }
  const num = (field) => config[field];
  const bool = (field) => config[field] === true;
  const str = (field) => config[field];
  const setNum = (field) => (next) => {
    onPatch({ [field]: next });
  };
  const setBool = (field) => (next) => {
    onPatch({ [field]: next });
  };
  const setStr = (field) => (next) => {
    onPatch({ [field]: next });
  };
  const embeddingOn = config.embeddingProvider !== void 0 && config.embeddingProvider !== "off";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: css.settingsBody, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: css.settingsGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: css.settingsGroupTitle, children: t("settingsGroupInject") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgInjectTopK"), hint: t("cfgInjectTopKHint"), field: "injectTopK", value: num("injectTopK"), t, onCommit: setNum("injectTopK") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgInjectTokenBudget"), field: "injectTokenBudget", value: num("injectTokenBudget"), t, onCommit: setNum("injectTokenBudget") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: css.settingsGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: css.settingsGroupTitle, children: t("settingsGroupExtract") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgExtractEveryTurns"), hint: t("cfgExtractEveryTurnsHint"), field: "extractEveryTurns", value: num("extractEveryTurns"), t, onCommit: setNum("extractEveryTurns") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgMinImportance"), hint: t("cfgMinImportanceHint"), field: "minImportance", value: num("minImportance"), t, onCommit: setNum("minImportance") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgExtractMaxChars"), field: "extractMaxChars", value: num("extractMaxChars"), t, onCommit: setNum("extractMaxChars") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: css.settingsGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: css.settingsGroupTitle, children: t("settingsGroupCompile") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SwitchRow, { label: t("cfgDailyCompile"), value: bool("dailyCompileEnabled"), disabled: busy, onChange: setBool("dailyCompileEnabled") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgCompileEveryTurns"), field: "compileEveryTurns", value: num("compileEveryTurns"), t, onCommit: setNum("compileEveryTurns") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgCompileThreshold"), field: "compileThreshold", value: num("compileThreshold"), t, onCommit: setNum("compileThreshold") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgDecayLambda"), hint: t("cfgDecayLambdaHint"), field: "decayLambda", value: num("decayLambda"), t, onCommit: setNum("decayLambda") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgHitBonus"), field: "hitBonus", value: num("hitBonus"), t, onCommit: setNum("hitBonus") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgEntryLimit"), hint: t("cfgEntryLimitHint"), field: "entryLimit", value: num("entryLimit"), t, onCommit: setNum("entryLimit") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgPruneNeverHit"), hint: t("cfgPruneNeverHitHint"), field: "pruneNeverHitDays", value: num("pruneNeverHitDays") ?? 21, t, onCommit: setNum("pruneNeverHitDays") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: css.settingsGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: css.settingsGroupTitle, children: t("settingsGroupConsolidate") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SwitchRow, { label: t("cfgConsolidate"), hint: t("consolidateHint"), value: bool("consolidateEnabled"), disabled: busy, onChange: setBool("consolidateEnabled") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgConsolidateMax"), field: "consolidateMaxEntries", value: num("consolidateMaxEntries"), t, onCommit: setNum("consolidateMaxEntries") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberRow, { label: t("cfgConsolidateTimeout"), field: "consolidateTimeoutMs", value: num("consolidateTimeoutMs"), t, onCommit: setNum("consolidateTimeoutMs") }),
      (() => {
        const selectedProvider = config.consolidateProvider ?? "";
        const selectedModel = config.consolidateModel ?? "";
        const entry = catalog.find((item) => item.provider === selectedProvider);
        const providerMissing = selectedProvider !== "" && entry === void 0;
        const modelMissing = entry !== void 0 && selectedModel !== "" && !entry.models.includes(selectedModel);
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Row, { label: t("cfgConsolidateProvider"), hint: t("cfgConsolidateProviderHint"), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "select",
            {
              className: css.tagSelect,
              "aria-label": t("cfgConsolidateProvider"),
              value: selectedProvider,
              disabled: busy,
              onChange: (event) => {
                onPatch({ consolidateProvider: event.currentTarget.value, consolidateModel: "" });
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("cfgConsolidateFollowDefault") }),
                catalog.map((item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: item.provider, children: item.providerName }, item.provider)),
                providerMissing && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("option", { value: selectedProvider, children: [
                  selectedProvider,
                  "\uFF08\u672A\u5728\u76EE\u5F55\u4E2D\uFF09"
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Row, { label: t("cfgConsolidateModel"), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "select",
            {
              className: css.tagSelect,
              "aria-label": t("cfgConsolidateModel"),
              value: selectedModel,
              disabled: busy || entry === void 0,
              onChange: (event) => {
                onPatch({ consolidateModel: event.currentTarget.value });
              },
              children: [
                entry === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", children: t("cfgConsolidateSelectProviderFirst") }) : entry.models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: model, children: model }, model)),
                modelMissing && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("option", { value: selectedModel, children: [
                  selectedModel,
                  "\uFF08\u672A\u5728\u76EE\u5F55\u4E2D\uFF09"
                ] })
              ]
            }
          ) })
        ] });
      })()
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: css.settingsGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: css.settingsGroupTitle, children: t("settingsGroupEmbedding") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Row, { label: t("cfgEmbeddingProvider"), hint: t("cfgEmbeddingProviderHint"), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "select",
        {
          className: css.tagSelect,
          "aria-label": t("cfgEmbeddingProvider"),
          value: config.embeddingProvider ?? "off",
          disabled: busy,
          onChange: (event) => {
            onPatch({ embeddingProvider: event.currentTarget.value });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "off", children: t("cfgEmbeddingOff") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "http", children: t("cfgEmbeddingHttp") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "local", children: t("cfgEmbeddingLocal") })
          ]
        }
      ) }),
      embeddingOn && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TextRow, { label: t("cfgEmbeddingBaseUrl"), hint: t("cfgEmbeddingBaseUrlHint"), value: str("embeddingBaseUrl"), placeholder: "https://api.openai.com/v1", disabled: busy, onCommit: setStr("embeddingBaseUrl") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TextRow, { label: t("cfgEmbeddingModel"), hint: t("cfgEmbeddingModelHint"), value: str("embeddingModel"), placeholder: "text-embedding-3-small", disabled: busy, onCommit: setStr("embeddingModel") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TextRow, { label: t("cfgEmbeddingApiKey"), hint: t("cfgEmbeddingApiKeyHint"), value: str("embeddingApiKey"), placeholder: t("cfgEmbeddingApiKeyPlaceholder"), type: "password", disabled: busy, onCommit: setStr("embeddingApiKey") }),
        config.embeddingProvider === "local" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: css.settingsHint, children: t("cfgEmbeddingLocalHint") })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: css.settingsGroup, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { className: css.settingsGroupTitle, children: t("settingsGroupDiag") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SwitchRow, { label: t("cfgLogApi"), hint: t("cfgLogApiHint"), value: bool("logApiRequests"), disabled: busy, onChange: setBool("logApiRequests") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: css.settingsFoot, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives.Button, { variant: "outline", size: "sm", disabled: busy, onClick: onReset, children: t("settingsReset") }) })
  ] });
}

// src/client/memory/locales.ts
var zh = {
  entry: "\u8BB0\u5FC6",
  panelTitle: "\u8BB0\u5FC6",
  tabAll: "\u5168\u90E8",
  tabChanges: "\u53D8\u66F4",
  tabPinned: "\u7F6E\u9876",
  searchPlaceholder: "\u641C\u7D22\u8BB0\u5FC6\u2026",
  tagFilterPlaceholder: "\u5168\u90E8\u6807\u7B7E",
  scopeGlobal: "\u5168\u5C40",
  groupToday: "\u4ECA\u5929",
  groupWeek: "\u672C\u5468",
  groupEarlier: "\u66F4\u65E9",
  groupLongterm: "\u957F\u671F\u6C89\u6DC0",
  empty: "\u4F1A\u8BDD\u4E2D\u7684\u8981\u70B9\u4F1A\u81EA\u52A8\u6C89\u6DC0\u5230\u8FD9\u91CC",
  changesEmpty: "\u4ECA\u5929\u8FD8\u6CA1\u6709\u65B0\u7684\u8BB0\u5FC6\u53D8\u66F4",
  pin: "\u7F6E\u9876",
  unpin: "\u53D6\u6D88\u7F6E\u9876",
  edit: "\u7F16\u8F91",
  delete: "\u5220\u9664",
  move: "\u79FB\u9879\u76EE",
  deleteConfirm: "\u5220\u9664\u8FD9\u6761\u8BB0\u5FC6\uFF1F",
  confirmTitle: "\u8BF7\u786E\u8BA4",
  confirmOk: "\u786E\u5B9A",
  confirmCancel: "\u53D6\u6D88",
  tagEditPlaceholder: "\u9017\u53F7\u5206\u9694\u6807\u7B7E",
  save: "\u4FDD\u5B58",
  cancel: "\u53D6\u6D88",
  moveToGlobal: "\u79FB\u5230\u5168\u5C40",
  moveToProject: "\u79FB\u5230\u9879\u76EE",
  projectPlaceholder: "\u9879\u76EE\u8DEF\u5F84\u6216 hash",
  error: "\u8BFB\u53D6\u5931\u8D25",
  retry: "\u91CD\u8BD5",
  noProjects: "\u8FD8\u6CA1\u6709\u9879\u76EE\u8BB0\u5FC6",
  unreadChanges: "{n} \u6761\u65B0\u53D8\u66F4",
  close: "\u5173\u95ED",
  sourceExtract: "\u81EA\u52A8",
  sourceManual: "\u624B\u52A8",
  add: "\u6DFB\u52A0",
  addContentPlaceholder: "\u8981\u8BB0\u4F4F\u7684\u5185\u5BB9\u2026",
  addTagsPlaceholder: "\u9017\u53F7\u5206\u9694\u6807\u7B7E",
  addPinned: "\u7F6E\u9876",
  selectProject: "\u8BF7\u9009\u62E9\u9879\u76EE",
  sensitiveConfirm: "\u5185\u5BB9\u5305\u542B\u7591\u4F3C\u654F\u611F\u4FE1\u606F\uFF08token/\u5BC6\u94A5\u7B49\uFF09\u3002\u4ECD\u8981\u4FDD\u5B58\u5417\uFF1F\u4FDD\u5B58\u540E\u6CE8\u5165\u4E0A\u4E0B\u6587\u53EF\u80FD\u88AB\u6A21\u578B\u8BFB\u53D6\uFF0C\u98CE\u9669\u81EA\u62C5\u3002",
  injectOn: "\u8BB0\u5FC6\u6CE8\u5165\uFF1A\u5F00",
  injectOff: "\u8BB0\u5FC6\u6CE8\u5165\uFF1A\u5173",
  diffOld: "\u65E7",
  diffNew: "\u65B0",
  clearProject: "\u6E05\u7A7A\u8BE5\u9879\u76EE\u5168\u90E8\u8BB0\u5FC6",
  clearProjectConfirm: "\u786E\u5B9A\u6E05\u7A7A\u9879\u76EE\u300C{name}\u300D\u7684 {count} \u6761\u8BB0\u5FC6\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002\u7F6E\u9876\u8BB0\u5FC6\u4F1A\u4FDD\u7559\uFF0C\u4E0D\u4F1A\u88AB\u5220\u9664\u3002",
  addSaved: "\u5DF2\u6DFB\u52A0\u8BB0\u5FC6",
  autoMemory: "\u81EA\u52A8\u8BB0\u5FC6",
  collapse: "\u6536\u8D77",
  multiSelect: "\u591A\u9009",
  selectAll: "\u5168\u9009",
  selectedCount: "\u5DF2\u9009 {n} \u9879",
  deleteSelectedConfirm: "\u786E\u5B9A\u5220\u9664\u9009\u4E2D\u7684 {n} \u6761\u8BB0\u5FC6\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002",
  tabRevisions: "\u4FEE\u8BA2",
  tabSettings: "\u8BBE\u7F6E",
  consolidate: "\u6574\u7406",
  consolidateHint: "\u7528\u6A21\u578B\u5408\u5E76\u91CD\u590D\u3001\u7CBE\u70BC\u91CD\u5199\u3001\u5220\u9664\u4F4E\u4EF7\u503C\u3001\u63D0\u5347\u957F\u671F\uFF08Memory Dream\uFF09",
  consolidating: "\u6574\u7406\u4E2D\u2026",
  revisionsEmpty: "\u8FD8\u6CA1\u6709\u6574\u7406\u5FEB\u7167\uFF1B\u6BCF\u5929\u81EA\u52A8\u6574\u7406\u6216\u624B\u52A8\u6574\u7406\u540E\u751F\u6210",
  revManual: "\u624B\u52A8",
  revDaily: "\u6BCF\u65E5",
  revEntries: "{n} \u6761",
  rollback: "\u56DE\u6EDA",
  rollbackConfirm: "\u56DE\u6EDA\u5230\u8BE5\u5FEB\u7167\uFF08{time}\uFF0C{id}\uFF09\uFF1F\u5F53\u524D\u5168\u90E8\u8BB0\u5FC6\u5C06\u88AB\u66FF\u6362\u4E3A\u8BE5\u5FEB\u7167\u5185\u5BB9\uFF0C\u4E0D\u53EF\u64A4\u9500\u3002",
  enable: "\u542F\u7528\u8BB0\u5FC6\uFF08\u6062\u590D\u53C2\u4E0E\u6CE8\u5165\uFF09",
  disable: "\u7981\u7528\u8BB0\u5FC6\uFF08\u4FDD\u7559\u4F46\u4E0D\u53C2\u4E0E\u6CE8\u5165\uFF09",
  enabledAria: "\u542F\u7528\u5F00\u5173\uFF0C\u5F53\u524D\u5F00\u542F",
  disabledAria: "\u542F\u7528\u5F00\u5173\uFF0C\u5F53\u524D\u7981\u7528",
  disabledTag: "\u5DF2\u7981\u7528",
  importanceTitle: "\u91CD\u8981\u5EA6",
  // ── schema v3：软废弃（retire / revise） ──
  retire: "\u5E9F\u5F03\uFF08\u4FDD\u7559\u6570\u636E\uFF09",
  retireConfirm: "\u8F6F\u5E9F\u5F03\u8FD9\u6761\u8BB0\u5FC6\uFF1F\u6570\u636E\u4FDD\u7559\u4F46\u4E0D\u518D\u6CE8\u5165/\u68C0\u7D22/\u7F16\u8BD1\uFF0C\u53EF\u5728\u53D8\u66F4\u8BB0\u5F55\u4E2D\u627E\u56DE\u3002",
  restore: "\u6062\u590D",
  restoreConfirm: "\u6062\u590D\u8FD9\u6761\u5DF2\u5E9F\u5F03\u7684\u8BB0\u5FC6\uFF08\u91CD\u65B0\u53C2\u4E0E\u6CE8\u5165/\u68C0\u7D22/\u7F16\u8BD1\uFF09\uFF1F",
  retiredTag: "\u5DF2\u5E9F\u5F03",
  revise: "\u4FEE\u8BA2",
  reviseTitle: "\u4FEE\u8BA2\u8BB0\u5FC6",
  reviseReasonPlaceholder: "\u4FEE\u8BA2\u539F\u56E0\uFF08\u53EF\u9009\uFF09",
  reviseTo: "\u4FEE\u8BA2\u4E3A\u65B0\u5185\u5BB9",
  // ── 统计条 / 整理 / 项目别名 / 元信息 / 设置分组 ──
  statEntries: "\u6761\u8BB0\u5FC6",
  statProjects: "\u4E2A\u9879\u76EE",
  statPinnedShort: "\u7F6E\u9876",
  statChangesToday: "\u4ECA\u65E5\u53D8\u66F4",
  hintAllChanges: "\u5168\u90E8\u53D8\u66F4\uFF08\u5386\u53F2\u7D2F\u8BA1\uFF09",
  hintDeprecated: "\u56DE\u6536\u7AD9\uFF08\u5DF2\u5E9F\u5F03\uFF09",
  hintActive: "\u6D3B\u8DC3\u8BB0\u5FC6\uFF08\u4E0D\u542B\u5DF2\u5E9F\u5F03\uFF09",
  hintRevisions: "\u5FEB\u7167\u6570",
  consolidateDone: "\u6574\u7406\u5B8C\u6210\uFF1A{n} \u5904\u53D8\u52A8",
  consolidateNoop: "\u8BB0\u5FC6\u5DF2\u662F\u6700\u4F73\u72B6\u6001\uFF0C\u65E0\u9700\u6574\u7406",
  consolidateConfirm: "\u7528\u6A21\u578B\u6574\u7406\u8BB0\u5FC6\uFF08\u5408\u5E76\u91CD\u590D / \u7CBE\u70BC\u91CD\u5199 / \u5220\u9664\u4F4E\u4EF7\u503C / \u63D0\u5347\u957F\u671F\uFF09\uFF1F\u6574\u7406\u524D\u4F1A\u81EA\u52A8\u5B58\u5FEB\u7167\uFF0C\u53EF\u5728\u300C\u4FEE\u8BA2\u300DTab \u4E00\u952E\u56DE\u6EDA\u3002",
  projectAlias: "\u9879\u76EE\u522B\u540D",
  aliasPlaceholder: "\u672A\u547D\u540D\uFF08\u9ED8\u8BA4\u53D6\u76EE\u5F55\u540D\uFF09",
  aliasSaved: "\u522B\u540D\u5DF2\u4FDD\u5B58",
  kindLabel: "\u7C7B\u578B",
  kindIdentity: "\u8EAB\u4EFD",
  kindPreference: "\u504F\u597D",
  kindFact: "\u4E8B\u5B9E",
  kindDecision: "\u51B3\u7B56",
  kindGotcha: "\u8E29\u5751",
  kindSession: "\u4F1A\u8BDD\u6458\u8981",
  verified: "\u5DF2\u786E\u8BA4",
  unverified: "\u5F85\u786E\u8BA4",
  confidenceTitle: "\u7F6E\u4FE1\u5EA6",
  versionTitle: "\u7248\u672C v{n}",
  createdAtLabel: "\u521B\u5EFA\u4E8E {time}",
  lastHitLabel: "\u4E0A\u6B21\u547D\u4E2D {time}",
  neverHit: "\u4ECE\u672A\u547D\u4E2D",
  importanceField: "\u91CD\u8981\u5EA6 1-10",
  changesToday: "\u4ECA\u5929",
  changesAll: "\u5168\u90E8",
  changeAdd: "\u65B0\u589E",
  changeUpdate: "\u66F4\u65B0",
  changePromote: "\u6C89\u6DC0",
  changeDelete: "\u5220\u9664",
  changeRevise: "\u4FEE\u8BA2",
  changeRetire: "\u5E9F\u5F03",
  changeConsolidate: "\u6574\u7406",
  consolidateFailed: "\u6574\u7406\u672A\u5B8C\u6210\uFF1A{reason}",
  settingsGroupInject: "\u6CE8\u5165",
  settingsGroupExtract: "\u63D0\u53D6",
  settingsGroupCompile: "\u7F16\u8BD1\u4E0E\u8870\u51CF",
  settingsGroupConsolidate: "\u6574\u7406\uFF08Memory Dream\uFF09",
  settingsGroupEmbedding: "\u8BED\u4E49\u68C0\u7D22\uFF08embedding\uFF09",
  settingsGroupDiag: "\u8BCA\u65AD",
  settingsReset: "\u6062\u590D\u9ED8\u8BA4",
  settingsResetConfirm: "\u628A\u8BB0\u5FC6\u5F15\u64CE\u7684\u5168\u90E8\u8FD0\u884C\u65F6\u8BBE\u7F6E\u6062\u590D\u4E3A\u9ED8\u8BA4\u503C\uFF1F",
  cfgEmbeddingProvider: "\u8BED\u4E49\u68C0\u7D22\u540E\u7AEF",
  cfgEmbeddingProviderHint: "off=\u5173\u95ED\uFF08\u6DF7\u5408\u68C0\u7D22\uFF09\uFF1Bhttp=OpenAI \u517C\u5BB9 API\uFF1Blocal=\u672C\u5730 ONNX\uFF08\u9700\u5B89\u88C5 @xenova/transformers\uFF09\u3002",
  cfgEmbeddingOff: "\u5173\u95ED",
  cfgEmbeddingHttp: "HTTP API",
  cfgEmbeddingLocal: "\u672C\u5730\u6A21\u578B",
  cfgEmbeddingBaseUrl: "API \u5730\u5740",
  cfgEmbeddingBaseUrlHint: "OpenAI \u517C\u5BB9\u7AEF\u70B9\uFF0C\u5982 https://api.openai.com/v1 \u6216 ollama \u7684 http://localhost:11434/v1\u3002",
  cfgEmbeddingModel: "\u6A21\u578B",
  cfgEmbeddingModelHint: "\u5982 text-embedding-3-small / Xenova/all-MiniLM-L6-v2\u3002",
  cfgEmbeddingApiKey: "API \u5BC6\u94A5",
  cfgEmbeddingApiKeyHint: "\u4E5F\u53EF\u7528\u73AF\u5883\u53D8\u91CF DSH_MEMORY_EMBEDDING_API_KEY\uFF0C\u7559\u7A7A\u5219\u8BFB\u53D6\u73AF\u5883\u53D8\u91CF\u3002",
  cfgEmbeddingApiKeyPlaceholder: "sk-\u2026\uFF08\u6216\u7559\u7A7A\u7528\u73AF\u5883\u53D8\u91CF\uFF09",
  cfgEmbeddingLocalHint: "\u672C\u5730\u6A21\u5F0F\u9700\u5728\u63D2\u4EF6\u4F9D\u8D56\u4E2D\u5B89\u88C5 @xenova/transformers\uFF1B\u672A\u5B89\u88C5\u65F6\u81EA\u52A8\u56DE\u9000\u6DF7\u5408\u68C0\u7D22\u3002",
  cfgExtractEveryTurns: "\u6BCF N \u8F6E\u63D0\u53D6\u4E00\u6B21",
  cfgExtractEveryTurnsHint: "1 = \u6BCF\u8F6E\u90FD\u63D0\u53D6\uFF1B\u8C03\u5927\u53EF\u7701 token\u3002",
  cfgExtractMaxChars: "\u63D0\u53D6\u7A97\u53E3\u6700\u5927\u5B57\u7B26\u6570",
  cfgMinImportance: "\u63D0\u53D6\u91CD\u8981\u6027\u4E0B\u9650",
  cfgMinImportanceHint: "\u4F4E\u4E8E\u8BE5\u5206\u7684\u5019\u9009\u76F4\u63A5\u4E22\u5F03\uFF081-10\uFF09\u3002",
  cfgInjectTopK: "\u6CE8\u5165\u68C0\u7D22\u6761\u6570 top-k",
  cfgInjectTopKHint: "\u7F6E\u9876 / \u8EAB\u4EFD\u504F\u597D / \u957F\u671F\u6C89\u6DC0\u5E38\u9A7B\uFF0C\u4E0D\u5360\u8BE5\u9884\u7B97\u3002",
  cfgInjectTokenBudget: "\u6CE8\u5165\u5B57\u7B26\u9884\u7B97",
  cfgCompileEveryTurns: "\u6BCF N \u8F6E\u589E\u91CF\u7F16\u8BD1",
  cfgCompileThreshold: "\u6CE8\u5165\u91CD\u8981\u5EA6\u9608\u503C",
  cfgDecayLambda: "\u6BCF\u65E5\u8870\u51CF\u7CFB\u6570 \u03BB",
  cfgDecayLambdaHint: "\u6BCF\u5929 importance \xD7(1\u2212\u03BB)\uFF1B0 = \u4E0D\u8870\u51CF\u3002",
  cfgHitBonus: "\u547D\u4E2D\u52A0\u5206",
  cfgEntryLimit: "\u5168\u5C40\u6761\u76EE\u4E0A\u9650",
  cfgEntryLimitHint: "\u8D85\u9650\u65F6\u6309\u91CD\u8981\u5EA6+\u65B0\u9C9C\u5EA6\u6DD8\u6C70\uFF08\u7F6E\u9876\u8C41\u514D\uFF09\u3002",
  cfgPruneNeverHit: "\u95F2\u7F6E\u6E05\u7406\uFF08\u5929\uFF09",
  cfgPruneNeverHitHint: "\u81EA\u52A8\u63D0\u53D6\u7684\u8BB0\u5FC6\u6309\u6700\u540E\u6D3B\u8DC3\u65F6\u95F4\u6E05\u7406\uFF1A\u6700\u540E\u547D\u4E2D\u65F6\u95F4\uFF08\u4ECE\u672A\u547D\u4E2D\u6309\u521B\u5EFA\u65F6\u95F4\uFF09\u6EE1 N \u5929\u5373\u5220\u9664\uFF1B\u7F6E\u9876\u3001\u5DF2\u786E\u8BA4\u3001\u624B\u52A8\u3001\u7981\u7528\u6761\u76EE\u8C41\u514D\uFF0C0=\u5173\u95ED\u3002",
  cfgDailyCompile: "\u6BCF\u65E5\u7F16\u8BD1\uFF08\u8870\u51CF / \u6298\u53E0 / \u6EDA\u51FA\uFF09",
  cfgConsolidate: "Memory Dream \u6BCF\u65E5\u6574\u7406",
  cfgConsolidateMax: "\u5355\u6B21\u6574\u7406\u6700\u5927\u6761\u76EE\u6570",
  cfgConsolidateTimeout: "\u6574\u7406\u8D85\u65F6\uFF08\u6BEB\u79D2\uFF09",
  cfgConsolidateProvider: "\u6574\u7406\u6A21\u578B\uFF08provider\uFF09",
  cfgConsolidateProviderHint: "\u7559\u7A7A=\u8DDF\u968F\u9ED8\u8BA4\u6A21\u578B\uFF1B\u6574\u7406\u8981\u6C42\u6A21\u578B\u5FEB\u901F\u4EA7\u51FA\u51B3\u7B56\uFF0C\u9ED8\u8BA4\u6A21\u578B\u8F83\u6162\u65F6\u53EF\u6307\u5B9A\u7EAF\u6587\u672C\u5FEB\u6A21\u578B\u3002",
  cfgConsolidateModel: "\u6574\u7406\u6A21\u578B\uFF08model\uFF09",
  cfgConsolidateFollowDefault: "\u8DDF\u968F\u9ED8\u8BA4\u6A21\u578B",
  cfgConsolidateSelectProviderFirst: "\u8BF7\u5148\u9009\u62E9 provider",
  cfgLogApi: "API \u8BF7\u6C42\u65E5\u5FD7",
  cfgLogApiHint: "\u9ED8\u8BA4\u5173\u95ED\uFF1B\u5F00\u542F\u540E\u9762\u677F\u8F6E\u8BE2\u4F1A\u5199\u5165 log/api.log\u3002",
  rangeHint: "\u8303\u56F4 {min} \u2013 {max}",
  detailPlaceholder: "\u4ECE\u5DE6\u4FA7\u9009\u62E9\u4E00\u6761\u8BB0\u5FC6\u67E5\u770B\u8BE6\u60C5",
  addTitle: "\u6DFB\u52A0\u8BB0\u5FC6",
  editTitle: "\u7F16\u8F91\u8BB0\u5FC6",
  moveTitle: "\u79FB\u52A8\u8BB0\u5FC6",
  searchEmpty: "\u6CA1\u6709\u5339\u914D\u7684\u8BB0\u5FC6",
  searchEmptyHint: "\u6362\u4E2A\u5173\u952E\u8BCD\uFF0C\u6216\u6E05\u7A7A\u6807\u7B7E / \u9879\u76EE\u7B5B\u9009",
  clearFilters: "\u6E05\u7A7A\u7B5B\u9009",
  scopeFilterLabel: "\u8303\u56F4\u7B5B\u9009",
  scopeAllOption: "\u5168\u90E8\u8303\u56F4\uFF08{n}\uFF09",
  scopeGlobalOption: "\u5168\u5C40\uFF08{n}\uFF09",
  statChanges: "\u6761\u53D8\u66F4",
  // ── 三栏应用布局（左导航 / 顶栏 / 筛选行 / 列表 / 详情） ──
  navAll: "\u5168\u90E8\u8BB0\u5FC6",
  navGlobal: "\u5168\u5C40\u8BB0\u5FC6",
  navTrash: "\u56DE\u6536\u7AD9",
  changesLoadMore: "\u52A0\u8F7D\u66F4\u591A\uFF08\u8FD8\u6709 {n} \u6761\uFF09",
  navProjects: "\u9879\u76EE",
  navCategories: "\u5206\u7C7B",
  navMoreCategories: "\u66F4\u591A\u5206\u7C7B",
  navAllProjects: "\u5168\u90E8\u9879\u76EE",
  trashEmpty: "\u56DE\u6536\u7AD9\u8FD8\u6CA1\u6709\u5185\u5BB9",
  listCount: "\u5171 {n} \u6761\u8BB0\u5FC6",
  searchPlaceholderApp: "\u641C\u7D22\u8BB0\u5FC6\u5185\u5BB9\u3001\u9879\u76EE\u3001\u6807\u7B7E\u2026",
  sortNewest: "\u6392\u5E8F: \u6700\u65B0",
  sortOldest: "\u6392\u5E8F: \u6700\u65E7",
  filterAllProjects: "\u5168\u90E8\u9879\u76EE",
  filterAllCategories: "\u5168\u90E8\u5206\u7C7B",
  cmdK: "\u5FEB\u6377\u952E\u805A\u7126\u641C\u7D22",
  relatedTitle: "\u76F8\u5173\u8BB0\u5FC6",
  relatedAll: "\u67E5\u770B\u5168\u90E8",
  relatedEmpty: "\u6682\u65E0\u76F8\u5173\u8BB0\u5FC6",
  historyTitle: "\u5386\u53F2\u8BB0\u5F55",
  historyAll: "\u67E5\u770B\u5168\u90E8\u5386\u53F2",
  historyCollapse: "\u6536\u8D77\u5386\u53F2",
  historyEmpty: "\u6682\u65E0\u5386\u53F2\u8BB0\u5F55",
  relationProject: "\u6240\u5C5E\u9879\u76EE",
  relationCategory: "\u5206\u7C7B",
  relationSection: "\u5173\u8054\u4FE1\u606F",
  copyContent: "\u590D\u5236\u5185\u5BB9",
  copyDone: "\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",
  changeCreated: "\u521B\u5EFA\u4E86\u8FD9\u6761\u8BB0\u5FC6",
  scopeBadgeTitle: "\u5F52\u5C5E",
  tagCountSuffix: "\u8BE5\u6807\u7B7E {n} \u6761",
  selectHint: "\u70B9\u51FB\u6761\u76EE\u67E5\u770B\u8BE6\u60C5"
};
var NS = "dshMemory";
var en = {
  entry: "Memory",
  panelTitle: "Memory",
  tabAll: "All",
  tabChanges: "Changes",
  tabPinned: "Pinned",
  searchPlaceholder: "Search memories\u2026",
  tagFilterPlaceholder: "All tags",
  scopeGlobal: "Global",
  groupToday: "Today",
  groupWeek: "This week",
  groupEarlier: "Earlier",
  groupLongterm: "Long-term",
  empty: "Key points from conversations will settle here automatically",
  changesEmpty: "No memory changes today yet",
  pin: "Pin",
  unpin: "Unpin",
  edit: "Edit",
  delete: "Delete",
  move: "Move",
  deleteConfirm: "Delete this memory?",
  confirmTitle: "Please confirm",
  confirmOk: "Confirm",
  confirmCancel: "Cancel",
  tagEditPlaceholder: "Comma-separated tags",
  save: "Save",
  cancel: "Cancel",
  moveToGlobal: "Move to global",
  moveToProject: "Move to project",
  projectPlaceholder: "Project path or hash",
  error: "Failed to load",
  retry: "Retry",
  noProjects: "No project memories yet",
  unreadChanges: "{n} new changes",
  close: "Close",
  sourceExtract: "Auto",
  sourceManual: "Manual",
  add: "Add",
  addContentPlaceholder: "What to remember\u2026",
  addTagsPlaceholder: "Comma-separated tags",
  addPinned: "Pin",
  selectProject: "Select a project",
  sensitiveConfirm: "This content looks like sensitive credentials (token/key). Save anyway? Injected memories may be read by the model \u2014 you take the risk.",
  injectOn: "Memory injection: on",
  injectOff: "Memory injection: off",
  diffOld: "Old",
  diffNew: "New",
  clearProject: "Clear all memories in this project",
  clearProjectConfirm: 'Clear {count} memories in project "{name}"? This cannot be undone. Pinned memories are kept.',
  addSaved: "Memory added",
  autoMemory: "Auto-memory",
  collapse: "Collapse",
  multiSelect: "Select",
  selectAll: "All",
  selectedCount: "{n} selected",
  deleteSelectedConfirm: "Delete {n} selected memories? This cannot be undone.",
  tabRevisions: "Revisions",
  tabSettings: "Settings",
  consolidate: "Consolidate",
  consolidateHint: "Merge duplicates, rewrite, prune low-value, promote long-term with the model (Memory Dream)",
  consolidating: "Consolidating\u2026",
  revisionsEmpty: "No snapshots yet; created after daily or manual consolidation",
  revManual: "Manual",
  revDaily: "Daily",
  revEntries: "{n} entries",
  rollback: "Rollback",
  rollbackConfirm: "Roll back to this snapshot ({time}, {id})? All memories will be replaced by that snapshot \u2014 this cannot be undone.",
  enable: "Enable memory (resume injection)",
  disable: "Disable memory (kept, not injected)",
  enabledAria: "Enable switch, currently on",
  disabledAria: "Enable switch, currently off",
  disabledTag: "Off",
  importanceTitle: "Importance",
  retire: "Retire (keep data)",
  retireConfirm: "Soft-retire this memory? Data is kept but it stops being injected / searched / compiled \u2014 recoverable from changes.",
  restore: "Restore",
  restoreConfirm: "Restore this retired memory (resume injection / search / compile)?",
  retiredTag: "Retired",
  revise: "Revise",
  reviseTitle: "Revise memory",
  reviseReasonPlaceholder: "Reason (optional)",
  reviseTo: "Revise to new content",
  statEntries: "memories",
  statProjects: "projects",
  statPinnedShort: "pinned",
  statChangesToday: "changes today",
  hintAllChanges: "All changes (lifetime)",
  hintDeprecated: "Trash (retired)",
  hintActive: "Active memories (excluding retired)",
  hintRevisions: "Snapshots",
  consolidateDone: "Consolidated: {n} changes",
  consolidateNoop: "Memory is already tidy \u2014 nothing to consolidate",
  consolidateConfirm: "Consolidate memories with the model (merge duplicates / rewrite / prune / promote)? A snapshot is saved first and can be rolled back from the Revisions tab.",
  projectAlias: "Project alias",
  aliasPlaceholder: "Unnamed (defaults to folder name)",
  aliasSaved: "Alias saved",
  kindLabel: "Kind",
  kindIdentity: "Identity",
  kindPreference: "Preference",
  kindFact: "Fact",
  kindDecision: "Decision",
  kindGotcha: "Gotcha",
  kindSession: "Session summary",
  verified: "Verified",
  unverified: "Unverified",
  confidenceTitle: "Confidence",
  versionTitle: "Version v{n}",
  createdAtLabel: "Created {time}",
  lastHitLabel: "Last hit {time}",
  neverHit: "Never hit",
  importanceField: "Importance 1-10",
  changesToday: "Today",
  changesAll: "All",
  changeAdd: "Added",
  changeUpdate: "Updated",
  changePromote: "Promoted",
  changeDelete: "Deleted",
  changeRevise: "Revised",
  changeRetire: "Retired",
  changeConsolidate: "Consolidated",
  consolidateFailed: "Consolidation did not complete: {reason}",
  settingsGroupInject: "Injection",
  settingsGroupExtract: "Extraction",
  settingsGroupCompile: "Compile & decay",
  settingsGroupConsolidate: "Consolidation (Memory Dream)",
  settingsGroupEmbedding: "Semantic search (embedding)",
  settingsGroupDiag: "Diagnostics",
  settingsReset: "Reset to defaults",
  settingsResetConfirm: "Reset all memory engine runtime settings to defaults?",
  cfgEmbeddingProvider: "Semantic backend",
  cfgEmbeddingProviderHint: "off=hybrid search; http=OpenAI-compatible API; local=local ONNX (needs @xenova/transformers).",
  cfgEmbeddingOff: "Off",
  cfgEmbeddingHttp: "HTTP API",
  cfgEmbeddingLocal: "Local model",
  cfgEmbeddingBaseUrl: "API base URL",
  cfgEmbeddingBaseUrlHint: "OpenAI-compatible endpoint, e.g. https://api.openai.com/v1 or ollama http://localhost:11434/v1.",
  cfgEmbeddingModel: "Model",
  cfgEmbeddingModelHint: "e.g. text-embedding-3-small / Xenova/all-MiniLM-L6-v2.",
  cfgEmbeddingApiKey: "API key",
  cfgEmbeddingApiKeyHint: "Or use env DSH_MEMORY_EMBEDDING_API_KEY; leave empty to read from env.",
  cfgEmbeddingApiKeyPlaceholder: "sk-\u2026 (or leave empty for env)",
  cfgEmbeddingLocalHint: "Local mode requires @xenova/transformers installed; falls back to hybrid when missing.",
  cfgExtractEveryTurns: "Extract every N turns",
  cfgExtractEveryTurnsHint: "1 = every turn; higher saves tokens.",
  cfgExtractMaxChars: "Extraction window max chars",
  cfgMinImportance: "Minimum importance to keep",
  cfgMinImportanceHint: "Candidates below this score are dropped (1-10).",
  cfgInjectTopK: "Injection top-k",
  cfgInjectTopKHint: "Pinned / identity / long-term entries are always injected and do not use this budget.",
  cfgInjectTokenBudget: "Injection char budget",
  cfgCompileEveryTurns: "Incremental compile every N turns",
  cfgCompileThreshold: "Injection importance threshold",
  cfgDecayLambda: "Daily decay \u03BB",
  cfgDecayLambdaHint: "importance \xD7(1\u2212\u03BB) per day; 0 = no decay.",
  cfgHitBonus: "Hit bonus",
  cfgEntryLimit: "Global entry cap",
  cfgEntryLimitHint: "Over the cap, low importance/stale entries are evicted (pinned exempt).",
  cfgPruneNeverHit: "Prune idle (days)",
  cfgPruneNeverHitHint: "Auto-extracted memories are pruned by last active time: last hit (or creation if never hit) older than N days is deleted. Pinned / verified / manual / disabled are exempt. 0 = off.",
  cfgDailyCompile: "Daily compile (decay / promote / evict)",
  cfgConsolidate: "Memory Dream daily consolidation",
  cfgConsolidateMax: "Max entries per consolidation",
  cfgConsolidateTimeout: "Consolidation timeout (ms)",
  cfgConsolidateProvider: "Consolidation model (provider)",
  cfgConsolidateProviderHint: "Leave empty to follow the default model. Consolidation needs a fast-deciding model; a slow default can time out.",
  cfgConsolidateModel: "Consolidation model (model)",
  cfgConsolidateFollowDefault: "Follow default model",
  cfgConsolidateSelectProviderFirst: "Select a provider first",
  cfgLogApi: "API request log",
  cfgLogApiHint: "Off by default; panel polling would fill log/api.log.",
  rangeHint: "Range {min} \u2013 {max}",
  detailPlaceholder: "Select a memory on the left to see details",
  addTitle: "Add memory",
  editTitle: "Edit memory",
  moveTitle: "Move memory",
  searchEmpty: "No matching memories",
  searchEmptyHint: "Try another keyword, or clear the tag / project filter",
  clearFilters: "Clear filters",
  scopeFilterLabel: "Scope filter",
  scopeAllOption: "All scopes ({n})",
  scopeGlobalOption: "Global ({n})",
  statChanges: "changes",
  navAll: "All memories",
  navGlobal: "Global memories",
  navTrash: "Trash",
  changesLoadMore: "Load more ({n} more)",
  navProjects: "Projects",
  navCategories: "Categories",
  navMoreCategories: "More categories",
  navAllProjects: "All projects",
  trashEmpty: "Trash is empty",
  listCount: "{n} memories",
  searchPlaceholderApp: "Search content, projects, tags\u2026",
  sortNewest: "Sort: newest",
  sortOldest: "Sort: oldest",
  filterAllProjects: "All projects",
  filterAllCategories: "All categories",
  cmdK: "Focus search",
  relatedTitle: "Related memories",
  relatedAll: "View all",
  relatedEmpty: "No related memories",
  historyTitle: "History",
  historyAll: "View full history",
  historyCollapse: "Collapse history",
  historyEmpty: "No history yet",
  relationProject: "Project",
  relationCategory: "Category",
  relationSection: "Details",
  copyContent: "Copy content",
  copyDone: "Copied to clipboard",
  changeCreated: "Created this memory",
  scopeBadgeTitle: "Scope",
  tagCountSuffix: "{n} with this tag",
  selectHint: "Select an entry to see details"
};
var DICTS = { zh, en };
function currentLang() {
  try {
    const lang = document.documentElement.lang.toLowerCase().split("-")[0];
    if (lang === "en") return "en";
  } catch {
  }
  return "zh";
}
function makeT() {
  return (key, vars) => {
    let text = DICTS[currentLang()][key] ?? zh[key];
    if (vars !== void 0) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

// src/client/modal-animation.ts
var import_react3 = require("react");
var MODAL_ANIM_MS = 240;
var STYLE_ID2 = "dsh-triad-modal-animation-styles";
var SHEET2 = `
@keyframes dsh-modal-slide-in {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes dsh-modal-slide-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(24px); }
}
@keyframes dsh-modal-side-in {
  from { opacity: 0; transform: translateX(-14px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes dsh-modal-side-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-10px); }
}
@keyframes dsh-modal-drawer-in {
  from { opacity: 0; transform: translateX(56px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes dsh-modal-drawer-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(40px); }
}
@keyframes dsh-modal-rise-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes dsh-modal-mask-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes dsh-modal-mask-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
.dsh-modal-slide-in { animation: dsh-modal-slide-in ${MODAL_ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.dsh-modal-slide-out { animation: dsh-modal-slide-out ${MODAL_ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.dsh-modal-side-in { animation: dsh-modal-side-in ${MODAL_ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.dsh-modal-side-out { animation: dsh-modal-side-out ${MODAL_ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.dsh-modal-drawer-in { animation: dsh-modal-drawer-in ${MODAL_ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.dsh-modal-drawer-out { animation: dsh-modal-drawer-out ${MODAL_ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
/* \u5185\u5BB9\u9519\u843D\uFF1A\u5361\u7247\u64AD\u653E\u6ED1\u5165\uFF08\u5E95\u90E8\u4E0A\u6ED1 / \u53F3\u4FA7\u6ED1\u5165\u5747\u53EF\uFF09\u65F6\u751F\u6548\uFF0C\u5173\u95ED\u65F6\u968F\u5361\u7247\u6574\u4F53\u6536\u56DE\u3002
   fill-mode \u5FC5\u987B\u7528 backwards\uFF08\u5EF6\u8FDF\u671F\u5E94\u7528 from \u5E27\u9690\u85CF\uFF09\u800C\u975E both\u2014\u2014both \u4F1A\u5728\u52A8\u753B
   \u7ED3\u675F\u540E\u6B8B\u7559 to \u5E27 transform\uFF08\u5373\u4F7F translateY(0)\uFF09\uFF0C\u4F7F\u8BE5\u5BB9\u5668\u6210\u4E3A\u540E\u4EE3 position:fixed
   \u5143\u7D20\uFF08\u56FE\u8868 tooltip\uFF09\u7684\u5305\u542B\u5757\uFF0C\u6D6E\u5C42\u6574\u4F53\u504F\u79FB\u3002 */
.dsh-modal-slide-in .dsh-modal-stagger,
.dsh-modal-side-in .dsh-modal-stagger,
.dsh-modal-drawer-in .dsh-modal-stagger {
  animation: dsh-modal-rise-in ${MODAL_ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  animation-delay: 60ms;
}
.dsh-modal-mask-in { animation: dsh-modal-mask-in ${MODAL_ANIM_MS}ms ease; }
.dsh-modal-mask-out { animation: dsh-modal-mask-out ${MODAL_ANIM_MS}ms ease forwards; }
@media (prefers-reduced-motion: reduce) {
  .dsh-modal-slide-in, .dsh-modal-slide-out, .dsh-modal-side-in, .dsh-modal-side-out,
  .dsh-modal-drawer-in, .dsh-modal-drawer-out,
  .dsh-modal-mask-in, .dsh-modal-mask-out { animation: none; }
  .dsh-modal-slide-in .dsh-modal-stagger, .dsh-modal-side-in .dsh-modal-stagger, .dsh-modal-drawer-in .dsh-modal-stagger { animation: none; }
}
`;
function ensureModalAnimStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID2) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID2;
  tag.textContent = SHEET2;
  document.head.appendChild(tag);
}
function modalAnimClass(closing) {
  return closing ? "dsh-modal-slide-out" : "dsh-modal-slide-in";
}
function modalDrawerAnimClass(closing) {
  return closing ? "dsh-modal-drawer-out" : "dsh-modal-drawer-in";
}
function modalMaskAnimClass(closing) {
  return closing ? "dsh-modal-mask-out" : "dsh-modal-mask-in";
}
var modalStaggerClass = "dsh-modal-stagger";
function useModalClose(open, onClose, durationMs = MODAL_ANIM_MS) {
  const [closing, setClosing] = (0, import_react3.useState)(false);
  const timerRef = (0, import_react3.useRef)(null);
  const closingRef = (0, import_react3.useRef)(false);
  (0, import_react3.useLayoutEffect)(() => {
    if (open) {
      closingRef.current = false;
      setClosing(false);
    }
  }, [open]);
  const requestClose = (0, import_react3.useCallback)(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    timerRef.current = window.setTimeout(() => {
      onClose();
    }, durationMs);
  }, [onClose, durationMs]);
  (0, import_react3.useEffect)(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);
  return { closing, requestClose };
}

// src/client/memory/ConfirmDialog.tsx
var import_react4 = require("react");
var import_react_dom = require("react-dom");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime3 = require("react/jsx-runtime");
var STYLE_ID3 = "dsh-memory-confirm-dialog-styles";
var SHEET3 = `
/* \u2500\u2500 \u906E\u7F69\uFF1A\u56FA\u5B9A\u5168\u5C4F\uFF0C\u70B9\u51FB=\u53D6\u6D88 \u2500\u2500 */
.mcd-mask{position:fixed;inset:0;z-index:1200;background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.45))}
/* \u5C45\u4E2D\u5BB9\u5668\uFF1Aflex \u5B9A\u4F4D\uFF0C\u5361\u7247\u52A8\u753B\u7684 transform \u4E0D\u4E0E\u5176\u51B2\u7A81 */
.mcd-wrap{position:fixed;inset:0;z-index:1201;display:flex;align-items:center;justify-content:center;pointer-events:none}
/* \u2500\u2500 \u5361\u7247\uFF1A\u5B9E\u5E95\uFF08\u73BB\u7483\u6A21\u5F0F\u4E5F\u4E0D\u900F\uFF09\u3001\u5706\u89D2 14\u3001l3 \u6295\u5F71 \u2500\u2500 */
.mcd-card{
  pointer-events:auto;display:flex;flex-direction:column;
  width:min(420px,calc(100vw - 48px));max-height:calc(100vh - 96px);
  box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));
  border-radius:14px;
  box-shadow:var(--dsw-shadow-lv3,0 8px 40px rgba(0,0,0,.5));
  overflow:hidden}
/* \u5B9E\u5E95\uFF1A\u73BB\u7483\u8D28\u611F\u5F00\u542F\u65F6\u4E5F\u4FDD\u6301\u4E0D\u900F\u660E\u8868\u9762\uFF08\u540C popover-shell \u7684 data-solid \u89C4\u5219\uFF1A
   \u9759\u6001 token + html[data-dsh-glass] \u524D\u7F00\u538B\u8FC7 glass.ts \u7684 transparent \u89C4\u5219\uFF09 */
.mcd-card,html[data-dsh-glass] .mcd-card{
  background:var(--dsw-static-neutral-bluish-00,#fff);
  backdrop-filter:none;-webkit-backdrop-filter:none}
body[data-ds-dark-theme] .mcd-card,html[data-dsh-glass] body[data-ds-dark-theme] .mcd-card{
  background:var(--dsw-static-neutral-bluish-850,#2c2c2e)}
/* \u2500\u2500 \u5185\u5BB9 \u2500\u2500 */
.mcd-title{flex:none;padding:14px 18px 8px;font-size:15px;font-weight:600;line-height:22px;color:var(--dsw-alias-label-primary,#eee)}
.mcd-body{flex:none;min-height:0;padding:0 18px 16px;overflow-y:auto;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary,#bbb);word-break:break-word}
.mcd-actions{flex:none;display:flex;justify-content:flex-end;gap:8px;padding:12px 14px;border-top:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.06))}
/* danger \u53D8\u4F53\uFF1A\u8B66\u793A\u7EA2\u786E\u8BA4\u6309\u94AE\uFF08outline \u5E95 + \u7EA2\u5B57\u7EA2\u6846\uFF0Chover \u52A0\u6DF1\uFF09 */
.mcd-btn-danger{
  border-color:var(--dsw-alias-state-error-primary,#e0434b)!important;
  color:var(--dsw-alias-state-error-primary,#e0434b)!important}
.mcd-btn-danger:hover{
  background:var(--dsw-alias-interactive-bg-hover-danger,rgba(224,67,75,.12))!important;
  border-color:var(--dsw-alias-state-error-primary,#e0434b)!important;
  color:var(--dsw-alias-state-error-primary,#e0434b)!important}
@media (prefers-reduced-motion:reduce){
  .mcd-mask,.mcd-card{animation:none!important}
}
`;
function ensureDialogStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID3) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID3;
  tag.dataset.plugin = "dsh-triad";
  tag.textContent = SHEET3;
  document.head.appendChild(tag);
}
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onClose
}) {
  ensureModalAnimStyles();
  ensureDialogStyles();
  const { closing, requestClose } = useModalClose(open, onClose);
  (0, import_react4.useEffect)(() => {
    if (!open) return void 0;
    const onKey = (event) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, requestClose]);
  if (!open) return null;
  const handleConfirm = () => {
    onConfirm();
    requestClose();
  };
  const handleCancel = () => {
    requestClose();
  };
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `mcd-mask ${modalMaskAnimClass(closing)}`, "aria-hidden": "true", onClick: handleCancel }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "mcd-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: `mcd-card ${modalAnimClass(closing)}`, role: "dialog", "aria-modal": "true", "aria-label": title, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "mcd-title", children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "mcd-body", children: message }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "mcd-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives2.Button, { variant: "outline", size: "sm", onClick: handleCancel, children: cancelLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            import_dsh_client_ui_primitives2.Button,
            {
              variant: danger ? "outline" : "primary",
              size: "sm",
              autoFocus: true,
              className: danger ? "mcd-btn-danger" : void 0,
              onClick: handleConfirm,
              children: confirmLabel
            }
          )
        ] })
      ] }) })
    ] }),
    document.body
  );
}

// src/client/popover-shell.tsx
var import_react5 = require("react");
var import_react_dom2 = require("react-dom");
var import_jsx_runtime4 = require("react/jsx-runtime");
var STYLE_ID4 = "dsh-popover-shell-styles";
var FALLBACK_MAIN_LEFT = 280;
var NARROW_VP = 768;
function readMainLeft() {
  try {
    const host = document.getElementById("dsh-triad-nav-host");
    if (host !== null) {
      const hostRight = host.getBoundingClientRect().right;
      let node = host.parentElement;
      while (node !== null && node !== document.body) {
        const rect = node.getBoundingClientRect();
        if (rect.height >= window.innerHeight * 0.7 && rect.left <= 8 && rect.right >= hostRight - 4) {
          return Math.round(rect.right);
        }
        node = node.parentElement;
      }
    }
  } catch {
  }
  return FALLBACK_MAIN_LEFT;
}
var SHEET4 = `
/* \u2500\u2500 \u906E\u7F69\uFF1A\u6DE1\u5165\u6DE1\u51FA \u2500\u2500 */
.psh-mask{position:fixed;inset:0;z-index:999;background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.45))}
.psh-mask[data-anim='in']{animation:dsh-modal-mask-in ${MODAL_ANIM_MS}ms ease both}
.psh-mask[data-anim='out']{animation:dsh-modal-mask-out ${MODAL_ANIM_MS}ms ease both}
/* \u2500\u2500 \u5361\u7247\uFF1A\u4F1A\u8BDD\u5F0F\u53F3\u4FA7\u62BD\u5C49 / \u5E95\u90E8 sheet \u56DE\u9000 \u2500\u2500 */
.psh-card{position:fixed;z-index:1000;display:flex;flex-direction:column;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));border-radius:14px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-2,#16181d));box-shadow:var(--dsw-shadow-lv3,0 8px 40px rgba(0,0,0,.5));overflow:hidden;transition:width ${MODAL_ANIM_MS}ms cubic-bezier(.2,.8,.2,1),height ${MODAL_ANIM_MS}ms cubic-bezier(.2,.8,.2,1)}
/* \u8986\u76D6\u4F1A\u8BDD\u4E3B\u533A\uFF1A\u4FA7\u680F\u53F3\u7F18 \u2192 \u89C6\u53E3\u53F3\u7F18\u5168\u9AD8\u5E73\u94FA\uFF0C\u65E0\u5706\u89D2\u65E0\u9634\u5F71\uFF0C\u50CF\u5207\u4E86\u4E2A\u89C6\u56FE */
.psh-card[data-mode='drawer']{top:0;right:0;bottom:0;height:100vh;height:100dvh;max-height:100vh;max-height:100dvh;border-radius:0;border:none;border-left:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.06));box-shadow:none;transition:left ${MODAL_ANIM_MS}ms cubic-bezier(.2,.8,.2,1)}
/* in \u52A8\u753B\u4E0D\u5F97\u5E26 fill-mode\uFF08both/forwards \u4F1A\u6B8B\u7559 to \u5E27 transform\uFF0C\u4F7F\u5361\u7247\u6210\u4E3A
   \u540E\u4EE3 position:fixed \u5143\u7D20\uFF08\u56FE\u8868 tooltip\uFF09\u7684\u5305\u542B\u5757\uFF0C\u6D6E\u5C42\u6574\u4F53\u504F\u79FB\uFF09\uFF1Bout \u9700\u8981
   forwards \u4FDD\u6301\u9690\u85CF\u6001\u76F4\u5230\u5378\u8F7D\uFF0C\u6B64\u65F6\u65E0\u4EA4\u4E92\u3001\u65E0\u526F\u4F5C\u7528\u3002 */
.psh-card[data-mode='drawer'][data-anim='in']{animation:dsh-modal-drawer-in ${MODAL_ANIM_MS}ms cubic-bezier(.2,.8,.2,1)}
.psh-card[data-mode='drawer'][data-anim='out']{animation:dsh-modal-drawer-out ${MODAL_ANIM_MS}ms cubic-bezier(.4,0,.2,1) both}
.psh-card[data-mode='sheet']{left:12px !important;right:12px;bottom:12px;top:auto !important}
/* \u5B9E\u5E95\u5361\u7247\uFF08solid \u6A21\u5F0F\uFF09\uFF1A\u73BB\u7483\u8D28\u611F\u5F00\u542F\u65F6\u4E5F\u4FDD\u6301\u4E0D\u900F\u660E\u8868\u9762\u3002
   \u4E24\u6761\u5FC5\u8981\u6761\u4EF6\u2014\u2014
   1) \u5E95\u8272\u5FC5\u987B\u7528 static token\uFF08bg-layer-* \u7B49 alias \u5728\u73BB\u7483\u6A21\u5F0F\u4E0B\u88AB
      overrideTokens \u6362\u6210 rgba\uFF0C\u7528\u5B83\u4EEC\u4ECD\u7136\u900F\uFF09\uFF1B
   2) \u9009\u62E9\u5668\u9700\u5E26 html[data-dsh-glass] \u524D\u7F00\u4EE5\u538B\u8FC7 glass.ts \u91CC
      \u300C\u63D2\u4EF6\u81EA\u7ED8\u9762\u677F\u4E00\u5F8B transparent\u300D\u90A3\u6761\u89C4\u5219\uFF08\u540C\u7279\u5F02\u6027\u9760\u987A\u5E8F\u53D6\u80DC\u4E0D\u53EF\u9760\uFF09\u3002 */
.psh-card[data-solid],html[data-dsh-glass] .psh-card[data-solid]{
  background:var(--dsw-static-neutral-bluish-00,#fff);
  backdrop-filter:none;-webkit-backdrop-filter:none}
body[data-ds-dark-theme] .psh-card[data-solid],
html[data-dsh-glass] body[data-ds-dark-theme] .psh-card[data-solid]{
  background:var(--dsw-static-neutral-bluish-850,#2c2c2e)}
.psh-card[data-mode='sheet'][data-anim='in']{animation:dsh-modal-slide-in ${MODAL_ANIM_MS}ms cubic-bezier(.2,.8,.2,1)}
.psh-card[data-mode='sheet'][data-anim='out']{animation:dsh-modal-slide-out ${MODAL_ANIM_MS}ms cubic-bezier(.4,0,.2,1) both}
/* \u2500\u2500 \u901A\u7528\u5361\u7247\u5934\u90E8\uFF1A\u6807\u9898 + \u5173\u95ED\uFF08\u5BF9\u9F50 auto-card-head \u89C4\u683C\uFF09\u2500\u2500 */
.psh-head{flex:none;display:flex;align-items:center;gap:8px;padding:12px 16px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.08))}
.psh-title{flex:1;min-width:0;font-size:15px;font-weight:600;line-height:22px;color:var(--dsw-alias-label-primary,#eee)}
.psh-close{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:8px;padding:0;background:transparent;cursor:pointer;color:var(--dsw-alias-label-secondary,#bbb)}
.psh-close:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06));color:var(--dsw-alias-label-primary,#eee)}
/* \u5361\u7247\u4E3B\u4F53\u6EDA\u52A8\u533A */
.psh-body{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
/* \u2500\u2500 \u79FB\u52A8\u7AEF\uFF1A\u4EFB\u4F55\u6A21\u5F0F\u5F3A\u5236\u5168\u5C4F sheet\uFF08100vw / 100dvh\uFF0Cradius 0\uFF09\u3002
    \u53C2\u8003 tool-summary .dts__modal \u7684 767.98px \u5199\u6CD5\uFF1B!important \u538B\u8FC7\u7EC4\u4EF6\u5185\u8054
    left/top/width/height\uFF08drawer \u6A21\u5F0F\u7528\u5185\u8054\u5BBD\u5EA6\uFF0C\u5FC5\u987B\u8986\u76D6\u5230 0/\u5168\u5C4F\uFF09\u3002
    transform:none \u4EC5\u4F5C\u9759\u6001\u515C\u5E95\uFF0C\u6ED1\u5165/\u6ED1\u51FA\u52A8\u753B\u7684 keyframe transform \u4ECD\u4F18\u5148\u64AD\u653E\uFF1B
    \u672C\u5757\u6CE8\u91CA\u5185\u5BB9\u672A\u5199\u51FA\u300C\u661F\u53F7\u7D27\u8DDF\u6B63\u659C\u6760\u300D\u4E24\u5B57\u7B26\u5E8F\u5217\u3002 \u2500\u2500 */
@media (max-width: 767.98px){
  .psh-card{
    left:0 !important;
    top:0 !important;
    right:auto !important;
    bottom:auto !important;
    width:100vw !important;
    max-width:100vw !important;
    height:100vh !important;
    height:100dvh !important;
    max-height:100vh !important;
    max-height:100dvh !important;
    border-radius:0 !important;
    transform:none !important;
  }
}
@media (prefers-reduced-motion:reduce){
  .psh-mask,.psh-card{animation:none!important}
  .psh-card{transition:none!important}
}
`;
function ensureShellStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID4) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID4;
  tag.dataset.plugin = "dsh-triad";
  tag.textContent = SHEET4;
  document.head.appendChild(tag);
}
function PopoverShell({
  closing,
  onClose,
  width = 560,
  size,
  onCardMouseEnter,
  onCardMouseLeave,
  ariaLabel,
  solid = false,
  children
}) {
  const [vw, setVw] = (0, import_react5.useState)(window.innerWidth);
  const [mainLeft, setMainLeft] = (0, import_react5.useState)(readMainLeft);
  (0, import_react5.useEffect)(() => {
    const reread = () => {
      setVw(window.innerWidth);
      setMainLeft(readMainLeft());
    };
    reread();
    window.addEventListener("resize", reread);
    const observer = new MutationObserver(reread);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-sidebar-collapsed"], subtree: true });
    const timer = window.setInterval(reread, 1500);
    return () => {
      window.removeEventListener("resize", reread);
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);
  void (size?.width ?? width);
  const anim = closing ? "out" : "in";
  const narrow = vw < NARROW_VP;
  const mode = narrow ? "sheet" : "drawer";
  const style = narrow ? void 0 : { left: mainLeft };
  (0, import_react5.useEffect)(() => {
    if (closing) return void 0;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [closing, onClose]);
  return (0, import_react_dom2.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      narrow && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "psh-mask", "data-anim": anim, "aria-hidden": "true", onClick: onClose }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "div",
        {
          className: `psh-card ${modalDrawerAnimClass(closing)}`,
          "data-anim": anim,
          "data-mode": mode,
          "data-solid": solid ? "" : void 0,
          style,
          role: "dialog",
          "aria-modal": "true",
          "aria-label": ariaLabel,
          onMouseEnter: onCardMouseEnter,
          onMouseLeave: onCardMouseLeave,
          children
        }
      )
    ] }),
    document.body
  );
}
function PshBody({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: className !== void 0 && className !== "" ? `psh-body ${className}` : "psh-body", children });
}

// src/client/memory/Panel.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var CHANGE_PAGE = 100;
var KINDS = ["identity", "preference", "fact", "decision", "gotcha", "session-summary"];
var KIND_LABEL = {
  identity: "kindIdentity",
  preference: "kindPreference",
  fact: "kindFact",
  decision: "kindDecision",
  gotcha: "kindGotcha",
  "session-summary": "kindSession"
};
var DOT_COLORS = ["#5B8DEF", "#F5C242", "#F0366C", "#7C5CFC", "#2BA9E0", "#2AA57A", "#F59E0B", "#8B5CF6", "#22B8CF", "#F97316"];
var PROJ_COLORS = ["#2AA57A", "#F59E0B", "#5B8DEF", "#F0366C", "#7C5CFC", "#22B8CF"];
var KIND_COLORS = {
  identity: "#7C5CFC",
  preference: "#5B8DEF",
  fact: "#9CA3AF",
  decision: "#F5C242",
  gotcha: "#F0366C",
  "session-summary": "#2BA9E0"
};
function hashOf(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}
function formatCount(value) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value < 1e3) return String(value);
  if (value < 1e4) return `${(value / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(value / 1e3)}k`;
}
function CountBadge({ value, inline = false, hint }) {
  const cls = [
    css.navCount,
    css.navCountPop,
    inline ? css.navCountInline : "",
    value === 0 ? css.navCountZero : ""
  ].filter(Boolean).join(" ");
  const exact = `${value.toLocaleString()}${value === 1 ? "" : ""}`;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: cls, title: hint !== void 0 ? `${hint} \xB7 ${exact}` : exact, children: formatCount(value) });
}
function countTagsFromEntries(entries) {
  const counts = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (entry.deprecated === true) continue;
    for (const tagName of entry.tags) counts.set(tagName, (counts.get(tagName) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tagName, count]) => ({ tag: tagName, count }));
}
function recountProjects(projects, entries) {
  if (projects.length === 0) return projects;
  return projects.map((project) => {
    const owned = entries.filter((entry) => entry.scope === "project" && entry.projectHash === project.hash);
    return { ...project, entryCount: owned.length, pinnedCount: owned.filter((entry) => entry.pinned).length };
  });
}
function splitTags(raw) {
  return raw.split(/[,，\s]+/).map((tag) => tag.trim()).filter(Boolean).slice(0, 8);
}
function entryTitle(content) {
  const trimmed = content.trim();
  const bracket = trimmed.match(/^【([^】]{1,30})】/);
  if (bracket !== null) return bracket[1].trim();
  const firstLine2 = (trimmed.split("\n", 1)[0] ?? "").replace(/^#{1,6}\s*/, "").replace(/^[-*+]\s*/, "").trim();
  if (firstLine2 !== "" && firstLine2.length <= 60) return firstLine2;
  return trimmed.slice(0, 40);
}
function entrySnippet(content) {
  const trimmed = content.trim();
  const bracket = trimmed.match(/^【([^】]{1,30})】\s*/);
  let rest = trimmed;
  if (bracket !== null) rest = trimmed.slice(bracket[0].length).trim();
  else {
    const nl = trimmed.indexOf("\n");
    const firstLine2 = (trimmed.split("\n", 1)[0] ?? "").trim();
    if (nl !== -1 && firstLine2.length <= 60) rest = trimmed.slice(nl + 1).trim();
  }
  const flat = rest.replace(/[#*`>[\]()!-]/g, " ").replace(/\s+/g, " ").trim();
  return flat === "" ? trimmed.replace(/\s+/g, " ").slice(0, 64) : flat.slice(0, 64);
}
function relativeTime(iso, now = /* @__PURE__ */ new Date()) {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return "";
  const diff = now.getTime() - time;
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "\u521A\u521A";
  if (minutes < 60) return `${minutes} \u5206\u949F\u524D`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} \u5C0F\u65F6\u524D`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "\u6628\u5929";
  if (days < 30) return `${days} \u5929\u524D`;
  return new Date(time).toLocaleDateString();
}
function absoluteTime(iso) {
  if (iso === null) return "";
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return "";
  const date = new Date(time);
  return `${date.toLocaleDateString()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
function groupEntries(entries) {
  const groups = { today: [], week: [], earlier: [], longterm: [] };
  const now = /* @__PURE__ */ new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  for (const entry of entries) {
    if (entry.layer === "long") {
      groups.longterm.push(entry);
      continue;
    }
    const time = Date.parse(entry.updatedAt);
    if (Number.isNaN(time)) {
      groups.earlier.push(entry);
      continue;
    }
    const days = Math.floor((startOfDay - time) / 864e5);
    if (days <= 0) groups.today.push(entry);
    else if (days < 7) groups.week.push(entry);
    else groups.earlier.push(entry);
  }
  return groups;
}
function projectName(hash, projects) {
  if (hash === null) return "";
  const project = projects.find((candidate) => candidate.hash === hash);
  if (project === void 0) return hash.slice(0, 6);
  return project.alias ?? project.path.split(/[\\/]/).filter(Boolean).at(-1) ?? hash.slice(0, 6);
}
var SENSITIVE_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/i,
  /AKIA[0-9A-Z]{16}/,
  /xox[baprs]-[A-Za-z0-9-]{20,}/i,
  /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/i,
  /(?:password|passwd|secret|api[_-]?key|access[_-]?token|private[_-]?key)\s*[=:]\s*[^\s,，。；;]{8,}/i
];
function containsSensitive(text) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(text));
}
function BrainIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M19.938 10.5a4 4 0 0 1 .585.396" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M6 18a4 4 0 0 1-1.967-.516" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M19.967 17.484A4 4 0 0 1 18 18" })
  ] });
}
function PinIcon({ size = 16, filled = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: filled ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M9.8 2.2 13.8 6.2l-2.3.7-2.4 2.4-.7 2.3-1.6-1.6-2.7 2.7-1-1 2.7-2.7-1.6-1.6 2.3-.7 2.4-2.4.7-2.3Z" }) });
}
function BoxIcon({ size = 15 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "2.2", y: "2.2", width: "11.6", height: "11.6", rx: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M6.2 8h3.6" })
  ] });
}
function ClockIcon({ size = 15 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { cx: "8", cy: "8", r: "5.8" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 4.8V8l2.2 1.4" })
  ] });
}
function HistoryIcon({ size = 15 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M2.8 8a5.2 5.2 0 1 1 1.5 3.7" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M2.6 5.2v2.6h2.6" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 5.4V8l2 1.2" })
  ] });
}
function TrashIcon({ size = 15 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M2.8 4.4h10.4" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M5.6 4.4V3a1 1 0 0 1 1-1h2.8a1 1 0 0 1 1 1v1.4" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M4.2 4.4l.6 8.2a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9l.6-8.2" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M6.6 7.2v3.6M9.4 7.2v3.6" })
  ] });
}
function ShieldIcon({ size = 14 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 1.8 13 3.4v4.1c0 3-2 5.5-5 6.7-3-1.2-5-3.7-5-6.7V3.4L8 1.8Z" }) });
}
function CopyIcon({ size = 14 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "5", y: "5", width: "8.4", height: "8.4", rx: "1.6" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M11 3.8A1.6 1.6 0 0 0 9.4 2.2H3.8A1.6 1.6 0 0 0 2.2 3.8v5.6A1.6 1.6 0 0 0 3.8 11" })
  ] });
}
function RingOffIcon({ size = 14 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { cx: "8", cy: "8", r: "5.4" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M4.1 4.1l7.8 7.8" })
  ] });
}
function LightbulbIcon({ size = 13 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 1.8a4 4 0 0 1 2.3 7.25c-.65.5-.9 1.05-.9 1.75h-2.8c0-.7-.25-1.25-.9-1.75A4 4 0 0 1 8 1.8Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M6.9 13.4h2.2M7.3 12.3h1.4" })
  ] });
}
function GearIcon({ size = 15 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { cx: "8", cy: "8", r: "2.1" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 1.8v1.9M8 12.3v1.9M1.8 8h1.9M12.3 8h1.9M3.6 3.6l1.35 1.35M11.05 11.05l1.35 1.35M12.4 3.6l-1.35 1.35M4.95 11.05 3.6 12.4" })
  ] });
}
function SortArrowsIcon({ size = 13 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 12.5V3.5M8 3.5 5.4 6.1M8 3.5l2.6 2.6" }) });
}
function GlobeIcon({ size = 11 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { cx: "8", cy: "8", r: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M2 8h12M8 2c1.8 1.6 2.7 3.7 2.7 6S9.8 12.4 8 14C6.2 12.4 5.3 10.3 5.3 8S6.2 3.6 8 2Z" })
  ] });
}
function FolderIcon({ size = 11 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M2 4.5A1.5 1.5 0 0 1 3.5 3h2.8l1.4 1.6h4.8A1.5 1.5 0 0 1 14 6.1v5.4a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7Z" }) });
}
function PenIcon({ size = 11 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m11.5 2.5 2 2L6 12l-2.7.7L4 10l7.5-7.5Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m10 4 2 2" })
  ] });
}
function SparkIcon({ size = 11 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 2.2 9.3 6l3.8 1.3-3.8 1.3L8 12.4 6.7 8.6 2.9 7.3 6.7 6 8 2.2Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M12.8 11.4l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" })
  ] });
}
function LayersIcon({ size = 11 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m8 2.5 5.5 3L8 8.5l-5.5-3 5.5-3Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m2.5 8.5 5.5 3 5.5-3" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m2.5 11.5 5.5 3 5.5-3" })
  ] });
}
function VerifiedIcon({ size = 11 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 1.8 13 3.4v4.1c0 3-2 5.5-5 6.7-3-1.2-5-3.7-5-6.7V3.4L8 1.8Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "m5.8 7.8 1.6 1.6 3-3.2" })
  ] });
}
function CheckMark({ size = 12 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M3 8.5 6.5 12 13 4.5" }) });
}
function PowerIcon({ size = 14, dim = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { viewBox: "0 0 16 16", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", style: { opacity: dim ? 0.45 : void 0 }, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 1.5v6" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M11.3 3.7a4.7 4.7 0 1 1-6.6 0" })
  ] });
}
function importancePercent(importance) {
  if (!Number.isFinite(importance) || importance <= 0) return 0;
  return Math.min(100, Math.round(importance / 20 * 100));
}
function MemoryPanel({ open, closing = false, onClose, initialTab, anchor = null, onCardMouseEnter, onCardMouseLeave, t = makeT(), ...api }) {
  ensureStyles();
  const apiRef = (0, import_react6.useRef)(api);
  apiRef.current = api;
  const [tab, setTab] = (0, import_react6.useState)(initialTab ?? "all");
  const [scope, setScope] = (0, import_react6.useState)("all");
  const [q, setQ] = (0, import_react6.useState)("");
  const [debouncedQ, setDebouncedQ] = (0, import_react6.useState)("");
  const [tag, setTag] = (0, import_react6.useState)("");
  const [state, setState] = (0, import_react6.useState)({ status: "loading" });
  const [allTags, setAllTags] = (0, import_react6.useState)([]);
  const [activePool, setActivePool] = (0, import_react6.useState)(null);
  const [summary, setSummary] = (0, import_react6.useState)(null);
  const [changes, setChanges] = (0, import_react6.useState)([]);
  const [changeRange, setChangeRange] = (0, import_react6.useState)("all");
  const [changeLimit, setChangeLimit] = (0, import_react6.useState)(CHANGE_PAGE);
  const [revisions, setRevisions] = (0, import_react6.useState)([]);
  const [editing, setEditing] = (0, import_react6.useState)(null);
  const [moving, setMoving] = (0, import_react6.useState)(null);
  const [busy, setBusy] = (0, import_react6.useState)(false);
  const [consolidating, setConsolidating] = (0, import_react6.useState)(false);
  const [error, setError] = (0, import_react6.useState)("");
  const [notice, setNotice] = (0, import_react6.useState)("");
  const [adding, setAdding] = (0, import_react6.useState)(false);
  const [addContent, setAddContent] = (0, import_react6.useState)("");
  const [addTags, setAddTags] = (0, import_react6.useState)("");
  const [addPinned, setAddPinned] = (0, import_react6.useState)(false);
  const [addScope, setAddScope] = (0, import_react6.useState)("project");
  const [addProject, setAddProject] = (0, import_react6.useState)("");
  const [selectedId, setSelectedId] = (0, import_react6.useState)(null);
  const [selecting, setSelecting] = (0, import_react6.useState)(false);
  const [checkedIds, setCheckedIds] = (0, import_react6.useState)(/* @__PURE__ */ new Set());
  const [config, setConfigState] = (0, import_react6.useState)(null);
  const [aliasDraft, setAliasDraft] = (0, import_react6.useState)(null);
  const [sortDir, setSortDir] = (0, import_react6.useState)("new");
  const [catExpanded, setCatExpanded] = (0, import_react6.useState)(false);
  const [related, setRelated] = (0, import_react6.useState)({ entryId: null, entries: [], loading: false });
  const [historyExpanded, setHistoryExpanded] = (0, import_react6.useState)(false);
  const searchRef = (0, import_react6.useRef)(null);
  const tabRef = (0, import_react6.useRef)(tab);
  tabRef.current = tab;
  const rangeRef = (0, import_react6.useRef)(changeRange);
  rangeRef.current = changeRange;
  (0, import_react6.useEffect)(() => {
    if (q === debouncedQ) return void 0;
    const timer = window.setTimeout(() => {
      setDebouncedQ(q);
    }, 260);
    return () => {
      window.clearTimeout(timer);
    };
  }, [q, debouncedQ]);
  (0, import_react6.useEffect)(() => {
    if (!open) return void 0;
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const load = (0, import_react6.useCallback)(async (options = {}) => {
    const current = apiRef.current;
    if (options.silent !== true) setState({ status: "loading" });
    setError("");
    try {
      const scopeParam = scope === "all" ? void 0 : scope === "global" ? "global" : "project";
      const projectParam = scope.startsWith("project:") ? scope.slice("project:".length) : void 0;
      const isTrash = tabRef.current === "trash";
      const unfiltered = scopeParam === void 0 && projectParam === void 0 && tag === "" && debouncedQ === "" && !isTrash;
      const [list, poolRes] = await Promise.all([
        current.list({
          scope: scopeParam,
          project: projectParam,
          q: debouncedQ !== "" ? debouncedQ : void 0,
          tag: tag !== "" ? tag : void 0,
          includeDeprecated: isTrash
        }),
        unfiltered ? Promise.resolve(null) : current.list({})
      ]);
      const pool = (unfiltered ? list.entries : poolRes?.entries ?? []).filter((entry) => entry.deprecated !== true);
      setState({ status: "ready", snapshot: list });
      setActivePool(pool);
      setAllTags(countTagsFromEntries(pool));
    } catch (loadError) {
      setState({ status: "error" });
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    }
  }, [scope, debouncedQ, tag]);
  const loadSummary = (0, import_react6.useCallback)(async () => {
    try {
      setSummary(await apiRef.current.summary());
    } catch {
    }
  }, []);
  const loadChanges = (0, import_react6.useCallback)(async () => {
    try {
      const response = await apiRef.current.changes("all");
      setChanges(response.changes);
    } catch (changesError) {
      setError(changesError instanceof Error ? changesError.message : String(changesError));
    }
  }, []);
  const loadRevisions = (0, import_react6.useCallback)(async () => {
    try {
      setRevisions((await apiRef.current.revisions()).revisions);
    } catch (revisionsError) {
      setError(revisionsError instanceof Error ? revisionsError.message : String(revisionsError));
    }
  }, []);
  const loadConfig = (0, import_react6.useCallback)(async () => {
    try {
      setConfigState((await apiRef.current.getConfig()).config);
    } catch (configError) {
      setError(configError instanceof Error ? configError.message : String(configError));
    }
  }, []);
  const patchConfig = (0, import_react6.useCallback)(async (patchValue) => {
    setError("");
    try {
      const response = await apiRef.current.setConfig(patchValue);
      setConfigState(response.config);
    } catch (configError) {
      setError(configError instanceof Error ? configError.message : String(configError));
    }
  }, []);
  const resetConfig = (0, import_react6.useCallback)(async () => {
    setError("");
    try {
      const response = await apiRef.current.resetConfig();
      setConfigState(response.config);
      setNotice(t("settingsReset"));
    } catch (configError) {
      setError(configError instanceof Error ? configError.message : String(configError));
    }
  }, [t]);
  const refresh = (0, import_react6.useCallback)(async () => {
    await load({ silent: true });
    await loadSummary();
    await loadChanges();
    await loadRevisions();
  }, [load, loadSummary, loadChanges, loadRevisions]);
  (0, import_react6.useEffect)(() => {
    if (!open) return;
    void load();
    void loadSummary();
    void loadChanges();
    void loadRevisions();
  }, [open, load, loadSummary, loadChanges, loadRevisions]);
  (0, import_react6.useEffect)(() => {
    if (!open) return;
    if (tab === "settings") void loadConfig();
  }, [open, tab, loadConfig]);
  (0, import_react6.useEffect)(() => {
    if (open && initialTab !== void 0) setTab(initialTab);
  }, [open, initialTab]);
  (0, import_react6.useEffect)(() => {
    if (open) return;
    setSelecting(false);
    setCheckedIds(/* @__PURE__ */ new Set());
    setEditing(null);
    setMoving(null);
    setAdding(false);
    setNotice("");
    setError("");
  }, [open]);
  (0, import_react6.useEffect)(() => {
    setAliasDraft(null);
  }, [scope]);
  (0, import_react6.useEffect)(() => {
    setChangeLimit(CHANGE_PAGE);
  }, [changeRange, scope]);
  (0, import_react6.useEffect)(() => {
    if (notice === "") return void 0;
    const timer = window.setTimeout(() => {
      setNotice("");
    }, 2400);
    return () => {
      window.clearTimeout(timer);
    };
  }, [notice]);
  (0, import_react6.useEffect)(() => {
    if (selectedId === null) {
      setRelated({ entryId: null, entries: [], loading: false });
      return void 0;
    }
    let alive = true;
    setRelated((prev) => ({ ...prev, entryId: selectedId, loading: true }));
    void apiRef.current.related(selectedId, 3).then((response) => {
      if (alive) setRelated({ entryId: selectedId, entries: response.entries, loading: false });
    }).catch(() => {
      if (alive) setRelated({ entryId: selectedId, entries: [], loading: false });
    });
    return () => {
      alive = false;
    };
  }, [selectedId]);
  const run = async (operation) => {
    setBusy(true);
    setError("");
    try {
      await operation();
    } catch (operationError) {
      setError(operationError instanceof Error ? operationError.message : String(operationError));
      return;
    } finally {
      setBusy(false);
    }
    await refresh();
  };
  const handlePin = (entry) => {
    void run(() => apiRef.current.pin(entry.id, !entry.pinned));
  };
  const [confirmRequest, setConfirmRequest] = (0, import_react6.useState)(null);
  const askConfirm = (message, onConfirm, danger = false) => {
    setConfirmRequest({ title: t("confirmTitle"), message, danger, onConfirm });
  };
  const handleEnable = (entry) => {
    void run(() => apiRef.current.enable(entry.id, entry.disabled));
  };
  const handleDelete = (entry) => {
    askConfirm(t("deleteConfirm"), () => {
      void run(() => apiRef.current.deleteEntry(entry.id));
    }, true);
  };
  const handleRetire = (entry) => {
    askConfirm(t("retireConfirm"), () => {
      void run(() => apiRef.current.retire(entry.id));
    });
  };
  const handleRestore = (entry) => {
    askConfirm(t("restoreConfirm"), () => {
      void run(() => apiRef.current.restore(entry.id));
    });
  };
  const handleCopy = (entry) => {
    void navigator.clipboard.writeText(entry.content).then(() => {
      setNotice(t("copyDone"));
    }).catch(() => {
      setError(t("copyContent"));
    });
  };
  const handleConsolidate = () => {
    askConfirm(t("consolidateConfirm"), () => {
      setConsolidating(true);
      setError("");
      void (async () => {
        try {
          const target = scope === "global" ? "global" : scope.startsWith("project:") ? "project" : "all";
          const hash = scope.startsWith("project:") ? scope.slice("project:".length) : void 0;
          const response = await apiRef.current.consolidate(target, hash);
          const changed = response.results.reduce((sum, result) => sum + result.changed, 0);
          const failedResult = response.results.find((result) => result.failed !== void 0);
          if (failedResult !== void 0) {
            setError(t("consolidateFailed", { reason: failedResult.failed ?? "" }));
            setNotice(changed > 0 ? t("consolidateDone", { n: changed }) : "");
          } else {
            setError("");
            setNotice(changed > 0 ? t("consolidateDone", { n: changed }) : t("consolidateNoop"));
          }
        } catch (consolidateError) {
          setError(consolidateError instanceof Error ? consolidateError.message : String(consolidateError));
        } finally {
          setConsolidating(false);
          await refresh();
        }
      })();
    });
  };
  const enterSelecting = () => {
    closeForms();
    setSelecting(true);
    setCheckedIds(/* @__PURE__ */ new Set());
  };
  const exitSelecting = () => {
    setSelecting(false);
    setCheckedIds(/* @__PURE__ */ new Set());
  };
  const toggleChecked = (id) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const commitAdd = () => {
    void run(async () => {
      const created = await apiRef.current.remember({
        content: addContent.trim(),
        scope: addScope,
        projectHash: addScope === "project" ? addProject : void 0,
        tags: splitTags(addTags),
        pinned: addPinned,
        importance: 8
      });
      setAdding(false);
      setAddContent("");
      setAddTags("");
      setAddPinned(false);
      setAddProject("");
      setNotice(t("addSaved"));
      setSelectedId(created.entry.id);
    });
  };
  const saveAdd = () => {
    const content = addContent.trim();
    if (content === "") return;
    if (addScope === "project" && addProject === "") {
      setError(t("selectProject"));
      return;
    }
    if (containsSensitive(content)) {
      askConfirm(t("sensitiveConfirm"), commitAdd, true);
      return;
    }
    commitAdd();
  };
  const handleClearProject = () => {
    if (!scope.startsWith("project:")) return;
    const hash = scope.slice("project:".length);
    const project = projects.find((candidate) => candidate.hash === hash);
    const name = project?.alias ?? project?.path.split(/[\\/]/).filter(Boolean).at(-1) ?? hash;
    askConfirm(
      t("clearProjectConfirm", { name, count: project?.entryCount ?? 0 }),
      () => {
        void run(() => apiRef.current.deleteProject(hash));
      },
      true
    );
  };
  const saveAlias = (hash, current) => {
    if (aliasDraft === null) return;
    const next = aliasDraft.trim();
    setAliasDraft(null);
    if (next === (current ?? "")) return;
    void run(async () => {
      await apiRef.current.meta(hash, { alias: next });
      setNotice(t("aliasSaved"));
    });
  };
  const handleRollback = (revision) => {
    askConfirm(
      t("rollbackConfirm", { id: revision.id, time: relativeTime(revision.at) }),
      () => {
        void run(() => apiRef.current.rollback(revision.id));
      },
      true
    );
  };
  const startEdit = (entry) => {
    setAdding(false);
    setMoving(null);
    setEditing({
      entryId: entry.id,
      content: entry.content,
      tags: entry.tags.join(", "),
      scope: entry.scope,
      projectHash: entry.projectHash,
      importance: entry.importance,
      pinned: entry.pinned,
      kind: entry.kind
    });
  };
  const saveEdit = () => {
    if (editing === null) return;
    const content = editing.content.trim();
    if (content === "") {
      setError(t("addContentPlaceholder"));
      return;
    }
    void run(async () => {
      const original = state.status === "ready" ? state.snapshot.entries.find((entry) => entry.id === editing.entryId) : void 0;
      const updated = await apiRef.current.update(editing.entryId, {
        content,
        tags: splitTags(editing.tags),
        importance: editing.importance,
        pinned: editing.pinned,
        kind: editing.kind
      });
      const moved = original !== void 0 && (editing.scope !== original.scope || editing.scope === "project" && editing.projectHash !== original.projectHash);
      let finalId = updated.entry.id;
      if (moved) {
        const movedEntry = await apiRef.current.move(finalId, {
          scope: editing.scope,
          projectHash: editing.scope === "project" && editing.projectHash !== null ? editing.projectHash : void 0
        });
        finalId = movedEntry.entry.id;
      }
      setEditing(null);
      setSelectedId(finalId);
    });
  };
  const startMove = (entry) => {
    setAdding(false);
    setEditing(null);
    setMoving({
      entryId: entry.id,
      target: entry.scope === "global" ? "project" : "global",
      project: entry.projectHash ?? ""
    });
  };
  const saveMove = () => {
    if (moving === null) return;
    void run(async () => {
      if (moving.target === "project" && moving.project.trim() === "") {
        throw new Error(t("selectProject"));
      }
      const moved = await apiRef.current.move(moving.entryId, {
        scope: moving.target,
        projectHash: moving.target === "project" ? moving.project.trim() : void 0
      });
      setMoving(null);
      setSelectedId(moved.entry.id);
    });
  };
  const snapshot = state.status === "ready" ? state.snapshot : null;
  const projects = (0, import_react6.useMemo)(
    () => activePool === null ? snapshot?.projects ?? [] : recountProjects(snapshot?.projects ?? [], activePool),
    [snapshot, activePool]
  );
  const filtered = (0, import_react6.useMemo)(() => {
    const entries = snapshot?.entries ?? [];
    return tabRef.current === "trash" ? entries.filter((entry) => entry.deprecated === true) : entries;
  }, [snapshot, tab]);
  const ordered = (0, import_react6.useMemo)(() => {
    if (q !== "") return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const byTime = b.updatedAt.localeCompare(a.updatedAt);
      return sortDir === "new" ? byTime : -byTime;
    });
    return arr;
  }, [filtered, sortDir, q]);
  const pinned = (0, import_react6.useMemo)(() => ordered.filter((entry) => entry.pinned), [ordered]);
  const grouped = (0, import_react6.useMemo)(() => groupEntries(ordered.filter((entry) => !entry.pinned)), [ordered]);
  const visibleChanges = (0, import_react6.useMemo)(() => changes.filter((change) => {
    if (scope === "global") return change.scope === "global";
    if (scope.startsWith("project:")) {
      return change.scope === "project" && change.projectHash === scope.slice("project:".length);
    }
    return true;
  }).filter((change) => {
    if (changeRange === "today") return change.at.slice(0, 10) === (summary?.today ?? "");
    return true;
  }), [changes, scope, changeRange, summary]);
  const shownChanges = (0, import_react6.useMemo)(
    () => visibleChanges.slice(0, changeLimit),
    [visibleChanges, changeLimit]
  );
  const groupTitles = {
    today: t("groupToday"),
    week: t("groupWeek"),
    earlier: t("groupEarlier"),
    longterm: t("groupLongterm")
  };
  const detail = (0, import_react6.useMemo)(
    () => filtered.find((entry) => entry.id === selectedId) ?? null,
    [filtered, selectedId]
  );
  (0, import_react6.useEffect)(() => {
    if (tab !== "all" && tab !== "trash") return;
    if (detail === null && filtered.length > 0) setSelectedId(filtered[0]?.id ?? null);
    if (detail === null && filtered.length === 0 && selectedId !== null) setSelectedId(null);
  }, [detail, filtered, tab, selectedId]);
  const closeForms = () => {
    setEditing(null);
    setMoving(null);
    setAdding(false);
  };
  const selectEntry = (entry) => {
    closeForms();
    setSelectedId(entry.id);
  };
  const allChecked = filtered.length > 0 && filtered.every((entry) => checkedIds.has(entry.id));
  const toggleAllChecked = () => {
    setCheckedIds(allChecked ? /* @__PURE__ */ new Set() : new Set(filtered.map((entry) => entry.id)));
  };
  const deleteChecked = () => {
    const ids = [...checkedIds];
    if (ids.length === 0) return;
    askConfirm(
      t("deleteSelectedConfirm", { n: ids.length }),
      () => {
        void run(async () => {
          await apiRef.current.deleteBatch(ids);
          exitSelecting();
        });
      },
      true
    );
  };
  const entryChanges = (0, import_react6.useMemo)(() => {
    if (detail === null) return [];
    return changes.filter((change) => change.entryId === detail.id).sort((a, b) => b.at.localeCompare(a.at));
  }, [changes, detail]);
  const historyDesc = (change) => {
    if (change.action === "add") return t("changeCreated");
    const label = changeActionLabel(change.action, t);
    if (change.summary.startsWith(label)) return change.summary;
    return `${label}\uFF1A${change.summary}`;
  };
  const relatedEntries = (0, import_react6.useMemo)(
    () => related.entryId !== null && detail !== null && related.entryId === detail.id ? related.entries : [],
    [related, detail]
  );
  const visibleCats = (0, import_react6.useMemo)(
    () => catExpanded ? allTags : allTags.slice(0, 5),
    [allTags, catExpanded]
  );
  const changeCount = summary?.changeCount ?? summary?.todayChanges ?? 0;
  const projectTotal = projects.length > 0 ? projects.length : summary?.projectCount ?? 0;
  const renderEmpty = (text, hint, action) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.empty, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.emptyIcon, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BrainIcon, { size: 26 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.emptyText, children: text }),
    hint !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.emptyHint, children: hint }),
    action !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", size: "sm", onClick: action.onClick, children: action.label })
  ] });
  const renderSkeleton = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.skeleton, "aria-busy": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.skeletonRow }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.skeletonRow }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.skeletonRow }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.skeletonRow })
  ] });
  const entryIcon = (entry, size = 16) => {
    const color = KIND_COLORS[entry.kind];
    if (entry.pinned) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "var(--m-primary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PinIcon, { size, filled: true }) });
    }
    if (entry.layer === "long") {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LayersIcon, { size }) });
    }
    if (entry.source === "manual") {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PenIcon, { size }) });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SparkIcon, { size }) });
  };
  const renderCheck = (entry) => {
    const on = selecting ? checkedIds.has(entry.id) : entry.id === selectedId;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `${css.entryCheck}${on ? ` ${css.entryCheckOn}` : ""}`, "aria-hidden": "true", children: on && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CheckMark, { size: 11 }) });
  };
  const renderScopeChip = (entry) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.entryChip, title: t("scopeBadgeTitle"), children: [
    entry.scope === "global" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GlobeIcon, { size: 9 }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FolderIcon, { size: 9 }),
    entry.scope === "global" ? t("scopeGlobal") : projectName(entry.projectHash, projects)
  ] });
  const renderEntryCard = (entry) => {
    const selected = !selecting && entry.id === selectedId;
    const cls = [css.entryCard, selected ? css.entryCardSel : ""].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "button",
      {
        type: "button",
        className: cls,
        "aria-pressed": selected,
        onClick: () => {
          if (selecting) toggleChecked(entry.id);
          else selectEntry(entry);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.entryTop, children: [
            selecting && renderCheck(entry),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.entryIcon, children: entryIcon(entry, 17) }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.entryTitleTxt, title: entryTitle(entry.content), children: entryTitle(entry.content) }),
            renderScopeChip(entry)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.entrySnippet, children: entrySnippet(entry.content) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.entryFootRow, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.entryTime, children: relativeTime(entry.updatedAt) }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.entryDot })
          ] })
        ]
      },
      entry.id
    );
  };
  const renderEntryRow = (entry) => {
    const selected = !selecting && entry.id === selectedId;
    const cls = [css.entryRow, selected ? css.entryRowSel : ""].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "button",
      {
        type: "button",
        className: cls,
        "aria-pressed": selected,
        onClick: () => {
          if (selecting) toggleChecked(entry.id);
          else selectEntry(entry);
        },
        children: [
          selecting && renderCheck(entry),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.entryRowIcon, children: entryIcon(entry, 16) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.entryTitleTxt, title: entryTitle(entry.content), children: entryTitle(entry.content) }),
          renderScopeChip(entry)
        ]
      },
      entry.id
    );
  };
  const detailActions = (entry) => {
    const enabled = entry.disabled !== true;
    const retired = entry.deprecated === true;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.cardActions, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: entry.pinned ? t("unpin") : t("pin"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": entry.pinned ? t("unpin") : t("pin"), disabled: busy, onClick: () => {
        handlePin(entry);
      }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PinIcon, { size: 14, filled: entry.pinned }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("edit"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": t("edit"), disabled: busy, onClick: () => {
        startEdit(entry);
      }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconEditOutline16, { size: 14 }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("copyContent"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": t("copyContent"), disabled: busy, onClick: () => {
        handleCopy(entry);
      }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CopyIcon, { size: 14 }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("move"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": t("move"), disabled: busy, onClick: () => {
        startMove(entry);
      }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconFolderOpenOutline16, { size: 14 }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: enabled ? t("disable") : t("enable"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          type: "button",
          className: css.iconAction,
          "aria-label": enabled ? t("disable") : t("enable"),
          disabled: busy,
          onClick: () => {
            handleEnable(entry);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PowerIcon, { size: 14, dim: !enabled })
        }
      ) }),
      retired ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("restore"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": t("restore"), disabled: busy, onClick: () => {
        handleRestore(entry);
      }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconRefreshOutline14, { size: 14 }) }) }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("retire"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": t("retire"), disabled: busy, onClick: () => {
        handleRetire(entry);
      }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(RingOffIcon, { size: 14 }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("delete"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: `${css.iconAction} ${css.iconActionDanger}`, "aria-label": t("delete"), disabled: busy, onClick: () => {
        handleDelete(entry);
      }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconTrashOutline16, { size: 14 }) }) })
    ] });
  };
  const scopeFields = (name, scopeValue, onScope, projectValue, onProject) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.check, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "radio", name, checked: scopeValue === "global", onChange: () => {
        onScope("global");
      } }),
      t("moveToGlobal")
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.check, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "radio", name, checked: scopeValue === "project", onChange: () => {
        onScope("project");
        if (projectValue === "") {
          const first = projects.find((project) => project.entryCount > 0) ?? projects[0];
          if (first !== void 0) onProject(first.hash);
        }
      } }),
      t("moveToProject")
    ] }),
    scopeValue === "project" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("select", { className: css.tagSelect, value: projectValue, "aria-label": t("projectPlaceholder"), onChange: (event) => {
      onProject(event.currentTarget.value);
    }, children: [
      projects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: t("noProjects") }),
      projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: project.hash, children: project.alias ?? project.path.split(/[\\/]/).filter(Boolean).at(-1) ?? project.hash }, project.hash))
    ] })
  ] });
  const renderDetailChips = (entry) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.chips, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.chipMute, title: t("scopeBadgeTitle"), children: [
      entry.scope === "global" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GlobeIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FolderIcon, {}),
      entry.scope === "global" ? t("scopeGlobal") : projectName(entry.projectHash, projects)
    ] }),
    entry.source === "manual" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.chipAccent, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PenIcon, {}),
      t("sourceManual")
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.chipMute, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SparkIcon, {}),
      t("sourceExtract")
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.chipMute, children: t(KIND_LABEL[entry.kind]) }),
    entry.layer === "long" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.chipWarn, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LayersIcon, {}),
      t("groupLongterm")
    ] }),
    entry.pinned && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.chipWarn, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PinIcon, { size: 11, filled: true }),
      t("tabPinned")
    ] }),
    entry.verified ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.chipOk, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(VerifiedIcon, {}),
      t("verified")
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.chipMute, children: t("unverified") }),
    entry.deprecated === true && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.chipWarn, children: t("retiredTag") }),
    entry.disabled === true && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.chipMute, children: t("disabledTag") }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.chipTime, title: absoluteTime(entry.updatedAt), children: relativeTime(entry.updatedAt) })
  ] });
  const renderDetailExtras = (entry) => {
    const mainTag = entry.tags[0] ?? null;
    const tagCount = mainTag !== null ? allTags.find((item) => item.tag === mainTag)?.count ?? 0 : 0;
    const project = projects.find((item) => item.hash === entry.projectHash);
    const entries = relatedEntries;
    const historyRows = historyExpanded ? entryChanges : entryChanges.slice(0, 3);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.sectionTitle, children: t("relationSection") }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.sectionLine }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.relationGrid, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.relationCard, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.relationLabel, children: t("relationProject") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.relationMain, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: entry.scope === "global" ? "#9CA3AF" : "#5B8DEF", display: "inline-flex" }, children: entry.scope === "global" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GlobeIcon, { size: 12 }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FolderIcon, { size: 12 }) }),
            entry.scope === "global" ? t("scopeGlobal") : project?.alias ?? projectName(entry.projectHash, projects)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.relationSub, title: project?.path ?? "", children: entry.scope === "global" ? t("scopeGlobal") : project?.path ?? "" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.relationCard, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.relationLabel, children: t("relationCategory") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.relationMain, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.catDot, style: { ["--dot"]: mainTag !== null ? DOT_COLORS[hashOf(mainTag) % DOT_COLORS.length] : "#CED2DA" } }),
            mainTag ?? "\u2014"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.relationSub, children: mainTag !== null ? t("tagCountSuffix", { n: tagCount }) : t("unverified") })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.sectionTitle, children: t("historyTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.sectionLine }),
      entryChanges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.historyDesc, children: t("historyEmpty") }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.historyList, children: [
        historyRows.map((change) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.historyRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.historyTime, children: relativeTime(change.at) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.historyDesc, children: historyDesc(change) })
        ] }, change.id)),
        entryChanges.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "button",
          {
            type: "button",
            className: css.historyLink,
            onClick: () => {
              setHistoryExpanded((value) => !value);
            },
            children: [
              historyExpanded ? t("historyCollapse") : t("historyAll"),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\u25BE" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.sectionTitle, children: [
        t("relatedTitle"),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CountBadge, { value: entries.length, inline: true }, entries.length)
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.sectionLine }),
      entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.historyDesc, children: related.loading ? t("consolidating") : t("relatedEmpty") }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.relatedGrid, children: entries.map((relatedEntry) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "button",
        {
          type: "button",
          className: css.relatedCard,
          onClick: () => {
            selectEntry(relatedEntry);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.relatedTitleTxt, children: entryTitle(relatedEntry.content) }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.relatedSub, children: [
              relatedEntry.scope === "global" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GlobeIcon, { size: 9 }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FolderIcon, { size: 9 }),
              relatedEntry.scope === "global" ? t("scopeGlobal") : projectName(relatedEntry.projectHash, projects),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\xB7" }),
              relatedEntry.tags[0] ?? t("retiredTag")
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.relatedArrow, children: "\u2197" })
          ]
        },
        relatedEntry.id
      )) })
    ] });
  };
  const renderDetailPane = () => {
    if (adding) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.detailForm, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.formTitle, children: t("addTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.field, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.fieldLabel, children: t("addContentPlaceholder") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "textarea",
            {
              className: css.inlineTextarea,
              style: { minHeight: 200 },
              value: addContent,
              placeholder: t("addContentPlaceholder"),
              "aria-label": t("addContentPlaceholder"),
              autoFocus: true,
              onChange: (event) => {
                setAddContent(event.currentTarget.value);
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.field, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.fieldLabel, children: t("addTagsPlaceholder") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "input",
            {
              className: css.inlineInput,
              value: addTags,
              placeholder: t("addTagsPlaceholder"),
              "aria-label": t("addTagsPlaceholder"),
              onChange: (event) => {
                setAddTags(event.currentTarget.value);
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.addMeta, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.check, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "checkbox", checked: addPinned, onChange: (event) => {
              setAddPinned(event.currentTarget.checked);
            } }),
            t("addPinned")
          ] }),
          scopeFields("dsh-memory-add-scope", addScope, setAddScope, addProject, setAddProject)
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.editButtons, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", disabled: busy, onClick: () => {
            setAdding(false);
          }, children: t("cancel") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "primary", disabled: busy || addContent.trim() === "", onClick: saveAdd, children: t("save") })
        ] })
      ] });
    }
    if (editing !== null) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.detailForm, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.formTitle, children: t("editTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.field, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.fieldLabel, children: t("addContentPlaceholder") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "textarea",
            {
              className: css.inlineTextarea,
              style: { minHeight: 200 },
              value: editing.content,
              "aria-label": t("edit"),
              onChange: (event) => {
                setEditing({ ...editing, content: event.currentTarget.value });
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.field, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.fieldLabel, children: t("tagEditPlaceholder") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "input",
            {
              className: css.inlineInput,
              value: editing.tags,
              placeholder: t("tagEditPlaceholder"),
              "aria-label": t("tagEditPlaceholder"),
              onChange: (event) => {
                setEditing({ ...editing, tags: event.currentTarget.value });
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.fieldRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.field, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.fieldLabel, children: t("importanceField") }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "input",
              {
                type: "number",
                className: css.numberInput,
                min: 1,
                max: 20,
                step: 0.5,
                value: editing.importance,
                "aria-label": t("importanceField"),
                onChange: (event) => {
                  const next = Number(event.currentTarget.value);
                  if (Number.isFinite(next)) setEditing({ ...editing, importance: Math.max(1, Math.min(20, next)) });
                }
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.field, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.fieldLabel, children: t("kindLabel") }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "select",
              {
                className: css.tagSelect,
                value: editing.kind,
                "aria-label": t("kindLabel"),
                onChange: (event) => {
                  setEditing({ ...editing, kind: event.currentTarget.value });
                },
                children: KINDS.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: kind, children: t(KIND_LABEL[kind]) }, kind))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.addMeta, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.check, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "checkbox", checked: editing.pinned, onChange: (event) => {
              setEditing({ ...editing, pinned: event.currentTarget.checked });
            } }),
            t("pin")
          ] }),
          scopeFields(`dsh-memory-edit-scope-${editing.entryId}`, editing.scope, (next) => {
            setEditing({ ...editing, scope: next, projectHash: next === "global" ? null : editing.projectHash });
          }, editing.projectHash ?? "", (hash) => {
            setEditing({ ...editing, scope: "project", projectHash: hash });
          })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.editButtons, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", disabled: busy, onClick: () => {
            setEditing(null);
          }, children: t("cancel") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "primary", disabled: busy || editing.content.trim() === "", onClick: saveEdit, children: t("save") })
        ] })
      ] });
    }
    if (moving !== null) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.detailForm, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.formTitle, children: t("moveTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.addMeta, children: scopeFields(`dsh-memory-move-scope-${moving.entryId}`, moving.target, (next) => {
          setMoving({ ...moving, target: next });
        }, moving.project, (hash) => {
          setMoving({ ...moving, target: "project", project: hash });
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.editButtons, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", disabled: busy, onClick: () => {
            setMoving(null);
          }, children: t("cancel") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            import_dsh_client_ui_primitives3.Button,
            {
              variant: "primary",
              disabled: busy || moving.target === "project" && moving.project.trim() === "",
              onClick: saveMove,
              children: t("save")
            }
          )
        ] })
      ] });
    }
    if (detail !== null) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.detailAnim, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.detailHead, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h3", { className: css.detailTitle, children: entryTitle(detail.content) }),
          detailActions(detail)
        ] }),
        renderDetailChips(detail),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.importanceRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.importanceIcon, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ShieldIcon, { size: 14 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.importanceLabel, children: t("importanceTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.importanceBar, role: "img", "aria-label": t("importanceTitle"), children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("i", { style: { width: `${importancePercent(detail.importance)}%` } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.importanceValue, children: Number(detail.importance).toFixed(1) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatSep, children: "|" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.importanceLabel, children: t("confidenceTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.importanceValue, children: [
            Math.round(detail.confidence * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.detailBody, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MarkstreamMarkdown, { text: detail.content, streaming: false }) }),
        detail.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.detailTags, children: detail.tags.map((tagName) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            type: "button",
            className: tag === tagName ? `${css.chip} ${css.chipActive}` : css.chip,
            onClick: () => {
              setTag(tag === tagName ? "" : tagName);
            },
            children: tagName
          },
          tagName
        )) }),
        renderDetailExtras(detail),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.detailFoot, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("versionTitle", { n: detail.version }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.statDot, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("createdAtLabel", { time: absoluteTime(detail.createdAt) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.statDot, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: detail.lastHitAt === null ? t("neverHit") : t("lastHitLabel", { time: relativeTime(detail.lastHitAt) }) })
        ] })
      ] }, detail.id);
    }
    if (filtered.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", {});
    return renderEmpty(
      tab === "trash" ? t("trashEmpty") : t("selectHint"),
      tab === "trash" ? t("consolidateHint") : void 0
    );
  };
  const scopeSelectEl = /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "select",
    {
      className: `${css.filterSelect} ${css.scopeSelect}`,
      value: scope,
      "aria-label": t("scopeFilterLabel"),
      onChange: (event) => {
        setScope(event.currentTarget.value);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("option", { value: "all", children: [
          t("filterAllProjects"),
          " (",
          summary?.entryCount ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("option", { value: "global", children: [
          t("scopeGlobal"),
          " (",
          summary?.globalCount ?? 0,
          ")"
        ] }),
        projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("option", { value: `project:${project.hash}`, children: [
          project.alias ?? project.path.split(/[\\/]/).filter(Boolean).at(-1) ?? project.hash,
          " (",
          project.entryCount,
          ")"
        ] }, project.hash))
      ]
    }
  );
  const selectedProject = scope.startsWith("project:") ? projects.find((candidate) => candidate.hash === scope.slice("project:".length)) : void 0;
  if (!open) return null;
  const navItem = (key, icon, label, count, hint) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "button",
    {
      type: "button",
      className: tab === key ? `${css.navItem} ${css.navItemActive}` : css.navItem,
      "aria-current": tab === key ? "page" : void 0,
      onClick: () => {
        setTab(key);
        closeForms();
        exitSelecting();
        if (key === "all") {
          setScope("all");
          setTag("");
        }
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.navIcon, children: icon }),
        label,
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CountBadge, { value: count, hint }, count)
      ]
    },
    key
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      PopoverShell,
      {
        closing,
        onClose,
        anchor,
        onCardMouseEnter,
        onCardMouseLeave,
        width: 1312,
        ariaLabel: t("panelTitle"),
        solid: true,
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(PshBody, { className: css.modalBody, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "psh-head", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "psh-title", children: t("panelTitle") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${css.panel} ${modalStaggerClass}`, "aria-busy": state.status === "loading", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("aside", { className: css.sidebar, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.sidebarBrand, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.sidebarLogo, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BoxIcon, { size: 14 }) }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.sidebarTitle, children: t("panelTitle") })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "button",
                {
                  type: "button",
                  className: css.sidebarAdd,
                  "aria-expanded": adding,
                  onClick: () => {
                    setAdding((value) => !value);
                    setEditing(null);
                    setMoving(null);
                    if (!adding) {
                      if (scope.startsWith("project:")) {
                        setAddScope("project");
                        setAddProject(scope.slice("project:".length));
                      }
                    }
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconPlusOutline16, { size: 14 }),
                    t("add")
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("nav", { className: css.navList, children: [
                navItem("all", /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BoxIcon, { size: 15 }), t("navAll"), summary?.entryCount ?? 0, t("hintActive")),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "button",
                  {
                    type: "button",
                    className: tab === "all" && scope === "global" ? `${css.navItem} ${css.navItemActive}` : css.navItem,
                    "aria-current": tab === "all" && scope === "global" ? "page" : void 0,
                    onClick: () => {
                      setTab("all");
                      setScope("global");
                      setTag("");
                      closeForms();
                      exitSelecting();
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.navIcon, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GlobeIcon, { size: 15 }) }),
                      t("navGlobal"),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CountBadge, { value: summary?.globalCount ?? 0, hint: t("hintActive") }, summary?.globalCount ?? 0)
                    ]
                  }
                ),
                navItem("changes", /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ClockIcon, { size: 15 }), t("tabChanges"), changeCount, t("hintAllChanges")),
                navItem("revisions", /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(HistoryIcon, { size: 15 }), t("tabRevisions"), revisions.length, t("hintRevisions")),
                navItem("trash", /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TrashIcon, { size: 15 }), t("navTrash"), summary?.deprecatedCount ?? 0, t("hintDeprecated"))
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.navSep }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.sectionHeader, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.sectionTitleTxt, children: t("navProjects") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "button",
                  {
                    type: "button",
                    className: css.sectionPlus,
                    "aria-label": t("add"),
                    onClick: () => {
                      setAdding(true);
                      setEditing(null);
                      setMoving(null);
                      setAddScope("project");
                      if (scope.startsWith("project:")) setAddProject(scope.slice("project:".length));
                    },
                    children: "+"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.projList, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "button",
                  {
                    type: "button",
                    className: scope === "all" ? `${css.projRow} ${css.projRowActive}` : css.projRow,
                    onClick: () => {
                      setScope("all");
                      setTab("all");
                      closeForms();
                      exitSelecting();
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.navIcon, style: { color: "var(--m-primary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BoxIcon, { size: 14 }) }),
                      t("navAllProjects"),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CountBadge, { value: projectTotal }, projectTotal)
                    ]
                  }
                ),
                projects.map((project) => {
                  const name = project.alias ?? project.path.split(/[\\/]/).filter(Boolean).at(-1) ?? project.hash;
                  const active = scope === `project:${project.hash}`;
                  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                    "button",
                    {
                      type: "button",
                      className: active ? `${css.projRow} ${css.projRowActive}` : css.projRow,
                      onClick: () => {
                        setScope(`project:${project.hash}`);
                        setTab("all");
                        closeForms();
                        exitSelecting();
                      },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.navIcon, style: { color: PROJ_COLORS[hashOf(project.hash) % PROJ_COLORS.length] }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FolderIcon, { size: 12 }) }),
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: name }),
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CountBadge, { value: project.entryCount }, project.entryCount)
                      ]
                    },
                    project.hash
                  );
                })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.navSep }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.sectionHeader, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.sectionTitleTxt, children: t("navCategories") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "button",
                  {
                    type: "button",
                    className: css.sectionPlus,
                    "aria-label": t("add"),
                    onClick: () => {
                      setAdding(true);
                      setEditing(null);
                      setMoving(null);
                    },
                    children: "+"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.catList, children: [
                visibleCats.map((cat) => {
                  const active = tag === cat.tag;
                  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                    "button",
                    {
                      type: "button",
                      className: active ? `${css.catRow} ${css.catRowActive}` : css.catRow,
                      onClick: () => {
                        setTag(active ? "" : cat.tag);
                        setTab("all");
                      },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.catDot, style: { ["--dot"]: DOT_COLORS[hashOf(cat.tag) % DOT_COLORS.length] } }),
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: cat.tag }),
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CountBadge, { value: cat.count }, cat.count)
                      ]
                    },
                    cat.tag
                  );
                }),
                allTags.length > 5 && !catExpanded && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { type: "button", className: `${css.catRow} ${css.catMore}`, onClick: () => {
                  setCatExpanded(true);
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.catDot, style: { ["--dot"]: "#CED2DA" } }),
                  t("navMoreCategories"),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.navChevron, children: "\u25BE" })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.sidebarFoot, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "button",
                {
                  type: "button",
                  className: tab === "settings" ? `${css.settingsNav} ${css.settingsNavActive}` : css.settingsNav,
                  onClick: () => {
                    setTab("settings");
                    closeForms();
                    exitSelecting();
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.navIcon, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GearIcon, { size: 15 }) }),
                    t("tabSettings")
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.mainCol, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.topbar, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: css.topSearch, title: t("cmdK"), children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topSearchIcon, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconSearchOutline16, { size: 14 }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "input",
                    {
                      ref: searchRef,
                      className: css.topInput,
                      value: q,
                      placeholder: t("searchPlaceholderApp"),
                      "aria-label": t("searchPlaceholderApp"),
                      onChange: (event) => {
                        setQ(event.currentTarget.value);
                      },
                      onKeyDown: (event) => {
                        if (event.key === "Escape" && q !== "") {
                          event.preventDefault();
                          setQ("");
                        }
                      }
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topKbd, children: "\u2318 K" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.topStats, children: summary !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.topStat, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatVal, children: summary.entryCount }),
                    t("statEntries")
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatSep, children: "\xB7" }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.topStat, title: t("statProjects"), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatVal, children: projectTotal }),
                    t("statProjects")
                  ] }),
                  summary.pinnedCount !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatSep, children: "\xB7" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.topStat, title: t("tabPinned"), children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "#F5C242" }, children: "\u2605" }),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatVal, children: summary.pinnedCount }),
                      t("statPinnedShort")
                    ] })
                  ] }),
                  (summary.todayChanges ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatSep, children: "\xB7" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.topStat, title: `${t("hintAllChanges")} ${changeCount.toLocaleString()}`, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "#5B8DEF", display: "inline-flex" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LightbulbIcon, { size: 13 }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.topStatVal, children: summary.todayChanges }),
                      t("statChangesToday")
                    ] })
                  ] })
                ] }) })
              ] }),
              notice !== "" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: css.notice, children: notice }),
              error !== "" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: css.error, role: "alert", children: error }),
              tab !== "changes" && tab !== "revisions" && tab !== "settings" && (state.status === "loading" ? renderSkeleton() : state.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.viewFull, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.empty, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.emptyIcon, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BrainIcon, { size: 26 }) }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.emptyText, children: t("error") }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", size: "sm", onClick: () => {
                  void load();
                }, children: t("retry") })
              ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.cols, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.listCol, children: [
                  selecting ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.listHead, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.batchCount, children: t("selectedCount", { n: checkedIds.size }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.barSep, "aria-hidden": "true" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", size: "sm", onClick: toggleAllChecked, children: allChecked ? t("collapse") : t("selectAll") }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.spacer }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", size: "sm", disabled: busy, onClick: exitSelecting, children: t("cancel") }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_dsh_client_ui_primitives3.Button, { variant: "primary", size: "sm", disabled: busy || checkedIds.size === 0, onClick: deleteChecked, children: [
                      t("delete"),
                      " (",
                      checkedIds.size,
                      ")"
                    ] })
                  ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.listHead, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.listHeadText, children: t("listCount", { n: filtered.length }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.spacer }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "button",
                      {
                        type: "button",
                        className: css.listSort,
                        "aria-label": t("sortNewest"),
                        title: sortDir === "new" ? t("sortNewest") : t("sortOldest"),
                        onClick: () => {
                          setSortDir((dir) => dir === "new" ? "old" : "new");
                        },
                        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SortArrowsIcon, { size: 13 })
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: consolidating ? t("consolidating") : t("consolidateHint"), side: "top", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                      "button",
                      {
                        type: "button",
                        className: css.toolBtn,
                        "aria-label": t("consolidate"),
                        disabled: busy || consolidating,
                        onClick: handleConsolidate,
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconSparkle16, { size: 13 }),
                          t("consolidate")
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("retry"), side: "top", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: `${css.toolBtn} ${css.toolBtnIcon}`, "aria-label": t("retry"), disabled: busy, onClick: () => {
                      void refresh();
                    }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconRefreshOutline14, { size: 13 }) }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.toolBtn, disabled: filtered.length === 0, onClick: enterSelecting, children: t("multiSelect") })
                  ] }),
                  selectedProject !== void 0 && !selecting && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.projContext, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.projName, title: selectedProject.path, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FolderIcon, { size: 11 }),
                      selectedProject.alias ?? selectedProject.path.split(/[\\/]/).filter(Boolean).at(-1) ?? selectedProject.hash
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "input",
                      {
                        className: css.inlineInput,
                        style: { flex: "1 1 110px", minWidth: 90, width: "auto" },
                        value: aliasDraft ?? selectedProject.alias ?? "",
                        placeholder: t("aliasPlaceholder"),
                        "aria-label": t("projectAlias"),
                        title: t("projectAlias"),
                        disabled: busy,
                        onChange: (event) => {
                          setAliasDraft(event.currentTarget.value);
                        },
                        onBlur: () => {
                          saveAlias(selectedProject.hash, selectedProject.alias);
                        },
                        onKeyDown: (event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            saveAlias(selectedProject.hash, selectedProject.alias);
                          }
                          if (event.key === "Escape") setAliasDraft(null);
                        }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.switchLine, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "button",
                        {
                          type: "button",
                          className: css.switch,
                          role: "switch",
                          "aria-checked": selectedProject.autoMemory,
                          "aria-label": t("autoMemory"),
                          disabled: busy,
                          onClick: () => {
                            void run(() => apiRef.current.meta(selectedProject.hash, { autoMemory: !selectedProject.autoMemory }));
                          }
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.switchText, children: t("autoMemory") })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("clearProject"), side: "top", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: `${css.iconAction} ${css.iconActionDanger}`, "aria-label": t("clearProject"), disabled: busy, onClick: handleClearProject, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconTrashOutline16, { size: 14 }) }) })
                  ] }),
                  filtered.length === 0 ? renderEmpty(
                    tab === "trash" ? t("trashEmpty") : q !== "" || tag !== "" ? t("searchEmpty") : t("empty"),
                    q !== "" || tag !== "" ? t("searchEmptyHint") : void 0,
                    q !== "" || tag !== "" ? { label: t("clearFilters"), onClick: () => {
                      setQ("");
                      setTag("");
                    } } : void 0
                  ) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                    pinned.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.groupSection, children: [
                      t("tabPinned"),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.groupSectionCount, children: pinned.length })
                    ] }),
                    pinned.map(renderEntryCard),
                    Object.keys(grouped).map((groupKey) => grouped[groupKey].length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.groupSection, children: [
                        groupTitles[groupKey],
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.groupSectionCount, children: grouped[groupKey].length })
                      ] }),
                      grouped[groupKey].map(renderEntryRow)
                    ] }, groupKey) : null)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.detailCol, children: renderDetailPane() })
              ] })),
              tab === "changes" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.viewFull, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.searchRow, children: [
                  scopeSelectEl,
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.barSep, "aria-hidden": "true" }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.segment, role: "group", "aria-label": t("tabChanges"), children: ["today", "all"].map((range) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "button",
                    {
                      type: "button",
                      "aria-pressed": changeRange === range,
                      className: changeRange === range ? `${css.segmentItem} ${css.segmentItemActive}` : css.segmentItem,
                      onClick: () => {
                        setChangeRange(range);
                      },
                      children: range === "today" ? t("changesToday") : t("changesAll")
                    },
                    range
                  )) }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.stat, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.statValue, children: visibleChanges.length }),
                    t("statChanges")
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.spacer }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("retry"), side: "top", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": t("retry"), disabled: busy, onClick: () => {
                    void loadChanges();
                  }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconRefreshOutline14, {}) }) })
                ] }),
                visibleChanges.length === 0 ? renderEmpty(t("changesEmpty")) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { className: css.cardList, children: shownChanges.map(renderChange) }),
                  visibleChanges.length > shownChanges.length && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                    "button",
                    {
                      type: "button",
                      className: css.changeMore,
                      onClick: () => {
                        setChangeLimit((limit) => limit + CHANGE_PAGE);
                      },
                      children: [
                        t("changesLoadMore", { n: visibleChanges.length - shownChanges.length }),
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { "aria-hidden": "true", children: "\u25BE" })
                      ]
                    }
                  )
                ] })
              ] }),
              tab === "revisions" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.viewFull, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.searchRow, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: css.stat, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.statValue, children: revisions.length }),
                    t("statChanges")
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.spacer }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("retry"), side: "top", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: css.iconAction, "aria-label": t("retry"), disabled: busy, onClick: () => {
                    void loadRevisions();
                  }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.IconRefreshOutline14, {}) }) })
                ] }),
                revisions.length === 0 ? renderEmpty(t("revisionsEmpty")) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { className: css.cardList, children: revisions.map(renderRevision) })
              ] }),
              tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.viewFull, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                SettingsTab,
                {
                  config,
                  busy,
                  t,
                  listModels: () => apiRef.current.listModels().then((response) => response.models),
                  onPatch: (patchValue) => {
                    void patchConfig(patchValue);
                  },
                  onReset: () => {
                    askConfirm(t("settingsResetConfirm"), () => {
                      void resetConfig();
                    });
                  }
                }
              ) })
            ] })
          ] })
        ] })
      }
    ),
    confirmRequest !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      ConfirmDialog,
      {
        open: true,
        title: confirmRequest.title,
        message: confirmRequest.message,
        confirmLabel: t("confirmOk"),
        cancelLabel: t("confirmCancel"),
        danger: confirmRequest.danger,
        onConfirm: confirmRequest.onConfirm,
        onClose: () => {
          setConfirmRequest(null);
        }
      }
    )
  ] });
  function renderRevision(revision) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("li", { className: css.changeRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.changeBadge, children: revision.trigger === "manual" ? t("revManual") : t("revDaily") }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.changeMain, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.cardMeta, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: revision.scope === "global" ? t("scopeGlobal") : revision.scope }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.statDot, "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("revEntries", { n: revision.entryCount }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.statDot, "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { title: absoluteTime(revision.at), children: relativeTime(revision.at) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.revActions, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives3.Button, { variant: "outline", size: "sm", disabled: busy, onClick: () => {
        handleRollback(revision);
      }, children: t("rollback") }) })
    ] }, revision.id);
  }
  function renderChange(change) {
    const hasDiff = change.before !== void 0 && change.after !== void 0 && change.before !== change.after;
    const badgeClass = change.action === "delete" ? `${css.changeBadge} ${css.changeBadgeDelete}` : change.action === "add" ? `${css.changeBadge} ${css.changeBadgeAdd}` : change.action === "promote" ? `${css.changeBadge} ${css.changeBadgePromote}` : change.action === "revise" ? `${css.changeBadge} ${css.changeBadgeRevise}` : change.action === "retire" ? `${css.changeBadge} ${css.changeBadgeRetire}` : css.changeBadge;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("li", { className: css.changeRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: badgeClass, children: changeActionLabel(change.action, t) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.changeMain, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.cardMeta, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: change.scope === "global" ? t("scopeGlobal") : projectName(change.projectHash, projects) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: css.statDot, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { title: absoluteTime(change.at), children: relativeTime(change.at) })
        ] }),
        change.action === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.cardContent, children: change.summary }) : hasDiff ? (
          /* 左右并排对比：旧 | 新 */
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.changeDiff, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.changeDiffCol, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.cardMeta, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("diffOld") }) }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${css.cardContent} ${css.changeOld}`, children: change.before })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.changeDiffDivider }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: css.changeDiffCol, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.cardMeta, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: t("diffNew") }) }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `${css.cardContent} ${css.changeNew}`, children: change.after })
            ] })
          ] })
        ) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: css.cardContent, children: change.after ?? change.summary })
      ] })
    ] }, change.id);
  }
}
function changeActionLabel(action, t) {
  switch (action) {
    case "add":
      return t("changeAdd");
    case "update":
      return t("changeUpdate");
    case "promote":
      return t("changePromote");
    case "delete":
      return t("changeDelete");
    case "revise":
      return t("changeRevise");
    case "retire":
      return t("changeRetire");
    case "consolidate":
      return t("changeConsolidate");
  }
}

// src/client/memory/Notify.tsx
var import_react7 = require("react");
var READ_KEY = "dsh-memory:read";
var READ_ID_CAP = 800;
function readIds() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (raw === null) return /* @__PURE__ */ new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return /* @__PURE__ */ new Set();
    return new Set(parsed.filter((value) => typeof value === "string"));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function writeIds(ids) {
  try {
    const list = [...ids];
    localStorage.setItem(READ_KEY, JSON.stringify(list.slice(Math.max(0, list.length - READ_ID_CAP))));
  } catch {
  }
}
function useUnreadChanges(api, pollMs = 6e4) {
  const [count, setCount] = (0, import_react7.useState)(0);
  const idsRef = (0, import_react7.useRef)(readIds());
  const seenRef = (0, import_react7.useRef)([]);
  const apiRef = (0, import_react7.useRef)(api);
  apiRef.current = api;
  const refresh = (0, import_react7.useCallback)(async () => {
    try {
      const response = await apiRef.current.changes();
      seenRef.current = response.changes.map((change) => change.id);
      setCount(response.changes.filter((change) => !idsRef.current.has(change.id)).length);
    } catch {
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, pollMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [refresh, pollMs]);
  const markRead = (0, import_react7.useCallback)(() => {
    const ids = new Set(idsRef.current);
    for (const id of seenRef.current) ids.add(id);
    idsRef.current = ids;
    writeIds(ids);
    setCount(0);
  }, []);
  return { count, refresh, markRead };
}

// src/client/sidebar-nav.tsx
var import_react8 = require("react");
var import_react_dom3 = require("react-dom");
var import_jsx_runtime6 = require("react/jsx-runtime");
var HOST_ID = "dsh-triad-nav-host";
var ANCHOR_SELECTOR = '[data-slot="sidebar.workspaces"]';
var FRAME_SELECTOR = "div:has(> [data-shell-overlay])";
var SLOT_LAYOUT = [
  ["usage", "skills", "memory"],
  ["team"]
];
var SLOT_NAMES = SLOT_LAYOUT.flat();
function makeSlot(name) {
  const slot = document.createElement("div");
  slot.dataset.navSlot = name;
  return slot;
}
var started = false;
var pollTimer = 0;
var hostObserver;
function ensureHostPlaced() {
  const anchor = document.querySelector(ANCHOR_SELECTOR);
  if (anchor === null) return false;
  const parent = anchor.parentElement;
  if (parent === null) return false;
  let host = document.getElementById(HOST_ID);
  if (host === null) {
    host = document.createElement("div");
    host.id = HOST_ID;
    host.dataset.plugin = "dsh-triad";
    for (const row of SLOT_LAYOUT) {
      if (row.length === 1) {
        host.appendChild(makeSlot(row[0]));
        continue;
      }
      const rowEl = document.createElement("div");
      rowEl.className = "dsh-nav-row";
      for (const name of row) rowEl.appendChild(makeSlot(name));
      host.appendChild(rowEl);
    }
  }
  const inPlace = host.parentElement === parent && (anchor.compareDocumentPosition(host) & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
  if (!inPlace) {
    parent.insertBefore(host, anchor);
  }
  return true;
}
function watchHostParent() {
  const parent = document.getElementById(HOST_ID)?.parentElement;
  if (parent === void 0) return;
  hostObserver?.disconnect();
  hostObserver = new MutationObserver(() => {
    const before = document.getElementById(HOST_ID)?.parentElement;
    ensureHostPlaced();
    if (document.getElementById(HOST_ID)?.parentElement !== before) watchHostParent();
  });
  hostObserver.observe(parent, { childList: true });
}
function ensureNavMount() {
  if (typeof document === "undefined") return () => {
  };
  if (started) return () => {
  };
  started = true;
  ensureHostPlaced();
  watchHostParent();
  pollTimer = window.setInterval(() => {
    ensureHostPlaced();
    if (hostObserver === void 0) watchHostParent();
  }, 1500);
  return () => {
    window.clearInterval(pollTimer);
    pollTimer = 0;
    hostObserver?.disconnect();
    hostObserver = void 0;
    started = false;
    document.getElementById(HOST_ID)?.remove();
  };
}
function useNavSlot(name) {
  const [slot, setSlot] = (0, import_react8.useState)(null);
  (0, import_react8.useEffect)(() => {
    let timer = 0;
    let tries = 0;
    const poll = () => {
      const found = document.querySelector(`[data-nav-slot='${name}']`);
      if (found !== null) tries = 0;
      else tries += 1;
      setSlot(found);
      timer = window.setTimeout(poll, found !== null ? 800 : tries <= 10 ? 100 : 400);
    };
    poll();
    return () => {
      window.clearTimeout(timer);
    };
  }, [name]);
  return slot;
}
function useRail() {
  const [rail, setRail] = (0, import_react8.useState)(() => document.querySelector(FRAME_SELECTOR)?.hasAttribute("data-sidebar-collapsed") ?? false);
  (0, import_react8.useEffect)(() => {
    const read = () => {
      setRail(document.querySelector(FRAME_SELECTOR)?.hasAttribute("data-sidebar-collapsed") ?? false);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-sidebar-collapsed"], subtree: true });
    const timer = window.setInterval(read, 1500);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);
  return rail;
}
var STYLE_ID5 = "dsh-triad-nav-styles";
var SHEET5 = `
/* \u5BFC\u822A\u884C\uFF1A\u4E0E\u81EA\u52A8\u5316\u83DC\u5355\u884C\u540C\u6B3E\u51E0\u4F55\uFF08\u900F\u660E\u5E95 + hover \u9AD8\u4EAE + \u6587\u5B57\u7701\u7565\uFF09 */
.dsh-nav-btn{position:relative;display:flex;align-items:center;gap:8px;width:calc(100% - 4px);height:34px;padding:0 10px;margin:0 2px 4px;box-sizing:border-box;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary,#eee);font-size:14px;line-height:20px;font-family:inherit;cursor:pointer;text-align:left;user-select:none;overflow:hidden;transition:background 120ms ease}
.dsh-nav-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.dsh-nav-btn[data-open='true']{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.dsh-nav-btn>svg{flex:none;color:var(--dsw-alias-label-secondary,#bbb)}
.dsh-nav-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* \u884C\u5C3E\u9644\u52A0\u5185\u5BB9\uFF08\u4ECA\u65E5\u7528\u91CF\u7B49\uFF09\uFF1A\u7B49\u5BBD\u6570\u5B57\u53F3\u8D34 */
.dsh-nav-trailing{flex:none;margin-left:auto;font-size:13px;line-height:18px;color:var(--dsw-alias-label-secondary,#bbb);font-family:ui-monospace,SFMono-Regular,monospace}
/* \u6298\u53E0 rail \u6001\uFF1A\u53EA\u7559\u56FE\u6807 */
.dsh-nav-btn[data-rail='true']{width:36px;height:36px;padding:0;margin:0 0 8px;justify-content:center;border-radius:8px}
/* \u672A\u8BFB badge\uFF08\u8BB0\u5FC6\u5165\u53E3\uFF09\uFF1A\u53F3\u4E0A\u89D2\u5C0F\u5706\u6807 */
.dsh-nav-badge{position:absolute;top:2px;right:2px;min-width:16px;height:16px;box-sizing:border-box;padding:0 4px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:var(--dsw-alias-state-warn-primary,#e8a33d);color:#0e1116;font-size:10px;font-weight:700;line-height:16px}
/* nav host\uFF1A\u5404\u884C\u7EB5\u5411\u5806\u53E0\uFF1B\u72EC\u7ACB\u884C\u7684\u69FD\u4F4D display:contents\uFF0C\u6309\u94AE\u76F4\u63A5\u6491\u6EE1\u6574\u884C\u3002 */
#dsh-triad-nav-host{display:flex;flex-direction:column;align-items:stretch;width:100%}
#dsh-triad-nav-host>[data-nav-slot]{display:contents}
/* \u5408\u5E76\u884C\uFF1A[\u6280\u80FD][\u8BB0\u5FC6] \u5E76\u6392\uFF1B\u69FD\u4F4D display:contents \u8BA9\u6309\u94AE\u76F4\u63A5\u53C2\u4E0E\u884C\u5E03\u5C40\uFF0C
   \u6309\u94AE\u7B49\u5206\u6574\u884C\uFF08flex:1 1 0\uFF09\uFF0C\u4E0E\u72EC\u7ACB\u884C\u7684\u89C6\u89C9\u8282\u594F\u4E00\u81F4\u2014\u2014
   \u5426\u5219\u6536\u7F29\u4E3A\u5185\u5BB9\u5BBD\u65F6\u884C\u5C3E\u4F1A\u7559\u51FA\u5927\u7247\u7A7A\u767D\u3002 */
.dsh-nav-row{display:flex;flex-wrap:wrap;align-items:stretch;gap:2px;padding:0 2px}
.dsh-nav-row>[data-nav-slot]{display:contents;min-width:0}
.dsh-nav-row .dsh-nav-btn{width:auto;flex:1 1 0;min-width:0;margin:0 0 4px;justify-content:center;text-align:center;padding:0 8px}
.dsh-nav-row .dsh-nav-btn .dsh-nav-label{min-width:0}
/* \u4E09\u7B49\u5206\u540E\u6BCF\u683C\u7EA6 1/3 \u4FA7\u680F\u5BBD\uFF0C\u653E\u4E0D\u4E0B\u300C\u6587\u5B57 + \u884C\u5C3E\u6570\u5B57\u300D\uFF0C\u4E14\u884C\u5C3E\u7684
   margin-left:auto \u4F1A\u9876\u6389\u5C45\u4E2D\u3002\u5408\u5E76\u884C\u7EDF\u4E00\u4E0D\u663E\u793A\u884C\u5C3E\u9644\u52A0\u5185\u5BB9
   \uFF08\u4ECA\u65E5\u603B\u91CF\u7B49\uFF09\u2014\u2014\u5B8C\u6574\u6570\u636E\u70B9\u5F00\u5DE5\u4F5C\u53F0\u5361\u7247\u5373\u53EF\u3002 */
.dsh-nav-row .dsh-nav-trailing{display:none}
/* \u6298\u53E0 rail \u6001\uFF1A\u5408\u5E76\u884C\u6062\u590D\u7EB5\u5411\u56FE\u6807\u5217\uFF08\u4E0E\u539F\u751F rail \u56FE\u6807\u94AE\u8282\u594F\u4E00\u81F4\uFF09 */
#dsh-triad-nav-host:has(.dsh-nav-btn[data-rail]) .dsh-nav-row{flex-direction:column;align-items:flex-start;gap:0}
#dsh-triad-nav-host:has(.dsh-nav-btn[data-rail]) .dsh-nav-row .dsh-nav-btn{width:36px;flex:none;margin:0 0 8px}
`;
function ensureNavStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID5) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID5;
  tag.dataset.plugin = "dsh-triad";
  tag.textContent = SHEET5;
  document.head.appendChild(tag);
}
function NavButton({
  icon,
  label,
  rail = false,
  expanded = false,
  badge = 0,
  badgeTitle,
  ariaLabel,
  trailing,
  onMouseEnter,
  onMouseLeave,
  onClick
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "button",
    {
      type: "button",
      className: "dsh-nav-btn",
      "data-rail": rail || void 0,
      "data-open": expanded || void 0,
      "aria-label": ariaLabel ?? label,
      "aria-expanded": expanded,
      title: rail ? ariaLabel ?? label : void 0,
      onMouseEnter,
      onMouseLeave,
      onClick,
      children: [
        icon,
        !rail && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dsh-nav-label", children: label }),
        !rail && trailing !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dsh-nav-trailing", children: trailing }),
        badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dsh-nav-badge", title: badgeTitle, children: badge > 99 ? "99+" : String(badge) })
      ]
    }
  );
}
function NavPortal({ name, children }) {
  const slot = useNavSlot(name);
  if (slot === null) return null;
  return (0, import_react_dom3.createPortal)(children, slot);
}
var PANEL_OPEN_EVENT = "dsh-triad:panel-open";
function clickInSidebar(target) {
  let node = target;
  while (node !== null && node !== document.body) {
    const rect = node.getBoundingClientRect();
    if (rect.height >= window.innerHeight * 0.7 && rect.left <= 8 && rect.right <= window.innerWidth * 0.6) return true;
    node = node.parentElement;
  }
  return false;
}
function usePanelAutoClose(name, open, requestClose) {
  (0, import_react8.useEffect)(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent(PANEL_OPEN_EVENT, { detail: name }));
  }, [open, name]);
  (0, import_react8.useEffect)(() => {
    if (!open) return void 0;
    const onSiblingOpen = (event) => {
      if (event.detail !== name) requestClose();
    };
    const onDocClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(`#${HOST_ID}, .psh-card`) !== null) return;
      if (clickInSidebar(target)) requestClose();
    };
    window.addEventListener(PANEL_OPEN_EVENT, onSiblingOpen);
    document.addEventListener("click", onDocClick, true);
    return () => {
      window.removeEventListener(PANEL_OPEN_EVENT, onSiblingOpen);
      document.removeEventListener("click", onDocClick, true);
    };
  }, [open, name, requestClose]);
}
function navAnchorFrom(el) {
  if (el === null) return null;
  const row = el.closest(`#${HOST_ID}`);
  if (row === null) return null;
  const rowRect = row.getBoundingClientRect();
  const btnRect = el.getBoundingClientRect();
  return { left: Math.round(rowRect.right + 8), top: Math.round(btnRect.top - 6) };
}

// src/client/error-boundary.tsx
var import_react9 = require("react");
var ErrorBoundary = class extends import_react9.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", { error: null });
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error(`[dsh-triad] ${this.props.label} \u6E32\u67D3\u5D29\u6E83\uFF1A`, error, info.componentStack ?? "");
    try {
      this.props.onError?.(error);
    } catch (callbackError) {
      console.error("[dsh-triad] \u9519\u8BEF\u8FB9\u754C\u56DE\u8C03\u5931\u8D25\uFF1A", callbackError);
    }
  }
  render() {
    if (this.state.error !== null) return this.props.fallback ?? null;
    return this.props.children;
  }
};

// src/client/memory/Entry.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function MemoryNavApp() {
  ensureStyles();
  ensureNavStyles();
  ensureModalAnimStyles();
  ensureShellStyles();
  const api = (0, import_react10.useMemo)(createMemoryApi, []);
  const t = (0, import_react10.useMemo)(makeT, []);
  const rail = useRail();
  const unread = useUnreadChanges(api);
  const [open, setOpen] = (0, import_react10.useState)(false);
  const [anchor, setAnchor] = (0, import_react10.useState)(null);
  const [initialTab, setInitialTab] = (0, import_react10.useState)("all");
  const { closing, requestClose } = useModalClose(open, () => {
    setOpen(false);
  });
  usePanelAutoClose("memory", open, requestClose);
  const openPanel = (tab) => {
    setInitialTab(tab);
    setOpen(true);
    if (tab === "changes") unread.markRead();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(NavPortal, { name: "memory", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      NavButton,
      {
        icon: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(BrainIcon, { size: rail ? 18 : 16 }),
        label: t("entry"),
        rail,
        expanded: open,
        badge: unread.count,
        badgeTitle: t("unreadChanges", { n: unread.count }),
        onClick: (e) => {
          e.stopPropagation();
          setAnchor(navAnchorFrom(e.currentTarget));
          openPanel(unread.count > 0 ? "changes" : "all");
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ErrorBoundary, { label: "\u8BB0\u5FC6\u9762\u677F", fallback: null, onError: requestClose, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      MemoryPanel,
      {
        ...api,
        open,
        closing,
        onClose: requestClose,
        initialTab,
        anchor,
        t
      }
    ) })
  ] });
}

// src/client/memory/Toggle.tsx
var import_react11 = require("react");
var import_dsh_client_ui_primitives4 = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime8 = require("react/jsx-runtime");
function MemoryToggle({ sessionId, t, ...api }) {
  ensureStyles();
  const [enabled, setEnabled] = (0, import_react11.useState)(null);
  const apiRef = (0, import_react11.useRef)(api);
  apiRef.current = api;
  (0, import_react11.useEffect)(() => {
    let alive = true;
    void apiRef.current.getInjectState(sessionId).then((state) => {
      if (alive) setEnabled(state.enabled);
    }).catch(() => {
      if (alive) setEnabled(true);
    });
    return () => {
      alive = false;
    };
  }, [sessionId]);
  const toggle = () => {
    const next = !(enabled ?? true);
    setEnabled(next);
    void apiRef.current.setInjectState(sessionId, next).then((state) => setEnabled(state.enabled)).catch(() => setEnabled(!next));
  };
  const isOn = enabled ?? true;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_dsh_client_ui_primitives4.Tooltip, { label: isOn ? t("injectOn") : t("injectOff"), side: "top", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "button",
    {
      type: "button",
      className: isOn ? `${css.toggle} ${css.toggleOn}` : `${css.toggle} ${css.toggleOff}`,
      "aria-label": isOn ? t("injectOn") : t("injectOff"),
      "aria-pressed": isOn,
      onClick: toggle,
      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(BrainIcon, { size: 14 })
    }
  ) });
}

// src/client/memory/index.ts
function applyMemoryClient(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-memory: dictionaries");
  ctx.effect(() => {
    ensureNavMount();
    const holder = document.createElement("div");
    const root = (0, import_client.createRoot)(holder);
    root.render((0, import_react12.createElement)(MemoryNavApp));
    return () => {
      root.unmount();
    };
  }, "dsh-memory: nav entry");
  const panelApi = createMemoryApi();
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
    name: "conversation.input.left",
    id: "dsh-memory-inject-toggle",
    order: 99,
    locale: NS,
    inject: () => panelApi
  }, MemoryToggle));
}

// src/client/usage/entry.tsx
var import_react30 = require("react");
var import_client2 = require("react-dom/client");
var import_dsh_client_ui_primitives7 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/usage/dashboard/Workbench.tsx
var import_react27 = require("react");

// src/client/usage/dashboard/TrendTab.tsx
var import_react17 = require("react");

// src/client/usage/dashboard/api.ts
async function fetchJson(path, init) {
  const res = await fetch(path, { cache: "no-store", ...init, headers: { accept: "application/json", ...init?.headers } });
  return res.json();
}
var usageApi = {
  usage: () => fetchJson("/api/usage-stats/usage"),
  signal: (days = 30) => fetchJson(`/api/usage-stats/signal?days=${days}`),
  daySessions: (date) => fetchJson(`/api/usage-stats/day-sessions?date=${encodeURIComponent(date)}`),
  budget: () => fetchJson("/api/usage-stats/budget"),
  saveBudget: (budget) => fetchJson("/api/usage-stats/budget", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ budget })
  }),
  providers: () => fetchJson("/api/usage-stats/providers"),
  account: (provider, refresh = false) => fetchJson(`/api/usage-stats/account?provider=${encodeURIComponent(provider)}${refresh ? "&refresh=1" : ""}`),
  subscriptions: () => fetchJson("/api/usage-stats/subscriptions")
};

// src/client/usage/dashboard/aggregate.ts
function sumTokens(days) {
  let input = 0, output = 0, cache = 0;
  for (const d of days) {
    input += d.inputTokens ?? 0;
    output += d.outputTokens ?? 0;
    cache += (d.cacheReadTokens ?? 0) + (d.cacheWriteTokens ?? 0);
  }
  return { input, output, cache, total: input + output + cache };
}
function modelRank(days) {
  const map = /* @__PURE__ */ new Map();
  for (const d of days) {
    for (const m of d.models ?? []) {
      const row = map.get(m.model) ?? { tokens: 0, input: 0, cacheRead: 0, cacheWrite: 0 };
      row.tokens += m.tokens ?? 0;
      row.input += m.inputTokens ?? 0;
      row.cacheRead += m.cacheReadTokens ?? 0;
      row.cacheWrite += m.cacheWriteTokens ?? 0;
      map.set(m.model, row);
    }
  }
  return [...map.entries()].map(([label, row]) => {
    const prompt = row.input + row.cacheRead + row.cacheWrite;
    return {
      label,
      value: row.tokens,
      hitRate: prompt > 0 ? row.cacheRead / prompt * 100 : null
    };
  }).sort((a, b) => b.value - a.value);
}
function splitModelKey(model) {
  const slash = model.indexOf("/");
  if (slash <= 0) return { provider: model, model };
  return { provider: model.slice(0, slash), model: model.slice(slash + 1) };
}
function providerShare(days) {
  const map = /* @__PURE__ */ new Map();
  for (const d of days) {
    for (const m of d.models ?? []) {
      const provider = m.model.includes("/") ? m.model.split("/")[0] : m.model;
      map.set(provider, (map.get(provider) ?? 0) + (m.tokens ?? 0));
    }
  }
  return [...map.entries()].map(([provider, tokens]) => ({ provider, tokens })).sort((a, b) => b.tokens - a.tokens);
}
function averageCacheHitRate(days) {
  if (days.length === 0) return 0;
  const sum = days.reduce((acc, d) => acc + (d.cacheHitRate ?? 0), 0);
  return sum / days.length;
}
function filterDaysByProvider(days, provider) {
  const p = (provider ?? "all").trim();
  if (p === "" || p === "all") return days;
  return days.map((d) => {
    const matched = (d.models ?? []).filter((m) => splitModelKey(m.model).provider === p);
    if (matched.length === (d.models?.length ?? 0)) return d;
    let input = 0;
    let output = 0;
    let cacheRead = 0;
    let cacheWrite = 0;
    for (const m of matched) {
      input += m.inputTokens ?? 0;
      output += m.outputTokens ?? 0;
      cacheRead += m.cacheReadTokens ?? 0;
      cacheWrite += m.cacheWriteTokens ?? 0;
    }
    const prompt = input + cacheRead + cacheWrite;
    return {
      ...d,
      inputTokens: input,
      outputTokens: output,
      cacheReadTokens: cacheRead,
      cacheWriteTokens: cacheWrite,
      tokens: input + output + cacheRead + cacheWrite,
      cacheHitRate: prompt > 0 ? cacheRead / prompt * 100 : 0,
      models: matched
    };
  });
}
function sumActivity(days) {
  let requests = 0;
  let workMs = 0;
  for (const d of days) {
    requests += d.requests ?? 0;
    workMs += d.workMs ?? 0;
  }
  return { requests, workMs };
}

// src/client/usage/dashboard/range.ts
function toDayStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromDayStr(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function addDays(d, n) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function rangeDays(r) {
  return Math.round((fromDayStr(r.end).getTime() - fromDayStr(r.start).getTime()) / 864e5) + 1;
}
function resolveRange(preset, custom, now = /* @__PURE__ */ new Date()) {
  const today = toDayStr(now);
  switch (preset) {
    case "today":
      return { range: { start: today, end: today }, label: "\u4ECA\u65E5" };
    case "yesterday": {
      const y = toDayStr(addDays(now, -1));
      return { range: { start: y, end: y }, label: "\u6628\u65E5" };
    }
    case "7d":
      return { range: { start: toDayStr(addDays(now, -6)), end: today }, label: "\u8FD1 7 \u5929" };
    case "30d":
      return { range: { start: toDayStr(addDays(now, -29)), end: today }, label: "\u8FD1 30 \u5929" };
    case "month": {
      const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      return { range: { start, end: today }, label: "\u672C\u6708" };
    }
    case "lastMonth": {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return { range: { start: toDayStr(first), end: toDayStr(last) }, label: "\u4E0A\u6708" };
    }
    case "year":
      return { range: { start: `${now.getFullYear()}-01-01`, end: today }, label: "\u4ECA\u5E74" };
    case "all":
      return { range: { start: "2000-01-01", end: today }, label: "\u5168\u90E8" };
    case "custom":
      return { range: custom ?? { start: today, end: today }, label: custom !== null ? `${custom.start} ~ ${custom.end}` : "\u81EA\u5B9A\u4E49" };
  }
}
function prevRange(r) {
  const n = rangeDays(r);
  return {
    start: toDayStr(addDays(fromDayStr(r.start), -n)),
    end: toDayStr(addDays(fromDayStr(r.end), -n))
  };
}
function filterDays(days, r) {
  return days.filter((d) => d.date >= r.start && d.date <= r.end);
}
function weekStart(s) {
  const d = fromDayStr(s);
  const dow = (d.getDay() + 6) % 7;
  return toDayStr(addDays(d, -dow));
}
function aggregateSeries(days, grain) {
  const buckets = /* @__PURE__ */ new Map();
  for (const d of days) {
    const key = grain === "day" ? d.date : grain === "week" ? weekStart(d.date) : d.date.slice(0, 7);
    const arr = buckets.get(key);
    if (arr) arr.push(d);
    else buckets.set(key, [d]);
  }
  return [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([label, group]) => {
    let input = 0, output = 0, cache = 0;
    for (const d of group) {
      input += d.inputTokens ?? 0;
      output += d.outputTokens ?? 0;
      cache += (d.cacheReadTokens ?? 0) + (d.cacheWriteTokens ?? 0);
    }
    return { label, input, output, cache };
  });
}
function hourLabel(hour, multiDay) {
  const hh = hour.slice(11, 13);
  const mmdd = hour.slice(5, 10);
  return multiDay ? `${mmdd} ${hh}:00` : `${hh}:00`;
}
function aggregateHourSeries(hours, r) {
  const multiDay = r.start !== r.end;
  const buckets = /* @__PURE__ */ new Map();
  for (const h of hours) {
    const day = h.hour.slice(0, 10);
    if (day < r.start || day > r.end) continue;
    const arr = buckets.get(h.hour);
    if (arr) arr.push(h);
    else buckets.set(h.hour, [h]);
  }
  return [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([hour, group]) => {
    let input = 0, output = 0, cache = 0;
    for (const h of group) {
      input += h.inputTokens ?? 0;
      output += h.outputTokens ?? 0;
      cache += (h.cacheReadTokens ?? 0) + (h.cacheWriteTokens ?? 0);
    }
    return { label: hourLabel(hour, multiDay), input, output, cache };
  });
}
function deltaPercent(current, previous) {
  if (previous <= 0) return current > 0 ? null : 0;
  return (current - previous) / previous * 100;
}
function dailyAverage(days) {
  if (days.length === 0) return 0;
  const total = days.reduce((acc, d) => acc + (d.tokens ?? 0), 0);
  return total / days.length;
}

// src/client/usage/dashboard/format.ts
function formatYiExact(n) {
  if (!isFinite(n) || n < 1e8) return null;
  const yi = n / 1e8;
  const yiText = yi >= 100 ? String(Math.round(yi)) : yi.toFixed(1).replace(/\.0$/, "");
  return { yi: `${yiText} \u4EBF`, exact: n.toLocaleString("en-US") };
}
function formatUnits(n) {
  if (!isFinite(n) || n < 0) return String(n);
  if (n >= 1e8) {
    const v = n / 1e8;
    return `${v >= 100 ? Math.round(v) : v.toFixed(v >= 10 ? 1 : 2).replace(/\.?0+$/, "")}\u4EBF`;
  }
  if (n >= 1e4) {
    const v = n / 1e4;
    return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")}\u4E07`;
  }
  return String(Math.round(n));
}
function formatExact(n) {
  return n.toLocaleString("en-US");
}
function formatHitRate(n) {
  if (n === null || n === void 0 || !isFinite(n)) return "\u2014";
  return `${n.toFixed(2)}%`;
}
function relativeTime2(ts, now = Date.now()) {
  const diff = ts - now;
  const abs = Math.abs(diff);
  const minute = 6e4;
  const hour = 36e5;
  const day = 864e5;
  if (abs < minute) return "\u521A\u521A";
  const future = diff > 0;
  if (abs < hour) return `${Math.round(abs / minute)} \u5206\u949F${future ? "\u540E" : "\u524D"}`;
  if (abs < day) return `${Math.round(abs / hour)} \u5C0F\u65F6${future ? "\u540E" : "\u524D"}`;
  return `${Math.round(abs / day)} \u5929${future ? "\u540E" : "\u524D"}`;
}
function formatWorkDuration(ms) {
  if (!isFinite(ms) || ms <= 0) return "\u2014";
  const totalMinutes = Math.round(ms / 6e4);
  if (totalMinutes < 1) return "\u4E0D\u8DB31\u5206\u949F";
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const days = Math.floor(totalMinutes / 1440);
  if (days > 0) return `${days}\u5929${hours > 0 ? `${hours}\u5C0F\u65F6` : ""}`;
  if (hours > 0) return `${hours}\u5C0F\u65F6${minutes > 0 ? `${minutes}\u5206` : ""}`;
  return `${minutes}\u5206\u949F`;
}

// src/client/usage/dashboard/theme.ts
var PALETTE = ["#4f8cff", "#7c6bff", "#22b8cf", "#51cf66", "#ffa94d", "#f06595", "#ff6b6b", "#868e96"];
function providerPalette() {
  return [...PALETTE];
}

// src/client/usage/dashboard/charts/BarChart.tsx
var import_react14 = require("react");
var import_react_dom5 = require("react-dom");

// src/client/usage/dashboard/charts/ChartTooltip.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function ChartTooltip({ x, y, children, placement = "top" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: {
    position: "fixed",
    left: x,
    top: y,
    zIndex: 6100,
    transform: placement === "top" ? "translate(-50%, calc(-100% - 10px))" : "translate(-50%, 14px)",
    background: "var(--dsw-alias-bg-layer-3)",
    border: "1px solid var(--dsw-alias-border-l2)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 12,
    lineHeight: 1.5,
    boxShadow: "0 8px 24px rgba(0,0,0,.3)",
    pointerEvents: "none",
    whiteSpace: "nowrap"
  }, children });
}

// src/client/usage/dashboard/charts/AreaChart.tsx
var import_react13 = require("react");
var import_react_dom4 = require("react-dom");
var import_jsx_runtime10 = require("react/jsx-runtime");
var SERIES_NAME = { input: "\u8F93\u5165", output: "\u8F93\u51FA", cache: "\u7F13\u5B58" };
var DEFAULT_COLORS = {
  input: "var(--dsw-alias-state-business-primary)",
  output: "#22b8cf",
  cache: "var(--dsw-alias-label-tertiary)"
};
var STYLE_ID6 = "dsh-usage-area-chart-styles";
var ANIM_SHEET = `
@keyframes dsh-area-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
/* \u6CE8\u610F\uFF1A\u4E0D\u80FD\u5E26 fill-mode both/forwards \u2014\u2014 \u52A8\u753B\u7ED3\u675F\u540E\u6B8B\u7559 transform \u4F1A\u8BA9\u5185\u90E8 position:fixed \u7684
   tooltip \u5B9A\u4F4D\u57FA\u51C6\u53D8\u6210\u56FE\u8868\u5BB9\u5668\uFF08\u800C\u975E\u89C6\u53E3\uFF09\uFF0C\u5BFC\u81F4\u6D6E\u5C42\u9519\u4F4D\u3002 */
.dsh-area-chart { animation: var(--dsh-chart-anim, dsh-area-rise .5s cubic-bezier(.2,.8,.2,1)); }
.dsh-area-chart .dsh-area-hover { opacity: 0; transition: opacity .15s ease; }
.dsh-area-chart:hover .dsh-area-hover { opacity: 1; }
/* \u2500\u2500 \u79FB\u52A8\u7AEF\uFF1A\u56FE\u4F8B\u5141\u8BB8\u6362\u884C\uFF0Ctooltip \u6570\u503C\u884C min-width \u5F52\u96F6\uFF08\u4E0D\u6491\u7834\u89C6\u53E3\uFF09\u3002
    \u5185\u8054 minWidth \u9700 !important \u538B\u8FC7\uFF1B\u672C\u5757\u6CE8\u91CA\u672A\u5199\u51FA\u300C\u661F\u53F7\u7D27\u8DDF\u6B63\u659C\u6760\u300D\u5E8F\u5217\u3002 \u2500\u2500 */
@media (max-width: 767.98px) {
  .dsh-area-legend { flex-wrap: wrap; gap: 6px; font-size: 10px; }
  .dsh-chart-tip-row { min-width: 0 !important; flex-wrap: wrap; }
}
`;
function ensureAreaChartStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID6) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID6;
  tag.textContent = ANIM_SHEET;
  document.head.appendChild(tag);
}
var uidCounter = 0;
function smoothPath(pts) {
  if (pts.length === 0) return "";
  if (pts.length < 3) return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}
function niceTicks(max, count = 4) {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + step * 0.5; v += step) ticks.push(v);
  return ticks.length >= 2 ? ticks : [0, step];
}
function axisLabel(label) {
  if (label.includes(":")) return label;
  if (label.length >= 8) return label.slice(5);
  if (label.length === 7) return label.slice(2);
  return label;
}
function AreaChart({ data, height = 240, colors = DEFAULT_COLORS, variant = "full" }) {
  const [hover, setHover] = (0, import_react13.useState)(null);
  const wrapRef = (0, import_react13.useRef)(null);
  const [wrapW, setWrapW] = (0, import_react13.useState)(0);
  (0, import_react13.useEffect)(ensureAreaChartStyles, []);
  (0, import_react13.useEffect)(() => {
    const el = wrapRef.current;
    if (el === null || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setWrapW(el.clientWidth);
    });
    ro.observe(el);
    setWrapW(el.clientWidth);
    return () => {
      ro.disconnect();
    };
  }, []);
  const W = 800, H = height;
  const PAD = { l: 48, r: 16, t: 20, b: 26 };
  const renderH = wrapW > 0 ? Math.max(120, Math.round(wrapW * H / W)) : H;
  const gradId = (0, import_react13.useMemo)(() => `dsh-area-grad-${++uidCounter}`, []);
  const visibleKeys = variant === "io" ? ["input", "output"] : ["input", "output", "cache"];
  const topCache = (0, import_react13.useMemo)(() => data.map((d) => variant === "io" ? 0 : d.cache), [data, variant]);
  const topOut = (0, import_react13.useMemo)(() => data.map((d, i) => topCache[i] + d.output), [data, topCache]);
  const topIn = (0, import_react13.useMemo)(() => data.map((d, i) => topOut[i] + d.input), [data, topOut]);
  const maxVal = topIn.length > 0 ? Math.max(0, ...topIn) : 0;
  const ticks = (0, import_react13.useMemo)(() => niceTicks(maxVal || 1), [maxVal]);
  const chartMax = ticks[ticks.length - 1] || 1;
  const x = (i) => PAD.l + i / Math.max(1, data.length - 1) * (W - PAD.l - PAD.r);
  const y = (v) => H - PAD.b - v / chartMax * (H - PAD.t - PAD.b);
  const clampY = (v) => Math.max(PAD.t, Math.min(H - PAD.b, y(v)));
  const areaPath = (top, base) => {
    if (data.length === 0) return "";
    const pts = top.map((v, i) => ({ x: x(i), y: clampY(v) }));
    return `${smoothPath(pts)} L ${x(data.length - 1).toFixed(2)} ${y(base[data.length - 1]).toFixed(2)} L ${x(0).toFixed(2)} ${y(base[0]).toFixed(2)} Z`;
  };
  const linePath = (top) => smoothPath(top.map((v, i) => ({ x: x(i), y: clampY(v) })));
  const labelStep = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor((W - PAD.l - PAD.r) / 70))));
  if (data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13 }, children: "\u6682\u65E0\u6570\u636E" });
  }
  const hoverPoint = hover !== null ? data[hover.index] : void 0;
  const hoverTotal = hoverPoint !== void 0 ? hoverPoint.input + hoverPoint.output + (variant === "io" ? 0 : hoverPoint.cache) : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { ref: wrapRef, className: "dsh-area-chart", style: { position: "relative", paddingTop: 16 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "dsh-area-legend", style: { position: "absolute", top: 0, right: 0, display: "flex", gap: 14, pointerEvents: "none" }, children: visibleKeys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--dsw-alias-label-secondary)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { width: 8, height: 8, borderRadius: 2, background: colors[k], flex: "none" } }),
      SERIES_NAME[k]
    ] }, k)) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: renderH, children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("defs", { children: ["input", "output", "cache"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("linearGradient", { id: `${gradId}-${k}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("stop", { offset: "0%", stopColor: colors[k], stopOpacity: 0.95 }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("stop", { offset: "100%", stopColor: colors[k], stopOpacity: 0.1 })
      ] }, k)) }),
      ticks.map((v) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("g", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("line", { x1: PAD.l, x2: W - PAD.r, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1)", strokeDasharray: "4 4" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("text", { x: PAD.l - 8, y: y(v) + 3.5, fontSize: 10.5, fill: "var(--dsw-alias-label-tertiary)", textAnchor: "end", children: formatUnits(v) })
      ] }, v)),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("line", { x1: PAD.l, x2: W - PAD.r, y1: H - PAD.b, y2: H - PAD.b, stroke: "var(--dsw-alias-border-l2)" }),
      variant === "full" && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: areaPath(topCache, topCache.map(() => 0)), fill: `url(#${gradId}-cache)` }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: linePath(topCache), fill: "none", stroke: colors.cache, strokeWidth: 1.5, strokeLinejoin: "round", strokeLinecap: "round" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: areaPath(topOut, topCache), fill: `url(#${gradId}-output)` }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: linePath(topOut), fill: "none", stroke: colors.output, strokeWidth: 1.5, strokeLinejoin: "round", strokeLinecap: "round" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: areaPath(topIn, topOut), fill: `url(#${gradId}-input)` }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { d: linePath(topIn), fill: "none", stroke: colors.input, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" }),
      hover !== null && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("g", { className: "dsh-area-hover", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("line", { x1: x(hover.index), x2: x(hover.index), y1: PAD.t, y2: H - PAD.b, stroke: "var(--dsw-alias-border-l3)", strokeDasharray: "3 3" }),
        (variant === "io" ? [["input", topIn], ["output", topOut]] : [["input", topIn], ["output", topOut], ["cache", topCache]]).map(([k, top]) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "circle",
          {
            cx: x(hover.index),
            cy: clampY(top[hover.index]),
            r: 4,
            fill: "var(--dsw-alias-bg-layer-2)",
            stroke: colors[k],
            strokeWidth: 2
          },
          k
        ))
      ] }),
      data.map((d, i) => i % labelStep === 0 || i === data.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "text",
        {
          x: x(i),
          y: H - 8,
          fontSize: 10.5,
          fill: "var(--dsw-alias-label-tertiary)",
          textAnchor: i === 0 ? "start" : i === data.length - 1 ? "end" : "middle",
          children: axisLabel(d.label)
        },
        d.label
      ) : null),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "rect",
        {
          x: PAD.l,
          y: PAD.t,
          width: W - PAD.l - PAD.r,
          height: H - PAD.t - PAD.b,
          fill: "transparent",
          onMouseMove: (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            const index = Math.min(data.length - 1, Math.round(t * (data.length - 1)));
            setHover({ index, x: e.clientX, y: e.clientY });
          },
          onMouseLeave: () => setHover(null)
        }
      )
    ] }),
    hover !== null && hoverPoint !== void 0 && typeof document !== "undefined" && (0, import_react_dom4.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(ChartTooltip, { x: hover.x, y: hover.y, placement: hover.y < 180 ? "bottom" : "top", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { fontWeight: 600, color: "var(--dsw-alias-label-primary)", marginBottom: 4 }, children: hoverPoint.label }),
        visibleKeys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "dsh-chart-tip-row", style: { display: "flex", alignItems: "center", gap: 8, minWidth: 170 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { width: 8, height: 8, borderRadius: 2, background: colors[k], flex: "none" } }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: SERIES_NAME[k] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { style: { marginLeft: "auto", color: "var(--dsw-alias-label-primary)", fontFamily: "ui-monospace, monospace" }, children: [
            formatUnits(hoverPoint[k]),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 11 }, children: [
              "(",
              formatExact(hoverPoint[k]),
              ")"
            ] })
          ] })
        ] }, k)),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "dsh-chart-tip-row", style: { borderTop: "1px solid var(--dsw-alias-border-l1)", marginTop: 5, paddingTop: 5, display: "flex", alignItems: "center", gap: 8, minWidth: 170 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: "\u5408\u8BA1" }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { style: { marginLeft: "auto", fontWeight: 600, color: "var(--dsw-alias-label-primary)", fontFamily: "ui-monospace, monospace" }, children: [
            formatUnits(hoverTotal),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 11 }, children: [
              "(",
              formatExact(hoverTotal),
              ")"
            ] })
          ] })
        ] })
      ] }),
      document.body
    )
  ] });
}

// src/client/usage/dashboard/charts/BarChart.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
var STYLE_ID7 = "dsh-usage-bar-chart-styles";
var ANIM_SHEET2 = `
@keyframes dsh-bar-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.dsh-bar-chart { animation: var(--dsh-chart-anim, dsh-bar-rise .5s cubic-bezier(.2,.8,.2,1)); }
.dsh-bar-chart .dsh-bar-hover { opacity: 0; transition: opacity .15s ease; }
.dsh-bar-chart:hover .dsh-bar-hover { opacity: 1; }
/* \u2500\u2500 \u79FB\u52A8\u7AEF\uFF1A\u56FE\u4F8B\u5141\u8BB8\u6362\u884C\uFF0Ctooltip \u6570\u503C\u884C min-width \u5F52\u96F6\uFF08\u4E0D\u6491\u7834\u89C6\u53E3\uFF09\u3002
    \u5185\u8054 minWidth \u9700 !important \u538B\u8FC7\uFF1B\u672C\u5757\u6CE8\u91CA\u672A\u5199\u51FA\u300C\u661F\u53F7\u7D27\u8DDF\u6B63\u659C\u6760\u300D\u5E8F\u5217\u3002 \u2500\u2500 */
@media (max-width: 767.98px) {
  .dsh-bar-legend { flex-wrap: wrap; gap: 6px; font-size: 10px; }
  .dsh-chart-tip-row { min-width: 0 !important; flex-wrap: wrap; }
}
`;
function ensureBarChartStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID7) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID7;
  tag.textContent = ANIM_SHEET2;
  document.head.appendChild(tag);
}
function seriesOf(variant) {
  return variant === "io" ? [
    { key: "input", name: "\u8F93\u5165 Tokens", color: "var(--dsw-alias-state-business-primary)" },
    { key: "output", name: "\u8F93\u51FA Tokens", color: "#7c5cf0" }
  ] : [
    { key: "input", name: "\u8F93\u5165", color: "var(--dsw-alias-state-business-primary)" },
    { key: "output", name: "\u8F93\u51FA", color: "#22b8cf" },
    { key: "cache", name: "\u7F13\u5B58\u8BFB\u53D6", color: "var(--dsw-alias-label-tertiary)" }
  ];
}
function BarChart({
  data,
  height = 240,
  movingAverage = 7,
  anomalies,
  onSelectAnomaly,
  variant = "full",
  baseline,
  format = formatUnits
}) {
  const [hover, setHover] = (0, import_react14.useState)(null);
  const wrapRef = (0, import_react14.useRef)(null);
  const [wrapW, setWrapW] = (0, import_react14.useState)(0);
  (0, import_react14.useEffect)(ensureBarChartStyles, []);
  (0, import_react14.useEffect)(() => {
    const el = wrapRef.current;
    if (el === null || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setWrapW(el.clientWidth);
    });
    ro.observe(el);
    setWrapW(el.clientWidth);
    return () => {
      ro.disconnect();
    };
  }, []);
  const series = seriesOf(variant);
  const W = 800, H = height;
  const PAD = { l: 48, r: 16, t: 20, b: 26 };
  const renderH = wrapW > 0 ? Math.max(120, Math.round(wrapW * H / W)) : H;
  const totals = data.map((d) => variant === "io" ? d.input + d.output : d.input + d.output + d.cache);
  const maxVal = totals.length > 0 ? Math.max(0, ...totals) : 0;
  const ticks = (0, import_react14.useMemo)(() => niceTicks(maxVal || 1), [maxVal]);
  const chartMax = ticks[ticks.length - 1] || 1;
  const slot = (W - PAD.l - PAD.r) / Math.max(1, data.length);
  const barW = Math.min(30, slot * 0.62);
  const cx = (i) => PAD.l + slot * i + slot / 2;
  const y = (v) => H - PAD.b - v / chartMax * (H - PAD.t - PAD.b);
  const clampY = (v) => Math.max(PAD.t, Math.min(H - PAD.b, y(v)));
  const maEnabled = movingAverage > 0 && baseline === void 0;
  const maLine = (0, import_react14.useMemo)(() => {
    if (!maEnabled) return null;
    const win = movingAverage > 0 ? Math.min(movingAverage, data.length) : 0;
    if (win < 2 || data.length < win) return null;
    const pts = totals.map((_, i) => {
      const start = Math.max(0, i - win + 1);
      let sum = 0;
      for (let k = start; k <= i; k++) sum += totals[k];
      return { x: cx(i), y: clampY(sum / (i - start + 1)) };
    });
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  }, [data, chartMax, movingAverage, W, H, maEnabled]);
  const baselinePath = (0, import_react14.useMemo)(() => {
    if (baseline === void 0) return null;
    let d = "";
    let pen = false;
    baseline.values.forEach((v, i) => {
      if (v === null || !isFinite(v)) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"} ${cx(i).toFixed(2)} ${clampY(v).toFixed(2)} `;
      pen = true;
    });
    return d.trim() || null;
  }, [baseline, chartMax, W, H]);
  const plotW = W - PAD.l - PAD.r;
  const labelStep = Math.max(1, Math.ceil(data.length * 56 / plotW));
  const labelIdxs = [];
  for (let i = 0; i < data.length; i += labelStep) labelIdxs.push(i);
  const lastIdx = data.length - 1;
  if (labelIdxs[labelIdxs.length - 1] !== lastIdx && lastIdx >= 0) {
    const prevCenter = cx(labelIdxs[labelIdxs.length - 1] ?? 0);
    if (cx(lastIdx) - prevCenter >= 40) labelIdxs.push(lastIdx);
  }
  if (data.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13 }, children: "\u6682\u65E0\u6570\u636E" });
  }
  const hoverPoint = hover !== null ? data[hover.index] : void 0;
  const hoverTotal = hover !== null ? totals[hover.index] : 0;
  const hoverMa = (() => {
    if (!maEnabled) return null;
    const win = movingAverage > 0 ? Math.min(movingAverage, data.length) : 0;
    if (win < 2 || hover === null || data.length < win) return null;
    const start = Math.max(0, hover.index - win + 1);
    let sum = 0;
    for (let k = start; k <= hover.index; k++) sum += totals[k];
    return sum / (hover.index - start + 1);
  })();
  const hoverAnomaly = hoverPoint !== void 0 && anomalies !== void 0 ? anomalies.get(hoverPoint.label) : void 0;
  const hoverBaseline = hover !== null && baseline !== void 0 ? baseline.values[hover.index] : void 0;
  const legendSwatch = (s) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flex: "none",
    background: s.key === "cache" ? "color-mix(in srgb, var(--dsw-alias-label-tertiary) 22%, transparent)" : series.find((x) => x.key === s.key)?.color,
    border: s.key === "cache" ? "1px dashed var(--dsw-alias-border-l3)" : "none"
  } });
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { ref: wrapRef, className: "dsh-bar-chart", style: { position: "relative", paddingTop: 16 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "dsh-bar-legend", style: { position: "absolute", top: 0, right: 0, display: "flex", gap: 14, pointerEvents: "none", alignItems: "center" }, children: [
      series.map((s) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--dsw-alias-label-secondary)" }, children: [
        legendSwatch(s),
        s.name
      ] }, s.key)),
      baseline !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--dsw-alias-label-secondary)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { width: 12, height: 0, borderTop: "2px dashed var(--dsw-alias-label-tertiary)", flex: "none" } }),
        baseline.label
      ] }),
      maEnabled && maLine !== null && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--dsw-alias-label-secondary)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { width: 12, height: 0, borderTop: "2px solid var(--dsw-alias-state-warn-label)", flex: "none" } }),
        "MA",
        Math.min(movingAverage, data.length)
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: renderH, children: [
      ticks.map((v) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("g", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { x1: PAD.l, x2: W - PAD.r, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1)", strokeDasharray: "4 4" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("text", { x: PAD.l - 8, y: y(v) + 3.5, fontSize: 10.5, fill: "var(--dsw-alias-label-tertiary)", textAnchor: "end", children: format(v) })
      ] }, v)),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("line", { x1: PAD.l, x2: W - PAD.r, y1: H - PAD.b, y2: H - PAD.b, stroke: "var(--dsw-alias-border-l2)" }),
      data.map((d, i) => {
        const x0 = cx(i) - barW / 2;
        const segs = variant === "io" ? [
          { v: d.input, fill: series[0].color },
          { v: d.output, fill: series[1].color }
        ] : [
          { v: d.input, fill: series[0].color },
          { v: d.output, fill: series[1].color },
          { v: d.cache, fill: "color-mix(in srgb, var(--dsw-alias-label-tertiary) 22%, transparent)", dashed: true }
        ];
        let acc = 0;
        const isAnomaly = anomalies?.has(d.label) ?? false;
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("g", { children: [
          segs.map((seg, si) => {
            const yTop = clampY(acc + seg.v);
            const yBottom = clampY(acc);
            const h = Math.max(0, yBottom - yTop);
            acc += seg.v;
            if (h <= 0) return null;
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
              "rect",
              {
                x: x0,
                y: yTop,
                width: barW,
                height: h,
                fill: seg.fill,
                stroke: seg.dashed === true ? "var(--dsw-alias-border-l3)" : "none",
                strokeWidth: seg.dashed === true ? 0.75 : 0,
                strokeDasharray: seg.dashed === true ? "2 2" : void 0,
                rx: si === segs.length - 1 ? 2 : 0
              },
              si
            );
          }),
          isAnomaly && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: cx(i), cy: clampY(totals[i]) - 7, r: 3.5, fill: "var(--dsw-alias-state-error-primary)" })
        ] }, d.label);
      }),
      baselinePath !== null && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "path",
        {
          d: baselinePath,
          fill: "none",
          stroke: "var(--dsw-alias-label-tertiary)",
          strokeWidth: 1.5,
          strokeDasharray: "5 4",
          strokeLinejoin: "round",
          strokeLinecap: "round",
          opacity: 0.95
        }
      ),
      maLine !== null && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "path",
        {
          d: maLine,
          fill: "none",
          stroke: "var(--dsw-alias-state-warn-label)",
          strokeWidth: 1.75,
          strokeLinejoin: "round",
          strokeLinecap: "round",
          opacity: 0.9
        }
      ),
      hover !== null && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("g", { className: "dsh-bar-hover", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "rect",
          {
            x: PAD.l + slot * hover.index,
            y: PAD.t,
            width: slot,
            height: H - PAD.t - PAD.b,
            fill: "var(--dsw-alias-border-l1)",
            opacity: 0.35
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "line",
          {
            x1: cx(hover.index),
            x2: cx(hover.index),
            y1: PAD.t,
            y2: H - PAD.b,
            stroke: "var(--dsw-alias-border-l3)",
            strokeDasharray: "3 3"
          }
        )
      ] }),
      labelIdxs.map((i) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "text",
        {
          x: cx(i),
          y: H - 8,
          fontSize: 10.5,
          fill: "var(--dsw-alias-label-tertiary)",
          textAnchor: i === 0 ? "start" : i === lastIdx ? "end" : "middle",
          children: axisLabel(data[i]?.label ?? "")
        },
        data[i]?.label ?? i
      )),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "rect",
        {
          x: PAD.l,
          y: PAD.t,
          width: W - PAD.l - PAD.r,
          height: H - PAD.t - PAD.b,
          fill: "transparent",
          onMouseMove: (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            const index = Math.min(data.length - 1, Math.floor(t * data.length));
            setHover({ index, x: e.clientX, y: e.clientY });
          },
          onMouseLeave: () => setHover(null)
        }
      ),
      anomalies !== void 0 && onSelectAnomaly !== void 0 && data.map((d, i) => {
        if (!anomalies.has(d.label)) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("g", { onClick: () => onSelectAnomaly(d.label), style: { cursor: "pointer" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("title", { children: `\u67E5\u770B ${d.label} \u7684\u4F1A\u8BDD\uFF08\u5F02\u5E38\u65E5 ${multipleText(anomalies.get(d.label)?.multiple)}\uFF09` }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("circle", { cx: cx(i), cy: clampY(totals[i]) - 7, r: 10, fill: "transparent" })
        ] }, `hit-${d.label}`);
      })
    ] }),
    hover !== null && hoverPoint !== void 0 && typeof document !== "undefined" && (0, import_react_dom5.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(ChartTooltip, { x: hover.x, y: hover.y, placement: hover.y < 180 ? "bottom" : "top", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { fontWeight: 600, color: "var(--dsw-alias-label-primary)", marginBottom: 4 }, children: [
          hoverPoint.label,
          anomalies?.has(hoverPoint.label) && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { marginLeft: 6, fontSize: 11, fontWeight: 500, color: "var(--dsw-alias-state-error-primary)" }, children: [
            "\u5F02\u5E38\u65E5 ",
            multipleText(anomalies.get(hoverPoint.label)?.multiple)
          ] })
        ] }),
        [...series].reverse().map((s) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "dsh-chart-tip-row", style: { display: "flex", alignItems: "center", gap: 8, minWidth: 180 }, children: [
          legendSwatch(s),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: s.name }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { marginLeft: "auto", color: "var(--dsw-alias-label-primary)", fontFamily: MONO }, children: [
            format(hoverPoint[s.key]),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 11 }, children: [
              "(",
              formatExact(hoverPoint[s.key]),
              ")"
            ] })
          ] })
        ] }, s.key)),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { borderTop: "1px solid var(--dsw-alias-border-l1)", marginTop: 5, paddingTop: 5, display: "flex", alignItems: "center", gap: 8, minWidth: 180 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: "\u5408\u8BA1" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { marginLeft: "auto", fontWeight: 600, color: "var(--dsw-alias-label-primary)", fontFamily: MONO }, children: [
            format(hoverTotal),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 11 }, children: [
              "(",
              formatExact(hoverTotal),
              ")"
            ] })
          ] })
        ] }),
        hoverBaseline !== null && hoverBaseline !== void 0 && isFinite(hoverBaseline) && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 180, marginTop: 2 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { width: 12, height: 0, borderTop: "2px dashed var(--dsw-alias-label-tertiary)", flex: "none" } }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: baseline?.label }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { marginLeft: "auto", color: "var(--dsw-alias-label-primary)", fontFamily: MONO }, children: format(hoverBaseline) })
        ] }),
        hoverMa !== null && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 180, marginTop: 2 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { width: 12, height: 0, borderTop: "2px solid var(--dsw-alias-state-warn-label)", flex: "none" } }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: [
            "MA",
            Math.min(movingAverage, data.length)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { style: { marginLeft: "auto", color: "var(--dsw-alias-label-primary)", fontFamily: MONO }, children: format(hoverMa) })
        ] }),
        hoverAnomaly !== void 0 && onSelectAnomaly !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { style: { marginTop: 5, fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-state-error-primary)" }, children: "\u70B9\u51FB\u67F1\u9876\u7EA2\u70B9\u67E5\u770B\u8BE5\u65E5\u4F1A\u8BDD" })
      ] }),
      document.body
    )
  ] });
}
function multipleText(value) {
  if (value === void 0 || !isFinite(value)) return "";
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)}x`;
}

// src/client/usage/dashboard/charts/DonutChart.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
function DonutChart({ slices, centerTitle, centerValue }) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const R2 = 70, C = 2 * Math.PI * R2;
  let offset = 0;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", minWidth: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("svg", { viewBox: "0 0 180 180", width: 160, height: 160, style: { flex: "none", maxWidth: "100%" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("circle", { cx: 90, cy: 90, r: R2, fill: "none", stroke: "var(--dsw-alias-border-l2)", strokeWidth: 22 }),
      slices.map((s) => {
        const frac = s.value / total;
        const dash = frac * C;
        const el = /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "circle",
          {
            cx: 90,
            cy: 90,
            r: R2,
            fill: "none",
            stroke: s.color,
            strokeWidth: 22,
            strokeDasharray: `${dash} ${C - dash}`,
            strokeDashoffset: -offset,
            transform: "rotate(-90 90 90)"
          },
          s.label
        );
        offset += dash;
        return el;
      }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("text", { x: 90, y: 84, textAnchor: "middle", fontSize: 11, fill: "var(--dsw-alias-label-tertiary)", children: centerTitle }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("text", { x: 90, y: 106, textAnchor: "middle", fontSize: 18, fontWeight: 600, fill: "var(--dsw-alias-label-primary)", children: centerValue })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }, children: slices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: { width: 10, height: 10, borderRadius: 2, background: s.color, flex: "none" } }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: { color: "var(--dsw-alias-label-primary)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: s.label }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { style: { color: "var(--dsw-alias-label-tertiary)" }, children: [
        Math.round(s.value / total * 100),
        "%"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)", fontFamily: "ui-monospace, monospace" }, children: formatUnits(s.value) })
    ] }, s.label)) })
  ] });
}

// src/client/usage/dashboard/charts/ProviderLines.tsx
var import_react15 = require("react");
var import_react_dom6 = require("react-dom");
var import_jsx_runtime13 = require("react/jsx-runtime");
function ProviderLines({ series, labels, height = 240, format = formatUnits }) {
  const [hover, setHover] = (0, import_react15.useState)(null);
  const [hidden, setHidden] = (0, import_react15.useState)(/* @__PURE__ */ new Set());
  const wrapRef = (0, import_react15.useRef)(null);
  const [wrapW, setWrapW] = (0, import_react15.useState)(0);
  const palette = providerPalette();
  (0, import_react15.useEffect)(ensureLineStyles, []);
  (0, import_react15.useEffect)(() => {
    const el = wrapRef.current;
    if (el === null || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setWrapW(el.clientWidth);
    });
    ro.observe(el);
    setWrapW(el.clientWidth);
    return () => {
      ro.disconnect();
    };
  }, []);
  const visible = series.filter((s) => !hidden.has(s.provider));
  const W = 800, H = height;
  const PAD = { l: 48, r: 16, t: 16, b: 26 };
  const renderH = wrapW > 0 ? Math.max(120, Math.round(wrapW * H / W)) : H;
  const maxVal = (0, import_react15.useMemo)(() => {
    let m = 0;
    for (const s of visible) for (const v of s.values) if (v > m) m = v;
    return m;
  }, [visible]);
  const ticks = (0, import_react15.useMemo)(() => niceTicks(maxVal || 1), [maxVal]);
  const chartMax = ticks[ticks.length - 1] || 1;
  const n = labels.length;
  const x = (i) => n <= 1 ? (W - PAD.l - PAD.r) / 2 + PAD.l : PAD.l + i / (n - 1) * (W - PAD.l - PAD.r);
  const y = (v) => H - PAD.b - v / chartMax * (H - PAD.t - PAD.b);
  const clampY = (v) => Math.max(PAD.t, Math.min(H - PAD.b, y(v)));
  const colorOf = (p) => palette[series.findIndex((s) => s.provider === p) % palette.length];
  const toggle = (p) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else if (visible.length > 1) next.add(p);
      return next;
    });
  };
  const labelStep = Math.max(1, Math.ceil(n / Math.max(1, Math.floor((W - PAD.l - PAD.r) / 76))));
  const hoverLabel = hover !== null ? labels[hover.index] : void 0;
  if (series.length === 0 || n === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: { height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13 }, children: "\u6682\u65E0\u6570\u636E" });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { ref: wrapRef, className: "dsh-prov-lines", style: { position: "relative", paddingTop: 22 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: { position: "absolute", top: 0, right: 0, display: "flex", gap: 12, flexWrap: "wrap", maxWidth: "100%" }, children: series.map((s) => {
      const off = hidden.has(s.provider);
      const total = s.values.reduce((a, v) => a + v, 0);
      return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
        "button",
        {
          type: "button",
          onClick: () => {
            toggle(s.provider);
          },
          title: off ? "\u70B9\u51FB\u663E\u793A" : "\u70B9\u51FB\u9690\u85CF",
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 11,
            padding: 0,
            color: off ? "var(--dsw-alias-label-tertiary)" : "var(--dsw-alias-label-secondary)",
            opacity: off ? 0.55 : 1,
            transition: "opacity 140ms ease"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { style: { width: 14, height: 3, borderRadius: 2, background: colorOf(s.provider), flex: "none" } }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { style: { textDecoration: off ? "line-through" : void 0 }, children: s.provider }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { style: { fontFamily: "ui-monospace, monospace", color: "var(--dsw-alias-label-tertiary)" }, children: format(total) })
          ]
        },
        s.provider
      );
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: renderH, children: [
      ticks.map((v) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("g", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("line", { x1: PAD.l, x2: W - PAD.r, y1: y(v), y2: y(v), stroke: "var(--dsw-alias-border-l1)", strokeDasharray: "4 4" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("text", { x: PAD.l - 8, y: y(v) + 3.5, fontSize: 10.5, fill: "var(--dsw-alias-label-tertiary)", textAnchor: "end", children: formatUnits(v) })
      ] }, v)),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("line", { x1: PAD.l, x2: W - PAD.r, y1: H - PAD.b, y2: H - PAD.b, stroke: "var(--dsw-alias-border-l2)" }),
      visible.map((s) => {
        const pts = s.values.map((v, i) => ({ x: x(i), y: clampY(v) }));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("g", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "path",
            {
              d,
              fill: "none",
              stroke: colorOf(s.provider),
              strokeWidth: 2,
              strokeLinejoin: "round",
              strokeLinecap: "round",
              pathLength: 1,
              className: "dsh-prov-line"
            }
          ),
          n <= 1 && pts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("circle", { cx: p.x, cy: p.y, r: 4, fill: colorOf(s.provider) }, i))
        ] }, s.provider);
      }),
      hover !== null && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("g", { className: "dsh-prov-hover", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("line", { x1: x(hover.index), x2: x(hover.index), y1: PAD.t, y2: H - PAD.b, stroke: "var(--dsw-alias-border-l3)", strokeDasharray: "3 3" }),
        visible.map((s) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          "circle",
          {
            cx: x(hover.index),
            cy: clampY(s.values[hover.index]),
            r: 4,
            fill: "var(--dsw-alias-bg-layer-2)",
            stroke: colorOf(s.provider),
            strokeWidth: 2
          },
          s.provider
        ))
      ] }),
      labels.map((lb, i) => i % labelStep === 0 || i === n - 1 ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        "text",
        {
          x: x(i),
          y: H - 8,
          fontSize: 10.5,
          fill: "var(--dsw-alias-label-tertiary)",
          textAnchor: i === 0 ? "start" : i === n - 1 ? "end" : "middle",
          children: axisLabel(lb)
        },
        `${lb}-${i}`
      ) : null),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        "rect",
        {
          x: PAD.l,
          y: PAD.t,
          width: W - PAD.l - PAD.r,
          height: H - PAD.t - PAD.b,
          fill: "transparent",
          onMouseMove: (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            const index = n <= 1 ? 0 : Math.min(n - 1, Math.round(t * (n - 1)));
            setHover({ index, x: e.clientX, y: e.clientY });
          },
          onMouseLeave: () => setHover(null)
        }
      )
    ] }),
    hover !== null && hoverLabel !== void 0 && typeof document !== "undefined" && (0, import_react_dom6.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(ChartTooltip, { x: hover.x, y: hover.y, placement: hover.y < 200 ? "bottom" : "top", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: { fontWeight: 600, color: "var(--dsw-alias-label-primary)", marginBottom: 4 }, children: hoverLabel }),
        visible.map((s) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "dsh-chart-tip-row", style: { display: "flex", alignItems: "center", gap: 8, minWidth: 170 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { style: { width: 8, height: 8, borderRadius: 2, background: colorOf(s.provider), flex: "none" } }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: s.provider }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { style: { marginLeft: "auto", color: "var(--dsw-alias-label-primary)", fontFamily: "ui-monospace, monospace" }, children: [
            format(s.values[hover.index]),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 11 }, children: [
              "(",
              formatExact(s.values[hover.index]),
              ")"
            ] })
          ] })
        ] }, s.provider))
      ] }),
      document.body
    )
  ] });
}
var STYLE_ID8 = "dsh-usage-prov-lines-styles";
var ANIM_SHEET3 = `
@keyframes dsh-prov-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes dsh-prov-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.dsh-prov-lines { animation: var(--dsh-chart-anim, dsh-prov-rise .5s cubic-bezier(.2,.8,.2,1)); }
.dsh-prov-lines .dsh-prov-line { stroke-dasharray: 1; animation: dsh-prov-draw .9s cubic-bezier(.3,.7,.3,1); }
.dsh-prov-lines .dsh-prov-hover { opacity: 0; transition: opacity .15s ease; }
.dsh-prov-lines:hover .dsh-prov-hover { opacity: 1; }
@media (max-width: 767.98px) {
  .dsh-chart-tip-row { min-width: 0 !important; flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-prov-lines, .dsh-prov-lines .dsh-prov-line { animation: none; }
}
`;
function ensureLineStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID8) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID8;
  tag.dataset.plugin = "dsh-triad";
  tag.textContent = ANIM_SHEET3;
  document.head.appendChild(tag);
}

// src/client/usage/dashboard/charts/RankBars.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
function RankBars({ rows, maxRows = 10, nameWidth = 200, ranked = false, dot = true }) {
  const palette = providerPalette();
  const visible = rows.slice(0, maxRows);
  const max = visible[0]?.value ?? 1;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", flexDirection: "column" }, children: [
    visible.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }, children: [
      ranked && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { width: 18, flex: "none", textAlign: "right", fontSize: 11, fontFamily: "ui-monospace, monospace", color: "var(--dsw-alias-label-tertiary)" }, children: i + 1 }),
      dot && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { width: 10, height: 10, borderRadius: 3, background: palette[i % palette.length], flex: "none" } }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { width: nameWidth, flex: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--dsw-alias-label-primary)", fontSize: 12 }, title: row.label, children: row.label }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        "span",
        {
          style: { flex: "none", fontSize: 11, lineHeight: "16px", fontFamily: "ui-monospace, monospace", color: "var(--dsw-alias-label-tertiary)", whiteSpace: "nowrap" },
          title: row.hitRate !== null && row.hitRate !== void 0 ? `\u7F13\u5B58\u547D\u4E2D\u7387 ${formatHitRate(row.hitRate)}` : "\u65E0\u547D\u4E2D\u7387\u6570\u636E",
          children: row.hitRate !== null && row.hitRate !== void 0 ? formatHitRate(row.hitRate) : "\u2014"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { flex: 1, height: 8, borderRadius: 4, background: "var(--dsw-alias-border-l2)", overflow: "hidden", minWidth: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { height: "100%", width: `${Math.max(2, row.value / (max || 1) * 100)}%`, background: palette[i % palette.length], borderRadius: 4, transition: "width .45s cubic-bezier(.2,.8,.2,1)" } }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { flex: "none", width: 64, textAlign: "right", color: "var(--dsw-alias-label-secondary)", fontSize: 12, fontFamily: "ui-monospace, monospace" }, children: formatUnits(row.value) })
    ] }, row.label)),
    rows.length > maxRows && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)", paddingTop: 4 }, children: [
      "\u5176\u4ED6 ",
      rows.length - maxRows,
      " \u4E2A \xB7 \u5408\u8BA1 ",
      formatUnits(rows.slice(maxRows).reduce((a, r) => a + r.value, 0))
    ] })
  ] });
}

// src/client/usage/dashboard/dash.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var MONO2 = "ui-monospace, SFMono-Regular, Menlo, monospace";
var surface = {
  border: "1px solid var(--dsw-alias-border-l1)",
  borderRadius: 16,
  background: "var(--dsw-alias-bg-module-platform)",
  boxSizing: "border-box",
  minWidth: 0
};
function panel(padding = 16, gap = 12) {
  return { ...surface, padding, display: "flex", flexDirection: "column", gap, minWidth: 0 };
}

// src/client/usage/dashboard/charts/Gauge.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var R = 88;
var ARC = Math.PI * R;
function Gauge({ percent, label, size = 190 }) {
  const valid = percent !== null && isFinite(percent);
  const p = valid ? Math.max(0, Math.min(100, percent)) : 0;
  const rad = Math.PI * (1 - p / 100);
  const knobX = 110 + R * Math.cos(rad);
  const knobY = 118 - R * Math.sin(rad);
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { style: { flex: "none", width: size, display: "flex", flexDirection: "column", alignItems: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("svg", { viewBox: "0 0 220 136", width: size, height: Math.round(size * 136 / 220), role: "img", "aria-label": `${label} ${valid ? `${p.toFixed(0)}%` : "\u6682\u65E0\u6570\u636E"}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("path", { d: "M 22 118 A 88 88 0 0 1 198 118", fill: "none", stroke: "var(--dsw-alias-border-l2)", strokeWidth: 10, strokeLinecap: "round" }),
    valid && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "path",
      {
        d: "M 22 118 A 88 88 0 0 1 198 118",
        fill: "none",
        stroke: "var(--dsw-alias-state-business-primary)",
        strokeWidth: 10,
        strokeLinecap: "round",
        strokeDasharray: `${ARC} ${ARC}`,
        strokeDashoffset: ARC * (1 - p / 100),
        style: { transition: "stroke-dashoffset .45s cubic-bezier(.2,.8,.2,1)" }
      }
    ),
    valid && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "circle",
      {
        cx: knobX,
        cy: knobY,
        r: 6,
        fill: "var(--dsw-alias-bg-module-platform)",
        stroke: "var(--dsw-alias-state-business-primary)",
        strokeWidth: 3,
        style: { transition: "cx .45s cubic-bezier(.2,.8,.2,1), cy .45s cubic-bezier(.2,.8,.2,1)" }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("text", { x: 110, y: 100, textAnchor: "middle", fontSize: 30, fontWeight: 600, fontFamily: MONO2, fill: "var(--dsw-alias-label-primary)", children: valid ? `${p.toFixed(p >= 10 ? 1 : 2)}%` : "\u2014" }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("text", { x: 110, y: 122, textAnchor: "middle", fontSize: 12, fill: "var(--dsw-alias-label-secondary)", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("text", { x: 20, y: 134, textAnchor: "middle", fontSize: 10, fill: "var(--dsw-alias-label-tertiary)", children: "0" }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("text", { x: 200, y: 134, textAnchor: "middle", fontSize: 10, fill: "var(--dsw-alias-label-tertiary)", children: "100" })
  ] }) });
}

// src/client/usage/dashboard/primitives/ErrorCard.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
function ErrorCard({ message, onRetry }) {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { style: { border: "1px solid var(--dsw-alias-state-error-primary)", borderRadius: 12, padding: 20, color: "var(--dsw-alias-state-error-primary)", fontSize: 13, display: "flex", alignItems: "center", gap: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("span", { children: [
      "\u26A0 ",
      message
    ] }),
    onRetry && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { type: "button", onClick: onRetry, style: { marginLeft: "auto", border: "1px solid currentColor", borderRadius: 6, padding: "4px 12px", background: "transparent", color: "inherit", cursor: "pointer", fontSize: 12 }, children: "\u91CD\u8BD5" })
  ] });
}

// src/client/usage/dashboard/primitives/EmptyState.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
function EmptyState({ title, hint, action }) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { style: { border: "1px dashed var(--dsw-alias-border-l2)", borderRadius: 12, padding: 40, textAlign: "center" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { style: { fontSize: 13, color: "var(--dsw-alias-label-primary)" }, children: title }),
    hint && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)", marginTop: 6 }, children: hint }),
    action && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { style: { marginTop: 12 }, children: action })
  ] });
}

// src/client/responsive.ts
var import_react16 = require("react");
var MOBILE_BREAKPOINT = 768;
var MOBILE_MQ = `(max-width: ${MOBILE_BREAKPOINT - 0.02}px)`;
function isMobileViewport() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(MOBILE_MQ).matches;
}
function useIsMobile() {
  const [mobile, setMobile] = (0, import_react16.useState)(() => isMobileViewport());
  (0, import_react16.useEffect)(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(MOBILE_MQ);
    const onChange = (event) => {
      setMobile(event.matches);
    };
    setMobile(mql.matches);
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => {
        mql.removeEventListener("change", onChange);
      };
    }
    if (typeof mql.addListener === "function") {
      mql.addListener(onChange);
      return () => {
        mql.removeListener(onChange);
      };
    }
    return void 0;
  }, []);
  return mobile;
}

// src/client/usage/dashboard/hub.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
var STYLE_ID9 = "dsh-usage-hub-styles";
var SHEET6 = `
@keyframes usm-card-in {
  from { opacity: 0; transform: translateY(8px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes usm-form-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
/* \u2500\u2500 \u9AA8\u67B6\uFF1A\u4E3B\u533A + \u5DE6\u680F\uFF08\u4E0E skm-hub \u4E00\u81F4\uFF1A\u9762\u677F\u5E95\u8272 bg-base\uFF09 \u2500\u2500 */
.usm-hub { flex: 1 1 auto; min-height: 0; min-width: 0; display: flex; background: var(--dsw-alias-bg-base, #fff); }
.usm-side {
  flex: none; width: 216px; box-sizing: border-box; padding: 16px 14px 16px 16px;
  border-right: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
  background: var(--dsw-alias-bg-base, #fff);
  overflow-y: auto; display: flex; flex-direction: column; gap: 2px;
}
.usm-cat-title { flex: none; margin: 0 6px 10px; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
.usm-cat-list { flex: none; display: flex; flex-direction: column; gap: 4px; }
.usm-cat-item {
  flex: none; display: flex; align-items: center; gap: 10px; width: 100%; box-sizing: border-box;
  border: 1px solid transparent; border-radius: 10px; padding: 8px 10px; background: transparent;
  cursor: pointer; font-family: inherit; color: var(--dsw-alias-label-secondary, #61666b);
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
}
.usm-cat-item:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.03)); color: var(--dsw-alias-label-primary, #1f2430); }
.usm-cat-item[data-active] {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 13%, transparent);
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 32%, transparent);
  color: var(--dsw-alias-state-business-primary, #4176e6);
}
.usm-cat-icon { flex: none; display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; color: var(--dsw-alias-label-caption, #adb2b8); transition: color 140ms ease; }
.usm-cat-icon[data-active] { color: var(--dsw-alias-state-business-primary, #4176e6); }
.usm-cat-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; font-size: 13px; font-weight: 500; line-height: 18px; }
.usm-cat-item[data-active] .usm-cat-label { font-weight: 600; }
.usm-cat-count { flex: none; font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-caption, #adb2b8); }
.usm-cat-item[data-active] .usm-cat-count { color: var(--dsw-alias-state-business-primary, #4176e6); }
.usm-cat-count[data-warn] { color: var(--dsw-alias-state-warn-primary, #f59e0b); font-weight: 600; }
.usm-filters-title { flex: none; margin: 18px 6px 8px; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
/* \u2500\u2500 \u67E5\u8BE2\u8303\u56F4\uFF1A\u5DE6\u680F\u5E73\u94FA\u7F51\u683C\u6309\u94AE\uFF08\u9009\u4E2D\u84DD\u5E95\uFF09 \u2500\u2500 */
.usm-range-grid { flex: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; padding: 0 2px; }
.usm-range-btn {
  flex: none; display: inline-flex; align-items: center; justify-content: center; height: 30px;
  box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 999px; background: var(--dsw-alias-bg-base, #fff); padding: 0 8px;
  font-size: 12px; line-height: 17px; font-family: inherit; white-space: nowrap; cursor: pointer;
  color: var(--dsw-alias-label-secondary, #61666b);
  transition: background 140ms ease, color 140ms ease, border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
}
.usm-range-btn:hover { color: var(--dsw-alias-label-primary, #1f2430); border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16)); }
.usm-range-btn:active { transform: scale(0.96); }
/* \u9009\u4E2D\u6001\u4E0E\u6280\u80FD\u9762\u677F\u9009\u4E2D\u6309\u94AE\u4E00\u81F4\uFF1A\u54C1\u724C\u84DD\u5E95\u767D\u5B57\uFF08\u4E24\u79CD\u4E3B\u9898\u4E0B\u5747\u6210\u7ACB\uFF09 */
.usm-range-btn[data-active] {
  background: #3d6be5;
  border-color: #3d6be5;
  color: #fff;
  box-shadow: 0 2px 6px color-mix(in srgb, #3d6be5 30%, transparent);
}
.usm-range-custom { flex: none; display: flex; flex-direction: column; gap: 6px; margin-top: 10px; animation: usm-form-in 160ms ease-out; }
.usm-range-date-row { display: flex; align-items: center; gap: 6px; padding: 0 2px; }
.usm-range-date-sep { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary, #81858c); }
.usm-range-date {
  flex: 1; min-width: 0; height: 30px; box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 8px; background: var(--dsw-alias-bg-base, #fff); padding: 0 8px; font-size: 12px;
  color: var(--dsw-alias-label-primary, #1f2430); font-family: inherit; color-scheme: dark light; outline: none;
}
.usm-range-date:focus { border-color: var(--dsw-alias-state-business-primary, #4176e6); }
/* \u2500\u2500 \u8D8B\u52BF\u9875 KPI \u65B9\u5757\u56FE\u6807\uFF08data-shape=square\uFF1A\u5706\u89D2\u65B9\u5757 + \u8272\u8C03\u6D45\u5E95\uFF09 \u2500\u2500 */
.usm-stat-icon[data-shape='square'] { width: 34px; height: 34px; border-radius: 10px; }
.usm-stat-icon[data-shape='square'][data-tone='blue'] { background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 14%, var(--dsw-alias-bg-base, #fff)); }
.usm-stat-icon[data-shape='square'][data-tone='green'] { background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 14%, var(--dsw-alias-bg-base, #fff)); }
.usm-stat-icon[data-shape='square'][data-tone='violet'] { background: color-mix(in srgb, #7c5cf0 14%, var(--dsw-alias-bg-base, #fff)); }
.usm-stat-icon[data-shape='square'][data-tone='orange'] { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 16%, var(--dsw-alias-bg-base, #fff)); }
/* \u2500\u2500 \u56FE\u8868\u5361\u5206\u6BB5\u63A7\u4EF6\uFF08\u5C0F\u65F6/\u5929/7\u5929/30\u5929\uFF09 \u2500\u2500 */
.usm-seg { flex: none; display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1)); border-radius: 8px; background: var(--dsw-alias-bg-base, #fff); }
.usm-seg-btn { flex: none; height: 22px; padding: 0 9px; border: none; border-radius: 6px; background: transparent; font-size: 11px; line-height: 1; color: var(--dsw-alias-label-secondary, #61666b); cursor: pointer; font-family: inherit; white-space: nowrap; transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease; }
.usm-seg-btn:hover { color: var(--dsw-alias-label-primary, #1f2430); background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.04)); }
.usm-seg-btn[data-active] { background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 16%, transparent); color: var(--dsw-alias-state-business-primary, #4176e6); font-weight: 600; }
/* \u2500\u2500 \u6982\u89C8\u74E6\u7247\uFF08\u4ECA\u65E5\u6982\u89C8\uFF09 \u2500\u2500 */
.usm-ov-grid { flex: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.usm-ov-tile { flex: none; box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06)); border-radius: 12px; background: var(--dsw-alias-bg-module-platform, #fff); padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; min-width: 0; opacity: 0; animation: usm-card-in 300ms cubic-bezier(0.2, 0.7, 0.3, 1.06) forwards; transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease; }
.usm-ov-tile:hover { box-shadow: 0 6px 18px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 10%, transparent); transform: translateY(-1px); border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.13)); }
.usm-ov-label { font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-secondary, #8f96a3); }
.usm-ov-value { font-size: 17px; line-height: 23px; font-weight: 600; color: var(--dsw-alias-label-primary, #0f1115); font-variant-numeric: tabular-nums; white-space: nowrap; }
/* \u2500\u2500 \u4F9B\u5E94\u5546\u7528\u91CF\u6392\u884C\u884C \u2500\u2500 */
.usm-prov-row { display: flex; align-items: center; gap: 8px; padding: 6px 6px; margin: 0 -6px; border-radius: 8px; transition: background 120ms ease; }
.usm-prov-row:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.04)); }
/* \u2500\u2500 \u5934\u90E8\u5237\u65B0\u6309\u94AE\uFF08spin \u6001\uFF09 \u2500\u2500 */
.usm-refresh { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; border-radius: 8px; padding: 0; background: transparent; cursor: pointer; color: var(--dsw-alias-label-secondary, #bbb); transition: background 140ms ease, color 140ms ease, transform 140ms ease; }
.usm-refresh:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06)); color: var(--dsw-alias-label-primary, #eee); }
.usm-refresh:active { transform: scale(0.94); }
.usm-refresh[data-spin] svg { animation: usm-spin 700ms linear infinite; }
@keyframes usm-spin { to { transform: rotate(360deg); } }
/* \u2500\u2500 \u7EDF\u8BA1\u5361\u884C\uFF08\u5BBD\u5361\uFF09\uFF1Ahover \u60AC\u6D6E desc\u3001\u70B9\u51FB\u5C55\u5F00\u660E\u7EC6 \u2500\u2500 */
.usm-stats-row { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 12px 14px 0; }
.usm-stat {
  position: relative; min-width: 0; display: flex; align-items: center; gap: 12px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08)); border-radius: 12px;
  background: var(--dsw-alias-bg-base, #fff); padding: 11px 13px;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 6%, transparent);
  opacity: 0; animation: usm-card-in 260ms cubic-bezier(0.2, 0.7, 0.3, 1.06) forwards;
  transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease;
  cursor: pointer; text-align: left; font-family: inherit;
}
.usm-stat:hover { box-shadow: 0 6px 18px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 12%, transparent); transform: translateY(-1px); border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.13)); }
.usm-stat[data-open] {
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 45%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 14%, transparent);
}
.usm-stat-icon-col { flex: none; width: 34px; display: flex; flex-direction: column; align-items: center; gap: 7px; }
.usm-stat-icon { flex: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
/* \u6E10\u53D8\u5706\u968F\u4E3B\u9898\u7740\u8272\uFF1A\u6D45\u8272=\u6D45\u5F69\uFF0C\u6DF1\u8272=\u6DF1\u5F69\uFF08color-mix \u4E0E\u80CC\u666F\u6DF7\u5408\uFF09 */
.usm-stat-icon[data-tone='blue'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 22%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 34%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 46%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon[data-tone='green'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 18%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 30%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 42%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon[data-tone='violet'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, #7c5cf0 20%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, #7c5cf0 32%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, #7c5cf0 44%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon[data-tone='orange'] { background: radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 18%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 28%, var(--dsw-alias-bg-base, #fff)) 55%, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 38%, var(--dsw-alias-bg-base, #fff)) 100%); }
.usm-stat-icon svg { color: var(--dsw-alias-state-business-primary, #4176e6); }
.usm-stat-icon[data-tone='green'] svg { color: var(--dsw-alias-state-success-primary, #22c55e); }
.usm-stat-icon[data-tone='violet'] svg { color: #7c5cf0; }
.usm-stat-icon[data-tone='orange'] svg { color: var(--dsw-alias-state-warn-primary, #f59e0b); }
.usm-stat-glow { flex: none; width: 3px; height: 9px; border-radius: 99px; }
.usm-stat-glow[data-tone='blue'] { background: linear-gradient(to bottom, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 70%, transparent), transparent); }
.usm-stat-glow[data-tone='green'] { background: linear-gradient(to bottom, color-mix(in srgb, var(--dsw-alias-state-success-primary, #22c55e) 65%, transparent), transparent); }
.usm-stat-glow[data-tone='violet'] { background: linear-gradient(to bottom, color-mix(in srgb, #7c5cf0 65%, transparent), transparent); }
.usm-stat-glow[data-tone='orange'] { background: linear-gradient(to bottom, color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 65%, transparent), transparent); }
.usm-stat-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: stretch; }
.usm-stat-label { font-size: 12px; line-height: 17px; color: var(--dsw-alias-label-secondary, #8f96a3); }
.usm-stat-value { font-size: 21px; font-weight: 700; line-height: 26px; letter-spacing: -0.2px; color: var(--dsw-alias-label-primary, #0f1115); font-variant-numeric: tabular-nums; white-space: nowrap; }
.usm-stat-value[data-tone='warn'] { color: var(--dsw-alias-state-warn-primary, #f59e0b); }
/* desc \u60AC\u6D6E\u6C14\u6CE1\uFF1Ahover \u51FA\u73B0\uFF0C\u4E0D\u5360\u5E03\u5C40 */
.usm-stat-sub { display: flex; align-items: center; gap: 4px; margin-top: 3px; font-size: 11px; line-height: 15px; color: var(--dsw-alias-label-tertiary, #81858c); font-variant-numeric: tabular-nums; white-space: nowrap; animation: usm-form-in 260ms ease-out backwards; }
.usm-stat-sub[data-tone='up'] { color: var(--dsw-alias-state-success-primary, #22c55e); }
.usm-stat-sub[data-tone='down'] { color: var(--dsw-alias-state-error-primary, #ef4444); }
.usm-stat-desc {
  position: absolute; left: 18px; right: 18px; top: calc(100% - 8px); z-index: 6;
  box-sizing: border-box; border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 16%, transparent); padding: 7px 10px;
  font-size: 12px; line-height: 17px; color: var(--dsw-alias-label-secondary, #61666b);
  opacity: 0; transform: translateY(6px); pointer-events: none;
  transition: opacity 150ms ease, transform 150ms ease;
}
.usm-stat:hover .usm-stat-desc, .usm-stat:focus-visible .usm-stat-desc { opacity: 1; transform: translateY(0); }
/* \u7EDF\u8BA1\u884C\u4E0B\u5C55\u5F00\u660E\u7EC6\u5757 */
.usm-stat-detail {
  flex: none; margin: 10px 14px 0; box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 28%, transparent);
  border-radius: 14px;
  background: linear-gradient(178deg, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 12%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 6%, var(--dsw-alias-bg-base, #fff)) 100%);
  padding: 12px 16px; display: flex; flex-direction: column; gap: 10px;
  animation: usm-form-in 200ms ease-out;
}
.usm-stat-detail-title { font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
.usm-breakdown { display: flex; flex-direction: column; gap: 4px; }
.usm-breakdown-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.usm-breakdown-label { flex: none; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary, #61666b); }
.usm-breakdown-value { margin-left: auto; flex: none; font-size: 13px; line-height: 18px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2430); font-variant-numeric: tabular-nums; }
/* \u2500\u2500 \u5DE5\u5177\u680F \u2500\u2500 */
.usm-toolbar { flex: none; display: flex; align-items: center; gap: 8px; padding: 12px 16px 4px; flex-wrap: wrap; }
.usm-search-box {
  flex: 1; min-width: 170px; display: flex; align-items: center; gap: 8px; height: 36px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12)); border-radius: 10px;
  background: var(--dsw-alias-bg-base, #fff); padding: 0 12px; color: var(--dsw-alias-label-caption, #adb2b8);
  transition: border-color 140ms ease, box-shadow 140ms ease;
}
.usm-search-box:focus-within { border-color: var(--dsw-alias-state-business-primary, #4176e6); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 16%, transparent); }
.usm-search-input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-size: 13px; line-height: 18px; color: var(--dsw-alias-label-primary, #0f1115); font-family: inherit; }
.usm-search-input::placeholder { color: var(--dsw-alias-label-caption, #adb2b8); }
.usm-search-clear {
  flex: none; width: 18px; height: 18px; border: none; border-radius: 999px; padding: 0; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--dsw-alias-label-tertiary, #81858c) 20%, transparent);
  color: var(--dsw-alias-label-secondary, #61666b); font-size: 11px; line-height: 1;
}
.usm-tool-button {
  flex: none; display: inline-flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12)); border-radius: 10px;
  background: var(--dsw-alias-bg-base, #fff); color: var(--dsw-alias-label-secondary, #61666b);
  font-size: 13px; line-height: 18px; font-family: inherit; padding: 0 12px; cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease, transform 140ms ease;
}
.usm-tool-button:hover { background: var(--dsw-alias-interactive-bg-hover-solid, #f7f8f9); color: var(--dsw-alias-label-primary, #0f1115); }
.usm-tool-button:active { transform: scale(0.97); }
.usm-tool-button:disabled { opacity: 0.5; cursor: default; }
.usm-toolbar-spacer { flex: 1 1 12px; }
.usm-toolbar-meta { flex: none; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-tertiary, #81858c); white-space: nowrap; }
/* \u2500\u2500 \u4E0B\u62C9\u83DC\u5355\uFF08\u6392\u5E8F\u7B49\uFF09 \u2500\u2500 */
.usm-drop-wrap { position: relative; flex: none; }
.usm-bulk-overlay { position: fixed; inset: 0; z-index: 995; border: none; background: transparent; cursor: default; padding: 0; }
.usm-drop-menu {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 996; min-width: 180px; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12)); border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--dsw-alias-label-primary, #0f1115) 14%, transparent);
  padding: 4px; display: flex; flex-direction: column; gap: 2px; animation: usm-form-in 140ms ease-out;
}
.usm-drop-item {
  display: flex; align-items: center; gap: 8px; border: none; border-radius: 8px; padding: 7px 10px;
  background: transparent; font-size: 13px; line-height: 18px; color: var(--dsw-alias-label-secondary, #61666b);
  cursor: pointer; font-family: inherit; text-align: left; white-space: nowrap;
  transition: background 120ms ease, color 120ms ease;
}
.usm-drop-item:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.04)); color: var(--dsw-alias-label-primary, #0f1115); }
.usm-drop-item[aria-checked='true'] { color: var(--dsw-alias-label-primary, #0f1115); font-weight: 600; }
.usm-drop-check { flex: none; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--dsw-alias-state-business-primary, #4176e6); opacity: 0; transform: scale(0.6); transition: opacity 140ms ease, transform 140ms ease; }
.usm-drop-check[data-on] { opacity: 1; transform: scale(1); }
/* \u2500\u2500 \u5185\u5BB9\u533A \u2500\u2500 */
.usm-main-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 12px 14px 18px; display: flex; flex-direction: column; gap: 10px; }
.usm-section { display: flex; flex-direction: column; min-width: 0; gap: 8px; }
.usm-section-head { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 2px 4px 0; }
.usm-section-title { flex: none; font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); white-space: nowrap; }
.usm-section-meta { flex: 1; min-width: 0; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-tertiary, #81858c); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.usm-section-action { flex: none; }
.usm-empty {
  flex: none; box-sizing: border-box; border: 1px dashed var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.18));
  border-radius: 12px; padding: 18px; text-align: center; font-size: 12px; line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #81858c);
}
/* \u2500\u2500 \u5E95\u90E8\u8BF4\u660E\u6A2A\u5E45\uFF08\u70ED\u529B\u56FE\u8BF4\u660E\uFF09 \u2500\u2500 */
.usm-note {
  flex: none; display: flex; align-items: flex-start; gap: 10px; box-sizing: border-box;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 16%, transparent);
  border-radius: 12px; padding: 12px 14px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 7%, var(--dsw-alias-bg-base, #fff)) 0%, color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 3%, var(--dsw-alias-bg-base, #fff)) 100%);
  opacity: 0; animation: usm-card-in 260ms cubic-bezier(0.2, 0.7, 0.3, 1.06) 200ms forwards;
}
.usm-note-icon { flex: none; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--dsw-alias-state-business-primary, #4176e6); background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 12%, transparent); }
.usm-note-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.usm-note-title { font-size: 13px; font-weight: 700; line-height: 18px; color: var(--dsw-alias-label-primary, #1f2430); }
.usm-note-text { font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary, #61666b); }
/* \u2500\u2500 \u9876\u680F\uFF1A\u5206\u7C7B\u6A2A\u6392 + \u67E5\u8BE2\u8303\u56F4\uFF08\u53D6\u4EE3\u65E7\u5DE6\u680F\uFF1B\u4E3B\u533A\u7EB5\u5411\u6392\u5E03\uFF09 \u2500\u2500 */
.usm-hub { flex-direction: column; }
.usm-topbar { flex: none; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 16px; border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05)); background: var(--dsw-alias-bg-base, #fff); }
.usm-cat-row { flex: 1 1 auto; min-width: 200px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.usm-cat-row .usm-cat-item { flex: none; width: auto; }
.usm-top-range { flex: none; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.usm-top-range .usm-drop-wrap .usm-tool-button { height: 30px; border-radius: 999px; font-size: 12px; }
.usm-top-range .usm-drop-menu { left: auto; right: 0; }
.usm-top-range .usm-range-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 0; }
.usm-top-range .usm-range-custom { margin-top: 0; }
/* \u2500\u2500 \u79FB\u52A8\u7AEF\uFF1A\u5DE6\u680F\u8F6C\u6A2A\u5411\u5BFC\u822A \u2500\u2500 */
@media (max-width: 767.98px) {
  .usm-hub { flex-direction: column; }
  .usm-side { width: 100%; flex-direction: row; align-items: center; gap: 8px; padding: 8px 12px; overflow-x: auto; overflow-y: hidden; border-right: none; border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05)); scrollbar-width: none; }
  .usm-side::-webkit-scrollbar { display: none; }
  .usm-cat-title, .usm-filters-title { display: none; }
  .usm-cat-list { flex-direction: row; gap: 4px; }
  .usm-cat-item { width: auto; max-width: 130px; }
  .usm-range-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 260px; }
  .usm-stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 12px 12px 0; }
  .usm-toolbar { padding: 12px 12px 4px; }
  .usm-main-scroll { padding: 12px 12px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .usm-stat { animation: none; opacity: 1; transition: none; }
  .usm-stat-desc { transition: none; }
  .usm-range-btn { transition: none; }
  .usm-drop-menu, .usm-stat-detail, .usm-range-custom { animation: none; }
}
`;
var css2 = {
  hub: "usm-hub",
  side: "usm-side",
  topbar: "usm-topbar",
  catRow: "usm-cat-row",
  topRange: "usm-top-range",
  catTitle: "usm-cat-title",
  catList: "usm-cat-list",
  catItem: "usm-cat-item",
  catIcon: "usm-cat-icon",
  catLabel: "usm-cat-label",
  catCount: "usm-cat-count",
  filtersTitle: "usm-filters-title",
  rangeGrid: "usm-range-grid",
  rangeBtn: "usm-range-btn",
  rangeCustom: "usm-range-custom",
  rangeDateRow: "usm-range-date-row",
  rangeDateSep: "usm-range-date-sep",
  rangeDate: "usm-range-date",
  statsRow: "usm-stats-row",
  stat: "usm-stat",
  statIconCol: "usm-stat-icon-col",
  statIcon: "usm-stat-icon",
  statGlow: "usm-stat-glow",
  statBody: "usm-stat-body",
  statLabel: "usm-stat-label",
  statValue: "usm-stat-value",
  statDesc: "usm-stat-desc",
  statSub: "usm-stat-sub",
  statDetail: "usm-stat-detail",
  statDetailTitle: "usm-stat-detail-title",
  breakdown: "usm-breakdown",
  breakdownRow: "usm-breakdown-row",
  breakdownLabel: "usm-breakdown-label",
  breakdownValue: "usm-breakdown-value",
  toolbar: "usm-toolbar",
  searchBox: "usm-search-box",
  searchInput: "usm-search-input",
  searchClear: "usm-search-clear",
  toolButton: "usm-tool-button",
  toolbarSpacer: "usm-toolbar-spacer",
  toolbarMeta: "usm-toolbar-meta",
  dropWrap: "usm-drop-wrap",
  bulkOverlay: "usm-bulk-overlay",
  dropMenu: "usm-drop-menu",
  dropItem: "usm-drop-item",
  dropCheck: "usm-drop-check",
  mainScroll: "usm-main-scroll",
  section: "usm-section",
  sectionHead: "usm-section-head",
  sectionTitle: "usm-section-title",
  sectionMeta: "usm-section-meta",
  sectionAction: "usm-section-action",
  empty: "usm-empty",
  note: "usm-note",
  noteIcon: "usm-note-icon",
  noteBody: "usm-note-body",
  noteTitle: "usm-note-title",
  noteText: "usm-note-text",
  seg: "usm-seg",
  segBtn: "usm-seg-btn",
  ovGrid: "usm-ov-grid",
  ovTile: "usm-ov-tile",
  ovLabel: "usm-ov-label",
  ovValue: "usm-ov-value",
  provRow: "usm-prov-row",
  refresh: "usm-refresh"
};
function ensureHubStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID9) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID9;
  tag.dataset.plugin = "dsh-triad";
  tag.textContent = SHEET6;
  document.head.appendChild(tag);
}
function trendIcon(size = 16, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("polyline", { points: "17 6 23 6 23 12" })
  ] });
}
function detailIcon(size = 16, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("rect", { x: "3", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("rect", { x: "14", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("rect", { x: "14", y: "14", width: "7", height: "7" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("rect", { x: "3", y: "14", width: "7", height: "7" })
  ] });
}
function signalIcon(size = 16, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M13.7 21a2 2 0 0 1-3.4 0" })
  ] });
}
function walletIcon(size = 16, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("rect", { x: "2", y: "5", width: "20", height: "15", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M2 10h20" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M16 15h2" })
  ] });
}
function tokensIcon(size = 18, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("ellipse", { cx: "12", cy: "5", rx: "8", ry: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" })
  ] });
}
function inputIcon(size = 18, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M12 3v12" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "m7 10 5 5 5-5" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M4 21h16" })
  ] });
}
function outputIcon(size = 18, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M12 21V9" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "m7 14 5-5 5 5" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M4 3h16" })
  ] });
}
function callsIcon(size = 18, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M3 12h4l3 7 4-14 3 7h4" }) });
}
function modelsIcon(size = 18, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M12 7v5l3.5 2" })
  ] });
}
function hitIcon(size = 18, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("circle", { cx: "12", cy: "12", r: "4.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("circle", { cx: "12", cy: "12", r: "0.5", fill: "currentColor" })
  ] });
}
function daysIcon(size = 18, stroke = 1.8) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("rect", { x: "3", y: "4", width: "18", height: "17", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M16 2v4M8 2v4M3 10h18" })
  ] });
}
function HubCatItem({ active, icon, label, count, warn, onClick, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("button", { type: "button", className: css2.catItem, "data-active": active || void 0, onClick, children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.catIcon, "data-active": active || void 0, children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.catLabel, children: label }),
    count !== void 0 && count !== "" && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.catCount, "data-warn": warn || void 0, title: warn ? "\u6709\u5F02\u5E38\uFF0C\u70B9\u51FB\u67E5\u770B" : void 0, children: count }),
    children
  ] });
}
function HubStat({ tone, icon, label, value, valueWarn, sub, subTone, desc, open, onToggle, delay, iconShape = "circle" }) {
  const style = { animationDelay: `${delay ?? 0}ms` };
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("button", { type: "button", className: css2.stat, style, "data-open": open || void 0, onClick: onToggle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: css2.statIconCol, children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.statIcon, "data-tone": tone, "data-shape": iconShape === "square" ? "square" : void 0, children: icon }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("i", { className: css2.statGlow, "data-tone": tone, "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("span", { className: css2.statBody, children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.statLabel, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.statValue, "data-tone": valueWarn ? "warn" : void 0, children: value }),
      sub !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.statSub, "data-tone": subTone !== "flat" ? subTone : void 0, children: sub })
    ] }),
    desc !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.statDesc, role: "note", children: desc })
  ] });
}
function HubStatDetail({ title, rows, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: css2.statDetail, role: "region", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.statDetailTitle, children: title }),
    rows !== void 0 && rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: css2.breakdown, children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: css2.breakdownRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.breakdownLabel, children: row.label }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.breakdownValue, children: row.value })
    ] }, row.label)) }),
    children
  ] });
}
function HubSection({ title, meta, action, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("section", { className: css2.section, children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: css2.sectionHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.sectionTitle, children: title }),
      meta !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.sectionMeta, children: meta }),
      action !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: css2.sectionAction, children: action })
    ] }),
    children
  ] });
}

// src/client/usage/dashboard/TrendTab.tsx
var import_jsx_runtime20 = require("react/jsx-runtime");
var MONO3 = "ui-monospace, SFMono-Regular, Menlo, monospace";
var rowCard = {
  border: "1px solid var(--dsw-alias-border-l2)",
  borderRadius: 12,
  padding: "12px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  minWidth: 0
};
var editorFace = {
  borderRadius: 12,
  background: "var(--dsw-alias-bg-module-platform)",
  padding: "14px 16px"
};
function Stat({ label, value, exact, sub, delta, first }) {
  const deltaView = delta === void 0 || delta === null ? null : delta > 0 ? { text: `\u2191${delta >= 10 ? Math.round(delta) : delta.toFixed(1)}%`, color: "var(--dsw-alias-state-success-primary)" } : delta < 0 ? { text: `\u2193${Math.abs(delta) >= 10 ? Math.round(Math.abs(delta)) : Math.abs(delta).toFixed(1)}%`, color: "var(--dsw-alias-state-error-primary)" } : { text: "\u6301\u5E73", color: "var(--dsw-alias-label-tertiary)" };
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: {
    minWidth: 0,
    paddingLeft: first ? 0 : 16,
    borderLeft: first ? void 0 : "1px solid var(--dsw-alias-border-l2)",
    display: "flex",
    flexDirection: "column",
    gap: 2
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-secondary)", whiteSpace: "nowrap" }, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("span", { style: { display: "flex", alignItems: "baseline", gap: 6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 20, lineHeight: "28px", fontWeight: 600, fontFamily: MONO3, color: "var(--dsw-alias-label-primary)", whiteSpace: "nowrap" }, children: value }),
      deltaView !== null && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, fontFamily: MONO3, color: deltaView.color }, children: deltaView.text })
    ] }),
    (exact !== void 0 || sub !== void 0) && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)", fontFamily: exact !== void 0 ? MONO3 : void 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: exact ?? sub })
  ] });
}
function useNarrow() {
  const [narrow, setNarrow] = (0, import_react17.useState)(() => window.matchMedia("(max-width: 1150px)").matches);
  (0, import_react17.useEffect)(() => {
    const mql = window.matchMedia("(max-width: 1150px)");
    const onChange = (e) => {
      setNarrow(e.matches);
    };
    setNarrow(mql.matches);
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);
  return narrow;
}
function shiftDayStr(s, n) {
  const d = fromDayStr(s);
  d.setDate(d.getDate() + n);
  return toDayStr(d);
}
function anomalyCountOf(days) {
  const actives = days.map((d) => d.tokens ?? 0).filter((v) => v > 0).sort((a, b) => a - b);
  if (actives.length === 0) return 0;
  const mid = Math.floor(actives.length / 2);
  const median = actives.length % 2 === 1 ? actives[mid] : (actives[mid - 1] + actives[mid]) / 2;
  if (!(median > 0)) return 0;
  return days.filter((d) => (d.tokens ?? 0) > median * 3).length;
}
function DeltaChip({ pct, label }) {
  if (pct > 0) return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { color: "var(--dsw-alias-label-tertiary)" }, children: label }),
    " \u25B2",
    pct >= 10 ? Math.round(pct) : pct.toFixed(1),
    "%"
  ] });
  if (pct < 0) return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { color: "var(--dsw-alias-label-tertiary)" }, children: label }),
    " \u25BC",
    Math.abs(pct) >= 10 ? Math.round(Math.abs(pct)) : Math.abs(pct).toFixed(1),
    "%"
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { color: "var(--dsw-alias-label-tertiary)" }, children: label }),
    " \u6301\u5E73"
  ] });
}
function CountChip({ delta, label }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { color: "var(--dsw-alias-label-tertiary)" }, children: label }),
    delta > 0 ? ` +${delta}` : delta < 0 ? ` ${delta}` : " 0"
  ] });
}
function LinkButton({ children, onClick }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("button", { type: "button", onClick, style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    lineHeight: "18px",
    color: "var(--dsw-alias-state-business-primary)",
    transition: "opacity 140ms ease"
  }, children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M7 17 17 7M9 7h8v8" }) })
  ] });
}
function ChartFoot({ series, stackMode, format }) {
  const totals = series.map((p) => stackMode === "io" ? p.input + p.output : p.input + p.output + p.cache);
  const sum = totals.reduce((a, v) => a + v, 0);
  const peakIdx = totals.length > 0 ? totals.indexOf(Math.max(...totals)) : -1;
  const peak = peakIdx >= 0 ? series[peakIdx] : void 0;
  const peakLabel = peak === void 0 ? "\u2014" : peak.label.length >= 10 && peak.label[4] === "-" ? peak.label.slice(5) : peak.label;
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovGrid, style: { paddingTop: 10, borderTop: "1px solid var(--dsw-alias-border-l1)" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "0ms" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u5468\u671F\u5408\u8BA1" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, children: format(sum) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "40ms" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("span", { className: css2.ovLabel, children: [
        "\u5CF0\u503C \xB7 ",
        peakLabel
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, children: peakIdx >= 0 ? format(totals[peakIdx]) : "\u2014" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "80ms" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u5468\u671F\u65E5\u5747" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, children: series.length > 0 ? format(sum / series.length) : "\u2014" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "120ms" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u6709\u91CF\u5929\u6570" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("span", { className: css2.ovValue, children: [
        totals.filter((v) => v > 0).length,
        "/",
        series.length
      ] })
    ] })
  ] });
}
function TrendTab({ range, rangeLabel, onJumpAccounts, onJumpSignal, onJumpDetail, refreshTick, provider = "all" }) {
  const [usage, setUsage] = (0, import_react17.useState)(null);
  const [hours, setHours] = (0, import_react17.useState)([]);
  const [providers, setProviders] = (0, import_react17.useState)([]);
  const [error, setError] = (0, import_react17.useState)(null);
  const [retryTick, setRetryTick] = (0, import_react17.useState)(0);
  const isMobile = useIsMobile();
  const narrow = useNarrow();
  const compact = isMobile || narrow;
  const [openStat, setOpenStat] = (0, import_react17.useState)(null);
  const [unit, setUnit] = (0, import_react17.useState)("auto");
  const [unitOpen, setUnitOpen] = (0, import_react17.useState)(false);
  const [chartStyle, setChartStyle] = (0, import_react17.useState)("bar");
  const [stackMode, setStackMode] = (0, import_react17.useState)("full");
  const [stackOpen, setStackOpen] = (0, import_react17.useState)(false);
  (0, import_react17.useEffect)(() => {
    let alive = true;
    setError(null);
    Promise.all([usageApi.usage(), usageApi.providers()]).then(([u, p]) => {
      if (!alive) return;
      if (u.ok !== true) throw new Error("\u7528\u91CF\u6570\u636E\u52A0\u8F7D\u5931\u8D25");
      if (p.ok !== true) throw new Error("\u4F9B\u5E94\u5546\u6570\u636E\u52A0\u8F7D\u5931\u8D25");
      setUsage(u.days);
      setHours(u.hours ?? []);
      setProviders(p.providers ?? []);
    }).catch((e) => {
      if (alive) setError(e instanceof Error ? e.message : String(e));
    });
    return () => {
      alive = false;
    };
  }, [refreshTick, retryTick]);
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ErrorCard, { message: error, onRetry: () => setRetryTick((t) => t + 1) });
  }
  if (usage === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { padding: "24px 0", textAlign: "center", fontSize: 13, color: "var(--dsw-alias-label-tertiary)" }, children: "\u52A0\u8F7D\u4E2D\u2026" });
  }
  const provActive = provider.trim() !== "" && provider.trim() !== "all";
  const scopeLabel = `${rangeLabel}${provActive ? ` \xB7 ${provider.trim()}` : ""}`;
  const scoped = filterDaysByProvider(usage, provider);
  const filtered = filterDays(scoped, range);
  const previous = filterDays(scoped, prevRange(range));
  const sum = sumTokens(filtered);
  const prevSum = sumTokens(previous);
  const hitRate = averageCacheHitRate(filtered);
  const prevHitRate = averageCacheHitRate(previous);
  const avg = dailyAverage(filtered);
  const prevAvg = dailyAverage(previous);
  const activity = sumActivity(filtered);
  const prevActivity = sumActivity(previous);
  const periodLabel = rangeDays(range) <= 1 ? "\u8F83\u6628\u65E5" : "\u8F83\u4E0A\u671F";
  const spanDays = rangeDays(range);
  const autoGrain = spanDays <= 1 && !provActive ? "hour" : spanDays <= 62 ? "day" : "week";
  const chartDays = filterDays(scoped, range);
  const series = autoGrain === "hour" ? aggregateHourSeries(hours, range) : aggregateSeries(chartDays, autoGrain === "week" ? "week" : "day");
  const showTrend = series.length >= 1;
  const baseline = (() => {
    if (series.length === 0) return void 0;
    if (autoGrain === "hour") {
      const day = range.start;
      const values = series.map((p) => {
        const hh = p.label.slice(0, 2);
        let bucket = 0;
        let n = 0;
        for (let k = 6; k >= 0; k -= 1) {
          const d = shiftDayStr(day, -k);
          const entry = hours.find((h) => h.hour === `${d}-${hh}`);
          if (entry !== void 0) {
            bucket += entry.inputTokens ?? 0;
            n += 1;
          }
        }
        return n > 0 ? bucket / n : null;
      });
      return { label: "7\u5929\u5E73\u5747\uFF08\u8F93\u5165\uFF09", values };
    }
    if (autoGrain === "day") {
      const values = series.map((_, i) => {
        const start = Math.max(0, i - 6);
        let bucket = 0;
        let n = 0;
        for (let k = start; k <= i; k += 1) {
          bucket += series[k].input;
          n += 1;
        }
        return bucket / n;
      });
      return { label: "7\u5929\u5E73\u5747\uFF08\u8F93\u5165\uFF09", values };
    }
    return void 0;
  })();
  const fmt = (n) => unit === "wan" ? `${(n / 1e4).toFixed(0)}\u4E07` : unit === "yi" ? `${(n / 1e8).toFixed(1)}\u4EBF` : formatUnits(n);
  const rank = modelRank(filtered);
  const prevRank = modelRank(previous);
  const share = providerShare(filtered);
  const palette = providerPalette();
  const shareTotal = share.reduce((a, s) => a + s.tokens, 0);
  const shareTop = share[0]?.tokens ?? 1;
  const lineProvs = share.slice(0, 5).map((s) => s.provider);
  const lineSeries = lineProvs.map((p) => ({
    provider: p,
    values: filtered.map((d) => (d.models ?? []).reduce((a, m) => a + (splitModelKey(m.model).provider === p ? m.tokens ?? 0 : 0), 0))
  }));
  const lineLabels = filtered.map((d) => d.date);
  const hasLineData = lineSeries.some((s) => s.values.some((v) => v > 0));
  const composeSlices = [
    { label: "\u8F93\u5165", value: sum.input, color: "var(--dsw-alias-state-business-primary)" },
    { label: "\u8F93\u51FA", value: sum.output, color: "#7c5cf0" },
    { label: "\u7F13\u5B58\u8BFB\u53D6", value: sum.cache, color: "var(--dsw-alias-label-tertiary)" }
  ];
  const hourDaySet = new Set(filtered.map((d) => d.date));
  const hourBars = Array.from({ length: 24 }, (_, h) => {
    const hh = String(h).padStart(2, "0");
    let input = 0;
    let output = 0;
    for (const e of hours) {
      if (typeof e.hour !== "string" || e.hour.length < 12) continue;
      if (e.hour.slice(-2) !== hh || !hourDaySet.has(e.hour.slice(0, 10))) continue;
      input += e.inputTokens ?? 0;
      output += e.outputTokens ?? 0;
    }
    return { label: hh, input, output, cache: 0 };
  });
  const hasHourData = hourBars.some((b) => b.input + b.output > 0);
  const topDays = [...filtered].filter((d) => (d.tokens ?? 0) > 0).sort((a, b) => (b.tokens ?? 0) - (a.tokens ?? 0)).slice(0, 7).map((d) => ({ label: d.date, value: d.tokens ?? 0, hitRate: d.cacheHitRate ?? null }));
  const anomalyCount = anomalyCountOf(filtered);
  const prevAnomalyCount = anomalyCountOf(previous);
  const anomalyMap = (() => {
    if (autoGrain !== "day" || chartDays.length === 0) return null;
    const actives = chartDays.map((d) => d.tokens ?? 0).filter((v) => v > 0).sort((a, b) => a - b);
    if (actives.length === 0) return null;
    const mid = Math.floor(actives.length / 2);
    const median = actives.length % 2 === 1 ? actives[mid] : (actives[mid - 1] + actives[mid]) / 2;
    if (!(median > 0)) return null;
    const map = /* @__PURE__ */ new Map();
    for (const d of chartDays) {
      const tokens = d.tokens ?? 0;
      if (tokens > median * 3) map.set(d.date, { multiple: tokens / median, tokens });
    }
    return map.size > 0 ? map : null;
  })();
  const alerts = providers.filter((p) => p.alert && (p.alert.level === "critical" || p.alert.level === "warning")).sort((a, b) => (a.alert.level === "critical" ? -1 : 1) - (b.alert.level === "critical" ? -1 : 1));
  const emptyHint = (title) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(EmptyState, { title, hint: "\u53BB\u804A\u4E24\u53E5\u5C31\u4F1A\u5728\u8FD9\u91CC\u51FA\u73B0\u6570\u636E" });
  const yi = formatYiExact(sum.total);
  const deltaTotal = deltaPercent(sum.total, prevSum.total);
  const deltaInput = deltaPercent(sum.input, prevSum.input);
  const deltaOutput = deltaPercent(sum.output, prevSum.output);
  const deltaRequests = deltaPercent(activity.requests, prevActivity.requests);
  const hitDelta = filtered.length > 0 && previous.length > 0 ? hitRate - prevHitRate : null;
  const deltaAvg = deltaPercent(avg, prevAvg);
  const deltaWork = deltaPercent(activity.workMs, prevActivity.workMs);
  const deltaCache = deltaPercent(sum.cache, prevSum.cache);
  const toggleStat = (key) => {
    setOpenStat((v) => v === key ? null : key);
  };
  const statDetailRows = {
    total: [
      { label: "\u8F93\u5165", value: formatUnits(sum.input) },
      { label: "\u8F93\u51FA", value: formatUnits(sum.output) },
      { label: "\u7F13\u5B58", value: formatUnits(sum.cache) },
      { label: "\u7CBE\u786E\u5408\u8BA1", value: yi?.exact ?? formatExact(sum.total) }
    ],
    input: [
      { label: "\u8F93\u5165 Token", value: formatUnits(sum.input) },
      { label: "\u65E5\u5E73\u5747", value: formatUnits(avg) },
      { label: "\u73AF\u6BD4", value: deltaInput === null ? "\u2014" : `${deltaInput >= 10 ? Math.round(deltaInput) : deltaInput.toFixed(1)}%` }
    ],
    output: [
      { label: "\u8F93\u51FA Token", value: formatUnits(sum.output) },
      { label: "\u5360\u6BD4", value: `${sum.total > 0 ? Math.round(sum.output / sum.total * 100) : 0}%` },
      { label: "\u73AF\u6BD4", value: deltaOutput === null ? "\u2014" : `${deltaOutput >= 10 ? Math.round(deltaOutput) : deltaOutput.toFixed(1)}%` }
    ],
    requests: [
      { label: "\u8C03\u7528\u6B21\u6570", value: formatUnits(activity.requests) },
      { label: "\u5DE5\u4F5C\u65F6\u957F", value: formatWorkDuration(activity.workMs) },
      { label: "\u65E5\u5747 Tokens", value: formatUnits(avg) }
    ]
  };
  const deltaTone = (pct) => pct === null ? "flat" : pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  const hitTone = hitDelta === null ? "flat" : hitDelta > 0 ? "up" : hitDelta < 0 ? "down" : "flat";
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.statsRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        HubStat,
        {
          tone: "blue",
          iconShape: "square",
          icon: tokensIcon(20),
          label: "\u603B Tokens",
          value: yi?.yi ?? formatUnits(sum.total),
          sub: deltaTotal !== null ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: deltaTotal, label: periodLabel }) : void 0,
          subTone: deltaTone(deltaTotal),
          desc: deltaTotal === null ? `\u8303\u56F4\u5408\u8BA1 ${formatUnits(sum.total)}` : `\u73AF\u6BD4\u4E0A\u4E00\u5468\u671F ${deltaTotal >= 0 ? "+" : ""}${Math.round(deltaTotal)}%`,
          open: openStat === "total",
          onToggle: () => {
            toggleStat("total");
          },
          delay: 0
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        HubStat,
        {
          tone: "violet",
          iconShape: "square",
          icon: inputIcon(20),
          label: "\u8F93\u5165",
          value: formatUnits(sum.input),
          sub: deltaInput !== null ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: deltaInput, label: periodLabel }) : void 0,
          subTone: deltaTone(deltaInput),
          desc: `\u8F93\u5165\u7CBE\u786E ${formatExact(sum.input)}`,
          open: openStat === "input",
          onToggle: () => {
            toggleStat("input");
          },
          delay: 40
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        HubStat,
        {
          tone: "orange",
          iconShape: "square",
          icon: outputIcon(20),
          label: "\u8F93\u51FA",
          value: formatUnits(sum.output),
          sub: deltaOutput !== null ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: deltaOutput, label: periodLabel }) : void 0,
          subTone: deltaTone(deltaOutput),
          desc: `\u8F93\u51FA\u7CBE\u786E ${formatExact(sum.output)}`,
          open: openStat === "output",
          onToggle: () => {
            toggleStat("output");
          },
          delay: 80
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        HubStat,
        {
          tone: "green",
          iconShape: "square",
          icon: callsIcon(20),
          label: "\u8C03\u7528\u6B21\u6570",
          value: formatUnits(activity.requests),
          sub: deltaRequests !== null ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: deltaRequests, label: periodLabel }) : void 0,
          subTone: deltaTone(deltaRequests),
          desc: `\u7D2F\u8BA1\u5DE5\u4F5C\u65F6\u957F ${formatWorkDuration(activity.workMs)}\uFF1B\u6D3B\u8DC3 ${filtered.length} \u5929`,
          open: openStat === "requests",
          onToggle: () => {
            toggleStat("requests");
          },
          delay: 120
        }
      )
    ] }),
    openStat !== null && openStat in statDetailRows ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      HubStatDetail,
      {
        title: `${openStat === "total" ? "\u603B Tokens" : openStat === "input" ? "\u8F93\u5165" : openStat === "output" ? "\u8F93\u51FA" : "\u8C03\u7528\u6B21\u6570"} \xB7 ${rangeLabel} \u660E\u7EC6`,
        rows: statDetailRows[openStat]
      }
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: `${css2.mainScroll} ${modalStaggerClass}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: {
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "minmax(0, 2.2fr) minmax(280px, 1fr)",
        gap: 10,
        alignItems: "start",
        minWidth: 0
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            HubSection,
            {
              title: "\u7528\u91CF\u8D8B\u52BF",
              meta: scopeLabel,
              action: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", rowGap: 6, justifyContent: "flex-end" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: css2.seg, role: "tablist", "aria-label": "\u56FE\u8868\u6837\u5F0F", children: [["bar", "\u67F1\u72B6"], ["area", "\u9762\u79EF"]].map(([key, name]) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": chartStyle === key,
                    className: css2.segBtn,
                    "data-active": chartStyle === key || void 0,
                    onClick: () => {
                      setChartStyle(key);
                    },
                    children: name
                  },
                  key
                )) }),
                /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.dropWrap, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("button", { type: "button", className: css2.toolButton, style: { height: 24, padding: "0 8px", fontSize: 11, gap: 5 }, "aria-haspopup": "menu", "aria-expanded": stackOpen || void 0, title: "\u5806\u53E0\u53E3\u5F84", onClick: () => setStackOpen((v) => !v), children: [
                    stackMode === "io" ? "\u8F93\u5165+\u8F93\u51FA" : "\u5168\u53E3\u5F84",
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "m6 9 6 6 6-6" }) })
                  ] }),
                  stackOpen && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: css2.bulkOverlay, onClick: () => setStackOpen(false) }),
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: css2.dropMenu, role: "menu", "aria-label": "\u5806\u53E0\u53E3\u5F84", style: { left: "auto", right: 0 }, children: [["io", "\u8F93\u5165+\u8F93\u51FA", "\u4E0D\u542B\u7F13\u5B58"], ["full", "\u5168\u53E3\u5F84", "\u542B\u7F13\u5B58\u8BFB\u53D6"]].map(([key, name, meta]) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("button", { type: "button", role: "menuitemradio", className: css2.dropItem, "aria-checked": stackMode === key, onClick: () => {
                      setStackMode(key);
                      setStackOpen(false);
                    }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.dropCheck, "data-on": stackMode === key || void 0, children: "\u2713" }),
                      name,
                      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--dsw-alias-label-tertiary)" }, children: meta })
                    ] }, key)) })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.dropWrap, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("button", { type: "button", className: css2.toolButton, style: { height: 24, padding: "0 8px", fontSize: 11, gap: 5 }, onClick: () => setUnitOpen((v) => !v), children: [
                    unit === "auto" ? "Tokens" : unit === "wan" ? "\u4E07" : "\u4EBF",
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "m6 9 6 6 6-6" }) })
                  ] }),
                  unitOpen && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: css2.bulkOverlay, onClick: () => setUnitOpen(false) }),
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: css2.dropMenu, children: [["auto", "Tokens\uFF08\u81EA\u52A8\uFF09"], ["wan", "\u4E07"], ["yi", "\u4EBF"]].map(([key, name]) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("button", { type: "button", className: css2.dropItem, "aria-checked": unit === key, onClick: () => {
                      setUnit(key);
                      setUnitOpen(false);
                    }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.dropCheck, "data-on": unit === key || void 0, children: "\u2713" }),
                      name
                    ] }, key)) })
                  ] })
                ] })
              ] }),
              children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { ...panel(14, 10), minHeight: 250 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }, children: showTrend ? chartStyle === "bar" ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                  BarChart,
                  {
                    data: series,
                    variant: stackMode,
                    baseline,
                    format: fmt,
                    anomalies: anomalyMap ?? void 0,
                    onSelectAnomaly: anomalyMap !== null && onJumpSignal !== void 0 ? () => onJumpSignal() : void 0,
                    height: compact ? 200 : 250
                  },
                  `bar-${stackMode}`
                ) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
                  AreaChart,
                  {
                    data: series,
                    variant: stackMode,
                    height: compact ? 200 : 250
                  },
                  `area-${stackMode}`
                ) : emptyHint("\u6682\u65E0\u53EF\u7ED8\u5236\u7684\u8D8B\u52BF\u6570\u636E") }),
                showTrend && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ChartFoot, { series, stackMode, format: fmt })
              ] })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(HubSection, { title: `${scopeLabel.replace(/\s/g, "")}\u6982\u89C8`, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovGrid, children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "120ms" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u65E5\u5747 Tokens" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, children: formatUnits(avg) }),
              deltaAvg !== null && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "15px", fontFamily: MONO3, color: deltaTone(deltaAvg) === "up" ? "var(--dsw-alias-state-success-primary)" : deltaTone(deltaAvg) === "down" ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-label-tertiary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: deltaAvg, label: periodLabel }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "160ms" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u5DE5\u4F5C\u65F6\u957F" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, children: formatWorkDuration(activity.workMs) }),
              deltaWork !== null && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "15px", fontFamily: MONO3, color: deltaTone(deltaWork) === "up" ? "var(--dsw-alias-state-success-primary)" : deltaTone(deltaWork) === "down" ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-label-tertiary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: deltaWork, label: periodLabel }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "200ms" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u7F13\u5B58\u91CF" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, children: formatUnits(sum.cache) }),
              deltaCache !== null && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "15px", fontFamily: MONO3, color: deltaTone(deltaCache) === "up" ? "var(--dsw-alias-state-success-primary)" : deltaTone(deltaCache) === "down" ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-label-tertiary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: deltaCache, label: periodLabel }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "240ms" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u6D3B\u8DC3\u6A21\u578B" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, children: String(rank.length) }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "15px", fontFamily: MONO3, color: rank.length === prevRank.length ? "var(--dsw-alias-label-tertiary)" : "var(--dsw-alias-label-secondary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(CountChip, { delta: rank.length - prevRank.length, label: periodLabel }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.ovTile, style: { animationDelay: "280ms" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovLabel, children: "\u5F02\u5E38\u65E5" }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: css2.ovValue, style: { color: anomalyCount > 0 ? "var(--dsw-alias-state-error-primary)" : void 0 }, children: String(anomalyCount) }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "15px", fontFamily: MONO3, color: anomalyCount === prevAnomalyCount ? "var(--dsw-alias-label-tertiary)" : "var(--dsw-alias-label-secondary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(CountChip, { delta: anomalyCount - prevAnomalyCount, label: periodLabel }) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            HubSection,
            {
              title: "\u7F13\u5B58\u547D\u4E2D\u7387",
              meta: hitDelta !== null ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "16px", fontFamily: MONO3, color: hitTone === "up" ? "var(--dsw-alias-state-success-primary)" : hitTone === "down" ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-label-tertiary)" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DeltaChip, { pct: hitDelta, label: periodLabel }) }) : void 0,
              children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { ...panel(14, 8), alignItems: "center" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Gauge, { percent: filtered.length > 0 ? hitRate : null, label: "\u547D\u4E2D\u7387", size: compact ? 140 : 168 }),
                /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { alignSelf: "stretch", display: "flex", borderTop: "1px solid var(--dsw-alias-border-l1)", paddingTop: 8 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-secondary)" }, children: "\u547D\u4E2D Tokens" }),
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 14, lineHeight: "20px", fontWeight: 600, fontFamily: MONO3, color: "var(--dsw-alias-label-primary)" }, children: formatUnits(sum.cache) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { width: 1, background: "var(--dsw-alias-border-l2)", margin: "4px 0" } }),
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-secondary)" }, children: "\u7F13\u5B58\u8BFB\u53D6 Tokens" }),
                    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { fontSize: 14, lineHeight: "20px", fontWeight: 600, fontFamily: MONO3, color: "var(--dsw-alias-label-primary)" }, children: formatUnits(sum.cache) })
                  ] })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
            HubSection,
            {
              title: "\u4F9B\u5E94\u5546\u7528\u91CF",
              meta: "Top 5",
              action: share.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(LinkButton, { onClick: onJumpAccounts, children: "\u67E5\u770B\u5168\u90E8" }) : void 0,
              children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { ...panel(12, 2) }, children: share.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-tertiary)" }, children: [
                rangeLabel,
                "\u6682\u65E0\u7528\u91CF"
              ] }) : share.slice(0, 5).map((s, i) => {
                const pct = shareTotal > 0 ? Math.round(s.tokens / shareTotal * 1e3) / 10 : 0;
                return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: css2.provRow, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { width: 18, flex: "none", textAlign: "right", fontSize: 11, fontFamily: MONO3, color: "var(--dsw-alias-label-tertiary)" }, children: String(i + 1).padStart(2, "0") }),
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { width: compact ? 64 : 88, flex: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "var(--dsw-alias-label-primary)" }, title: s.provider, children: s.provider }),
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { flex: 1, height: 8, borderRadius: 4, background: "var(--dsw-alias-border-l2)", overflow: "hidden", minWidth: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: {
                    height: "100%",
                    width: `${Math.max(2, s.tokens / (shareTop || 1) * 100)}%`,
                    background: `linear-gradient(90deg, ${palette[i % palette.length]}, color-mix(in srgb, ${palette[i % palette.length]} 72%, #7c5cf0))`,
                    borderRadius: 4,
                    transition: "width .45s cubic-bezier(.2,.8,.2,1)"
                  } }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("span", { style: { flex: "none", width: 44, textAlign: "right", fontSize: 12, fontFamily: MONO3, color: "var(--dsw-alias-label-secondary)" }, children: [
                    pct,
                    "%"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { flex: "none", width: 64, textAlign: "right", fontSize: 12, fontWeight: 600, fontFamily: MONO3, color: "var(--dsw-alias-label-primary)" }, children: formatUnits(s.tokens) })
                ] }, s.provider);
              }) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(HubSection, { title: "\u4F9B\u5E94\u5546\u544A\u8B66", meta: alerts.length > 0 ? `${alerts.length} \u6761` : "\u5168\u90E8\u6B63\u5E38", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { ...panel(12, 8), flex: "1 1 auto", minHeight: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }, children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-secondary)" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { width: 18, height: 18, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", color: "var(--dsw-alias-state-success-primary)", background: "color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent)" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "m5 13 4 4 10-10" }) }) }),
              "\u5168\u90E8\u4F9B\u5E94\u5546\u72B6\u6001\u6B63\u5E38\u3002"
            ] }) : alerts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderTop: i === 0 ? void 0 : "1px solid var(--dsw-alias-border-l1)"
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { width: 8, height: 8, borderRadius: 4, flex: "none", background: p.alert.level === "critical" ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-state-warn-primary)" } }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, lineHeight: "20px", color: "var(--dsw-alias-label-primary)" }, children: p.displayName }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { style: { marginLeft: "auto", flex: "none", fontSize: 12, lineHeight: "18px", fontFamily: MONO3, color: "var(--dsw-alias-label-secondary)" }, children: p.alert.metric === "remaining-percent" ? `\u5269\u4F59 ${p.alert.value ?? 0}%` : `${p.alert.value ?? ""}` })
            ] }, p.id)) }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { marginTop: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(LinkButton, { onClick: onJumpAccounts, children: "\u67E5\u770B\u4F59\u989D/\u914D\u989D" }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: {
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "minmax(0, 1.6fr) minmax(280px, 1fr)",
        gap: 10,
        alignItems: "start",
        minWidth: 0
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(HubSection, { title: "\u4F9B\u5E94\u5546\u8D8B\u52BF\u5BF9\u6BD4", meta: `${scopeLabel} \xB7 Top ${lineProvs.length}`, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { ...panel(14, 10), minHeight: 250 }, children: hasLineData ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ProviderLines, { series: lineSeries, labels: lineLabels, height: compact ? 200 : 240 }, `${provider.trim()}-${range.start}-${range.end}`) : emptyHint(`${scopeLabel}\u6682\u65E0\u7528\u91CF`) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(HubSection, { title: "\u7528\u91CF\u6784\u6210", meta: scopeLabel, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { ...panel(14, 10), minHeight: 250, justifyContent: "center" }, children: sum.total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DonutChart, { slices: composeSlices, centerTitle: "\u672C\u671F\u603B\u91CF", centerValue: formatUnits(sum.total) }) : emptyHint(`${scopeLabel}\u6682\u65E0\u7528\u91CF`) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { style: {
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 10,
        alignItems: "start",
        minWidth: 0
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(HubSection, { title: "24 \u5C0F\u65F6\u5206\u5E03", meta: provActive ? "\u5C0F\u65F6\u6570\u636E\u65E0\u4F9B\u5E94\u5546\u62C6\u5206" : `${rangeLabel} \xB7 \u5168\u4F9B\u5E94\u5546`, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { ...panel(14, 10) }, children: provActive ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: css2.empty, children: "\u5C0F\u65F6\u6570\u636E\u65E0\u4F9B\u5E94\u5546\u62C6\u5206\uFF0C\u6E05\u9664\u7B5B\u9009\u540E\u67E5\u770B" }) : hasHourData ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(BarChart, { data: hourBars, variant: "io", movingAverage: 0, height: compact ? 170 : 200 }) : emptyHint("\u6682\u65E0\u5C0F\u65F6\u7EA7\u6570\u636E") }) }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(HubSection, { title: "\u9AD8\u5CF0\u65E5\u6392\u884C", meta: `${scopeLabel} \xB7 Top ${topDays.length}`, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { ...panel(14, 10) }, children: topDays.length === 0 ? emptyHint(`${scopeLabel}\u6682\u65E0\u7528\u91CF`) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(RankBars, { rows: topDays, maxRows: 7, nameWidth: compact ? 110 : 130, ranked: true, dot: false }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        HubSection,
        {
          title: "\u6A21\u578B\u6D88\u8017\u6392\u884C",
          meta: `${scopeLabel} \xB7 Top ${Math.min(10, rank.length)}`,
          action: rank.length > 0 && onJumpDetail !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(LinkButton, { onClick: onJumpDetail, children: "\u67E5\u770B\u66F4\u591A" }) : void 0,
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { style: { ...panel(14, 10) }, children: rank.length === 0 ? emptyHint(`${scopeLabel}\u6682\u65E0\u7528\u91CF`) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(RankBars, { rows: rank, nameWidth: compact ? 140 : 200, ranked: true }) })
        }
      )
    ] })
  ] });
}

// src/client/usage/dashboard/UsageTab.tsx
var import_react21 = require("react");

// src/client/usage/dashboard/charts/Heatmap.tsx
var import_react18 = require("react");
var import_react_dom7 = require("react-dom");
var import_jsx_runtime21 = require("react/jsx-runtime");
var GAP = 6;
var TIP_GAP = 8;
var heatPalette = [
  "#12314f",
  "#19466f",
  "#215d94",
  "#2a75b8",
  "#398dda",
  "#4f8cff",
  "#6fa0ff",
  "#8d7bff",
  "#ad66ff"
];
function heatLevel(v) {
  if (v <= 0) return 0;
  if (v < 100) return 1;
  if (v < 1e3) return 2;
  if (v < 1e4) return 3;
  if (v < 1e5) return 4;
  if (v < 1e6) return 5;
  if (v < 1e7) return 6;
  if (v < 1e8) return 7;
  if (v < 1e9) return 8;
  return 9;
}
function Heatmap({ cells, onSelect, rows = 5, cellText = "value" }) {
  const [hover, setHover] = (0, import_react18.useState)(null);
  const cols = Math.max(1, Math.ceil(cells.length / rows));
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { style: { display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: GAP, width: "100%" }, children: cells.map((c) => {
      const idx = Math.min(9, heatLevel(c.value));
      return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        "div",
        {
          onMouseEnter: (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setHover({ cell: c, left: r.left, top: r.top });
          },
          onMouseLeave: () => setHover(null),
          onClick: () => onSelect?.(c),
          style: { aspectRatio: "1", minWidth: 0, borderRadius: 6, background: idx === 0 ? "var(--dsw-alias-border-l2)" : heatPalette[idx - 1], cursor: onSelect ? "pointer" : "default", opacity: c.value > 0 ? 1 : 0.35, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
          children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, minWidth: 0 }, children: [
            (cellText === "label" || cellText === "both") && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { style: { fontSize: 9, lineHeight: "11px", fontWeight: 600, color: "rgba(255,255,255,0.9)", textShadow: "0 1px 2px rgba(0,0,0,.4)", whiteSpace: "nowrap" }, children: c.short ?? c.label }),
            (cellText === "value" || cellText === "both") && c.value > 0 && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { style: { fontSize: 10, lineHeight: "12px", fontWeight: 600, color: "rgba(255,255,255,0.94)", textShadow: "0 1px 2px rgba(0,0,0,.35)", whiteSpace: "nowrap" }, children: formatUnits(c.value) })
          ] })
        },
        c.key
      );
    }) }),
    hover !== null && typeof document !== "undefined" && (0, import_react_dom7.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { style: { position: "fixed", bottom: typeof window !== "undefined" ? window.innerHeight - hover.top + TIP_GAP : 0, left: hover.left, background: "var(--dsw-alias-bg-layer-3)", border: "1px solid var(--dsw-alias-border-l1)", borderRadius: 8, padding: "8px 12px", fontSize: 12, whiteSpace: "nowrap", zIndex: 6100, boxShadow: "0 8px 24px rgba(0,0,0,.35)", pointerEvents: "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { style: { fontWeight: 600, marginBottom: 2, color: "var(--dsw-alias-label-primary)" }, children: hover.cell.label }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { style: { color: "var(--dsw-alias-label-secondary)" }, children: [
          "\u5408\u8BA1 ",
          hover.cell.value > 0 ? formatUnits(hover.cell.value) : "\u65E0\u7528\u91CF"
        ] }),
        hover.cell.input !== void 0 && (hover.cell.input ?? 0) + (hover.cell.output ?? 0) + (hover.cell.cache ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { style: { marginTop: 4, display: "flex", flexDirection: "column", gap: 2, color: "var(--dsw-alias-label-secondary)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { children: [
            "\u8F93\u5165 ",
            formatUnits(hover.cell.input ?? 0),
            " \xB7 \u8F93\u51FA ",
            formatUnits(hover.cell.output ?? 0)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { children: [
            "\u7F13\u5B58 ",
            formatUnits(hover.cell.cache ?? 0),
            hover.cell.hitRate !== void 0 ? ` \xB7 \u547D\u4E2D ${formatHitRate(hover.cell.hitRate)}` : ""
          ] })
        ] })
      ] }),
      document.body
    )
  ] });
}

// src/client/usage/dashboard/charts/MonthCalendar.tsx
var import_react19 = require("react");
var import_react_dom8 = require("react-dom");
var import_jsx_runtime22 = require("react/jsx-runtime");
var STYLE_ID10 = "dsh-month-calendar-styles";
var TIP_GAP2 = 8;
var SHEET7 = `
@keyframes dsh-month-cell-in {
  from { opacity: 0; transform: translate3d(0, 4px, 0) scale(0.92); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
.dsh-month-cell {
  border: 0;
  border-radius: 9px;
  aspect-ratio: 1;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  opacity: 0;
  animation: dsh-month-cell-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 160ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 240ms cubic-bezier(0.2, 0.8, 0.2, 1), color 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-month-cell:hover {
  z-index: 2;
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px var(--dsw-alias-state-business-primary), 0 8px 18px color-mix(in srgb, var(--dsw-alias-state-business-primary) 34%, transparent);
}
.dsh-month-cell[data-empty="true"] { cursor: default; }
.dsh-month-cell[data-empty="true"]:hover { transform: none; box-shadow: none; }
@media (prefers-reduced-motion: reduce) {
  .dsh-month-cell { animation: none; opacity: 1; }
  .dsh-month-cell:hover { transform: none; }
}
`;
function ensureStyles2() {
  if (typeof document === "undefined") return () => {
  };
  let tag = document.getElementById(STYLE_ID10);
  if (tag === null) {
    tag = document.createElement("style");
    tag.id = STYLE_ID10;
    tag.dataset.plugin = "dsh-triad";
    tag.textContent = SHEET7;
    document.head.appendChild(tag);
  }
  return () => {
    tag?.remove();
  };
}
function MonthCalendar({ year, month, cells, onSelect }) {
  const [hover, setHover] = (0, import_react19.useState)(null);
  (0, import_react19.useEffect)(() => ensureStyles2(), []);
  const byDay = /* @__PURE__ */ new Map();
  for (const c of cells) byDay.set(c.day, c);
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const blanks = Array.from({ length: firstWeekday });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = /* @__PURE__ */ new Date();
  const todayDay = today.getFullYear() === year && today.getMonth() + 1 === month ? today.getDate() : null;
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6, marginBottom: 6 }, children: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"].map((w) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { style: { fontSize: 11, lineHeight: "16px", textAlign: "center", color: "var(--dsw-alias-label-tertiary)" }, children: w }, w)) }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }, children: [
      blanks.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { style: { aspectRatio: "1" }, "aria-hidden": "true" }, `b${i}`)),
      days.map((d) => {
        const cell = byDay.get(d);
        const value = cell?.value ?? 0;
        const active = value > 0;
        const idx = active ? Math.min(9, heatLevel(value)) : 0;
        const bg = active ? heatPalette[idx - 1] : "color-mix(in srgb, var(--dsw-alias-border-l2) 55%, transparent)";
        const fg = active ? "rgba(255,255,255,0.96)" : "var(--dsw-alias-label-secondary)";
        return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
          "button",
          {
            type: "button",
            className: "dsh-month-cell",
            "data-today": todayDay === d || void 0,
            "aria-label": `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}${active ? ` \xB7 ${formatUnits(value)}` : ""}`,
            style: {
              background: bg,
              color: fg,
              animationDelay: `${(d - 1) % 7 * 18 + Math.floor((d - 1) / 7) * 8}ms`,
              boxShadow: todayDay === d ? "0 0 0 1px var(--dsw-alias-state-business-primary)" : void 0
            },
            onClick: () => cell !== void 0 && onSelect?.(cell),
            onMouseEnter: (e) => {
              if (cell === void 0) return;
              const r = e.currentTarget.getBoundingClientRect();
              setHover({ cell, left: r.left, top: r.top });
            },
            onMouseLeave: () => setHover(null),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { style: { fontSize: 11, lineHeight: "13px", fontWeight: 600, opacity: active ? 1 : 0.85 }, children: d }),
              active && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { style: { fontSize: 10, lineHeight: "12px", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }, children: formatUnits(value) })
            ]
          },
          d
        );
      })
    ] }),
    hover !== null && typeof document !== "undefined" && (0, import_react_dom8.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { style: {
        position: "fixed",
        bottom: typeof window !== "undefined" ? window.innerHeight - hover.top + TIP_GAP2 : 0,
        left: hover.left,
        background: "var(--dsw-alias-bg-layer-3)",
        border: "1px solid var(--dsw-alias-border-l1)",
        borderRadius: 10,
        padding: "9px 12px",
        fontSize: 12,
        lineHeight: "18px",
        color: "var(--dsw-alias-label-secondary)",
        zIndex: 6100,
        boxShadow: "0 8px 24px rgba(0,0,0,.35)",
        pointerEvents: "none"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { style: { fontWeight: 600, marginBottom: 2, color: "var(--dsw-alias-label-primary)" }, children: hover.cell.key }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { children: [
          "\u5408\u8BA1 ",
          formatUnits(hover.cell.value)
        ] }),
        hover.cell.input + hover.cell.output + hover.cell.cache > 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { style: { marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { children: [
            "\u8F93\u5165 ",
            formatUnits(hover.cell.input),
            " \xB7 \u8F93\u51FA ",
            formatUnits(hover.cell.output)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { children: [
            "\u7F13\u5B58 ",
            formatUnits(hover.cell.cache),
            hover.cell.hitRate !== void 0 && hover.cell.hitRate !== null ? ` \xB7 \u547D\u4E2D ${formatHitRate(hover.cell.hitRate)}` : ""
          ] })
        ] })
      ] }),
      document.body
    )
  ] });
}

// src/client/usage/dashboard/ActivityGrid.tsx
var import_react20 = require("react");
var import_react_dom9 = require("react-dom");
var import_jsx_runtime23 = require("react/jsx-runtime");
var METRIC_LABELS = {
  tokens: "Token \u7528\u91CF",
  input: "\u8F93\u5165",
  output: "\u8F93\u51FA",
  cache: "\u7F13\u5B58",
  requests: "\u8C03\u7528\u6B21\u6570"
};
function metricValueOf(day, metric) {
  if (day === null || day === void 0) return 0;
  switch (metric) {
    case "input":
      return day.inputTokens ?? 0;
    case "output":
      return day.outputTokens ?? 0;
    case "cache":
      return (day.cacheReadTokens ?? 0) + (day.cacheWriteTokens ?? 0);
    case "requests":
      return day.requests ?? 0;
    default:
      return day.tokens ?? 0;
  }
}
var ACTIVITY_COLUMNS = 52;
var CELL = 14;
var GAP2 = 3;
var RADIUS = 3;
var TIP_GAP3 = 8;
var BLUE = [31, 111, 235];
var STYLE_ID11 = "dsh-activity-styles";
var WEEKDAYS = ["\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D", "\u5468\u65E5"];
var SHEET8 = `
@keyframes dsh-activity-cell-in {
  from { opacity: 0; transform: translate3d(0, 4px, 0) scale(0.7); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
.dsh-activity-cell {
  border: 0;
  border-radius: ${RADIUS}px;
  width: ${CELL}px;
  height: ${CELL}px;
  flex: none;
  padding: 0;
  cursor: default;
  opacity: 0;
  animation: dsh-activity-cell-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: transform 140ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 140ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-activity-cell[data-clickable="true"] { cursor: pointer; }
.dsh-activity-cell[data-clickable="true"]:hover {
  z-index: 2;
  transform: scale(1.5);
  box-shadow: 0 0 0 1px var(--dsw-alias-state-business-primary), 0 6px 14px color-mix(in srgb, var(--dsw-alias-state-business-primary) 38%, transparent);
}
.dsh-activity-cell[data-today="true"] { box-shadow: 0 0 0 1px var(--dsw-alias-state-business-primary); }
.dsh-activity-cell[data-selected="true"] { box-shadow: 0 0 0 1px var(--dsw-alias-label-primary), 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 26%, transparent); }
.dsh-activity-tabs {
  position: relative;
  flex: none;
  width: 104px;
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--dsw-alias-fill-l2);
}
.dsh-activity-ind {
  position: absolute;
  left: 3px;
  top: 3px;
  bottom: 3px;
  z-index: 0;
  width: calc((100% - 6px) / 2);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  transform: translateX(calc(var(--dsh-activity-ind, 0) * 100%));
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-activity-tab {
  flex: 1 1 0;
  min-width: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  padding: 0 2px;
  font-family: inherit;
  font-size: 12px;
  line-height: 22px;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  position: relative;
  z-index: 1;
  transition: color 220ms cubic-bezier(0.2, 0.8, 0.2, 1), font-weight 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-activity-tab:hover { color: var(--dsw-alias-label-secondary); }
.dsh-activity-tab[data-active="true"] { color: var(--dsw-alias-label-primary); font-weight: 600; }
@media (prefers-reduced-motion: reduce) {
  .dsh-activity-cell { animation: none; opacity: 1; }
  .dsh-activity-cell[data-clickable="true"]:hover { transform: none; }
  .dsh-activity-ind { transition: none; }
}
`;
function ensureActivityStyles() {
  if (typeof document === "undefined") return () => {
  };
  let tag = document.getElementById(STYLE_ID11);
  if (tag === null) {
    tag = document.createElement("style");
    tag.id = STYLE_ID11;
    tag.dataset.plugin = "dsh-triad";
    tag.textContent = SHEET8;
    document.head.appendChild(tag);
  }
  return () => {
    tag?.remove();
  };
}
function shiftDayKey(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, (d ?? 1) + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function weekdayIndex(key) {
  const [y, m, d] = key.split("-").map(Number);
  return (new Date(y, (m ?? 1) - 1, d ?? 1).getDay() + 6) % 7;
}
function buildActivityGrid(days, mode, today = /* @__PURE__ */ new Date(), metric = "tokens") {
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dayMap = /* @__PURE__ */ new Map();
  if (Array.isArray(days)) {
    for (const day of days) {
      if (day !== null && typeof day === "object" && typeof day.date === "string") dayMap.set(day.date, day);
    }
  }
  const columns = ACTIVITY_COLUMNS;
  const totalDays = columns * 7;
  const firstKey = shiftDayKey(todayKey, -((columns - 1) * 7 + weekdayIndex(todayKey)));
  const endKey = shiftDayKey(firstKey, totalDays - 1);
  const buckets = new Array(totalDays);
  const indexByKey = /* @__PURE__ */ new Map();
  for (let i = 0; i < totalDays; i += 1) {
    const key = shiftDayKey(firstKey, i);
    indexByKey.set(key, i);
    buckets[i] = { key, tokens: 0, requests: 0, cumulative: 0, active: false };
  }
  let running = 0;
  let firstRecorded = null;
  for (const key of [...dayMap.keys()].sort()) {
    if (firstRecorded === null) firstRecorded = key;
    const entry = dayMap.get(key);
    const value = metricValueOf(entry, metric);
    running += value;
    const index = indexByKey.get(key);
    if (index === void 0) continue;
    buckets[index].tokens = value;
    buckets[index].requests = entry.requests ?? 0;
    buckets[index].cumulative = running;
    buckets[index].active = value > 0;
  }
  const weekTokens = new Array(columns).fill(0);
  const weekRequests = new Array(columns).fill(0);
  for (let c = 0; c < columns; c += 1) {
    let t = 0;
    let r = 0;
    for (let i = 0; i < 7; i += 1) {
      t += buckets[c * 7 + i].tokens;
      r += buckets[c * 7 + i].requests;
    }
    weekTokens[c] = t;
    weekRequests[c] = r;
  }
  const cells = [];
  const rows = Array.from({ length: 7 }, () => []);
  let max = 0;
  let total = 0;
  let activeDays = 0;
  let peakDay = null;
  let peakTokens = 0;
  for (let i = 0; i < totalDays; i += 1) {
    const bucket = buckets[i];
    const column = Math.floor(i / 7);
    const value = mode === "week" ? weekTokens[column] : mode === "cumulative" ? bucket.cumulative : bucket.tokens;
    const day = dayMap.get(bucket.key);
    const cell = {
      key: bucket.key,
      column,
      row: i % 7,
      tokens: value,
      dayTokens: bucket.tokens,
      weekTokens: weekTokens[column],
      requests: bucket.requests,
      weekRequests: weekRequests[column],
      modelCount: day?.models?.length ?? 0,
      hitRate: bucket.active ? day?.cacheHitRate ?? null : null,
      isToday: bucket.key === todayKey,
      past: bucket.key <= todayKey
    };
    cells.push(cell);
    rows[i % 7].push(cell);
    total += bucket.tokens;
    if (bucket.active) activeDays += 1;
    if (bucket.tokens > peakTokens) {
      peakTokens = bucket.tokens;
      peakDay = bucket.key;
    }
    if (value > max) max = value;
  }
  const monthLabels = [];
  let prevMonth = firstKey.slice(0, 7);
  for (let c = 1; c < columns; c += 1) {
    const monday = shiftDayKey(firstKey, c * 7);
    const month = monday.slice(0, 7);
    if (month !== prevMonth) {
      monthLabels.push({ column: c, label: `${Number(month.slice(5))}\u6708` });
      prevMonth = month;
    }
  }
  return {
    mode,
    metric,
    columns,
    cells,
    rows,
    max,
    total,
    activeDays,
    peakDay: activeDays > 0 ? peakDay : null,
    peakTokens,
    startKey: firstKey,
    endKey,
    firstRecorded,
    monthLabels
  };
}
function activityColor(tokens, max) {
  if (!(tokens > 0)) return "color-mix(in srgb, var(--dsw-alias-border-l2) 55%, transparent)";
  const ratio = max > 0 ? Math.sqrt(Math.min(1, tokens / max)) : 1;
  const alpha = Math.min(1, 0.25 + 0.75 * ratio);
  return `rgba(${BLUE[0]}, ${BLUE[1]}, ${BLUE[2]}, ${alpha.toFixed(3)})`;
}
var MODES = [
  { id: "day", index: 0, label: "\u6BCF\u5468" },
  { id: "cumulative", index: 1, label: "\u7D2F\u8BA1" }
];
function ActivityGrid({ days, mode, onMode, selectedKey, onSelect, metric = "tokens", title = "Token \u6D3B\u52A8", subtitle = "52 \u5468\u6EDA\u52A8\u70ED\u529B\u56FE\uFF0C\u70B9\u51FB\u683C\u5B50\u67E5\u770B\u5F53\u65E5\u6A21\u578B\u660E\u7EC6" }) {
  const [hover, setHover] = (0, import_react20.useState)(null);
  const snapshot = (0, import_react20.useMemo)(() => buildActivityGrid(days, mode, /* @__PURE__ */ new Date(), metric), [days, mode, metric]);
  (0, import_react20.useEffect)(() => ensureActivityStyles(), []);
  const legendSteps = [0.3, 0.5, 0.68, 0.85, 1];
  const metricLabel = METRIC_LABELS[metric];
  const tooltipBody = (cell) => {
    if (mode === "week") {
      const start = shiftDayKey(cell.key, -cell.row);
      const end = shiftDayKey(cell.key, 6 - cell.row);
      return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(import_jsx_runtime23.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { fontWeight: 600, color: "var(--dsw-alias-label-primary)" }, children: [
          start,
          " \uFF5E ",
          end
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("span", { children: [
          "\u5468\u5408\u8BA1 ",
          formatUnits(cell.tokens),
          " \xB7 ",
          cell.weekRequests,
          " \u6B21\u8BF7\u6C42"
        ] })
      ] });
    }
    const valueLabel = mode === "cumulative" ? `\u7D2F\u8BA1${metricLabel}` : metricLabel;
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_jsx_runtime23.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 5, minWidth: 170 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { fontWeight: 600, color: "var(--dsw-alias-label-primary)", marginBottom: 1 }, children: [
        cell.key,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontWeight: 500 }, children: WEEKDAYS[cell.row] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: valueLabel }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { fontVariantNumeric: "tabular-nums", color: "var(--dsw-alias-label-primary)" }, children: formatUnits(cell.tokens) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: "\u6A21\u578B\u6570" }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { fontVariantNumeric: "tabular-nums", color: "var(--dsw-alias-label-primary)" }, children: cell.modelCount })
      ] })
    ] }) });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { fontSize: 14, lineHeight: "22px", fontWeight: 600, color: "var(--dsw-alias-label-primary)" }, children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: subtitle }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { marginLeft: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
        "span",
        {
          className: "dsh-activity-tabs",
          role: "group",
          "aria-label": "Token \u6D3B\u52A8\u53E3\u5F84",
          style: { "--dsh-activity-ind": String(MODES.find((m) => m.id === mode)?.index ?? 0) },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "dsh-activity-ind", "aria-hidden": "true" }),
            MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
              "button",
              {
                type: "button",
                className: "dsh-activity-tab",
                "data-active": m.id === mode,
                "aria-pressed": m.id === mode,
                onClick: () => onMode(m.id),
                children: m.label
              },
              m.id
            ))
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { style: { overflowX: "auto", marginTop: 12, paddingBottom: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { width: "max-content", margin: "0 auto", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { style: { position: "relative", height: 16, marginLeft: 30 }, children: snapshot.monthLabels.map((m) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        "span",
        {
          style: {
            position: "absolute",
            left: m.column * (CELL + GAP2),
            top: 0,
            fontSize: 11,
            lineHeight: "16px",
            color: "var(--dsw-alias-label-tertiary)",
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums"
          },
          children: m.label
        },
        m.column
      )) }),
      snapshot.rows.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { display: "flex", alignItems: "center", height: CELL + GAP2, marginTop: rowIndex === 0 ? 0 : GAP2 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
          "span",
          {
            style: {
              flex: "none",
              width: 30,
              fontSize: 11,
              lineHeight: `${CELL}px`,
              color: "var(--dsw-alias-label-tertiary)",
              textAlign: "left",
              paddingRight: 6,
              boxSizing: "border-box"
            },
            children: rowIndex % 2 === 0 ? WEEKDAYS[rowIndex] : ""
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { display: "flex", gap: GAP2 }, children: row.map((cell) => {
          if (!cell.past) {
            return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
              "span",
              {
                className: "dsh-activity-cell",
                "data-clickable": "false",
                "data-past": "false",
                "aria-hidden": "true",
                style: {
                  background: "color-mix(in srgb, var(--dsw-alias-border-l2) 30%, transparent)",
                  animationDelay: `${cell.column * 6}ms`
                }
              },
              cell.key
            );
          }
          return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-activity-cell",
              "data-clickable": "true",
              "data-past": "true",
              "data-today": cell.isToday,
              "data-selected": selectedKey === cell.key,
              "aria-label": `${cell.key} \xB7 ${formatUnits(cell.tokens)}`,
              "aria-pressed": selectedKey === cell.key,
              onClick: () => onSelect(cell.key),
              onMouseEnter: (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setHover({ cell, left: r.left, top: r.top });
              },
              onMouseLeave: () => setHover(null),
              style: {
                background: activityColor(cell.tokens, snapshot.max),
                animationDelay: `${cell.column * 6}ms`
              }
            },
            cell.key
          );
        }) })
      ] }, rowIndex))
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: "\u5C11" }),
      legendSteps.map((alpha, i) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { style: { width: 10, height: 10, borderRadius: 2, background: `rgba(${BLUE[0]}, ${BLUE[1]}, ${BLUE[2]}, ${alpha})` } }, i)),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: "\u591A" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("span", { style: { marginLeft: "auto", fontVariantNumeric: "tabular-nums" }, children: [
        snapshot.startKey,
        " ~ ",
        snapshot.endKey
      ] })
    ] }),
    hover !== null && typeof document !== "undefined" && (0, import_react_dom9.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { style: {
        position: "fixed",
        bottom: typeof window !== "undefined" ? window.innerHeight - hover.top + TIP_GAP3 : 0,
        left: hover.left + 10,
        background: "var(--dsw-alias-bg-layer-3)",
        border: "1px solid var(--dsw-alias-border-l1)",
        borderRadius: 10,
        padding: "9px 12px",
        fontSize: 12,
        lineHeight: "18px",
        color: "var(--dsw-alias-label-secondary)",
        zIndex: 6100,
        boxShadow: "0 8px 24px rgba(0,0,0,.35)",
        pointerEvents: "none"
      }, children: tooltipBody(hover.cell) }),
      document.body
    )
  ] });
}

// src/client/usage/dashboard/UsageTab.tsx
var import_jsx_runtime24 = require("react/jsx-runtime");
var MONO4 = "ui-monospace, SFMono-Regular, Menlo, monospace";
var STYLE_ID12 = "dsh-usage-search-styles";
var SHEET9 = `
@keyframes dsh-usage-row-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.dsh-usage-row-in { animation: dsh-usage-row-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
@media (prefers-reduced-motion: reduce) {
  .dsh-usage-row-in { animation: none; }
}
`;
function ensureSearchStyle() {
  if (typeof document === "undefined") return () => {
  };
  let tag = document.getElementById(STYLE_ID12);
  if (tag === null) {
    tag = document.createElement("style");
    tag.id = STYLE_ID12;
    tag.dataset.plugin = "dsh-triad";
    tag.textContent = SHEET9;
    document.head.appendChild(tag);
  }
  return () => {
    tag?.remove();
  };
}
var rowCard2 = {
  border: "1px solid var(--dsw-alias-border-l2)",
  borderRadius: 12,
  padding: "12px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  minWidth: 0
};
function CardHead({ name, meta }) {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { style: { fontSize: 14, lineHeight: "22px", fontWeight: 500, color: "var(--dsw-alias-label-primary)" }, children: name }),
    meta !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-tertiary)" }, children: meta })
  ] });
}
var thStyle = {
  textAlign: "left",
  padding: "6px 8px",
  fontSize: 12,
  lineHeight: "18px",
  fontWeight: 500,
  color: "var(--dsw-alias-label-secondary)",
  borderBottom: "1px solid var(--dsw-alias-border-l2)",
  whiteSpace: "nowrap"
};
var tdStyle = {
  padding: "6px 8px",
  fontSize: 13,
  lineHeight: "20px",
  color: "var(--dsw-alias-label-primary)"
};
var tdMono = { ...tdStyle, fontFamily: MONO4 };
function buildDetailRows(days, query) {
  const q = query.trim().toLowerCase();
  if (q === "") {
    return days.map((d) => {
      const s = sumTokens([d]);
      return {
        key: d.date,
        date: d.date,
        input: s.input,
        output: s.output,
        cache: s.cache,
        total: s.total,
        hitRate: d.cacheHitRate ?? null
      };
    });
  }
  const rows = [];
  for (const d of days) {
    for (const m of d.models ?? []) {
      const { provider, model } = splitModelKey(m.model);
      if (!provider.toLowerCase().includes(q) && !model.toLowerCase().includes(q)) continue;
      const input = m.inputTokens ?? 0;
      const cacheRead = m.cacheReadTokens ?? 0;
      const cacheWrite = m.cacheWriteTokens ?? 0;
      const prompt = input + cacheRead + cacheWrite;
      rows.push({
        key: `${d.date}:${m.model}`,
        date: d.date,
        model: m.model,
        input,
        output: m.outputTokens ?? 0,
        cache: cacheRead + cacheWrite,
        total: m.tokens ?? 0,
        hitRate: prompt > 0 ? cacheRead / prompt * 100 : null
      });
    }
  }
  return rows;
}
function filterUsageByQuery(days, query) {
  const q = query.trim().toLowerCase();
  if (q === "") return days;
  return days.map((d) => {
    const matched = (d.models ?? []).filter((m) => {
      const { provider, model } = splitModelKey(m.model);
      return provider.toLowerCase().includes(q) || model.toLowerCase().includes(q);
    });
    let input = 0;
    let output = 0;
    let cacheRead = 0;
    let cacheWrite = 0;
    for (const m of matched) {
      input += m.inputTokens ?? 0;
      output += m.outputTokens ?? 0;
      cacheRead += m.cacheReadTokens ?? 0;
      cacheWrite += m.cacheWriteTokens ?? 0;
    }
    const prompt = input + cacheRead + cacheWrite;
    return {
      ...d,
      inputTokens: input,
      outputTokens: output,
      cacheReadTokens: cacheRead,
      cacheWriteTokens: cacheWrite,
      tokens: input + output + cacheRead + cacheWrite,
      cacheHitRate: prompt > 0 ? cacheRead / prompt * 100 : d.cacheHitRate ?? 0,
      models: matched
    };
  });
}
function distinctModels(day) {
  return day === void 0 ? 0 : day.models?.length ?? 0;
}
function deltaSubCount(delta) {
  if (delta === null) return { text: "\u8F83\u6628\u65E5 \u2014", tone: "flat" };
  if (delta > 0) return { text: `\u8F83\u6628\u65E5 +${delta}`, tone: "up" };
  if (delta < 0) return { text: `\u8F83\u6628\u65E5 ${delta}`, tone: "down" };
  return { text: "\u8F83\u6628\u65E5 0", tone: "flat" };
}
function deltaSubPercent(delta) {
  if (delta === null) return { text: "\u8F83\u6628\u65E5 \u2014", tone: "flat" };
  if (delta > 0) return { text: `\u8F83\u6628\u65E5 \u2191 ${delta.toFixed(2)}%`, tone: "up" };
  if (delta < 0) return { text: `\u8F83\u6628\u65E5 \u2193 ${Math.abs(delta).toFixed(2)}%`, tone: "down" };
  return { text: "\u8F83\u6628\u65E5 0.00%", tone: "flat" };
}
var METRIC_OPTIONS = [
  { id: "tokens", label: "\u7528\u91CF" },
  { id: "input", label: "\u8F93\u5165" },
  { id: "output", label: "\u8F93\u51FA" },
  { id: "cache", label: "\u7F13\u5B58" },
  { id: "requests", label: "\u8C03\u7528\u6B21\u6570" }
];
function UsageTab({ range, rangeLabel, refreshTick, provider = "all" }) {
  const [usage, setUsage] = (0, import_react21.useState)(null);
  const [selectedDay, setSelectedDay] = (0, import_react21.useState)(null);
  const [activityMode, setActivityMode] = (0, import_react21.useState)("day");
  const [metric, setMetric] = (0, import_react21.useState)("tokens");
  const [query, setQuery] = (0, import_react21.useState)("");
  const [metricMenuOpen, setMetricMenuOpen] = (0, import_react21.useState)(false);
  const [openStat, setOpenStat] = (0, import_react21.useState)(null);
  const [error, setError] = (0, import_react21.useState)(null);
  const [retryTick, setRetryTick] = (0, import_react21.useState)(0);
  const isMobile = useIsMobile();
  (0, import_react21.useEffect)(() => {
    let alive = true;
    setError(null);
    usageApi.usage().then((p) => {
      if (!alive) return;
      if (p.ok !== true) throw new Error("\u7528\u91CF\u6570\u636E\u52A0\u8F7D\u5931\u8D25");
      setUsage(p.days);
    }).catch((e) => {
      if (alive) setError(e instanceof Error ? e.message : String(e));
    });
    return () => {
      alive = false;
    };
  }, [refreshTick, retryTick]);
  (0, import_react21.useEffect)(() => ensureSearchStyle(), []);
  (0, import_react21.useEffect)(() => {
    setSelectedDay(null);
  }, [provider]);
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(ErrorCard, { message: error, onRetry: () => setRetryTick((t) => t + 1) });
  }
  if (usage === null) return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { style: { padding: "24px 0", textAlign: "center", fontSize: 13, color: "var(--dsw-alias-label-tertiary)" }, children: "\u52A0\u8F7D\u4E2D\u2026" });
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const scoped = filterDaysByProvider(usage, provider);
  const filtered = [...filterDays(scoped, range)].sort((a, b) => a.date.localeCompare(b.date));
  const filteredSorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  const modelRankData = modelRank(filtered).map((row) => {
    const { provider: provider2, model } = splitModelKey(row.label);
    return { ...row, provider: provider2, model: model === provider2 ? row.label : model };
  });
  const sortedRank = modelRankData;
  const detailRows = buildDetailRows(filteredSorted, query);
  const searching = query.trim() !== "";
  const provActive = provider.trim() !== "" && provider.trim() !== "all";
  const provName = provider.trim();
  const scopeLabel = `${rangeLabel}${provActive ? ` \xB7 ${provName}` : ""}`;
  const noMatchHint = `\u6CA1\u6709\u5339\u914D${provActive ? `\u300C${provName}\u300D\u4F9B\u5E94\u5546` : ""}${searching && provActive ? "\u4E14" : ""}${searching ? `\u300C${query.trim()}\u300D` : ""}\u7684\u6570\u636E`;
  const inRangeSum = sumTokens(filtered);
  const hitRate = averageCacheHitRate(filtered);
  const usageByDate = /* @__PURE__ */ new Map();
  for (const d of scoped) usageByDate.set(d.date, d);
  const lastDay = filtered.length > 0 ? filtered[filtered.length - 1] : null;
  const prevDay = lastDay === null ? void 0 : usageByDate.get(toDayStr(new Date(fromDayStr(lastDay.date).getTime() - 864e5)));
  const modelsDelta = lastDay === null ? null : distinctModels(lastDay) - distinctModels(prevDay);
  const activeDelta = lastDay === null ? null : ((lastDay.tokens ?? 0) > 0 ? 1 : 0) - ((prevDay?.tokens ?? 0) > 0 ? 1 : 0);
  const hitDelta = lastDay === null || prevDay === void 0 || lastDay.cacheHitRate == null || prevDay.cacheHitRate == null ? null : lastDay.cacheHitRate - prevDay.cacheHitRate;
  const modelsSub = deltaSubCount(modelsDelta);
  const activeSub = deltaSubCount(activeDelta);
  const hitSub = deltaSubPercent(hitDelta);
  const heatDays = filterUsageByQuery(scoped, query);
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthCells = Array.from({ length: daysInMonth }, (_, i) => {
    const dateStr = `${monthPrefix}-${String(i + 1).padStart(2, "0")}`;
    const hit = heatDays.find((d) => d.date === dateStr);
    return {
      key: dateStr,
      day: i + 1,
      value: metricValueOf(hit, metric),
      input: hit?.inputTokens ?? 0,
      output: hit?.outputTokens ?? 0,
      cache: (hit?.cacheReadTokens ?? 0) + (hit?.cacheWriteTokens ?? 0),
      hitRate: hit?.cacheHitRate ?? null
    };
  });
  const yearCells = Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, "0")}`;
    const days = heatDays.filter((d) => d.date.startsWith(key));
    const sum = sumTokens(days);
    const value = metric === "tokens" ? sum.total : metric === "input" ? sum.input : metric === "output" ? sum.output : metric === "cache" ? sum.cache : days.reduce((acc, d) => acc + (d.requests ?? 0), 0);
    return {
      key,
      label: `${i + 1} \u6708`,
      short: `${i + 1}\u6708`,
      value,
      input: sum.input,
      output: sum.output,
      cache: sum.cache,
      hitRate: days.length > 0 ? days.reduce((acc, d) => acc + (d.cacheHitRate ?? 0), 0) / days.length : void 0
    };
  });
  const toggleStat = (key) => {
    setOpenStat((v) => v === key ? null : key);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: css2.statsRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        HubStat,
        {
          tone: "blue",
          icon: tokensIcon(18),
          label: "\u8303\u56F4\u5408\u8BA1",
          value: formatUnits(inRangeSum.total),
          sub: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("span", { children: [
            "\u2248 ",
            formatExact(inRangeSum.total)
          ] }),
          desc: `\u8F93\u5165 ${formatUnits(inRangeSum.input)} \xB7 \u8F93\u51FA ${formatUnits(inRangeSum.output)} \xB7 \u7F13\u5B58 ${formatUnits(inRangeSum.cache)}`,
          open: openStat === "total",
          onToggle: () => {
            toggleStat("total");
          },
          delay: 0
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        HubStat,
        {
          tone: "violet",
          icon: modelsIcon(18),
          label: "\u6A21\u578B\u6570",
          value: String(modelRankData.length),
          sub: modelsSub.text,
          subTone: modelsSub.tone,
          desc: `\u8303\u56F4\u5185\u7528\u5230 ${modelRankData.length} \u4E2A\u4E0D\u540C\u6A21\u578B`,
          open: openStat === "models",
          onToggle: () => {
            toggleStat("models");
          },
          delay: 40
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        HubStat,
        {
          tone: "green",
          icon: daysIcon(18),
          label: "\u6D3B\u8DC3\u5929\u6570",
          value: String(filtered.filter((d) => (d.tokens ?? 0) > 0).length),
          sub: activeSub.text,
          subTone: activeSub.tone,
          desc: `${filtered.length} \u5929\u4F4D\u4E8E\u6240\u9009\u8303\u56F4`,
          open: openStat === "days",
          onToggle: () => {
            toggleStat("days");
          },
          delay: 80
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        HubStat,
        {
          tone: "orange",
          icon: hitIcon(18),
          label: "\u5E73\u5747\u547D\u4E2D\u7387",
          value: formatHitRate(hitRate),
          sub: hitSub.text,
          subTone: hitSub.tone,
          desc: "\u7F13\u5B58\u8BFB\u5360\u63D0\u793A\u8BCD\u6BD4\u91CD \xB7 \u5DE6\u53F3\u5E73\u5747",
          open: openStat === "hit",
          onToggle: () => {
            toggleStat("hit");
          },
          delay: 120
        }
      )
    ] }),
    openStat !== null && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      HubStatDetail,
      {
        title: `${openStat === "total" ? "\u8303\u56F4\u5408\u8BA1" : openStat === "models" ? "\u6A21\u578B\u6570" : openStat === "days" ? "\u6D3B\u8DC3\u5929\u6570" : "\u5E73\u5747\u547D\u4E2D\u7387"} \xB7 ${rangeLabel}`,
        rows: openStat === "total" ? [
          { label: "\u8F93\u5165", value: formatUnits(inRangeSum.input) },
          { label: "\u8F93\u51FA", value: formatUnits(inRangeSum.output) },
          { label: "\u7F13\u5B58", value: formatUnits(inRangeSum.cache) }
        ] : openStat === "models" ? modelRankData.slice(0, 5).map((r) => ({ label: r.model, value: formatUnits(r.value) })) : openStat === "days" ? [
          { label: "\u8303\u56F4\u5929\u6570", value: `${filtered.length} \u5929` },
          { label: "\u6709\u91CF\u5929\u6570", value: `${filtered.filter((d) => (d.tokens ?? 0) > 0).length} \u5929` },
          { label: "\u7A7A\u767D\u5929\u6570", value: `${filtered.filter((d) => (d.tokens ?? 0) === 0).length} \u5929` }
        ] : [
          { label: "\u7F13\u5B58\u8BFB", value: formatUnits(inRangeSum.cache) },
          { label: "\u8F93\u5165", value: formatUnits(inRangeSum.input) }
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: css2.toolbar, children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: css2.searchBox, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": "true", style: { flex: "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("circle", { cx: "11", cy: "11", r: "7" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("path", { d: "m21 21-4.3-4.3" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          "input",
          {
            className: css2.searchInput,
            type: "text",
            value: query,
            placeholder: "\u641C\u7D22\u4F9B\u5E94\u5546 / \u6A21\u578B\u2026",
            "aria-label": "\u6309\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u641C\u7D22",
            onChange: (e) => setQuery(e.target.value)
          }
        ),
        query !== "" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("button", { type: "button", className: css2.searchClear, "aria-label": "\u6E05\u9664\u641C\u7D22", onClick: () => {
          setQuery("");
        }, children: "\u2715" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: css2.dropWrap, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
          "button",
          {
            type: "button",
            className: css2.toolButton,
            "aria-haspopup": "menu",
            "aria-expanded": metricMenuOpen || void 0,
            onClick: () => {
              setMetricMenuOpen((v) => !v);
            },
            title: "\u70ED\u529B\u56FE\u6307\u6807\u53E3\u5F84",
            children: [
              METRIC_OPTIONS.find((m) => m.id === metric)?.label ?? "\u7528\u91CF",
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { opacity: 0.7 }, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("path", { d: "m6 9 6 6 6-6" }) })
            ]
          }
        ),
        metricMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("button", { type: "button", className: css2.bulkOverlay, "aria-label": "\u5173\u95ED", onClick: () => {
            setMetricMenuOpen(false);
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: css2.dropMenu, role: "menu", "aria-label": "\u70ED\u529B\u56FE\u6307\u6807", children: METRIC_OPTIONS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
            "button",
            {
              type: "button",
              role: "menuitemradio",
              className: css2.dropItem,
              "aria-checked": m.id === metric,
              onClick: () => {
                setMetric(m.id);
                setMetricMenuOpen(false);
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: css2.dropCheck, "data-on": m.id === metric || void 0, "aria-hidden": "true", children: m.id === metric ? "\u2713" : "" }),
                m.label,
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--dsw-alias-label-tertiary)" }, children: METRIC_LABELS[m.id] })
              ]
            },
            m.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: css2.toolbarSpacer }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("span", { className: css2.toolbarMeta, children: [
        scopeLabel,
        " \xB7 ",
        searching ? `\u547D\u4E2D ${detailRows.length} \u884C` : `${filteredSorted.length} \u5929`
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: `${css2.mainScroll} ${modalStaggerClass}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        ActivityGrid,
        {
          days: heatDays,
          mode: activityMode,
          onMode: setActivityMode,
          metric,
          selectedKey: selectedDay,
          onSelect: setSelectedDay
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(HubSection, { title: "\u70ED\u529B", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, alignItems: "start" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { style: rowCard2, children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardHead, { name: `${year} \u5E74 ${month} \u6708\u70ED\u529B\uFF08\u65E5\u7528\u91CF\uFF09`, meta: "\u70B9\u51FB\u65E5\u67E5\u770B\u5F53\u65E5\u6A21\u578B\u660E\u7EC6" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(MonthCalendar, { year, month, cells: monthCells, onSelect: (c) => setSelectedDay(c.key) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { style: rowCard2, children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CardHead, { name: `${year} \u5E74\u5EA6\u70ED\u529B\uFF08\u6BCF\u6708\u6C47\u603B\uFF09`, meta: "1-6 \u6708 / 7-12 \u6708" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Heatmap, { cells: yearCells, rows: 2, cellText: "both" })
        ] })
      ] }) }),
      selectedDay !== null && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(HubSection, { title: `${selectedDay} \u6A21\u578B\u660E\u7EC6`, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { style: rowCard2, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DayDetailTable, { day: scoped.find((d) => d.date === selectedDay) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(HubSection, { title: "\u6A21\u578B\u6D88\u8017\u6392\u884C", meta: `${scopeLabel} \xB7 ${sortedRank.length} \u4E2A\u6A21\u578B`, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { style: rowCard2, children: sortedRank.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: css2.empty, children: searching || provActive ? noMatchHint : "\u8BE5\u8303\u56F4\u6682\u65E0\u7528\u91CF" }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(RankBars, { rows: sortedRank, nameWidth: isMobile ? 140 : 220 }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(HubSection, { title: "\u6BCF\u65E5\u660E\u7EC6", meta: searching ? `\u547D\u4E2D ${detailRows.length} \u884C` : `${scopeLabel} \xB7 ${filteredSorted.length} \u5929`, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { style: rowCard2, children: filteredSorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: css2.empty, children: "\u8BE5\u8303\u56F4\u6682\u65E0\u7528\u91CF" }) : detailRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: css2.empty, children: noMatchHint }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { style: { maxHeight: 320, overflowY: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("thead", { style: { position: "sticky", top: 0, background: "var(--dsw-alias-bg-layer-2)", zIndex: 1 }, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("tr", { children: (searching ? ["\u65E5\u671F", "\u6A21\u578B", "\u8F93\u5165", "\u8F93\u51FA", "\u7F13\u5B58", "\u5408\u8BA1", "\u547D\u4E2D\u7387"] : ["\u65E5\u671F", "\u8F93\u5165", "\u8F93\u51FA", "\u7F13\u5B58", "\u5408\u8BA1", "\u547D\u4E2D\u7387"]).map((h) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("th", { style: thStyle, children: h }, h)) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("tbody", { children: detailRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
          "tr",
          {
            className: "dsh-usage-row-in",
            style: { cursor: searching ? "default" : "pointer", borderBottom: "1px solid var(--dsw-alias-border-l1)" },
            onClick: searching ? void 0 : () => setSelectedDay(r.date),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdStyle, children: r.date }),
              r.model !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: { ...tdStyle, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, title: r.model, children: r.model }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.input) }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.output) }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.cache) }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.total) }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdStyle, children: formatHitRate(r.hitRate) })
            ]
          },
          r.key
        )) })
      ] }) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: css2.note, role: "note", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: css2.noteIcon, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("path", { d: "M12 11v5" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("path", { d: "M12 8h.01" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("span", { className: css2.noteBody, children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: css2.noteTitle, children: "\u70ED\u529B\u56FE\u8BF4\u660E" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: css2.noteText, children: "\u989C\u8272\u8D8A\u6DF1\u4EE3\u8868\u7528\u91CF\u8D8A\u9AD8\uFF0C\u652F\u6301\u67E5\u770B\u6BCF\u5468/\u7D2F\u8BA1\u7528\u91CF\u53CA\u6A21\u578B\u5206\u5E03\u660E\u7EC6\u3002" })
        ] })
      ] })
    ] })
  ] });
}
function DayDetailTable({ day }) {
  if (day === void 0) return null;
  const rows = [...day.models ?? []].sort((a, b) => b.tokens - a.tokens);
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("tr", { children: ["\u6A21\u578B", "\u8F93\u5165", "\u8F93\u51FA", "\u7F13\u5B58", "\u5408\u8BA1", "\u547D\u4E2D\u7387"].map((h) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("th", { style: thStyle, children: h }, h)) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("tr", { style: { borderBottom: "1px solid var(--dsw-alias-border-l1)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdStyle, children: r.model }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.inputTokens) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.outputTokens) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.cacheReadTokens) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdMono, children: formatUnits(r.tokens) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("td", { style: tdStyle, children: formatHitRate(r.cacheHitRate) })
    ] }, r.model)) })
  ] });
}

// src/client/usage/dashboard/SignalTab.tsx
var import_react22 = require("react");
var import_jsx_runtime25 = require("react/jsx-runtime");
function clockOf(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function percentOf(share) {
  if (share === null || !isFinite(share)) return "\u2014";
  return `${Math.round(share * 100)}%`;
}
function multipleOf(value) {
  if (value === null || !isFinite(value)) return "\u2014";
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)}x`;
}
function SignalTab() {
  const [signal, setSignal] = (0, import_react22.useState)(null);
  const [error, setError] = (0, import_react22.useState)(null);
  const [retryTick, setRetryTick] = (0, import_react22.useState)(0);
  const [openStat, setOpenStat] = (0, import_react22.useState)(null);
  const [openDate, setOpenDate] = (0, import_react22.useState)(null);
  const [dayRows, setDayRows] = (0, import_react22.useState)(null);
  const [dayLoading, setDayLoading] = (0, import_react22.useState)(false);
  const [dayError, setDayError] = (0, import_react22.useState)(null);
  const [budgetDraft, setBudgetDraft] = (0, import_react22.useState)("");
  const [budgetSaving, setBudgetSaving] = (0, import_react22.useState)(false);
  const [budgetNote, setBudgetNote] = (0, import_react22.useState)(null);
  (0, import_react22.useEffect)(() => {
    let alive = true;
    setError(null);
    usageApi.signal(30).then((payload) => {
      if (!alive) return;
      if (payload.ok !== true) throw new Error("\u4FE1\u53F7\u6570\u636E\u52A0\u8F7D\u5931\u8D25");
      setSignal(payload);
    }).catch((e) => {
      if (alive) setError(e instanceof Error ? e.message : String(e));
    });
    return () => {
      alive = false;
    };
  }, [retryTick]);
  (0, import_react22.useEffect)(() => {
    if (signal === null) return;
    setBudgetDraft(signal.budget !== null && signal.budget > 0 ? String(signal.budget) : "");
  }, [signal]);
  const toggleDay = (date) => {
    if (openDate === date) {
      setOpenDate(null);
      setDayRows(null);
      setDayError(null);
      return;
    }
    setOpenDate(date);
    setDayRows(null);
    setDayError(null);
    setDayLoading(true);
    usageApi.daySessions(date).then((payload) => {
      if (payload.ok !== true) throw new Error("\u4F1A\u8BDD\u6570\u636E\u52A0\u8F7D\u5931\u8D25");
      setDayRows(payload.sessions);
    }).catch((e) => setDayError(e instanceof Error ? e.message : String(e))).finally(() => setDayLoading(false));
  };
  const saveBudget = () => {
    const raw = budgetDraft.trim().replace(/,/g, "");
    const value = raw === "" ? 0 : Number(raw);
    if (!Number.isFinite(value) || value < 0) {
      setBudgetNote({ ok: false, text: "\u8BF7\u8F93\u5165\u975E\u8D1F\u6570\u5B57" });
      return;
    }
    setBudgetSaving(true);
    setBudgetNote(null);
    usageApi.saveBudget(value).then((payload) => {
      if (payload.ok !== true) throw new Error("\u4FDD\u5B58\u5931\u8D25");
      setBudgetNote({ ok: true, text: value > 0 ? `\u5DF2\u4FDD\u5B58\u9884\u7B97 ${formatUnits(value)} Token` : "\u5DF2\u5173\u95ED\u9884\u7B97" });
      setSignal((prev) => prev === null ? prev : { ...prev, budget: value });
    }).catch((e) => setBudgetNote({ ok: false, text: e instanceof Error ? e.message : String(e) })).finally(() => setBudgetSaving(false));
  };
  if (error !== null) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(ErrorCard, { message: error, onRetry: () => setRetryTick((t) => t + 1) });
  }
  if (signal === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { style: { padding: "24px 0", textAlign: "center", fontSize: 13, color: "var(--dsw-alias-label-tertiary)" }, children: "\u52A0\u8F7D\u4E2D\u2026" });
  }
  const { efficiency, signal: sig, budget } = signal;
  const anomalies = sig.anomalyDays;
  const topRoutesText = efficiency.topRoutes.slice(0, 3).map((r) => `${r.model} ${percentOf(r.share)}`).join(" \xB7 ");
  const budgetActive = budget !== null && budget > 0;
  const budgetUsed = budgetActive && sig.projected30 > 0 ? Math.min(1, sig.projected30 / budget) : 0;
  const budgetOver = budgetActive && sig.projected30 > budget;
  const toggleStat = (key) => {
    setOpenStat((v) => v === key ? null : key);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(import_jsx_runtime25.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: css2.statsRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
        HubStat,
        {
          tone: "blue",
          icon: tokensIcon(18),
          label: "7 \u65E5\u65E5\u5747",
          value: formatUnits(sig.dailyAvg7),
          desc: `\u7CBE\u786E ${formatExact(Math.round(sig.dailyAvg7))}`,
          open: openStat === "avg7",
          onToggle: () => {
            toggleStat("avg7");
          },
          delay: 0
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
        HubStat,
        {
          tone: "orange",
          icon: daysIcon(18),
          label: "\u9884\u8BA1 30 \u65E5",
          value: formatUnits(sig.projected30),
          desc: budgetActive ? `\u9884\u7B97 ${formatUnits(budget)} Token` : "\u5C1A\u672A\u8BBE\u7F6E 30 \u65E5\u9884\u7B97",
          valueWarn: budgetOver,
          open: openStat === "projected",
          onToggle: () => {
            toggleStat("projected");
          },
          delay: 40
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
        HubStat,
        {
          tone: "violet",
          icon: hitIcon(18),
          label: "\u6628\u65E5\u7528\u91CF",
          value: formatUnits(sig.yesterdayTokens),
          desc: `${sig.yesterdayDate} \xB7 \u76F8\u5BF9\u4E2D\u4F4D\u6570 ${multipleOf(sig.yesterdayMultiple)}`,
          open: openStat === "yesterday",
          onToggle: () => {
            toggleStat("yesterday");
          },
          delay: 80
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
        HubStat,
        {
          tone: "green",
          icon: callsIcon(18),
          label: "\u6D3B\u8DC3\u65E5\u4E2D\u4F4D\u6570",
          value: sig.activeMedian === null ? "\u2014" : formatUnits(sig.activeMedian),
          desc: `\u8FD1 ${sig.activeDays} \u4E2A\u6D3B\u8DC3\u65E5\u53C2\u4E0E\u57FA\u7EBF`,
          open: openStat === "median",
          onToggle: () => {
            toggleStat("median");
          },
          delay: 120
        }
      )
    ] }),
    openStat !== null && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      HubStatDetail,
      {
        title: `${openStat === "avg7" ? "7 \u65E5\u65E5\u5747" : openStat === "projected" ? "\u9884\u8BA1 30 \u65E5" : openStat === "yesterday" ? "\u6628\u65E5\u7528\u91CF" : "\u6D3B\u8DC3\u65E5\u4E2D\u4F4D\u6570"} \xB7 \u5C3E\u968F\u81EA\u7136\u65E5\u7A97\u53E3`,
        rows: openStat === "avg7" ? [
          { label: "\u8FD1 7 \u65E5\u65E5\u5747", value: formatUnits(sig.dailyAvg7) },
          { label: "\u6D3B\u8DC3\u65E5", value: `${sig.activeDays} \u5929` }
        ] : openStat === "projected" ? [
          { label: "\u9884\u8BA1 30 \u65E5", value: formatUnits(sig.projected30) },
          { label: "\u9608\u503C", value: formatUnits(sig.anomalyThreshold) }
        ] : openStat === "yesterday" ? [
          { label: "\u6628\u65E5\u7528\u91CF", value: formatUnits(sig.yesterdayTokens) },
          { label: "\u76F8\u5BF9\u4E2D\u4F4D\u6570", value: multipleOf(sig.yesterdayMultiple) }
        ] : [
          { label: "\u6D3B\u8DC3\u65E5\u4E2D\u4F4D\u6570", value: sig.activeMedian === null ? "\u2014" : formatUnits(sig.activeMedian) },
          { label: "\u5173\u6CE8\u65E5\u6570", value: `${sig.activeDays} \u5929` }
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: `${css2.mainScroll} ${modalStaggerClass}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(HubSection, { title: "Agent \u6548\u7387\u4E0E\u5F52\u56E0", meta: `\u8FD1 ${sig.activeDays} \u4E2A\u6D3B\u8DC3\u65E5\u53C2\u4E0E\u57FA\u7EBF`, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: editorFace, children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Stat, { first: true, label: "\u6A21\u578B\u5C1D\u8BD5\u6B21\u6570", value: formatUnits(efficiency.requests), exact: formatExact(efficiency.requests) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            Stat,
            {
              label: "\u6B21\u5747 Tokens",
              value: efficiency.tokensPerRequest === null ? "\u2014" : formatUnits(efficiency.tokensPerRequest),
              sub: `\u5408\u8BA1 ${formatUnits(efficiency.tokens)}`
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Stat, { label: "\u7F13\u5B58\u547D\u4E2D\u7387", value: formatHitRate(efficiency.cacheHitRate) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            Stat,
            {
              label: "\u538B\u7F29\u5360\u6BD4",
              value: percentOf(efficiency.compactedShare),
              sub: efficiency.compactedTokens > 0 ? `\u538B\u7F29 ${formatUnits(efficiency.compactedTokens)}` : "\u65E0\u538B\u7F29\u8BB0\u5F55"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            Stat,
            {
              label: "Top \u6A21\u578B\u5360\u6BD4",
              value: percentOf(efficiency.topRouteShare),
              sub: topRoutesText !== "" ? void 0 : "\u6682\u65E0\u6570\u636E"
            }
          )
        ] }),
        topRoutesText !== "" && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { marginTop: 10, fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
          "Top \u6A21\u578B\uFF1A",
          topRoutesText
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(HubSection, { title: "\u7528\u91CF\u4FE1\u53F7", meta: "\u5F02\u5E38\u65E5\u53EF\u4E0B\u94BB\u5F53\u65E5\u4F1A\u8BDD", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: rowCard, children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Stat, { first: true, label: "7 \u65E5\u65E5\u5747", value: formatUnits(sig.dailyAvg7), exact: formatExact(Math.round(sig.dailyAvg7)) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Stat, { label: "\u9884\u8BA1 30 \u65E5", value: formatUnits(sig.projected30), exact: formatExact(Math.round(sig.projected30)) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Stat, { label: "\u6628\u65E5\u7528\u91CF", value: formatUnits(sig.yesterdayTokens), sub: sig.yesterdayDate }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Stat, { label: "\u6628\u65E5 vs \u4E2D\u4F4D\u6570", value: multipleOf(sig.yesterdayMultiple) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Stat, { label: "\u6D3B\u8DC3\u65E5\u4E2D\u4F4D\u6570", value: sig.activeMedian === null ? "\u2014" : formatUnits(sig.activeMedian) })
        ] }),
        anomalies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: anomalies.map((day) => /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { role: "alert", style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 35%, transparent)",
          background: "color-mix(in srgb, var(--dsw-alias-state-error-primary) 7%, transparent)"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { width: 8, height: 8, borderRadius: 4, flex: "none", background: "var(--dsw-alias-state-error-primary)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-primary)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { fontFamily: MONO3, fontWeight: 600, color: "var(--dsw-alias-state-error-primary)" }, children: day.date }),
            " ",
            "\u4F7F\u7528 ",
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { fontFamily: MONO3, fontWeight: 600, color: "var(--dsw-alias-state-error-primary)" }, children: formatUnits(day.tokens) }),
            " ",
            "Token\uFF0C\u662F\u6D3B\u8DC3\u65E5\u4E2D\u4F4D\u6570\u7684",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { fontFamily: MONO3, fontWeight: 600, color: "var(--dsw-alias-state-error-primary)" }, children: multipleOf(day.multiple) }),
            " ",
            "\u500D"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("button", { type: "button", onClick: () => toggleDay(day.date), style: {
            marginLeft: "auto",
            height: 28,
            padding: "0 10px",
            border: `1px solid ${openDate === day.date ? "var(--dsw-alias-state-business-primary)" : "var(--dsw-alias-border-l2)"}`,
            borderRadius: 14,
            background: openDate === day.date ? "color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)" : "transparent",
            cursor: "pointer",
            fontSize: 12,
            lineHeight: "18px",
            color: openDate === day.date ? "var(--dsw-alias-state-business-primary)" : "var(--dsw-alias-label-primary)"
          }, children: openDate === day.date ? "\u6536\u8D77\u4F1A\u8BDD" : "\u67E5\u770B\u5F02\u5E38\u65E5\u4F1A\u8BDD" })
        ] }, day.date)) }),
        openDate !== null && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { borderRadius: 12, background: "var(--dsw-alias-bg-module-platform)", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-secondary)" }, children: [
            openDate,
            " \u7684\u4F1A\u8BDD\u7528\u91CF\uFF08\u6309 Token \u964D\u5E8F",
            dayLoading ? " \xB7 \u52A0\u8F7D\u4E2D\u2026" : "",
            "\uFF09"
          ] }),
          dayError !== null && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-state-error-primary)" }, children: dayError }),
          dayRows !== null && dayRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-tertiary)" }, children: "\u8BE5\u65E5\u6CA1\u6709\u53EF\u7528\u91CF\u8BB0\u5F55\u3002" }),
          dayRows !== null && dayRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderTop: "1px solid var(--dsw-alias-border-l1)", minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { fontSize: 13, lineHeight: "20px", color: "var(--dsw-alias-label-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: row.title ?? "\u672A\u547D\u540D\u4F1A\u8BDD" }),
            row.firstAt !== null && row.lastAt !== null && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { style: { flex: "none", fontSize: 11, fontFamily: MONO3, color: "var(--dsw-alias-label-tertiary)" }, children: [
              clockOf(row.firstAt),
              "\u2013",
              clockOf(row.lastAt)
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("button", { type: "button", title: `\u590D\u5236\u4F1A\u8BDD ID\uFF1A${row.id}`, onClick: () => {
              void navigator.clipboard?.writeText(row.id).catch(() => {
              });
            }, style: {
              flex: "none",
              height: 22,
              padding: "0 8px",
              borderRadius: 11,
              border: "1px solid var(--dsw-alias-border-l2)",
              background: "transparent",
              cursor: "pointer",
              fontSize: 11,
              lineHeight: "16px",
              color: "var(--dsw-alias-label-secondary)"
            }, children: "\u590D\u5236 ID" }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { marginLeft: "auto", flex: "none", fontSize: 12, fontFamily: MONO3, color: "var(--dsw-alias-label-primary)" }, children: formatUnits(row.tokens) }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("span", { style: { flex: "none", fontSize: 11, color: "var(--dsw-alias-label-tertiary)" }, children: [
              formatUnits(row.requests),
              " \u6B21"
            ] })
          ] }, row.id))
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(HubSection, { title: "30 \u65E5 Token \u9884\u7B97", meta: "\u4FDD\u5B58\u5728\u672C\u673A DSH \u8BBE\u7F6E\u4E2D", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: rowCard, children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            "input",
            {
              type: "number",
              min: 0,
              step: 1e6,
              placeholder: "\u4F8B\u5982 2600000000",
              value: budgetDraft,
              onChange: (e) => {
                setBudgetDraft(e.target.value);
                setBudgetNote(null);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") saveBudget();
              },
              style: {
                width: 220,
                height: 32,
                padding: "0 10px",
                fontSize: 14,
                lineHeight: "22px",
                borderRadius: 8,
                border: "1px solid var(--dsw-alias-border-l2)",
                background: "var(--dsw-alias-bg-layer-1)",
                color: "var(--dsw-alias-label-primary)",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: MONO3
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("button", { type: "button", disabled: budgetSaving, onClick: saveBudget, style: {
            height: 32,
            padding: "0 16px",
            borderRadius: 16,
            border: "1px solid transparent",
            cursor: budgetSaving ? "default" : "pointer",
            background: "var(--dsw-alias-button-primary-fill)",
            color: "var(--dsw-alias-label-primary-foreground)",
            fontSize: 13,
            lineHeight: "20px",
            opacity: budgetSaving ? 0.6 : 1
          }, children: budgetSaving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58" }),
          budgetNote !== null && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { style: { fontSize: 12, lineHeight: "18px", color: budgetNote.ok ? "var(--dsw-alias-state-success-primary)" : "var(--dsw-alias-state-error-primary)" }, children: budgetNote.text })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)" }, children: [
          "\u9884\u7B97\u6309\u81EA\u7136\u6708\u6EDA\u52A8\u5BF9\u7167\u300C\u9884\u8BA1 30 \u65E5 Tokens\u300D\u4F30\u7B97\uFF1B\u586B 0 \u53EF\u5173\u95ED\u3002\u5F53\u524D\uFF1A",
          budgetActive ? `${formatUnits(budget)} Token` : "\u5C1A\u672A\u8BBE\u7F6E\u9884\u7B97"
        ] }),
        budgetActive && sig.projected30 > 0 && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { style: { height: 6, borderRadius: 3, background: "var(--dsw-alias-bg-module-platform)", overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { style: {
            width: `${Math.round(budgetUsed * 100)}%`,
            height: "100%",
            borderRadius: 3,
            background: budgetOver ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-state-business-primary)",
            transition: "width .3s ease"
          } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { style: { fontSize: 12, lineHeight: "18px", color: budgetOver ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-label-secondary)" }, children: budgetOver ? `\u6309\u8FD1 7 \u65E5\u8282\u594F\uFF0C\u9884\u8BA1 30 \u65E5\u7528\u91CF\uFF08${formatUnits(sig.projected30)}\uFF09\u5C06\u8D85\u51FA\u9884\u7B97 ${Math.round((sig.projected30 / budget - 1) * 100)}%` : `\u9884\u8BA1 30 \u65E5\u7528\u91CF\u7EA6\u4E3A\u9884\u7B97\u7684 ${Math.round(budgetUsed * 100)}%` })
        ] })
      ] }) })
    ] })
  ] });
}

// src/client/usage/dashboard/AccountsTab.tsx
var import_react26 = require("react");

// src/client/usage/dashboard/charts/ProgressBar.tsx
var import_jsx_runtime26 = require("react/jsx-runtime");
function usageTone(percent) {
  const p = Math.max(0, Math.min(100, percent));
  if (p >= 85) return "var(--dsw-alias-state-error-primary)";
  if (p >= 60) return "var(--dsw-alias-state-warn-primary)";
  return "var(--dsw-alias-state-success-primary)";
}
function ProgressBar({ percent, height = 6 }) {
  const p = Math.max(0, Math.min(100, percent));
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { style: { width: "100%", height, borderRadius: height / 2, background: "var(--dsw-alias-border-l2)", overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { style: { height: "100%", width: `${p}%`, background: usageTone(p), borderRadius: height / 2, transition: "width .3s ease" } }) });
}

// src/client/usage/dashboard/primitives/AccountDrawer.tsx
var import_react24 = require("react");

// src/client/usage/dashboard/primitives/PoolQuotaPanel.tsx
var import_react23 = require("react");

// src/client/usage/dashboard/primitives/QuotaWindowRow.tsx
var import_jsx_runtime27 = require("react/jsx-runtime");
function QuotaWindowRow({ window: w, delay = 0, active = true }) {
  const used = w.used ?? 0;
  const limit = w.limit ?? 0;
  const hasAmounts = typeof w.used === "number" && typeof w.limit === "number" && w.limit > 0;
  const pct = Math.max(0, Math.min(100, w.usedPercent ?? 0));
  const resetTs = w.resetsAt ? new Date(w.resetsAt).getTime() : null;
  const label = w.windowType === "5h" ? "5h \u6EDA\u52A8\u7A97\u53E3" : w.windowType === "7d" ? "7\u5929\u7A97\u53E3" : w.kind;
  const meta = {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    flex: "none",
    fontSize: 11,
    fontVariantNumeric: "tabular-nums",
    color: "var(--dsw-alias-label-tertiary)",
    whiteSpace: "nowrap"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "dsh-acc-win", style: { animationDelay: `${delay}ms` }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 5 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { style: { flex: "none", fontSize: 11, fontWeight: 500, color: "var(--dsw-alias-label-primary)" }, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("span", { style: meta, children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: hasAmounts ? `\u5DF2\u7528 ${formatUnits(used)} / ${formatUnits(limit)} \u79EF\u5206` : `\u5DF2\u7528 ${pct}%` }),
        resetTs !== null && /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("span", { children: [
          "\xB7 ",
          relativeTime2(resetTs),
          "\u91CD\u7F6E"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { style: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(ProgressBar, { percent: active ? pct : 0, height: 6 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
        "span",
        {
          title: hasAmounts ? `\u5DF2\u7528 ${formatUnits(used)} / ${formatUnits(limit)} \u79EF\u5206` : "\u5DF2\u7528",
          style: { flex: "none", fontSize: 11, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: usageTone(pct) },
          children: [
            pct,
            "%"
          ]
        }
      )
    ] })
  ] });
}

// src/client/usage/dashboard/primitives/accounts-sheet.ts
var ACC_STYLE_ID = "dsh-accounts-sheet";
var ACC_SHEET = `
@keyframes dsh-acc-in {
  from { opacity: 0; transform: translate3d(0, 12px, 0) scale(0.985); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes dsh-acc-win-in {
  from { opacity: 0; transform: translate3d(0, 6px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes dsh-acc-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
@keyframes dsh-acc-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent); }
  50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--dsw-alias-state-error-primary) 0%, transparent); }
}
@keyframes dsh-acc-spin {
  to { transform: rotate(360deg); }
}
.dsh-acc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 12px;
  align-items: start;
}
.dsh-acc-card {
  position: relative;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  padding: 14px 16px;
  opacity: 0;
  animation: dsh-acc-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, var(--dsw-alias-border-l2));
  box-shadow: 0 10px 30px color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent), 0 2px 8px rgba(0, 0, 0, 0.22);
}
.dsh-acc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  box-shadow: 0 0 6px currentColor;
}
.dsh-acc-dot[data-critical="true"] {
  animation: dsh-acc-pulse 2.2s ease-in-out infinite;
}
.dsh-acc-skel {
  height: 92px;
  border-radius: 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  background:
    linear-gradient(90deg, var(--dsw-alias-bg-layer-2) 25%, var(--dsw-alias-bg-layer-1) 50%, var(--dsw-alias-bg-layer-2) 75%);
  background-size: 200% 100%;
  animation: dsh-acc-shimmer 1.4s linear infinite;
}
.dsh-acc-win {
  opacity: 0;
  animation: dsh-acc-win-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-acc-spin {
  animation: dsh-acc-spin 0.8s linear infinite;
}
.dsh-acc-chip {
  font-size: 11px;
  line-height: 18px;
  border-radius: 6px;
  padding: 0 7px;
  flex: none;
  white-space: nowrap;
}
@keyframes dsh-acc-drawer-in {
  from { opacity: 0; transform: translate3d(26px, 0, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes dsh-acc-drawer-out {
  from { opacity: 1; transform: translate3d(0, 0, 0); }
  to { opacity: 0; transform: translate3d(18px, 0, 0); }
}
@keyframes dsh-acc-dwrap-in {
  from { width: 0; }
  to { width: 316px; }
}
@keyframes dsh-acc-dwrap-out {
  from { width: 316px; }
  to { width: 0; }
}
.dsh-acc-kpi {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  padding: 14px 16px;
  opacity: 0;
  animation: dsh-acc-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-kpi:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, var(--dsw-alias-border-l2));
  box-shadow: 0 10px 30px color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent), 0 2px 8px rgba(0, 0, 0, 0.22);
}
.dsh-acc-kpi-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
.dsh-acc-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary) 34%, var(--dsw-alias-border-l2));
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 6%, var(--dsw-alias-bg-layer-2));
  border-radius: 14px;
  padding: 12px 16px;
  opacity: 0;
  animation: dsh-acc-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: 80ms;
}
.dsh-acc-banner[data-tone="warn"] {
  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 48%, var(--dsw-alias-border-l2));
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 7%, var(--dsw-alias-bg-layer-2));
}
.dsh-acc-search {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-2);
  border-radius: 10px;
  padding: 0 10px;
  height: 32px;
  transition: border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-search:focus-within {
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 55%, var(--dsw-alias-border-l2));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);
}
.dsh-acc-search input {
  border: none;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  width: 150px;
}
.dsh-acc-search input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-acc-logo {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex: none;
}
.dsh-acc-tlist {
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
.dsh-acc-thead {
  display: grid;
  grid-template-columns: minmax(200px, 2.1fr) 90px minmax(168px, 1.5fr) minmax(132px, 1.3fr) 88px;
  gap: 8px;
  align-items: center;
  padding: 10px 16px 9px;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.dsh-acc-trow {
  display: grid;
  grid-template-columns: minmax(200px, 2.1fr) 90px minmax(168px, 1.5fr) minmax(132px, 1.3fr) 88px;
  gap: 8px;
  align-items: center;
  padding: 11px 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  cursor: pointer;
  opacity: 0;
  animation: dsh-acc-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: background 160ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-acc-trow:last-child { border-bottom: none; }
.dsh-acc-trow:hover { background: var(--dsw-alias-bg-layer-1); }
.dsh-acc-trow[data-selected="true"] {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 6%, var(--dsw-alias-bg-layer-2));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, transparent);
}
.dsh-acc-drawer-wrap {
  width: 316px;
  flex: none;
  overflow: hidden;
  animation: dsh-acc-dwrap-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-acc-drawer-wrap[data-closing="true"] {
  animation: dsh-acc-dwrap-out 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.dsh-acc-drawer {
  width: 316px;
  height: 100%;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: dsh-acc-drawer-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-acc-drawer[data-closing="true"] {
  animation: dsh-acc-drawer-out 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-acc-card, .dsh-acc-win, .dsh-acc-skel, .dsh-acc-dot[data-critical="true"], .dsh-acc-spin {
    animation: none;
    opacity: 1;
  }
  .dsh-acc-kpi, .dsh-acc-banner, .dsh-acc-trow, .dsh-acc-drawer-wrap, .dsh-acc-drawer { animation: none; }
  .dsh-acc-kpi, .dsh-acc-banner, .dsh-acc-trow, .dsh-acc-drawer { opacity: 1; }
  .dsh-acc-card { transition: none; }
  .dsh-acc-kpi { transition: none; }
}
`;
function ensureAccountsStyles() {
  if (typeof document === "undefined") return () => {
  };
  let tag = document.getElementById(ACC_STYLE_ID);
  if (tag === null) {
    tag = document.createElement("style");
    tag.id = ACC_STYLE_ID;
    tag.dataset.plugin = "dsh-triad";
    tag.textContent = ACC_SHEET;
    document.head.appendChild(tag);
  }
  return () => {
    tag?.remove();
  };
}

// src/client/usage/dashboard/primitives/PoolQuotaPanel.tsx
var import_jsx_runtime28 = require("react/jsx-runtime");
var STYLE_ID13 = "dsh-pool-quota-styles";
var SHEET10 = `
@keyframes dsh-pool-in {
  from { opacity: 0; transform: translate3d(0, 8px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
.dsh-pool-block {
  border-left: 3px solid var(--dsh-pool-accent, var(--dsw-alias-state-business-primary));
  border-radius: 10px;
  background: color-mix(in srgb, var(--dsh-pool-accent, var(--dsw-alias-state-business-primary)) 6%, var(--dsw-alias-bg-layer-1));
  padding: 10px 12px;
  opacity: 0;
  animation: dsh-pool-in 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transition: background 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-pool-block:hover {
  background: color-mix(in srgb, var(--dsh-pool-accent, var(--dsw-alias-state-business-primary)) 9%, var(--dsw-alias-bg-layer-1));
}
.dsh-pool-row {
  opacity: 0;
  animation: dsh-pool-in 300ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.dsh-pool-foot {
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px dashed var(--dsw-alias-border-l2);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  line-height: 16px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-pool-rules {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-pool-rules[data-open="true"] { grid-template-rows: 1fr; }
.dsh-pool-rules-inner { min-height: 0; overflow: hidden; }
.dsh-pool-chevron {
  transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.dsh-pool-chevron[data-open="true"] { transform: rotate(180deg); }
@media (prefers-reduced-motion: reduce) {
  .dsh-pool-block, .dsh-pool-row { animation: none; opacity: 1; }
  .dsh-pool-block { transition: none; }
}
`;
function ensurePoolQuotaStyles() {
  if (typeof document === "undefined") return () => {
  };
  let tag = document.getElementById(STYLE_ID13);
  if (tag === null) {
    tag = document.createElement("style");
    tag.id = STYLE_ID13;
    tag.dataset.plugin = "dsh-triad";
    tag.textContent = SHEET10;
    document.head.appendChild(tag);
  }
  return () => {
    tag?.remove();
  };
}
function groupPools(windows) {
  const groups = [];
  const index = /* @__PURE__ */ new Map();
  for (const w of windows) {
    const name = w.poolName ?? w.kind;
    let g = index.get(name);
    if (g === void 0) {
      g = {
        poolName: name,
        poolType: w.poolType ?? "default",
        modelCount: w.modelCount ?? 0,
        grantBalance: w.grantBalance ?? null,
        grantExpiryAt: w.grantExpiryAt ?? null,
        windows: []
      };
      index.set(name, g);
      groups.push(g);
    }
    g.windows.push(w);
  }
  return groups;
}
function poolAccent(poolType) {
  return poolType === "dedicated" ? "var(--dsw-alias-state-warn-primary)" : "var(--dsw-alias-state-business-primary)";
}
function poolLabel(poolType) {
  return poolType === "dedicated" ? "\u4E13\u5C5E\u6C60" : "\u901A\u7528\u6C60";
}
function deductionNote(poolType) {
  return poolType === "dedicated" ? "\u6263\u51CF\u987A\u5E8F\uFF1A\u4E13\u5C5E\u6C60\u5468\u671F \u2192 \u901A\u7528\u6C60\u5468\u671F \u2192 \u901A\u7528\u6C60\u6D3B\u52A8" : "\u6263\u51CF\u987A\u5E8F\uFF1A\u901A\u7528\u6C60\u5468\u671F \u2192 \u901A\u7528\u6C60\u6D3B\u52A8";
}
var rulesRows = [
  { title: "Flash-lite \u6A21\u578B", body: "\u4E13\u5C5E\u6C60\u5468\u671F\u79EF\u5206 \u2192 \u901A\u7528\u6C60\u5468\u671F\u79EF\u5206 \u2192 \u901A\u7528\u6C60\u6D3B\u52A8\u56FA\u5B9A\u79EF\u5206" },
  { title: "\u5176\u4ED6\u6A21\u578B", body: "\u901A\u7528\u6C60\u5468\u671F\u79EF\u5206 \u2192 \u901A\u7528\u6C60\u6D3B\u52A8\u56FA\u5B9A\u79EF\u5206" },
  { title: "5h \u7A97\u53E3\u7EA6\u675F", body: "\u5404\u6C60\u6D88\u8017\u53D7\u6EDA\u52A8 5 \u5C0F\u65F6\u7A97\u53E3\u989D\u5EA6\u4E0A\u9650\u7EA6\u675F\uFF0C\u8FBE\u4E0A\u9650\u81EA\u52A8\u987A\u5EF6\u81F3\u4E0B\u4E00\u6C60\u6263\u51CF" },
  { title: "\u6D3B\u52A8\u56DE\u5145", body: "\u6D3B\u52A8\u671F\u95F4 Flash-lite \u4E13\u5C5E\u6C60\u5B9E\u9645\u6D88\u8017\u6309 1:1 \u6298\u7B97\u56DE\u5145\u4E3A\u901A\u7528\u6C60\u6D3B\u52A8\u79EF\u5206\uFF0C\u5230\u8D26\u540E 30 \u5929\u6709\u6548" }
];
function PoolQuotaPanel({ windows, plan, showRules = true }) {
  const [rulesOpen, setRulesOpen] = (0, import_react23.useState)(false);
  const [mounted, setMounted] = (0, import_react23.useState)(false);
  (0, import_react23.useEffect)(() => {
    ensurePoolQuotaStyles();
    ensureAccountsStyles();
  }, []);
  (0, import_react23.useEffect)(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const pools = (0, import_react23.useMemo)(() => groupPools(windows), [windows]);
  const sectionStyle = { display: "flex", flexDirection: "column", gap: 8 };
  const hasPlan = typeof plan === "string" && plan.trim() !== "" && plan.trim() !== "\u2014" && plan.trim() !== "-";
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { style: sectionStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--dsw-alias-label-tertiary)", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { style: { fontWeight: 600, color: "var(--dsw-alias-label-secondary)", letterSpacing: 0.3 }, children: "\u79EF\u5206\u5236\u914D\u989D" }),
      hasPlan && /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: [
        "\xB7 ",
        plan
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("span", { style: { fontVariantNumeric: "tabular-nums" }, children: [
        "\xB7 ",
        pools.length,
        " \u4E2A\u79EF\u5206\u6C60"
      ] })
    ] }),
    pools.map((pool, poolIndex) => {
      const accent = poolAccent(pool.poolType);
      const sorted = [...pool.windows].sort((a, b) => {
        const av = a.windowType === "5h" ? 0 : 1;
        const bv = b.windowType === "5h" ? 0 : 1;
        return av - bv;
      });
      return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
        "div",
        {
          className: "dsh-pool-block",
          style: { "--dsh-pool-accent": accent, animationDelay: `${poolIndex * 70}ms` },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 9, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--dsw-alias-label-primary)" }, children: pool.poolName }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "dsh-acc-chip", style: { color: accent, background: `color-mix(in srgb, ${accent} 12%, transparent)` }, children: poolLabel(pool.poolType) }),
              pool.modelCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("span", { className: "dsh-acc-chip", style: { color: "var(--dsw-alias-label-tertiary)", background: "var(--dsw-alias-fill-l2)" }, children: [
                pool.modelCount,
                " \u4E2A\u6A21\u578B"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
              sorted.map((w, wi) => /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
                QuotaWindowRow,
                {
                  window: w,
                  delay: poolIndex * 70 + 50 + wi * 60,
                  active: mounted
                },
                w.kind
              )),
              pool.grantBalance !== null && pool.grantBalance > 0 && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "dsh-pool-row", style: { animationDelay: `${poolIndex * 70 + 130}ms` }, children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--dsw-alias-label-secondary)" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { style: { flex: "none", width: 6, height: 6, borderRadius: 3, background: accent } }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { style: { color: "var(--dsw-alias-label-primary)", fontWeight: 500 }, children: "\u6D3B\u52A8\u79EF\u5206\uFF08\u56FA\u5B9A\uFF09" }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { style: { fontVariantNumeric: "tabular-nums", color: "var(--dsw-alias-label-secondary)" }, children: formatUnits(pool.grantBalance) }),
                pool.grantExpiryAt !== null && /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("span", { style: { color: "var(--dsw-alias-label-tertiary)" }, children: [
                  "\xB7 \u6700\u8FD1\u5230\u671F ",
                  relativeTime2(new Date(pool.grantExpiryAt).getTime())
                ] })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "dsh-pool-foot", children: [
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, style: { flex: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("path", { d: "M4 12V7a3 3 0 0 1 3-3h5M9.5 6.5L12 4 9.5 1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children: deductionNote(pool.poolType) })
              ] })
            ] })
          ]
        },
        pool.poolName
      );
    }),
    showRules && /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { style: { marginTop: 2 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
        "button",
        {
          type: "button",
          onClick: () => setRulesOpen((o) => !o),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "transparent",
            padding: "6px 2px",
            cursor: "pointer",
            fontSize: 11,
            color: "var(--dsw-alias-label-secondary)"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("svg", { className: "dsh-pool-chevron", "data-open": rulesOpen, width: "12", height: "12", viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("path", { d: "M4 6l4 4 4-4", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) }),
            "\u79EF\u5206\u6263\u51CF\u89C4\u5219\u4E0E 5h \u7A97\u53E3\u7EA6\u675F"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "dsh-pool-rules", "data-open": rulesOpen, children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "dsh-pool-rules-inner", children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 7, padding: "4px 0 10px 18px" }, children: rulesRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { style: { fontSize: 11, lineHeight: 17 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { style: { color: "var(--dsw-alias-label-primary)", fontWeight: 500, marginRight: 8 }, children: r.title }),
        /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { style: { color: "var(--dsw-alias-label-secondary)" }, children: r.body })
      ] }, r.title)) }) }) })
    ] })
  ] });
}

// src/client/usage/dashboard/primitives/AccountDrawer.tsx
var import_jsx_runtime29 = require("react/jsx-runtime");
function AccountDrawer({ account, closing }) {
  const [mounted, setMounted] = (0, import_react24.useState)(false);
  (0, import_react24.useEffect)(() => {
    ensureAccountsStyles();
  }, []);
  (0, import_react24.useEffect)(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const windows = account?.windows ?? [];
  const isPool = windows.length > 0 && windows.some((w) => w.poolType !== void 0);
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "dsh-acc-drawer-wrap", "data-closing": closing, children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("aside", { className: "dsh-acc-drawer", "data-closing": closing, "aria-label": "\u4F9B\u5E94\u5546\u914D\u989D\u8BE6\u60C5", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { style: { flex: 1, minHeight: 0, overflowY: "auto", padding: 16 }, children: !mounted || account === null ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [0, 1].map((i) => /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "dsh-acc-skel", style: { height: 96 } }, i)) }) : isPool ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(PoolQuotaPanel, { windows, plan: account.plan, showRules: false }) : windows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: windows.map((w, wi) => /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(QuotaWindowRow, { window: w, delay: wi * 60, active: mounted }, w.kind)) }) : /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { style: { fontSize: 12, lineHeight: "20px", color: "var(--dsw-alias-label-tertiary)" }, children: "\u6682\u65E0\u65B9\u6848\u4FE1\u606F" }) }) }) });
}

// src/client/usage/dashboard/primitives/CredentialModal.tsx
var import_react25 = require("react");
var import_react_dom10 = require("react-dom");
var import_jsx_runtime30 = require("react/jsx-runtime");
var STYLE_ID14 = "dsh-cred-modal-styles";
var SHEET11 = `
@keyframes dsh-cred-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes dsh-cred-card-in {
  from { opacity: 0; transform: translate3d(0, 14px, 0) scale(0.97); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
.dsh-cred-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 10, 14, 0.5);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  animation: dsh-cred-overlay-in 180ms ease-out both;
}
.dsh-cred-card {
  width: 420px;
  max-width: calc(100vw - 48px);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--dsw-alias-border-l1);
  animation: dsh-cred-card-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-cred-overlay, .dsh-cred-card { animation: none; }
}
`;
var CRED_SOLID_ID = "dsh-cred-card-solid-styles";
var CRED_SOLID_SHEET = [
  ".dsh-cred-card{background:var(--dsw-alias-bg-layer-2)}",
  "html[data-dsh-glass] .dsh-cred-card[data-solid]{background:var(--dsw-static-neutral-bluish-00,#fff);backdrop-filter:none;-webkit-backdrop-filter:none}",
  "html[data-dsh-glass] body[data-ds-dark-theme] .dsh-cred-card[data-solid]{background:var(--dsw-static-neutral-bluish-850,#2c2c2e)}"
].join("\n");
function ensureStyles3() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID14) === null) {
    const tag = document.createElement("style");
    tag.id = STYLE_ID14;
    tag.textContent = SHEET11;
    document.head.appendChild(tag);
  }
  if (document.getElementById(CRED_SOLID_ID) === null) {
    const tag = document.createElement("style");
    tag.id = CRED_SOLID_ID;
    tag.textContent = CRED_SOLID_SHEET;
    document.head.appendChild(tag);
  }
}
var headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
  borderBottom: "1px solid var(--dsw-alias-border-l1)",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--dsw-alias-label-primary)"
};
var bodyStyle = { display: "flex", flexDirection: "column", gap: 12, padding: 16 };
var inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "7px 10px",
  fontSize: 13,
  borderRadius: 8,
  border: "1px solid var(--dsw-alias-border-l1)",
  background: "var(--dsw-alias-bg-base)",
  color: "var(--dsw-alias-label-primary)",
  transition: "border-color .18s cubic-bezier(.2,.8,.2,1)"
};
var btnBase = {
  padding: "6px 14px",
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid var(--dsw-alias-border-l1)",
  background: "transparent",
  color: "var(--dsw-alias-label-primary)",
  cursor: "pointer"
};
function CredentialModal({ providerName, onClose, onSave }) {
  const [value, setValue] = (0, import_react25.useState)("");
  const [saving, setSaving] = (0, import_react25.useState)(false);
  const [error, setError] = (0, import_react25.useState)(null);
  const [closing, setClosing] = (0, import_react25.useState)(false);
  (0, import_react25.useEffect)(() => {
    ensureStyles3();
  }, []);
  (0, import_react25.useEffect)(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 160);
  };
  const modal = /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "dsh-cred-overlay", onClick: close, children: /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
    "div",
    {
      className: "dsh-cred-card",
      "data-solid": "",
      style: closing ? { opacity: 0, transform: "translate3d(0, 8px, 0) scale(0.98)", transition: "opacity 160ms ease, transform 160ms ease" } : void 0,
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { style: headerStyle, children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("span", { children: [
            "\u914D\u7F6E ",
            providerName,
            " \u51ED\u636E"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
            "button",
            {
              type: "button",
              "aria-label": "\u5173\u95ED",
              onClick: close,
              style: { border: "none", background: "transparent", color: "var(--dsw-alias-label-secondary)", cursor: "pointer", fontSize: 15 },
              children: "\u2715"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { style: bodyStyle, children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary)" }, children: "\u8F93\u5165 API Key\uFF08\u4EC5 SENSENOVA_* \u5F15\u7528\u53EF\u5199\uFF0C\u5B58\u4E8E\u5B89\u5168\u51ED\u636E\u5B58\u50A8\uFF09" }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("input", { type: "password", value, onChange: (e) => setValue(e.target.value), placeholder: "API Key", style: inputStyle, autoFocus: true }),
          error && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { style: { fontSize: 12, color: "var(--dsw-alias-state-error-primary)" }, children: error }),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("button", { type: "button", onClick: close, style: btnBase, children: "\u53D6\u6D88" }),
            /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
              "button",
              {
                type: "button",
                disabled: value.trim() === "" || saving,
                onClick: async () => {
                  setSaving(true);
                  setError(null);
                  try {
                    await onSave(value.trim());
                    close();
                  } catch (e) {
                    setError(e instanceof Error ? e.message : String(e));
                  } finally {
                    setSaving(false);
                  }
                },
                style: { ...btnBase, background: saving ? "var(--dsw-alias-border-l2)" : "var(--dsw-alias-state-business-primary)", color: "#fff", border: "none", opacity: value.trim() === "" ? 0.6 : 1 },
                children: saving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
  return typeof document !== "undefined" ? (0, import_react_dom10.createPortal)(modal, document.body) : modal;
}

// src/client/usage/dashboard/AccountsTab.tsx
var import_jsx_runtime31 = require("react/jsx-runtime");
var HEAD = { display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" };
var HEAD_TITLE = { display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1 };
var ICON_BTN = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 10,
  border: "1px solid var(--dsw-alias-border-l1)",
  background: "var(--dsw-alias-bg-layer-2)",
  color: "var(--dsw-alias-label-secondary)",
  cursor: "pointer",
  transition: "color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)"
};
var REFRESH_BTN = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: 32,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid var(--dsw-alias-border-l1)",
  background: "var(--dsw-alias-bg-layer-2)",
  color: "var(--dsw-alias-label-secondary)",
  cursor: "pointer",
  fontSize: 12,
  transition: "color 180ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 180ms cubic-bezier(0.2, 0.8, 0.2, 1)"
};
function kpiTone(color, alpha = 13) {
  return `color-mix(in srgb, ${color} ${alpha}%, transparent)`;
}
function KpiTile({ color, icon, label, value, sub, delay }) {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "dsh-acc-kpi", style: { animationDelay: `${delay}ms` }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "dsh-acc-kpi-icon", style: { background: kpiTone(color, 14), color }, children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-secondary)" }, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 20, lineHeight: "28px", fontWeight: 600, color: "var(--dsw-alias-label-primary)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontVariantNumeric: "tabular-nums" }, children: value }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: sub })
    ] })
  ] });
}
function statusMeta(p) {
  switch (p.status) {
    case "ok":
      return { label: "\u6B63\u5E38", color: "var(--dsw-alias-state-success-primary)" };
    case "critical":
      return { label: "\u7D27\u6025", color: "var(--dsw-alias-state-error-primary)" };
    case "warning":
      return { label: "\u8B66\u544A", color: "var(--dsw-alias-state-warn-primary)" };
    case "not-configured":
    case "unauthorized":
      return { label: "\u672A\u914D\u7F6E", color: "var(--dsw-alias-state-warn-primary)" };
    case "pending":
      return { label: "\u7B49\u5F85", color: "var(--dsw-alias-label-tertiary)" };
    default:
      return { label: "\u672A\u77E5", color: "var(--dsw-alias-label-tertiary)" };
  }
}
var COL = "minmax(200px, 2.1fr) 90px minmax(168px, 1.5fr) minmax(132px, 1.3fr) 88px";
function LogoMark({ name, color, size = 30 }) {
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "dsh-acc-logo", style: { width: size, height: size, background: kpiTone(color, 16), color }, children: initial });
}
function AccountsTab({ refreshTick, onJumpSignal }) {
  const [providers, setProviders] = (0, import_react26.useState)([]);
  const [accounts, setAccounts] = (0, import_react26.useState)({});
  const [selectedId, setSelectedId] = (0, import_react26.useState)(null);
  const [drawerClosing, setDrawerClosing] = (0, import_react26.useState)(false);
  const [search, setSearch] = (0, import_react26.useState)("");
  const [refreshing, setRefreshing] = (0, import_react26.useState)(false);
  const [error, setError] = (0, import_react26.useState)(null);
  const [credentialFor, setCredentialFor] = (0, import_react26.useState)(null);
  const [loaded, setLoaded] = (0, import_react26.useState)(false);
  const closeTimer = (0, import_react26.useRef)(null);
  (0, import_react26.useEffect)(() => ensureAccountsStyles(), []);
  (0, import_react26.useEffect)(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);
  const load = () => {
    setError(null);
    usageApi.providers().then((p) => {
      if (p.ok !== true) throw new Error("\u4F9B\u5E94\u5546\u6570\u636E\u52A0\u8F7D\u5931\u8D25");
      setProviders(p.providers);
      setAccounts((prev) => {
        const keep = {};
        for (const id of Object.keys(prev)) if (p.providers.some((x) => x.id === id)) keep[id] = prev[id];
        return keep;
      });
      void Promise.all(p.providers.map((pr) => usageApi.account(pr.id).then((resp) => {
        if (resp.ok) setAccounts((prev) => ({ ...prev, [resp.account.id]: resp.account }));
      }).catch(() => null)));
    }).catch((e) => setError(e instanceof Error ? e.message : String(e))).finally(() => setLoaded(true));
  };
  (0, import_react26.useEffect)(() => {
    load();
  }, [refreshTick]);
  const refreshAll = () => {
    setRefreshing(true);
    setError(null);
    Promise.all(providers.map((p) => usageApi.account(p.id, true).catch(() => null))).then(() => load()).finally(() => setRefreshing(false));
  };
  const saveCredential = async (value) => {
    const res = await fetch("/api/usage-stats/credentials", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ ref: "SENSENOVA_API_KEY", value })
    });
    const payload = await res.json();
    if (!res.ok || payload.ok !== true) throw new Error(payload?.message ?? `HTTP ${res.status}`);
    load();
  };
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(ErrorCard, { message: error, onRetry: load });
  }
  const select = (id) => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    setDrawerClosing(false);
    setSelectedId(id);
  };
  const closeDrawer = () => {
    if (drawerClosing) return;
    setDrawerClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setSelectedId(null);
      setDrawerClosing(false);
    }, 230);
  };
  const toggleSelect = (id) => {
    if (selectedId === id && !drawerClosing) closeDrawer();
    else select(id);
  };
  const palette = providerPalette();
  const indexOf = (id) => {
    const i = providers.findIndex((p) => p.id === id);
    return i === -1 ? 0 : i;
  };
  const q = search.trim().toLowerCase();
  const visible = loaded ? providers.filter((p) => q === "" || p.displayName.toLowerCase().includes(q)) : [];
  const alertCount = providers.filter((p) => p.status === "critical" || p.status === "warning").length;
  const configuredCount = providers.filter((p) => p.configured).length;
  const poolProviders = providers.filter((p) => p.adapter === "sensenova-token-plan");
  const poolNames = /* @__PURE__ */ new Set();
  for (const p of poolProviders) {
    for (const w of accounts[p.id]?.windows ?? []) {
      const name = w.poolName ?? (w.kind ?? "").split(" \xB7 ")[0];
      if (name !== "") poolNames.add(name);
    }
  }
  const poolGroups = poolNames.size;
  const selectedProvider = selectedId !== null ? providers.find((p) => p.id === selectedId) ?? null : null;
  const rowUsage = (p) => {
    const wins = accounts[p.id]?.windows ?? [];
    if (wins.length === 0) return null;
    const w = wins.slice().sort((a, b) => (b.usedPercent ?? 0) - (a.usedPercent ?? 0) || (b.limit ?? 0) - (a.limit ?? 0))[0];
    const pct = Math.max(0, Math.min(100, w.usedPercent ?? 0));
    const text = (w.limit ?? 0) > 0 && w.used !== void 0 ? `${formatUnits(w.used)} / ${formatUnits(w.limit)}` : null;
    return { pct, text };
  };
  const quotaType = (p) => {
    const wins = accounts[p.id]?.windows ?? [];
    if (wins.length > 0) {
      const names = new Set(wins.map((w) => w.poolName ?? (w.kind ?? "").split(" \xB7 ")[0]).filter(Boolean));
      if (names.size <= 1) {
        const base = [...names][0] ?? "\u79EF\u5206\u6C60";
        return `${base} \xB7 ${wins.length} \u4E2A\u7A97\u53E3`;
      }
      return `${names.size} \u4E2A\u6C60 \xB7 ${wins.length} \u4E2A\u7A97\u53E3`;
    }
    if (p.accountMode === "balance") return "\u4F59\u989D";
    if (p.accountMode === "subscription") return "\u8BA2\u9605";
    return null;
  };
  const planMeta = (p) => {
    const plan = accounts[p.id]?.plan;
    const hasPlan = typeof plan === "string" && plan.trim() !== "" && plan.trim() !== "\u2014" && plan.trim() !== "-";
    const modelCount = (accounts[p.id]?.windows ?? []).find((w) => (w.modelCount ?? 0) > 0)?.modelCount ?? null;
    if (!hasPlan && modelCount === null) return null;
    return `${hasPlan ? plan : ""}${hasPlan && modelCount !== null ? " \xB7 " : ""}${modelCount !== null ? `${modelCount} \u4E2A\u6A21\u578B` : ""}`;
  };
  const drawer = selectedProvider !== null ? /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    AccountDrawer,
    {
      account: accounts[selectedProvider.id] ?? null,
      closing: drawerClosing
    },
    selectedProvider.id
  ) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: modalStaggerClass, style: { display: "flex", flexDirection: "column", gap: 12, height: "100%", minHeight: 0, padding: "18px 20px 20px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: HEAD, children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: HEAD_TITLE, children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 18, lineHeight: "26px", fontWeight: 600, color: "var(--dsw-alias-label-primary)" }, children: "\u4F59\u989D / \u914D\u989D" }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-tertiary)" }, children: "\u76D1\u63A7\u6240\u6709 AI \u4F9B\u5E94\u5546\u7684\u989D\u5EA6\u4F7F\u7528\u60C5\u51B5\u4E0E\u914D\u989D\u72B6\u6001" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("label", { className: "dsh-acc-search", style: { marginLeft: "auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", style: { color: "var(--dsw-alias-label-tertiary)", flex: "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("circle", { cx: "7", cy: "7", r: "4.6", stroke: "currentColor", strokeWidth: "1.4" }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M10.6 10.6 14 14", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "\u641C\u7D22\u4F9B\u5E94\u5546", "aria-label": "\u641C\u7D22\u4F9B\u5E94\u5546" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("button", { type: "button", style: REFRESH_BTN, onClick: refreshAll, disabled: refreshing || providers.length === 0, "aria-label": "\u5237\u65B0\u6570\u636E", children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("svg", { className: refreshing ? "dsh-acc-spin" : void 0, width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 1.8v3.2h-3.2", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        refreshing ? "\u5237\u65B0\u4E2D" : "\u5237\u65B0\u6570\u636E"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        "button",
        {
          type: "button",
          style: ICON_BTN,
          "aria-label": "\u7BA1\u7406\u51ED\u636E",
          onClick: () => setCredentialFor(poolProviders[0]?.id ?? providers[0]?.id ?? null),
          title: "\u7BA1\u7406\u51ED\u636E",
          children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("circle", { cx: "8", cy: "8", r: "2.2", stroke: "currentColor", strokeWidth: "1.4" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M8 1.6v1.9M8 12.5v1.9M1.6 8h1.9M12.5 8h1.9M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        KpiTile,
        {
          color: "#4f8cff",
          delay: 0,
          label: "\u4F9B\u5E94\u5546\u603B\u6570",
          value: loaded ? String(providers.length) : "\u2014",
          sub: loaded ? "\u5168\u90E8" : "\u52A0\u8F7D\u4E2D\u2026",
          icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("rect", { x: "1.8", y: "2.2", width: "12.4", height: "4.2", rx: "1.4", stroke: "currentColor", strokeWidth: "1.4" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("rect", { x: "1.8", y: "9.6", width: "12.4", height: "4.2", rx: "1.4", stroke: "currentColor", strokeWidth: "1.4" })
          ] })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        KpiTile,
        {
          color: "#51cf66",
          delay: 50,
          label: "\u5DF2\u914D\u7F6E",
          value: loaded ? String(configuredCount) : "\u2014",
          sub: loaded && providers.length > 0 ? `${(configuredCount / providers.length * 100).toFixed(1)}%` : "\u2014",
          icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("circle", { cx: "8", cy: "8", r: "6.2", stroke: "currentColor", strokeWidth: "1.4" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M5.2 8.2 7.2 10.2 10.8 6.2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
          ] })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        KpiTile,
        {
          color: "#7c6bff",
          delay: 100,
          label: "\u79EF\u5206\u6C60",
          value: loaded ? String(poolProviders.length) : "\u2014",
          sub: loaded ? `${poolGroups > 0 ? poolGroups : 0} \u4E2A\u6C60` : "\u52A0\u8F7D\u4E2D\u2026",
          icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M8 2 14 5.2 8 8.4 2 5.2 8 2Z", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M2 8.4 8 11.6l6-3.2M2 11.4 8 14.6l6-3.2", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.6" })
          ] })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        KpiTile,
        {
          color: "#ffa94d",
          delay: 150,
          label: "\u544A\u8B66",
          value: loaded ? String(alertCount) : "\u2014",
          sub: loaded ? alertCount > 0 ? `${alertCount} \u4E2A\u4F9B\u5E94\u5546\u53D7\u5F71\u54CD` : "\u6682\u65E0\u544A\u8B66" : "\u52A0\u8F7D\u4E2D\u2026",
          icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M8 2.2a4.4 4.4 0 0 0-4.4 4.4c0 3-.9 4.2-1.6 4.8h12c-.7-.6-1.6-1.8-1.6-4.8A4.4 4.4 0 0 0 8 2.2Z", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M6.6 13.6a1.5 1.5 0 0 0 2.8 0", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })
          ] })
        }
      )
    ] }),
    loaded && /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "dsh-acc-banner", "data-tone": alertCount > 0 ? "warn" : "ok", children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { display: "flex", flex: "none" }, children: alertCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "17", height: "17", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", style: { color: "var(--dsw-alias-state-warn-primary)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M8 1.8 14.6 13.4H1.4L8 1.8Z", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round" }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M8 6.4v3.2M8 11.4v.4", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("svg", { width: "17", height: "17", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", style: { color: "var(--dsw-alias-state-success-primary)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("circle", { cx: "8", cy: "8", r: "6.2", stroke: "currentColor", strokeWidth: "1.5" }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M5.2 8.2 7.2 10.2 10.8 6.2", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { minWidth: 0, display: "flex", flexDirection: "column", gap: 1, flex: 1 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 13, fontWeight: 600, color: alertCount > 0 ? "var(--dsw-alias-state-warn-primary)" : "var(--dsw-alias-state-success-primary)" }, children: alertCount > 0 ? `\u68C0\u6D4B\u5230 ${alertCount} \u9879\u544A\u8B66` : "\u6240\u6709\u7CFB\u7EDF\u8FD0\u884C\u6B63\u5E38" }),
        /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 11, lineHeight: "16px", color: "var(--dsw-alias-label-tertiary)" }, children: alertCount > 0 ? "\u90E8\u5206\u4F9B\u5E94\u5546\u5904\u4E8E\u8B66\u544A\u6216\u7D27\u6025\u72B6\u6001" : "\u5F53\u524D\u6CA1\u6709\u9700\u8981\u5904\u7406\u7684\u544A\u8B66\u6216\u5F02\u5E38" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
        "button",
        {
          type: "button",
          onClick: onJumpSignal,
          style: { flex: "none", display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", cursor: "pointer", padding: "5px 8px", borderRadius: 8, fontSize: 12, color: "var(--dsw-alias-label-secondary)", transition: "background 160ms cubic-bezier(0.2, 0.8, 0.2, 1)" },
          children: [
            "\u67E5\u770B\u4FE1\u53F7\u4E2D\u5FC3",
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M6 3.5 10.5 8 6 12.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { flex: 1, minHeight: 0, display: "flex", gap: 12, alignItems: "stretch" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { display: "flex", alignItems: "baseline", gap: 8, flex: "none" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary)" }, children: "\u4F9B\u5E94\u5546\u5217\u8868" }),
          /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)" }, children: [
            "(",
            loaded ? providers.length : "\u2014",
            ")"
          ] }),
          q !== "" && /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("span", { style: { fontSize: 11, color: "var(--dsw-alias-label-tertiary)" }, children: [
            "\xB7 ",
            visible.length,
            " \u9879\u5339\u914D"
          ] })
        ] }),
        !loaded ? /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "dsh-acc-tlist", style: { flex: 1, minHeight: 0 }, children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "dsh-acc-skel", style: { height: 64, border: "none", borderRadius: 0 } }, i)) }) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "dsh-acc-tlist", style: { flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, fontSize: 12, color: "var(--dsw-alias-label-tertiary)" }, children: q !== "" ? "\u6CA1\u6709\u5339\u914D\u7684\u4F9B\u5E94\u5546" : "\u6682\u65E0\u53EF\u5C55\u793A\u7684\u4F59\u989D/\u8BA2\u9605\u6570\u636E" }) : /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "dsh-acc-tlist", style: { flex: 1, minHeight: 0, overflow: "auto" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: "dsh-acc-thead", style: { position: "sticky", top: 0, zIndex: 1, background: "var(--dsw-alias-bg-layer-2)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { children: "\u4F9B\u5E94\u5546" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { children: "\u72B6\u6001" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { children: "\u4F7F\u7528\u60C5\u51B5" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { children: "\u914D\u989D\u7C7B\u578B" }),
            /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { children: "\u64CD\u4F5C" })
          ] }),
          visible.map((p, i) => {
            const acc = accounts[p.id] ?? null;
            const wins = acc?.windows ?? [];
            const hasWindows = wins.length > 0;
            const meta = statusMeta(p);
            const usage = rowUsage(p);
            const qtype = quotaType(p);
            const plan = planMeta(p);
            const selected = selectedId === p.id && !drawerClosing;
            const needsCredential = p.status === "unauthorized" || p.status === "not-configured";
            const color = palette[indexOf(p.id) % palette.length];
            return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(
              "div",
              {
                className: "dsh-acc-trow",
                "data-selected": selected,
                style: { gridTemplateColumns: COL, animationDelay: `${Math.min(i * 26, 260)}ms` },
                role: "button",
                tabIndex: 0,
                onClick: () => {
                  toggleSelect(p.id);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSelect(p.id);
                  }
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(LogoMark, { name: p.displayName, color }),
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary)" }, children: p.displayName }),
                      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("span", { style: { display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden" }, children: [
                        hasWindows && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "dsh-acc-chip", style: { color: "var(--dsw-alias-state-business-primary)", background: kpiTone("var(--dsw-alias-state-business-primary)", 12) }, children: "\u79EF\u5206\u6C60" }),
                        plan !== null && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 11, color: "var(--dsw-alias-label-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: plan })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, minWidth: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "dsh-acc-dot", "data-critical": p.status === "critical", style: { background: meta.color, color: meta.color } }),
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary)", whiteSpace: "nowrap" }, children: meta.label })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { style: { minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }, children: usage === null ? /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(import_jsx_runtime31.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary)" }, children: "\u2014" }),
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 11, color: "var(--dsw-alias-label-tertiary)" }, children: "\u6682\u65E0\u65B9\u6848" })
                  ] }) : /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(import_jsx_runtime31.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("span", { style: { display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("span", { style: { fontSize: 12, fontWeight: 600, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: "var(--dsw-alias-label-primary)" }, children: [
                        usage.pct,
                        "%"
                      ] }),
                      usage.text !== null && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 11, color: "var(--dsw-alias-label-tertiary)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: usage.text })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { style: { width: 96, flex: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(ProgressBar, { percent: usage.pct, height: 5 }) })
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: qtype ?? "\u2014" }),
                  /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { style: { display: "flex", justifyContent: "flex-end", minWidth: 0 }, children: hasWindows ? /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { style: { display: "flex", alignItems: "center", color: selected ? "var(--dsw-alias-state-business-primary)" : "var(--dsw-alias-label-tertiary)", transition: "color 180ms cubic-bezier(0.2, 0.8, 0.2, 1)" }, children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", style: { transform: selected ? "rotate(90deg)" : void 0, transition: "transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)" }, children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("path", { d: "M6 3.5 10.5 8 6 12.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }) : needsCredential ? /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        setCredentialFor(p.id);
                      },
                      style: { border: "1px solid var(--dsw-alias-border-l1)", background: "transparent", color: "var(--dsw-alias-label-secondary)", fontSize: 12, padding: "4px 10px", borderRadius: 8, cursor: "pointer", transition: "color 160ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 160ms cubic-bezier(0.2, 0.8, 0.2, 1)" },
                      children: "\u7ACB\u5373\u914D\u7F6E"
                    }
                  ) : /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        select(p.id);
                      },
                      style: { border: "1px solid var(--dsw-alias-border-l1)", background: "transparent", color: "var(--dsw-alias-label-secondary)", fontSize: 12, padding: "4px 10px", borderRadius: 8, cursor: "pointer", transition: "color 160ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 160ms cubic-bezier(0.2, 0.8, 0.2, 1)" },
                      children: "\u6DFB\u52A0\u65B9\u6848"
                    }
                  ) })
                ]
              },
              p.id
            );
          })
        ] })
      ] }),
      drawer
    ] }),
    credentialFor !== null && /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      CredentialModal,
      {
        providerName: providers.find((p) => p.id === credentialFor)?.displayName ?? credentialFor,
        onClose: () => setCredentialFor(null),
        onSave: saveCredential
      }
    )
  ] });
}

// src/client/usage/dashboard/primitives/RangePicker.tsx
var import_jsx_runtime32 = require("react/jsx-runtime");
var PRESETS = [
  { key: "today", label: "\u4ECA\u65E5" },
  { key: "yesterday", label: "\u6628\u65E5" },
  { key: "7d", label: "\u8FD1 7 \u5929" },
  { key: "30d", label: "\u8FD1 30 \u5929" },
  { key: "month", label: "\u672C\u6708" },
  { key: "lastMonth", label: "\u4E0A\u6708" },
  { key: "year", label: "\u4ECA\u5E74" },
  { key: "all", label: "\u5168\u90E8" },
  { key: "custom", label: "\u81EA\u5B9A\u4E49" }
];
function RangePicker({ preset, custom, onChangePreset, onChangeCustom }) {
  const { range } = resolveRange(preset, custom);
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(import_jsx_runtime32.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: css2.rangeGrid, role: "group", "aria-label": "\u67E5\u8BE2\u8303\u56F4", children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
      "button",
      {
        type: "button",
        className: css2.rangeBtn,
        "data-active": preset === p.key || void 0,
        "aria-pressed": preset === p.key,
        onClick: () => {
          onChangePreset(p.key);
        },
        children: p.label
      },
      p.key
    )) }),
    preset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: css2.rangeCustom, children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("span", { className: css2.rangeDateRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
        "input",
        {
          type: "date",
          className: css2.rangeDate,
          value: range.start,
          max: range.end,
          "aria-label": "\u5F00\u59CB\u65E5\u671F",
          onChange: (e) => {
            if (e.target.value !== "") onChangeCustom({ start: e.target.value, end: range.end < e.target.value ? e.target.value : range.end });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: css2.rangeDateSep, children: "~" }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
        "input",
        {
          type: "date",
          className: css2.rangeDate,
          value: range.end,
          min: range.start,
          "aria-label": "\u7ED3\u675F\u65E5\u671F",
          onChange: (e) => {
            if (e.target.value !== "") onChangeCustom({ start: range.start > e.target.value ? e.target.value : range.start, end: e.target.value });
          }
        }
      )
    ] }) })
  ] });
}

// src/client/usage/dashboard/Workbench.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
var NAV = [
  { key: "trend", label: "\u8D8B\u52BF", icon: trendIcon },
  { key: "detail", label: "\u660E\u7EC6", icon: detailIcon },
  { key: "signal", label: "\u4FE1\u53F7", icon: signalIcon },
  { key: "accounts", label: "\u4F59\u989D/\u914D\u989D", icon: walletIcon }
];
var TAB_SIZES = {
  trend: { width: 1440, height: 880 },
  detail: { width: 1240, height: 860 },
  signal: { width: 1240, height: 860 },
  accounts: { width: 1180, height: 820 }
};
function ProviderFilter({ value, options, onChange }) {
  const [open, setOpen] = (0, import_react27.useState)(false);
  const active = value !== "all";
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: css2.dropWrap, children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
      "button",
      {
        type: "button",
        className: css2.toolButton,
        "aria-haspopup": "menu",
        "aria-expanded": open || void 0,
        title: "\u6309\u4F9B\u5E94\u5546\u7B5B\u9009",
        style: {
          height: 30,
          borderRadius: 999,
          fontSize: 12,
          ...active ? {
            background: "color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 13%, transparent)",
            borderColor: "color-mix(in srgb, var(--dsw-alias-state-business-primary, #4176e6) 45%, transparent)",
            color: "var(--dsw-alias-state-business-primary, #4176e6)",
            fontWeight: 600
          } : void 0
        },
        onClick: () => {
          setOpen((v) => !v);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { opacity: 0.75 }, children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M22 3H2l8 9.5V19l4 2v-8.5L22 3z" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { style: { maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: active ? value : "\u5168\u90E8\u4F9B\u5E94\u5546" }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { opacity: 0.7 }, children: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "m6 9 6 6 6-6" }) })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(import_jsx_runtime33.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", className: css2.bulkOverlay, "aria-label": "\u5173\u95ED", onClick: () => {
        setOpen(false);
      } }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: css2.dropMenu, role: "menu", "aria-label": "\u6309\u4F9B\u5E94\u5546\u7B5B\u9009", style: { minWidth: 200, maxHeight: 300, overflowY: "auto" }, children: [{ name: "all", tokens: 0 }, ...options].map((p) => /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
        "button",
        {
          type: "button",
          role: "menuitemradio",
          className: css2.dropItem,
          "aria-checked": p.name === value,
          onClick: () => {
            onChange(p.name);
            setOpen(false);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: css2.dropCheck, "data-on": p.name === value || void 0, "aria-hidden": "true", children: p.name === value ? "\u2713" : "" }),
            p.name === "all" ? "\u5168\u90E8\u4F9B\u5E94\u5546" : p.name,
            p.name !== "all" && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--dsw-alias-label-tertiary)" }, children: formatUnits(p.tokens) })
          ]
        },
        p.name
      )) })
    ] })
  ] });
}
function Workbench({ onClose, closing = false, anchor = null, onCardMouseEnter, onCardMouseLeave, renderTab }) {
  const [tab, setTab] = (0, import_react27.useState)("trend");
  const [preset, setPreset] = (0, import_react27.useState)("today");
  const [custom, setCustom] = (0, import_react27.useState)(null);
  const [refreshTick, setRefreshTick] = (0, import_react27.useState)(0);
  const [refreshing, setRefreshing] = (0, import_react27.useState)(false);
  const [counts, setCounts] = (0, import_react27.useState)({ trend: "\u2014", detail: "\u2014", signal: "\u2014", signalWarn: false, accounts: "\u2014", accountsWarn: false });
  const [provider, setProvider] = (0, import_react27.useState)("all");
  const [providerOptions, setProviderOptions] = (0, import_react27.useState)([]);
  const close = onClose ?? (() => {
  });
  ensureHubStyles();
  const { range, label: rangeLabel } = resolveRange(preset, custom);
  const doRefresh = () => {
    setRefreshing(true);
    setRefreshTick((t) => t + 1);
    window.setTimeout(() => setRefreshing(false), 900);
  };
  const headDate = (() => {
    const now = /* @__PURE__ */ new Date();
    const week = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"][now.getDay()];
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${mm}-${dd} \u661F\u671F${week}`;
  })();
  (0, import_react27.useEffect)(() => {
    let alive = true;
    Promise.all([
      usageApi.usage().catch(() => null),
      usageApi.signal(30).catch(() => null),
      usageApi.providers().catch(() => null)
    ]).then(([u, s, p]) => {
      if (!alive) return;
      const days = u !== null && u.ok === true ? u.days : null;
      const inRange = days !== null ? filterDays(days, resolveRange(preset, custom).range) : [];
      const activeDays = inRange.filter((d) => (d.tokens ?? 0) > 0).length;
      const modelSet = /* @__PURE__ */ new Set();
      for (const day of inRange) for (const m of day.models ?? []) modelSet.add(m.model);
      const provTokens = /* @__PURE__ */ new Map();
      if (days !== null) for (const day of days) for (const m of day.models ?? []) {
        const p2 = splitModelKey(m.model).provider;
        provTokens.set(p2, (provTokens.get(p2) ?? 0) + (m.tokens ?? 0));
      }
      setProviderOptions([...provTokens.entries()].map(([name, tokens]) => ({ name, tokens })).sort((a, b) => b.tokens - a.tokens || a.name.localeCompare(b.name, "zh-Hans-CN")));
      const anomalies = s !== null && s.ok === true ? s.signal.anomalyDays.length : 0;
      const providers = p !== null && p.ok === true ? p.providers : [];
      const alertCount = providers.filter((x) => x.status === "critical" || x.status === "warning").length;
      setCounts({
        trend: days === null ? "\u2014" : String(activeDays),
        detail: days === null ? "\u2014" : String(modelSet.size),
        signal: s === null ? "\u2014" : String(anomalies),
        signalWarn: anomalies > 0,
        accounts: p === null ? "\u2014" : String(providers.length),
        accountsWarn: alertCount > 0
      });
    });
    return () => {
      alive = false;
    };
  }, [preset, custom]);
  const tabContent = {
    trend: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      TrendTab,
      {
        range,
        rangeLabel,
        onJumpAccounts: () => setTab("accounts"),
        onJumpSignal: () => setTab("signal"),
        onJumpDetail: () => setTab("detail"),
        refreshTick,
        provider
      }
    ),
    detail: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(UsageTab, { range, rangeLabel, provider, refreshTick }),
    signal: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(SignalTab, {}),
    accounts: /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(AccountsTab, { onJumpSignal: () => setTab("signal") })
  };
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(PopoverShell, { solid: true, closing, onClose: close, anchor, size: TAB_SIZES[tab], onCardMouseEnter, onCardMouseLeave, ariaLabel: "\u7528\u91CF\u5DE5\u4F5C\u53F0", children: [
    /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "psh-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { className: "psh-title", style: { flex: "none" }, children: "\u7528\u91CF\u5DE5\u4F5C\u53F0" }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { style: { flex: 1, minWidth: 0 } }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("button", { type: "button", className: css2.refresh, "data-spin": refreshing || void 0, "aria-label": "\u5237\u65B0\u7528\u91CF\u6570\u636E", onClick: doRefresh, children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M21 12a9 9 0 0 1-15.9 5.7M3 12a9 9 0 0 1 15.9-5.7" }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M21 3v6h-6M3 21v-6h6" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("span", { style: { fontSize: 12, lineHeight: "18px", color: "var(--dsw-alias-label-tertiary)", whiteSpace: "nowrap", marginRight: 2 }, children: headDate })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(PshBody, { children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: css2.hub, children: [
      /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: css2.topbar, children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: css2.catRow, role: "group", "aria-label": "\u5DE5\u4F5C\u53F0\u5206\u7C7B", children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
          HubCatItem,
          {
            active: tab === item.key,
            icon: item.icon(16),
            label: item.label,
            count: counts[item.key === "trend" ? "trend" : item.key === "detail" ? "detail" : item.key === "signal" ? "signal" : "accounts"],
            warn: item.key === "signal" ? counts.signalWarn : item.key === "accounts" ? counts.accountsWarn : false,
            onClick: () => {
              setTab(item.key);
            }
          },
          item.key
        )) }),
        (tab === "trend" || tab === "detail") && /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: css2.topRange, children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(ProviderFilter, { value: provider, options: providerOptions, onChange: setProvider }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
            RangePicker,
            {
              preset,
              custom,
              onChangePreset: setPreset,
              onChangeCustom: setCustom
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { style: { flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }, children: renderTab ? renderTab(tab) : tabContent[tab] })
    ] }) })
  ] });
}

// src/client/usage/dashboard/SkillsPanel.tsx
var import_react29 = require("react");
var import_react_dom11 = require("react-dom");
var import_dsh_client_ui_primitives6 = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime35 = require("react/jsx-runtime");
var SKILL_ZH = {
  entry: "\u80FD\u529B",
  panelTitle: "\u80FD\u529B\u7BA1\u7406",
  close: "\u5173\u95ED",
  loading: "\u6B63\u5728\u8BFB\u53D6\u6280\u80FD\u2026",
  error: "\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u6280\u80FD\u3002",
  retry: "\u91CD\u8BD5",
  uploadHint: "\u62D6\u5165\u6280\u80FD\u6587\u4EF6\u5939\u5B89\u88C5\uFF0C\u6216\u70B9\u51FB\u9009\u62E9",
  uploadMeta: "{n} \u4E2A\u6587\u4EF6 \xB7 {folder}",
  fileCount: "{n} \u6587\u4EF6",
  expandSkillFiles: "\u5C55\u5F00\u6280\u80FD\u6587\u4EF6",
  previewLoading: "\u6B63\u5728\u52A0\u8F7D\u5185\u5BB9\u2026",
  viewSkillFiles: "\u67E5\u770B\u6280\u80FD\u6587\u4EF6",
  viewerNav: "\u6280\u80FD\u6587\u4EF6",
  viewerFont: "\u5B57\u53F7",
  viewerSmall: "\u5C0F\u5B57\u53F7",
  viewerNormal: "\u6807\u51C6\u5B57\u53F7",
  viewerLarge: "\u5927\u5B57\u53F7",
  viewerFull: "\u5168\u5C4F\u67E5\u770B",
  viewerExitFull: "\u9000\u51FA\u5168\u5C4F",
  viewerFilesCount: "{n} \u4E2A\u6587\u4EF6",
  assignToBundle: "\u5F52\u5165 Bundle",
  assignTitle: "\u5C06\u300C{name}\u300D\u5F52\u5165",
  assignEmpty: "\u8FD8\u6CA1\u6709\u6280\u80FD\u5305,\u5148\u70B9\u300C\u65B0\u5EFA Bundle\u300D\u521B\u5EFA\u4E00\u4E2A\u3002",
  deleteSkillBtn: "\u5220\u9664\u6280\u80FD",
  installName: "\u6280\u80FD\u540D\u79F0",
  installNamePlaceholder: "\u4F8B\u5982 my-skill",
  installDescription: "\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09",
  installNameFromArchive: "\u6280\u80FD\u540D\u53D6\u81EA\u538B\u7F29\u5305\u5185\u7684 SKILL.md",
  installNameInvalid: "\u6280\u80FD\u540D\u53EA\u80FD\u5305\u542B\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u8FDE\u5B57\u7B26\uFF08a-z 0-9 -\uFF09",
  installBundle: "\u5F52\u5165 Bundle",
  installLoose: "\u4E0D\u5F52\u7EC4\uFF08\u6563\u88C5\uFF09",
  installConfirm: "\u5B89\u88C5",
  installCancel: "\u53D6\u6D88",
  bundlesTitle: "\u6280\u80FD\u5305",
  bundlesEmpty: "\u8FD8\u6CA1\u6709\u6280\u80FD\u5305\uFF0C\u70B9\u300C\u65B0\u5EFA Bundle\u300D\u521B\u5EFA\u4E00\u4E2A\u3002",
  bundleNoSkills: "\u8FD8\u6CA1\u6709\u6280\u80FD\uFF0C\u53EF\u4E0A\u4F20\u6216\u4ECE\u6563\u88C5\u6280\u80FD\u4E2D\u5F52\u5165\u3002",
  newBundle: "\u65B0\u5EFA\u6280\u80FD\u5305",
  newBundlePlaceholder: "\u6280\u80FD\u5305\u540D\u79F0",
  create: "\u521B\u5EFA",
  cancel: "\u53D6\u6D88",
  renameBundlePlaceholder: "\u65B0\u7684 Bundle \u540D\u79F0",
  rename: "\u91CD\u547D\u540D",
  delete: "\u5220\u9664",
  skillsCount: "{n} \u4E2A\u6280\u80FD",
  removeSkill: "\u79FB\u51FA",
  looseTitle: "\u6563\u88C5\u6280\u80FD",
  looseEmpty: "\u6CA1\u6709\u6563\u88C5 Skill",
  deleteBundleConfirm: "\u5220\u9664 Bundle\u300C{name}\u300D\uFF1F\u5176\u4E2D\u7684\u6280\u80FD\u5C06\u53D8\u4E3A\u6563\u88C5\u3002",
  deleteSkillConfirm: "\u5220\u9664\u6280\u80FD\u300C{name}\u300D\uFF1F\u6B64\u64CD\u4F5C\u4F1A\u5220\u9664\u5B83\u7684\u6587\u4EF6\u3002",
  enableSkill: "\u542F\u7528",
  disableSkill: "\u7981\u7528",
  enableBundle: "\u542F\u7528\u5168\u90E8",
  disableBundle: "\u7981\u7528\u5168\u90E8",
  toggleFailed: "\u5207\u6362\u5931\u8D25\uFF1A{message}",
  presetAll: "\u5168\u90E8",
  presetAllName: "\u5168\u90E8 Agent",
  presetStripLabel: "Agent \u9884\u8BBE",
  presetHintAll: "\u5F53\u524D\u7F16\u8F91\u300C\u5168\u90E8 Agent\u300D\uFF1A\u5F00\u5173\u76F4\u63A5\u6539\u6280\u80FD\u6587\u4EF6\uFF0C\u5BF9\u6240\u6709\u9884\u8BBE\u751F\u6548\u3002",
  presetHintScoped: "\u5F53\u524D\u7F16\u8F91\u300C{name}\u300D\uFF1A\u53EA\u5BF9\u8BE5 Agent \u9884\u8BBE\u751F\u6548\uFF0C\u5176\u5B83\u9884\u8BBE\u4E0D\u53D7\u5F71\u54CD\u3002",
  presetReset: "\u6E05\u7A7A\u8BE5\u9884\u8BBE\u7684\u5355\u72EC\u8BBE\u7F6E",
  presetDefaultTag: "\u9ED8\u8BA4",
  presetOverrideCount: "{n} \u9879\u5355\u72EC\u8BBE\u7F6E",
  presetLockedByGlobal: "\u300C\u5168\u90E8 Agent\u300D\u5C42\u5DF2\u7981\u7528\uFF0C\u9884\u8BBE\u5C42\u65E0\u6CD5\u6253\u5F00",
  // 卡片（Skills Hub 风格）文案
  copySkillName: "\u590D\u5236\u6280\u80FD\u540D",
  copiedSkillName: "\u5DF2\u590D\u5236",
  toolsLabel: "\u5DE5\u5177",
  scopeAll: "\u5168\u5C40",
  tagLoose: "\u6563\u88C5",
  // Skills Hub 页面文案
  hubSubtitle: "Skill \u7BA1\u7406\u5DE5\u4F5C\u533A",
  hubWorkspace: "\u5DE5\u4F5C\u533A",
  hubManage: "\u7BA1\u7406",
  hubMySkills: "\u6211\u7684\u6280\u80FD",
  hubAddSkills: "\u6DFB\u52A0\u6280\u80FD",
  hubBundles: "\u6280\u80FD\u5305",
  hubPresets: "Agent \u9884\u8BBE",
  hubLoose: "\u6563\u88C5\u6280\u80FD",
  statManaged: "\u7BA1\u7406\u7684\u6280\u80FD",
  statEnabled: "\u5168\u5C40\u542F\u7528",
  statLoose: "\u6563\u88C5\u6280\u80FD",
  statSync: "\u6280\u80FD\u5065\u5EB7",
  statHealthy: "\u5168\u90E8\u5065\u5EB7",
  statManagedDesc: "\u60A8\u521B\u5EFA\u548C\u7BA1\u7406\u7684\u6280\u80FD\u603B\u6570",
  statEnabledDesc: "\u5728\u6240\u6709 Agent \u4E2D\u542F\u7528\u7684\u6280\u80FD",
  statLooseDesc: "\u672A\u5206\u7C7B\u7684\u6563\u88C5\u6280\u80FD",
  statSyncDesc: "\u6240\u6709\u6280\u80FD\u8FD0\u884C\u6B63\u5E38",
  statChecking: "\u68C0\u6D4B\u4E2D\u2026",
  statIssues: "{n} \u4E2A\u95EE\u9898",
  statUnknown: "\u68C0\u6D4B\u5931\u8D25",
  statPending: "\u5F85\u68C0\u6D4B",
  searchPlaceholder: "\u641C\u7D22\u6280\u80FD\u540D\u79F0\u3001\u63CF\u8FF0\u6216\u6807\u7B7E\u2026",
  filterAll: "\u5168\u90E8",
  filterBundles: "\u6280\u80FD\u5305",
  filterLoose: "\u6563\u88C5\u6280\u80FD",
  sortLabel: "\u540D\u79F0",
  presetSelect: "Agent \u9884\u8BBE",
  viewList: "\u5217\u8868",
  viewGrid: "\u7F51\u683C",
  bannerTitle: "\u6DFB\u52A0\u6280\u80FD",
  bannerSub: "\u62D6\u5165\u6280\u80FD\u6587\u4EF6\u5939\u5B89\u88C5\uFF0C\u6216\u70B9\u51FB\u6D4F\u89C8\u9009\u62E9",
  bannerDiscovered: "\u53D1\u73B0\u5F85\u5BFC\u5165\u6280\u80FD",
  bannerFound: "\u53D1\u73B0 {n} \u4E2A\u6587\u4EF6\uFF08{folder}\uFF09\u5F85\u5BFC\u5165",
  bannerBtnBrowse: "\u6D4F\u89C8\u5E76\u5BFC\u5165",
  bannerBtnReview: "\u5BA1\u67E5\u5E76\u5BFC\u5165",
  noMatch: "\u6CA1\u6709\u7B26\u5408\u7B5B\u9009\u6761\u4EF6\u7684\u6280\u80FD",
  // 左栏：Agent 预设分类 / 快捷筛选 / 添加技能卡
  presetCatTitle: "Agent \u9884\u8BBE\u5206\u7C7B",
  quickFilter: "\u5FEB\u6377\u7B5B\u9009",
  catAll: "\u5168\u90E8",
  catStandard: "\u6807\u51C6\u6A21\u5F0F",
  catPtc: "PTC \u6A21\u5F0F",
  catExtreme: "\u6781\u9650\u6A21\u5F0F",
  catCreative: "\u521B\u610F\u6A21\u5F0F",
  statusAll: "\u5168\u90E8",
  statusOn: "\u5DF2\u542F\u7528",
  statusOff: "\u5DF2\u505C\u7528",
  toolAll: "\u5168\u90E8\u5DE5\u5177",
  updatedAll: "\u6700\u8FD1\u66F4\u65B0",
  filterUpdated: "\u6700\u8FD1\u66F4\u65B0",
  addSkillsTitle: "\u6DFB\u52A0\u6280\u80FD",
  addSkillsSub: "\u62D6\u5165\u6280\u80FD\u6587\u4EF6\u5B89\u88C5\uFF0C\u6216\u70B9\u51FB\u6D4F\u89C8\u9009\u62E9",
  dropHere: "\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904",
  dropFormat: "\u652F\u6301 .zip .skill \u7B49\u683C\u5F0F",
  browseImport: "\u6D4F\u89C8\u5E76\u5BFC\u5165",
  // 快速上手指南卡
  guideTitle: "\u5FEB\u901F\u4E0A\u624B\u6307\u5357",
  guideDesc1: "\u4E86\u89E3 Skill \u7684\u4F5C\u7528\u548C\u4F7F\u7528\u65B9\u6CD5",
  guideDesc2: "\u5FEB\u901F\u521B\u5EFA\u4F60\u7684\u7B2C\u4E00\u4E2A Skill",
  guideStart: "\u5F00\u59CB\u5B66\u4E60",
  guidePanelTitle: "\u5FEB\u901F\u4E0A\u624B",
  guideWhat: "\u4EC0\u4E48\u662F Skill?",
  guideWhatDesc: "Skill \u662F Agent \u7684\u80FD\u529B\u6A21\u5757\uFF0C\u53EF\u4EE5\u8BA9 Agent \u5B66\u4F1A\u7279\u5B9A\u4EFB\u52A1\u3001\u6269\u5C55\u66F4\u591A\u80FD\u529B\u3002",
  guideCapUi: "UI \u8BBE\u8BA1",
  guideCapCode: "\u4EE3\u7801\u751F\u6210",
  guideCapDoc: "\u6587\u6863\u5904\u7406",
  guideCapData: "\u6570\u636E\u5206\u6790",
  guideCapTool: "\u5DE5\u5177\u8C03\u7528",
  guideStep1: "\u521B\u5EFA Skill",
  guideStep1Desc: "\u901A\u8FC7\u4E0A\u4F20\u6587\u4EF6\u6216\u914D\u7F6E\u89C4\u5219\uFF0C\u521B\u5EFA\u65B0\u7684 Skill\uFF0C\u8BA9 Agent \u5B66\u4F1A\u65B0\u80FD\u529B\u3002",
  guideStep2: "\u914D\u7F6E Skill",
  guideStep2Desc: "\u8BBE\u7F6E\u8F93\u5165\u8F93\u51FA\u3001\u53C2\u6570\u548C\u6743\u9650\uFF0C\u786E\u4FDD Skill \u80FD\u6B63\u786E\u88AB Agent \u8C03\u7528\u3002",
  guideStep3: "\u542F\u7528\u7ED9 Agent",
  guideStep3Desc: "\u5C06 Skill \u542F\u7528\u5230 Agent \u4E2D\uFF0C\u8BA9 Agent \u5728\u5BF9\u8BDD\u4E2D\u81EA\u52A8\u4F7F\u7528\u3002",
  guideStep4: "\u67E5\u770B\u6548\u679C",
  guideStep4Desc: "\u5728\u5BF9\u8BDD\u4E2D\u6D4B\u8BD5 Skill \u7684\u6548\u679C\uFF0C\u6301\u7EED\u4F18\u5316\u6280\u80FD\u8868\u73B0\u3002",
  guideFull: "\u67E5\u770B\u5B8C\u6574\u6307\u5357",
  guideBest: "\u6700\u4F73\u5B9E\u8DF5",
  guideBest1: "\u4E00\u4E2A Skill \u4E13\u6CE8\u4E00\u4E2A\u80FD\u529B",
  guideBest2: "\u63CF\u8FF0\u6E05\u695A\u8F93\u5165\u548C\u8F93\u51FA",
  guideBest3: "\u5B9A\u671F\u66F4\u65B0\u6280\u80FD\u6587\u4EF6",
  guideBest4: "\u4E0D\u8981\u521B\u5EFA\u91CD\u590D\u80FD\u529B",
  guideMoreBest: "\u4E86\u89E3\u66F4\u591A\u6700\u4F73\u5B9E\u8DF5",
  guideClose: "\u6536\u8D77\u6307\u5357",
  // SKILL / MCP 顶层 tab
  kindSkill: "SKILL",
  kindMcp: "MCP",
  // MCP 视图
  mcpServer: "MCP Server",
  mcpTools: "\u5DE5\u5177\u5217\u8868",
  mcpLog: "\u8FDE\u63A5\u65E5\u5FD7",
  mcpConfig: "\u914D\u7F6E\u6A21\u677F",
  mcpRecommendMenu: "\u63A8\u8350 MCP Server",
  mcpRecommendTitle: "\u63A8\u8350 MCP Server",
  mcpAdd: "\u6DFB\u52A0",
  // MCP Server 页（图一头部 + 统计卡）
  mcpTitle: "MCP \u7BA1\u7406",
  mcpProtocol: "Model Contest Protocol",
  mcpSubtitle: "\u7BA1\u7406 MCP Server\uFF0C\u6269\u5C55 Agent \u80FD\u529B\u8FB9\u754C",
  mcpMarketplace: "MCP Marketplace",
  mcpAddServer: "\u6DFB\u52A0 MCP Server",
  mcpStatTotal: "MCP Server \u603B\u6570",
  mcpStatTotalDesc: "\u5DF2\u6DFB\u52A0\u7684 MCP Server",
  mcpStatEnabled: "\u5DF2\u542F\u7528",
  mcpStatEnabledDesc: "Agent \u53EF\u4F7F\u7528",
  mcpStatTools: "\u53EF\u7528\u5DE5\u5177",
  mcpStatToolsDesc: "\u901A\u8FC7 MCP \u63D0\u4F9B\u7684\u5DE5\u5177",
  mcpStatRunning: "\u8FD0\u884C\u4E2D",
  mcpStatRunningDesc: "\u5F53\u524D\u8FDE\u63A5\u6B63\u5E38",
  // 推荐 Skill
  skillRecommendTitle: "\u63A8\u8350 Skill",
  // MCP Server 列表（图二）
  mcpListTitle: "MCP Server \u5217\u8868",
  mcpEmptyList: "\u6682\u65E0 MCP Server\uFF0C\u70B9\u51FB\u53F3\u4E0A\u89D2\u300C\u6DFB\u52A0 MCP Server\u300D\u5F00\u59CB\u63A5\u5165\u3002",
  mcpViewAll: "\u67E5\u770B\u5168\u90E8 {n} \u4E2A MCP Server",
  mcpAdded: "\u5DF2\u6DFB\u52A0",
  mcpRemove: "\u79FB\u9664",
  mcpAddModalTitle: "\u6DFB\u52A0 MCP Server",
  mcpAddName: "\u540D\u79F0",
  mcpAddNamePlaceholder: "\u4F8B\u5982 My MCP",
  mcpAddDesc: "\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09",
  mcpAddDescPlaceholder: "\u7B80\u5355\u63CF\u8FF0\u8FD9\u4E2A MCP \u7684\u7528\u9014",
  mcpAddType: "\u8FDE\u63A5\u7C7B\u578B",
  mcpAddTypeStdio: "stdio",
  mcpAddTypeHttp: "http",
  mcpAddTypeSse: "sse",
  mcpAddCommand: "\u542F\u52A8\u547D\u4EE4",
  mcpAddCommandPlaceholder: "\u4F8B\u5982 npx -y @modelcontextprotocol/server-filesystem",
  mcpAddUrl: "\u63A5\u53E3\u5730\u5740",
  mcpAddUrlPlaceholder: "\u4F8B\u5982 https://example.com/mcp",
  mcpAddConfirm: "\u6DFB\u52A0",
  mcpAddCat: "\u81EA\u5B9A\u4E49",
  // 工具列表页
  mcpToolsTitle: "\u53EF\u7528\u5DE5\u5177 \xB7 {n}",
  mcpToolsSearch: "\u641C\u7D22\u5DE5\u5177\u2026",
  mcpToolsEmpty: "\u6682\u65E0\u53EF\u7528\u5DE5\u5177\uFF1A\u5148\u6DFB\u52A0\u5E76\u542F\u7528 MCP Server",
  // 推荐页联网搜索
  mcpSearchPlaceholder: "\u641C\u7D22 MCP Server\uFF0C\u5982 google / \u9489\u9489 / \u98DE\u4E66\u2026",
  mcpSearching: "\u6B63\u5728\u641C\u7D22\u5916\u90E8 MCP \u76EE\u5F55\u2026",
  mcpSearchResults: "\u641C\u7D22\u7ED3\u679C \xB7 {n}",
  mcpSearchEmpty: "\u6CA1\u6709\u627E\u5230\u300C{q}\u300D\u76F8\u5173\u7684 MCP\uFF0C\u6362\u4E2A\u5173\u952E\u8BCD\u8BD5\u8BD5",
  mcpOpen: "\u6253\u5F00",
  mcpOpenGitHub: "GitHub \u4ED3\u5E93",
  mcpOpenRegistry: "MCP Registry",
  mcpResolving: "\u89E3\u6790\u4E2D\u2026",
  mcpResolveFailed: "\u672A\u80FD\u8BC6\u522B\u5B89\u88C5\u65B9\u5F0F\uFF0C\u8BF7\u6253\u5F00\u4ED3\u5E93\u67E5\u770B\u914D\u7F6E",
  // 连接日志页
  mcpLogTitle: "\u8FDE\u63A5\u65E5\u5FD7",
  mcpLogEmpty: "\u6682\u65E0\u8FDE\u63A5\u65E5\u5FD7\uFF0C\u63A5\u5165 MCP Server \u540E\u81EA\u52A8\u8BB0\u5F55",
  mcpLogClear: "\u6E05\u7A7A\u65E5\u5FD7",
  mcpLogAdd: "\u5DF2\u6DFB\u52A0",
  mcpLogEnable: "\u5DF2\u542F\u7528",
  mcpLogDisable: "\u5DF2\u7981\u7528",
  mcpLogRemove: "\u5DF2\u79FB\u9664",
  // 配置模板页
  mcpConfigTitle: "\u914D\u7F6E\u6A21\u677F",
  mcpConfigCopy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  mcpTagOfficial: "\u5B98\u65B9",
  mcpTagCommunity: "\u793E\u533A",
  mcpStatusEnabled: "\u5DF2\u542F\u7528",
  mcpStatusDisabled: "\u5DF2\u7981\u7528",
  mcpAutostart: "\u81EA\u542F\u52A8",
  mcpAutostartTitle: "\u4F1A\u8BDD\u542F\u52A8\u65F6\u81EA\u52A8\u62C9\u8D77\u8BE5 MCP \u8FDB\u7A0B\uFF08\u5173\u95ED\u53EF\u8282\u7701\u5185\u5B58\uFF09",
  // 真实注册状态（mcp-client 桥接）
  mcpLiveNote: "\u4EE5\u4E0B\u4E3A DSH \u5B9E\u9645\u6CE8\u518C\u7684 MCP Server\xB7\u53F3\u4E0A\u5F00\u5173 = \u542F\u7528/\u7981\u7528\uFF08\u5B9E\u65F6\u751F\u6548\uFF09\xB7\u62A5 Session not found \u65F6\u5F00\u5173\u5207\u4E00\u6B21\uFF08\u7981\u2192\u542F\uFF09\u5373\u91CD\u8FDE\uFF0C\u65E0\u9700\u91CD\u542F DSH",
  mcpLiveDisabled: "\u5DF2\u7981\u7528",
  mcpLiveToggleFailed: "\u5207\u6362\u5931\u8D25\uFF08\u914D\u7F6E\u5199\u4FDD\u62A4\u6216\u6761\u76EE\u7F3A\u5931\uFF09",
  mcpLiveEmpty: "\u672A\u68C0\u6D4B\u5230\u5DF2\u6CE8\u518C\u7684 MCP Server\uFF1A\u5728 cordis.patch.yml \u6DFB\u52A0 mcp-client \u6761\u76EE\u5E76\u91CD\u542F DSH \u540E\u5373\u53EF",
  mcpLiveUnavailable: "\u72B6\u6001\u63A5\u53E3\u672A\u5C31\u7EEA\uFF08host \u6539\u52A8\u9700\u91CD\u542F DSH \u670D\u52A1\uFF09\uFF1A\u6865\u63A5\u5DE5\u5177\u4ECD\u53EF\u7528\uFF0C\u6B64\u9875\u6682\u65E0\u6CD5\u8BFB\u53D6\u6CE8\u518C\u8868",
  mcpLiveRegistered: "\u5DF2\u6CE8\u518C",
  mcpLiveRegisteredTitle: "\u5DF2\u6865\u63A5",
  mcpLiveToolsOf: "\u5DE5\u5177",
  mcpLiveRefresh: "\u5237\u65B0",
  mcpLiveConfigHint: "\u6DFB\u52A0\uFF1A\u7F16\u8F91 cordis.patch.yml\uFF08\u6216\u4F7F\u7528\u300C\u6DFB\u52A0 MCP Server\u300D\u751F\u6210\u914D\u7F6E\u7247\u6BB5\uFF09",
  mcpRemoveConfirmTitle: "\u79FB\u9664 MCP Server",
  mcpRemoveConfirmMsg: "\u5C06\u4ECE cordis.patch.yml \u4E2D\u5220\u9664\u300C{name}\u300D\u6761\u76EE\uFF0C\u5176\u5DE5\u5177\u968F\u5373\u6CE8\u9500\u4E14\u4E0D\u53EF\u6062\u590D\uFF1B\u5982\u9700\u6062\u590D\u8BF7\u91CD\u65B0\u6DFB\u52A0\u3002",
  mcpLiveRemoveFailed: "\u79FB\u9664\u5931\u8D25\uFF08\u914D\u7F6E\u5199\u4FDD\u62A4\u6216\u6761\u76EE\u7F3A\u5931\uFF09",
  mcpCopyDone: "\u5DF2\u590D\u5236 \u2713",
  mcpCopyHint: "\u5DF2\u590D\u5236\u914D\u7F6E\u7247\u6BB5\uFF0C\u8BF7\u7C98\u8D34\u5230 cordis.patch.yml \u540E\u91CD\u542F DSH \u751F\u6548",
  mcpLogNewNote: "\u6865\u63A5\u5F0F MCP\uFF08cordis.patch.yml \u914D\u7F6E\uFF09\u65E0\u672C\u5730\u8FDE\u63A5\u65E5\u5FD7\uFF1A\u8FDE\u63A5\u72B6\u6001\u4EE5\u300CMCP Server\u300D\u9875\u771F\u5B9E\u6CE8\u518C\u4E3A\u51C6\uFF1B\u6B64\u9875\u4EC5\u5C55\u793A\u65E7\u7248\u9762\u677F\u7684\u672C\u5730\u8BB0\u5F55\u3002",
  // 右侧信息栏（图三）
  mcpWhatTitle: "\u4EC0\u4E48\u662F MCP?",
  mcpWhatDesc: "MCP (Model Contest Protocol) \u662F\u4E00\u4E2A\u5F00\u653E\u534F\u8BAE\uFF0C\u5B83\u6807\u51C6\u5316\u4E86\u5E94\u7528\u7A0B\u5E8F\u5411 LLM \u63D0\u4F9B\u4E0A\u4E0B\u6587\u548C\u5DE5\u5177\u7684\u65B9\u5F0F\u3002",
  mcpPoint1: "\u6807\u51C6\u5316",
  mcpPoint1Desc: "\u7EDF\u4E00\u7684\u534F\u8BAE\u89C4\u8303",
  mcpPoint2: "\u5B89\u5168\u53EF\u63A7",
  mcpPoint2Desc: "\u6743\u9650\u7BA1\u7406\uFF0C\u5B89\u5168\u8BBF\u95EE",
  mcpPoint3: "\u53EF\u6269\u5C55",
  mcpPoint3Desc: "\u8F7B\u677E\u96C6\u6210\u65B0\u7684\u5DE5\u5177\u548C\u670D\u52A1",
  mcpPoint4: "\u4E92\u64CD\u4F5C",
  mcpPoint4Desc: "\u8DE8\u5E73\u53F0\u3001\u8DE8\u670D\u52A1\u517C\u5BB9",
  mcpHowTitle: "MCP \u5DE5\u4F5C\u539F\u7406",
  mcpAgent: "Agent",
  mcpClient: "MCP Client",
  mcpServerNode: "MCP Server",
  mcpReq: "\u8BF7\u6C42",
  mcpResp: "\u54CD\u5E94",
  mcpCall: "\u8C03\u7528",
  mcpExt: "\u5916\u90E8\u5DE5\u5177 / \u6570\u636E\u5E93 / \u51FD\u6570",
  mcpStartTitle: "\u5FEB\u901F\u4E0A\u624B",
  mcpStep1: "\u6DFB\u52A0 MCP Server",
  mcpStep1Desc: "\u914D\u7F6E\u6216\u5BFC\u5165 MCP Server \u8FDE\u63A5\u4FE1\u606F",
  mcpStep2: "\u6388\u6743\u4E0E\u914D\u7F6E",
  mcpStep2Desc: "\u8BBE\u7F6E\u8BBF\u95EE\u6743\u9650\u548C\u5FC5\u8981\u7684\u914D\u7F6E",
  mcpStep3: "\u4F7F\u7528\u4E0E\u4F18\u5316",
  mcpStep3Desc: "\u5728\u5BF9\u8BDD\u4E2D\u8C03\u7528 MCP \u5DE5\u5177\uFF0C\u6301\u7EED\u4F18\u5316\u914D\u7F6E",
  mcpIntroTitle: "MCP \u5FEB\u901F\u4E86\u89E3",
  mcpIntroDesc: "\u4E86\u89E3 MCP \u7684\u4F5C\u7528\u3001\u5DE5\u4F5C\u539F\u7406\u4E0E\u5FEB\u901F\u4E0A\u624B",
  mcpIntroBtn: "\u4E86\u89E3 MCP",
  mcpOverlayTitle: "\u4E86\u89E3 MCP",
  mcpNavTitle: "MCP",
  mcpComingDesc: "\u529F\u80FD\u5F00\u53D1\u4E2D\uFF0C\u656C\u8BF7\u671F\u5F85",
  // 分组行 / 更多菜单 / 分页
  nameAsc: "\u5347\u5E8F",
  nameDesc: "\u964D\u5E8F",
  moreActions: "\u66F4\u591A\u64CD\u4F5C",
  totalItems: "\u5171 {n} \u6761",
  pageSize: "{n} \u6761/\u9875",
  pagePrev: "\u4E0A\u4E00\u9875",
  pageNext: "\u4E0B\u4E00\u9875",
  // 空技能包 / 失效引用 / 操作反馈
  bundleEmptyTitle: "\u8FD9\u4E2A\u6280\u80FD\u5305\u8FD8\u662F\u7A7A\u7684",
  bundleEmptyHint: "\u4E0A\u4F20\u6280\u80FD\u65F6\u5728\u8FD9\u91CC\u9009\u5B83\u5F52\u7EC4\uFF0C\u6216\u4ECE\u6563\u88C5\u6280\u80FD\u5361\u7247\u70B9\u300C+\u300D\u5F52\u5165\u3002",
  bundleUploadHere: "\u4E0A\u4F20\u6280\u80FD\u5230\u6B64\u5305",
  bundleMissingN: "\u8D26\u672C\u91CC\u6709 {n} \u4E2A\u6280\u80FD\u5DF2\u4E0D\u5B58\u5728",
  bundlePrune: "\u6E05\u7406\u5931\u6548\u5F15\u7528",
  pruned: "\u5DF2\u6E05\u7406\u5931\u6548\u5F15\u7528",
  installedOk: "\u5DF2\u5B89\u88C5\u6280\u80FD\u300C{name}\u300D",
  deletedOk: "\u5DF2\u5220\u9664\u6280\u80FD\u300C{name}\u300D",
  removedOk: "\u5DF2\u4ECE\u6280\u80FD\u5305\u79FB\u51FA\u300C{name}\u300D",
  assignOk: "\u5DF2\u628A\u300C{name}\u300D\u5F52\u5165\u6280\u80FD\u5305",
  bundleCreated: "\u5DF2\u521B\u5EFA\u6280\u80FD\u5305\u300C{name}\u300D\uFF0C\u4E0A\u4F20\u6280\u80FD\u65F6\u53EF\u76F4\u63A5\u5F52\u5165\u5B83",
  bundleDeleted: "\u5DF2\u5220\u9664\u6280\u80FD\u5305\u300C{name}\u300D\uFF0C\u5176\u4E2D\u7684\u6280\u80FD\u53D8\u4E3A\u6563\u88C5",
  opFailed: "\u64CD\u4F5C\u5931\u8D25\uFF1A{label} \u2014 {message}",
  installNameRewrite: "SKILL.md \u91CC\u5199\u7684\u662F\u300C{meta}\u300D\uFF0C\u5B89\u88C5\u65F6\u4F1A\u7EDF\u4E00\u6539\u6210\u300C{name}\u300D\uFF08\u76EE\u5F55\u540D\u4E0E\u6280\u80FD\u540D\u4FDD\u6301\u4E00\u81F4\uFF09\u3002",
  deleteSkillDirNote: "\uFF08\u6280\u80FD\u76EE\u5F55\u300C{dir}\u300D\u4E0E\u6280\u80FD\u540D\u4E0D\u540C\uFF0C\u4F1A\u4E00\u5E76\u5220\u9664\uFF09",
  skillOffTag: "\u5DF2\u505C\u7528",
  presetCountTip: "\u8BE5\u9884\u8BBE\u4E0B\u5DF2\u542F\u7528 {n} \u4E2A / \u5171 {total} \u4E2A\u6280\u80FD"
};
function skillT(key, params) {
  let text = SKILL_ZH[key] ?? key;
  if (params) {
    for (const k of Object.keys(params)) text = text.split(`{${k}}`).join(String(params[k]));
  }
  return text;
}
function StatCubeIcon({ size = 20 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 3 20.4 7.4 12 11.8 3.6 7.4Z", fill: "#6C92FF" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 11.8 20.4 7.4v9.2L12 21Z", fill: "#2A55F2" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 11.8 3.6 7.4v9.2L12 21Z", fill: "#174BFC" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 3 20.4 7.4 12 11.8 3.6 7.4Z", fill: "none", stroke: "#FFFFFF", strokeWidth: "0.9", strokeLinejoin: "round", opacity: ".9" })
  ] });
}
function StatCheckCircleIcon({ size = 20 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "12", cy: "12", r: "9.4", fill: "#0FC566" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M7.9 12.3 10.7 15.1 16.2 9.2", fill: "none", stroke: "#FFFFFF", strokeWidth: "2.3", strokeLinecap: "round", strokeLinejoin: "round" })
  ] });
}
function StatSquareIcon({ size = 20 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "4.2", y: "4.2", width: "15.6", height: "15.6", rx: "3.2", fill: "#6C33F2" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M7.8 7.8h8.4v8.4H7.8Z", fill: "#FFFFFF", opacity: ".92" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M7.8 7.8h4.2v4.2H7.8ZM12 12h4.2v4.2H12Z", fill: "#6C33F2" })
  ] });
}
function StatHeartIcon({ size = 20 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 20.6C7.2 17.2 3.9 14 3.9 10.2 3.9 7.3 6.2 5.2 8.8 5.2c1.4 0 2.6.6 3.2 1.6.6-1 1.8-1.6 3.2-1.6 2.6 0 4.9 2.1 4.9 5 0 3.8-3.3 7-8.1 10.4z", fill: "#F4502A" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "8.9", cy: "9.3", r: "1.6", fill: "#FFFFFF", opacity: ".95" })
  ] });
}
function catStroke() {
  return { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
}
function CatAllIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "4", y: "4", width: "16", height: "16", rx: "4.5", fill: "currentColor" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M9.2 9.2h5.6v5.6H9.2Z", fill: "#FFFFFF", opacity: ".92" })
  ] });
}
function CloudUpIcon({ size = 18 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", ...catStroke(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M17.7 9.5A5.2 5.2 0 0 0 7.6 8.2 4 4 0 0 0 6.5 16h10.9a3.8 3.8 0 0 0 .5-7.6Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 17.5v-5M9.6 14.6 12 12.2l2.4 2.4" })
  ] });
}
function SortDirIcon({ dir, size = 12 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", ...catStroke(), children: dir === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 19V5M5.8 10.8 12 4.6l6.2 6.2" }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 5v14M5.8 13.2 12 19.4l6.2-6.2" }) });
}
function FolderBlueIcon({ size = 17 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M3.5 7.2a2.2 2.2 0 0 1 2.2-2.2h4l2 2.1h6.6a2.2 2.2 0 0 1 2.2 2.2v7.5a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2Z", fill: "var(--dsw-alias-state-business-primary,#3d6be5)" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M3.5 9.5h17v1.6a2.2 2.2 0 0 0-2.2-2.2H5.7a2.2 2.2 0 0 0-2.2 2Z", fill: "#FFFFFF", opacity: ".25" })
  ] });
}
function ArrowRightIcon({ size = 13 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", ...catStroke(), children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M5 12h14M13 6l6 6-6 6" }) });
}
function McpPlugIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "44", height: "44", viewBox: "0 0 24 24", "aria-hidden": "true", ...catStroke(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M7.5 4.5v3M16.5 4.5v3M6 7.5h12v2.5a6 6 0 0 1-6 6 6 6 0 0 1-6-6Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 16v4" })
  ] });
}
function GuideArtIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "150", height: "86", viewBox: "0 0 150 86", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("defs", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("linearGradient", { id: "skm-guide-book", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("stop", { offset: "0", stopColor: "#9DB7F7" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("stop", { offset: "1", stopColor: "#6E8FF0" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("linearGradient", { id: "skm-guide-page", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("stop", { offset: "0", stopColor: "#FFFFFF" }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("stop", { offset: "1", stopColor: "#D9E4FF" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M96 34 L141 52 L120 66 L78 50 Z", fill: "url(#skm-guide-page)", stroke: "#C7D6F7", strokeWidth: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M84 32 L50 52 L28 44 L64 26 Z", fill: "url(#skm-guide-page)", stroke: "#C7D6F7", strokeWidth: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M64 26 L96 34 L78 50 L50 52 Z", fill: "url(#skm-guide-book)", stroke: "var(--dsw-alias-state-business-primary,#5b82e5)", strokeWidth: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M50 52 L28 44 L30 56 L52 66 Z", fill: "#B7C9F5", stroke: "var(--dsw-alias-state-business-primary,#5b82e5)", strokeWidth: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M78 50 L120 66 L118 78 L76 62 Z", fill: "#A9BEF1", stroke: "var(--dsw-alias-state-business-primary,#5b82e5)", strokeWidth: "1" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "73", cy: "44", r: "9", fill: "#FFFFFF", opacity: ".85" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "73", cy: "44", r: "5.5", fill: "#6E8FF0" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M118 10c.6 2.6 1.6 3.6 4.2 4.2-2.6.6-3.6 1.6-4.2 4.2-.6-2.6-1.6-3.6-4.2-4.2 2.6-.6 3.6-1.6 4.2-4.2Z", fill: "#BCCFFF" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M126 26c.4 1.7 1 2.3 2.7 2.7-1.7.4-2.3 1-2.7 2.7-.4-1.7-1-2.3-2.7-2.7 1.7-.4 2.3-1 2.7-2.7Z", fill: "#C9D9FF" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "111", cy: "24", r: "2", fill: "#C9D9FF" })
  ] });
}
function CapIcon({ kind, size = 17 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true };
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "ui") {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { ...common, ...s, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "4", y: "4", width: "6.5", height: "6.5", rx: "1.4" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "13.5", y: "4", width: "6.5", height: "6.5", rx: "1.4" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "4", y: "13.5", width: "6.5", height: "6.5", rx: "1.4" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "13.5", y: "13.5", width: "6.5", height: "6.5", rx: "1.4" })
    ] });
  }
  if (kind === "code") {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { ...common, ...s, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M9 7.5 5.5 12 9 16.5M15 7.5 18.5 12 15 16.5" }) });
  }
  if (kind === "doc") {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { ...common, ...s, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M6.5 4.5h7l4 4v11h-11Z" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M13.5 4.5v4h4M9 13h6M9 16h4.5" })
    ] });
  }
  if (kind === "data") {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { ...common, ...s, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M5 19h14M7 16v-5M12 16V8M17 16v-8.5" }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { ...common, ...s, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) });
}
function GuidePanel({ t, onClose, left, top, height }) {
  const caps = [
    [t("guideCapUi"), "ui"],
    [t("guideCapCode"), "code"],
    [t("guideCapDoc"), "doc"],
    [t("guideCapData"), "data"],
    [t("guideCapTool"), "tool"]
  ];
  const steps = [
    [1, t("guideStep1"), t("guideStep1Desc")],
    [2, t("guideStep2"), t("guideStep2Desc")],
    [3, t("guideStep3"), t("guideStep3Desc")],
    [4, t("guideStep4"), t("guideStep4Desc")]
  ];
  const bests = [t("guideBest1"), t("guideBest2"), t("guideBest3"), t("guideBest4")];
  return (0, import_react_dom11.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
      "aside",
      {
        className: css3.guidePanel,
        role: "complementary",
        "aria-label": t("guidePanelTitle"),
        style: { left, top, height },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.guidePanelHead, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guidePanelLogo, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(GuideArtIconSmall, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guidePanelTitle, children: t("guidePanelTitle") }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.guidePanelClose, "aria-label": t("guideClose"), onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconCloseOutline16, { size: 14, "aria-hidden": "true" }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.guidePanelBody, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.guideSec, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.guideSecHead, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guideSecIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconSkillOutline16, { size: 14, "aria-hidden": "true" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guideSecTitle, children: t("guideWhat") })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.guideWhatDesc, children: t("guideWhatDesc") }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.guideCaps, children: caps.map(([label, kind]) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.guideCap, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guideCapIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CapIcon, { kind }) }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guideCapLabel, children: label })
              ] }, label)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("section", { className: css3.guideSec, children: steps.map(([num, title, desc]) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.guideStep, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guideStepNum, children: num }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.guideStepBody, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.guideStepTitleRow, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guideStepTitle, children: title }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconChevronRightOutline14, { className: css3.guideStepArrow, size: 12, "aria-hidden": "true" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.guideStepDesc, children: desc })
              ] })
            ] }, num)) }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.guideBest, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.guideBestTitle, children: t("guideBest") }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { className: css3.guideBestList, children: bests.map((item) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { className: css3.guideBestItem, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CheckIcon, {}),
                item
              ] }, item)) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("button", { type: "button", className: css3.guideMoreBtn, onClick: onClose, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { children: t("guideMoreBest") }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(ArrowRightIcon, { size: 12 })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.guideBestArt, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(GuideArtIcon, {}) })
            ] })
          ] })
        ]
      }
    ),
    document.body
  );
}
function McpServerMenuIcon({ size = 15 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", ...catStroke(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "4", y: "4", width: "16", height: "5.5", rx: "1.6" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "4", y: "13.5", width: "16", height: "5.5", rx: "1.6" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M7.2 6.8h.01M7.2 16.3h.01", strokeWidth: "2.4" })
  ] });
}
function McpConfigIcon({ size = 15 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", ...catStroke(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M5 8h14M5 16h14" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "9.5", cy: "8", r: "2", fill: "var(--dsw-alias-bg-base,#fff)" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "15", cy: "16", r: "2", fill: "var(--dsw-alias-bg-base,#fff)" })
  ] });
}
function McpView({ t, tab, onTab, onOpenInfo, servers, recommended, logs, onAdd, live, onAddCustom, onClearLogs, onRefresh, onLogged }) {
  const navServerCount = live.state === "ready" ? live.data.serverCount : 0;
  void servers;
  const items = [
    ["server", t("mcpServer"), /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpServerMenuIcon, { size: 15 })],
    ["tools", t("mcpTools"), /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CapIcon, { kind: "tool", size: 15 })],
    ["log", t("mcpLog"), /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CapIcon, { kind: "doc", size: 15 })],
    ["config", t("mcpConfig"), /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpConfigIcon, { size: 15 })]
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpViewRoot, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("aside", { className: css3.mcpSide, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.catTitle, children: t("mcpNavTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.catList, role: "group", "aria-label": "MCP", children: items.map(([value, label, icon]) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
        "button",
        {
          type: "button",
          className: `${css3.catItem} ${tab === value ? css3.catItemActive : ""}`,
          "data-active": tab === value || void 0,
          onClick: () => {
            onTab(value);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catIcon, "data-active": tab === value || void 0, children: icon }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catLabel, children: label }),
            value === "server" && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catCount, children: navServerCount })
          ]
        },
        value
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
        "section",
        {
          className: css3.mcpIntroCard,
          role: "button",
          tabIndex: 0,
          onClick: onOpenInfo,
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenInfo();
            }
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpIntroTitle, children: t("mcpIntroTitle") }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpIntroDesc, children: t("mcpIntroDesc") }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
              "button",
              {
                type: "button",
                className: css3.mcpIntroBtn,
                onClick: (event) => {
                  event.stopPropagation();
                  onOpenInfo();
                },
                children: [
                  t("mcpIntroBtn"),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(ArrowRightIcon, { size: 12 })
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpMain, children: tab === "server" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpServerView, { t, live, onAddCustom, onOpenInfo, onRefresh, onLogged }) : tab === "tools" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpToolsView, { t, live }) : tab === "log" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpLogsView, { t, logs, onClear: onClearLogs }) : tab === "config" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpConfigView, { t }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpEmpty, role: "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpEmptyIcon, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpPlugIcon, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpEmptyDesc, children: t("mcpComingDesc") })
    ] }) })
  ] });
}
var FALLBACK_RECOMMENDED = [
  { id: "filesystem", name: "Filesystem MCP", description: "\u63D0\u4F9B\u5B89\u5168\u7684\u6587\u4EF6\u7CFB\u7EDF\u8BBF\u95EE\u80FD\u529B\uFF0C\u652F\u6301\u8BFB\u53D6\u3001\u5199\u5165\u3001\u641C\u7D22\u6587\u4EF6\u3002", tag: "official", category: "\u6587\u4EF6", enabled: false, autostart: false, source: "recommended" },
  { id: "websearch", name: "Web Search MCP", description: "\u96C6\u6210\u7F51\u7EDC\u641C\u7D22\u80FD\u529B\uFF0C\u83B7\u53D6\u5B9E\u65F6\u4FE1\u606F\u548C\u7F51\u9875\u5185\u5BB9\u3002", tag: "official", category: "\u641C\u7D22", enabled: false, autostart: false, source: "recommended" },
  { id: "github", name: "GitHub MCP", description: "\u8BBF\u95EE GitHub \u4ED3\u5E93\u3001Issue\u3001\u7BA1\u7406\u4EE3\u7801\u3001Pull Request \u7B49\u3002", tag: "official", category: "\u5F00\u53D1", enabled: false, autostart: false, source: "recommended" },
  { id: "database", name: "Database MCP", description: "\u8FDE\u63A5\u5E76\u67E5\u8BE2\u591A\u79CD\u6570\u636E\u5E93\uFF0C\u652F\u6301 SQL \u6267\u884C\u548C\u6570\u636E\u5206\u6790\u3002", tag: "community", category: "\u6570\u636E", enabled: false, autostart: false, source: "recommended" },
  { id: "slack", name: "Slack MCP", description: "\u4E0E Slack \u5DE5\u4F5C\u533A\u96C6\u6210\uFF0C\u53D1\u9001\u6D88\u606F\u3001\u8BFB\u53D6\u9891\u9053\u548C\u7BA1\u7406\u901A\u77E5\u3002", tag: "community", category: "\u534F\u4F5C", enabled: false, autostart: false, source: "recommended" }
];
var MCP_STORAGE_KEY = "dsh.triad.mcpServers";
var MCP_LOG_KEY = "dsh.triad.mcpLogs";
function useMcpLiveState() {
  const [status, setStatus] = (0, import_react29.useState)({ state: "loading", data: null });
  const load = () => {
    setStatus((current) => current.state === "ready" ? current : { state: "loading", data: null });
    void fetch("/api/triad/mcp-status", { headers: { accept: "application/json" } }).then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    }).then((body) => {
      if (typeof body !== "object" || body === null || !Array.isArray(body.servers)) throw new Error("bad shape");
      const data = body;
      setStatus({ state: "ready", data });
    }).catch(() => {
      setStatus({ state: "unavailable", data: null });
    });
  };
  (0, import_react29.useEffect)(() => {
    load();
  }, []);
  return [status, load];
}
function mcpConfigureSnippet(name, type, command, url) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "mcp-server";
  if (type === "http" || type === "sse") {
    return `# ${name}
- insert:
    - id: mcp-${slug}
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ${slug}
        transport: streamable-http
        url: ${JSON.stringify(url)}
        failOnStartupError: false
`;
  }
  return `# ${name}
- insert:
    - id: mcp-${slug}
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ${slug}
        transport: stdio
        command: ${JSON.stringify(command)}
        cwd: !!js process.cwd()
        failOnStartupError: false
`;
}
function loadStoredLogs() {
  try {
    const raw = localStorage.getItem(MCP_LOG_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row) => typeof row === "object" && row !== null && typeof row.time === "number");
  } catch {
    return [];
  }
}
function saveStoredLogs(rows) {
  try {
    localStorage.setItem(MCP_LOG_KEY, JSON.stringify(rows));
  } catch {
  }
}
function loadStoredMcps() {
  try {
    const raw = localStorage.getItem(MCP_STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row) => typeof row === "object" && row !== null && typeof row.name === "string").map((row) => ({ ...row, autostart: row.autostart !== false }));
  } catch {
    return [];
  }
}
function saveStoredMcps(rows) {
  try {
    localStorage.setItem(MCP_STORAGE_KEY, JSON.stringify(rows));
  } catch {
  }
}
function McpLogoIcon({ kind }) {
  if (kind === "db") {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", "aria-hidden": "true", ...catStroke(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ellipse", { cx: "12", cy: "6", rx: "8", ry: "3.2" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M4 6v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" })
    ] });
  }
  if (kind === "globe") {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", "aria-hidden": "true", ...catStroke(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "12", cy: "12", r: "8.4" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M3.6 12h16.8M12 3.6c2.9 2.7 2.9 14.1 0 16.8-2.9-2.7-2.9-14.1 0-16.8Z" })
    ] });
  }
  if (kind === "github") {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M9.2 3.4 8 5.8l2.4 1.2-2.4 1.2 1.2 2.4 2.4-1.2 1.2 2.4 1.2-2.4 2.4 1.2M9.2 3.4l1.2 2.4M9.2 3.4 8 5.8", fill: "none", stroke: "#36C5F0", strokeWidth: "1.7", strokeLinecap: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M14.6 20.6 13.4 18.2l-2.4 1.2M14.6 20.6l1.2-2.4M14.6 20.6l-1.2-2.4", fill: "none", stroke: "#2EB67D", strokeWidth: "1.7", strokeLinecap: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M3.4 14.8 5.8 16l-1.2 2.4 2.4-1.2 1.2 2.4 1.2-2.4 2.3 1.3M3.4 14.8l2.4 1.2", fill: "none", stroke: "#E01E5A", strokeWidth: "1.7", strokeLinecap: "round", transform: "rotate(180 8 16.6)" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M20.6 9.2 18.2 8l1.3-2.4-2.5 1.3-1.2-2.4-1.2 2.4-2.4-1.3M20.6 9.2l-2.4-1.2", fill: "none", stroke: "#ECB22E", strokeWidth: "1.7", strokeLinecap: "round", transform: "rotate(180 16 7.4)" })
  ] });
}
function McpBellIcon({ size = 17 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M13.7 21a2 2 0 0 1-3.4 0" })
  ] });
}
function McpAddModal({ t, open, onClose }) {
  const [name, setName] = (0, import_react29.useState)("");
  const [desc, setDesc] = (0, import_react29.useState)("");
  const [type, setType] = (0, import_react29.useState)("stdio");
  const [command, setCommand] = (0, import_react29.useState)("");
  const [url, setUrl] = (0, import_react29.useState)("");
  const [copied, setCopied] = (0, import_react29.useState)(false);
  const trimmed = name.trim();
  const valid = trimmed !== "" && (type === "stdio" ? command.trim() !== "" : url.trim() !== "");
  const submit = (event) => {
    event.preventDefault();
    if (!valid) return;
    const snippet = mcpConfigureSnippet(trimmed, type, command.trim(), url.trim());
    void navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
    }, () => {
    });
    setDesc("");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Modal, { open, onClose, closeLabel: t("close"), title: t("mcpAddModalTitle"), children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("form", { className: css3.mcpAddForm, onSubmit: submit, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.installRow, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
      "input",
      {
        className: css3.inlineInput,
        value: name,
        placeholder: t("mcpAddNamePlaceholder"),
        "aria-label": t("mcpAddName"),
        autoFocus: true,
        onChange: (event) => {
          setName(event.currentTarget.value);
        }
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.installRow, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
      "input",
      {
        className: css3.inlineInput,
        value: desc,
        placeholder: t("mcpAddDescPlaceholder"),
        "aria-label": t("mcpAddDesc"),
        onChange: (event) => {
          setDesc(event.currentTarget.value);
        }
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.installRow, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpAddTypeRow, role: "group", "aria-label": t("mcpAddType"), children: ["stdio", "http", "sse"].map((value) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
      "button",
      {
        type: "button",
        className: `${css3.mcpAddTypeBtn} ${type === value ? css3.mcpAddTypeActive : ""}`,
        "data-active": type === value || void 0,
        "aria-pressed": type === value,
        onClick: () => {
          setType(value);
        },
        children: value.toUpperCase()
      },
      value
    )) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.installRow, children: type === "stdio" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
      "input",
      {
        className: css3.inlineInput,
        value: command,
        placeholder: t("mcpAddCommandPlaceholder"),
        "aria-label": t("mcpAddCommand"),
        onChange: (event) => {
          setCommand(event.currentTarget.value);
        }
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
      "input",
      {
        className: css3.inlineInput,
        value: url,
        placeholder: t("mcpAddUrlPlaceholder"),
        "aria-label": t("mcpAddUrl"),
        onChange: (event) => {
          setUrl(event.currentTarget.value);
        }
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.installActions, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "primary", type: "submit", disabled: !valid, children: t("mcpAddConfirm") }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "outline", type: "button", onClick: onClose, children: t("cancel") })
    ] }),
    copied && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpCopyHint, role: "status", children: t("mcpCopyHint") })
  ] }) });
}
function McpToolsView({ t, live }) {
  const [q, setQ] = (0, import_react29.useState)("");
  const tools = [];
  if (live.state === "ready") {
    for (const server of live.data.servers) {
      for (const tool of server.tools) tools.push({ name: tool.name, server: server.serverName, desc: tool.description });
    }
  }
  const ql = q.trim().toLowerCase();
  const filtered = tools.filter((item) => ql === "" || item.name.toLowerCase().includes(ql) || item.server.toLowerCase().includes(ql) || item.desc.toLowerCase().includes(ql));
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpServerMain, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpRecHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRecommendTitle, children: t("mcpToolsTitle", { n: tools.length }) }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpToolSearch, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SearchIcon, {}),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          "input",
          {
            className: css3.mcpToolSearchInput,
            value: q,
            placeholder: t("mcpToolsSearch"),
            "aria-label": t("mcpToolsSearch"),
            onChange: (event) => {
              setQ(event.currentTarget.value);
            }
          }
        )
      ] })
    ] }),
    live.state === "unavailable" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpEmptyList, children: t("mcpLiveUnavailable") }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpEmptyList, children: tools.length === 0 ? t("mcpLiveEmpty") : t("noMatch") }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("section", { className: css3.mcpListCard, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { className: css3.mcpList, children: filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { className: css3.mcpRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRowLogo, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconCodeOutline16, { size: 16 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpRowBody, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpRowNameRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRowName, style: { fontFamily: "ui-monospace,monospace", fontSize: 12.5 }, children: item.name }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRecCatTag, children: item.server })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRowDesc, children: item.desc })
      ] })
    ] }, `${item.server}-${item.name}`)) }) })
  ] });
}
function McpLogsView({ t, logs, onClear }) {
  const kindMeta = {
    add: t("mcpLogAdd"),
    enable: t("mcpLogEnable"),
    disable: t("mcpLogDisable"),
    remove: t("mcpLogRemove")
  };
  const fmt = (time) => {
    const d = new Date(time);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpServerMain, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpRecHead, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRecommendTitle, children: t("mcpLogTitle") }),
      logs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.mcpLogClear, onClick: onClear, children: t("mcpLogClear") })
    ] }),
    logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpEmptyList, children: logs.length === 0 ? t("mcpLogNewNote") : t("mcpLogEmpty") }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("section", { className: css3.mcpListCard, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { className: css3.mcpList, children: [...logs].reverse().map((entry) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { className: css3.mcpLogRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpLogDot, "data-kind": entry.kind, "aria-hidden": "true" }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpLogBody, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpLogText, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("strong", { children: entry.name }),
          " \xB7 ",
          kindMeta[entry.kind]
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRowDesc, children: fmt(entry.time) })
      ] })
    ] }, entry.id)) }) })
  ] });
}
function McpConfigView({ t }) {
  const [copied, setCopied] = (0, import_react29.useState)(null);
  const templates = [
    {
      id: "stdio",
      title: "stdio",
      json: JSON.stringify({ type: "stdio", command: "npx -y @modelcontextprotocol/server-filesystem", args: ["/path/to/dir"], env: {} }, null, 2)
    },
    {
      id: "http",
      title: "http",
      json: JSON.stringify({ type: "http", url: "https://example.com/mcp", headers: { authorization: "Bearer <token>" } }, null, 2)
    },
    {
      id: "sse",
      title: "sse",
      json: JSON.stringify({ type: "sse", url: "https://example.com/sse", headers: {} }, null, 2)
    }
  ];
  const copy = async (id, text) => {
    try {
      if (navigator.clipboard !== void 0) await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => {
        setCopied((current) => current === id ? null : current);
      }, 1400);
    } catch {
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpServerMain, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpRecHead, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRecommendTitle, children: t("mcpConfigTitle") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpConfigGrid, children: templates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.mcpConfigCard, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpConfigHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpConfigTitle, children: item.title }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.mcpConfigCopy, onClick: () => {
          void copy(item.id, item.json);
        }, children: copied === item.id ? `${t("copied")} \u2713` : t("mcpConfigCopy") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("pre", { className: css3.mcpConfigCode, children: item.json })
    ] }, item.id)) })
  ] });
}
function McpServerView({ t, live, onAddCustom, onOpenInfo, onRefresh, onLogged }) {
  const ready = live.state === "ready" ? live.data : null;
  const serverCount = ready?.serverCount ?? 0;
  const toolCount = ready?.toolCount ?? 0;
  const [toggling, setToggling] = (0, import_react29.useState)(null);
  const [toggleError, setToggleError] = (0, import_react29.useState)(null);
  const toggleServer = (server) => {
    if (toggling !== null || !server.config.editable) return;
    setToggling(server.serverName);
    setToggleError(null);
    void fetch("/api/triad/mcp-config", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ serverName: server.serverName, disabled: !server.config.disabled })
    }).then((response) => response.json().catch(() => null)).then((body) => {
      if (typeof body !== "object" || body === null || body.ok !== true) {
        setToggleError(server.serverName);
        return;
      }
      onRefresh();
    }).catch(() => {
      setToggleError(server.serverName);
    }).finally(() => {
      setToggling(null);
    });
  };
  const [removeReq, setRemoveReq] = (0, import_react29.useState)(null);
  const [removing, setRemoving] = (0, import_react29.useState)(false);
  const [removeError, setRemoveError] = (0, import_react29.useState)(null);
  const removeServer = (server) => {
    if (removing) return;
    setRemoving(true);
    setRemoveError(null);
    void fetch("/api/triad/mcp-config", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ serverName: server.serverName, action: "remove" })
    }).then((response) => response.json().catch(() => null)).then((body) => {
      if (typeof body !== "object" || body === null || body.ok !== true) {
        setRemoveError(server.serverName);
        return;
      }
      onLogged("remove", server.serverName);
      onRefresh();
    }).catch(() => {
      setRemoveError(server.serverName);
    }).finally(() => {
      setRemoving(false);
    });
  };
  const stats = [
    { tone: "blue", icon: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(StatCubeIcon, { size: 20 }), title: t("mcpStatTotal"), value: serverCount, desc: t("mcpStatTotalDesc") },
    { tone: "green", icon: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(StatCheckCircleIcon, { size: 20 }), title: t("mcpLiveRegisteredTitle"), value: serverCount, desc: t("mcpLiveRegistered") },
    { tone: "violet", icon: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(StatSquareIcon, { size: 20 }), title: t("mcpStatTools"), value: toolCount, desc: t("mcpStatToolsDesc") }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpServerMain, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("header", { className: css3.mcpHeader, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpHeaderText, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpHeaderTitleRow, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpHeaderTitle, children: t("mcpTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpHeaderBadge, children: t("mcpProtocol") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpHeaderSub, children: t("mcpSubtitle") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpHeaderActions, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.mcpMarketBtn, onClick: onRefresh, title: t("mcpLiveRefresh"), children: t("mcpLiveRefresh") }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("button", { type: "button", className: css3.mcpAddBtn, onClick: onAddCustom, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconPlusOutline16, { size: 14, "aria-hidden": "true" }),
          "\xA0",
          t("mcpAddServer")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.mcpBellBtn, "aria-label": t("notifications"), children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpBellIcon, { size: 17 }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpEmptyList, children: t("mcpLiveNote") }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.statsRow, "data-mcp": "true", children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.stat, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statIconCol, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statIcon, "data-tone": stat.tone, children: stat.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("i", { className: css3.statGlow, "data-tone": stat.tone, "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statBody, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statLabel, children: stat.title }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValueRow, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValue, children: stat.value }) }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statDesc, children: stat.desc })
      ] })
    ] }, stat.title)) }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.mcpListCard, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpListHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpListTitle, children: t("mcpListTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpListCount, children: serverCount })
      ] }),
      live.state === "unavailable" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpEmptyList, children: t("mcpLiveUnavailable") }) : serverCount === 0 ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpEmptyList, children: t("mcpLiveEmpty") }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpRecGrid, children: ready?.servers.map((server) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.mcpRecCard, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpRecCardHead, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRowLogo, "data-kind": "live", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpLogoIcon, { kind: "github" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpRecCardTitleRow, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRecCardName, children: server.serverName }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpRecCardTags, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpRecCatTag, children: server.config.disabled ? t("mcpLiveDisabled") : t("mcpLiveRegistered") }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpRecCatTag, children: [
                server.toolCount,
                " ",
                t("mcpLiveToolsOf")
              ] })
            ] })
          ] }),
          server.config.editable ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Tooltip, { label: server.config.disabled ? t("enableSkill") : t("mcpLiveDisabled"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": !server.config.disabled,
              "aria-label": server.config.disabled ? t("enableSkill") : t("mcpLiveDisabled"),
              title: server.config.disabled ? t("enableSkill") : t("mcpLiveDisabled"),
              className: `${css3.toggle} ${server.config.disabled ? css3.toggleOff : css3.toggleOn}`,
              disabled: toggling === server.serverName,
              onClick: () => {
                toggleServer(server);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.toggleKnob, "aria-hidden": "true" })
            }
          ) }) : null
        ] }),
        server.config.disabled ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { className: css3.mcpRecCardDesc, children: [
          t("mcpLiveDisabled"),
          " \xB7 \u5DE5\u5177\u4E0D\u53EF\u7528"
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("p", { className: css3.mcpRecCardDesc, children: [
          server.tools.slice(0, 6).map((tool) => tool.name.replace(/^mcp__[^_]+__/, "")).join(" \xB7 "),
          server.toolCount > 6 ? ` \xB7 +${server.toolCount - 6}` : ""
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpCardFoot, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpCardItem, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpCardItemLabel, children: removeError === server.serverName ? t("mcpLiveRemoveFailed") : toggleError === server.serverName ? t("mcpLiveToggleFailed") : t("mcpLiveConfigHint") }) }),
          server.config.editable ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
            "button",
            {
              type: "button",
              className: css3.mcpCardDelete,
              title: t("mcpRemove"),
              disabled: removing,
              onClick: () => {
                setRemoveError(null);
                setRemoveReq(server);
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconTrashOutline16, { size: 13, "aria-hidden": "true" }),
                t("mcpRemove")
              ]
            }
          ) : null
        ] })
      ] }, server.serverName)) ?? null })
    ] }),
    removeReq !== null && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
      ConfirmDialog,
      {
        open: true,
        title: t("mcpRemoveConfirmTitle"),
        message: t("mcpRemoveConfirmMsg", { name: removeReq.serverName }),
        confirmLabel: t("mcpRemove"),
        cancelLabel: t("cancel"),
        danger: true,
        onConfirm: () => {
          removeServer(removeReq);
        },
        onClose: () => {
          setRemoveReq(null);
        }
      }
    )
  ] });
}
function McpInfoOverlay({ t, onClose, left, top, height }) {
  const points = [
    [t("mcpPoint1"), t("mcpPoint1Desc")],
    [t("mcpPoint2"), t("mcpPoint2Desc")],
    [t("mcpPoint3"), t("mcpPoint3Desc")],
    [t("mcpPoint4"), t("mcpPoint4Desc")]
  ];
  const steps = [
    [1, t("mcpStep1"), t("mcpStep1Desc")],
    [2, t("mcpStep2"), t("mcpStep2Desc")],
    [3, t("mcpStep3"), t("mcpStep3Desc")]
  ];
  return (0, import_react_dom11.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("aside", { className: css3.mcpInfoOverlay, role: "complementary", "aria-label": t("mcpOverlayTitle"), style: { left, top, height }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpInfoOverlayHead, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpInfoOverlayIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpServerMenuIcon, { size: 15 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpInfoOverlayTitle, children: t("mcpOverlayTitle") }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.guidePanelClose, "aria-label": t("close"), onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconCloseOutline16, { size: 14, "aria-hidden": "true" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpInfoOverlayBody, children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.mcpInfoCard, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpInfoCardTitle, children: t("mcpWhatTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.mcpInfoDesc, children: t("mcpWhatDesc") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { className: css3.mcpInfoPoints, children: points.map(([title, desc]) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { className: css3.mcpPoint, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpPointIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconSkillOutline16, { size: 13, "aria-hidden": "true" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpPointBody, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpPointTitle, children: title }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpPointDesc, children: desc })
            ] })
          ] }, title)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.mcpInfoCard, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpInfoCardTitle, children: t("mcpHowTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpFlow, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpFlowNode, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconAgentPresetOutline16, { size: 16 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowLabel, children: t("mcpAgent") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpFlowArrow, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowArrowText, children: t("mcpReq") }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { width: "22", height: "10", viewBox: "0 0 22 10", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M0 5h19M15 1l5 4-5 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpFlowNode, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowIcon, "data-client": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconAgentPresetOutline16, { size: 16 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowLabel, children: t("mcpClient") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpFlowArrow, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowArrowText, children: t("mcpCall") }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { width: "22", height: "10", viewBox: "0 0 22 10", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M0 5h19M15 1l5 4-5 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpFlowNode, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowIcon, "data-server": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconDataOutline16, { size: 16 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowLabel, children: t("mcpServerNode") })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpFlowExt, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowExtLabel, children: t("mcpExt") }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.mcpFlowExtIcons, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowExtIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpLogoIcon, { kind: "db" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowExtIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpLogoIcon, { kind: "globe" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowExtIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconCodeOutline16, { size: 16 }) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpFlowExtIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpApiText, children: "API" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.mcpInfoCard, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.mcpInfoCardTitle, children: t("mcpStartTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ol", { className: css3.mcpSteps, children: steps.map(([num, title, desc]) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { className: css3.mcpStep, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpStepNum, children: num }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.mcpStepBody, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpStepTitle, children: title }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.mcpStepDesc, children: desc })
            ] })
          ] }, num)) })
        ] })
      ] })
    ] }),
    document.body
  );
}
function GuideArtIconSmall() {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "1.5", y: "2", width: "13", height: "12", rx: "2.5", fill: "var(--dsw-alias-state-business-primary,#3d6be5)" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M4.5 5h7M4.5 8h7M4.5 11h4.5", stroke: "#FFFFFF", strokeWidth: "1.3", strokeLinecap: "round" })
  ] });
}
var SKILL_API_BASE = "/api/skill-manager";
async function skillRequest(path, options) {
  const response = await fetch(SKILL_API_BASE + path, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "request failed (" + String(response.status) + ")");
  return body;
}
var skillApi = {
  list: () => skillRequest("/list", { headers: { accept: "application/json" } }),
  toggleStatus: () => fetch("/api/skill-toggles/status", { headers: { accept: "application/json" } }).then((response) => response.json()).then((body) => {
    if (typeof body !== "object" || body === null || body.skills === void 0) {
      throw new Error("toggle status unavailable");
    }
    return body;
  }),
  setSkillEnabled: (name, enabled) => fetch(`/api/skill-toggles/skills/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ enabled })
  }).then((response) => response.json()).then((body) => {
    if (!body.ok) throw new Error(body.error || "toggle failed");
    return body;
  }),
  setBundleEnabled: (bundleId, enabled) => fetch(`/api/skill-toggles/bundles/${encodeURIComponent(bundleId)}`, {
    method: "PUT",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ enabled })
  }).then((response) => response.json()).then((body) => {
    if (!body.ok) throw new Error(body.error || "toggle failed");
    return body;
  }),
  /** 预设名单 + 各预设覆盖 + 全局层状态(一次拉齐)。 */
  presetStatus: () => fetch("/api/skill-toggles/presets", { headers: { accept: "application/json" } }).then((response) => response.json()).then((body) => {
    if (typeof body !== "object" || body === null || !Array.isArray(body.presets)) {
      throw new Error("preset status unavailable");
    }
    return body;
  }),
  setPresetSkillEnabled: (presetId, name, enabled) => fetch(`/api/skill-toggles/presets/${encodeURIComponent(presetId)}/skills/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ enabled })
  }).then((response) => response.json()).then((body) => {
    if (!body.ok) throw new Error(body.error || "toggle failed");
    return body;
  }),
  setPresetBundleEnabled: (presetId, bundleId, enabled) => fetch(`/api/skill-toggles/presets/${encodeURIComponent(presetId)}/bundles/${encodeURIComponent(bundleId)}`, {
    method: "PUT",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ enabled })
  }).then((response) => response.json()).then((body) => {
    if (!body.ok) throw new Error(body.error || "toggle failed");
    return body;
  }),
  resetPreset: (presetId) => fetch(`/api/skill-toggles/presets/${encodeURIComponent(presetId)}/reset`, {
    method: "POST",
    headers: { accept: "application/json" }
  }).then((response) => response.json()).then((body) => {
    if (!body.ok) throw new Error(body.error || "reset failed");
    return body;
  }),
  createBundle: (name) => skillRequest("/bundles", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ name }) }),
  renameBundle: (bundleId, name) => skillRequest(`/bundles/${encodeURIComponent(bundleId)}`, { method: "PATCH", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ name }) }),
  deleteBundle: (bundleId) => skillRequest(`/bundles/${encodeURIComponent(bundleId)}`, { method: "DELETE", headers: { accept: "application/json" } }),
  setBundleSkills: (bundleId, skillNames) => skillRequest(`/bundles/${encodeURIComponent(bundleId)}/skills`, { method: "PUT", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ skillNames }) }),
  deleteSkill: (name) => skillRequest(`/skills/${encodeURIComponent(name)}`, { method: "DELETE", headers: { accept: "application/json" } }),
  installSkill: (input) => skillRequest("/skills", { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify(input) }),
  /** 技能目录健康检查：只读扫描（缺 SKILL.md / frontmatter 无效 / 名称不一致 / 账本悬挂引用）。 */
  health: () => fetch("/api/skill-health", { headers: { accept: "application/json" } }).then((response) => response.json()).then((body) => {
    if (typeof body !== "object" || body === null || !Array.isArray(body.issues)) {
      throw new Error("health unavailable");
    }
    return body;
  })
};
var css3 = {
  entry: "skm-entry",
  label: "skm-label",
  // SKILL / MCP 顶层 tab + MCP 占位
  kindTabs: "skm-kind-tabs",
  kindTab: "skm-kind-tab",
  kindTabActive: "skm-kind-tab-active",
  mcpEmpty: "skm-mcp-empty",
  mcpEmptyIcon: "skm-mcp-empty-icon",
  mcpEmptyTitle: "skm-mcp-empty-title",
  mcpEmptyDesc: "skm-mcp-empty-desc",
  mcpPage: "skm-mcp-view-root",
  mcpViewRoot: "skm-mcp-view-root",
  mcpSide: "skm-mcp-side",
  mcpMain: "skm-mcp-main",
  mcpServerLayout: "skm-mcp-server-layout",
  mcpServerMain: "skm-mcp-server-main",
  mcpHeader: "skm-mcp-header",
  mcpHeaderText: "skm-mcp-header-text",
  mcpHeaderTitleRow: "skm-mcp-header-title-row",
  mcpHeaderTitle: "skm-mcp-header-title",
  mcpHeaderBadge: "skm-mcp-header-badge",
  mcpHeaderSub: "skm-mcp-header-sub",
  mcpHeaderActions: "skm-mcp-header-actions",
  mcpMarketBtn: "skm-mcp-market-btn",
  mcpAddBtn: "skm-mcp-add-btn",
  mcpBellBtn: "skm-mcp-bell-btn",
  mcpListCard: "skm-mcp-list-card",
  mcpListHead: "skm-mcp-list-head",
  mcpListTitle: "skm-mcp-list-title",
  mcpListCount: "skm-mcp-list-count",
  mcpList: "skm-mcp-list",
  mcpEmptyList: "skm-mcp-empty-list",
  mcpCopyHint: "skm-mcp-copy-hint",
  mcpIntroCard: "skm-mcp-intro-card",
  mcpIntroBody: "skm-mcp-intro-body",
  mcpIntroTitle: "skm-mcp-intro-title",
  mcpIntroDesc: "skm-mcp-intro-desc",
  mcpIntroBtn: "skm-mcp-intro-btn",
  mcpInfoOverlay: "skm-mcp-info-overlay",
  mcpInfoOverlayHead: "skm-mcp-info-overlay-head",
  mcpInfoOverlayIcon: "skm-mcp-info-overlay-icon",
  mcpInfoOverlayTitle: "skm-mcp-info-overlay-title",
  mcpInfoOverlayBody: "skm-mcp-info-overlay-body",
  mcpRow: "skm-mcp-row",
  mcpRowLogo: "skm-mcp-row-logo",
  mcpRowBody: "skm-mcp-row-body",
  mcpRowNameRow: "skm-mcp-row-name-row",
  mcpRowName: "skm-mcp-row-name",
  mcpRowTag: "skm-mcp-row-tag",
  mcpRowExt: "skm-mcp-row-ext",
  mcpRowDesc: "skm-mcp-row-desc",
  mcpRowStatus: "skm-mcp-row-status",
  mcpViewAll: "skm-mcp-view-all",
  mcpAddSmallBtn: "skm-mcp-add-small-btn",
  mcpRecommendTitle: "skm-mcp-recommend-title",
  mcpRecHead: "skm-mcp-rec-head",
  mcpRecCatsRow: "skm-mcp-rec-cats-row",
  mcpRecResultsTitle: "skm-mcp-rec-results-title",
  mcpRecStars: "skm-mcp-rec-stars",
  mcpOpenLink: "skm-mcp-open-link",
  mcpRecCardExternal: "skm-mcp-rec-card-external",
  mcpResolveErr: "skm-mcp-resolve-err",
  mcpExtActions: "skm-mcp-ext-actions",
  mcpCardFoot: "skm-mcp-card-foot",
  mcpCardItem: "skm-mcp-card-item",
  mcpCardItemLabel: "skm-mcp-card-item-label",
  mcpCardItemMeta: "skm-mcp-card-item-meta",
  mcpCardDelete: "skm-mcp-card-delete",
  mcpRecCats: "skm-mcp-rec-cats",
  mcpRecCat: "skm-mcp-rec-cat",
  mcpRecCatActive: "skm-mcp-rec-cat-active",
  mcpRecGrid: "skm-mcp-rec-grid",
  mcpRecCard: "skm-mcp-rec-card",
  mcpRecCardHead: "skm-mcp-rec-card-head",
  mcpRecCardTitleRow: "skm-mcp-rec-card-title-row",
  mcpRecCardName: "skm-mcp-rec-card-name",
  mcpRecCardTags: "skm-mcp-rec-card-tags",
  mcpRecCatTag: "skm-mcp-rec-cat-tag",
  mcpRecCardDesc: "skm-mcp-rec-card-desc",
  mcpRecCardFoot: "skm-mcp-rec-card-foot",
  mcpRecCardMeta: "skm-mcp-rec-card-meta",
  mcpAddedTag: "skm-mcp-added-tag",
  mcpAddForm: "skm-mcp-add-form",
  mcpAddTypeRow: "skm-mcp-add-type-row",
  mcpAddTypeBtn: "skm-mcp-add-type-btn",
  mcpAddTypeActive: "skm-mcp-add-type-active",
  mcpToolSearch: "skm-mcp-tool-search",
  mcpToolSearchInput: "skm-mcp-tool-search-input",
  mcpLogRow: "skm-mcp-log-row",
  mcpLogDot: "skm-mcp-log-dot",
  mcpLogBody: "skm-mcp-log-body",
  mcpLogText: "skm-mcp-log-text",
  mcpLogClear: "skm-mcp-log-clear",
  mcpConfigGrid: "skm-mcp-config-grid",
  mcpConfigCard: "skm-mcp-config-card",
  mcpConfigHead: "skm-mcp-config-head",
  mcpConfigTitle: "skm-mcp-config-title",
  mcpConfigCopy: "skm-mcp-config-copy",
  mcpConfigCode: "skm-mcp-config-code",
  mcpInfoCol: "skm-mcp-info-col",
  mcpInfoCard: "skm-mcp-info-card",
  mcpInfoCardTitle: "skm-mcp-info-card-title",
  mcpInfoDesc: "skm-mcp-info-desc",
  mcpInfoPoints: "skm-mcp-info-points",
  mcpPoint: "skm-mcp-point",
  mcpPointIcon: "skm-mcp-point-icon",
  mcpPointBody: "skm-mcp-point-body",
  mcpPointTitle: "skm-mcp-point-title",
  mcpPointDesc: "skm-mcp-point-desc",
  mcpFlow: "skm-mcp-flow",
  mcpFlowNode: "skm-mcp-flow-node",
  mcpFlowIcon: "skm-mcp-flow-icon",
  mcpFlowLabel: "skm-mcp-flow-label",
  mcpFlowArrow: "skm-mcp-flow-arrow",
  mcpFlowArrowText: "skm-mcp-flow-arrow-text",
  mcpFlowExt: "skm-mcp-flow-ext",
  mcpFlowExtLabel: "skm-mcp-flow-ext-label",
  mcpFlowExtIcons: "skm-mcp-flow-ext-icons",
  mcpFlowExtIcon: "skm-mcp-flow-ext-icon",
  mcpApiText: "skm-mcp-api-text",
  mcpSteps: "skm-mcp-steps",
  mcpStep: "skm-mcp-step",
  mcpStepNum: "skm-mcp-step-num",
  mcpStepBody: "skm-mcp-step-body",
  mcpStepTitle: "skm-mcp-step-title",
  mcpStepDesc: "skm-mcp-step-desc",
  modal: "skm-modal",
  modalBody: "skm-modal-body",
  panel: "skm-panel",
  topRow: "skm-top-row",
  newBundleButton: "skm-new-bundle",
  upload: "skm-upload",
  uploadActive: "skm-upload-active",
  hiddenInput: "skm-hidden-input",
  installForm: "skm-install-form",
  installRow: "skm-install-row",
  inlineForm: "skm-inline-form",
  // 块级变体：改名输入行独占一整行（整行内容保留，表单追加在其下方）。
  inlineFormBlock: "skm-inline-form-block",
  inlineInput: "skm-inline-input",
  bundleSelect: "skm-bundle-select",
  installMeta: "skm-install-meta",
  installActions: "skm-install-actions",
  sectionTitle: "skm-section-title",
  status: "skm-status",
  failure: "skm-failure",
  error: "skm-error",
  bundleList: "skm-bundle-list",
  bundle: "skm-bundle",
  bundleRow: "skm-bundle-row",
  bundleName: "skm-bundle-name",
  bundleCount: "skm-bundle-count",
  chevron: "skm-chevron",
  bundleActions: "skm-bundle-actions",
  iconAction: "skm-icon-action",
  skillList: "skm-skill-list",
  skillItem: "skm-skill-item",
  skillRow: "skm-skill-row",
  skillLabel: "skm-skill-label",
  skillName: "skm-skill-name",
  skillDescription: "skm-skill-desc",
  skillExpand: "skm-skill-expand",
  skillCount: "skm-skill-count",
  skillCompat: "skm-skill-compat",
  // 技能卡片（Skills Hub 风格）
  skillGrid: "skm-skill-grid",
  skillCard: "skm-skill-card",
  skillCardHead: "skm-skill-card-head",
  skillIcon: "skm-skill-icon",
  skillBadge: "skm-skill-badge",
  skillTitleWrap: "skm-skill-title-wrap",
  skillTitle: "skm-skill-title",
  skillCopy: "skm-skill-copy",
  skillCardToggle: "skm-skill-card-toggle",
  skillDesc: "skm-skill-card-desc",
  skillTags: "skm-skill-tags",
  tag: "skm-tag",
  tagSource: "skm-tag-source",
  tagScope: "skm-tag-scope",
  skillMeta: "skm-skill-meta",
  skillCardFoot: "skm-skill-card-foot",
  skillFootLabel: "skm-skill-foot-label",
  skillFootIcon: "skm-skill-foot-icon",
  skillCardActions: "skm-skill-card-actions",
  // Skills Hub 页面结构
  hub: "skm-hub",
  hubRow: "skm-hub-row",
  hubSide: "skm-hub-side",
  topbar: "skm-topbar",
  chipRow: "skm-chip-row",
  hubBrand: "skm-hub-brand",
  hubLogo: "skm-hub-logo",
  hubBrandText: "skm-hub-brand-text",
  hubBrandTitle: "skm-hub-brand-title",
  hubBrandSub: "skm-hub-brand-sub",
  hubGroup: "skm-hub-group",
  hubItem: "skm-hub-item",
  hubItemActive: "skm-hub-item-active",
  hubItemIcon: "skm-hub-item-icon",
  hubItemLabel: "skm-hub-item-label",
  hubItemCount: "skm-hub-item-count",
  // 左栏：技能分类 / 快捷筛选 / 添加技能卡
  catTitle: "skm-cat-title",
  catItem: "skm-cat-item",
  catItemActive: "skm-cat-item-active",
  catIcon: "skm-cat-icon",
  catLabel: "skm-cat-label",
  catCount: "skm-cat-count",
  filterBlock: "skm-filter-block",
  filterRow: "skm-filter-row",
  filterRowLabel: "skm-filter-row-label",
  filterRowLabelStrong: "skm-filter-row-label-strong",
  filterRowChevron: "skm-filter-row-chevron",
  filterRowWrap: "skm-filter-row-wrap",
  filterMenu: "skm-filter-menu",
  filterOption: "skm-filter-option",
  presetDot: "skm-preset-dot",
  filtersTitle: "skm-filters-title",
  statusSeg: "skm-status-seg",
  statusSegBtn: "skm-status-seg-btn",
  statusSegActive: "skm-status-seg-active",
  addCard: "skm-add-card",
  addCardHead: "skm-add-card-head",
  addCardIcon: "skm-add-card-icon",
  addCardTitle: "skm-add-card-title",
  addCardSub: "skm-add-card-sub",
  addDrop: "skm-add-drop",
  addDropIcon: "skm-add-drop-icon",
  addDropText: "skm-add-drop-text",
  addDropHint: "skm-add-drop-hint",
  addBtn: "skm-add-btn",
  // 快速上手指南卡
  guideCard: "skm-guide-card",
  guideTitle: "skm-guide-title",
  guideDesc: "skm-guide-desc",
  guideBtn: "skm-guide-btn",
  guideArt: "skm-guide-art",
  // 右侧指南栏
  guidePanel: "skm-guide-panel",
  guidePanelHead: "skm-guide-panel-head",
  guidePanelLogo: "skm-guide-panel-logo",
  guidePanelTitle: "skm-guide-panel-title",
  guidePanelClose: "skm-guide-panel-close",
  guidePanelBody: "skm-guide-panel-body",
  guideSec: "skm-guide-sec",
  guideSecHead: "skm-guide-sec-head",
  guideSecIcon: "skm-guide-sec-icon",
  guideSecTitle: "skm-guide-sec-title",
  guideWhatDesc: "skm-guide-what-desc",
  guideCaps: "skm-guide-caps",
  guideCap: "skm-guide-cap",
  guideCapIcon: "skm-guide-cap-icon",
  guideCapLabel: "skm-guide-cap-label",
  guideStep: "skm-guide-step",
  guideStepNum: "skm-guide-step-num",
  guideStepBody: "skm-guide-step-body",
  guideStepTitleRow: "skm-guide-step-title-row",
  guideStepTitle: "skm-guide-step-title",
  guideStepArrow: "skm-guide-step-arrow",
  guideStepDesc: "skm-guide-step-desc",
  guideFullBtn: "skm-guide-full-btn",
  guideBest: "skm-guide-best",
  guideBestTitle: "skm-guide-best-title",
  guideBestList: "skm-guide-best-list",
  guideBestItem: "skm-guide-best-item",
  guideMoreBtn: "skm-guide-more-btn",
  guideBestArt: "skm-guide-best-art",
  hubMain: "skm-hub-main",
  // 分组行
  bundleRowOuter: "skm-bundle-row-outer",
  bundleIcon: "skm-bundle-icon",
  bundleMore: "skm-bundle-more",
  bundleMoreBtn: "skm-bundle-more-btn",
  // 分页
  pagination: "skm-pagination",
  pageInfo: "skm-page-info",
  pageBtns: "skm-page-btns",
  pageBtn: "skm-page-btn",
  pageBtnActive: "skm-page-btn-active",
  pageSizeSel: "skm-page-size-sel",
  newBundleBtn: "skm-new-bundle-btn",
  newBundleBtnOpen: "skm-new-bundle-btn-open",
  statsRow: "skm-stats-row",
  stat: "skm-stat",
  statIconCol: "skm-stat-icon-col",
  statIcon: "skm-stat-icon",
  statGlow: "skm-stat-glow",
  statBody: "skm-stat-body",
  statLabel: "skm-stat-label",
  statValue: "skm-stat-value",
  statValueRow: "skm-stat-value-row",
  statChevron: "skm-stat-chevron",
  statDesc: "skm-stat-desc",
  toolbar: "skm-toolbar",
  searchBox: "skm-search-box",
  searchInput: "skm-search-input",
  toolSelectWrap: "skm-tool-select-wrap",
  toolSelect: "skm-tool-select",
  toolSelectChevron: "skm-tool-select-chevron",
  dropWrap: "skm-drop-wrap",
  dropMenu: "skm-drop-menu",
  dropItem: "skm-drop-item",
  dropCheck: "skm-drop-check",
  dropBadge: "skm-drop-badge",
  toolButton: "skm-tool-button",
  toolbarSpacer: "skm-toolbar-spacer",
  bulkOverlay: "skm-bulk-overlay",
  presetPill: "skm-preset-pill",
  presetSelect: "skm-preset-select",
  presetPillChevron: "skm-preset-pill-chevron",
  presetPillLabel: "skm-preset-pill-label",
  viewToggle: "skm-view-toggle",
  viewBtn: "skm-view-btn",
  hintRow: "skm-hint-row",
  hintRowText: "skm-hint-row-text",
  banner: "skm-banner",
  bannerActive: "skm-banner-active",
  bannerIcon: "skm-banner-icon",
  bannerText: "skm-banner-text",
  bannerTitle: "skm-banner-title",
  bannerSub: "skm-banner-sub",
  bannerBtn: "skm-banner-btn",
  mainScroll: "skm-main-scroll",
  hubSection: "skm-hub-section",
  hubSectionHead: "skm-hub-section-head",
  skillGridList: "skm-skill-grid-list",
  noResult: "skm-no-result",
  // 归入技能包弹窗（卡片化）
  assignModal: "skm-assign-modal",
  assignModalBody: "skm-assign-modal-body",
  assignList: "skm-assign-list",
  assignCard: "skm-assign-card",
  assignCardIcon: "skm-assign-card-icon",
  assignCardBody: "skm-assign-card-body",
  assignCardName: "skm-assign-card-name",
  assignCardDesc: "skm-assign-card-desc",
  assignGo: "skm-assign-go",
  // 同步状态健康检查
  healthNotice: "skm-health-notice",
  healthNoticeTitle: "skm-health-notice-title",
  skillFiles: "skm-skill-files",
  skillFile: "skm-skill-file",
  skillPreview: "skm-skill-preview",
  viewerModal: "skm-viewer-modal",
  viewerBody: "skm-viewer-body",
  viewerLayout: "skm-viewer-layout",
  viewerNav: "skm-viewer-nav",
  viewerNavItem: "skm-viewer-nav-item",
  viewerNavDir: "skm-viewer-nav-dir",
  viewerContent: "skm-viewer-content",
  viewerModalFull: "skm-viewer-modal-full",
  viewerToolbar: "skm-viewer-toolbar",
  viewerPath: "skm-viewer-path",
  viewerToolGroup: "skm-viewer-tool-group",
  viewerToolBtn: "skm-viewer-tool-btn",
  viewerToolBtnA1: "skm-viewer-tool-btn-a1",
  viewerToolBtnA3: "skm-viewer-tool-btn-a3",
  viewerToolBtnFrame: "skm-viewer-tool-btn-frame",
  looseEmpty: "skm-loose-empty",
  visuallyHidden: "skm-visually-hidden",
  // 技能/技能包开关
  toggle: "skm-toggle",
  toggleOn: "skm-toggle-on",
  toggleOff: "skm-toggle-off",
  toggleKnob: "skm-toggle-knob",
  bundleToggle: "skm-bundle-toggle",
  // Agent 预设分类（圆球）
  presetStrip: "skm-preset-strip",
  presetBallWrap: "skm-preset-ball-wrap",
  presetBall: "skm-preset-ball",
  presetBallLabel: "skm-preset-ball-label",
  presetHint: "skm-preset-hint",
  presetHintText: "skm-preset-hint-text",
  presetReset: "skm-preset-reset",
  // 空技能包 / 失效引用 / 面板级提示条
  toastStack: "skm-toast-stack",
  toast: "skm-toast",
  toastOk: "skm-toast-ok",
  toastErr: "skm-toast-err",
  toastDot: "skm-toast-dot",
  bundleEmpty: "skm-bundle-empty",
  bundleEmptyTitle: "skm-bundle-empty-title",
  bundleEmptyHint: "skm-bundle-empty-hint",
  bundleEmptyBtn: "skm-bundle-empty-btn",
  bundleMissing: "skm-bundle-missing",
  bundleMissingBtn: "skm-bundle-missing-btn",
  installHint: "skm-install-hint",
  tagStatus: "skm-tag-status"
};
var STYLE_ID15 = "dsh-skill-manager-styles";
var SHEET12 = `
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
/* \u5757\u7EA7\u53D8\u4F53\uFF1Awidth:100% \u8BA9\u5B83\u5728 .skm-bundle\uFF08flex-wrap\uFF09\u91CC\u81EA\u52A8\u6362\u884C\u72EC\u5360\u4E00\u884C\uFF0C
   \u8F93\u5165\u6846\u56E0\u6B64\u80FD\u5403\u6EE1\u6574\u884C\u5BBD\u5EA6\uFF0C\u4E0D\u5FC5\u88AB\u4E24\u4E2A\u6309\u94AE\u6324\u5230\u53EA\u5269\u9ED8\u8BA4 20 \u5B57\u7B26\u3002 */
.skm-inline-form-block{width:100%;box-sizing:border-box;padding:0 8px 8px;animation:skm-form-in 160ms ease-out}
@keyframes skm-form-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
/* \u6539\u540D\u6210\u529F\uFF1A\u5361\u7247\u8FB9\u6846\u9AD8\u4EAE\u8109\u51B2\uFF081 \u79D2\u540E\u56DE\u843D\uFF09\uFF0C\u4E0E\u6574\u4F53\u6DF1\u8272\u5361\u7247\u8282\u594F\u4E00\u81F4 */
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
/* \u5206\u7EC4\u884C\uFF08\u53C2\u8003\u8BBE\u8BA1\u7A3F\uFF09\uFF1A\u767D\u5E95\u5706\u89D2\u884C\uFF0C\u84DD\u6587\u4EF6\u5939\u56FE\u6807 + \u540D\u79F0 + \u8BA1\u6570 pill + chevron + \u66F4\u591A */
.skm-bundle-row-outer{flex:none;display:flex;align-items:center;gap:6px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:11px;background:var(--dsw-alias-bg-base,#fff);padding:2px 6px 2px 10px;min-height:40px;transition:border-color 160ms ease,box-shadow 160ms ease,background 160ms ease}
.skm-bundle-row-outer:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.14));box-shadow:0 2px 8px rgba(16,24,40,.06)}
.skm-bundle-row{flex:1;min-width:0;display:inline-flex;align-items:center;gap:10px;appearance:none;border:none;background:transparent;padding:6px 2px;font-size:14px;cursor:pointer;color:var(--dsw-alias-label-primary,#1f2430);font-family:inherit;border-radius:8px;text-align:left;transition:background 140ms ease}
.skm-bundle-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.02))}
.skm-bundle-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-bundle-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;display:inline-flex;align-items:center;gap:6px}
.skm-bundle-count{flex:none;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary,#61666b);background:var(--dsw-alias-bg-module-platform,#f1f3f5);border-radius:999px;padding:0 8px;white-space:nowrap}
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

/* \u2500\u2500 \u6280\u80FD\u5361\u7247\uFF08Skills Hub \u98CE\u683C\uFF09\uFF1A\u53CC\u5217\u7F51\u683C\uFF1B\u5217\u8868\u89C6\u56FE\u5207\u5355\u5217\u5BBD\u5361 \u2500\u2500 */
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
/* \u5173\u6389\u7684\u6280\u80FD\u7559\u5728\u5217\u8868\u91CC\uFF0C\u4F46\u8981\u4E00\u773C\u770B\u51FA\u662F\u5173\u7684\uFF1A\u5DE6\u4FA7\u72B6\u6001\u6761 + \u6807\u9898\u964D\u9971\u548C\uFF08\u5E26\u8FC7\u6E21\uFF09 */
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

/* \u2500\u2500 Skills Hub \u9875\u9762\u9AA8\u67B6\uFF1A\u5DE6\u680F\uFF08\u5206\u7C7B/\u7B5B\u9009/\u6DFB\u52A0\uFF09 / \u7EDF\u8BA1\u884C / \u5DE5\u5177\u680F / tabs / \u5206\u7EC4 / \u5361\u7247 \u2500\u2500 */
.skm-hub{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;min-width:0;background:var(--dsw-alias-bg-base,#fff)}
.skm-topbar{flex:none;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05));background:var(--dsw-alias-bg-base,#fff)}
.skm-topbar[data-drop]{outline:2px dashed var(--dsw-alias-state-business-primary,#3d6be5);outline-offset:-2px}
.skm-chip-row{flex:1 1 auto;min-width:200px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.skm-topbar .skm-cat-item{flex:none;width:auto}
.skm-topbar .skm-new-bundle-btn{flex:none;width:auto;margin-top:0;height:32px;font-size:12px}
/* SKILL / MCP \u9876\u5C42 tab\uFF08\u7D27\u8D34\u6807\u9898\u6587\u5B57\u53F3\u4FA7\uFF09 */
.skm-kind-tabs{flex:none;display:inline-flex;align-items:center;gap:4px;padding:2px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:999px;background:var(--dsw-alias-bg-module-platform,#f2f4f7)}
.skm-kind-tab{flex:none;display:inline-flex;align-items:center;justify-content:center;height:24px;box-sizing:border-box;border:none;border-radius:999px;background:transparent;padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-kind-tab:hover{color:var(--dsw-alias-label-primary,#1f2430)}
.skm-kind-tab:active{transform:scale(.96)}
.skm-kind-tab[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;box-shadow:0 1px 5px rgba(61,107,229,.3)}
/* MCP \u89C6\u56FE\u6839\uFF1A\u5DE6\u4FA7\u7AD6\u6392\u83DC\u5355\uFF08\u540C\u6280\u80FD\u5DE6\u680F\u98CE\u683C\uFF09+ \u5185\u5BB9\u533A */
.skm-mcp-view-root{flex:1;min-height:0;display:flex;min-width:0;overflow-y:auto;padding:14px 20px 22px 0}
.skm-mcp-side{flex:none;width:216px;box-sizing:border-box;padding:4px 12px 0 20px;border-right:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.05));display:flex;flex-direction:column;gap:2px}
.skm-mcp-main{flex:1;min-width:0;padding:0 4px 0 18px;display:flex;flex-direction:column}
.skm-mcp-tabs{flex:none;display:flex;align-items:center;gap:10px}
.skm-mcp-tab{flex:none;display:inline-flex;align-items:center;justify-content:center;height:34px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:999px;background:var(--dsw-alias-bg-base,#fff);padding:0 18px;font-size:13px;font-weight:600;line-height:18px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-mcp-tab:hover{color:var(--dsw-alias-label-primary,#1f2430);border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16))}
.skm-mcp-tab:active{transform:scale(.97)}
.skm-mcp-tab[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;box-shadow:0 2px 8px rgba(61,107,229,.3)}
/* MCP Server \u9875\uFF1A\u5DE6\u4E3B\u5217 + \u53F3\u4FE1\u606F\u5217 */
.skm-mcp-server-layout{flex:none;display:flex;align-items:flex-start;gap:18px;min-width:0}
.skm-mcp-server-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:16px}
/* \u56FE\u4E00\uFF1A\u5934\u90E8 */
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
/* \u7EDF\u8BA1\u5361\uFF08\u590D\u7528\u6280\u80FD\u7EDF\u8BA1\u5361\u6837\u5F0F\uFF0C\u53BB\u6389\u5217\u8868\u9875\u5185\u8FB9\u8DDD\uFF09 */
.skm-stats-row[data-mcp]{padding:0}
/* \u56FE\u4E8C\uFF1A\u5217\u8868\u5361 */
.skm-mcp-list-card{flex:none;display:flex;flex-direction:column;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:16px;background:var(--dsw-alias-bg-base,#fff);padding:14px 16px 12px;box-shadow:0 1px 3px rgba(16,24,40,.04)}
.skm-mcp-list-head{flex:none;display:flex;align-items:center;gap:8px;padding:2px 2px 10px}
.skm-mcp-list-title{font-size:14px;font-weight:700;line-height:20px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-list-count{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:11px;font-weight:700;line-height:16px;padding:0 6px}
.skm-mcp-list-empty{flex:none;padding:26px 8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c)}
/* MCP \u5FEB\u901F\u4E86\u89E3\u5F15\u5BFC\u5361\uFF08\u5DE6\u680F\u5E95\u90E8\uFF0C\u70B9\u51FB\u53F3\u4FA7\u60AC\u6D6E\uFF1B\u540C\u6280\u80FD\u6307\u5357\u5361\u6837\u5F0F\uFF09 */
.skm-mcp-intro-card{flex:none;display:flex;flex-direction:column;gap:5px;margin-top:auto;box-sizing:border-box;border:1px solid #e4e9f8;border-radius:14px;background:var(--dsw-alias-bg-module-platform,#f3f7ff);padding:14px;cursor:pointer;box-shadow:0 1px 2px rgba(16,24,40,.03);transition:border-color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-mcp-intro-card:hover{border-color:#cdd9f7;box-shadow:0 4px 14px rgba(61,107,229,.08)}
.skm-mcp-intro-title{font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-state-business-primary,#3d6be5)}
.skm-mcp-intro-desc{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-mcp-intro-btn{flex:none;align-self:flex-start;display:inline-flex;align-items:center;gap:5px;margin-top:4px;height:28px;box-sizing:border-box;border:none;border-radius:999px;background:var(--dsw-alias-state-business-primary,#3d6be5);padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:#fff;cursor:pointer;box-shadow:0 2px 6px rgba(61,107,229,.3);transition:background 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-mcp-intro-btn:hover{background:#3059cf;box-shadow:0 3px 10px rgba(61,107,229,.38);transform:translateY(-1px)}
.skm-mcp-intro-btn:active{transform:translateY(0) scale(.97)}
/* MCP \u89E3\u91CA\u60AC\u6D6E\u5C42\uFF08\u540C\u6280\u80FD\u6307\u5357\u6D6E\u5C42\uFF09 */
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
/* \u63A8\u8350\u884C\u300C\u6DFB\u52A0\u300D\u5C0F\u6309\u94AE */
.skm-mcp-add-small-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;height:26px;box-sizing:border-box;border:1px solid #bccff5;border-radius:999px;background:#f4f8ff;padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:var(--dsw-alias-state-business-primary,#3d6be5);cursor:pointer;transition:background 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-add-small-btn:hover{border-color:#9db6ef;background:#e9f1ff}
.skm-mcp-add-small-btn:active{transform:scale(.96)}
/* \u63A8\u8350 MCP Server \u6807\u9898 */
.skm-mcp-recommend-title{flex:none;font-size:15px;font-weight:700;line-height:21px;color:var(--dsw-alias-state-business-primary,#3d6be5)}
/* \u63A8\u8350\u533A\uFF1A\u6807\u9898\u884C + \u5206\u7C7B pills + \u5361\u7247\u7F51\u683C */
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
/* MCP Server \u5361\uFF1A\u81EA\u542F\u52A8/\u542F\u7528 \u8BBE\u7F6E\u884C */
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
.skm-mcp-rec-card-desc{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;min-height:36px}
.skm-mcp-rec-card-foot{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:6px}
.skm-mcp-rec-card-meta{flex:1;min-width:0;font-size:11px;line-height:16px;color:var(--dsw-alias-label-caption,#adb2b8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.skm-mcp-added-tag{flex:none;display:inline-flex;align-items:center;gap:4px;height:26px;box-sizing:border-box;border:1px solid #b7e0c3;border-radius:999px;background:#e7f6ec;padding:0 10px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:#2f9e44;cursor:pointer;transition:background 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-added-tag:hover{border-color:#93cfa6;background:#d9f0e1}
.skm-mcp-added-tag:active{transform:scale(.96)}
/* \u6DFB\u52A0 MCP Server \u8868\u5355 */
.skm-mcp-add-form{display:flex;flex-direction:column;gap:8px}
.skm-mcp-add-type-row{display:flex;align-items:center;gap:6px}
.skm-mcp-add-type-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;height:28px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:999px;background:var(--dsw-alias-bg-base,#fff);padding:0 12px;font-size:12px;font-weight:600;line-height:17px;font-family:inherit;color:var(--dsw-alias-label-secondary,#61666b);cursor:pointer;transition:background 140ms ease,color 140ms ease,border-color 140ms ease,transform 140ms ease}
.skm-mcp-add-type-btn:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-add-type-btn:active{transform:scale(.96)}
.skm-mcp-add-type-btn[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff}
/* \u5DE5\u5177\u5217\u8868\u641C\u7D22\u6846 */
.skm-mcp-tool-search{flex:none;display:flex;align-items:center;gap:8px;height:32px;width:260px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;background:var(--dsw-alias-bg-base,#fff);padding:0 10px;color:var(--dsw-alias-label-caption,#adb2b8);transition:border-color 140ms ease,box-shadow 140ms ease}
.skm-mcp-tool-search:focus-within{border-color:var(--dsw-alias-state-business-primary,#3d6be5);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 14%,transparent)}
.skm-mcp-tool-search-input{flex:1;min-width:0;border:none;outline:none;background:transparent;font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430);font-family:inherit}
.skm-mcp-tool-search-input::placeholder{color:var(--dsw-alias-label-caption,#adb2b8)}
/* \u8FDE\u63A5\u65E5\u5FD7\u884C */
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
/* \u914D\u7F6E\u6A21\u677F\u5361 */
.skm-mcp-config-grid{flex:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.skm-mcp-config-card{flex:none;min-width:0;display:flex;flex-direction:column;gap:10px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:14px;background:var(--dsw-alias-bg-base,#fff);padding:12px 14px;box-shadow:0 1px 2px rgba(16,24,40,.03);transition:border-color 160ms ease,box-shadow 160ms ease}
.skm-mcp-config-card:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.13));box-shadow:0 3px 10px rgba(16,24,40,.07)}
.skm-mcp-config-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.skm-mcp-config-title{font-size:13px;font-weight:700;line-height:18px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-config-copy{flex:none;display:inline-flex;align-items:center;height:24px;box-sizing:border-box;border:1px solid color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 30%,transparent);border-radius:999px;background:transparent;padding:0 10px;font-size:11px;line-height:16px;font-family:inherit;color:var(--dsw-alias-state-business-primary,#3d6be5);cursor:pointer;transition:background 140ms ease,color 140ms ease,transform 140ms ease}
.skm-mcp-config-copy:hover{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 10%,transparent)}
.skm-mcp-config-copy:active{transform:scale(.96)}
.skm-mcp-config-code{flex:none;margin:0;padding:10px 12px;border-radius:10px;background:var(--dsw-alias-bg-module-platform,#f5f6f7);color:var(--dsw-alias-label-secondary,#61666b);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:17px;overflow:auto}
/* \u56FE\u4E09\uFF1A\u53F3\u4FA7\u4FE1\u606F\u680F */
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
/* \u5DE5\u4F5C\u539F\u7406\u6D41\u7A0B */
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
/* \u5FEB\u901F\u4E0A\u624B */
.skm-mcp-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.skm-mcp-step{display:flex;gap:8px;align-items:flex-start}
.skm-mcp-step-num{flex:none;width:22px;height:22px;border-radius:50%;background:#e7effe;color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:12px;font-weight:700;line-height:22px;text-align:center}
.skm-mcp-step-body{min-width:0;display:flex;flex-direction:column;gap:1px}
.skm-mcp-step-title{font-size:12px;font-weight:600;line-height:17px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-step-desc{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#81858c)}
/* MCP \u7A7A\u6001\uFF08\u5DE5\u5177\u5217\u8868/\u8FDE\u63A5\u65E5\u5FD7/\u914D\u7F6E\u6A21\u677F\u5360\u4F4D\uFF09 */
.skm-mcp-empty{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px}
.skm-mcp-empty-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);box-shadow:0 4px 12px rgba(61,107,229,.1)}
.skm-mcp-empty-title{font-size:16px;font-weight:700;line-height:22px;color:var(--dsw-alias-label-primary,#1f2430)}
.skm-mcp-empty-desc{font-size:13px;line-height:19px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-hub-row{flex:1;min-height:0;min-width:0;display:flex}
/* \u53F3\u4FA7\u6307\u5357\u6D6E\u5C42\u5361\uFF08\u70B9\u51FB\u300C\u5F00\u59CB\u5B66\u4E60\u300D\u51FA\u73B0\uFF0C\u8D34\u9762\u677F\u53F3\u7F18\uFF0C\u4E0D\u538B\u7F29\u9762\u677F\uFF09 */
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
/* \u542F\u7528\u72B6\u6001\uFF1A\u5E73\u94FA\u4E09\u6863\u5206\u6BB5\u6309\u94AE */
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
/* \u65B0\u5EFA\u6280\u80FD\u5305\u6309\u94AE\uFF08\u5DE6\u680F\uFF0C\u6DFB\u52A0\u6280\u80FD\u5361\u4E0A\u65B9\uFF09 */
.skm-new-bundle-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;width:100%;box-sizing:border-box;margin-top:18px;border:1px solid #c7d6f7;border-radius:10px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#3d6be5) 12%,transparent);color:var(--dsw-alias-state-business-primary,#3d6be5);font-size:13px;font-weight:600;line-height:18px;font-family:inherit;padding:0 12px;cursor:pointer;transition:background 140ms ease,border-color 140ms ease,color 140ms ease,box-shadow 140ms ease,transform 140ms ease}
.skm-new-bundle-btn:hover{border-color:#9db6ef;background:#e3ecff;box-shadow:0 2px 8px rgba(61,107,229,.12)}
.skm-new-bundle-btn:active{transform:scale(.98)}
.skm-new-bundle-btn-open{border-color:var(--dsw-alias-state-business-primary,#3d6be5);background:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff;box-shadow:0 2px 8px rgba(61,107,229,.3)}
.skm-new-bundle-btn-open:hover{background:#3059cf;border-color:#3059cf;color:#fff}
/* \u6DFB\u52A0\u6280\u80FD\u5361 */
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
/* \u5FEB\u901F\u4E0A\u624B\u6307\u5357\u5361\uFF08\u6DFB\u52A0\u6280\u80FD\u5361\u4E0B\u65B9\uFF09 */
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
/* \u2500\u2500 \u7EDF\u8BA1\u5361\uFF08\u53C2\u8003\u8BBE\u8BA1\u7A3F\uFF09\uFF1A\u5DE6\u5706\u5F62\u6E10\u53D8\u56FE\u6807 + \u56FE\u6807\u4E0B\u5149\u70B9\uFF0C\u53F3\u4FA7\u6807\u9898/\u5927\u6570\u5B57/\u63CF\u8FF0 \u2500\u2500 */
.skm-stats-row{flex:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;padding:14px 16px 0}
.skm-stat{position:relative;min-width:0;display:flex;align-items:center;gap:14px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:15px;background:var(--dsw-alias-bg-base,#fff);padding:15px 18px;box-shadow:0 1px 2px rgba(16,24,40,.04);opacity:0;animation:skm-card-in 260ms cubic-bezier(.2,.7,.3,1.06) forwards;transition:box-shadow 160ms ease,transform 160ms ease,border-color 160ms ease}
.skm-stat:hover{box-shadow:0 6px 18px rgba(16,24,40,.09);transform:translateY(-1px);border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.13))}
.skm-stat-icon-col{flex:none;width:46px;display:flex;flex-direction:column;align-items:center;gap:9px}
.skm-stat-icon{flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.skm-stat-icon[data-tone='blue']{color:#4f6af5;background:color-mix(in srgb,#4f6af5 13%,transparent)}
.skm-stat-icon[data-tone='green']{color:#2fb26b;background:color-mix(in srgb,#2fb26b 13%,transparent)}
.skm-stat-icon[data-tone='violet']{color:#8b5cf6;background:color-mix(in srgb,#8b5cf6 13%,transparent)}
.skm-stat-icon[data-tone='orange']{color:#f28d0f;background:color-mix(in srgb,#f28d0f 13%,transparent)}
/* \u56FE\u6807\u6B63\u4E0B\u65B9\u7684\u6E10\u53D8\u5149\u70B9\uFF08\u4E0E\u56FE\u6807\u540C\u8272\uFF0C\u5411\u4E0B\u6DE1\u51FA\uFF09 */
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
/* \u65B0\u5EFA\u6280\u80FD\u5305\u5165\u53E3\uFF08\u7070\u5B57\u6309\u94AE\u884C\uFF09 */
.skm-new-bundle-line{flex:none;align-self:flex-start;display:inline-flex;align-items:center;gap:4px;border:none;border-radius:8px;padding:6px 10px;margin:2px 0 0 4px;background:transparent;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c);cursor:pointer;font-family:inherit;transition:background 140ms ease,color 140ms ease}
.skm-new-bundle-line:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.04));color:var(--dsw-alias-label-secondary,#61666b)}
/* \u5206\u9875\u884C */
.skm-pagination{flex:none;display:flex;align-items:center;gap:10px;padding:4px 4px 0}
.skm-page-info{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#81858c)}
.skm-page-btns{flex:1;display:flex;align-items:center;gap:4px}
.skm-page-btn{flex:none;min-width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:8px;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-secondary,#61666b);font-size:12px;line-height:18px;font-family:inherit;cursor:pointer;transition:border-color 140ms ease,color 140ms ease,background 140ms ease,transform 140ms ease}
.skm-page-btn:hover{border-color:var(--dsw-alias-border-l3,rgba(0,0,0,.16));color:var(--dsw-alias-label-primary,#1f2430)}
.skm-page-btn:active{transform:scale(.94)}
.skm-page-btn:disabled{opacity:.45;cursor:default}
.skm-page-btn[data-active]{background:var(--dsw-alias-state-business-primary,#3d6be5);border-color:var(--dsw-alias-state-business-primary,#3d6be5);color:#fff}
.skm-page-size-sel{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary,#61666b)}

/* \u2500\u2500 \u5F52\u5165\u6280\u80FD\u5305\u5F39\u7A97\uFF08\u5361\u7247\u5316\uFF0C\u4E0E\u6280\u80FD\u5361\u7247\u540C\u8BED\u8A00\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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
/* \u67E5\u770B\u5668\u9ED8\u8BA4\u5C31\u662F\u5927\u753B\u5E45\uFF081280\xD7880 \u4E0A\u9650\uFF0C\u968F\u89C6\u53E3\u6536\u7F29\uFF09\uFF0C\u53EF\u4E00\u952E\u5168\u5C4F\uFF1B\u5BBD/\u9AD8\u5E26\u7F13\u52A8\u8FC7\u6E21\u3002 */
.skm-viewer-modal{width:min(1280px,calc(100vw - 64px));animation:skm-viewer-in 260ms cubic-bezier(.2,.7,.3,1.06);transition:width 320ms cubic-bezier(.22,.72,.24,1)}
.skm-viewer-modal-full{width:calc(100vw - 48px)}
@keyframes skm-viewer-in{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
.skm-viewer-body{overflow:hidden;display:flex;flex-direction:column;height:min(880px,calc(100vh - 96px));transition:height 320ms cubic-bezier(.22,.72,.24,1);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}
/* \u5B98\u65B9 Modal \u7684 root \u81EA\u5E26 24px \u5185\u8FB9\u8DDD\u3001dialog \u81EA\u5E26 24px \u4E0B\u5185\u8FB9\u8DDD\uFF1A
   \u5168\u5C4F\u6863\u6309\u8FD9\u4E24\u5904\u7559\u767D\u6536\uFF0C\u514D\u5F97\u88AB flex-shrink \u622A\u65AD\u6216\u4E0A\u4E0B\u6EA2\u51FA\u3002 */
.skm-viewer-modal-full .skm-viewer-body{height:calc(100vh - 76px)}
/* \u5F39\u7A97\u5934\u90E8\uFF08\u5B98\u65B9 Modal \u7684 header \u662F\u672C\u5BB9\u5668\u7B2C\u4E00\u4E2A div\uFF09\uFF1A\u968F\u5927\u753B\u5E45\u653E\u5927\u4E00\u6863\u3002 */
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
/* \u6B63\u6587\u5168\u90E8\u8D70 em\uFF1A--skm-vfs \u4E00\u4E2A\u53D8\u91CF\u9A71\u52A8\u5B57\u53F7\u4E09\u6863\uFF0C\u5207\u6362\u65F6\u53EA\u8FC7\u6E21 font-size\u3002 */
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

/* \u2500\u2500 \u6280\u80FD/\u6280\u80FD\u5305\u5F00\u5173\uFF08Skills Hub \u98CE\u683C\uFF1A\u7EFF\u8272\u80F6\u56CA + \u767D\u8272\u5706\u94AE\uFF0C\u56DE\u5F39\u8FC7\u6E21\uFF09 \u2500\u2500 */
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

/* \u2500\u2500 Agent \u9884\u8BBE\u5206\u7C7B\u5706\u7403\u6761\uFF08\u5F27\u5F62\u6062\u590D\uFF0C\u6574\u5217\u4F4D\u4E8E\u7EDF\u8BA1\u884C\u4E0E\u5DE5\u5177\u680F\u4E4B\u95F4\uFF09 \u2500\u2500 */
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

/* \u2500\u2500 \u9762\u677F\u7EA7\u63D0\u793A\u6761\uFF1A\u5220\u9664/\u5F52\u7EC4/\u6539\u540D/\u5B89\u88C5\u7684\u6210\u8D25\u90FD\u8981\u8BA9\u7528\u6237\u770B\u89C1 \u2500\u2500 */
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

/* \u2500\u2500 \u7A7A\u6280\u80FD\u5305\uFF1A\u53EF\u89C1 + \u53EF\u64CD\u4F5C\uFF08\u65E7\u5B9E\u73B0\u628A 0 \u6210\u5458\u7684\u5305\u6574\u6BB5\u8FC7\u6EE4\u6389\uFF0C\u5EFA\u5B8C\u5305\u5C31\u300C\u6D88\u5931\u300D\uFF09 \u2500\u2500 */
.skm-bundle-empty{grid-column:1/-1;display:flex;align-items:center;gap:12px;flex-wrap:wrap;box-sizing:border-box;margin:2px 0 6px;padding:14px 16px;border:1px dashed var(--dsw-alias-border-l2,rgba(0,0,0,.18));border-radius:12px;background:var(--dsw-alias-bg-layer-1,rgba(0,0,0,.02));animation:skm-fade-up 260ms ease both}
.skm-bundle-empty-title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#333)}
.skm-bundle-empty-hint{flex:1 1 200px;min-width:160px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#8b9099)}
.skm-bundle-empty-btn{flex:none;display:inline-flex;align-items:center;gap:6px;appearance:none;border:1px solid var(--dsw-alias-state-business-primary,#4176e6);border-radius:9px;padding:5px 12px;font-size:12px;line-height:18px;font-family:inherit;cursor:pointer;color:var(--dsw-alias-state-business-primary,#4176e6);background:transparent;transition:background 160ms ease,color 160ms ease,transform 160ms ease,box-shadow 160ms ease}
.skm-bundle-empty-btn:hover{background:var(--dsw-alias-state-business-primary,#4176e6);color:#fff;transform:translateY(-1px);box-shadow:0 4px 14px rgba(65,118,230,.28)}
.skm-bundle-empty-btn:active{transform:translateY(0)}
@keyframes skm-fade-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

/* \u2500\u2500 \u8D26\u672C\u5931\u6548\u5F15\u7528\uFF1A\u660E\u8BF4\u300C\u5305\u91CC\u6709\u6307\u5411\u5DF2\u5220\u9664\u6280\u80FD\u7684\u6761\u76EE\u300D\u5E76\u4E00\u952E\u6E05\u7406 \u2500\u2500 */
.skm-bundle-missing{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 6px;padding:8px 12px;border-radius:10px;border:1px solid rgba(240,150,40,.38);background:rgba(240,150,40,.09);font-size:12px;line-height:18px;color:#8a5a12;animation:skm-fade-up 260ms ease both}
.skm-bundle-missing code{padding:1px 6px;border-radius:5px;background:rgba(240,150,40,.16);font-size:11.5px}
.skm-bundle-missing-btn{appearance:none;border:1px solid rgba(240,150,40,.55);background:transparent;border-radius:8px;padding:2px 9px;font-size:11.5px;line-height:18px;font-family:inherit;cursor:pointer;color:inherit;transition:background 140ms ease,transform 140ms ease}
.skm-bundle-missing-btn:hover{background:rgba(240,150,40,.2);transform:translateY(-1px)}
body[data-ds-dark-theme] .skm-bundle-missing{color:#f0c48a}
.skm-install-hint{margin:2px 0 0;font-size:11.5px;line-height:17px;color:var(--dsw-alias-label-tertiary,#8b9099)}

/* \u2500\u2500 \u79FB\u52A8\u7AEF\uFF1A\u4FA7\u680F\u6536\u7A84/\u9690\u85CF\u3001\u67E5\u770B\u5668\u4E0A\u4E0B\u5806\u53E0\u3001\u5361\u7247\u7F51\u683C\u5355\u5217 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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

/* \u2500\u2500 \u51CF\u5F31\u52A8\u6548\uFF1A\u5361\u7247\u5165\u573A/\u60AC\u505C\u4F4D\u79FB\u4E0E\u5F00\u5173\u56DE\u5F39\u5168\u90E8\u6536\u655B \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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
}
`;
function ensureStyles4() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID15) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID15;
  tag.textContent = SHEET12;
  document.head.appendChild(tag);
}
function readEntryFile(entry) {
  return new Promise((resolve, reject) => {
    entry.file(resolve, reject);
  });
}
async function collectEntry(entry, prefix, out) {
  if (entry.isFile) {
    const fileEntry = entry;
    const file = await readEntryFile(fileEntry);
    const path = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    out.push({ path, file });
    return;
  }
  if (entry.isDirectory) {
    const dirEntry = entry;
    const reader = dirEntry.createReader();
    const all = [];
    while (true) {
      const batch = await new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
      });
      if (batch.length === 0) break;
      all.push(...batch);
    }
    const nextPrefix = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    for (const child of all) await collectEntry(child, nextPrefix, out);
  }
}
function fileToBase64(file) {
  return file.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 32768;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return btoa(binary);
  });
}
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inlineMd(s) {
  return escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
function renderSkillMarkdown(text) {
  const body = String(text).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const lines = body.split("\n");
  let html = "";
  let inCode = false;
  let codeBuf = [];
  let inList = false;
  let inQuote = false;
  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      html += "</blockquote>";
      inQuote = false;
    }
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      if (inCode) {
        html += "<pre>" + escapeHtml(codeBuf.join("\n")) + "</pre>";
        codeBuf = [];
        inCode = false;
      } else {
        closeList();
        closeQuote();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (trimmed === "---" || trimmed === "***") {
      closeList();
      closeQuote();
      html += "<hr>";
      continue;
    }
    if (trimmed.startsWith(">")) {
      if (!inQuote) {
        closeList();
        html += "<blockquote>";
        inQuote = true;
      }
      html += "<p>" + inlineMd(trimmed.replace(/^>\s?/, "")) + "</p>";
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading !== null) {
      closeList();
      closeQuote();
      const level = Math.min(heading[1].length, 6);
      html += `<h${String(level)}>` + inlineMd(heading[2]) + `</h${String(level)}>`;
      continue;
    }
    const item = /^[-*]\s+(.*)$/.exec(trimmed);
    if (item !== null) {
      if (!inList) {
        closeQuote();
        html += "<ul>";
        inList = true;
      }
      html += "<li>" + inlineMd(item[1]) + "</li>";
      continue;
    }
    closeList();
    closeQuote();
    if (trimmed === "") {
      html += "<p></p>";
      continue;
    }
    html += "<p>" + inlineMd(trimmed) + "</p>";
  }
  closeList();
  closeQuote();
  if (inCode) html += "<pre>" + escapeHtml(codeBuf.join("\n")) + "</pre>";
  return html;
}
var ALL_PRESETS = "*";
var VIEWER_FONT_SIZES = [13.5, 15, 17];
var VIEWER_PREF_KEY = "dsh.triad.skillViewer";
var VIEWER_FONT_LABELS = ["\u5C0F\u5B57\u53F7", "\u6807\u51C6\u5B57\u53F7", "\u5927\u5B57\u53F7"];
function readViewerPrefs() {
  try {
    const raw = localStorage.getItem(VIEWER_PREF_KEY);
    if (typeof raw !== "string" || raw === "") return { font: 1, full: false };
    const parsed = JSON.parse(raw);
    const font = typeof parsed.font === "number" && parsed.font >= 0 && parsed.font < VIEWER_FONT_SIZES.length ? Math.trunc(parsed.font) : 1;
    return { font, full: parsed.full === true };
  } catch {
    return { font: 1, full: false };
  }
}
function writeViewerPrefs(prefs) {
  try {
    localStorage.setItem(VIEWER_PREF_KEY, JSON.stringify(prefs));
  } catch {
  }
}
function ViewerExpandIcon({ full }) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: full ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M6.2 2.2v4h-4M9.8 2.2v4h4M6.2 13.8v-4h-4M9.8 13.8v-4h4" }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M2.2 6.2v-4h4M13.8 6.2v-4h-4M2.2 9.8v4h4M13.8 9.8v4h-4" }) });
}
function skillFileRows(files) {
  const rows = [];
  const seenDirs = /* @__PURE__ */ new Set();
  for (const path of files) {
    const parts = path.split("/");
    let dirPath = "";
    for (let i = 0; i < parts.length - 1; i += 1) {
      dirPath = dirPath === "" ? parts[i] : dirPath + "/" + parts[i];
      if (!seenDirs.has(dirPath)) {
        seenDirs.add(dirPath);
        rows.push({ kind: "dir", path: dirPath + "/", depth: i, main: false });
      }
    }
    rows.push({ kind: "file", path, depth: parts.length - 1, main: path === "SKILL.md" });
  }
  return rows;
}
function CopyIcon2() {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
  ] });
}
function CheckIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("polyline", { points: "20 6 9 17 4 12" }) });
}
function SearchIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
  ] });
}
function SkillCard({ skill, bundleId, bundleName, enabled, lockedReason, scopeLabel, index, onToggle, onView, onAssign, onRemove, onDelete }) {
  const files = Array.isArray(skill.files) ? skill.files : [];
  const description = skill.description ?? "";
  const [copied, setCopied] = (0, import_react29.useState)(false);
  const copiedTimer = (0, import_react29.useRef)(null);
  (0, import_react29.useEffect)(() => () => {
    if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
  }, []);
  const flashCopied = () => {
    setCopied(true);
    if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => {
      setCopied(false);
    }, 1200);
  };
  const copyName = () => {
    const fallback = () => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = skill.name;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
      }
    };
    try {
      if (navigator.clipboard !== void 0) {
        void navigator.clipboard.writeText(skill.name).then(flashCopied, () => {
          fallback();
          flashCopied();
        });
      } else {
        fallback();
        flashCopied();
      }
    } catch {
      fallback();
      flashCopied();
    }
  };
  const toggleLabel = lockedReason ?? (enabled ? skillT("disableSkill") : skillT("enableSkill"));
  const fileMeta = typeof skill.fileCount === "number" ? skill.fileCount : files.length;
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
    "li",
    {
      className: css3.skillCard,
      "data-off": enabled ? void 0 : "true",
      style: { "--skm-i": index },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.skillCardHead, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.skillBadge, "aria-hidden": "true", children: "skill" }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
            "button",
            {
              type: "button",
              className: css3.skillTitle,
              title: skill.name,
              onClick: () => {
                onView(skill);
              },
              children: skill.name
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.skillCardToggle, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": enabled,
              "aria-label": toggleLabel,
              title: toggleLabel,
              className: `${css3.toggle} ${enabled ? css3.toggleOn : css3.toggleOff}`,
              disabled: lockedReason !== void 0,
              onClick: (event) => {
                event.stopPropagation();
                onToggle(skill, !enabled);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.toggleKnob, "aria-hidden": "true" })
            }
          ) })
        ] }),
        description !== "" && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.skillDesc, title: description, onClick: () => {
          onView(skill);
        }, children: description }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.skillTags, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: `${css3.tag} ${css3.tagSource}`, children: bundleName ?? skillT("tagLoose") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: `${css3.tag} ${css3.tagScope}`, "data-off": enabled ? void 0 : "true", children: scopeLabel }),
          !enabled && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: `${css3.tag} ${css3.tagStatus}`, children: skillT("skillOffTag") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.skillMeta, children: skillT("fileCount", { n: fileMeta }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.skillCardFoot, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.skillFootLabel, children: skillT("toolsLabel") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.skillCardActions, children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Tooltip, { label: skillT("copySkillName"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              "button",
              {
                type: "button",
                className: css3.skillFootIcon,
                "data-copied": copied ? "true" : void 0,
                "aria-label": copied ? skillT("copiedSkillName") : skillT("copySkillName"),
                title: copied ? skillT("copiedSkillName") : skillT("copySkillName"),
                onClick: copyName,
                children: copied ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CheckIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CopyIcon2, {})
              }
            ) }),
            bundleId !== null ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Tooltip, { label: skillT("removeSkill"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              "button",
              {
                type: "button",
                className: css3.skillFootIcon,
                "aria-label": skillT("removeSkill"),
                title: skillT("removeSkill"),
                onClick: () => {
                  onRemove?.(skill);
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconCloseOutline16, { size: 14, "aria-hidden": "true" })
              }
            ) }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Tooltip, { label: skillT("assignToBundle"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              "button",
              {
                type: "button",
                className: css3.skillFootIcon,
                "aria-label": skillT("assignToBundle"),
                title: skillT("assignToBundle"),
                onClick: () => {
                  onAssign?.(skill);
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconPlusOutline16, { size: 14, "aria-hidden": "true" })
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Tooltip, { label: skillT("deleteSkillBtn"), side: "bottom", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              "button",
              {
                type: "button",
                className: `${css3.skillFootIcon} ${css3.skillFootIconDanger}`,
                "aria-label": skillT("deleteSkillBtn"),
                title: skillT("deleteSkillBtn"),
                onClick: () => {
                  onDelete?.(skill);
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconTrashOutline16, { size: 14, "aria-hidden": "true" })
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
var SKILL_NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
function frontmatterName(text) {
  const lines = text.split(/\r?\n/).slice(0, 80);
  if ((lines[0] ?? "").trim() !== "---") return null;
  for (const line of lines.slice(1)) {
    if (line.trim() === "---") break;
    const pair = /^\s*name\s*:\s*(.+?)\s*$/.exec(line);
    if (pair !== null) return (pair[1] ?? "").replace(/^["']|["']$/g, "");
  }
  return null;
}
function SkillsPanel({ onClose, closing = false, anchor = null, onCardMouseEnter, onCardMouseLeave }) {
  ensureStyles4();
  const [state, setState] = (0, import_react29.useState)({ status: "loading" });
  const [reload, setReload] = (0, import_react29.useState)(0);
  const [expanded, setExpanded] = (0, import_react29.useState)(/* @__PURE__ */ new Set());
  const [looseOpen, setLooseExpanded] = (0, import_react29.useState)(false);
  const [viewer, setViewer] = (0, import_react29.useState)(null);
  const [viewerFont, setViewerFont] = (0, import_react29.useState)(() => readViewerPrefs().font);
  const [viewerFull, setViewerFull] = (0, import_react29.useState)(() => readViewerPrefs().full);
  const [assignTarget, setAssignTarget] = (0, import_react29.useState)(null);
  const [newBundleOpen, setNewBundleOpen] = (0, import_react29.useState)(false);
  const [newBundleName, setNewBundleName] = (0, import_react29.useState)("");
  const [creatingBundle, setCreatingBundle] = (0, import_react29.useState)(false);
  const [renameTarget, setRenameTarget] = (0, import_react29.useState)(null);
  const [renaming, setRenaming] = (0, import_react29.useState)(false);
  const [renamedFlash, setRenamedFlash] = (0, import_react29.useState)(null);
  const renamedTimer = (0, import_react29.useRef)(null);
  const [confirm, setConfirm] = (0, import_react29.useState)(null);
  const [confirming, setConfirming] = (0, import_react29.useState)(false);
  const [install, setInstall] = (0, import_react29.useState)(null);
  const [addOpen, setAddOpen] = (0, import_react29.useState)(false);
  const [installName, setInstallName] = (0, import_react29.useState)("");
  const [installDescription, setInstallDescription] = (0, import_react29.useState)("");
  const [installBundleId, setInstallBundleId] = (0, import_react29.useState)(void 0);
  const [installing, setInstalling] = (0, import_react29.useState)(false);
  const [installError, setInstallError] = (0, import_react29.useState)(null);
  const [toasts, setToasts] = (0, import_react29.useState)([]);
  const toastTimers = (0, import_react29.useRef)([]);
  const pushToast = (tone, text) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { id, tone, text }]);
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, tone === "err" ? 6400 : 2800);
    toastTimers.current.push(timer);
  };
  const failToast = (label, error) => {
    pushToast("err", skillT("opFailed", { label, message: error instanceof Error ? error.message : String(error) }));
  };
  const [installMetaName, setInstallMetaName] = (0, import_react29.useState)(null);
  (0, import_react29.useEffect)(() => {
    if (install === null || install.archive === true) {
      setInstallMetaName(null);
      return void 0;
    }
    const entry = install.files.find((item) => item.path === "SKILL.md");
    if (entry === void 0) {
      setInstallMetaName(null);
      return void 0;
    }
    let current = true;
    void entry.file.text().then((text) => {
      if (!current) return;
      setInstallMetaName(frontmatterName(text));
    }, () => {
      if (current) setInstallMetaName(null);
    });
    return () => {
      current = false;
    };
  }, [install]);
  const [dropActive, setDropActive] = (0, import_react29.useState)(false);
  const fileInput = (0, import_react29.useRef)(null);
  const [toggles, setToggles] = (0, import_react29.useState)({ skills: {}, bundles: {} });
  const [toggling, setToggling] = (0, import_react29.useState)(/* @__PURE__ */ new Set());
  const [presets, setPresets] = (0, import_react29.useState)([]);
  const [overrides, setOverrides] = (0, import_react29.useState)({});
  const [activePreset, setActivePreset] = (0, import_react29.useState)(ALL_PRESETS);
  const [query, setQuery] = (0, import_react29.useState)("");
  const [sourceFilter, setSourceFilter] = (0, import_react29.useState)("all");
  const [sortAsc, setSortAsc] = (0, import_react29.useState)(true);
  const [viewMode] = (0, import_react29.useState)("grid");
  const [statusFilter, setStatusFilter] = (0, import_react29.useState)("all");
  const [openMenu, setOpenMenu] = (0, import_react29.useState)(null);
  const [health, setHealth] = (0, import_react29.useState)({ state: "loading" });
  const [guideOpen, setGuideOpen] = (0, import_react29.useState)(false);
  const [kind, setKind] = (0, import_react29.useState)("skill");
  const [mcpTab, setMcpTab] = (0, import_react29.useState)("server");
  const [mcpInfoOpen, setMcpInfoOpen] = (0, import_react29.useState)(false);
  const [mcpServers, setMcpServers] = (0, import_react29.useState)(() => loadStoredMcps());
  const [mcpRecommended, setMcpRecommended] = (0, import_react29.useState)(FALLBACK_RECOMMENDED);
  const [mcpLive, mcpRefreshLive] = useMcpLiveState();
  (0, import_react29.useEffect)(() => {
    let current = true;
    void fetch("/api/mcp-recommended", { headers: { accept: "application/json" } }).then((response) => response.json().catch(() => null)).then((body) => {
      if (!current || body === null || typeof body !== "object" || !Array.isArray(body.servers)) return;
      const rows = body.servers.filter((item) => typeof item === "object" && item !== null && typeof item.name === "string" && item.name !== "").map((item) => ({
        id: typeof item.id === "string" && item.id !== "" ? item.id : `rec-${item.name}`,
        name: item.name,
        description: typeof item.description === "string" ? item.description : "",
        tag: item.tag === "community" ? "community" : "official",
        category: typeof item.category === "string" && item.category !== "" ? item.category : "\u7CBE\u9009",
        enabled: false,
        source: "recommended",
        url: typeof item.url === "string" ? item.url : void 0
      }));
      if (current && rows.length > 0) setMcpRecommended(rows);
    }, () => {
    });
    return () => {
      current = false;
    };
  }, []);
  const [mcpLogs, setMcpLogs] = (0, import_react29.useState)(() => loadStoredLogs());
  const [mcpAddOpen, setMcpAddOpen] = (0, import_react29.useState)(false);
  const pushMcpLog = (kind2, name) => {
    setMcpLogs((current) => {
      const next = [...current, { id: `log-${String(Date.now())}-${Math.random().toString(36).slice(2, 6)}`, time: Date.now(), kind: kind2, name }].slice(-100);
      saveStoredLogs(next);
      return next;
    });
  };
  const mutateMcps = (rows) => {
    setMcpServers(rows);
    saveStoredMcps(rows);
  };
  const addRecommendMcp = (row) => {
    if (mcpServers.some((item) => item.id === row.id)) return;
    mutateMcps([...mcpServers, { ...row, enabled: true }]);
    pushMcpLog("add", row.name);
  };
  const addCustomMcp = (row) => {
    mutateMcps([...mcpServers, { ...row, id: `custom-${String(Date.now())}`, source: "custom" }]);
    pushMcpLog("add", row.name);
  };
  const toggleMcp = (id) => {
    const target = mcpServers.find((row) => row.id === id);
    mutateMcps(mcpServers.map((row) => row.id === id ? { ...row, enabled: !row.enabled } : row));
    if (target !== void 0) pushMcpLog(target.enabled ? "disable" : "enable", target.name);
  };
  const toggleMcpAutostart = (id) => {
    mutateMcps(mcpServers.map((row) => row.id === id ? { ...row, autostart: !row.autostart } : row));
  };
  const removeMcp = (id) => {
    const target = mcpServers.find((row) => row.id === id);
    mutateMcps(mcpServers.filter((row) => row.id !== id));
    if (target !== void 0) pushMcpLog("remove", target.name);
  };
  const refresh = () => {
    void Promise.resolve().then(() => (init_skill_source(), skill_source_exports)).then(({ invalidateSkillCache: invalidateSkillCache2 }) => invalidateSkillCache2());
    setReload((value) => value + 1);
  };
  const silentSync = () => {
    void Promise.resolve().then(() => (init_skill_source(), skill_source_exports)).then(({ invalidateSkillCache: invalidateSkillCache2 }) => invalidateSkillCache2());
    void skillApi.list().then((snapshot) => {
      setState((current) => current.status === "error" ? current : { status: "ready", snapshot });
    }, () => {
    });
    void skillApi.presetStatus().then(
      (status) => {
        setToggles({ skills: status.skills, bundles: status.bundles });
        setOverrides(status.overrides);
        setPresets(status.presets);
      },
      () => {
        void skillApi.toggleStatus().then((status) => {
          setToggles(status);
        }, () => {
        });
      }
    );
    void skillApi.health().then(
      (report) => {
        setHealth(report.ok ? { state: "ok", report } : { state: "issue", report });
      },
      () => {
      }
    );
  };
  (0, import_react29.useEffect)(() => {
    const timer = window.setInterval(silentSync, 3e4);
    const onVis = () => {
      if (document.visibilityState === "visible") silentSync();
    };
    const onFocus = () => {
      silentSync();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  const refreshTogglesOnly = () => {
    void Promise.resolve().then(() => (init_skill_source(), skill_source_exports)).then(({ invalidateSkillCache: invalidateSkillCache2 }) => invalidateSkillCache2());
    void skillApi.presetStatus().then(
      (status) => {
        setToggles({ skills: status.skills, bundles: status.bundles });
        setOverrides(status.overrides);
        setPresets(status.presets);
      },
      () => {
        void skillApi.toggleStatus().then((status) => {
          setToggles(status);
        }, () => {
        });
      }
    );
  };
  const t = skillT;
  (0, import_react29.useEffect)(() => {
    let current = true;
    setState({ status: "loading" });
    void skillApi.list().then(
      (snapshot) => {
        if (current) setState({ status: "ready", snapshot });
      },
      () => {
        if (current) setState({ status: "error" });
      }
    );
    void skillApi.presetStatus().then(
      (status) => {
        if (!current) return;
        setToggles({ skills: status.skills, bundles: status.bundles });
        setOverrides(status.overrides);
        setPresets(status.presets);
      },
      () => {
        void skillApi.toggleStatus().then(
          (status) => {
            if (current) setToggles(status);
          },
          () => {
          }
        );
      }
    );
    setHealth({ state: "loading" });
    void skillApi.health().then(
      (report) => {
        if (current) setHealth(report.ok ? { state: "ok", report } : { state: "issue", report });
      },
      () => {
        if (current) setHealth({ state: "unavailable" });
      }
    );
    return () => {
      current = false;
    };
  }, [reload]);
  (0, import_react29.useEffect)(() => () => {
    if (renamedTimer.current !== null) window.clearTimeout(renamedTimer.current);
    for (const timer of toastTimers.current) window.clearTimeout(timer);
  }, []);
  const [guidePos, setGuidePos] = (0, import_react29.useState)(null);
  (0, import_react29.useEffect)(() => {
    if (!guideOpen && !mcpInfoOpen) return;
    const marker = document.querySelector("[data-skm-panel-marker]");
    const card = marker?.closest(".psh-card");
    if (!(card instanceof HTMLElement)) return;
    const rect = card.getBoundingClientRect();
    const vh = window.innerHeight;
    const top = Math.max(8, rect.top);
    const overlayW = mcpInfoOpen ? 330 : 300;
    setGuidePos({
      left: Math.max(rect.left + 12, rect.right - overlayW - 12),
      top,
      height: Math.min(rect.height, vh - top - 12)
    });
  }, [guideOpen, mcpInfoOpen]);
  const runToggle = async (key, action) => {
    if (toggling.has(key)) return;
    setToggling((current) => new Set(current).add(key));
    setInstallError(null);
    try {
      await action();
      refreshTogglesOnly();
    } catch (error) {
      pushToast("err", skillT("toggleFailed", { message: error instanceof Error ? error.message : String(error) }));
    } finally {
      setToggling((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }
  };
  const toggleSkill = (skill, enabled) => {
    if (activePreset === ALL_PRESETS) {
      void runToggle(`skill:${skill.name}`, () => skillApi.setSkillEnabled(skill.name, enabled));
      return;
    }
    void runToggle(
      `skill:${skill.name}`,
      () => skillApi.setPresetSkillEnabled(activePreset, skill.name, enabled)
    );
  };
  const toggleBundle = (bundle, enabled) => {
    if (activePreset === ALL_PRESETS) {
      void runToggle(`bundle:${bundle.id}`, () => skillApi.setBundleEnabled(bundle.id, enabled));
      return;
    }
    void runToggle(
      `bundle:${bundle.id}`,
      () => skillApi.setPresetBundleEnabled(activePreset, bundle.id, enabled)
    );
  };
  const presetOverride = activePreset === ALL_PRESETS ? {} : overrides[activePreset] ?? {};
  const skillEnabledAt = (presetId, name) => {
    if (toggles.skills[name] === false) return false;
    if (presetId === ALL_PRESETS) return true;
    return (overrides[presetId] ?? {})[name] !== false;
  };
  const enabledCountFor = (presetId) => {
    let n = 0;
    for (const bundle of bundles) for (const skill of bundle.skills) if (skillEnabledAt(presetId, skill.name)) n += 1;
    for (const skill of loose) if (skillEnabledAt(presetId, skill.name)) n += 1;
    return n;
  };
  const skillEnabledIn = (name) => skillEnabledAt(activePreset, name);
  const bundleEnabledIn = (bundle) => {
    if (activePreset === ALL_PRESETS) return toggles.bundles[bundle.id] !== false;
    return bundle.skills.every((skill) => skillEnabledIn(skill.name));
  };
  const skillLockedReason = (name) => activePreset !== ALL_PRESETS && toggles.skills[name] === false ? t("presetLockedByGlobal") : void 0;
  const resetActivePreset = () => {
    if (activePreset === ALL_PRESETS) return;
    void runToggle(`reset:${activePreset}`, () => skillApi.resetPreset(activePreset));
  };
  const toggleExpanded = (bundleId) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(bundleId)) next.delete(bundleId);
      else next.add(bundleId);
      return next;
    });
  };
  const loadViewerContent = async (skillName2, filePath) => {
    try {
      const res = await fetch(`/api/skill-manager/skills/${encodeURIComponent(skillName2)}/files/${encodeURIComponent(filePath)}`);
      const body = await res.json();
      if (body.error !== void 0) throw new Error(String(body.error));
      setViewer((v) => v === null ? v : { ...v, loading: false, content: body.content ?? "" });
    } catch (error) {
      setViewer((v) => v === null ? v : { ...v, loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  };
  const openViewer = (skill) => {
    setViewer({ skill, file: "SKILL.md", loading: true });
    void loadViewerContent(skill.name, "SKILL.md");
  };
  const setViewerFontLevel = (level) => {
    setViewerFont(Math.min(Math.max(level, 0), VIEWER_FONT_SIZES.length - 1));
  };
  const toggleViewerFull = () => {
    setViewerFull((current) => !current);
  };
  (0, import_react29.useEffect)(() => {
    writeViewerPrefs({ font: viewerFont, full: viewerFull });
  }, [viewerFont, viewerFull]);
  const selectViewerFile = (filePath) => {
    if (viewer === null) return;
    setViewer({ ...viewer, file: filePath, loading: true, error: void 0 });
    void loadViewerContent(viewer.skill.name, filePath);
  };
  const doAssign = async (skill, bundleId) => {
    try {
      if (state.status !== "ready") return;
      const bundle = state.snapshot.bundles.find((candidate) => candidate.id === bundleId);
      if (bundle === void 0) throw new Error("bundle not found");
      await skillApi.setBundleSkills(bundleId, [...bundle.skills.map((s) => s.name), skill.name]);
      setAssignTarget(null);
      pushToast("ok", skillT("assignOk", { name: skill.name }));
      refresh();
    } catch (error) {
      failToast("\u5F52\u5165\u6280\u80FD\u5305", error);
    }
  };
  const acceptFiles = (files) => {
    if (files === null || files.length === 0) return;
    const collected = [];
    for (const file of files) {
      const relative = file.webkitRelativePath;
      if (relative === "") continue;
      const parts = relative.split("/");
      if (parts.length < 2) continue;
      collected.push({ path: parts.slice(1).join("/"), file });
    }
    if (collected.length === 0) return;
    const zipCandidate = collected.length === 1 && collected[0].path.toLowerCase().endsWith(".zip") ? collected[0] : void 0;
    if (zipCandidate !== void 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result ?? "").split(",")[1] ?? "";
        setInstall({ archive: true, name: zipCandidate.path, data, folderName: zipCandidate.path });
        setInstallError(null);
        setAddOpen(true);
      };
      reader.readAsDataURL(zipCandidate.file);
      return;
    }
    const rootName = collected[0]?.path.split("/")[0] ?? "";
    setInstallName(rootName);
    setInstallError(null);
    setInstall({ files: collected, folderName: rootName });
    setAddOpen(true);
  };
  const onDrop = async (event) => {
    event.preventDefault();
    setDropActive(false);
    const collected = [];
    const items = event.dataTransfer.items;
    if (items === void 0) return;
    const pending = [];
    for (const item of Array.from(items)) {
      const entry = item.webkitGetAsEntry?.();
      if (entry !== void 0 && entry !== null) pending.push(collectEntry(entry, "", collected));
    }
    await Promise.all(pending);
    if (collected.length === 0) return;
    const zipCandidate = collected.length === 1 && collected[0].path.toLowerCase().endsWith(".zip") ? collected[0] : void 0;
    if (zipCandidate !== void 0) {
      setInstall({ archive: true, name: zipCandidate.path, data: await fileToBase64(zipCandidate.file), folderName: zipCandidate.path });
      setInstallError(null);
      setAddOpen(true);
      return;
    }
    const rootName = collected[0]?.path.split("/")[0] ?? "";
    setInstallName(rootName);
    setInstallError(null);
    setInstall({ files: collected, folderName: rootName });
    setAddOpen(true);
  };
  const confirmInstall = async (event) => {
    event.preventDefault();
    if (install === null || installing) return;
    if (install.archive !== true && installName.trim() === "") return;
    setInstalling(true);
    setInstallError(null);
    try {
      let installed = {};
      if (install.archive === true) {
        installed = await skillApi.installSkill({
          archive: install.data,
          description: installDescription.trim(),
          ...installBundleId === void 0 ? {} : { bundleId: installBundleId }
        });
      } else {
        const files = await Promise.all(install.files.map(async ({ path, file }) => ({
          path,
          data: await fileToBase64(file)
        })));
        installed = await skillApi.installSkill({
          skillName: installName.trim(),
          description: installDescription.trim(),
          ...installBundleId === void 0 ? {} : { bundleId: installBundleId },
          files
        });
      }
      pushToast("ok", skillT("installedOk", { name: installed.name ?? installName.trim() }));
      setInstall(null);
      setInstallName("");
      setInstallDescription("");
      setInstallBundleId(void 0);
      setAddOpen(false);
      refresh();
    } catch (error) {
      setInstallError(error instanceof Error ? error.message : String(error));
    } finally {
      setInstalling(false);
    }
  };
  const submitNewBundle = async (event) => {
    event.preventDefault();
    if (creatingBundle || newBundleName.trim() === "") return;
    setCreatingBundle(true);
    try {
      const created = newBundleName.trim();
      await skillApi.createBundle(created);
      setNewBundleName("");
      setNewBundleOpen(false);
      pushToast("ok", skillT("bundleCreated", { name: created }));
      refresh();
    } catch (error) {
      failToast("\u65B0\u5EFA\u6280\u80FD\u5305", error);
    } finally {
      setCreatingBundle(false);
    }
  };
  const submitRename = async (event) => {
    event.preventDefault();
    if (renaming || renameTarget === null || renameTarget.name.trim() === "") return;
    setRenaming(true);
    try {
      await skillApi.renameBundle(renameTarget.bundleId, renameTarget.name.trim());
      const renamedId = renameTarget.bundleId;
      if (renamedTimer.current !== null) window.clearTimeout(renamedTimer.current);
      setRenamedFlash(renamedId);
      renamedTimer.current = window.setTimeout(() => {
        setRenamedFlash(null);
      }, 1600);
      setRenameTarget(null);
      refresh();
    } catch (error) {
      failToast("\u91CD\u547D\u540D\u6280\u80FD\u5305", error);
    } finally {
      setRenaming(false);
    }
  };
  const confirmDelete = async () => {
    if (confirm === null || confirming) return;
    setConfirming(true);
    const label = confirm.kind === "bundle" ? confirm.bundle.name : confirm.name;
    try {
      if (confirm.kind === "bundle") await skillApi.deleteBundle(confirm.bundle.id);
      else await skillApi.deleteSkill(confirm.name);
      setConfirm(null);
      pushToast("ok", confirm.kind === "bundle" ? skillT("bundleDeleted", { name: label }) : skillT("deletedOk", { name: label }));
      refresh();
    } catch (error) {
      failToast(confirm.kind === "bundle" ? "\u5220\u9664\u6280\u80FD\u5305" : "\u5220\u9664\u6280\u80FD", error);
    } finally {
      setConfirming(false);
    }
  };
  const removeFromBundle = async (bundleId, name) => {
    try {
      if (state.status !== "ready") return;
      const bundle = state.snapshot.bundles.find((candidate) => candidate.id === bundleId);
      if (bundle === void 0) return;
      await skillApi.setBundleSkills(bundleId, bundle.skills.map((skill) => skill.name).filter((skillName2) => skillName2 !== name));
      pushToast("ok", skillT("removedOk", { name }));
      refresh();
    } catch (error) {
      failToast("\u79FB\u51FA\u6280\u80FD\u5305", error);
    }
  };
  const pruneBundle = async (bundle) => {
    try {
      const full = state.status === "ready" ? state.snapshot.bundles.find((candidate) => candidate.id === bundle.id) ?? bundle : bundle;
      await skillApi.setBundleSkills(bundle.id, full.skills.map((skill) => skill.name));
      pushToast("ok", skillT("pruned"));
      refresh();
    } catch (error) {
      failToast("\u6E05\u7406\u5931\u6548\u5F15\u7528", error);
    }
  };
  const openInstallFor = (bundleId) => {
    setInstall(null);
    setInstallError(null);
    setInstallBundleId(bundleId);
    setAddOpen(true);
  };
  const bundles = state.status === "ready" ? state.snapshot.bundles : [];
  const loose = state.status === "ready" ? state.snapshot.loose : [];
  const scopeLabel = activePreset === ALL_PRESETS ? t("scopeAll") : presets.find((preset) => preset.id === activePreset)?.name ?? activePreset;
  const q = query.trim().toLowerCase();
  const qMatch = (skill) => {
    if (q === "") return true;
    if (skill.name.toLowerCase().includes(q)) return true;
    return (skill.description ?? "").toLowerCase().includes(q);
  };
  const statusMatch = (skill) => {
    if (statusFilter === "all") return true;
    const on = activePreset === ALL_PRESETS ? toggles.skills[skill.name] !== false : skillEnabledAt(activePreset, skill.name);
    return statusFilter === "on" ? on : !on;
  };
  const sortedSkills = (list) => [...list].sort((a, b) => {
    const order = a.name.localeCompare(b.name);
    return sortAsc ? order : -order;
  });
  const filteredSkills = (list) => sortedSkills(list.filter((skill) => qMatch(skill) && statusMatch(skill)));
  const filtering = q !== "" || statusFilter !== "all";
  const visibleBundleAll = (sourceFilter === "loose" ? [] : bundles).map((bundle) => ({ ...bundle, skills: filteredSkills(bundle.skills) })).filter((bundle) => bundle.skills.length > 0 || bundle.skillCount === 0 && !filtering);
  const visibleLooseAll = sourceFilter === "bundles" ? [] : filteredSkills(loose);
  const totalSkills = bundles.reduce((n, bundle) => n + bundle.skillCount, 0) + loose.length;
  const bundleCount = bundles.length;
  const healthView = health.state === "ok" ? { tone: "ok", label: t("statHealthy"), title: t("statHealthy") } : health.state === "issue" ? { tone: "warn", label: t("statIssues", { n: health.report.issues.length }), title: health.report.issues.map((issue) => issue.message).join("\n") } : health.state === "unavailable" ? { tone: "pending", label: t("statPending"), title: t("statPending") } : { tone: "idle", label: t("statChecking"), title: "" };
  const enabledCount = (() => {
    let n = 0;
    for (const bundle of bundles) for (const skill of bundle.skills) if (toggles.skills[skill.name] !== false) n += 1;
    for (const skill of loose) if (toggles.skills[skill.name] !== false) n += 1;
    return n;
  })();
  const noResults = visibleBundleAll.length === 0 && visibleLooseAll.length === 0;
  const trimmedName = installName.trim();
  const nameInvalid = trimmedName !== "" && !SKILL_NAME_PATTERN.test(trimmedName);
  const confirmTitle = confirm === null ? t("deleteSkillConfirm", { name: "" }) : confirm.kind === "bundle" ? t("deleteBundleConfirm", { name: confirm.bundle.name }) : t("deleteSkillConfirm", { name: confirm.name }) + (confirm.kind === "skill" && confirm.dir !== void 0 && confirm.dir !== confirm.name ? t("deleteSkillDirNote", { dir: confirm.dir }) : "");
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
    PopoverShell,
    {
      solid: true,
      closing,
      onClose: () => {
        if (installing || confirming) return;
        if (newBundleOpen || addOpen || confirm !== null || viewer !== null || assignTarget !== null) return;
        onClose();
      },
      anchor,
      onCardMouseEnter,
      onCardMouseLeave,
      size: { width: 1150, height: 860 },
      ariaLabel: t("panelTitle"),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: "psh-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "psh-title", style: { flex: "none" }, children: t("panelTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.kindTabs, role: "tablist", "aria-label": "SKILL / MCP", children: [
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": kind === "skill",
                className: `${css3.kindTab} ${kind === "skill" ? css3.kindTabActive : ""}`,
                "data-active": kind === "skill" || void 0,
                onClick: () => {
                  setKind("skill");
                },
                children: t("kindSkill")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": kind === "mcp",
                className: `${css3.kindTab} ${kind === "mcp" ? css3.kindTabActive : ""}`,
                "data-active": kind === "mcp" || void 0,
                onClick: () => {
                  setKind("mcp");
                },
                children: t("kindMcp")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(PshBody, { className: css3.modalBody, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { "data-skm-panel-marker": true, "aria-hidden": "true", style: { display: "none" } }),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.hub, "aria-busy": state.status === "loading", children: [
            kind === "skill" && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
              "div",
              {
                className: css3.topbar,
                "data-drop": dropActive || void 0,
                onDragOver: (event) => {
                  event.preventDefault();
                  setDropActive(true);
                },
                onDragLeave: () => {
                  setDropActive(false);
                },
                onDrop: (event) => {
                  void onDrop(event);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.chipRow, role: "group", "aria-label": t("presetCatTitle"), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                      "button",
                      {
                        type: "button",
                        className: `${css3.catItem} ${activePreset === ALL_PRESETS ? css3.catItemActive : ""}`,
                        "data-active": activePreset === ALL_PRESETS || void 0,
                        onClick: () => {
                          setActivePreset(ALL_PRESETS);
                        },
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catIcon, "data-active": activePreset === ALL_PRESETS || void 0, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CatAllIcon, { size: 16 }) }),
                          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catLabel, children: t("presetAll") }),
                          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catCount, title: t("presetCountTip", { n: enabledCountFor(ALL_PRESETS), total: totalSkills }), children: enabledCountFor(ALL_PRESETS) })
                        ]
                      }
                    ),
                    presets.map((preset) => {
                      const overrideCount = Object.values(overrides[preset.id] ?? {}).filter((state2) => state2 === false).length;
                      return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                        "button",
                        {
                          type: "button",
                          className: `${css3.catItem} ${activePreset === preset.id ? css3.catItemActive : ""}`,
                          "data-active": activePreset === preset.id || void 0,
                          onClick: () => {
                            setActivePreset(preset.id);
                          },
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catIcon, "data-active": activePreset === preset.id || void 0, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconAgentPresetOutline16, { size: 15 }) }),
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.catLabel, children: preset.name ?? preset.id }),
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                              "span",
                              {
                                className: css3.catCount,
                                "data-warn": overrideCount > 0 || void 0,
                                title: t("presetCountTip", { n: enabledCountFor(preset.id), total: totalSkills }) + (overrideCount > 0 ? ` \xB7 ${t("presetOverrideCount", { n: overrideCount })}` : ""),
                                children: enabledCountFor(preset.id)
                              }
                            )
                          ]
                        },
                        preset.id
                      );
                    })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.statusSeg, role: "group", "aria-label": t("statusAll"), children: [["all", t("statusAll")], ["on", t("statusOn")], ["off", t("statusOff")]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                    "button",
                    {
                      type: "button",
                      className: `${css3.statusSegBtn} ${statusFilter === value ? css3.statusSegActive : ""}`,
                      "data-active": statusFilter === value || void 0,
                      "aria-pressed": statusFilter === value,
                      onClick: () => {
                        setStatusFilter(value);
                      },
                      children: label
                    },
                    value
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.hubMain, children: kind === "mcp" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
              McpView,
              {
                t,
                tab: mcpTab,
                onTab: setMcpTab,
                onOpenInfo: () => {
                  setMcpInfoOpen(true);
                },
                servers: mcpServers,
                recommended: mcpRecommended,
                onAdd: addRecommendMcp,
                live: mcpLive,
                onAddCustom: () => {
                  setMcpAddOpen(true);
                },
                logs: mcpLogs,
                onClearLogs: () => {
                  setMcpLogs([]);
                  saveStoredLogs([]);
                },
                onRefresh: () => {
                  mcpRefreshLive();
                },
                onLogged: pushMcpLog
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
              "          ",
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.statsRow, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.stat, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statIconCol, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statIcon, "data-tone": "blue", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(StatCubeIcon, { size: 20 }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("i", { className: css3.statGlow, "data-tone": "blue", "aria-hidden": "true" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statBody, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statLabel, children: t("statManaged") }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValueRow, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValue, children: totalSkills }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statDesc, children: t("statManagedDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.stat, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statIconCol, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statIcon, "data-tone": "green", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(StatCheckCircleIcon, { size: 20 }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("i", { className: css3.statGlow, "data-tone": "green", "aria-hidden": "true" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statBody, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statLabel, children: t("statEnabled") }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValueRow, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValue, children: enabledCount }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statDesc, children: t("statEnabledDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.stat, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statIconCol, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statIcon, "data-tone": "violet", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(StatSquareIcon, { size: 20 }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("i", { className: css3.statGlow, "data-tone": "violet", "aria-hidden": "true" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statBody, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statLabel, children: t("statLoose") }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValueRow, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statValue, children: loose.length }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statDesc, children: t("statLooseDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.stat, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statIconCol, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statIcon, "data-tone": "orange", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(StatHeartIcon, { size: 20 }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("i", { className: css3.statGlow, "data-tone": "orange", "aria-hidden": "true" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statBody, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statLabel, children: t("statSync") }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.statValueRow, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                        "span",
                        {
                          className: css3.statValue,
                          "data-tone": healthView.tone === "warn" ? "warn" : healthView.tone === "pending" ? "pending" : void 0,
                          title: healthView.title === "" ? void 0 : healthView.title,
                          children: healthView.label
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconChevronRightOutline14, { className: css3.statChevron, size: 16, "aria-hidden": "true" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.statDesc, children: t("statSyncDesc") })
                  ] })
                ] })
              ] }),
              health.state === "issue" && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.healthNotice, role: "status", children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.healthNoticeTitle, children: t("statIssues", { n: health.report.issues.length }) }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { children: health.report.issues.slice(0, 4).map((issue, index) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("li", { children: issue.message }, `${issue.code}-${String(index)}`)) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.hintRow, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.hintRowText, children: activePreset === ALL_PRESETS ? t("presetHintAll") : t("presetHintScoped", { name: presets.find((preset) => preset.id === activePreset)?.name ?? activePreset }) }),
                activePreset !== ALL_PRESETS && Object.keys(presetOverride).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.presetReset, onClick: resetActivePreset, children: t("presetReset") })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.toolbar, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.searchBox, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SearchIcon, {}),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                    "input",
                    {
                      className: css3.searchInput,
                      value: query,
                      placeholder: t("searchPlaceholder"),
                      "aria-label": t("searchPlaceholder"),
                      onChange: (event) => {
                        setQuery(event.currentTarget.value);
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.dropWrap, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                    "button",
                    {
                      type: "button",
                      className: css3.toolButton,
                      "aria-haspopup": "menu",
                      "aria-expanded": openMenu === "sort" || void 0,
                      onClick: () => {
                        setOpenMenu((value) => value === "sort" ? null : "sort");
                      },
                      children: [
                        t("sortLabel"),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(SortDirIcon, { dir: sortAsc ? "asc" : "desc", size: 12 }),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconChevronDownOutline14, { size: 11, "aria-hidden": "true" })
                      ]
                    }
                  ),
                  openMenu === "sort" && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.bulkOverlay, "aria-label": t("close"), onClick: () => {
                      setOpenMenu(null);
                    } }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.dropMenu, role: "menu", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                        "button",
                        {
                          type: "button",
                          role: "menuitemradio",
                          className: css3.dropItem,
                          "aria-checked": sortAsc,
                          onClick: () => {
                            setSortAsc(true);
                            setOpenMenu(null);
                          },
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.dropCheck, "data-on": sortAsc || void 0, "aria-hidden": "true", children: sortAsc ? "\u2713" : "" }),
                            t("nameAsc")
                          ]
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                        "button",
                        {
                          type: "button",
                          role: "menuitemradio",
                          className: css3.dropItem,
                          "aria-checked": !sortAsc,
                          onClick: () => {
                            setSortAsc(false);
                            setOpenMenu(null);
                          },
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.dropCheck, "data-on": !sortAsc || void 0, "aria-hidden": "true", children: !sortAsc ? "\u2713" : "" }),
                            t("nameDesc")
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.toolbarSpacer }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                  "button",
                  {
                    type: "button",
                    className: `${css3.newBundleBtn} ${newBundleOpen ? css3.newBundleBtnOpen : ""}`,
                    style: { width: "auto", marginTop: 0, height: 34, fontSize: 12 },
                    "aria-expanded": newBundleOpen || void 0,
                    onClick: () => {
                      setNewBundleOpen(true);
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconPlusOutline16, { size: 14, "aria-hidden": "true" }),
                      t("newBundle")
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                  "button",
                  {
                    type: "button",
                    className: css3.addBtn,
                    style: { height: 34, alignSelf: "center" },
                    "aria-label": t("addSkillsTitle"),
                    title: t("addSkillsSub"),
                    onClick: () => {
                      setInstall(null);
                      setInstallError(null);
                      setAddOpen(true);
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CloudUpIcon, { size: 15, "aria-hidden": "true" }),
                      t("addSkillsTitle")
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                  "input",
                  {
                    ref: fileInput,
                    type: "file",
                    className: css3.hiddenInput,
                    multiple: true,
                    ...{ webkitdirectory: "" },
                    onChange: (event) => {
                      acceptFiles(event.currentTarget.files === null ? null : Array.from(event.currentTarget.files));
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: `${css3.mainScroll} ${modalStaggerClass}`, children: [
                state.status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.status, children: t("loading") }) : null,
                state.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.failure, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { role: "alert", children: t("error") }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_dsh_client_ui_primitives6.Button, { variant: "outline", onClick: refresh, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconRefreshOutline14, {}),
                    " ",
                    t("retry")
                  ] })
                ] }) : null,
                state.status === "ready" && (noResults ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.noResult, children: t("noMatch") }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
                  visibleBundleAll.map((bundle) => {
                    const open2 = expanded.has(bundle.id);
                    const renamingThis = renameTarget?.bundleId === bundle.id;
                    const bundleEnabled = bundleEnabledIn(bundle);
                    const bundleToggling = toggling.has(`bundle:${bundle.id}`);
                    const gridClass = viewMode === "list" ? `${css3.skillGrid} ${css3.skillGridList}` : css3.skillGrid;
                    const missing = bundle.missingSkills ?? [];
                    const emptyBundle = bundle.skillCount === 0;
                    const openView = open2 || emptyBundle;
                    return /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.hubSection, "data-open": openView ? "true" : void 0, "data-empty": emptyBundle ? "true" : void 0, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                        "header",
                        {
                          className: css3.bundleRowOuter,
                          "data-open": openView ? "true" : void 0,
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                              "button",
                              {
                                type: "button",
                                className: css3.bundleRow,
                                "aria-expanded": openView,
                                onClick: () => {
                                  toggleExpanded(bundle.id);
                                },
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleIcon, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(FolderBlueIcon, { size: 17 }) }),
                                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleName, title: bundle.name, children: bundle.name }),
                                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleCount, children: t("skillsCount", { n: bundle.skillCount }) }),
                                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconChevronDownOutline14, { className: css3.chevron, size: 13, "aria-hidden": "true" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleToggle, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                              "button",
                              {
                                type: "button",
                                role: "switch",
                                "aria-checked": bundleEnabled,
                                "aria-label": bundleEnabled ? t("disableBundle") : t("enableBundle"),
                                title: bundleEnabled ? t("disableBundle") : t("enableBundle"),
                                className: `${css3.toggle} ${bundleEnabled ? css3.toggleOn : css3.toggleOff}`,
                                disabled: bundleToggling || bundle.skillCount === 0,
                                onClick: (event) => {
                                  event.stopPropagation();
                                  toggleBundle(bundle, !bundleEnabled);
                                },
                                children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.toggleKnob, "aria-hidden": "true" })
                              }
                            ) }),
                            /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.bundleMore, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                              import_dsh_client_ui_primitives6.Menu,
                              {
                                open: openMenu === `bundle:${bundle.id}`,
                                onClose: () => {
                                  setOpenMenu(null);
                                },
                                onSelect: (id) => {
                                  setOpenMenu(null);
                                  if (id === "enable") toggleBundle(bundle, true);
                                  else if (id === "disable") toggleBundle(bundle, false);
                                  else if (id === "rename") setRenameTarget({ bundleId: bundle.id, name: bundle.name });
                                  else if (id === "delete") setConfirm({ kind: "bundle", bundle });
                                },
                                portal: true,
                                items: [
                                  { id: "enable", label: t("enableBundle"), icon: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconCheckOutline16, { size: 14 }) },
                                  { id: "disable", label: t("disableBundle"), icon: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconCloseOutline16, { size: 14 }) },
                                  { type: "separator", id: "gap" },
                                  { id: "rename", label: t("rename"), icon: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconEditOutline16, { size: 14 }) },
                                  { id: "delete", label: t("delete"), icon: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconTrashOutline16, { size: 14 }), danger: true }
                                ],
                                anchor: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                                  "button",
                                  {
                                    type: "button",
                                    className: css3.bundleMoreBtn,
                                    "aria-label": t("moreActions"),
                                    "aria-haspopup": "menu",
                                    "aria-expanded": openMenu === `bundle:${bundle.id}` || void 0,
                                    onClick: (event) => {
                                      event.stopPropagation();
                                      setOpenMenu(openMenu === `bundle:${bundle.id}` ? null : `bundle:${bundle.id}`);
                                    },
                                    children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconEllipsisOutline16, { size: 15, "aria-hidden": "true" })
                                  }
                                )
                              }
                            ) })
                          ]
                        }
                      ),
                      renamingThis && renameTarget !== null && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("form", { className: `${css3.inlineForm} ${css3.inlineFormBlock}`, onSubmit: (event) => {
                        void submitRename(event);
                      }, children: [
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                          "input",
                          {
                            className: css3.inlineInput,
                            value: renameTarget.name,
                            placeholder: t("renameBundlePlaceholder"),
                            "aria-label": t("renameBundlePlaceholder"),
                            autoFocus: true,
                            disabled: renaming,
                            onChange: (event) => {
                              const next = event.currentTarget.value;
                              setRenameTarget((current) => current === null ? current : { ...current, name: next });
                            }
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "primary", type: "submit", disabled: renaming || renameTarget.name.trim() === "", children: t("rename") }),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "outline", type: "button", disabled: renaming, onClick: () => {
                          setRenameTarget(null);
                        }, children: t("cancel") })
                      ] }),
                      missing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.bundleMissing, role: "status", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { children: t("bundleMissingN", { n: missing.length }) }),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("code", { children: missing.join("\u3001") }),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.bundleMissingBtn, onClick: () => {
                          void pruneBundle(bundle);
                        }, children: t("bundlePrune") })
                      ] }),
                      openView && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { className: gridClass, "data-renamed": renamedFlash === bundle.id ? "true" : void 0, children: bundle.skills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("li", { className: css3.bundleEmpty, children: [
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleEmptyTitle, children: t("bundleEmptyTitle") }),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleEmptyHint, children: t("bundleEmptyHint") }),
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("button", { type: "button", className: css3.bundleEmptyBtn, onClick: () => {
                          openInstallFor(bundle.id);
                        }, children: [
                          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CloudUpIcon, { size: 14 }),
                          t("bundleUploadHere")
                        ] })
                      ] }) : bundle.skills.map((skill, index) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                        SkillCard,
                        {
                          skill,
                          bundleId: bundle.id,
                          bundleName: bundle.name,
                          enabled: skillEnabledIn(skill.name),
                          lockedReason: skillLockedReason(skill.name),
                          scopeLabel,
                          index,
                          onToggle: toggleSkill,
                          onView: openViewer,
                          onRemove: (s) => {
                            void removeFromBundle(bundle.id, s.name);
                          },
                          onDelete: (s) => {
                            setConfirm({ kind: "skill", name: s.name, dir: s.dir });
                          }
                        },
                        skill.name
                      )) })
                    ] }, bundle.id);
                  }),
                  visibleLooseAll.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("section", { className: css3.hubSection, "data-open": looseOpen ? "true" : void 0, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                      "header",
                      {
                        className: css3.bundleRowOuter,
                        "data-open": looseOpen ? "true" : void 0,
                        children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                          "button",
                          {
                            type: "button",
                            className: css3.bundleRow,
                            "aria-expanded": looseOpen,
                            onClick: () => {
                              setLooseExpanded((value) => !value);
                            },
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleIcon, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconArchiveOutline20, { size: 16 }) }),
                              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleName, children: t("looseTitle") }),
                              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.bundleCount, children: t("skillsCount", { n: visibleLooseAll.length }) }),
                              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconChevronDownOutline14, { className: css3.chevron, size: 13, "aria-hidden": "true" })
                            ]
                          }
                        )
                      }
                    ),
                    looseOpen && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { className: viewMode === "list" ? `${css3.skillGrid} ${css3.skillGridList}` : css3.skillGrid, children: visibleLooseAll.map((skill, index) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                      SkillCard,
                      {
                        skill,
                        bundleId: null,
                        bundleName: null,
                        enabled: skillEnabledIn(skill.name),
                        lockedReason: skillLockedReason(skill.name),
                        scopeLabel,
                        index,
                        onToggle: toggleSkill,
                        onView: openViewer,
                        onAssign: (s) => {
                          setAssignTarget(s);
                        },
                        onDelete: (s) => {
                          setConfirm({ kind: "skill", name: s.name, dir: s.dir });
                        }
                      },
                      skill.name
                    )) })
                  ] })
                ] }))
              ] })
            ] }) })
          ] })
        ] }),
        toasts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.toastStack, role: "status", "aria-live": "polite", children: toasts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: `${css3.toast} ${item.tone === "err" ? css3.toastErr : css3.toastOk}`, "data-tone": item.tone, children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("i", { className: css3.toastDot, "aria-hidden": "true" }),
          item.text
        ] }, item.id)) }),
        guideOpen && guidePos !== null && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(GuidePanel, { t, onClose: () => {
          setGuideOpen(false);
        }, left: guidePos.left, top: guidePos.top, height: guidePos.height }),
        mcpInfoOpen && guidePos !== null && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(McpInfoOverlay, { t, onClose: () => {
          setMcpInfoOpen(false);
        }, left: guidePos.left, top: guidePos.top, height: guidePos.height }),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          McpAddModal,
          {
            t,
            open: mcpAddOpen,
            onClose: () => {
              setMcpAddOpen(false);
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          import_dsh_client_ui_primitives6.Modal,
          {
            open: newBundleOpen,
            onClose: () => {
              if (!creatingBundle) setNewBundleOpen(false);
            },
            closeLabel: t("close"),
            title: t("newBundle"),
            children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("form", { className: css3.inlineForm, onSubmit: (event) => {
              void submitNewBundle(event);
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                "input",
                {
                  className: css3.inlineInput,
                  value: newBundleName,
                  placeholder: t("newBundlePlaceholder"),
                  "aria-label": t("newBundlePlaceholder"),
                  autoFocus: true,
                  disabled: creatingBundle,
                  onChange: (event) => {
                    setNewBundleName(event.currentTarget.value);
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "primary", type: "submit", disabled: creatingBundle || newBundleName.trim() === "", children: t("create") }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "outline", type: "button", disabled: creatingBundle, onClick: () => {
                setNewBundleOpen(false);
              }, children: t("cancel") })
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          import_dsh_client_ui_primitives6.Modal,
          {
            open: addOpen,
            onClose: () => {
              if (installing) return;
              setAddOpen(false);
              setInstall(null);
              setDropActive(false);
            },
            closeLabel: t("close"),
            title: t("addSkillsTitle"),
            children: install === null ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
              "div",
              {
                className: `${css3.addCard} ${dropActive ? css3.addCardActive : ""}`,
                role: "button",
                tabIndex: 0,
                "aria-label": t("addSkillsTitle"),
                onClick: () => {
                  fileInput.current?.click();
                },
                onDragOver: (event) => {
                  event.preventDefault();
                  setDropActive(true);
                },
                onDragLeave: () => {
                  setDropActive(false);
                },
                onDrop: (event) => {
                  void onDrop(event);
                },
                onKeyDown: (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInput.current?.click();
                  }
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.addCardHead, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.addCardIcon, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CloudUpIcon, { size: 22 }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.addCardTitle, children: t("bannerTitle") })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.addCardSub, children: t("bannerSub") }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.addDrop, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(CloudUpIcon, { size: 18 }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.addDropText, children: t("dropHere") }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.addDropHint, children: t("dropFormat") })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("button", { type: "button", className: css3.addBtn, onClick: (event) => {
                    event.stopPropagation();
                    fileInput.current?.click();
                  }, children: t("browseImport") }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                    "input",
                    {
                      ref: fileInput,
                      type: "file",
                      className: css3.hiddenInput,
                      multiple: true,
                      ...{ webkitdirectory: "" },
                      onChange: (event) => {
                        acceptFiles(event.currentTarget.files === null ? null : Array.from(event.currentTarget.files));
                      }
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("form", { className: css3.installForm, onSubmit: (event) => {
              void confirmInstall(event);
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.installRow, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                  "input",
                  {
                    className: css3.inlineInput,
                    value: installName,
                    placeholder: install.archive === true ? t("installNameFromArchive") : t("installNamePlaceholder"),
                    "aria-label": t("installName"),
                    disabled: installing || install.archive === true,
                    onChange: (event) => {
                      setInstallName(event.currentTarget.value);
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                  "input",
                  {
                    className: css3.inlineInput,
                    value: installDescription,
                    placeholder: t("installDescription"),
                    "aria-label": t("installDescription"),
                    disabled: installing,
                    onChange: (event) => {
                      setInstallDescription(event.currentTarget.value);
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("label", { className: css3.bundleSelect, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.visuallyHidden, children: t("installBundle") }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                    "select",
                    {
                      value: installBundleId ?? "",
                      disabled: installing,
                      onChange: (event) => {
                        setInstallBundleId(event.currentTarget.value === "" ? void 0 : event.currentTarget.value);
                      },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: "", children: t("installLoose") }),
                        bundles.map((bundle) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("option", { value: bundle.id, children: bundle.name }, bundle.id))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.installMeta, children: install.archive === true ? t("uploadMeta", { n: 1, folder: install.folderName }) : t("uploadMeta", { n: install.files.length, folder: install.folderName }) })
              ] }),
              install.archive !== true && nameInvalid && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.error, role: "alert", children: t("installNameInvalid") }),
              install.archive !== true && !nameInvalid && trimmedName !== "" && installMetaName !== null && installMetaName !== trimmedName && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.installHint, children: t("installNameRewrite", { meta: installMetaName, name: trimmedName }) }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.installActions, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "primary", type: "submit", disabled: installing || install.archive !== true && (trimmedName === "" || nameInvalid), children: t("installConfirm") }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "outline", type: "button", disabled: installing, onClick: () => {
                  setInstall(null);
                  setAddOpen(false);
                }, children: t("installCancel") })
              ] }),
              installError !== null && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.error, role: "alert", children: installError })
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          import_dsh_client_ui_primitives6.Modal,
          {
            open: confirm !== null,
            onClose: () => {
              if (!confirming) setConfirm(null);
            },
            closeLabel: t("close"),
            title: confirmTitle,
            footer: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "outline", disabled: confirming, onClick: () => {
                setConfirm(null);
              }, children: t("cancel") }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.Button, { variant: "primary", disabled: confirming, onClick: () => {
                void confirmDelete();
              }, children: t("delete") })
            ] })
          }
        ),
        viewer !== null && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
          import_dsh_client_ui_primitives6.Modal,
          {
            open: true,
            onClose: () => {
              setViewer(null);
            },
            closeLabel: t("close"),
            title: viewer.skill.name + (viewer.file === "SKILL.md" ? "" : " \xB7 " + viewer.file),
            className: css3.viewerModal + (viewerFull ? " " + css3.viewerModalFull : ""),
            contentClassName: css3.viewerBody,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.viewerToolbar, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.viewerPath, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("b", { children: viewer.file }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { children: t("viewerFilesCount", { n: Array.isArray(viewer.skill.files) ? viewer.skill.files.length : 0 }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.viewerToolGroup, role: "group", "aria-label": t("viewerFont"), children: VIEWER_FONT_SIZES.map((size, level) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                  "button",
                  {
                    type: "button",
                    className: css3.viewerToolBtn + (level === 0 ? " " + css3.viewerToolBtnA1 : level === 2 ? " " + css3.viewerToolBtnA3 : ""),
                    "data-active": viewerFont === level ? "true" : void 0,
                    title: VIEWER_FONT_LABELS[level],
                    "aria-label": VIEWER_FONT_LABELS[level],
                    "aria-pressed": viewerFont === level,
                    onClick: () => {
                      setViewerFontLevel(level);
                    },
                    children: "A"
                  },
                  size
                )) }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                  "button",
                  {
                    type: "button",
                    className: css3.viewerToolBtn + " " + css3.viewerToolBtnFrame,
                    "data-active": viewerFull ? "true" : void 0,
                    title: viewerFull ? t("viewerExitFull") : t("viewerFull"),
                    "aria-label": viewerFull ? t("viewerExitFull") : t("viewerFull"),
                    "aria-pressed": viewerFull,
                    onClick: toggleViewerFull,
                    children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(ViewerExpandIcon, { full: viewerFull })
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("div", { className: css3.viewerLayout, children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("nav", { className: css3.viewerNav, "aria-label": t("viewerNav"), children: skillFileRows(Array.isArray(viewer.skill.files) ? viewer.skill.files : []).map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                  "div",
                  {
                    className: css3.viewerNavItem + (row.kind === "dir" ? " " + css3.viewerNavDir : ""),
                    "data-active": row.kind === "file" && row.path === viewer.file ? "true" : void 0,
                    "data-dir": row.kind === "dir" ? "true" : void 0,
                    style: { paddingLeft: 8 + row.depth * 14 },
                    title: row.path,
                    onClick: row.kind === "file" ? () => {
                      selectViewerFile(row.path);
                    } : void 0,
                    children: [
                      row.kind === "dir" ? "\u{1F4C1} " : "\u{1F4C4} ",
                      row.path
                    ]
                  },
                  row.path + "-" + String(index)
                )) }),
                /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: css3.viewerContent, style: { "--skm-vfs": `${String(VIEWER_FONT_SIZES[viewerFont])}px` }, children: viewer.loading === true ? t("previewLoading") : viewer.error !== void 0 ? viewer.error : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { dangerouslySetInnerHTML: { __html: renderSkillMarkdown(viewer.content ?? "") } }) })
              ] })
            ]
          }
        ),
        assignTarget !== null && /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
          import_dsh_client_ui_primitives6.Modal,
          {
            open: true,
            onClose: () => {
              setAssignTarget(null);
            },
            closeLabel: t("close"),
            title: t("assignTitle", { name: assignTarget.name }),
            className: css3.assignModal,
            contentClassName: css3.assignModalBody,
            children: bundles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("p", { className: css3.looseEmpty, children: t("assignEmpty") }) : /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("ul", { className: css3.assignList, children: bundles.map((bundle, index) => /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("li", { style: { listStyle: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
              "button",
              {
                type: "button",
                className: css3.assignCard,
                style: { "--skm-i": index },
                onClick: () => {
                  void doAssign(assignTarget, bundle.id);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.assignCardIcon, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconFolderOpenOutline16, { size: 16 }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)("span", { className: css3.assignCardBody, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.assignCardName, children: bundle.name }),
                    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.assignCardDesc, children: t("skillsCount", { n: bundle.skillCount }) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: css3.assignGo, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_dsh_client_ui_primitives6.IconChevronDownOutline14, { size: 14 }) })
                ]
              }
            ) }, bundle.id)) })
          }
        )
      ]
    }
  );
}

// src/client/usage/entry.tsx
var import_jsx_runtime36 = require("react/jsx-runtime");
function anchorFromEvent(e) {
  return navAnchorFrom(e.currentTarget);
}
function UsageWorkbenchEntry() {
  ensureModalAnimStyles();
  ensureShellStyles();
  const [open, setOpen] = (0, import_react30.useState)(false);
  const [anchor, setAnchor] = (0, import_react30.useState)(null);
  const { closing, requestClose } = useModalClose(open, () => {
    setOpen(false);
  });
  const rail = useRail();
  usePanelAutoClose("usage", open, requestClose);
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(import_jsx_runtime36.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      NavButton,
      {
        icon: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_dsh_client_ui_primitives7.IconDataOutline16, { size: rail ? 18 : 16 }),
        label: "\u7528\u91CF",
        rail,
        expanded: open,
        onClick: (e) => {
          e.stopPropagation();
          setAnchor(anchorFromEvent(e));
          setOpen(true);
        }
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(ErrorBoundary, { label: "\u7528\u91CF\u5DE5\u4F5C\u53F0", fallback: null, onError: requestClose, children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Workbench, { closing, onClose: requestClose, anchor }) })
  ] });
}
function SkillsEntry() {
  ensureModalAnimStyles();
  ensureShellStyles();
  const [open, setOpen] = (0, import_react30.useState)(false);
  const [anchor, setAnchor] = (0, import_react30.useState)(null);
  const { closing, requestClose } = useModalClose(open, () => {
    setOpen(false);
  });
  const rail = useRail();
  usePanelAutoClose("skills", open, requestClose);
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(import_jsx_runtime36.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      NavButton,
      {
        icon: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { width: rail ? 18 : 16, height: rail ? 18 : 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { d: "M13 2 3 14h7l-1 8 10-12h-7l1-8z" }) }),
        label: "\u80FD\u529B",
        rail,
        expanded: open,
        onClick: (e) => {
          e.stopPropagation();
          setAnchor(anchorFromEvent(e));
          setOpen(true);
        }
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(ErrorBoundary, { label: "\u6280\u80FD\u9762\u677F", fallback: null, onError: requestClose, children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(SkillsPanel, { closing, onClose: requestClose, anchor }) })
  ] });
}
function UsageSkillsNavApp() {
  ensureNavStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(import_jsx_runtime36.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(NavPortal, { name: "usage", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(UsageWorkbenchEntry, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(NavPortal, { name: "skills", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(SkillsEntry, {}) })
  ] });
}
function apply2(ctx) {
  ctx.effect(() => {
    ensureNavMount();
    const holder = document.createElement("div");
    const root = (0, import_client2.createRoot)(holder);
    root.render(/* @__PURE__ */ (0, import_jsx_runtime36.jsx)(UsageSkillsNavApp, {}));
    return () => {
      root.unmount();
    };
  }, "webui: usage/skills nav entries");
}

// src/client/index.ts
init_skill_source();
var inject = ["slots", "locale", "inputTriggers", "sessions"];
function safe(label, run, ctx) {
  try {
    run(ctx);
  } catch (error) {
    console.error(`[dsh-triad] ${label} failed:`, error);
  }
}
function apply3(ctx) {
  safe("memory", applyMemoryClient, ctx);
  safe("usage", apply2, ctx);
  safe("skills", apply, ctx);
}
return module.exports; } });
//# sourceMappingURL=client.js.map
