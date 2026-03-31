import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Images, MessageSquare, Users } from 'lucide-react'

export default function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ portfolio: 0, leads: 0, users: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('portfolio').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]).then(([p, l, u]) => setStats({ portfolio: p.count ?? 0, leads: l.count ?? 0, users: u.count ?? 0 }))
  }, [])

  const cards = [
    { label: 'Fotos no Portfólio', value: stats.portfolio, icon: Images, color: 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00]' },
    { label: 'Leads Capturados', value: stats.leads, icon: MessageSquare, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Usuários', value: stats.users, icon: Users, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold dark:text-gray-100">Olá, {profile?.name ?? 'Admin'}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bem-vindo ao painel RS Esquadrias.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}><card.icon size={22} /></div>
            <p className="text-3xl font-extrabold dark:text-gray-100">{card.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
