import { BibleBook, BibleVerse } from '../types/bible';

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament (39 books)
  { id: 'GEN', number: 1, testament: 'OT', nameTamil: 'ஆதியாகமம்', nameEnglish: 'Genesis', shortTamil: 'ஆதி', shortEnglish: 'Gen', chaptersCount: 50 },
  { id: 'EXO', number: 2, testament: 'OT', nameTamil: 'யாத்திராகமம்', nameEnglish: 'Exodus', shortTamil: 'யாத்', shortEnglish: 'Exo', chaptersCount: 40 },
  { id: 'LEV', number: 3, testament: 'OT', nameTamil: 'லேவியராகமம்', nameEnglish: 'Leviticus', shortTamil: 'லேவி', shortEnglish: 'Lev', chaptersCount: 27 },
  { id: 'NUM', number: 4, testament: 'OT', nameTamil: 'எண்ணாகமம்', nameEnglish: 'Numbers', shortTamil: 'எண்', shortEnglish: 'Num', chaptersCount: 36 },
  { id: 'DEU', number: 5, testament: 'OT', nameTamil: 'உபாகமம்', nameEnglish: 'Deuteronomy', shortTamil: 'உபா', shortEnglish: 'Deu', chaptersCount: 34 },
  { id: 'JOS', number: 6, testament: 'OT', nameTamil: 'யோசுவா', nameEnglish: 'Joshua', shortTamil: 'யோசு', shortEnglish: 'Jos', chaptersCount: 24 },
  { id: 'JDG', number: 7, testament: 'OT', nameTamil: 'நியாயாதிபதிகள்', nameEnglish: 'Judges', shortTamil: 'நியா', shortEnglish: 'Jdg', chaptersCount: 21 },
  { id: 'RUT', number: 8, testament: 'OT', nameTamil: 'ரூத்', nameEnglish: 'Ruth', shortTamil: 'ரூத்', shortEnglish: 'Rut', chaptersCount: 4 },
  { id: '1SA', number: 9, testament: 'OT', nameTamil: '1 சாமுவேல்', nameEnglish: '1 Samuel', shortTamil: '1 சாமு', shortEnglish: '1Sa', chaptersCount: 31 },
  { id: '2SA', number: 10, testament: 'OT', nameTamil: '2 சாமுவேல்', nameEnglish: '2 Samuel', shortTamil: '2 சாமு', shortEnglish: '2Sa', chaptersCount: 24 },
  { id: '1KI', number: 11, testament: 'OT', nameTamil: '1 இராஜாக்கள்', nameEnglish: '1 Kings', shortTamil: '1 இரா', shortEnglish: '1Ki', chaptersCount: 22 },
  { id: '2KI', number: 12, testament: 'OT', nameTamil: '2 இராஜாக்கள்', nameEnglish: '2 Kings', shortTamil: '2 இரா', shortEnglish: '2Ki', chaptersCount: 25 },
  { id: '1CH', number: 13, testament: 'OT', nameTamil: '1 நாளாகமம்', nameEnglish: '1 Chronicles', shortTamil: '1 நாளா', shortEnglish: '1Ch', chaptersCount: 29 },
  { id: '2CH', number: 14, testament: 'OT', nameTamil: '2 நாளாகமம்', nameEnglish: '2 Chronicles', shortTamil: '2 நாளா', shortEnglish: '2Ch', chaptersCount: 36 },
  { id: 'EZR', number: 15, testament: 'OT', nameTamil: 'எஸ்றா', nameEnglish: 'Ezra', shortTamil: 'எஸ்றா', shortEnglish: 'Ezr', chaptersCount: 10 },
  { id: 'NEH', number: 16, testament: 'OT', nameTamil: 'நெகேமியா', nameEnglish: 'Nehemiah', shortTamil: 'நெகே', shortEnglish: 'Neh', chaptersCount: 13 },
  { id: 'EST', number: 17, testament: 'OT', nameTamil: 'எஸ்தர்', nameEnglish: 'Esther', shortTamil: 'எஸ்த', shortEnglish: 'Est', chaptersCount: 10 },
  { id: 'JOB', number: 18, testament: 'OT', nameTamil: 'யோபு', nameEnglish: 'Job', shortTamil: 'யோபு', shortEnglish: 'Job', chaptersCount: 42 },
  { id: 'PSA', number: 19, testament: 'OT', nameTamil: 'சங்கீதம்', nameEnglish: 'Psalms', shortTamil: 'சங்', shortEnglish: 'Psa', chaptersCount: 150 },
  { id: 'PRO', number: 20, testament: 'OT', nameTamil: 'நீதிமொழிகள்', nameEnglish: 'Proverbs', shortTamil: 'நீதி', shortEnglish: 'Pro', chaptersCount: 31 },
  { id: 'ECC', number: 21, testament: 'OT', nameTamil: 'பிரசங்கி', nameEnglish: 'Ecclesiastes', shortTamil: 'பிர', shortEnglish: 'Ecc', chaptersCount: 12 },
  { id: 'SNG', number: 22, testament: 'OT', nameTamil: 'உன்னதப்பாட்டு', nameEnglish: 'Song of Solomon', shortTamil: 'உன்', shortEnglish: 'Sng', chaptersCount: 8 },
  { id: 'ISA', number: 23, testament: 'OT', nameTamil: 'ஏசாயா', nameEnglish: 'Isaiah', shortTamil: 'ஏசா', shortEnglish: 'Isa', chaptersCount: 66 },
  { id: 'JER', number: 24, testament: 'OT', nameTamil: 'எரேமியா', nameEnglish: 'Jeremiah', shortTamil: 'எரே', shortEnglish: 'Jer', chaptersCount: 52 },
  { id: 'LAM', number: 25, testament: 'OT', nameTamil: 'புலம்பல்', nameEnglish: 'Lamentations', shortTamil: 'புல', shortEnglish: 'Lam', chaptersCount: 5 },
  { id: 'EZK', number: 26, testament: 'OT', nameTamil: 'எசேக்கியேல்', nameEnglish: 'Ezekiel', shortTamil: 'எசேக்', shortEnglish: 'Ezk', chaptersCount: 48 },
  { id: 'DAN', number: 27, testament: 'OT', nameTamil: 'தானியேல்', nameEnglish: 'Daniel', shortTamil: 'தானி', shortEnglish: 'Dan', chaptersCount: 12 },
  { id: 'HOS', number: 28, testament: 'OT', nameTamil: 'ஓசியா', nameEnglish: 'Hosea', shortTamil: 'ஓசி', shortEnglish: 'Hos', chaptersCount: 14 },
  { id: 'JOL', number: 29, testament: 'OT', nameTamil: 'யோவேல்', nameEnglish: 'Joel', shortTamil: 'யோவே', shortEnglish: 'Jol', chaptersCount: 3 },
  { id: 'AMO', number: 30, testament: 'OT', nameTamil: 'ஆமோஸ்', nameEnglish: 'Amos', shortTamil: 'ஆமோ', shortEnglish: 'Amo', chaptersCount: 9 },
  { id: 'OBA', number: 31, testament: 'OT', nameTamil: 'ஒபதியா', nameEnglish: 'Obadiah', shortTamil: 'ஒப', shortEnglish: 'Oba', chaptersCount: 1 },
  { id: 'JON', number: 32, testament: 'OT', nameTamil: 'யோனா', nameEnglish: 'Jonah', shortTamil: 'யோனா', shortEnglish: 'Jon', chaptersCount: 4 },
  { id: 'MIC', number: 33, testament: 'OT', nameTamil: 'மீகா', nameEnglish: 'Micah', shortTamil: 'மீகா', shortEnglish: 'Mic', chaptersCount: 7 },
  { id: 'NAM', number: 34, testament: 'OT', nameTamil: 'நாகூம்', nameEnglish: 'Nahum', shortTamil: 'நாகூ', shortEnglish: 'Nam', chaptersCount: 3 },
  { id: 'HAB', number: 35, testament: 'OT', nameTamil: 'ஆபகூக்', nameEnglish: 'Habakkuk', shortTamil: 'ஆப', shortEnglish: 'Hab', chaptersCount: 3 },
  { id: 'ZEP', number: 36, testament: 'OT', nameTamil: 'செப்பனியா', nameEnglish: 'Zephaniah', shortTamil: 'செப்', shortEnglish: 'Zep', chaptersCount: 3 },
  { id: 'HAG', number: 37, testament: 'OT', nameTamil: 'ஆகாய்', nameEnglish: 'Haggai', shortTamil: 'ஆகாய்', shortEnglish: 'Hag', chaptersCount: 2 },
  { id: 'ZEC', number: 38, testament: 'OT', nameTamil: 'சகரியா', nameEnglish: 'Zechariah', shortTamil: 'சக', shortEnglish: 'Zec', chaptersCount: 14 },
  { id: 'MAL', number: 39, testament: 'OT', nameTamil: 'மல்கியா', nameEnglish: 'Malachi', shortTamil: 'மல்', shortEnglish: 'Mal', chaptersCount: 4 },

  // New Testament (27 books)
  { id: 'MAT', number: 40, testament: 'NT', nameTamil: 'மத்தேயு', nameEnglish: 'Matthew', shortTamil: 'மத்', shortEnglish: 'Mat', chaptersCount: 28 },
  { id: 'MRK', number: 41, testament: 'NT', nameTamil: 'மாற்கு', nameEnglish: 'Mark', shortTamil: 'மாற்', shortEnglish: 'Mrk', chaptersCount: 16 },
  { id: 'LUK', number: 42, testament: 'NT', nameTamil: 'லூக்கா', nameEnglish: 'Luke', shortTamil: 'லூக்', shortEnglish: 'Luk', chaptersCount: 24 },
  { id: 'JHN', number: 43, testament: 'NT', nameTamil: 'யோவான்', nameEnglish: 'John', shortTamil: 'யோவா', shortEnglish: 'Jhn', chaptersCount: 21 },
  { id: 'ACT', number: 44, testament: 'NT', nameTamil: 'அப்போஸ்தலர் நடபடிகள்', nameEnglish: 'Acts', shortTamil: 'அப்', shortEnglish: 'Act', chaptersCount: 28 },
  { id: 'ROM', number: 45, testament: 'NT', nameTamil: 'ரோமர்', nameEnglish: 'Romans', shortTamil: 'ரோம', shortEnglish: 'Rom', chaptersCount: 16 },
  { id: '1CO', number: 46, testament: 'NT', nameTamil: '1 கொரிந்தியர்', nameEnglish: '1 Corinthians', shortTamil: '1 கொரி', shortEnglish: '1Co', chaptersCount: 16 },
  { id: '2CO', number: 47, testament: 'NT', nameTamil: '2 கொரிந்தியர்', nameEnglish: '2 Corinthians', shortTamil: '2 கொரி', shortEnglish: '2Co', chaptersCount: 13 },
  { id: 'GAL', number: 48, testament: 'NT', nameTamil: 'கலாத்தியர்', nameEnglish: 'Galatians', shortTamil: 'கலா', shortEnglish: 'Gal', chaptersCount: 6 },
  { id: 'EPH', number: 49, testament: 'NT', nameTamil: 'எபேசியர்', nameEnglish: 'Ephesians', shortTamil: 'எபே', shortEnglish: 'Eph', chaptersCount: 6 },
  { id: 'PHP', number: 50, testament: 'NT', nameTamil: 'பிலிப்பியர்', nameEnglish: 'Philippians', shortTamil: 'பிலிப்', shortEnglish: 'Php', chaptersCount: 4 },
  { id: 'COL', number: 51, testament: 'NT', nameTamil: 'கொலோசெயர்', nameEnglish: 'Colossians', shortTamil: 'கொலோ', shortEnglish: 'Col', chaptersCount: 4 },
  { id: '1TH', number: 52, testament: 'NT', nameTamil: '1 தெசலோனிக்கேயர்', nameEnglish: '1 Thessalonians', shortTamil: '1 தெச', shortEnglish: '1Th', chaptersCount: 5 },
  { id: '2TH', number: 53, testament: 'NT', nameTamil: '2 தெசலோனிக்கேயர்', nameEnglish: '2 Thessalonians', shortTamil: '2 தெச', shortEnglish: '2Th', chaptersCount: 3 },
  { id: '1TI', number: 54, testament: 'NT', nameTamil: '1 தீமோத்தேயு', nameEnglish: '1 Timothy', shortTamil: '1 தீமோ', shortEnglish: '1Ti', chaptersCount: 6 },
  { id: '2TI', number: 55, testament: 'NT', nameTamil: '2 தீமோத்தேயு', nameEnglish: '2 Timothy', shortTamil: '2 தீமோ', shortEnglish: '2Ti', chaptersCount: 4 },
  { id: 'TIT', number: 56, testament: 'NT', nameTamil: 'தீத்து', nameEnglish: 'Titus', shortTamil: 'தீத்து', shortEnglish: 'Tit', chaptersCount: 3 },
  { id: 'PHM', number: 57, testament: 'NT', nameTamil: 'பிலேமோன்', nameEnglish: 'Philemon', shortTamil: 'பிலே', shortEnglish: 'Phm', chaptersCount: 1 },
  { id: 'HEB', number: 58, testament: 'NT', nameTamil: 'எபிரெயர்', nameEnglish: 'Hebrews', shortTamil: 'எபி', shortEnglish: 'Heb', chaptersCount: 13 },
  { id: 'JAS', number: 59, testament: 'NT', nameTamil: 'யாக்கோபு', nameEnglish: 'James', shortTamil: 'யாக்', shortEnglish: 'Jas', chaptersCount: 5 },
  { id: '1PE', number: 60, testament: 'NT', nameTamil: '1 பேதுரு', nameEnglish: '1 Peter', shortTamil: '1 பேது', shortEnglish: '1Pe', chaptersCount: 5 },
  { id: '2PE', number: 61, testament: 'NT', nameTamil: '2 பேதுரு', nameEnglish: '2 Peter', shortTamil: '2 பேது', shortEnglish: '2Pe', chaptersCount: 3 },
  { id: '1JN', number: 62, testament: 'NT', nameTamil: '1 யோவான்', nameEnglish: '1 John', shortTamil: '1 யோவா', shortEnglish: '1Jn', chaptersCount: 5 },
  { id: '2JN', number: 63, testament: 'NT', nameTamil: '2 யோவான்', nameEnglish: '2 John', shortTamil: '2 யோவா', shortEnglish: '2Jn', chaptersCount: 1 },
  { id: '3JN', number: 64, testament: 'NT', nameTamil: '3 யோவான்', nameEnglish: '3 John', shortTamil: '3 யோவா', shortEnglish: '3Jn', chaptersCount: 1 },
  { id: 'JUD', number: 65, testament: 'NT', nameTamil: 'யூதா', nameEnglish: 'Jude', shortTamil: 'யூதா', shortEnglish: 'Jud', chaptersCount: 1 },
  { id: 'REV', number: 66, testament: 'NT', nameTamil: 'வெளிப்படுத்தின விசேஷம்', nameEnglish: 'Revelation', shortTamil: 'வெளி', shortEnglish: 'Rev', chaptersCount: 22 }
];

export const SEED_BIBLE_VERSES: BibleVerse[] = [
  // John 3:16 - Tamil BSI
  {
    id: 'TAMIL_BSI-JHN-3-16',
    translation: 'TAMIL_BSI',
    bookId: 'JHN',
    chapter: 3,
    verse: 16,
    text: 'தேவன், தம்முடைய ஒரேபேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரைத் தந்தருளி, இவ்வளவாய் உலகத்தில் அன்புகூர்ந்தார்.'
  },
  // John 3:16 - KJV
  {
    id: 'KJV-JHN-3-16',
    translation: 'KJV',
    bookId: 'JHN',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'
  },
  // John 3:16 - NKJV
  {
    id: 'NKJV-JHN-3-16',
    translation: 'NKJV',
    bookId: 'JHN',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.'
  },
  // John 3:17 - Tamil BSI
  {
    id: 'TAMIL_BSI-JHN-3-17',
    translation: 'TAMIL_BSI',
    bookId: 'JHN',
    chapter: 3,
    verse: 17,
    text: 'உலகத்தை ஆக்கினைக்குட்படுத்தும்படியாக தேவன் தம்முடைய குமாரனை உலகத்தில் அனுப்பாமல், அவராலே உலகம் இரட்சிக்கப்படுவதற்காகவே அவரை அனுப்பினார்.'
  },
  // John 3:17 - KJV
  {
    id: 'KJV-JHN-3-17',
    translation: 'KJV',
    bookId: 'JHN',
    chapter: 3,
    verse: 17,
    text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.'
  },
  // John 3:17 - NKJV
  {
    id: 'NKJV-JHN-3-17',
    translation: 'NKJV',
    bookId: 'JHN',
    chapter: 3,
    verse: 17,
    text: 'For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.'
  },
  // Psalm 23:1 - Tamil BSI
  {
    id: 'TAMIL_BSI-PSA-23-1',
    translation: 'TAMIL_BSI',
    bookId: 'PSA',
    chapter: 23,
    verse: 1,
    text: 'கர்த்தர் என் மேய்ப்பராயிருக்கிறார்; நான் தாழ்ச்சியடையேன்.'
  },
  // Psalm 23:1 - KJV
  {
    id: 'KJV-PSA-23-1',
    translation: 'KJV',
    bookId: 'PSA',
    chapter: 23,
    verse: 1,
    text: 'The LORD is my shepherd; I shall not want.'
  },
  // Psalm 23:1 - NKJV
  {
    id: 'NKJV-PSA-23-1',
    translation: 'NKJV',
    bookId: 'PSA',
    chapter: 23,
    verse: 1,
    text: 'The LORD is my shepherd; I shall not want.'
  },
  // Psalm 23:2 - Tamil BSI
  {
    id: 'TAMIL_BSI-PSA-23-2',
    translation: 'TAMIL_BSI',
    bookId: 'PSA',
    chapter: 23,
    verse: 2,
    text: 'அவர் என்னைப் புல்லுள்ள இடங்களில் மேய்த்து, அமர்ந்த தண்ணீர்கள் அண்டையில் என்னைக் கொண்டுபோய் விடுகிறார்.'
  },
  // Psalm 23:2 - KJV
  {
    id: 'KJV-PSA-23-2',
    translation: 'KJV',
    bookId: 'PSA',
    chapter: 23,
    verse: 2,
    text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.'
  },
  // Psalm 23:2 - NKJV
  {
    id: 'NKJV-PSA-23-2',
    translation: 'NKJV',
    bookId: 'PSA',
    chapter: 23,
    verse: 2,
    text: 'He makes me to lie down in green pastures; He leads me beside the still waters.'
  }
];
