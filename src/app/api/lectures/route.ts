// src/app/api/lectures/route.ts
// CẬP NHẬT - XÓA FOLDER VÀ NỘI DUNG BÊN TRONG

import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET: LẤY DANH SÁCH
// ============================================

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isTeacher = session.user.role === "TEACHER";
    const canView = isAdmin || isTeacher;

    if (!canView) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const { data, error } = await supabaseAdmin
        .from("lectures")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json(data);
    }

    const { data, error } = await supabaseAdmin
      .from("lectures")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("❌ [API] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================
// POST: TẠO FOLDER HOẶC BÀI GIẢNG
// ============================================

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const isFolder = formData.get("isFolder") === "true";
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const type = (formData.get("type") as string) || "document";
    const subject = (formData.get("subject") as string) || "Chưa phân loại";
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const teacher =
      (formData.get("teacher") as string) || session.user.name || "Giảng viên";
    const file = formData.get("file") as File | null;
    const parentId = formData.get("parentId") as string | null;

    // ✅ Nếu là folder
    if (isFolder) {
      const insertData = {
        title: title?.trim() || "Thư mục mới",
        description: description,
        is_folder: true,
        type: "folder",
        subject: subject,
        tags: tags,
        teacher: teacher,
        teacher_id: session.user.id,
        author_id: session.user.id,
        status: "approved",
        is_approved: true,
        is_published: true,
        sort_order: 0,
        parent_id: parentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: newFolder, error: insertError } = await supabaseAdmin
        .from("lectures")
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error("Insert folder error:", insertError);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 },
        );
      }

      return NextResponse.json(newFolder);
    }

    // ✅ Nếu là file upload
    let fileUrl = "";
    let fileSize = 0;
    let fileType = "";

    if (file) {
      const fileExt = file.name.split(".").pop() || "unknown";
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `lectures/${fileName}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage.from("lectures").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 },
        );
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("lectures")
        .getPublicUrl(filePath);
      fileUrl = urlData.publicUrl;
      fileSize = file.size;
      fileType = fileExt;
    }

    // ✅ Tạo bài giảng
    const insertData = {
      title: title?.trim() || "Bài giảng mới",
      description: description,
      type: type,
      subject: subject,
      tags: tags,
      teacher: teacher,
      teacher_id: session.user.id,
      author_id: session.user.id,
      file_url: fileUrl,
      file_size: fileSize,
      file_type: fileType,
      is_folder: false,
      views: 0,
      likes: 0,
      sort_order: 0,
      status: "approved",
      is_approved: true,
      is_published: true,
      parent_id: parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newLecture, error: insertError } = await supabaseAdmin
      .from("lectures")
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert lecture error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(newLecture);
  } catch (error: any) {
    console.error("❌ [API] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================
// PATCH: CẬP NHẬT
// ============================================

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (action === "view") {
      const { data: current, error: fetchError } = await supabaseAdmin
        .from("lectures")
        .select("views")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newViews = (current?.views || 0) + 1;
      const { error: updateError } = await supabaseAdmin
        .from("lectures")
        .update({ views: newViews })
        .eq("id", id);

      if (updateError) throw updateError;
      return NextResponse.json({ id, views: newViews });
    }

    if (action === "like") {
      const { data: current, error: fetchError } = await supabaseAdmin
        .from("lectures")
        .select("likes")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newLikes = (current?.likes || 0) + 1;
      const { error: updateError } = await supabaseAdmin
        .from("lectures")
        .update({ likes: newLikes })
        .eq("id", id);

      if (updateError) throw updateError;
      return NextResponse.json({ id, likes: newLikes });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("❌ [API] PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================
// DELETE: XÓA FOLDER VÀ TẤT CẢ NỘI DUNG
// ============================================

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    console.log(`🗑️ [API] Deleting: ${id}`);

    // ✅ 1. Lấy thông tin item
    const { data: item, error: fetchError } = await supabaseAdmin
      .from("lectures")
      .select("is_folder, file_url, parent_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("❌ [API] Fetch error:", fetchError);
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // ✅ 2. Nếu là folder, xóa tất cả nội dung bên trong
    if (item.is_folder) {
      console.log(`🗑️ [API] Deleting folder and all contents`);

      // Lấy tất cả file trong folder (đệ quy)
      const allFileIds: string[] = [];
      const allFileUrls: string[] = [];

      const collectFiles = async (folderId: string) => {
        const { data: children, error } = await supabaseAdmin
          .from("lectures")
          .select("id, is_folder, file_url")
          .eq("parent_id", folderId);

        if (error) {
          console.error("❌ [API] Error collecting files:", error);
          return;
        }

        for (const child of children || []) {
          if (child.is_folder) {
            await collectFiles(child.id);
          } else {
            allFileIds.push(child.id);
            if (child.file_url) {
              allFileUrls.push(child.file_url);
            }
          }
        }
      };

      await collectFiles(id);

      console.log(`🗑️ [API] Found ${allFileIds.length} files to delete`);

      // Xóa file trên storage
      for (const fileUrl of allFileUrls) {
        if (fileUrl && fileUrl.includes("/lectures/")) {
          const fileName = fileUrl.split("/").pop();
          if (fileName) {
            try {
              await supabaseAdmin.storage
                .from("lectures")
                .remove([`lectures/${fileName}`]);
              console.log(`🗑️ [API] Deleted file: ${fileName}`);
            } catch (error) {
              console.error(`❌ [API] Error deleting file: ${fileName}`, error);
            }
          }
        }
      }

      // Xóa tất cả file trong database
      if (allFileIds.length > 0) {
        const { error: deleteChildrenError } = await supabaseAdmin
          .from("lectures")
          .delete()
          .in("id", allFileIds);

        if (deleteChildrenError) {
          console.error(
            "❌ [API] Error deleting children:",
            deleteChildrenError,
          );
        }
      }

      // Xóa các folder con
      const { error: deleteFoldersError } = await supabaseAdmin
        .from("lectures")
        .delete()
        .eq("parent_id", id);

      if (deleteFoldersError) {
        console.error(
          "❌ [API] Error deleting subfolders:",
          deleteFoldersError,
        );
      }
    }

    // ✅ 3. Xóa item chính
    const { error } = await supabaseAdmin
      .from("lectures")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ [API] Delete error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete" },
        { status: 500 },
      );
    }

    console.log(`✅ [API] Deleted: ${id}`);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("❌ [API] DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
