// Recado da Aurora: a mensagem do dia, montada a partir do que foi registrado.
// A variante muda de um dia para o outro, mas fica igual dentro do mesmo dia.
import { personalizar, formatDate, parseDate } from './storage.js';

// Cada categoria aparece como uma marcação na tela. As frases são escolhidas pelo dia do mês.
export const CAMPOS_RECADO = [
  { id: 'enjoo', rotulo: 'Mamãe enjoou hoje' },
  { id: 'cansaco', rotulo: 'Mamãe cansada' },
  { id: 'quilinho', rotulo: 'Mamãe ganhou um quilinho' },
  { id: 'desejo', rotulo: 'Mamãe com vontade de algo' },
  { id: 'emocao', rotulo: 'Mamãe emocionada' },
  { id: 'papai', rotulo: 'Papai está ansioso' },
  { id: 'consulta', rotulo: 'Dia de consulta ou exame' },
  { id: 'quarto', rotulo: 'Novidade do quarto ou enxoval' },
];

const FRASES = {
  enjoo: [
    'A {mae} enjoou hoje, normal né? Coisa de gravidinha.',
    'Hoje teve enjoo na {mae}. Tudo bem, a gente segura essa até passar!',
    'Enjoo do dia: a {mae} comeu bolachinha de água e sal e mandou um beijo pra mim.',
    'A {mae} passou o dia enjoada. Eu fico quietinha lá dentro, prometo!',
  ],
  cansaco: [
    'A {mae} tá cansada hoje. Sugiro um cochilo, mãe, eu também estou dormindo muito!',
    'Dia de sono pesado na {mae}. Fica aí quietinha que eu faço a ginástica por dentro.',
    'A {mae} pediu travesseiro extra pro {pai}. Papai, já sabe o que fazer!',
  ],
  quilinho: [
    'A {mae} ganhou um quilinho hoje, também carregando essa belezura de bebê!',
    'Mais um quilinho pra {mae}! A culpa é minha, e eu tenho muito orgulho.',
    'Balança, balança... a {mae} subiu um quilinho. Eu sou pesadinha, né?',
    'Um quilinho a mais pra {mae}, e eu já estou treinando pra ganhar peso também, hihi.',
  ],
  desejo: [
    'A {mae} acordou com vontade de comer algo bem específico. Pai, prepara o carrinho!',
    'Hoje a {mae} quis um doce às três da tarde. Doce de mãe é lei aqui em casa.',
    'A {mae} pediu uma comidinha que nem existe no cardápio. O {pai} foi investigar.',
  ],
  emocao: [
    'A {mae} chorou vendo um vídeo de bebê hoje. Mãe, eu sou eu, já tô gostando dessa emoção!',
    'Choro de emoção na {mae} hoje. Eu fico mexendo na barriga pra ela sentir que tô aqui.',
    'A {mae} ficou toda boba olhando as roupinhas. Pode chorar, mãe, eu também me emociono!',
  ],
  papai: [
    'O {pai} tá ansioso, só fala sobre mim! Meu herói!',
    'O {pai} não para de falar de mim. Coruja de carteirinha!',
    'O {pai} já leu três livros sobre bebê hoje. Relaxa, pai, eu sei o caminho!',
    'O {pai} colocou meu nome no celular dele como "Princesa". Ele acha que ninguém vê.',
  ],
  consulta: [
    'Dia de consulta! Eu fiquei quietinha pra escutarem o meu coraçãozinho.',
    'Dia de exame! Fiz pose pro ultrassom, não sei se deu certo, mas tentei.',
    'Consulta feita! A {mae} voltou pra casa com a agenda cheia de novidades sobre mim.',
  ],
  quarto: [
    'Mamãe e papai separaram o cantinho do meu quarto. Já escolhi a cor: rosinha!',
    'Chegou coisinha nova do enxoval! Eu pedi tudo rosa, mas ninguém me escuta.',
    'Papai já mandou fazer minha mini farda!',
  ],
};

// Recados de dias sem nada marcado: a Aurora só mandando um oi.
const SEM_REGISTRO = [
  'Hoje foi um dia tranquilo por aqui. Estou quietinha, crescendo e ouvindo a voz de vocês.',
  'Dia de boa por aqui! Só dei uma esticadinha e voltei a dormir.',
  'Oi, mamãe e papai! Eu sei que vocês estão contando os dias. Eu também!',
  'Sem novidades hoje. Quer dizer, eu estou ficando maiorzinha, mas isso é segredo.',
  'Hoje eu fiquei de bobeira. Acho que vocês podiam cantar uma musiquinha pra mim.',
  'Dia calmo, cheio de carinho. Obrigada por pensarem em mim o tempo todo!',
];

// registro: { <id da categoria>: true, extra } guardado para a data escolhida.
export function montarLinhasRecado(registro, nomes, dataIso) {
  const dia = parseDate(dataIso).getDate();
  const sem = SEM_REGISTRO[dia % SEM_REGISTRO.length];
  if (!registro) return [sem];

  const linhas = [];
  CAMPOS_RECADO.forEach((campo, ordem) => {
    if (!registro[campo.id]) return;
    const frases = FRASES[campo.id];
    linhas.push(personalizar(frases[(dia + ordem) % frases.length], nomes));
  });

  const extra = (registro.extra || '').trim();
  if (extra) linhas.push(extra);

  return linhas.length ? linhas : [sem];
}

export function textoParaCompartilhar(linhas, dataIso) {
  const titulo = `Recado da Aurora · ${formatDate(parseDate(dataIso))}`;
  return `${titulo}\n\n${linhas.join('\n\n')}\n\n— Aurora`;
}
