import { useState } from 'react';
import { enviarCodigo, confirmarCodigo, entrarNaFamilia } from '../lib/sincronia.js';

// Tela de entrada: e-mail + código para cada papai e mamãe, depois entrar na família com o código.
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

  // Com login, mas sem família: entrar com o código da família.
  return (
    <section className="pagina">
      <h1>Sua família</h1>
      <p>Você entrou como {sessao.user.email}. Digite o código da família para entrar.</p>

      <form className="card" onSubmit={entrar}>
        <p className="pequeno">O código de 8 letras e números aparece na tela Ajustes, no app do outro papai ou da outra mamãe.</p>
        <label className="campo">
          Código da família
          <input value={codigoFamilia} onChange={(e) => setCodigoFamilia(e.target.value)} required />
        </label>
        <button className="btn" type="submit" disabled={ocupado}>Entrar na família</button>
      </form>

      {erro && <p className="pequeno">{erro}</p>}
    </section>
  );
}
