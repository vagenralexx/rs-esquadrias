# Session Checkpoint — RS Esquadrias Melhorias

**Data:** 2026-04-01
**Branch de trabalho:** `feature/melhorias-rs`
**Worktree:** `d:/Smart Print/Documents/Ramon/.worktrees/melhorias`

---

## O que foi feito nesta sessão

### Planejamento (concluído)
- Spec de design criada: `docs/superpowers/specs/2026-04-01-rs-esquadrias-melhorias-design.md`
- Plano de implementação criado: `docs/superpowers/plans/2026-04-01-rs-esquadrias-melhorias.md`

### Implementação — Tasks concluídas ✅

| # | Task | Commit |
|---|------|--------|
| 1 | `public/sitemap.xml` + `public/robots.txt` | `feat(seo): add sitemap.xml and robots.txt` |
| 2 | Preconnect no `index.html` + compressão gzip/brotli no `vite.config.ts` | `perf: add gzip/brotli compression and preconnect hints` |
| 3 | Lazy loading de rotas admin em `App.tsx` + placeholder `Reviews.tsx` | `perf: lazy-load admin routes to reduce landing page bundle` |
| 4 | Hero image configurável: `LandingPage.tsx`, `Hero.tsx`, `Config.tsx`, `MobileCTA.tsx` (placeholder), `LeadModal.tsx` (servicesList prop) | `feat(config): hero image and services list configurable from admin` |
| 5 | Hook `useIntersectionObserver.ts` + animações fade-in em `Services.tsx` e `Differentials.tsx` | `feat(landing): add scroll-triggered fade-in animations` |
| 6 | `Reviews.tsx` busca do Supabase + tipo `Review` em `types.ts` + migration SQL | `feat(reviews): fetch reviews from Supabase instead of hardcoded array` |
| 7 | Página admin `Reviews.tsx` (CRUD) + nav item em `AdminLayout.tsx` | `feat(admin): add reviews management page` |
| 8 | LeadModal com success state (CheckCircle) + loading state no botão | `feat(modal): add success state after lead submission` |
| 9 | `MobileCTA.tsx` — barra CTA fixa no mobile | `feat(landing): add fixed mobile CTA bar` |

---

## Tasks PENDENTES — onde parar exatamente

### Task 10 — Migration: leads.notes + site_config seeds
**Arquivo:** `sql/setup.sql` e `src/lib/types.ts`

Adicionar ao final de `sql/setup.sql`:
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

Atualizar interface `Lead` em `src/lib/types.ts` — adicionar campo `notes: string`.

Commit: `feat(db): add leads.notes column and site_config seed keys`

---

### Task 11 — Edge Function: notificação de lead por email
**Arquivo:** `supabase/functions/notify-new-lead/index.ts` (novo)

Criar a função Deno em `supabase/functions/notify-new-lead/index.ts`.
Ver código completo no plano: `docs/superpowers/plans/2026-04-01-rs-esquadrias-melhorias.md` → Task 11.

Configurações manuais pós-código:
1. Supabase Dashboard → Database → Webhooks → criar webhook `notify-new-lead` em INSERT na tabela `leads`
2. Supabase Dashboard → Settings → Edge Functions → Secrets → adicionar `RESEND_API_KEY`
3. Deploy: `npx supabase functions deploy notify-new-lead --project-ref buykmrxavdzadcapdseo`

Commit: `feat(notifications): add Edge Function to email owner on new lead`

---

### Task 12 — Realtime leads + badge no menu
**Arquivos:** `src/pages/admin/Leads.tsx` e `src/components/admin/AdminLayout.tsx`

- Adicionar `supabase.channel('leads-realtime')` subscription em `Leads.tsx` para auto-reload ao chegar novo lead
- Adicionar `handleNotesChange` com debounce 800ms para auto-save de notas inline
- Adicionar textarea de notas em cada linha da tabela de leads
- Atualizar link WhatsApp com template pré-preenchido: `?text=Olá ${name}, vi seu contato sobre ${service}`
- Em `AdminLayout.tsx`: adicionar state + subscription para badge de leads novos no menu lateral

Ver código completo no plano: Task 12.
Commit: `feat(admin): realtime leads badge, inline notes, WhatsApp template`

---

### Task 13 — Drag-and-drop reorder no Portfólio admin
**Arquivo:** `src/pages/admin/Portfolio.tsx`

Adicionar HTML5 Drag API para reordenar fotos. Ver código completo no plano: Task 13.
Commit: `feat(admin): drag-and-drop portfolio reorder`

---

## Como retomar na próxima sessão

1. Abrir terminal na pasta: `d:/Smart Print/Documents/Ramon`
2. Verificar branch: `git -C .worktrees/melhorias branch` → deve mostrar `* feature/melhorias-rs`
3. Dizer ao Claude: **"Retome as melhorias do RS Esquadrias a partir da Task 10. Leia o checkpoint em `docs/superpowers/SESSION-CHECKPOINT.md` e o plano em `docs/superpowers/plans/2026-04-01-rs-esquadrias-melhorias.md`. O worktree está em `.worktrees/melhorias` na branch `feature/melhorias-rs`. Tasks 1-9 estão concluídas. Faltam Tasks 10, 11, 12 e 13."**
4. Claude irá despachar subagentes para as Tasks 10→13 e fazer os reviews
5. Ao finalizar todas as tasks, usar o skill `superpowers:finishing-a-development-branch` para merge

---

## Ações manuais necessárias (no Supabase Dashboard)

Estas precisam ser feitas por você no painel do Supabase **antes ou durante a Task 11**:

1. **Executar SQLs de migration** (SQL Editor no Supabase):
   - Migration da tabela `reviews` (já está no final de `sql/setup.sql`)
   - Migration `ALTER TABLE leads ADD COLUMN notes` (será adicionada na Task 10)

2. **Criar webhook** para a Edge Function (Task 11):
   - Database → Webhooks → `notify-new-lead` → INSERT em `leads`

3. **Adicionar secret** no Supabase:
   - Settings → Edge Functions → `RESEND_API_KEY` = sua chave do Resend

4. **Configurar domínio no Resend** (resend.com):
   - Verificar o domínio `rsesquadrias.com.br` para envio de emails
