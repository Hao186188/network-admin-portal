import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ✅ Sử dụng NextAuth JWT thay vì Supabase auth
  // Vì project dùng NextAuth cho authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'default-secret-change-in-production',
  })

  const { pathname } = request.nextUrl

  // ✅ Public routes - không cần authentication
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // ✅ API routes và NextAuth routes - không cần middleware
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // ✅ Nếu không có token và không phải public path, redirect về login
  if (!token && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // ✅ Thêm callbackUrl để redirect sau khi login
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // ✅ Nếu có token và đang ở login/register, redirect về dashboard
  if (token && isPublicPath) {
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
