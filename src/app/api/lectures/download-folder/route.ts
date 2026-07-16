// src/app/api/lectures/download-folder/route.ts
// API TẢI XUỐNG TOÀN BỘ FOLDER DƯỚI DẠNG ZIP - FIXED HOÀN TOÀN

import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import JSZip from "jszip";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isTeacher = session.user.role === "TEACHER";
    const canView = isAdmin || isTeacher;

    if (!canView) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const folderId = url.searchParams.get("folderId");

    if (!folderId) {
      return NextResponse.json(
        { error: "Missing folderId parameter" },
        { status: 400 },
      );
    }

    console.log(`📂 [Download] Fetching folder: ${folderId}`);

    // ✅ 1. Lấy thông tin folder
    const { data: folderInfo, error: folderError } = await supabaseAdmin
      .from("lectures")
      .select("id, title, parent_id")
      .eq("id", folderId)
      .eq("is_folder", true)
      .single();

    if (folderError || !folderInfo) {
      console.error("❌ [Download] Folder not found:", folderError);
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    console.log(`📂 [Download] Folder name: ${folderInfo.title}`);

    // ✅ 2. Lấy tất cả file trong folder (đệ quy)
    interface FileItem {
      path: string;
      file: {
        id: string;
        title: string;
        file_url: string;
        file_size: number;
        file_type: string;
      };
    }

    const allFiles: FileItem[] = [];

    const fetchFilesRecursive = async (
      parentId: string,
      currentPath: string,
    ) => {
      const { data: items, error } = await supabaseAdmin
        .from("lectures")
        .select("*")
        .eq("parent_id", parentId)
        .order("is_folder", { ascending: false })
        .order("title", { ascending: true });

      if (error) {
        console.error("❌ [Download] Error fetching items:", error);
        return;
      }

      for (const item of items || []) {
        if (item.is_folder) {
          const newPath = currentPath
            ? `${currentPath}/${item.title}`
            : item.title;
          await fetchFilesRecursive(item.id, newPath);
        } else {
          allFiles.push({
            path: currentPath ? `${currentPath}/${item.title}` : item.title,
            file: {
              id: item.id,
              title: item.title,
              file_url: item.file_url,
              file_size: item.file_size,
              file_type: item.file_type,
            },
          });
        }
      }
    };

    await fetchFilesRecursive(folderId, folderInfo.title);

    console.log(`📂 [Download] Found ${allFiles.length} files`);

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "Folder is empty" }, { status: 404 });
    }

    // ✅ 3. Tạo ZIP - SỬ DỤNG ANY CHO TOÀN BỘ
    const zip: any = new JSZip();

    // ✅ 4. Tải từng file và thêm vào ZIP
    let successCount = 0;
    let failCount = 0;

    for (const { path, file } of allFiles) {
      try {
        if (!file.file_url) {
          console.warn(`⚠️ [Download] No URL for file: ${file.title}`);
          failCount++;
          continue;
        }

        console.log(`⬇️ [Download] Downloading: ${path}`);

        const response = await fetch(file.file_url);
        if (!response.ok) {
          console.warn(
            `⚠️ [Download] Failed to download: ${file.title} (${response.status})`,
          );
          failCount++;
          continue;
        }

        // ✅ FIX: Sử dụng response.arrayBuffer() và truyền trực tiếp
        const arrayBuffer = await response.arrayBuffer();

        // ✅ FIX: Sử dụng Uint8Array để JSZip xử lý
        const uint8Array = new Uint8Array(arrayBuffer);

        // ✅ FIX: Thêm vào ZIP (sử dụng any nên không bị lỗi type)
        zip.file(path, uint8Array);
        successCount++;

        console.log(
          `✅ [Download] Added: ${path} (${uint8Array.length} bytes)`,
        );
      } catch (error) {
        console.error(`❌ [Download] Error downloading ${file.title}:`, error);
        failCount++;
      }
    }

    console.log(`📂 [Download] Success: ${successCount}, Failed: ${failCount}`);

    if (successCount === 0) {
      return NextResponse.json(
        { error: "No files could be downloaded" },
        { status: 500 },
      );
    }

    // ✅ 5. Tạo file ZIP
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });

    // ✅ 6. Trả về file ZIP
    const fileName = encodeURIComponent(`${folderInfo.title}.zip`);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename*=UTF-8''${fileName}`,
        "Content-Length": zipBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("❌ [Download] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to download folder" },
      { status: 500 },
    );
  }
}
