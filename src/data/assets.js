// Mapa central de assets. Os caminhos das comparações saem de comparacoes.json,
// e os arquivos ficam em public/colecao/ (imagens) e public/fundos/ (fundos).
import comparacoes from './comparacoes.json';

const BASE = import.meta.env.BASE_URL;

// Arte "Aurora em flores de guache": exibida inteira, sem texto por cima.
export const AURORA_IMG = {
  src: `${BASE}fundos/aurora.webp`,
  alt: 'Aurora, em lettering rosa com flores em tons pastel',
};

// Aurora comandante da casa (arte nova, em public/aurora-policial/).
export const AURORA_POLICIAL = {
  retrato: { src: `${BASE}aurora-policial/retrato.webp`, alt: 'Aurora comandante, de boina caqui com distintivo CC' },
  corpo: { src: `${BASE}aurora-policial/corpo.webp`, alt: 'Aurora comandante de farda caqui, com lupa na mão' },
  comando: { src: `${BASE}aurora-policial/comando.webp`, alt: 'Aurora comandante com rádio, dando uma ordem' },
  celebracao: { src: `${BASE}aurora-policial/celebracao.webp`, alt: 'Aurora comandante com medalha, sorrindo de olhos fechados' },
  missoes: { src: `${BASE}aurora-policial/missoes.webp`, alt: 'Aurora olhando o quadro de missões' },
};

// Aurora espiando com celular lavanda (fundo transparente): apresentadora do recadinho.
export const AURORA_APRESENTADORA = {
  src: `${BASE}fundos/aurora-apresentadora.webp`,
  alt: 'Aurora piscando, segurando um celular lavanda',
};

// Fundos por tela. Cada um aparece só na tela indicada.
export const FUNDOS = {
  principal: `${BASE}fundos/moldura-creme.webp`, // início e acompanhamento semanal
  diario: `${BASE}fundos/diario.webp`,            // registros
  celebracao: `${BASE}fundos/margaridas.webp`,    // marcos do bebê
  memorias: `${BASE}fundos/memorias.webp`,        // capa da seção de fotos
};

export const NOTA_COMPARACAO = 'Comparação aproximada; objetos variam de tamanho';
export const FONTE_MEDIDAS =
  'Referências médias verificadas em 06/11/2026 no guia semanal do NHS. Não representam medições individuais.';
export const AVISOS_COLECAO = comparacoes.avisos;

// Semana (4 a 40) -> item da coleção, com o caminho da imagem.
export const COMPARACOES = Object.fromEntries(
  comparacoes.itens.map((item) => [
    item.semana,
    { ...item, imagem: `${BASE}colecao/${item.arquivo}` },
  ])
);
