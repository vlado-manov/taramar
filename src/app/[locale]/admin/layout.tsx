// src/app/[locale]/admin/layout.tsx
import type { ReactNode } from "react";

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This layout is intentionally minimal so /admin/login
  // does NOT get the sidebar shell.
  return <>{children}</>;
}
