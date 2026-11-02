export type BibleTranslation = 'TAMIL_BSI' | 'KJV' | 'NKJV';

export interface TranslationMeta {
  id: BibleTranslation;
  name: string;
  shortName: string;
  language: 'ta' | 'en';
}

export const AVAILABLE_TRANSLATIONS: TranslationMeta[] = [
  { id: 'TAMIL_BSI', name: 'தமிழ் BSI (திருவிவிலியம்)', shortName: 'தமிழ் BSI', language: 'ta' },
  { id: 'NKJV', name: 'New King James Version (NKJV)', shortName: 'NKJV', language: 'en' },
  { id: 'KJV', name: 'King James Version (KJV)', shortName: 'KJV', language: 'en' }
];

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
  id: string; // e.g. "TAMIL_BSI-JHN-3-16" or "NKJV-JHN-3-16"
  translation: BibleTranslation;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface PairedVerse {
  verse: number;
  tamil: string;
  kjv: string;
  nkjv: string;
}

export interface PairedBibleChapter {
  id: string; // e.g. "JHN-3"
  bookId: string;
  chapter: number;
  verses: PairedVerse[];
}

export interface BibleBookData {
  bookId: string;
  number: number;
  testament: 'OT' | 'NT';
  nameEnglish: string;
  chaptersCount: number;
  chapters: PairedVerse[][];
}

export interface ScriptureReference {
  bookId: string;
  bookNameTamil: string;
  bookNameEnglish: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}
