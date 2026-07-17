// src/app/(auth)/register/hooks/useRegister.ts
// Vai trò: Hook xử lý logic đăng ký - FIX SESSION

"use client";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface RegisterFormData {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "TEACHER" | "STUDENT";
}

export function useRegister() {
  const router = useRouter();
  const { toast } = useToast();
  const { update } = useSession(); // ✅ Thêm update
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  // Validate form
  const validate = (): boolean => {
    if (!formData.username.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập");
      return false;
    }

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }

    // Phone format validation (Vietnam)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (!agreeTerms) {
      toast.error("Vui lòng đồng ý với điều khoản sử dụng");
      return false;
    }

    return true;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Kiểm tra số điện thoại admin
      const isAdminPhone = formData.phone.trim() === "0366017767";
      const finalRole = isAdminPhone ? "ADMIN" : formData.role;

      const response = await axios.post("/api/auth/register", {
        username: formData.username.trim(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: finalRole,
      });

      if (response.status === 201) {
        const roleMessage = isAdminPhone
          ? "🎉 Đăng ký thành công! Bạn được cấp quyền Admin."
          : finalRole === "TEACHER"
            ? "👨‍🏫 Đăng ký thành công! Bạn được cấp quyền Giáo viên."
            : "Đăng ký thành công! Vui lòng đăng nhập";

        toast.success(roleMessage);

        // ✅ Nếu đã đăng nhập, update session để nhận role mới
        await update();

        // ✅ Chuyển hướng đến login
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error: any) {
      console.error("❌ Register error:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  // Update form field
  const updateField = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
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
  };
}
