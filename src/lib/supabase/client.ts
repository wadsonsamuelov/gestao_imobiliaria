import { createBrowserClient } from "@supabase/ssr";

// Cliente para uso em Client Components ("use client").
// Lê a organização/dados sempre respeitando as políticas de RLS do usuário logado.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
