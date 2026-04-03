# AI Interaction Record

## Session 1: SSE progress from a spawned Python OCR process

### Prompt (you sent to AI)

Our Next.js App Router route `POST /api/convert` uses `child_process.spawn` to run `run_dpsk_ocr2_torch.py` and needs to stream **per-page** progress to the browser. The Python script prints machine-readable lines `PROGRESS_TOTAL N` and `PROGRESS_CURRENT K` to **stdout** (with `flush=True`). The client must send **multipart form-data** (the uploaded file) and an `Authorization: Bearer <Firebase ID token>` header, so we cannot use `EventSource` (GET-only). How should we (1) buffer and parse stdout in Node without blocking until the process exits, (2) emit SSE frames (`data: {…}\n\n`) from a `ReadableStream` in the Route Handler, and (3) parse those frames on the client from `fetch(...).body.getReader()` when chunks may split mid-event or use `\r\n` line endings?

### AI Response (trimmed)

The AI described returning `Content-Type: text/event-stream` with a `ReadableStream`, enqueueing `data:` + JSON + `\n\n` for each progress tick, and on the client reading the stream with `TextDecoder` instead of `EventSource`. It noted splitting incoming bytes on **double newlines** to recover whole SSE events and handling **incomplete** trailing buffers between reads.

### What Your Team Did With It

- We implemented **stdout line buffering** in Node: split on `\n`, keep a carry buffer for incomplete lines, and regex-match `PROGRESS_TOTAL` / `PROGRESS_CURRENT` to call a callback that enqueues SSE `progress` events.
- We kept `**fetch` + `ReadableStream`** on the client (not `EventSource`) because of **POST + FormData + Bearer auth\*\*; we split SSE frames with `/\r?\n\r?\n/` and extracted the `data: …` line so `\r\n` from the runtime did not break parsing.
- After integration, we still had to **tune** the parser when events arrived in small TCP chunks; the AI’s “buffer until `\n\n`” idea was necessary but not sufficient until we tested against real `fetch` streaming behavior in Chrome.

## Session 2: Integrating History Drawer in UI and In UI even though the background gradient was visible card wasn't needed help in debugging

### Prompt (you sent to AI)

My App is currently showing just the background gradient, not the card also the History Drawer is invisible.

### AI Response (trimmed if long)

Correct the stacking order (z-index) and remove the empty overlay that is sitting on top of your card.

What is wrong:
The gradient container is absolute and ended up covering the card.
There is an extra empty wrapper that created a full‑screen layer.
The card didn’t have a higher z-index, so it was hidden.

### What Your Team Did With It

- We changed made the recommended code changes.
- Implemented the History changes
- We tried with a few alignments suggested by AI

## Session 3 Designing sharing and access control features

### Prompt (you sent to AI)
In my web app, I have a History panel and a "Shared with me" panel. I want to support file sharing between users. 

What is the best way to design actions like delete, remove, and sharing management? 

### AI Response (trimmed if long)
- Only the file owner should be able to delete files
- Shared users should not delete files, but instead remove the file from their own view
- The sharing relationship should be clearly displayed (e.g., a list of users the file is shared with)
- Each shared user entry can include a remove access action for better control

### What Your Team Did With It
The idea of separating Delete (owner) and Remove (shared user) was very useful and helped us design a clearer permission model. Some suggestions were too general, so we adapted them to fit our UI structure (History panel vs. Shared panel). We implemented:
- Delete in the History panel (owner only)
- Remove in the Shared with me panel (removes from user’s view only)
- A shared user list with per-user remove access in the History panel
- We also refined button labels (e.g., avoiding confusion between delete and remove) to improve usability.
