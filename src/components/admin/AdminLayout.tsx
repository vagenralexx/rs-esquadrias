import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { LayoutDashboard, Images, Settings, Users, MessageSquare, LogOut, ExternalLink, Star } from 'lucide-react'
import { DarkModeToggle } from '../ui/DarkModeToggle'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/portfolio', label: 'Portfólio', icon: Images },
  { to: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { to: '/admin/reviews', label: 'Avaliações', icon: Star },
  { to: '/admin/config', label: 'Configurações', icon: Settings },
  { to: '/admin/users', label: 'Usuários', icon: Users, masterOnly: true },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [newLeadsCount, setNewLeadsCount] = useState(0)

  useEffect(() => {
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .then(({ count }) => setNewLeadsCount(count ?? 0))

    const channel = supabase
      .channel('admin-leads-badge')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new')
          .then(({ count }) => setNewLeadsCount(count ?? 0))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed h-full z-40">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white px-2 py-1 rounded font-extrabold text-lg">RS</div>
            <div>
              <p className="font-extrabold text-xs uppercase leading-tight dark:text-gray-100">Painel Admin</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">{profile?.role ?? '...'}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(item => {
            if (item.masterOnly && profile?.role !== 'master') return null
            return (
              <NavLink key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-[#FF6B00] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <item.icon size={16} />
                {item.label}
                {item.to === '/admin/leads' && newLeadsCount > 0 && (
                  <span className="ml-auto bg-[#FF6B00] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                    {newLeadsCount > 99 ? '99+' : newLeadsCount}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="px-1 py-1"><DarkModeToggle /></div>
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ExternalLink size={16} /> Ver site
          </a>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8 dark:text-gray-100"><Outlet /></main>
    </div>
  )
}
