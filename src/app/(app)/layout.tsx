import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user!.id)
    .single();

  const roleLabel = profile?.role === "admin" ? "Administrador" : "Gestor";

  return (
    <ThemeProvider>
      <AppShell userName={profile?.full_name ?? user?.email ?? "Usuário"} userRole={roleLabel}>
        {children}
      </AppShell>
    </ThemeProvider>
  );
}
