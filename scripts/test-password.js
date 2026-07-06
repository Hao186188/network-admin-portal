// scripts/test-password.js
// Vai trò: Kiểm tra mật khẩu có đúng không

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

async function testPassword() {
  try {
    const email = "admin@cdngk.edu.vn";
    const password = "admin123";

    console.log(`🔄 Testing password for ${email}...`);

    // Lấy user
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("❌ Error:", error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log("❌ User not found!");
      return;
    }

    const user = data[0];
    console.log("👤 User found:", user.email);
    console.log(
      "🔑 Stored hash:",
      user.password ? user.password.substring(0, 30) + "..." : "No password",
    );

    if (!user.password) {
      console.log("❌ User has no password stored!");
      return;
    }

    // Test so sánh
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password match: ${isValid ? "✅ YES" : "❌ NO"}`);

    if (isValid) {
      console.log("✅ Password is correct!");
    } else {
      console.log("❌ Password is incorrect!");
      console.log("💡 Try re-hashing the password.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testPassword();
