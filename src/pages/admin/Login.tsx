import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await signIn(email, password)
    if (error) { setError('E-mail ou senha incorretos.'); setLoading(false) }
    else navigate('/admin')
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/reset-password` })
    setLoading(false)
    if (error) setError(error.message)
    else setResetSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="RS Esquadrias" className="h-10 w-auto" />
          <span className="font-extrabold text-sm uppercase">Painel Admin</span>
        </div>
        {resetMode ? (
          <>
            <h1 className="text-xl font-extrabold mb-1 dark:text-gray-100">Recuperar senha</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enviaremos um link para seu e-mail.</p>
            {resetSent ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl p-4 text-sm font-medium">Link enviado! Verifique seu e-mail.</div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <input type="email" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition disabled:opacity-60">{loading ? 'Enviando...' : 'Enviar link'}</button>
              </form>
            )}
            <button onClick={() => setResetMode(false)} className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">← Voltar ao login</button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-extrabold mb-1 dark:text-gray-100">Entrar</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Acesse o painel de administração.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">E-mail</label>
                <input type="email" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Senha</label>
                <div className="relative mt-1">
                  <input type={showPassword ? 'text' : 'password'} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#FF6B00]" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition disabled:opacity-60">{loading ? 'Entrando...' : 'Entrar'}</button>
            </form>
            <button onClick={() => setResetMode(true)} className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-[#FF6B00] transition">Esqueci minha senha</button>
          </>
        )}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <Link to="/" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">← Voltar ao site</Link>
        </div>
      </div>
    </div>
  )
}
