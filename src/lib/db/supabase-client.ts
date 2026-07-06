// src/lib/db/supabase-client.ts
// Vai trò: Supabase client - CÓ LOG DEBUG

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
