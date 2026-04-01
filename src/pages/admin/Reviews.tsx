import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Review } from '../../lib/types'
import { Star, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ author_name: '', rating: 5, body: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('order')
    setReviews((data as Review[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name.trim() || !form.body.trim()) return
    setSaving(true)
    await supabase.from('reviews').insert({
      author_name: form.author_name,
      rating: form.rating,
      body: form.body,
      order: reviews.length + 1,
      active: true,
    })
    setForm({ author_name: '', rating: 5, body: '' })
    setSaving(false)
    load()
  }

  async function toggleActive(r: Review) {
    await supabase.from('reviews').update({ active: !r.active }).eq('id', r.id)
    load()
  }

  async function handleDelete(r: Review) {
    if (!confirm(`Excluir avaliação de ${r.author_name}?`)) return
    await supabase.from('reviews').delete().eq('id', r.id)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6 dark:text-gray-100">Avaliações</h1>

      <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Adicionar avaliação</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nome do cliente *</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]"
              placeholder="Ex: Maria Silva"
              value={form.author_name}
              onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nota (1-5)</label>
            <select
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]"
              value={form.rating}
              onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} estrela{n !== 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Texto da avaliação *</label>
          <textarea
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00] resize-none"
            rows={3}
            placeholder="O que o cliente disse..."
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 bg-[#FF6B00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center gap-2 disabled:opacity-60"
        >
          <Plus size={16} /> {saving ? 'Adicionando...' : 'Adicionar avaliação'}
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Carregando...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Nenhuma avaliação ainda.</p>
        ) : reviews.map(r => (
          <div key={r.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4 ${!r.active ? 'opacity-50' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] font-extrabold text-sm shrink-0">
              {r.author_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-sm dark:text-gray-100">{r.author_name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{r.body}"</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => toggleActive(r)}
                title={r.active ? 'Ocultar do site' : 'Exibir no site'}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              >
                {r.active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button
                onClick={() => handleDelete(r)}
                title="Excluir"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
