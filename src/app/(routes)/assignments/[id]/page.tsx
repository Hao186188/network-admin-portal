// src/app/(routes)/assignments/[id]/page.tsx
// HOÀN CHỈNH - DÙNG supabaseAdmin CHO GRADE

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAssignments } from "@/hooks/use-assignments";
import { useToast } from "@/hooks/use-toast";
import { supabase, supabaseAdmin } from "@/lib/db/supabase-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  File,
  RefreshCw,
  Star,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ============================================
// CONSTANTS & CONFIGS
// ============================================

const statusConfig = {
  pending: {
    label: "Chưa nộp",
    icon: AlertCircle,
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  },
  submitted: {
    label: "Đã nộp",
    icon: CheckCircle,
    color: "text-green-500 bg-green-500/10 border-green-500/20",
  },
  graded: {
    label: "Đã chấm",
    icon: Star,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
};

const submissionStatusConfig = {
  PENDING: {
    label: "Chờ chấm",
    color: "text-yellow-500 bg-yellow-500/10",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã chấm",
    color: "text-green-500 bg-green-500/10",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Không đạt",
    color: "text-red-500 bg-red-500/10",
    icon: XCircle,
  },
};

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const headerVariants = {
  hidden: { y: -20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 25 },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// ============================================
// GRADE MODAL - DÙNG supabaseAdmin
// ============================================

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  assignmentTitle: string;
  onSuccess: (updatedSubmission: any) => void;
}

function GradeModal({
  isOpen,
  onClose,
  submission,
  assignmentTitle,
  onSuccess,
}: GradeModalProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && submission) {
      setGrade(submission.grade || 0);
      setFeedback(submission.feedback || "");
    }
  }, [isOpen, submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const role = session?.user?.role?.toUpperCase();
    if (role !== "TEACHER" && role !== "ADMIN") {
      toast.error("Chỉ giảng viên hoặc quản trị viên mới có thể chấm điểm");
      return;
    }

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
      console.log("📝 Bắt đầu chấm điểm submission:", submission.id);
      console.log("📝 Grade:", grade);
      console.log("📝 Feedback:", feedback);

      const newStatus = grade >= 5 ? "APPROVED" : "REJECTED";

      // ✅ DÙNG supabaseAdmin ĐỂ BYPASS RLS
      const { error } = await supabaseAdmin
        .from("submissions")
        .update({
          grade: grade,
          feedback: feedback || "",
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", submission.id);

      if (error) {
        console.error("❌ Update error:", error);
        throw error;
      }

      console.log("✅ Updated submission successfully!");

      // ✅ Tạo thông báo cho học sinh
      try {
        const statusText = grade >= 5 ? "Đã đạt" : "Cần cải thiện";
        await supabase.from("notifications").insert({
          title: `Bài tập "${assignmentTitle}" đã được chấm điểm`,
          message: `Bạn đạt ${grade}/10 điểm (${statusText}). ${feedback ? `Nhận xét: ${feedback}` : ""}`,
          type: "grade",
          read: false,
          link: `/assignments/${submission.assignment_id}`,
          user_id: submission.user_id,
          created_at: new Date().toISOString(),
        });
      } catch (notifError) {
        console.error("❌ Notification error:", notifError);
      }

      // ✅ Tạo object submission đã cập nhật
      const updatedSubmission = {
        ...submission,
        grade: grade,
        feedback: feedback || "",
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      toast.success(`✅ Đã chấm điểm thành công!`);
      onSuccess(updatedSubmission);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Chấm điểm bài nộp
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Nhập điểm và nhận xét cho bài nộp của học sinh
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-white/60">Học sinh</Label>
            <p className="text-white/80 text-sm">
              {submission.user?.name || "Chưa có thông tin"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60">File nộp</Label>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white/60 hover:text-white"
              onClick={() => {
                if (submission.file_url) {
                  window.open(submission.file_url, "_blank");
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              {submission.file_name || "Tải file"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60">
              Điểm <span className="text-red-400">*</span>
            </Label>
            <Input
              type="number"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              placeholder="Nhập điểm (0-10)"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              min={0}
              max={10}
              step={0.5}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-white/30">
              Điểm từ 0 đến 10, có thể nhập số thập phân (ví dụ: 7.5)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60">Nhận xét</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Nhập nhận xét cho học sinh..."
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 resize-none"
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 text-white/60 hover:text-white hover:border-white/20"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const {
    getAssignmentDetail,
    getAssignmentSubmissions,
    downloadFile,
    submitAssignment,
  } = useAssignments();

  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const assignmentId = params.id as string;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentData, submissionsData] = await Promise.all([
        getAssignmentDetail(assignmentId),
        getAssignmentSubmissions(assignmentId),
      ]);
      setAssignment(assignmentData);
      setSubmissions(submissionsData || []);
      console.log("✅ Fetched submissions:", submissionsData?.length || 0);
    } catch (err) {
      console.error("Error fetching assignment:", err);
      setError("Không thể tải thông tin bài tập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchData();
    }
  }, [assignmentId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("Đã cập nhật dữ liệu!");
  };

  const handleGradeSuccess = (updatedSubmission: any) => {
    console.log("✅ Grade success, updating UI...", updatedSubmission);

    // ✅ Cập nhật submissions state trực tiếp
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((sub) =>
        sub.id === updatedSubmission.id ? updatedSubmission : sub,
      ),
    );

    toast.success("Đã cập nhật danh sách bài nộp");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File quá lớn, vui lòng chọn file nhỏ hơn 50MB");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file để nộp");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để nộp bài");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAssignment({
        assignment_id: assignmentId,
        file: selectedFile,
        user_id: session.user.id,
      });
      toast.success("🎉 Nộp bài thành công!");
      setSelectedFile(null);
      await fetchData();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi nộp bài");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (url: string, fileName: string) => {
    await downloadFile(url, fileName);
  };

  const handleGradeClick = (submission: any) => {
    console.log("📝 Opening grade modal for submission:", submission.id);
    setSelectedSubmission(submission);
    setIsGradeModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !assignment) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card className="border-destructive">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive opacity-50" />
                <h2 className="text-2xl font-bold mb-2">
                  Không tìm thấy bài tập
                </h2>
                <p className="text-muted-foreground mb-4">
                  {error || "Bài tập không tồn tại hoặc đã bị xóa"}
                </p>
                <Link href="/assignments">
                  <Button className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const statusInfo =
    statusConfig[assignment.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo.icon;
  const isOverdue =
    new Date(assignment.due_date) < new Date() &&
    assignment.status === "pending";
  const role = session?.user?.role?.toUpperCase();
  const isTeacher = role === "TEACHER" || role === "ADMIN";
  const isStudent = role === "STUDENT";

  const userSubmission = submissions.find(
    (s) => s.user_id === session?.user?.id,
  );
  const hasSubmitted = !!userSubmission;
  const userSubmissionStatus = userSubmission?.status;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingSubmissions = submissions.filter((s) => s.status === "PENDING");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Back Button & Refresh */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <Link href="/assignments">
              <Button variant="ghost" className="gap-2 mb-4 hover:bg-muted/50">
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 mb-4"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header Card */}
            <motion.div variants={headerVariants}>
              <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <Badge
                          variant="outline"
                          className="text-sm border-primary/30"
                        >
                          {assignment.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-sm border-secondary/30"
                        >
                          {assignment.subject}
                        </Badge>
                        <div
                          className={cn(
                            "flex items-center gap-1 px-3 py-1 rounded-full border",
                            statusInfo.color,
                          )}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {statusInfo.label}
                          </span>
                        </div>
                        {isOverdue && (
                          <Badge
                            variant="destructive"
                            className="text-sm animate-pulse"
                          >
                            Quá hạn
                          </Badge>
                        )}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {assignment.title}
                      </h1>
                    </div>
                    {assignment.attachments > 0 && (
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Tải đề bài
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Hạn nộp
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {formatDate(assignment.due_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        Điểm số
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {assignment.points} điểm
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3 text-blue-500" />
                        Đã nộp
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {assignment.submissions}/{assignment.total_students}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <File className="w-3 h-3 text-purple-500" />
                        File đính kèm
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {assignment.attachments} file
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Mô tả
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {assignment.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Section - Student */}
            {isStudent && assignment.status !== "graded" && (
              <motion.div variants={itemVariants}>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      {hasSubmitted ? "Bài đã nộp" : "Nộp bài tập"}
                    </h3>

                    {hasSubmitted && userSubmission ? (
                      <div
                        className={cn(
                          "p-4 rounded-xl border",
                          userSubmissionStatus === "APPROVED"
                            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                            : userSubmissionStatus === "REJECTED"
                              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                              : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {userSubmissionStatus === "APPROVED" ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : userSubmissionStatus === "REJECTED" ? (
                            <XCircle className="w-6 h-6 text-red-500" />
                          ) : (
                            <Clock className="w-6 h-6 text-yellow-500 animate-pulse" />
                          )}
                          <div className="flex-1">
                            <p
                              className={cn(
                                "font-medium",
                                userSubmissionStatus === "APPROVED"
                                  ? "text-green-700 dark:text-green-400"
                                  : userSubmissionStatus === "REJECTED"
                                    ? "text-red-700 dark:text-red-400"
                                    : "text-yellow-700 dark:text-yellow-400",
                              )}
                            >
                              {userSubmissionStatus === "APPROVED"
                                ? "✅ Đã được chấm điểm!"
                                : userSubmissionStatus === "REJECTED"
                                  ? "❌ Cần chỉnh sửa"
                                  : "⏳ Đang chờ chấm điểm"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              File: {userSubmission.file_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ngày nộp: {formatDate(userSubmission.created_at)}
                            </p>
                            {userSubmission.grade !== undefined &&
                              userSubmission.grade !== null && (
                                <div className="mt-1 flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="font-bold text-yellow-500">
                                    {userSubmission.grade}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    /10
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                              handleDownload(
                                userSubmission.file_url,
                                userSubmission.file_name,
                              )
                            }
                          >
                            <Download className="w-4 h-4" />
                            Tải bài đã nộp
                          </Button>
                          {userSubmissionStatus === "REJECTED" && (
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                setSelectedFile(null);
                                const fileInput = document.getElementById(
                                  "file-upload",
                                ) as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                              }}
                            >
                              <Upload className="w-4 h-4" />
                              Nộp lại
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            disabled={isSubmitting || isOverdue}
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer block"
                          >
                            {selectedFile ? (
                              <div className="flex items-center justify-center gap-3">
                                <File className="w-8 h-8 text-primary" />
                                <div className="text-left">
                                  <p className="text-sm font-medium">
                                    {selectedFile.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(
                                      2,
                                    )}{" "}
                                    MB
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                <p className="text-sm font-medium text-foreground">
                                  Click để chọn file bài làm
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Hỗ trợ: PDF, DOC, DOCX, ZIP, RAR (tối đa 50MB)
                                </p>
                              </>
                            )}
                          </label>
                        </div>

                        <Button
                          className="w-full gap-2"
                          onClick={handleSubmit}
                          disabled={isSubmitting || !selectedFile || isOverdue}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang upload...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              {isOverdue ? "Đã quá hạn nộp" : "Nộp bài"}
                            </>
                          )}
                        </Button>
                        {isOverdue && (
                          <motion.p
                            variants={pulseVariants}
                            animate="pulse"
                            className="text-sm text-destructive text-center"
                          >
                            ⚠️ Bài tập đã quá hạn nộp
                          </motion.p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Submissions List - Teacher only */}
            {isTeacher && (
              <motion.div variants={itemVariants}>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Danh sách bài nộp ({submissions.length})
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {pendingSubmissions.length} chờ chấm
                      </Badge>
                    </div>

                    {submissions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Chưa có học sinh nào nộp bài</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        <AnimatePresence>
                          {submissions.map((sub, index) => {
                            const subStatus =
                              submissionStatusConfig[
                                sub.status as keyof typeof submissionStatusConfig
                              ];
                            const SubIcon = subStatus.icon;
                            const isGraded =
                              sub.status === "APPROVED" ||
                              sub.status === "REJECTED";
                            const isPending = sub.status === "PENDING";

                            return (
                              <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.05,
                                }}
                                className={cn(
                                  "flex items-center justify-between p-4 rounded-xl transition-colors border",
                                  isPending
                                    ? "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200/50 dark:border-yellow-800/50"
                                    : "bg-muted/30 hover:bg-muted/50 border-border/50",
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className={cn(
                                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                      isPending
                                        ? "bg-yellow-500/20"
                                        : "bg-gradient-to-r from-primary to-secondary",
                                    )}
                                  >
                                    {isPending ? (
                                      <Clock className="w-5 h-5 text-yellow-500" />
                                    ) : (
                                      <Users className="w-5 h-5 text-white" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium truncate">
                                      {sub.user?.name || "Unknown"}
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {sub.file_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatDate(sub.created_at)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {/* Nút Chấm điểm - Chỉ hiển thị khi PENDING */}
                                  {isPending && (
                                    <Button
                                      size="sm"
                                      className="gap-1 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/20"
                                      onClick={() => handleGradeClick(sub)}
                                    >
                                      <Star className="w-4 h-4" />
                                      Chấm điểm
                                    </Button>
                                  )}

                                  {/* Hiển thị điểm đã chấm */}
                                  {isGraded && sub.grade !== undefined && (
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      <span className="font-bold text-yellow-500">
                                        {sub.grade}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        /10
                                      </span>
                                    </div>
                                  )}

                                  <div
                                    className={cn(
                                      "flex items-center gap-1 px-3 py-1 rounded-full",
                                      subStatus.color,
                                    )}
                                  >
                                    <SubIcon className="w-3 h-3" />
                                    <span className="text-xs font-medium">
                                      {subStatus.label}
                                    </span>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-primary/10"
                                    onClick={() =>
                                      handleDownload(
                                        sub.file_url,
                                        sub.file_name,
                                      )
                                    }
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* ✅ Grade Modal */}
      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => {
          setIsGradeModalOpen(false);
          setSelectedSubmission(null);
        }}
        submission={selectedSubmission}
        assignmentTitle={assignment?.title || ""}
        onSuccess={handleGradeSuccess}
      />
    </>
  );
}
