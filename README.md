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
├── next.config.js # Next.js config - ĐÃ TỐI ƯU
├── package.json # Dependencies - ĐÃ TỐI ƯU
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
│ │ │ ├── about/
│ │ │ │ └── page.tsx
│ │ │ ├── admin/
│ │ │ │ └── page.tsx
│ │ │ ├── announcements/ # Thông báo - ĐÃ HOÀN CHỈNH
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
│ │ │ ├── chat/
│ │ │ │ └── page.tsx
│ │ │ ├── cisco-lab/
│ │ │ │ └── page.tsx
│ │ │ ├── contact/
│ │ │ │ └── page.tsx
│ │ │ ├── courses/
│ │ │ │ └── page.tsx
│ │ │ ├── docker/
│ │ │ │ └── page.tsx
│ │ │ ├── documents/ # Tài liệu - ĐÃ HOÀN CHỈNH
│ │ │ │ ├── page.tsx
│ │ │ │ ├── [id]/
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
│ │ │ │ │ └── UploadDocumentModal.tsx
│ │ │ │ ├── hooks/
│ │ │ │ │ ├── useDocumentInteractions.ts
│ │ │ │ │ └── useDocuments.ts
│ │ │ │ └── types/
│ │ │ │ └── index.ts
│ │ │ ├── exams/
│ │ │ │ └── page.tsx
│ │ │ ├── faq/
│ │ │ │ └── page.tsx
│ │ │ ├── forum/ # Diễn đàn - ĐÃ HOÀN CHỈNH
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
│ │ │ ├── test-supabase/
│ │ │ │ └── route.ts
│ │ │ └── verify/
│ │ │ └── route.ts
│ │ │
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx # Root layout - ĐÃ TỐI ƯU SEO
│ │ ├── page.tsx # Trang chủ - ĐÃ TỐI ƯU SEO
│ │ ├── providers.tsx # Providers - ĐÃ TỐI ƯU
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
│ │ │ ├── TerminalTyping.tsx
│ │ │ └── index.ts
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
│ │ │ ├── UserActions.tsx
│ │ │ └── index.ts
│ │ ├── features/
│ │ │ └── stats.tsx
│ │ ├── forms/
│ │ │ └── input-with-icon.tsx
│ │ ├── layout/
│ │ │ ├── footer.tsx
│ │ │ ├── navbar-client.tsx
│ │ │ └── navbar.tsx
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
│ │ ├── use-announcements.ts # Quản lý thông báo - ĐÃ HOÀN CHỈNH
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
│ │ └── use-toast.ts
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
│ └── proxy.ts # Middleware - ĐÃ HOÀN CHỈNH
│
├── data/ # JSON data (backup)
│ └── db.json
│
├── scripts/ # Utility scripts
│ ├── check-user.js
│ ├── create-admin.js
│ └── test-password.js
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

✅ Bài giảng video và slide

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

🎨 Giao diện
✅ Dark/Light Mode

✅ Responsive Design

✅ Glassmorphism effects

✅ Smooth animations (Framer Motion)

✅ Cyberpunk / Futuristic style

🚧 VẤN ĐỀ ĐANG GẶP PHẢI

1. Rating không cập nhật ra bên ngoài ⚠️
   Mô tả: Khi đánh giá trong trang chi tiết, rating được cập nhật trong database nhưng không hiển thị ở trang danh sách

Nguyên nhân: Không refresh cache sau khi mutation thành công

Trạng thái: Đang khắc phục

Giải pháp đề xuất: Sử dụng React Query invalidation

2. Like và Comments không cập nhật real-time ⚠️
   Mô tả: Khi like hoặc comment, số lượng không tự động cập nhật

Nguyên nhân: Không có real-time subscription

Trạng thái: Đang khắc phục

Giải pháp đề xuất: Thêm Supabase Realtime subscriptions

3. View tăng nhiều lần khi refresh ⚠️
   Mô tả: Mỗi lần refresh trang, view lại tăng thêm 1

Nguyên nhân: useEffect gọi incrementView nhiều lần

Trạng thái: Đã khắc phục một phần

Giải pháp đề xuất: Dùng ref để kiểm soát

4. Dark Mode không hoạt động ⚠️
   Mô tả: Chuyển dark/light mode không có hiệu ứng

Nguyên nhân: Thiếu next-themes hoặc cấu hình sai

Trạng thái: Đang khắc phục

Giải pháp đề xuất: Cài đặt và cấu hình next-themes

5. Skeleton Comments hiển thị mãi không biến mất ⚠️
   Mô tả: Loading skeleton của comments không biến mất sau khi load

Nguyên nhân: State loading không được set false

Trạng thái: Đã khắc phục một phần

Giải pháp đề xuất: Kiểm tra và set loading false đúng cách

6. Lỗi RLS Policy trên Supabase ⚠️
   Mô tả: new row violates row-level security policy

Nguyên nhân: Policies trên bảng chưa đúng

Trạng thái: Đã khắc phục một phần

Giải pháp đề xuất: Cập nhật RLS policies

7. Upload file lỗi Storage ⚠️
   Mô tả: Không thể upload file lên Supabase Storage

Nguyên nhân: Bucket chưa được tạo hoặc policies sai

Trạng thái: Đã khắc phục

Giải pháp đề xuất: Tạo bucket và policies đúng

📊 BẢNG TỔNG HỢP COMPONENT CHÍNH
✅ Documents (Tài liệu)
Component File Trạng thái
DocumentsHero components/DocumentsHero.tsx ✅ Hoàn chỉnh
DocumentsGrid components/DocumentsGrid.tsx ✅ Hoàn chỉnh
DocumentsCard components/DocumentsCard.tsx ✅ Hoàn chỉnh
DocumentsFilters components/DocumentsFilters.tsx ✅ Hoàn chỉnh
DocumentsStats components/DocumentsStats.tsx ✅ Hoàn chỉnh
DocumentsSearch components/DocumentsSearch.tsx ✅ Hoàn chỉnh
DocumentsPagination components/DocumentsPagination.tsx ✅ Hoàn chỉnh
UploadDocumentModal components/UploadDocumentModal.tsx ✅ Hoàn chỉnh
EditDocumentModal components/EditDocumentModal.tsx ✅ Hoàn chỉnh
useDocuments hooks/useDocuments.ts ✅ Hoàn chỉnh
✅ Announcements (Thông báo)
Component File Trạng thái
AnnouncementHero components/AnnouncementHero.tsx ✅ Hoàn chỉnh
AnnouncementCard components/AnnouncementCard.tsx ✅ Hoàn chỉnh
AnnouncementFilters components/AnnouncementFilters.tsx ✅ Hoàn chỉnh
AnnouncementStats components/AnnouncementStats.tsx ✅ Hoàn chỉnh
AnnouncementTicker components/AnnouncementTicker.tsx ✅ Hoàn chỉnh
AnnouncementSkeleton components/AnnouncementSkeleton.tsx ✅ Hoàn chỉnh
CreateAnnouncementModal components/CreateAnnouncementModal.tsx ✅ Hoàn chỉnh
useAnnouncements hooks/use-announcements.ts ✅ Hoàn chỉnh
✅ Assignments (Bài tập)
Component File Trạng thái
AssignmentHero components/AssignmentHero.tsx ✅ Hoàn chỉnh
AssignmentCard components/AssignmentCard.tsx ✅ Hoàn chỉnh
AssignmentFilters components/AssignmentFilters.tsx ✅ Hoàn chỉnh
AssignmentStats components/AssignmentStats.tsx ✅ Hoàn chỉnh
AssignmentSkeleton components/AssignmentSkeleton.tsx ✅ Hoàn chỉnh
StatusBadge components/StatusBadge.tsx ✅ Hoàn chỉnh
CreateAssignmentModal components/CreateAssignmentModal.tsx ✅ Hoàn chỉnh
SubmitAssignmentModal components/SubmitAssignmentModal.tsx ✅ Hoàn chỉnh
useAssignments hooks/use-assignments.ts ✅ Hoàn chỉnh
🛠️ HƯỚNG DẪN CÀI ĐẶT
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

vercel --prod
📖 HƯỚNG DẪN SỬ DỤNG
Cho sinh viên
Đăng ký tài khoản: Điền đầy đủ thông tin

Đăng nhập: Bằng email hoặc tên đăng nhập

Xem tài liệu: Truy cập /documents

Nộp bài tập: Vào /assignments, chọn bài tập và nộp file

Theo dõi thông báo: Icon chuông trên navbar

Cho giáo viên
Tạo bài tập: /assignments → "Tạo bài tập"

Xem bài nộp: /submissions

Chấm điểm: Click "Chấm điểm" trên bài nộp

Quản lý môn học: /courses

Cho Admin
Quản trị hệ thống: /admin

Quản lý tài khoản: Xem, sửa, xóa, phân quyền

Xem thống kê: Dashboard

📞 LIÊN HỆ
Thông tin Chi tiết
Giảng viên Nguyễn Ngọc Thanh
Developer Võ Nhật Hào
Email vonhathaoqtm3k14@gmail.com
GitHub https://github.com/Hao186188
Website https://qtm3k14.vercel.app
🔜 KẾ HOẠCH PHÁT TRIỂN TIẾP THEO
Ưu tiên cao
✅ Fix Rating không cập nhật

✅ Fix Dark Mode

✅ Fix Skeleton Comments

✅ Hoàn thiện RLS Policies

Ưu tiên trung bình
Thêm real-time subscription cho likes/comments

Tối ưu performance với React Query

Thêm unit tests

Ưu tiên thấp
Thêm PWA support

Tối ưu SEO

Thêm analytics

"Kết nối tri thức - Làm chủ hệ thống mạng" 🚀
