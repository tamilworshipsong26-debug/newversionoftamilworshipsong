export type BibleTranslation = 'TAMIL_BSI' | 'KJV' | 'NKJV';

export interface BibleBook {
  id: string; // e.g. "GEN", "PSA", "MAT", "JHN"
  number: number; // 1 to 66
  testament: 'OT' | 'NT';
  nameTamil: string; // e.g. "ஆதியாகமம்"
  nameEnglish: string; // e.g. "Genesis"
  shortTamil: string; // e.g. "ஆதி"
  shortEnglish: string; // e.g. "Gen"
  chaptersCount: number;
}

export interface BibleVerse {
  id: string; // e.g. "TAMIL_BSI-JHN-3-16"
  translation: BibleTranslation;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface ScriptureReference {
  bookId: string;
  bookNameTamil: string;
  bookNameEnglish: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}
