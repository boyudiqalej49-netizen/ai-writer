import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function POST(req) {
  try {
    const { adminPwd, type, days } = await req.json();
    
    // 🔒 绝对防御：这是你专属的“印钞机密码”，只有输入正确才能造码！
    // 你可以把 'laoban888' 改成任何你喜欢的复杂密码
    if (adminPwd !== 'Arum888888') { 
      return NextResponse.json({ success: false, error: '权限不足：密码错误' }, { status: 401 });
    }

    // 连接数据库
    const client = createClient({ url: process.env.CUSTOM_REDIS_URL });
    await client.connect();

    // 🎲 随机生成一个高端大气的高级卡密 (例如: VIP-8X2A-9MNP)
    const randomStr1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomStr2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cdk = `VIP-${randomStr1}-${randomStr2}`;

    // 将生成的卡密正式盖章，存入数据库
    if (type === 'permanent') {
      await client.set(`CDK_PERP_${cdk}`, '1');
    } else {
      await client.set(`CDK_TIME_${cdk}`, days.toString());
    }

    await client.disconnect();
    
    // 把造好的新码返回给你的前端页面
    return NextResponse.json({ success: true, cdk });
    
  } catch (error) {
    console.error('印钞机故障:', error);
    return NextResponse.json({ success: false, error: '生成失败，请检查数据库连接' }, { status: 500 });
  }
}
