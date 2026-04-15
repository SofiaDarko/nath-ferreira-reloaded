

## Reestruturar Bento Grid — HomePage.tsx + legenda AdminPanel.tsx

### Alteração 1 — Variantes e classes (HomePage.tsx, linhas 13-24)

```tsx
function getVariant(index: number): 'landscape' | 'square' | 'portrait' {
  const pos = index % 6;
  if (pos === 0 || pos === 3 || pos === 5) return 'landscape';
  if (pos === 2) return 'portrait';
  return 'square';
}

const variantClasses: Record<string, string> = {
  landscape: 'w-[480px] aspect-[16/9]',
  square: 'w-[280px] aspect-square',
  portrait: 'w-[280px] aspect-[4/5] row-span-2',
};
```

### Alteração 2 — Container do grid (HomePage.tsx, linha 146)

Manter `h-full` (não remover). Apenas adicionar `items-start`:

De:
```tsx
<div className="grid grid-rows-2 grid-flow-col gap-4 h-full w-max">
```
Para:
```tsx
<div className="grid grid-rows-2 grid-flow-col gap-4 h-full w-max items-start">
```

### Alteração 3 — Legenda de tamanho (AdminPanel.tsx, linha 418)

De:
```tsx
<p ...>{lang === 'pt' ? 'Tamanho ideal: 600 × 800 px' : 'Ideal size: 600 × 800 px'}</p>
```
Para:
```tsx
<p ...>{lang === 'pt' ? 'Tamanho ideal: 1200×675 (16:9), 800×800 (1:1) ou 800×1000 (4:5)' : 'Ideal size: 1200×675 (16:9), 800×800 (1:1) or 800×1000 (4:5)'}</p>
```

### Nota sobre row-span-2 + aspect-[4/5]

Com `h-full` mantido no container e `grid-rows-2` definindo duas rows de altura igual (cada ~50% do container), `row-span-2` faz o card portrait ocupar 100% da altura disponível. O `aspect-[4/5]` define a largura intrínseca a partir dessa altura — os dois não conflitam porque `aspect-ratio` ajusta a dimensão livre (largura) quando a altura é definida pelo grid.

Se após teste visual o card portrait ficar desproporcional (largura muito grande ou pequena), a correção será remover `row-span-2` do portrait e deixá-lo como card simples de 1 row. Mas o comportamento esperado é correto: altura = 100% do container, largura = altura × 4/5.

### O que não muda
- Props, `onProjectClick`, overlays, tags, borda, proteção de imagem
- Drag-scroll, auto-scroll, seta
- `object-cover` na imagem
- Nenhum outro arquivo além dos dois listados

