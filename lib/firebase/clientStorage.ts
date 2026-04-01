import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "./client";

export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);