import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import type { CSSVars } from '../ui/cssVars'
import { useScrollReveal } from '../ui/useScrollReveal'
import { prefersReducedMotion } from '../ui/prefersReducedMotion'
import './Spread.css'

type SpreadMode = 'today' | 'volt'
type Tween = { sell: number; buy: number }

const TODAY_TARGETS: Tween = { sell: 3.0, buy: 8.0 }
const VOLT_TARGETS: Tween = { sell: 5.5, buy: 5.9 }
const TWEEN_DURATION_SECONDS = 0.85
const AUTO_SWITCH_DELAY_MS = 3600
const cubicEaseOut = (t: number) => 1 - (1 - t) ** 3

function Spread() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [spreadMode, setSpreadMode] = useState<SpreadMode>('today')
  const [tween, setTweenState] = useState<Tween>({ sell: 0, buy: 0 })
  const tweenRef = useRef<Tween>(tween)
  const stopTweenRef = useRef<() => void>(() => {})
  const spreadSeenRef = useRef(false)
  const userToggledRef = useRef(false)
  const autoSwitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useScrollReveal(containerRef, 0.12)

  function setTween(next: Tween) {
    tweenRef.current = next
    setTweenState(next)
  }

  function runTween(target: Tween, reducedMotion: boolean) {
    stopTweenRef.current()
    const from = tweenRef.current
    if (reducedMotion) {
      setTween(target)
      return
    }
    const controls = animate(0, 1, {
      duration: TWEEN_DURATION_SECONDS,
      ease: cubicEaseOut,
      onUpdate: (progress) => {
        setTween({
          sell: from.sell + (target.sell - from.sell) * progress,
          buy: from.buy + (target.buy - from.buy) * progress,
        })
      },
    })
    stopTweenRef.current = () => controls.stop()
  }

  function setMode(mode: SpreadMode, isUserAction: boolean) {
    if (isUserAction) {
      userToggledRef.current = true
      clearTimeout(autoSwitchTimeoutRef.current)
    }
    setSpreadMode(mode)
    runTween(mode === 'today' ? TODAY_TARGETS : VOLT_TARGETS, prefersReducedMotion())
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && !spreadSeenRef.current) {
        spreadSeenRef.current = true
        const reducedMotion = prefersReducedMotion()
        runTween(TODAY_TARGETS, reducedMotion)
        if (!reducedMotion) {
          autoSwitchTimeoutRef.current = setTimeout(() => {
            if (!userToggledRef.current) setMode('volt', false)
          }, AUTO_SWITCH_DELAY_MS)
        }
        observer.disconnect()
      }
    }, { threshold: 0.35 })

    observer.observe(container)
    return () => {
      observer.disconnect()
      clearTimeout(autoSwitchTimeoutRef.current)
      stopTweenRef.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sellPct = Math.max(0, (tween.sell / 8) * 100)
  const buyPct = Math.max(0, (tween.buy / 8) * 100)
  const gapPct = Math.max(0, buyPct - sellPct)
  const gapMidPct = sellPct + gapPct / 2
  const gap = Math.max(0, tween.buy - tween.sell)
  const isToday = spreadMode === 'today'

  return (
    <section className="spread">
      <div ref={containerRef} className="container spread-container">
        <div data-reveal className="spread-kicker">
          <span className="mono spread-kicker-number">01</span>
          <span className="eyebrow">The Spread</span>
        </div>
        <h2 data-reveal className="serif spread-heading">
          You sell low. Your neighbor buys high. The grid keeps the difference.
        </h2>
        <div className="spread-body">
          <div data-reveal className="spread-chart">
            <div className="spread-bars">
              <div className="spread-bar-col">
                <div
                  className="mono spread-bar-value spread-bar-value-sell"
                  style={{ '--bar-pct': sellPct } as CSSVars}
                >
                  ₹{tween.sell.toFixed(2)}
                </div>
                <div className="spread-bar-fill spread-bar-fill-sell" style={{ '--bar-pct': sellPct } as CSSVars} />
              </div>
              <div className="spread-gap-track">
                <div className="spread-gap-line" style={{ '--bar-pct': sellPct } as CSSVars} />
                <div className="spread-gap-line" style={{ '--bar-pct': buyPct } as CSSVars} />
                <div
                  className="spread-gap-fill"
                  style={{ '--gap-start': sellPct, '--gap-height': gapPct } as CSSVars}
                />
                <div className="spread-gap-label" style={{ '--bar-pct': gapMidPct } as CSSVars}>
                  <div className="mono spread-gap-amount">
                    ₹{gap.toFixed(2)}
                    <span className="spread-gap-unit">/kWh</span>
                  </div>
                  <div className="mono spread-gap-caption">
                    {isToday ? 'VALUE LOST TO THE GRID' : 'NETWORK FEE — THE REST STAYS'}
                  </div>
                </div>
              </div>
              <div className="spread-bar-col">
                <div
                  className="mono spread-bar-value spread-bar-value-buy"
                  style={{ '--bar-pct': buyPct } as CSSVars}
                >
                  ₹{tween.buy.toFixed(2)}
                </div>
                <div className="spread-bar-fill spread-bar-fill-buy" style={{ '--bar-pct': buyPct } as CSSVars} />
              </div>
            </div>
            <div className="spread-captions">
              <div className="mono spread-caption-sell">
                {isToday ? 'FEED-IN TARIFF — THE GRID PAYS YOU' : 'COMMUNITY RATE — YOUR NEIGHBOR PAYS YOU'}
              </div>
              <div className="mono spread-caption-buy">
                {isToday ? 'RETAIL RATE — YOUR NEIGHBOR PAYS' : 'ALL-IN PRICE — RATE + ₹0.40 FEE'}
              </div>
            </div>
          </div>
          <div data-reveal className="spread-copy">
            <div className="spread-toggle">
              <button
                type="button"
                onClick={() => setMode('today', true)}
                className={`mono spread-toggle-btn${isToday ? ' spread-toggle-btn-active' : ''}`}
              >
                THE GRID TODAY
              </button>
              <button
                type="button"
                onClick={() => setMode('volt', true)}
                className={`mono spread-toggle-btn spread-toggle-btn-right${!isToday ? ' spread-toggle-btn-active' : ''}`}
              >
                WITH VOLT
              </button>
            </div>
            <p className="spread-lead">
              {isToday
                ? 'The grid buys your surplus at ₹3.00 and sells it next door at ₹8.00. The ₹5.00 spread — sixty-two percent of the retail price — leaves your street entirely.'
                : 'Volt clears the same trade at the community rate. You earn ₹2.50 more per unit, your neighbor saves ₹2.10, and ₹0.40 runs the network.'}
            </p>
            <p className="spread-subbody">
              {isToday
                ? 'Nothing about that spread reflects cost. The electron travels forty meters. The money travels to a balance sheet three districts away.'
                : 'Same panels, same wires, same afternoon. The only thing that changed is who the market belongs to.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Spread
