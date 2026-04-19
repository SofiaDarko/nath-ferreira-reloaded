

## Plano: Versão mobile dedicada (sem afetar desktop)

### Estratégia
Criar **componentes mobile separados** ativados via `useIsMobile()` (breakpoint <768px). Em mobile, `Index.tsx` renderiza um conjunto de componentes em uma pasta `mobile/`. Em desktop, mantém **exatamente** os componentes atuais sem nenhuma alteração.

Zero risco para o site desktop: nenhum arquivo de desktop é modificado, exceto `Index.tsx` que apenas decide qual versão renderizar.

### Arquivos novos (pasta `src/components/portfolio/mobile/`)

1. **`MobileLayout.tsx`** — shell mobile: top bar fixa (logo NF + bandeiras + menu hambúrguer), drawer de navegação (Home / Sobre / Contato + admin se logado), área de conteúdo full-width.

2. **`MobileHomePage.tsx`** — header com título grande (`text-5xl`), subtítulo e grid vertical de projetos (1 coluna, cards full-width com aspect-ratio 4/5). Substitui o scroll horizontal Bento (que não funciona bem em mobile) por scroll vertical natural.

3. **`MobileAboutPage.tsx`** — em vez de 3 painéis com translateX, vira **scroll vertical único** com seções: Foto + Bio → Skills (grid 3 colunas) → Educação (lista) → Experiência (lista). Mantém leitura natural com polegar.

4. **`MobileContactPage.tsx`** — headline reduzida + lista de links empilhada full-width, áreas de toque grandes (py-6).

5. **`MobileProjectModal.tsx`** — fullscreen, header com X + contador, imagem central com swipe (touch handlers) + setas inferiores grandes, info do projeto colapsável embaixo.

### Arquivo alterado (mínimo)

**`src/pages/Index.tsx`** — adicionar:
```tsx
const isMobile = useIsMobile();
if (isMobile) return <MobileLayout {...allProps} />;
// ... resto do desktop intocado
```

A `<style>` de tema continua igual, funciona nos dois.

### Arquivos NÃO tocados
- `HomePage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`, `ProjectModal.tsx`, `PortfolioSidebar.tsx`, `LanguageSwitcher.tsx`
- `AdminPanel.tsx` (admin continua desktop-only por enquanto — pode ser usado em mobile via scroll, mas sem layout dedicado)
- Todos os hooks, tipos, tabelas, defaults, edge functions
- `index.css`, `tailwind.config.ts`

### Decisões de UX mobile
- **Scroll vertical** em vez de horizontal/painéis (gesto natural)
- **Top bar fixa** (56px) com logo + bandeiras + menu
- **Drawer lateral** para navegação principal
- **Cards de projeto** em coluna única, aspect 4/5, tap abre modal
- **Modal fullscreen** com swipe entre imagens
- **Tipografia reduzida** (título home: 48px em vez de 100px)
- **Padding reduzido** (16-20px em vez de 60-80px)
- Painel admin não é repaginado nesta etapa (foco em visitantes)

### Ponto de restauração
Esta mensagem é o checkpoint. Se algo der errado, basta clicar **Revert** na minha resposta anterior (a que finalizou a sincronização de tema + setas do modal) para voltar ao estado atual sem perder nada.

### Riscos
- `useIsMobile()` retorna `undefined` no primeiro render → vou tratar como desktop por padrão pra evitar flash
- Bandeiras do `LanguageSwitcher` ficam dentro do `MobileLayout` em mobile (e o `LanguageSwitcher` original só aparece em desktop)

