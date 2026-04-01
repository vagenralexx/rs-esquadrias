import { useEffect, useState } from 'react'
import { Smartphone, Instagram, MapPin, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const DEFAULTS = { address: 'R. Sebastião Mattos, 386, Munhoz - MG, 37620-000', phone: '(35) 99720-0066', email: 'contato@rsesquadrias.com.br', instagram: 'https://www.instagram.com/rsesquadriasevidracaria_/', maps: 'https://www.google.com/maps?q=-22.6104739,-46.366385', maps_embed: 'https://maps.google.com/maps?q=-22.6104739,-46.366385&z=17&output=embed' }

interface ContactProps { openModal?: (source: string) => void }

export default function Contact({ openModal: _openModal }: ContactProps) {
  const [config, setConfig] = useState(DEFAULTS)

  useEffect(() => {
    supabase.from('site_config').select('key,value').then(({ data }) => {
      if (!data) return
      const map: Record<string, string> = {}
      data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value })
      setConfig(c => ({ ...c, ...map }))
    })
  }, [])

  return (
    <section id="contato" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 md:mb-4 uppercase text-gray-900 dark:text-gray-100">Entre em <span className="text-[#FF6B00]">Contato</span></h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 md:mb-12 text-sm md:text-base">Estamos prontos para atender você.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-12">
          {/* WhatsApp → opens lead modal */}
          <button onClick={() => openModal('contact_whatsapp')} className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#FF6B00] hover:shadow-md transition-all group text-center w-full">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-bold mb-1 text-sm md:text-base text-gray-900 dark:text-gray-100">WhatsApp</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{config.phone}</p>
          </button>
          {/* Email → opens lead modal */}
          <button onClick={() => openModal('contact_email')} className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#FF6B00] hover:shadow-md transition-all group text-center w-full">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-[#FF6B00] group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-bold mb-1 text-sm md:text-base text-gray-900 dark:text-gray-100">E-mail</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{config.email}</p>
          </button>
          {/* Instagram → external link */}
          <a href={config.instagram} target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#FF6B00] hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
              <Instagram className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-bold mb-1 text-sm md:text-base text-gray-900 dark:text-gray-100">Instagram</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">@rsesquadriasevidracaria_</p>
          </a>
          {/* Maps → external link */}
          <a href={config.maps} target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#FF6B00] hover:shadow-md transition-all group sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-bold mb-1 text-sm md:text-base text-gray-900 dark:text-gray-100">Localização</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{config.address}</p>
          </a>
        </div>
        {config.maps_embed && (
          <div className="max-w-4xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <iframe
              src={config.maps_embed}
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização RS Esquadrias"
            />
          </div>
        )}
        <button onClick={() => openModal('contact_cta')} className="bg-[#FF6B00] text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:brightness-110 transition shadow-xl shadow-orange-500/30">
          Solicitar Orçamento
        </button>
      </div>
    </section>
  )
}
