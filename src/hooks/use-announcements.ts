// src/hooks/use-announcements.ts
// Vai trò: Lấy và quản lý dữ liệu thông báo từ database

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useCallback, useEffect, useState } from "react";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  pinned: boolean;
  category: string;
  author: string;
  author_id?: string | null; // Cho phép null hoặc undefined
  views: number;
  comments: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  pinned: boolean;
  category: string;
  author: string;
  author_id?: string | null;
}

interface UseAnnouncementsReturn {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createAnnouncement: (
    data: CreateAnnouncementData,
  ) => Promise<Announcement | null>;
}

export function useAnnouncements(): UseAnnouncementsReturn {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        console.warn("Supabase client not initialized");
        setAnnouncements([]);
        setError("Supabase client not initialized");
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("announcements")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (dbError) {
        console.error("Supabase error:", dbError);
        setError(dbError.message);
        setAnnouncements([]);
        setLoading(false);
        return;
      }

      setAnnouncements(data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(err instanceof Error ? err.message : "Không thể tải thông báo");
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnnouncement = useCallback(
    async (data: CreateAnnouncementData): Promise<Announcement | null> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const newAnnouncement = {
          title: data.title.trim(),
          content: data.content.trim(),
          priority: data.priority || "medium",
          pinned: data.pinned || false,
          category: data.category || "Thông báo",
          author: data.author || "Admin",
          author_id: data.author_id || null,
          views: 0,
          comments: 0,
          likes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log("Creating announcement:", newAnnouncement);

        const { data: created, error: dbError } = await supabase
          .from("announcements")
          .insert([newAnnouncement])
          .select()
          .single();

        if (dbError) {
          console.error("Supabase insert error:", dbError);
          throw new Error(dbError.message);
        }

        if (!created) {
          throw new Error("No data returned after creation");
        }

        // Refresh list after creating
        await fetchAnnouncements();

        return created;
      } catch (err) {
        console.error("Error creating announcement:", err);
        throw err;
      }
    },
    [fetchAnnouncements],
  );

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    refresh: fetchAnnouncements,
    createAnnouncement,
  };
}
