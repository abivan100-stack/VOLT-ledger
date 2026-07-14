import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useEnergyStore } from '../../store/useEnergyStore'
import { scrollToId } from '../ui/scrollToId'
import { useScrollReveal } from '../ui/useScrollReveal'
import { startHeroMesh } from './heroMeshCanvas'
import './Hero.css'

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activity = useEnergyStore((state) => state.config.activity)

  useScrollReveal(sectionRef, 0.12)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return startHeroMesh(canvas, { activity, reducedMotion })
  }, [activity])

  return (
    <section ref={sectionRef} className="hero">
      <div className="container hero-row">
        <div className="hero-copy" data-reveal>
          <div className="hero-kicker">
            <span className="hero-kicker-bar" />
            <span className="eyebrow">Peer-to-Peer Solar · Nolambur Microgrid</span>
          </div>
          <h1 className="serif hero-headline">
            Your rooftop's <em className="hero-headline-em">surplus</em>, sold to your street — not the grid.
          </h1>
          <p className="hero-subhead">
            Volt turns your neighborhood into a fair, transparent energy market. Every kilowatt tracked, every
            trade sealed against tampering.
          </p>
          <div className="hero-ctas">
            <Link to="/ledger" className="mono hero-cta-primary">SEE THE LEDGER LIVE →</Link>
            <button type="button" onClick={() => scrollToId('how')} className="mono hero-cta-secondary">
              HOW IT WORKS
            </button>
          </div>
          <Link to="/ledger" className="mono hero-live-link">
            <span className="hero-live-dot" />
            LIVE — SETTLING NOW ON THE NOLAMBUR LEDGER →
          </Link>
        </div>
        <div className="hero-canvas-wrap">
          <canvas ref={canvasRef} className="hero-canvas" />
        </div>
      </div>
    </section>
  )
}

export default Hero
