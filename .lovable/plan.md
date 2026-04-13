

## Migração de Autenticação — SHA-256 → Lovable Cloud Auth

### Arquivos alterados (3)

**1. `src/components/portfolio/PasswordGate.tsx`**
- Remover `ADMIN_HASH`, função `sha256` e verificação client-side
- Adicionar `import { supabase } from '@/integrations/supabase/client'`
- Adicionar campo de email ao formulário (mesmo estilo visual do campo de senha)
- Substituir `handleSubmit` por `supabase.auth.signInWithPassword({ email, password })`
- Erro genérico: "Credenciais inválidas"
- Manter visual, animação, ESC handler inalterados

**2. `src/App.tsx`**
- Renomear rota `/admin` para `/studio` (linha 19)

**3. `src/pages/Index.tsx`**
- `handleLogout`: adicionar `await supabase.auth.signOut()`
- Adicionar `useEffect` com `onAuthStateChange` para derivar `isLoggedIn` da sessão real e restaurar sessão ao recarregar

### O que NÃO muda
- Nenhum layout, componente visual ou lógica do admin panel
- Nenhum outro arquivo
- Nenhuma migração de banco

