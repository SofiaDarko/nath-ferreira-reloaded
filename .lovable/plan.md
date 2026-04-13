

## Adicionar botões "Salvar tema" e "Resetar" na seção Aparência

### Arquivo único: `src/components/portfolio/AdminPanel.tsx`

### Confirmações solicitadas

- **`DEFAULT_THEME`** em `src/data/defaults.ts` contém valores fixos hardcoded (bg: `#0a0a0a`, accent: `#c8f564`, etc.) — são os originais, nunca alterados pelo usuário.
- **`setTheme(DEFAULT_THEME)`** atualiza o state, que por sua vez dispara o `useEffect` em `Index.tsx` que executa `localStorage.setItem('nf_theme', ...)` — ou seja, o reset persiste automaticamente no localStorage.
- O color picker já atualiza em tempo real via `setTheme` → re-render do `<style>` com CSS variables no Index.tsx. Nada a mudar aqui.

### Alterações

1. **Importar `DEFAULT_THEME`** — adicionar ao import existente de `../../data/defaults` (ou criar o import se não existir).

2. **Importar `toast`** de `sonner` para feedback visual.

3. **Adicionar dois botões após o grid de cores** (linha ~588, dentro do bloco `activeTab === 'appearance'`):
   - **"Salvar tema"** — exibe `toast.success("Tema salvo!")` como confirmação visual (a persistência já é automática via useEffect).
   - **"Resetar"** — executa `setTheme(DEFAULT_THEME)`, que automaticamente atualiza o site em tempo real E persiste no localStorage. Exibe `toast.success("Tema resetado!")`.

4. **Nenhum outro arquivo é alterado.**

### Detalhe técnico
O fluxo de persistência é: `setTheme()` → state update → useEffect em Index.tsx → `localStorage.setItem('nf_theme', JSON.stringify(theme))`. Tanto "Salvar" quanto "Resetar" passam por esse fluxo, garantindo que o localStorage reflete o estado atual.

