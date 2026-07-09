// src/app/(routes)/assignments/components/AssignmentSkeleton.tsx
// Vai trò: Skeleton loading với Shimmer Effect

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignmentSkeletonProps {
  viewMode?: "grid" | "list";
}

export function AssignmentSkeleton({
  viewMode = "grid",
}: AssignmentSkeletonProps) {
  if (viewMode === "list") {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-pulse h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4 flex-1" />

        <div className="mb-4">
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        <div className="space-y-1.5 mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex gap-2 mt-auto pt-4 border-t border-border">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
