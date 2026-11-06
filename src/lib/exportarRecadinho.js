// Gera a imagem do recadinho em 1080 x 1350 px, desenhada em canvas.
// A imagem traz só o conteúdo do card: sem botões nem campos de edição.

const W = 1080;
const H = 1350;
const X = 110; // margem interna
const LARG = 860; // largura do texto principal
const LARG_BAIXO = 620; // largura quando o texto passa ao lado da Aurora
const Y_AURORA = 1010; // início da área da Aurora (canto inferior direito)
const Y_FIM_TEXTO = 1240; // o texto precisa terminar antes do rodapé

const COR_TEXTO = '#51464E';
const COR_ROTULO = '#5E4B7E';

function carregarImagem(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Não consegui abrir ${src}`));
    img.src = src;
  });
}

// Desenha a imagem inteira dentro de uma caixa, sem cortar nem esticar.
function desenharContain(ctx, img, x, y, w, h) {
  const escala = Math.min(w / img.width, h / img.height);
  const dw = img.width * escala;
  const dh = img.height * escala;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

// Preenche a tela com a moldura, cobrindo a largura.
function desenharFundo(ctx, img) {
  const escala = Math.max(W / img.width, H / img.height);
  const dw = img.width * escala;
  const dh = img.height * escala;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
}

function caixaArredondada(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Quebra o texto em linhas que cabem na largura dada.
function quebrar(ctx, texto, largura) {
  const palavras = texto.split(/\s+/).filter(Boolean);
  const linhas = [];
  let atual = '';
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(teste).width <= largura) {
      atual = teste;
    } else {
      if (atual) linhas.push(atual);
      atual = p;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

// Largura disponível em uma altura: abaixo de Y_AURORA o texto fica mais estreito.
const larguraEm = (y) => (y >= Y_AURORA ? LARG_BAIXO : LARG);

// Mede um bloco de texto. Se desenhar=false, só calcula o fim.
function bloco(ctx, { texto, y, fonte, cor, lh, desenhar }) {
  ctx.font = fonte;
  ctx.fillStyle = cor;
  let linha = y;
  const linhas = [];
  // Quebra linha a linha, porque a largura muda perto da Aurora.
  const palavras = texto.split(/\s+/).filter(Boolean);
  let atual = '';
  for (const p of palavras) {
    const teste = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(teste).width <= larguraEm(linha)) {
      atual = teste;
    } else {
      if (atual) linhas.push({ t: atual, y: linha });
      atual = p;
      linha += lh;
    }
  }
  if (atual) linhas.push({ t: atual, y: linha });
  if (desenhar) linhas.forEach((l) => ctx.fillText(l.t, X, l.y));
  return linhas.length ? linhas[linhas.length - 1].y + lh : y;
}

// Escolhe o maior tamanho de fonte que cabe no espaço.
function montarTexto(ctx, { brincadeira, informacao }, desenhar) {
  const tamanhos = [
    { b: 50, i: 42, lhB: 64, lhI: 56 },
    { b: 46, i: 40, lhB: 58, lhI: 52 },
    { b: 42, i: 38, lhB: 54, lhI: 48 },
    { b: 38, i: 34, lhB: 48, lhI: 44 },
  ];
  for (const t of tamanhos) {
    const yBrincadeira = 748;
    const fimB = bloco(ctx, {
      texto: brincadeira,
      y: yBrincadeira,
      fonte: `italic 600 ${t.b}px "Cormorant Garamond", Georgia, serif`,
      cor: COR_TEXTO,
      lh: t.lhB,
      desenhar: false,
    });
    const yRotuloInfo = fimB + 40;
    const yInfo = yRotuloInfo + 56;
    const fimI = bloco(ctx, {
      texto: informacao,
      y: yInfo,
      fonte: `400 ${t.i}px Nunito, system-ui, sans-serif`,
      cor: COR_TEXTO,
      lh: t.lhI,
      desenhar: false,
    });
    if (fimI <= Y_FIM_TEXTO || t === tamanhos[tamanhos.length - 1]) {
      if (desenhar) {
        ctx.letterSpacing = '4px';
        ctx.font = '700 26px Nunito, system-ui, sans-serif';
        ctx.fillStyle = COR_ROTULO;
        ctx.fillText('A BRINCADEIRA', X, yBrincadeira - 56);
        ctx.fillText('A NOVIDADE', X, yRotuloInfo);
        ctx.letterSpacing = '0px';
        bloco(ctx, {
          texto: brincadeira,
          y: yBrincadeira,
          fonte: `italic 600 ${t.b}px "Cormorant Garamond", Georgia, serif`,
          cor: COR_TEXTO,
          lh: t.lhB,
          desenhar: true,
        });
        bloco(ctx, {
          texto: informacao,
          y: yInfo,
          fonte: `400 ${t.i}px Nunito, system-ui, sans-serif`,
          cor: COR_TEXTO,
          lh: t.lhI,
          desenhar: true,
        });
      }
      return fimI;
    }
  }
  return 0;
}

export async function gerarImagemRecadinho({
  semana,
  objeto,
  comprimento,
  medicao,
  nota,
  brincadeira,
  informacao,
  imagemObjeto,
  fundo,
  aurora,
}) {
  // Garante que as fontes do Google estejam prontas antes de desenhar.
  try {
    await Promise.all([
      document.fonts.load('600 50px "Cormorant Garamond"'),
      document.fonts.load('italic 600 50px "Cormorant Garamond"'),
      document.fonts.load('400 40px Nunito'),
      document.fonts.load('700 26px Nunito'),
    ]);
  } catch {
    // Sem fontes do Google, o navegador usa as fontes de reserva.
  }

  const [imgFundo, imgObjeto, imgAurora] = await Promise.all([
    carregarImagem(fundo),
    carregarImagem(imagemObjeto),
    carregarImagem(aurora),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Base creme e moldura floral ao redor.
  ctx.fillStyle = '#FFF6E7';
  ctx.fillRect(0, 0, W, H);
  desenharFundo(ctx, imgFundo);

  // Painel claro para leitura, dentro da moldura.
  ctx.save();
  caixaArredondada(ctx, 60, 110, 960, 1200, 40);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
  ctx.fill();
  ctx.strokeStyle = '#EADFD6';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Título e semana.
  ctx.fillStyle = COR_TEXTO;
  ctx.font = '600 84px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Recadinho da Aurora', X, 230);

  ctx.font = '700 40px Nunito, system-ui, sans-serif';
  const textoSemana = `Semana ${semana}`;
  const larguraPilula = ctx.measureText(textoSemana).width + 56;
  caixaArredondada(ctx, X, 262, larguraPilula, 64, 32);
  ctx.fillStyle = '#EEE8F6';
  ctx.fill();
  ctx.fillStyle = COR_ROTULO;
  ctx.fillText(textoSemana, X + 28, 306);

  // Objeto da semana, à esquerda, com nome e medida à direita.
  desenharContain(ctx, imgObjeto, X, 350, 300, 260);

  ctx.fillStyle = COR_TEXTO;
  ctx.font = '600 52px "Cormorant Garamond", Georgia, serif';
  quebrar(ctx, objeto, 500).slice(0, 2).forEach((linha, i) => {
    ctx.fillText(linha, 450, 420 + i * 58);
  });

  ctx.font = '400 28px Nunito, system-ui, sans-serif';
  ctx.fillStyle = COR_ROTULO;
  ctx.fillText('Comprimento médio de referência', 450, 520);
  ctx.font = '700 34px Nunito, system-ui, sans-serif';
  ctx.fillStyle = COR_TEXTO;
  ctx.fillText(`${comprimento} cm · ${medicao}`, 450, 562);

  ctx.font = '400 26px Nunito, system-ui, sans-serif';
  ctx.fillStyle = COR_ROTULO;
  ctx.fillText(nota, X, 628);

  // Brincadeira e novidade, com fonte escolhida para caber.
  montarTexto(ctx, { brincadeira, informacao }, true);

  // Aurora apresentadora, no canto inferior direito, dentro do painel.
  desenharContain(ctx, imgAurora, 750, Y_AURORA, 230, 230);

  // Rodapé.
  ctx.fillStyle = COR_ROTULO;
  ctx.font = 'italic 600 42px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Com amor, Aurora 💕', X, 1280);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Não consegui gerar a imagem'))), 'image/png');
  });
}
