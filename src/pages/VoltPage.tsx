import Header from '../components/sections/Header'
import Hero from '../components/sections/Hero'
import Spread from '../components/sections/Spread'
import HowItWorks from '../components/sections/HowItWorks'
import LedgerCta from '../components/sections/LedgerCta'
import Footer from '../components/sections/Footer'

function VoltPage() {
  return (
    <>
      <Header />
      <Hero />
      <Spread />
      <HowItWorks />
      <LedgerCta />
      <main className="container py-16">
        <p className="eyebrow mb-3">Step C in progress</p>
        <p className="mono mt-3 text-sm text-ink-soft">
          Remaining sections migrate in one at a time.
        </p>
      </main>
      <Footer />
    </>
  )
}

export default VoltPage
