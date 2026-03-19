"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

export type HistoryItem = {
  id: string;
  fileName: string;
  createdAtLabel: string; // for now simple string; later Timestamp -> format
  zipUrl: string; // later from Firestore / Storage
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: HistoryItem[];
};

export function HistoryDrawer({ open, onClose, items }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-label="Close history"
      />

      {/* Panel */}
      <aside className="absolute left-0 top-0 h-full w-[320px] bg-white border-r shadow-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">History</h3>
          <Button variant="ghost" className="h-8 px-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
        </p>

        <div className="mt-4 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground border rounded-xl p-3">
              No history yet.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-3 bg-white/60"
              >
                <div className="text-sm font-medium truncate" title={item.fileName}>
                  {item.fileName}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.createdAtLabel}
                </div>

                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    className="h-8 rounded-xl"
                    onClick={() => window.open(item.zipUrl, "_blank")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
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