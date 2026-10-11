# Hacktoberfest 2026 Week 1 Submission: FieldLens

## 🌿 Project Overview
- **Project Name:** FieldLens
- **Tagline:** “Step outside. Discover what's around you.”
- **Hacktoberfest 2026 Challenge:** Week 1 — “Touch Grass”
- **Repository URL:** `https://github.com/srijan-0-7/hacktoberfest-dev-1`
- **Demo URL:** `[YOUR_DEPLOYED_VERCEL_URL]` *(e.g. https://fieldlens.vercel.app)*

---

## 🧭 The Real-World Problem
Every day, billions of hours are spent glued to indoor displays and repetitive digital routines. When people do step outside—into city parks, nature reserves, or their own backyards—they often lack the botanical or ecological background to understand what they are looking at. Existing identification apps frequently gate basic features behind aggressive paywalls, require account creation and personal data collection, or invent confident-sounding predictions even when photographic evidence is ambiguous.

**FieldLens** solves this by providing a clean, accessible, zero-registration nature observation tool. It connects users directly to their physical surroundings with safe, transparent, and grounded AI insights.

---

## 🤖 How Google Gemma Is Used
FieldLens utilizes **Google Gemma 4 Vision** (`models/gemma-4-26b-a4b-it`), an open-weights multimodal vision-language model. 

When a user snaps or uploads a photo:
1. The image is scaled and transferred securely to the serverless inference endpoint.
2. The model is guided by a **cautious observation system prompt** specifically designed to:
   - Ground predictions strictly in visible photographic evidence (leaf shape, venation, color patterns, plumage, or morphology).
   - Prevent hallucinated species names when evidence is incomplete or blurry.
   - Return broad defensive groupings (e.g., *flowering plant*, *bird*, *tree*, *mushroom*, *insect*, or *unknown organism*) when species-level certainty is unjustified.
   - Assign qualitative uncertainty levels (`low`, `medium`, `high`) accompanied by clear rationales.
   - Provide safe outdoor observation tips and reminders not to disturb the specimen.
3. The response is parsed into a strict TypeScript contract and rendered directly in the user interface.

---

## 🔓 Why Open-Source AI Matters
1. **Model Auditability & Transparency:** Open-weights models like Gemma allow developers and researchers to inspect architecture, understand training lineages, and run inference without being trapped in opaque black-box ecosystems.
2. **Community Trust & Educational Integrity:** Nature education demands transparency. Knowing exactly what model is evaluating a specimen and understanding its reasoning avoids misleading novice nature enthusiasts.
3. **Accessibility:** Open-weights AI democratizes scientific and environmental tools, making field biology accessible to anyone with a smartphone browser without commercial subscriptions.

---

## 🔍 What FieldLens Can and Cannot Identify

### ✅ What It Can Identify
- **Plants & Flora:** Broad classification of flowering plants, trees, shrubs, and succulents based on foliage, stem, and flower morphology.
- **Birds:** Common bird families and prominent species with distinct plumage or silhouette.
- **Insects & Arthropods:** Butterflies, beetles, bees, and other distinctive invertebrates.
- **Fungi & Mushrooms:** Broad fungal types and bracket fungi.
- **Environmental Context:** Identifies when an image does not contain an identifiable organism and prompts for better lighting or focal distance.

### ❌ What It Cannot Identify (By Design)
- **Definitive Foraging Safety:** FieldLens **never** declares a wild mushroom, berry, or plant safe for human consumption.
- **Microscopic or Obscured Species:** Fungi or grasses that require spore prints or microscopic tissue analysis are categorized with high uncertainty.
- **Damaged or Indistinct Photos:** It will not guess a precise Latin binomial from a blurry or distant photo.

---

## ⚡ Technical Highlights
- **Full-Stack Vite Architecture:** Unified developer experience where `npm run dev` serves both the React 18 UI and the `/api/identify` serverless middleware on a single port.
- **Hybrid Local Storage Engine:** Combines `localStorage` for lightweight structured observation journals and `IndexedDB` (via `idb-keyval`) for storing full-resolution photographs, eliminating browser storage quota crashes.
- **Zero Cloud Retention:** Ephemeral inference with strict user privacy guarantees.
- **Mobile-Ready Camera Input:** Direct camera integration via HTML5 file capture API.
- **Automated Verification:** Self-contained integration test suite (`npm run test`) verifying end-to-end multimodal inference against the live Gemma API.
