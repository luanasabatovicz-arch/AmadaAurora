import { personalizar, formatDate, parseDate, toIso, startOfDay } from '../lib/storage.js';
import { CATEGORIAS_MISSAO, MISSOES } from '../data/missoes.js';
import { AURORA_POLICIAL } from '../data/assets.js';
import MissaoDoDia from './MissaoDoDia.jsx';

// Aba Missões: missão do dia, todas as missões e o histórico da comandante.
export default function Missoes({ estado, atualizar }) {
  const { nomes } = estado;
  const cumpridas = estado.missoesCumpridas ?? [];
  const vezesFeita = (id) => cumpridas.filter((r) => r.id === id).length;
  const porId = Object.fromEntries(MISSOES.map((m) => [m.id, m]));
  const recentes = [...cumpridas].reverse().slice(0, 8);

  const cumprirMissao = (id) => {
    atualizar({ missoesCumpridas: [...cumpridas, { id, data: toIso(startOfDay()) }] });
  };

  return (
    <section className="pagina">
      <figure className="missoes-capa">
        <img src={AURORA_POLICIAL.missoes.src} alt={AURORA_POLICIAL.missoes.alt} />
      </figure>

      <h1>Missões da comandante</h1>
      <p>Cada missão cumprida conta. Escolham juntos e marquem quando fizerem.</p>

      <MissaoDoDia estado={estado} atualizar={atualizar} />

      <article className="card">
        <p className="eyebrow">Total de missões cumpridas</p>
        <p><strong>{cumpridas.length}</strong></p>
      </article>

      {CATEGORIAS_MISSAO.map((categoria) => (
        <article key={categoria} className="card">
          <p className="eyebrow">{categoria}</p>
          <ul className="lista">
            {MISSOES.filter((m) => m.categoria === categoria).map((m) => (
              <li key={m.id} className="item">
                <div>
                  <div>{personalizar(m.texto, nomes)}</div>
                  {vezesFeita(m.id) > 0 && (
                    <p className="pequeno">Feita {vezesFeita(m.id)} {vezesFeita(m.id) === 1 ? 'vez' : 'vezes'}</p>
                  )}
                </div>
                <button className="link" onClick={() => cumprirMissao(m.id)}>Cumprir</button>
              </li>
            ))}
          </ul>
        </article>
      ))}

      {recentes.length > 0 && (
        <article className="card">
          <p className="eyebrow">Últimas missões</p>
          <ul className="lista">
            {recentes.map((r, i) => (
              <li key={`${r.id}-${r.data}-${i}`} className="item">
                <span>{personalizar(porId[r.id]?.texto ?? r.id, nomes)}</span>
                <span className="pequeno">{formatDate(parseDate(r.data))}</span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
