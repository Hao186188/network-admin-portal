// src/app/(routes)/lectures/components/LectureSkeleton.tsx
// Skeleton loading cho bài giảng

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LectureSkeletonProps {
  viewMode?: "grid" | "list";
  count?: number;
}

export function LectureSkeleton({
  viewMode = "grid",
  count = 1,
}: LectureSkeletonProps) {
  const renderSkeleton = () => {
    if (viewMode === "list") {
      return (
        <Card className="p-4 border-border/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="w-full sm:w-48 h-32 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="border-border/50">
        <Skeleton className="aspect-video w-full rounded-t-lg" />
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border/50">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (count > 1) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            : "space-y-4"
        }
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
}
