export type SourceType = 'hymn' | 'bible' | 'announcement';

export type BilingualDisplayMode = 
  | 'tamil-only' 
  | 'english-only' 
  | 'tamil-tanglish' 
  | 'tamil-english';

export type ObsStyleTheme = 'dark-glass' | 'royal-gold' | 'minimal-clean';

export interface BroadcastRoom {
  roomId: string;
  sourceType: SourceType;
  sourceId: string; // e.g. "zion-142" or "JHN-3-16"
  currentIndex: number; // Stanza index or verse number
  chorusIndex?: number;
  isBlanked: boolean;
  bilingualMode: BilingualDisplayMode;
  primaryText: string; // Main Tamil or primary translation text
  secondaryText?: string; // Subtitle / Tanglish / English parallel text
  referenceTitle: string; // "Zion Songs #142" or "யோவான் 3:16"
  subReference?: string; // Stanza label ("Stanza 2" / "பல்லவி") or Bible English title
  slideBadge?: string; // e.g. "பல்லவி", "சரணம் 1", "John 3:16"
  obsStyle: ObsStyleTheme;
  fontScale: number; // 0.8 to 1.5
  updatedBy: string;
  updatedAt: number; // epoch ms
}
