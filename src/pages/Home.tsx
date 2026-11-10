import { useCallback, useState } from 'react'
import { markIntroPlayed, shouldPlayIntro } from '../lib/intro'
import { SiteFooter, SiteHeader } from '../components/Chrome'
import { CtaBand } from '../components/CtaBand'
import { FlavourRoll } from '../components/FlavourRoll'
import { Hero } from '../components/Hero'
import { OffersStrip } from '../components/OffersStrip'
import { Preloader } from '../components/Preloader'
import { ReviewsStrip } from '../components/ReviewsStrip'

export function Home() {
  const [playIntro] = useState(() => shouldPlayIntro())
  const [showPreloader, setShowPreloader] = useState(playIntro)
  const [introDone, setIntroDone] = useState(!playIntro)

  const handleReveal = useCallback(() => setIntroDone(true), [])
  const handleDone = useCallback(() => {
    markIntroPlayed()
    setIntroDone(true)
    setShowPreloader(false)
  }, [])

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        skip to the cookies
      </a>
      {showPreloader && <Preloader onReveal={handleReveal} onDone={handleDone} />}

      <SiteHeader />

      <main id="main">
        <Hero start={introDone} />
        <OffersStrip />
        <FlavourRoll />
        <ReviewsStrip />
        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  )
}
