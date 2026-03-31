import { useState } from 'react'
import { MapPin, Search, CheckCircle, XCircle, Loader } from 'lucide-react'

const BASE_LAT = -22.6104739
const BASE_LNG = -46.366385
const RADIUS_KM = 100

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

type Status = 'idle' | 'loading' | 'covered' | 'outside' | 'error'

export default function CoverageChecker() {
  const [cep, setCep] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [distance, setDistance] = useState<number | null>(null)
  const [city, setCity] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const formatCep = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 8)
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
  }

  async function check() {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) {
      setErrorMsg('CEP inválido. Digite 8 dígitos.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    setDistance(null)
    setCity('')

    try {
      // 1. ViaCEP — busca cidade/estado
      const viaCep = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const cepData = await viaCep.json()
      if (cepData.erro) {
        setErrorMsg('CEP não encontrado. Verifique e tente novamente.')
        setStatus('error')
        return
      }

      const { localidade, uf, logradouro } = cepData
      const cityLabel = `${localidade} - ${uf}`
      setCity(cityLabel)

      // 2. Nominatim — geocodifica para obter coordenadas
      const query = encodeURIComponent(
        [logradouro, localidade, uf, 'Brasil'].filter(Boolean).join(', ')
      )
      const nominatim = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      )
      const geoData = await nominatim.json()

      if (!geoData.length) {
        setErrorMsg('Não foi possível localizar as coordenadas deste CEP.')
        setStatus('error')
        return
      }

      const lat = parseFloat(geoData[0].lat)
      const lng = parseFloat(geoData[0].lon)
      const dist = haversine(BASE_LAT, BASE_LNG, lat, lng)
      setDistance(Math.round(dist))

      setStatus(dist <= RADIUS_KM ? 'covered' : 'outside')
    } catch {
      setErrorMsg('Erro ao verificar. Tente novamente.')
      setStatus('error')
    }
  }

  const WA = import.meta.env.VITE_WHATSAPP as string

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MapPin className="w-6 h-6 text-[#FF6B00]" strokeWidth={2.5} />
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gray-900 dark:text-gray-100">
            Verificar <span className="text-[#FF6B00]">Cobertura</span>
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-8">
          Atendemos em um raio de <strong className="text-gray-700 dark:text-gray-200">{RADIUS_KM} km</strong> a partir de Munhoz - MG.
          Digite seu CEP e descubra se atendemos na sua região.
        </p>

        {/* Input */}
        <div className="flex gap-2 max-w-sm mx-auto mb-6">
          <input
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            value={cep}
            onChange={e => setCep(formatCep(e.target.value))}
            onKeyDown={e => e.key === 'Enter' && check()}
            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            maxLength={9}
          />
          <button
            onClick={check}
            disabled={status === 'loading'}
            className="bg-[#FF6B00] text-white px-5 py-3 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-60 flex items-center gap-2"
          >
            {status === 'loading'
              ? <Loader className="w-5 h-5 animate-spin" />
              : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Resultado */}
        {status === 'covered' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center animate-fade-in">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-lg font-bold text-green-700 dark:text-green-400 mb-1">
              Ótima notícia! Atendemos em {city}
            </p>
            <p className="text-green-600 dark:text-green-500 text-sm mb-4">
              Distância até nossa sede: <strong>{distance} km</strong>
            </p>
            <a
              href={`https://wa.me/${WA}?text=Olá! Moro em ${city} e gostaria de solicitar um orçamento.`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Solicitar Orçamento pelo WhatsApp
            </a>
          </div>
        )}

        {status === 'outside' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">
              Fora da nossa área de atendimento
            </p>
            <p className="text-red-500 dark:text-red-400 text-sm mb-4">
              {city} fica a <strong>{distance} km</strong> — nossa cobertura é de {RADIUS_KM} km.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Entre em contato pelo WhatsApp para verificar exceções ou indicações na sua cidade.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 text-yellow-700 dark:text-yellow-400 text-sm">
            {errorMsg}
          </div>
        )}
      </div>
    </section>
  )
}
