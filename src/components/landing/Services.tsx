import { useState } from 'react'
import { SquareStack, Layers, Wrench, Zap, Star, CheckCircle2, ArrowRight } from 'lucide-react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import LeadModal from './LeadModal'

const WA = import.meta.env.VITE_WHATSAPP as string

const TABS = [
  {
    id: 'esquadrias',
    label: 'Esquadrias',
    Icon: SquareStack,
    desc: 'Fabricação e instalação de esquadrias em alumínio com pintura eletrostática em diversas cores.',
    services: [
      'Fabricação de janelas de alumínio',
      'Instalação de janelas (correr, basculante, maxim-ar)',
      'Fabricação de portas de alumínio',
      'Instalação de portas de alumínio e vidro',
      'Fabricação de portões (basculante, correr, social)',
      'Instalação de portões',
      'Venezianas e persianas integradas',
      'Fachadas em alumínio',
      'Grades de proteção',
      'Corrimãos e guarda-corpos',
      'Pintura e revitalização de esquadrias',
      'Troca de roldanas',
      'Ajustes de portas e janelas',
    ],
  },
  {
    id: 'vidracaria',
    label: 'Vidraçaria',
    Icon: Layers,
    desc: 'Soluções completas em vidro temperado, laminado e espelhos para residências e comércios.',
    services: [
      'Instalação de box de banheiro',
      'Box até o teto',
      'Box elegance',
      'Espelhos sob medida',
      'Espelhos lapidados e bisotados',
      'Portas de vidro (pivotante, correr)',
      'Janelas de vidro',
      'Tampos e prateleiras de vidro',
      'Fachadas comerciais em vidro',
      'Fechamento de sacadas',
      'Cortina de vidro',
      'Divisórias de vidro',
      'Envidraçamento de áreas gourmet',
      'Guarda-corpo de vidro',
      'Vidro laminado, temperado, jateado e serigrafado',
    ],
  },
  {
    id: 'reparos',
    label: 'Reparos',
    Icon: Wrench,
    desc: 'Manutenção especializada para esquadrias e vidros com peças originais e garantia de serviço.',
    services: [
      'Troca de vidro quebrado',
      'Manutenção de box (trilhos, roldanas)',
      'Regulagem de portas de vidro',
      'Aplicação de película (insulfilm, jateado)',
      'Vedação com silicone',
      'Reposição de peças',
    ],
  },
  {
    id: 'rapidos',
    label: 'Serviços Rápidos',
    Icon: Zap,
    desc: 'Atendimento ágil para pequenos serviços com agendamento no mesmo dia.',
    services: [
      'Corte de vidro sob medida',
      'Instalação de espelhos pequenos',
      'Ajustes rápidos em portas e janelas',
      'Troca de ferragens',
      'Pequenos reparos em geral',
    ],
  },
  {
    id: 'especiais',
    label: 'Diferenciados',
    Icon: Star,
    desc: 'Projetos personalizados e soluções inovadoras para ambientes residenciais e comerciais.',
    services: [
      'Espelhos decorativos personalizados',
      'Vidros personalizados (jateado / serigrafado)',
      'Projetos sob medida',
      'Fechamento completo de ambientes',
      'Parcerias com arquitetos',
      'Instalação de vidro inteligente (privacidade)',
    ],
  },
]

export default function Services() {
  const [active, setActive] = useState('esquadrias')
  const [showModal, setShowModal] = useState(false)
  const tab = TABS.find(t => t.id === active)!
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <>
      <section
        ref={ref as React.RefObject<HTMLElement>}
        id="servicos"
        className={`fade-in-section${isVisible ? ' visible' : ''} py-16 md:py-24 bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 uppercase text-gray-900 dark:text-gray-100">
              Nossos <span className="text-[#FF6B00]">Serviços</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Mais de 60 serviços em esquadrias de alumínio e vidraçaria para residências, condomínios e comércios.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  active === t.id
                    ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                }`}
              >
                <t.Icon className="w-4 h-4" strokeWidth={2.5} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] flex items-center justify-center shrink-0">
                <tab.Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{tab.label}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{tab.desc}</p>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {tab.services.map(s => (
                  <li key={s} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" strokeWidth={2.5} />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm group"
                >
                  Solicitar Orçamento
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href={`https://wa.me/${WA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold px-6 py-3 rounded-xl hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors text-sm"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showModal && <LeadModal onClose={() => setShowModal(false)} waNumber={WA} />}
    </>
  )
}
