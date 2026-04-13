

## Alterações no ProjectModal.tsx

### Arquivo único: `src/components/portfolio/ProjectModal.tsx`

### Mudanças

**1. Imports** — trocar `ArrowLeft, ArrowRight` por `Images, ChevronLeft, ChevronRight`.

**2. Navegação não-circular** — simplificar `next`/`prev` com `Math.min`/`Math.max` (botões desabilitam nos extremos).

**3. Contador de imagens** — após as tags no painel esquerdo, adicionar bloco discreto com ícone `Images` + texto `"{n} imagem(ns)"` em `text-fg/40 text-xs`.

**4. Botões de navegação no painel esquerdo** — na parte inferior do `motion.div` (segundo filho do `justify-between`), renderizar dois botões `w-12 h-12 rounded-full bg-accent text-bg` com `ChevronLeft`/`ChevronRight`. Desabilitados com `opacity-30 pointer-events-none` nos extremos. Ocultos completamente se só 1 imagem.

**5. Remover setas do painel direito** — eliminar o bloco dos botões prev/next do painel direito. Manter apenas o counter `{imgIdx+1}/{total}` (só se >1 imagem).

### O que NÃO muda
- Layout, tamanho ou posição do painel direito
- Imagem, animação, overlay
- Botão de fechar (X)
- Nenhum outro arquivo

