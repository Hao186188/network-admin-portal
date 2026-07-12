// src/app/(routes)/lectures/components/LectureEmptyState.tsx
// Trạng thái khi không có bài giảng

"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Plus, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface LectureEmptyStateProps {
  onRefresh?: () => void;
  hasFilters?: boolean;
}

export function LectureEmptyState({
  onRefresh,
  hasFilters = false,
}: LectureEmptyStateProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="relative">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          {hasFilters ? (
            <Search className="w-12 h-12 text-muted-foreground/50" />
          ) : (
            <BookOpen className="w-12 h-12 text-muted-foreground/50" />
          )}
        </div>
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full border-2 border-primary/5 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {hasFilters ? "Không tìm thấy bài giảng" : "Chưa có bài giảng nào"}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {hasFilters
          ? "Không có bài giảng nào phù hợp với tiêu chí tìm kiếm của bạn. Thử thay đổi từ khóa hoặc bộ lọc."
          : "Hiện tại chưa có bài giảng nào. Quay lại sau để xem nội dung mới nhất."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasFilters && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.push("/lectures")}
          >
            <RefreshCw className="w-4 h-4" />
            Xem tất cả
          </Button>
        )}
        {onRefresh && (
          <Button variant="outline" className="gap-2" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
            Tải lại
          </Button>
        )}
        <Button
          className="gap-2 bg-gradient-to-r from-primary to-secondary"
          onClick={() => router.push("/")}
        >
          <Plus className="w-4 h-4" />
          Về trang chủ
        </Button>
      </div>
    </motion.div>
  );
}
