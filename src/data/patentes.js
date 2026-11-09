// Patentes fictícias da comandante, liberadas pelo número de missões cumpridas.
// Não são patentes de nenhuma corporação real.
export const PATENTES = [
  { minimo: 0, nome: 'Cadete', nivel: 1 },
  { minimo: 5, nome: 'Sargento', nivel: 2 },
  { minimo: 15, nome: 'Tenente', nivel: 3 },
  { minimo: 30, nome: 'Capitã', nivel: 4 },
  { minimo: 50, nome: 'Comandante', nivel: 5 },
];

export function patenteAtual(total) {
  return [...PATENTES].reverse().find((p) => total >= p.minimo);
}

export function proximaPatente(total) {
  return PATENTES.find((p) => p.minimo > total) ?? null;
}
