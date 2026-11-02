import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Radio, 
  Columns2, 
  Search, 
  ChevronRight, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';
import { 
  BibleBook, 
  BibleVerse, 
  BibleTranslation, 
  PairedBibleChapter,
  AVAILABLE_TRANSLATIONS 
} from '../../types/bible';
import { BIBLE_BOOKS } from '../../data/seedBible';
import { BroadcastRoom } from '../../types/room';
import { getPairedBibleChapter, getBibleOfflineStatus, preloadAllBibleBooks } from '../../services/db';

interface BibleViewerProps {
  activeRoom: BroadcastRoom | null;
  onBroadcastVerse: (
    versePrimary: BibleVerse, 
    verseSecondary?: BibleVerse, 
    bookNamePrimary?: string, 
    bookNameSecondary?: string
  ) => void;
}

export const BibleViewer: React.FC<BibleViewerProps> = ({
  activeRoom,
  onBroadcastVerse
}) => {
  const [selectedBook, setSelectedBook] = useState<BibleBook>(BIBLE_BOOKS[42]); // Default John
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('NT');
  const [bookSearch, setBookSearch] = useState('');
  
  // User-configurable Translations (Separate and independent)
  const [primaryTranslation, setPrimaryTranslation] = useState<BibleTranslation>('TAMIL_BSI');
  const [secondaryTranslation, setSecondaryTranslation] = useState<BibleTranslation | 'NONE'>('NKJV');

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

  // Handle preloading all 66 books into IndexedDB
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

  // Swap primary and secondary translations
  const handleSwapTranslations = () => {
    if (secondaryTranslation === 'NONE') {
      // If parallel was off, pick another as secondary
      const nextSecondary = primaryTranslation === 'TAMIL_BSI' ? 'NKJV' : 'TAMIL_BSI';
      setSecondaryTranslation(primaryTranslation);
      setPrimaryTranslation(nextSecondary);
    } else {
      const oldPrimary = primaryTranslation;
      setPrimaryTranslation(secondaryTranslation);
      setSecondaryTranslation(oldPrimary);
    }
  };

  // Helper to extract text by translation
  const getVerseText = (v: { verse: number; tamil: string; kjv: string; nkjv: string }, trans: BibleTranslation): string => {
    switch (trans) {
      case 'TAMIL_BSI': return v.tamil;
      case 'KJV': return v.kjv;
      case 'NKJV': return v.nkjv;
    }
  };

  const getTranslationName = (trans: BibleTranslation): string => {
    const meta = AVAILABLE_TRANSLATIONS.find(t => t.id === trans);
    return meta ? meta.shortName : trans;
  };

  const handleVerseClick = (v: { verse: number; tamil: string; kjv: string; nkjv: string }) => {
    const primaryText = getVerseText(v, primaryTranslation);
    const isPrimaryTamil = primaryTranslation === 'TAMIL_BSI';

    const vPrimary: BibleVerse = {
      id: `${primaryTranslation}-${selectedBook.id}-${selectedChapter}-${v.verse}`,
      translation: primaryTranslation,
      bookId: selectedBook.id,
      chapter: selectedChapter,
      verse: v.verse,
      text: primaryText
    };

    let vSec: BibleVerse | undefined;
    let bookSecName: string | undefined;

    if (secondaryTranslation !== 'NONE') {
      const secondaryText = getVerseText(v, secondaryTranslation);
      vSec = {
        id: `${secondaryTranslation}-${selectedBook.id}-${selectedChapter}-${v.verse}`,
        translation: secondaryTranslation,
        bookId: selectedBook.id,
        chapter: selectedChapter,
        verse: v.verse,
        text: secondaryText
      };
      bookSecName = secondaryTranslation === 'TAMIL_BSI' ? selectedBook.nameTamil : selectedBook.nameEnglish;
    }

    const bookPrimaryName = isPrimaryTamil ? selectedBook.nameTamil : selectedBook.nameEnglish;

    onBroadcastVerse(vPrimary, vSec, bookPrimaryName, bookSecName);
  };

  const isPrimaryTamil = primaryTranslation === 'TAMIL_BSI';

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
            {isPrimaryTamil ? 'பழைய ஏற்பாடு' : 'Old Test.'}
          </button>
          <button
            onClick={() => setTestamentFilter('NT')}
            className={`flex-1 py-1 rounded-md font-semibold transition ${
              testamentFilter === 'NT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isPrimaryTamil ? 'புதிய ஏற்பாடு' : 'New Test.'}
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
              placeholder="Search books (e.g. John / யோவான்)..."
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
                  <div className="text-xs font-semibold">
                    {isPrimaryTamil ? (
                      <span className="font-tamil">{book.nameTamil}</span>
                    ) : (
                      <span>{book.nameEnglish}</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isPrimaryTamil ? book.nameEnglish : book.nameTamil} ({book.chaptersCount} ch)
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Chapter quick selector */}
        <div className="p-2 bg-slate-950/80 border-t border-slate-800">
          <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">
            {isPrimaryTamil ? selectedBook.nameTamil : selectedBook.nameEnglish} • Chapter:
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
        {/* Top Header Controls */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                {selectedBook.shortEnglish} {selectedChapter}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedBook.testament === 'OT' ? 'Old Testament' : 'New Testament'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {isPrimaryTamil ? (
                <span className="font-tamil">{selectedBook.nameTamil} {selectedChapter} ஆம் அதிகாரம்</span>
              ) : (
                <span>{selectedBook.nameEnglish} Chapter {selectedChapter}</span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isPrimaryTamil ? (
                `${selectedBook.nameEnglish} Chapter ${selectedChapter}`
              ) : (
                <span className="font-tamil">{selectedBook.nameTamil} {selectedChapter} ஆம் அதிகாரம்</span>
              )}
            </p>
          </div>

          {/* User-Configured Translation Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Translation Picker */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Primary:</span>
              <div className="flex gap-1">
                {AVAILABLE_TRANSLATIONS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setPrimaryTranslation(t.id);
                      if (secondaryTranslation === t.id) {
                        // Change secondary if it collides with new primary
                        const alt = AVAILABLE_TRANSLATIONS.find(x => x.id !== t.id);
                        setSecondaryTranslation(alt ? alt.id : 'NONE');
                      }
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                      primaryTranslation === t.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Button */}
            {secondaryTranslation !== 'NONE' && (
              <button
                onClick={handleSwapTranslations}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 transition"
                title="Swap Primary & Parallel Translations"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Parallel / Compare Picker */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Parallel:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSecondaryTranslation('NONE')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                    secondaryTranslation === 'NONE'
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Off
                </button>
                {AVAILABLE_TRANSLATIONS.filter(t => t.id !== primaryTranslation).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSecondaryTranslation(t.id)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                      secondaryTranslation === t.id
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.shortName}
                  </button>
                ))}
              </div>
            </div>
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
                No verses found for {isPrimaryTamil ? selectedBook.nameTamil : selectedBook.nameEnglish} {selectedChapter}.
              </p>
            </div>
          ) : (
            chapterData.verses.map(v => {
              const primaryText = getVerseText(v, primaryTranslation);
              const secondaryText = secondaryTranslation !== 'NONE' ? getVerseText(v, secondaryTranslation) : '';

              const isLive = 
                activeRoom?.sourceType === 'bible' &&
                activeRoom?.sourceId === `${selectedBook.id}-${selectedChapter}-${v.verse}` &&
                !activeRoom?.isBlanked;

              const isPrimaryTa = primaryTranslation === 'TAMIL_BSI';
              const isSecTa = secondaryTranslation === 'TAMIL_BSI';

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
                        {isPrimaryTa ? `வசனம் ${v.verse}` : `Verse ${v.verse}`}
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
                  <div className={`grid gap-3 ${secondaryTranslation !== 'NONE' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Primary Translation Box */}
                    <div>
                      <div className="text-[10px] text-amber-400 font-mono uppercase font-bold mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>{getTranslationName(primaryTranslation)}</span>
                      </div>
                      <p className={`text-base sm:text-lg text-slate-100 font-medium leading-relaxed ${
                        isPrimaryTa ? 'font-tamil' : 'font-serif-scripture'
                      }`}>
                        {primaryText}
                      </p>
                    </div>

                    {/* Secondary Translation Box (if enabled) */}
                    {secondaryTranslation !== 'NONE' && (
                      <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
                        <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{getTranslationName(secondaryTranslation)}</span>
                        </div>
                        <p className={`text-sm sm:text-base text-slate-300 italic leading-relaxed ${
                          isSecTa ? 'font-tamil not-italic' : 'font-serif-scripture'
                        }`}>
                          {secondaryText}
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
