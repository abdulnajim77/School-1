import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export const isProductionMode = import.meta.env.VITE_APP_MODE === 'production';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let realtimeDb: Database | null = null;
let storage: FirebaseStorage | null = null;

// Initialize only in production mode and when apiKey is provided
if (isProductionMode && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    firestore = getFirestore(app);
    if (firebaseConfig.databaseURL) {
      realtimeDb = getDatabase(app);
    }
    storage = getStorage(app);
    console.info('SchoolSync: Connected to Firebase Cloud Services in Production Mode.');
  } catch (err) {
    console.warn('SchoolSync: Firebase initialization deferred or skipped:', err);
  }
} else {
  // Demo Mode is active
  // console.info('SchoolSync: Operating in 100% Offline / Local Demo Mode (No Firebase required).');
}

export { app, auth, firestore, realtimeDb, storage };

/**
 * Multi-school Tenant Helper: constructs Firestore subcollection path
 * Example: getSchoolCollectionPath('school_001', 'students') -> 'schools/school_001/students'
 */
export function getSchoolCollectionPath(schoolId: string, subCollection: string): string {
  return `schools/${schoolId}/${subCollection}`;
}

/**
 * Realtime Database live GPS path for high-frequency low-latency updates
 * Example: getLiveTripGpsPath('trip_003_today') -> 'liveTrips/trip_003_today'
 */
export function getLiveTripGpsPath(tripId: string): string {
  return `liveTrips/${tripId}`;
}
