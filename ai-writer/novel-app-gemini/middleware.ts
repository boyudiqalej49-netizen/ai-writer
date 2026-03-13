import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取名为 'auth_token' 的 cookie
  const auth = request.cookies.get('auth_token')

  // 如果访问的是登录页或 API 接口，直接放行
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 如果没有验证信息，重定向到登录/输入CDK页面
  if (!auth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// 设置匹配路径：除了静态资源外的所有页面
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
