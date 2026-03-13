import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams, origin } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  // 1. 放行静态资源和 API 路由（绝对不能拦截验钞机）
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const urlCdk = searchParams.get('cdk');
  
  if (urlCdk) {
    try {
      // 2. 拿着用户输入的码，去调取我们刚才建好的验钞机
      const verifyRes = await fetch(`${origin}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cdk: urlCdk })
      });
      
      const data = await verifyRes.json();

      if (data.valid) {
        // 3. 验钞成功！发放对应权限的通行证
        const response = NextResponse.redirect(new URL('/', request.url));
        const now = Date.now();
        
        response.cookies.set('user_access_token', 'is_valid', { maxAge: 30 * 24 * 60 * 60, path: '/' });
        response.cookies.set('activation_time', now.toString(), { maxAge: 30 * 24 * 60 * 60, path: '/' });
        
        if (data.type === 'permanent') {
          // 发放永久通行证
          response.cookies.set('user_type', 'permanent', { maxAge: 365 * 24 * 60 * 60, path: '/' });
        } else {
          // 发放限时通行证
          response.cookies.set('user_type', 'limited', { maxAge: data.days * 24 * 60 * 60, path: '/' });
          response.cookies.set('valid_days', data.days.toString(), { path: '/' });
        }
        return response;
      } else {
        // 4. 验钞失败（假码），打回登录页并提示错误
        return NextResponse.redirect(new URL('/?error=invalid_cdk', request.url));
      }
    } catch (error) {
      console.error('验证过程出错:', error);
      return NextResponse.redirect(new URL('/?error=verify_failed', request.url));
    }
  }

  // 5. 如果没有通行证，显示拦截界面
  if (!cookie) {
    const isError = searchParams.get('error') === 'invalid_cdk';
    const errorMsg = isError ? '<p style="color:#ef4444;font-size:14px;margin-bottom:12px;">❌ 激活码无效或已过期</p>' : '';

    return new NextResponse(
      `<html><head><meta charset="UTF-8"></head><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
          <div style="text-align:center;border:1px solid #333;padding:40px;border-radius:24px;background:#111;width:300px;">
            <h2 style="margin-bottom:8px;">VIP 授权验证</h2>
            <p style="color:#666;font-size:14px;margin-bottom:24px;">VIP ACCESS CONTROL</p>
            ${errorMsg}
            <input type="text" id="c" placeholder="输入激活码" style="padding:14px;width:100%;background:#222;border:1px solid #444;color:#fff;border-radius:12px;text-align:center;outline:none;margin-bottom:16px;">
            <button onclick="window.location.href='/?cdk='+document.getElementById('c').value.trim()" style="padding:14px;width:100%;background:#fff;color:#000;border:none;border-radius:12px;font-weight:bold;cursor:pointer;">验证并进入</button>
          </div>
        </body></html>`,
      { headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }
  
  return NextResponse.next();
}
export const config = { matcher: '/:path*' };
