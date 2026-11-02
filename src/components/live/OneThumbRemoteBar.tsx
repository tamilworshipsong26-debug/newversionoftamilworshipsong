import React from 'react';
import { ChevronLeft, ChevronRight, Square, RotateCcw } from 'lucide-react';
import { BroadcastRoom } from '../../types/room';

interface OneThumbRemoteBarProps {
  activeRoom: BroadcastRoom | null;
  onPrev: () => void;
  onNext: () => void;
  onJumpChorus: () => void;
  onToggleBlank: () => void;
}

export const OneThumbRemoteBar: React.FC<OneThumbRemoteBarProps> = ({
  activeRoom,
  onPrev,
  onNext,
  onJumpChorus,
  onToggleBlank
}) => {
  if (!activeRoom) return null;

  const isBlanked = activeRoom.isBlanked;

  return (
    <aside aria-label="One-Thumb Live Remote" className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2 sm:hidden">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-2">
        {/* Status Strip */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-2 w-2 relative">
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isBlanked ? 'bg-amber-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="font-mono font-bold text-amber-300 truncate">
              {activeRoom.referenceTitle || 'Ready'}
            </span>
            {activeRoom.slideBadge && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                {activeRoom.slideBadge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            {isBlanked ? '■ Screen Blank' : '● Live on OBS'}
          </span>
        </div>

        {/* 4 Large Thumb Tactile Controls */}
        <div className="grid grid-cols-4 gap-1.5 h-12">
          {/* Prev */}
          <button
            onClick={onPrev}
            className="rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700/60 active:scale-95 transition"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>Prev</span>
          </button>

          {/* Pallavi / Chorus shortcut */}
          <button
            onClick={onJumpChorus}
            className="rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 border border-amber-500/30 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>பல்லவி</span>
          </button>

          {/* Blank Screen */}
          <button
            onClick={onToggleBlank}
            className={`rounded-xl font-bold text-xs flex items-center justify-center gap-1 border active:scale-95 transition ${
              isBlanked
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>{isBlanked ? 'Unblank' : 'Blank'}</span>
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-95 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
