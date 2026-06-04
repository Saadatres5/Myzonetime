/**
 * MyZoneTime — server.js (SEO-FIXED VERSION)
 *
 * SEO fixes applied:
 *  1. SSR meta tag injection per route (title, description, canonical, OG, JSON-LD)
 *  2. Canonical header on every HTML response
 *  3. Dynamic sitemap.xml with all 21 routes (replaces static file)
 *  4. Corrected robots.txt with Sitemap declaration
 *  5. X-Robots-Tag header removed from normal pages (was accidentally blocking indexing)
 *  6. Proper 404 handler (prevents soft-404s)
 *  7. HSTS + security headers moved here (belt-and-suspenders with .htaccess)
 *  8. /health route excluded from sitemap and given X-Robots-Tag: noindex
 *  9. City pages now have unique, keyword-rich meta (not duplicates of home)
 * 10. Rate-limiter kept; express-rate-limit added as dependency
 */

"use strict";

const express    = require("express");
const path       = require("path");
const fs         = require("fs");
const helmet     = require("helmet");
const compression = require("compression");

const app  = express();
const PORT = process.env.PORT || 3000;
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://myzonetime.com";
const DIST = path.join(__dirname, "apps/web/dist");

// ─── 1. Compression ────────────────────────────────────────────────────────
app.use(compression({ level: 6 }));

// ─── 2. Security headers (helmet) ──────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'", "'unsafe-inline'", "https://pagead2.googlesyndication.com",
                      "https://www.googletagmanager.com", "https://www.google-analytics.com",
                      "https://adservice.google.com", "https://googleads.g.doubleclick.net"],
        styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc:     ["'self'", "https://fonts.gstatic.com"],
        imgSrc:      ["'self'", "data:", "https:", "https://images.unsplash.com"],
        connectSrc:  ["'self'", "https://api.open-meteo.com", "https://www.google-analytics.com"],
        frameSrc:    ["https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com"],
        objectSrc:   ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
);

// ─── 3. HTTPS + non-www redirect (defence-in-depth — .htaccess does this too) ─
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] === "http") {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    if (req.headers.host && req.headers.host.startsWith("www.")) {
      const nonWww = req.headers.host.replace(/^www\./, "");
      return res.redirect(301, `https://${nonWww}${req.url}`);
    }
  }
  next();
});

// ─── 4. Rate limiting (in-memory, 300 req/min/IP) ──────────────────────────
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ip  = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const win = rateLimitMap.get(ip) || { count: 0, reset: now + 60_000 };
  if (now > win.reset) { win.count = 0; win.reset = now + 60_000; }
  win.count++;
  rateLimitMap.set(ip, win);
  if (win.count > 300) {
    return res.status(429).set("Retry-After", "60").send("Too Many Requests");
  }
  next();
});

// ─── 5. Static assets (1-year cache for hashed filenames) ──────────────────
app.use("/assets", express.static(path.join(DIST, "assets"), {
  maxAge: "365d",
  immutable: true,
}));

// ─── 6. robots.txt (SEO FIX: was missing Sitemap declaration) ──────────────
app.get("/robots.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.set("X-Robots-Tag", "noindex"); // robots.txt itself should not be indexed
  res.send(
`User-agent: *
Allow: /

# Block parameter-based URLs (crawl budget protection)
Disallow: /*?*

# Block internal/utility paths
Disallow: /health
Disallow: /api/

Sitemap: ${BASE}/sitemap.xml
`
  );
});

// ─── 7. ads.txt ────────────────────────────────────────────────────────────
app.get("/ads.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  // SEO FIX: serve dynamically so it's always current; also served from dist if static exists
  const staticAds = path.join(DIST, "ads.txt");
  if (fs.existsSync(staticAds)) return res.sendFile(staticAds);
  res.send("google.com, pub-1017873487030471, DIRECT, f08c47fec0942fa0\n");
});

// ─── 8. llms.txt ───────────────────────────────────────────────────────────
app.get("/llms.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(
`# MyZoneTime — AI/LLM Crawler Policy
# https://llmstxt.org

User-agent: *
Allow: /
`
  );
});

// ─── 9. Dynamic sitemap.xml ────────────────────────────────────────────────
// SEO FIX: Replaces static sitemap.xml in dist/ which was not auto-updating.
// All 21 indexable routes included. /health excluded. City pages get priority 0.7.

const ROUTES = [
  { path: "/",                          priority: "1.0", changefreq: "daily"   },
  { path: "/world-clock",               priority: "0.9", changefreq: "daily"   },
  { path: "/timezone-converter",        priority: "0.9", changefreq: "daily"   },
  { path: "/meeting-planner",           priority: "0.8", changefreq: "weekly"  },
  { path: "/time-difference-calculator",priority: "0.8", changefreq: "weekly"  },
  { path: "/hijri-calendar",            priority: "0.8", changefreq: "daily"   },
  { path: "/stopwatch",                 priority: "0.7", changefreq: "monthly" },
  { path: "/timer",                     priority: "0.7", changefreq: "monthly" },
  { path: "/countdown",                 priority: "0.7", changefreq: "monthly" },
  { path: "/date-calculator",           priority: "0.7", changefreq: "monthly" },
  { path: "/work-hours-calculator",     priority: "0.7", changefreq: "monthly" },
  // City pages
  { path: "/dubai",                     priority: "0.7", changefreq: "weekly"  },
  { path: "/london",                    priority: "0.7", changefreq: "weekly"  },
  { path: "/new-york",                  priority: "0.7", changefreq: "weekly"  },
  { path: "/tokyo",                     priority: "0.7", changefreq: "weekly"  },
  { path: "/singapore",                 priority: "0.7", changefreq: "weekly"  },
  { path: "/sydney",                    priority: "0.7", changefreq: "weekly"  },
  { path: "/riyadh",                    priority: "0.7", changefreq: "weekly"  },
  { path: "/abu-dhabi",                 priority: "0.7", changefreq: "weekly"  },
  // Legal
  { path: "/privacy-policy",            priority: "0.3", changefreq: "yearly"  },
  { path: "/terms-of-service",          priority: "0.3", changefreq: "yearly"  },
];

const TODAY = new Date().toISOString().split("T")[0];

app.get("/sitemap.xml", (req, res) => {
  const urls = ROUTES.map(r => `
  <url>
    <loc>${BASE}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join("");

  res.set("Content-Type", "application/xml; charset=utf-8");
  res.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`);
});

// ─── 10. Health check (noindex) ────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.set("X-Robots-Tag", "noindex, nofollow");
  res.json({ status: "ok", uptime: process.uptime() });
});

// ─── 11. Per-route SEO metadata map ────────────────────────────────────────
const SITE_NAME = "MyZoneTime";

const META = {
  "/": {
    title: "World Clock & Time Zone Converter — Live Time in 500+ Cities | MyZoneTime",
    description: "See the current time in over 500 cities worldwide. Convert time zones, plan meetings across time zones, and check the Hijri calendar — free and instant.",
    canonical: `${BASE}/`,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": BASE,
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${BASE}/timezone-converter?from={search_term_string}` },
        "query-input": "required name=search_term_string"
      }
    }),
  },
  "/world-clock": {
    title: "World Clock — Live Time in 500+ Cities | MyZoneTime",
    description: "Live world clock showing the current local time in over 500 cities across all time zones. Updated in real-time.",
    canonical: `${BASE}/world-clock`,
    h1: "World Clock",
  },
  "/timezone-converter": {
    title: "Time Zone Converter — Convert Time Between Any Two Cities | MyZoneTime",
    description: "Convert time between any two cities or time zones instantly. Free online time zone converter for travellers and remote teams.",
    canonical: `${BASE}/timezone-converter`,
    h1: "Time Zone Converter",
  },
  "/meeting-planner": {
    title: "Meeting Planner — Find the Best Time Across Time Zones | MyZoneTime",
    description: "Schedule meetings with participants in different time zones. Find overlapping business hours across multiple cities, free.",
    canonical: `${BASE}/meeting-planner`,
    h1: "Meeting Planner",
  },
  "/time-difference-calculator": {
    title: "Time Difference Calculator — Hours Between Cities | MyZoneTime",
    description: "Calculate the exact time difference between any two cities or time zones. Ideal for international travel and remote work.",
    canonical: `${BASE}/time-difference-calculator`,
    h1: "Time Difference Calculator",
  },
  "/hijri-calendar": {
    title: "Hijri Calendar 2025 — Islamic Date Converter | MyZoneTime",
    description: "View today's Hijri (Islamic) date and convert between Hijri and Gregorian calendars. Accurate Islamic calendar for 2025.",
    canonical: `${BASE}/hijri-calendar`,
    h1: "Hijri Calendar",
  },
  "/stopwatch": {
    title: "Online Stopwatch — Precision Timer with Lap Recording | MyZoneTime",
    description: "Free online stopwatch with millisecond precision and lap recording. Works in your browser, no download needed.",
    canonical: `${BASE}/stopwatch`,
    h1: "Online Stopwatch",
  },
  "/timer": {
    title: "Online Countdown Timer — Set Any Duration | MyZoneTime",
    description: "Free online countdown timer. Set hours, minutes, and seconds with an audible alert when it reaches zero.",
    canonical: `${BASE}/timer`,
    h1: "Online Timer",
  },
  "/countdown": {
    title: "Event Countdown Timer — Days Until Any Date | MyZoneTime",
    description: "Count down the days, hours, minutes, and seconds to any upcoming event or date.",
    canonical: `${BASE}/countdown`,
    h1: "Event Countdown",
  },
  "/date-calculator": {
    title: "Date Calculator — Days Between Dates | MyZoneTime",
    description: "Calculate the number of days, weeks, or months between any two dates. Add or subtract days from a date instantly.",
    canonical: `${BASE}/date-calculator`,
    h1: "Date Calculator",
  },
  "/work-hours-calculator": {
    title: "Work Hours Calculator — Timesheet & Payroll Tool | MyZoneTime",
    description: "Calculate total work hours from clock-in/clock-out times. Free timesheet calculator for payroll and billing.",
    canonical: `${BASE}/work-hours-calculator`,
    h1: "Work Hours Calculator",
  },
  // City pages — unique titles/descriptions per city (SEO FIX: prevents duplicate content)
  "/dubai": {
    title: "Current Time in Dubai — Dubai Clock, UTC+4 | MyZoneTime",
    description: "What time is it in Dubai right now? Live clock for Dubai, UAE (UTC+4, GST). Convert Dubai time to any city.",
    canonical: `${BASE}/dubai`,
    h1: "Current Time in Dubai",
    schema: citySchema("Dubai", "Dubai, UAE", "Asia/Dubai", "UAE"),
  },
  "/london": {
    title: "Current Time in London — London Clock, GMT/BST | MyZoneTime",
    description: "What time is it in London right now? Live clock for London, UK (GMT/BST). Convert London time to any city.",
    canonical: `${BASE}/london`,
    h1: "Current Time in London",
    schema: citySchema("London", "London, UK", "Europe/London", "UK"),
  },
  "/new-york": {
    title: "Current Time in New York — New York Clock, EST/EDT | MyZoneTime",
    description: "What time is it in New York right now? Live clock for New York, USA (ET). Convert NYC time to any city.",
    canonical: `${BASE}/new-york`,
    h1: "Current Time in New York",
    schema: citySchema("New York", "New York, USA", "America/New_York", "USA"),
  },
  "/tokyo": {
    title: "Current Time in Tokyo — Tokyo Clock, JST UTC+9 | MyZoneTime",
    description: "What time is it in Tokyo right now? Live clock for Tokyo, Japan (JST, UTC+9). Convert Tokyo time to any city.",
    canonical: `${BASE}/tokyo`,
    h1: "Current Time in Tokyo",
    schema: citySchema("Tokyo", "Tokyo, Japan", "Asia/Tokyo", "Japan"),
  },
  "/singapore": {
    title: "Current Time in Singapore — Singapore Clock, SGT UTC+8 | MyZoneTime",
    description: "What time is it in Singapore right now? Live clock for Singapore (SGT, UTC+8). Convert Singapore time instantly.",
    canonical: `${BASE}/singapore`,
    h1: "Current Time in Singapore",
    schema: citySchema("Singapore", "Singapore", "Asia/Singapore", "Singapore"),
  },
  "/sydney": {
    title: "Current Time in Sydney — Sydney Clock, AEST/AEDT | MyZoneTime",
    description: "What time is it in Sydney right now? Live clock for Sydney, Australia (AEST/AEDT). Convert Sydney time to any city.",
    canonical: `${BASE}/sydney`,
    h1: "Current Time in Sydney",
    schema: citySchema("Sydney", "Sydney, Australia", "Australia/Sydney", "Australia"),
  },
  "/riyadh": {
    title: "Current Time in Riyadh — Riyadh Clock, AST UTC+3 | MyZoneTime",
    description: "What time is it in Riyadh right now? Live clock for Riyadh, Saudi Arabia (AST, UTC+3). Convert Riyadh time instantly.",
    canonical: `${BASE}/riyadh`,
    h1: "Current Time in Riyadh",
    schema: citySchema("Riyadh", "Riyadh, Saudi Arabia", "Asia/Riyadh", "Saudi Arabia"),
  },
  "/abu-dhabi": {
    title: "Current Time in Abu Dhabi — Abu Dhabi Clock, GST UTC+4 | MyZoneTime",
    description: "What time is it in Abu Dhabi right now? Live clock for Abu Dhabi, UAE (GST, UTC+4). Convert Abu Dhabi time instantly.",
    canonical: `${BASE}/abu-dhabi`,
    h1: "Current Time in Abu Dhabi",
    schema: citySchema("Abu Dhabi", "Abu Dhabi, UAE", "Asia/Dubai", "UAE"),
  },
  "/privacy-policy": {
    title: "Privacy Policy | MyZoneTime",
    description: "Read MyZoneTime's privacy policy to understand how we collect, use, and protect your data.",
    canonical: `${BASE}/privacy-policy`,
    noindex: false,
  },
  "/terms-of-service": {
    title: "Terms of Service | MyZoneTime",
    description: "MyZoneTime terms of service and usage conditions.",
    canonical: `${BASE}/terms-of-service`,
    noindex: false,
  },
};

function citySchema(city, location, timezone, country) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Current Time in ${city}`,
    "description": `Live local time in ${location} (${timezone})`,
    "url": `${BASE}/${city.toLowerCase().replace(/\s+/g, "-")}`,
    "about": {
      "@type": "City",
      "name": city,
      "containedInPlace": { "@type": "Country", "name": country }
    }
  });
}

// ─── 12. SPA HTML with SSR meta injection ──────────────────────────────────
// SEO FIX: Google receives unique, crawlable meta tags for every route
// instead of the blank index.html shell.

const INDEX_HTML_PATH = path.join(DIST, "index.html");

function renderHtml(routePath) {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    return "<html><body><h1>Build not found. Run npm run build.</h1></body></html>";
  }

  const meta  = META[routePath] || {
    title:       `${SITE_NAME} — World Clock & Time Zone Tools`,
    description: "Free online world clock, time zone converter, and time tools.",
    canonical:   `${BASE}${routePath}`,
  };

  const ogImage = `${BASE}/og-image.png`;
  const h1Tag   = meta.h1 ? `<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;">${meta.h1}</h1>` : "";
  const robotsMeta = meta.noindex
    ? `<meta name="robots" content="noindex, follow" />`
    : `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`;

  const schemaTag = meta.schema
    ? `<script type="application/ld+json">${meta.schema}</script>`
    : "";

  const injected = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${meta.canonical}" />
    ${robotsMeta}
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="${meta.canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${ogImage}" />
    ${schemaTag}`;

  let html = fs.readFileSync(INDEX_HTML_PATH, "utf8");
  // Remove the static <!-- SSR meta tags injected by server/index.js go here --> comment
  html = html.replace(/<!-- SSR meta tags injected by server\/index\.js go here -->/g, injected);
  // Replace SSR_H1_INJECT placeholder
  html = html.replace(/<!-- SSR_H1_INJECT -->/g, h1Tag);

  return html;
}

// ─── 13. Static files from dist/ ──────────────────────────────────────────
app.use(express.static(DIST, {
  maxAge: "1h",
  index: false,   // IMPORTANT: disable auto-serve of index.html — we handle it below
  setHeaders: (res, filePath) => {
    // Long cache for hashed assets is set by the /assets route above
    if (filePath.endsWith(".xml") || filePath.endsWith(".txt")) {
      res.set("Cache-Control", "public, max-age=3600");
    }
  },
}));

// ─── 14. SPA catch-all (SSR meta injection per route) ──────────────────────
const KNOWN_ROUTES = new Set(ROUTES.map(r => r.path));

app.get("*", (req, res) => {
  const routePath = req.path.replace(/\/$/, "") || "/";
  const isKnown   = KNOWN_ROUTES.has(routePath);

  if (!isKnown) {
    // SEO FIX: return real 404 status (prevents soft-404 in GSC)
    res.status(404);
  }

  // Set canonical header (belt-and-suspenders alongside <link rel="canonical">)
  const canonical = `${BASE}${isKnown ? routePath : req.path}`;
  res.set("Link", `<${canonical}>; rel="canonical"`);
  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Cache-Control", isKnown ? "public, s-maxage=300, stale-while-revalidate=86400" : "no-store");
  res.send(renderHtml(routePath));
});

// ─── 15. Start server ──────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MyZoneTime running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

module.exports = app;
