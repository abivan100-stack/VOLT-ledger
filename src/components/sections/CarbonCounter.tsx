import { useEnergyStore } from '../../store/useEnergyStore'
import { carbonAvoidedKg, carAvoidedKm } from '../../lib/carbon'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'
import './CarbonCounter.css'

const COUNT_DURATION_SECONDS = 0.6

function CarbonCounter() {
  const totalKwhToday = useEnergyStore((state) => state.totalKwhToday)
  const targetKg = carbonAvoidedKg(totalKwhToday)
  const displayKg = useAnimatedNumber(targetKg, COUNT_DURATION_SECONDS)
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
