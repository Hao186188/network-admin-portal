// src/app/api/documents/route.ts
// HOÀN CHỈNH - TẠO FOLDER & XÓA

import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST: TẠO FOLDER MỚI
// ============================================

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, parent_id, is_folder, category, subject, tags } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

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

    // Kiểm tra xem có phải folder không
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("is_folder, file_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    // Nếu là folder, xóa tất cả file bên trong
    if (doc.is_folder) {
      const { data: files } = await supabaseAdmin
        .from("documents")
        .select("file_url")
        .eq("parent_id", id);

      if (files && files.length > 0) {
        for (const file of files) {
          if (file.file_url) {
            const filePath = file.file_url.split("/").pop();
            if (filePath) {
              await supabaseAdmin.storage.from("documents").remove([filePath]);
            }
          }
        }
      }

      await supabaseAdmin.from("documents").delete().eq("parent_id", id);
    }

    // Xóa document
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

// ============================================
// PATCH: CẬP NHẬT DOCUMENT
// ============================================

export async function PATCH(req: NextRequest) {
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

    const body = await req.json();
    const { title, description, category, subject, tags, is_published } = body;

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (subject !== undefined) updates.subject = subject;
    if (tags !== undefined) updates.tags = tags;
    if (is_published !== undefined) updates.is_published = is_published;

    console.log(`📁 [API] Updating document ${id}:`, updates);

    const { data, error } = await supabaseAdmin
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ [API] Update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update document" },
        { status: 500 },
      );
    }

    console.log("✅ [API] Document updated:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
