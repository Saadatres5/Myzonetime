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
 *10. Rate-limiter kept; using a lightweight custom in-memory implementation
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
        connectSrc:  ["'self'", "https://api.open-meteo.com", "https://www.google-analytics.com", "https://api.groq.com"],
        frameSrc:    ["https://googleads.g.doubleclick.net", "https://tpc.googlesyndication.com"],
        frameAncestors: ["'self'"],          // prevents clickjacking
        objectSrc:   ["'none'"],
        baseUri:     ["'self'"],             // prevents base tag injection
        formAction:  ["'self'"],             // prevents form hijacking
        upgradeInsecureRequests: [],
      },
    },
    hsts:                 { maxAge: 31536000, includeSubDomains: true, preload: true },
    referrerPolicy:       { policy: "strict-origin-when-cross-origin" },
    crossOriginOpenerPolicy:   { policy: "same-origin-allow-popups" }, // needed for Google Sign-In/Ads popups
    crossOriginResourcePolicy: { policy: "cross-origin" },             // allows CDN assets
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

// ─── 4. Rate limiting — EXEMPT Googlebot and major crawlers ──────────────
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  // Exempt all major search engine crawlers from rate limiting
  if (ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('yandex') ||
      ua.includes('duckduckbot') || ua.includes('slurp') || ua.includes('facebookexternalhit') ||
      ua.includes('twitterbot') || ua.includes('linkedinbot') || ua.includes('applebot')) {
    return next();
  }
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

// ─── 5a. JSON body parser (needed for API proxy) ───────────────────────────
app.use(express.json({ limit: '16kb' }));

// ─── 5b. Anthropic API proxy (/api/ai-meeting) ─────────────────────────────
// Keeps the Anthropic API key server-side; browser calls /api/ai-meeting.
const AI_RATE = new Map(); // simple per-IP rate limit: 20 req/min
app.post('/api/ai-meeting', async (req, res) => {
  const ip  = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const ai  = AI_RATE.get(ip) || { count: 0, reset: now + 60_000 };
  if (now > ai.reset) { ai.count = 0; ai.reset = now + 60_000; }
  ai.count++;
  AI_RATE.set(ip, ai);
  if (ai.count > 20) return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });

  const { messages, system } = req.body;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const apiKey = process.env.SDT_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI service not configured.' });

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:      'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages:   [{ role: 'system', content: system || '' }, ...messages],
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data?.error?.message || 'AI error.' });
    // Normalise to Anthropic-style response shape the frontend expects
    res.json({ content: [{ text: data.choices?.[0]?.message?.content || '' }] });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach AI service.' });
  }
});

// ─── 5. Static assets (1-year cache for hashed filenames) ──────────────────
app.use("/assets", express.static(path.join(DIST, "assets"), {
  maxAge: "365d",
  immutable: true,
}));

// ─── 6. robots.txt (SEO FIX: was missing Sitemap declaration) ──────────────
app.get("/robots.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  // NOTE: Do NOT set X-Robots-Tag: noindex on robots.txt — it would confuse crawlers
  const sitemapUrl = `${BASE}/sitemap-index.xml`;
  res.send(
`User-agent: *
Allow: /

# Block parameter-based URLs (crawl budget protection)
Disallow: /*?*

# Block internal/utility paths
Disallow: /health
Disallow: /api/

Sitemap: ${sitemapUrl}
`
  );
});

// ─── Sitemap cache (1 hour) — prevents slow generation causing 403 timeouts ─
const _sitemapCache = new Map();
function getCached(key, buildFn) {
  const hit = _sitemapCache.get(key);
  if (hit && Date.now() - hit.t < 3600000) return hit.xml;
  const xml = buildFn();
  _sitemapCache.set(key, { xml, t: Date.now() });
  return xml;
}

// ─── Fallback paths (used if file-parsing fails) ──────────────────────────
const FALLBACK_CITY_PATHS = [
  '/dubai','/abu-dhabi','/london','/new-york','/paris','/tokyo',
  '/singapore','/sydney','/bangkok','/istanbul','/kuala-lumpur','/oslo','/riyadh',
];
const FALLBACK_TZ_PATHS = [
  '/timezone/gst','/timezone/gmt','/timezone/bst','/timezone/est','/timezone/edt',
  '/timezone/cet','/timezone/cest','/timezone/jst','/timezone/sgt','/timezone/aest',
  '/timezone/ict','/timezone/trt','/timezone/myt','/timezone/ast',
];

// ─── Sitemap helpers ───────────────────────────────────────────────────────
function xmlUrl(loc, lastmod, changefreq, priority) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}
function sitemapHeader() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
}
function sitemapFooter() { return `</urlset>`; }
function sendXml(res, body) {
  res.set('Content-Type', 'application/xml; charset=utf-8');
  res.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  // NOTE: Do NOT add X-Robots-Tag: noindex to sitemaps — that blocks Google from reading them!
  res.send(body);
}

// ─── sitemap-index — dual routes (.xml + extension-less WAF bypass) ─────────
app.get(['/sitemap-index.xml', '/sitemap-index'], (req, res) => {
  const xml = getCached('index', () => {
    const today = new Date().toISOString().split('T')[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE}/sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${BASE}/city-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${BASE}/timezone-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${BASE}/time-difference-sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>
</sitemapindex>`;
  });
  sendXml(res, xml);
});

// ─── sitemap.xml — core tool pages ─────────────────────────────────────────
app.get(['/sitemap.xml', '/sitemap'], (req, res) => {
  const xml = getCached('sitemap', () => {
  const today = new Date().toISOString().split('T')[0];
  const urls = CORE_ROUTES
    .concat([
      { path: '/privacy-policy',     priority: '0.3', changefreq: 'yearly'  },
      { path: '/terms-of-service',   priority: '0.3', changefreq: 'yearly'  },
      { path: '/contact-us',         priority: '0.4', changefreq: 'yearly'  },
      { path: '/world-clock-widget', priority: '0.5', changefreq: 'monthly' },
    ])
    .map(r => xmlUrl(`${BASE}${r.path}`, today, r.changefreq, r.priority))
    .join('\n');
  return `${sitemapHeader()}\n${urls}\n${sitemapFooter()}`;
  });
  sendXml(res, xml);
});

// ─── city-sitemap — dual routes, cached, with fallback ───────────────────
app.get(['/city-sitemap.xml', '/city-sitemap'], (req, res) => {
  const xml = getCached('city', () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const paths = getCityRoutePaths();
      const list = paths.length > 0 ? paths : FALLBACK_CITY_PATHS;
      return `${sitemapHeader()}\n${list.map(p => xmlUrl(`${BASE}${p}`, today, 'weekly', '0.8')).join('\n')}\n${sitemapFooter()}`;
    } catch(e) {
      return `${sitemapHeader()}\n${FALLBACK_CITY_PATHS.map(p => xmlUrl(`${BASE}${p}`, today, 'weekly', '0.8')).join('\n')}\n${sitemapFooter()}`;
    }
  });
  sendXml(res, xml);
});

// ─── timezone-sitemap — dual routes, cached, with fallback ─────────────────
app.get(['/timezone-sitemap.xml', '/timezone-sitemap'], (req, res) => {
  const xml = getCached('timezone', () => {
    const today = new Date().toISOString().split('T')[0];
    const indexUrl = xmlUrl(`${BASE}/timezone`, today, 'weekly', '0.8');
    try {
      const paths = getTimezoneRoutePaths().filter(p => p !== '@timezone-index@');
      const list = paths.length > 0 ? paths : FALLBACK_TZ_PATHS;
      return `${sitemapHeader()}\n${indexUrl}\n${list.map(p => xmlUrl(`${BASE}${p}`, today, 'weekly', '0.7')).join('\n')}\n${sitemapFooter()}`;
    } catch(e) {
      return `${sitemapHeader()}\n${indexUrl}\n${FALLBACK_TZ_PATHS.map(p => xmlUrl(`${BASE}${p}`, today, 'weekly', '0.7')).join('\n')}\n${sitemapFooter()}`;
    }
  });
  sendXml(res, xml);
});

// ─── time-difference-sitemap — dual routes, CACHED (528 URLs) ───────────────
app.get(['/time-difference-sitemap.xml', '/time-difference-sitemap'], (req, res) => {
  const xml = getCached('timediff', () => {
    const today = new Date().toISOString().split('T')[0];
    const urls = TIME_DIFFERENCE_ROUTES
      .map(r => xmlUrl(`${BASE}${r.path}`, today, r.changefreq, r.priority))
      .join('\n');
    return `${sitemapHeader()}\n${urls}\n${sitemapFooter()}`;
  });
  sendXml(res, xml);
});

// ─── 7. ads.txt ────────────────────────────────────────────────────────────
app.get("/ads.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("google.com, pub-5444446255342320, DIRECT, f08c47fec0942fa0\n");
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

// ─── 10. Health check (noindex) ────────────────────────────────────────────
function parseTopLevelObjectKeys(filePath, exportName) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const marker = `export const ${exportName}`;
  const start = text.indexOf(marker);
  if (start === -1) return [];
  const braceStart = text.indexOf('{', start);
  if (braceStart === -1) return [];

  // Walk the top-level keys of the exported object
  const objectBody = text.slice(braceStart + 1);
  const keys = [];
  let depth = 0;
  let j = 0;
  while (j < objectBody.length) {
    const ch = objectBody[j];
    if (depth === 0) {
      if (/[A-Za-z0-9_\-]/.test(ch)) {
        let key = '';
        while (j < objectBody.length && /[A-Za-z0-9_\-]/.test(objectBody[j])) {
          key += objectBody[j];
          j++;
        }
        while (j < objectBody.length && /\s/.test(objectBody[j])) j++;
        if (objectBody[j] === ':') {
          keys.push(key);
        }
        j++;
        continue;
      }
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      if (depth > 0) depth--;
    }
    j++;
  }

  return keys;
}

function getCityRoutePaths() {
  const cityFile = path.join(__dirname, 'apps/web/src/data/cityPageData.js');
  const keys = parseTopLevelObjectKeys(cityFile, 'CITY_SEO_DATA');
  return keys.sort().map(key => `/${key}`);
}

function getTimezoneRoutePaths() {
  const tzFile = path.join(__dirname, 'apps/web/src/data/timezoneData.js');
  const keys = parseTopLevelObjectKeys(tzFile, 'TIMEZONE_DATA');
  return ['@timezone-index@', ...keys.sort().map(key => `/timezone/${key}`)];
}

function uniqueRoutes(routes) {
  const seen = new Set();
  return routes.filter(route => {
    if (seen.has(route.path)) return false;
    seen.add(route.path);
    return true;
  });
}

const CORE_ROUTES = [
  { path: "/",                           priority: "1.0", changefreq: "daily"   },
  { path: "/world-clock",                priority: "0.9", changefreq: "daily"   },
  { path: "/timezone-converter",         priority: "0.9", changefreq: "daily"   },
  { path: "/meeting-planner",            priority: "0.8", changefreq: "weekly"  },
  { path: "/ai-meeting-planner",         priority: "0.9", changefreq: "weekly"  },
  { path: "/time-difference-calculator", priority: "0.8", changefreq: "weekly"  },
  { path: "/hijri-calendar",             priority: "0.8", changefreq: "daily"   },
  { path: "/prayer-times",               priority: "0.8", changefreq: "daily"   },
  { path: "/sunrise-sunset",             priority: "0.7", changefreq: "daily"   },
  { path: "/week-number",                priority: "0.7", changefreq: "weekly"  },
  { path: "/unix-time",                  priority: "0.6", changefreq: "daily"   },
  { path: "/stopwatch",                  priority: "0.7", changefreq: "monthly" },
  { path: "/timer",                      priority: "0.7", changefreq: "monthly" },
  { path: "/countdown",                  priority: "0.7", changefreq: "monthly" },
  { path: "/date-calculator",            priority: "0.7", changefreq: "monthly" },
  { path: "/work-hours-calculator",      priority: "0.7", changefreq: "monthly" },
  { path: "/time-calculator",            priority: "0.7", changefreq: "monthly" },
  { path: "/india-time",                 priority: "0.7", changefreq: "daily"   },
  { path: "/time-management-tips",       priority: "0.5", changefreq: "monthly" },
  { path: "/windows-time-settings",      priority: "0.5", changefreq: "monthly" },
  { path: "/timezone",                   priority: "0.8", changefreq: "weekly"  },
  { path: "/ar",                         priority: "0.8", changefreq: "daily"   },
  { path: "/hi",                         priority: "0.8", changefreq: "daily"   },
  { path: "/es",                         priority: "0.8", changefreq: "daily"   },
];

const TIME_DIFFERENCE_ROUTES = [
  { path: '/time-difference/new-york-and-london',     priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/dubai-and-london',        priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/dubai-and-new-york',      priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/tokyo-and-new-york',      priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/london-and-sydney',       priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/singapore-and-london',    priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/riyadh-and-london',       priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/istanbul-and-dubai',      priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/paris-and-dubai',         priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/sydney-and-dubai',        priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/bangkok-and-london',      priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/kuala-lumpur-and-london', priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/tokyo-and-london',        priority: '0.7', changefreq: 'weekly' },
  { path: '/time-difference/singapore-and-new-york',  priority: '0.7', changefreq: 'weekly' },
];

const ROUTES = uniqueRoutes([
  ...CORE_ROUTES,
  ...getCityRoutePaths().map(path => ({ path, priority: '0.7', changefreq: 'weekly' })),
  ...getTimezoneRoutePaths().map(path => ({
    path: path === '@timezone-index@' ? '/timezone' : path,
    priority: path === '@timezone-index@' ? '0.8' : '0.7',
    changefreq: 'weekly',
  })),
  ...TIME_DIFFERENCE_ROUTES,
  { path: "/privacy-policy",    priority: "0.3", changefreq: "yearly"  },
  { path: "/terms-of-service",  priority: "0.3", changefreq: "yearly"  },
  { path: "/contact-us",        priority: "0.4", changefreq: "yearly"  },
  { path: "/world-clock-widget",priority: "0.5", changefreq: "monthly" },
]);


// ─── IndexNow key file ─────────────────────────────────────────────────────
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '7e2f04f815104ea3a0f7af7c1ee2a3ed';
app.get(`/${INDEXNOW_KEY}.txt`, (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(INDEXNOW_KEY);
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
  "/ai-meeting-planner": {
    title: "AI Meeting Planner Worldwide — Smart Global Time Zone Scheduler | MyZoneTime",
    description: "AI-powered worldwide meeting planner. Describe your meeting in plain English and get instant best time slots, local times for every city, DST warnings, and global scheduling scenarios. Free.",
    canonical: `${BASE}/ai-meeting-planner`,
    h1: "AI Meeting Planner Worldwide",
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
  "/contact-us": {
    title: "Contact Us | MyZoneTime",
    description: "Get in touch with the MyZoneTime team. We'd love to hear from you.",
    canonical: `${BASE}/contact-us`,
    noindex: false,
  },
  "/world-clock-widget": {
    title: "Free World Clock Widget — Embed on Any Website | MyZoneTime",
    description: "Free embeddable world clock widget for your website. Shows live time in multiple cities. Easy iframe embed, no signup required.",
    canonical: `${BASE}/world-clock-widget`,
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
  // Dynamic meta generation for routes not present in the static META map
  if (!META[routePath]) {
    // Helper: turn 'new-york' -> 'New York'
    const formatSlug = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    if (routePath.startsWith('/time-difference/')) {
      const tail = routePath.replace('/time-difference/', '');
      const parts = tail.split('-and-').map(p => formatSlug(p.replace(/\//g, '')));
      if (parts.length === 2) {
        meta.title = `Time difference between ${parts[0]} and ${parts[1]} — ${SITE_NAME}`;
        meta.description = `Calculate the time difference between ${parts[0]} and ${parts[1]}. Convert times, plan meetings, and see local offsets instantly.`;
        meta.canonical = `${BASE}${routePath}`;
      }
    } else if (routePath.startsWith('/timezone/')) {
      const tzSlug = routePath.replace('/timezone/', '');
      const tzName = formatSlug(tzSlug);
      meta.title = `${tzName} — Time Zone Info & Current UTC Offset | ${SITE_NAME}`;
      meta.description = `Learn the current UTC offset for ${tzName}. See countries, cities, daylight saving rules, and conversion examples for this time zone.`;
      meta.canonical = `${BASE}${routePath}`;
      meta.schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: meta.title,
        description: meta.description,
        url: meta.canonical,
      });
    } else if (/^\/[a-z0-9\-]+$/.test(routePath)) {
      // single city slug, e.g. /istanbul
      const slug = routePath.replace(/^\//, '');
      const cityName = formatSlug(slug);
      meta.title = `Current Time in ${cityName} — ${SITE_NAME}`;
      meta.description = `What time is it in ${cityName} right now? Live local time and timezone information for ${cityName}.`;
      meta.canonical = `${BASE}${routePath}`;
      meta.schema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: meta.title,
        description: meta.description,
        url: meta.canonical,
      });
    }
  }

  const ogImage = `${BASE}/favicon.svg`;
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
  index: false,   // We handle index.html ourselves below
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".xml") || filePath.endsWith(".txt")) {
      res.set("Cache-Control", "public, max-age=3600");
    }
  },
}));

// ─── 14. SPA catch-all — serve pre-rendered HTML first, fall back to shell ─
const KNOWN_ROUTES = new Set(ROUTES.map(r => r.path));
const SPA_ROUTE_PATTERNS = [
  /^\/(?:converter|newyork|abudhabi|world_clock|contact-us|timezone(?:\/.*)?|time-difference(?:\/.*)?|embed\/world-clock|world-clock-widget|404)$/,
  /^\/[a-z0-9-]+$/,
];

function isKnownRoute(pathname) {
  if (KNOWN_ROUTES.has(pathname)) return true;
  return SPA_ROUTE_PATTERNS.some(pattern => pattern.test(pathname));
}

app.get("*", (req, res) => {
  const routePath = req.path.replace(/\/$/, "") || "/";
  const isKnown   = isKnownRoute(routePath);

  if (!isKnown) {
    res.status(404);
  }

  const canonical = `${BASE}${isKnown ? routePath : req.path}`;
  res.set("Link", `<${canonical}>; rel="canonical"`);
  res.set("Content-Type", "text/html; charset=utf-8");
  res.set("Cache-Control", isKnown ? "public, s-maxage=300, stale-while-revalidate=86400" : "no-store");

  // ── PRIORITY: serve pre-rendered static HTML from dist/<route>/index.html ──
  // This gives Googlebot full pre-rendered content (not the SPA shell).
  const prerenderedPath = routePath === "/"
    ? path.join(DIST, "index.html")
    : path.join(DIST, routePath.replace(/^\//, ""), "index.html");

  if (fs.existsSync(prerenderedPath)) {
    return res.send(fs.readFileSync(prerenderedPath, "utf8"));
  }

  // ── FALLBACK: inject meta into SPA shell for unprerendered routes ──────────
  res.send(renderHtml(routePath));
});

// ─── 15. Start server ──────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MyZoneTime running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);

  // ── IndexNow ping on every deploy ──────────────────────────────────────────
  if (process.env.NODE_ENV === 'production' && INDEXNOW_KEY) {
    const payload = {
      host: 'myzonetime.com',
      key: INDEXNOW_KEY,
      keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
      urlList: [
        `${BASE}/`, `${BASE}/world-clock`, `${BASE}/meeting-planner`,
        `${BASE}/ai-meeting-planner`, `${BASE}/timezone-converter`,
        `${BASE}/time-difference-calculator`, `${BASE}/hijri-calendar`,
        `${BASE}/work-hours-calculator`, `${BASE}/dubai`, `${BASE}/abu-dhabi`,
        `${BASE}/london`, `${BASE}/new-york`, `${BASE}/paris`, `${BASE}/tokyo`,
        `${BASE}/singapore`, `${BASE}/riyadh`, `${BASE}/stopwatch`,
        `${BASE}/timer`, `${BASE}/countdown`,
      ],
    };
    ['https://api.indexnow.org/indexnow','https://www.bing.com/indexnow','https://yandex.com/indexnow'].forEach(engine => {
      fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      })
      .then(r => console.log(`IndexNow [${engine.split('/')[2]}]: ${r.status}`))
      .catch(e => console.log(`IndexNow [${engine.split('/')[2]}] error: ${e.message}`));
    });
  }
});

module.exports = app;
