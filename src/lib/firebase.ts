import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const readEnvOrFallback = (envValue: unknown, fallback: string): string =>
  typeof envValue === 'string' && envValue.trim() !== '' ? envValue.trim() : fallback;

const firebaseConfig = {
  apiKey: readEnvOrFallback(
    import.meta.env.VITE_FIREBASE_API_KEY,
    'AIzaSyCsRbjm6nEe-XAENrm83955LZkfGeUkPwI'
  ),
  authDomain: readEnvOrFallback(
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    'iamtechni-website.firebaseapp.com'
  ),
  projectId: readEnvOrFallback(
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    'iamtechni-website'
  ),
  storageBucket: readEnvOrFallback(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    'iamtechni-website.firebasestorage.app'
  ),
  messagingSenderId: readEnvOrFallback(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    '356096026350'
  ),
  appId: readEnvOrFallback(
    import.meta.env.VITE_FIREBASE_APP_ID,
    '1:356096026350:web:73d49cefd916391a72b5ff'
  ),
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb as Firestore;
export { app };
