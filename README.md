📚 MẠNG 3 HUB - TÀI LIỆU DỰ ÁN HOÀN CHỈNH
🎯 TỔNG QUAN DỰ ÁN
Mạng 3 Hub là nền tảng học tập hiện đại dành cho lớp Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang. Dự án được xây dựng với công nghệ Next.js 15, TypeScript, và TailwindCSS, mang đến trải nghiệm học tập tối ưu cho sinh viên, giảng viên và ban cán sự lớp.

📌 THÔNG TIN DỰ ÁN
Tên dự án: Mạng 3 Hub / Network Administration Class Portal

Giảng viên chủ nhiệm: Nguyễn Ngọc Thanh

Phát triển bởi: Võ Nhật Hào

Lớp: Quản trị Mạng 3

Trường: Cao đẳng Nghề Kiên Giang

Trạng thái: ✅ Đang phát triển

🚀 CÔNG NGHỆ SỬ DỤNG
FRONTEND
Framework: Next.js 16 (Turbopack)

Ngôn ngữ: TypeScript

UI Library: TailwindCSS, Shadcn UI

Animation: Framer Motion

Form Handling: React Hook Form, Zod

State Management: Zustand

Icons: Lucide React

BACKEND & DATABASE
Authentication: NextAuth.js (v4) - Custom Theme Provider

Database: JSON (hiện tại) / Supabase (sẵn sàng chuyển đổi)

API: Next.js API Routes

File Storage: Local (hiện tại) / Supabase Storage (sẵn sàng)

DEPLOYMENT
Hosting: Vercel

Version Control: Git, GitHub

CI/CD: Vercel Auto Deploy

📁 CẤU TRÚC THƯ MỤC

network-admin-portal/
├── src/
│ ├── app/
│ │ ├── (auth)/ # Authentication pages
│ │ │ ├── login/
│ │ │ ├── register/
│ │ │ └── forgot-password/
│ │ ├── (dashboard)/ # Dashboard layout
│ │ │ ├── dashboard/
│ │ │ └── layout.tsx
│ │ ├── (routes)/ # Main routes (30+ trang)
│ │ │ ├── about/
│ │ │ ├── announcements/
│ │ │ ├── assignments/
│ │ │ ├── cisco-lab/
│ │ │ ├── contact/
│ │ │ ├── courses/
│ │ │ ├── docker/
│ │ │ ├── documents/
│ │ │ ├── exams/
│ │ │ ├── faq/
│ │ │ ├── forum/
│ │ │ ├── iso/
│ │ │ ├── lectures/
│ │ │ ├── linux/
│ │ │ ├── network-automation/
│ │ │ ├── packet-tracer/
│ │ │ ├── profile/
│ │ │ ├── projects/
│ │ │ ├── python/
│ │ │ ├── schedule/
│ │ │ ├── software/
│ │ │ ├── source-code/
│ │ │ ├── submissions/
│ │ │ ├── terms/
│ │ │ └── vm/
│ │ ├── api/
│ │ │ └── auth/
│ │ │ ├── [...nextauth]/
│ │ │ ├── register/
│ │ │ ├── session/
│ │ │ └── _log/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── providers.tsx
│ │ └── globals.css
│ ├── components/
│ │ ├── animations/
│ │ │ └── fade-in.tsx
│ │ ├── cards/
│ │ │ └── feature-card.tsx
│ │ ├── common/
│ │ │ ├── animated-counter.tsx
│ │ │ ├── command-palette.tsx
│ │ │ ├── file-upload.tsx
│ │ │ ├── grid-pattern.tsx
│ │ │ ├── notifications.tsx
│ │ │ └── search.tsx
│ │ ├── features/
│ │ │ └── stats.tsx
│ │ ├── forms/
│ │ │ └── input-with-icon.tsx
│ │ ├── layout/
│ │ │ ├── footer.tsx
│ │ │ ├── navbar.tsx
│ │ │ └── navbar-client.tsx
│ │ ├── providers/
│ │ │ └── theme-provider.tsx
│ │ ├── sections/
│ │ │ └── hero-section.tsx
│ │ └── ui/
│ │ ├── badge.tsx
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── input.tsx
│ │ ├── skeleton.tsx
│ │ └── toast.tsx
│ ├── hooks/
│ │ ├── use-dashboard.ts
│ │ ├── use-sidebar.ts
│ │ ├── use-stats.ts
│ │ └── use-toast.ts
│ ├── lib/
│ │ ├── db/
│ │ │ ├── json-db.ts
│ │ │ └── supabase-client.ts
│ │ ├── auth.ts
│ │ └── utils.ts
│ ├── types/
│ │ └── next-auth.d.ts
│ └── proxy.ts # Thay thế middleware
├── data/
│ └── db.json # Database file
├── public/
├── scripts/
│ ├── create-admin.js
│ ├── check-user.js
│ └── test-password.js
├── .env.local
├── .env.example
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── README.md

🎨 TÍNH NĂNG CHÍNH
🔐 HỆ THỐNG XÁC THỰC
✅ Đăng nhập với Email/Password

✅ Đăng nhập với Google (OAuth)

✅ Đăng nhập với GitHub (OAuth)

✅ Đăng ký tài khoản mới

✅ Quên mật khẩu

✅ Đặt lại mật khẩu

✅ Phân quyền (Admin, Teacher, Student)

✅ Custom Theme Provider (không dùng next-themes)

📚 QUẢN LÝ HỌC TẬP
✅ Kho tài liệu với tìm kiếm và lọc

✅ Bài giảng video và slide

✅ Lịch học và lịch thi

✅ Bài tập và nộp bài

✅ Môn học và tiến độ

✅ Thông báo và tin tức

✅ Dashboard với dữ liệu thực tế

✅ Animated Counter cho stats

💬 CỘNG ĐỒNG
✅ Diễn đàn thảo luận

✅ Hỏi đáp và bình luận

✅ Chia sẻ dự án

✅ Chia sẻ source code

🛠️ CÔNG CỤ
✅ Kho phần mềm

✅ Kho ISO

✅ Kho VM

✅ Packet Tracer files

✅ Cisco Lab files

✅ Tài nguyên Linux

✅ Tài nguyên Windows Server

✅ Tài nguyên Docker

✅ Tài nguyên Python

✅ Network Automation

✅ Upload file với drag & drop

🎨 GIAO DIỆN
✅ Dark/Light Mode

✅ Responsive Design

✅ Glassmorphism effects

✅ Smooth animations (Framer Motion)

✅ Command Palette (⌘K)

✅ Search với phím tắt ⌘K

✅ Notifications real-time

✅ Animated stats counters

🚀 CÀI ĐẶT & CHẠY DỰ ÁN
YÊU CẦU HỆ THỐNG
Node.js 18+

npm hoặc yarn

CÀI ĐẶT
bash

# Clone repository

git clone https://github.com/YOUR_USERNAME/network-admin-portal.git
cd network-admin-portal

# Cài đặt dependencies

npm install

# Tạo file .env.local từ .env.example

cp .env.example .env.local

# Cập nhật biến môi trường trong .env.local

# NEXTAUTH_SECRET, NEXTAUTH_URL, v.v.

# Chạy development server

npm run dev
BUILD CHO PRODUCTION
bash

# Build

npm run build

# Chạy production server

npm run start
🔧 BIẾN MÔI TRƯỜNG
env

# App

NEXT_PUBLIC_APP_NAME="Mạng 3 Hub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (tùy chọn)

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# Database (Supabase - tùy chọn)

NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
DATABASE_URL=""
📦 DEPLOY LÊN VERCEL
CÁCH 1: QUA CLI
bash

# Cài đặt Vercel CLI

npm install -g vercel

# Đăng nhập

vercel login

# Deploy

vercel --prod
CÁCH 2: QUA GITHUB
Push code lên GitHub

Import repository vào Vercel

Thêm Environment Variables

Auto-deploy khi push

👥 TÀI KHOẢN MẶC ĐỊNH
Vai trò Email Mật khẩu
Admin admin@cdngk.edu.vn admin123
Teacher thanh.nn@cdngk.edu.vn admin123
Student hao.vn@cdngk.edu.vn admin123
🗺️ CÁC TRANG ĐÃ HOÀN THÀNH
Route Mô tả Trạng thái
/ Trang chủ ✅ Hoàn thành
/dashboard Dashboard ✅ Hoàn thành
/about Giới thiệu lớp ✅ Hoàn thành
/announcements Thông báo ✅ Hoàn thành
/assignments Bài tập ✅ Hoàn thành
/cisco-lab Cisco Lab ✅ Hoàn thành
/contact Liên hệ ✅ Hoàn thành
/courses Môn học ✅ Hoàn thành
/docker Docker ✅ Hoàn thành
/documents Tài liệu ✅ Hoàn thành
/exams Lịch thi ✅ Hoàn thành
/faq FAQ ✅ Hoàn thành
/forum Diễn đàn ✅ Hoàn thành
/iso Kho ISO ✅ Hoàn thành
/lectures Bài giảng ✅ Hoàn thành
/linux Linux ✅ Hoàn thành
/login Đăng nhập ✅ Hoàn thành
/network-automation Network Automation ✅ Hoàn thành
/packet-tracer Packet Tracer ✅ Hoàn thành
/profile Hồ sơ cá nhân ✅ Hoàn thành
/projects Dự án ✅ Hoàn thành
/python Python ✅ Hoàn thành
/register Đăng ký ✅ Hoàn thành
/reset-password Đặt lại mật khẩu ✅ Hoàn thành
/schedule Lịch học ✅ Hoàn thành
/software Kho phần mềm ✅ Hoàn thành
/source-code Source Code ✅ Hoàn thành
/submissions Nộp bài ✅ Hoàn thành
/terms Điều khoản ✅ Hoàn thành
/vm Kho VM ✅ Hoàn thành
/windows-server Windows Server ✅ Hoàn thành
🔧 CÁC LỖI ĐÃ FIX
✅ Hydration Error - Thêm suppressHydrationWarning

✅ Script Tag Error - Tối ưu Providers, custom Theme Context

✅ NextAuth 400 Bad Request - Đúng cấu trúc route handler

✅ Build Error useSession - Chuyển sang Client Component

✅ 500 Server Error - Xử lý session đúng cách

✅ Sidebar Collapse - Tối ưu responsive

✅ Icon Imports - Sử dụng icon đúng từ lucide-react

✅ Dark Mode - Custom Theme Context thay thế next-themes

✅ Search & Notifications - Hoạt động với phím tắt

📝 HƯỚNG DẪN PHÁT TRIỂN
THÊM TRANG MỚI
Tạo file trong src/app/(routes)/ hoặc src/app/(dashboard)/

Thêm component với "use client" nếu cần

Cập nhật navigation trong navbar.tsx

THÊM API MỚI
Tạo file trong src/app/api/

Export GET, POST, PUT, DELETE handlers

Sử dụng json-db.ts hoặc supabase-client.ts

THÊM COMPONENT MỚI
Tạo file trong thư mục components/ tương ứng

Export component với "use client" nếu cần

Import và sử dụng trong các trang

🔄 CHUYỂN ĐỔI TỪ JSON SANG SUPABASE

1. Tạo bảng trên Supabase
   sql
   -- Tạo bảng users
   CREATE TABLE users (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   password TEXT,
   role TEXT DEFAULT 'STUDENT',
   image TEXT,
   student_id TEXT,
   bio TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW()
   );

-- Tạo các bảng khác tương tự... 2. Cập nhật env
env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" 3. Cập nhật auth.ts
typescript
// Sử dụng supabase-client thay vì json-db
import { supabase } from "./db/supabase-client";
📄 GIẤY PHÉP
Dự án được phát triển cho mục đích học tập và sử dụng nội bộ tại Trường Cao đẳng Nghề Kiên Giang.

📞 LIÊN HỆ
Giảng viên: Nguyễn Ngọc Thanh

Developer: Võ Nhật Hào

Email: hao.vn@cdngk.edu.vn

🎯 KẾ HOẠCH PHÁT TRIỂN TIẾP THEO
GIAI ĐOẠN 1: HOÀN THIỆN CƠ BẢN ✅
Cấu trúc dự án

Components cơ bản

Authentication

Database JSON

Responsive design

Dark/Light mode

GIAI ĐOẠN 2: NÂNG CẤP (ĐANG THỰC HIỆN)
Chuyển sang Supabase

Thêm chức năng upload file lên cloud

Thêm bình luận và đánh giá

Thống kê và báo cáo

Tối ưu SEO

Real-time notifications

GIAI ĐOẠN 3: HOÀN THIỆN
Testing

Documentation

Deployment

Training

📌 LƯU Ý QUAN TRỌNG CHO NGƯỜI PHÁT TRIỂN

1. Theme Provider
   Không dùng next-themes nữa, đã thay bằng custom Theme Context

Theme được lưu trong localStorage với key theme

Hỗ trợ system, light, dark

2. Authentication
   Sử dụng NextAuth v4 với Credentials Provider

Session được lưu bằng JWT

Có phân quyền: ADMIN, TEACHER, STUDENT

3. Database
   Hiện tại dùng JSON (data/db.json)

Sẵn sàng chuyển sang Supabase

Các script trong scripts/ để quản lý user

4. Components Pattern
   use client cho tất cả component tương tác

Atomic Design: ui → common → layout → features

Shadcn UI cho components cơ bản

5. Styling
   TailwindCSS với dark mode

Custom CSS variables trong globals.css

Glassmorphism và gradient effects

© 2026 Mạng 3 Hub - Lớp Quản trị Mạng 3 - Trường Cao đẳng Nghề Kiên Giang

Dự án được phát triển với ❤️ bởi Võ Nhật Hào

"Kết nối tri thức - Làm chủ hệ thống mạng"
