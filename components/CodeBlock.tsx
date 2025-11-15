'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({
  children,
  className = '',
  ...props
}: CodeBlockProps) {
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
    <div className="group relative my-4">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleCopy}
          className="rounded bg-gray-800 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700"
          aria-label="复制代码"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      {language && (
        <div className="absolute left-2 top-2 z-10">
          <span className="rounded bg-gray-800 px-2 py-1 text-xs text-white dark:bg-gray-700">
            {language}
          </span>
        </div>
      )}
      <pre
        className={`${className} overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800`}
        {...props}
      >
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
