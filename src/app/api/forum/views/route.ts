// src/app/api/forum/views/route.ts
// Vai trò: API route increment views - dùng service_role key để bypass RLS

import { supabaseAdmin } from "@/lib/db/supabase-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    console.log("📊 [API] Incrementing views for post:", postId);

    // Lấy views hiện tại
    const { data: currentPost, error: fetchError } = await supabaseAdmin
      .from("forum_posts")
      .select("views")
      .eq("id", postId)
      .single();

    if (fetchError) {
      console.error("❌ [API] Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch post" },
        { status: 500 },
      );
    }

    const currentViews = currentPost?.views || 0;
    console.log("📊 [API] Current views:", currentViews);

    // Update views +1 (admin client bypass RLS và trigger)
    const { error: updateError } = await supabaseAdmin
      .from("forum_posts")
      .update({ views: currentViews + 1 })
      .eq("id", postId);

    if (updateError) {
      console.error("❌ [API] Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to increment views" },
        { status: 500 },
      );
    }

    console.log("✅ [API] Views incremented to:", currentViews + 1);
    return NextResponse.json({ success: true, views: currentViews + 1 });
  } catch (error) {
    console.error("❌ [API] Error in views API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
