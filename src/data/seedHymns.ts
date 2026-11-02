import { Hymn, HymnBookMeta } from '../types/hymn';
import hymnsData from './hymnsData.json';

export const HYMN_BOOKS: HymnBookMeta[] = [
  {
    id: 'zion',
    nameTamil: 'சீயோன் கீதங்கள்',
    nameEnglish: 'Songs of Zion',
    shortCode: 'ZION',
    accentColor: 'from-amber-600 to-amber-700',
    totalSongs: 600
  },
  {
    id: 'thirumarai',
    nameTamil: 'திருமறை திருப்பாடல்',
    nameEnglish: 'Thirumarai Thirupadal',
    shortCode: 'TT',
    accentColor: 'from-blue-600 to-indigo-700',
    totalSongs: 255
  }
];

export const SEED_HYMNS: Hymn[] = hymnsData as unknown as Hymn[];
