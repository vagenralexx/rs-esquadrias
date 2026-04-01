# RS Esquadrias — Melhorias em 3 Fases: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evoluir o site RS Esquadrias em 3 fases sequenciais: SEO & Performance → Conversão da Landing → Admin Eficiente.

**Architecture:** Fase 1 adiciona arquivos estáticos e otimizações de build sem tocar na lógica de negócio. Fase 2 evolui a landing page com dados do Supabase e novos componentes de conversão. Fase 3 adiciona realtime, Edge Function de email e melhorias de produtividade no admin.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4, Supabase (DB + Storage + Edge Functions), React Router v7, Resend (email), HTML5 Drag API.

---

## File Map

### Fase 1 — SEO & Performance
- **Create:** `public/sitemap.xml`
- **Create:** `public/robots.txt`
- **Modify:** `src/App.tsx` — lazy loading de rotas admin
- **Modify:** `index.html` — preconnect links
- **Modify:** `vite.config.ts` — vite-plugin-compression
- **Modify:** `src/components/landing/Hero.tsx` — hero_image from site_config
- **Modify:** `src/pages/LandingPage.tsx` — fetch site_config (hero_image)
- **Modify:** `src/pages/admin/Config.tsx` — campo hero_image

### Fase 2 — Conversão
- **Create:** `src/hooks/useIntersectionObserver.ts`
- **Modify:** `src/components/landing/Services.tsx` — animação de entrada
- **Modify:** `src/components/landing/Differentials.tsx` — animação de entrada
- **Modify:** `src/components/landing/Portfolio.tsx` — animação de entrada
- **Modify:** `src/components/landing/Reviews.tsx` — fetch do Supabase
- **Create:** `src/pages/admin/Reviews.tsx` — CRUD de depoimentos
- **Modify:** `src/App.tsx` — rota /admin/reviews
- **Modify:** `src/components/admin/AdminLayout.tsx` — nav item Reviews
- **Modify:** `src/lib/types.ts` — tipo Review
- **Modify:** `src/components/landing/LeadModal.tsx` — services do config, success state
- **Modify:** `src/pages/LandingPage.tsx` — fetch services_list, passa para LeadModal
- **Create:** `src/components/landing/MobileCTA.tsx`
- **Modify:** `src/pages/admin/Config.tsx` — campo services_list

### Fase 3 — Admin Eficiente
- **Modify:** `sql/setup.sql` — migration reviews table + leads.notes + site_config keys
- **Modify:** `src/lib/types.ts` — campo notes em Lead
- **Create:** `supabase/functions/notify-new-lead/index.ts`
- **Modify:** `src/pages/admin/Leads.tsx` — realtime subscription + notes + WA template
- **Modify:** `src/components/admin/AdminLayout.tsx` — badge de leads novos
- **Modify:** `src/pages/admin/Portfolio.tsx` — drag-and-drop reorder
- **Modify:** `src/pages/admin/Config.tsx` — campo notification_email

---

## FASE 1 — SEO & PERFORMANCE

---

### Task 1: Arquivos estáticos de SEO

**Files:**
- Create: `public/sitemap.xml`
- Create: `public/robots.txt`

- [ ] **Step 1: Criar sitemap.xml**

Criar `public/sitemap.xml` com o conteúdo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rsesquadrias.com.br/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rsesquadrias.com.br/parceiros</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Criar robots.txt**

Criar `public/robots.txt` com o conteúdo:

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://rsesquadrias.com.br/sitemap.xml
```

- [ ] **Step 3: Verificar no build**

```bash
npm run build
```

Esperado: `dist/sitemap.xml` e `dist/robots.txt` presentes na pasta de saída.

- [ ] **Step 4: Commit**

```bash
git add public/sitemap.xml public/robots.txt
git commit -m "feat(seo): add sitemap.xml and robots.txt"
```

---

### Task 2: Preconnect e compressão de build

**Files:**
- Modify: `index.html`
- Modify: `vite.config.ts`

- [ ] **Step 1: Instalar vite-plugin-compression**

```bash
npm install -D vite-plugin-compression
```

Esperado: `vite-plugin-compression` aparece em `devDependencies` no `package.json`.

- [ ] **Step 2: Configurar compressão no vite.config.ts**

Substituir o conteúdo de `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
})
```

- [ ] **Step 3: Adicionar preconnect no index.html**

No `index.html`, adicionar dentro de `<head>` logo após `<meta charset="UTF-8" />`:

```html
<!-- Preconnect para recursos externos críticos -->
<link rel="preconnect" href="https://buykmrxavdzadcapdseo.supabase.co" />
<link rel="dns-prefetch" href="https://buykmrxavdzadcapdseo.supabase.co" />
<link rel="preconnect" href="https://images.unsplash.com" crossorigin />
```

- [ ] **Step 4: Verificar build com compressão**

```bash
npm run build
```

Esperado: arquivos `.gz` e `.br` gerados em `dist/assets/`.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts index.html package.json package-lock.json
git commit -m "perf: add gzip/brotli compression and preconnect hints"
```

---

### Task 3: Lazy loading de rotas admin

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Converter imports do admin para React.lazy em App.tsx**

Substituir o bloco de imports estáticos das páginas admin pelo seguinte conteúdo completo de `src/App.tsx`:

```tsx
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
```

- [ ] **Step 2: Verificar que o build não quebra**

```bash
npm run build
```

Esperado: build sem erros. Chunks separados para as páginas admin visíveis nos logs.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "perf: lazy-load admin routes to reduce landing page bundle"
```

---

### Task 4: Hero image configurável via admin

**Files:**
- Modify: `src/pages/LandingPage.tsx`
- Modify: `src/components/landing/Hero.tsx`
- Modify: `src/pages/admin/Config.tsx`

- [ ] **Step 1: Buscar site_config em LandingPage e passar heroImage para Hero**

Substituir o conteúdo completo de `src/pages/LandingPage.tsx`:

```tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import Differentials from '../components/landing/Differentials'
import Portfolio from '../components/landing/Portfolio'
import Reviews from '../components/landing/Reviews'
import CoverageChecker from '../components/landing/CoverageChecker'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'
import WhatsAppFloat from '../components/landing/WhatsAppFloat'
import LeadModal from '../components/landing/LeadModal'
import MobileCTA from '../components/landing/MobileCTA'

const WA = import.meta.env.VITE_WHATSAPP as string

function getOrCreateSessionId() {
  let sid = sessionStorage.getItem('_rs_sid')
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('_rs_sid', sid)
  }
  return sid
}

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalSource, setModalSource] = useState('landing')
  const [heroImage, setHeroImage] = useState('')
  const [servicesList, setServicesList] = useState<string[]>([])

  function openModal(source = 'landing') {
    setModalSource(source)
    setShowModal(true)
  }

  useEffect(() => {
    const sid = getOrCreateSessionId()
    if (!sessionStorage.getItem('_rs_pv')) {
      supabase.from('page_views').insert({ session_id: sid, page: '/' }).then(() => {
        sessionStorage.setItem('_rs_pv', '1')
      })
    }

    supabase.from('site_config').select('key,value').in('key', ['hero_image', 'services_list']).then(({ data }) => {
      if (!data) return
      data.forEach(({ key, value }) => {
        if (key === 'hero_image') setHeroImage(value)
        if (key === 'services_list' && value) setServicesList(value.split(',').map(s => s.trim()).filter(Boolean))
      })
    })
  }, [])

  return (
    <>
      <Header onOpenModal={openModal} />
      <Hero openModal={openModal} heroImage={heroImage} />
      <Services />
      <Differentials />
      <Portfolio openModal={openModal} />
      <Reviews />
      <CoverageChecker />
      <Contact openModal={openModal} />
      <Footer openModal={openModal} />
      <WhatsAppFloat onOpen={() => openModal('float_whatsapp')} />
      <MobileCTA onOpen={() => openModal('cta_mobile')} />
      {showModal && (
        <LeadModal
          onClose={() => setShowModal(false)}
          waNumber={WA}
          source={modalSource}
          servicesList={servicesList}
        />
      )}
    </>
  )
}
```

- [ ] **Step 2: Atualizar Hero.tsx para receber heroImage como prop**

Substituir o conteúdo completo de `src/components/landing/Hero.tsx`:

```tsx
import { MessageCircle, ChevronDown } from 'lucide-react'

const FALLBACK_BG = "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=1600"
const FALLBACK_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"

interface Props {
  openModal: (source: string) => void
  heroImage?: string
}

export default function Hero({ openModal, heroImage }: Props) {
  const bgImage = heroImage || FALLBACK_BG

  return (
    <section
      className="min-h-screen flex items-center pt-20"
      style={{ background: `linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.82)),url('${bgImage}') center/cover no-repeat` }}
    >
      <div className="container mx-auto px-4 text-center md:text-left grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-5 md:space-y-6">
          <span className="inline-block bg-[#FF6B00] text-white px-3 md:px-4 py-1 rounded text-xs font-bold tracking-widest uppercase">Qualidade e Precisão</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            A transparência do vidro com a força do <span className="text-[#FF6B00]">Alumínio</span>.
          </h1>
          <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0">
            Soluções sob medida em esquadrias de alumínio e vidros temperados para valorizar cada detalhe da sua obra.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
            <button
              onClick={() => openModal('hero_whatsapp')}
              className="bg-[#FF6B00] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:brightness-110 transition flex justify-center items-center gap-2 md:gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar Orçamento
            </button>
            <a
              href="#servicos"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition flex justify-center items-center gap-2"
            >
              Conheça o Trabalho
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/5 p-3 md:p-4 rounded-2xl border border-white/10">
            <img
              src={heroImage || FALLBACK_IMG}
              alt="Janelas de Alto Padrão"
              loading="eager"
              decoding="async"
              className="rounded-xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Adicionar campo hero_image em Config.tsx**

Em `src/pages/admin/Config.tsx`, substituir o array `FIELDS` para incluir os novos campos:

```tsx
const FIELDS = [
  { key: 'address', label: 'Endereço', placeholder: 'Rua, número - Bairro, Cidade - UF' },
  { key: 'phone', label: 'Telefone / WhatsApp', placeholder: '(35) 99720-0066' },
  { key: 'email', label: 'E-mail profissional', placeholder: 'contato@rsesquadrias.com.br' },
  { key: 'notification_email', label: 'E-mail para receber notificação de leads', placeholder: 'seuemail@rsesquadrias.com.br' },
  { key: 'instagram', label: 'Instagram (URL)', placeholder: 'https://instagram.com/...' },
  { key: 'facebook', label: 'Facebook (URL)', placeholder: 'https://facebook.com/...' },
  { key: 'tiktok', label: 'TikTok (URL)', placeholder: 'https://tiktok.com/@...' },
  { key: 'maps', label: 'Google Maps (URL do link)', placeholder: 'https://maps.google.com/...' },
  { key: 'maps_embed', label: 'Google Maps (URL do iframe/embed)', placeholder: 'https://maps.google.com/maps?q=...&output=embed' },
  { key: 'hero_image', label: 'Imagem do Hero (URL)', placeholder: 'https://... (URL da foto principal do site)' },
  { key: 'services_list', label: 'Serviços (separados por vírgula)', placeholder: 'Esquadrias de Alumínio, Box de Banheiro, Vidros Temperados, Outro' },
]
```

- [ ] **Step 4: Verificar no browser**

Iniciar o servidor de dev:

```bash
npm run dev
```

Abrir `http://localhost:5173/` — o Hero deve renderizar normalmente com imagem Unsplash como fallback.
Abrir `http://localhost:5173/admin/config` — os novos campos devem aparecer no formulário.

- [ ] **Step 5: Commit**

```bash
git add src/pages/LandingPage.tsx src/components/landing/Hero.tsx src/pages/admin/Config.tsx
git commit -m "feat(config): hero image and services list configurable from admin"
```

---

## FASE 2 — CONVERSÃO DA LANDING PAGE

---

### Task 5: Hook de animação de entrada por seção

**Files:**
- Create: `src/hooks/useIntersectionObserver.ts`
- Modify: `src/components/landing/Services.tsx`
- Modify: `src/components/landing/Differentials.tsx`

- [ ] **Step 1: Criar useIntersectionObserver.ts**

Criar `src/hooks/useIntersectionObserver.ts`:

```ts
import { useEffect, useRef, useState } from 'react'

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.15, ...options })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
```

- [ ] **Step 2: Adicionar classe CSS de animação no index.html (ou globals)**

No `index.html`, dentro de `<head>`, adicionar antes de `</head>`:

```html
<style>
  @media (prefers-reduced-motion: no-preference) {
    .fade-in-section {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in-section.visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

- [ ] **Step 3: Aplicar animação em Services.tsx**

Abrir `src/components/landing/Services.tsx`. Adicionar o import do hook e envolver o `<section>` com as classes de animação:

```tsx
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

// Dentro do componente Services, antes do return:
const { ref, isVisible } = useIntersectionObserver()

// No JSX, trocar a tag section de abertura para:
<section
  ref={ref as React.RefObject<HTMLElement>}
  className={`fade-in-section${isVisible ? ' visible' : ''} py-16 md:py-20 ...restante das classes existentes...`}
>
```

Aplicar o mesmo padrão em `src/components/landing/Differentials.tsx`.

- [ ] **Step 4: Verificar visualmente**

```bash
npm run dev
```

Abrir `http://localhost:5173/`. Rolar a página — as seções de Serviços e Diferenciais devem aparecer com fade-in suave.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useIntersectionObserver.ts src/components/landing/Services.tsx src/components/landing/Differentials.tsx index.html
git commit -m "feat(landing): add scroll-triggered fade-in animations"
```

---

### Task 6: Reviews gerenciáveis via Supabase

**Files:**
- Modify: `sql/setup.sql`
- Modify: `src/lib/types.ts`
- Modify: `src/components/landing/Reviews.tsx`

- [ ] **Step 1: Adicionar migration da tabela reviews em sql/setup.sql**

Abrir `sql/setup.sql` e adicionar no final:

```sql
-- ============================================================
-- TABELA DE AVALIAÇÕES (REVIEWS)
-- ============================================================
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  author_name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  body text not null default '',
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select" on public.reviews;
drop policy if exists "reviews_all" on public.reviews;

-- Visitantes veem apenas reviews ativas
create policy "reviews_select" on public.reviews for select using (active = true);
-- Só autenticados podem gerenciar
create policy "reviews_all" on public.reviews for all to authenticated using (true) with check (true);

-- Inserir as avaliações atuais hardcoded como ponto de partida
insert into public.reviews (author_name, rating, body, "order", active) values
  ('Sophia Moraes', 5, 'Um ótimo atendimento, recomendo!', 1, true),
  ('Aparecida Fogaça', 5, 'Excelente atendimento e serviço, super indico.', 2, true),
  ('João Almeida', 5, 'Muito bom serviço e excelente atendimento.', 3, true),
  ('Vovó Lola', 5, 'Atendimento impecável, trabalho de qualidade!', 4, true)
on conflict do nothing;
```

- [ ] **Step 2: Executar a migration no Supabase**

Acessar o painel do Supabase → SQL Editor → colar e executar o bloco acima.

Verificar: tabela `reviews` criada com 4 registros.

- [ ] **Step 3: Adicionar tipo Review em src/lib/types.ts**

Abrir `src/lib/types.ts` e adicionar ao final:

```ts
export interface Review {
  id: string
  author_name: string
  rating: number
  body: string
  order: number
  active: boolean
  created_at: string
}
```

- [ ] **Step 4: Atualizar Reviews.tsx para buscar do Supabase**

Substituir o conteúdo completo de `src/components/landing/Reviews.tsx`:

```tsx
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
```

- [ ] **Step 5: Verificar no browser**

```bash
npm run dev
```

Acessar `http://localhost:5173/` — a seção de avaliações deve exibir os 4 depoimentos buscados do Supabase.

- [ ] **Step 6: Commit**

```bash
git add sql/setup.sql src/lib/types.ts src/components/landing/Reviews.tsx
git commit -m "feat(reviews): fetch reviews from Supabase instead of hardcoded array"
```

---

### Task 7: Página admin de avaliações (CRUD)

**Files:**
- Create: `src/pages/admin/Reviews.tsx`
- Modify: `src/components/admin/AdminLayout.tsx`

- [ ] **Step 1: Criar src/pages/admin/Reviews.tsx**

```tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Review } from '../../lib/types'
import { Star, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ author_name: '', rating: 5, body: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('order')
    setReviews((data as Review[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name.trim() || !form.body.trim()) return
    setSaving(true)
    await supabase.from('reviews').insert({
      author_name: form.author_name,
      rating: form.rating,
      body: form.body,
      order: reviews.length + 1,
      active: true,
    })
    setForm({ author_name: '', rating: 5, body: '' })
    setSaving(false)
    load()
  }

  async function toggleActive(r: Review) {
    await supabase.from('reviews').update({ active: !r.active }).eq('id', r.id)
    load()
  }

  async function handleDelete(r: Review) {
    if (!confirm(`Excluir avaliação de ${r.author_name}?`)) return
    await supabase.from('reviews').delete().eq('id', r.id)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6 dark:text-gray-100">Avaliações</h1>

      {/* Formulário de adição */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Adicionar avaliação</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nome do cliente *</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]"
              placeholder="Ex: Maria Silva"
              value={form.author_name}
              onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nota (1-5)</label>
            <select
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]"
              value={form.rating}
              onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} estrela{n !== 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Texto da avaliação *</label>
          <textarea
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00] resize-none"
            rows={3}
            placeholder="O que o cliente disse..."
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 bg-[#FF6B00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center gap-2 disabled:opacity-60"
        >
          <Plus size={16} /> {saving ? 'Adicionando...' : 'Adicionar avaliação'}
        </button>
      </form>

      {/* Lista */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Carregando...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Nenhuma avaliação ainda.</p>
        ) : reviews.map(r => (
          <div key={r.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4 ${!r.active ? 'opacity-50' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] font-extrabold text-sm shrink-0">
              {r.author_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-sm dark:text-gray-100">{r.author_name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{r.body}"</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => toggleActive(r)}
                title={r.active ? 'Ocultar do site' : 'Exibir no site'}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              >
                {r.active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button
                onClick={() => handleDelete(r)}
                title="Excluir"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Adicionar item de nav Reviews em AdminLayout.tsx**

Em `src/components/admin/AdminLayout.tsx`, adicionar ao array `nav` (após o item de Leads):

```tsx
import { LayoutDashboard, Images, Settings, Users, MessageSquare, LogOut, ExternalLink, Menu, X, Handshake, Star } from 'lucide-react'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/portfolio', label: 'Portfólio', icon: Images },
  { to: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { to: '/admin/reviews', label: 'Avaliações', icon: Star },
  { to: '/admin/config', label: 'Configurações', icon: Settings },
  { to: '/admin/partners', label: 'Parceiros', icon: Handshake },
  { to: '/admin/users', label: 'Usuários', icon: Users, masterOnly: true },
]
```

- [ ] **Step 3: Verificar no browser**

```bash
npm run dev
```

Acessar `http://localhost:5173/admin/reviews` — o CRUD de avaliações deve funcionar: adicionar, ocultar/exibir e excluir.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/Reviews.tsx src/components/admin/AdminLayout.tsx
git commit -m "feat(admin): add reviews management page"
```

---

### Task 8: LeadModal — success state e services do config

**Files:**
- Modify: `src/components/landing/LeadModal.tsx`

- [ ] **Step 1: Atualizar LeadModal.tsx para receber servicesList e exibir success state**

Substituir o conteúdo completo de `src/components/landing/LeadModal.tsx`:

```tsx
import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const DEFAULT_SERVICES = [
  'Esquadrias de Alumínio', 'Vidros de Segurança', 'Espelhos Premium',
  'Box de Banheiro', 'Pele de Vidro / Fachada', 'Portões de Alumínio', 'Outro',
]

interface Props {
  onClose: () => void
  waNumber: string
  source?: string
  servicesList?: string[]
}

export default function LeadModal({ onClose, waNumber, source, servicesList }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const services = servicesList && servicesList.length > 0 ? servicesList : DEFAULT_SERVICES

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('leads').insert({
      name: form.name, phone: form.phone, email: form.email || null,
      service: form.service, message: form.message, source: source ?? 'landing',
    })
    setLoading(false)
    setSuccess(true)

    const lines = [
      `Olá! Me chamo ${form.name}.`,
      `Telefone: ${form.phone}`,
      `Serviço: ${form.service}`,
      ...(form.message ? [form.message] : []),
    ]
    const text = encodeURIComponent(lines.join('\n'))
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const url = isMobile
      ? `whatsapp://send?phone=${waNumber}&text=${text}`
      : `https://web.whatsapp.com/send?phone=${waNumber}&text=${text}`

    setTimeout(() => {
      window.open(url, '_blank')
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X size={20} />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-extrabold dark:text-gray-100 mb-2">Recebemos seu contato!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Em breve falaremos com você. Redirecionando para o WhatsApp...</p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-xl font-extrabold dark:text-gray-100">Solicitar Orçamento</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Preencha rapidinho e te redirecionamos para o WhatsApp já com as informações.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Nome *</label>
                <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="Seu nome completo" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">WhatsApp / Telefone *</label>
                <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="(35) 99999-9999" value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">E-mail</label>
                <input type="email" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" placeholder="seu@email.com (opcional)" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Serviço desejado *</label>
                <select className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={form.service} onChange={e => set('service', e.target.value)} required>
                  <option value="">Selecione...</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Mensagem</label>
                <textarea className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00] resize-none" rows={3} placeholder="Descreva brevemente o que precisa..." value={form.message} onChange={e => set('message', e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? 'Enviando...' : 'Ir para o WhatsApp →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar no browser**

```bash
npm run dev
```

Abrir `http://localhost:5173/`, clicar em "Solicitar Orçamento", preencher o formulário e enviar. Esperado: tela de sucesso com checkmark verde antes de redirecionar para WhatsApp.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/LeadModal.tsx
git commit -m "feat(modal): add success state and dynamic services list from config"
```

---

### Task 9: CTA fixo no mobile

**Files:**
- Create: `src/components/landing/MobileCTA.tsx`

- [ ] **Step 1: Criar MobileCTA.tsx**

Criar `src/components/landing/MobileCTA.tsx`:

```tsx
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
```

Observação: o `LandingPage.tsx` já foi atualizado na Task 4 para importar e usar `<MobileCTA>`. Se a Task 4 ainda não foi executada, adicionar manualmente em `LandingPage.tsx`:

```tsx
import MobileCTA from '../components/landing/MobileCTA'
// ... dentro do return, antes do fechamento do fragment:
<MobileCTA onOpen={() => openModal('cta_mobile')} />
```

- [ ] **Step 2: Verificar no browser em modo mobile**

```bash
npm run dev
```

Acessar `http://localhost:5173/` com DevTools aberto em modo mobile (≤ 768px). Uma barra laranja "Solicitar Orçamento Grátis" deve aparecer fixada na parte inferior. Em desktop, não deve aparecer.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/MobileCTA.tsx
git commit -m "feat(landing): add fixed mobile CTA bar"
```

---

## FASE 3 — ADMIN EFICIENTE

---

### Task 10: Migration — leads.notes e site_config seeds

**Files:**
- Modify: `sql/setup.sql`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Adicionar migration em sql/setup.sql**

Abrir `sql/setup.sql` e adicionar no final:

```sql
-- ============================================================
-- MIGRATION: Campo notes na tabela leads
-- ============================================================
alter table public.leads add column if not exists notes text not null default '';

-- ============================================================
-- SEED: Novas chaves em site_config
-- ============================================================
insert into public.site_config (key, value) values
  ('notification_email', ''),
  ('hero_image', ''),
  ('services_list', 'Esquadrias de Alumínio,Vidros de Segurança,Espelhos Premium,Box de Banheiro,Pele de Vidro / Fachada,Portões de Alumínio,Outro')
on conflict (key) do nothing;
```

- [ ] **Step 2: Executar no Supabase**

Acessar painel Supabase → SQL Editor → colar e executar o bloco acima.

Verificar: coluna `notes` visível na tabela `leads`; novas chaves em `site_config`.

- [ ] **Step 3: Atualizar tipo Lead em src/lib/types.ts**

Em `src/lib/types.ts`, adicionar `notes` na interface `Lead`:

```ts
export interface Lead {
  id: string
  name: string
  phone: string
  email: string | null
  service: string
  message: string
  source: string
  status: 'new' | 'saved' | 'archived'
  notes: string
  created_at: string
}
```

- [ ] **Step 4: Commit**

```bash
git add sql/setup.sql src/lib/types.ts
git commit -m "feat(db): add leads.notes column and site_config seed keys"
```

---

### Task 11: Edge Function — notificação de lead por email

**Files:**
- Create: `supabase/functions/notify-new-lead/index.ts`

- [ ] **Step 1: Criar estrutura da Edge Function**

```bash
mkdir -p "supabase/functions/notify-new-lead"
```

- [ ] **Step 2: Criar supabase/functions/notify-new-lead/index.ts**

```ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const lead = payload.record

    if (!lead) {
      return new Response(JSON.stringify({ error: 'No record in payload' }), { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: configRow } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'notification_email')
      .single()

    const notificationEmail = configRow?.value?.trim()

    if (!notificationEmail) {
      console.log('notification_email not configured, skipping.')
      return new Response(JSON.stringify({ skipped: true }), { status: 200 })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')!

    const emailBody = `
      <h2>Novo Lead — RS Esquadrias</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Nome</td><td style="padding:8px;">${lead.name}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Telefone</td><td style="padding:8px;">${lead.phone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#666;">E-mail</td><td style="padding:8px;">${lead.email ?? '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Serviço</td><td style="padding:8px;">${lead.service}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Mensagem</td><td style="padding:8px;">${lead.message || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Origem</td><td style="padding:8px;">${lead.source}</td></tr>
      </table>
      <p style="margin-top:16px;"><a href="https://rsesquadrias.com.br/admin/leads" style="background:#FF6B00;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Ver no Painel →</a></p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RS Esquadrias <noreply@rsesquadrias.com.br>',
        to: [notificationEmail],
        subject: `Novo lead: ${lead.name} — ${lead.service}`,
        html: emailBody,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: err }), { status: 500 })
    }

    return new Response(JSON.stringify({ sent: true }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
```

- [ ] **Step 3: Configurar o Database Webhook no Supabase**

No painel Supabase:
1. Ir em **Database → Webhooks**
2. Criar novo webhook:
   - **Name:** `notify-new-lead`
   - **Table:** `leads`
   - **Events:** `INSERT`
   - **Type:** Supabase Edge Functions
   - **Edge Function:** `notify-new-lead`
3. Salvar

- [ ] **Step 4: Configurar variável RESEND_API_KEY no Supabase**

No painel Supabase → **Settings → Edge Functions → Secrets**:
- Adicionar: `RESEND_API_KEY` = chave obtida em resend.com após cadastro e verificação do domínio `rsesquadrias.com.br`

- [ ] **Step 5: Deploy da Edge Function**

```bash
npx supabase functions deploy notify-new-lead --project-ref buykmrxavdzadcapdseo
```

Esperado: `Deployed notify-new-lead`.

- [ ] **Step 6: Testar**

1. Cadastrar um `notification_email` no painel admin (Config)
2. Preencher o LeadModal no site
3. Verificar se o email chegou na caixa configurada

- [ ] **Step 7: Commit**

```bash
git add supabase/functions/notify-new-lead/index.ts
git commit -m "feat(notifications): add Edge Function to email owner on new lead"
```

---

### Task 12: Realtime de leads + badge no menu

**Files:**
- Modify: `src/pages/admin/Leads.tsx`
- Modify: `src/components/admin/AdminLayout.tsx`

- [ ] **Step 1: Adicionar realtime subscription em Leads.tsx**

Em `src/pages/admin/Leads.tsx`, modificar o `useEffect` inicial para incluir a subscription realtime. Substituir o bloco `useEffect` existente:

```tsx
useEffect(() => {
  load()

  const channel = supabase
    .channel('leads-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, () => {
      load()
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [])
```

- [ ] **Step 2: Adicionar notas inline em cada lead em Leads.tsx**

Ao final dos imports de `src/pages/admin/Leads.tsx`, adicionar o hook `useRef`:

```tsx
import { useEffect, useRef, useState } from 'react'
```

Adicionar a função de auto-save com debounce logo após a função `deleteOne`:

```tsx
const notesTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

function handleNotesChange(id: string, value: string) {
  setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: value } : l))
  clearTimeout(notesTimers.current[id])
  notesTimers.current[id] = setTimeout(async () => {
    await supabase.from('leads').update({ notes: value }).eq('id', id)
  }, 800)
}
```

Na tabela, dentro da célula de ações de cada lead, adicionar abaixo do `</div>` das ações:

```tsx
<td colSpan={8} className="px-4 pb-3 hidden group-focus-within:table-cell">
  <textarea
    className="w-full text-xs border border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:border-[#FF6B00] placeholder-gray-300"
    rows={2}
    placeholder="Notas internas (salvo automaticamente)..."
    value={lead.notes ?? ''}
    onChange={e => handleNotesChange(lead.id, e.target.value)}
  />
</td>
```

Adicionar `group` à classe do `<tr>` de cada lead para ativar o `group-focus-within`:

```tsx
<tr key={lead.id} className={`group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${selected.has(lead.id) ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
```

- [ ] **Step 3: Atualizar WhatsApp link com template em Leads.tsx**

Substituir o link de WhatsApp existente em cada lead:

```tsx
// Substituir:
<a href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
  <MessageCircle size={15} />
</a>

// Por:
<a
  href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}, vi seu contato sobre ${lead.service}. Como posso ajudar?`)}`}
  target="_blank"
  rel="noreferrer"
  title="WhatsApp com mensagem pré-preenchida"
  className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
>
  <MessageCircle size={15} />
</a>
```

- [ ] **Step 4: Adicionar badge de leads novos em AdminLayout.tsx**

Em `src/components/admin/AdminLayout.tsx`, adicionar state e subscription para contagem de leads novos:

```tsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

// Dentro do componente AdminLayout, antes do return:
const [newLeadsCount, setNewLeadsCount] = useState(0)

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
```

No `NavLink` de Leads, adicionar o badge:

```tsx
// Substituir o item de Leads no map:
{nav.map(item => {
  if (item.masterOnly && profile?.role !== 'master') return null
  return (
    <NavLink key={item.to} to={item.to} end={item.end}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${isActive ? 'bg-[#FF6B00] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      <item.icon size={18} />
      {item.label}
      {item.to === '/admin/leads' && newLeadsCount > 0 && (
        <span className="ml-auto bg-[#FF6B00] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {newLeadsCount > 99 ? '99+' : newLeadsCount}
        </span>
      )}
    </NavLink>
  )
})}
```

- [ ] **Step 5: Verificar no browser**

```bash
npm run dev
```

Abrir o painel admin. Abrir uma segunda aba e submeter um lead pelo site. Verificar:
- O badge "1" aparece no menu lateral em "Leads" sem recarregar
- A lista de leads atualiza automaticamente
- O link do WhatsApp abre com texto pré-preenchido

- [ ] **Step 6: Commit**

```bash
git add src/pages/admin/Leads.tsx src/components/admin/AdminLayout.tsx
git commit -m "feat(admin): realtime leads badge, inline notes, WhatsApp template"
```

---

### Task 13: Drag-and-drop reorder no Portfólio admin

**Files:**
- Modify: `src/pages/admin/Portfolio.tsx`

- [ ] **Step 1: Adicionar drag-and-drop em Portfolio.tsx**

Substituir o conteúdo completo de `src/pages/admin/Portfolio.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PortfolioItem } from '../../lib/types'
import { convertToWebP } from '../../lib/imageUtils'
import { Trash2, Upload, Images, GripVertical } from 'lucide-react'

const CATEGORIES = ['Esquadrias de Alumínio', 'Box de Banheiro', 'Espelhos', 'Vidros & Sacadas', 'Projetos Especiais']

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const fileRef = useRef<HTMLInputElement>(null)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  async function load() {
    const { data } = await supabase.from('portfolio').select('*').order('order')
    if (data) setItems(data as PortfolioItem[])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file || !title) return
    setLoading(true)
    const webp = await convertToWebP(file)
    const path = `portfolio/${Date.now()}.webp`
    const { error: uploadErr } = await supabase.storage.from('images').upload(path, webp, { contentType: 'image/webp' })
    if (uploadErr) { setLoading(false); alert('Erro no upload: ' + uploadErr.message); return }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    await supabase.from('portfolio').insert({ title, category, image_url: publicUrl, order: items.length + 1 })
    setTitle(''); setCategory(CATEGORIES[0])
    if (fileRef.current) fileRef.current.value = ''
    setLoading(false); load()
  }

  async function handleDelete(item: PortfolioItem) {
    if (!confirm(`Remover "${item.title}"?`)) return
    const path = item.image_url.split('/images/')[1]
    if (path) await supabase.storage.from('images').remove([path])
    await supabase.from('portfolio').delete().eq('id', item.id)
    load()
  }

  function handleDragStart(index: number) {
    dragItem.current = index
  }

  function handleDragEnter(index: number) {
    dragOverItem.current = index
    const newItems = [...items]
    const dragged = newItems[dragItem.current!]
    newItems.splice(dragItem.current!, 1)
    newItems.splice(index, 0, dragged)
    dragItem.current = index
    setItems(newItems)
  }

  async function handleDragEnd() {
    const updates = items.map((item, index) => ({ id: item.id, order: index + 1 }))
    await Promise.all(
      updates.map(u => supabase.from('portfolio').update({ order: u.order }).eq('id', u.id))
    )
    dragItem.current = null
    dragOverItem.current = null
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6 dark:text-gray-100">Portfólio</h1>
      <form onSubmit={handleUpload} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Adicionar foto</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Título</label>
            <input className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Fachada residencial" required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Categoria</label>
            <select className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-[#FF6B00]" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Imagem</label>
            <input ref={fileRef} type="file" accept="image/*" className="w-full border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-lg px-3 py-2 mt-1 text-sm" required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="mt-4 bg-[#FF6B00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center gap-2 disabled:opacity-60">
          <Upload size={16} /> {loading ? 'Enviando...' : 'Adicionar foto'}
        </button>
      </form>

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1">
        <GripVertical size={12} /> Arraste para reordenar as fotos
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={e => e.preventDefault()}
            className="relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square cursor-grab active:cursor-grabbing active:opacity-60 transition-opacity"
          >
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <p className="text-white text-xs font-bold text-center px-2">{item.title}</p>
              <p className="text-[#FF6B00] text-[10px] font-bold">{item.category}</p>
              <button onClick={() => handleDelete(item)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition mt-1"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Images className="w-16 h-16 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Nenhuma foto ainda. Adicione a primeira!</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verificar no browser**

```bash
npm run dev
```

Acessar `http://localhost:5173/admin/portfolio`. Com fotos cadastradas, arrastar uma para uma nova posição. Soltar — a nova ordem deve ser salva no Supabase e persistir ao recarregar a página.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/Portfolio.tsx
git commit -m "feat(admin): drag-and-drop portfolio reorder"
```

---

## Checklist de Verificação Final

- [ ] `https://rsesquadrias.com.br/sitemap.xml` acessível após deploy
- [ ] `https://rsesquadrias.com.br/robots.txt` acessível após deploy
- [ ] Lighthouse Performance ≥ 80 no mobile (`npm run build && npm run preview` + Lighthouse)
- [ ] Hero renderiza imagem configurada via admin (testar via Config)
- [ ] Seções fazem fade-in ao rolar
- [ ] Reviews aparecem do Supabase (verificar com reviews ativas)
- [ ] LeadModal exibe success state após envio
- [ ] CTA mobile visível em tela ≤ 768px
- [ ] Painel admin → Avaliações: adicionar, ocultar e excluir funcionando
- [ ] Email de notificação chega ao cadastrar um lead
- [ ] Badge de Leads atualiza em tempo real
- [ ] Notas salvas automaticamente em leads
- [ ] Link WhatsApp com template pré-preenchido
- [ ] Portfólio reordenável via drag-and-drop
