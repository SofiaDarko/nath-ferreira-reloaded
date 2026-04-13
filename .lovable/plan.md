

## Migrar uploads restantes para Cloud Storage

### Arquivo único: `src/components/portfolio/AdminPanel.tsx`

### Alterações

**1. `handleThumbUpload` (linhas 78-85)** — tornar `async`, substituir FileReader por upload ao bucket `portfolio-assets` com path `projects/{timestamp}-thumb.{ext}`, guardar URL pública no estado `thumb`.

**2. `handleImagesUpload` (linhas 87-94)** — tornar `async`, processar cada arquivo com upload sequencial ao bucket `portfolio-assets` com path `projects/{timestamp}-{index}.{ext}`, acumular URLs públicas no estado `images`.

**3. `handleSkillIconUpload` (linhas 121-128)** — tornar `async`, upload ao bucket `portfolio-assets` com path `skills/{timestamp}-icon.{ext}`, guardar URL pública no estado `skillIconUrl`.

**4. Fallback para base64 antigo** — nas `<img>` dentro do AdminPanel (linhas 348, 363, 391), adicionar `onError` handler que substitui o `src` por um placeholder cinza inline SVG. Isso cobre dados antigos salvos como base64 que eventualmente não renderizem.

### O que NÃO muda
- Nenhum outro arquivo é alterado
- Lógica de `saveProject`, `saveSkill`, persistência em localStorage no Index.tsx — tudo permanece igual
- Os componentes de exibição (HomePage, ProjectModal, AboutPage) já usam `<img src={valor}>` que funciona tanto com URLs públicas quanto com base64 antigo — não precisam de alteração
- Upload de foto de perfil (já migrado anteriormente)

### Detalhes técnicos
- Cada upload usa nome único via `Date.now()` para evitar colisões
- O bucket `portfolio-assets` e suas políticas RLS já existem
- localStorage passa a guardar URLs (~100 bytes) em vez de base64 (~100KB+), eliminando risco de QuotaExceededError

