// src/app/api/assignments/resync-count/route.ts
// API RESYNC SỐ LƯỢNG SUBMISSIONS

import { supabaseAdmin } from "@/lib/db/supabase-client";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Lấy tất cả assignments
    const { data: assignments, error } = await supabaseAdmin
      .from("assignments")
      .select("id");

    if (error) throw error;

    let updatedCount = 0;

    // Cập nhật từng assignment
    for (const assignment of assignments || []) {
      const { count, error: countError } = await supabaseAdmin
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("assignment_id", assignment.id);

      if (countError) throw countError;

      const { error: updateError } = await supabaseAdmin
        .from("assignments")
        .update({
          submissions: count || 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assignment.id);

      if (updateError) throw updateError;
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Đã resync ${updatedCount} assignments`,
    });
  } catch (error: any) {
    console.error("Error resyncing count:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
