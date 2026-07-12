// scripts/generate-icons.js
// Script tạo icon tự động

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const publicDir = path.join(process.cwd(), "public");

// Đảm bảo thư mục public tồn tại
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Các kích thước icon cần tạo
const iconSizes = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 64, name: "favicon.ico" },
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "maskable-icon-192.png" },
  { size: 512, name: "maskable-icon-512.png" },
];

console.log("🚀 Đang tạo icon cho Mạng 3 Hub...");

// Kiểm tra xem có file SVG không
const svgPath = path.join(publicDir, "icon.svg");
if (!fs.existsSync(svgPath)) {
  console.log("⚠️ Không tìm thấy icon.svg, tạo icon mặc định...");
  // Tạo icon SVG mặc định
  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#06b6d4" />
        <stop offset="50%" style="stop-color:#3b82f6" />
        <stop offset="100%" style="stop-color:#8b5cf6" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="80" fill="url(#grad)"/>
    <text x="256" y="340" font-family="Arial,sans-serif" font-size="280" font-weight="bold" fill="white" text-anchor="middle">🌐</text>
  </svg>`;
  fs.writeFileSync(svgPath, defaultSvg);
  console.log("✅ Đã tạo icon.svg");
}

// Tạo file HTML hướng dẫn
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mạng 3 Hub - Icon Generator</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #0f172a; color: #e2e8f0; }
        .card { background: #1e293b; padding: 30px; border-radius: 16px; border: 1px solid #334155; }
        h1 { background: linear-gradient(135deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn { display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; border: none; border-radius: 8px; text-decoration: none; margin: 8px 4px; }
        .btn:hover { transform: scale(1.05); }
        code { background: #0f172a; padding: 2px 8px; border-radius: 4px; color: #06b6d4; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🚀 Mạng 3 Hub - Icon Generator</h1>
        <p>Hướng dẫn tạo icon cho PWA:</p>
        <ul>
            <li>📱 Dùng <a href="https://www.pwabuilder.com/imageGenerator" target="_blank">PWA Builder</a></li>
            <li>🎨 Dùng <a href="https://realfavicongenerator.net/" target="_blank">Favicon Generator</a></li>
            <li>📁 Hoặc tải icon từ <a href="https://www.iconfinder.com/" target="_blank">Icon Finder</a></li>
        </ul>
        <p>Đặt các file vào thư mục <code>public/</code>:</p>
        <ul>
            <li><code>favicon.ico</code> - Icon chính</li>
            <li><code>icon-192.png</code> - PWA icon 192x192</li>
            <li><code>icon-512.png</code> - PWA icon 512x512</li>
            <li><code>apple-touch-icon.png</code> - iOS icon 180x180</li>
            <li><code>maskable-icon-192.png</code> - Android maskable 192x192</li>
            <li><code>maskable-icon-512.png</code> - Android maskable 512x512</li>
        </ul>
        <a href="/" class="btn">🏠 Về trang chủ</a>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(publicDir, "icon-generator.html"), htmlContent);
console.log("✅ Đã tạo icon-generator.html");

// Tạo file README cho icons
const readmeContent = `# Icon cho Mạng 3 Hub

## Các icon cần có:
- favicon.ico - Icon trình duyệt
- icon-192.png - PWA icon 192x192
- icon-512.png - PWA icon 512x512
- apple-touch-icon.png - iOS icon 180x180
- maskable-icon-192.png - Android maskable 192x192
- maskable-icon-512.png - Android maskable 512x512
- og-image.png - Open Graph image 1200x630

## Cách tạo:
1. Dùng PWA Builder: https://www.pwabuilder.com/imageGenerator
2. Dùng Real Favicon Generator: https://realfavicongenerator.net/
3. Hoặc thiết kế bằng công cụ yêu thích

## Lưu ý:
- Icon nên có nền trong suốt
- Maskable icon cần có safe zone (80% kích thước)
- OG image nên có tỷ lệ 1.91:1
`;

fs.writeFileSync(path.join(publicDir, "ICON_README.md"), readmeContent);
console.log("✅ Đã tạo ICON_README.md");

console.log("🎉 Hoàn thành! Truy cập /icon-generator.html để xem hướng dẫn");
