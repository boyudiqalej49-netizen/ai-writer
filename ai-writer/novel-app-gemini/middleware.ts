import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  // 1. 放行静态资源
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 2. 处理 CDK 提交
  const urlCdk = request.nextUrl.searchParams.get('cdk');
  if (urlCdk) {
    const status = await kv.get(`cdk:${urlCdk}`);

    if (status === 'unused') {
      // ✅ 校验成功：设为已使用
      await kv.set(`cdk:${urlCdk}`, 'used');
      
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('user_access_token', 'is_valid', {
        maxAge: 30 * 24 * 60 * 60, // 30天免登录
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
      });
      return response;
    } else {
      // ❌ 码无效或已过期的处理（通过 URL 参数传回给前端显示）
      const url = new URL(request.url);
      url.searchParams.set('error', status === 'used' ? 'used' : 'invalid');
      return NextResponse.redirect(url);
    }
  }

  // 3. 拦截未激活用户
  if (!cookie) {
    const error = request.nextUrl.searchParams.get('error');
    let errorMsg = '请输入您的专属激活码';
    if (error === 'used') errorMsg = '<span style="color:#ff4d4d;">该码已被他人使用，请更换</span>';
    if (error === 'invalid') errorMsg = '<span style="color:#ff4d4d;">无效的激活码，请重新输入</span>';

    return new NextResponse(
      `<html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
          <div style="text-align:center;border:1px solid #333;padding:40px;border-radius:24px;background:#111;max-width:320px;">
            <h2 style="margin-bottom:10px;">VIP 访问授权</h2>
            <p style="color:#888;font-size:14px;margin-bottom:20px;">${errorMsg}</p>
            <input type="text" id="c" placeholder="输入 CDK" style="padding:14px;width:100%;background:#222;border:1px solid #444;color:#fff;border-radius:12px;text-align:center;font-size:16px;outline:none;box-sizing:border-box;">
            <br><br>
            <button onclick="window.location.href='/?cdk='+document.getElementById('c').value.trim()" style="padding:14px;width:100%;background:#fff;border:none;border-radius:12px;cursor:pointer;font-weight:bold;font-size:16px;color:#000;">立即激活</button>
          </div>
        </body></html>`,
      { headers: { 'content-type': 'text/html' } }
    );
  }

  return NextResponse.next();
}

export const config = { matcher: '/:path*' }
