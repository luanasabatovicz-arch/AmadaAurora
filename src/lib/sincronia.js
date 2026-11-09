import { supabase } from './supabase.js';

// Login por código de e-mail e sincronização da família com o Supabase.
// Só é usado quando o Supabase está configurado (ver supabase.js).

export async function pegarSessao() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Chama callback(sessao) sempre que o login mudar. Devolve a função para parar de ouvir.
export function ouvirSessao(callback) {
  const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => callback(sessao));
  return () => data.subscription.unsubscribe();
}

// Envia um código de 6 dígitos para o e-mail. Cria a conta se ela ainda não existir.
export async function enviarCodigo(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

export async function confirmarCodigo(email, codigo) {
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: codigo.trim(),
    type: 'email',
  });
  if (error) throw error;
}

export async function sair() {
  await supabase.auth.signOut();
}

// Família do usuário logado: { id, codigo, estado, atualizado_em } ou null.
export async function buscarFamilia() {
  const { data, error } = await supabase
    .from('membros')
    .select('familia:familias(id, codigo, estado, atualizado_em)')
    .maybeSingle();
  if (error) throw error;
  return data?.familia ?? null;
}

// Cria uma família nova e deixa o usuário logado como primeiro membro.
export async function criarFamilia() {
  const { error } = await supabase.rpc('criar_familia');
  if (error) throw error;
}

// Entra numa família existente usando o código que o outro papai ou a outra mamãe mostrou.
export async function entrarNaFamilia(codigo) {
  const { error } = await supabase.rpc('entrar_na_familia', { p_codigo: codigo.trim() });
  if (error) throw error;
}

// Grava o estado inteiro da família. Devolve a data gravada no servidor.
export async function salvarEstado(familiaId, estado) {
  const { data, error } = await supabase
    .from('familias')
    .update({ estado, atualizado_em: new Date().toISOString() })
    .eq('id', familiaId)
    .select('atualizado_em')
    .single();
  if (error) throw error;
  return data.atualizado_em;
}
