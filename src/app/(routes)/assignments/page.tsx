// src/app/(routes)/assignments/page.tsx
// HOÀN CHỈNH - XÓA TRÙNG LẶP

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useAssignments } from "@/hooks/use-assignments";
import { useToast } from "@/hooks/use-toast";
import { supabase, supabaseAdmin } from "@/lib/db/supabase-client";
import { motion } from "framer-motion";
import { FileText, Plus, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AssignmentCard } from "./components/AssignmentCard";
import { AssignmentFilters } from "./components/AssignmentFilters";
import { AssignmentHero } from "./components/AssignmentHero";
import { AssignmentSkeleton } from "./components/AssignmentSkeleton";
import { CreateAssignmentModal } from "./components/CreateAssignmentModal";
import { SubmitAssignmentModal } from "./components/SubmitAssignmentModal";

// ============================================
// GRADE MODAL
// ============================================

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
  onSuccess: () => void;
}

function GradeModal({
  isOpen,
  onClose,
  assignment,
  onSuccess,
}: GradeModalProps) {
  const { toast } = useToast();
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) {
      toast.error("Không tìm thấy bài tập");
      return;
    }

    if (grade < 0 || grade > 10) {
      toast.error("Điểm phải từ 0 đến 10");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabaseAdmin
        .from("assignments")
        .update({
          grade: grade,
          feedback: feedback || "",
          status: "graded",
          graded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", assignment.id);

      if (error) throw error;

      try {
        const statusText = grade >= 5 ? "Đã đạt" : "Cần cải thiện";
        await supabase.from("notifications").insert({
          title: `Bài tập "${assignment.title}" đã được chấm điểm`,
          message: `Bạn đạt ${grade}/10 điểm (${statusText}). ${feedback ? `Nhận xét: ${feedback}` : ""}`,
          type: "grade",
          read: false,
          link: `/assignments/${assignment.id}`,
          user_id: assignment.student_id,
          created_at: new Date().toISOString(),
        });
      } catch (notifError) {
        console.error("❌ Lỗi tạo thông báo:", notifError);
      }

      toast.success(`✅ Đã chấm điểm thành công!`);
      onSuccess();
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

  if (!isOpen || !assignment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Chấm điểm bài tập
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Nhập điểm và nhận xét cho bài tập "{assignment.title}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-white/60">Học sinh</Label>
            <p className="text-white/80 text-sm">
              {assignment.student_name || "Chưa có thông tin"}
            </p>
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
// MAIN PAGE
// ============================================

export default function AssignmentsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { assignments, loading, error, refresh } = useAssignments();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");
  const [selectedType, setSelectedType] = useState<string>("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const [userSubmissions, setUserSubmissions] = useState<Set<string>>(
    new Set(),
  );

  const userRole = session?.user?.role?.toUpperCase() || "STUDENT";
  const isAdmin = userRole === "ADMIN";
  const isTeacher = userRole === "TEACHER";
  const isStudent = userRole === "STUDENT";
  const canManage = isAdmin || isTeacher;
  const canGrade = isAdmin || isTeacher;

  // ✅ Lấy danh sách submissions của user hiện tại
  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from("submissions")
          .select("assignment_id")
          .eq("user_id", session.user.id);

        if (error) throw error;

        const submittedIds = new Set(data.map((s: any) => s.assignment_id));
        setUserSubmissions(submittedIds);
      } catch (error) {
        console.error("❌ Error fetching user submissions:", error);
      }
    };

    fetchUserSubmissions();
  }, [session?.user?.id]);

  // ✅ Thêm hasSubmitted vào assignment
  const assignmentsWithStatus = useMemo(() => {
    return assignments.map((a: any) => ({
      ...a,
      hasSubmitted: userSubmissions.has(a.id),
    }));
  }, [assignments, userSubmissions]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter(
      (a: any) => a.status === "pending",
    ).length;
    const submitted = assignments.filter(
      (a: any) => a.status === "submitted",
    ).length;
    const graded = assignments.filter((a: any) => a.status === "graded").length;
    const overdue = assignments.filter(
      (a: any) => new Date(a.due_date) < new Date() && a.status === "pending",
    ).length;
    const completedPercentage = total > 0 ? (graded / total) * 100 : 0;
    return { total, pending, submitted, graded, overdue, completedPercentage };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignmentsWithStatus.filter((item: any) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "Tất cả" || item.status === selectedStatus;
      const matchesType =
        selectedType === "Tất cả" || item.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assignmentsWithStatus, searchQuery, selectedStatus, selectedType]);

  const handleUpload = (assignment: any) => {
    if (userSubmissions.has(assignment.id)) {
      toast.info("Bạn đã nộp bài tập này rồi");
      return;
    }
    if (new Date(assignment.due_date) < new Date()) {
      toast.error("Bài tập đã quá hạn nộp");
      return;
    }
    if (
      assignment.max_submissions &&
      assignment.submissions >= assignment.max_submissions
    ) {
      toast.error("Số lượng sinh viên đã đủ, không thể nộp thêm");
      return;
    }
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleViewDetail = (assignment: any) => {
    router.push(`/assignments/${assignment.id}`);
  };

  const handleGrade = (assignment: any) => {
    if (!canGrade) {
      toast.error("Bạn không có quyền chấm điểm");
      return;
    }
    setSelectedAssignment(assignment);
    setIsGradeModalOpen(true);
  };

  const handleCreateSuccess = () => {
    refresh();
    toast.success("Đã cập nhật danh sách bài tập");
  };

  const handleSubmitSuccess = () => {
    const fetchUserSubmissions = async () => {
      if (!session?.user?.id) return;
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select("assignment_id")
          .eq("user_id", session.user.id);

        if (error) throw error;
        const submittedIds = new Set(data.map((s: any) => s.assignment_id));
        setUserSubmissions(submittedIds);
      } catch (error) {
        console.error("❌ Error fetching user submissions:", error);
      }
    };
    fetchUserSubmissions();
    refresh();
    toast.success("Đã cập nhật danh sách bài tập");
  };

  const handleGradeSuccess = () => {
    refresh();
    toast.success("Đã cập nhật danh sách bài tập");
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <AssignmentSkeleton key={i} viewMode="grid" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* ✅ Hero - Chỉ hiển thị 1 lần */}
          <AssignmentHero
            totalAssignments={stats.total}
            pendingCount={stats.pending}
            submittedCount={stats.submitted}
            gradedCount={stats.graded}
            overdueCount={stats.overdue}
            completedPercentage={stats.completedPercentage}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />

          {/* ✅ Filters */}
          <AssignmentFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            assignments={assignments}
          />

          {/* ✅ List assignments - CHỈ 1 LẦN */}
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-destructive">{error}</p>
                <Button className="mt-4" onClick={refresh}>
                  Thử lại
                </Button>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Không có bài tập</h3>
                <p className="text-muted-foreground">
                  {searchQuery ||
                  selectedStatus !== "Tất cả" ||
                  selectedType !== "Tất cả"
                    ? "Không tìm thấy bài tập nào phù hợp"
                    : "Chưa có bài tập nào"}
                </p>
                {canManage && (
                  <Button
                    className="mt-4 gap-2"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" /> Tạo bài tập đầu tiên
                  </Button>
                )}
              </motion.div>
            ) : (
              filteredAssignments.map((assignment: any, index: number) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onViewDetail={handleViewDetail}
                  onUpload={handleUpload}
                  onGrade={canGrade ? handleGrade : undefined}
                  index={index}
                  viewMode={viewMode}
                  canGrade={canGrade}
                  isTeacher={canManage}
                />
              ))
            )}
          </motion.div>
        </div>
      </div>
      <Footer />

      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        onSuccess={handleSubmitSuccess}
      />

      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => {
          setIsGradeModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        onSuccess={handleGradeSuccess}
      />
    </>
  );
}
