// Balada da Aurora: músicas criadas para a bebê, tocadas direto no app.
// Os arquivos ficam em public/musicas/ e são servidos pelo próprio site.

// Coletânea "Canções de carinho", com os arquivos em public/musicas/.
const MUSICAS = [
  { arquivo: 'aurora_luz_que_deus_enviou.mp3', titulo: 'A Luz que Deus Enviou' },
  { arquivo: 'aurora_banho_de_carinho.mp3', titulo: 'Banho de Carinho' },
  { arquivo: 'aurora_oracao_de_gratidao.mp3', titulo: 'Oração de Gratidão' },
  { arquivo: 'aurora_nas_maos_do_senhor.mp3', titulo: 'Nas Mãos do Senhor' },
  { arquivo: 'aurora_bencao_de_amor.mp3', titulo: 'Bênção de Amor' },
  { arquivo: 'aurora_deus_cuida_de_nos.mp3', titulo: 'Deus Cuida de Nós' },
  { arquivo: 'aurora_mensagem_de_amor.mp3', titulo: 'Mensagem de Amor' },
  { arquivo: 'aurora_acalanto_instrumental.mp3', titulo: 'Acalanto Instrumental' },
  { arquivo: 'aurora_cancao_de_ninar.mp3', titulo: 'Canção de Ninar' },
  { arquivo: 'aurora_colinho_e_luz.mp3', titulo: 'Colinho e Luz' },
  { arquivo: 'aurora_pequena_comandante.mp3', titulo: 'Pequena Comandante' },
];

export default function Balada({ estado }) {
  const { nomes } = estado;
  const base = import.meta.env.BASE_URL;

  return (
    <section className="pagina">
      <h1>Balada da Aurora</h1>
      <img className="balada__capa" src={`${base}musicas/capa-cancoes.webp`} alt="Capa da coletânea Aurora, Canções de carinho" />
      <p>Canções de carinho feitas para a {nomes.bebe}. Toque em ouvir quando quiser.</p>

      {MUSICAS.length === 0 && (
        <article className="card">
          <p>As músicas da nova coletânea vão aparecer aqui em breve.</p>
        </article>
      )}

      {MUSICAS.map((m) => (
        <article key={m.arquivo} className="card">
          <h2>{m.titulo}</h2>
          <audio
            controls
            preload="none"
            src={`${base}musicas/${m.arquivo}`}
            style={{ width: '100%' }}
          >
            Seu navegador não toca áudio. Tente outro aparelho.
          </audio>
        </article>
      ))}
    </section>
  );
}
