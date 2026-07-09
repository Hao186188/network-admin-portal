// src/app/(auth)/register/components/RegisterForm.tsx
// Vai trò: Form đăng ký - FIXED

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    GraduationCap,
    Lock,
    Mail,
    Phone,
    Shield,
    User,
} from "lucide-react"; // ✅ Thêm Lock
import Link from "next/link";
import { useRegister } from "../hooks/useRegister";
import { RegisterInput } from "./RegisterInput";
import { RegisterPasswordStrength } from "./RegisterPasswordStrength";

export function RegisterForm() {
  const {
    formData,
    isLoading,
    showPassword,
    showConfirmPassword,
    agreeTerms,
    setAgreeTerms,
    setShowPassword,
    setShowConfirmPassword,
    updateField,
    handleSubmit,
  } = useRegister();

  const getFieldError = (field: string) => {
    return undefined;
  };

  return (
    <Card className="border-0 shadow-2xl">
      <CardContent className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Đăng ký tài khoản
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tham gia cộng đồng Mạng 3 Hub
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Tên đăng nhập */}
          <RegisterInput
            label="Tên đăng nhập"
            value={formData.username}
            onChange={(v) => updateField("username", v)}
            icon={User}
            required
            disabled={isLoading}
            placeholder="username"
            error={getFieldError("username")}
          />

          {/* Họ và tên */}
          <RegisterInput
            label="Họ và tên"
            value={formData.name}
            onChange={(v) => updateField("name", v)}
            icon={User}
            required
            disabled={isLoading}
            placeholder="Nguyễn Văn A"
          />

          {/* Email */}
          <RegisterInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(v) => updateField("email", v)}
            icon={Mail}
            required
            disabled={isLoading}
            placeholder="example@email.com"
          />

          {/* Số điện thoại */}
          <RegisterInput
            label="Số điện thoại"
            type="tel"
            value={formData.phone}
            onChange={(v) => updateField("phone", v)}
            icon={Phone}
            required
            disabled={isLoading}
            placeholder="0123456789"
          />

          {/* Mật khẩu */}
          <RegisterInput
            label="Mật khẩu"
            value={formData.password}
            onChange={(v) => updateField("password", v)}
            icon={Lock} // ✅ Đã import Lock
            required
            disabled={isLoading}
            showPasswordToggle
            placeholder="••••••••"
          />

          {/* Password Strength */}
          <RegisterPasswordStrength password={formData.password} />

          {/* Xác nhận mật khẩu */}
          <RegisterInput
            label="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={(v) => updateField("confirmPassword", v)}
            icon={Lock} // ✅ Đã import Lock
            required
            disabled={isLoading}
            showPasswordToggle
            placeholder="••••••••"
          />

          {/* Vai trò */}
          <div className="pt-2">
            <label className="text-sm font-medium mb-2 block">
              Bạn là <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField("role", "TEACHER")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.role === "TEACHER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
                disabled={isLoading}
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Giảng viên</span>
              </button>
              <button
                type="button"
                onClick={() => updateField("role", "STUDENT")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.role === "STUDENT"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
                disabled={isLoading}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm font-medium">Học sinh</span>
              </button>
            </div>
          </div>

          {/* Đồng ý điều khoản */}
          <div className="flex items-start gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAgreeTerms(!agreeTerms)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                agreeTerms
                  ? "bg-primary border-primary text-white"
                  : "border-border hover:border-primary/50"
              }`}
              disabled={isLoading}
            >
              {agreeTerms && <CheckCircle className="w-4 h-4" />}
            </button>
            <label className="text-sm text-muted-foreground cursor-pointer">
              Tôi đồng ý với{" "}
              <Link
                href="/terms"
                className="text-primary hover:underline font-medium"
                target="_blank"
              >
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline font-medium"
                target="_blank"
              >
                Chính sách bảo mật
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 group mt-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Đăng ký
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
