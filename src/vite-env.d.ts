/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare worker fetcher stub
interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

declare module 'firebase/auth' {
  export function getAuth(app?: any): any;
  export function onAuthStateChanged(auth: any, nextOrObserver: any): () => void;
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export class GoogleAuthProvider {
    constructor();
  }
}
