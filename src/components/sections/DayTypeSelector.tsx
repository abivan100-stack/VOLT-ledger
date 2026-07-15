import { useEnergyStore } from '../../store/useEnergyStore'
import { DAY_TYPES, DAY_TYPE_LABELS } from '../../lib/simulation'
import './DayTypeSelector.css'

function DayTypeSelector() {
  const dayType = useEnergyStore((state) => state.dayType)
  const setDayType = useEnergyStore((state) => state.setDayType)

  return (
    <div data-reveal className="day-type-selector">
      <span className="eyebrow day-type-label">Day Type</span>
      <div className="day-type-options" role="group" aria-label="Simulated day type">
        {DAY_TYPES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setDayType(option)}
            aria-pressed={option === dayType}
            className={`mono day-type-option ${option === dayType ? 'day-type-option-active' : ''}`}
          >
            {DAY_TYPE_LABELS[option]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DayTypeSelector
