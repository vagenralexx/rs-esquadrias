import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PortfolioItem } from '../../lib/types'
import { convertToWebP } from '../../lib/imageUtils'
import { Trash2, Upload, Images } from 'lucide-react'

const CATEGORIES = ['Esquadrias de Alumínio', 'Box de Banheiro', 'Espelhos', 'Vidros & Sacadas', 'Projetos Especiais']

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('portfolio').select('*').order('order')
    if (data) setItems(data as PortfolioItem[])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file || !title) return
    setLoading(true)
    const webp = await convertToWebP(file)
    const path = `portfolio/${Date.now()}.webp`
    const { error: uploadErr } = await supabase.storage.from('images').upload(path, webp, { contentType: 'image/webp' })
    if (uploadErr) { setLoading(false); alert('Erro no upload: ' + uploadErr.message); return }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    await supabase.from('portfolio').insert({ title, category, image_url: publicUrl, order: items.length + 1 })
    setTitle(''); setCategory(CATEGORIES[0])
    if (fileRef.current) fileRef.current.value = ''
    setLoading(false); load()
  }

  async function handleDelete(item: PortfolioItem) {
    if (!confirm(`Remover "${item.title}"?`)) return
    const path = item.image_url.split('/images/')[1]
    if (path) await supabase.storage.from('images').remove([path])
    await supabase.from('portfolio').delete().eq('id', item.id)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6 dark:text-gray-100">Portfólio</h1>
      <form onSubmit={handleUpload} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Adicionar foto</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Título</label>
            <input className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Fachada residencial" required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Categoria</label>
            <select className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Imagem</label>
            <input ref={fileRef} type="file" accept="image/*" className="w-full border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-lg px-3 py-2 mt-1 text-sm" required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="mt-4 bg-[#FF6B00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center gap-2 disabled:opacity-60">
          <Upload size={16} /> {loading ? 'Enviando...' : 'Adicionar foto'}
        </button>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <p className="text-white text-xs font-bold text-center px-2">{item.title}</p>
              <p className="text-[#FF6B00] text-[10px] font-bold">{item.category}</p>
              <button onClick={() => handleDelete(item)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition mt-1"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Images className="w-16 h-16 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhuma foto ainda. Adicione a primeira!</p>
        </div>
      )}
    </div>
  )
}
