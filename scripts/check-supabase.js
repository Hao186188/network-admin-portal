// scripts/check-user.js
// Vai trò: Kiểm tra thông tin user trong database

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

async function checkUser() {
  try {
    console.log("🔄 Checking users in database...");

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, role, password");

    if (error) {
      console.error("❌ Error:", error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log("❌ No users found!");
      return;
    }

    console.log(`✅ Found ${data.length} users:`);
    data.forEach((user, index) => {
      console.log(`\n📋 User ${index + 1}:`);
      console.log(`  📧 Email: ${user.email}`);
      console.log(`  👤 Name: ${user.name}`);
      console.log(`  📋 Role: ${user.role}`);
      console.log(
        `  🔑 Password hash: ${user.password ? "Yes (length: " + user.password.length + ")" : "No password"}`,
      );
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkUser();
