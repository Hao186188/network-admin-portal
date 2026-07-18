// src/lib/auth.ts
// HOÀN CHỈNH - THÊM CORS SUPPORT & OAuth

import { supabase } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// ✅ NEXTAUTH_URL CHO PRODUCTION
const NEXTAUTH_URL = process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

console.log("🔗 [Auth] NEXTAUTH_URL:", NEXTAUTH_URL);
console.log("🔗 [Auth] process.env.NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("🔗 [Auth] process.env.VERCEL_URL:", process.env.VERCEL_URL);
console.log("🔗 [Auth] NODE_ENV:", process.env.NODE_ENV);

function sanitizeIdentifier(input: string): string {
  return input
    .trim()
    .replace(/[^a-zA-Z0-9@._-]/g, "")
    .slice(0, 100);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Vui lòng nhập email/tên đăng nhập và mật khẩu");
          }

          const identifier = credentials.identifier.trim().toLowerCase();

          console.log("🔍 [Auth] Searching for user with identifier:", identifier);

          // ✅ Tìm user bằng email trước
          const { data: userByEmail, error: emailError } = await supabase
            .from("users")
            .select("*")
            .eq("email", identifier)
            .maybeSingle();

          console.log("🔍 [Auth] Search by email result:", userByEmail ? "Found" : "Not found");

          let user = userByEmail;

          // ✅ Nếu không tìm thấy bằng email, tìm bằng username
          if (!user && !emailError) {
            const { data: userByUsername, error: usernameError } = await supabase
              .from("users")
              .select("*")
              .eq("username", identifier)
              .maybeSingle();

            console.log("🔍 [Auth] Search by username result:", userByUsername ? "Found" : "Not found");

            if (usernameError) {
              console.error("❌ Username search error:", usernameError);
            }

            user = userByUsername;
          }

          if (emailError) {
            console.error("❌ Email search error:", emailError);
          }

          if (!user) {
            console.log("❌ [Auth] User not found for:", identifier);
            throw new Error("Email/Tên đăng nhập không tồn tại");
          }

          console.log("✅ [Auth] User found:", {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || "STUDENT",
          });

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            console.log("❌ [Auth] Invalid password for user:", user.username);
            throw new Error("Mật khẩu không đúng");
          }

          console.log("✅ [Auth] User logged in successfully:", {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || "STUDENT",
          });

          return {
            id: user.id,
            name: user.name || user.full_name || "User",
            email: user.email,
            username: user.username || "",
            role: user.role || "STUDENT",
            phone: user.phone || "",
            student_id: user.student_id || "",
            image: user.avatar || user.image || "",
          };
        } catch (error: any) {
          console.error("❌ Auth error:", error);
          throw new Error(error.message || "Đăng nhập thất bại");
        }
      },
    }),

    // ✅ Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // ✅ GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      // ✅ Lần đầu đăng nhập (credentials hoặc OAuth)
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username || "";
        token.role = user.role || "STUDENT";
        token.phone = user.phone || "";
        token.student_id = user.student_id || "";
        token.picture = user.image || "";

        console.log("🔄 [JWT] Initial token set with role:", token.role);
      }

      // ✅ Update session
      if (trigger === "update" && session?.user) {
        console.log("🔄 [JWT] Updating session with new data:", session.user);
        if (session.user.role) {
          token.role = session.user.role;
        }
        if (session.user.name) {
          token.name = session.user.name;
        }
        if (session.user.username) {
          token.username = session.user.username;
        }
        if (session.user.image) {
          token.picture = session.user.image;
        }
        console.log("🔄 [JWT] Token updated with role:", token.role);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.username = (token.username as string) || "";
        session.user.role = (token.role as string) || "STUDENT";
        session.user.phone = (token.phone as string) || "";
        session.user.student_id = (token.student_id as string) || "";
        session.user.image = (token.picture as string) || "";

        console.log("🔄 [Session] Updated session with role:", {
          id: session.user.id,
          username: session.user.username,
          role: session.user.role,
        });
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      // ✅ Xử lý đăng nhập lần đầu với OAuth
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          console.log(`🔐 OAuth login with ${account.provider}:`, user.email);

          // Kiểm tra user đã tồn tại chưa
          const { data: existingUser, error: findError } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();

          if (findError) {
            console.error("❌ Error finding user:", findError);
            return false;
          }

          // Nếu chưa có user, tạo mới
          if (!existingUser) {
            console.log("📝 Creating new user from OAuth...");

            const username = user.email?.split("@")[0] || `user_${Date.now()}`;
            const randomPassword = Math.random().toString(36).slice(-8);

            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert({
                username: username,
                name: user.name || username,
                email: user.email,
                password: await bcrypt.hash(randomPassword, 12),
                role: "STUDENT",
                avatar: user.image || "",
                is_verified: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (createError) {
              console.error("❌ Error creating user:", createError);
              return false;
            }

            // Cập nhật user id cho session
            user.id = newUser.id;
            user.role = newUser.role;
            user.username = newUser.username;

            console.log("✅ User created from OAuth:", newUser.id);
          } else {
            // User đã tồn tại, cập nhật thông tin nếu cần
            console.log("✅ User already exists:", existingUser.id);
            user.id = existingUser.id;
            user.role = existingUser.role;
            user.username = existingUser.username;

            // Cập nhật avatar nếu chưa có
            if (!existingUser.avatar && user.image) {
              await supabase
                .from("users")
                .update({
                  avatar: user.image,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existingUser.id);
            }
          }

          return true;
        } catch (error) {
          console.error("❌ OAuth signIn error:", error);
          return false;
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔀 [Auth] Redirect callback:", { url, baseUrl });

      // ✅ Nếu URL bắt đầu bằng /, return full URL
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log("🔀 [Auth] Redirecting to:", redirectUrl);
        return redirectUrl;
      }

      // ✅ Nếu URL cùng origin với baseUrl, return URL
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          console.log("🔀 [Auth] Redirecting to same origin:", url);
          return url;
        }
      } catch (e) {
        console.log("🔀 [Auth] Invalid URL, redirecting to baseUrl");
        return baseUrl;
      }

      // ✅ Default redirect to baseUrl
      console.log("🔀 [Auth] Default redirect to baseUrl:", baseUrl);
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "default-secret-change-in-production",
  debug: process.env.NODE_ENV === "development",
  // ✅ FIX PRODUCTION COOKIE CONFIG
  // Trên production (HTTPS), cookie cần prefix __Secure-
  // Trên development (HTTP), dùng prefix thường
  cookies: process.env.NODE_ENV === "production"
    ? {
        sessionToken: {
          name: `__Secure-next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
          },
        },
        callbackUrl: {
          name: `__Secure-next-auth.callback-url`,
          options: {
            sameSite: "lax",
            path: "/",
            secure: true,
          },
        },
        csrfToken: {
          name: `__Host-next-auth.csrf-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
          },
        },
      }
    : {
        sessionToken: {
          name: `next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: false,
          },
        },
        callbackUrl: {
          name: `next-auth.callback-url`,
          options: {
            sameSite: "lax",
            path: "/",
            secure: false,
          },
        },
        csrfToken: {
          name: `next-auth.csrf-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: false,
          },
        },
      },
};
