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
import { AURORA_POLICIAL } from '../data/assets.js';
import { CODIGOS_Q } from '../data/codigosQ.js';
import { ARMADURA, MARCOS_SEMANA } from '../data/armadura.js';
import { IconeCarrinhoViatura } from './Insignias.jsx';
import Comparacao from './Comparacao.jsx';
import MissaoDoDia from './MissaoDoDia.jsx';

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
  const codigoQ = CODIGOS_Q[diaDoAno % CODIGOS_Q.length];
  const pecaArmadura = ARMADURA[diaDoAno % ARMADURA.length];
  const marco = MARCOS_SEMANA.includes(semanaAtual);

  const abrirCaixinha = () => {
    if (!aberta) atualizar({ caixinhasAbertas: [...caixinhasAbertas, semanaAtual] });
  };

  const irParaComparacao = () => {
    document.getElementById('comparacao-semana')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const parto = dataProvavelParto(dum);
  const diasParaParto = Math.round((parto - hoje) / 86400000);

  return (
    <section className="pagina">
      <figure className="aurora aurora--corpo">
        <img src={AURORA_POLICIAL.corpo.src} alt={AURORA_POLICIAL.corpo.alt} />
      </figure>
      <button className="btn btn--ghost" onClick={irParaComparacao}>Ver a semana de hoje</button>

      <header>
        <p className="eyebrow">Semana {idade.semanas} · {idade.dias} dias</p>
        <h1>Olá, {nomes.mae} e {nomes.pai}</h1>
        <p>{nomes.bebe} está crescendo a cada dia.</p>
      </header>

      <article className="card codigo-q">
        <p className="eyebrow">Código Q do dia</p>
        <p><strong>{codigoQ.codigo}</strong> · {codigoQ.significado}</p>
        <p>{personalizar(codigoQ.mensagem, nomes)}</p>
      </article>

      <div className="progresso" role="img" aria-label={`${idade.semanas} de 40 semanas`}>
        <div className="progresso__barra" style={{ width: `${Math.min(100, (idade.semanas / 40) * 100)}%` }} />
      </div>
      <p className="pequeno">
        Data provável do parto: {formatDate(parto)}
        {diasParaParto > 0 ? ` · faltam ${diasParaParto} dias` : ''}
      </p>

      <Comparacao semana={idade.semanas > 40 ? null : idade.semanas} id="comparacao-semana" />

      <article className="card card--semana">
        <span className="chip">Caixinha da semana {semanaAtual}</span>
        {marco && (
          <div className="marco">
            <IconeCarrinhoViatura tamanho={44} />
            <span className="pequeno">Marco da gestação nesta semana</span>
          </div>
        )}
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

      <MissaoDoDia estado={estado} atualizar={atualizar} />

      <article className="card">
        <p className="eyebrow">Armadura de Deus · peça de hoje</p>
        <h2>{pecaArmadura.peca}</h2>
        <p className="pequeno">Leiam {pecaArmadura.referencia} na Bíblia.</p>
        <p>{pecaArmadura.reflexao}</p>
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
