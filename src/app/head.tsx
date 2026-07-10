// src/app/head.tsx
// Vai trò: Head component cho SEO

export default function Head() {
  return (
    <>
      {/* Primary Meta Tags */}
      <title>Mạng 3 Hub - Quản trị Mạng 3</title>
      <meta
        name="description"
        content="Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang."
      />
      <meta
        name="keywords"
        content="Mạng 3 Hub, Quản trị Mạng, Học tập, Kiên Giang, Cao đẳng Nghề"
      />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Võ Nhật Hào" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://qtm3k14.vercel.app/" />
      <meta property="og:title" content="Mạng 3 Hub - Quản trị Mạng 3" />
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

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Mạng 3 Hub - Quản trị Mạng 3" />
      <meta
        name="twitter:description"
        content="Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3."
      />
      <meta
        name="twitter:image"
        content="https://qtm3k14.vercel.app/og-image.png"
      />

      {/* Canonical */}
      <link rel="canonical" href="https://qtm3k14.vercel.app/" />

      {/* Sitemap */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

      {/* Verification */}
      <meta
        name="google-site-verification"
        content="fWJ9xSva7OMPit8NxNyIzmzItlhloIppaCNr6cIhoJQ"
      />
    </>
  );
}
