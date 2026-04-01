import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import Differentials from '../components/landing/Differentials'
import Portfolio from '../components/landing/Portfolio'
import Reviews from '../components/landing/Reviews'
import CoverageChecker from '../components/landing/CoverageChecker'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'
import WhatsAppFloat from '../components/landing/WhatsAppFloat'
import LeadModal from '../components/landing/LeadModal'
import MobileCTA from '../components/landing/MobileCTA'

const WA = import.meta.env.VITE_WHATSAPP as string

function getOrCreateSessionId() {
  let sid = sessionStorage.getItem('_rs_sid')
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('_rs_sid', sid)
  }
  return sid
}

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalSource, setModalSource] = useState('landing')
  const [heroImage, setHeroImage] = useState('')
  const [servicesList, setServicesList] = useState<string[]>([])

  function openModal(source = 'landing') {
    setModalSource(source)
    setShowModal(true)
  }

  useEffect(() => {
    const sid = getOrCreateSessionId()
    if (!sessionStorage.getItem('_rs_pv')) {
      supabase.from('page_views').insert({ session_id: sid, page: '/' }).then(() => {
        sessionStorage.setItem('_rs_pv', '1')
      })
    }

    supabase.from('site_config').select('key,value').in('key', ['hero_image', 'services_list']).then(({ data }) => {
      if (!data) return
      data.forEach(({ key, value }) => {
        if (key === 'hero_image') setHeroImage(value)
        if (key === 'services_list' && value) setServicesList(value.split(',').map((s: string) => s.trim()).filter(Boolean))
      })
    })
  }, [])

  return (
    <>
      <Header onOpenModal={openModal} />
      <Hero openModal={openModal} heroImage={heroImage} />
      <Services />
      <Differentials />
      <Portfolio openModal={openModal} />
      <Reviews />
      <CoverageChecker />
      <Contact openModal={openModal} />
      <Footer openModal={openModal} />
      <WhatsAppFloat onOpen={() => openModal('float_whatsapp')} />
      <MobileCTA onOpen={() => openModal('cta_mobile')} />
      {showModal && (
        <LeadModal
          onClose={() => setShowModal(false)}
          waNumber={WA}
          source={modalSource}
          servicesList={servicesList}
        />
      )}
    </>
  )
}
