import { useState } from 'react';
import { imagemParaDataUrl, uid, toIso, formatDate, parseDate } from '../lib/storage.js';
import { FUNDOS } from '../data/assets.js';

const TIPOS_FOTO = [
  { id: 'barriga', rotulo: 'Barriga' },
  { id: 'bebe', rotulo: 'Bebê' },
  { id: 'casal', rotulo: 'Casal' },
  { id: 'outra', rotulo: 'Outra' },
];

export default function Registro({ estado, atualizar }) {
  const [aba, setAba] = useState('fotos');
  return (
    <section className="pagina">
      <h1>Registro</h1>
      <div className="abas">
        <button className={aba === 'fotos' ? 'aba aba--ativa' : 'aba'} onClick={() => setAba('fotos')}>Fotos</button>
        <button className={aba === 'exames' ? 'aba aba--ativa' : 'aba'} onClick={() => setAba('exames')}>Exames</button>
      </div>
      {aba === 'fotos' ? <Fotos estado={estado} atualizar={atualizar} /> : <Exames estado={estado} atualizar={atualizar} />}
    </section>
  );
}

function Fotos({ estado, atualizar }) {
  const [tipo, setTipo] = useState('barriga');
  const [data, setData] = useState(toIso(new Date()));
  const [nota, setNota] = useState('');
  const [erro, setErro] = useState('');

  const adicionar = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    try {
      const src = await imagemParaDataUrl(arquivo);
      atualizar({ fotos: [{ id: uid(), tipo, data, nota, src }, ...estado.fotos] });
      setNota('');
      setErro('');
    } catch {
      setErro('Não consegui abrir essa imagem. Tente outra.');
    }
    e.target.value = '';
  };

  const remover = (id) => atualizar({ fotos: estado.fotos.filter((f) => f.id !== id) });

  return (
    <>
      <figure className="capa-memorias">
        <img src={FUNDOS.memorias} alt="Moldura floral com espaço para as memórias da família" />
      </figure>

      <article className="card">
        <label className="campo">
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS_FOTO.map((t) => <option key={t.id} value={t.id}>{t.rotulo}</option>)}
          </select>
        </label>
        <label className="campo">
          Data
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </label>
        <label className="campo">
          Anotação
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ex.: 20 semanas" />
        </label>
        <label className="btn">
          Adicionar foto
          <input type="file" accept="image/*" onChange={adicionar} hidden />
        </label>
        {erro && <p className="erro">{erro}</p>}
      </article>

      <div className="galeria">
        {estado.fotos.length === 0 && <p>Nenhuma foto ainda.</p>}
        {estado.fotos.map((f) => (
          <figure key={f.id} className="foto">
            <img src={f.src} alt={`${TIPOS_FOTO.find((t) => t.id === f.tipo)?.rotulo ?? ''} ${f.nota}`} />
            <figcaption>
              <strong>{TIPOS_FOTO.find((t) => t.id === f.tipo)?.rotulo}</strong> · {formatDate(parseDate(f.data))}
              {f.nota && <span> · {f.nota}</span>}
            </figcaption>
            <button className="link" onClick={() => remover(f.id)}>Remover</button>
          </figure>
        ))}
      </div>
    </>
  );
}

function Exames({ estado, atualizar }) {
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState(toIso(new Date()));
  const [nota, setNota] = useState('');
  const [erro, setErro] = useState('');

  const adicionar = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    atualizar({ exames: [{ id: uid(), titulo, data, nota }, ...estado.exames] });
    setTitulo('');
    setNota('');
    setErro('');
  };

  const remover = (id) => atualizar({ exames: estado.exames.filter((x) => x.id !== id) });

  return (
    <>
      <form className="card" onSubmit={adicionar}>
        <label className="campo">
          Exame
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Hemograma" required />
        </label>
        <label className="campo">
          Data
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </label>
        <label className="campo">
          Resultado e observações
          <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={3} />
        </label>
        <button className="btn" type="submit">Salvar exame</button>
        {erro && <p className="erro">{erro}</p>}
      </form>

      <ul className="lista">
        {estado.exames.length === 0 && <li>Nenhum exame ainda.</li>}
        {estado.exames.map((x) => (
          <li key={x.id} className="item">
            <div>
              <strong>{x.titulo}</strong> · {formatDate(parseDate(x.data))}
              {x.nota && <p className="pequeno">{x.nota}</p>}
            </div>
            <button className="link" onClick={() => remover(x.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </>
  );
}
