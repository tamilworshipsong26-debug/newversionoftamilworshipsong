import React, { useState, useEffect } from 'react';
import { BookOpen, Radio, Columns2, Search, ChevronRight, Download, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { BibleBook, BibleVerse, BibleTranslation, PairedBibleChapter } from '../../types/bible';
import { BIBLE_BOOKS } from '../../data/seedBible';
import { BroadcastRoom } from '../../types/room';
import { getPairedBibleChapter, getBibleOfflineStatus, preloadAllBibleBooks } from '../../services/db';

interface BibleViewerProps {
  activeRoom: BroadcastRoom | null;
  onBroadcastVerse: (verseTamil: BibleVerse, verseSecondary?: BibleVerse, bookNameTamil?: string, bookNameEng?: string) => void;
}

export const BibleViewer: React.FC<BibleViewerProps> = ({
  activeRoom,
  onBroadcastVerse
}) => {
  const [selectedBook, setSelectedBook] = useState<BibleBook>(BIBLE_BOOKS[42]); // John (யோவான்)
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('NT');
  const [bookSearch, setBookSearch] = useState('');
  
  // Parallel translation mode
  const [isParallel, setIsParallel] = useState(true);
  const [secondaryTranslation, setSecondaryTranslation] = useState<BibleTranslation>('NKJV');

  // Chapter Verses state
  const [chapterData, setChapterData] = useState<PairedBibleChapter | null>(null);
  const [loading, setLoading] = useState(false);

  // Offline preloading state
  const [offlineStatus, setOfflineStatus] = useState<{
    cachedChapters: number;
    totalChapters: number;
    isFullyOffline: boolean;
  }>({
    cachedChapters: 0,
    totalChapters: 1189,
    isFullyOffline: false
  });
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState({ loaded: 0, total: 66, bookId: '' });

  // Filter books
  const filteredBooks = BIBLE_BOOKS.filter(b => {
    if (testamentFilter !== 'ALL' && b.testament !== testamentFilter) return false;
    if (!bookSearch.trim()) return true;
    const q = bookSearch.toLowerCase().trim();
    return (
      b.nameTamil.toLowerCase().includes(q) ||
      b.nameEnglish.toLowerCase().includes(q) ||
      b.shortEnglish.toLowerCase().includes(q)
    );
  });

  // Fetch offline status on mount
  useEffect(() => {
    getBibleOfflineStatus().then(setOfflineStatus).catch(console.error);
  }, []);

  // Fetch chapter data when book or chapter changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getPairedBibleChapter(selectedBook.id, selectedChapter).then(res => {
      if (!cancelled) {
        setChapterData(res);
        setLoading(false);
        // Refresh offline status count
        getBibleOfflineStatus().then(setOfflineStatus).catch(() => {});
      }
    }).catch(err => {
      if (!cancelled) {
        console.error('Error fetching chapter:', err);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedBook.id, selectedChapter]);

  // Handle preloading all 66 books
  const handlePreloadAll = async () => {
    if (isPreloading) return;
    setIsPreloading(true);
    try {
      await preloadAllBibleBooks((progress) => {
        setPreloadProgress(progress);
      });
      const st = await getBibleOfflineStatus();
      setOfflineStatus(st);
    } catch (e) {
      console.error('Preload failed:', e);
    } finally {
      setIsPreloading(false);
    }
  };

  const handleVerseClick = (v: { verse: number; tamil: string; kjv: string; nkjv: string }) => {
    const vTamil: BibleVerse = {
      id: `TAMIL_BSI-${selectedBook.id}-${selectedChapter}-${v.verse}`,
      translation: 'TAMIL_BSI',
      bookId: selectedBook.id,
      chapter: selectedChapter,
      verse: v.verse,
      text: v.tamil
    };

    let vSec: BibleVerse | undefined;
    if (isParallel) {
      vSec = {
        id: `${secondaryTranslation}-${selectedBook.id}-${selectedChapter}-${v.verse}`,
        translation: secondaryTranslation,
        bookId: selectedBook.id,
        chapter: selectedChapter,
        verse: v.verse,
        text: secondaryTranslation === 'KJV' ? v.kjv : v.nkjv
      };
    }

    onBroadcastVerse(vTamil, vSec, selectedBook.nameTamil, selectedBook.nameEnglish);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Left Bible Book & Chapter Navigator */}
      <div className="w-full lg:w-80 lg:shrink-0 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg max-h-[420px] lg:max-h-full">
        {/* Testament Filter */}
        <div className="flex p-1.5 bg-slate-950/80 border-b border-slate-800 gap-1 text-xs">
          <button
            onClick={() => setTestamentFilter('ALL')}
            className={`flex-1 py-1 rounded-md font-semibold transition ${
              testamentFilter === 'ALL' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All (66)
          </button>
          <button
            onClick={() => setTestamentFilter('OT')}
            className={`flex-1 py-1 rounded-md font-semibold transition ${
              testamentFilter === 'OT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            பழைய ஏற்பாடு
          </button>
          <button
            onClick={() => setTestamentFilter('NT')}
            className={`flex-1 py-1 rounded-md font-semibold transition ${
              testamentFilter === 'NT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            புதிய ஏற்பாடு
          </button>
        </div>

        {/* Book search */}
        <div className="p-2 bg-slate-900/90 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              placeholder="Filter books (e.g. யோவான் / John)..."
              className="w-full bg-slate-950 border border-slate-700/60 rounded-xl pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Books Scroll list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-1">
          {filteredBooks.map(book => {
            const isSelected = selectedBook.id === book.id;
            return (
              <button
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setSelectedChapter(1);
                }}
                className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold font-tamil">{book.nameTamil}</div>
                  <div className="text-[10px] text-slate-400">{book.nameEnglish} ({book.chaptersCount} ch)</div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Chapter quick selector */}
        <div className="p-2 bg-slate-950/80 border-t border-slate-800">
          <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">
            {selectedBook.nameTamil} • Chapter:
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map(ch => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`w-7 h-7 shrink-0 rounded-lg text-xs font-numeric font-bold transition flex items-center justify-center ${
                  selectedChapter === ch
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Scripture Verses & Parallel View */}
      <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg min-h-[480px]">
        {/* Header Controls */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                {selectedBook.shortEnglish} {selectedChapter}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedBook.testament === 'OT' ? 'Old Testament' : 'New Testament'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/20 hidden sm:inline-block">
                Tri-Version (BSI + KJV + NKJV)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-tamil text-white mt-1">
              {selectedBook.nameTamil} {selectedChapter} ஆம் அதிகாரம்
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {selectedBook.nameEnglish} Chapter {selectedChapter}
            </p>
          </div>

          {/* Parallel controls & Preload Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsParallel(!isParallel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isParallel 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Parallel Mode</span>
            </button>

            {isParallel && (
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700/60 text-xs">
                <button
                  onClick={() => setSecondaryTranslation('NKJV')}
                  className={`px-2 py-1 rounded-md transition ${
                    secondaryTranslation === 'NKJV' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  NKJV
                </button>
                <button
                  onClick={() => setSecondaryTranslation('KJV')}
                  className={`px-2 py-1 rounded-md transition ${
                    secondaryTranslation === 'KJV' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  KJV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Offline Cache Status Banner */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {offlineStatus.isFullyOffline ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All 66 Books 100% Cached in IndexedDB</span>
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>IndexedDB Cache: {offlineStatus.cachedChapters} of 1,189 chapters stored</span>
              </span>
            )}
          </div>

          {!offlineStatus.isFullyOffline && (
            <button
              onClick={handlePreloadAll}
              disabled={isPreloading}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-[11px] transition"
              title="Cache all 66 books into IndexedDB for 100% offline access"
            >
              {isPreloading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Downloading ({preloadProgress.loaded}/66)...</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>Download All 66 Books (Offline)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Verses Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-xs font-mono">Loading scripture from IndexedDB...</p>
            </div>
          ) : !chapterData || chapterData.verses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">
                No verses found for {selectedBook.nameTamil} {selectedChapter}.
              </p>
            </div>
          ) : (
            chapterData.verses.map(v => {
              const secText = secondaryTranslation === 'KJV' ? v.kjv : v.nkjv;
              const isLive = 
                activeRoom?.sourceType === 'bible' &&
                activeRoom?.sourceId === `${selectedBook.id}-${selectedChapter}-${v.verse}` &&
                !activeRoom?.isBlanked;

              return (
                <div
                  key={v.verse}
                  onClick={() => handleVerseClick(v)}
                  className={`group cursor-pointer rounded-xl p-4 transition-all border ${
                    isLive
                      ? 'bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border-red-500/80 shadow-lg shadow-red-500/10 ring-1 ring-red-500/50'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                        வசனம் {v.verse}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {selectedBook.shortEnglish} {selectedChapter}:{v.verse}
                      </span>
                    </div>

                    {isLive ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>LIVE ON OBS & SCREEN</span>
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition text-xs font-semibold text-amber-300 flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5" />
                        <span>Broadcast Verse</span>
                      </div>
                    )}
                  </div>

                  {/* Parallel Grid or Single Column */}
                  <div className={`grid gap-3 ${isParallel ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Tamil BSI */}
                    <div>
                      <div className="text-[10px] text-amber-400/80 font-mono uppercase mb-1">
                        தமிழ் BSI (திருவிவிலியம்)
                      </div>
                      <p className="font-tamil text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
                        {v.tamil}
                      </p>
                    </div>

                    {/* Secondary Translation (KJV / NKJV) */}
                    {isParallel && (
                      <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
                        <div className="text-[10px] text-emerald-400 font-mono uppercase mb-1">
                          {secondaryTranslation}
                        </div>
                        <p className="font-serif-scripture text-sm sm:text-base text-slate-300 italic leading-relaxed">
                          {secText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
