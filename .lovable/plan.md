

## Plano: Aparência funcional + setas centralizadas no ProjectModal

### Problema raiz identificado
Existem **dois sistemas de cor desconectados**:
- **Tailwind** (`text-accent`, `border-border`, `bg-bg`, `text-muted-foreground`, `text-fg`) → lê de `hsl(var(--accent))`, `hsl(var(--border))`, etc. definidas em `index.css`
- **Theme dinâmico** (`var(--theme-accent)`, `var(--theme-bg)`) → injetado em `Index.tsx` via `<style>` a partir do hex de `theme`

A maioria dos componentes (Sidebar, AboutPage, ContactPage, ProjectModal, ProjectCard hover) usa só Tailwind → **ignora** as mudanças do painel Aparência. Apenas HomePage usa as `var(--theme-*)`.

### Solução: Sincronizar os dois sistemas
Em `Index.tsx`, no bloco `<style>` que injeta as variáveis do tema, **converter cada hex de `theme` para HSL** e **sobrescrever também as variáveis Tailwind** (`--bg`, `--fg`, `--accent`, `--border`, `--muted`, `--muted-foreground`, `--accent-foreground`, `--card`, `--popover`, `--background`, `--foreground`, `--primary`, `--ring`, `--input`, `--sidebar-*`).

Assim, **uma única alteração** faz funcionar:
- Sidebar (texto/borda/hover/accent)
- Bio, Skills, Educação, Experiências (textos via `text-fg`, `text-muted-foreground`, `text-accent`, `border-border`)
- ProjectModal (accent, border, bg)
- Hover dos cards
- Tags, dots, setas

### Arquivos alterados (mínimos)

**1. `src/pages/Index.tsx`** (única mudança no app)
- Adicionar utilitário `hexToHsl(hex)` no topo
- Expandir o bloco `<style>` para também emitir `--bg`, `--fg`, `--accent`, `--border`, `--muted`, `--muted-foreground`, `--card`, `--popover`, `--ring`, `--input`, `--background`, `--foreground`, `--primary`, `--accent-foreground`, `--sidebar-background`, `--sidebar-border`, `--sidebar-accent` em formato HSL (`H S% L%`) derivados de `theme`
- Mapeamento:
  - `theme.bg` → `--bg`, `--background`, `--card`, `--popover`, `--sidebar-background`
  - `theme.fg` → `--fg`, `--foreground`, `--card-foreground`
  - `theme.accent` → `--accent`, `--primary`, `--ring`, `--sidebar-ring`
  - `theme.border` → `--border`, `--input`, `--sidebar-border`
  - `theme.muted` → `--muted-foreground`, `--sidebar-foreground`

**2. `src/components/portfolio/ProjectModal.tsx`** (centralizar setas + teclado)
- Remover bloco de setas do painel esquerdo
- Adicionar duas setas **flutuantes verticalmente centralizadas**, uma colada à esquerda do viewport de imagem e outra à direita (botões circulares com `absolute top-1/2 -translate-y-1/2 left-6 / right-6`)
- Adicionar `useEffect` com listener de `keydown` para `ArrowLeft` / `ArrowRight`
- Ambas usam `text-fg`, `border-border`, `hover:border-accent` → herdam o tema

### Arquivos NÃO tocados
- `src/index.css` (mantém defaults para fallback)
- `tailwind.config.ts`
- `defaults.ts`, tipos, hook
- AboutPage, ContactPage, HomePage, Sidebar, AdminPanel — nenhuma alteração necessária, eles passam a responder automaticamente porque suas classes Tailwind agora apontam pras vars sobrescritas

### Ponto de restauração
Esta mensagem é o checkpoint. Se algo der errado: clicar **Revert** na mensagem anterior (a que finalizou o CRUD de Formação) restaura tudo ao estado atual.

### Riscos
- Conversão hex→HSL precisa ser robusta (suportar `#rgb`, `#rrggbb`, `#rrggbbaa` ignorando alpha)
- `subtitleColor` (`#ffffff88`) tem alpha — usar como `var(--theme-subtitle-color)` nos lugares que precisam (já está assim em HomePage). Não vai pra Tailwind var.
- `cardBg` / `tagBg` / `cardBorder` / `linkColor` continuam só em `var(--theme-*)` — os locais que precisam já usam (HomePage cards). Para Modal, vou manter Tailwind defaults sincronizados e os destaques específicos vão via `var(--theme-*)` se necessário.

