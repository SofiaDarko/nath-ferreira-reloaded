

## Corrigir border ausente no botão "Contato"

### Diagnóstico

Os itens de nav usam `writing-vertical transform rotate-180`, o que rotaciona 180° o elemento. Com essa rotação, as propriedades CSS de borda são mapeadas visualmente assim:

- `border-b` lógico → borda **superior** visual (entre itens, ok)
- `border-l` / `border-r` → invertidos visualmente

A classe `last:border-b-0` remove o `border-bottom` lógico do último item ("Contato"). Porém, devido ao `rotate-180`, esse `border-bottom` corresponde visualmente a uma das bordas laterais — e é por isso que um lado do "Contato" perde a borda.

### Correção — Arquivo único: `src/components/portfolio/PortfolioSidebar.tsx`

**Linha 36:** Remover `last:border-b-0` da string de classes dos itens de navegação.

Isso restaura a borda lateral visual do "Contato" sem afetar os outros itens (que já têm todas as bordas). A separação visual entre itens continua funcionando porque cada item tem suas próprias bordas em todos os lados.

Nenhum style inline. Nenhum outro arquivo alterado. Nenhuma mudança no `<aside>` pai.

