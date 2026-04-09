

## Plano de Melhorias no Painel Admin e Galeria

### Resumo
Quatro mudanças: (1) todos os textos editáveis pelo painel com sugestão de caracteres, (2) aparência com controle total de cores, (3) edição e reordenação de projetos, (4) animação sanfona na galeria.

---

### 1. Todos os textos editáveis pelo painel com sugestão de caracteres

**O que muda:** A aba "Textos Globais" passa a incluir TODOS os textos do site — sidebar labels, drag hint, skills/education/experience títulos de seção, bio placeholder, labels de contato (Email, LinkedIn, etc.), education fields, e os textos já existentes. Cada campo terá uma indicação tipo `(máx. ~40 caracteres)`.

**Arquivos afetados:**
- `src/types/portfolio.ts` — Expandir `GlobalSettings` com novos campos (ex: `navHome`, `navAbout`, `navContact`, `dragHint`, `skillsTitle`, `educationTitle`, `experiencesTitle`, `bioDefault`, `contactEmail`, `contactLinkedin`, `contactInstagram`, `contactBehance`, e seus equivalentes `En`)
- `src/data/defaults.ts` — Adicionar valores padrão para cada novo campo
- `src/components/portfolio/AdminPanel.tsx` — Na aba `globalTexts`, listar todos os campos com `placeholder` indicando `(~XX caracteres)`
- `src/components/portfolio/PortfolioSidebar.tsx`, `HomePage.tsx`, `AboutPage.tsx`, `ContactPage.tsx` — Consumir os novos campos de `globalSettings` ao invés de `t` (traduções hardcoded) para textos de conteúdo

### 2. Aparência — controle total de cores

**O que muda:** A aba "Aparência" ganha mais color pickers para: cor do título principal, cor do subtítulo, cor dos links de contato, cor de hover, cor dos tags, cor de fundo dos cards. O `Theme` ganha novos campos.

**Arquivos afetados:**
- `src/types/portfolio.ts` — Adicionar ao `Theme`: `titleColor`, `subtitleColor`, `cardBg`, `tagBg`, `tagText`, `hoverColor`, `linkColor`
- `src/data/defaults.ts` — Valores padrão (derivados do tema atual)
- `src/components/portfolio/AdminPanel.tsx` — Adicionar os novos pickers na aba `appearance`
- `src/pages/Index.tsx` — Gerar CSS variables para os novos tokens
- Componentes visuais — Aplicar as novas CSS variables via `style` ou classes

### 3. Editar e reordenar projetos existentes

**O que muda:** Na lista de projetos publicados, cada projeto ganha um botão "Editar" que carrega os dados no formulário acima para edição. Para reordenação, botões de seta (▲/▼) ao lado de cada projeto para mover posição (evita dependência de drag-and-drop library).

**Arquivos afetados:**
- `src/components/portfolio/AdminPanel.tsx`:
  - Adicionar estado `editingProjectId: string | null`
  - Botão "Editar" ao lado do Trash em cada projeto listado
  - Ao clicar, preenche o formulário com os dados do projeto existente
  - `saveProject()` verifica se é edição (update no array) ou criação nova
  - Botões ▲/▼ em cada projeto para reordenar no array `projects`

### 4. Animação sanfona na galeria de projetos

**O que muda:** Os cards da galeria terão largura dinâmica. Ao hover, o card se expande horizontalmente (cresce para os lados), enquanto os vizinhos encolhem sutilmente, criando efeito sanfona.

**Arquivos afetados:**
- `src/components/portfolio/HomePage.tsx`:
  - Adicionar estado `hoveredIndex: number | null`
  - Cada `ProjectCard` recebe `isHovered` e `isNeighbor` props
  - Card hovered: `flex-grow` maior ou `width` expandida com transition CSS (~350px → ~450px)
  - Cards vizinhos: leve redução
  - Transição suave via `transition: flex 0.4s cubic-bezier(...)`

---

### Detalhes técnicos

- Sem novas dependências — reordenação por botões ▲/▼ (sem drag library)
- Todas as novas cores aplicadas via CSS custom properties em `:root` para atualização em tempo real
- Sugestões de caracteres são apenas indicativas (não bloqueiam input)
- A animação sanfona usa `flex-grow` + `transition` nativo do CSS, sem re-render pesado

