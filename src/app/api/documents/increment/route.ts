// src/app/api/documents/increment/route.ts
// API ĐỂ TĂNG COUNTER (views, downloads, rating)

import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/db/supabase-client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { document_id, type } = body;

    // View counter doesn't require authentication
    if (type !== "view" && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!document_id || !type) {
      return NextResponse.json(
        { error: "Document ID and type are required" },
        { status: 400 },
      );
    }

    if (!["view", "download", "rating"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'view', 'download', or 'rating'" },
        { status: 400 },
      );
    }

    // Get current document
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select(type === "rating" ? "rating_avg, rating" : type)
      .eq("id", document_id)
      .maybeSingle();

    // For view counter, always return success to avoid console errors
    if (type === "view") {
      if (fetchError || !doc) {
        console.warn(
          "⚠️ [API] View increment - document not found, returning success:",
          document_id,
        );
        return NextResponse.json({ success: true, views: 0 });
      }
    } else {
      // For other types (download, rating), require document to exist
      if (fetchError) {
        console.error("❌ [API] Fetch error:", fetchError);
        return NextResponse.json(
          { error: "Document not found", details: fetchError.message },
          { status: 404 },
        );
      }

      if (!doc) {
        console.warn("⚠️ [API] Document not found for increment:", document_id);
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 },
        );
      }
    }

    // Increment counter
    const fieldName =
      type === "view"
        ? "views"
        : type === "download"
          ? "downloads"
          : "rating_avg";
    const currentValue = doc[fieldName] || 0;
    const newValue = type === "rating" ? currentValue : currentValue + 1;

    const { error: updateError } = await supabaseAdmin
      .from("documents")
      .update({
        [fieldName]: newValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", document_id);

    if (updateError) {
      console.error("❌ [API] Increment error:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Failed to increment counter" },
        { status: 500 },
      );
    }

    console.log(
      `✅ [API] Incremented ${type} for document ${document_id}:`,
      newValue,
    );
    return NextResponse.json({ success: true, [fieldName]: newValue });
  } catch (error: any) {
    console.error("❌ [API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
