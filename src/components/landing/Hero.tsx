import { MessageCircle, ChevronDown } from 'lucide-react'

const FALLBACK_BG = "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=1600"
const FALLBACK_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"

interface Props {
  openModal: (source: string) => void
  heroImage?: string
}

export default function Hero({ openModal, heroImage }: Props) {
  const bgImage = heroImage || FALLBACK_BG

  return (
    <section
      className="min-h-screen flex items-center pt-20"
      style={{ background: `linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.82)),url('${bgImage}') center/cover no-repeat` }}
    >
      <div className="container mx-auto px-4 text-center md:text-left grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-5 md:space-y-6">
          <span className="inline-block bg-[#FF6B00] text-white px-3 md:px-4 py-1 rounded text-xs font-bold tracking-widest uppercase">Qualidade e Precisão</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            A transparência do vidro com a força do <span className="text-[#FF6B00]">Alumínio</span>.
          </h1>
          <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0">
            Soluções sob medida em esquadrias de alumínio e vidros temperados para valorizar cada detalhe da sua obra.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
            <button
              onClick={() => openModal('hero_whatsapp')}
              className="bg-[#FF6B00] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:brightness-110 transition flex justify-center items-center gap-2 md:gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar Orçamento
            </button>
            <a
              href="#servicos"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition flex justify-center items-center gap-2"
            >
              Conheça o Trabalho
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/5 p-3 md:p-4 rounded-2xl border border-white/10">
            <img
              src={heroImage || FALLBACK_IMG}
              alt="Janelas de Alto Padrão"
              loading="eager"
              decoding="async"
              className="rounded-xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
