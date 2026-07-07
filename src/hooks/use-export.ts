// src/hooks/use-export.ts
// Vai trò: Xuất dữ liệu ra file CSV/Excel

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useCallback } from "react";

interface ExportData {
  assignment_id?: string;
  assignment_title?: string;
  from_date?: string;
  to_date?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "ALL";
}

export function useExport() {
  const exportSubmissionsToCSV = useCallback(async (data: ExportData = {}) => {
    try {
      // Xây dựng query
      let query = supabase
        .from("submissions")
        .select(
          `
          *,
          user:users(name, email),
          assignment:assignments(title, subject, type, due_date)
        `,
        )
        .order("created_at", { ascending: false });

      // Thêm filters
      if (data.assignment_id) {
        query = query.eq("assignment_id", data.assignment_id);
      }
      if (data.assignment_title) {
        query = query.ilike("assignment.title", `%${data.assignment_title}%`);
      }
      if (data.from_date) {
        query = query.gte("created_at", data.from_date);
      }
      if (data.to_date) {
        query = query.lte("created_at", data.to_date);
      }
      if (data.status && data.status !== "ALL") {
        query = query.eq("status", data.status);
      }

      const { data: submissions, error } = await query;

      if (error) {
        console.error("Export error:", error);
        throw error;
      }

      // Tạo CSV content
      const headers = [
        "STT",
        "Học sinh",
        "Email",
        "Bài tập",
        "Môn học",
        "File nộp",
        "Dung lượng",
        "Ngày nộp",
        "Trạng thái",
        "Điểm",
        "Nhận xét",
      ];

      const rows = submissions.map((sub, index) => [
        index + 1,
        sub.user?.name || "Unknown",
        sub.user?.email || "",
        sub.assignment?.title || "",
        sub.assignment?.subject || "",
        sub.file_name,
        formatFileSize(sub.file_size),
        new Date(sub.created_at).toLocaleString("vi-VN"),
        getStatusLabel(sub.status),
        sub.grade || "",
        sub.feedback || "",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Tạo và download file
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `danh-sach-bai-nop_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      return { success: true, count: submissions.length };
    } catch (error) {
      console.error("Export error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Export thất bại",
      };
    }
  }, []);

  const exportAssignmentsToCSV = useCallback(async () => {
    try {
      const { data: assignments, error } = await supabase
        .from("assignments")
        .select(
          `
          *,
          user:users(name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const headers = [
        "STT",
        "Tiêu đề",
        "Mô tả",
        "Môn học",
        "Loại",
        "Hạn nộp",
        "Trạng thái",
        "Số bài nộp",
        "Tổng sinh viên",
        "Điểm tối đa",
        "Người tạo",
      ];

      const rows = assignments.map((item, index) => [
        index + 1,
        item.title,
        item.description,
        item.subject,
        item.type,
        new Date(item.due_date).toLocaleString("vi-VN"),
        getAssignmentStatusLabel(item.status),
        item.submissions,
        item.total_students,
        item.points,
        item.user?.name || "Unknown",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `danh-sach-bai-tap_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      return { success: true, count: assignments.length };
    } catch (error) {
      console.error("Export error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Export thất bại",
      };
    }
  }, []);

  return {
    exportSubmissionsToCSV,
    exportAssignmentsToCSV,
  };
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ",
    APPROVED: "Đã chấm",
    REJECTED: "Cần sửa",
  };
  return statusMap[status] || status;
}

function getAssignmentStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Chưa nộp",
    submitted: "Đã nộp",
    graded: "Đã chấm",
  };
  return statusMap[status] || status;
}
