// Balada da Aurora: músicas criadas para a bebê, tocadas direto no app.
// Os arquivos ficam em public/musicas/ e são servidos pelo próprio site.

const MUSICAS = [
  { arquivo: 'a-luz-do-agora.mp3', titulo: 'A Luz do Agora' },
  { arquivo: 'dorme-aurora.mp3', titulo: 'Dorme, Aurora' },
  { arquivo: 'dorme-em-paz-aurora.mp3', titulo: 'Dorme em paz, Aurora' },
  { arquivo: 'manha-de-aurora.mp3', titulo: 'Manhã de Aurora' },
];

export default function Balada({ estado }) {
  const { nomes } = estado;
  const base = import.meta.env.BASE_URL;

  return (
    <section className="pagina">
      <h1>Balada da Aurora</h1>
      <p>Músicas feitas com carinho para a {nomes.bebe}. Toque em ouvir quando quiser.</p>

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
