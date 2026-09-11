import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { AvatarWithFallback } from './AvatarWithFallback';

interface ActivityWidgetProps {
  avatarUrl: string;
  username: string;
  activityTitle?: string;
  activitySubtitle?: string;
  startedMinutesAgo?: number;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  avatarUrl,
  username = 'UralRedux',
  activityTitle = 'Playing Project Real',
  activitySubtitle = 'Editing shrekfarm_hub.luau',
  startedMinutesAgo = 3,
}) => {
  const [hours] = useState(startedMinutesAgo);

  return (
    <div className="w-full bg-[#121214]/60 hover:bg-[#121214]/70 transition-colors backdrop-blur-xl rounded-2xl md:rounded-[22px] p-3.5 md:p-4 border border-white/10 flex items-center justify-between gap-3 select-none shadow-xl">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* User Mini Avatar with Yellow Moon Badge */}
        <div className="relative shrink-0">
          <AvatarWithFallback
            src={avatarUrl}
            alt="Activity music avatar"
            fallbackType="music"
            className="w-12 h-12 md:w-13 md:h-13 rounded-full object-cover border border-white/20 shadow-md"
          />
          {/* Crescent Moon Idle Badge (orange/yellow) from screenshot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-black/90 rounded-full flex items-center justify-center border border-black shadow-sm">
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-amber-400 fill-current">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
        </div>

        {/* Text details matching screenshot layout */}
        <div className="flex flex-col min-w-0 text-left leading-tight">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-display font-bold text-sm md:text-[15px] text-white tracking-wide truncate">
              {username}
            </span>
            {/* Red circle badge with white checkmark */}
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#e03131] text-white text-[10px] font-black shrink-0 shadow-sm">
              ✓
            </span>
          </div>

          <span className="text-xs md:text-[13px] font-medium text-white/90 truncate">
            {activityTitle}
          </span>

          <span className="text-[11px] md:text-xs text-zinc-300 truncate mt-0.5">
            {activitySubtitle}
          </span>

          <span className="text-[11px] md:text-xs text-zinc-400 mt-0.5">
            for {hours} hours
          </span>
        </div>
      </div>

      {/* Right side: '⚡ OC' Pill Badge from screenshot */}
      <div className="shrink-0 flex items-center">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/15 text-xs text-white font-medium cursor-pointer shadow-sm">
          <Zap className="w-3.5 h-3.5 text-white fill-current" />
          <span className="tracking-wider text-xs font-display font-semibold">OC</span>
        </div>
      </div>
    </div>
  );
};
