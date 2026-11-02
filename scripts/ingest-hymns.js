/**
 * Ingestion script for real Tamil Worship Songs & Sheet Music
 * Converts tamilworshipsong-1153c-default-rtdb-export (1).json into canonical Hymn objects
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../tamilworshipsong-1153c-default-rtdb-export (1).json');
if (!fs.existsSync(inputPath)) {
  console.error('Input file not found at:', inputPath);
  process.exit(1);
}

console.log('Reading RTDB export...');
const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const categories = rawData.categories || {};
const bookMeta = {
  zion: { 
    id: 'zion',
    nameTamil: 'சீயோன் கீதங்கள்', 
    nameEnglish: 'Songs of Zion',
    shortCode: 'ZION',
    accentColor: 'from-amber-600 to-amber-700'
  },
  thirumarai: { 
    id: 'thirumarai',
    nameTamil: 'திருமறை திருப்பாடல்', 
    nameEnglish: 'Thirumarai Thirupadal',
    shortCode: 'TT',
    accentColor: 'from-blue-600 to-indigo-700'
  }
};

const allHymns = [];
const bookCounts = { zion: 0, thirumarai: 0 };
let totalSheets = 0;

for (const [bkId, hymnsObj] of Object.entries(rawData.hymns || {})) {
  const meta = bookMeta[bkId] || { 
    id: bkId, 
    nameTamil: bkId, 
    nameEnglish: bkId,
    shortCode: bkId.toUpperCase(),
    accentColor: 'from-slate-600 to-slate-700'
  };

  for (const [key, h] of Object.entries(hymnsObj)) {
    const num = typeof h.number === 'number' ? h.number : parseInt(key, 10);
    const hymnId = `${bkId}-${num}`;

    // Title splitting: "Tamil Title - Tanglish Title"
    let titleTamil = '';
    let titleTanglish = '';
    if (h.title && h.title.includes(' - ')) {
      const parts = h.title.split(' - ');
      titleTamil = parts[0].trim();
      titleTanglish = parts.slice(1).join(' - ').trim();
    } else {
      titleTamil = (h.title || '').trim();
      titleTanglish = (h.tanglishTitle || '').trim();
    }

    // Category mapping
    let categoryName = '';
    if (h.categories && Array.isArray(h.categories) && h.categories.length) {
      const catId = h.categories[0];
      if (categories[catId]) {
        const cat = categories[catId];
        categoryName = `${cat.icon ? cat.icon + ' ' : ''}${cat.name}`.trim();
      }
    }

    // Refrain positions (1-based indices)
    let refPositions = [];
    if (typeof h.refrainPosition === 'string' && h.refrainPosition.trim()) {
      refPositions = h.refrainPosition
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n > 0);
    } else if (typeof h.refrainPosition === 'number' && h.refrainPosition > 0) {
      refPositions = [h.refrainPosition];
    }

    // Lyrics
    const tamilStanzas = Array.isArray(h.tamilLyrics) ? h.tamilLyrics : [];
    const tanglishStanzas = Array.isArray(h.tanglishLyrics) && h.tanglishLyrics.length
      ? h.tanglishLyrics
      : (Array.isArray(h.thanglishLyrics) ? h.thanglishLyrics : []);

    const stanzas = [];
    let verseCounter = 1;

    for (let i = 0; i < tamilStanzas.length; i++) {
      const rawTamil = typeof tamilStanzas[i] === 'string' ? tamilStanzas[i] : '';
      const rawTanglish = typeof tanglishStanzas[i] === 'string' ? tanglishStanzas[i] : '';

      const tLines = rawTamil.split('\n').map(l => l.trim()).filter(Boolean);
      const enLines = rawTanglish ? rawTanglish.split('\n').map(l => l.trim()).filter(Boolean) : undefined;

      const isRefrain = refPositions.includes(i + 1);

      let label = '';
      let type = 'verse';

      if (isRefrain) {
        label = 'பல்லவி (Pallavi)';
        type = 'pallavi';
      } else {
        label = `சரணம் ${verseCounter} (Stanza ${verseCounter})`;
        type = 'verse';
        verseCounter++;
      }

      stanzas.push({
        id: `${hymnId}-s${i + 1}`,
        label,
        type,
        tamil: tLines,
        tanglish: enLines && enLines.length ? enLines : undefined
      });
    }

    // Cloudinary sheet music notation URLs
    const sheetMusicUrls = Array.isArray(h.sheetMusicImages) && h.sheetMusicImages.length
      ? h.sheetMusicImages
      : undefined;

    if (sheetMusicUrls) {
      totalSheets++;
    }

    const hymn = {
      id: hymnId,
      bookId: bkId,
      bookNameTamil: meta.nameTamil,
      bookNameEnglish: meta.nameEnglish,
      number: num,
      titleTamil,
      titleTanglish,
      category: categoryName || undefined,
      author: (h.author && h.author.trim()) ? h.author.trim() : undefined,
      youtubeId: (h.youtubeLink && h.youtubeLink.trim()) ? h.youtubeLink.trim() : undefined,
      sheetMusicUrls,
      stanzas
    };

    allHymns.push(hymn);
    if (bookCounts[bkId] !== undefined) {
      bookCounts[bkId]++;
    }
  }
}

// Sort hymns deterministically: Zion first, then Thirumarai, ordered by song number
const bookOrder = { zion: 1, thirumarai: 2 };
allHymns.sort((a, b) => {
  const orderA = bookOrder[a.bookId] || 99;
  const orderB = bookOrder[b.bookId] || 99;
  if (orderA !== orderB) return orderA - orderB;
  return a.number - b.number;
});

console.log(`Parsed ${allHymns.length} total hymns:`);
console.log(`- Songs of Zion: ${bookCounts.zion}`);
console.log(`- Thirumarai Thirupadal: ${bookCounts.thirumarai}`);
console.log(`- Hymns with Cloudinary sheet music: ${totalSheets}`);

// Ensure directories
const publicDataDir = path.resolve(__dirname, '../public/data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

const srcDataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(srcDataDir)) {
  fs.mkdirSync(srcDataDir, { recursive: true });
}

// Write public/data/hymns.json
const publicJsonPath = path.join(publicDataDir, 'hymns.json');
fs.writeFileSync(publicJsonPath, JSON.stringify(allHymns, null, 2), 'utf8');
console.log(`Wrote ${publicJsonPath} (${(fs.statSync(publicJsonPath).size / 1024).toFixed(1)} KB)`);

// Write src/data/hymnsData.json
const srcJsonPath = path.join(srcDataDir, 'hymnsData.json');
fs.writeFileSync(srcJsonPath, JSON.stringify(allHymns), 'utf8');
console.log(`Wrote ${srcJsonPath} (${(fs.statSync(srcJsonPath).size / 1024).toFixed(1)} KB)`);

// Generate src/data/seedHymns.ts
const seedHymnsTsContent = `import { Hymn, HymnBookMeta } from '../types/hymn';
import hymnsData from './hymnsData.json';

export const HYMN_BOOKS: HymnBookMeta[] = [
  {
    id: 'zion',
    nameTamil: 'சீயோன் கீதங்கள்',
    nameEnglish: 'Songs of Zion',
    shortCode: 'ZION',
    accentColor: 'from-amber-600 to-amber-700',
    totalSongs: ${bookCounts.zion}
  },
  {
    id: 'thirumarai',
    nameTamil: 'திருமறை திருப்பாடல்',
    nameEnglish: 'Thirumarai Thirupadal',
    shortCode: 'TT',
    accentColor: 'from-blue-600 to-indigo-700',
    totalSongs: ${bookCounts.thirumarai}
  }
];

export const SEED_HYMNS: Hymn[] = hymnsData as unknown as Hymn[];
`;

const seedHymnsPath = path.join(srcDataDir, 'seedHymns.ts');
fs.writeFileSync(seedHymnsPath, seedHymnsTsContent, 'utf8');
console.log(`Generated ${seedHymnsPath}`);
console.log('Ingestion completed successfully.');
