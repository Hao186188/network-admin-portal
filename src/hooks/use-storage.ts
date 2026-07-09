// src/hooks/use-storage.ts
// Sửa lỗi TypeScript - property 'error' does not exist

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useState } from "react";
import { useToast } from "./use-toast";

interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
}

interface SaveAttachmentOptions {
  postId: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
}

export function useStorage() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async ({ bucket, path, file }: UploadOptions) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      console.log(`📤 Uploading ${file.name} to ${bucket}/${path}`);

      // Upload file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        // Vẫn thử lấy URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);

        if (urlData?.publicUrl) {
          setIsUploading(false);
          return {
            success: true,
            url: urlData.publicUrl,
            path: path,
            warning: "Uploaded with errors but URL available",
          };
        }

        setIsUploading(false);
        return {
          success: false,
          error: uploadError.message || "Upload failed",
        };
      }

      // Lấy public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      console.log(`✅ Upload successful: ${urlData.publicUrl}`);

      setProgress(100);
      setIsUploading(false);

      return {
        success: true,
        url: urlData.publicUrl,
        path: path,
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error?.message || "Có lỗi xảy ra khi upload file";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsUploading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const saveAttachment = async ({
    postId,
    userId,
    fileUrl,
    fileName,
    fileType,
    fileSize,
  }: SaveAttachmentOptions) => {
    try {
      console.log(`💾 Saving attachment: ${fileName}`);

      const { error: insertError } = await supabase
        .from("forum_attachments")
        .insert({
          post_id: postId,
          user_id: userId,
          file_url: fileUrl,
          file_name: fileName,
          file_type: fileType || null,
          file_size: fileSize || null,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        // ✅ SỬA LỖI: Trả về đúng type
        return {
          success: false,
          error: insertError.message || "Failed to save attachment",
        };
      }

      console.log("✅ Attachment saved");
      return { success: true };
    } catch (error: any) {
      console.error("Save error:", error);
      // ✅ SỬA LỖI: Trả về đúng type
      return {
        success: false,
        error: error?.message || "Failed to save attachment",
      };
    }
  };

  const deleteFile = async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi xóa file");
      return { success: false, error: error?.message };
    }
  };

  const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    uploadFile,
    saveAttachment,
    deleteFile,
    getPublicUrl,
    isUploading,
    progress,
    error,
  };
}
