// src/components/forum/ForumPostSkeleton.tsx
// Vai trò: Skeleton loading cho bài viết

"use client";

import { cn } from "@/lib/utils";

interface ForumPostSkeletonProps {
  className?: string;
}

export function ForumPostSkeleton({ className }: ForumPostSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border/50 p-4 animate-pulse",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-5 w-16 bg-muted rounded-full" />
          </div>
          <div className="h-3 w-24 bg-muted rounded mt-1" />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-6 w-3/4 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>

      <div className="mt-3 flex gap-1">
        <div className="h-6 w-16 bg-muted rounded-full" />
        <div className="h-6 w-16 bg-muted rounded-full" />
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
        <div className="h-8 w-16 bg-muted rounded-full" />
        <div className="h-8 w-16 bg-muted rounded-full" />
        <div className="h-8 w-16 bg-muted rounded-full ml-auto" />
      </div>
    </div>
  );
}
