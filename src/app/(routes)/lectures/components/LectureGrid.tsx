// src/app/(routes)/lectures/components/LectureGrid.tsx
// LECTURE GRID - HOÀN CHỈNH

"use client";

import { Lecture } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { LectureCard } from "./LectureCard";
import { LectureEmptyState } from "./LectureEmptyState";
import { LectureSkeleton } from "./LectureSkeleton";

interface LectureGridProps {
  lectures: Lecture[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  onLike: (id: string) => void;
  likedIds: string[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function LectureGrid({
  lectures,
  isLoading,
  viewMode,
  onLike,
  likedIds,
  onLoadMore,
  hasMore = false,
}: LectureGridProps) {
  if (isLoading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            : "space-y-4"
        }
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <LectureSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (lectures.length === 0) {
    return <LectureEmptyState />;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              : "space-y-4"
          }
        >
          {lectures.map((lecture, index) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              index={index}
              onLike={() => onLike(lecture.id)}
              isLiked={likedIds.includes(lecture.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 rounded-full border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all hover:shadow-lg"
          >
            Tải thêm bài giảng
          </button>
        </div>
      )}

      {lectures.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Hiển thị{" "}
          <span className="font-medium text-foreground">{lectures.length}</span>{" "}
          bài giảng
        </div>
      )}
    </div>
  );
}
