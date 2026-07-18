import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ QUAN TRỌNG: Cho phép tất cả NextAuth API routes
  // Không apply middleware cho /api/auth/*
  if (pathname.startsWith('/api/auth')) {
    console.log("🔓 [Middleware] Allowing NextAuth API route:", pathname)
    return NextResponse.next()
  }

  // ✅ Cho phép các API routes khác
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // ✅ Cho phép static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next()
  }

  // ✅ Sử dụng NextAuth JWT thay vì Supabase auth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'default-secret-change-in-production',
  })

  console.log("🔐 [Middleware] Path:", pathname, "Has token:", !!token)

  // ✅ Public routes - không cần authentication
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // ✅ Nếu không có token và không phải public path, redirect về login
  if (!token && !isPublicPath) {
    console.log("🔐 [Middleware] No token, redirecting to login")
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // ✅ Thêm callbackUrl để redirect sau khi login
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // ✅ Nếu có token và đang ở login/register, redirect về dashboard
  if (token && isPublicPath) {
    console.log("🔐 [Middleware] Has token on public path, redirecting to dashboard")
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (NextAuth API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
