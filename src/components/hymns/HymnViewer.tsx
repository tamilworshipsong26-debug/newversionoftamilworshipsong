import React, { useState } from 'react';
import { 
  Search, 
  Music, 
  Radio, 
  AlertCircle, 
  Copy, 
  CheckCheck, 
  ArrowLeftRight,
  Columns2
} from 'lucide-react';
import { 
  Hymn, 
  BookId, 
  LyricLanguage, 
  AVAILABLE_LYRIC_LANGUAGES 
} from '../../types/hymn';
import { HYMN_BOOKS } from '../../data/seedHymns';
import { BroadcastRoom } from '../../types/room';

interface HymnViewerProps {
  hymns: Hymn[];
  currentHymn: Hymn | null;
  onSelectHymn: (hymn: Hymn) => void;
  activeRoom: BroadcastRoom | null;
  onBroadcastStanza: (
    hymn: Hymn, 
    stanzaIndex: number, 
    primaryLang: LyricLanguage, 
    secondaryLang: LyricLanguage | 'none'
  ) => void;
  primaryLang: LyricLanguage;
  setPrimaryLang: (lang: LyricLanguage) => void;
  secondaryLang: LyricLanguage | 'none';
  setSecondaryLang: (lang: LyricLanguage | 'none') => void;
  onOpenReportModal: (hymn: Hymn) => void;
}

export const HymnViewer: React.FC<HymnViewerProps> = ({
  hymns,
  currentHymn,
  onSelectHymn,
  activeRoom,
  onBroadcastStanza,
  primaryLang,
  setPrimaryLang,
  secondaryLang,
  setSecondaryLang,
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
      (s.tanglish && s.tanglish.some(l => l.toLowerCase().includes(q))) ||
      (s.english && s.english.some(l => l.toLowerCase().includes(q)))
    );
  });

  const handleSwapLanguages = () => {
    if (secondaryLang === 'none') {
      const alt = primaryLang === 'tamil' ? 'tanglish' : 'tamil';
      setSecondaryLang(primaryLang);
      setPrimaryLang(alt);
    } else {
      const oldPrimary = primaryLang;
      setPrimaryLang(secondaryLang);
      setSecondaryLang(oldPrimary);
    }
  };

  const getLyricsForLang = (stanza: Hymn['stanzas'][0], lang: LyricLanguage): string[] => {
    if (lang === 'tamil') return stanza.tamil;
    if (lang === 'tanglish') {
      return stanza.tanglish && stanza.tanglish.length ? stanza.tanglish : stanza.tamil;
    }
    if (lang === 'english') {
      return stanza.english && stanza.english.length ? stanza.english : stanza.tamil;
    }
    return stanza.tamil;
  };

  const handleCopyLyrics = (hymn: Hymn) => {
    const text = hymn.stanzas.map(s => {
      const primaryLines = getLyricsForLang(s, primaryLang).join('\n');
      const secLines = secondaryLang !== 'none' ? `\n[Parallel]\n` + getLyricsForLang(s, secondaryLang).join('\n') : '';
      return `[${s.label}]\n${primaryLines}${secLines}`;
    }).join('\n\n');

    const title = primaryLang === 'tamil' ? hymn.titleTamil : (hymn.titleTanglish || hymn.titleTamil);
    navigator.clipboard.writeText(`${hymn.bookNameEnglish} #${hymn.number} - ${title}\n\n${text}`);
    setCopiedHymn(true);
    setTimeout(() => setCopiedHymn(false), 2000);
  };

  const isPrimaryTamil = primaryLang === 'tamil';

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Left List of Songs */}
      <div className="w-full lg:w-80 lg:shrink-0 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg max-h-[420px] lg:max-h-full">
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
              <div className="truncate text-[11px] leading-tight font-tamil">
                {book.nameTamil}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {book.nameEnglish}
              </div>
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
              placeholder="Search # or Lyrics / Tanglish..."
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

              const displayPrimaryTitle = primaryLang === 'tamil' ? hymn.titleTamil : hymn.titleTanglish;
              const displaySubTitle = primaryLang === 'tamil' ? hymn.titleTanglish : hymn.titleTamil;

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
                      <div className={`text-xs font-semibold truncate text-slate-100 ${isPrimaryTamil ? 'font-tamil' : ''}`}>
                        {displayPrimaryTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {displaySubTitle}
                      </div>
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
            {/* Header with Title and Independent Language Controls */}
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
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {isPrimaryTamil ? (
                    <span className="font-tamil">{currentHymn.titleTamil}</span>
                  ) : (
                    <span>{currentHymn.titleTanglish || currentHymn.titleEnglish}</span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isPrimaryTamil ? currentHymn.titleTanglish : <span className="font-tamil">{currentHymn.titleTamil}</span>}
                </p>
              </div>

              {/* User-Configurable Language Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Primary Lyrics Selector */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Primary:</span>
                  <div className="flex gap-1">
                    {AVAILABLE_LYRIC_LANGUAGES.map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setPrimaryLang(lang.id);
                          if (secondaryLang === lang.id) {
                            const alt = AVAILABLE_LYRIC_LANGUAGES.find(x => x.id !== lang.id);
                            setSecondaryLang(alt ? alt.id : 'none');
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                          primaryLang === lang.id
                            ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang.shortName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Swap Button */}
                {secondaryLang !== 'none' && (
                  <button
                    onClick={handleSwapLanguages}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 transition"
                    title="Swap Primary & Parallel Lyrics"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Parallel / Secondary Selector */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Parallel:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSecondaryLang('none')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                        secondaryLang === 'none'
                          ? 'bg-slate-700 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Off
                    </button>
                    {AVAILABLE_LYRIC_LANGUAGES.filter(l => l.id !== primaryLang).map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => setSecondaryLang(lang.id)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                          secondaryLang === lang.id
                            ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang.shortName}
                      </button>
                    ))}
                  </div>
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
                const primaryLines = getLyricsForLang(stanza, primaryLang);
                const secondaryLines = secondaryLang !== 'none' ? getLyricsForLang(stanza, secondaryLang) : [];

                const isCurrentLive = 
                  activeRoom?.sourceId === currentHymn.id && 
                  activeRoom?.currentIndex === idx &&
                  !activeRoom?.isBlanked;

                const isPrimaryTa = primaryLang === 'tamil';
                const isSecTa = secondaryLang === 'tamil';

                return (
                  <div
                    key={stanza.id}
                    onClick={() => onBroadcastStanza(currentHymn, idx, primaryLang, secondaryLang)}
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

                    {/* Stanza Content: Single Column or Parallel Grid */}
                    <div className={`grid gap-3 ${secondaryLang !== 'none' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                      {/* Primary Lyric Block */}
                      <div>
                        {secondaryLang !== 'none' && (
                          <div className="text-[10px] text-amber-400 font-mono uppercase font-bold mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>{AVAILABLE_LYRIC_LANGUAGES.find(l => l.id === primaryLang)?.name}</span>
                          </div>
                        )}
                        <div className={`text-base sm:text-lg text-slate-100 font-medium leading-relaxed space-y-1 ${
                          isPrimaryTa ? 'font-tamil' : 'font-sans'
                        }`}>
                          {primaryLines.map((line, lIdx) => (
                            <div key={lIdx}>{line}</div>
                          ))}
                        </div>
                      </div>

                      {/* Secondary / Parallel Lyric Block */}
                      {secondaryLang !== 'none' && (
                        <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
                          <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{AVAILABLE_LYRIC_LANGUAGES.find(l => l.id === secondaryLang)?.name}</span>
                          </div>
                          <div className={`text-sm sm:text-base text-slate-300 leading-relaxed space-y-0.5 ${
                            isSecTa ? 'font-tamil' : 'font-sans italic'
                          }`}>
                            {secondaryLines.map((line, lIdx) => (
                              <div key={lIdx}>{line}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
