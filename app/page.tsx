"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

type Status = "idle" | "uploaded" | "converting" | "done";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or image file (PNG, JPG)");
      return;
    }
    setSelectedFile(file);
    setFileName(file.name);
    setStatus("uploaded");
    setDownloadUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
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
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConvert = async () => {
    if (status !== "uploaded" || !selectedFile) return;
    
    setStatus("converting");
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Conversion failed");
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("done");
    } catch (error) {
      console.error("Conversion error:", error);
      alert(error instanceof Error ? error.message : "Failed to convert file. Please try again.");
      setStatus("uploaded");
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "idle":
        return "No file uploaded";
      case "uploaded":
        return `Ready to convert: ${fileName}`;
      case "converting":
        return "Converting... Please wait.";
      case "done":
        return "Conversion complete!";
      default:
        return "";
    }
  };

  const getDownloadFileName = () => {
    if (!fileName) return "converted.zip";
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    return `${baseName}.zip`;
  };

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
            Drag and drop a file here, or click to select
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDF, PNG, JPG, WEBP
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleUploadClick}>
            Upload
          </Button>
          <Button
            variant="default"
            disabled={status !== "uploaded"}
            onClick={handleConvert}
            className={status !== "uploaded" ? "opacity-50 cursor-not-allowed" : ""}
          >
            Convert
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>
          {status === "done" && downloadUrl && (
            <a
              href={downloadUrl}
              download={getDownloadFileName()}
              className="inline-flex items-center gap-1 mt-2 text-primary hover:underline"
            >
              <FileText className="h-4 w-4" />
              Download {getDownloadFileName()}
            </a>
          )}
          {status === "uploaded" && fileName && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <FileText className="h-3 w-3" />
              {fileName}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}