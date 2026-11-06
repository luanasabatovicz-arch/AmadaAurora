// Recado da Aurora: a mensagem do dia, montada a partir do que foi registrado.
// A variante muda de um dia para o outro, mas fica igual dentro do mesmo dia.
import { personalizar, formatDate, parseDate } from './storage.js';

export const CAMPOS_RECADO = [
  { id: 'enjoo', rotulo: 'Mamãe enjoou hoje' },
  { id: 'quilinho', rotulo: 'Mamãe ganhou um quilinho' },
  { id: 'papai', rotulo: 'Papai está ansioso' },
];

const FRASES = {
  enjoo: [
    'A {mae} enjoou hoje, normal né? Coisa de gravidinha.',
    'Hoje teve enjoo na {mae}. Tudo bem, a gente segura essa até passar!',
  ],
  quilinho: [
    'A {mae} ganhou um quilinho hoje, também carregando essa belezura de bebê!',
    'Mais um quilinho pra {mae}! A culpa é minha, e eu tenho muito orgulho.',
  ],
  papai: [
    'O {pai} tá ansioso, só fala sobre mim! Meu herói!',
    'O {pai} não para de falar de mim. Coruja de carteirinha!',
  ],
};

const SEM_REGISTRO =
  'Hoje foi um dia tranquilo por aqui. Estou quietinha, crescendo e ouvindo a voz de vocês.';

// registro: { enjoo, quilinho, papai, extra } guardado para a data escolhida.
export function montarLinhasRecado(registro, nomes, dataIso) {
  if (!registro) return [SEM_REGISTRO];
  const dia = parseDate(dataIso).getDate();
  const linhas = [];

  for (const campo of CAMPOS_RECADO) {
    if (!registro[campo.id]) continue;
    const frases = FRASES[campo.id];
    linhas.push(personalizar(frases[dia % frases.length], nomes));
  }

  const extra = (registro.extra || '').trim();
  if (extra) linhas.push(extra);

  return linhas.length ? linhas : [SEM_REGISTRO];
}

export function textoParaCompartilhar(linhas, dataIso) {
  const titulo = `Recado da Aurora · ${formatDate(parseDate(dataIso))}`;
  return `${titulo}\n\n${linhas.join('\n\n')}\n\n— Aurora`;
}
