// src/app/(routes)/about/layout.tsx
// ABOUT LAYOUT - VIDEO PROVIDER

"use client";

import { VideoProvider } from "@/components/ui/VideoManager";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VideoProvider>{children}</VideoProvider>;
}
