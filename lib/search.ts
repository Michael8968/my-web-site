import { getAllPosts } from './mdx';
import { PostType } from '@/types/post';

export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  date: string;
}

// 构建搜索索引（在构建时生成）
export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const posts = await getAllPosts();

  return posts
    .filter((post) => post.slug && post.title) // 过滤无效文章
    .map((post) => ({
      slug: post.slug,
      title: post.title || '',
      description: post.description || '',
      content: post.content || '',
      tags: Array.isArray(post.tags) ? post.tags : [],
      date: post.date || new Date().toISOString(),
    }));
}

// 生成搜索索引 JSON（用于客户端）
export async function generateSearchIndexJSON(): Promise<string> {
  const index = await buildSearchIndex();
  return JSON.stringify(index);
}
