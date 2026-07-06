// scripts/update-password.js
// Vai trò: Cập nhật lại mật khẩu cho admin

const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePassword() {
  try {
    const email = "admin@cdngk.edu.vn";
    const newPassword = "admin123";

    console.log(`🔄 Updating password for ${email}...`);

    // Hash password mới
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log("🔐 New hash created");

    // Cập nhật
    const { data, error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", email)
      .select();

    if (error) {
      console.error("❌ Error updating password:", error.message);
      return;
    }

    console.log("✅ Password updated successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New password: ${newPassword}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

updatePassword();
