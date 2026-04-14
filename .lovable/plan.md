

## Adicionar verificação de sessão na função savePhoto

**Arquivo:** `src/components/portfolio/AdminPanel.tsx`

### Alteração (linhas 116-117)

Inserir verificação de sessão após `if (!photoFile) return;` e antes do upload.

Trecho atual:
```tsx
const savePhoto = async () => {
    if (!photoFile) return;
```

Trecho novo:
```tsx
const savePhoto = async () => {
    if (!photoFile) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Sessão expirada. Faça login novamente.');
      return;
    }
```

### Notas
- O cliente `supabase` importado (linha 3) é o mesmo usado para autenticação — não há instância separada
- A verificação de sessão garante que o token JWT esteja presente no header do upload
- Nenhum outro arquivo alterado

