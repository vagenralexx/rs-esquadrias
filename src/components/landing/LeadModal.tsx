import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const SERVICES = [
  'Esquadrias de Alumínio', 'Vidros de Segurança', 'Espelhos Premium',
  'Box de Banheiro', 'Pele de Vidro / Fachada', 'Portões de Alumínio', 'Outro',
]

interface Props { onClose: () => void; waNumber: string; source?: string }

export default function LeadModal({ onClose, waNumber, source }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('leads').insert({
      name: form.name, phone: form.phone, email: form.email || null,
      service: form.service, message: form.message, source: source ?? 'landing',
    })

    const lines = [
      `Olá! Me chamo ${form.name}.`,
      `Telefone: ${form.phone}`,
      `Serviço: ${form.service}`,
      ...(form.message ? [form.message] : []),
    ]
    const text = encodeURIComponent(lines.join('\n'))
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const url = isMobile
      ? `whatsapp://send?phone=${waNumber}&text=${text}`
      : `https://web.whatsapp.com/send?phone=${waNumber}&text=${text}`

    setLoading(false)
    window.open(url, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><X size={20} /></button>
        <div className="mb-5">
          <h2 className="text-xl font-extrabold dark:text-gray-100">Solicitar Orçamento</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Preencha rapidinho e te redirecionamos para o WhatsApp já com as informações.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nome *</label>
            <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="Seu nome completo" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">WhatsApp / Telefone *</label>
            <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="(35) 99999-9999" value={form.phone} onChange={e => set('phone', e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">E-mail</label>
            <input type="email" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="seu@email.com (opcional)" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Serviço desejado *</label>
            <select className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.service} onChange={e => set('service', e.target.value)} required>
              <option value="">Selecione...</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Mensagem</label>
            <textarea className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00] resize-none" rows={3} placeholder="Descreva brevemente o que precisa..." value={form.message} onChange={e => set('message', e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? 'Enviando...' : 'Ir para o WhatsApp →'}
          </button>
        </form>
      </div>
    </div>
  )
}
