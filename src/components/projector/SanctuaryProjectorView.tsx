import React, { useEffect, useState } from 'react';
import { BroadcastRoom } from '../../types/room';
import { syncManager } from '../../services/broadcast';

interface SanctuaryProjectorViewProps {
  roomId: string;
}

export const SanctuaryProjectorView: React.FC<SanctuaryProjectorViewProps> = ({ roomId }) => {
  const [roomState, setRoomState] = useState<BroadcastRoom | null>(null);

  useEffect(() => {
    const cleanup = syncManager.setRoom(roomId, (updated) => {
      setRoomState(updated);
    });

    return () => {
      cleanup();
    };
  }, [roomId]);

  if (!roomState || roomState.isBlanked) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        {/* Subtle cross indicator on blank or clean black */}
        <div className="w-3 h-3 rounded-full bg-slate-900"></div>
      </div>
    );
  }

  const {
    primaryText,
    secondaryText,
    referenceTitle,
    subReference,
    slideBadge,
    fontScale = 1.0
  } = roomState;

  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex flex-col justify-between p-12 sm:p-20 select-none overflow-hidden font-sans">
      {/* Top Bar Reference */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-amber-400">
            {referenceTitle}
          </span>
          {subReference && (
            <span className="text-lg sm:text-xl text-slate-400 font-medium font-tamil">
              — {subReference}
            </span>
          )}
        </div>

        {slideBadge && (
          <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-base font-bold border border-amber-500/40">
            {slideBadge}
          </span>
        )}
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto max-w-6xl mx-auto w-full px-4 animate-slide-up">
        {/* Primary Tamil text */}
        <div 
          className="font-tamil font-bold text-3xl sm:text-5xl lg:text-6xl text-white leading-relaxed tracking-wide drop-shadow-lg whitespace-pre-line"
          style={{ fontSize: `${Math.round(44 * fontScale)}px` }}
        >
          {primaryText}
        </div>

        {/* Secondary Subtitle */}
        {secondaryText && (
          <div 
            className="mt-8 font-sans font-medium text-xl sm:text-3xl text-amber-300/90 leading-relaxed whitespace-pre-line border-t border-slate-800 pt-6 w-full max-w-4xl"
            style={{ fontSize: `${Math.round(26 * fontScale)}px` }}
          >
            {secondaryText}
          </div>
        )}
      </div>

      {/* Bottom Footer Watermark */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-mono border-t border-slate-900 pt-3">
        <span>TAMIL WORSHIP & SANCTUARY SUITE</span>
        <span>ROOM: {roomId}</span>
      </div>
    </div>
  );
};
