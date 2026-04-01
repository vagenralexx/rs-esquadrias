import { useState } from 'react'
import { MessageCircle, ChevronDown } from 'lucide-react'

interface Props { openModal: (source: string) => void }

export default function Hero({ openModal }: Props) {
  const [imgError, setImgError] = useState(false)
  
  return (
    <section className="min-h-screen flex items-center pt-20" style={{ background: "linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.82)),url('https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=1600') center/cover no-repeat" }}>
      <div className="container mx-auto px-4 text-center md:text-left grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-5 md:space-y-6">
          <span className="inline-block bg-[#FF6B00] text-white px-3 md:px-4 py-1 rounded text-xs font-bold tracking-widest uppercase">Qualidade e Precisão</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            A transparência do vidro com a força do <span className="text-[#FF6B00]">Alumínio</span>.
          </h1>
          <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0">Soluções sob medida em esquadrias de alumínio e vidros temperados para valorizar cada detalhe da sua obra.</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
            <button onClick={() => openModal('hero_whatsapp')} className="bg-[#FF6B00] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:brightness-110 transition flex justify-center items-center gap-2 md:gap-3">
              <MessageCircle className="w-5 h-5" />
              Solicitar Orçamento
            </button>
            <a href="#servicos" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition flex justify-center items-center gap-2">
              Conheça o Trabalho
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/5 p-3 md:p-4 rounded-2xl border border-white/10">
            {!imgError ? (
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" 
                alt="Janelas de Alto Padrão" 
                className="rounded-xl shadow-2xl w-full object-cover aspect-[4/3]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="rounded-xl shadow-2xl w-full aspect-[4/3] bg-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold uppercase">Projeto RS Esquadrias</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
