import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '教程',
  description: '编程教程和课程',
};

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">教程</h1>
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          教程内容即将上线，敬请期待！
        </p>
      </div>
    </div>
  );
}

