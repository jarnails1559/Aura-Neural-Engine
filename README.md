# ✦ AURA — Neural Engine

> **High-fidelity, 100% on-device sentiment analysis.** No servers. No API keys. No data ever leaves your browser.

AURA is a browser-based sentiment analyzer that runs a real transformer model (RoBERTa) **entirely client-side** via WebAssembly. Type any text and AURA decodes the emotion behind it — Positive, Negative, or Neutral — wrapped in a sci-fi "holographic OS" interface, complete with a live confidence ring and a reactive color aura.

The model is downloaded once from the Hugging Face CDN and cached in your browser. Every prediction after that is fully local and private.

---

## ✨ Features

- **Private by design** — inference runs in your browser with WebAssembly; text is never sent anywhere.
- **Real transformer model** — [`Xenova/twitter-roberta-base-sentiment-latest`](https://huggingface.co/Xenova/twitter-roberta-base-sentiment-latest), a RoBERTa model fine-tuned on tweets.
- **Non-blocking UI** — all model loading and inference is offloaded to a **Web Worker**, so the interface never freezes.
- **Nuanced output** — classification is graded into intensities ("Slightly", "Moderately", "Highly", "Overwhelmingly").
- **Holographic interface** — glassmorphism panels, an animated SVG confidence ring, a reactive theme-color aura, and a 3D mouse-tilt parallax effect.
- **Fully responsive** — tuned for desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

| Layer        | Technology |
|--------------|-----------|
| Build tool   | [Vite 5](https://vitejs.dev/) (vanilla JS — no framework) |
| ML runtime   | [`@xenova/transformers`](https://github.com/xenova/transformers.js) (Transformers.js) |
| Model        | `Xenova/twitter-roberta-base-sentiment-latest` (ONNX / WASM) |
| Threading    | Web Worker |
| Styling      | Hand-written CSS (custom properties, glassmorphism) |
| Fonts        | Outfit + JetBrains Mono (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer

### Install & run locally

```bash
# clone the repo
git clone https://github.com/jarnails1559/Aura-Neural-Engine.git
cd Aura-Neural-Engine

# install dependencies
npm install

# start the dev server
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

> On first load AURA downloads the model weights (~80–120 MB) from the Hugging Face CDN. This happens once and is cached by your browser for subsequent visits.

### Available scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start the local development server   |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build locally |

---

## ☁️ Deploying to Vercel

This project is a static Vite app and deploys to Vercel with **zero extra configuration**.

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New → Project** and import the repo.
3. Vercel auto-detects the framework. The settings (also pinned in [`vercel.json`](./vercel.json)) are:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**. That's it.

No environment variables or secrets are required — the model loads from a public CDN at runtime.

---

## 🧠 How It Works

```
index.html
   │
   ├─ src/main.js        UI thread: DOM, animations, theming, events
   │      ⇅ postMessage
   └─ src/worker.js      ML thread: loads the model & runs inference
              │
              └─ @xenova/transformers → ONNX model (WebAssembly)
```

1. **`main.js`** spawns a Web Worker and sends a `load` message on startup.
2. **`worker.js`** lazily initializes a Transformers.js `sentiment-analysis` pipeline (a singleton), streaming download progress back to drive the boot screen.
3. When you click **Engage Scan**, the text is sent to the worker, classified, and the result is posted back.
4. **`main.js`** maps the label + score to a nuanced intensity, re-tints the UI via a CSS variable, and animates the confidence ring.

---

## 📂 Project Structure

```
.
├── index.html          # App shell + holographic UI markup
├── public/             # Static assets (favicon, icons)
├── src/
│   ├── main.js         # UI controller (main thread)
│   ├── worker.js       # ML pipeline (Web Worker)
│   └── style.css       # Holographic spatial UI styles
├── vercel.json         # Vercel build configuration
└── package.json
```

---

## 📝 License

Released for personal and educational use.

---

<p align="center">
  <sub><b>SYS_ARCHITECT</b> // JARNAIL SINGH (JAXS)</sub>
</p>
