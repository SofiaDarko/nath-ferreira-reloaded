

## Plano: Color picker dedicado para o título do projeto no hover

### Mudança mínima

**1. `src/types/portfolio.ts`** — adicionar campo `projectHoverTitleColor: string` em `Theme`.

**2. `src/data/defaults.ts`** — adicionar `projectHoverTitleColor: '#ffffff'` em `DEFAULT_THEME`.

**3. `src/pages/Index.tsx`** — emitir nova var `--theme-project-hover-title` no bloco `<style>` a partir de `theme.projectHoverTitleColor`.

**4. `src/components/portfolio/HomePage.tsx`** — única linha alterada (linha 69): trocar `color: 'var(--theme-fg, #fff)'` por `color: 'var(--theme-project-hover-title, var(--theme-fg, #fff))'` no `<div>` do nome do projeto.

**5. `src/components/portfolio/AdminPanel.tsx`** — adicionar uma entrada no array `colorFields` (linha ~406):
```ts
{ key: 'projectHoverTitleColor', label: lang === 'pt' ? 'Título do Projeto (hover)' : 'Project Title (hover)' }
```
Nenhuma outra lógica muda — o picker é renderizado automaticamente pelo `.map()` existente.

### Arquivos NÃO tocados
- MobileHomePage, AboutPage, ContactPage, ProjectModal, Sidebar, hook, migrations, edge functions
- O picker `fg` continua controlando todos os outros textos do site normalmente

### Resultado
Na aba **Aparência**, aparece um novo color picker "Título do Projeto (hover)" separado do "Texto Principal" (`fg`). Trocar essa cor afeta **somente** o texto que aparece sobre o card do projeto no hover. Default = branco (mesmo comportamento atual), zero regressão visual.

### Ponto de restauração
Esta mensagem é o checkpoint. Para reverter, clicar **Revert** na resposta anterior (a que finalizou a versão mobile dedicada).

