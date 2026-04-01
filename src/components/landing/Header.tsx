import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { DarkModeToggle } from '../ui/DarkModeToggle'

const WA = import.meta.env.VITE_WHATSAPP as string

interface Props { onOpenModal?: (source: string) => void }

export default function Header({ onOpenModal: _onOpenModal }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-black dark:bg-[#FF6B00] text-white px-2 py-1 rounded font-extrabold text-xl transition-colors">RS</div>
          <span className="font-extrabold text-base tracking-tight hidden sm:block uppercase text-gray-900 dark:text-gray-100">Esquadrias e Vidraçaria</span>
        </div>
        <nav className="hidden md:flex gap-8 font-medium text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {['#servicos','#diferenciais','#portfolio','#contato'].map(h => (
            <a key={h} href={h} className="hover:text-[#FF6B00] transition">{h.replace('#','')}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <DarkModeToggle />
          <a href={`https://wa.me/${WA}`} className="bg-[#FF6B00] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-110 transition shadow-md">
            <span className="hidden sm:inline">ORÇAMENTO GRÁTIS</span>
            <span className="sm:hidden">CONTATO</span>
          </a>
          <button 
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X size={22} className="text-gray-900 dark:text-gray-100" /> : <Menu size={22} className="text-gray-900 dark:text-gray-100" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 flex flex-col gap-4 text-sm font-medium uppercase tracking-wider">
          {['#servicos','#diferenciais','#portfolio','#contato'].map(h => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="hover:text-[#FF6B00] transition text-gray-700 dark:text-gray-300">{h.replace('#','')}</a>
          ))}
        </div>
      )}
    </header>
  )
}
