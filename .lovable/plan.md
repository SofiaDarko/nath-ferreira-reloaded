

## Diagnóstico

O `MobileHomePage.tsx` (linha 91) usa `style={{ color: theme.fg }}` direto no título do card, ignorando a variável `--theme-project-hover-title` que foi adicionada para o desktop.

A var CSS já é emitida no bloco `<style>` mobile do `Index.tsx` (já confirmei), então só falta o componente mobile consumi-la.

## Correção (1 linha, 1 arquivo)

**`src/components/portfolio/mobile/MobileHomePage.tsx`** (linha 91):

Trocar:
```tsx
<div className="..." style={{ color: theme.fg }}>
  {name}
</div>
```

Por:
```tsx
<div className="..." style={{ color: 'var(--theme-project-hover-title, ' + theme.fg + ')' }}>
  {name}
</div>
```

Mantém `theme.fg` como fallback — comportamento atual preservado se a var não existir.

## Arquivos NÃO tocados
- Index.tsx, HomePage.tsx, AdminPanel.tsx, types, defaults — tudo já está correto
- Demais componentes mobile

## Risco
Zero. Mudança isolada de uma linha, com fallback.

