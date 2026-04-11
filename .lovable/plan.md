
Resumo

O screenshot confirma que o layout da sidebar continua existindo, mas os textos dos botões estão vazios. A faixa verde do item ativo aparece, então o problema principal não é o estilo: é o conteúdo desses labels.

Causa raiz identificada

Em `src/pages/Index.tsx`, o estado `globalSettings` é carregado do `localStorage` com `loadState('nf_settings', DEFAULT_GLOBAL_SETTINGS)`. Como os campos `navHome`, `navAbout` e `navContact` foram adicionados depois, quem já tinha configurações salvas antigas recebe um objeto incompleto. Resultado: a sidebar renderiza `undefined` nesses títulos e eles somem.

Plano de correção

1. Corrigir a hidratação de `globalSettings` em `src/pages/Index.tsx`
- Mesclar sempre o conteúdo salvo com `DEFAULT_GLOBAL_SETTINGS`, em vez de usar o objeto salvo “cru”.
- Exemplo de lógica: usar algo equivalente a `...DEFAULT_GLOBAL_SETTINGS, ...savedSettings`.
- Isso restaura automaticamente os campos novos sem apagar as personalizações já feitas.

2. Garantir fallback visual imediato na `PortfolioSidebar.tsx`
- Manter o layout atual exatamente como está.
- Ajustar os labels para usar fallback seguro:
  - `navHome` -> fallback para `t.home`
  - `navAbout` -> fallback para `t.about`
  - `navContact` -> fallback para `t.contact`
- Assim, mesmo se algum campo vier vazio ou ausente, os títulos continuam visíveis.

3. Persistir a correção para não quebrar de novo
- Após normalizar `globalSettings`, garantir que o estado completo volte a ser salvo.
- Isso evita que a versão antiga do `localStorage` continue causando o problema em sessões futuras.

4. Validar o painel admin sem alterar o restante
- Como o admin usa `globalSettings`, verificar que os campos “Nav Home / Sobre / Contato” apareçam preenchidos corretamente.
- Não mexer em espaçamento, rotação, bordas, hover nem no restante do layout recente.

Detalhes técnicos

Arquivos a ajustar:
- `src/pages/Index.tsx`
- `src/components/portfolio/PortfolioSidebar.tsx`

O que não será alterado:
- Estrutura visual da sidebar
- Cor da seleção
- Bordas e distribuição dos botões
- Mudanças recentes de skills, experiências, contato e galeria

Resultado esperado
- Os textos “Home”, “Sobre” e “Contato” voltam a aparecer imediatamente.
- A correção funciona mesmo para usuários que já tinham dados antigos salvos no navegador.
- O layout atual permanece intacto, mudando só o necessário para restaurar os títulos.
