// src/app/(routes)/submissions/page.tsx
// Vai trò: Quản lý bài nộp và chấm điểm - HOÀN CHỈNH

"use client";

import { ExportButton } from "@/components/common/ExportButton";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubmissions, type SubmissionStatus } from "@/hooks/use-submissions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  File,
  Filter,
  RefreshCw,
  Search,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import type { Submission as HookSubmission } from "@/hooks/use-submissions";

interface Submission extends HookSubmission {
  user?: {
    name: string;
    email: string;
  };
  assignment?: {
    id: string;
    title: string;
    subject: string;
    type: string;
    due_date: string;
  };
}

const statusConfig = {
  PENDING: {
    label: "Đang chờ",
    icon: Clock,
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    badgeColor: "bg-yellow-500",
  },
  APPROVED: {
    label: "Đã chấm",
    icon: CheckCircle,
    color: "text-green-500 bg-green-500/10 border-green-500/20",
    badgeColor: "bg-green-500",
  },
  REJECTED: {
    label: "Cần sửa",
    icon: XCircle,
    color: "text-red-500 bg-red-500/10 border-red-500/20",
    badgeColor: "bg-red-500",
  },
};

function GradeModal({
  isOpen,
  onClose,
  submission,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onSuccess: (updatedSubmission?: Submission) => void;
}) {
  const { toast } = useToast();
  const { gradeSubmission } = useSubmissions();
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && submission) {
      setGrade(0);
      setFeedback("");
    }
  }, [isOpen, submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) {
      toast.error("Không tìm thấy bài nộp");
      return;
    }

    if (grade < 0 || grade > 10) {
      toast.error("Điểm phải từ 0 đến 10");
      return;
    }

    setIsLoading(true);
    try {
      console.log("========================================");
      console.log("📝 BẮT ĐẦU CHẤM ĐIỂM TỪ MODAL");
      console.log("📝 Submission ID:", submission.id);
      console.log("📝 Grade:", grade);
      console.log("📝 Feedback:", feedback);
      console.log("========================================");

      const result = await gradeSubmission(submission.id, grade, feedback);

      console.log("📝 Kết quả từ gradeSubmission:", result);

      if (!result.success) {
        toast.error(result.error || "Không thể chấm điểm");
        setIsLoading(false);
        return;
      }

      // Tạo thông báo cho học sinh
      try {
        const statusText = grade >= 5 ? "Đã đạt" : "Cần cải thiện";
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            title: `Bài tập "${submission.assignment?.title || "không tên"}" đã được chấm điểm`,
            message: `Bạn đạt ${grade}/10 điểm (${statusText}). ${feedback ? `Nhận xét: ${feedback}` : ""}`,
            type: "grade",
            read: false,
            link: `/assignments/${submission.assignment_id}`,
            user_id: submission.user_id,
            created_at: new Date().toISOString(),
          });

        if (notifError) {
          console.error("❌ Lỗi tạo thông báo:", notifError);
        }
      } catch (notifError) {
        console.error("❌ Lỗi tạo thông báo:", notifError);
      }

      const updatedStatus: SubmissionStatus =
        grade >= 5 ? "APPROVED" : "REJECTED";

      const updatedSubmission: Submission = {
        ...submission,
        grade: grade,
        feedback: feedback || "",
        status: updatedStatus,
        updated_at: new Date().toISOString(),
      };

      console.log("📝 Updated submission:", updatedSubmission);

      toast.success(`✅ Đã chấm điểm thành công!`);

      await onSuccess(updatedSubmission);

      onClose();
      setGrade(0);
      setFeedback("");
    } catch (error: any) {
      console.error("❌ Grade error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi chấm điểm");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !submission) return null;

  const currentStatus =
    statusConfig[submission.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Star className="w-6 h-6 text-primary" />
            Chấm điểm
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="font-medium">
              {submission.assignment?.title || "Bài tập không tên"}
            </p>
            <p className="text-sm text-muted-foreground">
              Học sinh: {submission.user?.name || "Unknown"}
            </p>
            <p className="text-sm text-muted-foreground">
              File: {submission.file_name}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Trạng thái:</span>
              <Badge
                className={`${currentStatus.badgeColor} text-white border-0`}
              >
                {currentStatus.label}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Điểm <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                placeholder="Nhập điểm (0-10)"
                className="w-full"
                min={0}
                max={10}
                step={0.5}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Điểm từ 0 đến 10, có thể nhập số thập phân (ví dụ: 7.5)
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nhận xét
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Nhập nhận xét cho học sinh..."
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                disabled={isLoading}
              />
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
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Star className="w-4 h-4" />
                    Chấm điểm & Gửi thông báo
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function SubmissionsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const {
    submissions: hookSubmissions,
    loading,
    error,
    refresh,
  } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localSubmissions, setLocalSubmissions] = useState<Submission[]>([]);

  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  useEffect(() => {
    console.log("📥 Hook submissions updated:", hookSubmissions?.length || 0);
    setLocalSubmissions(hookSubmissions as Submission[]);
  }, [hookSubmissions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      toast.success("Đã cập nhật dữ liệu!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi làm mới dữ liệu");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGradeSuccess = async (updatedSubmission?: Submission) => {
    console.log("🔄 Grade success, updating UI...", updatedSubmission);

    if (updatedSubmission) {
      setLocalSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === updatedSubmission.id ? updatedSubmission : sub,
        ),
      );
      toast.success("✅ Đã cập nhật giao diện!");
    }

    try {
      console.log("🔄 Đang refresh dữ liệu từ database...");
      await refresh();
      console.log("🔄 Đã refresh dữ liệu ngầm thành công");
    } catch (err) {
      console.error("❌ Lỗi đồng bộ dữ liệu ngầm:", err);
    }
  };

  const filteredSubmissions = localSubmissions.filter((item: Submission) => {
    const matchesSearch =
      item.assignment?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.file_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "Tất cả" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleGrade = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsGradeModalOpen(true);
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success("Đã tải file thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải file");
    }
  };

  const pendingCount = localSubmissions.filter(
    (s) => s.status === "PENDING",
  ).length;
  const approvedCount = localSubmissions.filter(
    (s) => s.status === "APPROVED",
  ).length;
  const rejectedCount = localSubmissions.filter(
    (s) => s.status === "REJECTED",
  ).length;

  return (
    <>
      <Navbar />
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
                <File className="w-8 h-8 text-primary" />
                Bài Nộp
              </h1>
              <div className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Quản lý bài tập đã nộp của học sinh</span>
                {!loading && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredSubmissions.length} bài nộp
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-2">
                <Badge variant="warning" className="gap-1">
                  <Clock className="w-3 h-3" />
                  Chờ chấm: {pendingCount}
                </Badge>
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Đã chấm: {approvedCount}
                </Badge>
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  Cần sửa: {rejectedCount}
                </Badge>
              </div>
              <ExportButton
                type="submissions"
                filters={{
                  status:
                    selectedStatus !== "Tất cả"
                      ? (selectedStatus as any)
                      : "ALL",
                  from_date: undefined,
                  to_date: undefined,
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing || loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Chờ chấm
                  </p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                    {pendingCount}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500" />
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Đã chấm
                  </p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {approvedCount}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Cần sửa
                  </p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                    {rejectedCount}
                  </p>
                </div>
                <XCircle className="w-10 h-10 text-red-500" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên bài tập, học sinh, file..."
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  Lọc
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
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
                    {["Tất cả", "PENDING", "APPROVED", "REJECTED"].map(
                      (status) => {
                        const statusInfo =
                          statusConfig[status as keyof typeof statusConfig];
                        return (
                          <Badge
                            key={status}
                            variant={
                              selectedStatus === status ? "default" : "outline"
                            }
                            className="cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedStatus(status)}
                          >
                            {status === "Tất cả"
                              ? "Tất cả"
                              : statusInfo?.label || status}
                          </Badge>
                        );
                      },
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submissions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <Card className="border-destructive">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    Lỗi tải dữ liệu
                  </h3>
                  <p className="text-muted-foreground">{error}</p>
                  <Button className="mt-4" onClick={handleRefresh}>
                    Thử lại
                  </Button>
                </CardContent>
              </Card>
            ) : filteredSubmissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <File className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Không có bài nộp</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedStatus !== "Tất cả"
                    ? "Không tìm thấy bài nộp nào phù hợp"
                    : "Chưa có học sinh nào nộp bài"}
                </p>
              </motion.div>
            ) : (
              filteredSubmissions.map(
                (submission: Submission, index: number) => {
                  const statusInfo =
                    statusConfig[
                      submission.status as keyof typeof statusConfig
                    ];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
                                  <File className="w-6 h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                                    {submission.assignment?.title ||
                                      "Không có tiêu đề"}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {submission.user?.name || "Unknown"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDate(submission.created_at)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <File className="w-3 h-3" />
                                      {submission.file_name}
                                    </span>
                                    <span className="text-xs">
                                      {formatFileSize(submission.file_size)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <div
                                className={`flex items-center gap-1 px-3 py-1 rounded-full border ${statusInfo.color}`}
                              >
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {statusInfo.label}
                                </span>
                              </div>

                              {submission.status === "APPROVED" && (
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  <Star className="w-4 h-4" />
                                  <span className="font-bold">
                                    {submission.grade}
                                  </span>
                                  <span className="text-sm">/10</span>
                                </div>
                              )}

                              {submission.status === "REJECTED" && (
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                  <XCircle className="w-4 h-4" />
                                  <span className="font-bold">
                                    {submission.grade}
                                  </span>
                                  <span className="text-sm">/10</span>
                                </div>
                              )}

                              {isTeacher && submission.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => handleGrade(submission)}
                                >
                                  <Star className="w-4 h-4" />
                                  Chấm điểm
                                </Button>
                              )}

                              {(submission.status === "APPROVED" ||
                                submission.status === "REJECTED") && (
                                <Badge variant="outline" className="gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  Đã chấm
                                </Badge>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() =>
                                  handleDownload(
                                    submission.file_url,
                                    submission.file_name,
                                  )
                                }
                              >
                                <Download className="w-4 h-4" />
                                Tải
                              </Button>
                            </div>
                          </div>

                          {submission.feedback && (
                            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Nhận xét: </span>
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                },
              )
            )}
          </motion.div>
        </div>
      </div>
      <Footer />

      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => {
          setIsGradeModalOpen(false);
          setSelectedSubmission(null);
        }}
        submission={selectedSubmission}
        onSuccess={handleGradeSuccess}
      />
    </>
  );
}
