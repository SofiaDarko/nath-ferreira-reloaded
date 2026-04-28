
## Objetivo
Permitir vídeos (qualquer aspect: 1:1, 16:9, 9:16, 4:5 etc.) como mídia de projeto, com painel admin completo: upload, thumb opcional (auto-extraída se não fornecida), mute on/off, editar e apagar. Zero regressão em projetos só-imagem existentes.

## Estratégia: tipo de mídia inferido pela URL
Usar a coluna `images: text[]` que já existe — sem migração destrutiva. Cada item continua sendo URL string. Detecção por extensão (`.mp4`, `.webm`, `.mov`, `.m4v`) decide se renderiza `<img>` ou `<video>`.

Para metadados de vídeo (mute, poster customizado), adicionar **uma única coluna nova opcional** `video_meta jsonb` em `projects`, mapeando `{ "<videoUrl>": { muted: bool, poster: string|null } }`. Nullable, default `'{}'`. Projetos antigos: campo vazio = comportamento padrão (autoplay muted, sem poster).

### Migração SQL (única, não destrutiva)
```sql
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS video_meta jsonb NOT NULL DEFAULT '{}'::jsonb;
```

## Mudanças de código (mínimas e localizadas)

### 1. `src/types/portfolio.ts`
Adicionar campo opcional em `Project`:
```ts
videoMeta?: Record<string, { muted: boolean; poster: string | null }>;
```

### 2. `src/hooks/usePortfolioData.ts` (apenas conversores)
- `dbToProject`: ler `r.video_meta ?? {}` → `videoMeta`.
- `projectToDb`: gravar `video_meta: p.videoMeta ?? {}`.
Nada mais muda — saveSettings, defensive merge, tudo intocado.

### 3. Novo helper `src/lib/media.ts`
```ts
export const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i;
export const isVideo = (url: string) => VIDEO_EXT.test(url);

// Extrai 1 frame do vídeo via <video> + <canvas>
export async function captureVideoPoster(file: File, atSec = 1): Promise<Blob>;
```
Usado tanto no upload (gerar poster automático) quanto na renderização.

### 4. `src/components/portfolio/AdminPanel.tsx`
**Aba Projects, seção "Imagens"** vira "Mídia (imagens e vídeos)":
- `<input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple>` 
- No `handleImagesUpload`, detectar vídeo por mime/ext:
  - Se vídeo: subir o arquivo + gerar poster automático com `captureVideoPoster` + subir poster como `.jpg`. Salvar em `videoMeta[url] = { muted: true, poster: posterUrl }`.
  - Se imagem: comportamento atual.
- Na **lista de mídias do form**, cada item de vídeo ganha 3 controles extras:
  - 🔊/🔇 toggle mute (atualiza `videoMeta[url].muted`)
  - 🖼️ "Trocar capa do vídeo" (input file image/* → upload → atualiza `videoMeta[url].poster`)
  - ✕ excluir (já existe; precisa também remover do `videoMeta`)
- Thumb principal do projeto (`thumb`) continua sendo imagem only (input já é `image/*`). Se o usuário não definir thumb e o primeiro item for vídeo, usar o `poster` desse vídeo como `thumb` automaticamente em `saveProject`.

### 5. `src/components/portfolio/HomePage.tsx` (cards desktop)
Cards mostram thumb. Como `thumb` agora é sempre imagem (poster auto ou manual), **não muda nada aqui**. Zero regressão.

### 6. `src/components/portfolio/ProjectModal.tsx` (modal desktop)
Trocar o `<motion.img>` do carousel por um componente que faz branch:
```tsx
{isVideo(currentUrl) 
  ? <video src={currentUrl} poster={poster} autoPlay loop playsInline 
           muted={videoMeta[currentUrl]?.muted ?? true}
           controls className="max-w-full max-h-full rounded-xl" />
  : <motion.img ... />}
```
Aspect ratio respeitado naturalmente via `object-contain` + `max-w/max-h`.

### 7. `src/components/portfolio/mobile/MobileProjectModal.tsx`
Mesma lógica do desktop modal, com `playsInline` obrigatório para iOS, `controls`, `preload="metadata"`.

### 8. `src/components/portfolio/mobile/MobileHomePage.tsx`
Mostra `project.thumb` (imagem). Sem mudança.

## Especificações suportadas

| Item | Valor |
|---|---|
| Formatos | `.mp4` (recomendado, H.264+AAC), `.webm`, `.mov`, `.m4v` |
| Aspect ratios | Qualquer — `object-contain` no modal preserva 1:1, 16:9, 9:16, 4:5, 21:9 |
| Tamanho máx. | 50 MB (limite do Storage) |
| Recomendado | ≤ 10 MB, 1080p, 2–4 Mbps |
| Autoplay | `muted` + `playsInline` (config padrão; toggle de mute no admin) |
| Preload | `metadata` (não baixa o vídeo todo até dar play) |
| Poster auto | Frame em ~1s extraído via canvas, JPG ~300 KB, salvo no Storage |

## Persistência sem regressão
- Migração só **adiciona** coluna nullable com default. Nada existente é tocado.
- `defensive merge` em `usePortfolioData` permanece igual.
- `videoMeta` ausente → `{}` → renderização cai no default (muted, sem poster custom).
- Thumb e images de projetos atuais continuam funcionando idênticos.

## Arquivos NÃO tocados
- `src/data/defaults.ts`, `src/pages/Index.tsx`, `src/types` exceto `Project`
- Color picker / theme vars (mudança recente)
- `MobileHomePage.tsx`, `HomePage.tsx` (cards continuam só com `thumb` imagem)
- Auth, RLS, storage policies (bucket já é público)
- `saveSettings` / merge defensivo

## Risco
Baixo. Migração aditiva. Lógica de renderização isolada em `isVideo()`. Pior caso (poster auto falha por CORS de algum codec): vídeo ainda toca, só sem poster — usuário pode subir manualmente.
