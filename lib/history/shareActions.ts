import { firebaseAuth } from "@/lib/firebase/client";
import type { HistoryEntry } from "./actions";

export type SharedFile = {
  id: string;
  fileName: string;
  storagePath: string;
  ownerEmail: string;
  createdAt: string;
  downloadUrl?: string;
};

export async function shareFile(
  targetEmail: string,
  fileName: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  const res = await fetch("/api/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetEmail, fileName, storagePath }),
  });

  const data = await res.json();
  if (!res.ok) {
    if ((data as { error?: string }).error?.includes("Firebase Admin")) {
      return { success: false, error: "Sharing is not configured. Contact your administrator." };
    }
    return { success: false, error: data.error || "Failed to share file" };
  }
  return { success: true };
}

export async function getSharedFiles(): Promise<SharedFile[]> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  const res = await fetch("/api/share", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if ((data as { error?: string }).error?.includes("Firebase Admin")) {
      console.warn("Firebase Admin SDK not configured - sharing disabled");
      return [];
    }
    throw new Error("Failed to fetch shared files");
  }

  const data = await res.json();
  return data.files.map((f: Record<string, unknown>) => ({
    id: f.id,
    fileName: f.fileName,
    storagePath: f.storagePath,
    ownerEmail: (f.owner as Record<string, string>)?.email ?? "Unknown",
    createdAt: f.createdAt,
  }));
}

export async function deleteShare(shareId: string): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  const res = await fetch(`/api/share?id=${shareId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete share");
}