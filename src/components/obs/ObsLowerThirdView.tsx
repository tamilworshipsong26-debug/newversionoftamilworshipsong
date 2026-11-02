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
      <div className="w-screen h-screen flex flex-col justify-end p-8 sm:p-14 bg-transparent select-none overflow-hidden font-sans">
        <div className="max-w-xl mx-auto w-full glass-panel border border-amber-500/30 rounded-2xl p-4 text-center shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>OBS Lower-Third Ready • Room: {roomId}</span>
          </div>
          <p className="text-xs text-slate-300 font-tamil mt-1">
            ஒளிபரப்ப தயார் நிலையில் உள்ளது (Standing by for live broadcast)
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Select any hymn stanza or scripture verse in the controller to broadcast live
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
    : 'glass-panel text-white shadow-2xl shadow-black/60';

  const isPrimaryTamil = hasTamil(primaryText);
  const isSecondaryTamil = hasTamil(secondaryText);

  return (
    <div className="w-screen h-screen flex flex-col justify-end p-8 sm:p-14 bg-transparent select-none overflow-hidden font-sans">
      <div 
        className={`max-w-5xl mx-auto w-full rounded-2xl p-6 sm:p-8 transition-all duration-300 transform animate-slide-up ${styleClass}`}
      >
        {/* Header Badge & Reference */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm sm:text-base font-bold font-mono tracking-wider text-amber-300 uppercase">
              {referenceTitle}
            </span>
            {subReference && (
              <span className={`text-xs sm:text-sm text-slate-300 font-medium ${hasTamil(subReference) ? 'font-tamil' : ''}`}>
                • {subReference}
              </span>
            )}
          </div>

          {slideBadge && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs sm:text-sm font-bold border border-amber-500/30">
              {slideBadge}
            </span>
          )}
        </div>

        {/* Primary Scripture or Song Lyric (Dynamic Font based on language) */}
        <div 
          className={`font-semibold text-2xl sm:text-4xl text-white leading-relaxed tracking-wide drop-shadow-md whitespace-pre-line ${
            isPrimaryTamil ? 'font-tamil' : 'font-serif-scripture'
          }`}
          style={{ fontSize: `${Math.round(28 * fontScale)}px` }}
        >
          {primaryText}
        </div>

        {/* Secondary Subtitle (Parallel text or translation) */}
        {secondaryText && (
          <div 
            className={`mt-3 pt-3 border-t border-white/10 text-base sm:text-xl text-amber-200/90 font-medium drop-shadow whitespace-pre-line ${
              isSecondaryTamil ? 'font-tamil' : 'font-serif-scripture italic'
            }`}
            style={{ fontSize: `${Math.round(18 * fontScale)}px` }}
          >
            {secondaryText}
          </div>
        )}
      </div>
    </div>
  );
};
