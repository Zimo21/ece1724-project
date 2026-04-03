# vLLM OCR Server Setup

## Prerequisites

- CUDA 12.8

## Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements_vllm.txt
```

## Running the Server

```bash
python ocr_server.py --port 8000
```