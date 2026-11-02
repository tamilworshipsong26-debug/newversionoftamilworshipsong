import React, { useState } from 'react';
import { BookOpen, Radio, Columns2, Search, ChevronRight } from 'lucide-react';
import { BibleBook, BibleVerse, BibleTranslation } from '../../types/bible';
import { BIBLE_BOOKS, SEED_BIBLE_VERSES } from '../../data/seedBible';
import { BroadcastRoom } from '../../types/room';

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

  // Get verses for current book & chapter
  const tamilVerses = SEED_BIBLE_VERSES.filter(
    v => v.translation === 'TAMIL_BSI' && v.bookId === selectedBook.id && v.chapter === selectedChapter
  );

  const secondaryVerses = SEED_BIBLE_VERSES.filter(
    v => v.translation === secondaryTranslation && v.bookId === selectedBook.id && v.chapter === selectedChapter
  );

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Left Bible Book & Chapter Navigator */}
      <div className="w-full lg:w-80 lg:shrink-0 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg max-h-[380px] lg:max-h-full">
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
          <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">Chapter:</div>
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
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-tamil text-white mt-1">
              {selectedBook.nameTamil} {selectedChapter} ஆம் அதிகாரம்
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {selectedBook.nameEnglish} Chapter {selectedChapter}
            </p>
          </div>

          {/* Parallel controls */}
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

        {/* Verses Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {tamilVerses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">
                Verses for {selectedBook.nameTamil} {selectedChapter} are cached in local IndexedDB. 
                (Try John 3 or Psalm 23 for seeded demo verses)
              </p>
            </div>
          ) : (
            tamilVerses.map(v => {
              const sec = secondaryVerses.find(sv => sv.verse === v.verse);
              const isLive = 
                activeRoom?.sourceType === 'bible' &&
                activeRoom?.sourceId === `${selectedBook.id}-${selectedChapter}-${v.verse}` &&
                !activeRoom?.isBlanked;

              return (
                <div
                  key={v.id}
                  onClick={() => onBroadcastVerse(v, sec, selectedBook.nameTamil, selectedBook.nameEnglish)}
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
                        {v.text}
                      </p>
                    </div>

                    {/* Secondary Translation (KJV / NKJV) */}
                    {isParallel && sec && (
                      <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
                        <div className="text-[10px] text-emerald-400 font-mono uppercase mb-1">
                          {secondaryTranslation}
                        </div>
                        <p className="font-serif-scripture text-sm sm:text-base text-slate-300 italic leading-relaxed">
                          {sec.text}
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
