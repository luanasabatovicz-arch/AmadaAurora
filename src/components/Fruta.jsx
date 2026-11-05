// Ilustrações simples de frutas e legumes para comparar o tamanho da bebê.
// Desenhadas em SVG, sem fotos de terceiros.

const NOMES = {
  papoula: 'Semente de papoula',
  framboesa: 'Framboesa',
  limao: 'Limão',
  abacate: 'Abacate',
  banana: 'Banana',
  milho: 'Espiga de milho',
  berinjela: 'Berinjela',
  abobora: 'Abóbora',
  melao: 'Melão',
};

// Semana em que a comparação aparece (tamanhos aproximados).
export const FRUTA_POR_SEMANA = {
  4: 'papoula',
  8: 'framboesa',
  12: 'limao',
  16: 'abacate',
  20: 'banana',
  24: 'milho',
  28: 'berinjela',
  32: 'abobora',
  36: 'melao',
};

function Desenho({ nome }) {
  switch (nome) {
    case 'papoula':
      return (
        <>
          <circle cx="60" cy="60" r="22" fill="#6e5a73" />
          <circle cx="52" cy="52" r="5" fill="#9b8aa3" />
        </>
      );
    case 'framboesa':
      return (
        <>
          {[[46, 50], [66, 50], [56, 40], [76, 64], [36, 64], [56, 64], [46, 78], [66, 78], [56, 88]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="9" fill="#c2185b" />
          ))}
          <path d="M52 30 Q60 22 68 30" stroke="#5f8f4e" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'limao':
      return (
        <>
          <ellipse cx="60" cy="62" rx="40" ry="30" fill="#f4d35e" />
          <ellipse cx="22" cy="62" rx="6" ry="5" fill="#e9bf3f" />
          <ellipse cx="98" cy="62" rx="6" ry="5" fill="#e9bf3f" />
          <path d="M60 32 Q72 18 84 26 Q72 36 60 32Z" fill="#5f8f4e" />
        </>
      );
    case 'abacate':
      return (
        <>
          <path d="M60 14 C78 14 86 44 84 64 C82 88 74 106 60 106 C46 106 38 88 36 64 C34 44 42 14 60 14Z" fill="#5d7f3a" />
          <path d="M60 28 C72 28 76 50 74 66 C72 84 67 96 60 96 C53 96 48 84 46 66 C44 50 48 28 60 28Z" fill="#e8d28a" />
          <circle cx="60" cy="74" r="13" fill="#8a5a2b" />
        </>
      );
    case 'banana':
      return (
        <>
          <path d="M20 40 Q30 96 98 88 Q82 96 26 62 Q18 52 20 40Z" fill="#f4d35e" />
          <path d="M22 42 Q30 88 92 88" stroke="#c9a63a" strokeWidth="2" fill="none" />
          <rect x="14" y="34" width="8" height="10" rx="3" fill="#6b5b3e" />
        </>
      );
    case 'milho':
      return (
        <>
          <path d="M60 14 C46 14 40 40 40 62 C40 88 48 106 60 106 C72 106 80 88 80 62 C80 40 74 14 60 14Z" fill="#f2c94c" />
          {Array.from({ length: 4 }).flatMap((_, r) =>
            Array.from({ length: 3 }).map((__, c) => (
              <circle key={`${r}-${c}`} cx={50 + c * 10} cy={36 + r * 16} r="3.5" fill="#e0a92e" />
            ))
          )}
          <path d="M40 70 C30 80 34 104 46 108 C42 96 42 84 40 70Z" fill="#7aa35a" />
          <path d="M80 70 C90 80 86 104 74 108 C78 96 78 84 80 70Z" fill="#7aa35a" />
        </>
      );
    case 'berinjela':
      return (
        <>
          <path d="M66 22 C84 40 82 84 62 102 C54 108 44 104 46 94 C40 70 44 36 66 22Z" fill="#5b3a6e" />
          <path d="M50 24 Q60 14 70 22 Q62 28 50 24Z" fill="#5f8f4e" />
          <path d="M58 22 L66 12" stroke="#5f8f4e" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'abobora':
      return (
        <>
          <ellipse cx="60" cy="66" rx="42" ry="32" fill="#e8892b" />
          <ellipse cx="42" cy="66" rx="12" ry="30" fill="#d57421" />
          <ellipse cx="78" cy="66" rx="12" ry="30" fill="#d57421" />
          <rect x="54" y="26" width="12" height="14" rx="3" fill="#5f8f4e" />
        </>
      );
    case 'melao':
      return (
        <>
          <circle cx="60" cy="62" r="40" fill="#d9e6a0" />
          <path d="M60 22 Q50 62 60 102" stroke="#b7cd6b" strokeWidth="5" fill="none" />
          <path d="M34 42 Q60 62 34 82" stroke="#b7cd6b" strokeWidth="5" fill="none" />
          <path d="M86 42 Q60 62 86 82" stroke="#b7cd6b" strokeWidth="5" fill="none" />
        </>
      );
    default:
      return null;
  }
}

export default function Fruta({ semana }) {
  const nome = FRUTA_POR_SEMANA[semana];
  if (!nome) return null;
  return (
    <figure className="fruta">
      <svg viewBox="0 0 120 120" role="img" aria-label={`${NOMES[nome]}, tamanho aproximado da bebê`}>
        <Desenho nome={nome} />
      </svg>
      <figcaption>Tamanho aproximado: {NOMES[nome].toLowerCase()}</figcaption>
    </figure>
  );
}
