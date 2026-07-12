// src/lib/db/supabase-client.ts
// SUPABASE CLIENT - HOÀN CHỈNH

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  "";

// Log để debug
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing!");
}

// Client cho frontend (dùng anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Client cho admin (dùng service role key - bypass RLS)
export const supabaseAdmin =
  supabaseServiceKey && supabaseServiceKey.length > 20
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : supabase;

export const isSupabaseEnabled = !!supabaseUrl && !!supabaseAnonKey;
export const isServiceRoleEnabled =
  !!supabaseServiceKey && supabaseServiceKey.length > 20;

console.log("🔑 isServiceRoleEnabled:", isServiceRoleEnabled);

// Test connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("lectures")
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
