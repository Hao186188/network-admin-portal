// src/app/googlefd0bb1779e2131d9.html/route.ts
// Vai trò: Route cho file verification

import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Search Console Verification - Mạng 3 Hub</title>
  <meta name="google-site-verification" content="xDi7yQEL2pog2kHYPth3-zWqrvkkgldFURSfgDdVVtU" />
</head>
<body>
  google-site-verification: googlefd0bb1779e2131d9.html
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
