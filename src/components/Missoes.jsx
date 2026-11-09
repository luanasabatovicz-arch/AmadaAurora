import { personalizar, formatDate, parseDate, toIso, startOfDay, dataProvavelParto } from '../lib/storage.js';
import { CATEGORIAS_MISSAO, MISSOES } from '../data/missoes.js';
import { patenteAtual, proximaPatente } from '../data/patentes.js';
import { MEDALHAS } from '../data/medalhas.js';
import { IconePatente, IconeMedalha } from './Insignias.jsx';
import { AURORA_POLICIAL } from '../data/assets.js';
import MissaoDoDia from './MissaoDoDia.jsx';

// Aba Missões: missão do dia, todas as missões e o histórico da comandante.
export default function Missoes({ estado, atualizar }) {
  const { nomes } = estado;
  const cumpridas = estado.missoesCumpridas ?? [];
  const vezesFeita = (id) => cumpridas.filter((r) => r.id === id).length;
  const porId = Object.fromEntries(MISSOES.map((m) => [m.id, m]));
  const recentes = [...cumpridas].reverse().slice(0, 8);

  const patente = patenteAtual(cumpridas.length);
  const proxima = proximaPatente(cumpridas.length);
  const progressoPatente = proxima
    ? Math.round(((cumpridas.length - patente.minimo) / (proxima.minimo - patente.minimo)) * 100)
    : 100;
  const medalhas = MEDALHAS.map((m) => ({ ...m, conquistada: m.conquistada(estado) }));

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

      <article className="card carteira">
        <div className="carteira__topo">
          <img src={AURORA_POLICIAL.retrato.src} alt="" aria-hidden="true" />
          <div>
            <p className="eyebrow">Carteira da comandante</p>
            <h2>{nomes.bebe}</h2>
            <p className="pequeno">Código CC-0001 · Previsão de chegada: {formatDate(dataProvavelParto(estado.dum))}</p>
          </div>
        </div>
        <div className="patente">
          <IconePatente nivel={patente.nivel} />
          <div>
            <p className="eyebrow">Patente atual</p>
            <p><strong>{patente.nome}</strong></p>
            {proxima ? (
              <>
                <p className="pequeno">Faltam {proxima.minimo - cumpridas.length} missões para ser {proxima.nome}.</p>
                <div className="progresso" role="img" aria-label={`${cumpridas.length} de ${proxima.minimo} missões`}>
                  <div className="progresso__barra" style={{ width: `${progressoPatente}%` }} />
                </div>
              </>
            ) : (
              <p className="pequeno">Patente máxima. Parabéns, comandante!</p>
            )}
          </div>
        </div>
      </article>

      <article className="card">
        <p className="eyebrow">Medalhas</p>
        <div className="medalhas">
          {medalhas.map((m) => (
            <div key={m.id} className={`medalha ${m.conquistada ? '' : 'medalha--bloqueada'}`}>
              <IconeMedalha tipo={m.id} conquistada={m.conquistada} />
              <strong>{m.nome}</strong>
              <span className="pequeno">{m.descricao}</span>
            </div>
          ))}
        </div>
      </article>

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
