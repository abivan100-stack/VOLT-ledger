import { useRef } from 'react'
import Header from '../components/sections/Header'
import LedgerIntro from '../components/sections/LedgerIntro'
import StatsStrip from '../components/sections/StatsStrip'
import NeighbourhoodMap from '../components/sections/NeighbourhoodMap'
import HouseholdGrid from '../components/sections/HouseholdGrid'
import Footer from '../components/sections/Footer'
import { useScrollReveal } from '../components/ui/useScrollReveal'

function LedgerPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  useScrollReveal(containerRef, 0.08)

  return (
    <>
      <Header />
      <section className="border-b border-rule-2">
        <div ref={containerRef} className="container pt-16 pb-32">
          <LedgerIntro />
          <StatsStrip />
          <NeighbourhoodMap />
          <HouseholdGrid />
          <p className="eyebrow mb-3">Step C in progress</p>
          <p className="mono mt-3 text-sm text-ink-soft">
            Remaining sections migrate in one at a time.
          </p>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default LedgerPage
