// src/hooks/use-assignments.ts
// Vai trò: Lấy và quản lý dữ liệu bài tập từ database - BẢN HOÀN CHỈNH

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useCallback, useEffect, useState } from "react";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  due_date: string;
  status: "pending" | "submitted" | "graded";
  submissions: number;
  total_students: number;
  points: number;
  attachments: number;
  user_id: string;
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

export interface CreateAssignmentData {
  title: string;
  description: string;
  subject: string;
  type: string;
  due_date: string;
  points: number;
  total_students: number;
  user_id: string;
  attachments?: File[];
}

export interface SubmitAssignmentData {
  assignment_id: string;
  file: File;
  user_id: string;
}

interface UseAssignmentsReturn {
  assignments: Assignment[];
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  refreshSubmissions: () => void;
  createAssignment: (data: CreateAssignmentData) => Promise<Assignment | null>;
  submitAssignment: (data: SubmitAssignmentData) => Promise<boolean>;
  getAssignmentSubmissions: (assignmentId: string) => Promise<Submission[]>;
  gradeSubmission: (
    submissionId: string,
    grade: number,
    feedback: string,
  ) => Promise<boolean>;
  uploadFile: (file: File, assignmentId: string) => Promise<string | null>;
  getAssignmentDetail: (id: string) => Promise<Assignment | null>;
  downloadFile: (url: string, fileName: string) => Promise<void>;
}

export function useAssignments(): UseAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        console.warn("Supabase client not initialized");
        setAssignments([]);
        setError("Supabase client not initialized");
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) {
        console.error("Supabase error:", dbError);
        setError(dbError.message);
        setAssignments([]);
        setLoading(false);
        return;
      }

      setAssignments(data || []);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(err instanceof Error ? err.message : "Không thể tải bài tập");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try {
      if (!supabase) return;

      const { data, error: dbError } = await supabase
        .from("submissions")
        .select(
          `
          *,
          user:users(name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (dbError) {
        console.error("Supabase error:", dbError);
        return;
      }

      setSubmissions(data || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  }, []);

  const getAssignmentSubmissions = useCallback(
    async (assignmentId: string): Promise<Submission[]> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const { data, error: dbError } = await supabase
          .from("submissions")
          .select(
            `
          *,
          user:users(name, email)
        `,
          )
          .eq("assignment_id", assignmentId)
          .order("created_at", { ascending: false });

        if (dbError) {
          console.error("Supabase error:", dbError);
          throw new Error(dbError.message);
        }

        return data || [];
      } catch (err) {
        console.error("Error fetching submissions:", err);
        throw err;
      }
    },
    [],
  );

  const getAssignmentDetail = useCallback(
    async (id: string): Promise<Assignment | null> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const { data, error: dbError } = await supabase
          .from("assignments")
          .select("*")
          .eq("id", id)
          .single();

        if (dbError) {
          console.error("Supabase error:", dbError);
          throw new Error(dbError.message);
        }

        return data;
      } catch (err) {
        console.error("Error fetching assignment detail:", err);
        throw err;
      }
    },
    [],
  );

  const uploadFile = useCallback(
    async (file: File, assignmentId: string): Promise<string | null> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const bucketExists = buckets?.some((b) => b.name === "assignments");

          if (!bucketExists) {
            await supabase.storage.createBucket("assignments", {
              public: true,
            });
          }
        } catch (bucketError) {
          console.error("Bucket operation error:", bucketError);
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${assignmentId}/${Date.now()}.${fileExt}`;
        const filePath = `assignments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("assignments")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("assignments")
          .getPublicUrl(filePath);

        return urlData.publicUrl;
      } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
      }
    },
    [],
  );

  const downloadFile = useCallback(async (url: string, fileName: string) => {
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
    } catch (err) {
      console.error("Error downloading file:", err);
      throw err;
    }
  }, []);

  const createAssignment = useCallback(
    async (data: CreateAssignmentData): Promise<Assignment | null> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const newAssignment = {
          title: data.title,
          description: data.description,
          subject: data.subject,
          type: data.type,
          due_date: data.due_date,
          points: data.points,
          total_students: data.total_students,
          user_id: data.user_id,
          status: "pending",
          submissions: 0,
          attachments: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: created, error: dbError } = await supabase
          .from("assignments")
          .insert([newAssignment])
          .select()
          .single();

        if (dbError) {
          console.error("Supabase insert error:", dbError);
          throw new Error(dbError.message);
        }

        // Upload attachments if any
        if (data.attachments && data.attachments.length > 0 && created) {
          let uploadCount = 0;
          for (const file of data.attachments) {
            try {
              await uploadFile(file, created.id);
              uploadCount++;
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          }
          if (uploadCount > 0) {
            await supabase
              .from("assignments")
              .update({ attachments: uploadCount })
              .eq("id", created.id);
          }
        }

        await fetchAssignments();
        return created;
      } catch (err) {
        console.error("Error creating assignment:", err);
        throw err;
      }
    },
    [fetchAssignments, uploadFile],
  );

  const submitAssignment = useCallback(
    async (data: SubmitAssignmentData): Promise<boolean> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        // Kiểm tra xem đã nộp bài chưa
        const { data: existingSubmission, error: checkError } = await supabase
          .from("submissions")
          .select("id")
          .eq("assignment_id", data.assignment_id)
          .eq("user_id", data.user_id)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Check submission error:", checkError);
        }

        if (existingSubmission) {
          throw new Error("Bạn đã nộp bài tập này rồi!");
        }

        // Upload file
        const fileUrl = await uploadFile(data.file, data.assignment_id);
        if (!fileUrl) {
          throw new Error("Failed to upload file");
        }

        // Save submission record
        const { error: submissionError } = await supabase
          .from("submissions")
          .insert([
            {
              assignment_id: data.assignment_id,
              user_id: data.user_id,
              file_url: fileUrl,
              file_name: data.file.name,
              file_size: data.file.size,
              status: "PENDING",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (submissionError) {
          console.error("Submission record error:", submissionError);
          throw new Error(submissionError.message);
        }

        // Update assignment submissions count
        const { data: currentData } = await supabase
          .from("assignments")
          .select("submissions, status")
          .eq("id", data.assignment_id)
          .single();

        const newSubmissions = (currentData?.submissions || 0) + 1;
        const newStatus =
          currentData?.status === "pending" ? "submitted" : currentData?.status;

        await supabase
          .from("assignments")
          .update({
            submissions: newSubmissions,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.assignment_id);

        await Promise.all([fetchAssignments(), fetchSubmissions()]);
        return true;
      } catch (err) {
        console.error("Error submitting assignment:", err);
        throw err;
      }
    },
    [fetchAssignments, fetchSubmissions, uploadFile],
  );

  const gradeSubmission = useCallback(
    async (
      submissionId: string,
      grade: number,
      feedback: string,
    ): Promise<boolean> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const { error: dbError } = await supabase
          .from("submissions")
          .update({
            grade: grade,
            feedback: feedback,
            status: "APPROVED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", submissionId);

        if (dbError) {
          console.error("Supabase update error:", dbError);
          throw new Error(dbError.message);
        }

        await fetchSubmissions();
        return true;
      } catch (err) {
        console.error("Error grading submission:", err);
        throw err;
      }
    },
    [fetchSubmissions],
  );

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, [fetchAssignments, fetchSubmissions]);

  return {
    assignments,
    submissions,
    loading,
    error,
    refresh: fetchAssignments,
    refreshSubmissions: fetchSubmissions,
    createAssignment,
    submitAssignment,
    getAssignmentSubmissions,
    gradeSubmission,
    uploadFile,
    getAssignmentDetail,
    downloadFile,
  };
}
