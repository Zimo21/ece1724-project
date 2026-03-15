import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { readFile, writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import archiver from "archiver";
import { createWriteStream } from "fs";

const execFileAsync = promisify(execFile);

const USE_DUMMY = process.env.USE_DUMMY_MODEL === "true";

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
  await writeFile(join(outputDir, `${baseName}.mmd`), DUMMY_MARKDOWN);
}

async function runRealConversion(inputPath: string, outputDir: string): Promise<void> {
  const scriptPath = join(process.cwd(), "run_dpsk_ocr2_torch.py");
  await execFileAsync("python3", [scriptPath, inputPath, "--output", outputDir], {
    maxBuffer: 1024 * 1024 * 100,
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
    } else {
      await runRealConversion(inputPath, outputDir);
    }

    const outputPath = join(outputDir, `${baseName}.mmd`);
    
    if (!existsSync(outputPath)) {
      throw new Error(`Output file not found: ${outputPath}`);
    }

    const zipPath = join(uploadDir, `${baseName}.zip`);
    await createZip(outputDir, zipPath);

    const zipBuffer = await readFile(zipPath);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${baseName}.zip"`,
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    const message = error instanceof Error ? error.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    try {
      await rm(uploadDir, { recursive: true, force: true });
    } catch {}
  }
}