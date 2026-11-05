# AmadaAurora

App de acompanhamento da gravidez e da primeira infância, para a Mayara e o Guto.

## O que tem

- **Início:** semana atual, caixinha da semana, devocional do dia e oração para os pais.
- **Semanas:** as 40 semanas com as caixinhas.
- **Registro:** fotos (barriga, bebê, casal) e exames.
- **Bebê:** caderno de marcos depois do nascimento.
- **Ajustes:** nomes, datas, momentos especiais e backup em arquivo.

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
