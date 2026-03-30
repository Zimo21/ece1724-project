"""
DeepSeek OCR Server - FastAPI server using vLLM for fast inference.

Usage:
    python ocr_server.py --port 8000

The model is loaded once at startup and kept in memory for fast inference.
Requires CUDA 12.8 and vLLM.
"""

import argparse
import io
import os
import re
import tempfile
from concurrent.futures import ThreadPoolExecutor

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
_IMAGE_TAG = re.compile(
    r"<\|ref\|>image<\|/ref\|><\|det\|>(.*?)<\|/det\|>", re.DOTALL
)
_OTHER_TAG = re.compile(
    r"<\|ref\|>.*?<\|/ref\|><\|det\|>.*?<\|/det\|>", re.DOTALL
)

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
    raw = _IMAGE_TAG.sub("", raw)  # Image references - just remove for now
    raw = _OTHER_TAG.sub("", raw)
    return raw.strip()


def run_ocr(images: list[Image.Image]) -> list[str]:
    """Run vLLM OCR on a list of images."""
    global llm

    inputs = [
        {"prompt": PROMPT, "multi_modal_data": {"image": img}}
        for img in images
    ]
    params = SamplingParams(
        temperature=0.0,
        max_tokens=8192,
        skip_special_tokens=False,
        include_stop_str_in_output=True,
    )
    outputs = llm.generate(inputs, params)
    return [out.outputs[0].text for out in outputs]


def process_file(file_bytes: bytes, filename: str):
    """Process a PDF or image file and return markdown content."""
    images = load_images(file_bytes, filename)
    total_pages = len(images)

    raw_texts = run_ocr(images)

    # Process each page
    md_pages = []
    for text in raw_texts:
        cleaned = process_page(text)
        md_pages.append(cleaned)

    markdown = PAGE_SEP.join(md_pages)

    return {
        "markdown": markdown,
        "total_pages": total_pages,
        "processed_pages": total_pages,
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
    - done: {"markdown": str}
    - error: {"message": str}
    """
    async def generate():
        try:
            file_bytes = await file.read()
            filename = file.filename or "upload.pdf"

            images = load_images(file_bytes, filename)
            total_pages = len(images)

            yield f'data: {{"type": "progress", "currentPage": 0, "totalPages": {total_pages}}}\n\n'

            import asyncio

            def run_ocr_task():
                return run_ocr(images)

            loop = asyncio.get_event_loop()
            raw_texts = await loop.run_in_executor(executor, run_ocr_task)

            # Process each page and send progress
            md_pages = []
            for i, text in enumerate(raw_texts):
                cleaned = process_page(text)
                md_pages.append(cleaned)
                yield f'data: {{"type": "progress", "currentPage": {i + 1}, "totalPages": {total_pages}}}\n\n'

            markdown = PAGE_SEP.join(md_pages)

            # Escape for JSON
            import json
            markdown_json = json.dumps(markdown)
            yield f'data: {{"type": "done", "markdown": {markdown_json}}}\n\n'

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