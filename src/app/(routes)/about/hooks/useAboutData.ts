// src/app/(routes)/about/hooks/useAboutData.ts

"use client";

import {
  Activity,
  Cpu,
  Database,
  Network,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import { FaFacebook, FaGithub, FaTiktok, FaYoutube } from "react-icons/fa";
import {
  Exploration,
  JournalEntry,
  Project,
  QuickLink,
  SocialLink,
  StatData,
} from "../types";

// ============================================
// DATA
// ============================================

export const projects: Project[] = [
  {
    id: 1,
    title: "Mạng 3 Hub",
    description: "Nền tảng học tập hiện đại cho sinh viên Quản trị Mạng",
    tech: ["Next.js", "TypeScript", "TailwindCSS", "Supabase"],
    link: "https://qtm3k14.vercel.app",
    github: "https://github.com/Hao186188/network-admin-portal",
    image: "/images/project1.jpg",
    code: "SYS_PROJ_01",
  },
  {
    id: 2,
    title: "Hệ thống hỗ trợ việc làm part-time cho sinh viên",
    description: "Dashboard quản lý và giám sát hệ thống",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    link: "https://job-kiengiang.vercel.app/",
    github: "https://github.com/Hao186188/job-kiengiang",
    image: "/images/project2.jpg",
    code: "SYS_PROJ_02",
  },
  {
    id: 3,
    title: "Trang Portfolio cá nhân",
    description: "Nền tảng kết nối cá nhân kỹ năng và thái độ chuyên nghiệp",
    tech: ["HTML", "JavaScripts", "TailwindCSS/CSS"],
    link: "https://hao186188.github.io/profolio-nhathao/",
    github: "https://github.com/Hao186188/profolio-nhathao",
    image: "/images/project3.jpg",
    code: "SYS_PROJ_03",
  },
  {
    id: 4,
    title: "Aternos Automation Tool",
    description: "Công cụ tự động hóa cấu hình Server Aternos",
    tech: ["Python", "Ansible", "Docker"],
    link: "https://github.com/Hao186188/cmc",
    github: "https://github.com/Hao186188/cmc",
    image: "/images/project4.jpg",
    code: "SYS_PROJ_04",
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: 1,
    title: "Xây dựng nền tảng học tập hiện đại",
    date: "15/06/2024",
    readTime: "5 phút",
  },
  {
    id: 2,
    title: "Tối ưu hiệu suất với Next.js 16",
    date: "10/06/2024",
    readTime: "4 phút",
  },
  {
    id: 3,
    title: "Thiết kế UI/UX cho người học",
    date: "05/06/2024",
    readTime: "6 phút",
  },
  {
    id: 4,
    title: "Quản lý dữ liệu với Supabase",
    date: "01/06/2024",
    readTime: "3 phút",
  },
];

export const explorations: Exploration[] = [
  {
    id: 1,
    title: "3D Interactive",
    color: "from-blue-500 to-cyan-500",
    icon: Cpu,
    description: "Three.js & WebGL",
    status: "ACTIVE",
    code: "SYS_REC_001",
  },
  {
    id: 2,
    title: "Motion Design",
    color: "from-purple-500 to-pink-500",
    icon: Zap,
    description: "Framer Motion & GSAP",
    status: "DEVELOP",
    code: "SYS_REC_002",
  },
  {
    id: 3,
    title: "UI/UX Lab",
    color: "from-green-500 to-emerald-500",
    icon: Shield,
    description: "Design System & Prototype",
    status: "ACTIVE",
    code: "SYS_REC_003",
  },
  {
    id: 4,
    title: "Network Viz",
    color: "from-orange-500 to-red-500",
    icon: Network,
    description: "D3.js & Topology",
    status: "EXPERIMENT",
    code: "SYS_REC_004",
  },
  {
    id: 5,
    title: "Data Art",
    color: "from-indigo-500 to-purple-500",
    icon: Database,
    description: "Generative & Visualization",
    status: "ACTIVE",
    code: "SYS_REC_005",
  },
  {
    id: 6,
    title: "Generative",
    color: "from-rose-500 to-pink-500",
    icon: Terminal,
    description: "AI & Creative Coding",
    status: "EXPERIMENT",
    code: "SYS_REC_006",
  },
];

export const statsData: StatData[] = [
  {
    label: "Năm kinh nghiệm",
    value: "3+",
    desc: "System & Network",
    icon: Cpu,
    color: "text-cyan-400",
  },
  {
    label: "Dự án hoàn thành",
    value: "10+",
    desc: "Web & Automation",
    icon: Zap,
    color: "text-purple-400",
  },
  {
    label: "Lab Topology",
    value: "25+",
    desc: "Cisco & Docker Setup",
    icon: Network,
    color: "text-emerald-400",
  },
  {
    label: "Học viên hỗ trợ",
    value: "150+",
    desc: "QTM3 Classmates",
    icon: Activity,
    color: "text-amber-400",
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    icon: FaFacebook,
    href: "https://www.facebook.com/groups/1207554754608649",
    color: "hover:bg-[#1877F2]",
    bg: "bg-[#1877F2]/10",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    href: "https://github.com/hao186188",
    color: "hover:bg-[#181717]",
    bg: "bg-[#181717]/10",
  },
  {
    name: "TikTok",
    icon: FaTiktok,
    href: "https://www.tiktok.com/@mbstore_nhungconbao",
    color: "hover:bg-[#000000]",
    bg: "bg-[#000000]/10",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    href: "https://www.youtube.com/channel/UCl17OX4LvYOkkJpnKteSgsw",
    color: "hover:bg-[#FF0000]",
    bg: "bg-[#FF0000]/10",
  },
];

export const quickLinks: QuickLink[] = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Tài liệu", href: "/documents" },
  { name: "Bài giảng", href: "/lectures" },
  { name: "Diễn đàn", href: "/forum" },
  { name: "Liên hệ", href: "/contact" },
];

export function useAboutData() {
  return {
    projects,
    journalEntries,
    explorations,
    statsData,
    socialLinks,
    quickLinks,
    roles: ["Developer", "Designer", "Creator", "Builder"],
  };
}
