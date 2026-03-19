"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2 } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import { signOutUser } from "@/lib/auth/actions";
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

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={historyItems}
      />

      <div className="w-full max-w-3xl border border-black bg-white p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">DeepSeek OCR</h1>
            <p className="text-sm">Convert PDF or images to Markdown</p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="text-sm">
              Signed in as{" "}
              <span className="font-medium">{user.email ?? user.uid}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setHistoryOpen(true)}>
                History
              </Button>
              <Button variant="outline" onClick={() => signOutUser()}>
                Sign out
              </Button>
            </div>
          </div>
        </div>

        {/* Upload box */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
          className="mt-6 border border-black p-6 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5" />
            <div>
              <div className="text-sm font-medium">
                Drag and drop files here, or click to select
              </div>
              <div className="text-xs">Supports PDF, PNG, JPG, WEBP</div>
            </div>
          </div>
          {isDragging && <div className="mt-3 text-sm">Drop to add files…</div>}
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
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Files</div>
              <div className="text-sm">
                {hasSelected
                  ? `${fileList.filter((i) => i.selected).length} selected`
                  : "Select file(s) to convert"}
              </div>
            </div>

            <ul className="border border-black">
              {fileList.map((item, idx) => (
                <li
                  key={item.id}
                  className={`p-3 flex items-start gap-3 ${
                    idx !== fileList.length - 1 ? "border-b border-black" : ""
                  }`}
                >
                  {item.status === "done" ? (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="border border-black px-2 py-1"
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
                      className="mt-1"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium break-all">
                      {item.name}
                    </div>
                    <div className="text-sm">Status: {getStatusLabel(item)}</div>

                    {item.status === "converting" && (
                      <div className="mt-2">
                        {/* Progress bar (black/white) */}
                        <div className="h-2 w-full border border-black">
                          <div
                            className="h-full bg-black"
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

                        <div className="mt-1 text-sm">
                          {item.totalPages > 0
                            ? `Page ${item.currentPage} of ${item.totalPages}`
                            : "Starting…"}
                        </div>
                      </div>
                    )}

                    {item.error && (
                      <div className="mt-2 text-sm">Error: {item.error}</div>
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

        {/* Actions */}
        <div className="mt-6 flex gap-3">
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

        <div className="mt-4 text-sm">
          {!hasFiles
            ? "No file uploaded"
            : hasSelected
              ? `${fileList.filter((i) => i.selected).length} file(s) selected — click Convert`
              : "Select one or more files to convert"}
        </div>
      </div>
    </main>
  );
}