import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 强制动态渲染
export const dynamic = 'force-dynamic';
// 设置最大执行时间为 60 秒（用于生成完整文章）
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  timeout: 50000, // 50 秒超时
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { title, description, tags, type } = await request.json();

    console.log(`[AI Generate] 开始生成，类型: ${type}, 标题: ${title || '未指定'}`);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: '未配置 OpenAI API Key' },
        { status: 500 }
      );
    }

    // 构建提示词
    let prompt = '';
    if (type === 'full') {
      // 生成完整文章
      prompt = `请根据以下信息生成一篇技术博客文章，使用 Markdown 格式：

标题：${title || '未指定'}
描述：${description || '未指定'}
标签：${tags ? tags.join(', ') : '未指定'}

要求：
1. 文章结构清晰，包含引言、正文和总结
2. 使用 Markdown 格式编写
3. 内容要有深度，适合技术博客
4. 字数控制在 1500-2500 字左右
5. 可以包含代码示例（使用代码块）
6. 使用中文写作

请直接输出文章内容，不要包含 frontmatter：`;
    } else if (type === 'outline') {
      // 生成大纲
      prompt = `请根据以下信息生成一篇技术博客文章的大纲，使用 Markdown 格式：

标题：${title || '未指定'}
描述：${description || '未指定'}
标签：${tags ? tags.join(', ') : '未指定'}

要求：
1. 生成详细的文章大纲
2. 包含主要章节和子章节
3. 每个章节要有简要说明
4. 使用 Markdown 格式（使用 # 和 ## 等标题）
5. 使用中文

请直接输出大纲：`;
    } else {
      // 生成描述
      prompt = `请根据以下信息生成一篇技术博客文章的简短描述（100-200字）：

标题：${title || '未指定'}
标签：${tags ? tags.join(', ') : '未指定'}

要求：
1. 描述要吸引人，能概括文章主要内容
2. 使用中文
3. 控制在 100-200 字

请直接输出描述：`;
    }

    console.log(`[AI Generate] 开始调用 OpenAI API...`);
    const apiStartTime = Date.now();

    const completion = await openai.chat.completions.create({
    //   model: 'gpt-4o-mini',
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            '你是一位专业的技术博客作者，擅长撰写清晰、有深度的技术文章。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: type === 'full' ? 3000 : type === 'outline' ? 1500 : 300,
    });

    const apiDuration = Date.now() - apiStartTime;
    console.log(`[AI Generate] OpenAI API 调用完成，耗时: ${apiDuration}ms`);

    const content = completion.choices[0]?.message?.content || '';

    if (!content) {
      console.error('[AI Generate] OpenAI 返回空内容');
      return NextResponse.json(
        { error: 'AI 生成失败，请重试' },
        { status: 500 }
      );
    }

    const totalDuration = Date.now() - startTime;
    console.log(`[AI Generate] 生成完成，总耗时: ${totalDuration}ms, 内容长度: ${content.length}`);

    return NextResponse.json({ content });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[AI Generate] 错误 (耗时: ${totalDuration}ms):`, error);
    
    let errorDetails: string | undefined;

    if (error instanceof Error) {
      // 检查是否是超时错误
      if (error.message.includes('timeout') || error.message.includes('timed out')) {
        errorDetails = `请求超时 (${totalDuration}ms)。可能是 OpenAI API 响应过慢或网络连接问题。`;
      } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        errorDetails = '无法连接到 OpenAI API。请检查网络连接和 API 配置。';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorDetails = 'OpenAI API Key 无效或已过期。';
      } else if (error.message.includes('429')) {
        errorDetails = 'OpenAI API 请求频率过高，请稍后重试。';
      } else {
        errorDetails = error.message;
      }
    }

    return NextResponse.json(
      {
        error: '生成内容失败',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}
