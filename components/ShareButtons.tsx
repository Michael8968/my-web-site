'use client';

import { Twitter, Facebook, Linkedin, Link2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButtons({
  title,
  url,
  description,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? window.location.href : url;

  const shareData = {
    title,
    url: fullUrl,
    description: description || '',
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || '');

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 pt-6 border-t border-gray-200 dark:border-gray-800">
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
        分享：
      </span>
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="分享到 Twitter"
      >
        <Twitter className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="分享到 Facebook"
      >
        <Facebook className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="分享到 LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </button>
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="复制链接"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Link2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

