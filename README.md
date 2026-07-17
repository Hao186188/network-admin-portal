📚 MẠNG 3 HUB - NETWORK ADMINISTRATION PORTAL
🎯 TỔNG QUAN DỰ ÁN
Mạng 3 Hub là nền tảng học tập hiện đại dành cho lớp Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang. Dự án được xây dựng với công nghệ Next.js 16, TypeScript, và TailwindCSS, mang đến trải nghiệm học tập tối ưu cho sinh viên, giảng viên và ban cán sự lớp.

Thông tin dự án
Thông tin Chi tiết
Tên dự án Mạng 3 Hub / Network Administration Class Portal
Giảng viên chủ nhiệm Nguyễn Ngọc Thanh
Phát triển bởi Võ Nhật Hào
Lớp Quản trị Mạng 3
Trường Cao đẳng Nghề Kiên Giang
Website https://qtm3k14.vercel.app
Repository https://github.com/Hao186188/network-admin-portal
🚀 CÔNG NGHỆ SỬ DỤNG
Frontend
Công nghệ Vai trò
Next.js 16.2.10 Framework chính
TypeScript Ngôn ngữ lập trình
TailwindCSS 3.4.1 UI styling
Shadcn UI Component library
Framer Motion 12.42.2 Animation
React Hook Form 7.80.0 Form handling
Zod 4.4.3 Validation
Zustand 5.0.14 State management
Lucide React 1.23.0 Icons
Backend & Database
Công nghệ Vai trò
NextAuth.js (v4) Authentication
Supabase (PostgreSQL) Database
Next.js API Routes Backend API
Supabase Storage File storage
TanStack React Query Data fetching & caching
Deployment
Công nghệ Vai trò
Vercel Hosting
Git, GitHub Version control
Vercel Auto Deploy CI/CD
📁 CẤU TRÚC THƯ MỤC CHI TIẾT
text
network-admin-portal/
├── .env.local # Environment variables (local)
├── .env.example # Environment variables template
├── .gitignore
├── components.json # Shadcn UI config
├── next-sitemap.config.js # Sitemap config
├── next.config.js # Next.js config - Tối ưu
├── package.json # Dependencies
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json # Vercel deployment config
├── README.md # This file
│
├── public/ # Static files
│ ├── favicon.ico
│ ├── grid.svg
│ ├── manifest.json
│ ├── robots.txt
│ ├── apple-touch-icon.png
│ ├── og-image.png
│ ├── icon-192.png
│ ├── icon-512.png
│ ├── maskable-icon-192.png
│ ├── maskable-icon-512.png
│ └── googlefd0bb1779e2131d9.html
│
├── scripts/ # Utility scripts
│ ├── check-user.js
│ ├── create-admin.js
│ ├── create-icons.js
│ └── test-password.js
│
├── src/ # Source code
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Authentication pages
│ │ │ ├── forgot-password/
│ │ │ │ └── page.tsx
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ ├── register/
│ │ │ │ ├── page.tsx
│ │ │ │ ├── components/
│ │ │ │ │ ├── RegisterForm.tsx
│ │ │ │ │ ├── RegisterHero.tsx
│ │ │ │ │ ├── RegisterInput.tsx
│ │ │ │ │ └── RegisterPasswordStrength.tsx
│ │ │ │ └── hooks/
│ │ │ │ └── useRegister.ts
│ │ │ └── reset-password/
│ │ │ └── page.tsx
│ │ │
│ │ ├── (dashboard)/ # Dashboard pages
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ ├── (routes)/ # Public routes
│ │ │ ├── about/ # Giới thiệu
│ │ │ │ ├── page.tsx
│ │ │ │ └── components/
│ │ │ │ ├── AboutHero.tsx
│ │ │ │ ├── AboutStats.tsx
│ │ │ │ ├── AboutTabs.tsx
│ │ │ │ ├── AboutOverview.tsx
│ │ │ │ ├── AboutTeachers.tsx
│ │ │ │ ├── AboutAchievements.tsx
│ │ │ │ ├── AboutCTA.tsx
│ │ │ │ ├── LoadingScreen.tsx
│ │ │ │ └── AboutSkeleton.tsx
│ │ │ │
│ │ │ ├── admin/ # Quản trị
│ │ │ │ ├── page.tsx
│ │ │ │ ├── components/
│ │ │ │ │ ├── AdminHeader.tsx
│ │ │ │ │ ├── AdminStats.tsx
│ │ │ │ │ ├── UserTable.tsx
│ │ │ │ │ ├── UserRow.tsx
│ │ │ │ │ ├── StatsCard.tsx
│ │ │ │ │ ├── EditUserModal.tsx
│ │ │ │ │ └── DeleteUserModal.tsx
│ │ │ │ └── lectures/ # Quản lý bài giảng
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── announcements/ # Thông báo - HOÀN CHỈNH
│ │ │ │ ├── page.tsx
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── components/
│ │ │ │ ├── AnnouncementCard.tsx
│ │ │ │ ├── AnnouncementFilters.tsx
│ │ │ │ ├── AnnouncementHero.tsx
│ │ │ │ ├── AnnouncementSkeleton.tsx
│ │ │ │ ├── AnnouncementStats.tsx
│ │ │ │ ├── AnnouncementTicker.tsx
│ │ │ │ └── CreateAnnouncementModal.tsx
│ │ │ │
│ │ │ ├── assignments/ # Bài tập - ĐÃ HOÀN CHỈNH
│ │ │ │ ├── page.tsx
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── components/
│ │ │ │ ├── AssignmentCard.tsx
│ │ │ │ ├── AssignmentFilters.tsx
│ │ │ │ ├── AssignmentHero.tsx
│ │ │ │ ├── AssignmentSkeleton.tsx
│ │ │ │ ├── AssignmentStats.tsx
│ │ │ │ ├── CreateAssignmentModal.tsx
│ │ │ │ ├── StatusBadge.tsx
│ │ │ │ └── SubmitAssignmentModal.tsx
│ │ │ │
│ │ │ ├── chat/ # Chat - REALTIME
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── documents/ # Tài liệu - HOÀN CHỈNH
│ │ │ │ ├── page.tsx
│ │ │ │ ├── [id]/
│ │ │ │ │ ├── page.tsx
│ │ │ │ │ └── edit/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── components/
│ │ │ │ │ ├── DocumentsCard.tsx
│ │ │ │ │ ├── DocumentsFilters.tsx
│ │ │ │ │ ├── DocumentsGrid.tsx
│ │ │ │ │ ├── DocumentsHero.tsx
│ │ │ │ │ ├── DocumentsPagination.tsx
│ │ │ │ │ ├── DocumentsSearch.tsx
│ │ │ │ │ ├── DocumentsStats.tsx
│ │ │ │ │ ├── EditDocumentModal.tsx
│ │ │ │ │ ├── UploadDocumentModal.tsx
│ │ │ │ │ └── FileExplorer/ # File Explorer - Windows Style
│ │ │ │ │ ├── index.tsx
│ │ │ │ │ ├── types.ts
│ │ │ │ │ ├── Breadcrumbs.tsx
│ │ │ │ │ ├── FolderTree.tsx
│ │ │ │ │ ├── FileGrid.tsx
│ │ │ │ │ ├── FileList.tsx
│ │ │ │ │ ├── FileItem.tsx
│ │ │ │ │ ├── Toolbar.tsx
│ │ │ │ │ ├── NewFolderModal.tsx
│ │ │ │ │ ├── CreateFolderModal.tsx
│ │ │ │ │ └── UploadFileModal.tsx
│ │ │ │ ├── hooks/
│ │ │ │ │ ├── useDocuments.ts
│ │ │ │ │ ├── useDocumentInteractions.ts
│ │ │ │ │ └── useFolderNavigation.ts
│ │ │ │ └── types/
│ │ │ │ └── index.ts
│ │ │ │
│ │ │ ├── lectures/ # Bài giảng - HOÀN CHỈNH
│ │ │ │ ├── page.tsx
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── components/
│ │ │ │ │ ├── LectureHero.tsx
│ │ │ │ │ ├── LectureStats.tsx
│ │ │ │ │ ├── LectureFilters.tsx
│ │ │ │ │ ├── LectureCard.tsx
│ │ │ │ │ ├── LectureGrid.tsx
│ │ │ │ │ ├── LectureSkeleton.tsx
│ │ │ │ │ ├── LectureEmptyState.tsx
│ │ │ │ │ ├── LectureScrollReveal.tsx
│ │ │ │ │ └── FolderExplorer/ # File Explorer - Windows Style
│ │ │ │ │ ├── index.tsx
│ │ │ │ │ ├── types.ts
│ │ │ │ │ ├── Breadcrumbs.tsx
│ │ │ │ │ ├── FolderTree.tsx
│ │ │ │ │ ├── CreateFolderModal.tsx
│ │ │ │ │ └── UploadFileModal.tsx
│ │ │ │ ├── hooks/
│ │ │ │ │ └── useLectures.ts
│ │ │ │ ├── CreateLectureModal.tsx
│ │ │ │ └── types/
│ │ │ │ └── index.ts
│ │ │ │
│ │ │ ├── courses/ # Môn học
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── forum/ # Diễn đàn - HOÀN CHỈNH
│ │ │ │ ├── page.tsx
│ │ │ │ ├── [id]/
│ │ │ │ │ └── page.tsx
│ │ │ │ ├── create/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── components/
│ │ │ │ ├── ForumImageGallery.tsx
│ │ │ │ ├── ForumImageViewer.tsx
│ │ │ │ ├── ForumPostCard.tsx
│ │ │ │ ├── ForumPostMenu.tsx
│ │ │ │ ├── ForumPostSkeleton.tsx
│ │ │ │ └── UserProfileModal.tsx
│ │ │ │
│ │ │ ├── profile/ # Hồ sơ cá nhân
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── schedule/ # Lịch học
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ └── submissions/ # Bài nộp
│ │ │ └── page.tsx
│ │ │
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
│ │ │ ├── documents/
│ │ │ │ ├── route.ts
│ │ │ │ ├── upload/
│ │ │ │ │ └── route.ts
│ │ │ │ ├── upload-folder/
│ │ │ │ │ └── route.ts
│ │ │ │ ├── download-folder/
│ │ │ │ │ └── route.ts
│ │ │ │ └── favorite/
│ │ │ │ └── route.ts
│ │ │ └── lectures/
│ │ │ ├── route.ts
│ │ │ ├── download-folder/
│ │ │ │ └── route.ts
│ │ │ └── upload-thumbnail/
│ │ │ └── route.ts
│ │ │
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx # Root layout - TỐI ƯU SEO
│ │ ├── page.tsx # Trang chủ
│ │ ├── providers.tsx # Providers
│ │ ├── robots.ts # Robots.txt generation
│ │ ├── sitemap.ts # Sitemap generation
│ │ ├── manifest.ts # PWA manifest
│ │ ├── head.tsx # Head component
│ │ └── og-image/
│ │ └── route.tsx # Open Graph image
│ │
│ ├── components/ # React components
│ │ ├── animations/ # Animation components
│ │ │ ├── BeaconPulse.tsx
│ │ │ ├── BorderBeam.tsx
│ │ │ ├── DataPacketFlow.tsx
│ │ │ ├── GlitchText.tsx
│ │ │ ├── MagneticButton.tsx
│ │ │ ├── NetworkPulse.tsx
│ │ │ ├── NetworkTicker.tsx
│ │ │ ├── ScanLine.tsx
│ │ │ └── TerminalTyping.tsx
│ │ ├── cards/
│ │ │ └── feature-card.tsx
│ │ ├── chat/
│ │ │ ├── ChatInput.tsx
│ │ │ ├── ChatMessages.tsx
│ │ │ └── ChatSidebar.tsx
│ │ ├── common/
│ │ │ ├── animated-counter.tsx
│ │ │ ├── command-palette.tsx
│ │ │ ├── ExportButton.tsx
│ │ │ ├── file-upload.tsx
│ │ │ ├── grid-pattern.tsx
│ │ │ ├── notifications.tsx
│ │ │ ├── search.tsx
│ │ │ ├── session-checker.tsx
│ │ │ └── session-debugger.tsx
│ │ ├── dashboard/
│ │ │ ├── DashboardHero.tsx
│ │ │ ├── DropdownMenu.tsx
│ │ │ ├── QuickAccess.tsx
│ │ │ ├── RecentAnnouncements.tsx
│ │ │ ├── StatsCard.tsx
│ │ │ ├── UpcomingTasks.tsx
│ │ │ └── UserActions.tsx
│ │ ├── features/
│ │ │ └── stats.tsx
│ │ ├── forms/
│ │ │ └── input-with-icon.tsx
│ │ ├── layout/
│ │ │ ├── footer.tsx
│ │ │ ├── navbar-client.tsx
│ │ │ └── navbar.tsx
│ │ ├── lectures/ # Components cho Lectures
│ │ │ └── EditLectureModal.tsx
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
│ │ ├── confirm-dialog.tsx
│ │ ├── dialog.tsx
│ │ ├── dropdown-menu.tsx
│ │ ├── input.tsx
│ │ ├── progress-bar-fluid.tsx
│ │ ├── scroll-area.tsx
│ │ ├── scroll-progress.tsx
│ │ ├── skeleton.tsx
│ │ ├── theme-toggle.tsx
│ │ └── toast.tsx
│ │
│ ├── hooks/ # Custom hooks
│ │ ├── use-announcements.ts
│ │ ├── use-assignments.ts
│ │ ├── use-chat.ts
│ │ ├── use-click-away.ts
│ │ ├── use-dashboard.ts
│ │ ├── use-forum-infinity.ts
│ │ ├── use-forum.ts
│ │ ├── use-like-status.ts
│ │ ├── use-media-query.ts
│ │ ├── use-notifications.ts
│ │ ├── use-profile.ts
│ │ ├── use-stats.ts
│ │ ├── use-storage.ts
│ │ ├── use-toast.ts
│ │ └── useLectures.ts
│ │
│ ├── lib/ # Utilities & configs
│ │ ├── db/
│ │ │ ├── json-db.ts
│ │ │ └── supabase-client.ts
│ │ ├── auth.ts
│ │ ├── event-bus.ts
│ │ ├── logger.ts
│ │ ├── realtime.ts
│ │ └── utils.ts
│ │
│ ├── store/ # Zustand stores
│ │ └── documents-store.ts
│ │
│ ├── types/ # Type definitions
│ │ ├── index.ts
│ │ └── next-auth.d.ts
│ │
│ └── proxy.ts # Middleware
│
└── .next/ # Build folder (generated)
🎨 TÍNH NĂNG CHÍNH
🔐 Hệ thống xác thực
✅ Đăng nhập với Email/Password

✅ Đăng nhập với Username

✅ Đăng ký tài khoản với đầy đủ thông tin

✅ Phân quyền (Admin, Teacher, Student)

✅ Tự động cấp quyền Admin khi đăng ký số điện thoại 0366017767

📚 Quản lý học tập
✅ Kho tài liệu với tìm kiếm và lọc (Documents)

✅ File Explorer như Windows cho Documents

✅ Bài giảng video và slide (Lectures)

✅ File Explorer cho Lectures

✅ Lịch học và lịch thi

✅ Bài tập và nộp bài với upload file

✅ Môn học và tiến độ

✅ Thông báo và tin tức (Announcements)

✅ Dashboard với dữ liệu thực tế

💬 Cộng đồng
✅ Diễn đàn thảo luận với infinity scroll

✅ Hỏi đáp và bình luận

✅ Chia sẻ dự án

✅ Chat realtime với bạn bè

🛠️ Công cụ
✅ Kho phần mềm

✅ Kho ISO

✅ Kho VM

✅ Packet Tracer files

✅ Cisco Lab files

✅ Upload và Download folder

🎨 Giao diện
✅ Dark/Light Mode

✅ Responsive Design

✅ Glassmorphism effects

✅ Smooth animations (Framer Motion)

✅ Cyberpunk / Futuristic style

🚧 VẤN ĐỀ ĐANG GẶP PHẢI

1. Đổi tên thư mục (Folder Rename) ⚠️
   Mô tả: Chưa có chức năng đổi tên thư mục trong File Explorer

Vị trí: Documents và Lectures

Trạng thái: Đang phát triển

Giải pháp: Thêm nút rename, input inline, API PATCH

2. Phân chia lớp học và danh sách học sinh ⚠️
   Mô tả: Trang bài tập chưa có tính năng phân chia lớp học

Trạng thái: Chưa phát triển

Kế hoạch: Tạo bảng classes, class_students, phân quyền

3. Rating không cập nhật ra bên ngoài ⚠️
   Mô tả: Khi đánh giá trong trang chi tiết, rating được cập nhật trong database nhưng không hiển thị ở trang danh sách

Nguyên nhân: Không refresh cache sau khi mutation thành công

Trạng thái: Đang khắc phục

Giải pháp: Sử dụng React Query invalidation

4. Like và Comments không cập nhật real-time ⚠️
   Mô tả: Khi like hoặc comment, số lượng không tự động cập nhật

Nguyên nhân: Không có real-time subscription

Trạng thái: Đang khắc phục

Giải pháp: Thêm Supabase Realtime subscriptions

5. View tăng nhiều lần khi refresh ⚠️
   Mô tả: Mỗi lần refresh trang, view lại tăng thêm 1

Nguyên nhân: useEffect gọi incrementView nhiều lần

Trạng thái: Đã khắc phục một phần

Giải pháp: Dùng ref để kiểm soát

6. Dark Mode không hoạt động trên production ⚠️
   Mô tả: Chuyển dark/light mode không có hiệu ứng trên Vercel

Nguyên nhân: Thiếu next-themes hoặc cấu hình sai

Trạng thái: Đang khắc phục

Giải pháp: Cài đặt và cấu hình next-themes

7. RLS Policy trên Supabase ⚠️
   Mô tả: new row violates row-level security policy

Nguyên nhân: Policies trên bảng chưa đúng

Trạng thái: Đã khắc phục một phần

Giải pháp: Dùng supabaseAdmin để bypass RLS

🔧 HƯỚNG DẪN CÀI ĐẶT
Yêu cầu hệ thống
Node.js 18+

npm hoặc yarn

Supabase account

Cài đặt
bash

# 1. Clone repository

git clone https://github.com/Hao186188/network-admin-portal.git
cd network-admin-portal

# 2. Cài đặt dependencies

npm install

# 3. Tạo file .env.local từ .env.example

cp .env.example .env.local

# 4. Cập nhật biến môi trường

# Supabase

NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

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

vercel --prod --force
📊 KẾ HOẠCH PHÁT TRIỂN TIẾP THEO
Ưu tiên cao
Đổi tên thư mục (Folder Rename)

Documents File Explorer

Lectures Folder Explorer

API PATCH endpoint

Phân chia lớp học và danh sách học sinh

Tạo bảng classes

Tạo bảng class_students

UI quản lý lớp học

Phân quyền truy cập

Fix Rating không cập nhật

Fix Dark Mode trên production

Hoàn thiện RLS Policies

Ưu tiên trung bình
Thêm real-time subscription cho likes/comments

Tối ưu performance với React Query

Thêm unit tests

PWA support

Ưu tiên thấp
Tối ưu SEO

Thêm analytics

Đa ngôn ngữ (i18n)

📞 LIÊN HỆ
Thông tin Chi tiết
Giảng viên Nguyễn Ngọc Thanh
Developer Võ Nhật Hào
Email vonhathaoqtm3k14@gmail.com
GitHub https://github.com/Hao186188
Website https://qtm3k14.vercel.app
🔜 KẾ HOẠCH CHI TIẾT

1. Đổi tên thư mục (Folder Rename)
   Mục tiêu: Cho phép Admin/Teacher đổi tên thư mục trong File Explorer

Các file cần sửa:

documents/components/FileExplorer/FolderTree.tsx - Thêm nút rename

documents/components/FileExplorer/index.tsx - Thêm hàm rename

lectures/components/FolderExplorer/FolderTree.tsx - Thêm nút rename

lectures/components/FolderExplorer/index.tsx - Thêm hàm rename

api/documents/route.ts - Thêm action rename

api/lectures/route.ts - Thêm action rename

Flow:

Hover vào folder → hiển thị icon ✏️

Click icon → input inline hiển thị

Nhập tên mới → Enter hoặc blur → gọi API

API update tên folder → refresh danh sách

2. Phân chia lớp học và danh sách học sinh
   Mục tiêu: Quản lý học sinh theo lớp học

Cấu trúc database:

sql
-- Bảng lớp học
CREATE TABLE classes (
id UUID PRIMARY KEY,
name TEXT NOT NULL,
code TEXT UNIQUE,
teacher_id UUID REFERENCES users(id),
description TEXT,
created_at TIMESTAMP
);

-- Bảng học sinh theo lớp
CREATE TABLE class_students (
id UUID PRIMARY KEY,
class_id UUID REFERENCES classes(id),
student_id UUID REFERENCES users(id),
joined_at TIMESTAMP,
UNIQUE(class_id, student_id)
);
Tính năng:

Tạo lớp học mới

Thêm/xóa học sinh

Gán giáo viên phụ trách

Xem danh sách theo lớp

"Kết nối tri thức - Làm chủ hệ thống mạng" 🚀
