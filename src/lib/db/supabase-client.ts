// src/lib/db/supabase-client.ts
// HOÀN CHỈNH - FIX 401 VÀ HỖ TRỢ ADMIN CLIENT

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
  console.log(
    "🔌 [Supabase] URL:",
    supabaseUrl ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
  );
  console.log(
    "🔑 [Supabase] Anon Key:",
    supabaseAnonKey ? "✅ Có" : "❌ Không",
  );
  console.log(
    "🔑 [Supabase] Service Key:",
    supabaseServiceKey && supabaseServiceKey.length > 20 ? "✅ Có" : "❌ Không",
  );
  console.log(
    "📏 [Supabase] Service Key length:",
    supabaseServiceKey?.length || 0,
  );
  console.log("🌍 [Supabase] Environment:", process.env.NODE_ENV);
}

// ============================================
// VALIDATION
// ============================================

if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is missing!");
}

if (!supabaseAnonKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!");
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

let adminClient: any = null;

try {
  if (supabaseServiceKey && supabaseServiceKey.length > 20) {
    console.log("🔧 [Supabase] Creating admin client...");

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

    console.log("✅ [Supabase] Admin client created successfully!");

    // ✅ Test admin connection ngay khi khởi tạo
    if (isDev) {
      adminClient
        .from("users")
        .select("count", { count: "exact", head: true })
        .then(({ error }: any) => {
          if (error) {
            console.warn("⚠️ [Supabase] Admin connection test failed:", error);
          } else {
            console.log("✅ [Supabase] Admin connection test passed!");
          }
        })
        .catch((err: any) => {
          console.warn("⚠️ [Supabase] Admin connection test error:", err);
        });
    }
  } else {
    console.warn("⚠️ [Supabase] Service Role Key not available!");
    console.warn("   → Admin operations will use regular client (RLS enabled)");
    console.warn(
      "   → Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables",
    );
  }
} catch (error: any) {
  console.error("❌ [Supabase] Failed to create admin client:", error);
  adminClient = null;
}

export const supabaseAdmin = adminClient || supabase;

// ============================================
// KIỂM TRA
// ============================================

export const isServiceRoleEnabled =
  !!supabaseServiceKey &&
  supabaseServiceKey.length > 20 &&
  adminClient !== null;

console.log("🔑 [Supabase] isServiceRoleEnabled:", isServiceRoleEnabled);
console.log("🔑 [Supabase] Using admin client:", adminClient !== null);

// ============================================
// EXPORT FUNCTIONS
// ============================================

export function getSupabaseClient(useAdmin: boolean = false) {
  if (useAdmin && isServiceRoleEnabled && adminClient) {
    if (isDev) console.log("🔑 [Supabase] Using ADMIN client");
    return adminClient;
  }
  if (isDev) console.log("🔑 [Supabase] Using REGULAR client");
  return supabase;
}

export function isAdminClientAvailable(): boolean {
  return isServiceRoleEnabled && adminClient !== null;
}

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
