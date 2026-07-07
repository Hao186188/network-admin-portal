📚 Mạng 3 Hub - Tài liệu dự án hoàn chỉnh
🎯 TỔNG QUAN DỰ ÁN
Mạng 3 Hub là nền tảng học tập hiện đại dành cho lớp Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang. Dự án được xây dựng với công nghệ Next.js 15, TypeScript, và TailwindCSS, mang đến trải nghiệm học tập tối ưu cho sinh viên, giảng viên và ban cán sự lớp.

📌 Thông tin dự án
Thông tin Chi tiết
Tên dự án Mạng 3 Hub / Network Administration Class Portal
Giảng viên chủ nhiệm Nguyễn Ngọc Thanh
Phát triển bởi Võ Nhật Hào
Lớp Quản trị Mạng 3
Trường Cao đẳng Nghề Kiên Giang
Trạng thái ✅ Đang phát triển
Website https://qtm3k14.vercel.app
🚀 CÔNG NGHỆ SỬ DỤNG
Frontend
Framework: Next.js 15 (Turbopack)

Ngôn ngữ: TypeScript

UI Library: TailwindCSS, Shadcn UI

Animation: Framer Motion

Form Handling: React Hook Form, Zod

State Management: Zustand

Icons: Lucide React

Backend & Database
Authentication: NextAuth.js (v4) - Custom Theme Provider

Database: Supabase (PostgreSQL)

API: Next.js API Routes

File Storage: Supabase Storage

Deployment
Hosting: Vercel

Version Control: Git, GitHub

CI/CD: Vercel Auto Deploy

📁 CẤU TRÚC THƯ MỤC
network-admin-portal/
├── src/
│ ├── app/
│ │ ├── (auth)/ # Authentication pages
│ │ │ ├── forgot-password/
│ │ │ │ └── page.tsx
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ └── page.tsx
│ │ │ └── reset-password/
│ │ │ └── page.tsx
│ │ ├── (dashboard)/ # Dashboard layout
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ ├── (routes)/ # Main routes (30+ trang)
│ │ │ ├── about/
│ │ │ │ └── page.tsx
│ │ │ ├── admin/
│ │ │ │ └── page.tsx
│ │ │ ├── announcements/
│ │ │ │ └── page.tsx
│ │ │ ├── assignments/
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ ├── cisco-lab/
│ │ │ │ └── page.tsx
│ │ │ ├── contact/
│ │ │ │ └── page.tsx
│ │ │ ├── courses/
│ │ │ │ └── page.tsx
│ │ │ ├── docker/
│ │ │ │ └── page.tsx
│ │ │ ├── documents/
│ │ │ │ └── page.tsx
│ │ │ ├── exams/
│ │ │ │ └── page.tsx
│ │ │ ├── faq/
│ │ │ │ └── page.tsx
│ │ │ ├── forum/
│ │ │ │ └── page.tsx
│ │ │ ├── iso/
│ │ │ │ └── page.tsx
│ │ │ ├── lectures/
│ │ │ │ └── page.tsx
│ │ │ ├── linux/
│ │ │ │ └── page.tsx
│ │ │ ├── network-automation/
│ │ │ │ └── page.tsx
│ │ │ ├── packet-tracer/
│ │ │ │ └── page.tsx
│ │ │ ├── profile/
│ │ │ │ └── page.tsx
│ │ │ ├── projects/
│ │ │ │ └── page.tsx
│ │ │ ├── python/
│ │ │ │ └── page.tsx
│ │ │ ├── schedule/
│ │ │ │ └── page.tsx
│ │ │ ├── software/
│ │ │ │ └── page.tsx
│ │ │ ├── source-code/
│ │ │ │ └── page.tsx
│ │ │ ├── submissions/
│ │ │ │ └── page.tsx
│ │ │ ├── terms/
│ │ │ │ └── page.tsx
│ │ │ └── vm/
│ │ │ └── page.tsx
│ │ ├── api/ # API Routes
│ │ │ ├── auth/
│ │ │ │ ├── [...nextauth]/
│ │ │ │ │ └── route.ts
│ │ │ │ ├── forgot-password/
│ │ │ │ │ └── route.ts
│ │ │ │ ├── register/
│ │ │ │ │ └── route.ts
│ │ │ │ └── session/
│ │ │ │ └── route.ts
│ │ │ └── test-supabase/
│ │ │ └── route.ts
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── providers.tsx
│ ├── components/
│ │ ├── animations/
│ │ │ └── fade-in.tsx
│ │ ├── cards/
│ │ │ └── feature-card.tsx
│ │ ├── common/
│ │ │ ├── animated-counter.tsx
│ │ │ ├── command-palette.tsx
│ │ │ ├── ExportButton.tsx
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
│ │ └── ui/ # Shadcn UI components
│ │ ├── badge.tsx
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── dropdown-menu.tsx
│ │ ├── input.tsx
│ │ ├── skeleton.tsx
│ │ └── toast.tsx
│ ├── hooks/ # Custom hooks
│ │ ├── use-announcements.ts
│ │ ├── use-assignments.ts
│ │ ├── use-class-info.ts
│ │ ├── use-courses.ts
│ │ ├── use-dashboard.ts
│ │ ├── use-export.ts
│ │ ├── use-notifications.ts
│ │ ├── use-profile.ts
│ │ ├── use-sidebar.ts
│ │ ├── use-stats.ts
│ │ ├── use-submissions.ts
│ │ ├── use-teachers.ts
│ │ └── use-toast.ts
│ ├── lib/ # Utilities & configs
│ │ ├── db/
│ │ │ ├── json-db.ts
│ │ │ └── supabase-client.ts
│ │ ├── auth.ts
│ │ └── utils.ts
│ ├── types/
│ │ └── next-auth.d.ts
│ └── proxy.ts # Middleware (Next.js proxy)
├── public/ # Static files
│ ├── favicon.ico
│ └── grid.svg
├── scripts/ # Utility scripts
│ ├── check-user.js
│ ├── create-admin.js
│ └── test-password.js
├── data/ # JSON data (backup)
│ └── db.json
├── .env.local # Environment variables (local)
├── .env.example # Environment variables template
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── README.md

🎨 TÍNH NĂNG CHÍNH
🔐 Hệ thống xác thực
✅ Đăng nhập với Email/Password

✅ Đăng nhập với Username

✅ Đăng ký tài khoản mới với đầy đủ thông tin

✅ Phân quyền (Admin, Teacher, Student)

✅ Tự động cấp quyền Admin khi đăng ký số điện thoại 0366017767

📚 Quản lý học tập
✅ Kho tài liệu với tìm kiếm và lọc

✅ Bài giảng video và slide

✅ Lịch học và lịch thi

✅ Bài tập và nộp bài

✅ Môn học và tiến độ

✅ Thông báo và tin tức

✅ Dashboard với dữ liệu thực tế

✅ Animated Counter cho stats

💬 Cộng đồng
✅ Diễn đàn thảo luận

✅ Hỏi đáp và bình luận

✅ Chia sẻ dự án

✅ Chia sẻ source code

🛠️ Công cụ
✅ Kho phần mềm

✅ Kho ISO

✅ Kho VM

✅ Packet Tracer files

✅ Cisco Lab files

✅ Tài nguyên Linux

✅ Windows Server

✅ Docker

✅ Python

✅ Network Automation

🎨 Giao diện
✅ Dark/Light Mode

✅ Responsive Design

✅ Glassmorphism effects

✅ Smooth animations (Framer Motion)

✅ Command Palette (⌘K)

✅ Search với phím tắt ⌘K

✅ Notifications real-time

✅ Animated stats counters

👑 Quản trị (Admin)
✅ Quản lý tài khoản người dùng

✅ Xem danh sách tài khoản đang hoạt động

✅ Phân quyền tài khoản (Admin/Teacher/Student)

✅ Chỉnh sửa thông tin tài khoản

✅ Xóa tài khoản

✅ Thống kê người dùng

👥 PHÂN QUYỀN NGƯỜI DÙNG
Vai trò Quyền hạn
ADMIN Toàn quyền truy cập, quản trị hệ thống, quản lý người dùng
TEACHER Tạo bài tập, xem bài nộp, chấm điểm, quản lý môn học
STUDENT Xem tài liệu, nộp bài tập, tham gia diễn đàn
🗄️ CẤU TRÚC DATABASE (Supabase)
Bảng users

- id (UUID, PK)
- username (TEXT, UNIQUE)
- name (TEXT)
- email (TEXT, UNIQUE)
- password (TEXT)
- role (TEXT) - ADMIN, TEACHER, STUDENT
- phone (TEXT)
- bio (TEXT)
- student_id (TEXT)
- image (TEXT)
- specialties (TEXT[])
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Bảng announcements

- id (UUID, PK)
- title (TEXT)
- content (TEXT)
- priority (TEXT) - high, medium, low
- pinned (BOOLEAN)
- category (TEXT)
- author (TEXT)
- author_id (UUID)
- views (INTEGER)
- comments (INTEGER)
- likes (INTEGER)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Bảng assignments

- id (UUID, PK)
- title (TEXT)
- description (TEXT)
- subject (TEXT)
- type (TEXT)
- due_date (TIMESTAMPTZ)
- status (TEXT) - pending, submitted, graded
- submissions (INTEGER)
- total_students (INTEGER)
- points (INTEGER)
- attachments (INTEGER)
- user_id (UUID, FK)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Bảng submissions

- id (UUID, PK)
- assignment_id (UUID, FK)
- user_id (UUID, FK)
- file_url (TEXT)
- file_name (TEXT)
- file_size (INTEGER)
- status (TEXT) - PENDING, APPROVED, REJECTED
- grade (FLOAT)
- feedback (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Bảng courses

- id (UUID, PK)
- name (TEXT)
- code (TEXT, UNIQUE)
- description (TEXT)
- instructor (TEXT)
- instructor_id (UUID, FK)
- credits (INTEGER)
- students (INTEGER)
- schedule (TEXT)
- room (TEXT)
- progress (INTEGER)
- status (TEXT) - active, completed, pending
- rating (FLOAT)
- tags (TEXT[])
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Bảng course_enrollments

- id (UUID, PK)
- course_id (UUID, FK)
- user_id (UUID, FK)
- status (TEXT) - active, completed, dropped
- enrolled_at (TIMESTAMPTZ)
- completed_at (TIMESTAMPTZ)

Bảng notifications

- id (UUID, PK)
- title (TEXT)
- message (TEXT)
- type (TEXT) - assignment, announcement, submission, grade
- read (BOOLEAN)
- link (TEXT)
- user_id (UUID, FK)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

Bảng classes

- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- features (JSONB)
- location (TEXT)
- schedule (TEXT)
- room (TEXT)
- semester (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

🔧 CÀI ĐẶT & CHẠY DỰ ÁN
Yêu cầu hệ thống
Node.js 18+
npm hoặc yarn
Supabase account (hoặc PostgreSQL)
Cài đặt

# 1. Clone repository

git clone https://github.com/Hao186188/network-admin-portal.git
cd network-admin-portal

# 2. Cài đặt dependencies

npm install

# 3. Tạo file .env.local từ .env.example

cp .env.example .env.local

# 4. Cập nhật biến môi trường trong .env.local

# Supabase

NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# 5. Chạy development server

npm run dev

Build cho production

# Build

npm run build

# Chạy production server

npm run start

Deploy lên Vercel

# Cài đặt Vercel CLI

npm install -g vercel

# Đăng nhập

vercel login

# Deploy

vercel --prod

📖 HƯỚNG DẪN SỬ DỤNG
Cho sinh viên
Đăng ký tài khoản: Điền đầy đủ thông tin (tên đăng nhập, họ tên, email, số điện thoại, mật khẩu)

Đăng nhập: Có thể đăng nhập bằng email hoặc tên đăng nhập

Xem tài liệu: Truy cập /documents để xem tài liệu học tập

Nộp bài tập: Vào /assignments, chọn bài tập và nộp file

Theo dõi thông báo: Xem thông báo mới tại icon chuông trên navbar

Cho giáo viên
Tạo bài tập: Vào /assignments, click "Tạo bài tập"

Xem bài nộp: Vào /submissions để xem bài nộp của học sinh

Chấm điểm: Click "Chấm điểm" trên bài nộp

Quản lý môn học: Vào /courses để quản lý môn học

Cho Admin
Quản trị hệ thống: Vào /admin (chỉ hiển thị với Admin)

Quản lý tài khoản: Xem, sửa, xóa, phân quyền người dùng

Xem thống kê: Dashboard hiển thị thống kê tổng quan

🛠️ CÁC LỖI ĐÃ SỬA
Lỗi Giải pháp
Hydration Error Thêm suppressHydrationWarning
NextAuth 400 Bad Request Đúng cấu trúc route handler
Build Error useSession Chuyển sang Client Component
500 Server Error Xử lý session đúng cách
Sidebar Collapse Tối ưu responsive
Dark Mode Custom Theme Context
Search & Notifications Phím tắt và real-time
UUID error "class-3" Tìm theo name thay vì id
Upload file Tạo bucket trên Supabase
📝 HƯỚNG DẪN PHÁT TRIỂN
Thêm trang mới
Tạo file trong src/app/(routes)/

Thêm component với "use client" nếu cần

Cập nhật navigation trong navbar.tsx

Thêm API mới
Tạo file trong src/app/api/

Export GET, POST, PUT, DELETE handlers

Sử dụng supabase client

Thêm component mới
Tạo file trong thư mục components/ tương ứng

Export component với "use client" nếu cần

Import và sử dụng trong các trang

Thêm hook mới
Tạo file trong src/hooks/

Export custom hook với đầy đủ types

Sử dụng trong các component

🔄 LUỒNG HOẠT ĐỘNG
Đăng ký tài khoản
User → Register → Nhập thông tin (username, name, email, phone, password)
→ Chọn role (Teacher/Student) → Đồng ý điều khoản
→ Submit → Tạo tài khoản → Chuyển đến Login

Đăng nhập
User → Login → Nhập email/username + password
→ Submit → Xác thực → Redirect Dashboard

Tạo bài tập (Teacher/Admin)
Teacher → Assignments → Tạo bài tập
→ Nhập thông tin (tiêu đề, mô tả, hạn nộp, điểm)
→ Upload file đính kèm → Submit → Lưu database

Nộp bài tập (Student)
Student → Assignments → Chọn bài tập
→ Upload file bài làm → Submit
→ Lưu vào submissions → Chờ chấm điểm

Chấm điểm (Teacher)
Teacher → Submissions → Xem bài nộp
→ Click "Chấm điểm" → Nhập điểm và nhận xét
→ Submit → Cập nhật trạng thái

Quản trị (Admin)
Admin → Admin Dashboard → Quản lý tài khoản
→ Xem danh sách users → Chỉnh sửa / Xóa / Phân quyền
→ Xem thống kê

🎯 KẾ HOẠCH PHÁT TRIỂN TIẾP THEO
Giai đoạn 1: Hoàn thiện cơ bản ✅
Cấu trúc dự án
Components cơ bản
Authentication
Database Supabase
Responsive design
Dark/Light mode
Phân quyền người dùng
Admin dashboard
Profile page

Giai đoạn 2: Nâng cấp (Đang thực hiện)
Real-time notifications
Upload file lên cloud
Bình luận và đánh giá
Thống kê và báo cáo
Tối ưu SEO
Export dữ liệu (CSV/Excel)
Email notifications
Push notifications
Giai đoạn 3: Hoàn thiện
Unit testing
E2E testing
Documentation
Deployment
Training
Performance optimization

📞 LIÊN HỆ
Thông tin Chi tiết
Giảng viên Nguyễn Ngọc Thanh
Developer Võ Nhật Hào
Email vonhathaoqtm3k14@gmail.com
GitHub https://github.com/Hao186188
Website https://qtm3k14.vercel.app

📄 GIẤY PHÉP
Dự án được phát triển cho mục đích học tập và sử dụng nội bộ tại Trường Cao đẳng Nghề Kiên Giang.

💡 LƯU Ý CHO NGƯỜI PHÁT TRIỂN

1. Theme Provider
   Không dùng next-themes, đã thay bằng custom Theme Context
   Theme được lưu trong localStorage với key theme
   Hỗ trợ system, light, dark

2. Authentication
   Sử dụng NextAuth v4 với Credentials Provider
   Session được lưu bằng JWT
   Hỗ trợ đăng nhập bằng email hoặc username
   Phân quyền: ADMIN, TEACHER, STUDENT

3. Database
   Sử dụng Supabase (PostgreSQL)
   Có RLS policies bảo vệ dữ liệu
   Triggers tự động tạo notifications

4. Components Pattern
   use client cho tất cả component tương tác
   Atomic Design: ui → common → layout → features
   Shadcn UI cho components cơ bản

5. Styling
   TailwindCSS với dark mode
   Custom CSS variables trong globals.css
   Glassmorphism và gradient effects

6. Environment Variables

# App

NEXT_PUBLIC_APP_NAME="Mạng 3 Hub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Supabase

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
DATABASE_URL="postgresql://..."

© 2026 Mạng 3 Hub - Lớp Quản trị Mạng 3 - Trường Cao đẳng Nghề Kiên Giang
Dự án được phát triển với ❤️ bởi Võ Nhật Hào
"Kết nối tri thức - Làm chủ hệ thống mạng"
