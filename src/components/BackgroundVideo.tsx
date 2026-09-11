import React, { useState, useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  videoSrc: string;
  isFrozen?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoSrc,
  isFrozen = false,
}) => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const candidateSources = [
    videoSrc,
    '/techtok.mp4',
    '/background.mp4',
    '/video.mp4',
  ].filter(Boolean);

  const currentSrc = candidateSources[srcIndex] || videoSrc;

  // Handle freeze / unfreeze states
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isFrozen) {
      // Keep video paused and still while splash / заставка is active
      video.pause();
    } else {
      // Unfreeze, unmute and play with sound when entering
      video.muted = false;
      video.volume = 0.8;
      video.play().catch(() => {});
    }
  }, [isFrozen]);

  const handleLoadedData = () => {
    setVideoLoaded(true);
    if (videoRef.current) {
      if (isFrozen) {
        // Freeze at initial frame, do not move
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleVideoError = () => {
    if (srcIndex + 1 < candidateSources.length) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setVideoError(true);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-black">
      {/* Fallback ambient background */}
      <div className="absolute inset-0 bg-[#08080c] overflow-hidden">
        {/* Glowing orbs - paused when frozen, subtle pulse when playing */}
        <div 
          className={`absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full opacity-30 blur-[130px] ${
            isFrozen ? '' : 'animate-pulse'
          }`}
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0) 70%)', animationDuration: '8s' }}
        />
        <div 
          className={`absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] rounded-full opacity-25 blur-[140px] ${
            isFrozen ? '' : 'animate-pulse'
          }`}
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(168,85,247,0) 70%)', animationDuration: '10s' }}
        />
        <div 
          className={`absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-20 blur-[120px] ${
            isFrozen ? '' : 'animate-pulse'
          }`}
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(6,182,212,0) 70%)', animationDuration: '12s' }}
        />
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Video element */}
      {!videoError && (
        <video
          ref={videoRef}
          id="bg-video-element"
          src={currentSrc}
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleLoadedData}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-80 scale-105' : 'opacity-0'
          }`}
          style={{ filter: 'brightness(0.7) contrast(1.1) saturate(1.2)' }}
        />
      )}

      {/* Dark gradient and blur overlays */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      
      {/* Subtle vignette border */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.85)] pointer-events-none" />
    </div>
  );
};
