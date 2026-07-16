// src/lib/db/supabase-client.ts
// HOÀN CHỈNH - FIX 401 VÀ RLS TRÊN PRODUCTION

import { createClient } from "@supabase/supabase-js";

// ============================================
// ENVIRONMENT VARIABLES
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  "";

// ============================================
// DEBUG LOGS
// ============================================

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  console.log("🔌 Supabase URL:", supabaseUrl || "❌ Chưa cấu hình");
  console.log("🔑 Anon Key:", supabaseAnonKey ? "✅ Có" : "❌ Không");
  console.log(
    "🔑 Service Key:",
    supabaseServiceKey && supabaseServiceKey.length > 20 ? "✅ Có" : "❌ Không",
  );
}

// ============================================
// SUPABASE CLIENT THƯỜNG - DÙNG CHO SELECT
// ============================================

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-application-name": "network-admin-portal",
      apikey: supabaseAnonKey,
    },
  },
});

// ============================================
// SUPABASE ADMIN CLIENT - DÙNG CHO INSERT/UPDATE/DELETE
// BYPASS RLS
// ============================================

// ✅ Tạo admin client với Service Role Key
let adminClient: any = null;
let adminClientError: string | null = null;

if (supabaseServiceKey && supabaseServiceKey.length > 20) {
  try {
    adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          "x-application-name": "network-admin-portal-admin",
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      },
    });

    if (isDev) {
      console.log("✅ Admin client created successfully!");
    }
  } catch (error: any) {
    console.error("❌ Failed to create admin client:", error);
    adminClientError = error.message;
    adminClient = null;
  }
} else {
  if (isDev) {
    console.warn(
      "⚠️ Service Role Key not available! Admin operations will fail.",
    );
    console.warn(
      "   Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.",
    );
  }
  adminClientError = "Service Role Key is missing or invalid";
}

// ✅ Export admin client - NẾU KHÔNG CÓ, TRẢ VỀ supabase THƯỜNG
export const supabaseAdmin = adminClient || supabase;

// ============================================
// KIỂM TRA ADMIN CLIENT
// ============================================

export const isServiceRoleEnabled =
  !!supabaseServiceKey && supabaseServiceKey.length > 20;

/**
 * Kiểm tra xem admin client có thực sự hoạt động không
 */
export function isAdminClientAvailable(): boolean {
  return adminClient !== null && isServiceRoleEnabled;
}

/**
 * Lấy lỗi admin client nếu có
 */
export function getAdminClientError(): string | null {
  return adminClientError;
}

/**
 * Lấy Supabase client - tự động chọn admin nếu có service key
 */
export function getSupabaseClient(useAdmin: boolean = false) {
  if (useAdmin && isServiceRoleEnabled && adminClient) {
    return adminClient;
  }
  return supabase;
}

// ============================================
// TEST FUNCTIONS
// ============================================

/**
 * Kiểm tra kết nối với admin client
 */
export async function testAdminConnection() {
  if (!isServiceRoleEnabled || !adminClient) {
    console.warn("⚠️ Admin client not available");
    return false;
  }

  try {
    const { data, error } = await adminClient
      .from("users")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Admin connection failed:", error);
      return false;
    }

    console.log("✅ Admin connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Admin connection error:", error);
    return false;
  }
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default supabase;
