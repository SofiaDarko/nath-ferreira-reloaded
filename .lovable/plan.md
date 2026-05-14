## Objetivo
Fazer a tela de carregamento (spinner inicial) usar o tema atual salvo do site, em vez do tema padrão hardcoded. Hoje o `theme` só é populado depois do fetch ao backend, então o loader sempre aparece nas cores default antes do tema real "piscar" na tela.

## Mudanças

### 1. `src/hooks/usePortfolioData.ts`
- No `useState` inicial do `theme`, ler de `localStorage` (`portfolio_theme_cache`) se existir, caindo no `DEFAULT_THEME` apenas como fallback.
- Após o fetch que aplica o tema do backend (e dentro de `setTheme`/`saveSettings`), gravar o tema atual em `localStorage` para a próxima carga.

### 2. `src/pages/Index.tsx` (bloco `if (loading)`, linhas ~144–150)
- Manter a estrutura atual do spinner.
- Garantir que `backgroundColor` use `theme.bg` e o anel use `theme.accent` (já está assim) — passando a refletir o cache do localStorage no primeiro render.

## Fora de escopo
- Mudanças de UI/conteúdo
- AdminPanel, modais, vídeos, traduções
- SEO, rotas

## Risco
Baixo — apenas adiciona persistência local do tema para evitar flash com cores padrão.