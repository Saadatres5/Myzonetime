# MyZoneTime — Hostinger Node.js Deployment Guide

**World Clock & Time Zone Converter — Production Build**  
Live time in 500+ cities · Meeting Planner · Hijri Calendar · AdSense Ready

---

## 🚀 Quick Deploy to Hostinger

### Step 1 — Upload Files

1. Compress this entire folder into a `.zip`
2. Log in to Hostinger hPanel
3. Go to **Websites → Manage → Node.js**
4. Upload and extract the zip into your Node.js app root

### Step 2 — Configure the App

In Hostinger hPanel → Node.js settings:

| Setting | Value |
|---------|-------|
| **Node.js version** | 18 or 20 |
| **Application entry point** | `server.js` |
| **Application root** | `/` (the project root) |
| **Start command** | `npm start` |

### Step 3 — Install & Build

Open the **SSH terminal** or use Hostinger's built-in terminal:

```bash
# From your app root directory:
npm install
npm run build
npm start
```

> **Important:** `npm run build` compiles the React frontend into `apps/web/dist/`.  
> The server reads from that directory. You MUST run build before starting.

### Step 4 — Set Environment Variables

In hPanel → Node.js → Environment Variables, add:

```
NODE_ENV=production
PORT=3000
```

### Step 5 — Start the App

Click **"Start"** in hPanel, or run:

```bash
npm start
```

The app will listen on `0.0.0.0:3000` and Hostinger's reverse proxy will route traffic to it.

---

## 📁 Project Structure

```
myzonetime/
├── server.js              ← Express entry point (Hostinger starts this)
├── package.json           ← Root package with start/build scripts
├── .htaccess              ← Apache proxy config for Hostinger
├── .nvmrc                 ← Node.js version pin
├── .env.example           ← Environment variable template
├── apps/
│   └── web/
│       ├── src/           ← React source (pages, components, hooks)
│       ├── dist/          ← Built frontend (served by Express)
│       │   ├── index.html
│       │   ├── assets/    ← Hashed JS/CSS bundles
│       │   ├── sitemap.xml
│       │   ├── robots.txt
│       │   ├── ads.txt
│       │   └── manifest.json
│       ├── package.json
│       └── vite.config.js
└── README.md
```

---

## 🛠️ Available Scripts

```bash
npm start          # Start the Express server (production)
npm run build      # Build the React frontend with Vite
npm run build:prod # Build with NODE_ENV=production
npm run dev        # Start Vite dev server (development only)
```

---

## 🌐 Routes & Pages

| Route | Page |
|-------|------|
| `/` | Home — city cards, search, local weather |
| `/world-clock` | Live clocks for 500+ cities |
| `/timezone-converter` | Convert time between any cities |
| `/meeting-planner` | Find best meeting times |
| `/time-difference-calculator` | Hours between cities |
| `/hijri-calendar` | Islamic/Hijri date & converter |
| `/stopwatch` | Precision stopwatch with laps |
| `/timer` | Countdown timer |
| `/countdown` | Event countdown |
| `/date-calculator` | Days between dates |
| `/work-hours-calculator` | Timesheet calculator |
| `/dubai` | Live clock for Dubai |
| `/london` | Live clock for London |
| `/new-york` | Live clock for New York |
| `/tokyo` | Live clock for Tokyo |
| `/singapore` | Live clock for Singapore |
| `/sydney` | Live clock for Sydney |
| `/riyadh` | Live clock for Riyadh |
| `/abu-dhabi` | Live clock for Abu Dhabi |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms of Service |
| `/health` | Health check endpoint (JSON) |

---

## 🔒 Security Features

- Helmet.js with custom CSP for AdSense compatibility
- Rate limiting (300 req/min per IP, in-memory)
- HTTPS redirect in production
- WWW → non-WWW redirect
- Security headers: HSTS, X-Frame-Options, CSP, etc.
- Gzip compression (level 6)

---

## 📈 SEO Features

- SSR-injected meta tags per route (title, description, canonical)
- Open Graph & Twitter Card tags
- Structured data / JSON-LD
- sitemap.xml at `/sitemap.xml`
- robots.txt at `/robots.txt`
- Canonical tags
- ads.txt for AdSense
- llms.txt for AI crawlers

---

## 💰 AdSense

Publisher ID: `ca-pub-1017873487030471`  
Default slot: `2320643248`

AdSense script is loaded in `apps/web/index.html`. The CSP in `server.js` is pre-configured to allow all Google AdSense domains.

---

## ⚡ Performance

- Vite code-splitting: vendor-react, vendor-ui, vendor-icons, per-page chunks
- Lazy-loaded routes with React.lazy + Suspense
- Long-cache headers (1 year) for hashed assets
- Compression middleware (gzip)
- DNS prefetch for all third-party origins
- Non-blocking font loading

---

## 🔧 Troubleshooting

**"Site is building" message on load:**  
The `dist/index.html` was not found. Run `npm run build` first.

**Port conflict:**  
Hostinger sets `PORT` automatically. Do not hardcode it.

**Build fails:**  
Ensure Node.js ≥ 18 and npm ≥ 9 are available. Run `node --version`.

**Assets 404:**  
Make sure you ran `npm run build` and that `apps/web/dist/` exists with content.
