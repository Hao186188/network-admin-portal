// src/components/ui/skeleton.tsx
// Vai trò: Loading skeleton cho các component

"use client";

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };

