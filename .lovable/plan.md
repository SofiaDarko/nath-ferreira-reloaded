

## Diagnóstico definitivo (com evidência do banco)

Os network logs revelam o problema **exato** e confirmam que o dano está acontecendo agora:

### Bug 1 — Seed sobrescreve dados reais (CRÍTICO)
A cada load, `usePortfolioData.ts` dispara `seedDefaults()` quando `skills` está vazio (atualmente está: `[]`). O seed faz upsert em **todas as tabelas**, incluindo `site_settings`, com:
- `user_photo: null` ← apaga sua foto
- `editable_texts: {}` ← apaga sua bio
- `theme: DEFAULT_THEME` ← reverte cores
- `global_settings: DEFAULT_GLOBAL_SETTINGS` ← reverte textos

Evidência nos logs: o último request POST a `site_settings` retornou `401 RLS` (porque visitante anônimo) — mas **se o admin estiver logado, o seed escreve com sucesso e apaga tudo**. É exatamente o que você descreveu: "fica um tempo e depois some".

### Bug 2 — Seeds com IDs inválidos (`"1"`, `"2"`...)
Os defaults usam IDs string tipo `"1"`, mas as tabelas esperam UUID. Logs mostram: `invalid input syntax for type uuid: "1"`. O seed sempre falha pra projects/skills/experiences/education — mas o seed de `site_settings` (id=1, integer) **funciona** quando logado, e é justamente esse que destrói foto/bio/tema.

### Bug 3 — Mismatch de chave da bio
DB tem `editable_texts: { about_description: "SUA BIO AQUI" }` mas `AboutPage`/`MobileAboutPage` leem de `about-bio-pt`/`about-bio-en`. Bio nunca aparece mesmo quando salva.

## Correção (preserva 100% dos dados atuais)

**Único arquivo alterado:** `src/hooks/usePortfolioData.ts`

### Fix 1 — Eliminar seed destrutivo
- Remover a flag global `needsSeed` e a função `seedDefaults()` que escreve em `site_settings`.
- `site_settings` **NUNCA** é re-inicializado se a linha id=1 já existir no banco (que é o caso atual).
- Se `site_settings` realmente não existir, fazer um `insert` mínimo só com `id: 1` e deixar o resto como default do banco (`{}`).
- Para projects/skills/experiences/education: só fazer seed se a tabela estiver **completamente vazia** E o seed usar `gen_random_uuid()` em vez dos IDs `"1"`, `"2"` (ou simplesmente não seedar nada — visitante novo vê estado vazio até admin adicionar).

**Decisão recomendada:** desativar seed completamente. Hoje você já tem dados reais (projetos, experiências, educação, settings). Seed só faz sentido pra projeto novo, e como nunca funcionou (UUID inválido), ninguém depende dele.

### Fix 2 — `saveSettings` com merge defensivo
Antes de upsert, ler o estado atual e mesclar:
```ts
const { data: current } = await supabase
  .from('site_settings').select('*').eq('id', 1).maybeSingle();
await supabase.from('site_settings').upsert({
  id: 1,
  theme: patch.theme ?? current?.theme,
  global_settings: patch.global_settings ?? current?.global_settings,
  social_links: patch.social_links ?? current?.social_links,
  editable_texts: patch.editable_texts ?? current?.editable_texts,
  user_photo: patch.user_photo !== undefined ? patch.user_photo : current?.user_photo,
  updated_at: new Date().toISOString(),
}, { onConflict: 'id' });
```
Garante que salvar tema não apaga foto, salvar foto não apaga bio, etc.

### Fix 3 — Carga sempre confiável
No `load()`, quando `settRes.data` existir (que é o caso), **sempre** carregar todos os campos com fallback pra default apenas se o campo no DB estiver vazio. Nunca disparar seed/upsert por conta de campos parciais.

## Sobre a chave da bio (`about_description` vs `about-bio-pt`)
**NÃO vou alterar** nesta correção pra não tocar em outros arquivos. Após o fix do hook, o admin pode reescrever a bio pelo painel — ela será salva com a chave correta (`about-bio-pt`/`about-bio-en` que o `EditableText` usa) e aparecerá normalmente. A chave antiga `about_description` continua no DB sem efeito (inofensiva).

## Arquivos NÃO tocados
- Tipos, defaults, AdminPanel, AboutPage, MobileAboutPage, Index, todos os componentes
- Schema do banco, RLS, migrations, edge functions
- Dados existentes no banco (preservados integralmente)

## Garantia de preservação
A migração não toca em **nenhum dado existente**. O fix é puramente client-side: muda como o app **lê e escreve** em `site_settings`, mas nunca apaga ou modifica linhas. Seus projetos, experiências, educação, foto, tema, textos globais e social links permanecem intocados.

## Ponto de restauração
Esta mensagem é o checkpoint. Para reverter, clique **Revert** na resposta anterior (a do color picker do título de hover).

## Risco
Mínimo. Mudança defensiva: menos escritas, mais merge. Pior caso, alguma chave nova vinda dos defaults não é injetada automaticamente — mas o site continua funcionando com o estado salvo.

