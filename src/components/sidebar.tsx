"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconPanel, IconBuilding, IconTenant, IconContract, IconCash, IconWallet,
  IconDocs, IconCamera, IconKey, IconProvider, IconHistory, IconOwner, IconTemplate,
} from "./icons";

const NAV = [
  { label: "Geral", items: [{ href: "/dashboard", name: "Painel", Icon: IconPanel }] },
  {
    label: "Operação",
    items: [
      { href: "/imoveis", name: "Imóveis", Icon: IconBuilding },
      { href: "/proprietarios", name: "Proprietários", Icon: IconOwner },
      { href: "/inquilinos", name: "Inquilinos", Icon: IconTenant },
      { href: "/contratos", name: "Contratos", Icon: IconContract },
      { href: "/modelos-contrato", name: "Modelos de Contrato", Icon: IconTemplate },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/financeiro", name: "Boletos & Juros", Icon: IconCash },
      { href: "/gastos", name: "Controle de Gastos", Icon: IconDocs },
      { href: "/ganhos", name: "Meus Ganhos", Icon: IconWallet },
    ],
  },
  {
    label: "Campo",
    items: [
      { href: "/vistorias", name: "Vistorias", Icon: IconCamera },
      { href: "/chaves", name: "Entrega de Chaves", Icon: IconKey },
      { href: "/prestadores", name: "Prestadores de Serviço", Icon: IconProvider },
    ],
  },
  { label: "Registro", items: [{ href: "/historico", name: "Histórico do Imóvel", Icon: IconHistory }] },
];

export function Sidebar({ open = false, onNavigate }: { open?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar${open ? " open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <svg width="22" height="38" viewBox="0 0 22 38" fill="none" stroke="#D4B45E" strokeWidth="1.1">
            <rect x="2" y="1" width="18" height="3.2" />
            <path d="M4 4.2 L18 4.2 L15.2 8 L6.8 8 Z" />
            <line x1="6.8" y1="8" x2="6.8" y2="29" />
            <line x1="11" y1="8" x2="11" y2="29" />
            <line x1="15.2" y1="8" x2="15.2" y2="29" />
            <rect x="3.2" y="29" width="15.6" height="3" />
            <rect x="1" y="32.4" width="20" height="2.6" />
          </svg>
          <div className="brand-name">CADASTRE</div>
        </div>
        <div className="brand-sub">Administração Imobiliária</div>
        <div className="brand-rule" />
      </div>

      <nav className="nav">
        {NAV.map((section) => (
          <div key={section.label}>
            <div className="nav-group-label">{section.label}</div>
            {section.items.map(({ href, name, Icon }) => (
              <Link key={href} href={href} onClick={onNavigate} className={`nav-item${pathname.startsWith(href) ? " active" : ""}`}>
                <Icon />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#726A54" strokeWidth="1.4">
          <path d="M12 3c-3 2.5-5 3-8 3 0 8 3 12 8 15 5-3 8-7 8-15-3 0-5-.5-8-3Z" />
        </svg>
        <span>Edição I · MMXXVI</span>
      </div>
    </aside>
  );
}
