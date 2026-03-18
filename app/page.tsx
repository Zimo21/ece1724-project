"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2 } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import { signOutUser } from "@/lib/auth/actions";
import { Menu } from "lucide-react";
import { HistoryDrawer, type HistoryItem } from "@/components/ui/history/historyDrawer";

type Status = "idle" | "uploaded" | "converting" | "done";

type FileItem = {
  id: string;
  file: File;
  name: string;
  selected: boolean;
  status: Status;
  currentPage: number;
  totalPages: number;
  downloadUrl: string | null;
  error?: string;
};

export default function Home() {
  const router = useRouter();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Redirecting…</p>
      </main>
    );
  }

  const validTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  const getStatusLabel = (item: FileItem) => {
    if (item.error) return "Error";
    if (item.status === "idle") return "Queued";
    if (item.status === "uploaded") return "Ready to Convert";
    if (item.status === "converting") return "Converting";
    if (item.status === "done") return "Done";
    return "Queued";
  };

  const handleFileSelect = (files: File[] | FileList) => {
    const arr = Array.from(files);
    const newItems: FileItem[] = arr
      .filter((file) => {
        if (!validTypes.includes(file.type)) {
          alert(
            `Skipped ${file.name}: please upload PDF or image (PNG, JPG, WEBP).`
          );
          return false;
        }
        return true;
      })
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        selected: true,
        status: "uploaded" as Status,
        currentPage: 0,
        totalPages: 0,
        downloadUrl: null,
      }));

    setFileList((prev) => [...prev, ...newItems]);
  };

  

// TEMP: stubbed data (later replace with Firestore query)
const historyItems: HistoryItem[] = [
  {
    id: "1",
    fileName: "sample-output.zip",
    createdAtLabel: "Mar 18, 2026 • 10:12 AM",
    zipUrl: "https://example.com/sample-output.zip",
  },
];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.length) handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) handleFileSelect(files);
    e.target.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const setItemSelected = (id: string, selected: boolean) => {
    setFileList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected } : item))
    );
  };

  const removeItem = (id: string) => {
    setFileList((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleConvert = async () => {
 
    if (!user) {
      alert("Please sign in to convert files.");
      return;
    }

    const toConvert = fileList.filter((item) => item.selected);
    if (toConvert.length === 0) return;

    for (const item of toConvert) {
      setFileList((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: "converting" as Status,
                currentPage: 0,
                totalPages: 0,
              }
            : i
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);

        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(
            (err as { error?: string }).error || "Conversion failed"
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let zipBase64: string | null = null;
        let errorMessage: string | null = null;

        const processSseBuffer = (chunkText: string) => {
          buffer += chunkText;
          const parts = buffer.split(/\r?\n\r?\n/);
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const dataLine = part
              .split(/\r?\n/)
              .find((line) => line.startsWith("data: "));
            if (!dataLine) continue;

            try {
              const payload = JSON.parse(dataLine.slice(6)) as {
                type: string;
                currentPage?: number;
                totalPages?: number;
                zipBase64?: string;
                message?: string;
              };

              if (
                payload.type === "progress" &&
                payload.currentPage != null &&
                payload.totalPages != null
              ) {
                setFileList((prev) =>
                  prev.map((i) =>
                    i.id === item.id
                      ? {
                          ...i,
                          currentPage: payload.currentPage!,
                          totalPages: payload.totalPages!,
                        }
                      : i
                  )
                );
              } else if (payload.type === "done" && payload.zipBase64) {
                zipBase64 = payload.zipBase64;
              } else if (payload.type === "error" && payload.message) {
                errorMessage = payload.message;
              }
            } catch {
              // ignore parse errors
            }
          }
        };

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            processSseBuffer(decoder.decode(value, { stream: true }));
          }
          processSseBuffer(decoder.decode());
        }

        if (errorMessage) throw new Error(errorMessage);

        if (zipBase64) {
          const binary = atob(zipBase64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "application/zip" });
          const url = URL.createObjectURL(blob);

          setFileList((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: "done" as Status,
                    downloadUrl: url,
                    selected: false,
                  }
                : i
            )
          );
        } else {
          throw new Error("No result received");
        }
      } catch (error) {
        console.error("Conversion error:", error);
        const message =
          error instanceof Error ? error.message : "Conversion failed";

        setFileList((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "uploaded" as Status, error: message }
              : i
          )
        );

        alert(message);
      }
    }
  };

  const hasSelected = fileList.some((item) => item.selected);
  const hasFiles = fileList.length > 0;
  <HistoryDrawer
  open={historyOpen}
  onClose={() => setHistoryOpen(false)}
  items={historyItems}
/>
  return (
    <main className="min-h-screen bg-white">
      {/* Background blobs to match auth pages */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200 to-fuchsia-200 blur-2xl opacity-60" />
        <div className="absolute top-10 right-24 h-44 w-44 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 blur-2xl opacity-70" />
        <div className="absolute bottom-20 right-28 h-56 w-56 rounded-full bg-gradient-to-br from-cyan-200 to-indigo-200 blur-2xl opacity-60" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 py-12">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-cyan-400 opacity-90" /> */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                DeepSeek OCR
              </h1>
              <p className="text-sm text-muted-foreground">
                Convert PDF or images to Markdown
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-3 rounded-2xl border bg-white/60 p-3 shadow-sm backdrop-blur sm:min-w-[360px]">
            <p className="text-xs text-muted-foreground truncate">
              Signed in as{" "}
              <span className="font-medium text-foreground">
                {user.email ?? user.uid}
              </span>
            </p>
            <Button
              variant="outline"
              onClick={() => signOutUser()}
              className="h-9 rounded-xl"
            >
              Sign out
            </Button>
          </div>
        </header>

        {/* Main card */}
        <section className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur">
          {/* Upload dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadClick}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-border hover:border-indigo-400"
            }`}
          >
            <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to select (PDF, PNG, JPG, WEBP)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />

          {/* File list */}
          {hasFiles && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Files</p>
                <p className="text-xs text-muted-foreground">
                  {hasSelected
                    ? `${fileList.filter((i) => i.selected).length} selected`
                    : "Select file(s) to convert"}
                </p>
              </div>

              <ul className="space-y-2 rounded-2xl border bg-white/60 p-3 max-h-64 overflow-y-auto">
                {fileList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 rounded-xl px-2 py-2 border border-border/50 bg-white/40"
                  >
                    {item.status === "done" ? (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) =>
                          setItemSelected(item.id, e.target.checked)
                        }
                        disabled={item.status === "converting"}
                        className="shrink-0 mt-1"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate text-sm" title={item.name}>
                          {item.name}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${
                            item.error
                              ? "text-destructive border-destructive/30 bg-destructive/5"
                              : item.status === "done"
                                ? "text-emerald-700 border-emerald-700/20 bg-emerald-500/10"
                                : item.status === "converting"
                                  ? "text-indigo-700 border-indigo-700/20 bg-indigo-500/10"
                                  : "text-muted-foreground border-border bg-muted/30"
                          }`}
                        >
                          {getStatusLabel(item)}
                        </span>
                      </div>

                      {item.status === "converting" && (
                        <div className="mt-2">
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-indigo-600 transition-all duration-300 ${
                                item.totalPages === 0 ? "animate-pulse" : ""
                              }`}
                              style={{
                                width:
                                  item.totalPages > 0
                                    ? `${Math.max(
                                        1,
                                        (item.currentPage / item.totalPages) *
                                          100
                                      )}%`
                                    : "0%",
                              }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {item.totalPages > 0
                              ? `Page ${item.currentPage} of ${item.totalPages}`
                              : "Starting…"}
                          </p>
                        </div>
                      )}

                      {item.error && (
                        <p
                          className="mt-1 text-xs text-destructive truncate"
                          title={item.error}
                        >
                          {item.error}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.downloadUrl)
                          window.open(item.downloadUrl, "_blank");
                      }}
                      disabled={!item.downloadUrl}
                      className="h-8 px-2 text-xs shrink-0 rounded-xl"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={handleUploadClick}
              className="rounded-xl"
            >
              Upload
            </Button>

            <Button
              variant="default"
              disabled={!hasSelected}
              onClick={handleConvert}
              className={`rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 ${
                !hasSelected ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Convert
            </Button>
          </div>

          {/* Footer helper text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Upload one or more files, select them, then click Convert.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}