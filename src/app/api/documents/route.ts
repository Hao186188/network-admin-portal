// src/app/api/documents/route.ts
// API ROUTE CHO DOCUMENTS - TẠO FOLDER & XÓA

import { authOptions } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST: TẠO FOLDER MỚI
// ============================================

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Kiểm tra session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 2. Lấy dữ liệu từ request
    const body = await req.json();
    const { title, parent_id, is_folder, category, subject, tags } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // ✅ 3. Sử dụng ADMIN client (bypass RLS)
    const supabaseAdmin = getSupabaseClient(true);

    const insertData = {
      title: title.trim(),
      is_folder: is_folder ?? true,
      parent_id: parent_id || null,
      file_type: "folder",
      file_size: 0,
      file_url: null,
      uploaded_by: session.user.id,
      uploaded_by_name: session.user.name || "Unknown",
      category: category || "Tài liệu",
      subject: subject || "Quản trị Mạng 3",
      tags: tags || [],
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("📁 [API] Creating folder:", insertData);

    const { data, error } = await supabaseAdmin
      .from("documents")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ [API] Create folder error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create folder" },
        { status: 500 },
      );
    }

    console.log("✅ [API] Folder created:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// ============================================
// DELETE: XÓA DOCUMENT
// ============================================

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 },
      );
    }

    const supabaseAdmin = getSupabaseClient(true);

    // ✅ Kiểm tra xem có phải folder không để xóa cả file bên trong
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("is_folder, file_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("❌ [API] Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    // ✅ Nếu là folder, xóa tất cả file bên trong
    if (doc.is_folder) {
      // Lấy tất cả file trong folder
      const { data: files, error: filesError } = await supabaseAdmin
        .from("documents")
        .select("file_url")
        .eq("parent_id", id);

      if (!filesError && files && files.length > 0) {
        // Xóa file trên storage
        for (const file of files) {
          if (file.file_url) {
            const filePath = file.file_url.split("/").pop();
            if (filePath) {
              await supabaseAdmin.storage.from("documents").remove([filePath]);
            }
          }
        }
      }

      // Xóa tất cả file trong folder
      await supabaseAdmin.from("documents").delete().eq("parent_id", id);
    }

    // ✅ Xóa document
    const { error } = await supabaseAdmin
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ [API] Delete error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete document" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
