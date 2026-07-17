// src/app/api/assignments/update-total-students/route.ts
// API UPDATE TOTAL_STUDENTS CHO CÁC BÀI TẬP CŨ

import { supabaseAdmin } from "@/lib/db/supabase-client";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Lấy tất cả assignments có total_students = 0
    const { data: assignments, error } = await supabaseAdmin
      .from("assignments")
      .select("id")
      .eq("total_students", 0);

    if (error) throw error;

    // Lấy số lượng sinh viên thực tế (role = STUDENT)
    const { count: totalStudents, error: countError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "STUDENT");

    if (countError) throw countError;

    // Cập nhật tất cả assignments
    const studentCount = totalStudents || 7; // Default 7 nếu không có sinh viên nào

    let updatedCount = 0;
    for (const assignment of assignments || []) {
      const { error: updateError } = await supabaseAdmin
        .from("assignments")
        .update({
          total_students: studentCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assignment.id);

      if (updateError) throw updateError;
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật total_students = ${studentCount} cho ${updatedCount} assignments`,
    });
  } catch (error: any) {
    console.error("Error updating total_students:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
