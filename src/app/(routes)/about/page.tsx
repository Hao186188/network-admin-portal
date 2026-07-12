// src/app/(routes)/about/page.tsx
// TRANG CHÍNH - THÊM VIDEO MOBILE OPTIMIZATION

"use client";

import { Navbar } from "@/components/layout/navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

// Components
import { ExplorationsSection } from "./components/ExplorationsSection";
import { FooterSection } from "./components/FooterSection";
import { HeroSection } from "./components/HeroSection";
import { JournalSection } from "./components/JournalSection";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProjectsSection } from "./components/ProjectsSection";
import { StatsSection } from "./components/StatsSection";

// Data
import {
  explorations,
  journalEntries,
  projects,
  quickLinks,
  socialLinks,
  statsData,
} from "./hooks/useAboutData";

// Đăng ký ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  const nameRef = useRef<HTMLHeadingElement>(null);
  const blurElementsRef = useRef<(HTMLParagraphElement | HTMLDivElement)[]>([]);
  const projectsRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const explorationsRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // GSAP Animations với ScrollTrigger
  useEffect(() => {
    if (isLoading || !nameRef.current) return;

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        nameRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1, ease: "power3.out" },
      );

      gsap.fromTo(
        blurElementsRef.current,
        { opacity: 0, y: 20, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
        },
      );

      // Projects animation
      if (projectsRef.current) {
        gsap.fromTo(
          projectsRef.current.querySelectorAll(".project-card"),
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Journal animation
      if (journalRef.current) {
        gsap.fromTo(
          journalRef.current.querySelectorAll(".journal-entry"),
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: journalRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Stats animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll(".stat-item"),
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Explorations parallax
      if (explorationsRef.current) {
        if (leftColumnRef.current) {
          gsap.fromTo(
            leftColumnRef.current,
            { y: 150 },
            {
              y: -150,
              scrollTrigger: {
                trigger: explorationsRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
              },
            },
          );
        }

        if (rightColumnRef.current) {
          gsap.fromTo(
            rightColumnRef.current,
            { y: 300 },
            {
              y: -300,
              scrollTrigger: {
                trigger: explorationsRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
              },
            },
          );
        }

        gsap.fromTo(
          ".explore-item",
          { opacity: 0.1, scale: 0.9 },
          {
            opacity: 0.3,
            scale: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: explorationsRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          },
        );
      }

      // Marquee animation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
      }
    });

    return () => ctx.revert();
  }, [isLoading]);

  // Loading Screen
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      <Navbar />
      <main className="bg-bg text-text-primary min-h-screen">
        <HeroSection nameRef={nameRef} blurElementsRef={blurElementsRef} />
        <StatsSection stats={statsData} />
        <ProjectsSection projects={projects} />
        <JournalSection entries={journalEntries} />
        <ExplorationsSection
          explorations={explorations}
          leftColumnRef={leftColumnRef}
          rightColumnRef={rightColumnRef}
          explorationsRef={explorationsRef}
        />
        <FooterSection socialLinks={socialLinks} quickLinks={quickLinks} />
      </main>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes roleFadeIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-role-fade-in {
          animation: roleFadeIn 0.4s ease-out;
        }

        @keyframes scrollDown {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
        .animate-scroll-down {
          animation: scrollDown 1.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }

        @keyframes matrix {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-matrix {
          animation: matrix 20s linear infinite;
        }

        /* ✅ Mobile Video Optimization */
        @media (max-width: 640px) {
          video {
            object-fit: cover !important;
          }
          .project-card {
            height: 280px !important;
          }
          .explore-item {
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}
