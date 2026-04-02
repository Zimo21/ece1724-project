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

- **Next.js API Routes** (`app/api/convert/route.ts`, `app/api/history/route.ts`, `app/api/share/route.ts`, `app/api/user/route.ts`).
- **firebase-admin**: verify **Firebase ID tokens** for authentication.
- **PostgreSQL** with **Prisma ORM** — stores user data, conversion history, and file shares.
- **Firebase Storage** — stores processed ZIP files with signed URLs.
- **archiver**: ZIP the OCR output directory on the server before upload.
- **Python OCR backends** (separate processes, accessed via HTTP):
  - OCR server runs independently and is called by the Next.js backend.
  - See `requirements.txt` for Python dependencies.

### Data storage

- **PostgreSQL** — Primary relational database storing:
  - **User** records (id, email, timestamps)
  - **HistoryFile** records (user's conversion history with storage paths)
  - **SharedFile** records (files shared between users)
- **Prisma ORM** — Type-safe database access with migrations.
- **Firebase Storage** — Stores processed ZIP files; signed URLs generated for downloads.
- **Firebase Authentication** — Handles user authentication; ID tokens verified server-side.

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
  - **Status** badge: Queued, Ready to Convert, Converting, Done, Error.
  - **Progress bar** and **“Page X of Y”** while converting (from SSE `progress` events).
- **Convert** runs **selected** jobs **one after another** (sequential queue) to limit memory/GPU load.
- After success, the row is **auto-deselected**; **Done** rows cannot be re-checked (avoids duplicate submissions).
- Users can **remove** a row from the local queue (trash control). This action only affects the UI state and does not delete any files from Firebase Storage or Firestore. Completed downloads remain accessible via **signed URLs**.

### 4. Real-time progress

- `**text/event-stream`** SSE from the server; UI updates **without full page reload**.
- **Dummy mode** (`USE_DUMMY_MODEL=true`) simulates **multi-step** page progress for UI testing without loading the model.

### 5. File processing & cloud delivery

- **Server-side OCR** on PDFs/images → Markdown (and related outputs in the output folder).
- Server **ZIP**s the output folder, **uploads** to **Firebase Storage**, and returns the ZIP as base64 to the client.
- Client receives the ZIP, uploads to their history in Firebase Storage, and saves metadata to PostgreSQL via `/api/history`.

### 6. History

- **History drawer** loads prior ZIPs via `GET /api/history` (PostgreSQL query filtered by `userId`).
- Shows **file name** and **created** time; click **Download** to open the file from Firebase Storage.
- **Share** button allows sharing files with other registered users via email.

### 7. Sharing

- Users can **share** converted files with other registered users by email address.
- **Shared with me** drawer shows files others have shared with you.
- Sharing is managed via `POST /api/share` and `GET /api/share` endpoints.
- Recipients must be registered users (email must exist in the database).

---

### Mapping to course requirements


| Requirement                        | How this project satisfies it                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript** (frontend + server) | All Next.js app and API route code in TypeScript                                                                                                         |
| **React / Next.js UI**             | App Router pages and client components                                                                                                                   |
| **Tailwind CSS**                   | Styling across pages and components                                                                                                                      |
| **shadcn/ui or similar**           | Radix + CVA-based UI kit (`components/ui/`*)                                                                                                             |
| **Responsive design**              | Flexible layouts, scrollable lists, mobile-friendly auth pages                                                                                           |
| **Cloud storage**                  | Firebase Storage + signed URLs for ZIP downloads                                                                                                        |
| **PostgreSQL**                     | Primary database via Prisma ORM — stores users, history, and shares                                                                                     |
| **≥2 advanced features**           | (1) **Auth + protected APIs** · (2) **Real-time SSE progress** · (3) **File sharing between users** · plus **Firebase Storage**                         |


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
   - **History** — opens a side panel listing your past completed downloads.
   - **Shared with me** — opens a side panel showing files others have shared with you.
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
2. Install **PostgreSQL** and create a database.
3. Copy `cp .env.example .env.local` and fill **Firebase client keys**, **Firebase admin credentials**, and **DATABASE_URL**.
4. Run `npx prisma generate && npx prisma db push` to set up the database schema.
5. For UI testing without the real model, set `USE_DUMMY_MODEL=true` in `.env.local`.
6. Run `npm run dev` and open `http://localhost:3000`.

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
  - `FIREBASE_CLIENT_EMAIL` — Firebase service account email.
  - `FIREBASE_PRIVATE_KEY` — Firebase service account private key (include `\n` for newlines).
- **Database** — set in `.env.local`:
  - `DATABASE_URL` — PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/deepseek_ocr?schema=public`).
- **App behavior flags** (optional):
  - `USE_DUMMY_MODEL=true` — skips real Python OCR; use for UI and SSE testing.
  - `USE_DUMMY_MODEL=false` — runs real OCR (requires Python deps and hardware).
  - `USE_VLLM=true` — use `run_ocr_vllm.py` instead of the PyTorch script (separate Python env).
  - `PYTHON_PATH` — path to the Python interpreter (default `python3`), e.g. your venv’s `python`.

### Database initialization

- **PostgreSQL setup**:
  1. Install PostgreSQL locally or use a cloud provider (Supabase, Neon, Railway, etc.)
  2. Create a database: `createdb deepseek_ocr` (or use your provider's dashboard)
  3. Set the `DATABASE_URL` in `.env.local`:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/deepseek_ocr?schema=public"
     ```

- **Prisma setup**:
  ```bash
  npm install
  npx prisma generate
  npx prisma db push
  ```

  The `prisma db push` command will create all required tables (User, HistoryFile, SharedFile) in your PostgreSQL database.

- **Firebase Storage**:
  - Enable **Cloud Storage** in Firebase console.
  - Set `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` to your bucket name.
  - The app uploads ZIP files to `users/<userId>/history/<timestamp>_<filename>.zip`.

### Cloud storage configuration

- In Firebase console, enable **Cloud Storage** and note the **bucket name**; it must match `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`.
- The app uploads processed ZIP files to Firebase Storage under `users/<userId>/history/`.
- Ensure **Storage rules** allow authenticated users to read/write their own files.

### Local development and testing

1. Complete **Prerequisites** and **Environment setup** above.
2. Ensure PostgreSQL is running and `DATABASE_URL` is correctly set.
3. **Smoke test (no model)** — set `USE_DUMMY_MODEL=true`, run `npm run dev`, sign in, upload a small PDF/image, run **Convert**, confirm SSE progress and **Download**.
4. **History** — after a successful conversion, open the history UI and confirm entries appear (requires valid token and database connection).
5. **Sharing** — create a second account and test sharing files between users.

### Quick Start

To get started quickly, use dummy mode for UI testing, or connect to an OCR server for real conversions.

#### Running in Dummy Mode

1. Create a `.env.local` file:
   ```
   USE_DUMMY_MODEL=true
   DATABASE_URL="postgresql://user:password@localhost:5432/deepseek_ocr?schema=public"
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=...
   ```

2. Install and run:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

#### Running with Real OCR Server

For real OCR processing, you need to run a separate OCR server:

1. Edit `.env.local` and set:
   ```
   USE_DUMMY_MODEL=false
   OCR_SERVER_URL=http://127.0.0.1:8000
   ```

2. Run the OCR server (see project documentation for the OCR server setup).

#### Firebase Auth Setup

1. Create a local env file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill `.env.local` with your Firebase project values:
   - Client-side config (all `NEXT_PUBLIC_*` variables) from Firebase Console > Project Settings
   - Server-side credentials:
     - `FIREBASE_CLIENT_EMAIL`: from your service account JSON
     - `FIREBASE_PRIVATE_KEY`: from your service account JSON (include `\n` for newlines)

3. Create the Firebase service account:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Extract `client_email` and `private_key` values

4. Run:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
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

Working with Firebase accelerated development by providing integrated solutions for authentication and file storage. The transition from Firestore to PostgreSQL as the primary database demonstrated the importance of selecting appropriate data stores for different use cases — while Firestore was convenient for rapid prototyping, PostgreSQL with Prisma provided stronger type safety, relational data modeling, and better support for complex queries like file sharing between users. Prisma's type-safe client and migration system proved valuable for maintaining database schema consistency across development and production environments.

The file sharing feature required careful consideration of data relationships and access control. Users can share conversion results with other registered users by email, with the database maintaining referential integrity between owners and recipients. This feature highlighted the advantages of a relational database over a document store for modeling user relationships.

From a teamwork perspective, coordinating across frontend, backend, and Python components required clear API contracts and consistent message formats to avoid integration issues. We also found that early end-to-end testing (e.g., login → upload → convert → download → share) was more effective than isolated unit tests in identifying system-level problems.

Overall, this project allowed us to combine modern web development with practical document AI applications. We delivered a functional system with batch processing, real-time feedback, secure file management, and social features like file sharing — all while gaining deeper understanding of database design trade-offs, authentication flows, and full-stack development patterns.