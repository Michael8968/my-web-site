import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';
import type { PostType } from '@/types/post';

const mockPost: PostType = {
  title: '测试文章',
  slug: 'test-post',
  description: '这是一篇测试文章',
  date: '2025-01-01',
  readingTime: '5 min',
  tags: ['test', 'nextjs'],
};

describe('Card Component', () => {
  it('应该渲染文章标题', () => {
    render(<Card post={mockPost} />);
    expect(screen.getByText('测试文章')).toBeInTheDocument();
  });

  it('应该渲染文章描述', () => {
    render(<Card post={mockPost} />);
    expect(screen.getByText('这是一篇测试文章')).toBeInTheDocument();
  });

  it('应该渲染文章日期', () => {
    render(<Card post={mockPost} />);
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('应该渲染阅读时间', () => {
    render(<Card post={mockPost} />);
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('应该渲染标签', () => {
    render(<Card post={mockPost} />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
  });

  it('应该包含正确的链接', () => {
    render(<Card post={mockPost} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });
});

