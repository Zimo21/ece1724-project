"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from "lucide-react";

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
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];

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
          alert(`Skipped ${file.name}: please upload PDF or image (PNG, JPG, WEBP).`);
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

  const handleConvert = async () => {
    const toConvert = fileList.filter((item) => item.selected);
    if (toConvert.length === 0) return;

    for (const item of toConvert) {
      setFileList((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: "converting" as Status, currentPage: 0, totalPages: 0 }
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
          throw new Error((err as { error?: string }).error || "Conversion failed");
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
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          const blob = new Blob([bytes], { type: "application/zip" });
          const url = URL.createObjectURL(blob);
          setFileList((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "done" as Status, downloadUrl: url, selected: false }
                : i
            )
          );
        } else {
          throw new Error("No result received");
        }
      } catch (error) {
        console.error("Conversion error:", error);
        const message = error instanceof Error ? error.message : "Conversion failed";
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

  const getDownloadFileName = (fileName: string) => {
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    return `${baseName}.zip`;
  };

  const hasSelected = fileList.some((item) => item.selected);
  const hasFiles = fileList.length > 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">DeepSeek OCR</h1>
        <p className="text-muted-foreground text-center text-sm">
          Convert PDF or images to Markdown
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
          onClick={handleUploadClick}
        >
          <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDF, PNG, JPG, WEBP
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

        {hasFiles && (
          <ul className="space-y-2 border rounded-lg p-3 max-h-60 overflow-y-auto">
            {fileList.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0"
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={(e) => setItemSelected(item.id, e.target.checked)}
                  disabled={item.status === "converting" || item.status === "done"}
                  className="shrink-0"
                />
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
                              ? "text-primary border-primary/30 bg-primary/10"
                              : "text-muted-foreground border-border bg-muted/30"
                      }`}
                    >
                      {getStatusLabel(item)}
                    </span>
                  </div>

                  {item.status === "converting" && (
                    <div className="mt-1">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-primary transition-all duration-300 ${
                            item.totalPages === 0 ? "animate-pulse" : ""
                          }`}
                          style={{
                            width:
                              item.totalPages > 0
                                ? `${Math.max(1, (item.currentPage / item.totalPages) * 100)}%`
                                : "60%",
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
                    <p className="mt-1 text-xs text-destructive truncate" title={item.error}>
                      {item.error}
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.downloadUrl) window.open(item.downloadUrl, "_blank");
                  }}
                  disabled={!item.downloadUrl}
                  className="h-7 px-2 text-xs shrink-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleUploadClick}>
            Upload
          </Button>
          <Button
            variant="default"
            disabled={!hasSelected}
            onClick={handleConvert}
            className={!hasSelected ? "opacity-50 cursor-not-allowed" : ""}
          >
            Convert
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {!hasFiles
              ? "No file uploaded"
              : hasSelected
                ? `${fileList.filter((i) => i.selected).length} file(s) selected — click Convert`
                : "Select one or more files to convert"}
          </p>
        </div>
      </div>
    </main>
  );
}
