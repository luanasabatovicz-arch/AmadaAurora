import { COMPARACOES, NOTA_COMPARACAO, FONTE_MEDIDAS } from '../data/assets.js';

// Card de comparação semanal. semana = null ou acima de 40 mostra a tela neutra de espera.
export default function Comparacao({ semana, id }) {
  if (semana == null || semana > 40) {
    return (
      <article className="card comparacao comparacao--espera" id={id}>
        <p className="eyebrow">Em breve</p>
        <p>A coleção de comparações vai até a semana 40. Esta tela segue com as novidades da gestação.</p>
      </article>
    );
  }

  if (semana < 4) {
    return (
      <article className="card comparacao comparacao--inicio" id={id}>
        <p className="eyebrow">Semana {semana}</p>
        <h2>Nossa jornada está começando</h2>
        <p>A comparação com um objeto aparece a partir da semana 4.</p>
      </article>
    );
  }

  const c = COMPARACOES[semana];
  if (!c) return null;

  const cabecaAoBumbum = c.semana <= 19;

  return (
    <article className="card comparacao" id={id}>
      <p className="eyebrow">Semana {c.semana}</p>

      <figure className="comparacao__figura">
        <img src={c.imagem} alt={c.alt} />
      </figure>

      <h2>{c.objeto}</h2>
      <p className="comparacao__frase">{c.frase}</p>

      <dl className="comparacao__medida">
        <dt>Comprimento médio de referência</dt>
        <dd>
          {c.comprimento_referencia_cm.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} cm
          {' · '}
          {c.medicao_bebe}
        </dd>
      </dl>
      <p className="pequeno">
        {cabecaAoBumbum
          ? 'Até a semana 19, a medida vai da cabeça ao bumbum.'
          : 'A partir da semana 20, a medida vai da cabeça aos pés. Não é um salto de crescimento.'}
        {' '}Não é a medida individual da Aurora.
      </p>

      <p className="pequeno comparacao__aviso">
        <strong>{NOTA_COMPARACAO}.</strong> {FONTE_MEDIDAS}
      </p>
      <p className="pequeno">
        <a href={c.fonte} target="_blank" rel="noopener noreferrer">Fonte das medidas: guia semanal do NHS</a>
      </p>
    </article>
  );
}
