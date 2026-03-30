import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { extname } from "path";
import { existsSync } from "fs";
import archiver from "archiver";
import { createWriteStream } from "fs";

const USE_DUMMY = process.env.USE_DUMMY_MODEL?.toLowerCase() === "true";
const OCR_SERVER_URL = process.env.OCR_SERVER_URL || "http://127.0.0.1:8000";

const DUMMY_MARKDOWN = `# Sample Document

This is a **dummy** markdown file generated for testing purposes.

## Section 1

- Item 1
- Item 2
- Item 3

### Subsection

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

`;

function sendSSE(
  controller: ReadableStreamDefaultController<Uint8Array>,
  obj: { type: string; currentPage?: number; totalPages?: number; zipBase64?: string; message?: string }
) {
  controller.enqueue(new TextEncoder().encode("data: " + JSON.stringify(obj) + "\n\n"));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createZip(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err: Error) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function runDummyConversion(outputDir: string, baseName: string): Promise<void> {
  await writeFile(join(outputDir, `${baseName}.md`), DUMMY_MARKDOWN);
}

async function runServerConversion(
  inputPath: string,
  outputDir: string,
  baseName: string,
  onProgress: (currentPage: number, totalPages: number) => void
): Promise<void> {
  const fileBuffer = await readFile(inputPath);
  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]), baseName + extname(inputPath));

  const response = await fetch(`${OCR_SERVER_URL}/convert/stream`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OCR server error: ${error}`);
  }

  if (!response.body) {
    throw new Error("No response body from OCR server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let markdown: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const payload = JSON.parse(line.slice(6));
          if (payload.type === "progress" && payload.currentPage != null && payload.totalPages != null) {
            onProgress(payload.currentPage, payload.totalPages);
          } else if (payload.type === "done" && payload.markdown != null) {
            markdown = payload.markdown;
          } else if (payload.type === "error") {
            throw new Error(payload.message || "OCR server error");
          }
        } catch {
          // Ignore parse errors for non-JSON lines
        }
      }
    }
  }

  // Process any remaining data in buffer
  if (buffer.startsWith("data: ")) {
    try {
      const payload = JSON.parse(buffer.slice(6));
      if (payload.type === "done" && payload.markdown != null) {
        markdown = payload.markdown;
      } else if (payload.type === "error") {
        throw new Error(payload.message || "OCR server error");
      }
    } catch {
      // Ignore parse errors
    }
  }

  if (markdown == null) {
    throw new Error("No markdown received from OCR server");
  }

  await writeFile(join(outputDir, `${baseName}.md`), markdown);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const inputName = file.name;
  const baseName = inputName.replace(/\.[^/.]+$/, "");
  const uploadDir = join(process.cwd(), "temp_uploads", Date.now().toString());
  const outputDir = join(uploadDir, "output");
  const inputPath = join(uploadDir, inputName);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await mkdir(uploadDir, { recursive: true });
        await mkdir(outputDir, { recursive: true });

        if (!USE_DUMMY) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(inputPath, buffer);
        }

        if (USE_DUMMY) {
          await runDummyConversion(outputDir, baseName);
          const totalPages = 5;
          for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            sendSSE(controller, { type: "progress", currentPage, totalPages });
            await sleep(250);
          }
        } else {
          await runServerConversion(inputPath, outputDir, baseName, (currentPage, totalPages) => {
            sendSSE(controller, { type: "progress", currentPage, totalPages });
          });
        }

        const outputPath = join(outputDir, `${baseName}.md`);
        if (!existsSync(outputPath)) {
          throw new Error(`Output file not found: ${outputPath}`);
        }

        const zipPath = join(uploadDir, `${baseName}.zip`);
        await createZip(outputDir, zipPath);
        const zipBuffer = await readFile(zipPath);
        const zipBase64 = zipBuffer.toString("base64");
        sendSSE(controller, { type: "done", zipBase64 });
      } catch (error) {
        console.error("Conversion error:", error);
        const message = error instanceof Error ? error.message : "Conversion failed";
        sendSSE(controller, { type: "error", message });
      } finally {
        try {
          await rm(uploadDir, { recursive: true, force: true });
        } catch {}
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}