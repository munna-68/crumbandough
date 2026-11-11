import { Footer } from '../components/Footer'
import { Contact } from '../components/home/Contact'
import { FlavourStage } from '../components/home/FlavourStage'
import { Hero } from '../components/home/Hero'
import { Instagram } from '../components/home/Instagram'
import { ShopTrio } from '../components/home/ShopTrio'
import { Journey } from '../components/home/Journey'

export function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <ShopTrio />
        <Journey />
        <FlavourStage />
        <Instagram />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
