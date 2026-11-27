// Aquecer: na primeira vez que um efeito aparece na tela, o navegador compila na GPU o programa que o desenha, e o
// quadro daquele instante engasga (medido com o cache vazio, a 180 Hz: de 20 a 100 ms; da segunda vez, nada). As
// fotos em preto e branco da estrutura só aparecem quando a cena das modalidades solta, então a primeira vez delas
// caía no meio da rolagem. Aqui, logo depois da abertura, uma cópia minúscula e quase transparente das fotos é
// desenhada por um instante, com o mesmo filtro: a compilação acontece com a página parada.
// O blur da barra e o sublinhado dos links se aquecem pelo CSS (os dois ficam desenhados, invisíveis, desde o
// primeiro quadro: barra.css).
export function aquecer() {
  const fotos = document.querySelectorAll('.foto');
  if (!fotos.length) return;
  const caixa = document.createElement('div');
  caixa.className = 'aquecer';
  caixa.setAttribute('aria-hidden', 'true');
  caixa.inert = true;
  const imagens = [];
  for (const foto of fotos) {
    const copia = foto.cloneNode(true);
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
