import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST(req) {
  try {
    // 🛡️ 第一步：VIP 身份卫兵 (从 Cookie 读取通行证)
    const cookieStore = cookies();
    const token = cookieStore.get('user_access_token');

    // 如果没带通行证，直接拒开发货，保护你的 SiliconFlow 余额
    if (!token || token.value !== 'is_valid') {
      return new Response(JSON.stringify({ error: 'Unauthorized: 请先验证激活码' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. 解析请求内容
    const { system: systemPrompt, user: userPrompt } = await req.json();
    
    // 注意：这里继续沿用你代码里的 OPENROUTER_API_KEY 变量名
    // 只要你在 Vercel 环境变量里填的是 SiliconFlow 的 Key 就能通
    const apiKey = process.env.OPENROUTER_API_KEY;

    // 3. 呼叫模型 (SiliconFlow 接口)
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-72B-Instruct', // 强大的千问 72B
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.9,
        stream: true, // 必须开启流式，否则打字机功能失效
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error('API错误: ' + err);
    }

    // 4. 处理流式输出 (保持你原本的高效写法)
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const text = json.choices?.[0]?.delta?.content;
              if (text) {
                // 包装成前端需要的格式
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
            } catch (e) {
              // 忽略解析失败的碎片
            }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    // 5. 返回 SSE 流
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (e) {
    console.error('生成接口故障:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
