

## Traduzir EMAIL_SUBJECTS para português brasileiro

**Arquivo:** `supabase/functions/auth-email-hook/index.ts`

**Alteração:** Substituir os valores do objeto `EMAIL_SUBJECTS` (linhas 18-25):

```typescript
const EMAIL_SUBJECTS: Record<string, string> = {
  signup: 'Confirme seu e-mail',
  invite: 'Você foi convidado',
  magiclink: 'Seu link de acesso',
  recovery: 'Redefina sua senha',
  email_change: 'Confirme seu novo e-mail',
  reauthentication: 'Seu código de verificação',
}
```

**Depois:** Reimplantar a Edge Function `auth-email-hook` com `deploy_edge_functions`.

Nenhum outro arquivo será alterado.

