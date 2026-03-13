import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv' // 引入数据库插件

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  // 1. 放行静态资源和 API，不进行拦截
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. 检查 URL 参数里是否有 cdk
  const urlCdk = request.nextUrl.searchParams.get('cdk');
  
  if (urlCdk) {
    // 🔍 核心逻辑：去数据库查这个激活码
    const status = await kv.get(`cdk:${urlCdk}`);

    if (status === 'unused') {
      // ✅ 校验成功：立即将此码设为 'used'，实现一码一用
      await kv.set(`cdk:${urlCdk}`, 'used');
      
      const response = NextResponse.redirect(new URL('/', request.url));
      // 设置授权 Cookie，有效期 30 天
      response.cookies.set('user_access_token', 'is_valid', {
        maxAge: 30 * 24 * 60 * 60, 
        path: '/',
        httpOnly: false, // 允许 page.js 读取显示剩余天数
        sameSite: 'lax',
      });
      return response;
    }
  }

  // 3. 拦截未激活用户，显示输入界面
  if (!cookie) {
    return new NextResponse(
      `
      <html>
        <head>
          <title>激活码验证</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
        </head>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;background:#000;color:#fff;">
          <div style="background:#111;padding:30px;border-radius:20px;border:1px solid #333;text-align:center;max-width:320px;width:90%;">
            <h2 style="margin-bottom:10px;">网站已锁定</h2>
            <p style="color:#888;margin-bottom:20px;font-size:14px;">请输入您的专属激活码<br>每个激活码仅限激活一台设备</p>
            <input type="text" id="cdkInput" placeholder="输入激活码" style="padding:12px;width:100%;background:#222;border:1px solid #444;color:#fff;border-radius:10px;outline:none;text-align:center;font-size:16px;">
            <br><br>
            <button onclick="check()" style="padding:12px 0;width:100%;background:#fff;color:#000;border:none;border-radius:10px;font-weight:bold;cursor:pointer;font-size:16px;">验证并进入</button>
            <p id="msg" style="color:#ff4d4d;font-size:12px;margin-top:15px;"></p>
            <script>
              function check() {
                const code = document.getElementById('cdkInput').value.trim();
                if(code) {
                   // 通过刷新页面带上参数来触发 middleware 校验
                   window.location.href = '/?cdk=' + code;
                } else {
                   document.getElementById('msg').innerText = '请输入有效的激活码';
                }
              }
            </script>
          </div>
        </body>
      </html>
      `,
      { headers: { 'content-type': 'text/html' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
}
