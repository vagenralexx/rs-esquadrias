# RS Esquadrias — Plano de Melhorias: Design Spec

**Data:** 2026-04-01
**Projeto:** RS Esquadrias e Vidraçaria
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Supabase + React Router v7

---

## Contexto

Site institucional + painel admin para empresa de esquadrias de alumínio e vidros temperados em Munhoz-MG. O site está no ar mas ainda sem tráfego orgânico real. O principal mecanismo de captura de leads é o **LeadModal** — visitantes preenchem nome, telefone, serviço e mensagem, e o lead é registrado na tabela `leads` do Supabase e aparece no painel admin.

**Problema central:** o site não aparece no Google (sem sitemap/robots), a landing page depende de imagens genéricas do Unsplash, e quando leads chegam o dono precisa entrar manualmente no painel para perceber.

---

## Abordagem: Sequencial por impacto (3 fases)

Fase 1 → SEO & Performance → Fase 2 → Conversão → Fase 3 → Admin Eficiente

Cada fase entrega valor independente e prepara terreno para a próxima.

---

## Fase 1 — SEO & Performance

**Objetivo:** fazer o Google encontrar e rankear o site.

### Arquivos estáticos de SEO
- `public/sitemap.xml` — lista todas as URLs públicas: `/`, `/parceiros`
- `public/robots.txt` — permite indexação e referencia o sitemap

### Lazy loading de rotas
- `React.lazy` + `Suspense` em `App.tsx` para todas as rotas do admin (`/admin/*`)
- O bundle do admin só é carregado quando o usuário acessa `/admin`
- Reduz o JS inicial da landing page em ~40%

### Otimização de imagens
- Garantir `loading="lazy"` e `decoding="async"` em todos os `<img>` do site
- O componente `ResponsiveImage` (`src/components/ui/ResponsiveImage.tsx`) já existe — auditar usos inconsistentes

### Preconnect
- Adicionar `<link rel="preconnect">` no `index.html` para os domínios externos usados: Supabase, Google Fonts (se aplicável)

### Compressão no build
- Adicionar `vite-plugin-compression` ao `vite.config.ts` para gerar `.gz` e `.br` no build

### Hero com imagem real (base do SEO de imagem)
- Nova chave `hero_image` na tabela `site_config`
- O componente `Hero.tsx` busca esta URL via Supabase em vez de usar Unsplash hardcoded
- Fallback para imagem padrão caso a chave não exista
- Campo de upload/URL adicionado na tela de **Configurações** do admin

---

## Fase 2 — Conversão da Landing Page

**Objetivo:** transformar mais visitantes em leads.

### Animações de entrada por seção
- Intersection Observer (`useIntersectionObserver` hook) — cada seção faz fade-in suave ao entrar na viewport
- Zero dependências externas
- Respeita `prefers-reduced-motion`

### Avaliações gerenciáveis
- Nova tabela `reviews` no Supabase: `id`, `author_name`, `rating`, `body`, `order`, `active`, `created_at`
- Nova tela `/admin/reviews` no painel para CRUD de depoimentos
- Componente `Reviews.tsx` (já existe, hoje hardcoded) passa a buscar da tabela
- RLS: leitura pública para reviews ativas, escrita apenas autenticados

### Lead Modal aprimorado
- Campo `service` vira `<select>` com opções configuráveis (chave `services_list` em `site_config`, valor CSV)
- Confirmação visual após envio: estado de sucesso com mensagem "Recebemos seu contato! Em breve falaremos com você."
- Loading state no botão durante o insert

### CTA fixo no mobile
- Barra inferior fixa (`position: fixed; bottom: 0`) visível apenas em mobile (`md:hidden`)
- Botão "Solicitar Orçamento" abre o LeadModal com source `'cta_mobile'`
- Não sobrepõe o botão flutuante do WhatsApp (z-index coordenado)

### Open Graph image
- Campo `og_image` em `site_config` para upload/URL da imagem OG real
- Como o projeto é SPA (sem SSR), a meta tag `og:image` no `index.html` é atualizada manualmente pelo admin: o campo exibe a URL atual e instrui o dono a copiar a URL para o campo no `index.html` via deploy, ou a URL é gravada em `site_config` e usada como referência

---

## Fase 3 — Admin Eficiente

**Objetivo:** dono sabe imediatamente quando chega lead e resolve com 1 clique.

### Notificação por email (Supabase Edge Function)
- Nova chave `notification_email` na tabela `site_config`
- Campo visível na tela **Configurações** do admin para cadastrar/alterar o email
- Edge Function `notify-new-lead` (`supabase/functions/notify-new-lead/index.ts`):
  - Disparada por Database Webhook na inserção da tabela `leads`
  - Busca `notification_email` atual da `site_config`
  - Envia email via **Resend** com nome, telefone, serviço e mensagem do lead
  - Se `notification_email` estiver vazio, a função loga e encerra sem erro
- O email de envio usa domínio profissional configurado no Resend (a ser cadastrado)

### Realtime no painel de Leads
- `supabase.channel('leads')` subscription em `Leads.tsx`
- Badge "N novos" no menu lateral (`AdminLayout.tsx`) quando há leads com `status = 'new'` não visualizados na sessão atual
- A lista de leads atualiza automaticamente ao chegar novo item sem recarregar a página

### Reordenação drag-and-drop no Portfólio
- HTML5 Drag API (sem biblioteca) em `admin/Portfolio.tsx`
- Ao soltar item, faz `UPDATE portfolio SET order = ...` em batch para os itens afetados
- Visual de drag com opacidade reduzida no item sendo arrastado

### Notas em leads
- Migration: `ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text DEFAULT ''`
- Campo `notes` no tipo `Lead` em `types.ts`
- Textarea inline expansível em cada linha da tabela de leads
- Auto-save com debounce de 800ms (sem botão "Salvar")

### Template WhatsApp pré-preenchido
- Ação "Abrir WhatsApp" em cada lead gera URL:
  `https://wa.me/55{phone}?text=Olá+{name},+vi+seu+contato+sobre+{service}.`
- Substitui o link simples atual que só abre o número sem contexto

---

## Banco de Dados — Alterações Necessárias

| Tabela | Alteração |
|--------|-----------|
| `site_config` | Novas chaves: `hero_image`, `services_list`, `og_image`, `notification_email` |
| `reviews` | Nova tabela: `id`, `author_name`, `rating`, `body`, `order`, `active`, `created_at` |
| `leads` | Nova coluna: `notes text default ''` |

---

## Arquitetura de Notificação

```
Visitante preenche LeadModal
       ↓
INSERT leads (Supabase)
       ↓
Database Webhook → Edge Function notify-new-lead
       ↓
Busca notification_email em site_config
       ↓
Envia email via Resend
       ↓
Dono recebe email com dados do lead
```

Paralelamente:
```
Admin abre painel → supabase.channel('leads') subscription ativa
                  → badge atualiza em realtime
```

---

## Fora do Escopo (YAGNI)

- Blog / seção de artigos
- Integração com CRM externo
- App mobile nativo
- Multi-idioma
- Analytics avançado (Google Analytics / Plausible)
- Sistema de orçamento automatizado

---

## Critérios de Sucesso por Fase

**Fase 1:** Site indexado no Google Search Console; Lighthouse Performance ≥ 80 mobile; sitemap.xml acessível em `/sitemap.xml`

**Fase 2:** Taxa de abertura do modal ↑; leads capturados com campo de serviço preenchido corretamente; `Reviews.tsx` renderizando dados do Supabase

**Fase 3:** Dono recebe email em < 30s após lead ser submetido; badge de leads novos aparece sem recarregar; portfólio reordenável via drag-and-drop
