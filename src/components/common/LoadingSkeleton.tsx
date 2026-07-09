// src/components/common/LoadingSkeleton.tsx
// Vai trò: Skeleton loading cho các trang

"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  type?: "card" | "list" | "profile" | "chat" | "forum";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  type = "card",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="bg-card rounded-2xl border border-border/50 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded mt-1" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
            </div>
            <div className="mt-4 pt-3 border-t border-border flex gap-2">
              <div className="h-8 w-16 bg-muted rounded-full" />
              <div className="h-8 w-16 bg-muted rounded-full" />
            </div>
          </div>
        );

      case "forum":
        return (
          <div className="bg-card rounded-2xl border border-border/50 p-4 animate-pulse">
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
            </div>
            <div className="mt-3 flex gap-1">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
            <div className="mt-4 pt-3 border-t border-border flex gap-2">
              <div className="h-8 w-16 bg-muted rounded-full" />
              <div className="h-8 w-16 bg-muted rounded-full" />
            </div>
          </div>
        );

      case "chat":
        return (
          <div className="flex h-full animate-pulse">
            <div className="w-80 border-r border-border p-4">
              <div className="h-6 w-24 bg-muted rounded mb-4" />
              <div className="h-9 w-full bg-muted rounded" />
              <div className="mt-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted rounded mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
              <div className="flex-1 p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`w-48 h-12 bg-muted rounded-2xl ${i % 2 === 0 ? "bg-primary/20" : ""}`}
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <div className="h-10 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={cn("animate-pulse bg-muted rounded", className)}>
            <div className="h-32" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
