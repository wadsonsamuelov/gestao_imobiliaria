import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

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
      <div className="shell">
        <Sidebar />
        <div className="main">
          <Topbar userName={profile?.full_name ?? user?.email ?? "Usuário"} userRole={roleLabel} />
          <div className="content">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
