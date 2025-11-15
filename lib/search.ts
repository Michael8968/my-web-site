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
export function buildSearchIndex(): SearchIndexItem[] {
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    content: post.content || '',
    tags: post.tags || [],
    date: post.date,
  }));
}

// 生成搜索索引 JSON（用于客户端）
export function generateSearchIndexJSON(): string {
  const index = buildSearchIndex();
  return JSON.stringify(index);
}

