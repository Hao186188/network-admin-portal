// src/app/(auth)/login/page.tsx
// Vai trò: Trang đăng nhập - HOÀN CHỈNH VỚI OAuth

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Sparkles,
    User,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: session, status, update } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"email" | "username">("email");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [mounted, setMounted] = useState(false);

  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const error = searchParams?.get("error");

  console.log("🔗 [Login] callbackUrl:", callbackUrl);
  console.log("🔗 [Login] window.location.origin:", window.location.origin);

  // ✅ Show error message if present
  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        "CredentialsSignin": "Email/Tên đăng nhập hoặc mật khẩu không đúng",
        "OAuthSignin": "Đăng nhập OAuth thất bại",
        "OAuthCallback": "Lỗi callback từ OAuth provider",
        "OAuthCreateAccount": "Không thể tạo tài khoản từ OAuth",
        "EmailCreateAccount": "Không thể tạo tài khoản với email",
        "Callback": "Lỗi callback",
        "OAuthAccountNotLinked": "Tài khoản này đã được liên kết với provider khác",
        "SessionRequired": "Vui lòng đăng nhập để tiếp tục",
        "Default": "Có lỗi xảy ra khi đăng nhập",
      };

      toast.error(errorMessages[error] || errorMessages.Default);
    }
  }, [error, toast]);

  // ✅ Convert callbackUrl to absolute URL on production
  const getAbsoluteCallbackUrl = (url: string) => {
    console.log("🔗 [Login] getAbsoluteCallbackUrl input:", url);

    // ✅ Nếu URL đã là absolute URL, return luôn
    if (url.startsWith("http://") || url.startsWith("https://")) {
      console.log("🔗 [Login] URL is already absolute:", url);
      return url;
    }

    // ✅ Nếu là relative URL, convert thành absolute
    const absoluteUrl = `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    console.log("🔗 [Login] Converted to absolute:", absoluteUrl);
    return absoluteUrl;
  };

  const absoluteCallbackUrl = getAbsoluteCallbackUrl(callbackUrl);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Kiểm tra nếu đang logout thì không redirect
  useEffect(() => {
    if (mounted && status === "authenticated" && session?.user) {
      const isLoggingOut = sessionStorage.getItem("isLoggingOut");
      if (isLoggingOut === "true") {
        sessionStorage.removeItem("isLoggingOut");
        return;
      }
      console.log("✅ Already logged in, redirecting to:", callbackUrl);
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl, mounted]);

  // ✅ Handle OAuth Login
  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      console.log(`🔐 Attempting OAuth login with ${provider}...`);
      await signIn(provider, {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (error: any) {
      console.error(`❌ ${provider} login error:`, error);
      toast.error(error?.message || `Đăng nhập với ${provider} thất bại`);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔐 Attempting login with:", formData.identifier.trim());

      const result = await signIn("credentials", {
        identifier: formData.identifier.trim(),
        password: formData.password,
        redirect: false,
        callbackUrl: absoluteCallbackUrl,
      });

      console.log("🔐 Login result:", result);

      if (result?.error) {
        console.error("❌ Login error:", result.error);
        toast.error("Email/Tên đăng nhập hoặc mật khẩu không đúng");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        console.log("🔄 Updating session after login...");
        const updatedSession = await update();
        console.log("✅ Session updated:", {
          role: updatedSession?.user?.role,
          name: updatedSession?.user?.name,
        });

        toast.success("Đăng nhập thành công!");
        sessionStorage.removeItem("isLoggingOut");

        const role = updatedSession?.user?.role?.toUpperCase() || "STUDENT";
        let redirectUrl = callbackUrl;

        if (role === "ADMIN" && callbackUrl === "/dashboard") {
          redirectUrl = "/admin";
        } else if (role === "TEACHER" && callbackUrl === "/dashboard") {
          redirectUrl = "/dashboard";
        }

        console.log(`🔀 Redirecting to: ${redirectUrl} (Role: ${role})`);

        // ✅ Convert redirectUrl thành absolute URL
        const getAbsoluteRedirectUrl = (url: string) => {
          console.log("🔀 [Login] getAbsoluteRedirectUrl input:", url);

          // ✅ Nếu URL đã là absolute URL, return luôn
          if (url.startsWith("http://") || url.startsWith("https://")) {
            console.log("🔀 [Login] URL is already absolute:", url);
            return url;
          }

          // ✅ Nếu là relative URL, convert thành absolute
          const absoluteUrl = `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
          console.log("🔀 [Login] Converted to absolute:", absoluteUrl);
          return absoluteUrl;
        };

        const finalUrl = getAbsoluteRedirectUrl(redirectUrl);
        console.log(`🔀 Final redirect URL: ${finalUrl}`);

        setTimeout(() => {
          window.location.href = finalUrl;
        }, 500);
      } else {
        toast.error("Đăng nhập thất bại, vui lòng thử lại");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-background rounded-2xl shadow-2xl p-8 border border-border">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-muted animate-pulse mx-auto mb-4" />
              <div className="h-8 w-32 bg-muted animate-pulse mx-auto mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  Đăng nhập
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Chào mừng trở lại Mạng 3 Hub
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setLoginType("email")}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    loginType === "email"
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("username")}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    loginType === "username"
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Tên đăng nhập
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {loginType === "email" ? "Email" : "Tên đăng nhập"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {loginType === "email" ? (
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <Input
                      type={loginType === "email" ? "email" : "text"}
                      placeholder={
                        loginType === "email"
                          ? "example@email.com"
                          : "Tên đăng nhập"
                      }
                      value={formData.identifier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          identifier: e.target.value,
                        })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Đăng nhập
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* ✅ OAuth Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              {/* ✅ OAuth Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isLoading}
                >
                  <FcGoogle className="w-5 h-5" />
                  <span className="flex-1 text-center">
                    Đăng nhập với Google
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={isLoading}
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="flex-1 text-center">
                    Đăng nhập với GitHub
                  </span>
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
