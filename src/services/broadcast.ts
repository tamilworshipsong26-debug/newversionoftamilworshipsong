import { BroadcastRoom } from '../types/room';
import { subscribeToRoom, pushRoomUpdate } from './firebase';

const CHANNEL_NAME = 'tamil-worship-live-sync';

class BroadcastSyncManager {
  private channel: BroadcastChannel | null = null;
  private unsubscribeFirestore: (() => void) | null = null;
  private currentRoomId: string = 'SANCTUARY-1';
  private listeners: Set<(room: BroadcastRoom) => void> = new Set();
  private lastKnownState: BroadcastRoom | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data && event.data.roomId === this.currentRoomId) {
            this.notifyListeners(event.data);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or error:', e);
      }
    }
  }

  public setRoom(roomId: string, onUpdate?: (room: BroadcastRoom) => void): () => void {
    this.currentRoomId = roomId.toUpperCase();
    if (onUpdate) {
      this.listeners.add(onUpdate);
      if (this.lastKnownState && this.lastKnownState.roomId === this.currentRoomId) {
        onUpdate(this.lastKnownState);
      }
    }

    // Unsubscribe from previous firestore room if any
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }

    // Attach real-time Firestore listener
    this.unsubscribeFirestore = subscribeToRoom(
      this.currentRoomId,
      (updatedRoom) => {
        this.lastKnownState = updatedRoom;
        this.notifyListeners(updatedRoom);
      },
      (error) => {
        console.log('[SyncManager] Using local/BroadcastChannel mode due to Firestore state:', error);
      }
    );

    return () => {
      if (onUpdate) {
        this.listeners.delete(onUpdate);
      }
    };
  }

  public async broadcast(room: BroadcastRoom): Promise<void> {
    const updatedRoom = {
      ...room,
      roomId: this.currentRoomId,
      updatedAt: Date.now()
    };
    this.lastKnownState = updatedRoom;

    // 1. Instant local tab & OBS broadcast (0ms latency fallback)
    if (this.channel) {
      try {
        this.channel.postMessage(updatedRoom);
      } catch (err) {
        console.warn('Error posting to BroadcastChannel:', err);
      }
    }
    this.notifyListeners(updatedRoom);

    // 2. Cloud Firestore Real-time Sync (pushes to OBS Browser Sources & Projectors everywhere)
    try {
      await pushRoomUpdate(updatedRoom);
    } catch (err) {
      console.warn('Offline or Firebase write warning:', err);
    }
  }

  public getCurrentState(): BroadcastRoom | null {
    return this.lastKnownState;
  }

  private notifyListeners(room: BroadcastRoom) {
    this.listeners.forEach((listener) => {
      try {
        listener(room);
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });
  }

  public cleanup() {
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
  }
}

export const syncManager = new BroadcastSyncManager();
