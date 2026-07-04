// src/components/common/grid-pattern.tsx

"use client"

import { cn } from "@/lib/utils"

interface GridPatternProps {
  className?: string
}

export function GridPattern({ className }: GridPatternProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 opacity-30",
        className
      )}
      style={{
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  )
}