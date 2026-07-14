import Header from '../components/sections/Header'
import Footer from '../components/sections/Footer'

function LedgerPage() {
  return (
    <>
      <Header />
      <main className="container py-16">
        <p className="eyebrow mb-3">Step C in progress</p>
        <h1 className="serif text-5xl text-ink">
          Live ledger <em className="text-settle">page</em>
        </h1>
        <p className="mono mt-3 text-sm text-ink-soft">
          Remaining sections migrate in one at a time.
        </p>
      </main>
      <Footer />
    </>
  )
}

export default LedgerPage
