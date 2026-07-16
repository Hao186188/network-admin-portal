// src/lib/db/supabase-client.ts
// HOÀN CHỈNH - CÓ DEBUG CHO PRODUCTION

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
// DEBUG LOGS - HIỂN THỊ CẢ TRÊN LOCAL VÀ PRODUCTION
// ============================================

// ✅ Log trên cả local và production để debug
console.log(
  "🔌 [Supabase] URL:",
  supabaseUrl ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
);
console.log("🔑 [Supabase] Anon Key:", supabaseAnonKey ? "✅ Có" : "❌ Không");
console.log(
  "🔑 [Supabase] Service Key:",
  supabaseServiceKey && supabaseServiceKey.length > 20 ? "✅ Có" : "❌ Không",
);
console.log(
  "📏 [Supabase] Service Key length:",
  supabaseServiceKey?.length || 0,
);
console.log("🌍 [Supabase] Environment:", process.env.NODE_ENV);

// ============================================
// VALIDATION
// ============================================

if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is missing!");
}

if (!supabaseAnonKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!");
}

if (!supabaseServiceKey || supabaseServiceKey.length < 20) {
  console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing or invalid!");
  console.warn(
    "   → INSERT/UPDATE/DELETE operations will use regular client (RLS enabled)",
  );
  console.warn(
    "   → This may cause 'new row violates row-level security policy' errors",
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

console.log("✅ [Supabase] Regular client created");

// ============================================
// SUPABASE ADMIN CLIENT - DÙNG CHO INSERT/UPDATE/DELETE
// ============================================

// ✅ Tạo admin client với Service Role Key
let adminClient: any = null;
let adminClientError: string | null = null;

const createAdminClient = () => {
  // Kiểm tra service key
  if (!supabaseServiceKey || supabaseServiceKey.length < 20) {
    adminClientError = "Service Role Key is missing or invalid (length < 20)";
    console.warn("⚠️ [Supabase] Cannot create admin client:", adminClientError);
    return null;
  }

  try {
    console.log("🔧 [Supabase] Creating admin client...");

    const client = createClient(supabaseUrl, supabaseServiceKey, {
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

    console.log("✅ [Supabase] Admin client created successfully!");
    adminClientError = null;
    return client;
  } catch (error: any) {
    console.error("❌ [Supabase] Failed to create admin client:", error);
    adminClientError = error.message || "Unknown error";
    return null;
  }
};

adminClient = createAdminClient();

// ✅ Export admin client - NẾU KHÔNG CÓ, TRẢ VỀ supabase THƯỜNG
export const supabaseAdmin = adminClient || supabase;

// ============================================
// KIỂM TRA ADMIN CLIENT
// ============================================

export const isServiceRoleEnabled =
  !!supabaseServiceKey &&
  supabaseServiceKey.length > 20 &&
  adminClient !== null;

console.log("🔑 [Supabase] isServiceRoleEnabled:", isServiceRoleEnabled);
console.log("🔑 [Supabase] Using admin client:", adminClient !== null);

if (!isServiceRoleEnabled) {
  console.warn("⚠️ [Supabase] ADMIN CLIENT IS NOT AVAILABLE!");
  console.warn(
    "   → Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.",
  );
  console.warn("   → Current key length:", supabaseServiceKey?.length || 0);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

/**
 * Lấy Supabase client - tự động chọn admin nếu có service key
 */
export function getSupabaseClient(useAdmin: boolean = false) {
  if (useAdmin && isServiceRoleEnabled && adminClient) {
    console.log("🔑 [Supabase] Using ADMIN client");
    return adminClient;
  }
  console.log("🔑 [Supabase] Using REGULAR client");
  return supabase;
}

/**
 * Kiểm tra xem admin client có sẵn không
 */
export function isAdminClientAvailable(): boolean {
  return isServiceRoleEnabled && adminClient !== null;
}

/**
 * Lấy lỗi admin client nếu có
 */
export function getAdminClientError(): string | null {
  return adminClientError;
}

/**
 * Test admin connection
 */
export async function testAdminConnection() {
  if (!isServiceRoleEnabled || !adminClient) {
    console.warn("⚠️ [Supabase] Admin client not available");
    return false;
  }

  try {
    const { data, error } = await adminClient
      .from("users")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ [Supabase] Admin connection failed:", error);
      return false;
    }

    console.log("✅ [Supabase] Admin connection successful!");
    return true;
  } catch (error) {
    console.error("❌ [Supabase] Admin connection error:", error);
    return false;
  }
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default supabase;
