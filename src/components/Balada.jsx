// Balada da Aurora: músicas criadas para a bebê, tocadas direto no app.
// Os arquivos ficam em public/musicas/ e são servidos pelo próprio site.

// Coletânea nova: adicione aqui cada música {arquivo, titulo}, com o arquivo em public/musicas/.
const MUSICAS = [];

export default function Balada({ estado }) {
  const { nomes } = estado;
  const base = import.meta.env.BASE_URL;

  return (
    <section className="pagina">
      <h1>Balada da Aurora</h1>
      <p>Músicas feitas com carinho para a {nomes.bebe}. Toque em ouvir quando quiser.</p>

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
