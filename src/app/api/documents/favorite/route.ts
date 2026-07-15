// API để toggle favorite
// src/app/api/documents/favorite/route.ts
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();

    // Kiểm tra đã favorite chưa
    const { data: existing } = await supabaseAdmin
      .from("document_favorites")
      .select("id")
      .eq("document_id", documentId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (existing) {
      // Bỏ favorite
      await supabaseAdmin
        .from("document_favorites")
        .delete()
        .eq("id", existing.id);

      return NextResponse.json({ success: true, isFavorite: false });
    } else {
      // Thêm favorite
      await supabaseAdmin.from("document_favorites").insert({
        document_id: documentId,
        user_id: session.user.id,
      });

      return NextResponse.json({ success: true, isFavorite: true });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}
