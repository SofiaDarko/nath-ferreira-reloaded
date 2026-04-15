

## Corrigir gaps verticais no Bento Grid — HomePage.tsx

**Arquivo:** `src/components/portfolio/HomePage.tsx`

### Problema

Os cards das colunas 1 e 2 usam `aspect-square` e `aspect-[4/3]`, o que limita sua altura baseada na largura da coluna. Como a altura da row do grid (definida por `1fr`) pode ser maior que a altura calculada pelo aspect-ratio, os cards ficam menores que a row, criando espaço vazio embaixo.

### Solução

Remover `aspect-ratio` de todos os variants e usar `h-full` em todos os cards para que preencham 100% da célula do grid. As proporções visuais serão determinadas pela relação largura-da-coluna / altura-da-row, não por aspect-ratio.

Ajustar as larguras das colunas para manter a proporção visual correta conforme o print (1:1 na col1, 4:3 na col2, 4:5 na col3).

### Alterações

**1. variantClasses (linha 19-23)**

De:
```tsx
const variantClasses: Record<string, string> = {
  square: 'aspect-square',
  horizontal: 'aspect-[4/3]',
  portrait: 'row-span-2 h-full',
};
```
Para:
```tsx
const variantClasses: Record<string, string> = {
  square: 'h-full',
  horizontal: 'h-full',
  portrait: 'row-span-2 h-full',
};
```

**2. Sub-grid container (linhas 168 e 189) — manter `min-h-0` nos cards**

Adicionar `min-h-0` ao className do sub-grid para garantir que os filhos do grid não expandam além do container:

```tsx
className="grid grid-cols-[240px_320px_280px] grid-rows-[1fr_1fr] gap-4 h-full"
```

Sem alteração na estrutura do grid. As larguras 240px, 320px e 280px já aproximam as proporções corretas (1:1, 4:3, 4:5) quando os cards preenchem a altura total da row.

**3. ProjectCard — adicionar `min-h-0`**

No className do `motion.div` do ProjectCard, adicionar `min-h-0` para evitar que o grid item expanda:

```tsx
className={`group relative cursor-pointer overflow-hidden rounded-2xl min-h-0 ${variantClasses[variant]}`}
```

### O que não muda
- Larguras das colunas, grid placements, hover, overlay, scroll, drag, props
- Nenhum outro arquivo

