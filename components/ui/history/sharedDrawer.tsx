"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  deleteShare,
  getSharedFiles,
  type SharedFile,
} from "@/lib/history/shareActions";
import { getDownloadURL, ref } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase/client";

function RemoveShareButton({
  fileId,
  removing,
  onRemove,
}: {
  fileId: string;
  removing: boolean;
  onRemove: () => void | Promise<void>;
}) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{
    right: number;
    bottom: number;
    maxW: number;
  } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const updatePos = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    const maxW = Math.min(
      260,
      r.right - margin,
      window.innerWidth - 2 * margin
    );
    setPos({
      right: Math.max(margin, window.innerWidth - r.right),
      bottom: Math.max(margin, window.innerHeight - r.top + margin),
      maxW: Math.max(140, maxW),
    });
  }, []);

  useLayoutEffect(() => {
    if (!show) return;
    updatePos();
    const onMove = () => updatePos();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [show, updatePos]);

  const tooltipId = `shared-remove-hint-${fileId}`;

  const tooltip =
    mounted && show && pos
      ? createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none fixed z-[100] rounded-md border border-neutral-200 bg-white px-2.5 py-2 text-left text-[11px] leading-snug break-words text-neutral-700 shadow-md whitespace-normal"
            style={{
              right: pos.right,
              bottom: pos.bottom,
              maxWidth: pos.maxW,
            }}
          >
            <p className="font-medium text-neutral-900">
              Remove this file from your shared list?
            </p>
            <p className="mt-1 text-neutral-600">
              This will not affect the original file.
            </p>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <Button
        ref={btnRef}
        variant="outline"
        className="h-8 rounded-xl"
        onMouseEnter={() => {
          updatePos();
          setShow(true);
        }}
        onMouseLeave={() => setShow(false)}
        onFocus={() => {
          updatePos();
          setShow(true);
        }}
        onBlur={() => setShow(false)}
        onClick={() => void onRemove()}
        disabled={removing}
        aria-describedby={show ? tooltipId : undefined}
      >
        {removing ? "..." : "Remove"}
      </Button>
      {tooltip}
    </>
  );
}

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
  const [removingId, setRemovingId] = useState<string | null>(null);

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

  const handleRemove = async (file: SharedFile) => {
    setRemovingId(file.id);
    try {
      await deleteShare(file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (error) {
      console.error("Remove share error:", error);
      alert("Failed to remove from shared list");
    } finally {
      setRemovingId(null);
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

                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    className="h-8 rounded-xl"
                    onClick={() => handleDownload(file)}
                    disabled={downloadingId === file.id}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingId === file.id ? "Loading..." : "Download"}
                  </Button>
                  <RemoveShareButton
                    fileId={file.id}
                    removing={removingId === file.id}
                    onRemove={() => void handleRemove(file)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}