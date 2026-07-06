// src/components/layout/footer.tsx
// Vai trò: Footer - HỖ TRỢ DARK MODE

"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Globe,
  Heart,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Server,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Tài liệu", href: "/documents" },
  { name: "Bài giảng", href: "/lectures" },
  { name: "Lịch học", href: "/schedule" },
  { name: "Diễn đàn", href: "/forum" },
  { name: "FAQ", href: "/faq" },
  { name: "Liên hệ", href: "/contact" },
];

const resources = [
  { name: "Kho phần mềm", href: "/software", icon: Server },
  { name: "Kho ISO", href: "/iso", icon: FileText },
  { name: "Kho VM", href: "/vm", icon: Shield },
  { name: "Packet Tracer", href: "/packet-tracer", icon: Zap },
  { name: "Cisco Lab", href: "/cisco-lab", icon: Globe },
  { name: "Linux", href: "/linux", icon: Server },
  { name: "Windows Server", href: "/windows-server", icon: Shield },
  { name: "Docker", href: "/docker", icon: Zap },
];

const socialLinks = [
  { name: "Facebook", icon: LinkIcon, href: "#", color: "hover:bg-blue-600" },
  { name: "GitHub", icon: LinkIcon, href: "#", color: "hover:bg-gray-800" },
  { name: "Twitter", icon: LinkIcon, href: "#", color: "hover:bg-sky-500" },
  { name: "YouTube", icon: LinkIcon, href: "#", color: "hover:bg-red-600" },
  { name: "LinkedIn", icon: LinkIcon, href: "#", color: "hover:bg-blue-700" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-muted/30 border-t border-border">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text">
                  Mạng 3 Hub
                </span>
                <span className="text-xs text-muted-foreground block -mt-1">
                  Quản trị Mạng
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs">
              Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, nơi
              chia sẻ tài liệu, bài giảng và kết nối cộng đồng.
            </p>

            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-xl bg-muted text-muted-foreground transition-all duration-300 ${social.color} hover:text-white hover:shadow-lg`}
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Tài nguyên
            </h3>
            <ul className="space-y-2.5">
              {resources.map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <li key={resource.name}>
                    <Link
                      href={resource.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {resource.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Thông tin liên hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Trường Cao đẳng Nghề Kiên Giang</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>thanh.nn@cdngk.edu.vn</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+84 123 456 789</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Giảng viên:
                  </span>
                  <span>Nguyễn Ngọc Thanh</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Phát triển:
                  </span>
                  <span>Võ Nhật Hào</span>
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
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>© {currentYear} Mạng 3 Hub.</span>
              <span>Tất cả quyền được bảo lưu.</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-destructive animate-pulse" />
              <span>by</span>
              <Link
                href="#"
                className="font-medium text-primary hover:underline"
              >
                Võ Nhật Hào
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
