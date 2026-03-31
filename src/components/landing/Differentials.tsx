import { Check, Ruler, Headphones } from 'lucide-react'

const items = [
  { Icon: Check, title: 'Qualidade Superior', desc: 'Usamos ferragens de inox e vedação de primeira linha contra infiltrações.' },
  { Icon: Ruler, title: 'Sob Medida', desc: 'Projetos personalizados que se adaptam perfeitamente ao vão da sua obra.' },
  { Icon: Headphones, title: 'Pós-Venda Ativo', desc: 'Garantia real e assistência técnica para todos os nossos serviços.' },
]

export default function Differentials() {
  return (
    <section id="diferenciais" className="py-16 md:py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold mb-6 md:mb-8 leading-tight">O acabamento que <br/><span className="text-[#FF6B00]">valoriza seu imóvel</span>.</h2>
            <div className="space-y-6 md:space-y-8">
              {items.map(item => (
                <div key={item.title} className="flex gap-4 md:gap-5">
                  <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#FF6B00]/30">
                    <item.Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg md:text-xl mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm md:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#FF6B00]/20 rounded-3xl blur-2xl transition group-hover:bg-[#FF6B00]/30" />
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Instalação Profissional" className="rounded-3xl relative z-10 border border-white/10 shadow-2xl w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
