// Missões da comandante Aurora, agrupadas por tipo.
// Textos com {mae}, {pai} e {bebe}, trocados pelos nomes do casal.
// A missão do dia sai desta lista em ordem, uma por dia.
export const CATEGORIAS_MISSAO = ['Fé', 'Carinho com a mamãe', 'Carinho com o papai', 'Preparação para a bebê', 'Família', 'Descanso', 'Surpresas'];

export const MISSOES = [
  // Fé
  { id: 'oracao-noite', categoria: 'Fé', texto: 'Fazer uma oração curta com a família antes de dormir.' },
  { id: 'versiculo', categoria: 'Fé', texto: 'Ler juntos um versículo e conversar sobre ele.' },
  { id: 'agradecer', categoria: 'Fé', texto: 'Agradecer a Deus, em voz alta, por três coisas de hoje.' },
  { id: 'orar-bebe', categoria: 'Fé', texto: 'Orar pela {bebe} e pela saúde da {mae}.' },
  { id: 'louvor', categoria: 'Fé', texto: 'Ouvir ou cantar um louvor juntos.' },

  // Carinho com a mamãe
  { id: 'abraco-mae', categoria: 'Carinho com a mamãe', texto: 'Dar um abraço apertado na {mae}.' },
  { id: 'massagem', categoria: 'Carinho com a mamãe', texto: 'Oferecer uma massagem nos pés ou nas costas da {mae}.' },
  { id: 'elogio', categoria: 'Carinho com a mamãe', texto: 'Dizer para a {mae} uma coisa que você admira nela.' },
  { id: 'cafe', categoria: 'Carinho com a mamãe', texto: 'Preparar um chá ou um café para a {mae} e levar até ela.' },
  { id: 'silencio', categoria: 'Carinho com a mamãe', texto: 'Deixar a {mae} descansar uma hora, sem pedir nada.' },

  // Carinho com o papai
  { id: 'contar-novidade', categoria: 'Carinho com o papai', texto: 'Contar ao {pai} a novidade mais bonita do dia.' },
  { id: 'pedir-conselho', categoria: 'Carinho com o papai', texto: 'Pedir um conselho ao {pai} sobre algo da casa.' },
  { id: 'incentivo', categoria: 'Carinho com o papai', texto: 'Mandar uma mensagem de incentivo para o {pai} no meio do dia.' },
  { id: 'jogo', categoria: 'Carinho com o papai', texto: 'Jogar um jogo de cartas ou de tabuleiro com o {pai}.' },

  // Preparação para a bebê
  { id: 'cantinho', categoria: 'Preparação para a bebê', texto: 'Arrumar um cantinho do quarto da {bebe}.' },
  { id: 'musica-ninar', categoria: 'Preparação para a bebê', texto: 'Escolher uma música de ninar para a {bebe}.' },
  { id: 'roupinha', categoria: 'Preparação para a bebê', texto: 'Separar uma roupinha para o enxoval.' },
  { id: 'nome', categoria: 'Preparação para a bebê', texto: 'Conversar sobre um nome que vocês gostam para a {bebe}.' },
  { id: 'carta', categoria: 'Preparação para a bebê', texto: 'Escrever uma frase de carinho para a {bebe} e guardar.' },
  { id: 'mala', categoria: 'Preparação para a bebê', texto: 'Conferir um item da mala da maternidade.' },
  { id: 'livro', categoria: 'Preparação para a bebê', texto: 'Ler uma página de um livro infantil em voz alta para a {bebe}.' },

  // Família
  { id: 'mensagem-familia', categoria: 'Família', texto: 'Mandar uma mensagem carinhosa para alguém da família.' },
  { id: 'ligar-parente', categoria: 'Família', texto: 'Ligar para um parente que mora longe e contar a novidade.' },
  { id: 'foto', categoria: 'Família', texto: 'Tirar uma foto boba do casal e guardar no Registro.' },
  { id: 'passeio', categoria: 'Família', texto: 'Fazer uma caminhada leve juntos, sem pressa.' },
  { id: 'almoco', categoria: 'Família', texto: 'Fazer uma refeição juntos, sem celular na mesa.' },

  // Descanso
  { id: 'banho', categoria: 'Descanso', texto: 'Preparar um banho quentinho para a {mae}.' },
  { id: 'dormir-cedo', categoria: 'Descanso', texto: 'Ir para a cama uma hora mais cedo que o normal.' },
  { id: 'agua', categoria: 'Descanso', texto: 'Lembrar de beber água ao longo do dia.' },
  { id: 'lanche', categoria: 'Descanso', texto: 'Preparar um lanche gostoso para a {mae}.' },

  // Surpresas
  { id: 'bilhete', categoria: 'Surpresas', texto: 'Deixar um bilhete escondido com uma palavra de amor.' },
  { id: 'danca', categoria: 'Surpresas', texto: 'Dançar uma música juntos na sala.' },
  { id: 'sobremesa', categoria: 'Surpresas', texto: 'Surpreender com uma sobremesa de que a família gosta.' },
  { id: 'desenho', categoria: 'Surpresas', texto: 'Desenhar a {bebe} como comandante e mostrar para os pais.' },
];

// Dia do ano de uma data: usado para escolher a missão do dia.
export function missaoDoDia(data) {
  const inicio = new Date(data.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((data - inicio) / 86400000);
  return MISSOES[diaDoAno % MISSOES.length];
}
