import React, { useEffect } from 'react';
import { 
  Radio, 
  Monitor, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  ExternalLink, 
  Sliders, 
  RotateCcw
} from 'lucide-react';
import { BroadcastRoom, ObsStyleTheme } from '../../types/room';
import { Hymn } from '../../types/hymn';

interface DesktopCommandCenterProps {
  roomId: string;
  activeRoom: BroadcastRoom | null;
  currentHymn: Hymn | null;
  onPrev: () => void;
  onNext: () => void;
  onJumpChorus: () => void;
  onToggleBlank: () => void;
  onSelectStanza: (hymn: Hymn, idx: number) => void;
  onChangeTheme: (theme: ObsStyleTheme) => void;
  onChangeFontScale: (scale: number) => void;
}

export const DesktopCommandCenter: React.FC<DesktopCommandCenterProps> = ({
  roomId,
  activeRoom,
  currentHymn,
  onPrev,
  onNext,
  onJumpChorus,
  onToggleBlank,
  onSelectStanza,
  onChangeTheme,
  onChangeFontScale
}) => {
  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onToggleBlank();
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        onJumpChorus();
      } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key) && currentHymn) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentHymn.stanzas[idx]) {
          e.preventDefault();
          onSelectStanza(currentHymn, idx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentHymn, onNext, onPrev, onToggleBlank, onJumpChorus, onSelectStanza]);

  const obsUrl = `${window.location.origin}${window.location.pathname}?view=obs&room=${roomId}`;
  const projectorUrl = `${window.location.origin}${window.location.pathname}?view=projector&room=${roomId}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-5 h-full">
      {/* Center Live Stanza Grid & Controls (2/3 width on wide screens) */}
      <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        {/* Top Control Bar with Keyboard Cheatsheet */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className={`relative inline-flex rounded-full h-3 w-3 ${activeRoom?.isBlanked ? 'bg-amber-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-sm font-bold font-mono text-white">
              ROOM: <span className="text-amber-400">{roomId}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              (Live Broadcast Active)
            </span>
          </div>

          {/* Cheatsheet Badges */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Space / → : Advance</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">← : Prev</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">B : Blank</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">C : Chorus</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">1-9 : Stanza Jump</span>
          </div>
        </div>

        {/* Live Stanza Launchpad */}
        {currentHymn ? (
          <div className="flex-1 flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {currentHymn.bookNameEnglish} #{currentHymn.number}
                </span>
                <h3 className="text-base font-bold font-tamil text-white">
                  {currentHymn.titleTamil}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {currentHymn.stanzas.length} Stanzas Available
              </span>
            </div>

            {/* Stanzas Clickable Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[380px] p-1">
              {currentHymn.stanzas.map((stanza, idx) => {
                const isLive = activeRoom?.sourceId === currentHymn.id && activeRoom?.currentIndex === idx && !activeRoom?.isBlanked;
                return (
                  <button
                    key={stanza.id}
                    onClick={() => onSelectStanza(currentHymn, idx)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isLive
                        ? 'bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-500'
                        : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded">
                        [{idx + 1}] {stanza.label}
                      </span>
                      {isLive && (
                        <span className="text-[10px] font-bold font-mono text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded animate-pulse">
                          ON AIR
                        </span>
                      )}
                    </div>
                    <div className="font-tamil text-sm text-slate-200 line-clamp-3 leading-relaxed">
                      {stanza.tamil.join(' • ')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Booth Tactile Toolbar */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={onPrev}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-white flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4 text-amber-400" />
                <span>Previous [←]</span>
              </button>
              <button
                onClick={onJumpChorus}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 border border-amber-500/30 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chorus [C]</span>
              </button>
              <button
                onClick={onToggleBlank}
                className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition active:scale-95 ${
                  activeRoom?.isBlanked
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>{activeRoom?.isBlanked ? 'Unblank Screen' : 'Blank Screen [B]'}</span>
              </button>
              <button
                onClick={onNext}
                className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-xs font-extrabold text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
              >
                <span>Next Slide [Space]</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Select a song or scripture from the Library tab to launch into the live booth grid.
          </div>
        )}
      </div>

      {/* Right Column: Dual Live Monitors (OBS 16:9 + Projector 16:9) */}
      <div className="w-full xl:w-96 flex flex-col gap-4">
        {/* Monitor 1: OBS Studio 16:9 Lower-Third */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                OBS Lower-Third (16:9)
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(obsUrl)}
              className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
              title="Copy OBS Browser Source URL"
            >
              <Copy className="w-3 h-3" />
              <span>Copy URL</span>
            </button>
          </div>

          {/* 16:9 Aspect Ratio Frame */}
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent">
            {activeRoom && !activeRoom.isBlanked ? (
              <div className="glass-panel p-2.5 rounded-lg border border-white/10 text-white animate-slide-up">
                <div className="text-[10px] text-amber-300 font-mono font-bold truncate">
                  {activeRoom.referenceTitle} • {activeRoom.slideBadge || 'Stanza'}
                </div>
                <div className="font-tamil text-xs font-semibold text-white line-clamp-2 mt-0.5 leading-snug">
                  {activeRoom.primaryText}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-[11px] font-mono">
                [OBS SCREEN BLANK]
              </div>
            )}
          </div>
        </div>

        {/* Monitor 2: Sanctuary Projector 16:9 Screen */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Sanctuary Projector (16:9)
              </span>
            </div>
            <button
              onClick={() => window.open(projectorUrl, '_blank', 'width=1920,height=1080')}
              className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
              title="Open Sanctuary Screen in Pop-out window"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Pop Out</span>
            </button>
          </div>

          {/* 16:9 Aspect Ratio Frame */}
          <div className="relative aspect-video rounded-xl bg-black border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
            {activeRoom && !activeRoom.isBlanked ? (
              <div className="animate-slide-up">
                <div className="text-[10px] text-amber-400 font-mono mb-1">
                  {activeRoom.referenceTitle}
                </div>
                <div className="font-tamil text-xs sm:text-sm font-bold text-white line-clamp-3 leading-relaxed">
                  {activeRoom.primaryText}
                </div>
              </div>
            ) : (
              <div className="text-slate-700 text-[11px] font-mono">
                [PROJECTOR SCREEN BLANK]
              </div>
            )}
          </div>
        </div>

        {/* Style & Font Controls */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Broadcast Display Settings</span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">OBS Glass Theme:</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['dark-glass', 'royal-gold', 'minimal-clean'] as ObsStyleTheme[]).map(theme => (
                <button
                  key={theme}
                  onClick={() => onChangeTheme(theme)}
                  className={`py-1 px-2 rounded-lg text-[10px] font-mono capitalize transition ${
                    activeRoom?.obsStyle === theme
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {theme.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Font Scale</span>
              <span className="font-mono">{activeRoom?.fontScale || 1.0}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={activeRoom?.fontScale || 1.0}
              onChange={(e) => onChangeFontScale(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
