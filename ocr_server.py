"""
DeepSeek OCR Server - FastAPI server using vLLM for fast inference.

Usage:
    python ocr_server.py --port 8000

The model is loaded once at startup and kept in memory for fast inference.
Requires CUDA 12.8 and vLLM.
"""

import argparse
import asyncio
import base64
import io
import os
import re
import sys
import tempfile
import threading
import time
import zipfile
from concurrent.futures import ThreadPoolExecutor
from queue import Queue

import fitz  # PyMuPDF
from PIL import Image
from vllm import LLM, SamplingParams
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Set environment variables before vLLM imports
os.environ.setdefault("CUDA_DEVICE_ORDER", "PCI_BUS_ID")
os.environ.setdefault("VLLM_ENABLE_V1_MULTIPROCESSING", "0")

# Global state
llm = None
executor = ThreadPoolExecutor(max_workers=1)

# Configuration
MODEL_PATH = "deepseek-ai/DeepSeek-OCR-2"
PROMPT = "<image>\n<|grounding|>Convert the document to markdown."
PAGE_SEP = "\n\n<--- Page Split --->\n\n"
PDF_DPI = 144
GPU_IDX = os.environ.get("CUDA_VISIBLE_DEVICES", "0")
EOS = "<｜end▁of▁sentence｜>"

# Regex patterns for post-processing
_IMAGE_TAG = re.compile(r"<\|ref\|>image<\|/ref\|><\|det\|>(.*?)<\|/det\|>", re.DOTALL)
_OTHER_TAG = re.compile(r"<\|ref\|>.*?<\|/ref\|><\|det\|>.*?<\|/det\|>", re.DOTALL)

# Regex for vLLM progress
_VLLM_PROGRESS = re.compile(r"Processed prompts:.*?\|\s*(\d+)/(\d+)")

# Progress queue
progress_queue = Queue()

app = FastAPI(title="DeepSeek OCR Server (vLLM)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def pdf_to_images(pdf_bytes: bytes) -> list[Image.Image]:
    """Convert PDF bytes to list of PIL Images."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    matrix = fitz.Matrix(PDF_DPI / 72.0, PDF_DPI / 72.0)
    pages = [
        Image.open(
            io.BytesIO(page.get_pixmap(matrix=matrix, alpha=False).tobytes("png"))
        ).convert("RGB")
        for page in doc
    ]
    doc.close()
    return pages


def load_images(file_bytes: bytes, filename: str) -> list[Image.Image]:
    """Load images from file bytes (PDF or image)."""
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        return pdf_to_images(file_bytes)
    else:
        img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        return [img]


def process_page(raw: str) -> str:
    """Clean model output: strip EOS, remove layout tags."""
    raw = raw.replace(EOS, "")
    raw = _IMAGE_TAG.sub("", raw)
    raw = _OTHER_TAG.sub("", raw)
    return raw.strip()


def process_page_with_images(
    raw: str, page_img: Image.Image, image_dir: str, page_idx: int
) -> str:
    """Clean model output: strip EOS, extract embedded images, remove layout tags."""
    raw = raw.replace(EOS, "")
    img_count = 0

    def save_image_crop(m):
        nonlocal img_count
        try:
            w, h = page_img.size
            coords = eval(m.group(1))
            for box in coords:
                if not isinstance(box, (list, tuple)) or len(box) != 4:
                    continue
                x1 = int(box[0] / 999 * w)
                y1 = int(box[1] / 999 * h)
                x2 = int(box[2] / 999 * w)
                y2 = int(box[3] / 999 * h)
                if x1 >= x2 or y1 >= y2:
                    continue
                name = f"img_{page_idx}_{img_count}.jpg"
                page_img.crop((x1, y1, x2, y2)).save(os.path.join(image_dir, name))
                img_count += 1
            return f"![](images/{name})\n" if img_count > 0 else ""
        except:
            return ""

    raw = _IMAGE_TAG.sub(save_image_crop, raw)
    raw = _OTHER_TAG.sub("", raw)
    return raw.strip()


class ProgressTracker:
    """Track vLLM progress by capturing stderr."""

    def __init__(self):
        self.temp_file = None
        self.original_stderr = None
        self.read_fd = None
        self._stop_event = threading.Event()

    def start(self):
        """Start capturing stderr to file."""
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".log")
        self.temp_file.close()

        self.original_stderr = os.dup(2)

        log_fd = os.open(self.temp_file.name, os.O_WRONLY | os.O_CREAT | os.O_TRUNC)
        os.dup2(log_fd, 2)
        os.close(log_fd)

        self.read_fd = os.open(self.temp_file.name, os.O_RDONLY)

        self._stop_event.clear()
        t = threading.Thread(target=self._reader, daemon=True)
        t.start()

    def _reader(self):
        """Read stderr and parse progress."""
        buf = b""
        while not self._stop_event.is_set():
            try:
                chunk = os.read(self.read_fd, 4096)
                if chunk:
                    buf += chunk
                    os.write(self.original_stderr, chunk)

                    text = buf.decode("utf-8", errors="replace")
                    parts = re.split(r"[\r\n]", text)
                    buf = parts[-1].encode("utf-8", errors="replace")

                    for part in parts[:-1]:
                        match = _VLLM_PROGRESS.search(part)
                        if match:
                            current, total = int(match.group(1)), int(match.group(2))
                            progress_queue.put((current, total))
                else:
                    time.sleep(0.05)
            except:
                break

        if buf:
            text = buf.decode("utf-8", errors="replace")
            match = _VLLM_PROGRESS.search(text)
            if match:
                current, total = int(match.group(1)), int(match.group(2))
                progress_queue.put((current, total))

    def stop(self):
        """Stop capturing and restore stderr."""
        self._stop_event.set()
        time.sleep(0.15)  # Give reader more time to finish

        if self.read_fd:
            try:
                os.close(self.read_fd)
            except:
                pass
            self.read_fd = None

        if self.original_stderr:
            # Clear the progress bar line completely
            try:
                os.write(self.original_stderr, b"\r" + b" " * 150 + b"\r\n")
            except:
                pass
            os.dup2(self.original_stderr, 2)
            os.close(self.original_stderr)
            self.original_stderr = None

        if self.temp_file and os.path.exists(self.temp_file.name):
            try:
                os.remove(self.temp_file.name)
            except:
                pass
            self.temp_file = None


def run_ocr_with_progress(images: list[Image.Image]) -> list[str]:
    """Run vLLM OCR with progress tracking."""
    global llm

    tracker = ProgressTracker()
    tracker.start()

    try:
        inputs = [
            {"prompt": PROMPT, "multi_modal_data": {"image": img}} for img in images
        ]
        params = SamplingParams(
            temperature=0.0,
            max_tokens=8192,
            skip_special_tokens=False,
            include_stop_str_in_output=True,
        )
        outputs = llm.generate(inputs, params)
        results = [out.outputs[0].text for out in outputs]
    finally:
        tracker.stop()

    return results


def process_file(file_bytes: bytes, filename: str):
    """Process a PDF or image file and return zip with markdown and images."""
    images = load_images(file_bytes, filename)
    total_pages = len(images)

    raw_texts = run_ocr(images)

    with tempfile.TemporaryDirectory() as tmpdir:
        images_dir = os.path.join(tmpdir, "images")
        os.makedirs(images_dir, exist_ok=True)

        md_pages = []
        for i, (text, img) in enumerate(zip(raw_texts, images)):
            cleaned = process_page_with_images(text, img, images_dir, i)
            md_pages.append(cleaned)

        markdown = PAGE_SEP.join(md_pages)

        md_path = os.path.join(tmpdir, "output.md")
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(markdown)

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.write(md_path, "output.md")
            for fname in os.listdir(images_dir):
                fpath = os.path.join(images_dir, fname)
                zf.write(fpath, os.path.join("images", fname))

        return {
            "zipBase64": base64.b64encode(zip_buffer.getvalue()).decode("utf-8"),
            "total_pages": total_pages,
        }


@app.on_event("startup")
async def load_model():
    global llm

    model_path = os.environ.get("OCR_MODEL_PATH", MODEL_PATH)

    print(f"Loading vLLM model from: {model_path}")
    print(f"CUDA_VISIBLE_DEVICES: {GPU_IDX}")
    os.environ["CUDA_VISIBLE_DEVICES"] = GPU_IDX

    llm = LLM(
        model=model_path,
        max_model_len=8192,
        gpu_memory_utilization=0.9,
        trust_remote_code=True,
        enforce_eager=True,  # skip Triton/CUDA kernel JIT compilation
    )

    print("Model loaded successfully.")


@app.get("/health")
async def health():
    return {"status": "ok", "model": "vllm", "gpu": GPU_IDX}


@app.post("/convert")
async def convert(
    file: UploadFile = File(...),
    skip_repeat: bool = Form(default=True),
):
    """
    Convert a PDF or image to markdown.

    Returns the markdown content, page count, and processing stats.
    """
    try:
        file_bytes = await file.read()
        filename = file.filename or "upload"

        def run():
            return process_file(file_bytes, filename)

        import asyncio

        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(executor, run)

        return JSONResponse(content=result)

    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/convert/stream")
async def convert_stream(
    file: UploadFile = File(...),
    skip_repeat: bool = Form(default=True),
):
    """
    Convert a PDF or image to markdown with progress updates.

    Sends SSE events:
    - progress: {"currentPage": int, "totalPages": int}
    - done: {"zipBase64": str}
    - error: {"message": str}
    """

    async def generate():
        try:
            file_bytes = await file.read()
            filename = file.filename or "upload.pdf"

            images = load_images(file_bytes, filename)
            total_pages = len(images)

            yield f'data: {{"type": "progress", "currentPage": 0, "totalPages": {total_pages}}}\n\n'

            import json

            progress_queue.queue.clear()

            def run_ocr_task():
                return run_ocr_with_progress(images)

            loop = asyncio.get_event_loop()
            future = loop.run_in_executor(executor, run_ocr_task)

            # Poll for progress during OCR
            last_progress = 0
            while not future.done():
                try:
                    while True:
                        current, _ = progress_queue.get_nowait()
                        if current > last_progress:
                            yield f'data: {{"type": "progress", "currentPage": {current}, "totalPages": {total_pages}}}\n\n'
                            last_progress = current
                except:
                    pass
                await asyncio.sleep(0.05)

            raw_texts = await future

            # Final drain
            try:
                while True:
                    current, _ = progress_queue.get_nowait()
                    if current > last_progress:
                        yield f'data: {{"type": "progress", "currentPage": {current}, "totalPages": {total_pages}}}\n\n'
                        last_progress = current
            except:
                pass

            with tempfile.TemporaryDirectory() as tmpdir:
                images_dir = os.path.join(tmpdir, "images")
                os.makedirs(images_dir, exist_ok=True)

                md_pages = []
                for i, (text, img) in enumerate(zip(raw_texts, images)):
                    cleaned = process_page_with_images(text, img, images_dir, i)
                    md_pages.append(cleaned)
                    page_num = i + 1
                    if page_num > last_progress:
                        yield f'data: {{"type": "progress", "currentPage": {page_num}, "totalPages": {total_pages}}}\n\n'
                        last_progress = page_num

                markdown = PAGE_SEP.join(md_pages)

                md_path = os.path.join(tmpdir, "output.md")
                with open(md_path, "w", encoding="utf-8") as f:
                    f.write(markdown)

                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
                    zf.write(md_path, "output.md")
                    for fname in os.listdir(images_dir):
                        fpath = os.path.join(images_dir, fname)
                        zf.write(fpath, os.path.join("images", fname))

                zip_base64 = base64.b64encode(zip_buffer.getvalue()).decode("utf-8")
                yield f'data: {{"type": "done", "zipBase64": {json.dumps(zip_base64)}}}\n\n'

        except Exception as e:
            import traceback

            traceback.print_exc()
            import json

            error_json = json.dumps(str(e))
            yield f'data: {{"type": "error", "message": {error_json}}}\n\n'

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DeepSeek OCR Server (vLLM)")
    parser.add_argument("--port", type=int, default=8000, help="Port to run server on")
    parser.add_argument(
        "--model", default=MODEL_PATH, help="Model path or HuggingFace ID"
    )
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind to")
    parser.add_argument(
        "--gpu", default="0", help="GPU index to use (CUDA_VISIBLE_DEVICES)"
    )
    args = parser.parse_args()

    os.environ["OCR_MODEL_PATH"] = args.model
    GPU_IDX = args.gpu

    print(f"Starting vLLM OCR server on {args.host}:{args.port}")
    print(f"Model: {args.model}")
    print(f"GPU: {args.gpu}")
    print("Press Ctrl+C to stop")

    uvicorn.run(app, host=args.host, port=args.port)
