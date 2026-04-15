

## Reestruturar Bento Grid — módulo de 5 cards

**Arquivo único:** `src/components/portfolio/HomePage.tsx`

### Abordagem

O layout atual usa `grid-rows-2 grid-flow-col` com itens individuais posicionados automaticamente pelo grid. O problema é que `grid-flow-col` com itens de larguras variadas e `row-span-2` cria lacunas quando o grid tenta preencher colunas automaticamente.

A solução é **abandonar o grid auto-flow** e renderizar módulos explícitos de 5 cards, cada módulo sendo um sub-grid de 3 colunas × 2 linhas, dispostos horizontalmente via `flex`.

### Estrutura do módulo

```text
Col 1      Col 2      Col 3
┌──────┐  ┌────────┐  ┌──────┐
│ 1:1  │  │  4:3   │  │      │
│      │  │        │  │ 4:5  │
├──────┤  ├────────┤  │      │
│ 1:1  │  │  4:3   │  │      │
│      │  │        │  │      │
└──────┘  └────────┘  └──────┘
Card 0     Card 1     Card 2 (row-span-2)
Card 3     Card 4
```

### Alterações

**1. Substituir `getVariant` e `variantClasses` (linhas 13-24)**

```tsx
// Dentro de um módulo de 5: posições 0,3 = square (col1), 1,4 = horizontal (col2), 2 = portrait (col3)
function getModuleVariant(posInModule: number): 'square' | 'horizontal' | 'portrait' {
  if (posInModule === 2) return 'portrait';
  if (posInModule === 1 || posInModule === 4) return 'horizontal';
  return 'square';
}
```

**2. Substituir o grid por flex + sub-grids (linha 146-170)**

Em vez de um único `<div className="grid ...">`, renderizar assim:

```tsx
<div className="flex gap-4 h-full w-max items-start">
  {modules.map((moduleProjects, mi) => (
    <div key={mi} className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
      {moduleProjects.map((proj, posInModule) => {
        const variant = getModuleVariant(posInModule);
        // Card 2 (portrait) vai na col 3, row-span-2
        // Cards 0,3 vão na col 1; cards 1,4 na col 2
        const gridPlacement = getGridPlacement(posInModule);
        return <ProjectCard ... style={gridPlacement} />;
      })}
    </div>
  ))}
</div>
```

Onde `modules` agrupa os projetos em chunks de 5:
```tsx
const modules: Project[][] = [];
for (let i = 0; i < projects.length; i += 5) {
  modules.push(projects.slice(i, i + 5));
}
```

**3. Posicionamento explícito via grid-area**

Cada card recebe posição explícita para evitar lacunas:

| Pos | Grid position | Variant |
|-----|--------------|---------|
| 0 | col 1, row 1 | square (1:1) |
| 1 | col 2, row 1 | horizontal (4:3) |
| 2 | col 3, row 1-2 | portrait (4:5, row-span-2) |
| 3 | col 1, row 2 | square (1:1) |
| 4 | col 2, row 2 | horizontal (4:3) |

Classes por variant (sem largura fixa — o grid define):
- `square`: `aspect-square`
- `horizontal`: `aspect-[4/3]`
- `portrait`: `aspect-[4/5] row-span-2`

Largura das colunas via `grid-template-columns` no sub-grid: algo como `grid-cols-[240px_320px_280px]` para que col1=square, col2=4:3, col3=4:5.

A altura do portrait será `h-full` (100% das 2 rows + gap), garantindo sem espaços.

**4. Placeholders vazios — mesma lógica**

Quando `projects.length === 0`, gerar 1 módulo de 5 placeholders com a mesma estrutura.

### O que não muda
- `ProjectCard` interno (hover, blur, overlay, tags, borda, proteção de imagem)
- Drag-scroll, auto-scroll, seta direita, hint
- Props do componente
- Nenhum outro arquivo

