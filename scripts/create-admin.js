// scripts/create-admin.js
// Vai trò: Tạo admin với password đã hash

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

async function createAdmin() {
  try {
    console.log("🔄 Creating admin...");

    // Kiểm tra user đã tồn tại
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", "admin@cdngk.edu.vn");

    if (existing && existing.length > 0) {
      console.log("⚠️  Admin already exists!");
      console.log("📧 Email: admin@cdngk.edu.vn");
      console.log("🔑 Password: admin123");
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);
    console.log("🔐 Password hashed successfully");

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: "Admin",
          email: "admin@cdngk.edu.vn",
          password: hashedPassword,
          role: "ADMIN",
          student_id: "ADMIN001",
          bio: "Quản trị viên hệ thống",
        },
      ])
      .select();

    if (error) {
      console.error("❌ Error creating admin:", error.message);
      return;
    }

    console.log("✅ Admin created successfully!");
    console.log("📧 Email: admin@cdngk.edu.vn");
    console.log("🔑 Password: admin123");
    console.log("🔐 Hash:", hashedPassword.substring(0, 20) + "...");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

createAdmin();
