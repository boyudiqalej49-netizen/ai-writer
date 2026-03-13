import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const urlCdk = request.nextUrl.searchParams.get('cdk');
  
  // 当用户输入 TAW-WINE-666 时
  if (urlCdk === 'TAW-WINE-666') {
    const response = NextResponse.redirect(new URL('/', request.url));
    const now = Date.now(); // 记录当前激活时间
    
    // 存入通行证，有效期 30 天
    response.cookies.set('user_access_token', 'is_valid', { maxAge: 30 * 24 * 60 * 60, path: '/' });
    // 存入激活的时间戳，方便 page.js 计算倒计时
    response.cookies.set('activation_time', now.toString(), { maxAge: 30 * 24 * 60 * 60, path: '/' });
    
    return response;
  }

  if (!cookie) {
    return new NextResponse(
      `<html><head><meta charset="UTF-8"></head><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
          <div style="text-align:center;border:1px solid #333;padding:40px;border-radius:24px;background:#111;width:300px;">
            <h2 style="margin-bottom:8px;">VIP 授权验证</h2>
            <p style="color:#666;font-size:14px;margin-bottom:24px;">VIP ACCESS CONTROL</p>
            <input type="text" id="c" placeholder="输入激活码" style="padding:14px;width:100%;background:#222;border:1px solid #444;color:#fff;border-radius:12px;text-align:center;outline:none;">
            <br><br>
            <button onclick="window.location.href='/?cdk='+document.getElementById('c').value.trim()" style="padding:14px;width:100%;background:#fff;border:none;border-radius:12px;font-weight:bold;cursor:pointer;width:100%;">验证并进入</button>
          </div>
        </body></html>`,
      { headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }
  return NextResponse.next();
}
export const config = { matcher: '/:path*' }
