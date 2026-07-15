// src/app/api/documents/upload-folder/route.ts
// FIXED: Sử dụng supabaseAdmin để bypass RLS

import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Map file extension to MIME type
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
    tar: "application/x-tar",
    gz: "application/gzip",
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
    ts: "application/typescript",
    html: "text/html",
    css: "text/css",
    json: "application/json",
    xml: "application/xml",
    yaml: "text/yaml",
    md: "text/markdown",
    py: "text/x-python",
    java: "text/x-java",
    c: "text/x-c",
    cpp: "text/x-c++",
    go: "text/x-go",
    rs: "text/x-rust",
    sh: "application/x-shellscript",
    bat: "application/x-bat",
    pkt: "application/octet-stream",
    pka: "application/octet-stream",
    cfg: "text/plain",
    conf: "text/plain",
    log: "text/plain",
    "": "application/octet-stream",
  };

  return mimeTypes[ext] || "application/octet-stream";
};

const SUPPORTED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "mp4",
  "mp3",
  "wav",
  "js",
  "ts",
  "jsx",
  "tsx",
  "html",
  "css",
  "json",
  "xml",
  "yaml",
  "md",
  "py",
  "java",
  "c",
  "cpp",
  "go",
  "rs",
  "sh",
  "bat",
  "pkt",
  "pka",
  "cfg",
  "conf",
  "log",
];

const isSupportedFile = (fileName: string): boolean => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return SUPPORTED_EXTENSIONS.includes(ext);
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Kiểm tra role
    if (!["ADMIN", "TEACHER"].includes(session.user.role || "")) {
      return NextResponse.json(
        { error: "Bạn không có quyền tải lên tài liệu" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { files, parentId } = body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Không có file nào được gửi lên" },
        { status: 400 },
      );
    }

    // Lọc file hợp lệ
    const validFiles = files.filter((f: any) => {
      const fileName = f.fileName || "";
      return isSupportedFile(fileName);
    });

    if (validFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không có file nào được hỗ trợ",
        },
        { status: 400 },
      );
    }

    const results = [];
    const folderCache = new Map<string, string>();

    // Helper để tạo folder - SỬ DỤNG supabaseAdmin
    const getOrCreateFolder = async (
      folderPath: string,
      parentId: string | null = null,
    ): Promise<string> => {
      const cacheKey = `${parentId || "root"}/${folderPath}`;
      if (folderCache.has(cacheKey)) {
        return folderCache.get(cacheKey)!;
      }

      const parts = folderPath.split("/").filter(Boolean);
      let currentParentId = parentId;
      let currentPath: string[] = [];

      for (const part of parts) {
        currentPath = [...currentPath, part];
        const pathStr = currentPath.join("/");
        const cacheKey = `${currentParentId || "root"}/${pathStr}`;

        if (folderCache.has(cacheKey)) {
          currentParentId = folderCache.get(cacheKey)!;
          continue;
        }

        // ✅ SỬ DỤNG supabaseAdmin để bypass RLS
        const { data: existing, error: checkError } = await supabaseAdmin
          .from("documents")
          .select("id")
          .eq("title", part)
          .eq("parent_id", currentParentId)
          .eq("is_folder", true)
          .maybeSingle();

        let folderId: string;

        if (existing) {
          folderId = existing.id;
        } else {
          // ✅ SỬ DỤNG supabaseAdmin để insert
          const { data: newFolder, error: createError } = await supabaseAdmin
            .from("documents")
            .insert({
              title: part,
              is_folder: true,
              parent_id: currentParentId,
              file_type: "folder",
              file_size: 0,
              uploaded_by: session.user.id,
              uploaded_by_name: session.user.name || "Unknown",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) {
            console.error("Create folder error:", createError);
            throw createError;
          }
          folderId = newFolder.id;
        }

        folderCache.set(cacheKey, folderId);
        currentParentId = folderId;
      }

      return currentParentId!;
    };

    // Xử lý từng file
    for (const fileData of validFiles) {
      const { file, fileName, folderPath } = fileData;

      try {
        // Tạo hoặc lấy folder cha
        let finalParentId = parentId;
        if (folderPath && folderPath.trim() !== "") {
          finalParentId = await getOrCreateFolder(folderPath, parentId);
        }

        const fileExt = fileName.split(".").pop() || "unknown";
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const storagePath = `${session.user.id}/${timestamp}-${random}.${fileExt}`;
        const mimeType = getMimeType(fileName);
        const buffer = Buffer.from(file, "base64");
        const fileSize = buffer.length;

        // ✅ Upload lên Storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from("documents")
          .upload(storagePath, buffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: mimeType,
          });

        if (uploadError) {
          console.error(`Upload error for ${fileName}:`, uploadError);
          results.push({
            success: false,
            file: fileName,
            error: uploadError.message,
          });
          continue;
        }

        const { data: urlData } = supabaseAdmin.storage
          .from("documents")
          .getPublicUrl(storagePath);

        // ✅ SỬ DỤNG supabaseAdmin để insert
        const { data: docRecord, error: dbError } = await supabaseAdmin
          .from("documents")
          .insert({
            title: fileName,
            description: `Uploaded from folder: ${folderPath || "Root"}`,
            file_type: fileExt,
            file_size: fileSize,
            file_url: urlData.publicUrl,
            parent_id: finalParentId,
            is_folder: false,
            uploaded_by: session.user.id,
            uploaded_by_name: session.user.name || "Unknown",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "Tài liệu",
            subject: "Quản trị Mạng 3",
            tags: [],
            is_published: true,
          })
          .select()
          .single();

        if (dbError) {
          console.error(`Database error for ${fileName}:`, dbError);
          results.push({
            success: false,
            file: fileName,
            error: dbError.message,
          });
          continue;
        }

        results.push({ success: true, file: fileName, id: docRecord.id });
      } catch (error: any) {
        console.error(`Error uploading ${fileName}:`, error);
        results.push({ success: false, file: fileName, error: error.message });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      results,
      total: results.length,
      successCount,
      failCount,
      message:
        failCount > 0
          ? `Tải lên: ${successCount} thành công, ${failCount} thất bại`
          : `Tải lên thành công ${successCount} file`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
