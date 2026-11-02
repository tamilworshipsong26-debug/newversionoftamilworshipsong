import React, { useEffect, useState } from 'react';
import { BroadcastRoom } from '../../types/room';
import { syncManager } from '../../services/broadcast';

interface ObsLowerThirdViewProps {
  roomId: string;
}

const hasTamil = (text?: string): boolean => {
  if (!text) return false;
  return /[\u0B80-\u0BFF]/.test(text);
};

export const ObsLowerThirdView: React.FC<ObsLowerThirdViewProps> = ({ roomId }) => {
  const [roomState, setRoomState] = useState<BroadcastRoom | null>(null);

  useEffect(() => {
    // Attach listener
    const cleanup = syncManager.setRoom(roomId, (updated) => {
      setRoomState(updated);
    });

    // Make body transparent for OBS Browser Source
    document.body.style.backgroundColor = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';

    return () => {
      cleanup();
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [roomId]);

  if (!roomState) {
    return (
      <div className="w-screen h-screen flex flex-col justify-end p-4 sm:p-6 pb-4 sm:pb-6 bg-transparent select-none overflow-hidden font-sans">
        <div className="max-w-md mx-auto w-full glass-panel border border-amber-500/30 rounded-xl p-3 text-center shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>OBS Ready • Room: {roomId}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-tamil mt-0.5">
            ஒளிபரப்ப தயார் நிலையில் உள்ளது (Standing by for live broadcast)
          </p>
        </div>
      </div>
    );
  }

  if (roomState.isBlanked) {
    return <div className="w-screen h-screen bg-transparent" />;
  }

  const {
    primaryText,
    secondaryText,
    referenceTitle,
    subReference,
    slideBadge,
    obsStyle = 'dark-glass',
    fontScale = 1.0
  } = roomState;

  const styleClass = obsStyle === 'royal-gold'
    ? 'glass-panel-gold border-amber-500/40 text-amber-100 shadow-2xl'
    : obsStyle === 'minimal-clean'
    ? 'bg-black/90 border border-slate-700 text-white'
    : 'glass-panel text-white shadow-2xl shadow-black/80';

  const isPrimaryTamil = hasTamil(primaryText);
  const isSecondaryTamil = hasTamil(secondaryText);

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-3 sm:p-6 pb-3 sm:pb-5 bg-transparent select-none overflow-hidden font-sans">
      <div 
        className={`max-w-5xl mx-auto w-full rounded-2xl p-3.5 sm:p-4 px-4 sm:px-6 transition-all duration-300 transform animate-slide-up ${styleClass}`}
      >
        {/* Header Badge & Reference (Compact 1-liner) */}
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
            <span className="font-bold font-mono tracking-wider text-amber-300 uppercase text-xs truncate">
              {referenceTitle}
            </span>
            {subReference && (
              <span className={`text-xs text-slate-300 font-medium truncate ${hasTamil(subReference) ? 'font-tamil' : ''}`}>
                • {subReference}
              </span>
            )}
          </div>

          {slideBadge && (
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
              {slideBadge}
            </span>
          )}
        </div>

        {/* Content Body: Side-by-Side Grid if Secondary text exists, or Sleek Single Column */}
        {secondaryText ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 items-center">
            {/* Primary Lyrics (Tamil or English) */}
            <div 
              className={`font-semibold text-white leading-snug tracking-wide drop-shadow-md whitespace-pre-line ${
                isPrimaryTamil ? 'font-tamil' : 'font-serif-scripture'
              }`}
              style={{ fontSize: `${Math.round(19 * fontScale)}px` }}
            >
              {primaryText}
            </div>

            {/* Secondary Parallel Lyrics (Tanglish / Subtitle) */}
            <div 
              className={`md:border-l md:border-white/15 md:pl-5 text-amber-200/90 font-medium drop-shadow whitespace-pre-line leading-snug ${
                isSecondaryTamil ? 'font-tamil' : 'font-serif-scripture italic'
              }`}
              style={{ fontSize: `${Math.round(14 * fontScale)}px` }}
            >
              {secondaryText}
            </div>
          </div>
        ) : (
          /* Single Primary Column */
          <div 
            className={`font-semibold text-white leading-snug tracking-wide drop-shadow-md whitespace-pre-line ${
              isPrimaryTamil ? 'font-tamil' : 'font-serif-scripture'
            }`}
            style={{ fontSize: `${Math.round(21 * fontScale)}px` }}
          >
            {primaryText}
          </div>
        )}
      </div>
    </div>
  );
};
