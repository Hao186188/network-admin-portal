// src/app/(routes)/assignments/page.tsx
// Vai trò: Trang quản lý bài tập - FIXED

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { useAssignments } from "@/hooks/use-assignments";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  FileText,
  Plus
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AssignmentCard } from "./components/AssignmentCard";
import { AssignmentFilters } from "./components/AssignmentFilters";
import { AssignmentHero } from "./components/AssignmentHero";
import { AssignmentSkeleton } from "./components/AssignmentSkeleton";
import { AssignmentStats } from "./components/AssignmentStats";
import { CreateAssignmentModal } from "./components/CreateAssignmentModal";
import { SubmitAssignmentModal } from "./components/SubmitAssignmentModal";

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
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  const filteredAssignments = assignments.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "Tất cả" || item.status === selectedStatus;
    const matchesType = selectedType === "Tất cả" || item.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // ✅ TÍNH TOÁN DỮ LIỆU THỰC TẾ
  const totalAssignments = assignments.length;
  const pendingCount = assignments.filter(
    (a: any) => a.status === "pending",
  ).length;
  const submittedCount = assignments.filter(
    (a: any) => a.status === "submitted",
  ).length;
  const gradedCount = assignments.filter(
    (a: any) => a.status === "graded",
  ).length;
  const completedPercentage =
    totalAssignments > 0 ? (gradedCount / totalAssignments) * 100 : 0;

  const handleUpload = (assignment: any) => {
    if (assignment.status === "submitted" || assignment.status === "graded") {
      toast.info("Bạn đã nộp bài tập này rồi");
      return;
    }
    if (new Date(assignment.due_date) < new Date()) {
      toast.error("Bài tập đã quá hạn nộp");
      return;
    }
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleViewDetail = (assignment: any) => {
    router.push(`/assignments/${assignment.id}`);
  };

  const handleCreateSuccess = () => {
    refresh();
    toast.success("Đã cập nhật danh sách bài tập");
  };

  const handleSubmitSuccess = () => {
    refresh();
    toast.success("Đã cập nhật danh sách bài tập");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* ✅ Hero Section - ĐÃ THÊM completedPercentage */}
          <AssignmentHero
            totalAssignments={totalAssignments}
            pendingCount={pendingCount}
            submittedCount={submittedCount}
            gradedCount={gradedCount}
            completedPercentage={completedPercentage}
            onSearch={handleSearch}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />

          {/* Stats */}
          <AssignmentStats assignments={assignments} loading={loading} />

          {/* Filters */}
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

          {/* Assignments Grid/List */}
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <AssignmentSkeleton key={i} viewMode={viewMode} />
              ))
            ) : error ? (
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
                {isTeacher && (
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
                  index={index}
                  viewMode={viewMode}
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
    </>
  );
}
