# FieldLens 🌿 — Gemma-Powered Nature Identifier
> **“Step outside. Discover what's around you.”**  
> *Built for Hacktoberfest 2026 Week 1 DEV Community Challenge: “Touch Grass”*

FieldLens is a lightweight, privacy-preserving nature observation web application that uses Google's open-weights **Gemma** vision-language models to help outdoor explorers, hikers, and curious backyard observers identify and learn about plants, flowers, birds, trees, mushrooms, and insects in their environment.

Unlike generic image classifiers or ungrounded chatbot wrappers, FieldLens is designed around a **cautious observation philosophy**: it examines visible morphological traits, distinguishes evidence from assumptions, qualifies its uncertainty honestly, provides practical outdoor tips, and reminds users never to consume or disturb unknown wildlife.

---

## 🍃 Connection to “Touch Grass”

The theme of Hacktoberfest Week 1 is **“Touch Grass”**: leveraging open-source AI to encourage people to disconnect from repetitive digital routines and engage directly with the physical, living world.

FieldLens achieves this by:
1. **Promoting Real-World Exploration:** Encouraging people to walk outside, observe local flora and fauna, and take field photos.
2. **Promoting Cautious Learning:** Emphasizing outdoor ethics (Leave No Trace) and safe observation rather than reckless foraging.
3. **Frictionless Access:** Zero account sign-up, zero paywalls, and mobile camera support for immediate field use.

---

## ✨ Features

- 📸 **Mobile-First Capture & Upload:** Snap photos directly from your phone camera (`capture="environment"`) or upload existing JPEG, PNG, and WebP images up to 5 MB with client-side downscaling and compression.
- 🧠 **Genuine Google Gemma Vision Inference:** Powered by Google's open-weights multimodal Gemma model (`models/gemma-4-26b-a4b-it` / Gemma 3 vision-capable variants), extracting morphological evidence without hallucinating fake taxonomy.
- 🎯 **Transparent Uncertainty Ratings:** Clear, qualitative confidence levels (`Low`, `Moderate`, `High`) based on visible diagnostic features—no invented, uncalibrated numeric percentages.
- 💡 **Actionable Field Guidance:** Safe outdoor observation tips (e.g. leaf arrangement, bark texture, scent check) and safety cautions.
- 💾 **Local Offline Observation Library:** Save discoveries to your personal field journal stored in your browser (`localStorage` for metadata, `IndexedDB` for high-resolution images). Persists across refreshes with zero cloud tracking.
- 🔒 **Zero Retention Privacy:** Uploaded photos are processed in memory and never archived or retained on our servers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS |
| **Icons** | Lucide React |
| **Local Persistence** | `localStorage` (metadata) + `idb-keyval` (IndexedDB for photo blobs) |
| **Backend / Serverless** | Node.js Serverless Function (`api/identify.ts`) with Vite dev middleware |
| **AI Inference** | Google Gemma 4 Vision (`models/gemma-4-26b-a4b-it`) via Google Generative Language API |
| **Deployment Target** | Vercel (zero-config static Vite + Edge/Serverless functions) |

---

## 🤖 Exact Gemma Model & Attribution

- **Model Identifier:** `models/gemma-4-26b-a4b-it` (Google Gemma 4 Multimodal Vision-Language Instruction-Tuned model).
- **Model Source:** Google DeepMind / Google AI Studio Generative Language API.
- **Supported Media Input:** Inline base64 image data (`image/jpeg`, `image/png`, `image/webp`).
- **Model License & Attribution:** Built using **Google Gemma**, an open-weights model family licensed under the [Gemma Terms of Use](https://ai.google.dev/gemma/terms). Gemma models are made available under open-weights terms for responsible AI development and deployment.

---

## 🏗️ Architecture & Privacy Pipeline

```
[ User Device (Phone/Desktop) ]
        │
        ├─ 1. Select/Capture Photo (JPEG/PNG/WebP <= 5MB)
        ├─ 2. Client-side canvas resize (max 1600px, WebP/JPEG)
        │
        ▼ (HTTPS POST /api/identify)
[ FieldLens Backend / Serverless Function ]
        │
        ├─ 3. Validate image payload & server-side API credentials
        ├─ 4. Forward to Google Generative Language API (Gemma Vision)
        │
        ▼
[ Google Gemma Vision Inference ]
        │
        ├─ 5. Evaluate visual evidence & reason under cautious system prompt
        ├─ 6. Output structured JSON adhering to FieldLens schema
        │
        ▼
[ FieldLens Frontend ]
        │
        ├─ 7. Sanitize & render identification result
        └─ 8. Optional: Save to local browser storage (IndexedDB + localStorage)
```

### Privacy Guarantee
- Images are **never** written to server disks or databases.
- The backend performs ephemeral pass-through inference.
- Stored observations and cached photographs reside **exclusively in the user's browser**.
- No analytics trackers, no advertising beacons, no user accounts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or later (`v20+` recommended)
- A Google AI Studio API key with access to Gemma models

### 1. Clone the Repository
```bash
git clone https://github.com/srijan-0-7/hacktoberfest-dev-1.git
cd hacktoberfest-dev-1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template and insert your API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
# Google AI Studio API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gemma Vision Model identifier (Default: models/gemma-4-26b-a4b-it)
GEMMA_MODEL=models/gemma-4-26b-a4b-it
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The Vite development server automatically routes `/api/identify` to the local Gemma inference middleware.

---

## 🧪 Testing Commands

FieldLens includes comprehensive build and automated inference tests:

```bash
# 1. Type-check with TypeScript compiler
npm run lint

# 2. Run end-to-end automated Gemma inference test
npm run test

# 3. Compile production bundle
npm run build
```

---

## 🚢 Deploying Directly to Vercel

FieldLens is pre-configured with `vercel.json` and a serverless API handler (`api/identify.ts`) for zero-config deployment:

### Quick Deployment Steps
1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Go to your [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Select and import **`srijan-0-7/hacktoberfest-dev-1`**.
4. Vercel will automatically detect the **Vite** framework preset.
5. In **Environment Variables**, configure:
   - **`GEMINI_API_KEY`**: Your Google Gemini / AI Studio API key *(Required)*
   - **`GEMMA_MODEL`**: `models/gemma-4-26b-a4b-it` *(Optional, defaults to this model automatically)*
6. Click **Deploy**.

Vercel compiles the React frontend into `dist/` and runs `api/identify.ts` as a Node serverless function at `/api/identify`.

> [!IMPORTANT]
> **Security & Privacy Guarantee:**
> - Local `.env` files are strictly gitignored and will never be pushed to your repository.
> - The API key is stored only in Vercel's server-side environment variables and is **never** sent to the browser or exposed to client-side code.
> - Uploaded photographs are processed in-memory and never saved to any database or file system.

---

## ⚠️ Known Limitations & Field Safety

- **Not for Wild Foraging or Ingestion:** FieldLens is an educational aid. Never consume wild mushrooms, berries, or plants based on AI identification.
- **Lighting & Focus Sensitivity:** Heavy motion blur, extreme backlighting, or cropped-out flowers/foliage may lead to high uncertainty ratings.
- **Rate Limits:** Hosted free-tier API endpoints may enforce rate limits during heavy usage spikes.
