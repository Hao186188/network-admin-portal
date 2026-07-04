// src/app/page.tsx
// Vai trò: Trang chủ với auto margin

"use client";

import { FeatureCard } from "@/components/cards/feature-card";
import { Stats } from "@/components/features/stats";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { HeroSection } from "@/components/sections/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Server,
  Shield,
  Target,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const features = [
  {
    icon: BookOpen,
    title: "Tài liệu phong phú",
    description:
      "Hàng trăm tài liệu, bài giảng và giáo trình được cập nhật liên tục",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Video,
    title: "Bài giảng chất lượng",
    description: "Video bài giảng với chất lượng cao và dễ hiểu",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Server,
    title: "Kho phần mềm",
    description: "Tổng hợp phần mềm chuyên ngành và công cụ hỗ trợ học tập",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "Bảo mật cao",
    description: "Hệ thống được bảo vệ với các tiêu chuẩn bảo mật hàng đầu",
    color: "from-green-500 to-green-600",
  },
];

const stats = [
  { value: "50+", label: "Tài liệu", icon: FileText },
  { value: "30+", label: "Bài giảng", icon: Video },
  { value: "25+", label: "Sinh viên", icon: Users },
  { value: "10+", label: "Dự án", icon: Target },
];

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lắng nghe sự kiện toggle sidebar
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarWidth(e.detail.isCollapsed ? 80 : 280);
    };
    window.addEventListener(
      "sidebar-toggle",
      handleSidebarToggle as EventListener,
    );
    return () =>
      window.removeEventListener(
        "sidebar-toggle",
        handleSidebarToggle as EventListener,
      );
  }, []);

  const marginLeft = isMobile ? 0 : sidebarWidth;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <Sidebar />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: `${marginLeft}px` }}
      >
        <Navbar />
        <main className="pt-16 md:pt-20">
          <HeroSection />

          {/* Features Section */}
          <section className="py-16 md:py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                  Tính năng nổi bật
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Những gì Mạng 3 Hub mang đến cho bạn
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 md:py-20 px-4 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="max-w-7xl mx-auto">
              <Stats stats={stats} />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 border-primary-200/30">
                  <CardContent className="p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                      Sẵn sàng bắt đầu học tập?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                      Tham gia cộng đồng học tập Mạng 3 Hub để tiếp cận kiến
                      thức và phát triển kỹ năng
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/documents">
                        <Button
                          size="lg"
                          className="gap-2 w-full sm:w-auto group"
                        >
                          <BookOpen className="w-4 h-4" />
                          Khám phá ngay
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link href="/about">
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          Tìm hiểu thêm
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
