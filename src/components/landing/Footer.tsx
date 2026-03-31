import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, MapPin, Phone, Instagram } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const WA = import.meta.env.VITE_WHATSAPP as string

const DEFAULTS = {
  address: 'R. Sebastião Mattos, 386, Munhoz - MG, 37620-000',
  phone: '(35) 99720-0066',
  instagram: 'https://www.instagram.com/rsesquadriasevidracaria_/',
}

export default function Footer() {
  const [cfg, setCfg] = useState(DEFAULTS)

  useEffect(() => {
    supabase.from('site_config').select('key,value').then(({ data }) => {
      if (!data) return
      const map: Record<string, string> = {}
      data.forEach(r => { map[r.key] = r.value })
      setCfg(prev => ({ ...prev, ...map }))
    })
  }, [])

  return (
    <footer className="bg-white dark:bg-gray-900 py-16 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left mb-12">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="bg-black dark:bg-[#FF6B00] text-white px-2 py-1 rounded font-extrabold text-xl transition-colors">RS</div>
              <span className="font-extrabold text-base uppercase text-gray-900 dark:text-gray-100">Esquadrias e Vidraçaria</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">Referência em esquadrias de alumínio e vidros de alta performance para projetos residenciais e comerciais.</p>
          </div>
          <div>
            <h4 className="font-bold text-black dark:text-gray-100 uppercase mb-6 tracking-widest text-sm">Nossos Serviços</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Janelas de Alumínio</span>
              <span>Box de Banheiro</span>
              <span>Portas de Alumínio</span>
              <span>Espelhos sob Medida</span>
              <span>Portões</span>
              <span>Fechamento de Sacadas</span>
              <span>Fachadas em Alumínio</span>
              <span>Divisórias de Vidro</span>
              <span>Grades e Corrimãos</span>
              <span>Guarda-corpo de Vidro</span>
              <span>Venezianas e Persianas</span>
              <span>Projetos sob Medida</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-black dark:text-gray-100 uppercase mb-6 tracking-widest text-sm">Contato</h4>
            <div className="space-y-2 mb-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-bold flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B00]" /> {cfg.address}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-bold flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-[#FF6B00]" /> {cfg.phone}
              </p>
            </div>
            <div className="flex justify-center md:justify-start gap-3">
              <a href={cfg.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-black dark:bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${WA}`} className="w-10 h-10 bg-black dark:bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#25D366] transition" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} RS Esquadrias e Vidraçaria — Todos os direitos reservados.</p>
          <Link to="/admin/login" className="text-gray-300 dark:text-gray-600 text-xs hover:text-[#FF6B00] transition uppercase tracking-widest font-bold flex items-center gap-1">
            <Lock size={11} /> Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  )
}
