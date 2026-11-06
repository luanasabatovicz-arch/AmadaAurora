import { useState } from 'react';
import { gestationalAge, personalizar, startOfDay } from '../lib/storage.js';
import { CAIXINHAS } from '../data/caixinhas.js';
import { AVISOS_COLECAO } from '../data/assets.js';
import Comparacao from './Comparacao.jsx';

export default function Semanas({ estado, atualizar }) {
  const { nomes, dum, caixinhasAbertas } = estado;
  const atual = gestationalAge(dum, startOfDay()).semanas;
  // Abre na semana atual; depois da semana 40, a tela começa neutra.
  const [selecionada, setSelecionada] = useState(atual > 40 ? null : Math.max(1, atual));

  const abrir = (semana) => {
    if (!caixinhasAbertas.includes(semana)) {
      atualizar({ caixinhasAbertas: [...caixinhasAbertas, semana] });
    }
  };

  const item = selecionada ? CAIXINHAS.find((c) => c.semana === selecionada) : null;

  return (
    <section className="pagina">
      <h1>Semanas</h1>
      <p>Toque em uma semana para ver a comparação e a caixinha. Semanas já passadas ficam marcadas.</p>

      <div className="grade-semanas">
        {CAIXINHAS.map((c) => {
          const passou = c.semana < atual;
          const estaSemana = c.semana === atual;
          const aberta = caixinhasAbertas.includes(c.semana);
          return (
            <button
              key={c.semana}
              className={[
                'semana',
                passou ? 'semana--passou' : '',
                estaSemana ? 'semana--atual' : '',
                aberta ? 'semana--aberta' : '',
                selecionada === c.semana ? 'semana--selecionada' : '',
              ].join(' ')}
              onClick={() => setSelecionada(c.semana)}
              aria-label={`Semana ${c.semana}${aberta ? ', caixinha aberta' : ''}`}
              aria-pressed={selecionada === c.semana}
            >
              {c.semana}
            </button>
          );
        })}
      </div>

      <Comparacao semana={selecionada} />

      {item && (
        <article className="card">
          <p className="eyebrow">Caixinha da semana {item.semana}</p>
          <h2>{personalizar(item.titulo, nomes)}</h2>
          {caixinhasAbertas.includes(item.semana) ? (
            <p>{personalizar(item.mensagem, nomes)}</p>
          ) : (
            <button className="btn" onClick={() => abrir(item.semana)}>Abrir caixinha</button>
          )}
        </article>
      )}

      <article className="card card--avisos">
        <p className="eyebrow">Sobre as comparações</p>
        <ul className="avisos">
          {AVISOS_COLECAO.map((aviso) => <li key={aviso}>{aviso}</li>)}
        </ul>
      </article>
    </section>
  );
}
