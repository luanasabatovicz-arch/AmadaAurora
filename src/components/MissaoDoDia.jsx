import { personalizar, startOfDay, toIso } from '../lib/storage.js';
import { missaoDoDia } from '../data/missoes.js';
import { AURORA_POLICIAL } from '../data/assets.js';

// Cartão da missão do dia. Usado na tela Início e na aba Missões.
export default function MissaoDoDia({ estado, atualizar }) {
  const hoje = startOfDay();
  const hojeIso = toIso(hoje);
  const missao = missaoDoDia(hoje);
  const cumpridas = estado.missoesCumpridas ?? [];
  const feitaHoje = cumpridas.some((r) => r.id === missao.id && r.data === hojeIso);
  const imagem = feitaHoje ? AURORA_POLICIAL.celebracao : AURORA_POLICIAL.comando;

  const cumprir = () => {
    atualizar({ missoesCumpridas: [...cumpridas, { id: missao.id, data: hojeIso }] });
  };

  return (
    <article className="card missao">
      <p className="eyebrow">Missão de hoje</p>
      <div className="missao__corpo">
        <img src={imagem.src} alt={imagem.alt} />
        <div>
          <p><strong>{personalizar(missao.texto, estado.nomes)}</strong></p>
          {feitaHoje ? (
            <p className="pequeno">Missão cumprida! Ótimo trabalho, comandante.</p>
          ) : (
            <button className="btn" onClick={cumprir}>Missão cumprida</button>
          )}
        </div>
      </div>
    </article>
  );
}
