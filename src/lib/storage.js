// Estado do app. Por enquanto fica no aparelho (localStorage).
// Quando o Supabase estiver configurado, a sincronização entra aqui.

const KEY = 'amadaaurora:v1';

export const DEFAULT_STATE = {
  nomes: { mae: 'mamãe May', pai: 'papai Guto', bebe: 'Aurora' },
  // Estimativa a partir de 16 semanas e 3 dias em 05/11/2026. Ajustar nas Configurações.
  dum: '2026-07-13',
  descoberta: '',
  nascimento: '',
  fotos: [],
  exames: [],
  caixinhasAbertas: [],
  // Recados por data (ISO): { enjoo, quilinho, papai, extra }
  recados: {},
  momentos: [],
  marcos: [],
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    // Quota cheia (muitas fotos). A tela avisa o usuário.
    return false;
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(date, n) {
  const r = new Date(date);
  r.setDate(r.getDate() + n);
  return r;
}

export function toIso(d) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function formatDate(d) {
  return d.toLocaleDateString('pt-BR');
}

// Idade gestacional pela DUM: semanas completas e dias restantes.
export function gestationalAge(dum, today = new Date()) {
  const days = Math.round((startOfDay(today) - parseDate(dum)) / 86400000);
  return { semanas: Math.floor(days / 7), dias: days % 7, total: days };
}

// Data provável do parto: DUM + 280 dias.
export function dataProvavelParto(dum) {
  return addDays(parseDate(dum), 280);
}

// Troca os nomes nos textos: {mae}, {pai}, {bebe}.
export function personalizar(texto, nomes) {
  return texto
    .replaceAll('{mae}', nomes.mae)
    .replaceAll('{pai}', nomes.pai)
    .replaceAll('{bebe}', nomes.bebe);
}

// Reduz a imagem antes de guardar, para caber no armazenamento do aparelho.
export function imagemParaDataUrl(file, maxLado = 1024, qualidade = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', qualidade));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
