// src/app/api/documents/upload/route.ts
// FIXED - DÙNG ADMIN CLIENT CHO MỌI THAO TÁC

import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const SUPPORTED_EXTENSIONS = [
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
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "bz2",
  "xz",
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
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "webm",
  "m4v",
  "3gp",
  "mp3",
  "wav",
  "aac",
  "flac",
  "ogg",
  "m4a",
  "wma",
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
  "pkt",
  "pka",
  "cfg",
  "conf",
  "log",
  "url",
];

const isSupportedFile = (fileName: string): boolean => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return SUPPORTED_EXTENSIONS.includes(ext);
};

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Kiểm tra session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 2. Lấy dữ liệu từ request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const category = (formData.get("category") as string) || "Tài liệu";
    const subject = (formData.get("subject") as string) || "Quản trị Mạng 3";
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const parentId = (formData.get("parentId") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File quá lớn. Tối đa ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
          maxSize: MAX_FILE_SIZE,
          fileSize: file.size,
        },
        { status: 413 },
      );
    }

    if (!isSupportedFile(file.name)) {
      return NextResponse.json(
        {
          error: `File "${file.name}" không được hỗ trợ`,
          supportedExtensions: SUPPORTED_EXTENSIONS,
        },
        { status: 400 },
      );
    }

    console.log("🔍 [API] Upload - Session user:", session.user.id);
    console.log("🔍 [API] Upload - File:", file.name, file.size);

    // ✅ 3. Tạo tên file
    const fileExt = file.name.split(".").pop() || "unknown";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    // ✅ 4. Upload lên Storage - DÙNG supabaseAdmin
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
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

    // ✅ 5. Lưu metadata vào database - DÙNG supabaseAdmin
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

    console.log("🔍 [API] Insert data:", JSON.stringify(insertData, null, 2));

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("documents")
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error("❌ [API] Database error:", dbError);
      console.error("❌ [API] Database error code:", dbError.code);
      console.error("❌ [API] Database error details:", dbError.details);

      // Rollback: xóa file đã upload
      await supabaseAdmin.storage.from("documents").remove([filePath]);

      // ✅ Kiểm tra lỗi RLS
      if (
        dbError.code === "42501" ||
        dbError.message?.includes("row-level security")
      ) {
        return NextResponse.json(
          {
            error: "Lỗi bảo mật RLS. Vui lòng kiểm tra cấu hình database.",
            details: dbError.message,
            code: dbError.code,
          },
          { status: 403 },
        );
      }

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
