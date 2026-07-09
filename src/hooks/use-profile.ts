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
        const { error } = await supabase
          .from("users")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.user.id);

        if (error) throw error;

        // ✅ Cập nhật local state
        setProfile((prev) => (prev ? { ...prev, ...data } : null));

        // ✅ Cập nhật session để đồng bộ
        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: data.name || session.user.name,
            image: data.image || session.user.image,
          },
        });

        toast.success("Cập nhật profile thành công");
        return true;
      } catch (error: any) {
        logger.error("Error updating profile:", error);
        toast.error(error.message || "Có lỗi xảy ra");
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
