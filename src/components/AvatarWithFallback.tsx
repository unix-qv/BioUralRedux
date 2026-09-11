import React, { useState, useEffect } from 'react';

interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'profile' | 'music';
}

export const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'profile',
}) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // List of potential path variations to check if file was placed in /public
  const candidatePaths = fallbackType === 'music'
    ? [src, '/musik.png', '/music.png', '/musik.jpg', '/music.jpg', '/musik.webp']
    : [src, '/avatar.png', '/avatar.jpg', '/avatar.jpeg', '/avatar.webp'];

  useEffect(() => {
    let isCancelled = false;

    const checkImage = () => {
      let found = false;

      const tryLoad = (index: number) => {
        if (index >= candidatePaths.length || found || isCancelled) return;
        const testPath = candidatePaths[index];
        const img = new Image();
        img.src = `${testPath}?t=${Date.now()}`;
        img.onload = () => {
          if (!isCancelled && !found) {
            found = true;
            setLoadedSrc(testPath);
            setHasError(false);
          }
        };
        img.onerror = () => {
          if (!isCancelled && !found) {
            tryLoad(index + 1);
          }
        };
      };

      tryLoad(0);
    };

    checkImage();

    const interval = setInterval(() => {
      if (!loadedSrc) {
        checkImage();
      }
    }, 3500);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [src, fallbackType, loadedSrc]);

  if (loadedSrc && !hasError) {
    return (
      <img
        src={loadedSrc}
        alt={alt}
        onError={() => {
          setLoadedSrc(null);
          setHasError(true);
        }}
        className={`${className} object-cover`}
      />
    );
  }

  if (fallbackType === 'music') {
    return (
      <div className={`${className} bg-zinc-950 flex items-center justify-center relative overflow-hidden shadow-inner`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="100" fill="#141416" />
          <circle cx="50" cy="50" r="48" fill="#1f1f23" />
          <circle cx="50" cy="38" r="22" fill="#e4e4e7" opacity="0.85" />
          <circle cx="43" cy="36" r="3.5" fill="#18181b" />
          <circle cx="57" cy="36" r="3.5" fill="#18181b" />
          <path d="M47 43 L50 40 L53 43 Z" fill="#18181b" />
          <path d="M45 46 Q50 49 55 46" stroke="#18181b" strokeWidth="1.5" fill="none" />
          <path d="M20 100 C20 70 28 65 32 60 C35 55 35 48 30 46 C25 44 26 38 29 38 C32 38 34 42 37 45 C40 48 40 54 36 62 C32 68 30 75 28 100 Z" fill="#09090b" opacity="0.95" />
          <path d="M0 80 Q50 72 100 82 L100 100 L0 100 Z" fill="#09090b" />
          <path d="M0 88 Q50 82 100 89 L100 100 L0 100 Z" fill="#000000" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${className} bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 flex items-center justify-center relative overflow-hidden shadow-inner`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#789973" />
        <circle cx="70" cy="30" r="30" fill="#a4c29d" opacity="0.6" />
        <path d="M22 65 C18 45 25 25 50 20 C75 25 82 45 78 65 C70 90 30 90 22 65 Z" fill="#ffb3cb" />
        <path d="M42 66 L58 66 L68 95 L32 95 Z" fill="#ffdfd3" />
        <path d="M38 88 L50 82 L62 88 L65 96 L35 96 Z" fill="#18181b" />
        <path d="M35 48 C35 68 65 68 65 48 C65 35 35 35 35 48 Z" fill="#ffecd9" />
        <path d="M30 38 C40 46 45 35 50 48 C55 35 60 46 70 38 C72 25 28 25 30 38 Z" fill="#ffa2c0" />
        <path d="M30 38 C32 55 35 60 36 68 C33 60 26 50 30 38 Z" fill="#ffa2c0" />
        <path d="M70 38 C68 55 65 60 64 68 C67 60 74 50 70 38 Z" fill="#ffa2c0" />
        <circle cx="43" cy="51" r="3" fill="#2d2238" />
        <circle cx="57" cy="51" r="3" fill="#2d2238" />
        <circle cx="42" cy="50" r="1" fill="#ffffff" />
        <circle cx="56" cy="50" r="1" fill="#ffffff" />
        <ellipse cx="39" cy="56" rx="3.5" ry="1.8" fill="#ff708f" opacity="0.6" />
        <ellipse cx="61" cy="56" rx="3.5" ry="1.8" fill="#ff708f" opacity="0.6" />
        <path d="M47 58 Q50 62 53 58" stroke="#a24458" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};
