import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin SDK not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables."
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  });
}

const adminApp = getFirebaseAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp).bucket();