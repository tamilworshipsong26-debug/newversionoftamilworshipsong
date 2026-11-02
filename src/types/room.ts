export type SourceType = 'hymn' | 'bible' | 'announcement';

export type BilingualDisplayMode = 
  | 'tamil-only' 
  | 'english-only' 
  | 'tamil-tanglish' 
  | 'tamil-english'
  | 'english-tamil'
  | 'parallel';

export type ObsStyleTheme = 'dark-glass' | 'royal-gold' | 'minimal-clean';

export interface BroadcastRoom {
  roomId: string;
  sourceType: SourceType;
  sourceId: string; // e.g. "zion-142" or "JHN-3-16"
  currentIndex: number; // Stanza index or verse number
  chorusIndex?: number;
  isBlanked: boolean;
  bilingualMode: BilingualDisplayMode;
  primaryText: string; // Main primary text (Tamil BSI, NKJV, KJV, or Hymn)
  secondaryText?: string; // Subtitle / Parallel text / Tanglish (optional)
  referenceTitle: string; // "Zion Songs #142", "John 3:16", or "யோவான் 3:16"
  subReference?: string; // Secondary reference title or subtitle
  slideBadge?: string; // e.g. "பல்லவி", "Verse 16", "John 3:16"
  obsStyle: ObsStyleTheme;
  fontScale: number; // 0.8 to 1.5
  updatedBy: string;
  updatedAt: number; // epoch ms
}
