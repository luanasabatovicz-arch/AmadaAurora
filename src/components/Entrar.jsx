import { useState } from 'react';
import { enviarCodigo, confirmarCodigo, criarFamilia, entrarNaFamilia } from '../lib/sincronia.js';

// Tela de entrada: e-mail + código para cada papai e mamãe, depois criar ou entrar na família.
export default function Entrar({ sessao, aoEntrarNaFamilia }) {
  const [email, setEmail] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [codigoFamilia, setCodigoFamilia] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const tentar = async (acao, mensagemErro) => {
    setErro('');
    setOcupado(true);
    try {
      await acao();
    } catch {
      setErro(mensagemErro);
    } finally {
      setOcupado(false);
    }
  };

  const pedirCodigo = (e) => {
    e.preventDefault();
    tentar(async () => {
      await enviarCodigo(email);
      setCodigoEnviado(true);
    }, 'Não consegui enviar o código. Confira o e-mail e tente de novo.');
  };

  const confirmar = (e) => {
    e.preventDefault();
    tentar(() => confirmarCodigo(email, codigo), 'Código incorreto ou vencido. Peça um novo código.');
  };

  const criar = () =>
    tentar(async () => {
      await criarFamilia();
      await aoEntrarNaFamilia();
    }, 'Não consegui criar a família. Tente de novo.');

  const entrar = (e) => {
    e.preventDefault();
    tentar(async () => {
      await entrarNaFamilia(codigoFamilia);
      await aoEntrarNaFamilia();
    }, 'Código da família não encontrado. Confira com o outro papai ou a outra mamãe.');
  };

  // Sem login: pede o e-mail e depois o código.
  if (!sessao) {
    return (
      <section className="pagina">
        <h1>AmadaAurora</h1>
        <p>Entre com o seu e-mail. Vamos enviar um código de 6 dígitos para confirmar.</p>

        {!codigoEnviado ? (
          <form className="card" onSubmit={pedirCodigo}>
            <label className="campo">
              E-mail
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </label>
            <button className="btn" type="submit" disabled={ocupado}>Enviar código</button>
          </form>
        ) : (
          <form className="card" onSubmit={confirmar}>
            <p className="pequeno">Código enviado para {email}. Confira também a caixa de spam.</p>
            <label className="campo">
              Código
              <input inputMode="numeric" value={codigo} onChange={(e) => setCodigo(e.target.value)} required autoComplete="one-time-code" />
            </label>
            <button className="btn" type="submit" disabled={ocupado}>Entrar</button>
            <button className="link" type="button" onClick={() => setCodigoEnviado(false)}>Usar outro e-mail</button>
          </form>
        )}

        {erro && <p className="pequeno">{erro}</p>}
      </section>
    );
  }

  // Com login, mas sem família: criar a família (primeiro papai ou mamãe) ou entrar com o código.
  return (
    <section className="pagina">
      <h1>Sua família</h1>
      <p>Você entrou como {sessao.user.email}. Agora escolha:</p>

      <article className="card">
        <p className="eyebrow">Primeira vez</p>
        <p className="pequeno">Use esta opção se ainda ninguém criou a família no app.</p>
        <button className="btn" onClick={criar} disabled={ocupado}>Criar a família</button>
      </article>

      <form className="card" onSubmit={entrar}>
        <p className="eyebrow">Já existe família</p>
        <p className="pequeno">Peça o código de 8 letras e números ao outro papai ou à outra mamãe, na tela Ajustes.</p>
        <label className="campo">
          Código da família
          <input value={codigoFamilia} onChange={(e) => setCodigoFamilia(e.target.value)} required />
        </label>
        <button className="btn btn--ghost" type="submit" disabled={ocupado}>Entrar na família</button>
      </form>

      {erro && <p className="pequeno">{erro}</p>}
    </section>
  );
}
