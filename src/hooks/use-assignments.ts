// src/hooks/use-assignments.ts
// HOÀN CHỈNH - XỬ LÝ LỖI INSERT

"use client";

import {
    isServiceRoleEnabled,
    supabase,
    supabaseAdmin,
} from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: "homework" | "project" | "quiz" | "exam";
  due_date: string;
  status: "pending" | "submitted" | "graded";
  submissions: number;
  total_students: number;
  max_submissions?: number;
  points: number;
  grade?: number;
  feedback?: string;
  attachments: number;
  attachment_urls: string[];
  user_id: string;
  created_by?: string;
  graded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  grade: number;
  feedback: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export function useAssignments() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const hasFetched = useRef(false);
  const isFetching = useRef(false);

  // ✅ Lấy danh sách bài tập với count thực tế
  const fetchAssignments = useCallback(async () => {
    if (hasFetched.current || isFetching.current) {
      logger.log("⏭️ Skip fetchAssignments - already fetched or fetching");
      return;
    }

    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("assignments")
        .select("*")
        .order("due_date", { ascending: true });

      if (fetchError) throw fetchError;

      // ✅ Đếm submissions thực tế cho mỗi assignment
      const assignmentsWithRealCount = await Promise.all(
        (data || []).map(async (assignment) => {
          const { count, error: countError } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true })
            .eq("assignment_id", assignment.id);

          return {
            ...assignment,
            submissions: countError ? assignment.submissions : (count || 0),
          };
        })
      );

      setAssignments(assignmentsWithRealCount);
      hasFetched.current = true;
    } catch (error: any) {
      logger.error("Error fetching assignments:", error);
      setError(error.message || "Có lỗi xảy ra");
      toast.error("Không thể tải bài tập");
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    if (session?.user?.id) {
      hasFetched.current = false;
      isFetching.current = false;
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const refresh = useCallback(() => {
    hasFetched.current = false;
    isFetching.current = false;
    fetchAssignments();
  }, [fetchAssignments]);

  const getAssignmentDetail = useCallback(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data as Assignment;
      } catch (error: any) {
        logger.error("Error fetching assignment detail:", error);
        toast.error(error.message || "Không thể tải chi tiết bài tập");
        return null;
      }
    },
    [toast],
  );

  const getAssignmentSubmissions = useCallback(
    async (assignmentId: string) => {
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select(
            `
          *,
          user:user_id(name, email)
        `,
          )
          .eq("assignment_id", assignmentId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Submission[];
      } catch (error: any) {
        logger.error("Error fetching submissions:", error);
        toast.error(error.message || "Không thể tải danh sách bài nộp");
        return [];
      }
    },
    [toast],
  );

  const downloadFile = useCallback(
    async (url: string, fileName: string) => {
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
        return true;
      } catch (error: any) {
        logger.error("Error downloading file:", error);
        toast.error(error.message || "Không thể tải file");
        return false;
      }
    },
    [toast],
  );

  // ✅ Tạo bài tập - FIX LỖI INSERT
  const createAssignment = useCallback(
    async (data: Partial<Assignment> & { max_submissions?: number }) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return null;
      }

      try {
        if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
          toast.error("Chỉ giảng viên và quản trị viên mới có thể tạo bài tập");
          return null;
        }

        console.log("📝 Creating assignment with data:", data);

        // ✅ Build insert data
        const insertData: any = {
          title: data.title,
          description: data.description || "",
          subject: data.subject,
          type: data.type || "homework",
          due_date: data.due_date,
          status: "pending",
          submissions: 0,
          total_students: data.total_students || 0,
          points: data.points || 0,
          attachments: data.attachments || 0,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (data.attachment_urls && data.attachment_urls.length > 0) {
          insertData.attachment_urls = data.attachment_urls;
        }

        if (data.max_submissions !== undefined && data.max_submissions > 0) {
          insertData.max_submissions = data.max_submissions;
        }

        console.log("📝 Insert data:", insertData);

        const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

        const { data: newAssignment, error } = await client
          .from("assignments")
          .insert(insertData)
          .select()
          .single();

        if (error) {
          logger.error("Insert error:", error);
          console.error("❌ Full error:", error);

          if (error.message?.includes("max_submissions")) {
            console.log("🔄 Retry without max_submissions...");
            delete insertData.max_submissions;

            const { data: retryData, error: retryError } = await client
              .from("assignments")
              .insert(insertData)
              .select()
              .single();

            if (retryError) throw retryError;

            setAssignments((prev) => [retryData, ...prev]);
            toast.success("Tạo bài tập thành công!");
            refresh();
            return retryData;
          }

          throw error;
        }

        setAssignments((prev) => [newAssignment, ...prev]);
        toast.success("Tạo bài tập thành công!");
        refresh();

        return newAssignment;
      } catch (error: any) {
        logger.error("Error creating assignment:", error);
        console.error("❌ Error creating assignment:", error);
        toast.error(error.message || "Có lỗi xảy ra khi tạo bài tập");
        return null;
      }
    },
    [session?.user, toast, refresh],
  );

  // ✅ Cập nhật bài tập - chỉ giảng viên & quản trị viên
  const updateAssignment = useCallback(
    async (id: string, data: Partial<Assignment>) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return null;
      }

      const role = session.user.role?.toUpperCase();
      if (role !== "TEACHER" && role !== "ADMIN") {
        toast.error(
          "Chỉ giảng viên và quản trị viên mới có thể chỉnh sửa bài tập",
        );
        return null;
      }

      try {
        const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

        const updateData: Partial<Assignment> = {
          ...data,
          updated_at: new Date().toISOString(),
        };

        const { data: updated, error } = await client
          .from("assignments")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        setAssignments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...updated } : a)),
        );
        toast.success("Cập nhật bài tập thành công!");
        refresh();

        return updated as Assignment;
      } catch (error: any) {
        logger.error("Error updating assignment:", error);
        toast.error(error.message || "Có lỗi xảy ra khi cập nhật bài tập");
        return null;
      }
    },
    [session?.user, toast, refresh],
  );

  // ✅ Xóa bài tập - chỉ giảng viên & quản trị viên (kèm dọn các bài nộp liên quan)
  const deleteAssignment = useCallback(
    async (id: string) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return false;
      }

      const role = session.user.role?.toUpperCase();
      if (role !== "TEACHER" && role !== "ADMIN") {
        toast.error("Chỉ giảng viên và quản trị viên mới có thể xóa bài tập");
        return false;
      }

      try {
        const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

        // Xóa các bài nộp liên quan trước để tránh dữ liệu mồ côi
        const { error: subError } = await client
          .from("submissions")
          .delete()
          .eq("assignment_id", id);

        if (subError) {
          logger.error("Error deleting related submissions:", subError);
        }

        const { error } = await client
          .from("assignments")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setAssignments((prev) => prev.filter((a) => a.id !== id));
        toast.success("Đã xóa bài tập");
        return true;
      } catch (error: any) {
        logger.error("Error deleting assignment:", error);
        toast.error(error.message || "Có lỗi xảy ra khi xóa bài tập");
        return false;
      }
    },
    [session?.user, toast],
  );

  const uploadFile = useCallback(
    async (file: File, path: string): Promise<string | null> => {
      try {
        const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

        console.log("📤 Uploading to:", path);

        const { data, error: uploadError } = await client.storage
          .from("assignments")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("❌ Upload error:", uploadError);

          if (client !== supabaseAdmin) {
            console.log("🔄 Retry with supabaseAdmin...");
            const { data: retryData, error: retryError } =
              await supabaseAdmin.storage
                .from("assignments")
                .upload(path, file, {
                  cacheControl: "3600",
                  upsert: true,
                });

            if (retryError) {
              throw new Error(
                `Không thể upload file: ${file.name} - ${retryError.message}`,
              );
            }

            const { data: urlData } = supabaseAdmin.storage
              .from("assignments")
              .getPublicUrl(path);

            return urlData.publicUrl;
          }

          throw new Error(
            `Không thể upload file: ${file.name} - ${uploadError.message}`,
          );
        }

        const { data: urlData } = client.storage
          .from("assignments")
          .getPublicUrl(path);

        return urlData.publicUrl;
      } catch (error: any) {
        console.error("❌ Upload error:", error);
        throw error;
      }
    },
    [],
  );

  const uploadFiles = useCallback(
    async (files: File[], assignmentId: string): Promise<string[]> => {
      const urls: string[] = [];
      let completed = 0;

      for (const file of files) {
        try {
          const path = `assignments/${assignmentId}/attachments/${Date.now()}_${file.name}`;
          const url = await uploadFile(file, path);
          if (url) {
            urls.push(url);
          }
          completed++;
          setUploadProgress((completed / files.length) * 100);
        } catch (error) {
          logger.error(`Failed to upload ${file.name}:`, error);
          toast.error(`Không thể upload file: ${file.name}`);
        }
      }

      setUploadProgress(0);
      return urls;
    },
    [uploadFile, toast],
  );

  // ✅ Nộp bài tập
  const submitAssignment = useCallback(
    async (data: { assignment_id: string; file: File; user_id: string }) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return false;
      }

      setIsSubmitting(true);
      try {
        const { assignment_id, file, user_id } = data;

        // ✅ Kiểm tra đã nộp chưa
        const { data: existing } = await supabase
          .from("submissions")
          .select("id")
          .eq("assignment_id", assignment_id)
          .eq("user_id", user_id)
          .maybeSingle();

        if (existing) {
          toast.error("Bạn đã nộp bài tập này rồi");
          return false;
        }

        // ✅ Kiểm tra giới hạn
        const { data: assignment } = await supabase
          .from("assignments")
          .select("max_submissions, submissions")
          .eq("id", assignment_id)
          .single();

        if (assignment?.max_submissions && assignment.max_submissions > 0) {
          if (assignment.submissions >= assignment.max_submissions) {
            toast.error("Số lượng sinh viên nộp bài đã đủ");
            return false;
          }
        }

        // ✅ Upload file
        const filePath = `assignments/${assignment_id}/submissions/${user_id}/${Date.now()}_${file.name}`;
        const fileUrl = await uploadFile(file, filePath);

        if (!fileUrl) {
          throw new Error("Không thể upload file");
        }

        // ✅ Tạo submission - TRIGGER TỰ TĂNG COUNT
        const { error: submitError } = await supabase
          .from("submissions")
          .insert({
            assignment_id,
            user_id,
            file_url: fileUrl,
            file_name: file.name,
            file_size: file.size,
            status: "PENDING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (submitError) throw submitError;

        // ✅ CẬP NHẬT COUNT THỦ CÔNG
        // Đếm số submissions thực tế và cập nhật vào assignments
        const { count: actualCount, error: countError } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("assignment_id", assignment_id);

        if (!countError && actualCount !== null) {
          await supabase
            .from("assignments")
            .update({
              submissions: actualCount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", assignment_id);
        }

        toast.success("Nộp bài thành công!");
        refresh();

        return true;
      } catch (error: any) {
        logger.error("Error submitting assignment:", error);
        toast.error(error.message || "Có lỗi xảy ra khi nộp bài");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [session?.user, toast, uploadFile, refresh],
  );

  return {
    assignments,
    loading,
    error,
    isSubmitting,
    uploadProgress,
    fetchAssignments,
    getAssignmentDetail,
    getAssignmentSubmissions,
    downloadFile,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    uploadFile,
    uploadFiles,
    refresh,
  };
}
