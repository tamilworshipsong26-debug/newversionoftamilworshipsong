import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { BroadcastRoom } from '../types/room';
import { MistakeReport } from '../types/setlist';

// Firebase configuration with environment variables and safe local/demo fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDEMO_KEY_TAMIL_WORSHIP_SUITE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tamil-worship-suite.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tamil-worship-suite",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tamil-worship-suite.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcd1234ef5678"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Real-time listener for OBS Browser Source and Sanctuary Projectors.
 * Calls callback on every stanza/verse change or blank toggle.
 */
export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: BroadcastRoom) => void,
  onError?: (err: Error) => void
): () => void {
  const roomRef = doc(db, 'rooms', roomId.toUpperCase());
  return onSnapshot(
    roomRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate({
          ...data,
          roomId: snapshot.id,
          updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now())
        } as BroadcastRoom);
      }
    },
    (error) => {
      console.warn(`[Firebase Firestore] onSnapshot error for room ${roomId}:`, error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Broadcast an active hymn stanza, Bible verse, or blank screen to all connected OBS / Projector screens
 */
export async function pushRoomUpdate(room: BroadcastRoom): Promise<void> {
  const roomRef = doc(db, 'rooms', room.roomId.toUpperCase());
  await setDoc(roomRef, {
    ...room,
    roomId: room.roomId.toUpperCase(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * Fetch or create default room configuration
 */
export async function getRoomState(roomId: string): Promise<BroadcastRoom | null> {
  const roomRef = doc(db, 'rooms', roomId.toUpperCase());
  const snap = await getDoc(roomRef);
  if (snap.exists()) {
    const data = snap.data();
    return {
      ...data,
      roomId: snap.id,
      updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now())
    } as BroadcastRoom;
  }
  return null;
}

/**
 * Submit community mistake report (queued offline or direct to Firestore)
 */
export async function submitMistakeReport(report: Omit<MistakeReport, 'id' | 'createdAt'>): Promise<string> {
  const reportsCol = collection(db, 'reports');
  const docRef = await addDoc(reportsCol, {
    ...report,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
