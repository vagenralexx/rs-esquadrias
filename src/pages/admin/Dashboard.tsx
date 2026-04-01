import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Images, MessageSquare, Users, Eye, TrendingUp, Clock } from 'lucide-react'

interface VisitStats {
  today: number
  week: number
  month: number
  peakHour: string
  hourlyData: number[]
}

export default function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ portfolio: 0, leads: 0, users: 0 })
  const [visits, setVisits] = useState<VisitStats>({
    today: 0, week: 0, month: 0, peakHour: '-', hourlyData: Array(24).fill(0),
  })

  useEffect(() => {
    Promise.all([
      supabase.from('portfolio').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]).then(([p, l, u]) => setStats({ portfolio: p.count ?? 0, leads: l.count ?? 0, users: u.count ?? 0 }))

    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    supabase.from('page_views').select('created_at').gte('created_at', monthAgo).then(({ data }) => {
      if (!data) return
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000)
      let today = 0, week = 0
      const hourly = Array(24).fill(0)
      data.forEach(row => {
        const d = new Date(row.created_at)
        if (d >= todayStart) today++
        if (d >= weekStart) week++
        hourly[d.getHours()]++
      })
      const maxCount = Math.max(...hourly)
      const peakH = hourly.indexOf(maxCount)
      const peakHour = maxCount > 0
        ? `${String(peakH).padStart(2, '0')}h–${String(peakH + 1).padStart(2, '0')}h`
        : '-'
      setVisits({ today, week, month: data.length, peakHour, hourlyData: hourly })
    })
  }, [])

  const cards = [
    { label: 'Fotos no Portfólio', value: stats.portfolio, icon: Images, color: 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00]' },
    { label: 'Leads Capturados', value: stats.leads, icon: MessageSquare, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Usuários', value: stats.users, icon: Users, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
  ]

  const visitCards = [
    { label: 'Visitas Hoje', value: visits.today, icon: Eye, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    { label: 'Visitas (7 dias)', value: visits.week, icon: TrendingUp, color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
    { label: 'Hora de Pico', value: visits.peakHour, icon: Clock, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' },
  ]

  const maxHourly = Math.max(...visits.hourlyData, 1)

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-extrabold dark:text-gray-100">Olá, {profile?.name ?? 'Admin'}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bem-vindo ao painel RS Esquadrias.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${card.color}`}><card.icon size={20} /></div>
            <p className="text-2xl md:text-3xl font-extrabold dark:text-gray-100">{card.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm md:text-base font-bold dark:text-gray-100 mb-4 uppercase tracking-wider text-gray-600 dark:text-gray-400">Métricas do Site</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
        {visitCards.map(card => (
          <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${card.color}`}><card.icon size={20} /></div>
            <p className="text-2xl md:text-3xl font-extrabold dark:text-gray-100">{card.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Hourly distribution chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-sm font-bold dark:text-gray-100 mb-1">Visitas por Hora do Dia</p>
        <p className="text-xs text-gray-400 mb-4">Últimos 30 dias — útil para planejar anúncios no Meta</p>
        <div className="flex items-end gap-[2px] md:gap-1 h-24 md:h-32">
          {visits.hourlyData.map((count, hour) => (
            <div key={hour} className="group flex-1 flex flex-col items-center relative">
              <div
                className="w-full rounded-t-sm bg-[#FF6B00]/25 hover:bg-[#FF6B00] transition-colors cursor-default"
                style={{ height: `${(count / maxHourly) * 100}%`, minHeight: count > 0 ? '4px' : '1px' }}
                title={`${String(hour).padStart(2,'0')}h: ${count} visita${count !== 1 ? 's' : ''}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] md:text-[10px] text-gray-400 mt-1.5 select-none">
          <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Total no período:{' '}
          <span className="font-bold text-gray-700 dark:text-gray-200">{visits.month} visita{visits.month !== 1 ? 's' : ''}</span>
        </p>
      </div>
    </div>
  )
}
