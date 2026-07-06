// src/app/(routes)/announcements/page.tsx
// Vai trò: Hiển thị và quản lý các thông báo - CÓ CHỨC NĂNG TẠO MỚI

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bookmark,
  ChevronDown,
  Clock,
  Eye,
  Filter,
  Heart,
  MessageCircle,
  Pin,
  Plus,
  Search,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

// Types
interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  pinned: boolean;
  category: string;
  author: string;
  author_id?: string | null;
  views: number;
  comments: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

// Priority colors
const priorityColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

const priorityLabels: Record<string, string> = {
  high: "Quan trọng",
  medium: "Bình thường",
  low: "Thấp",
};

// Categories
const categories = [
  "Tất cả",
  "Thi cử",
  "Phòng máy",
  "Bài tập",
  "Hướng dẫn",
  "Thông báo",
  "Sự kiện",
  "Khác",
];

// Skeleton components
const AnnouncementSkeleton = () => (
  <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-3 h-3 rounded-full mt-2" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Create Announcement Modal
function CreateAnnouncementModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const { createAnnouncement } = useAnnouncements();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Thông báo");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [pinned, setPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    setIsLoading(true);
    try {
      const authorName = session?.user?.name || "Admin";
      const authorId = session?.user?.id || null;

      const result = await createAnnouncement({
        title: title.trim(),
        content: content.trim(),
        priority,
        pinned,
        category,
        author: authorName,
        author_id: authorId,
      });

      if (result) {
        toast.success("Đã tạo thông báo thành công!");
        onSuccess();
        onClose();
        // Reset form
        setTitle("");
        setContent("");
        setCategory("Thông báo");
        setPriority("medium");
        setPinned(false);
      }
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Tạo thông báo mới
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tiêu đề <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thông báo..."
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>

          {/* Nội dung */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Nội dung <span className="text-destructive">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung thông báo..."
              rows={5}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
              disabled={isLoading}
            />
          </div>

          {/* Danh mục và Độ ưu tiên */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                {[
                  "Thông báo",
                  "Thi cử",
                  "Phòng máy",
                  "Bài tập",
                  "Hướng dẫn",
                  "Sự kiện",
                  "Khác",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                <option value="high">🔴 Quan trọng</option>
                <option value="medium">🟡 Bình thường</option>
                <option value="low">🔵 Thấp</option>
              </select>
            </div>
          </div>

          {/* Ghim */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                pinned
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
              disabled={isLoading}
            >
              <Pin className={`w-4 h-4 ${pinned ? "fill-primary" : ""}`} />
              {pinned ? "Đã ghim" : "Ghim thông báo"}
            </button>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Đăng thông báo
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AnnouncementsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { announcements, loading, error, refresh } = useAnnouncements();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter announcements
  const filteredAnnouncements = announcements.filter((item: Announcement) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fid: string) => fid !== id)
        : [...prev, id],
    );
    toast.success(favorites.includes(id) ? "Đã bỏ lưu" : "Đã lưu thông báo");
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

  const handleCreateSuccess = () => {
    refresh();
  };

  return (
    <>
      <Navbar session={session} status={status} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                Thông Báo
              </h1>
              <div className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Cập nhật thông tin và sự kiện mới nhất</span>
                {!loading && (
                  <Badge variant="secondary" className="ml-2">
                    {sortedAnnouncements.length} thông báo
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Tạo thông báo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={refresh}
                disabled={loading}
              >
                <Bell className="w-4 h-4" />
                Làm mới
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Lọc
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm thông báo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-2">
                    {categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant={
                          selectedCategory === cat ? "default" : "outline"
                        }
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Announcements List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <AnnouncementSkeleton key={i} />
              ))
            ) : error ? (
              <Card className="border-destructive">
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-destructive opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    Lỗi tải dữ liệu
                  </h3>
                  <p className="text-muted-foreground">{error}</p>
                  <Button className="mt-4" onClick={refresh}>
                    Thử lại
                  </Button>
                </CardContent>
              </Card>
            ) : sortedAnnouncements.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Không có thông báo
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedCategory !== "Tất cả"
                    ? "Không tìm thấy thông báo nào phù hợp"
                    : "Chưa có thông báo nào trong hệ thống."}
                </p>
                <Button
                  className="mt-4 gap-2"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Tạo thông báo đầu tiên
                </Button>
              </motion.div>
            ) : (
              sortedAnnouncements.map((item: Announcement, index: number) => {
                const isFavorite = favorites.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card
                      className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                        item.pinned
                          ? "border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20"
                          : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-3 h-3 rounded-full ${priorityColors[item.priority]} mt-2`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {item.pinned && (
                                    <Badge
                                      variant="secondary"
                                      className="gap-1"
                                    >
                                      <Pin className="w-3 h-3" />
                                      Ghim
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {item.category}
                                  </Badge>
                                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(item.created_at)}
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {item.content}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {item.author}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {item.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {item.comments}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(item.id);
                                  }}
                                >
                                  <Heart
                                    className={`w-4 h-4 transition-all ${
                                      isFavorite
                                        ? "fill-red-500 text-red-500 scale-110"
                                        : "hover:scale-110"
                                    }`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success("Đã lưu thông báo");
                                  }}
                                >
                                  <Bookmark className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900/30"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (navigator.share) {
                                      navigator.share({
                                        title: item.title,
                                        text: item.content,
                                        url: window.location.href,
                                      });
                                    } else {
                                      navigator.clipboard.writeText(
                                        `${item.title}\n${item.content}`,
                                      );
                                      toast.success("Đã sao chép nội dung");
                                    }
                                  }}
                                >
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Create Modal */}
      <CreateAnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
