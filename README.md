# Renzo

Landing page da Renzo, uma academia fictícia de musculação, cross e lutas. É um projeto de estudo e portfólio: não há cliente real, e os textos, preços, horários e depoimentos são exemplos.

O centro da página é uma peça 3D de borracha preta, desenhada ao vivo por um shader próprio, sem biblioteca de 3D. Ela é o "O" do título do hero, acompanha a rolagem pela página inteira e toma a forma do equipamento de cada seção (anilha, halter, kettlebell, saco de pancada, bola, cadeado e cronômetro), até pousar no "O" do nome no rodapé.

## Rodar

Precisa do Node 20.19+ ou 22.12+ (exigência do Vite 8).

```sh
npm install
npm run dev        # servidor de desenvolvimento
npm run build      # gera o dist/
npm run preview    # serve o dist/ para conferir o build
```

O `dist/` usa caminhos relativos (`base: './'`), então abre em qualquer pasta da hospedagem, não só na raiz do domínio.

## Stack

- [Vite](https://vite.dev) 8, sem framework: HTML, CSS e JavaScript puros.
- [Lenis](https://lenis.darkroom.engineering) para a rolagem suave (só roda do mouse e trackpad; no toque, a rolagem é a nativa).
- WebGL2 com shader próprio (traçado de raios sobre funções de distância). Sem WebGL2, a página funciona sem a peça.
- Fontes Big Shoulders Stencil (títulos) e Geist (texto), via Fontsource.

## Estrutura

```
index.html          o <head>, a ordem das seções e o <canvas> da peça
laboratorio.html    página de trabalho com as formas da peça (fora do build)
vite.config.js      plugin que monta as seções no index.html
public/             a marca (marca.svg) e as fotos da seção Estrutura
src/
  main.js           liga tudo e roda o único laço de quadros
  config.js         WhatsApp do formulário e grade de aulas
  sections/         uma seção por arquivo: <nome>.html + <nome>.css
  styles/           site.css (a folha única), tokens.css, base.css, fontes.css
  gl/               a peça: formas (GLSL), shader e canvas, poses
  motion/           percurso da peça, cena das modalidades, rolagem, textos e interações
```

Cada seção do `index.html` é uma marca, por exemplo `<!-- @secao hero -->`. No dev e no build, o plugin `secoes` troca essa marca pelo conteúdo de `src/sections/hero.html`.

Seções, na ordem: barra, hero, manifesto, modalidades, estrutura, planos, horários, depoimentos, dúvidas, contato e rodapé.

### Como a peça anda

Cada seção tem uma vaga, `<span class="vaga" data-vaga="…" data-forma="…">`: é o lugar onde a peça pousa e a forma que ela toma ali. O tamanho e a posição da vaga vêm do CSS. Onde a peça está depende da posição da rolagem. A troca de forma, a pose e a inclinação pelo mouse correm por tempo, com mola, então ela nunca para numa forma pela metade.

## Parâmetros de URL

| onde | parâmetro | efeito |
|---|---|---|
| `index.html` | `?tema=mono` \| `osso` \| `brasa` \| `cobalto` | troca a paleta |
| `laboratorio.html` | sem parâmetro | todas as formas lado a lado |
| `laboratorio.html` | `?forma=2` | uma forma só, grande |
| `laboratorio.html` | `?mix=0,2,0.5` | a troca entre duas formas parada no meio |
| `laboratorio.html` | `?gx=20&gy=-30` | fixa o giro (sem ele, a peça segue o mouse) |
| `laboratorio.html` | `?fundo=f01810` | troca a cor de fundo |

## Personalizar

| o quê | onde |
|---|---|
| Textos de cada seção | `src/sections/<nome>.html` |
| Cores e temas | `src/styles/tokens.css` (papéis como `--fundo`, `--tinta`, `--acento` e as cores da peça) |
| Grade de aulas e WhatsApp | `src/config.js`. Com o `whatsapp` vazio, o formulário só mostra "Pedido anotado" e não envia nada |
| Formas da peça | `src/gl/formas.js` (função de distância em GLSL), `src/gl/poses.js` e o `data-forma` da vaga |
| Fotos da Estrutura | `public/fotos/` (`salao.webp`, `peso-livre.webp`, `tatame.webp`) |

## Conferir antes de publicar

- `npm run build` sem erro e sem aviso; console limpo no `npm run preview`.
- Rolar a página inteira, devagar e depressa: em repouso, a peça não cobre texto, e nenhum título aparece com acento ou cedilha cortados.
- No celular (390 × 844, 393 × 659 e 375 × 553): nunca rola para o lado.
- Teclado: Tab passa por tudo; as abas da grade respondem às setas; a sanfona das dúvidas e o formulário funcionam.
