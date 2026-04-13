

## Corrigir borda lateral do botão "Contato" na Sidebar

### Problema
O screenshot confirma que "CONTATO" não mostra bordas laterais, apesar de todos os três itens compartilharem a mesma className com `border-x border-border`. Provável causa: a classe `last:border-b-0` pode estar resetando a propriedade `border` de forma que anula o `border-x` no último item, dependendo da ordem de geração das classes pelo Tailwind.

### Correção

**Arquivo único: `src/components/portfolio/PortfolioSidebar.tsx`**

Substituir `border-b border-x border-border last:border-b-0` por classes mais explícitas que não conflitem:

```
border-l border-r border-b border-border last:border-b-0
```

Ou, se persistir, usar abordagem de borda explícita por inline style no último item para garantir que as bordas laterais nunca sejam perdidas:

```
border-l border-r border-border border-b [&:last-child]:border-b-0
```

Nenhuma outra propriedade (layout, cores, espaçamento, hover) será alterada.

### Resultado
Todos os três botões (Home, Sobre, Contato) terão bordas laterais idênticas de 1px.

