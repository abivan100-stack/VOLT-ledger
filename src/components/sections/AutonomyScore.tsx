import { useEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { useEnergyStore } from '../../store/useEnergyStore'
import { dailyGridDependence, autonomyPct } from '../../lib/gridDependence'
import { DAY_TYPE_LABELS } from '../../lib/simulation'
import './AutonomyScore.css'

const TWEEN_DURATION_SECONDS = 0.7
const cubicEaseOut = (t: number) => 1 - (1 - t) ** 3

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function AutonomyScore() {
  const households = useEnergyStore((state) => state.households)
  const dayType = useEnergyStore((state) => state.dayType)

  const breakdown = useMemo(() => dailyGridDependence(households, dayType), [households, dayType])
  const targetPct = autonomyPct(breakdown)

  const [displayPct, setDisplayPct] = useState(targetPct)
  const displayRef = useRef(targetPct)
  const stopRef = useRef<() => void>(() => {})

  useEffect(() => {
    stopRef.current()
    if (prefersReducedMotion()) {
      displayRef.current = targetPct
      setDisplayPct(targetPct)
      return
    }
    const from = displayRef.current
    const controls = animate(0, 1, {
      duration: TWEEN_DURATION_SECONDS,
      ease: cubicEaseOut,
      onUpdate: (progress) => {
        const value = from + (targetPct - from) * progress
        displayRef.current = value
        setDisplayPct(value)
      },
    })
    stopRef.current = () => controls.stop()
    return () => controls.stop()
  }, [targetPct])

  return (
    <div data-reveal className="autonomy-score">
      <div className="eyebrow autonomy-score-label">Neighbourhood Autonomy</div>
      <div className="mono autonomy-score-value">
        {displayPct.toFixed(0)}
        <span className="autonomy-score-unit">%</span>
      </div>
      <p className="autonomy-score-subtitle">
        Of today's power stayed on the street — solar, battery, and trades between neighbours — instead of coming
        from the grid.
      </p>
      <div className="mono autonomy-score-caption">
        MODELED FOR {DAY_TYPE_LABELS[dayType].toUpperCase()} · NOT LIVE TRADE STATE
      </div>
    </div>
  )
}

export default AutonomyScore
