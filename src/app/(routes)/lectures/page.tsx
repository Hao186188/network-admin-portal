// src/app/(routes)/lectures/page.tsx
// FIXED - SỬ DỤNG TYPE TỪ FILE CHUNG

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { useLectures } from "@/hooks/useLectures";
import { Lecture, LectureFilter } from "@/types";
import { motion } from "framer-motion";
import { FolderOpen, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FolderExplorer } from "./components/FolderExplorer";
import { LectureFilters } from "./components/LectureFilters";
import { LectureHero } from "./components/LectureHero";
import { LectureScrollReveal } from "./components/LectureScrollReveal";
import { LectureSkeleton } from "./components/LectureSkeleton";
import { LectureStats } from "./components/LectureStats";
import { CreateLectureModal } from "./CreateLectureModal";

export default function LecturesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<LectureFilter>({
    search: "",
    type: "all",
    tags: [],
    subject: "",
    status: "approved",
    sortBy: "newest",
  });
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFolderExplorer, setShowFolderExplorer] = useState(true);

  const {
    lectures,
    isLoading,
    isFetching,
    error,
    refresh,
    getStats,
    getUniqueTags,
    filterLectures,
    toggleLike,
  } = useLectures();

  const isAdmin = session?.user?.role === "ADMIN";
  const isTeacher = session?.user?.role === "TEACHER";
  const canView = isAdmin || isTeacher;

  // ✅ Chuyển hướng nếu không có quyền
  if (status === "authenticated" && !canView) {
    router.push("/dashboard");
    return null;
  }

  // ✅ Sử dụng type từ file chung
  const typedLectures = lectures as Lecture[];

  const filteredLectures = filterLectures(typedLectures, filter);
  const stats = getStats(typedLectures);
  const uniqueTags = getUniqueTags(typedLectures);

  const handleLike = useCallback(
    (id: string) => {
      toggleLike(id);
      setLikedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    },
    [toggleLike],
  );

  const loading = isLoading || isFetching;

  const handleCreateSuccess = () => {
    refresh();
  };

  const handleLectureClick = (lecture: Lecture) => {
    router.push(`/lectures/${lecture.id}`);
  };

  // Loading state
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
        </div>
        <Footer />
      </>
    );
  }

  // Not authorized
  if (!canView) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Không có quyền truy cập</h2>
            <p className="text-muted-foreground">
              Trang này chỉ dành cho Giảng viên và Quản trị viên
            </p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Về trang chủ
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <LectureHero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <LectureStats stats={stats} loading={loading} />

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowFolderExplorer(!showFolderExplorer)}
              >
                <FolderOpen className="w-4 h-4" />
                {showFolderExplorer ? "Ẩn thư mục" : "Hiển thị thư mục"}
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all hover:scale-105 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Đăng bài giảng
              </Button>
            </div>
          </div>

          {/* Folder Explorer */}
          {showFolderExplorer && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <FolderExplorer
                onLectureClick={handleLectureClick}
                onRefresh={refresh}
                onNavigate={(folderId) => {
                  console.log("📂 Navigated to:", folderId);
                }}
              />
            </motion.div>
          )}

          {/* Filters */}
          <LectureFilters
            filter={filter}
            setFilter={setFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            availableTags={uniqueTags}
            totalResults={filteredLectures.length}
          />

          {/* Content */}
          <div id="lecture-grid" className="mt-8">
            {error ? (
              <div className="text-center py-12">
                <p className="text-destructive">
                  {error.message || "Có lỗi xảy ra khi tải dữ liệu"}
                </p>
                <button
                  onClick={() => refresh()}
                  className="mt-4 text-primary hover:underline"
                >
                  Thử lại
                </button>
              </div>
            ) : loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    : "space-y-4"
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <LectureSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : filteredLectures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Không tìm thấy bài giảng nào phù hợp
                </p>
              </div>
            ) : (
              <LectureScrollReveal
                lectures={filteredLectures}
                onLike={handleLike}
                likedIds={likedIds}
                viewMode={viewMode}
              />
            )}
          </div>

          {!loading && filteredLectures.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-8"
            >
              <p className="text-sm text-muted-foreground">
                Hiển thị{" "}
                <span className="font-medium text-foreground">
                  {filteredLectures.length}
                </span>{" "}
                /{" "}
                <span className="font-medium text-foreground">
                  {typedLectures.length}
                </span>{" "}
                bài giảng
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <CreateLectureModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <Footer />
    </>
  );
}
