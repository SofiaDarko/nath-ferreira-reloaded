

## Adicionar botão "Salvar textos" na aba Textos Globais

**Arquivo:** `src/components/portfolio/AdminPanel.tsx`

### Alteração

Após o `.map` dos campos (linha 725, antes do `</div>` de fechamento da seção na linha 726), adicionar um botão "Salvar textos" com estilo idêntico ao "Salvar" da aba Aparência (linha 686-691).

```tsx
<button
  onClick={() => toast.success('Textos salvos!')}
  className="px-4 py-2 rounded-lg text-xs font-medium bg-accent text-black hover:opacity-90 transition mt-2"
  style={{ backgroundColor: 'var(--theme-accent)', color: '#000' }}
>
  Salvar textos
</button>
```

O `setGlobalSettings` já é chamado via `onChange` em cada campo, e o `useEffect` no `Index.tsx` persiste no `localStorage`. O botão serve apenas como confirmação visual com toast.

### Resumo
- 1 bloco de ~7 linhas inserido na linha 725 do `AdminPanel.tsx`
- Nenhum outro arquivo alterado
- Import de `toast` já existe (linha 9)

