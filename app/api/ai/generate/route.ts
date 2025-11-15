import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 强制动态渲染
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { title, description, tags, type } = await request.json();

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的技术博客作者，擅长撰写清晰、有深度的技术文章。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: type === 'full' ? 3000 : type === 'outline' ? 1500 : 300,
    });

    const content = completion.choices[0]?.message?.content || '';

    if (!content) {
      return NextResponse.json(
        { error: 'AI 生成失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    const errorMessage =
      error instanceof Error ? error.message : '生成内容失败';
    return NextResponse.json(
      {
        error: '生成内容失败',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

