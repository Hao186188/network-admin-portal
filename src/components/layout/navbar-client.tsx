// src/components/layout/navbar-client.tsx
// Vai trò: Wrapper client cho Navbar

"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "./navbar";

export function NavbarClient() {
  const { data: session, status } = useSession();

  return <Navbar session={session} status={status} />;
}
