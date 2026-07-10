📚 MẠNG 3 HUB - TÀI LIỆU DỰ ÁN HOÀN CHỈNH
🎯 TỔNG QUAN DỰ ÁN
Mạng 3 Hub là nền tảng học tập hiện đại dành cho lớp Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang. Dự án được xây dựng với công nghệ Next.js 16, TypeScript, và TailwindCSS, mang đến trải nghiệm học tập tối ưu cho sinh viên, giảng viên và ban cán sự lớp.

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
Công nghệ Vai trò
Next.js 16.2.10 Framework chính
TypeScript Ngôn ngữ lập trình
TailwindCSS UI styling
Shadcn UI Component library
Framer Motion Animation
React Hook Form Form handling
Zod Validation
Zustand State management
Lucide React Icons
Backend & Database
Công nghệ Vai trò
NextAuth.js (v4) Authentication
Supabase (PostgreSQL) Database
Next.js API Routes Backend API
Supabase Storage File storage
Deployment
Công nghệ Vai trò
Vercel Hosting
Git, GitHub Version control
Vercel Auto Deploy CI/CD
📁 CẤU TRÚC THƯ MỤC CHI TIẾT
network-admin-portal/
├── .next/ # Next.js build output (tự động tạo)
├── .vercel/ # Vercel deployment config
├── node_modules/ # Dependencies
├── public/ # Static files
│ ├── favicon.ico # Favicon
│ ├── grid.svg # Grid pattern background
│ └── manifest.json # PWA manifest
├── src/ # Source code
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Authentication pages (layout riêng)
│ │ │ ├── forgot-password/
│ │ │ │ └── page.tsx # Quên mật khẩu
│ │ │ ├── login/
│ │ │ │ └── page.tsx # Đăng nhập
│ │ │ ├── register/ # Đăng ký - ĐÃ NÂNG CẤP
│ │ │ │ ├── page.tsx # Trang chính
│ │ │ │ ├── components/ # Components của register
│ │ │ │ │ ├── RegisterForm.tsx
│ │ │ │ │ ├── RegisterHero.tsx
│ │ │ │ │ ├── RegisterInput.tsx
│ │ │ │ │ └── RegisterPasswordStrength.tsx
│ │ │ │ └── hooks/
│ │ │ │ └── useRegister.ts
│ │ │ └── reset-password/
│ │ │ └── page.tsx # Đặt lại mật khẩu
│ │ ├── (dashboard)/ # Dashboard pages (có sidebar)
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx # Trang Dashboard
│ │ │ └── layout.tsx # Dashboard layout
│ │ ├── (routes)/ # Public routes
│ │ │ ├── about/
│ │ │ │ └── page.tsx # Giới thiệu
│ │ │ ├── admin/
│ │ │ │ └── page.tsx # Quản trị hệ thống
│ │ │ ├── announcements/ # Thông báo - ĐÃ NÂNG CẤP
│ │ │ │ ├── page.tsx # Trang danh sách
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx # Trang chi tiết
│ │ │ │ └── components/
│ │ │ │ ├── AnnouncementCard.tsx
│ │ │ │ ├── AnnouncementFilters.tsx
│ │ │ │ ├── AnnouncementHero.tsx
│ │ │ │ ├── AnnouncementSkeleton.tsx
│ │ │ │ ├── AnnouncementStats.tsx
│ │ │ │ ├── AnnouncementTicker.tsx
│ │ │ │ └── CreateAnnouncementModal.tsx
│ │ │ ├── assignments/ # Bài tập - ĐÃ NÂNG CẤP
│ │ │ │ ├── page.tsx # Trang danh sách
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx # Trang chi tiết
│ │ │ │ └── components/
│ │ │ │ ├── AssignmentCard.tsx
│ │ │ │ ├── AssignmentFilters.tsx
│ │ │ │ ├── AssignmentHero.tsx
│ │ │ │ ├── AssignmentSkeleton.tsx
│ │ │ │ ├── AssignmentStats.tsx
│ │ │ │ ├── CreateAssignmentModal.tsx
│ │ │ │ ├── StatusBadge.tsx
│ │ │ │ └── SubmitAssignmentModal.tsx
│ │ │ ├── chat/
│ │ │ │ └── page.tsx # Chat realtime
│ │ │ ├── cisco-lab/
│ │ │ │ └── page.tsx # Cisco Lab
│ │ │ ├── contact/
│ │ │ │ └── page.tsx # Liên hệ
│ │ │ ├── courses/
│ │ │ │ └── page.tsx # Môn học
│ │ │ ├── docker/
│ │ │ │ └── page.tsx # Docker
│ │ │ ├── documents/
│ │ │ │ └── page.tsx # Tài liệu
│ │ │ ├── exams/
│ │ │ │ └── page.tsx # Lịch thi
│ │ │ ├── faq/
│ │ │ │ └── page.tsx # FAQ
│ │ │ ├── forum/ # Diễn đàn - ĐÃ NÂNG CẤP
│ │ │ │ ├── page.tsx # Trang danh sách
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx # Trang chi tiết
│ │ │ │ ├── create/
│ │ │ │ │ └── page.tsx # Tạo bài viết
│ │ │ │ └── components/
│ │ │ │ ├── ForumImageGallery.tsx
│ │ │ │ ├── ForumImageViewer.tsx
│ │ │ │ ├── ForumPostCard.tsx
│ │ │ │ ├── ForumPostMenu.tsx
│ │ │ │ ├── ForumPostSkeleton.tsx
│ │ │ │ └── UserProfileModal.tsx
│ │ │ ├── iso/
│ │ │ │ └── page.tsx # Kho ISO
│ │ │ ├── lectures/
│ │ │ │ └── page.tsx # Bài giảng
│ │ │ ├── linux/
│ │ │ │ └── page.tsx # Linux
│ │ │ ├── network-automation/
│ │ │ │ └── page.tsx # Network Automation
│ │ │ ├── packet-tracer/
│ │ │ │ └── page.tsx # Packet Tracer
│ │ │ ├── profile/
│ │ │ │ └── page.tsx # Hồ sơ cá nhân
│ │ │ ├── projects/
│ │ │ │ └── page.tsx # Dự án
│ │ │ ├── python/
│ │ │ │ └── page.tsx # Python
│ │ │ ├── schedule/
│ │ │ │ └── page.tsx # Lịch học
│ │ │ ├── software/
│ │ │ │ └── page.tsx # Kho phần mềm
│ │ │ ├── source-code/
│ │ │ │ └── page.tsx # Source code
│ │ │ ├── submissions/
│ │ │ │ └── page.tsx # Bài nộp
│ │ │ ├── terms/
│ │ │ │ └── page.tsx # Điều khoản
│ │ │ └── vm/
│ │ │ └── page.tsx # Virtual Machines
│ │ ├── api/ # API Routes
│ │ │ ├── auth/
│ │ │ │ ├── [...nextauth]/
│ │ │ │ │ └── route.ts # NextAuth configuration
│ │ │ │ ├── forgot-password/
│ │ │ │ │ └── route.ts # Quên mật khẩu API
│ │ │ │ ├── register/
│ │ │ │ │ └── route.ts # Đăng ký API
│ │ │ │ └── session/
│ │ │ │ └── route.ts # Session API
│ │ │ └── test-supabase/
│ │ │ └── route.ts # Test Supabase connection
│ │ ├── favicon.ico # Favicon
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Trang chủ
│ │ └── providers.tsx # Providers (Session, Theme)
│ ├── components/ # React components
│ │ ├── animations/
│ │ │ └── fade-in.tsx # Fade animation
│ │ ├── cards/
│ │ │ └── feature-card.tsx # Feature card
│ │ ├── chat/ # Chat components
│ │ │ ├── ChatInput.tsx
│ │ │ ├── ChatMessages.tsx
│ │ │ └── ChatSidebar.tsx
│ │ ├── common/ # Common components
│ │ │ ├── animated-counter.tsx
│ │ │ ├── command-palette.tsx
│ │ │ ├── ExportButton.tsx
│ │ │ ├── file-upload.tsx # Upload file
│ │ │ ├── grid-pattern.tsx
│ │ │ ├── notifications.tsx
│ │ │ ├── search.tsx
│ │ │ ├── session-checker.tsx
│ │ │ └── session-debugger.tsx
│ │ ├── dashboard/ # Dashboard components
│ │ │ ├── DashboardHero.tsx
│ │ │ ├── DropdownMenu.tsx
│ │ │ ├── QuickAccess.tsx
│ │ │ ├── RecentAnnouncements.tsx
│ │ │ ├── StatsCard.tsx
│ │ │ ├── UpcomingTasks.tsx
│ │ │ └── UserActions.tsx
│ │ ├── features/
│ │ │ └── stats.tsx
│ │ ├── forum/ # Forum components
│ │ │ ├── CreatePostHero.tsx
│ │ │ ├── ForumFilters.tsx
│ │ │ ├── ForumImageGallery.tsx
│ │ │ ├── ForumImageViewer.tsx
│ │ │ ├── ForumPageHero.tsx
│ │ │ ├── ForumPostCard.tsx
│ │ │ ├── ForumPostMenu.tsx
│ │ │ ├── ForumPostSkeleton.tsx
│ │ │ ├── ForumSkeleton.tsx
│ │ │ ├── OnboardingGuide.tsx
│ │ │ ├── PostCard.tsx
│ │ │ ├── PostCardEnhanced.tsx
│ │ │ ├── PostDetailContent.tsx
│ │ │ ├── PostDetailHeader.tsx
│ │ │ ├── PostDetailHero.tsx
│ │ │ ├── PostDetailReplies.tsx
│ │ │ └── UserProfileModal.tsx
│ │ ├── forms/
│ │ │ └── input-with-icon.tsx
│ │ ├── layout/ # Layout components
│ │ │ ├── footer.tsx
│ │ │ ├── navbar-client.tsx
│ │ │ └── navbar.tsx # Navbar - TỐI ƯU
│ │ ├── providers/
│ │ │ └── theme-provider.tsx
│ │ ├── sections/
│ │ │ └── hero-section.tsx
│ │ └── ui/ # Shadcn UI components
│ │ ├── alert-dialog.tsx
│ │ ├── avatar.tsx
│ │ ├── badge.tsx
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── dialog.tsx
│ │ ├── dropdown-menu.tsx
│ │ ├── input.tsx
│ │ ├── progress-bar-fluid.tsx
│ │ ├── scroll-area.tsx
│ │ ├── scroll-progress.tsx
│ │ ├── skeleton.tsx
│ │ └── toast.tsx
│ ├── hooks/ # Custom hooks
│ │ ├── use-announcements.ts # Announcements - ĐÃ HOÀN CHỈNH
│ │ ├── use-assignments.ts # Assignments - ĐÃ HOÀN CHỈNH
│ │ ├── use-chat.ts # Chat - ĐÃ HOÀN CHỈNH
│ │ ├── use-click-away.ts
│ │ ├── use-forum-infinity.ts
│ │ ├── use-forum.ts
│ │ ├── use-like-status.ts
│ │ ├── use-media-query.ts
│ │ ├── use-notifications.ts
│ │ ├── use-profile.ts
│ │ ├── use-stats.ts
│ │ ├── use-storage.ts
│ │ └── use-toast.ts
│ ├── lib/ # Utilities & configs
│ │ ├── db/
│ │ │ ├── json-db.ts # JSON database (backup)
│ │ │ └── supabase-client.ts # Supabase client
│ │ ├── auth.ts # NextAuth config
│ │ ├── logger.ts # Logging utility
│ │ ├── realtime.ts # Realtime utility
│ │ └── utils.ts # Utility functions
│ ├── types/ # Type definitions
│ │ ├── index.ts # Types - ĐÃ HOÀN CHỈNH
│ │ └── next-auth.d.ts # NextAuth types
│ └── proxy.ts # Middleware - ĐÃ SỬA
├── data/ # JSON data (backup)
│ └── db.json # Database backup
├── scripts/ # Utility scripts
│ ├── check-user.js
│ ├── create-admin.js
│ └── test-password.js
├── .env.local # Environment variables (local)
├── .env.example # Environment variables template
├── .gitignore
├── components.json # Shadcn UI config
├── next.config.js # Next.js config - ĐÃ TỐI ƯU
├── package.json # Dependencies - ĐÃ TỐI ƯU
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md # This file

🎨 TÍNH NĂNG CHÍNH
🔐 Hệ thống xác thực
✅ Đăng nhập với Email/Password

✅ Đăng nhập với Username

✅ Đăng ký tài khoản với đầy đủ thông tin

✅ Phân quyền (Admin, Teacher, Student)

✅ Tự động cấp quyền Admin khi đăng ký số điện thoại 0366017767

✅ Floating label với laser line effect

✅ Password strength indicator

📚 Quản lý học tập
✅ Kho tài liệu với tìm kiếm và lọc

✅ Bài giảng video và slide

✅ Lịch học và lịch thi

✅ Bài tập và nộp bài với upload file

✅ Môn học và tiến độ

✅ Thông báo và tin tức

✅ Dashboard với dữ liệu thực tế

✅ Animated Counter cho stats

💬 Cộng đồng
✅ Diễn đàn thảo luận với infinity scroll

✅ Hỏi đáp và bình luận

✅ Chia sẻ dự án

✅ Chia sẻ source code

✅ Chat realtime với bạn bè

✅ Kết bạn và gửi tin nhắn

✅ Xem ảnh fullscreen với zoom

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

✅ Onboarding guide

✅ Cyberpunk / Futuristic style

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
Bảng USERS
sql

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
- reset_token (TEXT) -- Forgot password
- reset_token_expiry (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng ANNOUNCEMENTS
  sql
- id (UUID, PK)
- title (TEXT)
- content (TEXT)
- priority (TEXT) - high, medium, low
- pinned (BOOLEAN)
- category (TEXT)
- author (TEXT)
- author_id (UUID, FK)
- views (INTEGER)
- comments (INTEGER)
- likes (INTEGER)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng ANNOUNCEMENT_LIKES
  sql
- id (UUID, PK)
- announcement_id (UUID, FK)
- user_id (UUID, FK)
- created_at (TIMESTAMPTZ)
- UNIQUE(announcement_id, user_id)
  Bảng ANNOUNCEMENT_COMMENTS
  sql
- id (UUID, PK)
- announcement_id (UUID, FK)
- user_id (UUID, FK)
- user_name (TEXT)
- user_avatar (TEXT)
- content (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng ASSIGNMENTS
  sql
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
- attachment_urls (TEXT[])
- user_id (UUID, FK)
- created_by (UUID, FK)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng SUBMISSIONS
  sql
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
  Bảng FORUM_POSTS
  sql
- id (UUID, PK)
- title (TEXT)
- content (TEXT)
- category (TEXT)
- author_id (UUID, FK)
- author_name (TEXT)
- author_avatar (TEXT)
- is_pinned (BOOLEAN)
- is_locked (BOOLEAN)
- views (INTEGER)
- likes (INTEGER)
- replies (INTEGER)
- tags (TEXT[])
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng FORUM_ATTACHMENTS
  sql
- id (UUID, PK)
- post_id (UUID, FK)
- user_id (UUID, FK)
- file_url (TEXT)
- file_name (TEXT)
- file_type (TEXT)
- file_size (INTEGER)
- created_at (TIMESTAMPTZ)
  Bảng FORUM_REPLIES
  sql
- id (UUID, PK)
- post_id (UUID, FK)
- user_id (UUID, FK)
- user_name (TEXT)
- user_avatar (TEXT)
- content (TEXT)
- likes (INTEGER)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng FRIENDS
  sql
- id (UUID, PK)
- user_id (UUID, FK)
- friend_id (UUID, FK)
- status (TEXT) - pending, accepted, rejected, blocked
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng MESSAGES
  sql
- id (UUID, PK)
- sender_id (UUID, FK)
- receiver_id (UUID, FK)
- content (TEXT)
- file_url (TEXT)
- file_name (TEXT)
- file_type (TEXT)
- file_size (INTEGER)
- read (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  Bảng USER_STATUS
  sql
- user_id (UUID, PK, FK)
- is_online (BOOLEAN)
- last_seen (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
  🔧 CÀI ĐẶT & CHẠY DỰ ÁN
  Yêu cầu hệ thống
  Node.js 18+

npm hoặc yarn

Supabase account (hoặc PostgreSQL)

Cài đặt
bash

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

# Admin Configuration

ADMIN_PHONE="0366017767"

# 5. Chạy development server

npm run dev
Build cho production
bash

# Build

npm run build

# Chạy production server

npm run start
Deploy lên Vercel
bash

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
Upload file Tạo bucket trên Supabase Storage
Middleware bypass Sửa logic public routes
Register tự chọn TEACHER Chỉ cho phép STUDENT mặc định
Realtime infinite loop Sửa subscription logic
Like không lưu Trigger tự động cập nhật count
Skeleton kẹt Ref để chỉ fetch 1 lần
💡 LƯU Ý CHO NGƯỜI PHÁT TRIỂN

1. Theme Provider
   ✅ Sử dụng custom Theme Context (KHÔNG dùng next-themes)

Theme được lưu trong localStorage với key theme

Hỗ trợ system, light, dark

2. Authentication
   Sử dụng NextAuth v4 với Credentials Provider

Session được lưu bằng JWT

Hỗ trợ đăng nhập bằng email hoặc username

Phân quyền: ADMIN, TEACHER, STUDENT

3. Database
   CHỈ sử dụng Supabase (PostgreSQL) (KHÔNG dùng Prisma)

Có RLS policies bảo vệ dữ liệu

Triggers tự động cập nhật likes/comments count

4. Components Pattern
   use client cho tất cả component tương tác

Atomic Design: ui → common → layout → features

Shadcn UI cho components cơ bản

5. Styling
   TailwindCSS với dark mode

Custom CSS variables trong globals.css

Glassmorphism và gradient effects

Cyberpunk / Futuristic style

6. Realtime
   Sử dụng Supabase Realtime

Broadcast cho notifications và chat

Presence cho online status

📞 LIÊN HỆ
Thông tin Chi tiết
Giảng viên Nguyễn Ngọc Thanh
Developer Võ Nhật Hào
Email vonhathaoqtm3k14@gmail.com
GitHub https://github.com/Hao186188
Website https://qtm3k14.vercel.app
📄 GIẤY PHÉP
Dự án được phát triển cho mục đích học tập và sử dụng nội bộ tại Trường Cao đẳng Nghề Kiên Giang.

"Kết nối tri thức - Làm chủ hệ thống mạng" 🚀
