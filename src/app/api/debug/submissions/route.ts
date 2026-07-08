// src/app/api/debug/submissions/route.ts
// Vai trò: Debug API để kiểm tra dữ liệu submissions

import { supabase } from "@/lib/db/supabase-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      count: data?.length || 0,
      data: data,
      statuses: data?.map((s) => s.status) || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
