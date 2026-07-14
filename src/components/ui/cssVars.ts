import type { CSSProperties } from 'react'

/**
 * For genuinely continuous, runtime-computed values (a tween's bar height,
 * a gauge arc angle) that have no finite set of states and so can't be
 * expressed as a static class. Scopes inline `style` to CSS custom
 * properties only — the actual visual rule (height, position, colour)
 * always lives in the component's co-located .css file, e.g.
 * `height: calc(var(--bar-pct) * 1%)`.
 */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>
