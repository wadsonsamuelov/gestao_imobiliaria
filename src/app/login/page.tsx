"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Tela mínima só para provar o fluxo de autenticação.
// Troque o visual quando a interface definitiva estiver pronta —
// a lógica de login abaixo continua a mesma.
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [forgotSent, setForgotSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });

    setLoading(false);
    if (error) {
      setError("Não foi possível enviar o e-mail. Confira o endereço e tente de novo.");
      return;
    }
    setForgotSent(true);
  }

  if (mode === "forgot") {
    return (
      <main style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: 22, marginBottom: 24 }}>Recuperar senha</h1>
        {forgotSent ? (
          <p style={{ fontSize: 13 }}>
            Se esse e-mail estiver cadastrado, um link para criar uma senha nova foi enviado. Confira a caixa de
            entrada (e o spam).
          </p>
        ) : (
          <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="Seu e-mail de login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 10, border: "1px solid #ccc" }}
            />
            {error && <p style={{ color: "crimson", fontSize: 13 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: 10, background: "#111", color: "#fff" }}>
              {loading ? "Enviando…" : "Enviar link de recuperação"}
            </button>
          </form>
        )}
        <button onClick={() => { setMode("login"); setError(null); setForgotSent(false); }} style={{ fontSize: 12, color: "#777", marginTop: 16, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Voltar para o login
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Cadastre</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, border: "1px solid #ccc" }}
        />
        {error && <p style={{ color: "crimson", fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: 10, background: "#111", color: "#fff" }}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <button onClick={() => { setMode("forgot"); setError(null); }} style={{ fontSize: 12, color: "#777", marginTop: 12, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
        Esqueci minha senha
      </button>
      <p style={{ fontSize: 12, color: "#777", marginTop: 16 }}>
        Os 2 primeiros usuários são criados manualmente no painel do Supabase
        (Authentication → Users) — veja o README.
      </p>
    </main>
  );
}
