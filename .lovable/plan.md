

## Bento Grid Layout — `src/components/portfolio/HomePage.tsx`

### Arquivo único alterado: `src/components/portfolio/HomePage.tsx`

### Alterações

**1. Helper function** — adicionar antes do `ProjectCard`:

```ts
function getVariant(index: number): 'landscape' | 'square' | 'wide-short' {
  const pos = index % 5;
  if (pos === 0 || pos === 3) return 'landscape';
  if (pos === 4) return 'wide-short';
  return 'square';
}
```

**2. ProjectCard** — refatorar props e sizing:

- Remover props: `isHovered`, `onHover`, `onLeave`
- Adicionar prop: `variant: 'landscape' | 'square' | 'wide-short'`
- Remover `style` com `width`/`minWidth`/`flexShrink` dinâmicos
- Aplicar classes baseadas no variant:
  - `landscape`: `w-[420px] row-span-2` (ocupa 2 linhas)
  - `square`: `w-[200px]` (1 linha)
  - `wide-short`: `w-[420px]` (1 linha, mais largo e menos alto)

**3. Container dos cards** (linha 141) — substituir:

De: `flex gap-5 h-full w-max items-stretch`

Para: `grid grid-rows-2 grid-flow-col gap-4 h-full w-max`

**4. Estado removido** — deletar `hoveredIndex` (linha 69) e as props `isHovered`/`onHover`/`onLeave` passadas ao `ProjectCard` (linhas 163-165).

**5. Placeholders vazios** — ajustar para usar grid similar (manter visual existente).

### O que NÃO muda
- Hover com blur/brightness/scale na imagem
- Overlay de nome + tags
- Border inset com `--theme-card-border`
- `object-cover` nas imagens
- Scroll horizontal com drag
- Seta de auto-scroll
- Nenhum outro arquivo

