# 📚 Mạng 3 Hub - Tài liệu dự án hoàn chỉnh

## 🎯 TỔNG QUAN DỰ ÁN

**Mạng 3 Hub** là nền tảng học tập hiện đại dành cho lớp Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang. Dự án được xây dựng với công nghệ **Next.js 16.2.10**, **TypeScript**, và **TailwindCSS**, mang đến trải nghiệm học tập tối ưu cho sinh viên, giảng viên và ban cán sự lớp.

## 📌 Thông tin dự án

| Thông tin            | Chi tiết                                         |
| -------------------- | ------------------------------------------------ |
| Tên dự án            | Mạng 3 Hub / Network Administration Class Portal |
| Giảng viên chủ nhiệm | Nguyễn Ngọc Thanh                                |
| Phát triển bởi       | Võ Nhật Hào                                      |
| Lớp                  | Quản trị Mạng 3                                  |
| Trường               | Cao đẳng Nghề Kiên Giang                         |
| Trạng thái           | ✅ Đang phát triển                               |
| Website              | https://qtm3k14.vercel.app                       |

## 🚀 CÔNG NGHỆ SỬ DỤNG

### Frontend

| Công nghệ       | Vai trò            |
| --------------- | ------------------ |
| Next.js 16.2.10 | Framework chính    |
| TypeScript      | Ngôn ngữ lập trình |
| TailwindCSS     | UI styling         |
| Shadcn UI       | Component library  |
| Framer Motion   | Animation          |
| React Hook Form | Form handling      |
| Zod             | Validation         |
| Zustand         | State management   |
| Lucide React    | Icons              |

### Backend & Database

| Công nghệ             | Vai trò        |
| --------------------- | -------------- |
| NextAuth.js (v4)      | Authentication |
| Supabase (PostgreSQL) | Database       |
| Next.js API Routes    | Backend API    |
| Supabase Storage      | File storage   |

### Deployment

| Công nghệ          | Vai trò         |
| ------------------ | --------------- |
| Vercel             | Hosting         |
| Git, GitHub        | Version control |
| Vercel Auto Deploy | CI/CD           |

## 📁 CẤU TRÚC THƯ MỤC CHI TIẾT

network-admin-portal/
├── .next/ # Next.js build output
├── .vercel/ # Vercel deployment config
├── node_modules/ # Dependencies
├── public/ # Static files
│ ├── favicon.ico
│ └── grid.svg
├── src/ # Source code
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Authentication pages
│ │ ├── (dashboard)/ # Dashboard pages
│ │ ├── (routes)/ # Public routes
│ │ ├── api/ # API Routes
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── providers.tsx
│ ├── components/ # React components
│ │ ├── animations/
│ │ ├── cards/
│ │ ├── chat/
│ │ ├── common/
│ │ ├── dashboard/
│ │ ├── features/
│ │ ├── forum/
│ │ ├── forms/
│ │ ├── layout/
│ │ ├── providers/
│ │ ├── sections/
│ │ └── ui/
│ ├── hooks/ # Custom hooks
│ ├── lib/ # Utilities & configs
│ ├── types/ # Type definitions
│ └── proxy.ts # Middleware
├── data/ # JSON data (backup)
├── scripts/ # Utility scripts
├── .env.local # Environment variables
├── .env.example # Environment variables template
├── .gitignore
├── components.json # Shadcn UI config
├── next.config.js # Next.js config
├── package.json # Dependencies
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md

## 💡 LƯU Ý CHO NGƯỜI PHÁT TRIỂN

### 1. Theme Provider

- ✅ **Sử dụng custom Theme Context** (KHÔNG dùng next-themes)
- Theme được lưu trong localStorage với key `theme`
- Hỗ trợ system, light, dark

### 2. Authentication

- Sử dụng NextAuth v4 với Credentials Provider
- Session được lưu bằng JWT
- Hỗ trợ đăng nhập bằng email hoặc username
- Phân quyền: ADMIN, TEACHER, STUDENT

### 3. Database

- **CHỈ sử dụng Supabase (PostgreSQL)** (KHÔNG dùng Prisma)
- Có RLS policies bảo vệ dữ liệu
- Triggers tự động tạo notifications

### 4. Components Pattern

- `use client` cho tất cả component tương tác
- Atomic Design: ui → common → layout → features
- Shadcn UI cho components cơ bản

### 5. Styling

- TailwindCSS với dark mode
- Custom CSS variables trong globals.css
- Glassmorphism và gradient effects

## 📞 LIÊN HỆ

| Thông tin  | Chi tiết                     |
| ---------- | ---------------------------- |
| Giảng viên | Nguyễn Ngọc Thanh            |
| Developer  | Võ Nhật Hào                  |
| Email      | vonhathaoqtm3k14@gmail.com   |
| GitHub     | https://github.com/Hao186188 |
| Website    | https://qtm3k14.vercel.app   |

---

> **"Kết nối tri thức - Làm chủ hệ thống mạng"** 🚀
