

## Ajustar larguras das colunas do Bento Grid — HomePage.tsx

**Arquivo único:** `src/components/portfolio/HomePage.tsx`

### Problema

As larguras atuais (`240px`, `320px`, `280px`) não refletem corretamente as proporções 1:1, 4:3 e 4:5 mostradas na imagem de referência. A coluna 4:3 deveria ser visivelmente mais larga que a 1:1, e a coluna 4:5 deveria ter largura proporcional à sua altura total.

### Solução

Aumentar as larguras das 3 colunas mantendo a relação proporcional correta:

- **Col 1 (1:1):** 280px — base quadrada
- **Col 2 (4:3):** 373px — = 280 × 4/3, proporção 4:3 exata
- **Col 3 (4:5):** 300px — largura para o portrait que ocupa 2 rows

### Alteração

Duas ocorrências de `grid-cols-[240px_320px_280px]` (linhas 168 e 189) mudam para:

```tsx
grid-cols-[280px_373px_300px]
```

### O que não muda
- Altura dos cards, `grid-rows-[1fr_1fr]`, gap, `h-full`
- Hover, overlay, tags, borda, drag-scroll
- Nenhum outro arquivo

