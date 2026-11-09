// Desenhos fictícios da comandante: insígnia de patente, medalhas e carrinho-viatura.
// Não reproduzem emblemas de nenhuma corporação real.

function estrela(cx, cy, r) {
  const pontos = [];
  for (let i = 0; i < 10; i++) {
    const raio = i % 2 === 0 ? r : r * 0.45;
    const angulo = (Math.PI / 5) * i - Math.PI / 2;
    pontos.push(`${(cx + raio * Math.cos(angulo)).toFixed(1)},${(cy + raio * Math.sin(angulo)).toFixed(1)}`);
  }
  return pontos.join(' ');
}

// Escudo com uma estrela a mais por nível de patente.
export function IconePatente({ nivel = 1, tamanho = 56 }) {
  const espaco = 16;
  const inicio = 50 - ((nivel - 1) * espaco) / 2;
  return (
    <svg viewBox="0 0 100 100" width={tamanho} height={tamanho} role="img" aria-label={`Insígnia de patente, nível ${nivel}`}>
      <path d="M50 6 L88 20 V50 C88 74 70 88 50 95 C30 88 12 74 12 50 V20 Z" fill="#C8B9DD" stroke="#5E4B7E" strokeWidth="3" />
      {Array.from({ length: nivel }, (_, i) => (
        <polygon key={i} points={estrela(inicio + i * espaco, 50, nivel <= 2 ? 13 : 7)} fill="#F4D782" stroke="#8A6A12" strokeWidth="1" />
      ))}
    </svg>
  );
}

const SIMBOLOS = {
  primeira: <polygon points={estrela(50, 50, 22)} />,
  dedicacao: <path d="M50 72 C30 58 24 48 24 40 C24 30 34 24 42 30 C46 33 49 36 50 40 C51 36 54 33 58 30 C66 24 76 30 76 40 C76 48 70 58 50 72 Z" />,
  bravura: <polygon points={estrela(50, 50, 24)} />,
};

// Medalha com fita. Fica acinzentada enquanto não é conquistada.
export function IconeMedalha({ tipo, conquistada = true, tamanho = 64 }) {
  const cor = conquistada ? '#F4D782' : '#E6DED6';
  const borda = conquistada ? '#8A6A12' : '#B9AEA4';
  const simbolo = conquistada ? '#8A6A12' : '#B9AEA4';
  return (
    <svg viewBox="0 0 100 110" width={tamanho} height={tamanho * 1.1} role="img" aria-label={conquistada ? 'Medalha conquistada' : 'Medalha ainda não conquistada'}>
      <path d="M36 80 L26 104 L42 98 L48 108 L54 84 Z" fill={conquistada ? '#F4B6C7' : '#E6DED6'} />
      <path d="M64 80 L74 104 L58 98 L52 108 L46 84 Z" fill={conquistada ? '#C8B9DD' : '#E6DED6'} />
      <circle cx="50" cy="50" r="38" fill={cor} stroke={borda} strokeWidth="3" />
      <g fill={simbolo}>{SIMBOLOS[tipo] ?? null}</g>
    </svg>
  );
}

// Carrinho de bebê com luz de viatura, para marcar os marcos da gestação.
export function IconeCarrinhoViatura({ tamanho = 56 }) {
  return (
    <svg viewBox="0 0 100 100" width={tamanho} height={tamanho} role="img" aria-label="Marco da gestação">
      <rect x="36" y="22" width="28" height="10" rx="4" fill="#F4B6C7" stroke="#9E4663" strokeWidth="2" />
      <circle cx="50" cy="20" r="5" fill="#F4D782" stroke="#8A6A12" strokeWidth="1.5" />
      <rect x="12" y="40" width="76" height="28" rx="12" fill="#C4AD82" stroke="#6B5A3E" strokeWidth="2" />
      <rect x="22" y="46" width="22" height="10" rx="4" fill="#FFF6E7" />
      <rect x="56" y="46" width="22" height="10" rx="4" fill="#FFF6E7" />
      <circle cx="30" cy="74" r="9" fill="#6B5A3E" />
      <circle cx="70" cy="74" r="9" fill="#6B5A3E" />
      <circle cx="30" cy="74" r="3" fill="#F4D782" />
      <circle cx="70" cy="74" r="3" fill="#F4D782" />
    </svg>
  );
}
