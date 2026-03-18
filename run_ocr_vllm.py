"""
DeepSeek-OCR-2 inference script using vLLM.

Usage:
    python run_ocr.py [--output DIR] <file1> [file2] ...

Supports .pdf, .png, .jpg, .jpeg, .webp, .bmp, .tiff.
Each input produces a <name>_ocr_output/ folder containing:
  - <name>.md        full markdown (pages separated by page markers)
  - images/          figures cropped from the document

If --output DIR is given, all output folders are created inside DIR instead
of next to each input file.
"""

import argparse
import io
import os
import re
import sys

os.environ.setdefault("CUDA_DEVICE_ORDER", "PCI_BUS_ID")
os.environ.setdefault("VLLM_ENABLE_V1_MULTIPROCESSING", "0")

import fitz
from PIL import Image
from vllm import LLM, SamplingParams
from vllm.model_executor.models.registry import ModelRegistry



# ── Configuration ─────────────────────────────────────────────────────────────

MODEL_PATH = "deepseek-ai/DeepSeek-OCR-2"
PROMPT     = "<image>\n<|grounding|>Convert the document to markdown."
PAGE_SEP   = "\n\n<--- Page Split --->\n\n"
PDF_DPI    = 144
GPU_IDX    = "0"

# ── Image loading ──────────────────────────────────────────────────────────────

def pdf_to_images(pdf_path: str) -> list[Image.Image]:
    doc = fitz.open(pdf_path)
    matrix = fitz.Matrix(PDF_DPI / 72.0, PDF_DPI / 72.0)
    pages = [
        Image.open(
            io.BytesIO(page.get_pixmap(matrix=matrix, alpha=False).tobytes("png"))
        ).convert("RGB")
        for page in doc
    ]
    doc.close()
    return pages


def load_inputs(paths: list[str]) -> tuple[list[Image.Image], list[str], list[str]]:
    """Expand input paths into (images, page_labels, source_paths)."""
    images, labels, sources = [], [], []
    for path in paths:
        if path.lower().endswith(".pdf"):
            for i, page in enumerate(pdf_to_images(path)):
                images.append(page)
                labels.append(f"{path}  [page {i + 1}]")
                sources.append(path)
        else:
            images.append(Image.open(path).convert("RGB"))
            labels.append(path)
            sources.append(path)
    return images, labels, sources


# ── Inference ─────────────────────────────────────────────────────────────────

def run_ocr(llm: LLM, images: list[Image.Image]) -> list[str]:
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
    return [out.outputs[0].text for out in llm.generate(inputs, params)]


# ── Post-processing ────────────────────────────────────────────────────────────

_IMAGE_TAG = re.compile(
    r"<\|ref\|>image<\|/ref\|><\|det\|>(.*?)<\|/det\|>", re.DOTALL
)
_OTHER_TAG = re.compile(
    r"<\|ref\|>.*?<\|/ref\|><\|det\|>.*?<\|/det\|>", re.DOTALL
)
_EOS = "<｜end▁of▁sentence｜>"


def process_page(
    raw: str,
    page_img: Image.Image,
    img_dir: str,
    page_idx: int,
) -> str:
    """Clean model output: strip EOS, crop embedded figures, remove layout tags."""
    raw = raw.replace(_EOS, "")
    img_count = 0

    def save_image_crop(m: re.Match) -> str:
        nonlocal img_count
        try:
            w, h = page_img.size
            for box in eval(m.group(1)):
                x1 = int(box[0] / 999 * w)
                y1 = int(box[1] / 999 * h)
                x2 = int(box[2] / 999 * w)
                y2 = int(box[3] / 999 * h)
                name = f"img_{page_idx}_{img_count}.jpg"
                page_img.crop((x1, y1, x2, y2)).save(os.path.join(img_dir, name))
                img_count += 1
            return f"![](images/{name})\n"
        except Exception:
            return ""

    raw = _IMAGE_TAG.sub(save_image_crop, raw)
    raw = _OTHER_TAG.sub("", raw)
    return raw.strip()


# ── Output ─────────────────────────────────────────────────────────────────────

def save_outputs(
    images: list[Image.Image],
    sources: list[str],
    raw_texts: list[str],
    output_dir: str | None = None,
) -> None:
    # Group pages by source file
    grouped: dict[str, list[tuple[Image.Image, str]]] = {}
    for img, src, text in zip(images, sources, raw_texts):
        grouped.setdefault(src, []).append((img, text))

    for src, pages in grouped.items():
        stem = os.path.splitext(os.path.basename(src))[0]
        if output_dir is not None:
            out_dir = output_dir
        else:
            out_dir = os.path.join(os.path.dirname(src), stem + "_ocr_output")
        img_dir  = os.path.join(out_dir, "images")
        os.makedirs(img_dir, exist_ok=True)

        md_pages = [
            process_page(text, img, img_dir, i)
            for i, (img, text) in enumerate(pages)
        ]

        md_path = os.path.join(out_dir, stem + ".md")
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(PAGE_SEP.join(md_pages))

        print(f"  → {md_path}")
        if any(os.scandir(img_dir)):
            print(f"  → {img_dir}/")


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="DeepSeek-OCR-2 inference script using vLLM.",
        epilog="Supports .pdf, .png, .jpg, .jpeg, .webp, .bmp, .tiff.",
    )
    parser.add_argument("files", nargs="+", metavar="FILE", help="Input file(s) to process.")
    parser.add_argument(
        "--output", "-o",
        metavar="DIR",
        default=None,
        help="Directory where output folders are written. "
             "Defaults to each input file's own directory.",
    )
    args = parser.parse_args()

    missing = [p for p in args.files if not os.path.exists(p)]
    if missing:
        for p in missing:
            print(f"Error: file not found: {p}")
        sys.exit(1)

    if args.output is not None:
        os.makedirs(args.output, exist_ok=True)

    os.environ["CUDA_VISIBLE_DEVICES"] = GPU_IDX

    images, labels, sources = load_inputs(args.files)
    print(f"Loaded {len(images)} page(s) from {len(args.files)} file(s).")

    llm = LLM(
        model=MODEL_PATH,
        max_model_len=8192,
        gpu_memory_utilization=0.9,
        trust_remote_code=True,
        enforce_eager=True,  # skip Triton/CUDA kernel JIT compilation
    )

    print("Running OCR...")
    raw_texts = run_ocr(llm, images)

    print("\nSaving outputs:")
    save_outputs(images, sources, raw_texts, output_dir=args.output)
