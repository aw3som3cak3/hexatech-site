import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth', '/_next', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/') return NextResponse.next()
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()
  const auth = request.cookies.get('hexa_auth')?.value
  if (auth === process.env.SITE_PASSWORD) return NextResponse.next()
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
