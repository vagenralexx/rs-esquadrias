import { useEffect, useState } from 'react'
import { MapPin, Phone, Handshake, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Partner } from '../lib/types'
import { DarkModeToggle } from '../components/ui/DarkModeToggle'

const WA_RS = import.meta.env.VITE_WHATSAPP as string

function buildWaUrl(phone: string, partnerName: string) {
  const num = phone.replace(/\D/g, '')
  const text = encodeURIComponent(`Olá! Vim pelo site da RS Esquadrias e gostaria de saber mais sobre os serviços de ${partnerName}.`)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  return isMobile
    ? `whatsapp://send?phone=55${num}&text=${text}`
    : `https://web.whatsapp.com/send?phone=55${num}&text=${text}`
}

function PartnerCard({ p }: { p: Partner }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md hover:border-[#FF6B00]/40 transition-all">
      <div className="h-[120px] w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        {p.logo_url ? (
          <img src={p.logo_url} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
              <span className="text-[#FF6B00] font-extrabold text-xl">{p.name.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 mb-1">{p.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">{p.description}</p>
        <div className="space-y-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
          {p.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00] mt-0.5 shrink-0" />
              <span>{p.address}</span>
            </div>
          )}
          {p.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span>{p.phone}</span>
            </div>
          )}
        </div>
        {p.whatsapp && (
          <a
            href={buildWaUrl(p.whatsapp, p.name)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition w-full"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Falar no WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}

function PartnershipForm() {
  const [form, setForm] = useState({ name: '', business: '', phone: '', address: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const lines = [
      `Ola! Gostaria de ser parceiro da RS Esquadrias.`,
      `Nome: ${form.name}`,
      `Empresa: ${form.business}`,
      `Telefone: ${form.phone}`,
      ...(form.address ? [`Endereco: ${form.address}`] : []),
      ...(form.description ? [`Servicos: ${form.description}`] : []),
    ]
    const text = encodeURIComponent(lines.join('\n'))
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const url = isMobile
      ? `whatsapp://send?phone=${WA_RS}&text=${text}`
      : `https://web.whatsapp.com/send?phone=${WA_RS}&text=${text}`
    setLoading(false)
    setSent(true)
    window.open(url, '_blank')
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Handshake className="w-7 h-7 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-extrabold text-lg dark:text-gray-100 mb-2">Mensagem enviada!</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Entraremos em contato em breve.</p>
        <button onClick={() => { setSent(false); setForm({ name: '', business: '', phone: '', address: '', description: '' }) }} className="mt-4 text-[#FF6B00] text-sm font-bold hover:underline">
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Seu Nome *</label>
          <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="Nome completo" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Empresa / Negócio *</label>
          <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="Nome da empresa" value={form.business} onChange={e => set('business', e.target.value)} required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">WhatsApp / Telefone *</label>
          <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="(35) 99999-9999" value={form.phone} onChange={e => set('phone', e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Endereço</label>
          <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="Cidade - UF" value={form.address} onChange={e => set('address', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Descreva seus serviços *</label>
        <textarea className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00] resize-none" rows={3} placeholder="Ex: Construção civil, materiais de construção, elétrica..." value={form.description} onChange={e => set('description', e.target.value)} required />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? 'Enviando...' : 'Propor Parceria pelo WhatsApp'}
      </button>
    </form>
  )
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('partners').select('*').eq('active', true).order('order').then(({ data }) => {
      setPartners((data as Partner[]) ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur border-b border-white/10 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="RS Esquadrias" className="h-9 w-auto" />
            <span className="font-extrabold text-sm uppercase hidden sm:block text-white">Esquadrias e Vidraçaria</span>
          </Link>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link to="/" className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition">
              <ArrowLeft className="w-4 h-4" /> Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 text-[#FF6B00] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            <Handshake className="w-4 h-4" /> Parcerias
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Nossos <span className="text-[#FF6B00]">Parceiros</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Empresas de confiança que trabalham junto com a RS Esquadrias para oferecer o melhor na sua obra.
          </p>
        </div>
      </section>

      {/* Partners grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-64 animate-pulse border border-gray-100 dark:border-gray-700" />
              ))}
            </div>
          ) : partners.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Em breve novos parceiros aqui.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {partners.map(p => <PartnerCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Partnership form */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-14 h-14 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold dark:text-gray-100 mb-3">
                Quer ser um <span className="text-[#FF6B00]">parceiro</span>?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                Preencha o formulário e entraremos em contato para apresentar nossa proposta de parceria.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              <PartnershipForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} RS Esquadrias e Vidraçaria — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
