import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function getFirebaseApp(): FirebaseApp {
  const apps = getApps();
  if (apps.length > 0) return apps[0];

  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE!
  });
}

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firebaseApp = getFirebaseApp();
export const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore();   
export const storage = getStorage();