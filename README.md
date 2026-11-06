# AmadaAurora

App de acompanhamento da gravidez e da primeira infância, para a mamãe May e o papai Guto. Os nomes ficam em Ajustes e podem ser trocados a qualquer momento.

## O que tem

- **Início:** arte da Aurora, semana atual, comparação da semana com um objeto, caixinha da semana, devocional do dia e oração para os pais.
- **Semanas:** as 40 semanas, com a comparação e a caixinha de cada uma. Abre na semana atual.
- **Registro:** fotos (barriga, bebê, casal) e exames.
- **Bebê:** caderno de marcos depois do nascimento.
- **Ajustes:** nomes, datas, momentos especiais e backup em arquivo.

## Coleção de comparações semanais

- Dados em `src/data/comparacoes.json` (37 semanas, da semana 4 à 40), com a frase, o objeto, a medida de referência e a fonte.
- Imagens em `public/colecao/imagens/`, ajustadas para 800 px com transparência preservada.
- Imagens exibidas inteiras (`object-fit: contain`). Os objetos não mostram o tamanho real da bebê: são referências médias.
- Até a semana 3 aparece uma mensagem de início. Depois da semana 40 a tela fica neutra.
- Os avisos e a fonte aparecem no rodapé da tela Semanas.

## Fundos e arte da Aurora

- `public/fundos/aurora.webp`: arte "Aurora em flores de guache", na tela Início.
- `public/fundos/moldura-creme.webp`: fundo de Início e Semanas.
- `public/fundos/diario.webp`: fundo de Registro.
- `public/fundos/margaridas.webp`: fundo de Bebê.
- `public/fundos/memorias.webp`: capa da seção de fotos.
- Os caminhos ficam centralizados em `src/data/assets.js`.

## Rodar no computador

```bash
npm install
npm run dev
```

## Rodar no celular

Gere a versão de produção (`npm run build`) e publique a pasta `dist` em um serviço de site estático. Abra o endereço no celular e escolha "Adicionar à tela inicial".

## Modo local e Supabase

Sem configuração, os dados ficam no próprio aparelho. Para ligar ao Supabase (login da mãe e do pai e sincronização):

1. Crie um projeto gratuito em supabase.com.
2. Crie um arquivo `.env.local` na raiz:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

Nunca coloque a chave `service_role` no app.

## Próximos passos

- Login com e-mail para a mãe e o pai.
- Sincronizar os dados e as fotos com o Supabase.
- Conferir os versículos com a Bíblia que o casal usa.
