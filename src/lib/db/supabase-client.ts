// src/lib/db/supabase-client.ts
// HOÀN CHỈNH - ĐẢM BẢO supabaseAdmin HOẠT ĐỘNG TRÊN PRODUCTION

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

// ============================================
// VALIDATION
// ============================================

if (!supabaseUrl) {
  console.warn("⚠️ NEXT_PUBLIC_SUPABASE_URL is missing!");
}

if (!supabaseAnonKey) {
  console.warn("⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!");
}

if (!supabaseServiceKey || supabaseServiceKey.length < 20) {
  console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing or invalid!");
  console.warn("   - INSERT/UPDATE/DELETE operations may fail due to RLS!");
}

if (isDev) {
  console.log(
    "🔌 Supabase URL:",
    supabaseUrl ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
  );
  console.log(
    "🔑 Supabase Anon Key:",
    supabaseAnonKey ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
  );
  console.log(
    "🔑 Service Role Key:",
    supabaseServiceKey && supabaseServiceKey.length > 20
      ? "✅ Đã cấu hình"
      : "❌ Chưa cấu hình",
  );
  console.log("📏 Service Role Key length:", supabaseServiceKey?.length || 0);
}

// ============================================
// SUPABASE CLIENT - DÙNG CHO SELECT (READ)
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
    },
  },
});

// ============================================
// SUPABASE ADMIN CLIENT - DÙNG CHO INSERT/UPDATE/DELETE
// Bypass RLS - CẦN SERVICE_ROLE_KEY
// ============================================

// ✅ Tạo supabaseAdmin với Service Role Key
// Nếu không có service key, vẫn tạo client nhưng sẽ báo lỗi rõ ràng
const createAdminClient = () => {
  if (!supabaseServiceKey || supabaseServiceKey.length < 20) {
    console.warn(
      "⚠️ Service Role Key not available! Admin client will fallback to regular client.",
    );
    console.warn("   → INSERT/UPDATE/DELETE may fail due to RLS.");
    console.warn(
      "   → Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.",
    );
    return supabase;
  }

  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          "x-application-name": "network-admin-portal-admin",
          apikey: supabaseServiceKey,
        },
      },
    });
  } catch (error) {
    console.error("❌ Failed to create admin client:", error);
    return supabase;
  }
};

export const supabaseAdmin = createAdminClient();

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const isSupabaseEnabled = !!supabaseUrl && !!supabaseAnonKey;
export const isServiceRoleEnabled =
  !!supabaseServiceKey && supabaseServiceKey.length > 20;

if (isDev) {
  console.log("🔑 isServiceRoleEnabled:", isServiceRoleEnabled);
  console.log("🔑 Using admin client:", supabaseAdmin !== supabase);
}

/**
 * Lấy Supabase client phù hợp
 * @param useAdmin - true để dùng admin client (bypass RLS), false để dùng regular client
 */
export function getSupabaseClient(useAdmin: boolean = false) {
  if (useAdmin && isServiceRoleEnabled) {
    return supabaseAdmin;
  }
  return supabase;
}

/**
 * Kiểm tra xem có đang dùng Service Role không
 */
export function isUsingServiceRole(): boolean {
  return isServiceRoleEnabled;
}

/**
 * Test kết nối Supabase
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Supabase connection test failed:", error);
      return false;
    }

    console.log("✅ Supabase connection test passed!");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection test error:", error);
    return false;
  }
}

/**
 * Test admin connection
 */
export async function testAdminConnection() {
  if (!isServiceRoleEnabled) {
    console.warn(
      "⚠️ Cannot test admin connection: Service Role Key not available",
    );
    return false;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Admin connection test failed:", error);
      return false;
    }

    console.log("✅ Admin connection test passed!");
    return true;
  } catch (error) {
    console.error("❌ Admin connection test error:", error);
    return false;
  }
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default supabase;
