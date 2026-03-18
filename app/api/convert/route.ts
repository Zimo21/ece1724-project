import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { readFile, writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import archiver from "archiver";
import { createWriteStream } from "fs";

const USE_DUMMY = process.env.USE_DUMMY_MODEL === "true";
const USE_VLLM  = process.env.USE_VLLM === "true";
const pythonCmd = process.env.PYTHON_PATH || "python3";

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

function runRealConversion(
  inputPath: string,
  outputDir: string,
  onProgress: (currentPage: number, totalPages: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(
      process.cwd(),
      USE_VLLM ? "run_ocr_vllm.py" : "run_dpsk_ocr2_torch.py"
    );
    const child = spawn(pythonCmd, [scriptPath, inputPath, "--output", outputDir], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let totalPages = 0;
    let buffer = "";

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const totalMatch = line.match(/^PROGRESS_TOTAL\s+(\d+)/);
        if (totalMatch) {
          totalPages = parseInt(totalMatch[1], 10);
          onProgress(0, totalPages);
          continue;
        }
        const currentMatch = line.match(/^PROGRESS_CURRENT\s+(\d+)/);
        if (currentMatch && totalPages > 0) {
          const currentPage = parseInt(currentMatch[1], 10);
          onProgress(currentPage, totalPages);
        }
      }
    };

    child.stdout?.on("data", onData);
    child.stderr?.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Python script exited with code ${code}`));
    });
  });
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
          await runRealConversion(inputPath, outputDir, (currentPage, totalPages) => {
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
