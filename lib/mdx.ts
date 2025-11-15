import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { PostType } from '@/types/post';

const contentDirectory = path.join(process.cwd(), 'content');

// 获取所有博客文章
export function getAllPosts(): PostType[] {
  const blogDirectory = path.join(contentDirectory, 'blog');
  
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // 计算阅读时间
      const stats = readingTime(content);
      const readingTimeText = `${Math.ceil(stats.minutes)} min`;

      // 从文件名生成 slug（如果没有在 frontmatter 中指定）
      const slug = data.slug || fileName.replace(/\.(mdx|md)$/, '');

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        updated: data.updated,
        tags: data.tags || [],
        coverImage: data.coverImage,
        readingTime: data.readingTime || readingTimeText,
        series: data.series,
        draft: data.draft ?? false,
        content,
      } as PostType;
    })
    .filter((post) => !post.draft) // 过滤草稿
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return allPostsData;
}

// 根据 slug 获取单篇文章
export function getPostBySlug(slug: string): PostType | null {
  const blogDirectory = path.join(contentDirectory, 'blog');
  
  if (!fs.existsSync(blogDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(blogDirectory);
  
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.mdx') && !fileName.endsWith('.md')) {
      continue;
    }

    const fullPath = path.join(blogDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const postSlug = data.slug || fileName.replace(/\.(mdx|md)$/, '');
    
    if (postSlug === slug) {
      const stats = readingTime(content);
      const readingTimeText = `${Math.ceil(stats.minutes)} min`;

      return {
        slug: postSlug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        updated: data.updated,
        tags: data.tags || [],
        coverImage: data.coverImage,
        readingTime: data.readingTime || readingTimeText,
        series: data.series,
        draft: data.draft ?? false,
        content,
      } as PostType;
    }
  }

  return null;
}

// 根据标签获取文章
export function getPostsByTag(tag: string): PostType[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags?.includes(tag));
}

// 获取所有标签
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagsSet = new Set<string>();
  
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

// 获取分页文章
export function getPaginatedPosts(page: number = 1, pageSize: number = 10): {
  posts: PostType[];
  total: number;
  totalPages: number;
} {
  const allPosts = getAllPosts();
  const total = allPosts.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    total,
    totalPages,
  };
}

