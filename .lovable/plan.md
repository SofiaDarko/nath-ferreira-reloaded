

## Corrigir altura do módulo Bento Grid — HomePage.tsx

**Arquivo único:** `src/components/portfolio/HomePage.tsx`

### Problema

O sub-grid usa `grid-rows-2` sem definir alturas explícitas para as rows. Com `h-full`, as rows dividem o espaço igualmente, mas o `aspect-ratio` nos cards de col 1 e col 2 pode fazer os cards menores que a row, criando espaço vazio embaixo.

### Solução

Definir `grid-template-rows` com alturas fixas explícitas e iguais, e remover `aspect-ratio` do card portrait — ele usará `h-full` para preencher as 2 rows. A largura da col 3 (280px) com a altura total garantirá a proporção ~4:5 naturalmente.

### Alterações

**1. Sub-grid container (linhas 168 e 189)**

De:
```tsx
className="grid grid-cols-[240px_320px_280px] grid-rows-2 gap-4 h-full"
```
Para:
```tsx
className="grid grid-cols-[240px_320px_280px] grid-rows-[1fr_1fr] gap-4 h-full"
```

**2. variantClasses (linhas 19-23)**

De:
```tsx
const variantClasses: Record<string, string> = {
  square: 'aspect-square',
  horizontal: 'aspect-[4/3]',
  portrait: 'aspect-[4/5] row-span-2 h-full',
};
```
Para:
```tsx
const variantClasses: Record<string, string> = {
  square: 'aspect-square',
  horizontal: 'aspect-[4/3]',
  portrait: 'row-span-2 h-full',
};
```

O card portrait perde o `aspect-[4/5]` — sua altura é 100% do grid (2 rows + gap) e a largura é definida pela coluna (280px). A proporção visual resultante será determinada pela altura disponível do container.

### O que não muda
- Larguras das colunas, hover, overlay, scroll, drag, props, nenhum outro arquivo

