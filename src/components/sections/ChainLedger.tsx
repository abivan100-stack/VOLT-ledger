import { useEnergyStore } from '../../store/useEnergyStore'
import './ChainLedger.css'

function ChainLedger() {
  const chain = useEnergyStore((state) => state.chain)
  const compromised = useEnergyStore((state) => state.compromised)
  const invalidCount = useEnergyStore((state) => state.invalidCount)
  const restoredFlash = useEnergyStore((state) => state.restoredFlash)
  const editingBlockId = useEnergyStore((state) => state.editingBlockId)
  const editValue = useEnergyStore((state) => state.editValue)
  const startEdit = useEnergyStore((state) => state.startEdit)
  const setEditValue = useEnergyStore((state) => state.setEditValue)
  const commitEdit = useEnergyStore((state) => state.commitEdit)
  const cancelEdit = useEnergyStore((state) => state.cancelEdit)
  const restoreChain = useEnergyStore((state) => state.restoreChain)

  const rows = chain.slice(-10).reverse()

  let statusText: string
  let statusVariant: 'compromised' | 'restored' | 'verified'
  if (compromised) {
    statusVariant = 'compromised'
    statusText = `SEAL BROKEN — ${invalidCount} ENTR${invalidCount === 1 ? 'Y' : 'IES'} VOID · SETTLEMENT HALTED`
  } else if (restoredFlash) {
    statusVariant = 'restored'
    statusText = `LEDGER RE-SEALED — ALL ${chain.length} ENTRIES VERIFIED`
  } else {
    const head = chain.length ? chain[chain.length - 1].hash.slice(0, 10) : '··········'
    statusVariant = 'verified'
    statusText = `CHAIN VERIFIED — ${chain.length} ENTRIES · HEAD ${head}`
  }

  return (
    <div className="chain-block">
      <div className="chain-header">
        <h2 className="serif chain-title">
          The chain <span className="chain-title-sub">· sha-256 sealed</span>
        </h2>
        <div className="mono chain-tamper-hint">TAMPER TEST — CLICK ANY kWh AND RETYPE IT</div>
      </div>

      {compromised && <div className="chain-void-stamp">INTEGRITY VOID</div>}

      <div data-reveal className="chain-card">
        <div className={`chain-status chain-status-${statusVariant}`}>
          <div className="mono chain-status-text">
            <span className="chain-status-dot" />
            {statusText}
          </div>
          {compromised && (
            <button type="button" onClick={restoreChain} className="mono chain-reseal-button">
              RE-SEAL LEDGER
            </button>
          )}
        </div>
        <div className="mono chain-columns">
          <span>TIME</span>
          <span>FROM → TO</span>
          <span className="chain-col-right">kWh</span>
          <span className="chain-col-right">CREDIT</span>
          <span className="chain-col-right">SEAL</span>
        </div>
        {rows.map((block) => {
          const isEditing = editingBlockId === block.id
          return (
            <div key={block.id} className={`mono chain-row${block.invalid ? ' chain-row-invalid' : ''}`}>
              <span className="chain-row-time">{block.payload.t}</span>
              <span className="chain-row-parties">
                {block.payload.from} <span className="chain-row-arrow">→</span> {block.payload.to}
              </span>
              {isEditing ? (
                <input
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.currentTarget.blur()
                    if (event.key === 'Escape') cancelEdit()
                  }}
                  onBlur={commitEdit}
                  autoFocus
                  className="mono chain-row-edit-input"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit(block.id)}
                  title="Tamper: edit this figure"
                  className="mono chain-row-kwh-button"
                >
                  {block.payload.kwh.toFixed(2)}
                </button>
              )}
              <span className="chain-row-credit">+₹{block.payload.credit.toFixed(2)}</span>
              <span className="chain-row-seal">
                {block.invalid ? (
                  <>
                    <span className="chain-void-badge">VOID</span>
                    <span className="chain-row-calc">{(block.calc || '').slice(0, 10)}</span>
                  </>
                ) : (
                  <span className="chain-row-hash">{block.hash.slice(0, 10)}</span>
                )}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mono chain-footnote">
        EACH SEAL = SHA-256( PREVIOUS SEAL + ENTRY PAYLOAD ). ALTER ONE FIGURE AND EVERY ENTRY DOWNSTREAM FAILS
        VERIFICATION — COMPUTED LIVE IN YOUR BROWSER, NOT FAKED.
      </div>
    </div>
  )
}

export default ChainLedger
