import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 激活码列表
const VALID_CDKS = ['TAW-WINE-666', 'HELLO-2026', 'AI-WRITER-FREE'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  // 1. 放行静态资源和 API，防止网站崩掉
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. 检查 URL 参数里是否有 cdk (用户点击“立即激活”后会带上这个)
  const urlCdk = request.nextUrl.searchParams.get('cdk');
  if (urlCdk && VALID_CDKS.includes(urlCdk)) {
    // 激活成功：设置 Cookie 并强制刷新到首页，去除 URL 里的参数
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('user_access_token', 'is_valid', {
      maxAge: 30 * 24 * 60 * 60, // 30天
      path: '/',
    });
    return response;
  }

  // 3. 如果没 Cookie 且没输入正确 CDK，显示拦截页面
  if (!cookie) {
    return new NextResponse(
      `
      <html>
        <head><title>请输入激活码</title><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;background:#000;color:#fff;">
          <div style="background:#111;padding:30px;border-radius:15px;border:1px solid #333;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            <h2 style="margin-bottom:10px;">网站已锁定</h2>
            <p style="color:#888;margin-bottom:20px;">请输入激活码开启 30 天使用权限</p>
            <input type="text" id="cdkInput" placeholder="输入 CDK" style="padding:12px;width:240px;background:#222;border:1px solid #444;color:#fff;border-radius:8px;outline:none;">
            <br><br>
            <button onclick="check()" style="padding:12px 30px;background:#fff;color:#000;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">立即激活</button>
            <script>
              function check() {
                const code = document.getElementById('cdkInput').value;
                if(code) window.location.href = '/?cdk=' + code;
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
