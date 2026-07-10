// src/app/og-image/route.tsx
// Vai trò: Tạo Open Graph image động

import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0f172a",
        backgroundImage: "url('https://qtm3k14.vercel.app/grid.svg')",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #2563eb, #06b6d4)",
          padding: "20px 40px",
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 60, color: "white", fontWeight: "bold" }}>
          Mạng 3 Hub
        </span>
      </div>
      <div
        style={{
          fontSize: 30,
          color: "#94a3b8",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 30,
          fontSize: 20,
          color: "#475569",
        }}
      >
        Trường Cao đẳng Nghề Kiên Giang
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
