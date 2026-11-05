import { createClient } from '@supabase/supabase-js';

// Configure no arquivo .env.local (ou nas variáveis do deploy):
// VITE_SUPABASE_URL=https://seu-projeto.supabase.co
// VITE_SUPABASE_ANON_KEY=sua-chave-anon
// Sem essas variáveis, o app funciona no modo local.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const modoLocal = !supabase;
