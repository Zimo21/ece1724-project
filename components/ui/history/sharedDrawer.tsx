"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { getSharedFiles, type SharedFile } from "@/lib/history/shareActions";
import { getDownloadURL, ref } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase/client";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export function SharedDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      getSharedFiles()
        .then(setFiles)
        .catch((err) => {
          console.error("Failed to fetch shared files:", err);
          setFiles([]);
        })
        .finally(() => setLoading(false));
    }
  }, [open, user]);

  const handleDownload = async (file: SharedFile) => {
    setDownloadingId(file.id);
    try {
      const storageRef = ref(firebaseStorage, file.storagePath);
      const url = await getDownloadURL(storageRef);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    } finally {
      setDownloadingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-label="Close shared drawer"
      />

      <aside className="absolute right-0 top-0 h-full w-[320px] bg-white border-l shadow-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Shared with me</h3>
          <Button variant="ghost" className="h-8 px-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pl-1">
          {loading ? (
            <div className="text-sm text-muted-foreground border rounded-xl p-3">
              Loading...
            </div>
          ) : files.length === 0 ? (
            <div className="text-sm text-muted-foreground border rounded-xl p-3">
              No files shared with you yet.
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="border rounded-xl p-3 bg-white/60"
              >
                <div
                  className="text-sm font-medium truncate"
                  title={file.fileName}
                >
                  {file.fileName}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  From: {file.ownerEmail}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(file.createdAt)}
                </div>

                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    className="h-8 rounded-xl"
                    onClick={() => handleDownload(file)}
                    disabled={downloadingId === file.id}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingId === file.id ? "Loading..." : "Download"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}