import { useState } from 'react';
import { gestationalAge, startOfDay } from '../lib/storage.js';
import { COMPARACOES, NOTA_COMPARACAO, FUNDOS, AURORA_POLICIAL } from '../data/assets.js';
import { INFORMACAO_SEMANAL } from '../data/recadinhos.js';
import { gerarImagemRecadinho } from '../lib/exportarRecadinho.js';

const SEMANA_MIN = 4;
const SEMANA_MAX = 40;
const SEMANAS = Array.from({ length: SEMANA_MAX - SEMANA_MIN + 1 }, (_, i) => SEMANA_MIN + i);

export default function RecadinhoSemanal({ estado }) {
  const atual = gestationalAge(estado.dum, startOfDay()).semanas;
  const semanaInicial = Math.min(SEMANA_MAX, Math.max(SEMANA_MIN, atual));
  const [semana, setSemana] = useState(semanaInicial);
  // Edições dos pais, guardadas por semana. Sem edição, vale o texto original.
  const [edicoes, setEdicoes] = useState({});
  const [status, setStatus] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const item = COMPARACOES[semana];
  const original = {
    brincadeira: item.frase,
    informacao: INFORMACAO_SEMANAL[semana] ?? '',
  };
  const edicao = edicoes[semana] ?? {};
  const brincadeira = edicao.brincadeira ?? original.brincadeira;
  const informacao = edicao.informacao ?? original.informacao;
  const comprimento = item.comprimento_referencia_cm.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

  const editar = (campo, valor) => {
    setEdicoes((e) => ({ ...e, [semana]: { ...edicao, [campo]: valor } }));
    setStatus('');
  };

  const restaurar = () => {
    setEdicoes((e) => {
      const copia = { ...e };
      delete copia[semana];
      return copia;
    });
    setStatus('Texto original restaurado.');
  };

  const trocarSemana = (valor) => {
    setSemana(Number(valor));
    setStatus('');
  };

  const textoCompleto = `Recadinho da Aurora · Semana ${semana}\n\n${brincadeira}\n\n${informacao}\n\n— Com amor, Aurora 💕`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(textoCompleto);
      setStatus('Recadinho copiado. Agora é só colar onde quiser.');
    } catch {
      setStatus('Não consegui copiar. Selecione o texto e copie manualmente.');
    }
  };

  const gerar = () =>
    gerarImagemRecadinho({
      semana,
      objeto: item.objeto,
      comprimento,
      medicao: item.medicao_bebe,
      nota: NOTA_COMPARACAO,
      brincadeira,
      informacao,
      imagemObjeto: item.imagem,
      fundo: FUNDOS.principal,
      aurora: AURORA_POLICIAL.retrato.src,
    });

  const baixarBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recadinho-aurora-semana-${semana}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const baixarImagem = async () => {
    setOcupado(true);
    try {
      baixarBlob(await gerar());
      setStatus('Imagem baixada.');
    } catch {
      setStatus('Não consegui gerar a imagem. Tente de novo.');
    } finally {
      setOcupado(false);
    }
  };

  const compartilhar = async () => {
    setOcupado(true);
    try {
      const blob = await gerar();
      const arquivo = new File([blob], `recadinho-aurora-semana-${semana}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], title: 'Recadinho da Aurora', text: textoCompleto });
        setStatus('Recadinho compartilhado.');
      } else {
        // Aparelho sem compartilhamento de imagem: oferece o download.
        baixarBlob(blob);
        setStatus('Este aparelho não compartilha imagens direto. A imagem foi baixada para você enviar.');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') setStatus('Não consegui compartilhar. Você pode baixar a imagem.');
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="recadinho">
      <div className="campo">
        <label htmlFor="semana-recadinho">Semana</label>
        <select id="semana-recadinho" value={semana} onChange={(e) => trocarSemana(e.target.value)}>
          {SEMANAS.map((s) => <option key={s} value={s}>Semana {s}</option>)}
        </select>
      </div>
      {atual < SEMANA_MIN && (
        <p className="pequeno">A coleção começa na semana 4. Por enquanto, mostramos a semana 4.</p>
      )}
      {atual > SEMANA_MAX && (
        <p className="pequeno">A coleção vai até a semana 40. Mostramos a última semana.</p>
      )}

      {/* Card que aparece na tela. A imagem exportada segue o mesmo conteúdo. */}
      <article className="card recadinho-card" aria-label={`Recadinho da semana ${semana}`}>
        <h2 className="recadinho-card__titulo">Recadinho da Aurora</h2>
        <span className="chip">Semana {semana}</span>

        <div className="recadinho-card__objeto">
          <img src={item.imagem} alt={item.alt} />
          <div>
            <p className="recadinho-card__nome">{item.objeto}</p>
            <p className="pequeno">Comprimento médio de referência</p>
            <p className="recadinho-card__medida">{comprimento} cm · {item.medicao_bebe}</p>
          </div>
        </div>
        <p className="pequeno recadinho-card__nota">{NOTA_COMPARACAO}.</p>

        <p className="eyebrow">A brincadeira</p>
        <p className="recadinho-card__brincadeira">{brincadeira}</p>

        <p className="eyebrow">A novidade</p>
        <p className="recadinho-card__novidade">{informacao}</p>

        <p className="recadinho-card__assinatura">Com amor, Aurora 💕</p>

        <img
          className="recadinho-card__aurora"
          src={AURORA_POLICIAL.retrato.src}
          alt={AURORA_POLICIAL.retrato.alt}
        />
      </article>

      <form className="card" onSubmit={(e) => e.preventDefault()}>
        <p className="eyebrow">Ajuste antes de compartilhar</p>
        <label className="campo">
          A brincadeira
          <textarea rows={3} value={brincadeira} onChange={(e) => editar('brincadeira', e.target.value)} />
        </label>
        <label className="campo">
          A novidade
          <textarea rows={4} value={informacao} onChange={(e) => editar('informacao', e.target.value)} />
        </label>
        {Object.keys(edicoes[semana] ?? {}).length > 0 && (
          <button className="link" type="button" onClick={restaurar}>Voltar ao texto original</button>
        )}
      </form>

      <div className="recadinho__acoes">
        <button className="btn btn--ghost" type="button" onClick={copiar} disabled={ocupado}>
          Copiar recadinho
        </button>
        <button className="btn btn--ghost" type="button" onClick={baixarImagem} disabled={ocupado}>
          Baixar imagem
        </button>
        <button className="btn" type="button" onClick={compartilhar} disabled={ocupado}>
          Compartilhar
        </button>
      </div>
      {status && <p className="pequeno" role="status">{status}</p>}
      <p className="pequeno">
        Informação de desenvolvimento: guia semanal do NHS, consultado em 06/11/2026. Medidas são médias de referência, não medidas da Aurora.
      </p>
    </div>
  );
}
