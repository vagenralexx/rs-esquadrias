import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Profile, Role } from '../../lib/types'
import { useAuth } from '../../context/AuthContext'
import { UserPlus, Key, Trash2 } from 'lucide-react'

const ROLES: Role[] = ['master', 'editor', 'viewer']

export default function Users() {
  const { profile: me } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' as Role })
  const [creating, setCreating] = useState(false)
  const [resetPwd, setResetPwd] = useState<string | null>(null)
  const [newPwd, setNewPwd] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    if (data) setUsers(data as Profile[])
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setCreating(true); setMsg('')
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { name: form.name } } })
    if (error || !data.user) { setMsg('Erro: ' + (error?.message ?? 'Falha ao criar usuário')); setCreating(false); return }
    await supabase.from('profiles').upsert({ id: data.user.id, email: form.email, name: form.name, role: form.role })
    setForm({ name: '', email: '', password: '', role: 'editor' }); setCreating(false); setMsg('Usuário criado com sucesso!'); load()
  }

  async function handleChangePassword(userId: string) {
    if (!newPwd || newPwd.length < 6) { setMsg('Senha deve ter ao menos 6 caracteres.'); return }
    const user = users.find(u => u.id === userId)
    if (!user) return
    await supabase.auth.resetPasswordForEmail(user.email)
    setMsg(`Link de redefinição enviado para ${user.email}`); setResetPwd(null); setNewPwd('')
  }

  async function handleDelete(user: Profile) {
    if (user.id === me?.id) { setMsg('Você não pode remover sua própria conta.'); return }
    if (!confirm(`Remover usuário "${user.name}"?`)) return
    await supabase.from('profiles').delete().eq('id', user.id); load()
  }

  async function handleRoleChange(userId: string, role: Role) {
    await supabase.from('profiles').update({ role }).eq('id', userId); load()
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6 dark:text-gray-100">Usuários</h1>
      <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 max-w-2xl">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2"><UserPlus size={16} /> Novo usuário</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nome</label>
            <input className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">E-mail</label>
            <input type="email" className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Senha inicial</label>
            <input type="password" className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} minLength={6} required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nível de acesso</label>
            <select className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={creating} className="mt-4 bg-[#FF6B00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition disabled:opacity-60">{creating ? 'Criando...' : 'Criar usuário'}</button>
        {msg && <p className="mt-3 text-sm font-medium text-green-600">{msg}</p>}
      </form>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">E-mail</th>
              <th className="px-4 py-3 text-left">Nível</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-4 py-3 font-medium dark:text-gray-100">{user.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="px-4 py-3">
                  <select className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#FF6B00]" value={user.role} onChange={e => handleRoleChange(user.id, e.target.value as Role)} disabled={user.id === me?.id}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <button onClick={() => { setResetPwd(user.id); setNewPwd('') }} className="text-blue-500 hover:text-blue-700 transition" title="Redefinir senha"><Key size={15} /></button>
                  {user.id !== me?.id && <button onClick={() => handleDelete(user)} className="text-red-400 hover:text-red-600 transition" title="Remover"><Trash2 size={15} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {resetPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-extrabold mb-4 dark:text-gray-100">Redefinir senha</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Um link de redefinição será enviado por e-mail.</p>
            <input type="password" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00] mb-4" placeholder="Nova senha (mín. 6 caracteres)" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => handleChangePassword(resetPwd)} className="flex-1 bg-[#FF6B00] text-white py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition">Confirmar</button>
              <button onClick={() => setResetPwd(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
