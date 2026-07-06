// src/lib/db/supabase-client.ts
// Vai trò: Supabase client - THÊM CHECK KẾT NỐI

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Log để debug
console.log(
  "🔌 Supabase URL:",
  supabaseUrl ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
);
console.log(
  "🔑 Supabase Key:",
  supabaseAnonKey ? "✅ Đã cấu hình" : "❌ Chưa cấu hình",
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseEnabled = !!supabaseUrl && !!supabaseAnonKey;

// Test connection
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
