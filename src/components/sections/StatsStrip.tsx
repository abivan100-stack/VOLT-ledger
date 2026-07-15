import { useEnergyStore } from '../../store/useEnergyStore'
import { formatClock } from '../../lib/format'
import './StatsStrip.css'

const SPARKLINE_WIDTH = 150
const SPARKLINE_MIN_RATE = 4.2
const SPARKLINE_RATE_RANGE = 3.2

function StatsStrip() {
  const rate = useEnergyStore((state) => state.rate)
  const prevRate = useEnergyStore((state) => state.prevRate)
  const rateHistory = useEnergyStore((state) => state.rateHistory)
  const simMinute = useEnergyStore((state) => state.simMinute)
  const simSpeed = useEnergyStore((state) => state.config.simSpeed)
  const totalKwhToday = useEnergyStore((state) => state.totalKwhToday)
  const totalCreditToday = useEnergyStore((state) => state.totalCreditToday)

  const delta = rate - prevRate
  const rateDeltaLabel = `${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta).toFixed(2)}`
  const speedLabel = simSpeed % 1 === 0 ? simSpeed.toFixed(0) : simSpeed.toFixed(1)
  const sparkPoints = rateHistory
    .map((v, i) => {
      const x = (i / (rateHistory.length - 1)) * SPARKLINE_WIDTH
      const y = 23 - Math.min(1, Math.max(0, (v - SPARKLINE_MIN_RATE) / SPARKLINE_RATE_RANGE)) * 21
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div data-reveal className="stats-strip">
      <div className="stats-cell stats-cell-rate">
        <div className="eyebrow stats-label">Community Rate</div>
        <div className="stats-rate-row">
          <span className="mono stats-rate-value">₹{rate.toFixed(2)}</span>
          <span className="mono stats-rate-delta">{rateDeltaLabel} /kWh</span>
        </div>
        <svg width={SPARKLINE_WIDTH} height="24" viewBox={`0 0 ${SPARKLINE_WIDTH} 24`} className="stats-sparkline">
          <polyline points={sparkPoints} fill="none" stroke="#B26A12" strokeWidth="1.25" />
        </svg>
      </div>
      <div className="stats-cell stats-cell-clock">
        <div className="eyebrow stats-label">Sim Clock</div>
        <div className="mono stats-value">{formatClock(simMinute)}</div>
        <div className="mono stats-caption">SOLAR AFTERNOON · ×{speedLabel} SPEED</div>
      </div>
      <div className="stats-cell stats-cell-settled">
        <div className="eyebrow stats-label">Settled Today</div>
        <div className="mono stats-value">
          {totalKwhToday.toFixed(1)}
          <span className="stats-settled-unit"> kWh</span>
        </div>
        <div className="mono stats-caption">₹{totalCreditToday.toFixed(2)} KEPT ON THE STREET</div>
      </div>
    </div>
  )
}

export default StatsStrip
