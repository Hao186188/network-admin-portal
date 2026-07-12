// src/components/layout/footer.tsx
// DÙNG REACT-ICONS

"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaGithub,
  FaTiktok,
  FaYoutube
} from "react-icons/fa";

const quickLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Tài liệu", href: "/documents" },
  { name: "Bài giảng", href: "/lectures" },
  { name: "Diễn đàn", href: "/forum" },
  { name: "Liên hệ", href: "/contact" },
];

const socialLinks = [
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

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-background border-t border-border/50">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
              aria-label="Trang chủ"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text">
                  Mạng 3 Hub
                </span>
                <span className="text-[10px] text-muted-foreground block -mt-0.5">
                  Quản trị Mạng
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, nơi
              chia sẻ tài liệu, bài giảng và kết nối cộng đồng.
            </p>

            {/* Social Links - Mobile Friendly */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    p-2.5 rounded-xl 
                    ${social.bg} 
                    text-muted-foreground 
                    transition-all duration-300 
                    ${social.color} 
                    hover:text-white hover:shadow-lg 
                    touch-friendly
                    min-h-[44px] min-w-[44px]
                    flex items-center justify-center
                  `}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group py-1 touch-friendly"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Thông tin liên hệ
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 text-sm text-muted-foreground group">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">
                  Trường Cao đẳng Nghề Kiên Giang
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a
                  href="mailto:thanh.nn@cdngk.edu.vn"
                  className="hover:text-primary transition-colors"
                >
                  thanh.nn@cdngk.edu.vn
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <a
                  href="tel:+84123456789"
                  className="hover:text-primary transition-colors"
                >
                  +84 123 456 789
                </a>
              </div>

              {/* Teacher & Developer Info - Mobile Friendly */}
              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Giảng viên:
                  </span>
                  <span className="text-primary">Nguyễn Ngọc Thanh</span>
                </div>
                <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Phát triển:
                  </span>
                  <span className="text-primary">Võ Nhật Hào</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 pt-6 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              <span>© {currentYear} Mạng 3 Hub.</span>
              <span className="hidden sm:inline">
                {" "}
                Tất cả quyền được bảo lưu.
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-destructive animate-pulse" />
              <span>by</span>
              <Link
                href="https://hao186188.github.io/profolio-nhathao/"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Võ Nhật Hào
              </Link>
            </div>

            {/* Version */}
            <span className="text-[10px] sm:text-xs text-muted-foreground/50">
              v2.0.0
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button - Mobile Friendly */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className={`
          fixed bottom-6 right-6 z-50
          w-12 h-12 rounded-full
          bg-gradient-to-r from-primary to-secondary
          text-white shadow-lg shadow-primary/30
          hover:shadow-primary/50 hover:scale-105
          transition-all duration-300
          flex items-center justify-center
          touch-friendly
          ${showScrollTop ? "pointer-events-auto" : "pointer-events-none"}
        `}
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
