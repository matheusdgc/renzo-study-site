// Aquecer: na primeira vez que um efeito aparece na tela, o navegador compila na GPU o programa que o desenha, e o
// quadro daquele instante engasga (medido com o cache vazio, a 180 Hz: de 20 a 110 ms; da segunda vez, nada). Dois
// deles só aparecem no meio da rolagem: as fotos em preto e branco da estrutura (quando a cena das modalidades
// solta) e as bolinhas da lista dos planos. Aqui, logo depois da abertura, uma cópia minúscula e quase transparente
// dos dois é desenhada por um instante: a compilação acontece com a página parada.
// O blur da barra e o sublinhado dos links se aquecem pelo CSS (os dois ficam desenhados, invisíveis, desde o
// primeiro quadro: barra.css).
const ALVOS = '.foto, .plano__lista';

export function aquecer() {
  const alvos = document.querySelectorAll(ALVOS);
  if (!alvos.length) return;
  const caixa = document.createElement('div');
  caixa.className = 'aquecer';
  caixa.setAttribute('aria-hidden', 'true');
  caixa.inert = true;
  const imagens = [];
  for (const alvo of alvos) {
    if (alvo.matches('.plano__lista') && caixa.querySelector('.plano__lista')) continue; // uma lista basta
    const copia = alvo.cloneNode(true);
    copia.classList.remove('marco');
    const img = copia.querySelector('img');
    if (img) { img.loading = 'eager'; imagens.push(img); }
    caixa.append(copia);
  }
  document.body.append(caixa);
  // sai quando as fotos já foram decodificadas e pintadas (ou, numa rede lenta, depois de 6 s)
  const prontas = Promise.all(imagens.map((img) => img.decode().catch(() => {})));
  const limite = new Promise((ok) => setTimeout(ok, 6000));
  Promise.race([prontas, limite]).then(() => setTimeout(() => caixa.remove(), 400));
}
