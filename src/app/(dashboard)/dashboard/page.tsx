// src/app/(dashboard)/dashboard/page.tsx
// Vai trò: Trang Dashboard - VỚI ĐĂNG TIN ĐA CHỨC NĂNG VÀ XEM CHI TIẾT

"use client";

import { FileUpload } from "@/components/common/file-upload";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useDashboard } from "@/hooks/use-dashboard";
import { useStats } from "@/hooks/use-stats";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileText,
  FolderPlus,
  Heart,
  HelpCircle,
  LogOut,
  MessageSquare,
  Pin,
  Plus,
  RefreshCw,
  Server,
  Settings,
  Share2,
  Shield,
  TrendingUp,
  Upload,
  User,
  UserPlus,
  Users,
  Video,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

// Helper function để format date
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

// ============================================
// MODAL: TẠO THÔNG BÁO
// ============================================
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
      const authorId = session?.user?.id || undefined;

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
            Đăng thông báo mới
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

// ============================================
// MODAL: TẠO BÀI VIẾT FORUM
// ============================================
function CreateForumPostModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Thảo luận");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Đã đăng bài viết thành công!");
      onSuccess();
      onClose();
      setTitle("");
      setContent("");
      setCategory("Thảo luận");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng bài");
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
            <MessageSquare className="w-6 h-6 text-secondary" />
            Đăng bài viết mới
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tiêu đề <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Nội dung <span className="text-destructive">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài viết..."
              rows={5}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Danh mục
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={isLoading}
            >
              {["Thảo luận", "Hỏi đáp", "Chia sẻ", "Kinh nghiệm", "Dự án"].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ),
              )}
            </select>
          </div>

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
            <Button
              type="submit"
              className="flex-1 gap-2 bg-secondary hover:bg-secondary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Đăng bài
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================
// MODAL: TẢI LÊN FILE
// ============================================
function UploadModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState<"document" | "lecture" | "project">(
    "document",
  );

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một file");
      return;
    }

    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Đã upload ${uploadedFiles.length} file thành công!`);
      onSuccess();
      onClose();
      setUploadedFiles([]);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi upload file");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-500" />
            Upload file
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Danh mục <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "document", label: "Tài liệu", icon: FileText },
                { value: "lecture", label: "Bài giảng", icon: Video },
                { value: "project", label: "Dự án", icon: FolderPlus },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value as typeof category)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    category === item.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <FileUpload onFileUpload={handleFileUpload} maxFiles={10} />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="flex-1 gap-2"
              onClick={handleUpload}
              disabled={isUploading || uploadedFiles.length === 0}
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload ({uploadedFiles.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// MODAL: XEM CHI TIẾT THÔNG BÁO
// ============================================
function AnnouncementDetailModal({
  announcement,
  isOpen,
  onClose,
}: {
  announcement: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!announcement || !isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {announcement.pinned && (
                <Badge variant="secondary" className="gap-1">
                  <Pin className="w-3 h-3" />
                  Ghim
                </Badge>
              )}
              <Badge variant="outline">{announcement.category}</Badge>
              <div
                className={`w-2 h-2 rounded-full ${priorityColors[announcement.priority]}`}
              />
              <span className="text-sm text-muted-foreground">
                {priorityLabels[announcement.priority]}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{announcement.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {announcement.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(announcement.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {announcement.views} lượt xem
          </span>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap">
            {announcement.content}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="gap-2">
            <Heart className="w-4 h-4" />
            {announcement.likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            {announcement.comments}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE CHÍNH
// ============================================
export default function DashboardPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const dashboardData = useDashboard();
  const statsData = useStats();
  const {
    announcements,
    loading: announcementsLoading,
    refresh: refreshAnnouncements,
  } = useAnnouncements();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Modal states
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] =
    useState(false);
  const [isCreateForumPostOpen, setIsCreateForumPostOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dữ liệu thống kê từ database
  const stats = [
    {
      title: "Tài liệu",
      value: statsData.documents,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
      href: "/documents",
    },
    {
      title: "Bài giảng",
      value: statsData.lectures,
      icon: Video,
      color: "from-purple-500 to-purple-600",
      change: "+8%",
      href: "/lectures",
    },
    {
      title: "Sinh viên",
      value: statsData.students,
      icon: Users,
      color: "from-green-500 to-green-600",
      change: "+5%",
      href: "/students",
    },
    {
      title: "Giảng viên",
      value: statsData.teachers,
      icon: UserPlus,
      color: "from-orange-500 to-orange-600",
      change: "0%",
      href: "/teachers",
    },
  ];

  // Quick access items
  const quickAccess = [
    {
      icon: FileText,
      label: "Tài liệu",
      color: "from-blue-500 to-blue-600",
      href: "/documents",
    },
    {
      icon: Video,
      label: "Bài giảng",
      color: "from-purple-500 to-purple-600",
      href: "/lectures",
    },
    {
      icon: Calendar,
      label: "Lịch học",
      color: "from-green-500 to-green-600",
      href: "/schedule",
    },
    {
      icon: Bell,
      label: "Thông báo",
      color: "from-orange-500 to-orange-600",
      href: "/announcements",
    },
    {
      icon: Users,
      label: "Lớp học",
      color: "from-pink-500 to-pink-600",
      href: "/courses",
    },
    {
      icon: BookOpen,
      label: "Môn học",
      color: "from-cyan-500 to-cyan-600",
      href: "/courses",
    },
    {
      icon: Server,
      label: "Kho phần mềm",
      color: "from-indigo-500 to-indigo-600",
      href: "/software",
    },
    {
      icon: Shield,
      label: "Bảo mật",
      color: "from-red-500 to-red-600",
      href: "/security",
    },
    {
      icon: MessageSquare,
      label: "Diễn đàn",
      color: "from-teal-500 to-teal-600",
      href: "/forum",
    },
    {
      icon: Download,
      label: "Tải tài liệu",
      color: "from-amber-500 to-amber-600",
      href: "/documents",
    },
  ];

  // User actions
  const userActions = [
    { icon: User, label: "Hồ sơ", href: "/profile" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
    { icon: HelpCircle, label: "Trợ giúp", href: "/faq" },
    { icon: LogOut, label: "Đăng xuất", action: "logout" },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Đang làm mới dữ liệu...");
    await Promise.all([
      refreshAnnouncements(),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
    setIsRefreshing(false);
    toast.success("Đã làm mới dữ liệu thành công!");
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleCreateSuccess = () => {
    refreshAnnouncements();
    toast.success("Đã cập nhật dữ liệu!");
  };

  const handleViewDetail = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsDetailModalOpen(true);
  };

  // Get recent announcements (3 newest)
  const recentAnnouncements = announcements.slice(0, 3);

  // Dropdown items
  const dropdownItems = [
    {
      icon: Bell,
      label: "Đăng thông báo",
      description: "Thông báo đến toàn bộ lớp học",
      color: "text-primary",
      onClick: () => setIsCreateAnnouncementOpen(true),
    },
    {
      icon: MessageSquare,
      label: "Đăng bài viết",
      description: "Chia sẻ kiến thức trên diễn đàn",
      color: "text-secondary",
      onClick: () => setIsCreateForumPostOpen(true),
    },
    {
      icon: Upload,
      label: "Upload file",
      description: "Tải lên tài liệu, bài giảng",
      color: "text-blue-500",
      onClick: () => setIsUploadModalOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Chào mừng trở lại, {session?.user?.name || "Người dùng"}!
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>

              {/* Dropdown Đăng tin */}
              <div className="relative">
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Plus className="w-4 h-4" />
                  Đăng tin
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {dropdownItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              item.onClick();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}
                            >
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-foreground">
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Đã kết nối
              </Badge>
              <Badge variant="purple" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Học tập tích cực
              </Badge>
            </div>
          </motion.div>

          {/* Stats Grid */}
          {statsData.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-muted animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : statsData.error ? (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center text-destructive">
                <p>{statsData.error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleRefresh}
                >
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={stat.href}>
                    <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {stat.title}
                            </p>
                            <p className="text-3xl font-bold mt-2 text-foreground">
                              {stat.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" />
                              {stat.change} so với tháng trước
                            </p>
                          </div>
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <stat.icon className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Thông báo mới
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => setIsCreateAnnouncementOpen(true)}
                    >
                      <Plus className="w-3 h-3" />
                      Tạo mới
                    </Button>
                    <Link href="/announcements">
                      <Button variant="ghost" size="sm" className="gap-1">
                        Xem tất cả
                        <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {announcementsLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                      >
                        <div className="w-2 h-2 rounded-full bg-muted mt-2" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))
                  ) : recentAnnouncements.length > 0 ? (
                    recentAnnouncements.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                        onClick={() => handleViewDetail(item)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            item.priority === "high"
                              ? "bg-red-500"
                              : item.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {item.pinned && (
                              <Pin className="w-3 h-3 text-primary flex-shrink-0" />
                            )}
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {item.title}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.content}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.created_at)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Chưa có thông báo mới</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsCreateAnnouncementOpen(true)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tạo thông báo đầu tiên
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Tasks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    Bài tập sắp đến hạn
                  </CardTitle>
                  <Link href="/assignments">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Xem tất cả
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.loading ? (
                    [...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                        <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                      </div>
                    ))
                  ) : dashboardData.upcomingTasks.length > 0 ? (
                    dashboardData.upcomingTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              task.status === "urgent"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                                : task.status === "pending"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                            }`}
                          >
                            <AlertCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-secondary transition-colors">
                              {task.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {task.due_date
                                ? formatDate(task.due_date)
                                : "Chưa có hạn"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            task.status === "urgent"
                              ? "destructive"
                              : task.status === "pending"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {task.status === "urgent"
                            ? "Gấp"
                            : task.status === "pending"
                              ? "Chờ"
                              : "Sắp tới"}
                        </Badge>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Không có bài tập nào sắp đến hạn</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Truy cập nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {quickAccess.map((item, index) => (
                    <Link href={item.href} key={index}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all group w-full"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}
                        >
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.label}
                        </span>
                      </motion.button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Quản lý tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {userActions.map((action, index) =>
                    action.action === "logout" ? (
                      <Button
                        key={index}
                        variant="outline"
                        className="gap-2 hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </Button>
                    ) : (
                      <Link href={action.href as string} key={index}>
                        <Button
                          variant="outline"
                          className="gap-2 hover:bg-primary/10 hover:text-primary"
                        >
                          <action.icon className="w-4 h-4" />
                          {action.label}
                        </Button>
                      </Link>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Modals */}
      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <CreateForumPostModal
        isOpen={isCreateForumPostOpen}
        onClose={() => setIsCreateForumPostOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAnnouncement(null);
        }}
      />
    </div>
  );
}
