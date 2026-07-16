// src/app/(routes)/lectures/moderate/page.tsx
// FIXED - DÙNG supabaseAdmin ĐỂ BYPASS RLS

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { cn, formatRelativeTime } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Check,
  Clock,
  Eye,
  FileText,
  Loader2,
  Monitor,
  RefreshCw,
  Search,
  User,
  Video,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// ============================================
// TYPES
// ============================================

interface LectureModeration {
  id: string;
  title: string;
  description: string;
  type: "video" | "slide" | "lab" | "document";
  subject?: string;
  teacher: string;
  teacher_id?: string;
  tags: string[];
  thumbnail?: string;
  video_url?: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  created_at: string;
  views: number;
  likes: number;
}

interface ModerationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

// ============================================
// TYPE CONFIG
// ============================================

const typeConfig: Record<string, { icon: any; label: string; color: string }> =
  {
    video: { icon: Video, label: "Video", color: "text-red-400" },
    slide: { icon: FileText, label: "Slide", color: "text-blue-400" },
    lab: { icon: Monitor, label: "Lab", color: "text-green-400" },
    document: { icon: BookOpen, label: "Tài liệu", color: "text-purple-400" },
  };

// ============================================
// MAIN COMPONENT
// ============================================

export default function ModerateLecturesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [lectures, setLectures] = useState<LectureModeration[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedLecture, setSelectedLecture] =
    useState<LectureModeration | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Kiểm tra quyền
  const canModerate =
    session?.user?.role === "ADMIN" || session?.user?.role === "TEACHER";

  // ✅ Fetch dữ liệu - SỬ DỤNG API ROUTE ĐỂ BYPASS RLS
  const fetchLectures = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      setError(null);
      setDebugInfo("");

      try {
        console.log(
          "🔍 [Moderate] Fetching all lectures from API...",
        );

        const response = await fetch("/api/lectures");
        const data = await response.json();

        if (!response.ok) {
          console.error("❌ [Moderate] API error:", data.error);
          setError(`Lỗi: ${data.error || "Không thể tải dữ liệu"}`);
          return;
        }

        const lecturesData = (data || []) as LectureModeration[];

        // ✅ Debug: Log tất cả status
        const statusCounts = lecturesData.reduce((acc: any, l) => {
          acc[l.status] = (acc[l.status] || 0) + 1;
          return acc;
        }, {});
        console.log("📊 [Moderate] Status counts:", statusCounts);

        setLectures(lecturesData);

        // Tính stats
        const pending = lecturesData.filter(
          (l) => l.status === "pending",
        ).length;
        const approved = lecturesData.filter(
          (l) => l.status === "approved",
        ).length;
        const rejected = lecturesData.filter(
          (l) => l.status === "rejected",
        ).length;

        console.log(
          `📊 [Moderate] Stats - Pending: ${pending}, Approved: ${approved}, Rejected: ${rejected}`,
        );

        setStats({
          pending,
          approved,
          rejected,
          total: lecturesData.length,
        });

        setDebugInfo(
          `Tổng: ${lecturesData.length} | Pending: ${pending} | Approved: ${approved} | Rejected: ${rejected}`,
        );
      } catch (error: any) {
        console.error("❌ [Moderate] Error fetching lectures:", error);
        setError(error.message || "Không thể tải danh sách bài giảng");
        toast.error("Không thể tải danh sách bài giảng");
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // ✅ Xử lý duyệt bài
  const handleApprove = useCallback(
    async (lecture: LectureModeration) => {
      setProcessing(true);
      try {
        console.log(`✅ [Moderate] Approving lecture: ${lecture.id}`);

        const response = await fetch(`/api/lectures?id=${lecture.id}&action=approve`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "approved" }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ [Moderate] Approve error:", data.error);
          throw new Error(data.error || "Không thể duyệt bài giảng");
        }

        toast.success(`Đã duyệt bài giảng "${lecture.title}"`);
        await fetchLectures(false);
      } catch (error: any) {
        console.error("❌ [Moderate] Error approving lecture:", error);
        toast.error(error.message || "Không thể duyệt bài giảng");
      } finally {
        setProcessing(false);
      }
    },
    [fetchLectures, toast],
  );

  // ✅ Xử lý từ chối
  const handleReject = useCallback(
    async (lecture: LectureModeration, reason: string) => {
      setProcessing(true);
      try {
        console.log(`❌ [Moderate] Rejecting lecture: ${lecture.id}`);

        const response = await fetch(`/api/lectures?id=${lecture.id}&action=approve`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected", reason }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ [Moderate] Reject error:", data.error);
          throw new Error(data.error || "Không thể từ chối bài giảng");
        }

        toast.success(`Đã từ chối bài giảng "${lecture.title}"`);
        setShowRejectModal(false);
        setRejectReason("");
        await fetchLectures(false);
      } catch (error: any) {
        console.error("❌ [Moderate] Error rejecting lecture:", error);
        toast.error(error.message || "Không thể từ chối bài giảng");
      } finally {
        setProcessing(false);
      }
    },
    [fetchLectures, toast],
  );

  // ✅ Xóa bài giảng
  const handleDelete = useCallback(
    async (lecture: LectureModeration) => {
      if (!confirm(`Bạn có chắc muốn xóa bài giảng "${lecture.title}"?`))
        return;

      setProcessing(true);
      try {
        console.log(`🗑️ [Moderate] Deleting lecture: ${lecture.id}`);

        const response = await fetch(`/api/lectures?id=${lecture.id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ [Moderate] Delete error:", data.error);
          throw new Error(data.error || "Không thể xóa bài giảng");
        }

        toast.success(`Đã xóa bài giảng "${lecture.title}"`);
        await fetchLectures(false);
      } catch (error: any) {
        console.error("❌ [Moderate] Error deleting lecture:", error);
        toast.error(error.message || "Không thể xóa bài giảng");
      } finally {
        setProcessing(false);
      }
    },
    [fetchLectures, toast],
  );

  // ✅ Lọc dữ liệu
  const getFilteredLectures = useCallback(() => {
    let filtered = lectures;

    if (activeTab === "pending") {
      filtered = filtered.filter((l) => l.status === "pending");
    } else if (activeTab === "approved") {
      filtered = filtered.filter((l) => l.status === "approved");
    } else if (activeTab === "rejected") {
      filtered = filtered.filter((l) => l.status === "rejected");
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.teacher.toLowerCase().includes(query) ||
          l.tags?.some((t) => t.toLowerCase().includes(query)),
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((l) => l.type === filterType);
    }

    return filtered;
  }, [lectures, activeTab, searchQuery, filterType]);

  const filteredLectures = getFilteredLectures();

  // ✅ Effect lần đầu
  useEffect(() => {
    console.log(
      "🔍 [Moderate] Component mounted, session status:",
      sessionStatus,
    );

    if (sessionStatus === "loading") return;

    if (!session?.user) {
      console.log("🔍 [Moderate] No session, redirecting...");
      router.push("/login");
      return;
    }

    if (!canModerate) {
      console.log("🔍 [Moderate] No permission, redirecting...");
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/lectures");
      return;
    }

    console.log("🔍 [Moderate] Fetching data...");
    fetchLectures(true);
  }, [sessionStatus]);

  // ✅ Nếu không có quyền
  if (!canModerate && sessionStatus === "authenticated") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Không có quyền</h2>
              <p className="text-muted-foreground">
                Bạn cần quyền Admin hoặc Teacher để truy cập trang này.
              </p>
              <Button onClick={() => router.push("/lectures")} className="mt-4">
                Quay lại bài giảng
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  // Loading
  if (sessionStatus === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-white/60">Đang tải dữ liệu...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-16">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                📋 Kiểm duyệt bài giảng
              </h1>
              <p className="text-white/40 mt-1">
                Xem xét và phê duyệt bài giảng từ giáo viên
              </p>
              {debugInfo && (
                <p className="text-xs text-white/20 mt-1 font-mono">
                  {debugInfo}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-white/60 border-white/10"
              >
                {stats.pending} bài chờ duyệt
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLectures(true)}
                disabled={loading}
                className="border-white/10 text-white/60 hover:text-white hover:border-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", loading && "animate-spin")}
                />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-red-400 hover:text-red-300"
                onClick={() => fetchLectures(true)}
              >
                Thử lại
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Chờ duyệt"
              value={stats.pending}
              icon={Clock}
              color="text-yellow-400"
              bg="bg-yellow-400/10"
            />
            <StatCard
              label="Đã duyệt"
              value={stats.approved}
              icon={Check}
              color="text-green-400"
              bg="bg-green-400/10"
            />
            <StatCard
              label="Từ chối"
              value={stats.rejected}
              icon={X}
              color="text-red-400"
              bg="bg-red-400/10"
            />
            <StatCard
              label="Tổng cộng"
              value={stats.total}
              icon={FileText}
              color="text-cyan-400"
              bg="bg-cyan-400/10"
            />
          </div>

          {/* Tabs & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1"
              >
                <TabsList className="bg-black/30 border border-white/5">
                  <TabsTrigger value="pending" className="gap-2">
                    <Clock className="w-4 h-4" />
                    Chờ duyệt
                    {stats.pending > 0 && (
                      <Badge className="ml-1 bg-yellow-500/20 text-yellow-400 border-0">
                        {stats.pending}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="gap-2">
                    <Check className="w-4 h-4" />
                    Đã duyệt
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="gap-2">
                    <X className="w-4 h-4" />
                    Từ chối
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px] bg-black/30 border-white/10 text-white">
                    <SelectValue placeholder="Loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="video">🎬 Video</SelectItem>
                    <SelectItem value="slide">📊 Slide</SelectItem>
                    <SelectItem value="lab">💻 Lab</SelectItem>
                    <SelectItem value="document">📄 Tài liệu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            {filteredLectures.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                  {activeTab === "pending" ? (
                    <Clock className="w-8 h-8 text-yellow-400/40" />
                  ) : activeTab === "approved" ? (
                    <Check className="w-8 h-8 text-green-400/40" />
                  ) : (
                    <X className="w-8 h-8 text-red-400/40" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white/60">
                  {activeTab === "pending"
                    ? "Không có bài chờ duyệt"
                    : activeTab === "approved"
                      ? "Chưa có bài được duyệt"
                      : "Không có bài bị từ chối"}
                </h3>
                <p className="text-white/30 text-sm mt-1">
                  {activeTab === "pending"
                    ? "Tất cả bài giảng đã được xử lý"
                    : "Hãy kiểm tra lại sau"}
                </p>
                {activeTab === "pending" && stats.total > 0 && (
                  <p className="text-white/20 text-xs mt-2">
                    Có {stats.total} bài giảng trong hệ thống, nhưng không có
                    bài nào đang chờ duyệt.
                  </p>
                )}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 gap-4">
                  {filteredLectures.map((lecture, index) => (
                    <motion.div
                      key={lecture.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ModerationCard
                        lecture={lecture}
                        onApprove={handleApprove}
                        onReject={() => {
                          setSelectedLecture(lecture);
                          setShowRejectModal(true);
                        }}
                        onDelete={handleDelete}
                        processing={processing}
                        isAdmin={session?.user?.role === "ADMIN"}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-2">
              Từ chối bài giảng
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Bạn có chắc muốn từ chối "{selectedLecture.title}"?
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium text-white/80 block mb-2">
                Lý do từ chối
              </label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-white/60 hover:text-white"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedLecture(null);
                }}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={() => {
                  if (selectedLecture) {
                    handleReject(selectedLecture, rejectReason);
                  }
                }}
                disabled={processing}
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Từ chối"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  label: string;
  value: number;
  icon: any;
  color: string;
  bg: string;
}

function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            bg,
          )}
        >
          <Icon className={cn("w-5 h-5", color)} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODERATION CARD
// ============================================

interface ModerationCardProps {
  lecture: LectureModeration;
  onApprove: (lecture: LectureModeration) => void;
  onReject: (lecture: LectureModeration) => void;
  onDelete: (lecture: LectureModeration) => void;
  processing: boolean;
  isAdmin: boolean;
}

function ModerationCard({
  lecture,
  onApprove,
  onReject,
  onDelete,
  processing,
  isAdmin,
}: ModerationCardProps) {
  const TypeIcon = typeConfig[lecture.type]?.icon || FileText;
  const typeLabel = typeConfig[lecture.type]?.label || "Tài liệu";
  const typeColor = typeConfig[lecture.type]?.color || "text-white/40";

  const getStatusBadge = () => {
    if (lecture.status === "approved") {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Đã duyệt
        </Badge>
      );
    }
    if (lecture.status === "rejected") {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          Từ chối
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse">
        Chờ duyệt
      </Badge>
    );
  };

  return (
    <Card className="border-white/5 bg-white/5 hover:bg-white/10 transition-all">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnail */}
          <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
            {lecture.thumbnail ? (
              <img
                src={lecture.thumbnail}
                alt={lecture.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <TypeIcon className="w-10 h-10 text-white/20" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-white line-clamp-1">
                    {lecture.title}
                  </h3>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {lecture.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(lecture.created_at)}
                  </span>
                  <Badge variant="outline" className="text-xs border-white/10">
                    <TypeIcon className={cn("w-3 h-3 mr-1", typeColor)} />
                    {typeLabel}
                  </Badge>
                </div>
                <p className="text-sm text-white/40 line-clamp-2 mt-2">
                  {lecture.description}
                </p>
                {lecture.tags && lecture.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {lecture.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs border-white/5"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {lecture.rejection_reason && lecture.status === "rejected" && (
                  <p className="text-sm text-red-400/80 mt-2">
                    Lý do: {lecture.rejection_reason}
                  </p>
                )}
                {lecture.video_url && (
                  <p className="text-xs text-cyan-400/60 mt-1 truncate">
                    🔗 Link: {lecture.video_url}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
              {lecture.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    className="gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => onApprove(lecture)}
                    disabled={processing}
                  >
                    <Check className="w-4 h-4" />
                    Duyệt
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    onClick={() => onReject(lecture)}
                    disabled={processing}
                  >
                    <X className="w-4 h-4" />
                    Từ chối
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-white/10 text-white/60 hover:text-white"
                onClick={() => window.open(`/lectures/${lecture.id}`, "_blank")}
              >
                <Eye className="w-4 h-4" />
                Xem
              </Button>

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-auto"
                  onClick={() => onDelete(lecture)}
                  disabled={processing}
                >
                  <X className="w-4 h-4" />
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
