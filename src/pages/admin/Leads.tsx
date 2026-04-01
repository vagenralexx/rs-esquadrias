import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Lead } from '../../lib/types'
import { ClipboardList, MessageCircle, Trash2 } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  new: 'Novo',
  saved: 'Salvo',
  archived: 'Arquivado',
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const notesTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  async function load() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (data) setLeads(data as Lead[])
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, () => {
        load()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.service.toLowerCase().includes(search.toLowerCase())
  )

  function exportCSV() {
    const header = 'Nome,Telefone,Email,Serviço,Mensagem,Origem,Status,Data'
    const rows = leads.map(l => `"${l.name}","${l.phone}","${l.email ?? ''}","${l.service}","${l.message}","${l.source}","${l.status}","${new Date(l.created_at).toLocaleDateString('pt-BR')}"`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `leads-rs-${Date.now()}.csv`; a.click()
  }

  async function updateStatus(id: string, status: Lead['status']) {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  async function deleteOne(lead: Lead) {
    if (!confirm(`Excluir lead de ${lead.name}?`)) return
    await supabase.from('leads').delete().eq('id', lead.id)
    setLeads(prev => prev.filter(l => l.id !== lead.id))
  }

  function handleNotesChange(id: string, value: string) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: value } : l))
    clearTimeout(notesTimers.current[id])
    notesTimers.current[id] = setTimeout(async () => {
      await supabase.from('leads').update({ notes: value }).eq('id', id)
    }, 800)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold dark:text-gray-100">Leads</h1>
        <button onClick={exportCSV} className="bg-[#FF6B00] text-white px-4 py-2 rounded-xl font-bold text-sm hover:brightness-110 transition">Exportar CSV</button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <input
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
            placeholder="Buscar por nome, telefone ou serviço..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Telefone</th>
                <th className="px-4 py-3 text-left">Serviço</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(lead => (
                <>
                  <tr key={lead.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium dark:text-gray-100">{lead.name}</p>
                      {lead.email && <p className="text-xs text-gray-400">{lead.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-3">
                      <span className="bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] px-2 py-0.5 rounded-full text-xs font-bold">{lead.service}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status ?? 'new'}
                        onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                        className="text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-[#FF6B00]"
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}, vi seu contato sobre ${lead.service}. Como posso ajudar?`)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp com mensagem pré-preenchida"
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
                        >
                          <MessageCircle size={15} />
                        </a>
                        <button
                          onClick={() => deleteOne(lead)}
                          title="Excluir lead"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr key={`${lead.id}-notes`} className="bg-gray-50/50 dark:bg-gray-800/50">
                    <td colSpan={6} className="px-4 pb-2 pt-0">
                      <textarea
                        className="w-full text-xs border border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:border-[#FF6B00] placeholder-gray-300 dark:placeholder-gray-600"
                        rows={2}
                        placeholder="Notas internas (salvo automaticamente)..."
                        value={lead.notes ?? ''}
                        onChange={e => handleNotesChange(lead.id, e.target.value)}
                      />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="font-medium">Nenhum lead encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
