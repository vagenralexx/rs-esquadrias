import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Partner } from '../../lib/types'
import { convertToWebP } from '../../lib/imageUtils'
import { Plus, Trash2, Edit2, X, Check, ToggleLeft, ToggleRight, Upload, ImageIcon, Search } from 'lucide-react'

const EMPTY: Omit<Partner, 'id' | 'created_at'> = {
  name: '', description: '', address: '', phone: '', whatsapp: '', logo_url: '', order: 0, active: true,
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [search, setSearch] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('partners').select('*').order('order')
    setPartners((data as Partner[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY })
    setPreviewUrl('')
    setUploadMode('file')
    if (fileRef.current) fileRef.current.value = ''
    setShowForm(true)
  }

  function openEdit(p: Partner) {
    setEditing(p)
    setForm({ name: p.name, description: p.description, address: p.address, phone: p.phone, whatsapp: p.whatsapp, logo_url: p.logo_url, order: p.order, active: p.active })
    setPreviewUrl(p.logo_url)
    setUploadMode(p.logo_url ? 'url' : 'file')
    if (fileRef.current) fileRef.current.value = ''
    setShowForm(true)
  }

  function set(field: string, value: string | number | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    let finalForm = { ...form }

    // Upload file if one was selected
    const file = fileRef.current?.files?.[0]
    if (file) {
      const webp = await convertToWebP(file)
      const path = `partners/${Date.now()}.webp`
      const { error: uploadErr } = await supabase.storage.from('images').upload(path, webp, { contentType: 'image/webp' })
      if (uploadErr) { setSaving(false); alert('Erro no upload: ' + uploadErr.message); return }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
      finalForm = { ...finalForm, logo_url: publicUrl }
    }

    if (editing) {
      await supabase.from('partners').update(finalForm).eq('id', editing.id)
    } else {
      await supabase.from('partners').insert(finalForm)
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este parceiro?')) return
    await supabase.from('partners').delete().eq('id', id)
    load()
  }

  async function toggleActive(p: Partner) {
    await supabase.from('partners').update({ active: !p.active }).eq('id', p.id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold dark:text-gray-100">Parceiros</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gerencie os parceiros exibidos na página de parcerias.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition">
          <Plus size={16} /> Novo Parceiro
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00]"
          placeholder="Pesquisar parceiros..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-44 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />)}
        </div>
      ) : partners.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="mb-3">{search ? 'Nenhum parceiro encontrado.' : 'Nenhum parceiro cadastrado.'}</p>
          {!search && <button onClick={openNew} className="text-[#FF6B00] font-bold text-sm hover:underline">Adicionar o primeiro</button>}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {partners
            .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
            .map(p => (
            <div key={p.id} className={`bg-white dark:bg-gray-800 rounded-2xl border flex flex-col transition ${p.active ? 'border-gray-100 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700 opacity-50'}`}>
              {/* Logo */}
              <div className="h-28 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-t-2xl p-3">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
                    <span className="text-[#FF6B00] font-extrabold text-2xl">{p.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-3 flex-1 min-w-0">
                <p className="font-bold text-sm dark:text-gray-100 truncate">{p.name}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 truncate">{p.phone || p.address}</p>
                <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {p.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              {/* Actions */}
              <div className="flex items-center justify-between px-3 pb-3 gap-1">
                <button onClick={() => toggleActive(p)} className="text-gray-400 hover:text-green-500 transition p-1" title={p.active ? 'Desativar' : 'Ativar'}>
                  {p.active ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-[#FF6B00] transition p-1">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"><X size={20} /></button>
            <h2 className="text-lg font-extrabold dark:text-gray-100 mb-5">{editing ? 'Editar Parceiro' : 'Novo Parceiro'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nome da empresa *</label>
                <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Ex: Construfácil" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Descrição dos serviços *</label>
                <textarea className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00] resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} required placeholder="Breve descrição do que a empresa oferece..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Telefone</label>
                  <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(35) 9xxxx-xxxx" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">WhatsApp (só números)</label>
                  <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="35999999999" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Endereço</label>
                <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Rua, Nº - Cidade, MG" />
              </div>

              {/* Logo upload */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Logo</label>
                <div className="flex gap-2 mt-1 mb-2">
                  <button type="button" onClick={() => setUploadMode('file')} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${uploadMode === 'file' ? 'bg-[#FF6B00] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    <Upload size={12} className="inline mr-1" />Fazer upload
                  </button>
                  <button type="button" onClick={() => setUploadMode('url')} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${uploadMode === 'url' ? 'bg-[#FF6B00] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    URL externa
                  </button>
                </div>
                {uploadMode === 'file' ? (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-[#FF6B00]/60 transition bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <ImageIcon size={24} />
                        <span className="text-xs">Clique para selecionar</span>
                        <span className="text-[10px]">Será convertida para WebP</span>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.logo_url} onChange={e => { set('logo_url', e.target.value); setPreviewUrl(e.target.value) }} placeholder="https://..." />
                )}
                {uploadMode === 'url' && previewUrl && (
                  <img src={previewUrl} alt="preview" className="mt-2 h-16 object-contain rounded-lg border border-gray-100 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800" onError={() => setPreviewUrl('')} />
                )}
                <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                  💡 Tamanho ideal para mini-banner: <span className="font-bold text-gray-500 dark:text-gray-400">600 × 200 px</span> (proporção 3:1) — preenche toda a área do card sem cortes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Ordem</label>
                  <input type="number" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.order} onChange={e => set('order', Number(e.target.value))} />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <div className={`w-10 h-6 rounded-full transition-colors ${form.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} relative`} onClick={() => set('active', !form.active)}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{form.active ? 'Ativo' : 'Inativo'}</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#FF6B00] text-white text-sm font-bold hover:brightness-110 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? 'Salvando...' : <><Check size={16} /> Salvar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
