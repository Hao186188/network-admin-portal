// src/app/(routes)/assignments/components/AssignmentCard.tsx
// CẬP NHẬT - THÊM PROGRESS COMPONENT

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Clock,
  Eye,
  File,
  Pencil,
  Star,
  Trash2,
  Upload,
  Users,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { AssignmentProgress } from "./AssignmentProgress";
import { StatusBadge } from "./StatusBadge";

// ============================================
// TYPES
// ============================================

interface AssignmentCardProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    subject: string;
    type: string;
    due_date: string;
    status: "pending" | "submitted" | "graded";
    submissions: number;
    total_students: number;
    max_submissions?: number;
    points: number;
    attachments: number;
    attachment_urls?: string[];
    created_at: string;
    updated_at: string;
    student_name?: string;
    hasSubmitted?: boolean;
    userSubmissionId?: string;
  };
  onViewDetail: (assignment: any) => void;
  onUpload: (assignment: any) => void;
  onGrade?: (assignment: any) => void;
  onEdit?: (assignment: any) => void;
  onDelete?: (assignment: any) => void;
  index: number;
  viewMode: "grid" | "list";
  canGrade?: boolean;
  isTeacher?: boolean;
}

// ============================================
// STATUS CONFIG
// ============================================

const typeColors: Record<string, string> = {
  "Bài tập": "from-blue-500 to-blue-600",
  Lab: "from-cyan-500 to-cyan-600",
  "Dự án": "from-green-500 to-green-600",
  "Kiểm tra": "from-red-500 to-red-600",
  "Thực hành": "from-orange-500 to-orange-600",
};

const typeIcons: Record<string, any> = {
  "Bài tập": File,
  Lab: File,
  "Dự án": File,
  "Kiểm tra": File,
  "Thực hành": File,
};

// ============================================
// MAIN COMPONENT
// ============================================

export function AssignmentCard({
  assignment,
  onViewDetail,
  onUpload,
  onGrade,
  onEdit,
  onDelete,
  index,
  viewMode,
  canGrade = false,
  isTeacher = false,
}: AssignmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue =
    new Date(assignment.due_date) < new Date() &&
    assignment.status === "pending";

  const progress =
    assignment.submissions && assignment.total_students
      ? Math.round((assignment.submissions / assignment.total_students) * 100)
      : 0;

  const hasSubmitted = assignment.hasSubmitted || false;
  const isSubmitted = hasSubmitted;
  const isFull = !!(
    assignment.max_submissions &&
    assignment.submissions >= assignment.max_submissions
  );

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

  const TypeIcon = typeIcons[assignment.type] || File;
  const typeColor = typeColors[assignment.type] || "from-gray-500 to-gray-600";

  // ============================================
  // GRID VIEW
  // ============================================

  if (viewMode === "grid") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Card
          className={cn(
            "group h-full cursor-pointer overflow-hidden border-border/50 transition-all duration-300 relative",
            "hover:shadow-2xl hover:border-primary/30",
            isOverdue && "border-red-500/30 shadow-red-500/10",
            isSubmitted && "border-green-500/30 shadow-green-500/10",
            isFull && "border-yellow-500/30 shadow-yellow-500/10",
            isHovered && "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
          )}
          onClick={() => onViewDetail(assignment)}
        >
          {/* Cyber Border Glow Effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500",
              isHovered && "opacity-100",
            )}
            style={{
              boxShadow: `inset 0 0 40px ${
                isOverdue
                  ? "rgba(239,68,68,0.15)"
                  : isSubmitted
                    ? "rgba(34,197,94,0.15)"
                    : isFull
                      ? "rgba(234,179,8,0.15)"
                      : "rgba(6,182,212,0.15)"
              }`,
            }}
          />

          {/* Scan Line Effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scan" />
            </motion.div>
          )}

          <CardContent className="p-6 flex flex-col h-full relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg transition-transform duration-300",
                    typeColor,
                    isHovered && "scale-110",
                  )}
                >
                  <TypeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/30"
                  >
                    {assignment.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {assignment.subject}
                  </p>
                </div>
              </div>
              <StatusBadge
                status={assignment.status}
                isOverdue={isOverdue}
                size="sm"
                showPing={isOverdue}
              />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {assignment.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
              {assignment.description}
            </p>

            {/* ✅ Progress Component */}
            <div className="mb-4">
              <AssignmentProgress
                submissions={assignment.submissions}
                totalStudents={assignment.total_students}
                maxSubmissions={assignment.max_submissions}
                status={assignment.status}
              />
            </div>

            {/* Info */}
            <div className="space-y-1.5 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className={cn(isOverdue && "text-red-500 font-medium")}>
                  Hạn: {formatDate(assignment.due_date)}
                  {isOverdue && " ⚠️"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>
                  {assignment.submissions || 0}/{assignment.total_students || 0}{" "}
                  đã nộp
                  {isFull && (
                    <span className="ml-1 text-yellow-500 font-medium">
                      🔥 Đã đủ
                    </span>
                  )}
                </span>
              </div>
              {assignment.max_submissions && (
                <div className="flex items-center gap-2">
                  <UsersRound className="w-4 h-4 text-primary" />
                  <span>Giới hạn: {assignment.max_submissions} sinh viên</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>{assignment.points || 0} điểm</span>
              </div>
              {assignment.attachments > 0 && (
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-primary" />
                  <span>{assignment.attachments} file đính kèm</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto pt-4 border-t border-border">
              {isTeacher ? (
                <>
                  <Button
                    className="flex-1 gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpload(assignment);
                    }}
                    disabled={!!isSubmitted || !!isOverdue || !!isFull}
                    variant={
                      isSubmitted
                        ? "outline"
                        : isOverdue || isFull
                          ? "destructive"
                          : "default"
                    }
                  >
                    <Upload className="w-4 h-4" />
                    {isSubmitted
                      ? "Đã nộp"
                      : isOverdue
                        ? "Quá hạn"
                        : isFull
                          ? "Đã đủ"
                          : "Nộp bài"}
                  </Button>
                  {canGrade && onGrade && assignment.submissions > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGrade(assignment);
                      }}
                      title="Chấm điểm"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(assignment);
                      }}
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(assignment);
                      }}
                      title="Xóa bài tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(assignment);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="flex-1 gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpload(assignment);
                    }}
                    disabled={!!isSubmitted || !!isOverdue || !!isFull}
                    variant={
                      isSubmitted
                        ? "outline"
                        : isOverdue || isFull
                          ? "destructive"
                          : "default"
                    }
                  >
                    <Upload className="w-4 h-4" />
                    {isSubmitted
                      ? "Đã nộp"
                      : isOverdue
                        ? "Quá hạn"
                        : isFull
                          ? "Đã đủ"
                          : "Nộp bài"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(assignment);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {isOverdue && (
              <motion.div
                className="absolute -inset-0.5 rounded-2xl border-2 border-red-500/30 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {isFull && (
              <motion.div
                className="absolute -inset-0.5 rounded-2xl border-2 border-yellow-500/30 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ============================================
  // LIST VIEW
  // ============================================

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300 hover:shadow-xl border-border/50 hover:border-primary/30 relative",
          isOverdue && "border-red-500/30",
          isSubmitted && "border-green-500/30",
          isFull && "border-yellow-500/30",
        )}
        onClick={() => onViewDetail(assignment)}
      >
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="outline" className="text-xs border-primary/30">
                  {assignment.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-secondary/30"
                >
                  {assignment.subject}
                </Badge>
                <StatusBadge
                  status={assignment.status}
                  isOverdue={isOverdue}
                  size="sm"
                  showPing={isOverdue}
                />
                {isFull && (
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-0">
                    📊 Đã đủ
                  </Badge>
                )}
                {assignment.attachments > 0 && (
                  <Badge variant="outline" className="text-xs">
                    📎 {assignment.attachments} file
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {assignment.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {assignment.description}
              </p>

              {/* ✅ Progress Component - List View */}
              <div className="mt-3 max-w-md">
                <AssignmentProgress
                  submissions={assignment.submissions}
                  totalStudents={assignment.total_students}
                  maxSubmissions={assignment.max_submissions}
                  status={assignment.status}
                />
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-red-500 font-medium",
                  )}
                >
                  <Clock className="w-4 h-4 text-primary" />
                  {formatDate(assignment.due_date)}
                  {isOverdue && " ⚠️ Quá hạn"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-primary" />
                  {assignment.submissions || 0}/{assignment.total_students || 0}
                  {isFull && " ✅ Đã đủ"}
                </span>
                {assignment.max_submissions && (
                  <span className="flex items-center gap-1">
                    <UsersRound className="w-4 h-4 text-primary" />
                    Giới hạn: {assignment.max_submissions}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary" />
                  {assignment.points || 0} điểm
                </span>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              {isTeacher ? (
                <>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpload(assignment);
                    }}
                    disabled={!!isSubmitted || !!isOverdue || !!isFull}
                    variant={
                      isSubmitted
                        ? "outline"
                        : isOverdue || isFull
                          ? "destructive"
                          : "default"
                    }
                  >
                    <Upload className="w-4 h-4" />
                    {isSubmitted
                      ? "Đã nộp"
                      : isOverdue
                        ? "Quá hạn"
                        : isFull
                          ? "Đã đủ"
                          : "Nộp bài"}
                  </Button>
                  {canGrade && onGrade && assignment.submissions > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGrade(assignment);
                      }}
                    >
                      <Star className="w-4 h-4" />
                      Chấm
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(assignment);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                      Sửa
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(assignment);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(assignment);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpload(assignment);
                    }}
                    disabled={!!isSubmitted || !!isOverdue || !!isFull}
                    variant={
                      isSubmitted
                        ? "outline"
                        : isOverdue || isFull
                          ? "destructive"
                          : "default"
                    }
                  >
                    <Upload className="w-4 h-4" />
                    {isSubmitted
                      ? "Đã nộp"
                      : isOverdue
                        ? "Quá hạn"
                        : isFull
                          ? "Đã đủ"
                          : "Nộp bài"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(assignment);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
