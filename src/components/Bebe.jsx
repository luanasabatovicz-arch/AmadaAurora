import { useState } from 'react';
import { uid, toIso, formatDate, parseDate, startOfDay } from '../lib/storage.js';

export default function Bebe({ estado, atualizar }) {
  const { nomes, nascimento, marcos } = estado;
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState(toIso(new Date()));
  const [nota, setNota] = useState('');

  const idadeMeses = nascimento
    ? Math.max(0, Math.floor((startOfDay() - parseDate(nascimento)) / (30.44 * 86400000)))
    : null;

  const adicionar = (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    atualizar({ marcos: [{ id: uid(), titulo, data, nota }, ...marcos] });
    setTitulo('');
    setNota('');
  };

  const remover = (id) => atualizar({ marcos: marcos.filter((m) => m.id !== id) });

  return (
    <section className="pagina">
      <h1>Bebê</h1>
      <p>
        {nascimento
          ? `${nomes.bebe} tem ${idadeMeses} ${idadeMeses === 1 ? 'mês' : 'meses'}.`
          : `Quando ${nomes.bebe} nascer, informe a data nas Configurações para ver a idade dela aqui.`}
      </p>

      <form className="card" onSubmit={adicionar}>
        <p className="eyebrow">Caderno da {nomes.bebe}</p>
        <label className="campo">
          Marco ou momento
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Primeiro sorriso" required />
        </label>
        <label className="campo">
          Data
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </label>
        <label className="campo">
          Anotação
          <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={3} />
        </label>
        <button className="btn" type="submit">Registrar</button>
      </form>

      <ul className="lista">
        {marcos.length === 0 && <li>Nenhum registro ainda.</li>}
        {marcos.map((m) => (
          <li key={m.id} className="item">
            <div>
              <strong>{m.titulo}</strong> · {formatDate(parseDate(m.data))}
              {m.nota && <p className="pequeno">{m.nota}</p>}
            </div>
            <button className="link" onClick={() => remover(m.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
