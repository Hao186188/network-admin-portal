// src/app/(dashboard)/layout.tsx
// Vai trò: Layout cho các trang Dashboard

"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <Sidebar />
      <div className="lg:ml-[280px]">
        <Navbar />
        <main className="pt-16 md:pt-20 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
