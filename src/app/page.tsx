// src/app/page.tsx
// Vai trò: Trang chủ - BỔ SUNG SEO

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
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

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

  // ✅ JSON-LD Schema for HomePage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mạng 3 Hub - Quản trị Mạng 3",
    url: "https://qtm3k14.vercel.app",
    description:
      "Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://qtm3k14.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Mạng 3 Hub",
      logo: "https://qtm3k14.vercel.app/logo.png",
    },
  };

  // ✅ Breadcrumb Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://qtm3k14.vercel.app/",
      },
    ],
  };

  // ✅ FAQ Schema (nếu có)
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Mạng 3 Hub là gì?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mạng 3 Hub là nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang.",
        },
      },
      {
        "@type": "Question",
        name: "Ai có thể tham gia Mạng 3 Hub?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tất cả sinh viên, giảng viên và những người quan tâm đến Quản trị Mạng đều có thể tham gia.",
        },
      },
    ],
  };

  return (
    <>
      {/* ✅ JSON-LD Schema */}
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* ✅ Google Analytics (nếu có) */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `,
        }}
      />

      {/* ✅ Next.js Head */}
      <Head>
        {/* Primary Meta Tags */}
        <title>Mạng 3 Hub - Quản trị Mạng 3 | Học tập hiện đại</title>
        <meta
          name="title"
          content="Mạng 3 Hub - Quản trị Mạng 3 | Học tập hiện đại"
        />
        <meta
          name="description"
          content="Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang. Tài liệu, bài giảng, bài tập và cộng đồng."
        />
        <meta
          name="keywords"
          content="Mạng 3 Hub, Quản trị Mạng, Học tập, Kiên Giang, Cao đẳng Nghề, Network Administration, Cisco, Linux"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Võ Nhật Hào" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qtm3k14.vercel.app/" />
        <meta
          property="og:title"
          content="Mạng 3 Hub - Quản trị Mạng 3 | Học tập hiện đại"
        />
        <meta
          property="og:description"
          content="Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3."
        />
        <meta
          property="og:image"
          content="https://qtm3k14.vercel.app/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Mạng 3 Hub" />
        <meta property="og:locale" content="vi_VN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mạng 3 Hub - Quản trị Mạng 3 | Học tập hiện đại"
        />
        <meta
          name="twitter:description"
          content="Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3."
        />
        <meta
          name="twitter:image"
          content="https://qtm3k14.vercel.app/og-image.png"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://qtm3k14.vercel.app/" />

        {/* Alternate Language */}
        <link
          rel="alternate"
          hrefLang="vi"
          href="https://qtm3k14.vercel.app/"
        />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Verification */}
        <meta
          name="google-site-verification"
          content="fWJ9xSva7OMPit8NxNyIzmzItlhloIppaCNr6cIhoJQ"
        />
      </Head>

      <div className="min-h-screen bg-background">
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

          {/* Stats Section */}
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

          {/* CTA Section */}
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
    </>
  );
}
