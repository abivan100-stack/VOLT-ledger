import { useRef } from 'react'
import Header from '../components/sections/Header'
import LedgerIntro from '../components/sections/LedgerIntro'
import StatsStrip from '../components/sections/StatsStrip'
import NeighbourhoodMap from '../components/sections/NeighbourhoodMap'
import HouseholdGrid from '../components/sections/HouseholdGrid'
import ChainLedger from '../components/sections/ChainLedger'
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
          <ChainLedger />
        </div>
      </section>
      <Footer />
    </>
  )
}

export default LedgerPage
