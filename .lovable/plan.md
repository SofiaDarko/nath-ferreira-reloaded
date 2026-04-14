

## Adicionar reordenação em experiências e links de contato

**Arquivo:** `src/components/portfolio/AdminPanel.tsx`

### 1. Experiências (linhas 587-590)

Adicionar botões `ArrowUp` e `ArrowDown` no `div` de ações de cada experiência, antes do Pencil. Lógica de swap idêntica ao `moveSkill` já existente, mas operando sobre `setExperiences`.

Trecho atual (linha 587-590):
```tsx
<div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
  <button ...><Pencil /></button>
  <button ...><Trash2 /></button>
</div>
```

Trecho novo:
```tsx
<div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
  <button disabled={i===0} className={`w-7 h-7 ... ${i===0?'opacity-30 pointer-events-none':''}`} onClick={...swap i,i-1...}><ArrowUp size={12}/></button>
  <button disabled={i===experiences.length-1} className={`... ${i===experiences.length-1?'opacity-30 pointer-events-none':''}`} onClick={...swap i,i+1...}><ArrowDown size={12}/></button>
  <button ...><Pencil /></button>
  <button ...><Trash2 /></button>
</div>
```

O `.map` na linha 581 precisa receber o índice: `experiences.map((exp, i) => ...)`.

### 2. Links de contato (linhas 649-654)

Mesma abordagem: adicionar `ArrowUp`/`ArrowDown` antes do Pencil no `.map` dos `socialLinks`.

O `.map` na linha 643 precisa receber o índice: `socialLinks.map((link, i) => ...)`.

### Nenhum outro arquivo alterado.

Imports já incluem `ArrowUp` e `ArrowDown` (linha 4).

