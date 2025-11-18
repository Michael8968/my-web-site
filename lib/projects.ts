export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export const projects: Project[] = [
  {
    title: 'QuizFlow',
    description:
      '一个功能强大的在线测验系统，支持创建、管理和参与各种类型的测验。',
    tags: ['TypeScript', 'Next.js', 'React'],
    link: 'https://github.com/Michael8968/QuizFlow',
  },
  {
    title: 'react-scratch-demo',
    description: '基于 React 的 Scratch 编辑器演示项目，提供可视化的编程体验。',
    tags: ['JavaScript', 'React'],
    link: 'https://github.com/Michael8968/react-scratch-demo',
  },
  {
    title: 'my-web-site',
    description: '个人网站项目，使用 Next.js 构建，包含博客、项目展示等功能。',
    tags: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    link: 'https://github.com/Michael8968/my-web-site',
  },
];

export function getProjects(): Project[] {
  return projects;
}
