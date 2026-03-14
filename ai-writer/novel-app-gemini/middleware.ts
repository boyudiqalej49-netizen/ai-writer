import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('user_access_token');

  // 1. 放行静态资源和 API（绝对不能拦截）
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 2. 没带通行证？拦住，显示超强验证界黑盒
  if (!cookie) {
    return new NextResponse(
      `<html><head><meta charset="UTF-8"></head><body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
          <div style="text-align:center;border:1px solid #333;padding:40px;border-radius:24px;background:#111;width:300px;">
            <h2 style="margin-bottom:8px;">VIP 授权验证</h2>
            <p style="color:#666;font-size:14px;margin-bottom:24px;">VIP ACCESS CONTROL</p>
            
            <p id="err" style="color:#ef4444;font-size:14px;margin-bottom:12px;display:none;background:rgba(239,68,68,0.1);padding:8px;border-radius:8px;"></p>
            
            <input type="text" id="c" placeholder="输入激活码" style="padding:14px;width:100%;background:#222;border:1px solid #444;color:#fff;border-radius:12px;text-align:center;outline:none;margin-bottom:16px;">
            <button id="btn" onclick="verify()" style="padding:14px;width:100%;background:#fff;color:#000;border:none;border-radius:12px;font-weight:bold;cursor:pointer;transition:all 0.2s;">验证并进入</button>
            
            <script>
              async function verify() {
                const btn = document.getElementById('btn');
                const err = document.getElementById('err');
                const cdk = document.getElementById('c').value.trim();
                if(!cdk) return;
                
                btn.innerText = '正在连接数据库...';
                btn.style.opacity = '0.7';
                err.style.display = 'none';
                
                try {
                  const res = await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cdk })
                  });
                  
                  const text = await res.text();
                  try {
                    const data = JSON.parse(text);
                    if(data.valid) {
                      btn.innerText = '验证成功，正在进入...';
                      btn.style.background = '#34d399';
                      window.location.href = '/';
                    } else {
                      err.style.display = 'block';
                      err.innerText = '❌ 激活码无效或已过期';
                      btn.innerText = '验证并进入';
                      btn.style.opacity = '1';
                    }
                  } catch(e) {
                    err.style.display = 'block';
                    err.innerText = '⚠️ 服务器代码故障，请看控制台';
                    console.error('Vercel返回了奇怪的内容:', text);
                    btn.innerText = '验证并进入';
                    btn.style.opacity = '1';
                  }
                } catch(e) {
                  err.style.display = 'block';
                  err.innerText = '⚠️ 网络连接失败';
                  btn.innerText = '验证并进入';
                  btn.style.opacity = '1';
                }
              }
            </script>
          </div>
        </body></html>`,
      { headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }
  
  return NextResponse.next();
}
export const config = { matcher: '/:path*' };
