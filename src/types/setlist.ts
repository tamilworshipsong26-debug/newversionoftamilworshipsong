import { SourceType } from './room';

export interface SetlistItem {
  id: string;
  type: SourceType;
  refId: string; // e.g. "zion-10" or "PSA-23"
  title: string;
  subtitle: string;
  order: number;
  notes?: string;
}

export interface ServiceSetlist {
  id: string;
  title: string; // e.g. "Sunday Morning Worship - Nov 8"
  serviceDate: string; // ISO date
  roomId: string;
  items: SetlistItem[];
  ownerId?: string;
  updatedAt: number;
}

export interface MistakeReport {
  id: string;
  hymnId: string;
  hymnTitle: string;
  issueType: 'typo' | 'missing-stanza' | 'chords' | 'other';
  description: string;
  status: 'pending' | 'resolved';
  authorId?: string;
  createdAt: number;
}

