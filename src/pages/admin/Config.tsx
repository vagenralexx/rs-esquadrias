import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Save, Check as CheckIcon } from 'lucide-react'

const FIELDS = [
  { key: 'address', label: 'Endereço', placeholder: 'Rua, número - Bairro, Cidade - UF' },
  { key: 'phone', label: 'Telefone / WhatsApp', placeholder: '(35) 99720-0066' },
  { key: 'email', label: 'E-mail profissional', placeholder: 'contato@rsesquadrias.com.br' },
  { key: 'instagram', label: 'Instagram (URL)', placeholder: 'https://instagram.com/...' },
  { key: 'facebook', label: 'Facebook (URL)', placeholder: 'https://facebook.com/...' },
  { key: 'tiktok', label: 'TikTok (URL)', placeholder: 'https://tiktok.com/@...' },
  { key: 'maps', label: 'Google Maps (URL do link)', placeholder: 'https://maps.google.com/...' },
  { key: 'maps_embed', label: 'Google Maps (URL do iframe/embed)', placeholder: 'https://maps.google.com/maps?q=...&output=embed' },
]

export default function Config() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_config').select('key,value').then(({ data }) => {
      if (!data) return
      const map: Record<string, string> = {}
      data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value })
      setValues(map)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const upserts = Object.entries(values).map(([key, value]) => ({ key, value }))
    await supabase.from('site_config').upsert(upserts, { onConflict: 'key' })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6 dark:text-gray-100">Configurações do Site</h1>
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl">
        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{f.label}</label>
              <input className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder={f.placeholder} value={values[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-[#FF6B00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center gap-2 disabled:opacity-60">
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
          {saved && <span className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1"><CheckIcon size={14} /> Salvo com sucesso!</span>}
        </div>
      </form>
    </div>
  )
}
