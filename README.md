# ece1724-project

To get started, you can choose to run the real model, or run in dummy mode.

There are two backends available for running the real model:

| Backend | Script | CUDA | Key dependency |
|---------|--------|------|----------------|
| PyTorch (default) | `run_dpsk_ocr2_torch.py` | any | `transformers==4.45.2` |
| vLLM | `run_ocr_vllm.py` | 12.8 | `vllm==0.17.1` |

> **Note:** The two backends require incompatible Python environments due to different `transformers` version requirements. Use separate virtual environments for each.

## Setup

```bash
npm install
npx shadcn@latest init
npx shadcn@latest add button
```

## Running in Dummy Mode

1. Create a `.env` file in the project directory and add:
   ```
   USE_DUMMY_MODEL=true
   ```
2. Start the server:
   ```bash
   npm run dev
   ```

## Running the Real Model — PyTorch Backend

1. Install Python dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```
2. Run the OCR Python script (this will download the model from HuggingFace):
   ```bash
   python3 run_dpsk_ocr2_torch.py my_pdf_file.pdf --output my_output
   ```
3. Remove `USE_DUMMY_MODEL` from `.env` or set it to `false`.
4. Start the server:
   ```bash
   npm run dev
   ```

## Running the Real Model — vLLM Backend

The vLLM backend requires **CUDA 12.8** and a separate Python environment.

1. Create and activate a dedicated virtual environment:
   ```bash
   python3 -m venv .venv-vllm
   source .venv-vllm/bin/activate
   ```
2. Install vLLM and its dependencies:
   ```bash
   pip install vllm==0.17.1 pymupdf pillow
   ```
3. Run the OCR script (this will download the model from HuggingFace):
   ```bash
   python3 run_ocr_vllm.py my_pdf_file.pdf --output my_output
   ```
4. In `.env`, remove `USE_DUMMY_MODEL` (or set it to `false`) and enable the vLLM backend:
   ```
   USE_VLLM=true
   ```
5. Start the server, pointing it at the vLLM Python interpreter if needed:
   ```bash
   PYTHON_PATH=.venv-vllm/bin/python npm run dev
   ```
