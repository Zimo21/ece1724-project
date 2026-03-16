import os
import warnings
import fitz
import img2pdf
import io
import re
import shutil
import argparse
import traceback
from pathlib import Path
from tqdm import tqdm
import torch
import transformers
from transformers import AutoModel, AutoTokenizer, TextStreamer

from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Suppress noisy warnings emitted by model.infer() -> generate() that we
# cannot fix without modifying the cached model file.
warnings.filterwarnings("ignore", message="The attention mask and the pad token id were not set.*")
warnings.filterwarnings("ignore", message="`do_sample` is set to `False`.*`temperature`.*")
transformers.logging.set_verbosity_error()

if torch.cuda.is_available():
    if torch.version.cuda == "11.8":
        os.environ["TRITON_PTXAS_PATH"] = "/usr/local/cuda-11.8/bin/ptxas"
    os.environ["CUDA_VISIBLE_DEVICES"] = "0"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# --- Configuration defaults (override via CLI args) ---
DEFAULT_MODEL_PATH = "deepseek-ai/DeepSeek-OCR-2"
DEFAULT_OUTPUT_PATH = "output"
DEFAULT_PROMPT = "<image>\n<|grounding|>Convert the document to markdown."
DEFAULT_DPI = 144
DEFAULT_BASE_SIZE = 1024
DEFAULT_IMAGE_SIZE = 768

PDF_EXTENSIONS  = {".pdf"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif", ".webp"}


class Colors:
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    RESET = "\033[0m"


# ---------------------------------------------------------------------------
# Input loading
# ---------------------------------------------------------------------------

def detect_input_type(path: str) -> str:
    """Return 'pdf' or 'image' based on file extension, or raise if unknown."""
    ext = Path(path).suffix.lower()
    if ext in PDF_EXTENSIONS:
        return "pdf"
    if ext in IMAGE_EXTENSIONS:
        return "image"
    raise ValueError(
        f"Cannot detect input type for '{path}' (extension: '{ext}'). "
        f"Use --type pdf or --type image to specify manually."
    )


def load_pdf(pdf_path: str, dpi: int = 144) -> list[Image.Image]:
    images = []
    pdf_document = fitz.open(pdf_path)
    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)
    Image.MAX_IMAGE_PIXELS = None

    for page_num in range(pdf_document.page_count):
        page = pdf_document[page_num]
        pixmap = page.get_pixmap(matrix=matrix, alpha=False)
        img = Image.open(io.BytesIO(pixmap.tobytes("png")))
        images.append(img)

    pdf_document.close()
    return images


def load_image(image_path: str) -> list[Image.Image]:
    Image.MAX_IMAGE_PIXELS = None
    img = Image.open(image_path)
    # Ensure a concrete copy is loaded into memory before the file handle closes
    img.load()
    return [img]


# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------

def pil_to_pdf_img2pdf(pil_images: list[Image.Image], output_path: str) -> None:
    if not pil_images:
        return
    image_bytes_list = []
    for img in pil_images:
        if img.mode != "RGB":
            img = img.convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=95)
        image_bytes_list.append(buf.getvalue())
    try:
        pdf_bytes = img2pdf.convert(image_bytes_list)
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)
    except Exception as e:
        print(f"error writing layout PDF: {e}")


# ---------------------------------------------------------------------------
# Post-processing helpers
# ---------------------------------------------------------------------------

def re_match(text: str):
    pattern = r"(<\|ref\|>(.*?)<\|/ref\|><\|det\|>(.*?)<\|/det\|>)"
    matches = re.findall(pattern, text, re.DOTALL)
    matches_image, matches_other = [], []
    for m in matches:
        (matches_image if "<|ref|>image<|/ref|>" in m[0] else matches_other).append(m[0])
    return matches, matches_image, matches_other


def extract_coordinates_and_label(ref_text, image_width, image_height):
    try:
        return (ref_text[1], eval(ref_text[2]))
    except Exception as e:
        print(e)
        return None


def draw_bounding_boxes(image: Image.Image, refs, jdx: int, output_path: str) -> Image.Image:
    image_width, image_height = image.size
    img_draw = image.copy()
    draw = ImageDraw.Draw(img_draw)
    overlay = Image.new("RGBA", img_draw.size, (0, 0, 0, 0))
    draw2 = ImageDraw.Draw(overlay)
    font = ImageFont.load_default()
    img_idx = 0

    for ref in refs:
        try:
            result = extract_coordinates_and_label(ref, image_width, image_height)
            if not result:
                continue
            label_type, points_list = result
            color = (np.random.randint(0, 200), np.random.randint(0, 200), np.random.randint(0, 255))
            color_a = color + (20,)

            for points in points_list:
                x1, y1, x2, y2 = points
                x1 = int(x1 / 999 * image_width)
                y1 = int(y1 / 999 * image_height)
                x2 = int(x2 / 999 * image_width)
                y2 = int(y2 / 999 * image_height)

                if label_type == "image":
                    try:
                        image.crop((x1, y1, x2, y2)).save(f"{output_path}/images/{jdx}_{img_idx}.jpg")
                    except Exception as e:
                        print(e)
                    img_idx += 1

                try:
                    draw.rectangle([x1, y1, x2, y2], outline=color, width=4 if label_type == "title" else 2)
                    draw2.rectangle([x1, y1, x2, y2], fill=color_a, outline=(0, 0, 0, 0), width=1)
                    text_x, text_y = x1, max(0, y1 - 15)
                    tb = draw.textbbox((0, 0), label_type, font=font)
                    draw.rectangle([text_x, text_y, text_x + tb[2] - tb[0], text_y + tb[3] - tb[1]], fill=(255, 255, 255, 30))
                    draw.text((text_x, text_y), label_type, font=font, fill=color)
                except Exception:
                    pass
        except Exception:
            continue

    img_draw.paste(overlay, (0, 0), overlay)
    return img_draw


# ---------------------------------------------------------------------------
# Inference
# ---------------------------------------------------------------------------

def process_single_image(model, tokenizer, image: Image.Image, prompt_text: str,
                         temp_dir: str, base_size: int, image_size: int, crop_mode: bool) -> str:
    temp_image_path = os.path.join(temp_dir, "temp_page.png")
    EOS = "<｜end▁of▁sentence｜>"
    try:
        image.save(temp_image_path, format="PNG")
        result = model.infer(
            tokenizer,
            prompt=prompt_text,
            image_file=temp_image_path,
            output_path=temp_dir,
            base_size=base_size,
            image_size=image_size,
            crop_mode=crop_mode,
            save_results=False,
            eval_mode=True,
        )
        # eval_mode strips EOS; re-append so the skip-repeat check works.
        return (result + EOS) if result else ""
    except Exception as e:
        print(f"Error processing image: {e}")
        traceback.print_exc()
        return ""
    finally:
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args():
    parser = argparse.ArgumentParser(
        description="Run DeepSeek-OCR2 (PyTorch) on a PDF or image file.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("input", help="Path to the input PDF or image file.")
    parser.add_argument("--type", choices=["pdf", "image"],
                        help="Force input type. Auto-detected from extension if omitted.")
    parser.add_argument("--output", "-o", default=DEFAULT_OUTPUT_PATH,
                        help="Output directory.")
    parser.add_argument("--model", "-m", default=DEFAULT_MODEL_PATH,
                        help="Model path or HuggingFace model ID.")
    parser.add_argument("--prompt", default=DEFAULT_PROMPT,
                        help="Prompt passed to the model.")
    parser.add_argument("--dpi", type=int, default=DEFAULT_DPI,
                        help="DPI for PDF rendering (ignored for image input).")
    parser.add_argument("--base-size", type=int, default=DEFAULT_BASE_SIZE,
                        help="base_size passed to model.infer().")
    parser.add_argument("--image-size", type=int, default=DEFAULT_IMAGE_SIZE,
                        help="image_size passed to model.infer().")
    parser.add_argument("--no-crop", action="store_true", help="Disable crop mode.")
    parser.add_argument("--no-skip-repeat", action="store_true",
                        help="Keep pages whose output lacks an EOS token.")
    parser.add_argument("--no-stream", action="store_true",
                        help="Disable token streaming to stdout during inference.")
    parser.add_argument("--save-det", action="store_true",
                        help="Save the raw detection output as <stem>_det.mmd.")
    parser.add_argument("--save-layouts", action="store_true",
                        help="Save the annotated layout image/PDF as <stem>_layouts.*.")
    return parser.parse_args()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    args = parse_args()

    input_path   = args.input
    output_path  = args.output
    model_path   = args.model
    prompt_text  = args.prompt
    dpi          = args.dpi
    base_size    = args.base_size
    image_size   = args.image_size
    crop_mode    = not args.no_crop
    skip_repeat  = not args.no_skip_repeat
    stream_tokens = not args.no_stream
    save_det     = args.save_det
    save_layouts = args.save_layouts

    # --- Detect / validate input type ---
    input_type = args.type
    if input_type is None:
        try:
            input_type = detect_input_type(input_path)
        except ValueError as e:
            print(f"{Colors.RED}Error: {e}{Colors.RESET}")
            raise SystemExit(1)
    print(f"{Colors.BLUE}Input type: {input_type.upper()}{Colors.RESET}")

    os.makedirs(output_path, exist_ok=True)
    os.makedirs(f"{output_path}/images", exist_ok=True)
    temp_dir = os.path.join(output_path, ".temp")
    os.makedirs(temp_dir, exist_ok=True)

    # --- Load model ---
    print(f"{Colors.BLUE}Loading model from: {model_path}{Colors.RESET}")
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

    if DEVICE == "cpu":
        # The model's remote code has hardcoded .cuda() calls. Patch them out
        # so tensors and modules silently stay on CPU instead of crashing.
        torch.Tensor.cuda = lambda self, *args, **kwargs: self
        torch.nn.Module.cuda = lambda self, *args, **kwargs: self

    if DEVICE == "cuda":
        try:
            import flash_attn  # noqa: F401
            attn_impl = "flash_attention_2"
        except ImportError:
            print(f"{Colors.YELLOW}flash_attn not found, falling back to eager attention.{Colors.RESET}")
            attn_impl = "eager"
    else:
        print(f"{Colors.YELLOW}Running on CPU — using eager attention.{Colors.RESET}")
        attn_impl = "eager"

    dtype = torch.bfloat16 if DEVICE == "cuda" else torch.float32

    model = AutoModel.from_pretrained(
        model_path,
        _attn_implementation=attn_impl,
        trust_remote_code=True,
        use_safetensors=True,
        torch_dtype=dtype,
    )
    model = model.eval().to(DEVICE)

    if DEVICE == "cpu":
        # The remote code explicitly casts activations to bfloat16, which
        # mismatches float32 biases/weights on CPU. Force all layer inputs
        # to float32 via a forward pre-hook on every module.
        def _cast_inputs_to_float32(module, args):
            return tuple(
                x.float() if isinstance(x, torch.Tensor) and x.dtype == torch.bfloat16 else x
                for x in args
            )
        for module in model.modules():
            module.register_forward_pre_hook(_cast_inputs_to_float32)

    if stream_tokens:
        _original_generate = model.generate

        def _streaming_generate(*args, **kwargs):
            kwargs.setdefault("streamer", TextStreamer(tokenizer, skip_prompt=True, skip_special_tokens=False))
            return _original_generate(*args, **kwargs)

        model.generate = _streaming_generate

    # --- Load input ---
    if input_type == "pdf":
        print(f"{Colors.RED}Loading PDF: {input_path}{Colors.RESET}")
        images = load_pdf(input_path, dpi=dpi)
    else:
        print(f"{Colors.RED}Loading image: {input_path}{Colors.RESET}")
        images = load_image(input_path)
    print(f"  {len(images)} page(s) found.")
    print(f"PROGRESS_TOTAL {len(images)}", flush=True)

    # --- Run inference ---
    print(f"{Colors.BLUE}Processing with PyTorch...{Colors.RESET}")
    outputs_list = []
    for page_idx, image in enumerate(tqdm(images, desc="Processing")):
        result = process_single_image(model, tokenizer, image, prompt_text,
                                      temp_dir, base_size, image_size, crop_mode)
        outputs_list.append(result)
        print(f"PROGRESS_CURRENT {page_idx + 1}", flush=True)

    # --- Build output paths ---
    stem = Path(input_path).stem
    mmd_det_path = os.path.join(output_path, f"{stem}_det.mmd")
    mmd_path     = os.path.join(output_path, f"{stem}.mmd")
    # Layout PDF is only meaningful when there are multiple annotated pages
    pdf_out_path = os.path.join(output_path, f"{stem}_layouts.pdf")

    # --- Post-process results ---
    contents_det  = ""
    contents      = ""
    draw_images   = []
    page_split    = "\n<--- Page Split --->"
    jdx           = 0
    skipped_pages = 0

    for page_idx, (content, img) in enumerate(zip(outputs_list, images)):
        if not content:
            print(f"{Colors.RED}  Page {page_idx + 1}: inference returned empty result (check errors above){Colors.RESET}")
            skipped_pages += 1
            continue
        if "<｜end▁of▁sentence｜>" in content:
            content = content.replace("<｜end▁of▁sentence｜>", "")
        else:
            if skip_repeat:
                print(f"{Colors.YELLOW}  Page {page_idx + 1}: skipped — no EOS token in output{Colors.RESET}")
                skipped_pages += 1
                continue

        contents_det += content + f"\n{page_split}\n"

        matches_ref, matches_images, matches_other = re_match(content)
        result_image = draw_bounding_boxes(img.copy(), matches_ref, jdx, output_path)
        draw_images.append(result_image)

        for idx, a_match_image in enumerate(matches_images):
            content = content.replace(a_match_image, f"![](images/{jdx}_{idx}.jpg)\n")

        for a_match_other in matches_other:
            content = (
                content.replace(a_match_other, "")
                .replace("\\coloneqq", ":=")
                .replace("\\eqqcolon", "=:")
                .replace("\n\n\n\n", "\n\n")
                .replace("\n\n\n", "\n\n")
            )

        contents += content + f"\n{page_split}\n"
        jdx += 1

    # --- Save outputs ---
    if save_det:
        with open(mmd_det_path, "w", encoding="utf-8") as f:
            f.write(contents_det)
    with open(mmd_path, "w", encoding="utf-8") as f:
        f.write(contents)

    if save_layouts and draw_images:
        if input_type == "image":
            # For a single image, save an annotated JPEG instead of a PDF
            annotated_path = os.path.join(output_path, f"{stem}_layouts.jpg")
            draw_images[0].convert("RGB").save(annotated_path, quality=95)
        else:
            pil_to_pdf_img2pdf(draw_images, pdf_out_path)

    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    # --- Summary ---
    print(f"\n{Colors.YELLOW}Summary:{Colors.RESET}")
    print(f"  Input type  : {input_type.upper()}")
    print(f"  Total pages : {len(images)}")
    print(f"  Processed   : {jdx}")
    print(f"  Skipped     : {skipped_pages}")
    print(f"\n{Colors.GREEN}Results saved to:{Colors.RESET}")
    print(f"  {mmd_path}")
    if save_det:
        print(f"  {mmd_det_path}")
    if save_layouts and draw_images:
        if input_type == "image":
            print(f"  {os.path.join(output_path, stem + '_layouts.jpg')}")
        else:
            print(f"  {pdf_out_path}")
