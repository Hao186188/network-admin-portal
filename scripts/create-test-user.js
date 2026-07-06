// scripts/create-test-user.js
// Vai trò: Tạo user test mới

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

async function createTestUser() {
  try {
    const email = "test@cdngk.edu.vn";
    const password = "test123";
    const name = "Test User";

    console.log(`🔄 Creating test user: ${email}...`);

    // Kiểm tra user đã tồn tại
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email);

    if (existing && existing.length > 0) {
      console.log("⚠️  User already exists, updating password...");
      await supabase
        .from("users")
        .update({ password: await bcrypt.hash(password, 12) })
        .eq("email", email);
      console.log("✅ Password updated!");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: name,
          email: email,
          password: hashedPassword,
          role: "STUDENT",
          student_id: "TEST001",
          bio: "Test user",
        },
      ])
      .select();

    if (error) {
      console.error("❌ Error creating user:", error.message);
      return;
    }

    console.log("✅ Test user created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Name: ${name}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

createTestUser();
