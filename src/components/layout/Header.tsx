import React, { useState } from 'react';
import {
  Radio,
  Monitor,
  User,
  Tv,
  Heart,
  MoreHorizontal,
  Hash,
  Plus,
  Minus
} from 'lucide-react';

interface HeaderProps {
  roomId: string;
  setRoomId: (id: string) => void;
  appMode: 'personal' | 'presenter';
  setAppMode: (mode: 'personal' | 'presenter') => void;
  onOpenDialpad: () => void;
  isLiveActive: boolean;
  favoritesCount: number;
  onToggleFavoritesFilter?: () => void;
  isFavoritesFilterActive?: boolean;
  fontScale: number;
  setFontScale: (scale: number | ((prev: number) => number)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomId,
  setRoomId,
  appMode,
  setAppMode,
  onOpenDialpad,
  isLiveActive,
  favoritesCount,
  onToggleFavoritesFilter,
  isFavoritesFilterActive,
  fontScale,
  setFontScale
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const openObsWindow = () => {
    window.open(`?view=obs&room=${roomId}`, '_blank', 'width=1280,height=720');
    setShowQuickMenu(false);
  };

  const openProjectorWindow = () => {
    window.open(`?view=projector&room=${roomId}`, '_blank', 'width=1920,height=1080');
    setShowQuickMenu(false);
  };

  const handleIncreaseFont = () => {
    setFontScale(prev => Math.min(prev + 0.1, 1.4));
    setShowQuickMenu(false);
  };

  const handleDecreaseFont = () => {
    setFontScale(prev => Math.max(prev - 0.1, 0.85));
    setShowQuickMenu(false);
  };

  const handleDialpad = () => {
    onOpenDialpad();
    setShowQuickMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <span className="font-bold text-slate-950 text-base">✝</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                <span className="truncate">Tamil Worship</span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 font-mono font-medium whitespace-nowrap">
                  {appMode === 'personal' ? 'Devotion' : 'Sanctuary'}
                </span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-tamil truncate max-w-[130px] sm:max-w-xs">
              4 பாடல் புத்தகங்கள் & வேதாகமம்
            </p>
          </div>
        </div>

        {/* Center/Right Toolbar */}
        <div className="flex items-center gap-2">
          {/* App Mode Toggle: Personal vs Sanctuary Presenter */}
          <div className="flex bg-slate-900 border border-slate-700/60 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setAppMode('personal')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                appMode === 'personal'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Personal Devotion & Singing Mode"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Personal</span>
            </button>
            <button
              onClick={() => setAppMode('presenter')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                appMode === 'presenter'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sanctuary Projector & OBS Live Broadcast Mode"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sanctuary</span>
            </button>
          </div>

          {/* Favorites Filter Button */}
          {onToggleFavoritesFilter && (
            <button
              onClick={onToggleFavoritesFilter}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isFavoritesFilterActive
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-pink-300'
              }`}
              title="View Bookmarked Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavoritesFilterActive ? 'fill-current text-pink-400' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-[10px] font-mono px-1 rounded-full bg-pink-500/30 text-pink-200">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* Sanctuary / Presenter Mode Controls (Only shown when presenter mode is active) */}
          {appMode === 'presenter' && (
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-2 animate-slide-up">
              {/* Room Pill */}
              <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1 text-xs">
                <span className="flex h-2 w-2 relative mr-1.5">
                  {isLiveActive && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveActive ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                </span>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="w-14 sm:w-20 bg-transparent font-mono font-bold text-amber-300 text-xs focus:outline-none uppercase"
                  title="Broadcast Room Code"
                />
              </div>

              {/* Desktop OBS / Projector Launch Buttons */}
              <div className="hidden lg:flex items-center gap-1.5">
                <button
                  onClick={openObsWindow}
                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs font-medium transition"
                  title="Open OBS Lower-Third in pop-out window"
                >
                  <Radio className="w-3.5 h-3.5 text-red-400" />
                  <span>OBS</span>
                </button>
                <button
                  onClick={openProjectorWindow}
                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs font-medium transition"
                  title="Open Sanctuary Projector in pop-out window"
                >
                  <Monitor className="w-3.5 h-3.5 text-amber-400" />
                  <span>Screen</span>
                </button>
              </div>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(value => !value)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition"
              title="More controls"
              aria-expanded={showQuickMenu}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">More</span>
            </button>

            {showQuickMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-slate-950 shadow-2xl z-50 overflow-hidden">
                <div className="border-b border-slate-800 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-slate-500 font-medium">
                  Quick actions
                </div>
                <button
                  onClick={handleDecreaseFont}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                >
                  <span className="flex items-center gap-2"><Minus className="w-3.5 h-3.5 text-amber-300" /> Smaller text</span>
                  <span className="font-mono text-[10px] text-slate-500">{Math.round(fontScale * 100)}%</span>
                </button>
                <button
                  onClick={handleIncreaseFont}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                >
                  <span className="flex items-center gap-2"><Plus className="w-3.5 h-3.5 text-amber-300" /> Larger text</span>
                  <span className="font-mono text-[10px] text-slate-500">{Math.round(fontScale * 100)}%</span>
                </button>
                <button
                  onClick={handleDialpad}
                  className="hidden sm:flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                >
                  <Hash className="w-3.5 h-3.5 text-amber-300" />
                  Quick dialpad
                </button>
                {appMode === 'presenter' && (
                  <>
                    <button
                      onClick={openObsWindow}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                    >
                      <Radio className="w-3.5 h-3.5 text-red-400" />
                      Open OBS view
                    </button>
                    <button
                      onClick={openProjectorWindow}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                    >
                      <Monitor className="w-3.5 h-3.5 text-amber-400" />
                      Open projector view
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
