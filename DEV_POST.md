*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

# FieldLens 🌿 — Gemma-Powered Nature Identifier
> **“Step outside. Discover what's around you.”**

## What I Built

**FieldLens** is a lightweight, privacy-preserving nature observation web application designed to encourage people to close their laptops, step outside, and engage with the living world around them. 

Whether exploring a local trail, walking through a neighborhood park, or examining flora and fauna in your backyard, FieldLens lets you photograph any plant, flower, tree, bird, mushroom, or insect and receive grounded, cautious insights powered by **Google Gemma**.

### Key Features
- **Mobile-First Field Capture:** Take photos directly through your smartphone camera (`capture="environment"`) or upload existing images (JPEG, PNG, WebP) with automatic client-side compression.
- **Grounded, Cautious Identification:** Unlike generic chatbots that hallucinate species names, FieldLens is instructed to distinguish visible morphological evidence from assumptions. When diagnostic traits are ambiguous or missing, it identifies the broadest defensible category (*flowering plant*, *bird*, *tree*, *mushroom*, *insect*, or *unknown organism*).
- **Calibrated Uncertainty Ratings:** Honest qualitative uncertainty levels (**Low**, **Moderate**, **High**) with clear explanations—no fabricated percentage scores.
- **Actionable Outdoor Guidance:** Practical outdoor observation tips (e.g. leaf arrangement, bark texture, scent check) and safety warnings.
- **Offline Personal Nature Journal:** Save sightings directly to your browser's local memory (`localStorage` for metadata, `IndexedDB` for high-resolution images). Persists across page refreshes with zero tracking and zero login requirements.
- **Zero Server Retention:** Uploaded images are processed in-memory and discarded immediately upon analysis.

---

## Demo

Watch FieldLens in action analyzing specimens and saving observations in real time:

<iframe width="560" height="315" src="https://www.youtube.com/embed/YIhn4hLXFb0?si=0_rFT6y7QsZZdGr9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

**Direct Video Link:** [https://youtu.be/YIhn4hLXFb0?si=0_rFT6y7QsZZdGr9](https://youtu.be/YIhn4hLXFb0?si=0_rFT6y7QsZZdGr9)

### Walkthrough & User Journey
1. **Landing & Ethics:** Introduces *Leave No Trace* outdoor ethics and transparency disclosures.
2. **Capture & Analyze:** Select or photograph a specimen; Google Gemma Vision evaluates leaf structure, plumage, or growth habit in real time.
3. **Structured Card:** Renders common name, scientific name (if warranted), uncertainty rating, visual evidence, outdoor tips, and cautions.
4. **Field Journal:** Browse, search, filter, and inspect your saved observations over time.

---

## Code

The complete source code is public and open-source:

{% github srijan-0-7/hacktoberfest-dev-1 %}

**Repository:** [https://github.com/srijan-0-7/hacktoberfest-dev-1](https://github.com/srijan-0-7/hacktoberfest-dev-1)

---

## How I Built It

### 1. Open-Source AI Model: Google Gemma Vision
FieldLens is powered by **Google Gemma 4 Vision** (`models/gemma-4-26b-a4b-it`), an open-weights multimodal vision-language model developed by Google DeepMind.

- **System Prompt Design:** The model is bound by a strict persona prompt as *FieldLens*, a cautious nature assistant that refuses to invent Latin binomials or claim species certainty unless distinguishing morphological traits are visibly present in the photograph.
- **Resilient Multi-Tier JSON Parsing:** To handle reasoning traces and varying response patterns, the parser dynamically extracts valid schemas from direct JSON, markdown-fenced code blocks (` ```json `), and structured key-value bullet points.

### 2. Frontend & Local Persistence
- **React 18 + TypeScript + Vite:** Clean, responsive, and mobile-friendly interface styled with Tailwind CSS and Lucide icons.
- **Hybrid Browser Storage:** Solved browser storage quota issues by using `localStorage` for structured observation metadata and `IndexedDB` (via `idb-keyval`) for storing full-resolution photograph blobs locally.

### 3. Serverless API Architecture
- **Vercel Serverless Function (`api/identify.ts`):** Lightweight Node.js endpoint ensuring API keys stay strictly server-side.
- **Integrated Vite Dev Middleware:** The local Vite development server automatically intercepts `/api/identify` using `dotenv`, offering a unified developer experience with single-command startup (`npm run dev`).

---

## Why Does Open Innovation Matter?

1. **Scientific Grounding over Marketing Hype:** Closed commercial APIs often push conversational models to appear authoritative, leading to dangerous hallucinations in the natural world (such as incorrectly declaring a wild fungus edible). Open-weights models like Gemma allow us to carefully craft system boundaries, inspect behavioral characteristics, and build tools centered on scientific caution.
2. **Democratizing Outdoor Literacy:** Nature belongs to everyone. Open innovation makes it possible to build free, privacy-first field companions without locking basic biological education behind monthly paywalls, tracking cookies, or mandatory user accounts.
3. **Auditability & Longevity:** An open-weights ecosystem guarantees that research tools and conservation applications can be audited, adapted, and run independently without reliance on a single proprietary vendor.

---

## My Agent Session

FieldLens was architected and built in collaboration with **Antigravity**, an autonomous agentic pair-programmer powered by Gemini:
- End-to-end multimodal API testing and prompt calibration with real botanical specimens.
- TypeScript schema design and multi-tier extractor implementation.
- Automated testing suite (`scripts/test-api.mjs`) verifying inference and response validity.

---

## Prize Categories

- **Touch Grass Challenge (Week 1)**: Encouraging real-world outdoor engagement, nature observation, and Leave No Trace ethics through open-source AI.
- **Google Gemma Challenge**: Practical application of Google Gemma open-weights multimodal vision models to solve a real-world environmental education challenge.
