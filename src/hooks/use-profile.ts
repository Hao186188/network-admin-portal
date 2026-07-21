// src/hooks/use-profile.ts
// Vai trò: Hook quản lý profile - FIXED

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";

interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  role: string;
  student_id: string;
  specialties: string[];
  social_links?: {
    facebook: string;
    github: string;
    linkedin: string;
    twitter: string;
  };
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const initialFetchDoneRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    if (isFetchingRef.current || initialFetchDoneRef.current) {
      return;
    }

    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
      initialFetchDoneRef.current = true;
    } catch (error: any) {
      logger.error("Error fetching profile:", error);
      setError(error.message || "Có lỗi xảy ra");
      toast.error("Không thể tải thông tin profile");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    isFetchingRef.current = false;
    initialFetchDoneRef.current = false;
    setLoading(true);
    setProfile(null);
    setError(null);
    fetchProfile();
  }, [session?.user?.id]);

  // ✅ Sửa: Update profile và refresh session
  const updateProfile = useCallback(
    async (data: Partial<Profile>) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return false;
      }

      try {
        console.log("🔄 [Profile] ========== UPDATE STARTED ==========");
        console.log("🔄 [Profile] User ID:", session.user.id);
        console.log("🔄 [Profile] Data to update:", data);

        // ✅ Remove social_links from data if it exists (not in database schema)
        const { social_links, ...updateData } = data as any;

        // ✅ Build update object with only valid fields
        const validUpdateData: any = {
          updated_at: new Date().toISOString(),
        };

        // Only add fields that have values
        if (updateData.name !== undefined)
          validUpdateData.name = updateData.name;
        if (updateData.bio !== undefined) validUpdateData.bio = updateData.bio;
        if (updateData.phone !== undefined)
          validUpdateData.phone = updateData.phone;
        if (updateData.student_id !== undefined)
          validUpdateData.student_id = updateData.student_id;
        if (updateData.specialties !== undefined)
          validUpdateData.specialties = updateData.specialties;
        if (updateData.image !== undefined)
          validUpdateData.image = updateData.image;

        console.log("🔄 [Profile] Valid update data:", validUpdateData);

        // ✅ Validate session
        if (!session || !session.user) {
          console.error("❌ [Profile] Invalid session");
          toast.error("Phiên đăng nhập không hợp lệ");
          return false;
        }

        // ✅ Perform the update
        console.log("🔄 [Profile] Executing update...");
        console.log("🔄 [Profile] Table: users");
        console.log("🔄 [Profile] Filter: id =", session.user.id);
        console.log("🔄 [Profile] Data:", validUpdateData);

        // ✅ Try a simple test query first
        console.log("🔄 [Profile] Testing connection...");
        const { data: testData, error: testError } = await supabase
          .from("users")
          .select("id")
          .eq("id", session.user.id)
          .single();

        console.log("🔄 [Profile] Test query result:", testData);
        console.log("🔄 [Profile] Test query error:", testError);

        if (testError) {
          console.error("❌ [Profile] Cannot access user record:", testError);
          toast.error("Không thể truy cập thông tin người dùng");
          return false;
        }

        // ✅ Now perform the actual update
        console.log("🔄 [Profile] Performing update...");

        const { data: updateResultData, error: updateError } = await supabase
          .from("users")
          .update(validUpdateData)
          .eq("id", session.user.id);

        console.log("🔄 [Profile] Update result data:", updateResultData);
        console.log("🔄 [Profile] Update result error:", updateError);

        // ✅ Check for errors
        if (updateError) {
          console.error("❌ [Profile] ========== UPDATE FAILED ==========");
          console.error("❌ [Profile] Error object:", updateError);
          console.error("❌ [Profile] Error message:", updateError.message);
          console.error("❌ [Profile] Error code:", updateError.code);
          console.error("❌ [Profile] Error details:", updateError.details);
          console.error("❌ [Profile] Error hint:", updateError.hint);

          // Create a proper error message
          let errorMessage = "Có lỗi xảy ra khi cập nhật";
          if (updateError.message) {
            errorMessage = updateError.message;
          } else if (typeof updateError === "string") {
            errorMessage = updateError;
          } else if (
            updateError.toString &&
            updateError.toString() !== "[object Object]"
          ) {
            errorMessage = updateError.toString();
          }

          console.error("❌ [Profile] Throwing error:", errorMessage);
          throw new Error(errorMessage);
        }

        console.log("✅ [Profile] Update successful");

        // ✅ Cập nhật local state
        setProfile((prev) => (prev ? { ...prev, ...data } : null));

        // ✅ Cập nhật session để đồng bộ
        try {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              name: data.name || session.user.name,
              image: data.image || session.user.image,
            },
          });
          console.log("✅ [Profile] Session updated");
        } catch (sessionError: any) {
          console.warn(
            "⚠️ [Profile] Session update failed (non-critical):",
            sessionError,
          );
        }

        toast.success("Cập nhật profile thành công");
        return true;
      } catch (error: any) {
        // ✅ Safe error message extraction
        let errorMessage = "Có lỗi xảy ra";

        if (error) {
          if (typeof error === "string") {
            errorMessage = error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.toString && error.toString() !== "[object Object]") {
            errorMessage = error.toString();
          } else {
            errorMessage = JSON.stringify(error);
          }
        }

        console.error("❌ [Profile] ========== FINAL ERROR ==========");
        console.error("❌ [Profile] Error:", error);
        console.error("❌ [Profile] Error message:", errorMessage);
        console.error("❌ [Profile] Error type:", typeof error);
        logger.error("Error updating profile:", error);

        toast.error(errorMessage);
        return false;
      }
    },
    [session, updateSession, toast],
  );

  const refresh = useCallback(() => {
    isFetchingRef.current = false;
    initialFetchDoneRef.current = false;
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    refresh,
  };
}
