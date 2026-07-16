// src/app/api/lectures/route.ts
// API LECTURES - ĐÃ HOÀN CHỈNH BẢO MẬT & BYPASS RLS

import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET: LẤY DANH SÁCH HOẶC BÀI GIẢNG CHI TIẾT
// ============================================
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");

    const isAdmin = session.user.role === "ADMIN";
    const isTeacher = session.user.role === "TEACHER";
    const canModerate = isAdmin || isTeacher;

    if (id) {
      // Fetch bài giảng chi tiết
      let query = supabaseAdmin.from("lectures").select("*").eq("id", id);
      if (!canModerate) {
        query = query.eq("status", "approved");
      }
      const { data, error } = await query.single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json(data);
    }

    if (status === "pending") {
      if (!canModerate) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const { data, error } = await supabaseAdmin
        .from("lectures")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data || []);
    }

    // Fetch toàn bộ danh sách bài giảng
    let query = supabaseAdmin
      .from("lectures")
      .select("*")
      .order("created_at", { ascending: false });

    if (!canModerate) {
      query = query.eq("status", "approved");
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================
// POST: TẠO BÀI GIẢNG MỚI (HỖ TRỢ UPLOAD THUMBNAIL)
// ============================================
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string;
    const subject = formData.get("subject") as string;
    const duration = formData.get("duration") as string;
    const duration_minutes = parseInt(formData.get("duration_minutes") as string || "0");
    const teacher = formData.get("teacher") as string;
    const tags = JSON.parse(formData.get("tags") as string || "[]");
    const video_url = formData.get("video_url") as string;
    
    let thumbnailUrl = formData.get("thumbnail") as string || "";
    const thumbnailFile = formData.get("thumbnailFile") as File | null;

    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split(".").pop() || "unknown";
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `lectures/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("lectures")
        .upload(filePath, thumbnailFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload thumbnail file" }, { status: 500 });
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("lectures")
        .getPublicUrl(filePath);
      thumbnailUrl = urlData.publicUrl;
    }

    const insertData = {
      title: title?.trim() || "Bài giảng mới",
      description: description?.trim() || "",
      content: content?.trim() || "",
      type: type || "video",
      subject: subject || "",
      duration: duration || "",
      duration_minutes: duration_minutes || 0,
      date: new Date().toISOString().split("T")[0],
      teacher: teacher || session.user.name || "Giảng viên",
      teacher_id: session.user.id,
      author_id: session.user.id,
      tags: tags || [],
      video_url: video_url || "",
      thumbnail: thumbnailUrl || "",
      views: 0,
      likes: 0,
      sort_order: 0,
      status: "pending",
      is_approved: false,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newLecture, error: insertError } = await supabaseAdmin
      .from("lectures")
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message || "Failed to create lecture" }, { status: 500 });
    }

    return NextResponse.json(newLecture);
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// ============================================
// PATCH: CẬP NHẬT TRẠNG THÁI / LIKES / VIEWS / METADATA
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
      return NextResponse.json({ error: "Lecture ID is required" }, { status: 400 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isTeacher = session.user.role === "TEACHER";
    const canModerate = isAdmin || isTeacher;

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

    if (action === "approve") {
      if (!canModerate) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const body = await req.json();
      const { status, reason } = body;

      const updateData = {
        status,
        is_approved: status === "approved",
        is_published: status === "approved",
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
        rejection_reason: reason || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("lectures")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (action === "update") {
      if (!canModerate) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const body = await req.json();
      const { data } = body;

      const updateData: any = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        content: data.content?.trim(),
        type: data.type,
        subject: data.subject,
        duration: data.duration,
        duration_minutes: data.duration_minutes,
        teacher: data.teacher,
        tags: data.tags,
        video_url: data.video_url,
        thumbnail: data.thumbnail,
        updated_at: new Date().toISOString(),
      };

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { data: updated, error } = await supabaseAdmin
        .from("lectures")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// ============================================
// DELETE: XÓA BÀI GIẢNG
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
      return NextResponse.json({ error: "Lecture ID is required" }, { status: 400 });
    }

    // Xóa file ảnh trong storage trước
    const { data: lecture } = await supabaseAdmin
      .from("lectures")
      .select("thumbnail")
      .eq("id", id)
      .single();

    if (lecture?.thumbnail && lecture.thumbnail.includes("/lectures/")) {
      const fileName = lecture.thumbnail.split("/").pop();
      if (fileName) {
        await supabaseAdmin.storage.from("lectures").remove([`lectures/${fileName}`]);
      }
    }

    const { error } = await supabaseAdmin
      .from("lectures")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
