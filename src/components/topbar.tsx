"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { logout } from "@/lib/actions";

const TITLES: Record<string, string> = {
  "/dashboard": "Painel",
  "/imoveis": "Imóveis",
  "/inquilinos": "Inquilinos",
  "/contratos": "Contratos",
  "/financeiro": "Boletos & Juros",
  "/gastos": "Controle de Gastos",
  "/ganhos": "Meus Ganhos",
  "/vistorias": "Vistorias",
  "/chaves": "Entrega de Chaves",
  "/prestadores": "Prestadores de Serviço",
  "/historico": "Histórico do Imóvel",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  const base = "/" + pathname.split("/")[1];
  return TITLES[base] ?? "Cadastre";
}

export function Topbar({ userName, userRole }: { userName: string; userRole: string }) {
  const pathname = usePathname();
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-title">{titleFor(pathname)}</div>
        <div className="topbar-right">
          <div className="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input placeholder="Buscar imóvel, inquilino…" />
          </div>
          <ThemeToggle />
          <div className="user-chip">
            <div className="user-text">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRole}</div>
            </div>
            <div className="avatar">{initials}</div>
          </div>
          <form action={logout}>
            <button type="submit" className="btn secondary" style={{ padding: "8px 12px", fontSize: 10 }}>
              Sair
            </button>
          </form>
        </div>
      </div>
      <div className="frieze" />
    </div>
  );
}
