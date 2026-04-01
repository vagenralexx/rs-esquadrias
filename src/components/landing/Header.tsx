import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { DarkModeToggle } from '../ui/DarkModeToggle'

interface Props { onOpenModal: (source: string) => void }

export default function Header({ onOpenModal }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed w-full z-50 bg-black/95 backdrop-blur border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="RS Esquadrias" className="h-9 w-auto" />
          <span className="font-extrabold text-base tracking-tight hidden sm:block uppercase text-white">Esquadrias e Vidraçaria</span>
        </a>
        <nav className="hidden md:flex gap-8 font-medium text-sm uppercase tracking-wider text-gray-300">
          {['#servicos','#diferenciais','#portfolio','#contato'].map(h => (
            <a key={h} href={h} className="hover:text-[#FF6B00] transition">{h.replace('#','')}</a>
          ))}
          <Link to="/parceiros" className="hover:text-[#FF6B00] transition">Parceiros</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <DarkModeToggle />
          <button onClick={() => onOpenModal('header_cta')} className="bg-[#FF6B00] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition shadow-md">
            <span className="hidden sm:inline">ORÇAMENTO GRÁTIS</span>
            <span className="sm:hidden">ORÇAMENTO</span>
          </button>
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm font-medium uppercase tracking-wider">
          {['#servicos','#diferenciais','#portfolio','#contato'].map(h => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="hover:text-[#FF6B00] transition text-gray-300">{h.replace('#','')}</a>
          ))}
          <Link to="/parceiros" onClick={() => setOpen(false)} className="hover:text-[#FF6B00] transition text-gray-300">Parceiros</Link>
        </div>
      )}
    </header>
  )
}
