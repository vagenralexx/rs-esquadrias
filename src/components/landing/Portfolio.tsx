import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PortfolioItem } from '../../lib/types'
const CATEGORIES = ['Todos', 'Esquadrias de Alumínio', 'Box de Banheiro', 'Espelhos', 'Vidros & Sacadas', 'Projetos Especiais']
const FALLBACK: PortfolioItem[] = [
  { id: '1', title: 'Fachada de Vidro', category: 'Vidros & Sacadas', image_url: 'https://images.unsplash.com/photo-1527359443443-84a48abc7df0?auto=format&fit=crop&q=80&w=600', order: 1, created_at: '' },
  { id: '2', title: 'Esquadrias Pretas', category: 'Esquadrias de Alumínio', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600', order: 2, created_at: '' },
  { id: '3', title: 'Ambiente Integrado', category: 'Esquadrias de Alumínio', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600', order: 3, created_at: '' },
  { id: '4', title: 'Fechamento de Sacada', category: 'Vidros & Sacadas', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', order: 4, created_at: '' },
  { id: '5', title: 'Box de Banheiro', category: 'Box de Banheiro', image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=600', order: 5, created_at: '' },
  { id: '6', title: 'Espelho Decorativo', category: 'Espelhos', image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600', order: 6, created_at: '' },
]

interface Props { openModal: (source: string) => void }

export default function Portfolio({ openModal }: Props) {
  const [items, setItems] = useState<PortfolioItem[]>(FALLBACK)
  const [active, setActive] = useState('Todos')

  useEffect(() => {
    supabase.from('portfolio').select('*').order('order').then(({ data }) => {
      if (data && data.length > 0) setItems(data as PortfolioItem[])
    })
  }, [])

  const filtered = active === 'Todos' ? items : items.filter(i => i.category === active)

  return (
    <>
      <section id="portfolio" className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 md:mb-4 uppercase text-gray-900 dark:text-gray-100">Trabalhos <span className="text-[#FF6B00]">Entregues</span></h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-sm md:text-base">Inspire-se com alguns dos nossos projetos em residências e condomínios.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10 px-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActive(cat)} 
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all ${active === cat ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {filtered.map(item => (
              <div key={item.id} className="aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 group relative">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent && !parent.querySelector('.fallback-content')) {
                      const fallback = document.createElement('div')
                      fallback.className = 'fallback-content absolute inset-0 flex items-center justify-center bg-gray-800'
                      fallback.innerHTML = `
                        <div class="text-center text-gray-500 p-4">
                          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p class="text-xs font-bold">${item.title}</p>
                        </div>
                      `
                      parent.appendChild(fallback)
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 md:p-4">
                  <div>
                    <p className="text-white font-bold text-sm md:text-base">{item.title}</p>
                    <p className="text-[#FF6B00] text-xs md:text-sm font-bold">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 md:mt-16 bg-gray-50 dark:bg-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100">Pronto para iniciar seu projeto?</h3>
            <button onClick={() => openModal('portfolio_cta')} className="inline-flex items-center gap-3 md:gap-4 bg-[#FF6B00] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl hover:brightness-110 transition shadow-xl shadow-orange-500/30">
              SOLICITAR ORÇAMENTO AGORA
            </button>
            <p className="mt-4 md:mt-6 text-gray-500 dark:text-gray-400 font-medium italic text-sm md:text-base">Atendimento rápido em toda a região.</p>
          </div>
        </div>
      </section>
    </>
  )
}
