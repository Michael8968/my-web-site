import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目',
  description: '我的项目作品集',
};

export default function ProjectsPage() {
  const projects = [
    {
      title: '项目名称 1',
      description: '项目描述...',
      tags: ['Next.js', 'TypeScript', 'Tailwind'],
      link: '#',
    },
    {
      title: '项目名称 2',
      description: '项目描述...',
      tags: ['React', 'Node.js'],
      link: '#',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">项目</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={project.link}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              查看项目 →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

