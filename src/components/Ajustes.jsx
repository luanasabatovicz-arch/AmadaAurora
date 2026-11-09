import { useState } from 'react';
import { uid, toIso, formatDate, parseDate } from '../lib/storage.js';

export default function Ajustes({ estado, atualizar, conta }) {
  const { nomes, dum, descoberta, nascimento, momentos } = estado;
  const [momento, setMomento] = useState('');
  const [dataMomento, setDataMomento] = useState(toIso(new Date()));

  const mudarNome = (chave, valor) => atualizar({ nomes: { ...nomes, [chave]: valor } });

  const adicionarMomento = (e) => {
    e.preventDefault();
    if (!momento.trim()) return;
    atualizar({ momentos: [...momentos, { id: uid(), titulo: momento, data: dataMomento }] });
    setMomento('');
  };

  const removerMomento = (id) => atualizar({ momentos: momentos.filter((m) => m.id !== id) });

  const exportar = () => {
    const blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amadaaurora-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="pagina">
      <h1>Ajustes</h1>

      <article className="card">
        <p className="eyebrow">Nomes</p>
        <label className="campo">Mãe<input value={nomes.mae} onChange={(e) => mudarNome('mae', e.target.value)} /></label>
        <label className="campo">Pai<input value={nomes.pai} onChange={(e) => mudarNome('pai', e.target.value)} /></label>
        <label className="campo">Bebê<input value={nomes.bebe} onChange={(e) => mudarNome('bebe', e.target.value)} /></label>
      </article>

      <article className="card">
        <p className="eyebrow">Datas</p>
        <label className="campo">
          Data da última menstruação
          <input type="date" value={dum} onChange={(e) => atualizar({ dum: e.target.value })} />
        </label>
        <p className="pequeno">Use a data que o ultrassom confirmar. As semanas e a data do parto mudam junto.</p>
        <label className="campo">
          Data em que descobriram a gravidez
          <input type="date" value={descoberta} onChange={(e) => atualizar({ descoberta: e.target.value })} />
        </label>
        <label className="campo">
          Data de nascimento da bebê
          <input type="date" value={nascimento} onChange={(e) => atualizar({ nascimento: e.target.value })} />
        </label>
      </article>

      <article className="card">
        <p className="eyebrow">Momentos especiais</p>
        <form onSubmit={adicionarMomento}>
          <label className="campo">
            Momento
            <input value={momento} onChange={(e) => setMomento(e.target.value)} placeholder="Ex.: Chá de bebê" />
          </label>
          <label className="campo">
            Data
            <input type="date" value={dataMomento} onChange={(e) => setDataMomento(e.target.value)} />
          </label>
          <button className="btn btn--ghost" type="submit">Adicionar</button>
        </form>
        <ul className="lista">
          {momentos.map((m) => (
            <li key={m.id} className="item">
              <div><strong>{m.titulo}</strong> · {formatDate(parseDate(m.data))}</div>
              <button className="link" onClick={() => removerMomento(m.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </article>

      {conta && (
        <article className="card">
          <p className="eyebrow">Conta e família</p>
          <p className="pequeno">
            Os dados são iguais para os dois papais. Para o outro entrar, ele usa o próprio e-mail e digita este código na tela inicial:
          </p>
          <p><strong>{conta.codigo}</strong></p>
          <button className="btn btn--ghost" onClick={conta.sair}>Sair desta conta</button>
        </article>
      )}

      <article className="card">
        <p className="eyebrow">Backup</p>
        <p className="pequeno">Guarde uma cópia dos dados em arquivo, para não perder as fotos e os registros.</p>
        <button className="btn btn--ghost" onClick={exportar}>Exportar dados</button>
      </article>
    </section>
  );
}
