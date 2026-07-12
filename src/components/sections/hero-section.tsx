// src/components/sections/hero-section.tsx
// Vai trò: Hiển thị Hero Section - FIX HYDRATION ERROR

"use client";

import { AnimatedCounter } from "@/components/common/animated-counter";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/use-stats";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  FileText,
  MessageCircle,
  Network,
  Server,
  Shield,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// FIX: Sử dụng giá trị cố định cho floating icons positions
const floatingIcons = [
  { Icon: Network, x: -20, y: -30, delay: 0 },
  { Icon: Server, x: 30, y: -20, delay: 1.5 },
  { Icon: Shield, x: -40, y: 20, delay: 3 },
  { Icon: Zap, x: 40, y: 30, delay: 4.5 },
];

// FIX: Tạo particles với giá trị cố định để tránh hydration error
const generateParticles = () => {
  const particles = [];
  for (let i = 0; i < 15; i++) {
    const seed = i * 100 + 50;
    particles.push({
      x: (seed % 360) - 180,
      y: ((seed * 7) % 360) - 180,
      duration: ((seed * 3) % 40) / 10 + 2.5,
      delay: ((seed * 5) % 20) / 10,
      size: (seed % 3) + 1,
    });
  }
  return particles;
};

// FIX: Tạo orbiting nodes với giá trị cố định
const generateOrbitingNodes = () => {
  return [...Array(6)].map((_, index) => {
    const angle = (index / 6) * Math.PI * 2;
    const radius = 145;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      isEven: index % 2 === 0,
    };
  });
};

export function HeroSection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [mounted, setMounted] = useState(false);

  // FIX: Lưu giá trị cố định trong state để tránh re-render
  const [particles] = useState(() => generateParticles());
  const [orbitingNodes] = useState(() => generateOrbitingNodes());
  const stats = useStats();

  useEffect(() => {
    setMounted(true);
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Stats data với icon - LẤY DỮ LIỆU THỰC
  const statsData = [
    {
      value: stats.documents,
      label: "Tài liệu học tập",
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
      icon: Zap,
      suffix: "+",
    },
    {
      value: stats.projects,
      label: "Dự án thực tế",
      icon: Network,
      suffix: "+",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12 lg:py-0">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

        {/* Animated Blobs */}
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary-200/30 to-secondary-200/30 dark:from-primary-900/20 dark:to-secondary-900/20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-accent-200/20 to-primary-200/20 dark:from-accent-900/20 dark:to-primary-900/20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.06) 1px, transparent 0)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Icons - Chỉ render khi mounted */}
      {mounted &&
        floatingIcons.map(({ Icon, x, y, delay }, index) => (
          <motion.div
            key={`floating-${index}`}
            className="absolute hidden lg:block text-primary-400/20 dark:text-primary-300/15"
            style={{ left: `calc(50% + ${x}%)`, top: `calc(50% + ${y}%)` }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={80} strokeWidth={0.5} />
          </motion.div>
        ))}

      <div className="container relative px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
            className="space-y-8 order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/30 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50"
            >
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Lớp Quản trị Mạng 3
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Kết nối tri thức
              </span>
              <br />
              <span className="text-gray-800 dark:text-white">
                Làm chủ hệ thống mạng
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed"
            >
              Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng, nơi
              chia sẻ tài liệu, bài giảng và kết nối cộng đồng.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/documents">
                <Button className="group" size="lg" variant="gradient">
                  <span>Khám phá ngay</span>
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  className="border-2 border-primary-200 dark:border-primary-700 text-gray-700 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  size="lg"
                  variant="glass"
                >
                  <Video className="mr-2 w-4 h-4" />
                  Xem giới thiệu
                </Button>
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {[
                { icon: BookOpen, label: "Tài liệu", href: "/documents" },
                { icon: FileText, label: "Bài giảng", href: "/lectures" },
                { icon: MessageCircle, label: "Thảo luận", href: "/forum" },
              ].map((item, index) => (
                <Link href={item.href} key={index}>
                  <Button
                    className="gap-2 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
                    size="sm"
                    variant="ghost"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </motion.div>

            {/* Stats với animation số chạy - DỮ LIỆU THỰC */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
            >
              {statsData.map((stat, index) => (
                <div key={index} className="space-y-1 text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.loading ? (
                      <span className="inline-block w-12 h-8 bg-muted animate-pulse rounded" />
                    ) : (
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        duration={2}
                      />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative flex items-center justify-center order-1 lg:order-2 w-full"
          >
            <div className="w-[290px] h-[290px] sm:w-[350px] sm:h-[350px] md:w-[480px] md:h-[480px] flex items-center justify-center overflow-visible mx-auto relative">
              {/* Scale Layer */}
              <div className="scale-[0.58] sm:scale-[0.75] md:scale-100 origin-center transition-transform duration-300 relative w-[450px] h-[450px] flex items-center justify-center">
                {/* Main Network Illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-full h-full">
                    {/* Central Node */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-64 h-64 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/5 dark:to-secondary-500/5 border border-primary-300/30 dark:border-primary-700/30 backdrop-blur-sm flex items-center justify-center z-10"
                    >
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 shadow-2xl shadow-primary-500/30 dark:shadow-primary-500/20 flex items-center justify-center">
                        <Network className="w-16 h-16 text-white" />
                      </div>
                    </motion.div>

                    {/* Orbiting Nodes Container */}
                    <motion.div
                      className="absolute w-full h-full flex items-center justify-center"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {orbitingNodes.map((node, index) => {
                        // FIX: Tạo transform với giá trị cố định
                        const tx = Math.round(node.x * 100) / 100;
                        const ty = Math.round(node.y * 100) / 100;
                        return (
                          <div
                            key={`orbit-${index}`}
                            className="absolute rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl border border-primary-200/50 dark:border-primary-700/50 flex items-center justify-center w-12 h-12 backdrop-blur-sm"
                            style={{
                              transform: `translate(${tx}px, ${ty}px)`,
                            }}
                          >
                            <div className="hover:scale-125 transition-transform duration-200 flex items-center justify-center w-full h-full">
                              {node.isEven ? (
                                <Server className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                              ) : (
                                <Shield className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>

                {/* Glowing Rings */}
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  animate={{
                    rotate: [0, -360],
                  }}
                  transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute inset-0 border-2 border-primary-200/15 dark:border-primary-700/15 rounded-full scale-[0.85]" />
                  <div className="absolute inset-0 border-2 border-secondary-200/15 dark:border-secondary-700/15 rounded-full scale-[1.1]" />
                  <div className="absolute inset-0 border-2 border-accent-200/15 dark:border-accent-700/15 rounded-full scale-[1.35]" />
                </motion.div>

                {/* Floating Particles - Chỉ render khi mounted */}
                {mounted &&
                  particles.map((particle, index) => (
                    <motion.div
                      key={`particle-${index}`}
                      className="absolute rounded-full bg-primary-400/30 dark:bg-primary-300/20"
                      style={{
                        width: particle.size,
                        height: particle.size,
                        left: "50%",
                        top: "50%",
                      }}
                      animate={{
                        x: particle.x,
                        y: particle.y,
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Scroll
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 rotate-90" />
        </div>
      </motion.div>
    </section>
  );
}
