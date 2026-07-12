// scripts/create-icons.js
// SCRIPT TẠO ICON - DÙNG ES MODULE

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Lấy __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(process.cwd(), "public");

// Đảm bảo thư mục public tồn tại
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log("🚀 Đang tạo icon cho Mạng 3 Hub...");
console.log("📁 Thư mục:", publicDir);

// 1. Tạo manifest.json (KHÔNG COMMENTS)
const manifestContent = {
  name: "Mạng 3 Hub - Network Administration Portal",
  short_name: "Mạng 3 Hub",
  description:
    "Hệ thống quản lý học tập cho lớp Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang",
  start_url: "/",
  display: "standalone",
  background_color: "#0f172a",
  theme_color: "#0f172a",
  orientation: "portrait-primary",
  icons: [
    {
      src: "/favicon.ico",
      sizes: "any",
      type: "image/x-icon",
    },
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    {
      src: "/maskable-icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/maskable-icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  categories: ["education", "networking", "learning"],
  lang: "vi",
  dir: "ltr",
  prefer_related_applications: false,
};

const manifestPath = path.join(publicDir, "manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));
console.log("✅ Đã tạo manifest.json");

// 2. Tạo icon SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#grad1)"/>
  <text x="256" y="200" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">Mạng 3</text>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="80" font-weight="600" fill="white" text-anchor="middle" opacity="0.7">Hub</text>
  <text x="256" y="400" font-family="Arial, sans-serif" font-size="30" fill="rgba(255,255,255,0.5)" text-anchor="middle">⚡ Network</text>
</svg>`;

const svgPath = path.join(publicDir, "icon.svg");
fs.writeFileSync(svgPath, svgContent);
console.log("✅ Đã tạo icon.svg");

// 3. Tạo robots.txt
const robotsTxt = `# Robots.txt for Mạng 3 Hub
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

Sitemap: https://qtm3k14.vercel.app/sitemap.xml
`;

const robotsPath = path.join(publicDir, "robots.txt");
fs.writeFileSync(robotsPath, robotsTxt);
console.log("✅ Đã tạo robots.txt");

// 4. Tạo favicon.ico đơn giản (nếu chưa có)
const faviconPath = path.join(publicDir, "favicon.ico");
if (!fs.existsSync(faviconPath)) {
  fs.writeFileSync(faviconPath, "");
  console.log("✅ Đã tạo favicon.ico (placeholder)");
}

// 5. Tạo file HTML hướng dẫn
const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Mạng 3 Hub</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            width: 100%;
            background: #1e293b;
            border-radius: 20px;
            padding: 40px;
            border: 1px solid #334155;
        }
        h1 {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle { color: #94a3b8; margin-bottom: 30px; }
        .btn {
            display: inline-block;
            padding: 10px 24px;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            margin: 4px;
        }
        .btn:hover { transform: scale(1.05); box-shadow: 0 8px 24px rgba(6,182,212,0.3); }
        .btn-secondary { background: transparent; border: 1px solid #334155; }
        .btn-secondary:hover { border-color: #06b6d4; background: rgba(6,182,212,0.1); }
        .success {
            background: #0f172a;
            border: 1px solid #22c55e;
            border-radius: 12px;
            padding: 16px 20px;
            margin: 20px 0;
            color: #22c55e;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #334155;
            text-align: center;
            color: #64748b;
            font-size: 13px;
        }
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            margin: 20px 0;
        }
        .icon-item {
            background: #0f172a;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            border: 1px solid #334155;
        }
        .icon-preview {
            width: 48px;
            height: 48px;
            margin: 0 auto 8px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
        }
        .icon-name { font-size: 11px; color: #94a3b8; }
        .icon-size { font-size: 9px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Mạng 3 Hub</h1>
        <p class="subtitle">PWA đã sẵn sàng!</p>

        <div class="success">
            ✅ Manifest và icon đã được tạo thành công!
        </div>

        <div class="icon-grid">
            <div class="icon-item">
                <div class="icon-preview">📄</div>
                <div class="icon-name">manifest.json</div>
                <div class="icon-size">PWA Config</div>
            </div>
            <div class="icon-item">
                <div class="icon-preview">🌐</div>
                <div class="icon-name">favicon.ico</div>
                <div class="icon-size">16-64x</div>
            </div>
            <div class="icon-item">
                <div class="icon-preview">📱</div>
                <div class="icon-name">icon-192.png</div>
                <div class="icon-size">192x192</div>
            </div>
            <div class="icon-item">
                <div class="icon-preview">📱</div>
                <div class="icon-name">icon-512.png</div>
                <div class="icon-size">512x512</div>
            </div>
            <div class="icon-item">
                <div class="icon-preview" style="background: linear-gradient(135deg, #06b6d4, #8b5cf6);">🍎</div>
                <div class="icon-name">apple-touch-icon.png</div>
                <div class="icon-size">180x180</div>
            </div>
            <div class="icon-item">
                <div class="icon-preview" style="background: linear-gradient(135deg, #8b5cf6, #ec4899);">🛡️</div>
                <div class="icon-name">maskable-icon-192.png</div>
                <div class="icon-size">192x192</div>
            </div>
            <div class="icon-item">
                <div class="icon-preview" style="background: linear-gradient(135deg, #8b5cf6, #ec4899);">🛡️</div>
                <div class="icon-name">maskable-icon-512.png</div>
                <div class="icon-size">512x512</div>
            </div>
            <div class="icon-item">
                <div class="icon-preview" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">📸</div>
                <div class="icon-name">og-image.png</div>
                <div class="icon-size">1200x630</div>
            </div>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="/" class="btn">🏠 Về trang chủ</a>
            <a href="/manifest.json" class="btn btn-secondary">📄 Manifest</a>
            <a href="/robots.txt" class="btn btn-secondary">🤖 Robots</a>
        </div>

        <div class="footer">
            <p>📱 Mạng 3 Hub - Quản trị Mạng 3 | Cao đẳng Nghề Kiên Giang</p>
            <p style="font-size: 12px;">v3.2.1 • PWA Ready</p>
        </div>
    </div>
</body>
</html>`;

const htmlPath = path.join(publicDir, "index.html");
fs.writeFileSync(htmlPath, htmlContent);
console.log("✅ Đã tạo index.html");

// 6. Tạo file .htaccess
const htaccessContent = `<IfModule mod_headers.c>
  Header set Cross-Origin-Embedder-Policy "credentialless"
  Header set Cross-Origin-Opener-Policy "same-origin"
  Header set Cross-Origin-Resource-Policy "cross-origin"
</IfModule>

<FilesMatch "\\.(ico|png|jpg|jpeg|webp|svg|css|js)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\\.(json|xml|txt)$">
  Header set Cache-Control "public, max-age=86400"
</FilesMatch>`;

const htaccessPath = path.join(publicDir, ".htaccess");
fs.writeFileSync(htaccessPath, htaccessContent);
console.log("✅ Đã tạo .htaccess");

// 7. Tạo icon PNG nếu có sharp
async function createIconsWithSharp() {
  try {
    const sharp = await import("sharp");

    console.log("\n📸 Đang tạo icon PNG với Sharp...");

    // Tạo các icon PNG
    const iconSizes = [
      { size: 192, name: "icon-192.png" },
      { size: 512, name: "icon-512.png" },
      { size: 180, name: "apple-touch-icon.png" },
      { size: 192, name: "maskable-icon-192.png" },
      { size: 512, name: "maskable-icon-512.png" },
    ];

    for (const { size, name } of iconSizes) {
      const outputPath = path.join(publicDir, name);
      await sharp
        .default(svgPath)
        .resize(size, size)
        .png({
          compressionLevel: 9,
          quality: 95,
        })
        .toFile(outputPath);
      console.log(`  ✅ ${name} (${size}x${size})`);
    }

    // Tạo favicon.ico
    await sharp
      .default(svgPath)
      .resize(64, 64)
      .toFile(path.join(publicDir, "favicon.ico"));
    console.log("  ✅ favicon.ico (64x64)");

    // Tạo OG image
    const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" rx="40" fill="url(#grad1)"/>
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="white" text-anchor="middle">Mạng 3 Hub</text>
      <text x="600" y="380" font-family="Arial, sans-serif" font-size="40" fill="rgba(255,255,255,0.8)" text-anchor="middle">Quản trị Mạng 3 - Cao đẳng Nghề Kiên Giang</text>
      <text x="600" y="480" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.5)" text-anchor="middle">⚡ Network Administration Portal</text>
    </svg>`;

    const ogSvgPath = path.join(publicDir, "og-image.svg");
    fs.writeFileSync(ogSvgPath, ogSvg);

    await sharp
      .default(ogSvgPath)
      .resize(1200, 630)
      .png()
      .toFile(path.join(publicDir, "og-image.png"));
    console.log("  ✅ og-image.png (1200x630)");

    console.log("\n🎉 Tất cả icon đã được tạo thành công với Sharp!");
  } catch (error) {
    console.log("\n⚠️ Không tìm thấy sharp, icon PNG chưa được tạo.");
    console.log("📝 Để tạo icon tự động: npm install sharp");
    console.log(
      "📝 Hoặc tải icon từ: https://www.pwabuilder.com/imageGenerator",
    );
  }
}

// Chạy tạo icon với sharp
await createIconsWithSharp();

// 8. Hiển thị danh sách file
console.log("\n📋 Các file trong thư mục public/:");
const files = fs.readdirSync(publicDir);
files.forEach((file) => {
  const stats = fs.statSync(path.join(publicDir, file));
  const size = (stats.size / 1024).toFixed(2);
  console.log(`  ${file} (${size} KB)`);
});

console.log("\n✅ Hoàn thành!");
console.log("🌐 Kiểm tra manifest: http://localhost:3000/manifest.json");
console.log("📄 Kiểm tra: http://localhost:3000/");
console.log("\n🚀 Khởi động lại server: npm run dev");
