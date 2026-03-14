import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function POST(req) {
  try {
    const { cdk } = await req.json();
    
    // 1. 连接 Redis 数据库 (已切换为带密码的专属钥匙 CUSTOM_REDIS_URL)
    const client = createClient({ url: process.env.CUSTOM_REDIS_URL });
    await client.connect();

    // 2. 去数据库里查这把钥匙
    const timeDays = await client.get(`CDK_TIME_${cdk}`);
    const isPerp = await client.get(`CDK_PERP_${cdk}`);

    await client.disconnect();

    // 3. 返回查询结果
    if (isPerp) {
      return NextResponse.json({ valid: true, type: 'permanent' });
    } else if (timeDays) {
      return NextResponse.json({ valid: true, type: 'limited', days: parseInt(timeDays) });
    } else {
      return NextResponse.json({ valid: false }); // 查无此码
    }
  } catch (error) {
    console.error('数据库连接错误:', error);
    return NextResponse.json({ valid: false, error: 'Database error' }, { status: 500 });
  }
}
