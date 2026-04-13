

## Adicionar preview de foto no painel admin

### Arquivo único: `src/components/portfolio/AdminPanel.tsx`

**Alterações:**

1. **Novo estado** — adicionar `const [photoPreview, setPhotoPreview] = useState<string | null>(null)` para armazenar a URL temporária do preview.

2. **Modificar `handlePhotoUpload`** — antes da lógica existente de FileReader, gerar preview com `URL.createObjectURL(file)` e guardar no estado. Se já existir um preview anterior, revogar com `URL.revokeObjectURL()`.

3. **Cleanup** — adicionar `useEffect` que revoga a URL ao desmontar o componente.

4. **Renderizar preview** — logo abaixo do `div` de upload (linha ~394, antes do `<h3>` de skills), exibir condicionalmente:
   ```
   {photoPreview && (
     <div className="mt-4 mb-6 flex justify-center">
       <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-border" />
     </div>
   )}
   ```

**O que NÃO muda:** lógica de salvamento via FileReader/setUserPhoto, nenhum outro arquivo.

