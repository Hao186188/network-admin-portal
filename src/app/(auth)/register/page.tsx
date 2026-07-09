// src/app/(auth)/register/page.tsx
// Vai trò: Trang đăng ký - HOÀN CHỈNH

"use client";

import { motion } from "framer-motion";
import { RegisterForm } from "./components/RegisterForm";
import { RegisterHero } from "./components/RegisterHero";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Hero Section */}
          <div className="hidden lg:block">
            <RegisterHero />
          </div>

          {/* Form Section */}
          <RegisterForm />
        </motion.div>

        {/* Mobile Hero - Hiển thị trên mobile */}
        <div className="lg:hidden mt-6">
          <RegisterHero />
        </div>
      </div>
    </div>
  );
}
