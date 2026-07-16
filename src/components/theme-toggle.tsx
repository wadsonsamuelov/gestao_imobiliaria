"use client";

import { useTheme } from "./theme-provider";
import { IconSun, IconMoon } from "./icons";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      title={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-label="Alternar tema"
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}
