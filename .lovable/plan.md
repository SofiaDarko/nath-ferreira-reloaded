

## Migração Total: localStorage → Banco de Dados

### 1. Migração SQL (automática via integração)

Criar 4 tabelas com RLS:

- **projects** — id (uuid), name, name_en, description, description_en, tags (text[]), thumb, images (text[]), sort_order, created_at
- **skills** — id (uuid), name, icon, color, bg, special (bool), icon_url, sort_order
- **experiences** — id (uuid), period, title, title_en, company, description, description_en, sort_order
- **site_settings** — id (int, CHECK id=1), theme (jsonb), global_settings (jsonb), social_links (jsonb), editable_texts (jsonb), user_photo (text), updated_at

RLS: public SELECT em todas; authenticated ALL em todas.

### 2. Novo arquivo: `src/hooks/usePortfolioData.ts`

Hook que:
- Busca dados das 4 tabelas ao montar
- Se tabelas vazias, insere defaults de `defaults.ts` (seed automático)
- Retorna state + setters que gravam no banco via upsert/insert/update/delete
- Expõe `loading` boolean

### 3. Refatorar `src/pages/Index.tsx`

- Remover `loadState` e todos `useEffect` de `localStorage.setItem`
- Usar `usePortfolioData` para obter dados + setters
- Adicionar loading state mínimo
- Manter toda a estrutura visual intacta

### 4. Refatorar `src/components/portfolio/AdminPanel.tsx`

- `saveProject`, `saveSkill`, `saveExperience` → chamam `supabase.from(...).upsert/insert`
- Delete → `supabase.from(...).delete()`
- Reordenação → atualiza `sort_order`
- Theme/globalSettings/socialLinks → upsert em `site_settings`
- Remover referências a localStorage

### Mapeamento DB ↔ TypeScript
| TS field | DB column |
|---|---|
| `Project.description` | `projects.description` |
| `Skill.iconUrl` | `skills.icon_url` |
| `Experience.desc` | `experiences.description` |
| `Experience.desc_en` | `experiences.description_en` |

### Arquivos alterados
1. Migração SQL (4 tabelas) — via ferramenta de migração
2. `src/hooks/usePortfolioData.ts` — novo
3. `src/pages/Index.tsx` — refatorar dados
4. `src/components/portfolio/AdminPanel.tsx` — CRUD via banco

### Arquivos NÃO alterados
- Layout/estilo (HomePage, AboutPage, ContactPage, ProjectModal, etc.)
- `src/types/portfolio.ts`
- `src/data/defaults.ts`

