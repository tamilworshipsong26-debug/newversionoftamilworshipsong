import React, { useState } from 'react';
import { Search, Music, Radio, AlertCircle, Copy, CheckCheck } from 'lucide-react';
import { Hymn, BookId } from '../../types/hymn';
import { HYMN_BOOKS } from '../../data/seedHymns';
import { BilingualDisplayMode, BroadcastRoom } from '../../types/room';

interface HymnViewerProps {
  hymns: Hymn[];
  currentHymn: Hymn | null;
  onSelectHymn: (hymn: Hymn) => void;
  activeRoom: BroadcastRoom | null;
  onBroadcastStanza: (hymn: Hymn, stanzaIndex: number) => void;
  bilingualMode: BilingualDisplayMode;
  setBilingualMode: (mode: BilingualDisplayMode) => void;
  onOpenReportModal: (hymn: Hymn) => void;
}

export const HymnViewer: React.FC<HymnViewerProps> = ({
  hymns,
  currentHymn,
  onSelectHymn,
  activeRoom,
  onBroadcastStanza,
  bilingualMode,
  setBilingualMode,
  onOpenReportModal
}) => {
  const [selectedBook, setSelectedBook] = useState<BookId>('zion');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHymn, setCopiedHymn] = useState(false);

  // Filter hymns
  const filteredHymns = hymns.filter(h => {
    if (h.bookId !== selectedBook) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    if (h.number.toString().includes(q)) return true;
    if (h.titleTamil.toLowerCase().includes(q)) return true;
    if (h.titleTanglish.toLowerCase().includes(q)) return true;
    if (h.titleEnglish && h.titleEnglish.toLowerCase().includes(q)) return true;
    return h.stanzas.some(s => 
      s.tamil.some(l => l.toLowerCase().includes(q)) ||
      (s.tanglish && s.tanglish.some(l => l.toLowerCase().includes(q)))
    );
  });

  const handleCopyLyrics = (hymn: Hymn) => {
    const text = hymn.stanzas.map(s => {
      const t = s.tamil.join('\n');
      return `[${s.label}]\n${t}`;
    }).join('\n\n');
    navigator.clipboard.writeText(`${hymn.bookNameEnglish} #${hymn.number} - ${hymn.titleTamil}\n\n${text}`);
    setCopiedHymn(true);
    setTimeout(() => setCopiedHymn(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Left List of Songs */}
      <div className="w-full lg:w-80 lg:shrink-0 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg max-h-[400px] lg:max-h-full">
        {/* Book Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-2 bg-slate-950/80 border-b border-slate-800">
          {HYMN_BOOKS.map(book => (
            <button
              key={book.id}
              onClick={() => setSelectedBook(book.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition ${
                selectedBook === book.id
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="truncate font-tamil text-[11px] leading-tight">{book.nameTamil}</div>
              <div className="text-[10px] text-slate-500 truncate">{book.nameEnglish}</div>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="p-2.5 bg-slate-900/90 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search # or Tamil / Tanglish words..."
              className="w-full bg-slate-950 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-1">
          {filteredHymns.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No hymns found matching "{searchQuery}"
            </div>
          ) : (
            filteredHymns.map(hymn => {
              const isSelected = currentHymn?.id === hymn.id;
              const isLive = activeRoom?.sourceId === hymn.id && !activeRoom?.isBlanked;
              return (
                <button
                  key={hymn.id}
                  onClick={() => onSelectHymn(hymn)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-slate-800 font-mono font-bold text-xs text-amber-300 flex items-center justify-center border border-slate-700/60">
                      {hymn.number}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold font-tamil truncate text-slate-100">{hymn.titleTamil}</div>
                      <div className="text-[11px] text-slate-400 truncate">{hymn.titleTanglish}</div>
                    </div>
                  </div>
                  {isLive && (
                    <span className="shrink-0 text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                      <Radio className="w-2.5 h-2.5" />
                      LIVE
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Stanza Viewer & Broadcast Deck */}
      <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg min-h-[480px]">
        {currentHymn ? (
          <>
            {/* Header with Title and Bilingual Controls */}
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                    #{currentHymn.number}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentHymn.bookNameEnglish}
                  </span>
                  {currentHymn.keySignature && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      Key: {currentHymn.keySignature}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-tamil text-white mt-1">
                  {currentHymn.titleTamil}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {currentHymn.titleTanglish}
                </p>
              </div>

              {/* View options & Actions */}
              <div className="flex items-center gap-2">
                {/* Bilingual selector */}
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700/60 text-xs">
                  <button
                    onClick={() => setBilingualMode('tamil-only')}
                    className={`px-2 py-1 rounded-md transition ${
                      bilingualMode === 'tamil-only' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    தமிழ்
                  </button>
                  <button
                    onClick={() => setBilingualMode('tamil-tanglish')}
                    className={`px-2 py-1 rounded-md transition ${
                      bilingualMode === 'tamil-tanglish' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    +Tanglish
                  </button>
                  <button
                    onClick={() => setBilingualMode('tamil-english')}
                    className={`px-2 py-1 rounded-md transition ${
                      bilingualMode === 'tamil-english' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    +English
                  </button>
                </div>

                {/* Copy lyrics */}
                <button
                  onClick={() => handleCopyLyrics(currentHymn)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Copy lyrics"
                >
                  {copiedHymn ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Report typo */}
                <button
                  onClick={() => onOpenReportModal(currentHymn)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                  title="Report a typo or chord fix"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stanzas Grid / Cards */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {currentHymn.stanzas.map((stanza, idx) => {
                const isCurrentLive = 
                  activeRoom?.sourceId === currentHymn.id && 
                  activeRoom?.currentIndex === idx &&
                  !activeRoom?.isBlanked;

                return (
                  <div
                    key={stanza.id}
                    onClick={() => onBroadcastStanza(currentHymn, idx)}
                    className={`group cursor-pointer rounded-xl p-4 transition-all relative border ${
                      isCurrentLive
                        ? 'bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border-red-500/80 shadow-lg shadow-red-500/10 ring-1 ring-red-500/50'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 font-mono tracking-wide uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                          {stanza.label}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Tap to broadcast
                        </span>
                      </div>
                      {isCurrentLive ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          <span>LIVE ON OBS & SCREEN</span>
                        </div>
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition text-xs font-semibold text-amber-300 flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5" />
                          <span>Project</span>
                        </div>
                      )}
                    </div>

                    {/* Stanza Tamil Lines */}
                    <div className="font-tamil text-base sm:text-lg text-slate-100 font-medium leading-relaxed space-y-1">
                      {stanza.tamil.map((line, lIdx) => (
                        <div key={lIdx}>{line}</div>
                      ))}
                    </div>

                    {/* Tanglish subtitle if enabled */}
                    {bilingualMode === 'tamil-tanglish' && stanza.tanglish && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400 space-y-0.5 font-sans">
                        {stanza.tanglish.map((line, lIdx) => (
                          <div key={lIdx}>{line}</div>
                        ))}
                      </div>
                    )}

                    {/* English subtitle if enabled */}
                    {bilingualMode === 'tamil-english' && stanza.english && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-emerald-400/90 italic space-y-0.5 font-serif-scripture">
                        {stanza.english.map((line, lIdx) => (
                          <div key={lIdx}>{line}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
            <div>
              <Music className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-sm">Select a song from the list or use Quick Dial (#)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
