import { useEffect, useState } from 'react';
import { loadState, saveState } from './lib/storage.js';
import { modoLocal } from './lib/supabase.js';
import { FUNDOS } from './data/assets.js';
import Inicio from './components/Inicio.jsx';
import Semanas from './components/Semanas.jsx';
import Registro from './components/Registro.jsx';
import Bebe from './components/Bebe.jsx';
import Recado from './components/Recado.jsx';
import Ajustes from './components/Ajustes.jsx';

const ABAS = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'semanas', rotulo: 'Semanas' },
  { id: 'registro', rotulo: 'Registro' },
  { id: 'recado', rotulo: 'Recado' },
  { id: 'bebe', rotulo: 'Bebê' },
  { id: 'ajustes', rotulo: 'Ajustes' },
];

// Fundo de cada tela. Repete só uma vez, no topo, e continua com a cor-base.
const FUNDO_POR_ABA = {
  inicio: FUNDOS.principal,
  semanas: FUNDOS.principal,
  registro: FUNDOS.diario,
  recado: FUNDOS.principal,
  bebe: FUNDOS.celebracao,
  ajustes: null,
};


export default function App() {
  const [estado, setEstado] = useState(loadState);
  const [aba, setAba] = useState('inicio');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    const ok = saveState(estado);
    setAviso(ok ? '' : 'Não foi possível guardar. O armazenamento do aparelho está cheio. Remova algumas fotos.');
  }, [estado]);

  const atualizar = (mudanca) => setEstado((s) => ({ ...s, ...mudanca }));

  const telas = {
    inicio: <Inicio estado={estado} atualizar={atualizar} />,
    semanas: <Semanas estado={estado} atualizar={atualizar} />,
    registro: <Registro estado={estado} atualizar={atualizar} />,
    recado: <Recado estado={estado} atualizar={atualizar} />,
    bebe: <Bebe estado={estado} atualizar={atualizar} />,
    ajustes: <Ajustes estado={estado} atualizar={atualizar} />,
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
