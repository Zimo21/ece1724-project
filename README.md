# ece1724-project

To get started, you can choose to run the real model, or run in dummy mode.

## Backend Options

| Backend      | Description                         | CUDA  | Speed    |
| ------------ | ----------------------------------- | ----- | -------- |
| vLLM Server  | FastAPI server, model stays loaded | 12.8  | **Fast** |
| Dummy Mode   | Returns fake markdown              | None  | Instant  |

> **Recommended:** vLLM Server for best performance. The model loads once at startup and stays in memory.

## Setup

```bash
npm install
npx shadcn@latest init
npx shadcn@latest add button
```

## Running in Dummy Mode (No Model)

1. Create a `.env.local` file:
   ```
   USE_DUMMY_MODEL=true
   ```
2. Start the server:
   ```bash
   npm run dev
   ```

## Running the Real Model — vLLM Server (Recommended)

The model loads once at startup and stays in memory for fast inference. Requires **CUDA 12.8**.

### 1) Create and activate virtual environment

```bash
python3 -m venv .venv-vllm
source .venv-vllm/bin/activate
```

### 2) Install dependencies

```bash
pip install -r requirements-vllm.txt
```

### 3) Start the OCR server

```bash
python3 ocr_server.py
```

Options:
```bash
python3 ocr_server.py --port 8000 --gpu 0 --model deepseek-ai/DeepSeek-OCR-2
```

This will:
- Download the model from HuggingFace (first run only)
- Load it into GPU memory
- Start a FastAPI server on `http://127.0.0.1:8000`

### 4) Run Prisma migrations (for history/sharing)

```bash
npx prisma migrate dev --name init
```

### 5) Start the Next.js app

```bash
npm run dev
```

The OCR server runs independently. When you convert a file, Next.js sends it to the OCR server.

### Environment Variables

| Variable            | Default                        | Description                           |
| ------------------- | ------------------------------ | ------------------------------------- |
| `USE_DUMMY_MODEL`   | `true`                         | Set to `false` for real model         |
| `OCR_SERVER_URL`    | `http://127.0.0.1:8000`        | URL of the OCR server                 |
| `DATABASE_URL`      | -                              | PostgreSQL connection string          |

---

## Legacy: Running OCR as CLI Script

If you prefer running OCR as a one-off command instead of a server:

### vLLM CLI (`run_ocr_vllm.py`)

```bash
python3 run_ocr_vllm.py input.pdf --output output_dir
```

### PyTorch CLI (`run_dpsk_ocr2_torch.py`)

```bash
pip3 install -r requirements.txt
python3 run_dpsk_ocr2_torch.py input.pdf --output output_dir
```

> **Note:** These scripts load the model fresh each run, which is slower than using `ocr_server.py`.

---

## Firebase Auth Setup

### 1) Create local env file

```bash
cp .env.example .env.local
```

### 2) Fill `.env.local`

Paste config values into `.env.local`.

### 3) Run

```bash
npm install
npm run dev
```

## PostgreSQL Setup (for File Sharing)

### 1) Set up PostgreSQL database

Create a PostgreSQL database and set the `DATABASE_URL` in `.env.local`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/deepseek_ocr?schema=public"
```

### 2) Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

### 3) Firebase Admin SDK (for server-side auth)

To enable file sharing, you need Firebase Admin SDK credentials:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key
3. Add to `.env.local`:
   ```
   FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

### 4) Deploy Storage Rules

```bash
firebase deploy --only storage
```
