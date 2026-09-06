/**
 * dsh-memory 注入开关（composer 输入框工具行左端）。
 *
 * 点大脑按钮弹出小卡片，卡片里两个开关：
 *  - 本会话注入：只影响当前会话（host state.json 里的显式覆盖）；
 *  - 默认开启：config.injectDefaultEnabled，决定新会话与未单独设置过的会话。
 * 会话单独设置过时显示「已单独设置」角标，并可一键「跟随默认」清除覆盖
 * （清除后该会话重新跟随默认值）。状态全在 host，重启保留。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { InjectStateView, MemoryApi } from './api.js'
import { BrainIcon } from './Panel.tsx'
import { css, ensureStyles } from './styles.js'

/** 完整 props：composer 插槽 standardProps 的 sessionId + 注入 API 面 + locale。 */
export type MemoryToggleProps =
  { sessionId: string }
  & InjectFace<MemoryApi>
  & PropsLocale<'dshMemory'>

/** 卡片宽度（与 CSS 同步；用于视口内夹取）。 */
const CARD_W = 272

/** 把 host 回包收敛成本地状态形状（缺字段按默认处理）。 */
function toState(res: InjectStateView): InjectStateView {
  return {
    enabled: res.enabled !== false,
    defaultEnabled: res.defaultEnabled !== false,
    explicit: res.explicit === true,
  }
}

/** 渲染注入开关按钮 + 悬浮卡片。 */
export function MemoryToggle({ sessionId, t, ...api }: MemoryToggleProps): JSX.Element {
  ensureStyles()
  // inject 每次渲染返回新 api 对象；固定引用，否则 effect 依赖 api 每次变化
  // 都会重发 /inject-state —— 实测一分钟 498 次请求（请求风暴，composer 每渲染
  // 一次就触发一轮）。与 Panel/Notify 的 apiRef 同款处理。
  const apiRef = useRef(api)
  apiRef.current = api
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<InjectStateView>({ enabled: true, defaultEnabled: true, explicit: false })
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; bottom: number }>({ left: 8, bottom: 8 })
  const [busy, setBusy] = useState(false)

  const reload = useCallback((): void => {
    void apiRef.current.getInjectState(sessionId)
      .then(res => { setState(toState(res)) })
      .catch(() => { setState({ enabled: true, defaultEnabled: true, explicit: false }) })
  }, [sessionId])

  useEffect(() => { reload() }, [reload])

  /** 写会话级开关（null = 清除覆盖，回到默认）。 */
  const pushSession = useCallback((next: boolean | null): void => {
    setBusy(true)
    void apiRef.current.setInjectState(sessionId, next)
      .then(res => {
        setState(prev => ({
          enabled: res.enabled !== false,
          // 旧 host（未重启）不回 defaultEnabled / explicit 字段：缺字段时保留
          // 本地已知值，explicit 按本次动作推断，否则角标永远出不来。
          defaultEnabled: typeof res.defaultEnabled === 'boolean' ? res.defaultEnabled : prev.defaultEnabled,
          explicit: next === null ? false : (typeof res.explicit === 'boolean' ? res.explicit : true),
        }))
      })
      .catch(reload)
      .finally(() => { setBusy(false) })
  }, [sessionId, reload])

  /**
   * 写全局默认（config.injectDefaultEnabled），再回读会话态刷新按钮。
   *
   * 乐观更新：host 半身要重启 DSH 才认识这个键，旧进程会静默丢弃写入，
   * 回读于是把开关「弹回」原值，看着像按钮坏了。先按用户意图显示；host
   * 一旦回传该字段（新版）就以 host 为准。
   */
  const pushDefault = useCallback((next: boolean): void => {
    setBusy(true)
    setState(prev => ({ ...prev, defaultEnabled: next }))
    void apiRef.current.setConfig({ injectDefaultEnabled: next })
      .then(() => apiRef.current.getInjectState(sessionId))
      .then(res => {
        setState(prev => ({
          enabled: res.enabled !== false,
          defaultEnabled: typeof res.defaultEnabled === 'boolean' ? res.defaultEnabled : prev.defaultEnabled,
          explicit: typeof res.explicit === 'boolean' ? res.explicit : prev.explicit,
        }))
      })
      .catch(() => undefined)
      .finally(() => { setBusy(false) })
  }, [sessionId])

  /** 定位卡片：按钮正上方，左右夹进视口。 */
  const place = useCallback((): void => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (rect === undefined) return
    setPos({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - CARD_W - 8)),
      bottom: Math.max(8, window.innerHeight - rect.top + 8),
    })
  }, [])

  // 外点 / Esc / 视口变化 → 收起或跟随重算位置。
  useEffect(() => {
    if (!open) return undefined
    const onDown = (event: PointerEvent): void => {
      const node = event.target as Node | null
      if (node === null) return
      if (cardRef.current?.contains(node) === true || btnRef.current?.contains(node) === true) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent): void => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', place)
    }
  }, [open, place])

  const isOn = state.enabled !== false
  const isDefaultOn = state.defaultEnabled !== false
  const explicit = state.explicit === true
  return (
    <>
      <Tooltip label={isOn ? t('injectOn') : t('injectOff')} side="top" delayMs={500}>
        <button
          ref={btnRef}
          type="button"
          className={isOn ? `${css.toggle} ${css.toggleOn}` : `${css.toggle} ${css.toggleOff}`}
          aria-label={isOn ? t('injectOn') : t('injectOff')}
          aria-pressed={isOn}
          aria-expanded={open}
          onClick={() => { if (!open) place(); setOpen(value => !value) }}
        >
          <BrainIcon size={14} />
        </button>
      </Tooltip>
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={cardRef}
          className={css.injectCard}
          style={{ left: pos.left, bottom: pos.bottom }}
          role="dialog"
          aria-label={t('injectCardTitle')}
        >
          <div className={css.injectHead}>
            <span className={css.injectTitle}><BrainIcon size={13} />{t('injectCardTitle')}</span>
            <span className={isOn ? `${css.injectTag} ${css.injectTagOn}` : `${css.injectTag} ${css.injectTagOff}`}>
              {isOn ? t('injectStateOn') : t('injectStateOff')}
            </span>
          </div>
          <div className={css.injectRow}>
            <span className={css.injectMain}>
              <span className={css.injectLabel}>
                {t('injectThisSession')}
                {explicit && <span className={css.injectBadge}>{t('injectOverrideTag')}</span>}
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isOn}
              aria-label={t('injectThisSession')}
              disabled={busy}
              className={css.switch}
              onClick={() => { pushSession(!isOn) }}
            />
          </div>
          <div className={css.injectRow}>
            <span className={css.injectMain}>
              <span className={css.injectLabel}>{t('injectDefaultOn')}</span>
              <span className={css.injectHint}>{t('injectDefaultHint')}</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isDefaultOn}
              aria-label={t('injectDefaultOn')}
              disabled={busy}
              className={css.switch}
              onClick={() => { pushDefault(!isDefaultOn) }}
            />
          </div>
          {explicit && (
            <button type="button" className={css.injectFollow} disabled={busy} onClick={() => { pushSession(null) }}>
              {t('injectFollowDefault')}
            </button>
          )}
          <p className={css.injectFoot}>{t('injectCardFoot')}</p>
        </div>,
        document.body,
      )}
    </>
  )
}
