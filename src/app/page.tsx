// src/app/page.tsx
// Vai trò: Trang chủ

"use client";

import { FeatureCard } from "@/components/cards/feature-card";
import { Stats } from "@/components/features/stats";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStats } from "@/hooks/use-stats";
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

export default function Home() {
  const stats = useStats();

  const statsData = [
    {
      value: stats.documents,
      label: "Tài liệu",
      icon: FileText,
      suffix: "+",
    },
    {
      value: stats.lectures,
      label: "Bài giảng",
      icon: Video,
      suffix: "+",
    },
    {
      value: stats.students,
      label: "Sinh viên",
      icon: Users,
      suffix: "+",
    },
    {
      value: stats.projects,
      label: "Dự án",
      icon: Target,
      suffix: "+",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <HeroSection />

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
              <p className="text-muted-foreground mt-2">
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

        <section className="py-16 md:py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                Thành tựu
              </h2>
              <p className="text-muted-foreground mt-2">
                Những con số ấn tượng của Mạng 3 Hub
              </p>
            </motion.div>

            {stats.loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="text-center border-border">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-muted animate-pulse mx-auto mb-3" />
                      <div className="h-8 w-20 bg-muted animate-pulse mx-auto" />
                      <div className="h-4 w-24 bg-muted animate-pulse mx-auto mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : stats.error ? (
              <div className="text-center text-destructive">
                <p>Không thể tải dữ liệu thống kê</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Thử lại
                </Button>
              </div>
            ) : (
              <Stats stats={statsData} />
            )}
          </div>
        </section>

        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
                <CardContent className="p-8 md:p-12 text-center">
                  <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    Sẵn sàng bắt đầu học tập?
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Tham gia cộng đồng học tập Mạng 3 Hub để tiếp cận kiến thức
                    và phát triển kỹ năng
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
  );
}
