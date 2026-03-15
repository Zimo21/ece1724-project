# ece1724-project

To get started, you can choose to run the real model, or run in dummy mode.

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

## Running the Real Model

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
