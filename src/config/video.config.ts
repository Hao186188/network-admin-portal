// src/config/video.config.ts

export const VIDEO_CONFIG = {
  // Video mặc định
  default: {
    src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    opacity: 1,
    overlayOpacity: 70,
  },

  // Cấu hình cho từng section
  sections: {
    hero: {
      src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
      opacity: 1,
      overlayOpacity: 80,
      overlayColor: "bg-black",
    },
    stats: {
      src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
      opacity: 0.3,
      overlayOpacity: 85,
      overlayColor: "bg-bg",
    },
    projects: {
      src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
      opacity: 0.2,
      overlayOpacity: 90,
      overlayColor: "bg-bg",
    },
    journal: {
      src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
      opacity: 0.15,
      overlayOpacity: 85,
      overlayColor: "bg-bg",
    },
    explorations: {
      src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
      opacity: 0.2,
      overlayOpacity: 90,
      overlayColor: "bg-bg",
    },
    footer: {
      src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
      opacity: 0.2,
      overlayOpacity: 90,
      overlayColor: "bg-bg",
    },
  },

  // Danh sách video có sẵn
  videos: {
    default: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    cyber: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    network: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
  },
};

// Helper để lấy config
export function getVideoConfig(section: keyof typeof VIDEO_CONFIG.sections) {
  return VIDEO_CONFIG.sections[section] || VIDEO_CONFIG.default;
}
