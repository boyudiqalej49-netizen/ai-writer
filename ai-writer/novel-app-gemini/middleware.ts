import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  // 放行静态资源
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const urlCdk = request.nextUrl.searchParams.get('cdk');
  
  // 校验你的暗号
  if (urlCdk === 'TAW-WINE-666') {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('user_access_token', 'is_valid', { 
      maxAge: 30 * 24 * 60 * 60, 
      path: '/' 
    });
    return response;
  }

  if (!cookie) {
    return new NextResponse(
      `<html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>VIP Access</title>
        </head>
        <body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui,-apple-system,sans-serif;">
          <div style="text-align:center;border:1px solid #333;padding:40px;border-radius:24px;background:#111;width:320px;box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <h2 style="margin:0 0 8px 0;font-size:24px;">VIP 授权验证</h2>
            <p style="margin:0 0 24px 0;color:#888;font-size:14px;letter-spacing:1px;">VIP ACCESS CONTROL</p>
            
            <div style="text-align:left;margin-bottom:8px;font-size:13px;color:#aaa;">激活码 / Activation Code:</div>
            <input type="text" id="c" placeholder="Enter your CDK" style="padding:14px;width:100%;background:#222;border:1px solid #444;color:#fff;border-radius:12px;text-align:center;outline:none;font-size:16px;box-sizing:border-box;margin-bottom:24px;">
            
            <button onclick="window.location.href='/?cdk='+document.getElementById('c').value.trim()" style="padding:15px;width:100%;background:#fff;border:none;border-radius:12px;font-weight:bold;cursor:pointer;font-size:16px;color:#000;transition:all 0.2s active:scale(0.98);">
              验证并进入 / Verify & Enter
            </button>
            
            <p style="margin-top:20px;font-size:12px;color:#444;">Powered by AI Writer System</p>
          </div>
        </body>
      </html>`,
      { headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }

  return NextResponse.next();
}

export const config = { matcher: '/:path*' }
