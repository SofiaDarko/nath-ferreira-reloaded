

## Reestruturar Bento Grid — HomePage.tsx

**Arquivo único:** `src/components/portfolio/HomePage.tsx`

### Alteração 1 — Variantes (linhas 13-24)

Substituir `getVariant` e `variantClasses` por:

```tsx
function getVariant(index: number): 'wide' | 'square' | 'horizontal' {
  const pos = index % 5;
  if (pos === 0 || pos === 3) return 'wide';
  if (pos === 4) return 'horizontal';
  return 'square';
}

const variantClasses: Record<string, string> = {
  wide:       'w-[420px] aspect-[16/9]',
  square:     'w-[240px] aspect-square',
  horizontal: 'w-[360px] aspect-[4/3]',
};
```

Remove `row-span-2` e proporções verticais. Aspect-ratio CSS define altura intrínseca.

### Alteração 2 — Container do grid (linha 146)

De:
```tsx
<div className="grid grid-rows-2 grid-flow-col gap-4 h-full w-max">
```
Para:
```tsx
<div className="grid grid-rows-2 grid-flow-col gap-4 w-max items-start">
```

### O que não muda
- Props, `onProjectClick`, overlays, tags, borda decorativa
- Proteção de imagem, drag-scroll, auto-scroll, seta
- Placeholders vazios
- `object-cover` na imagem
- Nenhum outro arquivo

