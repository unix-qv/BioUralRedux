import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Play } from 'lucide-react';

interface MusicPlayerProps {
  trackTitle?: string;
  initialDuration?: number;
  isStarted?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  trackTitle = 'techtok',
  initialDuration = 14,
  isStarted = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(isStarted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [volume, setVolume] = useState(80);

  const isDraggingProgress = useRef(false);
  const isDraggingVolume = useRef(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const volumeRef = useRef<HTMLDivElement | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // When user enters from preview splash screen, activate player
  useEffect(() => {
    if (isStarted) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isStarted]);

  // Sync with background video element audio and duration
  useEffect(() => {
    const videoEl = document.getElementById('bg-video-element') as HTMLVideoElement | null;
    if (!videoEl) return;

    const onLoadedMetadata = () => {
      if (videoEl.duration && !isNaN(videoEl.duration) && videoEl.duration > 0) {
        setDuration(Math.round(videoEl.duration));
      }
    };

    if (videoEl.duration && !isNaN(videoEl.duration) && videoEl.duration > 0) {
      setDuration(Math.round(videoEl.duration));
    }

    videoEl.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      videoEl.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  // Sync play / pause with video element
  useEffect(() => {
    const videoEl = document.getElementById('bg-video-element') as HTMLVideoElement | null;
    if (!videoEl) return;

    if (isPlaying) {
      if (volume > 0) videoEl.muted = false;
      videoEl.volume = volume / 100;
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [isPlaying, volume]);

  // Sync volume with video element
  useEffect(() => {
    const videoEl = document.getElementById('bg-video-element') as HTMLVideoElement | null;
    if (!videoEl) return;
    videoEl.volume = volume / 100;
    videoEl.muted = volume === 0;
  }, [volume]);

  // Silky smooth 60fps playback loop with requestAnimationFrame + sync with video currentTime
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const updatePlayhead = (timestamp: number) => {
      const videoEl = document.getElementById('bg-video-element') as HTMLVideoElement | null;

      if (!isDraggingProgress.current) {
        if (videoEl && !isNaN(videoEl.currentTime) && videoEl.currentTime > 0) {
          setCurrentTime(videoEl.currentTime);
          if (videoEl.duration && !isNaN(videoEl.duration) && videoEl.duration > 0) {
            setDuration(Math.round(videoEl.duration));
          }
        } else {
          // Synthetic fallback progression if video has not yet started
          if (lastTimeRef.current === null) {
            lastTimeRef.current = timestamp;
          }
          const deltaSec = (timestamp - lastTimeRef.current) / 1000;
          lastTimeRef.current = timestamp;

          setCurrentTime((prev) => {
            const next = prev + deltaSec;
            if (next >= duration) {
              return 0;
            }
            return next;
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(updatePlayhead);
    };

    animFrameRef.current = requestAnimationFrame(updatePlayhead);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / (duration || 1)) * 100));

  const updateProgressFromEvent = useCallback((clientX: number) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = ratio * duration;
    setCurrentTime(targetTime);

    const videoEl = document.getElementById('bg-video-element') as HTMLVideoElement | null;
    if (videoEl && !isNaN(videoEl.duration)) {
      videoEl.currentTime = targetTime;
    }
  }, [duration]);

  const updateVolumeFromEvent = useCallback((clientX: number) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newVol = Math.round(ratio * 100);
    setVolume(newVol);

    const videoEl = document.getElementById('bg-video-element') as HTMLVideoElement | null;
    if (videoEl) {
      videoEl.volume = newVol / 100;
      videoEl.muted = newVol === 0;
    }
  }, []);

  // Global mouse move and mouse up listeners for smooth dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingProgress.current) {
        updateProgressFromEvent(e.clientX);
      }
      if (isDraggingVolume.current) {
        updateVolumeFromEvent(e.clientX);
      }
    };

    const handleMouseUp = () => {
      isDraggingProgress.current = false;
      isDraggingVolume.current = false;
      lastTimeRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updateProgressFromEvent, updateVolumeFromEvent]);

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingProgress.current = true;
    updateProgressFromEvent(e.clientX);
  };

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingVolume.current = true;
    updateVolumeFromEvent(e.clientX);
  };

  return (
    <div className="w-full bg-[#121214]/60 hover:bg-[#121214]/70 transition-colors backdrop-blur-xl rounded-2xl md:rounded-[22px] p-3.5 md:p-4 border border-white/10 select-none shadow-xl">
      {/* Track Title */}
      <div className="text-left mb-2">
        <span className="font-display font-bold text-sm md:text-[15px] text-white tracking-wide">
          {trackTitle}
        </span>
      </div>

      {/* Controls Row: Time + Progress bar + Time + Play/Pause + Volume */}
      <div className="flex items-center gap-2.5 md:gap-3 text-xs md:text-sm text-white font-mono">
        {/* Current Time */}
        <span className="text-xs text-zinc-300 w-9 shrink-0 text-left font-medium tabular-nums font-mono">
          {formatTime(currentTime)}
        </span>

        {/* Interactive Progress Bar (Smooth continuous line) */}
        <div
          ref={progressRef}
          onMouseDown={handleProgressMouseDown}
          className="relative flex-1 h-2 bg-white/20 hover:bg-white/25 transition-colors rounded-full cursor-pointer flex items-center"
        >
          {/* Filled progress */}
          <div
            className="h-full bg-white rounded-full will-change-[width]"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Thumb circle - moves smoothly without stepping or lag */}
          <div
            className="absolute -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md will-change-[left]"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Total Duration */}
        <span className="text-xs text-zinc-300 w-9 shrink-0 text-right font-medium tabular-nums font-mono">
          {formatTime(duration)}
        </span>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 hover:scale-110 active:scale-95 text-white transition-all shrink-0 ml-1 cursor-pointer"
          title={isPlaying ? 'Пауза' : 'Воспроизвести'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
        </button>

        {/* Volume Slider */}
        <div
          ref={volumeRef}
          onMouseDown={handleVolumeMouseDown}
          className="relative w-14 md:w-16 h-2 bg-white/20 hover:bg-white/25 transition-colors rounded-full cursor-pointer flex items-center ml-0.5"
          title={`Громкость: ${volume}%`}
        >
          <div
            className="h-full bg-white rounded-full will-change-[width]"
            style={{ width: `${volume}%` }}
          />
          <div
            className="absolute -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-sm will-change-[left]"
            style={{ left: `${volume}%` }}
          />
        </div>
      </div>
    </div>
  );
};
