import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DarkModeProvider } from './context/DarkModeContext'
import LandingPage from './pages/LandingPage'
import PartnersPage from './pages/PartnersPage'
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Portfolio from './pages/admin/Portfolio'
import Leads from './pages/admin/Leads'
import Config from './pages/admin/Config'
import Users from './pages/admin/Users'
import AdminPartners from './pages/admin/Partners'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function MasterRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (profile?.role !== 'master') return <Navigate to="/admin" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/parceiros" element={<PartnersPage />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="leads" element={<Leads />} />
              <Route path="config" element={<Config />} />
              <Route path="users" element={<MasterRoute><Users /></MasterRoute>} />
              <Route path="partners" element={<AdminPartners />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  )
}
