import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { getAllPosts, getPostBySlug } from '../mdx';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

describe('MDX Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该返回空数组当目录不存在时', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const posts = getAllPosts();
    expect(posts).toEqual([]);
  });

  it('应该正确解析 MDX 文件', () => {
    const mockFileContent = `---
title: "测试文章"
description: "测试描述"
date: "2025-01-01"
tags: ["test"]
slug: "test-post"
---

# 内容
`;

    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue(['test-post.mdx'] as any);
    vi.mocked(fs.readFileSync).mockReturnValue(mockFileContent);

    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].title).toBe('测试文章');
  });
});

