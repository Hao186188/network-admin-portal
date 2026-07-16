// @ts-nocheck
// src/app/api/documents/download-folder/route.ts
// API TẢI XUỐNG TOÀN BỘ FOLDER DƯỚI DẠNG ZIP

import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db/supabase-client";
import JSZip from "jszip";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const { data: folderInfo, error: folderError } = await supabase
      .from("documents")
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
    const allFiles = [];

    const fetchFilesRecursive = async (parentId, currentPath) => {
      const { data: items, error } = await supabase
        .from("documents")
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

    // ✅ 3. Tạo ZIP
    const zip = new JSZip();

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

        // ✅ Lấy dữ liệu dưới dạng ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // ✅ Thêm vào ZIP
        zip.file(path, arrayBuffer);
        successCount++;

        console.log(
          `✅ [Download] Added: ${path} (${arrayBuffer.byteLength} bytes)`,
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
  } catch (error) {
    console.error("❌ [Download] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to download folder" },
      { status: 500 },
    );
  }
}
