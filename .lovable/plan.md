## Diagnóstico

Os controles nativos do `<video>` não respondem porque o wrapper `.image-protect-wrapper` tem um pseudo-elemento `::after` que sobrepõe a área inteira com `z-index: 5` para impedir clique-direito/arrasto em imagens. Esse overlay também intercepta os cliques nos botões nativos do vídeo (play, pause, slider de volume).

Além disso, a classe `protected-image` é aplicada também ao `<video>`. A regra CSS atual (`img.protected-image`) só atinge `<img>`, então não causa o bloqueio direto — mas se eventualmente alguém ampliar o seletor, quebraria de novo.

## Correção (mínima, cirúrgica)

**Arquivo: `src/index.css`** — tornar o overlay do wrapper não-bloqueante quando há vídeo dentro, e manter proteção para imagens.

Mudança proposta no bloco existente (linhas 114–124):
```css
.image-protect-wrapper {
  position: relative;
}

/* overlay only over images, never over videos */
.image-protect-wrapper:not(:has(video))::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 5;
  background: transparent;
}
```

Usa `:has(video)` para desativar o overlay quando o slide atual é um vídeo. Suportado em todos os navegadores modernos (Chrome/Safari/Firefox atuais). Imagens continuam 100% protegidas.

**Arquivos `ProjectModal.tsx` e `MobileProjectModal.tsx`** — remover a classe `protected-image` apenas do `<motion.video>` (já não tem efeito real e evita confusão futura). Manter todo o resto:
- `controls` permanece
- `onContextMenu={(e) => e.preventDefault()}` permanece (impede salvar vídeo via menu de contexto)
- `muted={meta?.muted ?? true}` permanece (autoplay precisa de muted; usuário desmuta clicando no controle de volume)
- `autoPlay`, `loop`, `playsInline` permanecem

## Resultado

- Visitante pode **pausar/dar play** clicando no vídeo ou no botão.
- Visitante pode **ativar áudio** pelo controle de volume nativo.
- Vídeo continua iniciando mutado (requisito de autoplay dos browsers).
- Imagens continuam protegidas contra clique-direito e arrasto.
- Nenhuma outra funcionalidade afetada (color picker, mobile/desktop sync, seed, thumbnails de vídeo, upload — tudo intocado).

## Arquivos alterados
- `src/index.css` (1 seletor ajustado)
- `src/components/portfolio/ProjectModal.tsx` (remover `protected-image` do `<video>`)
- `src/components/portfolio/mobile/MobileProjectModal.tsx` (remover `protected-image` do `<video>`)

## Risco
Mínimo. Mudança isolada à camada de overlay e à classe do elemento de vídeo. Imagens permanecem com a mesma proteção.
