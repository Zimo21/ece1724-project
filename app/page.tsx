"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2, X } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import { signOutUser } from "@/lib/auth/actions";
import { HistoryDrawer } from "@/components/ui/history/historyDrawer";
import { SharedDrawer } from "@/components/ui/history/sharedDrawer";
import { saveToHistory } from "@/lib/history/actions";
import { shareFile } from "@/lib/history/shareActions";

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
  const [sharedOpen, setSharedOpen] = useState(false);
  const [shareModal, setShareModal] = useState<{
    open: boolean;
    fileName: string;
    storagePath: string;
  } | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, loading: authLoading } = useAuth();

  const handleShare = (fileName: string, storagePath: string) => {
    setShareModal({ open: true, fileName, storagePath });
    setShareEmail("");
  };

  const handleShareSubmit = async () => {
    if (!shareModal || !shareEmail.trim()) return;
    setSharing(true);
    try {
      const result = await shareFile(
        shareEmail.trim(),
        shareModal.fileName,
        shareModal.storagePath
      );
      if (result.success) {
        setShareModal(null);
      } else {
        alert(result.error || "Failed to share file");
      }
    } catch (error) {
      console.error("Share error:", error);
      alert("Failed to share file");
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p>Redirecting…</p>
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

          saveToHistory(user.uid, item.name.replace(/\.[^/.]+$/, "") + ".zip", blob)
            .catch(console.error);

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

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#eef2ff,_white_60%)] text-neutral-900">

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 right-8 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 opacity-70 blur-3xl" />
        <div className="absolute bottom-8 left-8 h-80 w-80 rounded-full bg-gradient-to-br from-teal-200 via-cyan-300 to-blue-300 opacity-70 blur-3xl" />
        <div className="absolute top-32 left-1/2 h-48 w-48 -translate-x-1/2 rounded-3xl bg-gradient-to-br from-pink-300 to-orange-300 opacity-80 blur-2xl" />
      </div>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onShare={handleShare}
      />
      <SharedDrawer open={sharedOpen} onClose={() => setSharedOpen(false)} />

      <div className="relative z-10 min-h-screen w-full px-6 py-10 flex items-center justify-center">
        <div className="w-full max-w-5xl rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg backdrop-blur">
      
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">DeepSeek OCR</h1>
              <p className="text-sm text-neutral-500">
                Convert PDF or images to Markdown
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <div className="text-sm text-neutral-600">
                Signed in as{" "}
                <span className="font-medium text-neutral-900">
                  {user.email ?? user.uid}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" onClick={() => setHistoryOpen(true)}>
                  History
                </Button>
                <Button variant="outline" onClick={() => setSharedOpen(true)}>
                  Shared with me
                </Button>
                <Button variant="outline" onClick={() => signOutUser()}>
                  Sign out
                </Button>
              </div>
            </div>
          </div>

     
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadClick}
            className={`mt-6 rounded-2xl border-2 border-dashed p-6 transition ${
              isDragging
                ? "border-indigo-400 bg-indigo-50"
                : "border-neutral-200 bg-neutral-50"
            } cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2 shadow-sm">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium">
                  Drag and drop files here, or click to select
                </div>
                <div className="text-xs text-neutral-500">
                  Supports PDF, PNG, JPG, WEBP
                </div>
              </div>
            </div>
            {isDragging && (
              <div className="mt-3 text-sm text-indigo-600">
                Drop to add files…
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />

      
          {hasFiles && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Files</div>
                <div className="text-sm text-neutral-500">
                  {hasSelected
                    ? `${fileList.filter((i) => i.selected).length} selected`
                    : "Select file(s) to convert"}
                </div>
              </div>

              <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
                {fileList.map((item) => (
                  <li key={item.id} className="p-4 flex items-start gap-3">
                    {item.status === "done" ? (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg border border-neutral-200 bg-white p-2 hover:bg-neutral-50"
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
                        className="mt-1 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium break-all">
                        {item.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Status: {getStatusLabel(item)}
                      </div>

                      {item.status === "converting" && (
                        <div className="mt-2">
                          <div className="h-2 w-full rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full bg-indigo-600"
                              style={{
                                width:
                                  item.totalPages > 0
                                    ? `${Math.max(
                                        1,
                                        (item.currentPage / item.totalPages) * 100
                                      )}%`
                                    : "0%",
                              }}
                            />
                          </div>
                          <div className="mt-1 text-xs text-neutral-500">
                            {item.totalPages > 0
                              ? `Page ${item.currentPage} of ${item.totalPages}`
                              : "Starting…"}
                          </div>
                        </div>
                      )}

                      {item.error && (
                        <div className="mt-2 text-xs text-red-600">
                          Error: {item.error}
                        </div>
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
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleUploadClick}>
              Upload
            </Button>
            <Button
              variant="default"
              disabled={!hasSelected}
              onClick={handleConvert}
            >
              Convert
            </Button>
          </div>

          <div className="mt-4 text-sm text-neutral-500">
            {!hasFiles
              ? "No file uploaded"
              : hasSelected
              ? `${fileList.filter((i) => i.selected).length} file(s) selected — click Convert`
              : "Select one or more files to convert"}
          </div>
        </div>
      </div>
    </main>
  );
}