import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams, origin } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  // 1. 放行静态资源和 API 路由
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const urlCdk = searchParams.get('cdk');
  
  if (urlCdk) {
    try {
      // 2. 调取验钞机
      const verifyRes = await fetch(`${origin}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cdk: urlCdk })
      });
      
      const data = await verifyRes.json();

      if (data.valid) {
        // 3. 验钞成功！
        const response = NextResponse.redirect(new URL('/', request.url));
        const now = Date.now();
        
        response.cookies.set('user_access_token', 'is_valid', { maxAge: 30 * 24 * 60 * 60, path: '/' });
        response.cookies.set('activation_time', now.toString(), { maxAge: 30 * 24 * 60 * 60, path: '/' });
        
        if (data.type === 'permanent') {
          response.cookies.set('user_type', 'permanent', { maxAge: 365 * 24 * 60 * 60, path: '/' });
        } else {
          response.cookies.set('user_type', 'limited', { maxAge: data.days * 24 * 60 * 60, path: '/' });
          response.cookies.set('valid_days', data.days.toString(), { path: '/' });
        }
        return response;
      } else {
        // 4. 验钞失败（假码）
        return NextResponse.redirect(new URL('/?error=invalid_cdk', request.url));
      }
    } catch (error) {
      console.error('验证过程出错:', error);
      // 将具体的错误抛给前端
      return NextResponse.redirect(new URL('/?error=verify_failed', request.url));
    }
  }

  // 5. 显示拦截界面
  if (!cookie) {
    const errorType = searchParams.get('error');
    let errorMsg = '';
    
    // 【修改点】：把所有可能的错误都加上了红字提示！
    if (errorType === 'invalid_cdk') {
      errorMsg = '<p style="color:#ef4444;font-size:14px;margin-bottom:12px;background:rgba(239,68,68,0.1);padding:8px;border-radius:8px;">❌ 激活码无效或已过期</p>';
    } else if (errorType === 'verify_failed') {
      errorMsg = '<p style="color:#eab308;font-size:14px;margin-bottom:12px;background:rgba(234,179,8,0.1);padding:8px;border-radius:8px;">⚠️ 验证服务连接失败，请稍后重试</p>';
    }

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
