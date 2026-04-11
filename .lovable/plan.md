

## Corrigir parágrafo de bio invisível na página Sobre

### Problema
O texto de bio abaixo do título "Olá, sou Nath..." não aparece. Possíveis causas:
1. O valor salvo em `editableTexts['about-bio-pt']` pode conter HTML vazio (ex: `<br>`, espaços) que é truthy mas visualmente vazio, impedindo o fallback para `bioPlaceholder`
2. A cor `text-fg/60` (branco a 60% opacidade) em `text-sm` pode ter contraste insuficiente

### Correção

**Arquivo: `src/components/portfolio/AboutPage.tsx`**
- Melhorar o fallback do bio: verificar se o texto salvo tem conteúdo real (não apenas tags HTML vazias ou whitespace) antes de usá-lo — caso contrário, usar `bioPlaceholder`
- Aumentar a opacidade do texto de `text-fg/60` para `text-fg/70` para melhor visibilidade
- Aumentar o tamanho de `text-sm` para `text-base` para o parágrafo ficar mais legível

**Arquivo: `src/components/portfolio/EditableText.tsx`**
- Sem alterações estruturais

### Resultado
O parágrafo de bio volta a ser visível abaixo do título, tanto com texto personalizado quanto com o placeholder padrão.

