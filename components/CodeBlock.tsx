'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({ children, className = '', ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 从 className 中提取语言（例如：language-typescript）
  const language = className?.replace('language-', '') || '';

  return (
    <div className="relative group my-4">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="p-2 bg-gray-800 dark:bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="复制代码"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      {language && (
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-1 text-xs bg-gray-800 dark:bg-gray-700 text-white rounded">
            {language}
          </span>
        </div>
      )}
      <pre className={`${className} p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto`} {...props}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

