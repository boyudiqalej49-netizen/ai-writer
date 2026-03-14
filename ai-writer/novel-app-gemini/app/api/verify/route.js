import { NextResponse } from 'next/server';
import { createClient } from 'redis';

// 增加一个 GET 探针，方便测试机器是否存活
export async function GET() {
  return NextResponse.json({ status: "🟢 验钞机运行正常！" });
}

export async function POST(req) {
  try {
    const { cdk } = await req.json();
    
    // 1. 连数据库
    const client = createClient({ url: process.env.CUSTOM_REDIS_URL });
    await client.connect();

    // 2. 查钥匙
    const timeDays = await client.get(`CDK_TIME_${cdk}`);
    const isPerp = await client.get(`CDK_PERP_${cdk}`);

    await client.disconnect();

    // 3. 查验并直接发通行证（种下 Cookie）
    if (isPerp) {
      const res = NextResponse.json({ valid: true, type: 'permanent' });
      res.cookies.set('user_access_token', 'is_valid', { maxAge: 30 * 24 * 60 * 60, path: '/' });
      res.cookies.set('activation_time', Date.now().toString(), { maxAge: 30 * 24 * 60 * 60, path: '/' });
      res.cookies.set('user_type', 'permanent', { maxAge: 365 * 24 * 60 * 60, path: '/' });
      return res;
    } else if (timeDays) {
      const res = NextResponse.json({ valid: true, type: 'limited', days: parseInt(timeDays) });
      res.cookies.set('user_access_token', 'is_valid', { maxAge: 30 * 24 * 60 * 60, path: '/' });
      res.cookies.set('activation_time', Date.now().toString(), { maxAge: 30 * 24 * 60 * 60, path: '/' });
      res.cookies.set('user_type', 'limited', { maxAge: parseInt(timeDays) * 24 * 60 * 60, path: '/' });
      res.cookies.set('valid_days', timeDays, { path: '/' });
      return res;
    } else {
      return NextResponse.json({ valid: false }); // 查无此码
    }
  } catch (error) {
    console.error('数据库连接错误:', error);
    return NextResponse.json({ valid: false, error: 'Database error' }, { status: 500 });
  }
}
