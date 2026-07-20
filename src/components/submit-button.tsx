"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText = "Salvando…",
  variant = "brass",
  style,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "brass" | "secondary" | "";
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn ${variant}`.trim()} disabled={pending} style={{ opacity: pending ? 0.6 : 1, ...style }}>
      {pending ? pendingText : children}
    </button>
  );
}
