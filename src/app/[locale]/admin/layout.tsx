// src/app/[locale]/admin/layout.tsx
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminRootLayout({ children, params }: Props) {
  // This layout is intentionally minimal so /admin/login
  // does NOT get the sidebar shell.

  // Keep this to satisfy Next's params typing (even if you don't use locale)
  await params;

  return <>{children}</>;
}
