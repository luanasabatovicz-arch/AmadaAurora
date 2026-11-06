import { useState } from 'react';
import { toIso, formatDate, parseDate } from '../lib/storage.js';
import RecadinhoSemanal from './RecadinhoSemanal.jsx';
import { AURORA_IMG } from '../data/assets.js';
import {
  CAMPOS_RECADO,
  montarLinhasRecado,
  textoParaCompartilhar,
} from '../lib/recado.js';

export default function Recado({ estado, atualizar }) {
  const { nomes, recados } = estado;
  const [data, setData] = useState(toIso(new Date()));
  const [status, setStatus] = useState('');

  const registro = recados[data] || {};
  const linhas = montarLinhasRecado(recados[data], nomes, data);

  const mudar = (campo, valor) => {
    atualizar({ recados: { ...recados, [data]: { ...registro, [campo]: valor } } });
    setStatus('');
  };

  const compartilhar = async () => {
    const texto = textoParaCompartilhar(linhas, data);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Recado da Aurora', text: texto });
        setStatus('Recado enviado.');
        return;
      }
      await navigator.clipboard.writeText(texto);
      setStatus('Recado copiado. Agora é só colar no grupo da família.');
    } catch (err) {
      // Usuário cancelou o compartilhamento ou o navegador bloqueou a cópia.
      if (err?.name !== 'AbortError') setStatus('Não consegui compartilhar. Tente de novo.');
    }
  };

  return (
    <section className="pagina">
      <h1>Recadinho da Aurora</h1>
      <p>Escolha a semana, ajuste o texto se quiser e compartilhe com a família.</p>
      <RecadinhoSemanal estado={estado} />

      <h2 className="secao-titulo">Recado do dia</h2>
      <p>Marque o que aconteceu no dia. A Aurora conta o resto.</p>

      <label className="campo">
        Dia
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
      </label>

      <form className="card" onSubmit={(e) => e.preventDefault()}>
        {CAMPOS_RECADO.map((campo) => (
          <label key={campo.id} className="check">
            <input
              type="checkbox"
              checked={!!registro[campo.id]}
              onChange={(e) => mudar(campo.id, e.target.checked)}
            />
            <span>{campo.rotulo}</span>
          </label>
        ))}

        <label className="campo">
          Recado extra da Aurora
          <input
            value={registro.extra || ''}
            onChange={(e) => mudar('extra', e.target.value)}
            placeholder="Ex.: Papai já mandou fazer minha mini farda!"
          />
        </label>
      </form>

      <article className="card recado">
        <div className="recado__topo">
          <img className="recado__avatar" src={AURORA_IMG.src} alt="" aria-hidden="true" />
          <div>
            <p className="eyebrow">Recado da Aurora</p>
            <p className="pequeno">{formatDate(parseDate(data))}</p>
          </div>
        </div>

        <div className="recado__texto">
          {linhas.map((linha) => <p key={linha}>{linha}</p>)}
        </div>

        <p className="pequeno recado__assinatura">— Aurora</p>

        <button className="btn" onClick={compartilhar}>Compartilhar</button>
        {status && <p className="pequeno" role="status">{status}</p>}
      </article>
    </section>
  );
}
