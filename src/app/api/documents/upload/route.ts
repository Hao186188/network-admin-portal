// src/app/api/documents/upload/route.ts
// API UPLOAD FILE ĐƠN - NÂNG CẤP FIX RLS

import { authOptions } from "@/lib/auth";
import { isServiceRoleEnabled, supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// CONSTANTS
// ============================================

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const SUPPORTED_EXTENSIONS = [
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "rtf",
  "odt",
  // Archives
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "bz2",
  "xz",
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "bmp",
  "ico",
  "tiff",
  "tif",
  // Videos
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "webm",
  "m4v",
  "3gp",
  // Audio
  "mp3",
  "wav",
  "aac",
  "flac",
  "ogg",
  "m4a",
  "wma",
  // Code
  "js",
  "ts",
  "jsx",
  "tsx",
  "html",
  "css",
  "json",
  "xml",
  "yaml",
  "yml",
  "md",
  "py",
  "java",
  "c",
  "cpp",
  "h",
  "hpp",
  "go",
  "rs",
  "sh",
  "bat",
  "ps1",
  // Network
  "pkt",
  "pka",
  "cfg",
  "conf",
  "log",
  // URL
  "url",
];

const isSupportedFile = (fileName: string): boolean => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return SUPPORTED_EXTENSIONS.includes(ext);
};

// ============================================
// MAIN API
// ============================================

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Kiểm tra session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 2. Lấy dữ liệu từ request (FormData)
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const category = (formData.get("category") as string) || "Tài liệu";
    const subject = (formData.get("subject") as string) || "Quản trị Mạng 3";
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const parentId = (formData.get("parentId") as string) || null;

    // ✅ 3. Validate file
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // ✅ 4. Kiểm tra kích thước file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File quá lớn. Tối đa ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          maxSize: MAX_FILE_SIZE,
        },
        { status: 400 },
      );
    }

    // ✅ 5. Kiểm tra định dạng file
    if (!isSupportedFile(file.name)) {
      return NextResponse.json(
        {
          error: `File "${file.name}" không được hỗ trợ`,
          supportedExtensions: SUPPORTED_EXTENSIONS,
        },
        { status: 400 },
      );
    }

    // ✅ 6. LOG để debug
    console.log("🔍 [API] Upload - Session user:", session.user.id);
    console.log("🔍 [API] Upload - File:", file.name, file.size);
    console.log(
      "🔍 [API] Upload - isServiceRoleEnabled:",
      isServiceRoleEnabled,
    );

    // ✅ 7. SỬ DỤNG supabaseAdmin TRỰC TIẾP (bypass RLS)
    const fileExt = file.name.split(".").pop() || "unknown";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    // ✅ Upload file lên Storage bằng supabaseAdmin
    const { error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ [API] Upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Failed to upload file" },
        { status: 500 },
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("documents")
      .getPublicUrl(filePath);

    console.log("✅ [API] Upload success:", urlData.publicUrl);

    // ✅ 8. Lưu metadata vào database bằng supabaseAdmin
    const insertData = {
      title: title || file.name,
      description: description,
      file_type: fileExt,
      file_size: file.size,
      file_url: urlData.publicUrl,
      category: category,
      subject: subject,
      tags: tags,
      parent_id: parentId,
      is_folder: false,
      is_published: true,
      uploaded_by: session.user.id,
      uploaded_by_name: session.user.name || "Unknown",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("documents")
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error("❌ [API] Database error:", dbError);
      // ✅ Rollback: Xóa file đã upload
      await supabaseAdmin.storage.from("documents").remove([filePath]);
      return NextResponse.json(
        { error: dbError.message || "Failed to save document" },
        { status: 500 },
      );
    }

    console.log("✅ [API] File saved:", dbData);
    return NextResponse.json(dbData);
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
