import './LedgerIntro.css'

function LedgerIntro() {
  return (
    <div>
      <div data-reveal className="ledger-intro-kicker">
        <span className="ledger-intro-kicker-bar" />
        <span className="eyebrow">Live Settlement Ledger · Nolambur Microgrid, Chennai</span>
      </div>
      <h1 data-reveal className="serif ledger-intro-heading">
        Watch the street <em className="ledger-intro-heading-em">settle</em> in real time.
      </h1>
      <p data-reveal className="ledger-intro-body">
        Ten households on one rooftop-solar street, simulated through a single afternoon. Every trade is hashed
        into a chain — each entry sealed against the one before it. Change a single figure and watch the record
        refuse to lie.
      </p>
    </div>
  )
}

export default LedgerIntro
