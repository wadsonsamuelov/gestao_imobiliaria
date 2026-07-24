"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Para onde o link de "esqueci minha senha" leva. O Supabase processa o token
// de recuperação que vem no final da URL (depois do #) automaticamente, assim
// que esta página carrega no navegador — por isso o formulário só aparece
// depois de confirmarmos que existe uma sessão válida.
export default function AtualizarSenhaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Não foi possível atualizar a senha. Peça um novo link de recuperação e tente de novo.");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <main style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Nova senha</h1>

      {!ready && (
        <p style={{ fontSize: 13, color: "#777" }}>
          Verificando o link de recuperação… Se esta mensagem não sumir em alguns segundos, o link pode ter
          expirado — peça um novo em "Esqueci minha senha" na tela de login.
        </p>
      )}

      {ready && !success && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 10, border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            style={{ padding: 10, border: "1px solid #ccc" }}
          />
          {error && <p style={{ color: "crimson", fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: 10, background: "#111", color: "#fff" }}>
            {loading ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      )}

      {success && <p style={{ fontSize: 13, color: "green" }}>Senha atualizada! Entrando…</p>}
    </main>
  );
}
