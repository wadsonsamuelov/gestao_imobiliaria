"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({
  userName,
  userRole,
  children,
}: {
  userName: string;
  userRole: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      {open && <div className="mobile-backdrop" onClick={() => setOpen(false)} />}
      <div className="main">
        <Topbar userName={userName} userRole={userRole} onMenuClick={() => setOpen((o) => !o)} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
