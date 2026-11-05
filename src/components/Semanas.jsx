import { useState } from 'react';
import { gestationalAge, personalizar, startOfDay } from '../lib/storage.js';
import { CAIXINHAS } from '../data/caixinhas.js';

export default function Semanas({ estado, atualizar }) {
  const { nomes, dum, caixinhasAbertas } = estado;
  const atual = gestationalAge(dum, startOfDay()).semanas;
  const [selecionada, setSelecionada] = useState(null);

  const abrir = (semana) => {
    if (!caixinhasAbertas.includes(semana)) {
      atualizar({ caixinhasAbertas: [...caixinhasAbertas, semana] });
    }
  };

  const item = selecionada ? CAIXINHAS.find((c) => c.semana === selecionada) : null;

  return (
    <section className="pagina">
      <h1>Semanas</h1>
      <p>Toque em uma semana para ver a caixinha. Semanas já passadas ficam marcadas.</p>

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
              ].join(' ')}
              onClick={() => setSelecionada(c.semana)}
              aria-label={`Semana ${c.semana}${aberta ? ', caixinha aberta' : ''}`}
            >
              {c.semana}
            </button>
          );
        })}
      </div>

      {item && (
        <article className="card">
          <p className="eyebrow">Semana {item.semana}</p>
          <h2>{personalizar(item.titulo, nomes)}</h2>
          {caixinhasAbertas.includes(item.semana) ? (
            <p>{personalizar(item.mensagem, nomes)}</p>
          ) : (
            <button className="btn" onClick={() => abrir(item.semana)}>Abrir caixinha</button>
          )}
        </article>
      )}
    </section>
  );
}
