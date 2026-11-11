import { Footer } from '../components/Footer'
import { Contact } from '../components/home/Contact'
import { FlavourStage } from '../components/home/FlavourStage'
import { Hero } from '../components/home/Hero'
import { Instagram } from '../components/home/Instagram'
import { ShopTrio } from '../components/home/ShopTrio'
import { Statement } from '../components/home/Statement'

export function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <ShopTrio />
        <Statement />
        <FlavourStage />
        <Instagram />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
