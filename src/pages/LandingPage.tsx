import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import Differentials from '../components/landing/Differentials'
import Portfolio from '../components/landing/Portfolio'
import CoverageChecker from '../components/landing/CoverageChecker'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'
import WhatsAppFloat from '../components/landing/WhatsAppFloat'

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Differentials />
      <Portfolio />
      <CoverageChecker />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
