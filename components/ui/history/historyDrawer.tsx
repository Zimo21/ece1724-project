"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2, X } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  deleteHistoryEntry,
  getHistory,
  type HistoryEntry,
} from "@/lib/history/actions";
import {
  deleteShare,
  getShareRecipients,
  type ShareRecipient,
} from "@/lib/history/shareActions";
import { getDownloadURL, ref } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase/client";

function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function HistoryDrawer({
  open,
  onClose,
  onShare,
  shareSuccessTick = 0,
}: {
  open: boolean;
  onClose: () => void;
  onShare: (fileName: string, storagePath: string) => void;
  /** Increment when a share completes so expanded lists refresh */
  shareSuccessTick?: number;
}) {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sharesMap, setSharesMap] = useState<Record<string, ShareRecipient[]>>(
    {}
  );
  const [loadingShares, setLoadingShares] = useState<Record<string, boolean>>(
    {}
  );
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  const reloadHistory = useCallback(() => {
    if (!user) return;
    setLoading(true);
    getHistory(user.uid)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (open && user) {
      reloadHistory();
    }
  }, [open, user, reloadHistory]);

  useEffect(() => {
    if (!open || !user || shareSuccessTick === 0) return;
    reloadHistory();
  }, [shareSuccessTick, open, user, reloadHistory]);

  const loadShares = useCallback(async (storagePath: string, entryId: string) => {
    setLoadingShares((s) => ({ ...s, [entryId]: true }));
    try {
      const shares = await getShareRecipients(storagePath);
      setSharesMap((m) => ({ ...m, [entryId]: shares }));
    } catch (e) {
      console.error("Failed to load shares:", e);
      setSharesMap((m) => ({ ...m, [entryId]: [] }));
    } finally {
      setLoadingShares((s) => ({ ...s, [entryId]: false }));
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    items.forEach((item) => {
      if (expandedRef.current[item.id]) {
        void loadShares(item.storagePath, item.id);
      }
    });
  }, [open, items, loadShares]);

  const toggleExpand = (item: HistoryEntry) => {
    setExpanded((e) => {
      const next = !e[item.id];
      if (next) void loadShares(item.storagePath, item.id);
      return { ...e, [item.id]: next };
    });
  };

  const handleRemoveShare = async (shareId: string, entryId: string) => {
    try {
      await deleteShare(shareId);
      setSharesMap((m) => ({
        ...m,
        [entryId]: (m[entryId] ?? []).filter((s) => s.id !== shareId),
      }));
      setItems((prev) =>
        prev.map((i) =>
          i.id === entryId
            ? {
                ...i,
                shareCount: Math.max(0, (i.shareCount ?? 0) - 1),
              }
            : i
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to remove share");
    }
  };

  const handleDownload = async (item: HistoryEntry) => {
    setDownloadingId(item.id);
    try {
      const storageRef = ref(firebaseStorage, item.storagePath);
      const url = await getDownloadURL(storageRef);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteEntry = async (item: HistoryEntry) => {
    if (
      !confirm(
        `Delete "${item.fileName}" from history? This cannot be undone.`
      )
    ) {
      return;
    }
    setDeletingId(item.id);
    try {
      await deleteHistoryEntry(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setExpanded((e) => {
        const next = { ...e };
        delete next[item.id];
        return next;
      });
      setSharesMap((m) => {
        const next = { ...m };
        delete next[item.id];
        return next;
      });
    } catch (e) {
      console.error(e);
      alert(
        e instanceof Error ? e.message : "Failed to delete file from history"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-label="Close history"
      />

      <aside className="absolute left-0 top-0 h-full w-[min(100vw-1rem,380px)] max-w-[calc(100vw-1rem)] bg-white border-r shadow-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">History</h3>
          <Button variant="ghost" className="h-8 px-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-sm text-muted-foreground border rounded-xl p-3">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground border rounded-xl p-3">
              No history yet.
            </div>
          ) : (
            items.map((item) => {
              const isExpanded = !!expanded[item.id];
              const shareCountLabel = isExpanded
                ? loadingShares[item.id]
                  ? (item.shareCount ?? 0)
                  : (sharesMap[item.id]?.length ?? item.shareCount ?? 0)
                : (item.shareCount ?? 0);

              return (
                <div
                  key={item.id}
                  className="border rounded-xl p-3 bg-white/60"
                >
                  <div
                    className="text-sm font-medium truncate"
                    title={item.fileName}
                  >
                    {item.fileName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(item.createdAt)}
                  </div>

                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      className="h-8 rounded-xl"
                      onClick={() => onShare(item.fileName, item.storagePath)}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="ml-1">Share</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 rounded-xl"
                      onClick={() => handleDownload(item)}
                      disabled={downloadingId === item.id}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {downloadingId === item.id ? "..." : "Download"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 rounded-xl"
                      onClick={() => void handleDeleteEntry(item)}
                      disabled={deletingId === item.id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deletingId === item.id ? "..." : "Delete"}
                    </Button>
                  </div>

                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left text-xs text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
                    onClick={() => toggleExpand(item)}
                  >
                    <span>
                      Shared with ({shareCountLabel}){" "}
                      <span aria-hidden>{isExpanded ? "▲" : "▼"}</span>
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 border-t border-neutral-100 pt-2">
                      {loadingShares[item.id] ? (
                        <p className="text-xs text-muted-foreground">
                          Loading…
                        </p>
                      ) : (sharesMap[item.id]?.length ?? 0) === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Not shared with anyone yet.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {sharesMap[item.id]!.map((r) => (
                            <li
                              key={r.id}
                              className="flex items-center justify-between gap-2 text-xs"
                            >
                              <span className="min-w-0 flex-1 truncate pl-0.5">
                                • {r.email}
                              </span>
                              <Button
                                variant="outline"
                                size="xs"
                                className="h-7 shrink-0"
                                onClick={() =>
                                  void handleRemoveShare(r.id, item.id)
                                }
                              >
                                Remove
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}
