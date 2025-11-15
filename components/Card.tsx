import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { PostType } from '@/types/post';

interface CardProps {
  post: PostType;
}

export function Card({ post }: CardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-all duration-300"
    >
      {post.coverImage && (
        <div className="mb-4 aspect-video bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
        {post.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {post.description}
      </p>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{post.readingTime}</span>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

