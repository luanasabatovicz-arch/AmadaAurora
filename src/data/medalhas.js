// Medalhas da comandante. Cada medalha é liberada quando a condição é verdadeira.
export const MEDALHAS = [
  {
    id: 'primeira',
    nome: 'Primeira missão',
    descricao: 'Cumprir a primeira missão.',
    conquistada: (estado) => (estado.missoesCumpridas ?? []).length >= 1,
  },
  {
    id: 'dedicacao',
    nome: 'Dedicação',
    descricao: 'Cumprir 10 missões.',
    conquistada: (estado) => (estado.missoesCumpridas ?? []).length >= 10,
  },
  {
    id: 'bravura',
    nome: 'Bravura',
    descricao: 'Abrir 5 caixinhas da gestação.',
    conquistada: (estado) => (estado.caixinhasAbertas ?? []).length >= 5,
  },
];
