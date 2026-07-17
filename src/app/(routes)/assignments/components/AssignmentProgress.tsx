// src/app/(routes)/assignments/components/AssignmentProgress.tsx
// HOÀN CHỈNH - SỬA LỖI HIỂN THỊ

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBarFluid } from "@/components/ui/progress-bar-fluid";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Clock,
    FileText,
    UserCheck,
    Users,
    XCircle,
} from "lucide-react";

interface AssignmentProgressProps {
  submissions: number;
  totalStudents: number;
  maxSubmissions?: number;
  status?: "pending" | "submitted" | "graded";
  className?: string;
}

export function AssignmentProgress({
  submissions = 0,
  totalStudents = 0,
  maxSubmissions,
  status,
  className,
}: AssignmentProgressProps) {
  // ✅ Đảm bảo không âm và sử dụng totalStudents thay vì maxSubmissions
  const safeSubmissions = Math.max(0, submissions || 0);
  // ✅ Dùng totalStudents làm tổng số học sinh
  const safeTotalStudents = Math.max(0, totalStudents || 0);

  // ✅ Tính phần trăm dựa trên totalStudents
  const progress =
    safeTotalStudents > 0
      ? Math.round((safeSubmissions / safeTotalStudents) * 100)
      : 0;

  const isFull = maxSubmissions && safeSubmissions >= maxSubmissions;
  const remainingSlots = maxSubmissions
    ? Math.max(0, maxSubmissions - safeSubmissions)
    : 0;
  const notSubmitted = Math.max(0, safeTotalStudents - safeSubmissions);

  const getStatusColor = () => {
    if (isFull) return "from-yellow-500 to-orange-500";
    if (progress === 100) return "from-green-500 to-emerald-500";
    if (progress > 50) return "from-blue-500 to-cyan-500";
    return "from-cyan-500 to-blue-500";
  };

  const getStatusIcon = () => {
    if (isFull) return <Clock className="w-4 h-4 text-yellow-500" />;
    if (progress === 100)
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (progress > 50) return <UserCheck className="w-4 h-4 text-blue-500" />;
    return <Clock className="w-4 h-4 text-cyan-500" />;
  };

  const getStatusText = () => {
    if (isFull) return "Đã đủ số lượng";
    if (progress === 100) return "Tất cả đã nộp";
    if (progress > 50) return "Đang tiến triển tốt";
    if (progress > 0) return `${safeSubmissions}/${safeTotalStudents} đã nộp`;
    return "Chưa có ai nộp";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-2", className)}
    >
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            {/* Header - Hiển thị đúng số lượng */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Tiến độ nộp bài</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {safeSubmissions}/{safeTotalStudents}
                </span>
                {maxSubmissions && maxSubmissions > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Tối đa: {maxSubmissions}
                  </Badge>
                )}
                {isFull && (
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-0">
                    📊 Đã đủ
                  </Badge>
                )}
              </div>
            </div>

            {/* Progress Bar - Hiển thị đúng % */}
            <div className="space-y-1">
              <ProgressBarFluid
                value={progress}
                label={`${progress}%`}
                color={getStatusColor()}
              />
            </div>

            {/* Status Info - Đã nộp / Chưa nộp */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Đã nộp: {safeSubmissions}</span>
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>Chưa nộp: {notSubmitted}</span>
                </span>
                {maxSubmissions && maxSubmissions > 0 && (
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Users className="w-3 h-3" />
                    <span>Còn chỗ: {remainingSlots}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Progress Stats */}
            {progress > 0 && (
              <div className="flex items-center gap-4 pt-1">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r",
                      getStatusColor(),
                    )}
                  />
                </div>
                <span className="text-xs font-mono text-white/40">
                  {progress}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status badges - HIỂN THỊ ĐÚNG */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
          Đã nộp: {safeSubmissions}
        </Badge>
        <Badge variant="outline" className="text-xs border-red-500/20">
          <XCircle className="w-3 h-3 mr-1 text-red-500" />
          Chưa nộp: {notSubmitted}
        </Badge>
        {maxSubmissions && maxSubmissions > 0 && (
          <Badge variant="outline" className="text-xs border-yellow-500/20">
            <Users className="w-3 h-3 mr-1 text-yellow-500" />
            Còn chỗ: {remainingSlots}
          </Badge>
        )}
        {isFull && (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-0 animate-pulse">
            🔥 Đã đủ số lượng
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
