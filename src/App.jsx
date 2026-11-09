import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_STATE, loadState, saveState } from './lib/storage.js';
import { modoLocal } from './lib/supabase.js';
import { pegarSessao, ouvirSessao, buscarFamilia, salvarEstado, sair } from './lib/sincronia.js';
import { FUNDOS } from './data/assets.js';
import Inicio from './components/Inicio.jsx';
import Semanas from './components/Semanas.jsx';
import Registro from './components/Registro.jsx';
import Bebe from './components/Bebe.jsx';
import Recado from './components/Recado.jsx';
import Balada from './components/Balada.jsx';
import Ajustes from './components/Ajustes.jsx';
import Entrar from './components/Entrar.jsx';

const ABAS = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'semanas', rotulo: 'Semanas' },
  { id: 'registro', rotulo: 'Registro' },
  { id: 'recado', rotulo: 'Recadinho' },
  { id: 'balada', rotulo: 'Balada' },
  { id: 'bebe', rotulo: 'Bebê' },
  { id: 'ajustes', rotulo: 'Ajustes' },
];

// Fundo de cada tela. Repete só uma vez, no topo, e continua com a cor-base.
const FUNDO_POR_ABA = {
  inicio: FUNDOS.principal,
  semanas: FUNDOS.principal,
  registro: FUNDOS.diario,
  recado: FUNDOS.principal,
  balada: FUNDOS.memorias,
  bebe: FUNDOS.celebracao,
  ajustes: null,
};

const MSG_OFFLINE = 'Não consegui sincronizar agora. Os dados ficam neste aparelho e serão enviados depois.';

export default function App() {
  const [estado, setEstado] = useState(loadState);
  const [aba, setAba] = useState('inicio');
  const [aviso, setAviso] = useState('');
  // Login (sessao) e família. undefined = carregando; null = sem login ou sem família; 'erro' = falha de conexão.
  const [sessao, setSessao] = useState(modoLocal ? null : undefined);
  const [familia, setFamilia] = useState(modoLocal ? null : undefined);
  // Mudança feita neste aparelho que ainda não foi enviada ao servidor.
  const alteracaoPendente = useRef(false);

  // Guarda sempre no aparelho, mesmo com o Supabase ligado (cache e modo offline).
  useEffect(() => {
    const ok = saveState(estado);
    setAviso(ok ? '' : 'Não foi possível guardar. O armazenamento do aparelho está cheio. Remova algumas fotos.');
  }, [estado]);

  // Acompanha o login.
  useEffect(() => {
    if (modoLocal) return undefined;
    pegarSessao().then(setSessao).catch(() => setSessao(null));
    return ouvirSessao(setSessao);
  }, []);

  // Traz a família do servidor. Se ainda não há dados lá, envia os deste aparelho.
  const carregarFamilia = useCallback(async () => {
    try {
      const f = await buscarFamilia();
      if (!f) {
        setFamilia(null);
        return;
      }
      if (Object.keys(f.estado ?? {}).length === 0) {
        alteracaoPendente.current = true; // a primeira gravação sobe com o estado atual
      } else if (!alteracaoPendente.current) {
        setEstado({ ...DEFAULT_STATE, ...f.estado });
      }
      setFamilia({ id: f.id, codigo: f.codigo });
    } catch {
      setAviso(MSG_OFFLINE);
      setFamilia((atual) => (atual === undefined ? 'erro' : atual));
    }
  }, []);

  const usuarioId = sessao?.user?.id;
  const carregandoLogin = sessao === undefined;
  useEffect(() => {
    if (modoLocal || carregandoLogin) return;
    if (usuarioId) carregarFamilia();
    else setFamilia(null);
  }, [usuarioId, carregandoLogin, carregarFamilia]);

  // Envia as mudanças ao servidor, com uma pequena pausa para juntar as edições seguidas.
  useEffect(() => {
    if (modoLocal || !familia || familia === 'erro' || !alteracaoPendente.current) return undefined;
    const id = familia.id;
    const t = setTimeout(async () => {
      try {
        await salvarEstado(id, estado);
        alteracaoPendente.current = false;
        setAviso('');
      } catch {
        setAviso(MSG_OFFLINE);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [estado, familia]);

  // Ao voltar para o app, busca o que o outro papai ou a outra mamãe mudou.
  useEffect(() => {
    if (modoLocal || !familia || familia === 'erro') return undefined;
    const aoVoltar = () => {
      if (document.visibilityState === 'visible' && !alteracaoPendente.current) carregarFamilia();
    };
    document.addEventListener('visibilitychange', aoVoltar);
    return () => document.removeEventListener('visibilitychange', aoVoltar);
  }, [familia, carregarFamilia]);

  const atualizar = (mudanca) => {
    alteracaoPendente.current = true;
    setEstado((s) => ({ ...s, ...mudanca }));
  };

  const sairDaConta = async () => {
    await sair();
  };

  if (!modoLocal) {
    if (familia === 'erro') {
      return (
        <div className="shell">
          <main className="tela">
            <section className="pagina">
              <h1>AmadaAurora</h1>
              <p>Não foi possível conectar agora. Verifique a internet e tente de novo.</p>
              <button className="btn" onClick={() => { setFamilia(undefined); carregarFamilia(); }}>
                Tentar de novo
              </button>
            </section>
          </main>
        </div>
      );
    }
    if (sessao === undefined || familia === undefined) {
      return <div className="shell"><main className="tela"><p className="pagina">Carregando…</p></main></div>;
    }
    if (!sessao || familia === null) {
      return (
        <div className="shell">
          <main className="tela">
            <Entrar sessao={sessao} aoEntrarNaFamilia={carregarFamilia} />
          </main>
        </div>
      );
    }
  }

  const conta = modoLocal ? null : { codigo: familia.codigo, sair: sairDaConta };

  const telas = {
    inicio: <Inicio estado={estado} atualizar={atualizar} />,
    semanas: <Semanas estado={estado} atualizar={atualizar} />,
    registro: <Registro estado={estado} atualizar={atualizar} />,
    recado: <Recado estado={estado} atualizar={atualizar} />,
    balada: <Balada estado={estado} />,
    bebe: <Bebe estado={estado} atualizar={atualizar} />,
    ajustes: <Ajustes estado={estado} atualizar={atualizar} conta={conta} />,
  };

  return (
    <div className="shell">
      {modoLocal && (
        <p className="banner">Modo local: os dados ficam neste aparelho.</p>
      )}
      {aviso && <p className="banner banner--alerta">{aviso}</p>}

      <main className="tela">
        {FUNDO_POR_ABA[aba] && (
          <img className="tela__fundo" src={FUNDO_POR_ABA[aba]} alt="" aria-hidden="true" />
        )}
        {telas[aba]}
      </main>

      <nav className="barra" aria-label="Navegação principal">
        {ABAS.map((a) => (
          <button
            key={a.id}
            className={`barra__item ${aba === a.id ? 'barra__item--ativa' : ''}`}
            onClick={() => setAba(a.id)}
            aria-current={aba === a.id ? 'page' : undefined}
          >
            {a.rotulo}
          </button>
        ))}
      </nav>
    </div>
  );
}
