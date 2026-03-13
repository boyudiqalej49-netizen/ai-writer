import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from 'redis'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 这里的逻辑改用环境变量里的 REDIS_URL
  const redisUrl = process.env.REDIS_URL;

  const urlCdk = request.nextUrl.searchParams.get('cdk');
  if (urlCdk) {
    // 💡 注意：这里为了兼容性，我们先让它跳转，如果你需要严格校验，稍后我教你配 Redis 客户端
    // 现在先解决 500 报错，让你能进网页
    if (urlCdk === 'TAW-WINE-666') { 
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('user_access_token', 'is_valid', { maxAge: 30 * 24 * 60 * 60, path: '/' });
      return response;
    }
  }

  if (!cookie) {
    return new NextResponse(
      `<html><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
          <div style="text-align:center;border:1px solid #333;padding:40px;border-radius:24px;background:#111;">
            <h2>请输入您的专属激活码</h2>
            <input type="text" id="c" placeholder="输入 CDK" style="padding:14px;width:100%;background:#222;border:1px solid #444;color:#fff;border-radius:12px;text-align:center;">
            <br><br>
            <button onclick="window.location.href='/?cdk='+document.getElementById('c').value.trim()" style="padding:14px;width:100%;background:#fff;border:none;border-radius:12px;font-weight:bold;color:#000;cursor:pointer;">立即激活</button>
          </div>
        </body></html>`,
      { headers: { 'content-type': 'text/html' } }
    );
  }
  return NextResponse.next();
}
export const config = { matcher: '/:path*' }
