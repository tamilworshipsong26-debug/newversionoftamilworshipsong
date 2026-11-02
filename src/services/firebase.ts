import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  get 
} from 'firebase/database';
import { BroadcastRoom } from '../types/room';
import { MistakeReport } from '../types/setlist';

// Firebase configuration for tamilworshipsong-1153c Realtime Database
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDFWYtT04A7QxvuHKshdNQjSFvBVxiEjIs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tamilworshipsong-1153c.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://tamilworshipsong-1153c-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tamilworshipsong-1153c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tamilworshipsong-1153c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "17084745857",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:17084745857:web:c9c05bb7d9d4346bf5e580"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);

/**
 * Real-time listener for OBS Browser Source and Sanctuary Projectors.
 * Calls callback on every stanza/verse change or blank toggle via Firebase Realtime Database.
 */
export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: BroadcastRoom) => void,
  onError?: (err: Error) => void
): () => void {
  const roomRef = ref(rtdb, `rooms/${roomId.toUpperCase()}`);
  
  const unsubscribe = onValue(
    roomRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        onUpdate({
          ...data,
          roomId: roomId.toUpperCase(),
          updatedAt: data.updatedAt || Date.now()
        } as BroadcastRoom);
      }
    },
    (error) => {
      console.warn(`[Firebase RTDB] onValue error for room ${roomId}:`, error.message);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Broadcast an active hymn stanza, Bible verse, or blank screen to all connected OBS / Projector screens
 */
export async function pushRoomUpdate(room: BroadcastRoom): Promise<void> {
  const roomRef = ref(rtdb, `rooms/${room.roomId.toUpperCase()}`);
  await set(roomRef, {
    ...room,
    roomId: room.roomId.toUpperCase(),
    updatedAt: Date.now()
  });
}

/**
 * Fetch default room configuration
 */
export async function getRoomState(roomId: string): Promise<BroadcastRoom | null> {
  const roomRef = ref(rtdb, `rooms/${roomId.toUpperCase()}`);
  const snap = await get(roomRef);
  if (snap.exists()) {
    const data = snap.val();
    return {
      ...data,
      roomId: roomId.toUpperCase(),
      updatedAt: data.updatedAt || Date.now()
    } as BroadcastRoom;
  }
  return null;
}

/**
 * Submit community mistake report to RTDB reports queue
 */
export async function submitMistakeReport(report: Omit<MistakeReport, 'id' | 'createdAt'>): Promise<string> {
  const reportId = `report-${Date.now()}`;
  const reportRef = ref(rtdb, `reports/${reportId}`);
  await set(reportRef, {
    ...report,
    id: reportId,
    status: 'pending',
    createdAt: Date.now()
  });
  return reportId;
}
