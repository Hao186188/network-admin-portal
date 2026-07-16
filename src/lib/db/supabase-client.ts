// src/lib/db/supabase-client.ts
// HOÀN CHỈNH - ĐẢM BẢO ADMIN CLIENT HOẠT ĐỘNG TRÊN MỌI MÔI TRƯỜNG

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

// ============================================
// SUPABASE CLIENT THƯỜNG
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
// SUPABASE ADMIN CLIENT - BYPASS RLS
// ============================================

let adminClient: any = null;

if (supabaseServiceKey && supabaseServiceKey.length > 20) {
  try {
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
  } catch (error: any) {
    console.error("❌ [Supabase] Failed to create admin client:", error);
    adminClient = null;
  }
} else {
  console.warn("⚠️ [Supabase] Service Role Key not available!");
  console.warn("   → INSERT/UPDATE/DELETE operations will fail on production!");
}

export const supabaseAdmin = adminClient || supabase;

export const isServiceRoleEnabled =
  !!supabaseServiceKey &&
  supabaseServiceKey.length > 20 &&
  adminClient !== null;

console.log("🔑 [Supabase] isServiceRoleEnabled:", isServiceRoleEnabled);
console.log("🔑 [Supabase] Using admin client:", adminClient !== null);

export default supabase;
