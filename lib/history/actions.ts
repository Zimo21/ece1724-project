import { firebaseStorage, firebaseAuth } from "@/lib/firebase/client";
import { ref, uploadBytes } from "firebase/storage";

export type HistoryEntry = {
  id: string;
  fileName: string;
  createdAt: string;
  storagePath: string;
  /** Present when loaded from GET /api/history */
  shareCount?: number;
};

export async function saveToHistory(
  userId: string,
  fileName: string,
  zipBlob: Blob
): Promise<HistoryEntry | null> {
  const timestamp = Date.now();
  const storagePath = `users/${userId}/history/${timestamp}_${fileName}`;
  const storageRef = ref(firebaseStorage, storagePath);

  await uploadBytes(storageRef, zipBlob);

  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Not authenticated");

  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileName, storagePath }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if ((data as { error?: string }).error?.includes("Firebase Admin")) {
        console.warn("Firebase Admin SDK not configured - history not saved to DB");
        return null;
      }
      throw new Error((data as { error?: string }).error || "Failed to save history");
    }

    const data = await res.json();
    return data.entry;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Firebase Admin")) {
      console.warn("Firebase Admin SDK not configured - history not saved to DB");
      return null;
    }
    throw error;
  }
}

export async function getHistory(userId: string): Promise<HistoryEntry[]> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Not authenticated");

  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/history", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if ((data as { error?: string }).error?.includes("Firebase Admin")) {
        console.warn("Firebase Admin SDK not configured - history disabled");
        return [];
      }
      throw new Error((data as { error?: string }).error || "Failed to get history");
    }

    const data = await res.json();
    return data.entries;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Firebase Admin")) {
      console.warn("Firebase Admin SDK not configured - history disabled");
      return [];
    }
    throw error;
  }
}

export async function deleteHistoryEntry(entryId: string): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  const res = await fetch(`/api/history?id=${encodeURIComponent(entryId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Failed to delete");
  }
}