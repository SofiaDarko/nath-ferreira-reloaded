

## Reimplantar Edge Function auth-email-hook

**Objetivo:** Forçar o redeploy da função para que o preview reflita o `SITE_NAME` atual, sem alterar lógica ou visual.

**Ação:**
1. Adicionar um comentário inócuo (ex: `// redeployed`) no final do arquivo `supabase/functions/auth-email-hook/index.ts`
2. Reimplantar com `deploy_edge_functions`

