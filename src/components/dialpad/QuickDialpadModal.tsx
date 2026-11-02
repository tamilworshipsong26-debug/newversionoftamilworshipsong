import React, { useState } from 'react';
import { X, Music, BookOpen, Send, Eye, Delete } from 'lucide-react';
import { Hymn, BookId } from '../../types/hymn';
import { BIBLE_BOOKS } from '../../data/seedBible';
import { HYMN_BOOKS } from '../../data/seedHymns';

interface QuickDialpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  hymns: Hymn[];
  onSelectHymn: (hymn: Hymn, projectImmediately?: boolean) => void;
  onSelectScripture: (bookId: string, chapter: number, verse: number, projectImmediately?: boolean) => void;
}

export const QuickDialpadModal: React.FC<QuickDialpadModalProps> = ({
  isOpen,
  onClose,
  hymns,
  onSelectHymn
}) => {
  const [mode, setMode] = useState<'hymn' | 'bible'>('hymn');
  const [digits, setDigits] = useState<string>('');
  const [selectedBookId, setSelectedBookId] = useState<BookId>('zion');
  
  // Default John
  const chosenBook = BIBLE_BOOKS[42];
  const chapterNum = 3;

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    if (digits.length < 4) {
      setDigits(prev => prev + d);
    }
  };

  const handleBackspace = () => {
    setDigits(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDigits('');
  };

  const currentNumber = parseInt(digits, 10);
  const exactHymn = hymns.find(h => h.bookId === selectedBookId && h.number === currentNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-slide-up">
      <div className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode('hymn'); setDigits(''); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'hymn' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Song Dial</span>
            </button>
            <button
              onClick={() => { setMode('bible'); setDigits(''); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'bible' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bible Fast Jump</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Readout */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 font-mono tracking-wider uppercase">
              {mode === 'hymn' ? 'Entered Song Number' : `Scripture: ${chosenBook.nameTamil} ${chapterNum ? `:${digits || 'Verse'}` : ''}`}
            </div>
            <div className="text-4xl font-extrabold text-amber-300 font-numeric tracking-wider mt-1 h-10 flex items-center">
              {digits || <span className="text-slate-600 font-light text-2xl font-sans">Type number...</span>}
            </div>
          </div>
          {exactHymn && mode === 'hymn' && (
            <div className="text-right max-w-[200px]">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Found</span>
              <p className="text-xs text-white font-tamil truncate font-medium mt-1">{exactHymn.titleTamil}</p>
              <p className="text-[11px] text-slate-400 truncate">{exactHymn.titleTanglish}</p>
            </div>
          )}
        </div>

        {/* Book Selector Pills (Hymn Mode) */}
        {mode === 'hymn' && (
          <div className="flex gap-1.5 px-4 py-2 bg-slate-900/80 border-b border-slate-800 overflow-x-auto">
            {HYMN_BOOKS.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBookId(b.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedBookId === b.id 
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b.nameEnglish}
              </button>
            ))}
          </div>
        )}

        {/* Tactile Keypad (inputMode="none" ensures OS keyboard never steals screen) */}
        <div className="p-4 bg-slate-900/90 grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-14 sm:h-16 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-600 active:text-slate-950 text-2xl font-bold font-numeric text-white shadow-md border border-slate-700/50 flex items-center justify-center transition active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 sm:h-16 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider text-slate-400 border border-slate-700/50 flex items-center justify-center transition active:scale-95"
          >
            Clear
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 sm:h-16 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-600 active:text-slate-950 text-2xl font-bold font-numeric text-white shadow-md border border-slate-700/50 flex items-center justify-center transition active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 sm:h-16 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700/50 flex items-center justify-center transition active:scale-95"
            title="Backspace"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Fast Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
          <button
            disabled={!exactHymn && mode === 'hymn'}
            onClick={() => {
              if (exactHymn) {
                onSelectHymn(exactHymn, false);
                onClose();
              }
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-98"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>Open & Read</span>
          </button>

          <button
            disabled={!exactHymn && mode === 'hymn'}
            onClick={() => {
              if (exactHymn) {
                onSelectHymn(exactHymn, true);
                onClose();
              }
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>Live to OBS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
