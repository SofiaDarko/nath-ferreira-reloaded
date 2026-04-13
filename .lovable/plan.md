

## Atualizar o preview dos emails

O preview na aba Cloud → Emails é servido pela Edge Function `auth-email-hook` que está deployada. A constante `SITE_NAME` já foi alterada no código para `"Nathalia Ferreira Designer"`, mas o preview só atualiza quando a função é reimplantada.

**Ação necessária:**
- Reimplantar a Edge Function `auth-email-hook` com `deploy_edge_functions`

Isso fará o preview mostrar o nome atualizado em todos os templates.

