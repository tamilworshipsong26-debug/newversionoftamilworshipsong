import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Hymn, BookId } from '../types/hymn';
import { BibleVerse, BibleTranslation } from '../types/bible';
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
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WorshipAppDB>> | null = null;

export function getAppDatabase(): Promise<IDBPDatabase<WorshipAppDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WorshipAppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Hymns Store
        if (!db.objectStoreNames.contains('hymns')) {
          const hymnStore = db.createObjectStore('hymns', { keyPath: 'id' });
          hymnStore.createIndex('by-book', 'bookId');
          hymnStore.createIndex('by-number', 'number');
          hymnStore.createIndex('by-book-and-number', ['bookId', 'number']);
        }

        // Bible Store
        if (!db.objectStoreNames.contains('bible')) {
          const bibleStore = db.createObjectStore('bible', { keyPath: 'id' });
          bibleStore.createIndex('by-translation', 'translation');
          bibleStore.createIndex('by-book-chapter', ['translation', 'bookId', 'chapter']);
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
 * Get Bible verses for a chapter
 */
export async function getBibleChapterVerses(
  translation: BibleTranslation,
  bookId: string,
  chapter: number
): Promise<BibleVerse[]> {
  const db = await getAppDatabase();
  return db.getAllFromIndex('bible', 'by-book-chapter', [translation, bookId, chapter]);
}
