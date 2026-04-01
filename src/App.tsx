import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DarkModeProvider } from './context/DarkModeContext'
import LandingPage from './pages/LandingPage'
import PartnersPage from './pages/PartnersPage'

const Login = lazy(() => import('./pages/admin/Login'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Portfolio = lazy(() => import('./pages/admin/Portfolio'))
const Leads = lazy(() => import('./pages/admin/Leads'))
const Config = lazy(() => import('./pages/admin/Config'))
const Users = lazy(() => import('./pages/admin/Users'))
const AdminPartners = lazy(() => import('./pages/admin/Partners'))
const AdminReviews = lazy(() => import('./pages/admin/Reviews'))

function AdminFallback() {
  return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <AdminFallback />
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
          <Suspense fallback={<AdminFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/parceiros" element={<PartnersPage />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="leads" element={<Leads />} />
                <Route path="config" element={<Config />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="users" element={<MasterRoute><Users /></MasterRoute>} />
                <Route path="partners" element={<AdminPartners />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  )
}
