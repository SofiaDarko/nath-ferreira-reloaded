

## Adicionar botões "Salvar foto" e "Remover foto" na aba Sobre do AdminPanel

### Problema atual
O `handlePhotoUpload` faz upload e chama `setUserPhoto` imediatamente ao selecionar o arquivo. O usuário não tem feedback visual (toast) nem botão de remover.

### Alterações em `src/components/portfolio/AdminPanel.tsx`

**1. Separar seleção de upload:**
- `handlePhotoUpload` passa a apenas criar o preview local (`photoPreview`) e guardar o `File` em um novo estado `photoFile` — sem fazer upload.
- Novo estado: `const [photoFile, setPhotoFile] = useState<File | null>(null);`

**2. Nova função `savePhoto`:**
- Executa o upload ao Supabase Storage (mesma lógica atual: upsert em `portfolio-assets/profile-photo.{ext}`)
- Em caso de sucesso: `setUserPhoto(url)`, `toast.success("Foto salva!")`, limpa `photoPreview` e `photoFile`
- Em caso de erro: `toast.error("Erro ao salvar foto.")`

**3. Nova função `removePhoto`:**
- Deleta o arquivo do Storage com `supabase.storage.from('portfolio-assets').remove(['profile-photo.*'])` (usando o path conhecido)
- Chama `setUserPhoto(null)` — requer alterar o tipo do prop de `(s: string) => void` para `(s: string | null) => void`
- `toast.success("Foto removida.")`
- Limpa `photoPreview` e `photoFile`

**4. UI (linhas ~428-432):**
- Após o `<img>` do preview, adicionar botão **"Salvar foto"** — visível apenas quando `photoPreview && photoFile` existem
- Abaixo, botão **"Remover foto"** — visível apenas quando `userPhoto` não é null (prop passado ao componente, precisa ser adicionado às props)
- Adicionar `userPhoto` como prop recebida no AdminPanel (atualmente não recebe, só recebe `setUserPhoto`)

**5. Ajuste no Index.tsx:**
- Passar `userPhoto` como prop ao `<AdminPanel>`

### Arquivos alterados
- `src/components/portfolio/AdminPanel.tsx` — lógica e UI dos botões
- `src/pages/Index.tsx` — passar `userPhoto` como prop (1 linha)

Nenhuma alteração visual ou lógica existente será modificada além do necessário.

