# Person Re-Identification UI

A straightforward React/Vite frontend for the FastAPI person-reidentification backend.

## Run locally

1. Start the backend from the backend repository:

   ```powershell
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

2. Install and start this frontend:

   ```powershell
   npm install
   npm run dev
   ```

3. Open the Vite URL printed in the terminal. In development, Vite proxies `/process`, `/employees`, `/videos`, and `/health` to `http://127.0.0.1:8000`. Leave `VITE_API_BASE_URL` empty to use this proxy.

## Backend URL

For a separately hosted backend, set `VITE_API_BASE_URL` in `.env` to its base URL. The backend must allow browser requests from the frontend origin (CORS).

## Connected backend workflows

- Image upload and processing
- Person detection and OSNet feature extraction
- Object detection and Gemma + Grounding DINO automatic detection
- DINOv2 object feature extraction
- Person and object image comparison
- Employee registration, listing and lookup
- Video upload, metadata lookup, frame extraction, person/object detection, OSNet features, tracking, reference matching and employee matching
- Backend health check

Image history is held in browser memory for the current session because the backend does not currently expose an image-list or image-delete endpoint. Refreshing the page clears this session history.
