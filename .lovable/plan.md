

## Adicionar log de erro na função savePhoto

**Arquivo:** `src/components/portfolio/AdminPanel.tsx`

### Alteração (linhas 125-128)

Trecho atual:
```tsx
if (error) {
  toast.error('Erro ao salvar foto.');
  return;
}
```

Trecho novo:
```tsx
if (error) {
  console.error('Supabase Storage error:', JSON.stringify(error));
  toast.error('Erro ao salvar foto.');
  return;
}
```

### Resumo
- 1 linha adicionada (console.error) na linha 126
- Nenhum outro arquivo alterado

