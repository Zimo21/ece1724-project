# ece1724-project

---

## Team Information

- Name: Tanvi Patil
Student Number: XXX  
Email: XXX  
- Name: Chen Hao Zhang
Student Number: XXX  
Email: XXX  
- Name: Zimo Zhang
Student Number: 1007668542
Email: [zzzzimo.zhang@mail.utoronto.ca](mailto:zzzzimo.zhang@mail.utoronto.ca)

---

## Motivation

A large amount of information today exists in unstructured formats such as scanned documents, receipts, and handwritten notes. Converting this data into editable, structured text is often time-consuming and inefficient.

This project aims to address this problem by building an interactive web application that allows users to upload PDF or image files and automatically extract structured content. By leveraging the DeepSeek OCR model, the system converts documents into Markdown format and extracts embedded images, providing users with easily reusable outputs.

Existing tools such as Adobe Acrobat offer OCR capabilities but are limited in format flexibility and often require paid subscriptions. Our solution focuses on providing a more accessible, flexible, and user-friendly alternative, especially for non-technical users.

## Objectives

The primary objective of this project is to develop a full-stack web application that enables users to upload PDF and image files for automated information extraction.

The system leverages an open-weight OCR model to extract text and embedded images, converting the content into structured Markdown format. The processed results are packaged as downloadable ZIP files for user convenience.

In addition, the application supports batch processing, allowing multiple documents to be uploaded and processed sequentially in a controlled queue. Through this implementation, we aim to provide an accessible and efficient tool for converting unstructured documents into reusable digital content.

---

## Technical Stack

### Architecture (Option A: Next.js full-stack)

- **Next.js App Router** with **TypeScript** on both UI and **Route Handlers** (`app/api/*`).
- **Client-side React** for the interactive job queue; **API Routes** for authenticated conversion, streaming, and history listing.
- **OCR orchestration**: Node spawns **Python** via `child_process.spawn` (not in-process TypeScript inference).
- **Mutations** are handled through **REST-style API Routes** (`POST /api/convert`, `GET /api/files`). *(Server Actions are optional; this project does not rely on them for the main flow.)*

### Frontend (course-aligned)

- **Next.js 16.1.6**, **React 19**, **TypeScript** for all app code under `app/` and shared UI.
- **Tailwind CSS** for layout and responsive styling.
- **shadcn/ui**-style components (Radix primitives + `class-variance-authority`) — e.g. `components/ui/button`.
- **Responsive layout**: main converter and auth pages use flexible widths and scrollable job lists for small viewports.
- **lucide-react** for icons (upload, download, history, etc.).

### Backend / server runtime

- **Next.js API Routes** (`app/api/convert/route.ts`, `app/api/files/route.ts`).
- **firebase-admin**: verify **Firebase ID tokens**, read/write **Firestore**, upload to **Firebase Storage**, generate **signed download URLs**.
- **archiver**: ZIP the OCR output directory on the server before upload.
- **uuid**: stable IDs for storage objects and Firestore document keys.
- **Python OCR backends** (separate processes):
  - Default: `**run_dpsk_ocr2_torch.py`** — DeepSeek-OCR-2 via **PyTorch** + **Hugging Face transformers** (see `requirements.txt`).
  - Optional: `**run_ocr_vllm.py`** — **vLLM** when `USE_VLLM=true` (CUDA 12.8 + separate venv).

### Data storage (course note)

- **Cloud / document store**: **Firebase Firestore** — collection `zipFiles` (per-user metadata, expiry, signed URL fields).
- **Cloud object storage**: **Firebase Storage** — processed ZIPs under `zips/<id>.zip`, time-limited signed URLs (~24h in app logic).
- **Relational database (SQLite or PostgreSQL)** — **required by the course syllabus**. 
To be completed

### Authentication

- **Firebase Authentication** on the client: **Google Sign-In** and **email/password** (`/login`, `/signup`).
- **Token-based API access**: browser sends `Authorization: Bearer <Firebase ID token>` to protected routes; server verifies with **Admin SDK**.

### Real-time & integration (advanced-feature support)

- **Server-Sent Events (SSE)** from `POST /api/convert`: `progress` (page counts), `done` (signed URL + expiry), `error`.
- **Third-party / external services**: **Firebase** (Auth, Firestore, Storage) as the primary hosted backend integration.

---

## Features

### 1. Authenticated full-stack flow

- Unauthenticated visitors are redirected from `/` to `**/login`**.
- **Sign up** (`/signup`) and **sign in** (`/login`) support **Google** and **email/password**.
- `**POST /api/convert`** and `**GET /api/files`** return **401** without a valid Bearer token.
- **Forgot Password** is currently not implemented and serves as a placeholder for future work.

### 2. File input and validation

- **Drag-and-drop** or file picker; `**multiple`** files per session.
- Accepted types (MIME): **PDF**, **PNG**, **JPEG**, **WEBP** (invalid types are skipped with an alert).

### 3. Job queue

- Each uploaded file is a **row** in a list with:
  - **Checkbox** to include/exclude from conversion (disabled while **Converting** or after **Done**).
  - S**tatus** badge: Queued, Ready to Convert, Converting, Done, Error.
  - **Progress bar** and **“Page X of Y”** while converting (from SSE `progress` events).
- **Convert** runs **selected** jobs **one after another** (sequential queue) to limit memory/GPU load.
- After success, the row is **auto-deselected**; **Done** rows cannot be re-checked (avoids duplicate submissions).
- Users can **remove** a row from the local queue (trash control). This action only affects the UI state and does not delete any files from Firebase Storage or Firestore. Completed downloads remain accessible via **signed URLs**.

### 4. Real-time progress

- `**text/event-stream`** SSE from the server; UI updates **without full page reload**.
- **Dummy mode** (`USE_DUMMY_MODEL=true`) simulates **multi-step** page progress for UI testing without loading the model.

### 5. File processing & cloud delivery

- **Server-side OCR** on PDFs/images → Markdown (and related outputs in the output folder).
- Server **ZIP**s the output folder, **uploads** to **Firebase Storage**, writes metadata to **Firestore**, returns a **signed `downloadUrl`** in the SSE `done` event (not a raw zip blob in the browser).

### 6. History

- **History drawer** loads prior ZIPs via `**GET /api/files`** (Firestore query filtered by `userId` and `expiresAt`).
- Shows **file name** and **created** time; links use stored **download URLs** where still valid.

---

### Mapping to course requirements


| Requirement                        | How this project satisfies it                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript** (frontend + server) | All Next.js app and API route code in TypeScript                                                                                                         |
| **React / Next.js UI**             | App Router pages and client components                                                                                                                   |
| **Tailwind CSS**                   | Styling across pages and components                                                                                                                      |
| **shadcn/ui or similar**           | Radix + CVA-based UI kit (`components/ui/`*)                                                                                                             |
| **Responsive design**              | Flexible layouts, scrollable lists, mobile-friendly auth pages                                                                                           |
| **Cloud storage**                  | Firebase Storage + signed URLs; metadata in Firestore                                                                                                    |
| **PostgreSQL or SQLite**           | **To be completed**                                                                                                                                      |
| **≥2 advanced features**           | (1) **Auth + protected APIs** · (2) **Real-time SSE progress** · (3) **Non-trivial file processing (OCR + ZIP)** · plus **Firebase as external service** |


---

## User Guide

*This section is for **end users** of the deployed app: only what you see in the browser.*

### Login page (`/login`)

- **Sign in with Google** — one-click sign-in.
- Or use **email** and **password** in the form, then submit to sign in.
- Link to **sign up** if you need a new account.

### Sign up page (`/signup`)

- Create an account with **email and password** (and any fields shown on that page).
- After sign-up, you are usually redirected to sign in or straight to the app, depending on configuration.

### Home — main converter (`/`)

After you are signed in, you see the **DeepSeek OCR** screen. Main areas, top to bottom:

1. **Header / top bar**
  - **History** (or similar) — opens a side panel listing your past completed downloads.  
  - **Sign out** — ends your session and returns you to login when you open the app again.
2. **Upload area (dashed box)**
  - Click anywhere in the box **or** use the **Upload** button to pick files from your device.  
  - You can also **drag files** onto the box.  
  - Multiple files are allowed; each file becomes one row in the list below.
3. **File list (job queue)**
  Each row shows:
  - **Checkbox** — check the files you want to convert; unchecked files are skipped when you press Convert.  
  - **File name** and a small **status** label (e.g. ready, converting, done, error).  
  - While converting: a **progress bar** and text like **Page X of Y** (when the server reports page counts).  
  - **Trash** — removes that row from the list (only affects this session’s queue on screen).  
  - **Download** (arrow-down icon) — after a file is **Done**, tap to download your **ZIP** result. Finished rows uncheck themselves and you can’t check them again for another run from the same row.
4. **Bottom actions**
  - **Upload** — same as opening the file picker (duplicate shortcut).  
  - **Convert** — starts conversion for all **checked** rows, **one file after another**. It is disabled if nothing is checked.

### History panel

- Open it from the **History** control on the home page.  
- You see a list of **previous ZIP downloads** (name and time). Tap an entry to open/download if it is still available.

### Tips

- Supported types for upload: **PDF**, **PNG**, **JPEG**, **WEBP**. Other types may be skipped with a browser alert.  
- If the app shows **Redirecting…**, wait until you are logged in or sent to login.

*(add screenshots of login, home queue + progress, history panel, and download for the report or demo video.)*

---

## Development Guide

### Prerequisites (for developers running the repo locally)

1. Install **Node.js** and run `npm install` in the project root.
2. Copy `cp .env.example .env.local` and fill **Firebase client keys** plus `FIREBASE_SERVICE_ACCOUNT_KEY` for the server.
3. For UI testing without the real model, set `USE_DUMMY_MODEL=true` in `.env.local`. For real OCR, set `USE_DUMMY_MODEL=false`, install Python deps from `requirements.txt`, and see the backend sections below.
4. Run `npm run dev` and open `http://localhost:3000`.

### Environment setup and configuration

- **Node**: use a current LTS Node.js; install JS dependencies with `npm install` (see **Setup** below for first-time shadcn steps if you scaffold from scratch).
- **Environment file**: use `**.env.local`** in the project root (Next.js loads it automatically). Copy from `.env.example`:
  ```bash
  cp .env.example .env.local
  ```
- **Firebase client (public)** — set in `.env.local` (all `NEXT_PUBLIC_`*):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Firebase Admin (server-only)** — set in `.env.local`:
  - `FIREBASE_SERVICE_ACCOUNT_KEY` — **single-line JSON string** for a service account that has access to **Firestore**, **Storage**, and (for token verification) your Firebase project. Do not commit this value.
- **App behavior flags** (optional):
  - `USE_DUMMY_MODEL=true` — skips real Python OCR; use for UI and SSE testing.
  - `USE_DUMMY_MODEL=false` — runs real OCR (requires Python deps and hardware).
  - `USE_VLLM=true` — use `run_ocr_vllm.py` instead of the PyTorch script (separate Python env).
  - `PYTHON_PATH` — path to the Python interpreter (default `python3`), e.g. your venv’s `python`.

### Database initialization

- **Firestore (used by this app)**  
  - Enable **Cloud Firestore** in the Firebase console (Native mode).  
  - No manual schema migration is required: the app writes to collection `**zipFiles`** on first successful conversion.  
  - Ensure the **service account** used in `FIREBASE_SERVICE_ACCOUNT_KEY` has **Firestore read/write** permissions.
- **PostgreSQL or SQLite (course requirement)**  
  - **Not yet wired in this repository** as the primary store; when added, document here: install DB, connection string env var, and migration/init command. Until then, grading should rely on Firestore + the README note under **Technical Stack**.

### Cloud storage configuration

- In Firebase console, enable **Cloud Storage** and note the **bucket name**; it must match `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` and the bucket configured in Admin init.
- The API uploads completed ZIPs under paths like `zips/<uuid>.zip` and issues **signed read URLs** with an expiry aligned to app logic (~24 hours).
- Ensure **Storage rules** (and IAM for the service account) allow the Admin SDK to **write** objects and **generate signed URLs** for reads as needed for your security model.
- For local testing, the default bucket rules must permit your service account to upload; tighten rules for production.

### Local development and testing

1. Complete **Prerequisites** and **Environment setup** above.
2. **Smoke test (no model)** — set `USE_DUMMY_MODEL=true`, run `npm run dev`, sign in, upload a small PDF/image, run **Convert**, confirm SSE progress and **Download**.
3. **Smoke test (real OCR)** — follow **Running the Real Model** sections below; use a small PDF first.
4. **History** — after a successful conversion, open the history UI and confirm entries from `GET /api/files` (requires valid token and non-expired records).
5. **Negative test** — call protected APIs without `Authorization: Bearer <token>` and expect `401` (e.g. via REST client).

### Quick Start

To get started, you can choose to run the real model, or run in dummy mode.

There are two backends available for running the real model:


| Backend           | Script                   | CUDA | Key dependency         |
| ----------------- | ------------------------ | ---- | ---------------------- |
| PyTorch (default) | `run_dpsk_ocr2_torch.py` | any  | `transformers==4.45.2` |
| vLLM              | `run_ocr_vllm.py`        | 12.8 | `vllm==0.17.1`         |


> **Note:** The two backends require incompatible Python environments due to different `transformers` version requirements. Use separate virtual environments for each.

#### Setup

```bash
npm install
npx shadcn@latest init
npx shadcn@latest add button
```

Note: shadcn/ui components are already included in this project. Running initialization commands such as `npx shadcn@latest init` is not required and may lead to conflicts with the existing setup.

#### Running in Dummy Mode

1. Create a `.env` file in the project directory and add:
  ```
   USE_DUMMY_MODEL=true
  ```
2. Start the server:
  ```bash
   npm run dev
  ```

#### Running the Real Model — PyTorch Backend

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

#### Running the Real Model — vLLM Backend

The vLLM backend requires **CUDA 12.8** and a separate Python environment.

1. Create and activate a dedicated virtual environment:
  ```bash
   python3 -m venv .venv-vllm
   source .venv-vllm/bin/activate
  ```
2. The vLLM backend requires additional dependencies that are not included in the main `requirements.txt` due to environment conflicts. Please install them separately:
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

#### Firebase Auth (Shared Project) Setup

##### 1) Create local env file

```bash
cp .env.example .env.local
```

##### 2) Fill `.env.local`

Paste config values into `.env.local`.

##### 3) Run

```bash
npm install
npm run dev
```

---

## AI Assistance & Verification (Summary)

to be completed after completing ai-session.md

---

## Individual Contributions

to be completed at end of implementation

---

## Lessons Learned and Concluding Remarks

Throughout this project, we gained valuable technical and practical insights from integrating a full-stack web application with an OCR-based machine learning pipeline. Separating the web application from the ML runtime proved to be an effective design decision, allowing us to iterate quickly on the user interface while handling the heavier and more environment-sensitive OCR components independently. The use of dummy mode and Server-Sent Events (SSE) enabled us to validate core functionalities such as job queues, authentication, and real-time progress updates without requiring large model downloads or high-performance hardware. While SSE was simpler to implement than WebSockets for our use case, it required careful handling of streaming formats to ensure reliable communication between server and client.

Working with Firebase accelerated development by providing integrated solutions for authentication, storage, and metadata management. However, it also required us to understand how these components interact as a system, including service accounts, signed URLs, and security configurations. Additionally, supporting multiple OCR backends (PyTorch and vLLM) highlighted the challenges of dependency management, reinforcing the need for separate virtual environments when dealing with conflicting libraries.

From a teamwork perspective, coordinating across frontend, backend, and Python components required clear API contracts and consistent message formats to avoid integration issues. We also found that early end-to-end testing (e.g., login → upload → convert → download) was more effective than isolated unit tests in identifying system-level problems.

Finally, this project emphasized the importance of reproducibility and alignment with project requirements. Properly documenting environment setup, configuration files, and runtime options was as critical as implementing features. We also recognize that incorporating a relational database such as PostgreSQL or SQLite is necessary to fully satisfy the course’s core technical requirements, and this remains an area for further improvement.

Overall, this project allowed us to combine modern web development with practical document AI applications. We are proud of delivering a functional system with batch processing, real-time feedback, and secure file management, while also gaining a deeper understanding of system design trade-offs between complexity, performance, and development efficiency.