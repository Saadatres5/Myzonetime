/**
 * server.js — MyZoneTime Express Server
 * ─────────────────────────────────────
 * • Serves the Vite-built React frontend from apps/web/dist/
 * • SSR-injects per-route <title>, <meta description>, <canonical>,
 *   Open Graph, Twitter Card, JSON-LD, and a hidden <h1> into the
 *   static index.html shell before sending it to the client.
 * • Security: Helmet.js, rate limiting, HTTPS + WWW redirects, HSTS
 * • Performance: gzip compression, long-cache hashed assets
 */

import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const require   = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'apps', 'web', 'dist');
const IS_PROD = process.env.NODE_ENV === 'production';

// ─── Read index.html once at startup ───────────────────────────────────────
const INDEX_HTML_PATH = path.join(DIST, 'index.html');
let indexHtmlTemplate = '';
try {
  indexHtmlTemplate = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
} catch {
  console.error('[server] ERROR: apps/web/dist/index.html not found. Run `npm run build` first.');
}

// ─── SEO data map ──────────────────────────────────────────────────────────
// Keys are exact Express req.path values (lowercase, no trailing slash).
// Each entry supplies everything needed for a complete <head> + <h1>.
const SEO = {
  '/': {
    title:       'MyZoneTime – World Clock & Time Zone Converter',
    description: 'MyZoneTime: live world clock, time zone converter, meeting planner & Hijri calendar for 500+ cities. Free, accurate, no sign-up required.',
    h1:          'World Clock & Time Zone Converter',
    canonical:   'https://myzonetime.com/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type':    'WebSite',
      name:       'MyZoneTime',
      url:        'https://myzonetime.com/',
      description:'Live world clock and time zone tools for 500+ cities.',
      potentialAction: {
        '@type':       'SearchAction',
        target:        'https://myzonetime.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  },
  '/world-clock': {
    title:       'World Clock – Live Time in 500+ Cities | MyZoneTime',
    description: 'Check the current local time in 500+ cities worldwide with MyZoneTime\'s live world clock. Accurate, real-time, and beautifully designed.',
    h1:          'World Clock – Live Time in 500+ Cities',
    canonical:   'https://myzonetime.com/world-clock',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'World Clock','url':'https://myzonetime.com/world-clock' },
  },
  '/timezone-converter': {
    title:       'Time Zone Converter – Convert Time Between Cities | MyZoneTime',
    description: 'Convert time between any two cities instantly. MyZoneTime\'s time zone converter handles DST automatically for 500+ locations worldwide.',
    h1:          'Time Zone Converter',
    canonical:   'https://myzonetime.com/timezone-converter',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Time Zone Converter','url':'https://myzonetime.com/timezone-converter' },
  },
  '/meeting-planner': {
    title:       'Meeting Planner – Best Time Across Time Zones | MyZoneTime',
    description: 'Find the best meeting time for remote teams across multiple time zones. MyZoneTime\'s meeting planner highlights overlap hours and business hours.',
    h1:          'Meeting Planner – Find the Best Time Across Time Zones',
    canonical:   'https://myzonetime.com/meeting-planner',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Meeting Planner','url':'https://myzonetime.com/meeting-planner' },
  },
  '/time-difference-calculator': {
    title:       'Time Difference Calculator – Hours Between Cities | MyZoneTime',
    description: 'Calculate the exact time difference in hours between any two cities. Works across all time zones with automatic DST adjustments.',
    h1:          'Time Difference Calculator',
    canonical:   'https://myzonetime.com/time-difference-calculator',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Time Difference Calculator','url':'https://myzonetime.com/time-difference-calculator' },
  },
  '/hijri-calendar': {
    title:       'Hijri Calendar – Islamic Date Converter 2025 | MyZoneTime',
    description: 'View today\'s Hijri (Islamic) date and convert between Gregorian and Hijri calendars. Accurate, updated daily with prayer time awareness.',
    h1:          'Hijri Calendar – Islamic Date & Converter',
    canonical:   'https://myzonetime.com/hijri-calendar',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Hijri Calendar','url':'https://myzonetime.com/hijri-calendar' },
  },
  '/stopwatch': {
    title:       'Online Stopwatch with Laps | MyZoneTime',
    description: 'Free online stopwatch with lap timer. Precision timing in your browser — no download needed. Great for workouts, cooking, and productivity.',
    h1:          'Online Stopwatch with Laps',
    canonical:   'https://myzonetime.com/stopwatch',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Stopwatch','url':'https://myzonetime.com/stopwatch' },
  },
  '/timer': {
    title:       'Online Countdown Timer | MyZoneTime',
    description: 'Set a countdown timer in seconds, minutes, or hours. Free online timer that works in any browser with sound alerts.',
    h1:          'Online Countdown Timer',
    canonical:   'https://myzonetime.com/timer',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Timer','url':'https://myzonetime.com/timer' },
  },
  '/countdown': {
    title:       'Event Countdown – Days Until Your Event | MyZoneTime',
    description: 'Count down the days, hours, and minutes to any event. Create a custom countdown for birthdays, holidays, launches, and more.',
    h1:          'Event Countdown Timer',
    canonical:   'https://myzonetime.com/countdown',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Event Countdown','url':'https://myzonetime.com/countdown' },
  },
  '/date-calculator': {
    title:       'Date Calculator – Days Between Dates | MyZoneTime',
    description: 'Calculate the number of days, weeks, or months between two dates. Add or subtract days from any date — fast and free.',
    h1:          'Date Calculator – Days Between Dates',
    canonical:   'https://myzonetime.com/date-calculator',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Date Calculator','url':'https://myzonetime.com/date-calculator' },
  },
  '/work-hours-calculator': {
    title:       'Work Hours Calculator – Timesheet Tool | MyZoneTime',
    description: 'Calculate total work hours and overtime from your timesheet. Add multiple shifts, breaks, and get instant totals. Free online timesheet calculator.',
    h1:          'Work Hours Calculator',
    canonical:   'https://myzonetime.com/work-hours-calculator',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Work Hours Calculator','url':'https://myzonetime.com/work-hours-calculator' },
  },
  '/dubai': {
    title:       'Dubai Time – Current Local Time in Dubai (GST) | MyZoneTime',
    description: 'What time is it in Dubai right now? Live Dubai clock showing Gulf Standard Time (GST, UTC+4). No DST. Updated in real time.',
    h1:          'Current Time in Dubai, UAE',
    canonical:   'https://myzonetime.com/dubai',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Dubai Time','url':'https://myzonetime.com/dubai' },
  },
  '/london': {
    title:       'London Time – Current Local Time in London (GMT/BST) | MyZoneTime',
    description: 'What time is it in London right now? Live London clock showing GMT or BST depending on the season. Updated in real time.',
    h1:          'Current Time in London, UK',
    canonical:   'https://myzonetime.com/london',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'London Time','url':'https://myzonetime.com/london' },
  },
  '/new-york': {
    title:       'New York Time – Current Local Time in New York (EST/EDT) | MyZoneTime',
    description: 'What time is it in New York right now? Live New York clock showing Eastern Time (EST/EDT). Updated in real time.',
    h1:          'Current Time in New York, USA',
    canonical:   'https://myzonetime.com/new-york',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'New York Time','url':'https://myzonetime.com/new-york' },
  },
  '/tokyo': {
    title:       'Tokyo Time – Current Local Time in Tokyo (JST) | MyZoneTime',
    description: 'What time is it in Tokyo right now? Live Tokyo clock showing Japan Standard Time (JST, UTC+9). No DST. Updated in real time.',
    h1:          'Current Time in Tokyo, Japan',
    canonical:   'https://myzonetime.com/tokyo',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Tokyo Time','url':'https://myzonetime.com/tokyo' },
  },
  '/singapore': {
    title:       'Singapore Time – Current Local Time in Singapore (SGT) | MyZoneTime',
    description: 'What time is it in Singapore right now? Live Singapore clock showing Singapore Standard Time (SGT, UTC+8). Updated in real time.',
    h1:          'Current Time in Singapore',
    canonical:   'https://myzonetime.com/singapore',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Singapore Time','url':'https://myzonetime.com/singapore' },
  },
  '/sydney': {
    title:       'Sydney Time – Current Local Time in Sydney (AEST/AEDT) | MyZoneTime',
    description: 'What time is it in Sydney right now? Live Sydney clock showing Australian Eastern Time (AEST/AEDT). Updated in real time.',
    h1:          'Current Time in Sydney, Australia',
    canonical:   'https://myzonetime.com/sydney',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Sydney Time','url':'https://myzonetime.com/sydney' },
  },
  '/riyadh': {
    title:       'Riyadh Time – Current Local Time in Riyadh (AST) | MyZoneTime',
    description: 'What time is it in Riyadh right now? Live Riyadh clock showing Arabia Standard Time (AST, UTC+3). No DST. Updated in real time.',
    h1:          'Current Time in Riyadh, Saudi Arabia',
    canonical:   'https://myzonetime.com/riyadh',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Riyadh Time','url':'https://myzonetime.com/riyadh' },
  },
  '/abu-dhabi': {
    title:       'Abu Dhabi Time – Current Local Time in Abu Dhabi (GST) | MyZoneTime',
    description: 'What time is it in Abu Dhabi right now? Live Abu Dhabi clock showing Gulf Standard Time (GST, UTC+4). No DST. Updated in real time.',
    h1:          'Current Time in Abu Dhabi, UAE',
    canonical:   'https://myzonetime.com/abu-dhabi',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Abu Dhabi Time','url':'https://myzonetime.com/abu-dhabi' },
  },
  '/privacy-policy': {
    title:       'Privacy Policy | MyZoneTime',
    description: 'Read the MyZoneTime privacy policy. We explain what data we collect, how it is used, and your rights regarding your personal information.',
    h1:          'Privacy Policy',
    canonical:   'https://myzonetime.com/privacy-policy',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Privacy Policy','url':'https://myzonetime.com/privacy-policy' },
  },
  '/terms-of-service': {
    title:       'Terms of Service | MyZoneTime',
    description: 'Read the MyZoneTime terms of service. By using our site you agree to these terms governing your use of our world clock and time tools.',
    h1:          'Terms of Service',
    canonical:   'https://myzonetime.com/terms-of-service',
    jsonLd: { '@context':'https://schema.org','@type':'WebPage','name':'Terms of Service','url':'https://myzonetime.com/terms-of-service' },
  },
};

// Fallback for unknown routes
const DEFAULT_SEO = SEO['/'];

// ─── Helper: build the injected HTML string ────────────────────────────────
function buildSeoHtml(seo) {
  const {
    title, description, h1, canonical,
    jsonLd,
  } = { ...DEFAULT_SEO, ...seo };

  const ogTitle  = title.replace(/&amp;/g, '&');
  const ogDesc   = description.replace(/&amp;/g, '&');

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="MyZoneTime" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDesc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://myzonetime.com/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDesc}" />
    <meta name="twitter:image" content="https://myzonetime.com/og-image.png" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `.trim();
}

// ─── Helper: inject SEO + H1 into the HTML template ───────────────────────
function injectSeo(html, seo) {
  const { h1 } = { ...DEFAULT_SEO, ...seo };

  // 1. Replace the static <title>…</title> and static meta description block.
  //    We target from <title> through the last static Twitter meta tag.
  html = html.replace(
    /<title>[\s\S]*?<\/title>\s*<meta name="description"[^>]*\/>\s*<link rel="canonical"[^>]*\/>([\s\S]*?)<\/head>/,
    (match, rest) => `${buildSeoHtml(seo)}\n    ${rest.replace(/^\s*<!--[^>]*-->\s*/m, '').trim()}\n  </head>`
  );

  // Simpler fallback: if the regex above didn't match (e.g. template changed),
  // just inject before </head>
  if (!html.includes(h1)) {
    html = html.replace(
      '</head>',
      `  ${buildSeoHtml(seo)}\n  </head>`
    );
  }

  // 2. Replace the H1 placeholder in <body>
  const h1Tag = `<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${h1}</h1>`;
  html = html.replace('<!-- SSR_H1_INJECT -->', h1Tag);

  return html;
}

// ─── Security & performance middleware ────────────────────────────────────

// HTTPS redirect (production only)
app.use((req, res, next) => {
  if (IS_PROD && req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// WWW → non-WWW redirect
app.use((req, res, next) => {
  if (req.headers.host && req.headers.host.startsWith('www.')) {
    const bare = req.headers.host.slice(4);
    return res.redirect(301, `${IS_PROD ? 'https' : 'http'}://${bare}${req.url}`);
  }
  next();
});

// Gzip compression
app.use(compression({ level: 6 }));

// Helmet (security headers) — CSP tuned for AdSense
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:     ["'self'"],
        scriptSrc:      ["'self'", "'unsafe-inline'", 'https://pagead2.googlesyndication.com', 'https://www.googletagmanager.com', 'https://www.googletagservices.com', 'https://adservice.google.com', 'https://tpc.googlesyndication.com'],
        scriptSrcAttr:  ["'none'"],
        styleSrc:       ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc:        ["'self'", 'https://fonts.gstatic.com'],
        imgSrc:         ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc:     ["'self'", 'https://api.open-meteo.com', 'https://pagead2.googlesyndication.com'],
        frameSrc:       ['https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com'],
        objectSrc:      ["'none'"],
        upgradeInsecureRequests: IS_PROD ? [] : null,
      },
    },
    hsts: IS_PROD ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    frameguard: { action: 'sameorigin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max:      300,
    standardHeaders: true,
    legacyHeaders:   false,
  })
);

// ─── Static assets (hashed — long cache) ──────────────────────────────────
app.use(
  '/assets',
  express.static(path.join(DIST, 'assets'), {
    maxAge: '1y',
    immutable: true,
  })
);

// ─── Other static files (manifest, robots, sitemap, ads.txt, favicon) ─────
app.use(
  express.static(DIST, {
    maxAge: '1d',
    index:  false, // We handle index ourselves to inject SEO
  })
);

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ─── SPA catch-all — inject SEO then serve index.html ─────────────────────
app.get('*', (req, res) => {
  if (!indexHtmlTemplate) {
    return res.status(503).send('Site is building — please try again in a moment.');
  }

  // Normalize path: lowercase, strip trailing slash (except root)
  const rawPath = req.path.toLowerCase().replace(/\/$/, '') || '/';
  const seo     = SEO[rawPath] || DEFAULT_SEO;

  const html = injectSeo(indexHtmlTemplate, seo);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTML is never cached
  res.send(html);
});

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] MyZoneTime running on http://0.0.0.0:${PORT} (${IS_PROD ? 'production' : 'development'})`);
});
