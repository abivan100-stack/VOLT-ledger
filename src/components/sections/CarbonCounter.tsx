import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { useEnergyStore } from '../../store/useEnergyStore'
import { carbonAvoidedKg, carAvoidedKm } from '../../lib/carbon'
import './CarbonCounter.css'

const COUNT_DURATION_SECONDS = 0.6
const cubicEaseOut = (t: number) => 1 - (1 - t) ** 3

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function CarbonCounter() {
  const totalKwhToday = useEnergyStore((state) => state.totalKwhToday)
  const targetKg = carbonAvoidedKg(totalKwhToday)

  const [displayKg, setDisplayKg] = useState(targetKg)
  const displayRef = useRef(targetKg)
  const stopRef = useRef<() => void>(() => {})

  useEffect(() => {
    stopRef.current()
    if (prefersReducedMotion()) {
      displayRef.current = targetKg
      setDisplayKg(targetKg)
      return
    }
    const from = displayRef.current
    const controls = animate(0, 1, {
      duration: COUNT_DURATION_SECONDS,
      ease: cubicEaseOut,
      onUpdate: (progress) => {
        const value = from + (targetKg - from) * progress
        displayRef.current = value
        setDisplayKg(value)
      },
    })
    stopRef.current = () => controls.stop()
    return () => controls.stop()
  }, [targetKg])

  const kmEquivalent = carAvoidedKm(displayKg)

  return (
    <div data-reveal className="carbon-counter">
      <div className="eyebrow carbon-counter-label">Carbon Avoided Today</div>
      <div className="mono carbon-counter-value">
        {displayKg.toFixed(1)}
        <span className="carbon-counter-unit"> kg CO₂</span>
      </div>
      <div className="mono carbon-counter-caption">
        ≈ {kmEquivalent.toFixed(0)} KM OF PETROL-CAR DRIVING AVOIDED · LOCAL TRADES VS GRID DRAW
      </div>
    </div>
  )
}

export default CarbonCounter
