import { createClient } from '@supabase/supabase-js';

// Configure no arquivo .env.local (ou nas variáveis do deploy):
// VITE_SUPABASE_URL=https://seu-projeto.supabase.co
// VITE_SUPABASE_ANON_KEY=sua-chave-anon
// Sem essas variáveis, o app funciona no modo local.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se a URL ou a chave estiverem erradas, o app cai no modo local em vez de ficar em branco.
let cliente = null;
try {
  cliente = url && anonKey ? createClient(url.trim(), anonKey.trim()) : null;
} catch (erro) {
  console.error('Supabase não configurado corretamente:', erro);
}
export const supabase = cliente;
export const modoLocal = !supabase;
