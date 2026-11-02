import { Hymn, HymnBookMeta } from '../types/hymn';

export const HYMN_BOOKS: HymnBookMeta[] = [
  {
    id: 'zion',
    nameTamil: 'சீயோன் கீதங்கள்',
    nameEnglish: 'Songs of Zion',
    shortCode: 'ZION',
    accentColor: 'from-amber-600 to-amber-700',
    totalSongs: 450
  },
  {
    id: 'thirumarai',
    nameTamil: 'திருமறை திருப்பாடல்',
    nameEnglish: 'Thirumarai Thirupadal',
    shortCode: 'TT',
    accentColor: 'from-blue-600 to-indigo-700',
    totalSongs: 380
  },
  {
    id: 'tamilchorus',
    nameTamil: 'தமிழ் பாமாலை / கோரஸ்',
    nameEnglish: 'Tamil Chorus',
    shortCode: 'TC',
    accentColor: 'from-emerald-600 to-teal-700',
    totalSongs: 220
  },
  {
    id: 'chorus',
    nameTamil: 'ஆங்கில பாமாலை',
    nameEnglish: 'English Chorus',
    shortCode: 'EC',
    accentColor: 'from-purple-600 to-pink-700',
    totalSongs: 150
  }
];

export const SEED_HYMNS: Hymn[] = [
  {
    id: 'zion-1',
    bookId: 'zion',
    bookNameTamil: 'சீயோன் கீதங்கள்',
    bookNameEnglish: 'Songs of Zion',
    number: 1,
    titleTamil: 'துதிப்போம் வாருங்கள் தேவ தேவனை',
    titleTanglish: 'Thuthippom Vaarungal Dheva Dhevanai',
    titleEnglish: 'Come Let Us Praise the God of Gods',
    category: 'துதி / Praise',
    keySignature: 'D Major',
    sheetMusicUrls: [
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Amazing_Grace_sheet_music.png/800px-Amazing_Grace_sheet_music.png'
    ],
    stanzas: [
      {
        id: 'zion-1-pallavi',
        label: 'பல்லவி (Pallavi)',
        type: 'pallavi',
        tamil: [
          'துதிப்போம் வாருங்கள் தேவ தேவனை',
          'தூய உள்ளத்தோடு ஆராதிப்போம்!'
        ],
        tanglish: [
          'Thuthippom vaarungal dheva dhevanai',
          'Thooya ullaththodu aaraathippom!'
        ],
        english: [
          'Come, let us praise the God of gods',
          'With a pure heart, let us worship Him!'
        ]
      },
      {
        id: 'zion-1-anupallavi',
        label: 'அனுபல்லவி (Anupallavi)',
        type: 'anupallavi',
        tamil: [
          'அவர் செய்த நன்மைகள் எண்ணிப் பாடியே',
          'அல்லேலூயா பாடி ஆர்ப்பரிப்போம்!'
        ],
        tanglish: [
          'Avar seitha nanmaigal ennip paadiye',
          'Hallelujah paadi aarpparippom!'
        ],
        english: [
          'Singing of the goodness He has done',
          'Let us shout with joy and sing Hallelujah!'
        ]
      },
      {
        id: 'zion-1-s1',
        label: 'சரணம் 1 (Charanam 1)',
        type: 'charanam',
        tamil: [
          'ஜீவனைத் தந்தவர் நம்மைத் தேற்றிட',
          'வல்லமை ஆவியால் நிறைத்திட வந்தாரே!'
        ],
        tanglish: [
          'Jeevanaith thanthavar nammaith thettrida',
          'Vallamai aaviyaal niraithida vanthaare!'
        ],
        english: [
          'The One who gave us life to comfort us',
          'Has come to fill us with His Spirit of power!'
        ]
      },
      {
        id: 'zion-1-s2',
        label: 'சரணம் 2 (Charanam 2)',
        type: 'charanam',
        tamil: [
          'காலை மாலை எவ்வேளையிலும்',
          'கர்த்தரின் கிருபை நம்மைச் சூழ்ந்திடும்!'
        ],
        tanglish: [
          'Kaalai maalai evvelaiyilum',
          'Kartharin kirubai nammaich soolnthidum!'
        ],
        english: [
          'Morning, evening, and every hour',
          'The Lord\'s mercy surrounds us!'
        ]
      }
    ]
  },
  {
    id: 'zion-142',
    bookId: 'zion',
    bookNameTamil: 'சீயோன் கீதங்கள்',
    bookNameEnglish: 'Songs of Zion',
    number: 142,
    titleTamil: 'எந்தக் காலத்திலும் எந்த நேரத்திலும்',
    titleTanglish: 'Entha Kaalathilum Entha Nerathilum',
    titleEnglish: 'At All Times and in Every Moment',
    category: 'நன்றி / Thanksgiving',
    keySignature: 'E Major',
    sheetMusicUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Amazing_Grace_sheet_music.png/800px-Amazing_Grace_sheet_music.png'
    ],
    stanzas: [
      {
        id: 'zion-142-pallavi',
        label: 'பல்லவி (Pallavi)',
        type: 'pallavi',
        tamil: [
          'எந்தக் காலத்திலும் எந்த நேரத்திலும்',
          'நன்றியால் உம்மை நான் துதிப்பேன்',
          'இயேசுவே உம்மை நான் துதிப்பேன் - துதிப்பேன்',
          'எந்த வேளையிலும் துதிப்பேன்'
        ],
        tanglish: [
          'Entha kaalathilum entha nerathilum',
          'Nandriyaal ummai naan thuthippeen',
          'Yesuve ummai naan thuthippeen - thuthippeen',
          'Entha velaiyilum thuthippeen'
        ],
        english: [
          'At all times and in every moment',
          'With thanksgiving, I will praise You',
          'Jesus, I will praise You - praise You',
          'At every hour I will praise You'
        ]
      },
      {
        id: 'zion-142-s1',
        label: 'சரணம் 1 (Charanam 1)',
        type: 'charanam',
        tamil: [
          'ஆதியும் நீரே அந்தமும் நீரே',
          'ஜோதியும் நீரே என் சொந்தமும் நீரே'
        ],
        tanglish: [
          'Aathiyum neere anthamum neere',
          'Jothiyum neere en sonthamum neere'
        ],
        english: [
          'You are the Beginning and the End',
          'You are the Light and my very own'
        ]
      },
      {
        id: 'zion-142-s2',
        label: 'சரணம் 2 (Charanam 2)',
        type: 'charanam',
        tamil: [
          'தாயும் நீரே தந்தையும் நீரே',
          'தாங்கும் தெய்வம் என் வாழ்வும் நீரே'
        ],
        tanglish: [
          'Thaayum neere thanthaiyum neere',
          'Thaangum dheivam en vaalvum neere'
        ],
        english: [
          'You are my mother and my father',
          'The sustaining God and my very life'
        ]
      }
    ]
  },
  {
    id: 'thirumarai-23',
    bookId: 'thirumarai',
    bookNameTamil: 'திருமறை திருப்பாடல்',
    bookNameEnglish: 'Thirumarai Thirupadal',
    number: 23,
    titleTamil: 'கர்த்தர் என் மேய்ப்பராய் இருக்கிறார்',
    titleTanglish: 'Karthar En Meipparaai Irukkiraar',
    titleEnglish: 'The Lord is My Shepherd',
    category: 'நம்பிக்கை / Faith',
    keySignature: 'F Major',
    stanzas: [
      {
        id: 'tt-23-s1',
        label: 'சரணம் 1',
        type: 'verse',
        tamil: [
          'கர்த்தர் என் மேய்ப்பராய் இருக்கிறார்',
          'நான் தாழ்ச்சியடையேன்;',
          'புல்லுள்ள இடங்களில் என்னை மேய்த்து',
          'அமர்ந்த தண்ணீர்கள் அண்டையில் நடத்துகிறார்.'
        ],
        tanglish: [
          'Karthar en meipparaai irukkiraar',
          'Naan thaalchiyadaiyaen;',
          'Pullulla idangalil ennai meiththu',
          'Amarntha thanneergal andaiyil nadaththugiraar.'
        ],
        english: [
          'The LORD is my shepherd; I shall not want.',
          'He maketh me to lie down in green pastures:',
          'He leadeth me beside the still waters.'
        ]
      },
      {
        id: 'tt-23-s2',
        label: 'சரணம் 2',
        type: 'verse',
        tamil: [
          'என் ஆத்துமாவைத் தேற்றி',
          'தம்முடைய நாமத்தினிமித்தம்',
          'என்னை நீதியின் பாதைகளில் நடத்துகிறார்.'
        ],
        tanglish: [
          'En aathumaavaith thettri',
          'Thammudaiya naamaththinimiththam',
          'Ennai neethiyin paathaigalil nadaththugiraar.'
        ],
        english: [
          'He restoreth my soul: he leadeth me in the paths',
          'of righteousness for his name\'s sake.'
        ]
      }
    ]
  },
  {
    id: 'tamilchorus-5',
    bookId: 'tamilchorus',
    bookNameTamil: 'தமிழ் பாமாலை / கோரஸ்',
    bookNameEnglish: 'Tamil Chorus',
    number: 5,
    titleTamil: 'நன்றி இயேசுவே உமக்கு நன்றி',
    titleTanglish: 'Nandri Yesuve Umakku Nandri',
    category: 'நன்றி / Thanksgiving',
    stanzas: [
      {
        id: 'tc-5-chorus',
        label: 'கோரஸ் (Chorus)',
        type: 'chorus',
        tamil: [
          'நன்றி இயேசுவே உமக்கு நன்றி இயேசுவே',
          'எந்தன் வாழ்விலே நீர் செய்த நன்மைக்காக நன்றி!'
        ],
        tanglish: [
          'Nandri Yesuve umakku nandri Yesuve',
          'Enthan vaalvile neer seitha nanmaikkaaga nandri!'
        ]
      }
    ]
  },
  {
    id: 'chorus-12',
    bookId: 'chorus',
    bookNameTamil: 'ஆங்கில பாமாலை',
    bookNameEnglish: 'English Chorus',
    number: 12,
    titleTamil: 'பரிசுத்தரே உன்னதரே',
    titleTanglish: 'Holy Holy Holy Lord God Almighty',
    titleEnglish: 'Holy, Holy, Holy! Lord God Almighty',
    category: 'Worship / ஆராதனை',
    stanzas: [
      {
        id: 'ec-12-s1',
        label: 'Verse 1',
        type: 'verse',
        tamil: [
          'தூயா, தூயா, சர்வ வல்ல ஆண்டவா!',
          'எங்கள் கீதம் காலையில் உம்மை எட்டும்;'
        ],
        tanglish: [
          'Thooya, thooya, sarva valla aandavaa!',
          'Engal geetham kaalaiyil ummai ettum;'
        ],
        english: [
          'Holy, holy, holy! Lord God Almighty!',
          'Early in the morning our song shall rise to Thee;'
        ]
      }
    ]
  }
];

