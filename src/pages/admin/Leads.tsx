import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Lead } from '../../lib/types'
import { ClipboardList } from 'lucide-react'

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setLeads(data as Lead[])
    })
  }, [])

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.service.toLowerCase().includes(search.toLowerCase())
  )

  function exportCSV() {
    const header = 'Nome,Telefone,Email,Serviço,Mensagem,Origem,Data'
    const rows = leads.map(l => `"${l.name}","${l.phone}","${l.email ?? ''}","${l.service}","${l.message}","${l.source}","${new Date(l.created_at).toLocaleDateString('pt-BR')}"`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `leads-rs-${Date.now()}.csv`; a.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold dark:text-gray-100">Leads</h1>
        <button onClick={exportCSV} className="bg-[#FF6B00] text-white px-4 py-2 rounded-xl font-bold text-sm hover:brightness-110 transition">Exportar CSV</button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <input className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="Buscar por nome, telefone ou serviço..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Telefone</th>
                <th className="px-4 py-3 text-left">E-mail</th>
                <th className="px-4 py-3 text-left">Serviço</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3 font-medium dark:text-gray-100">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.phone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.email ?? '—'}</td>
                  <td className="px-4 py-3"><span className="bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] px-2 py-0.5 rounded-full text-xs font-bold">{lead.service}</span></td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <a href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600 font-bold text-xs hover:underline">WhatsApp</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400 dark:text-gray-500"><ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-40" /><p className="font-medium">Nenhum lead encontrado.</p></div>}
        </div>
      </div>
    </div>
  )
}
