import { useState } from 'react';
import {
  gestationalAge,
  dataProvavelParto,
  formatDate,
  personalizar,
  startOfDay,
} from '../lib/storage.js';
import { CAIXINHAS } from '../data/caixinhas.js';
import { DEVOCIONAIS, ORACOES_PAIS } from '../data/devocionais.js';
import Fruta from './Fruta.jsx';

export default function Inicio({ estado, atualizar }) {
  const { nomes, dum, caixinhasAbertas } = estado;
  const hoje = startOfDay();
  const idade = gestationalAge(dum, hoje);
  const semanaAtual = Math.min(40, Math.max(1, idade.semanas));
  const caixinha = CAIXINHAS.find((c) => c.semana === semanaAtual);
  const aberta = caixinhasAbertas.includes(semanaAtual);
  const [mostrarOracao, setMostrarOracao] = useState(false);

  const diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
  const devocional = DEVOCIONAIS[diaDoAno % DEVOCIONAIS.length];
  const oracao = ORACOES_PAIS[diaDoAno % ORACOES_PAIS.length];

  const abrirCaixinha = () => {
    if (!aberta) atualizar({ caixinhasAbertas: [...caixinhasAbertas, semanaAtual] });
  };

  const parto = dataProvavelParto(dum);
  const diasParaParto = Math.round((parto - hoje) / 86400000);

  return (
    <section className="pagina">
      <header>
        <p className="eyebrow">Semana {idade.semanas} · {idade.dias} dias</p>
        <h1>Olá, {nomes.mae} e {nomes.pai}</h1>
        <p>{nomes.bebe} está crescendo a cada dia.</p>
      </header>

      <div className="progresso" role="img" aria-label={`${idade.semanas} de 40 semanas`}>
        <div className="progresso__barra" style={{ width: `${Math.min(100, (idade.semanas / 40) * 100)}%` }} />
      </div>
      <p className="pequeno">
        Data provável do parto: {formatDate(parto)}
        {diasParaParto > 0 ? ` · faltam ${diasParaParto} dias` : ''}
      </p>

      <article className="card card--semana">
        <span className="chip">Caixinha da semana {semanaAtual}</span>
        <Fruta semana={semanaAtual} />
        {aberta ? (
          <>
            <h2>{caixinha ? personalizar(caixinha.titulo, nomes) : ''}</h2>
            <p>{caixinha ? personalizar(caixinha.mensagem, nomes) : ''}</p>
          </>
        ) : (
          <>
            <h2>Uma surpresa para hoje</h2>
            <p>Esta caixinha é desta semana. Abra quando quiserem.</p>
            <button className="btn" onClick={abrirCaixinha}>Abrir caixinha</button>
          </>
        )}
      </article>

      <article className="card">
        <p className="eyebrow">Devocional do dia</p>
        <p className="verse">
          {devocional.versiculo}
          <cite>{devocional.referencia}</cite>
        </p>
        <p>{devocional.reflexao}</p>
      </article>

      <article className="card">
        <p className="eyebrow">Oração para os pais</p>
        {mostrarOracao ? (
          <p>{personalizar(oracao, nomes)}</p>
        ) : (
          <button className="btn btn--ghost" onClick={() => setMostrarOracao(true)}>Ler a oração de hoje</button>
        )}
      </article>
    </section>
  );
}
