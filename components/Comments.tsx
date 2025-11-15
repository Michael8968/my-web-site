'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentsProps {
  slug: string;
}

export function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!author.trim() || !content.trim()) {
      setError('请填写作者和评论内容');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || '评论已提交');
        setAuthor('');
        setContent('');
        // 刷新评论列表
        fetchComments();
      } else {
        setError(data.error || '提交失败，请稍后再试');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6">评论</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6">评论 ({comments.length})</h2>

      {/* 评论表单 */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="您的姓名"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下您的评论..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={submitting}
          />
        </div>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 dark:text-green-400 text-sm">
            {success}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              提交中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              提交评论
            </>
          )}
        </button>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            暂无评论，成为第一个评论者吧！
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{comment.author}</span>
                <time
                  dateTime={comment.createdAt}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

