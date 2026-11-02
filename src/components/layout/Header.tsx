import React from 'react';
import { Radio, Monitor } from 'lucide-react';

interface HeaderProps {
  roomId: string;
  setRoomId: (id: string) => void;
  activeTab: 'hymns' | 'bible' | 'setlist' | 'live';
  setActiveTab: (tab: 'hymns' | 'bible' | 'setlist' | 'live') => void;
  onOpenDialpad: () => void;
  isLiveActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  roomId,
  setRoomId,
  onOpenDialpad,
  isLiveActive
}) => {
  const openObsWindow = () => {
    window.open(`?view=obs&room=${roomId}`, '_blank', 'width=1280,height=720');
  };

  const openProjectorWindow = () => {
    window.open(`?view=projector&room=${roomId}`, '_blank', 'width=1920,height=1080');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="font-bold text-slate-950 text-base">✝</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Tamil Worship</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-medium hidden sm:inline-block">Suite</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-tamil truncate max-w-[140px] sm:max-w-xs">
              4 பாடல் புத்தகங்கள் & திருவிவிலியம்
            </p>
          </div>
        </div>

        {/* Live Room Badge & Control Center */}
        <div className="flex items-center gap-2">
          {/* Room Pill */}
          <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs">
            <span className="flex h-2 w-2 relative mr-1.5">
              {isLiveActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveActive ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-slate-400 font-mono text-[11px] mr-1 hidden xs:inline">ROOM:</span>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-16 sm:w-24 bg-transparent font-mono font-bold text-amber-300 text-xs focus:outline-none focus:text-white uppercase"
              title="Broadcast Room Code"
            />
          </div>

          {/* Quick Dialpad Action Button */}
          <button
            onClick={onOpenDialpad}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition active:scale-95"
            title="Fast Numeric Dialpad"
          >
            <span className="font-mono text-sm">#</span>
            <span className="hidden sm:inline">Quick Dial</span>
          </button>

          {/* Desktop OBS / Projector Launch Buttons */}
          <div className="hidden md:flex items-center gap-1.5 border-l border-slate-800 pl-2">
            <button
              onClick={openObsWindow}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs font-medium transition"
              title="Open OBS Lower-Third Browser Source in pop-out window"
            >
              <Radio className="w-3.5 h-3.5 text-red-400" />
              <span>OBS View</span>
            </button>
            <button
              onClick={openProjectorWindow}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs font-medium transition"
              title="Open Sanctuary Projector in full pop-out window"
            >
              <Monitor className="w-3.5 h-3.5 text-amber-400" />
              <span>Projector</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
