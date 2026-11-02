export type BookId = 'zion' | 'thirumarai' | 'chorus' | 'tamilchorus';

export type LyricLanguage = 'tamil' | 'tanglish' | 'english';

export interface LyricLanguageMeta {
  id: LyricLanguage;
  name: string;
  shortName: string;
  badge: string;
}

export const AVAILABLE_LYRIC_LANGUAGES: LyricLanguageMeta[] = [
  { id: 'tamil', name: 'தமிழ் (Tamil)', shortName: 'தமிழ்', badge: 'TAMIL' },
  { id: 'tanglish', name: 'Tanglish (Romanized)', shortName: 'Tanglish', badge: 'TANGLISH' },
  { id: 'english', name: 'English (Lyrics / Translation)', shortName: 'English', badge: 'ENGLISH' }
];

export interface Stanza {
  id: string;
  label: string; // e.g. "Stanza 1", "Pallavi", "Anupallavi", "Charanam 1", "Chorus"
  type: 'verse' | 'chorus' | 'pallavi' | 'anupallavi' | 'charanam' | 'bridge';
  tamil: string[];
  tanglish?: string[];
  english?: string[];
}

export interface Hymn {
  id: string;
  bookId: BookId;
  bookNameTamil: string;
  bookNameEnglish: string;
  number: number;
  titleTamil: string;
  titleTanglish: string;
  titleEnglish?: string;
  category?: string;
  keySignature?: string;
  meter?: string;
  author?: string;
  stanzas: Stanza[];
  sheetMusicUrls?: string[];
  youtubeId?: string;
  scriptureRef?: string;
}

export interface HymnBookMeta {
  id: BookId;
  nameTamil: string;
  nameEnglish: string;
  shortCode: string;
  accentColor: string;
  totalSongs: number;
}
