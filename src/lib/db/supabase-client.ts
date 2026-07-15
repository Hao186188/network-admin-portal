// src/lib/db/supabase-client.ts
// HOÀN CHỈNH - CÓ FALLBACK CHO PRODUCTION

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
    "🔌 Supabase URL:",
    supabaseUrl ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
  );
  console.log(
    "🔑 Supabase Anon Key:",
    supabaseAnonKey ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
  );
  console.log(
    "🔑 Supabase Service Role Key:",
    supabaseServiceKey ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
  );
  console.log("🔑 Service Role Key length:", supabaseServiceKey?.length || 0);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing!");
}

// ============================================
// SUPABASE CLIENTS
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

// ✅ QUAN TRỌNG: Fallback cho production nếu thiếu service key
export const supabaseAdmin =
  supabaseServiceKey && supabaseServiceKey.length > 20
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            "x-application-name": "network-admin-portal-admin",
          },
        },
      })
    : supabase; // ✅ Fallback về supabase thường

export const isSupabaseEnabled = !!supabaseUrl && !!supabaseAnonKey;
export const isServiceRoleEnabled =
  !!supabaseServiceKey && supabaseServiceKey.length > 20;

if (isDev) {
  console.log("🔑 isServiceRoleEnabled:", isServiceRoleEnabled);
}

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

export function getSupabaseClient(useAdmin: boolean = false) {
  return useAdmin && isServiceRoleEnabled ? supabaseAdmin : supabase;
}

export function isUsingServiceRole(): boolean {
  return isServiceRoleEnabled;
}
