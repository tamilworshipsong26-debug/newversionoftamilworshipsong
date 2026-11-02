export type BookId = 'zion' | 'thirumarai' | 'chorus' | 'tamilchorus';

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
