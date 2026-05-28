'use strict';

/**
 * server.js — MyZoneTime Express Server
 * Uses only: express, compression, helmet (matching package.json dependencies)
 * CommonJS (no "type":"module" in package.json)
 */

const express     = require('express');
const path        = require('path');
const fs          = require('fs');
const compression = require('compression');
const helmet      = require('helmet');

const app     = express();
const PORT    = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const DIST    = path.join(__dirname, 'apps', 'web', 'dist');

// ─── Read index.html once at startup ──────────────────────────────────────
let indexTemplate = '';
try {
  indexTemplate = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  console.log('[server] index.html loaded from dist');
} catch (e) {
  console.error('[server] ERROR: apps/web/dist/index.html not found — run npm run build first');
}

// ─── SEO map: one entry per route ─────────────────────────────────────────
const SEO = {
  '/': {
    title:       'MyZoneTime – World Clock & Time Zone Converter',
    description: 'MyZoneTime: live world clock, time zone converter, meeting planner & Hijri calendar for 500+ cities. Free, accurate, no sign-up required.',
    h1:          'World Clock & Time Zone Converter',
    canonical:   'https://myzonetime.com/',
  },
  '/world-clock': {
    title:       'World Clock – Live Time in 500+ Cities | MyZoneTime',
    description: 'Check the current local time in 500+ cities worldwide with MyZoneTime\'s live world clock. Accurate, real-time and beautifully designed.',
    h1:          'World Clock – Live Time in 500+ Cities',
    canonical:   'https://myzonetime.com/world-clock',
  },
  '/timezone-converter': {
    title:       'Time Zone Converter – Convert Time Between Cities | MyZoneTime',
    description: 'Convert time between any two cities instantly. MyZoneTime\'s time zone converter handles daylight saving automatically for 500+ locations.',
    h1:          'Time Zone Converter',
    canonical:   'https://myzonetime.com/timezone-converter',
  },
  '/meeting-planner': {
    title:       'Meeting Planner – Best Time Across Time Zones | MyZoneTime',
    description: 'Find the best meeting time for remote teams across multiple time zones. Highlights overlap hours and business hours automatically.',
    h1:          'Meeting Planner – Find the Best Time Across Time Zones',
    canonical:   'https://myzonetime.com/meeting-planner',
  },
  '/time-difference-calculator': {
    title:       'Time Difference Calculator – Hours Between Cities | MyZoneTime',
    description: 'Calculate the exact time difference in hours between any two cities. Works across all time zones with automatic daylight saving adjustments.',
    h1:          'Time Difference Calculator',
    canonical:   'https://myzonetime.com/time-difference-calculator',
  },
  '/hijri-calendar': {
    title:       'Hijri Calendar – Islamic Date Converter 2025 | MyZoneTime',
    description: 'View today\'s Hijri (Islamic) date and convert between Gregorian and Hijri calendars. Accurate and updated daily.',
    h1:          'Hijri Calendar – Islamic Date & Converter',
    canonical:   'https://myzonetime.com/hijri-calendar',
  },
  '/stopwatch': {
    title:       'Online Stopwatch with Laps | MyZoneTime',
    description: 'Free online stopwatch with lap timer. Precision timing in your browser — no download needed. Great for workouts, cooking and productivity.',
    h1:          'Online Stopwatch with Laps',
    canonical:   'https://myzonetime.com/stopwatch',
  },
  '/timer': {
    title:       'Online Countdown Timer | MyZoneTime',
    description: 'Set a countdown timer in seconds, minutes, or hours. Free online timer that works in any browser with sound alerts when time is up.',
    h1:          'Online Countdown Timer',
    canonical:   'https://myzonetime.com/timer',
  },
  '/countdown': {
    title:       'Event Countdown – Days Until Your Event | MyZoneTime',
    description: 'Count down the days, hours and minutes to any event. Create a custom countdown for birthdays, holidays, launches, and more.',
    h1:          'Event Countdown Timer',
    canonical:   'https://myzonetime.com/countdown',
  },
  '/date-calculator': {
    title:       'Date Calculator – Days Between Dates | MyZoneTime',
    description: 'Calculate the number of days, weeks or months between two dates. Add or subtract days from any date — fast and free.',
    h1:          'Date Calculator – Days Between Dates',
    canonical:   'https://myzonetime.com/date-calculator',
  },
  '/work-hours-calculator': {
    title:       'Work Hours Calculator – Timesheet Tool | MyZoneTime',
    description: 'Calculate total work hours and overtime from your timesheet. Add multiple shifts, breaks and get instant totals. Free online timesheet tool.',
    h1:          'Work Hours Calculator',
    canonical:   'https://myzonetime.com/work-hours-calculator',
  },
  '/dubai': {
    title:       'Dubai Time – Current Local Time in Dubai (GST) | MyZoneTime',
    description: 'What time is it in Dubai right now? Live Dubai clock showing Gulf Standard Time (GST, UTC+4). No daylight saving. Updated in real time.',
    h1:          'Current Time in Dubai, UAE',
    canonical:   'https://myzonetime.com/dubai',
  },
  '/london': {
    title:       'London Time – Current Local Time in London (GMT/BST) | MyZoneTime',
    description: 'What time is it in London right now? Live London clock showing GMT or BST depending on the season. Updated in real time.',
    h1:          'Current Time in London, UK',
    canonical:   'https://myzonetime.com/london',
  },
  '/new-york': {
    title:       'New York Time – Current Local Time in New York (EST/EDT) | MyZoneTime',
    description: 'What time is it in New York right now? Live New York clock showing Eastern Standard or Daylight Time. Updated in real time.',
    h1:          'Current Time in New York, USA',
    canonical:   'https://myzonetime.com/new-york',
  },
  '/tokyo': {
    title:       'Tokyo Time – Current Local Time in Tokyo (JST) | MyZoneTime',
    description: 'What time is it in Tokyo right now? Live Tokyo clock showing Japan Standard Time (JST, UTC+9). No daylight saving. Updated in real time.',
    h1:          'Current Time in Tokyo, Japan',
    canonical:   'https://myzonetime.com/tokyo',
  },
  '/singapore': {
    title:       'Singapore Time – Current Local Time in Singapore (SGT) | MyZoneTime',
    description: 'What time is it in Singapore right now? Live Singapore clock showing Singapore Standard Time (SGT, UTC+8). Updated in real time.',
    h1:          'Current Time in Singapore',
    canonical:   'https://myzonetime.com/singapore',
  },
  '/sydney': {
    title:       'Sydney Time – Current Local Time in Sydney (AEST/AEDT) | MyZoneTime',
    description: 'What time is it in Sydney right now? Live Sydney clock showing Australian Eastern Time (AEST/AEDT). Updated in real time.',
    h1:          'Current Time in Sydney, Australia',
    canonical:   'https://myzonetime.com/sydney',
  },
  '/riyadh': {
    title:       'Riyadh Time – Current Local Time in Riyadh (AST) | MyZoneTime',
    description: 'What time is it in Riyadh right now? Live Riyadh clock showing Arabia Standard Time (AST, UTC+3). No daylight saving. Updated in real time.',
    h1:          'Current Time in Riyadh, Saudi Arabia',
    canonical:   'https://myzonetime.com/riyadh',
  },
  '/abu-dhabi': {
    title:       'Abu Dhabi Time – Current Local Time in Abu Dhabi (GST) | MyZoneTime',
    description: 'What time is it in Abu Dhabi right now? Live Abu Dhabi clock showing Gulf Standard Time (GST, UTC+4). No daylight saving. Updated in real time.',
    h1:          'Current Time in Abu Dhabi, UAE',
    canonical:   'https://myzonetime.com/abu-dhabi',
  },
  '/privacy-policy': {
    title:       'Privacy Policy | MyZoneTime',
    description: 'Read the MyZoneTime privacy policy. We explain what data we collect, how it is used, and your rights regarding your personal information.',
    h1:          'Privacy Policy',
    canonical:   'https://myzonetime.com/privacy-policy',
  },
  '/terms-of-service': {
    title:       'Terms of Service | MyZoneTime',
    description: 'Read the MyZoneTime terms of service. By using our site you agree to these terms governing your use of our world clock and time tools.',
    h1:          'Terms of Service',
    canonical:   'https://myzonetime.com/terms-of-service',
  },
};

const DEFAULT_SEO = SEO['/'];

// ─── Build the <head> meta block for a given route ────────────────────────
function buildMetaBlock(seo) {
  const { title, description, canonical } = seo;
  return [
    '<title>' + title + '</title>',
    '<meta name="description" content="' + description + '" />',
    '<link rel="canonical" href="' + canonical + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="MyZoneTime" />',
    '<meta property="og:title" content="' + title + '" />',
    '<meta property="og:description" content="' + description + '" />',
    '<meta property="og:url" content="' + canonical + '" />',
    '<meta property="og:image" content="https://myzonetime.com/og-image.png" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + title + '" />',
    '<meta name="twitter:description" content="' + description + '" />',
    '<meta name="twitter:image" content="https://myzonetime.com/og-image.png" />',
  ].join('\n    ');
}

// ─── Inject SEO + H1 into the HTML template ───────────────────────────────
function injectSeo(html, seo) {
  // 1. Inject meta block just before </head>
  const metaBlock = buildMetaBlock(seo);
  html = html.replace('</head>', '    ' + metaBlock + '\n  </head>');

  // 2. Replace the H1 placeholder with a real (visually hidden) <h1>
  const h1Tag = '<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;' +
                'clip:rect(0 0 0 0);white-space:nowrap">' + seo.h1 + '</h1>';
  html = html.replace('<!-- SSR_H1_INJECT -->', h1Tag);

  return html;
}

// ─── Middleware ────────────────────────────────────────────────────────────

// HTTPS redirect (production)
app.use(function (req, res, next) {
  if (IS_PROD && req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  }
  next();
});

// WWW → non-WWW redirect
app.use(function (req, res, next) {
  if (req.headers.host && req.headers.host.startsWith('www.')) {
    var bare = req.headers.host.slice(4);
    return res.redirect(301, (IS_PROD ? 'https' : 'http') + '://' + bare + req.url);
  }
  next();
});

// Gzip
app.use(compression({ level: 6 }));

// Helmet — CSP tuned for AdSense
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", "'unsafe-inline'",
                      'https://pagead2.googlesyndication.com',
                      'https://www.googletagmanager.com',
                      'https://adservice.google.com',
                      'https://tpc.googlesyndication.com'],
      scriptSrcAttr: ["'none'"],
      styleSrc:      ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:       ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:        ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc:    ["'self'", 'https://api.open-meteo.com',
                      'https://pagead2.googlesyndication.com'],
      frameSrc:      ['https://googleads.g.doubleclick.net',
                      'https://tpc.googlesyndication.com'],
      objectSrc:     ["'none'"],
    },
  },
  hsts: IS_PROD
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
  frameguard:     { action: 'sameorigin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ─── Static assets (hashed bundles — 1 year cache) ────────────────────────
app.use('/assets', express.static(path.join(DIST, 'assets'), {
  maxAge: '1y',
  immutable: true,
}));

// ─── Other static files (robots.txt, sitemap.xml, manifest, favicon…) ────
app.use(express.static(DIST, {
  maxAge: '1d',
  index: false,       // we serve index.html ourselves with SEO injection
}));

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', function (req, res) {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ─── SPA catch-all ────────────────────────────────────────────────────────
app.get('*', function (req, res) {
  if (!indexTemplate) {
    return res.status(503).send(
      'Site is building — please run <code>npm run build</code> and restart.'
    );
  }

  // Normalize: lowercase, strip trailing slash (except root)
  var rawPath = req.path.toLowerCase().replace(/\/+$/, '') || '/';
  var seo     = SEO[rawPath] || DEFAULT_SEO;
  var html    = injectSeo(indexTemplate, seo);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(html);
});

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', function () {
  console.log(
    '[server] MyZoneTime running on http://0.0.0.0:' + PORT +
    ' (' + (IS_PROD ? 'production' : 'development') + ')'
  );
});
