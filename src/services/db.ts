import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Hymn, BookId } from '../types/hymn';
import { BibleVerse, BibleTranslation, PairedBibleChapter, BibleBookData } from '../types/bible';
import { ServiceSetlist, MistakeReport } from '../types/setlist';

interface WorshipAppDB extends DBSchema {
  hymns: {
    key: string;
    value: Hymn;
    indexes: {
      'by-book': BookId;
      'by-number': number;
      'by-book-and-number': [BookId, number];
    };
  };
  bible: {
    key: string; // e.g. TAMIL_BSI-JHN-3-16
    value: BibleVerse;
    indexes: {
      'by-translation': BibleTranslation;
      'by-book-chapter': [BibleTranslation, string, number];
    };
  };
  bibleChapters: {
    key: string; // e.g. "JHN-3"
    value: PairedBibleChapter;
    indexes: {
      'by-book': string;
    };
  };
  setlists: {
    key: string;
    value: ServiceSetlist;
  };
  pendingReports: {
    key: number;
    value: Omit<MistakeReport, 'id'> & { timestamp: number };
  };
}

const DB_NAME = 'hymns-bible-cache-db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<WorshipAppDB>> | null = null;

export function getAppDatabase(): Promise<IDBPDatabase<WorshipAppDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WorshipAppDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Hymns Store
        if (!db.objectStoreNames.contains('hymns')) {
          const hymnStore = db.createObjectStore('hymns', { keyPath: 'id' });
          hymnStore.createIndex('by-book', 'bookId');
          hymnStore.createIndex('by-number', 'number');
          hymnStore.createIndex('by-book-and-number', ['bookId', 'number']);
        }

        // Bible Individual Verses Store
        if (!db.objectStoreNames.contains('bible')) {
          const bibleStore = db.createObjectStore('bible', { keyPath: 'id' });
          bibleStore.createIndex('by-translation', 'translation');
          bibleStore.createIndex('by-book-chapter', ['translation', 'bookId', 'chapter']);
        }

        // Bible Paired Chapters Store (Tamil BSI + KJV + NKJV tri-version in 1 lookup)
        if (!db.objectStoreNames.contains('bibleChapters')) {
          const chapterStore = db.createObjectStore('bibleChapters', { keyPath: 'id' });
          chapterStore.createIndex('by-book', 'bookId');
        }

        // Setlists Store
        if (!db.objectStoreNames.contains('setlists')) {
          db.createObjectStore('setlists', { keyPath: 'id' });
        }

        // Pending Reports
        if (!db.objectStoreNames.contains('pendingReports')) {
          db.createObjectStore('pendingReports', { keyPath: 'timestamp', autoIncrement: true });
        }
      }
    });
  }
  return dbPromise;
}

/**
 * Seed initial hymns into IndexedDB if empty
 */
export async function seedHymnsIfEmpty(seedList: Hymn[]): Promise<void> {
  const db = await getAppDatabase();
  const count = await db.count('hymns');
  if (count === 0 && seedList.length > 0) {
    const tx = db.transaction('hymns', 'readwrite');
    for (const hymn of seedList) {
      await tx.store.put(hymn);
    }
    await tx.done;
  }
}

/**
 * Seed initial Bible scriptures into IndexedDB if empty
 */
export async function seedBibleIfEmpty(seedVerses: BibleVerse[]): Promise<void> {
  const db = await getAppDatabase();
  const count = await db.count('bible');
  if (count === 0 && seedVerses.length > 0) {
    const tx = db.transaction('bible', 'readwrite');
    for (const verse of seedVerses) {
      await tx.store.put(verse);
    }
    await tx.done;
  }
}

/**
 * Ingest an entire Bible book (all chapters with Tamil, KJV, NKJV) into IndexedDB
 */
export async function ingestBibleBook(bookData: BibleBookData): Promise<void> {
  const db = await getAppDatabase();
  const tx = db.transaction('bibleChapters', 'readwrite');
  
  for (let chIdx = 0; chIdx < bookData.chapters.length; chIdx++) {
    const chapterNum = chIdx + 1;
    const pairedChapter: PairedBibleChapter = {
      id: `${bookData.bookId}-${chapterNum}`,
      bookId: bookData.bookId,
      chapter: chapterNum,
      verses: bookData.chapters[chIdx]
    };
    await tx.store.put(pairedChapter);
  }
  
  await tx.done;
}

/**
 * Load paired Bible chapter (Tamil BSI, KJV, NKJV) from IndexedDB or fetch from edge cache
 */
export async function getPairedBibleChapter(
  bookId: string, 
  chapter: number
): Promise<PairedBibleChapter | null> {
  const db = await getAppDatabase();
  const chapterId = `${bookId.toUpperCase()}-${chapter}`;
  
  // 1. Check local IndexedDB (0ms)
  const cached = await db.get('bibleChapters', chapterId);
  if (cached) {
    return cached;
  }

  // 2. Fetch from static edge pack (/bible/books/{bookId}.json)
  try {
    const resp = await fetch(`/bible/books/${bookId.toUpperCase()}.json`);
    if (!resp.ok) {
      console.warn(`Could not load /bible/books/${bookId}.json, status:`, resp.status);
      return null;
    }
    const bookData: BibleBookData = await resp.json();
    
    // Ingest all chapters of this book so future chapters are 100% offline
    await ingestBibleBook(bookData);

    // Return the requested chapter
    const targetVerses = bookData.chapters[chapter - 1];
    if (targetVerses) {
      return {
        id: chapterId,
        bookId: bookData.bookId,
        chapter: chapter,
        verses: targetVerses
      };
    }
  } catch (err) {
    console.error(`Error loading Bible book ${bookId}:`, err);
  }

  return null;
}

/**
 * Check how many chapters are already cached in IndexedDB
 */
export async function getBibleOfflineStatus(): Promise<{ 
  cachedChapters: number; 
  totalChapters: number; 
  isFullyOffline: boolean 
}> {
  const db = await getAppDatabase();
  const cachedChapters = await db.count('bibleChapters');
  const totalChapters = 1189;
  return {
    cachedChapters,
    totalChapters,
    isFullyOffline: cachedChapters >= totalChapters
  };
}

const ALL_BOOK_IDS = [
  'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL',
  'MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'
];

/**
 * Preload and ingest all 66 books into IndexedDB for 100% offline usage everywhere
 */
export async function preloadAllBibleBooks(
  onProgress?: (progress: { loaded: number; total: number; bookId: string }) => void
): Promise<void> {
  const total = ALL_BOOK_IDS.length;
  for (let i = 0; i < total; i++) {
    const bookId = ALL_BOOK_IDS[i];
    try {
      const resp = await fetch(`/bible/books/${bookId}.json`);
      if (resp.ok) {
        const bookData: BibleBookData = await resp.json();
        await ingestBibleBook(bookData);
      }
    } catch (e) {
      console.warn(`Failed to preload book ${bookId}:`, e);
    }
    if (onProgress) {
      onProgress({ loaded: i + 1, total, bookId });
    }
  }
}

/**
 * Get all hymns for a specific hymnal book
 */
export async function getHymnsByBook(bookId: BookId): Promise<Hymn[]> {
  const db = await getAppDatabase();
  return db.getAllFromIndex('hymns', 'by-book', bookId);
}

/**
 * Search hymns by number, Tamil lyrics, Tanglish, or title
 */
export async function searchHymns(query: string, bookId?: BookId): Promise<Hymn[]> {
  const db = await getAppDatabase();
  let list: Hymn[];
  if (bookId) {
    list = await db.getAllFromIndex('hymns', 'by-book', bookId);
  } else {
    list = await db.getAll('hymns');
  }

  const q = query.trim().toLowerCase();
  if (!q) return list;

  // Number search
  const num = parseInt(q, 10);
  if (!isNaN(num) && String(num) === q) {
    return list.filter(h => h.number === num);
  }

  // Text search across title and stanzas
  return list.filter(h => {
    if (h.number.toString().includes(q)) return true;
    if (h.titleTamil.toLowerCase().includes(q)) return true;
    if (h.titleTanglish.toLowerCase().includes(q)) return true;
    if (h.titleEnglish && h.titleEnglish.toLowerCase().includes(q)) return true;

    // Search stanza content
    return h.stanzas.some(s => 
      s.tamil.some(line => line.toLowerCase().includes(q)) ||
      (s.tanglish && s.tanglish.some(line => line.toLowerCase().includes(q))) ||
      (s.english && s.english.some(line => line.toLowerCase().includes(q)))
    );
  });
}

/**
 * Get Bible verses for a chapter (backward compatibility)
 */
export async function getBibleChapterVerses(
  translation: BibleTranslation,
  bookId: string,
  chapter: number
): Promise<BibleVerse[]> {
  const paired = await getPairedBibleChapter(bookId, chapter);
  if (paired) {
    return paired.verses.map(v => {
      let text = v.tamil;
      if (translation === 'KJV') text = v.kjv;
      else if (translation === 'NKJV') text = v.nkjv;

      return {
        id: `${translation}-${bookId}-${chapter}-${v.verse}`,
        translation,
        bookId,
        chapter,
        verse: v.verse,
        text
      };
    });
  }

  // Fallback to legacy single verse index
  const db = await getAppDatabase();
  return db.getAllFromIndex('bible', 'by-book-chapter', [translation, bookId, chapter]);
}
