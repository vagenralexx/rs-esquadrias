import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Review } from '../../lib/types'

const REVIEWS_URL = 'https://www.google.com/maps/place/RS+Esquadria+e+Vidra%C3%A7aria/@-22.6117068,-46.3696963,17z/data=!4m8!3m7!1s0x94c9453c87bbd4ff:0x11e84f4c8188d06b!8m2!3d-22.611711!4d-46.3656004!9m1!1b1!16s%2Fg%2F11z2tg56zc?entry=ttu'

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('active', true)
      .order('order')
      .then(({ data }) => { if (data) setReviews(data as Review[]) })
  }, [])

  if (reviews.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gray-900 dark:text-gray-100 mb-3">
            O que nossos <span className="text-[#FF6B00]">Clientes</span> dizem
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">5,0</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Avaliação no Google — {reviews.length} avaliações verificadas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {reviews.map((r) => (
            <div key={r.id} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col">
              <Stars count={r.rating} />
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1 italic">"{r.body}"</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] font-extrabold text-xs">
                  {r.author_name.charAt(0)}
                </div>
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400">{r.author_name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={REVIEWS_URL} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#FF6B00] transition">
            Ver todas as avaliações no Google
          </a>
          <a href={REVIEWS_URL} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold bg-[#FF6B00] text-white px-4 py-2 rounded-full hover:brightness-110 transition">
            Deixar uma avaliação
          </a>
        </div>
      </div>
    </section>
  )
}
