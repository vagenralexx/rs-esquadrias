import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Lead } from '../../lib/types'
import { ClipboardList, Search, Trash2, Archive, Bookmark, CheckSquare, Square, Download, MessageCircle } from 'lucide-react'

type Status = 'new' | 'saved' | 'archived'

const TABS: { key: Status; label: string; color: string }[] = [
  { key: 'new', label: 'Novos', color: 'text-blue-600 dark:text-blue-400' },
  { key: 'saved', label: 'Salvos', color: 'text-green-600 dark:text-green-400' },
  { key: 'archived', label: 'Arquivados', color: 'text-gray-500 dark:text-gray-400' },
]

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Status>('new')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads((data as Lead[]) ?? [])
    setSelected(new Set())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const byTab = leads.filter(l => (l.status ?? 'new') === tab)
  const filtered = byTab.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.service.toLowerCase().includes(search.toLowerCase())
  )

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(l => l.id)))
  }

  async function bulkStatus(status: Status) {
    if (selected.size === 0) return
    setActing(true)
    await supabase.from('leads').update({ status }).in('id', Array.from(selected))
    setActing(false)
    load()
  }

  async function bulkDelete() {
    if (selected.size === 0) return
    if (!confirm(`Excluir ${selected.size} lead(s)? Esta ação não pode ser desfeita.`)) return
    setActing(true)
    await supabase.from('leads').delete().in('id', Array.from(selected))
    setActing(false)
    load()
  }

  async function updateOne(id: string, status: Status) {
    await supabase.from('leads').update({ status }).eq('id', id)
    load()
  }

  async function deleteOne(id: string, name: string) {
    if (!confirm(`Excluir lead de ${name}?`)) return
    await supabase.from('leads').delete().eq('id', id)
    load()
  }

  function exportCSV() {
    const header = 'Nome,Telefone,Email,Serviço,Mensagem,Origem,Status,Data'
    const rows = filtered.map(l =>
      `"${l.name}","${l.phone}","${l.email ?? ''}","${l.service}","${l.message}","${l.source}","${l.status ?? 'new'}","${new Date(l.created_at).toLocaleDateString('pt-BR')}"`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `leads-${tab}-${Date.now()}.csv`; a.click()
  }

  const counts = {
    new: leads.filter(l => (l.status ?? 'new') === 'new').length,
    saved: leads.filter(l => l.status === 'saved').length,
    archived: leads.filter(l => l.status === 'archived').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h1 className="text-xl md:text-2xl font-extrabold dark:text-gray-100">Leads</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-2 rounded-xl font-bold text-sm hover:brightness-110 transition">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelected(new Set()) }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${tab === t.key ? 'bg-white dark:bg-gray-900 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <span className={tab === t.key ? t.color : ''}>{t.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-extrabold ${tab === t.key ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
              placeholder="Buscar por nome, telefone ou serviço..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Bulk actions — only when something is selected */}
          {selected.size > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{selected.size} selecionado(s)</span>
              {tab !== 'saved' && (
                <button onClick={() => bulkStatus('saved')} disabled={acting} className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 transition disabled:opacity-50">
                  <Bookmark size={13} /> Salvar
                </button>
              )}
              {tab !== 'archived' && (
                <button onClick={() => bulkStatus('archived')} disabled={acting} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 transition disabled:opacity-50">
                  <Archive size={13} /> Arquivar
                </button>
              )}
              {tab !== 'new' && (
                <button onClick={() => bulkStatus('new')} disabled={acting} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 transition disabled:opacity-50">
                  Mover para Novos
                </button>
              )}
              <button onClick={bulkDelete} disabled={acting} className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:brightness-110 transition disabled:opacity-50">
                <Trash2 size={13} /> Excluir
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleAll} className="text-gray-400 hover:text-[#FF6B00] transition">
                    {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={16} className="text-[#FF6B00]" /> : <Square size={16} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Telefone</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">E-mail</th>
                <th className="px-4 py-3 text-left">Serviço</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Mensagem</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Data</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">{search ? 'Nenhum lead encontrado.' : `Nenhum lead ${tab === 'new' ? 'novo' : tab === 'saved' ? 'salvo' : 'arquivado'}.`}</p>
                  </div>
                </td></tr>
              ) : filtered.map(lead => (
                <tr key={lead.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${selected.has(lead.id) ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleOne(lead.id)} className="text-gray-400 hover:text-[#FF6B00] transition">
                      {selected.has(lead.id) ? <CheckSquare size={16} className="text-[#FF6B00]" /> : <Square size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium dark:text-gray-100 whitespace-nowrap">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{lead.phone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{lead.email ?? '—'}</td>
                  <td className="px-4 py-3"><span className="bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">{lead.service}</span></td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs max-w-xs truncate hidden lg:table-cell">{lead.message || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap hidden sm:table-cell">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <a href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                        <MessageCircle size={15} />
                      </a>
                      {tab !== 'saved' && (
                        <button onClick={() => updateOne(lead.id, 'saved')} title="Salvar" className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                          <Bookmark size={15} />
                        </button>
                      )}
                      {tab !== 'archived' && (
                        <button onClick={() => updateOne(lead.id, 'archived')} title="Arquivar" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                          <Archive size={15} />
                        </button>
                      )}
                      {tab !== 'new' && (
                        <button onClick={() => updateOne(lead.id, 'new')} title="Mover para Novos" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-xs font-bold">
                          ↩
                        </button>
                      )}
                      <button onClick={() => deleteOne(lead.id, lead.name)} title="Excluir" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

