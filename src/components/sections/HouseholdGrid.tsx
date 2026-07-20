import { useEnergyStore } from '../../store/useEnergyStore'
import { formatMoney } from '../../lib/format'
import './HouseholdGrid.css'

type HouseholdStatus = 'EXPORTING' | 'IMPORTING' | 'BALANCED'

function statusFor(net: number): HouseholdStatus {
  if (net > 0.15) return 'EXPORTING'
  if (net < -0.15) return 'IMPORTING'
  return 'BALANCED'
}

function accentClassFor(status: HouseholdStatus): string {
  if (status === 'EXPORTING') return 'household-card-accent-exporting'
  if (status === 'IMPORTING') return 'household-card-accent-importing'
  return 'household-card-accent-balanced'
}

function HouseholdGrid() {
  const households = useEnergyStore((state) => state.households)
  const selectHouse = useEnergyStore((state) => state.selectHouse)

  return (
    <div>
      <div className="household-grid-header">
        <h2 className="serif household-grid-title">
          The street <span className="household-grid-title-sub">· ten households</span>
        </h2>
        <div className="household-grid-legend">
          <span className="mono household-grid-legend-item">
            <span className="household-grid-legend-swatch household-grid-legend-swatch-sun" />
            EXPORTING
          </span>
          <span className="mono household-grid-legend-item">
            <span className="household-grid-legend-swatch household-grid-legend-swatch-settle" />
            IMPORTING
          </span>
        </div>
      </div>
      <div data-reveal className="household-grid">
        {households.map((household, index) => {
          const status = statusFor(household.net)
          return (
            <button
              key={household.name}
              type="button"
              onClick={() => selectHouse(index)}
              title="Open dossier"
              className={`household-card ${accentClassFor(status)}`}
            >
              <div className="household-card-top">
                <span className="mono household-card-meta">
                  {household.pv > 0 ? `${household.pv.toFixed(1)} kW ROOFTOP` : 'NO ROOFTOP PV'}
                </span>
                <span className="mono household-card-status">{status}</span>
              </div>
              <div className="serif household-card-name">{household.name}</div>
              <div className="mono household-card-balance">{formatMoney(household.balance)}</div>
              <div className="household-card-flow">
                <div className="mono household-card-flow-row">
                  <span className="household-card-flow-label">OUTPUT</span>
                  <span className="household-card-flow-value">{household.out.toFixed(2)} kW</span>
                </div>
                <div className="mono household-card-flow-row">
                  <span className="household-card-flow-label">DRAW</span>
                  <span className="household-card-flow-value">{household.draw.toFixed(2)} kW</span>
                </div>
              </div>
              <div className="household-card-footer">
                <span className="mono household-card-footer-label">OPEN DOSSIER</span>
                <span className="mono household-card-footer-arrow">↗</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default HouseholdGrid
