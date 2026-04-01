import { MessageCircle } from 'lucide-react'

interface Props { onOpen: () => void }

export default function MobileCTA({ onOpen }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-100 dark:border-gray-800 shadow-lg">
      <button
        onClick={onOpen}
        className="w-full bg-[#FF6B00] text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-95"
      >
        <MessageCircle size={20} />
        Solicitar Orçamento Grátis
      </button>
    </div>
  )
}
