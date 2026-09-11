import React, { useState, useRef } from 'react';
import { Eye, Hash, Lock, BadgeCheck, MapPin, Check } from 'lucide-react';
import { AvatarWithFallback } from './AvatarWithFallback';
import { ActivityWidget } from './ActivityWidget';
import { MusicPlayer } from './MusicPlayer';
import { BioConfig } from '../types';

interface BioCardProps {
  config: BioConfig;
  isStarted?: boolean;
}

export const BioCard: React.FC<BioCardProps> = ({ config, isStarted = true }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Subtle 3D tilt angle
  const MAX_TILT = config.tiltStrength !== undefined ? config.tiltStrength : 5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!outerRef.current) return;
    const rect = outerRef.current.getBoundingClientRect();
    
    const clientX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const clientY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const normX = clientX / rect.width;
    const normY = clientY / rect.height;

    const dx = Math.max(-1, Math.min(1, (normX - 0.5) * 2));
    const dy = Math.max(-1, Math.min(1, (normY - 0.5) * 2));

    const targetRotateX = -dy * MAX_TILT;
    const targetRotateY = dx * MAX_TILT;

    setRotateX(targetRotateX);
    setRotateY(targetRotateY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  return (
    <div 
      ref={outerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[620px] md:max-w-[660px] perspective-1200 select-none py-6 px-3"
    >
      {/* Toast Alert */}
      {copiedText && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/85 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-2xl flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{copiedText} скопирован в буфер!</span>
        </div>
      )}

      {/* 3D Glass Card Container - Large & Highly Transparent as in photo */}
      <div
        className={`relative w-full rounded-3xl md:rounded-[36px] bg-black/15 backdrop-blur-xl border border-white/15 p-8 md:p-10 shadow-2xl transform-style-3d cursor-default will-change-transform ${
          isHovered 
            ? 'transition-transform duration-100 ease-out' 
            : 'transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]'
        }`}
        style={{
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.01 : 1}, ${isHovered ? 1.01 : 1}, 1)`,
        }}
      >
        {/* TOP BAR: Real Views & UID badges in top-right corner */}
        <div 
          className="flex items-center justify-end gap-3 mb-3"
          style={{ transform: 'translateZ(10px)' }}
        >
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/10 text-xs md:text-sm font-semibold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]"
            title="Реальные просмотры"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span className="font-display">{config.views}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/10 text-xs md:text-sm font-semibold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
            <Hash className="w-3.5 h-3.5 text-white/90" />
            <span className="font-display">{config.uid}</span>
          </div>
        </div>

        {/* CENTER PROFILE: Avatar, Username, Lock & Badge icons */}
        <div 
          className="flex flex-col items-center text-center mt-1"
          style={{ transform: 'translateZ(12px)' }}
        >
          {/* Avatar Circle - Large & Centered */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-white/25 shadow-2xl bg-zinc-900 flex items-center justify-center">
              <AvatarWithFallback
                src={config.avatarUrl}
                alt={config.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Username */}
          <h1 className="mt-3.5 font-display font-bold text-2xl md:text-3xl text-white tracking-wide drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
            {config.username}
          </h1>

          {/* Badges below username: Lock & Verified rosette checkmark */}
          <div className="flex items-center gap-2 mt-1.5 text-white">
            <span title="Private account" className="hover:text-white transition-colors cursor-pointer">
              <Lock className="w-3.5 h-3.5 fill-current" />
            </span>
            <span title="Verified profile" className="hover:text-white transition-colors cursor-pointer">
              <BadgeCheck className="w-4 h-4 fill-white/20 text-white" />
            </span>
          </div>
        </div>

        {/* HORIZONTAL FRAMING DIVIDER: Top line + Centered Name + Bottom line */}
        <div 
          className="w-full my-5"
          style={{ transform: 'translateZ(10px)' }}
        >
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]" />
          <div className="text-center py-2.5">
            <span className="font-display font-bold text-white text-lg md:text-xl tracking-[0.1em] drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
              {config.username}
            </span>
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]" />
        </div>

        {/* FLANKING TAGS & CENTER STACK (Asymmetric layout from screenshot) */}
        <div 
          className="relative w-full my-4 min-h-[110px] flex flex-col items-center justify-center"
          style={{ transform: 'translateZ(10px)' }}
        >
          {/* Right tag (himk1n) positioned higher on the right */}
          <div className="absolute top-0 right-1 text-right">
            <span className="font-display font-bold text-base md:text-lg text-white tracking-wide drop-shadow-[0_0_4px_rgba(255,255,255,0.4)] hover:drop-shadow-[0_0_7px_rgba(255,255,255,0.75)] transition-all cursor-pointer">
              {config.friends.right}
            </span>
          </div>

          {/* Left tag (ax1onov) positioned lower on the left */}
          <div className="absolute top-11 left-1 text-left">
            <span className="font-display font-bold text-base md:text-lg text-white tracking-wide drop-shadow-[0_0_4px_rgba(255,255,255,0.4)] hover:drop-shadow-[0_0_7px_rgba(255,255,255,0.75)] transition-all cursor-pointer">
              {config.friends.left}
            </span>
          </div>

          {/* Center column: FX + location + Discord icon */}
          <div className="flex flex-col items-center justify-center space-y-2.5 py-1">
            <span className="font-display font-bold text-sm md:text-base text-white tracking-widest drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">
              {config.tag}
            </span>

            <div className="flex items-center gap-1.5 text-xs md:text-sm text-white font-display font-semibold hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>{config.location}</span>
            </div>

            {/* Discord Profile Link */}
            <a
              href="https://discord.com/users/1082921323086479360"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 transition-all p-1 inline-flex items-center justify-center cursor-pointer"
              title="Discord: https://discord.com/users/1082921323086479360"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ACTIVITY WIDGET (With crescent moon, verified red check, and ⚡ OC pill) */}
        <div 
          className="w-full my-5"
          style={{ transform: 'translateZ(10px)' }}
        >
          <ActivityWidget
            avatarUrl={config.musicAvatarUrl || '/musik.png'}
            username={config.username}
            activityTitle="Playing Project Real"
            activitySubtitle="Editing shrekfarm_hub.luau"
            startedMinutesAgo={3}
          />
        </div>

        {/* MUSIC PLAYER AT THE BOTTOM: "techtok" + Scrubber + Volume */}
        <div
          className="w-full pt-2"
          style={{ transform: 'translateZ(10px)' }}
        >
          <MusicPlayer
            trackTitle={config.trackTitle || 'techtok'}
            initialDuration={config.trackDurationSec || 14}
            isStarted={isStarted}
          />
        </div>
      </div>
    </div>
  );
};
