// src/app/(routes)/about/components/ProjectsSection.tsx
// PROJECTS SECTION - SÁNG HƠN

"use client";

import { VideoSection } from "@/components/ui/VideoSection";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Project } from "../types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <VideoSection
      section="projects"
      overlayOpacity={45}
      className="py-12 md:py-16"
    >
      <section id="work" className="relative w-full">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-between mb-8 sm:mb-12"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-white/20" />
                <span className="text-xs text-white/50 uppercase tracking-[0.3em]">
                  Dự án
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display italic text-white">
                Dự án <span className="not-italic text-white/80">nổi bật</span>
              </h2>
              <p className="text-white/50 text-xs sm:text-sm mt-2">
                Các dự án tôi đã thực hiện, từ ý tưởng đến hoàn thiện
              </p>
            </div>
            <a
              href="https://github.com/Hao186188"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/50 hover:text-white hover:ring-2 hover:ring-cyan-500/50 transition-all"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card group relative h-[320px] sm:h-[360px] md:h-[420px] rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden backdrop-blur-md hover:border-cyan-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="relative w-full h-[55%] overflow-hidden border-b border-white/10 bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                </div>

                <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/40">
                  <div>
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <span className="text-[8px] sm:text-[10px] font-mono text-cyan-500/70 flex-shrink-0 ml-2">
                        [{project.code}]
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/60 line-clamp-2 font-light">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2 sm:mt-3">
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {project.tech.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[8px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/60"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-[8px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/40">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1 sm:gap-2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all hover:scale-110"
                        aria-label="Xem demo"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/40 hover:text-white transition-all hover:scale-110"
                        aria-label="Xem code"
                      >
                        <FaGithub className="w-3 h-3 sm:w-4 sm:h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Xem demo ${project.title}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </VideoSection>
  );
}
