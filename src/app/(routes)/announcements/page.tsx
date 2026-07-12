// src/app/(routes)/announcements/page.tsx
// HOÀN CHỈNH - FIX ALL ERRORS

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import { motion } from "framer-motion";
import { Bell, Plus, Search, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementCard } from "./components/AnnouncementCard";
import { AnnouncementFilters } from "./components/AnnouncementFilters";
import { AnnouncementHero } from "./components/AnnouncementHero";
import { AnnouncementSkeleton } from "./components/AnnouncementSkeleton";
import { AnnouncementStats } from "./components/AnnouncementStats";
import { AnnouncementTicker } from "./components/AnnouncementTicker";
import { CreateAnnouncementModal } from "./components/CreateAnnouncementModal";

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { announcements, isLoading, isFetching, error, refresh } =
    useAnnouncements();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const loading = isLoading || isFetching;

  // ✅ Debug log
  useEffect(() => {
    logger.log("📊 Announcements state:", {
      loading,
      count: announcements.length,
      error: error?.message || null,
      total: announcements.length,
    });
  }, [loading, announcements, error]);

  // Lọc announcements
  const filteredAnnouncements = announcements.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sắp xếp: ghim lên đầu, sau đó theo thời gian
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Tính toán thống kê
  const totalViews = announcements.reduce(
    (sum: number, a: any) => sum + (a.views || 0),
    0,
  );
  const totalLikes = announcements.reduce(
    (sum: number, a: any) => sum + (a.likes || 0),
    0,
  );
  const totalComments = announcements.reduce(
    (sum: number, a: any) => sum + (a.comments || 0),
    0,
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fid: string) => fid !== id)
        : [...prev, id],
    );
    toast.success(favorites.includes(id) ? "Đã bỏ lưu" : "Đã lưu thông báo");
  };

  const handleCreateSuccess = () => {
    refresh();
    toast.success("Đã cập nhật danh sách thông báo");
  };

  // ✅ Handle refresh với đúng type
  const handleRefresh = () => {
    refresh();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* Ticker */}
          <AnnouncementTicker announcements={announcements} />

          {/* Hero */}
          <AnnouncementHero
            total={announcements.length}
            onSearch={(query) => setSearchQuery(query)}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />

          {/* Stats */}
          <AnnouncementStats
            total={announcements.length}
            views={totalViews}
            likes={totalLikes}
            comments={totalComments}
            loading={loading}
          />

          {/* Filters */}
          <AnnouncementFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Tìm kiếm thông báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Announcements List */}
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                : "space-y-4"
            }
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <AnnouncementSkeleton key={i} />
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-400">
                  {error.message || "Có lỗi xảy ra"}
                </p>
                <Button className="mt-4" onClick={handleRefresh}>
                  Thử lại
                </Button>
              </div>
            ) : sortedAnnouncements.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  {searchQuery || selectedCategory !== "Tất cả"
                    ? "Không tìm thấy thông báo"
                    : "Chưa có thông báo nào"}
                </h3>
                <p className="text-slate-500">
                  {searchQuery || selectedCategory !== "Tất cả"
                    ? "Thử tìm kiếm với từ khóa khác"
                    : "Hãy tạo thông báo đầu tiên"}
                </p>
                <Button
                  className="mt-4 gap-2"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Tạo thông báo
                </Button>
              </div>
            ) : (
              sortedAnnouncements.map((item: any, index: number) => (
                <AnnouncementCard
                  key={item.id}
                  announcement={item}
                  index={index}
                  viewMode={viewMode}
                  onFavorite={() => toggleFavorite(item.id)}
                  isFavorite={favorites.includes(item.id)}
                />
              ))
            )}
          </motion.div>

          {/* Load More */}
          {!loading && sortedAnnouncements.length > 0 && (
            <div className="text-center">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                onClick={handleRefresh}
              >
                Tải thêm
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <CreateAnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
