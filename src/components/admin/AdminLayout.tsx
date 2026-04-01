import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { LayoutDashboard, Images, Settings, Users, MessageSquare, LogOut, ExternalLink, Star, Handshake, Menu, X } from 'lucide-react'
import { DarkModeToggle } from '../ui/DarkModeToggle'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/portfolio', label: 'Portfólio', icon: Images },
  { to: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { to: '/admin/reviews', label: 'Avaliações', icon: Star },
  { to: '/admin/config', label: 'Configurações', icon: Settings },
  { to: '/admin/partners', label: 'Parceiros', icon: Handshake },
  { to: '/admin/users', label: 'Usuários', icon: Users, masterOnly: true },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [newLeadsCount, setNewLeadsCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed h-full z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="RS Esquadrias" className="h-8 w-auto" />
              <div>
                <p className="font-extrabold text-xs uppercase leading-tight dark:text-gray-100">Painel Admin</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">{profile?.role ?? '...'}</p>
              </div>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Abrir menu"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="RS Esquadrias" className="h-7 w-auto" />
            <span className="font-extrabold text-sm uppercase dark:text-gray-100">Painel Admin</span>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 dark:text-gray-100 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
