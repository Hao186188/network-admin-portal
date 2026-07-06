// src/app/(dashboard)/layout.tsx
// Vai trò: Layout cho Dashboard - KHÔNG CÓ SIDEBAR

"use client";

import { NavbarClient } from "@/components/layout/navbar-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <NavbarClient />
      <main className="pt-16 md:pt-20">{children}</main>
    </div>
  );
}
