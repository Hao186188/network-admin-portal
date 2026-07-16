// src/app/api/documents/upload/route.ts
// HOÀN CHỈNH - UPLOAD FILE VỚI ADMIN CLIENT

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

const getMimeType = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    "7z": "application/x-7z-compressed",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    js: "application/javascript",
    json: "application/json",
    xml: "application/xml",
    yaml: "text/yaml",
    md: "text/markdown",
    py: "text/x-python",
    sh: "application/x-shellscript",
    bat: "application/x-bat",
    url: "text/plain",
    "": "application/octet-stream",
  };
  return mimeTypes[ext] || "application/octet-stream";
};

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
          suggestion:
            "Sử dụng chức năng kéo thả thư mục để upload file lớn hơn.",
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
    const mimeType = getMimeType(file.name);

    console.log("🔍 [API] Upload - MIME type:", mimeType);

    // ✅ 4. Upload lên Storage - DÙNG ADMIN CLIENT
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimeType,
      });

    if (uploadError) {
      console.error("❌ [API] Upload error:", uploadError);
      return NextResponse.json(
        {
          error: uploadError.message || "Failed to upload file",
          details: uploadError,
        },
        { status: 500 },
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("documents")
      .getPublicUrl(filePath);

    console.log("✅ [API] Upload success:", urlData.publicUrl);

    // ✅ 5. Lưu metadata vào database - DÙNG ADMIN CLIENT
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

      // Rollback: xóa file đã upload
      await supabaseAdmin.storage.from("documents").remove([filePath]);

      // ✅ Kiểm tra lỗi RLS
      if (dbError.code === "42501") {
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
        {
          error: dbError.message || "Failed to save document",
          code: dbError.code,
        },
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
