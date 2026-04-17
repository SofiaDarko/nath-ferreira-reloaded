

## Plano: CRUD de Formação Acadêmica

### Ponto de restauração
Antes de qualquer alteração, esta mensagem fica como **checkpoint de restauração**. Se algo der errado, basta clicar no botão "Revert" abaixo da minha mensagem anterior (a que termina com a migração total para o banco) — isso restaura o projeto ao estado atual sem perder nada.

Ao final da implementação, vou também marcar uma mensagem clara para você reverter caso prefira voltar logo após esta feature.

### Arquivos que serão alterados (apenas o necessário)

1. **Migração SQL** — nova tabela `education` (não toca nas existentes)
2. **`src/types/portfolio.ts`** — adicionar interface `Education` (apenas append)
3. **`src/data/defaults.ts`** — adicionar `DEFAULT_EDUCATION` (apenas append)
4. **`src/hooks/usePortfolioData.ts`** — adicionar education ao hook (segue padrão de experiences)
5. **`src/components/portfolio/AboutPage.tsx`** — substituir bloco fixo de Formação por `.map()` sobre a lista
6. **`src/components/portfolio/AdminPanel.tsx`** — adicionar seção CRUD na aba "Sobre"
7. **`src/pages/Index.tsx`** — propagar 3 props novas

### Arquivos que NÃO serão tocados
- Layout/estilo da Bento Grid e proporções (HomePage, ProjectModal, etc.)
- ContactPage, PortfolioSidebar, LanguageSwitcher
- Edge functions de email (os erros de build pré-existentes não bloqueiam o site)
- `client.ts`, `types.ts` do Supabase (atualizado automaticamente)

### Estrutura da nova tabela `education`
- `id` uuid PK
- `period` text (ex: "2018 — 2022")
- `course` text + `course_en` text nullable
- `school` text
- `description` text + `description_en` text nullable
- `sort_order` int
- RLS: public SELECT, authenticated ALL (mesmo padrão das outras)

### Interface
```ts
export interface Education {
  id: string;
  period: string;
  course: string;
  course_en?: string;
  school: string;
  desc: string;
  desc_en?: string;
}
```

### UI no AdminPanel (aba "Sobre")
Nova seção "Formação Acadêmica" com:
- Form: Período | Curso (PT/EN) | Instituição | Descrição (PT/EN)
- Botões: Salvar / Limpar
- Lista de formações com Editar / ↑ / ↓ / Excluir

### UI no AboutPage (Painel 2)
Substitui os 4 campos editáveis fixos por `.map()` sobre `education[]` (read-only para visitantes).

### Sobre os erros de build
Os erros em `process-email-queue/index.ts` são **pré-existentes** e não relacionados a esta feature. Não vou tocar nesses arquivos.

