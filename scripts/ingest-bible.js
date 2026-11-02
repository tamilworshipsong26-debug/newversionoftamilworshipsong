import fs from 'node:fs';
import path from 'node:path';

const tbPath = path.resolve('tamilbible.json');
const kjvPath = path.resolve('en_kjv.json');
const nkjvPath = path.resolve('en_nkjv.json');

if (!fs.existsSync(tbPath) || !fs.existsSync(kjvPath) || !fs.existsSync(nkjvPath)) {
  console.error('Source Bible JSON files missing.');
  process.exit(1);
}

const tb = JSON.parse(fs.readFileSync(tbPath, 'utf8')).Book;
const kjv = JSON.parse(fs.readFileSync(kjvPath, 'utf8'));
const nkjv = JSON.parse(fs.readFileSync(nkjvPath, 'utf8'));

const bookCodes = [
  'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL',
  'MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'
];

const outDir = path.resolve('public', 'bible', 'books');
fs.mkdirSync(outDir, { recursive: true });

let totalVerses = 0;
let totalChapters = 0;

for (let i = 0; i < 66; i++) {
  const code = bookCodes[i];
  const tBook = tb[i];
  const kBook = kjv[i];
  const nBook = nkjv[i];

  const chapters = [];
  for (let c = 0; c < kBook.chapters.length; c++) {
    totalChapters++;
    const tVerses = tBook.Chapter[c].Verse;
    const kVerses = kBook.chapters[c];
    const nVerses = nBook.chapters[c];

    const verses = [];
    for (let v = 0; v < kVerses.length; v++) {
      totalVerses++;
      verses.push({
        verse: v + 1,
        tamil: tVerses[v]?.Verse || '',
        kjv: kVerses[v] || '',
        nkjv: nVerses[v] || ''
      });
    }
    chapters.push(verses);
  }

  const bookData = {
    bookId: code,
    number: i + 1,
    testament: i < 39 ? 'OT' : 'NT',
    nameEnglish: kBook.name,
    chaptersCount: chapters.length,
    chapters: chapters
  };

  fs.writeFileSync(path.join(outDir, `${code}.json`), JSON.stringify(bookData));
}

console.log(`Ingested ${bookCodes.length} books, ${totalChapters} chapters, ${totalVerses} paired verses.`);

