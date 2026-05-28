'use strict';

const express     = require('express');
const compression = require('compression');
const helmet      = require('helmet');
const path        = require('path');
const fs          = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'apps', 'web', 'dist');

app.set('trust proxy', 1);

// ── Security ────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'","'unsafe-inline'","'unsafe-eval'","https://pagead2.googlesyndication.com","https://www.googletagmanager.com","https://adservice.google.com","https://googleads.g.doubleclick.net","https://partner.googleadservices.com","https://tpc.googlesyndication.com"],
      styleSrc:    ["'self'","'unsafe-inline'","https://fonts.googleapis.com"],
      fontSrc:     ["'self'","https://fonts.gstatic.com","data:"],
      imgSrc:      ["'self'","data:","blob:","https://images.unsplash.com","https://pagead2.googlesyndication.com","https://www.googletagmanager.com","https://googleads.g.doubleclick.net","https://tpc.googlesyndication.com"],
      connectSrc:  ["'self'","https://api.open-meteo.com","https://pagead2.googlesyndication.com","https://adservice.google.com"],
      frameSrc:    ["https://googleads.g.doubleclick.net","https://tpc.googlesyndication.com"],
      objectSrc:   ["'none'"],
      baseUri:     ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use(compression({ level: 6, threshold: 1024 }));

// ── Extra headers ────────────────────────────────────────────────────────────
app.use(function(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
  res.setHeader('Content-Language', 'en');
  res.setHeader('X-Robots-Tag', 'index, follow');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// ── HTTPS redirect ───────────────────────────────────────────────────────────
app.use(function(req, res, next) {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  }
  next();
});

// ── WWW → non-WWW ────────────────────────────────────────────────────────────
app.use(function(req, res, next) {
  if (req.headers.host && req.headers.host.startsWith('www.')) {
    return res.redirect(301, 'https://' + req.headers.host.replace(/^www\./, '') + req.url);
  }
  next();
});

// ── Rate limiter ─────────────────────────────────────────────────────────────
var rateMap = {};
app.use(function(req, res, next) {
  var ip = req.ip || 'unknown', now = Date.now();
  if (!rateMap[ip]) rateMap[ip] = [];
  rateMap[ip] = rateMap[ip].filter(function(t) { return now - t < 60000; });
  rateMap[ip].push(now);
  if (rateMap[ip].length > 300) return res.status(429).json({ error: 'Too many requests.' });
  next();
});
setInterval(function() {
  var c = Date.now() - 60000;
  Object.keys(rateMap).forEach(function(ip) {
    rateMap[ip] = (rateMap[ip] || []).filter(function(t) { return t > c; });
    if (!rateMap[ip].length) delete rateMap[ip];
  });
}, 300000);

// ── Static — hashed assets, 1 year ──────────────────────────────────────────
app.use('/assets', express.static(path.join(DIST, 'assets'), { maxAge: '1y', immutable: true, etag: true }));

// ── Sitemap ───────────────────────────────────────────────────────────────────
var TODAY = new Date().toISOString().slice(0, 10);

function xmlRes(res, body) {
  res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n' + body);
}

app.get('/sitemap.xml', function(req, res) {
  var allPages = [
    { loc: '/',                           priority: '1.0',  freq: 'daily'   },
    { loc: '/meeting-planner',            priority: '0.95', freq: 'weekly'  },
    { loc: '/world-clock',                priority: '0.9',  freq: 'daily'   },
    { loc: '/timezone-converter',         priority: '0.9',  freq: 'weekly'  },
    { loc: '/time-difference-calculator', priority: '0.85', freq: 'weekly'  },
    { loc: '/hijri-calendar',             priority: '0.85', freq: 'daily'   },
    { loc: '/work-hours-calculator',      priority: '0.75', freq: 'monthly' },
    { loc: '/date-calculator',            priority: '0.7',  freq: 'monthly' },
    { loc: '/stopwatch',                  priority: '0.65', freq: 'monthly' },
    { loc: '/timer',                      priority: '0.65', freq: 'monthly' },
    { loc: '/countdown',                  priority: '0.6',  freq: 'monthly' },
    { loc: '/world-clock-widget',         priority: '0.6',  freq: 'monthly' },
    { loc: '/blog',                       priority: '0.7',  freq: 'weekly'  },
    { loc: '/privacy-policy',             priority: '0.2',  freq: 'yearly'  },
    { loc: '/terms-of-service',           priority: '0.2',  freq: 'yearly'  },
    { loc: '/dubai',        priority: '0.9',  freq: 'daily' },
    { loc: '/london',       priority: '0.9',  freq: 'daily' },
    { loc: '/new-york',     priority: '0.9',  freq: 'daily' },
    { loc: '/tokyo',        priority: '0.85', freq: 'daily' },
    { loc: '/singapore',    priority: '0.85', freq: 'daily' },
    { loc: '/sydney',       priority: '0.85', freq: 'daily' },
    { loc: '/riyadh',       priority: '0.85', freq: 'daily' },
    { loc: '/abu-dhabi',    priority: '0.85', freq: 'daily' },
    { loc: '/istanbul',     priority: '0.85', freq: 'daily' },
    { loc: '/oslo',         priority: '0.8',  freq: 'daily' },
    { loc: '/bangkok',      priority: '0.8',  freq: 'daily' },
    { loc: '/paris',        priority: '0.8',  freq: 'daily' },
    { loc: '/kuala-lumpur', priority: '0.8',  freq: 'daily' },
    { loc: '/hong-kong',    priority: '0.75', freq: 'daily' },
    { loc: '/mumbai',       priority: '0.75', freq: 'daily' },
    { loc: '/toronto',      priority: '0.75', freq: 'daily' },
    { loc: '/los-angeles',  priority: '0.75', freq: 'daily' },
    { loc: '/chicago',      priority: '0.75', freq: 'daily' },
    { loc: '/amsterdam',    priority: '0.75', freq: 'daily' },
    { loc: '/berlin',       priority: '0.75', freq: 'daily' },
    { loc: '/doha',         priority: '0.75', freq: 'daily' },
    { loc: '/cairo',        priority: '0.75', freq: 'daily' },
    { loc: '/nairobi',      priority: '0.7',  freq: 'daily' },
    { loc: '/johannesburg', priority: '0.7',  freq: 'daily' },
    { loc: '/auckland',     priority: '0.7',  freq: 'daily' },
    { loc: '/time-difference/new-york-london',     priority: '0.85', freq: 'weekly' },
    { loc: '/time-difference/dubai-london',        priority: '0.85', freq: 'weekly' },
    { loc: '/time-difference/dubai-new-york',      priority: '0.85', freq: 'weekly' },
    { loc: '/time-difference/london-singapore',    priority: '0.85', freq: 'weekly' },
    { loc: '/time-difference/sydney-london',       priority: '0.85', freq: 'weekly' },
    { loc: '/time-difference/sydney-new-york',     priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/oslo-london',         priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/oslo-new-york',       priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/istanbul-london',     priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/istanbul-new-york',   priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/istanbul-dubai',      priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/riyadh-london',       priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/riyadh-new-york',     priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/abu-dhabi-london',    priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/abu-dhabi-new-york',  priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/dubai-singapore',     priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/dubai-tokyo',         priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/london-tokyo',        priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/new-york-tokyo',      priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/london-mumbai',       priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/new-york-mumbai',     priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/london-bangkok',      priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/london-hong-kong',    priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/new-york-hong-kong',  priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/london-kuala-lumpur', priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/sydney-dubai',        priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/auckland-london',     priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/paris-london',        priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/paris-new-york',      priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/berlin-london',       priority: '0.7',  freq: 'weekly' },
    { loc: '/time-difference/amsterdam-london',    priority: '0.7',  freq: 'weekly' },
    { loc: '/time-difference/doha-london',         priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/cairo-london',        priority: '0.7',  freq: 'weekly' },
    { loc: '/time-difference/nairobi-london',      priority: '0.7',  freq: 'weekly' },
    { loc: '/time-difference/johannesburg-london', priority: '0.7',  freq: 'weekly' },
    { loc: '/time-difference/los-angeles-london',  priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/chicago-london',      priority: '0.75', freq: 'weekly' },
    { loc: '/time-difference/new-york-singapore',  priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/dubai-singapore',     priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/riyadh-london',       priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/new-york-singapore',  priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/oslo-london',         priority: '0.8',  freq: 'weekly' },
    { loc: '/time-difference/abu-dhabi-london',    priority: '0.8',  freq: 'weekly' },
  ];

  // Deduplicate
  var seen = {};
  allPages = allPages.filter(function(p) {
    if (seen[p.loc]) return false;
    seen[p.loc] = true;
    return true;
  });

  var urls = allPages.map(function(p) {
    return [
      '  <url>',
      '    <loc>https://myzonetime.com' + p.loc + '</loc>',
      '    <lastmod>' + TODAY + '</lastmod>',
      '    <changefreq>' + p.freq + '</changefreq>',
      '    <priority>' + p.priority + '</priority>',
      '  </url>',
    ].join('\n');
  });

  xmlRes(res,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n' +
    '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n' +
    urls.join('\n') +
    '\n</urlset>'
  );
});

// ── /robots.txt ───────────────────────────────────────────────────────────────
app.get('/robots.txt', function(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send([
    '# MyZoneTime — robots.txt',
    '# https://myzonetime.com',
    '',
    'User-agent: *',
    'Allow: /',
    'Disallow: /health',
    'Disallow: /api/',
    '',
    'User-agent: Googlebot',
    'Allow: /',
    'Crawl-delay: 1',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    'Crawl-delay: 2',
    '',
    '# AI crawlers — explicitly allowed for GEO (Generative Engine Optimisation)',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: Claude-Web',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: anthropic-ai',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: Gemini-Bot',
    'Allow: /',
    '',
    'User-agent: meta-externalagent',
    'Allow: /',
    '',
    'User-agent: Applebot-Extended',
    'Allow: /',
    '',
    'User-agent: cohere-ai',
    'Allow: /',
    '',
    'User-agent: YouBot',
    'Allow: /',
    '',
    '# Block low-quality scrapers',
    'User-agent: MJ12bot',
    'Disallow: /',
    '',
    'User-agent: DotBot',
    'Disallow: /',
    '',
    'Sitemap: https://myzonetime.com/sitemap.xml',
  ].join('\n'));
});

// ── /llms.txt — AI crawler content guide (GEO) ───────────────────────────────
// This file tells LLMs (ChatGPT, Claude, Perplexity, Gemini) what your site
// contains so they can accurately cite and recommend it in AI-generated answers.
app.get('/llms.txt', function(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send([
    '# MyZoneTime — llms.txt',
    '# https://myzonetime.com',
    '# Last updated: ' + TODAY,
    '',
    '## About',
    'MyZoneTime is a free world clock and time zone utility for global teams, remote workers,',
    'and international travellers. It provides live time for 500+ cities, a meeting planner,',
    'time zone converter, Hijri Islamic calendar, work hours calculator, and more.',
    'No account or sign-up is required. All tools are free.',
    '',
    '## Primary Tools',
    '- World Clock: https://myzonetime.com/world-clock',
    '  Live local time for 500+ cities worldwide. Searchable. Auto-updates.',
    '',
    '- Time Zone Converter: https://myzonetime.com/timezone-converter',
    '  Convert time between any two cities. DST-aware. Shareable links.',
    '',
    '- Meeting Planner: https://myzonetime.com/meeting-planner',
    '  Find overlapping business hours for up to 7 cities simultaneously.',
    '  Colour-coded grid (green = business hours). DST-aware. Shareable.',
    '',
    '- Time Difference Calculator: https://myzonetime.com/time-difference-calculator',
    '  Exact hour difference between any two cities. DST adjustments included.',
    '',
    '- Hijri Calendar: https://myzonetime.com/hijri-calendar',
    '  Current Islamic (Hijri) date. Gregorian ↔ Hijri date converter.',
    '  Includes current Islamic year (1447 AH as of 2026).',
    '',
    '- Work Hours Calculator: https://myzonetime.com/work-hours-calculator',
    '  Timesheet calculator. Add shifts, breaks, calculate total hours and pay.',
    '',
    '- Date Calculator: https://myzonetime.com/date-calculator',
    '  Days between any two dates. Add or subtract days from any date.',
    '',
    '- Stopwatch: https://myzonetime.com/stopwatch',
    '  Browser-based stopwatch with lap recording. Millisecond precision.',
    '',
    '- Countdown Timer: https://myzonetime.com/timer',
    '  Set any duration. Audio alert when complete.',
    '',
    '- Event Countdown: https://myzonetime.com/countdown',
    '  Count down to any future date/event.',
    '',
    '- Embeddable World Clock Widget: https://myzonetime.com/world-clock-widget',
    '  Free iframe widget. Copy-paste HTML to embed on any website.',
    '',
    '## City Pages (Live Clocks + Time Zone Info)',
    'Each city page includes: live clock, UTC offset, DST schedule, business hours,',
    'related city-pair time differences, and FAQ structured data.',
    '',
    '- Dubai (UTC+4, no DST): https://myzonetime.com/dubai',
    '- London (UTC+0/+1 BST): https://myzonetime.com/london',
    '- New York (UTC-5/-4 EDT): https://myzonetime.com/new-york',
    '- Tokyo (UTC+9, no DST): https://myzonetime.com/tokyo',
    '- Singapore (UTC+8, no DST): https://myzonetime.com/singapore',
    '- Sydney (UTC+10/+11 AEDT): https://myzonetime.com/sydney',
    '- Riyadh (UTC+3, no DST): https://myzonetime.com/riyadh',
    '- Abu Dhabi (UTC+4, no DST): https://myzonetime.com/abu-dhabi',
    '- Istanbul (UTC+3, no DST): https://myzonetime.com/istanbul',
    '- Paris (UTC+1/+2 CEST): https://myzonetime.com/paris',
    '- Oslo (UTC+1/+2 CEST): https://myzonetime.com/oslo',
    '- Bangkok (UTC+7, no DST): https://myzonetime.com/bangkok',
    '- Kuala Lumpur (UTC+8, no DST): https://myzonetime.com/kuala-lumpur',
    '',
    '## Time Difference City-Pair Pages',
    'Each page includes the exact hour offset, DST notes, best meeting times, and live clocks.',
    '- New York vs London: https://myzonetime.com/time-difference/new-york-london',
    '- Dubai vs London: https://myzonetime.com/time-difference/dubai-london',
    '- Dubai vs New York: https://myzonetime.com/time-difference/dubai-new-york',
    '- London vs Singapore: https://myzonetime.com/time-difference/london-singapore',
    '- Sydney vs London: https://myzonetime.com/time-difference/sydney-london',
    '- Istanbul vs London: https://myzonetime.com/time-difference/istanbul-london',
    '- Riyadh vs London: https://myzonetime.com/time-difference/riyadh-london',
    '- Abu Dhabi vs London: https://myzonetime.com/time-difference/abu-dhabi-london',
    '',
    '## Key Facts for AI Answers',
    '- Dubai time zone: Gulf Standard Time (GST), UTC+4. No DST.',
    '- London time zone: GMT (UTC+0) in winter, BST (UTC+1) in summer.',
    '- New York time zone: EST (UTC-5) in winter, EDT (UTC-4) in summer.',
    '- Tokyo time zone: JST (UTC+9). No DST.',
    '- Singapore time zone: SGT (UTC+8). No DST.',
    '- Current Islamic year (2026): 1447 AH.',
    '- All tools are free. No sign-up required.',
    '',
    '## Content Policy',
    'All content may be cited, summarised, and used in AI-generated answers.',
    'Please attribute as "MyZoneTime (myzonetime.com)" when citing specific data.',
  ].join('\n'));
});

// ── Static — public root files ────────────────────────────────────────────────
app.use(express.static(DIST, {
  maxAge: '1h', index: false, etag: true,
  setHeaders: function(res, fp) {
    if (fp.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    if (fp.endsWith('.txt')) {
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    if (fp.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    if (fp.endsWith('.jpg') || fp.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    if (fp.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    if (fp.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// ── Constants ─────────────────────────────────────────────────────────────────
var SITE = 'https://myzonetime.com';
var OG   = SITE + '/og-image.jpg';

// ── GEO meta — city routes only ───────────────────────────────────────────────
var geoMeta = {
  '/dubai':        { region: 'AE-DU',  placename: 'Dubai, United Arab Emirates',     pos: '25.2048;55.2708',   icbm: '25.2048, 55.2708' },
  '/london':       { region: 'GB-ENG', placename: 'London, United Kingdom',          pos: '51.5074;-0.1278',   icbm: '51.5074, -0.1278' },
  '/new-york':     { region: 'US-NY',  placename: 'New York, United States',         pos: '40.7128;-74.0060',  icbm: '40.7128, -74.0060' },
  '/tokyo':        { region: 'JP-13',  placename: 'Tokyo, Japan',                    pos: '35.6762;139.6503',  icbm: '35.6762, 139.6503' },
  '/singapore':    { region: 'SG',     placename: 'Singapore',                       pos: '1.3521;103.8198',   icbm: '1.3521, 103.8198' },
  '/sydney':       { region: 'AU-NSW', placename: 'Sydney, Australia',               pos: '-33.8688;151.2093', icbm: '-33.8688, 151.2093' },
  '/riyadh':       { region: 'SA-01',  placename: 'Riyadh, Saudi Arabia',            pos: '24.7136;46.6753',   icbm: '24.7136, 46.6753' },
  '/abu-dhabi':    { region: 'AE-AZ',  placename: 'Abu Dhabi, United Arab Emirates', pos: '24.4539;54.3773',   icbm: '24.4539, 54.3773' },
  '/oslo':         { region: 'NO-03',  placename: 'Oslo, Norway',                    pos: '59.9139;10.7522',   icbm: '59.9139, 10.7522' },
  '/paris':        { region: 'FR-75',  placename: 'Paris, France',                   pos: '48.8566;2.3522',    icbm: '48.8566, 2.3522' },
  '/istanbul':     { region: 'TR-34',  placename: 'Istanbul, Turkey',                pos: '41.0082;28.9784',   icbm: '41.0082, 28.9784' },
  '/kuala-lumpur': { region: 'MY-14',  placename: 'Kuala Lumpur, Malaysia',          pos: '3.1390;101.6869',   icbm: '3.1390, 101.6869' },
  '/bangkok':      { region: 'TH-10',  placename: 'Bangkok, Thailand',               pos: '13.7563;100.5018',  icbm: '13.7563, 100.5018' },
};

// ── Helper: city page schema builder ─────────────────────────────────────────
function citySchema(city, country, url, timezone, utcLabel, dst, dstNote, faqItems) {
  return [
    {
      '@type': 'WebPage',
      name: 'Current Time in ' + city + ', ' + country,
      url: url,
      description: 'Live clock and time zone information for ' + city + ', ' + country + ' (' + utcLabel + ').',
      about: {
        '@type': 'City',
        name: city,
        containedInPlace: { '@type': 'Country', name: country }
      }
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',       item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' },
        { '@type': 'ListItem', position: 3, name: city,          item: url }
      ]
    }
  ];
}

// ── Helper: time-difference page schema builder ───────────────────────────────
function timeDiffSchema(city1, city2, url, tz1Label, tz2Label, offset, bestTime, faqItems) {
  return [
    {
      '@type': 'WebPage',
      name: 'Time Difference Between ' + city1 + ' and ' + city2,
      url: url,
      description: 'Exact time difference between ' + city1 + ' (' + tz1Label + ') and ' + city2 + ' (' + tz2Label + '). ' + offset
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',                       item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Time Difference Calculator', item: 'https://myzonetime.com/time-difference-calculator' },
        { '@type': 'ListItem', position: 3, name: city1 + ' vs ' + city2,        item: url }
      ]
    }
  ];
}

// ── Per-route JSON-LD schemas ─────────────────────────────────────────────────
var routeSchemas = {

  // ── Home ────────────────────────────────────────────────────────────────────
  '/': [
    {
      '@type': 'WebSite',
      name: 'MyZoneTime',
      url: 'https://myzonetime.com',
      description: 'Free world clock, time zone converter, meeting planner, Hijri calendar and more for 500+ cities.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://myzonetime.com/world-clock?search={search_term_string}' },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebApplication',
      name: 'MyZoneTime — World Clock & Time Zone Tools',
      url: 'https://myzonetime.com',
      description: 'Free world clock and time zone platform. Track live time in 500+ cities, plan meetings, convert time zones, and view the Hijri calendar.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: ['World Clock', 'Time Zone Converter', 'Meeting Planner', 'Hijri Calendar', 'Work Hours Calculator', 'Time Difference Calculator'],
      screenshot: 'https://myzonetime.com/og-image.jpg'
    },
    {
      '@type': 'Organization',
      name: 'MyZoneTime',
      url: 'https://myzonetime.com',
      logo: { '@type': 'ImageObject', url: 'https://myzonetime.com/og-image.png', width: 1200, height: 630 },
      sameAs: ['https://myzonetime.com']
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is MyZoneTime?', acceptedAnswer: { '@type': 'Answer', text: 'MyZoneTime is a free world clock and time zone tool that shows live local time in 500+ cities. It includes a meeting planner, time zone converter, Hijri calendar, work hours calculator, and more. No account needed.' } },
        { '@type': 'Question', name: 'How do I find the time difference between two cities?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Time Difference Calculator at myzonetime.com/time-difference-calculator. Select any two cities and the tool instantly calculates the hours difference, accounting for daylight saving time.' } },
        { '@type': 'Question', name: 'How do I plan a meeting across time zones?', acceptedAnswer: { '@type': 'Answer', text: 'Go to myzonetime.com/meeting-planner and add up to 7 cities. The tool shows a colour-coded grid of business hours so you can find the best overlap time for your global team.' } },
        { '@type': 'Question', name: 'Is MyZoneTime free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. MyZoneTime is completely free. All tools — world clock, time zone converter, meeting planner, Hijri calendar, and more — are available with no account or payment required.' } },
        { '@type': 'Question', name: 'What is the current time in Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai uses Gulf Standard Time (GST), which is UTC+4. Dubai does not observe daylight saving time, so the offset is fixed year-round. See the live clock at myzonetime.com/dubai.' } },
        { '@type': 'Question', name: 'What cities does MyZoneTime support?', acceptedAnswer: { '@type': 'Answer', text: 'MyZoneTime supports 500+ cities worldwide including Dubai, London, New York, Tokyo, Singapore, Sydney, Riyadh, Abu Dhabi, Istanbul, Paris, Oslo, Bangkok, Kuala Lumpur, and hundreds more.' } }
      ]
    }
  ],

  // ── Tool pages ──────────────────────────────────────────────────────────────
  '/meeting-planner': [
    {
      '@type': 'WebApplication',
      name: 'Meeting Planner — Find Best Time Across Time Zones',
      url: 'https://myzonetime.com/meeting-planner',
      description: 'Free online meeting planner that finds overlapping business hours for global teams. Supports up to 7 cities simultaneously with DST adjustments.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: ['Up to 7 cities simultaneously', 'Daylight Saving Time aware', 'Colour-coded business hours', 'Shareable links', 'Date selector']
    },
    {
      '@type': 'HowTo',
      name: 'How to Plan a Meeting Across Time Zones',
      description: 'Use the MyZoneTime meeting planner to find the best overlapping business hours for your global team.',
      totalTime: 'PT2M',
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Open the Meeting Planner', text: 'Go to myzonetime.com/meeting-planner. It loads with London, New York, and Tokyo as default cities.' },
        { '@type': 'HowToStep', position: 2, name: 'Add your cities', text: 'Type a city name in the search box and click to add it. You can add up to 7 cities.' },
        { '@type': 'HowToStep', position: 3, name: 'Pick a date', text: 'Use the date picker to select your target meeting date. The tool adjusts automatically for daylight saving time.' },
        { '@type': 'HowToStep', position: 4, name: 'Read the colour grid', text: 'Green cells show business hours (9 AM–5 PM local time). Yellow shows early or late hours. Red shows overnight.' },
        { '@type': 'HowToStep', position: 5, name: 'Find the overlap', text: 'The "Best Times to Meet" section shows which UTC hours are within business hours for all selected cities.' },
        { '@type': 'HowToStep', position: 6, name: 'Share the plan', text: 'Click Share to copy a URL that opens the planner pre-loaded with your city selection.' }
      ]
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is a meeting time zone planner?', acceptedAnswer: { '@type': 'Answer', text: 'A meeting time zone planner shows the local time in multiple cities simultaneously on a 24-hour grid, colour-coding business hours so you can identify when all participants are available.' } },
        { '@type': 'Question', name: 'How many cities can I add to the meeting planner?', acceptedAnswer: { '@type': 'Answer', text: 'The MyZoneTime meeting planner supports up to 7 cities at once. You can search from 500+ cities and reorder them.' } },
        { '@type': 'Question', name: 'Does the meeting planner account for daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The meeting planner automatically adjusts for daylight saving time based on the date you select — BST vs GMT for London, EDT vs EST for New York, and so on.' } },
        { '@type': 'Question', name: 'What is the best time to schedule a meeting between New York and London?', acceptedAnswer: { '@type': 'Answer', text: 'The best overlap is typically 1 PM–5 PM London time (8 AM–12 PM New York time) during BST, or 2 PM–5 PM London during GMT. Use the meeting planner to see this colour-coded grid.' } },
        { '@type': 'Question', name: 'What is the best time to schedule a meeting between Dubai and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) and New York (UTC-4/-5) have an 8–9 hour difference. The best window is typically 5 PM–6 PM Dubai time (9 AM–10 AM New York).' } },
        { '@type': 'Question', name: 'Is the meeting planner free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, the MyZoneTime meeting planner is completely free with no account required. It works in any browser on desktop, tablet, or mobile.' } }
      ]
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Meeting Planner', item: 'https://myzonetime.com/meeting-planner' }] }
  ],

  '/timezone-converter': [
    {
      '@type': 'WebApplication',
      name: 'Time Zone Converter',
      url: 'https://myzonetime.com/timezone-converter',
      description: 'Convert time between any two cities or time zones instantly. Free, DST-aware, with shareable results.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I convert time between time zones?', acceptedAnswer: { '@type': 'Answer', text: 'Go to myzonetime.com/timezone-converter, select your source city and destination city, then enter any time. The converter instantly shows the equivalent local time in the destination, accounting for daylight saving time.' } },
        { '@type': 'Question', name: 'What is the time difference between Dubai and London?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (GST, UTC+4) is 3 hours ahead of London during BST (UTC+1) and 4 hours ahead during GMT (UTC+0) in winter.' } },
        { '@type': 'Question', name: 'What is the time difference between New York and London?', acceptedAnswer: { '@type': 'Answer', text: 'London is typically 5 hours ahead of New York (EST) in winter and 4–5 hours ahead during spring when the UK and US change clocks on different dates.' } },
        { '@type': 'Question', name: 'Does the converter handle daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The converter automatically handles DST for all cities using the IANA timezone database, applying correct rules for any date.' } }
      ]
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Time Zone Converter', item: 'https://myzonetime.com/timezone-converter' }] }
  ],

  '/time-difference-calculator': [
    {
      '@type': 'WebApplication',
      name: 'Time Difference Calculator',
      url: 'https://myzonetime.com/time-difference-calculator',
      description: 'Calculate the exact time difference between any two cities or time zones. DST-aware. Free and instant.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I calculate the time difference between two countries?', acceptedAnswer: { '@type': 'Answer', text: 'Use myzonetime.com/time-difference-calculator. Select any two cities, and the tool instantly shows how many hours apart they are, with automatic daylight saving time adjustments.' } },
        { '@type': 'Question', name: 'What is the time difference between UAE and UK?', acceptedAnswer: { '@type': 'Answer', text: 'The UAE (UTC+4) is 3 hours ahead of the UK during BST (UTC+1) and 4 hours ahead during GMT (UTC+0) in winter.' } },
        { '@type': 'Question', name: 'What is the time difference between USA and India?', acceptedAnswer: { '@type': 'Answer', text: 'India (IST, UTC+5:30) is 10.5 hours ahead of New York (EST, UTC-5) in winter and 9.5 hours ahead during EDT (UTC-4) in summer. India does not observe DST.' } },
        { '@type': 'Question', name: 'How many hours ahead is Australia from the UK?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney (AEST, UTC+10) is 10 hours ahead of London (GMT) in winter and 9 hours ahead during BST, varying because both observe DST at different times.' } }
      ]
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Time Difference Calculator', item: 'https://myzonetime.com/time-difference-calculator' }] }
  ],

  '/hijri-calendar': [
    {
      '@type': 'WebApplication',
      name: 'Hijri Calendar — Islamic Date Today',
      url: 'https://myzonetime.com/hijri-calendar',
      description: "Free Islamic Hijri calendar. View today's Hijri date and convert between Hijri and Gregorian calendars.",
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: "What is today's date in the Hijri calendar?", acceptedAnswer: { '@type': 'Answer', text: "The current Hijri date is shown live on myzonetime.com/hijri-calendar. The Islamic calendar is a lunar calendar of 12 months, each beginning with the sighting of the new moon." } },
        { '@type': 'Question', name: 'How do I convert a Gregorian date to Hijri?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Hijri calendar converter at myzonetime.com/hijri-calendar. Enter any Gregorian date and the tool instantly shows the corresponding Islamic Hijri date.' } },
        { '@type': 'Question', name: 'What is the current Islamic year?', acceptedAnswer: { '@type': 'Answer', text: "The current Islamic Hijri year is 1447 AH (Anno Hegirae). The Hijri calendar began in 622 CE with the Prophet Muhammad's migration from Mecca to Medina." } },
        { '@type': 'Question', name: 'How many months are in the Hijri calendar?', acceptedAnswer: { '@type': 'Answer', text: "The Hijri calendar has 12 months: Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Awwal, Jumada al-Thani, Rajab, Sha'ban, Ramadan, Shawwal, Dhu al-Qa'dah, and Dhu al-Hijjah." } }
      ]
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Hijri Calendar', item: 'https://myzonetime.com/hijri-calendar' }] }
  ],

  '/work-hours-calculator': [
    {
      '@type': 'WebApplication',
      name: 'Work Hours Calculator — Timesheet & Payroll',
      url: 'https://myzonetime.com/work-hours-calculator',
      description: 'Calculate total work hours for any time period. Add breaks, multiple shifts, and calculate payroll. Free timesheet calculator.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I calculate total work hours?', acceptedAnswer: { '@type': 'Answer', text: 'Use myzonetime.com/work-hours-calculator. Enter your start and end times for each shift, add any break durations, and the calculator instantly totals your work hours.' } },
        { '@type': 'Question', name: 'How do I calculate pay from work hours?', acceptedAnswer: { '@type': 'Answer', text: 'Enter your hourly rate in the Work Hours Calculator. After entering your hours and breaks, the calculator multiplies total hours by your rate to give gross pay.' } },
        { '@type': 'Question', name: 'How many work hours are in a standard week?', acceptedAnswer: { '@type': 'Answer', text: 'A standard full-time week is 40 hours (8 hours per day over 5 days). The UAE private sector standard is 48 hours.' } }
      ]
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Work Hours Calculator', item: 'https://myzonetime.com/work-hours-calculator' }] }
  ],

  '/world-clock': [
    {
      '@type': 'WebApplication',
      name: 'World Clock — Live Time in 500+ Cities',
      url: 'https://myzonetime.com/world-clock',
      description: 'Live world clock for 500+ cities worldwide. See the current local time for any city instantly.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is a world clock?', acceptedAnswer: { '@type': 'Answer', text: 'A world clock shows the current local time in multiple cities or time zones simultaneously. MyZoneTime\'s world clock covers 500+ cities and auto-updates every second.' } },
        { '@type': 'Question', name: 'How do I search for a city on the world clock?', acceptedAnswer: { '@type': 'Answer', text: 'Type any city name in the search box on myzonetime.com/world-clock and results will appear instantly. Click any city to see its live time.' } }
      ]
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' }] }
  ],

  '/world-clock-widget': [
    {
      '@type': 'SoftwareApplication',
      name: 'World Clock Widget — Free Embeddable Clock',
      url: 'https://myzonetime.com/world-clock-widget',
      description: 'Free embeddable world clock widget for any website. Copy-paste HTML iframe snippet. Shows live time for multiple cities.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I add a world clock to my website?', acceptedAnswer: { '@type': 'Answer', text: 'Go to myzonetime.com/world-clock-widget, copy the HTML iframe code snippet, and paste it into your website HTML, WordPress custom HTML block, or Webflow embed element.' } },
        { '@type': 'Question', name: 'Is the world clock widget free to embed?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, the MyZoneTime world clock widget is completely free to embed on any website. No account or API key required.' } }
      ]
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'World Clock Widget', item: 'https://myzonetime.com/world-clock-widget' }] }
  ],

  '/stopwatch': [
    { '@type': 'WebApplication', name: 'Online Stopwatch with Lap Timer', url: 'https://myzonetime.com/stopwatch', description: 'Free online stopwatch with lap recording and millisecond precision. No download needed.', applicationCategory: 'UtilitiesApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Stopwatch', item: 'https://myzonetime.com/stopwatch' }] }
  ],

  '/timer': [
    { '@type': 'WebApplication', name: 'Online Countdown Timer', url: 'https://myzonetime.com/timer', description: 'Free online countdown timer. Set any duration, audio alert when complete.', applicationCategory: 'UtilitiesApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Timer', item: 'https://myzonetime.com/timer' }] }
  ],

  '/countdown': [
    { '@type': 'WebApplication', name: 'Event Countdown Timer', url: 'https://myzonetime.com/countdown', description: 'Count down to any future date in days, hours, minutes, and seconds. Free.', applicationCategory: 'UtilitiesApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Event Countdown', item: 'https://myzonetime.com/countdown' }] }
  ],

  '/date-calculator': [
    { '@type': 'WebApplication', name: 'Date Calculator — Days Between Dates', url: 'https://myzonetime.com/date-calculator', description: 'Calculate the number of days, weeks, or months between any two dates. Free.', applicationCategory: 'UtilitiesApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Date Calculator', item: 'https://myzonetime.com/date-calculator' }] }
  ],

  // ── City pages — full FAQ schemas ───────────────────────────────────────────
  '/dubai': citySchema('Dubai', 'United Arab Emirates', SITE + '/dubai', 'Asia/Dubai', 'UTC+4, GST', false, 'Dubai does not observe daylight saving time.', [
    { '@type': 'Question', name: 'What time zone is Dubai in?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai uses Gulf Standard Time (GST), which is UTC+4. Dubai and the UAE do not observe daylight saving time — the offset stays at UTC+4 all year.' } },
    { '@type': 'Question', name: 'Does Dubai observe daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'No. Dubai and the rest of the United Arab Emirates do not observe daylight saving time. The clocks in Dubai remain at UTC+4 year-round.' } },
    { '@type': 'Question', name: 'What is the time difference between Dubai and London?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 4 hours ahead of London in winter (GMT, UTC+0) and 3 hours ahead during British Summer Time (BST, UTC+1) from late March to late October.' } },
    { '@type': 'Question', name: 'What is the time difference between Dubai and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 9 hours ahead of New York in winter (EST, UTC-5) and 8 hours ahead during Eastern Daylight Time (EDT, UTC-4) in summer.' } },
    { '@type': 'Question', name: 'What are business hours in Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Standard business hours in Dubai are Sunday to Thursday, 9 AM to 6 PM GST. Friday and Saturday are the weekend in the UAE. Government offices often close by 3 PM on Thursdays.' } }
  ]),

  '/london': citySchema('London', 'United Kingdom', SITE + '/london', 'Europe/London', 'UTC+0/+1, GMT/BST', true, 'Clocks go forward in late March (BST) and back in late October (GMT).', [
    { '@type': 'Question', name: 'What time zone is London in?', acceptedAnswer: { '@type': 'Answer', text: 'London is in the Greenwich Mean Time (GMT, UTC+0) zone in winter and British Summer Time (BST, UTC+1) in summer.' } },
    { '@type': 'Question', name: 'When does London change its clocks?', acceptedAnswer: { '@type': 'Answer', text: 'London clocks go forward one hour on the last Sunday in March (to BST, UTC+1) and back on the last Sunday in October (to GMT, UTC+0).' } },
    { '@type': 'Question', name: 'What is the time difference between London and New York?', acceptedAnswer: { '@type': 'Answer', text: 'London is 5 hours ahead of New York (EST) in winter and 4–5 hours ahead during spring when the UK and US change clocks on different dates.' } },
    { '@type': 'Question', name: 'What is the time difference between London and Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 4 hours ahead of London in winter (GMT) and 3 hours ahead during British Summer Time (BST).' } },
    { '@type': 'Question', name: 'What are business hours in London?', acceptedAnswer: { '@type': 'Answer', text: 'Standard business hours in London are Monday to Friday, 9 AM to 5:30 PM GMT or BST. The London Stock Exchange trades 8 AM to 4:30 PM.' } }
  ]),

  '/new-york': citySchema('New York', 'United States', SITE + '/new-york', 'America/New_York', 'UTC-5/-4, EST/EDT', true, 'Clocks go forward in March (EDT) and back in November (EST).', [
    { '@type': 'Question', name: 'What time zone is New York in?', acceptedAnswer: { '@type': 'Answer', text: 'New York is in the Eastern Time Zone — EST (UTC-5) in winter and EDT (UTC-4) during daylight saving time, which runs from the second Sunday in March to the first Sunday in November.' } },
    { '@type': 'Question', name: 'What is the time difference between New York and London?', acceptedAnswer: { '@type': 'Answer', text: 'London is typically 5 hours ahead of New York (EST, UTC-5) in winter. During spring and autumn transitions when the UK and US change clocks on different dates, the difference can be 4 or 6 hours temporarily.' } },
    { '@type': 'Question', name: 'What is the time difference between New York and Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 9 hours ahead of New York during EST (UTC-5) and 8 hours ahead during EDT (UTC-4) in summer.' } },
    { '@type': 'Question', name: 'What are business hours in New York?', acceptedAnswer: { '@type': 'Answer', text: 'Standard business hours in New York are Monday to Friday, 9 AM to 5 PM EST or EDT. The New York Stock Exchange trades 9:30 AM to 4 PM ET.' } }
  ]),

  '/tokyo': citySchema('Tokyo', 'Japan', SITE + '/tokyo', 'Asia/Tokyo', 'UTC+9, JST', false, 'Japan does not observe daylight saving time.', [
    { '@type': 'Question', name: 'What time zone is Tokyo in?', acceptedAnswer: { '@type': 'Answer', text: 'Tokyo is in the Japan Standard Time (JST) zone, which is UTC+9. Japan does not observe daylight saving time, so the offset is constant year-round.' } },
    { '@type': 'Question', name: 'What is the time difference between Tokyo and London?', acceptedAnswer: { '@type': 'Answer', text: 'Tokyo (UTC+9) is 9 hours ahead of London in winter (GMT) and 8 hours ahead during British Summer Time (BST, UTC+1).' } },
    { '@type': 'Question', name: 'What is the time difference between Tokyo and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Tokyo (UTC+9) is 14 hours ahead of New York (EST, UTC-5) in winter and 13 hours ahead during EDT (UTC-4) in summer.' } },
    { '@type': 'Question', name: 'Does Japan observe daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'No. Japan does not observe daylight saving time. Tokyo stays at UTC+9 (JST) all year.' } }
  ]),

  '/singapore': citySchema('Singapore', 'Singapore', SITE + '/singapore', 'Asia/Singapore', 'UTC+8, SGT', false, 'Singapore does not observe daylight saving time.', [
    { '@type': 'Question', name: 'What time zone is Singapore in?', acceptedAnswer: { '@type': 'Answer', text: 'Singapore uses Singapore Standard Time (SGT), which is UTC+8. Singapore does not observe daylight saving time — the offset is fixed year-round.' } },
    { '@type': 'Question', name: 'What is the time difference between Singapore and London?', acceptedAnswer: { '@type': 'Answer', text: 'Singapore (UTC+8) is 8 hours ahead of London in winter (GMT) and 7 hours ahead during British Summer Time (BST, UTC+1).' } },
    { '@type': 'Question', name: 'What is the time difference between Singapore and Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Singapore (UTC+8) is 4 hours ahead of Dubai (UTC+4). This difference is constant year-round as neither country observes daylight saving time.' } },
    { '@type': 'Question', name: 'What are business hours in Singapore?', acceptedAnswer: { '@type': 'Answer', text: 'Standard business hours in Singapore are Monday to Friday, 9 AM to 6 PM SGT, with some offices also working Saturday mornings.' } }
  ]),

  '/sydney': citySchema('Sydney', 'Australia', SITE + '/sydney', 'Australia/Sydney', 'UTC+10/+11, AEST/AEDT', true, 'Sydney observes DST from October to April (opposite of Northern Hemisphere).', [
    { '@type': 'Question', name: 'What time zone is Sydney in?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney uses AEST (Australian Eastern Standard Time, UTC+10) in winter and AEDT (Australian Eastern Daylight Time, UTC+11) in summer (October to April).' } },
    { '@type': 'Question', name: 'Does Sydney observe daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Sydney (New South Wales) observes DST from the first Sunday in October to the first Sunday in April — the opposite of the Northern Hemisphere schedule.' } },
    { '@type': 'Question', name: 'What is the time difference between Sydney and London?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney is 10 hours ahead of London (GMT) in Northern Hemisphere winter, and 9 hours ahead during BST, as both countries observe DST at different times.' } },
    { '@type': 'Question', name: 'What is the time difference between Sydney and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney is typically 15–16 hours ahead of New York, depending on the time of year and whether both cities are observing DST.' } }
  ]),

  '/riyadh': citySchema('Riyadh', 'Saudi Arabia', SITE + '/riyadh', 'Asia/Riyadh', 'UTC+3, AST', false, 'Saudi Arabia does not observe daylight saving time.', [
    { '@type': 'Question', name: 'What time zone is Riyadh in?', acceptedAnswer: { '@type': 'Answer', text: 'Riyadh uses Arabia Standard Time (AST), which is UTC+3. Saudi Arabia does not observe daylight saving time.' } },
    { '@type': 'Question', name: 'What is the time difference between Riyadh and London?', acceptedAnswer: { '@type': 'Answer', text: 'Riyadh (UTC+3) is 3 hours ahead of London in winter (GMT) and 2 hours ahead during British Summer Time (BST, UTC+1).' } },
    { '@type': 'Question', name: 'What is the time difference between Riyadh and Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 1 hour ahead of Riyadh (UTC+3) year-round. Neither country observes daylight saving time.' } },
    { '@type': 'Question', name: 'What are business hours in Riyadh?', acceptedAnswer: { '@type': 'Answer', text: 'Standard business hours in Riyadh are Sunday to Thursday, 9 AM to 5 PM AST. Friday and Saturday are the weekend in Saudi Arabia.' } }
  ]),

  '/abu-dhabi': citySchema('Abu Dhabi', 'United Arab Emirates', SITE + '/abu-dhabi', 'Asia/Dubai', 'UTC+4, GST', false, 'Abu Dhabi does not observe daylight saving time.', [
    { '@type': 'Question', name: 'What time zone is Abu Dhabi in?', acceptedAnswer: { '@type': 'Answer', text: 'Abu Dhabi uses Gulf Standard Time (GST), which is UTC+4 — the same as Dubai. The UAE does not observe daylight saving time.' } },
    { '@type': 'Question', name: 'What is the time difference between Abu Dhabi and London?', acceptedAnswer: { '@type': 'Answer', text: 'Abu Dhabi (UTC+4) is 4 hours ahead of London in winter (GMT) and 3 hours ahead during British Summer Time (BST).' } },
    { '@type': 'Question', name: 'Is Abu Dhabi in the same time zone as Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Abu Dhabi and Dubai are both on Gulf Standard Time (GST, UTC+4). Both cities, and the entire UAE, use the same time zone.' } }
  ]),

  '/istanbul': citySchema('Istanbul', 'Turkey', SITE + '/istanbul', 'Europe/Istanbul', 'UTC+3, TRT', false, 'Turkey discontinued daylight saving time in 2016 and now uses UTC+3 year-round.', [
    { '@type': 'Question', name: 'What time zone is Istanbul in?', acceptedAnswer: { '@type': 'Answer', text: 'Istanbul uses Turkey Time (TRT), which is UTC+3. Turkey discontinued daylight saving time in 2016, so Istanbul stays at UTC+3 all year.' } },
    { '@type': 'Question', name: 'Does Istanbul observe daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'No. Turkey permanently moved to UTC+3 in 2016 and no longer observes daylight saving time. Istanbul is at UTC+3 year-round.' } },
    { '@type': 'Question', name: 'What is the time difference between Istanbul and London?', acceptedAnswer: { '@type': 'Answer', text: 'Istanbul (UTC+3) is 3 hours ahead of London in winter (GMT) and 2 hours ahead during British Summer Time (BST, UTC+1).' } },
    { '@type': 'Question', name: 'What is the time difference between Istanbul and Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 1 hour ahead of Istanbul (UTC+3). This difference is constant year-round as Turkey stopped observing DST in 2016.' } },
    { '@type': 'Question', name: 'What are business hours in Istanbul?', acceptedAnswer: { '@type': 'Answer', text: 'Standard business hours in Istanbul are Monday to Friday, 9 AM to 6 PM TRT (UTC+3). Government offices typically open 8:30 AM to 5:30 PM.' } }
  ]),

  '/oslo': citySchema('Oslo', 'Norway', SITE + '/oslo', 'Europe/Oslo', 'UTC+1/+2, CET/CEST', true, 'Oslo observes DST: CET (UTC+1) in winter, CEST (UTC+2) in summer.', [
    { '@type': 'Question', name: 'What time zone is Oslo in?', acceptedAnswer: { '@type': 'Answer', text: 'Oslo uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) from late March to late October.' } },
    { '@type': 'Question', name: 'What is the time difference between Oslo and London?', acceptedAnswer: { '@type': 'Answer', text: 'Oslo is 1 hour ahead of London year-round — Oslo switches between CET (UTC+1) and CEST (UTC+2), while London switches between GMT (UTC+0) and BST (UTC+1), always maintaining a 1-hour gap.' } },
    { '@type': 'Question', name: 'What is the time difference between Oslo and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Oslo (CET, UTC+1) is 6 hours ahead of New York (EST, UTC-5) in winter and 5–6 hours ahead during spring and summer transitions.' } },
    { '@type': 'Question', name: 'Does Norway observe daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Norway observes DST. Clocks go forward 1 hour on the last Sunday in March and back on the last Sunday in October, in line with all EU countries.' } }
  ]),

  '/paris': citySchema('Paris', 'France', SITE + '/paris', 'Europe/Paris', 'UTC+1/+2, CET/CEST', true, 'Paris observes DST: CET (UTC+1) in winter, CEST (UTC+2) in summer.', [
    { '@type': 'Question', name: 'What time zone is Paris in?', acceptedAnswer: { '@type': 'Answer', text: 'Paris uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) from late March to late October.' } },
    { '@type': 'Question', name: 'What is the time difference between Paris and London?', acceptedAnswer: { '@type': 'Answer', text: 'Paris is always 1 hour ahead of London. Both cities observe DST on the same dates, maintaining a constant 1-hour difference.' } },
    { '@type': 'Question', name: 'What is the time difference between Paris and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Paris (CET, UTC+1) is 6 hours ahead of New York (EST, UTC-5) in winter and 5–6 hours during the spring clock change period.' } },
    { '@type': 'Question', name: 'Does France observe daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. France observes DST. Clocks go forward on the last Sunday in March and back on the last Sunday in October.' } }
  ]),

  '/kuala-lumpur': citySchema('Kuala Lumpur', 'Malaysia', SITE + '/kuala-lumpur', 'Asia/Kuala_Lumpur', 'UTC+8, MYT', false, 'Malaysia does not observe daylight saving time.', [
    { '@type': 'Question', name: 'What time zone is Kuala Lumpur in?', acceptedAnswer: { '@type': 'Answer', text: 'Kuala Lumpur uses Malaysia Time (MYT), which is UTC+8. Malaysia does not observe daylight saving time, so the offset is fixed year-round.' } },
    { '@type': 'Question', name: 'Is Kuala Lumpur in the same time zone as Singapore?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Kuala Lumpur and Singapore share the same UTC+8 offset. Malaysian Time (MYT) and Singapore Standard Time (SGT) are equivalent.' } },
    { '@type': 'Question', name: 'What is the time difference between Kuala Lumpur and London?', acceptedAnswer: { '@type': 'Answer', text: 'Kuala Lumpur (UTC+8) is 8 hours ahead of London in winter (GMT) and 7 hours ahead during British Summer Time (BST, UTC+1).' } }
  ]),

  '/bangkok': citySchema('Bangkok', 'Thailand', SITE + '/bangkok', 'Asia/Bangkok', 'UTC+7, ICT', false, 'Thailand does not observe daylight saving time.', [
    { '@type': 'Question', name: 'What time zone is Bangkok in?', acceptedAnswer: { '@type': 'Answer', text: 'Bangkok uses Indochina Time (ICT), which is UTC+7. Thailand does not observe daylight saving time — the offset is constant all year.' } },
    { '@type': 'Question', name: 'What is the time difference between Bangkok and London?', acceptedAnswer: { '@type': 'Answer', text: 'Bangkok (UTC+7) is 7 hours ahead of London in winter (GMT) and 6 hours ahead during British Summer Time (BST, UTC+1).' } },
    { '@type': 'Question', name: 'What is the time difference between Bangkok and Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Bangkok (UTC+7) is 3 hours ahead of Dubai (UTC+4). This difference stays constant year-round as neither country observes DST.' } }
  ]),

  // ── Time-difference pair pages ───────────────────────────────────────────────
  '/time-difference/new-york-london': timeDiffSchema('New York', 'London', SITE + '/time-difference/new-york-london', 'EST/EDT', 'GMT/BST', 'New York is 5 hours behind London in winter.', '1 PM–5 PM London / 8 AM–12 PM New York during BST', [
    { '@type': 'Question', name: 'How many hours ahead is London compared to New York?', acceptedAnswer: { '@type': 'Answer', text: 'London is 5 hours ahead of New York during winter (EST vs GMT). During British Summer Time (BST, UTC+1) and US Eastern Daylight Time (EDT, UTC-4), London is 4 hours ahead. During the brief spring period when one switches and the other hasn\'t yet, it can temporarily be 6 or 5 hours.' } },
    { '@type': 'Question', name: 'What is the best time for a New York–London meeting?', acceptedAnswer: { '@type': 'Answer', text: 'The best overlap for New York–London meetings is 8 AM–12 PM New York time (1 PM–5 PM London), giving a 4-hour window of shared business hours.' } },
    { '@type': 'Question', name: 'What is 9 AM New York time in London?', acceptedAnswer: { '@type': 'Answer', text: '9 AM EST (New York winter) equals 2 PM GMT (London). During BST/EDT, 9 AM EDT equals 2 PM BST.' } }
  ]),

  '/time-difference/dubai-london': timeDiffSchema('Dubai', 'London', SITE + '/time-difference/dubai-london', 'GST', 'GMT/BST', 'Dubai is 4 hours ahead of London in winter, 3 hours during BST.', '9 AM–1 PM London / 12–4 PM Dubai', [
    { '@type': 'Question', name: 'How many hours ahead is Dubai compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 4 hours ahead of London in winter (GMT, UTC+0) and 3 hours ahead during British Summer Time (BST, UTC+1) from late March to late October.' } },
    { '@type': 'Question', name: 'What is the best time for a Dubai–London meeting?', acceptedAnswer: { '@type': 'Answer', text: 'The best overlap is 9 AM–1 PM London time (12 noon–4 PM Dubai in winter, 12 noon–4 PM Dubai in summer). Dubai\'s morning (9–10 AM) corresponds to 5–6 AM London, outside business hours.' } },
    { '@type': 'Question', name: 'What is 9 AM Dubai time in London?', acceptedAnswer: { '@type': 'Answer', text: '9 AM GST (Dubai) equals 5 AM GMT (London) in winter, or 6 AM BST in summer. This is outside London business hours.' } }
  ]),

  '/time-difference/dubai-new-york': timeDiffSchema('Dubai', 'New York', SITE + '/time-difference/dubai-new-york', 'GST', 'EST/EDT', 'Dubai is 8–9 hours ahead of New York.', '5–6 PM Dubai / 9–10 AM New York', [
    { '@type': 'Question', name: 'How many hours ahead is Dubai compared to New York?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is 9 hours ahead of New York during EST (UTC-5) in winter and 8 hours ahead during EDT (UTC-4) in summer.' } },
    { '@type': 'Question', name: 'What is the best time for a Dubai–New York meeting?', acceptedAnswer: { '@type': 'Answer', text: 'The only practical overlap is 5–6 PM Dubai time (8–9 AM EST / 9–10 AM EDT New York). Dubai is mostly asleep when New York is in afternoon business hours.' } }
  ]),

  '/time-difference/london-singapore': timeDiffSchema('London', 'Singapore', SITE + '/time-difference/london-singapore', 'GMT/BST', 'SGT', 'Singapore is 8 hours ahead of London in winter, 7 hours during BST.', '9–10 AM London / 5–6 PM Singapore', [
    { '@type': 'Question', name: 'How many hours ahead is Singapore compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Singapore (UTC+8) is 8 hours ahead of London in winter (GMT) and 7 hours ahead during British Summer Time (BST, UTC+1).' } },
    { '@type': 'Question', name: 'What is the best time for a London–Singapore meeting?', acceptedAnswer: { '@type': 'Answer', text: 'The best overlap is 9–10 AM London time (5–6 PM Singapore). This works well as Singapore\'s late afternoon aligns with London\'s morning start.' } }
  ]),

  '/time-difference/sydney-london': timeDiffSchema('Sydney', 'London', SITE + '/time-difference/sydney-london', 'AEST/AEDT', 'GMT/BST', 'Sydney is 10–11 hours ahead of London, varying by season.', 'Early London morning aligns with Sydney afternoon', [
    { '@type': 'Question', name: 'How many hours ahead is Sydney compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney is typically 10–11 hours ahead of London, depending on DST in both countries. In Northern Hemisphere winter (London on GMT), Sydney is on AEST (UTC+10), giving a 10-hour difference.' } },
    { '@type': 'Question', name: 'What is the best time for a Sydney–London meeting?', acceptedAnswer: { '@type': 'Answer', text: '7–9 AM London time (5–7 PM Sydney) is the only practical overlap. This is early for London and late afternoon for Sydney.' } }
  ]),

  '/time-difference/sydney-new-york': timeDiffSchema('Sydney', 'New York', SITE + '/time-difference/sydney-new-york', 'AEST/AEDT', 'EST/EDT', 'Sydney is 14–16 hours ahead of New York.', 'Very limited overlap — requires early morning or late evening', [
    { '@type': 'Question', name: 'How many hours ahead is Sydney compared to New York?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney is 15 hours ahead of New York in winter (AEST UTC+10 vs EST UTC-5) and 14–16 hours during various DST transitions.' } },
    { '@type': 'Question', name: 'What is the best time for a Sydney–New York meeting?', acceptedAnswer: { '@type': 'Answer', text: '8–9 AM New York time is late evening (10–11 PM) in Sydney, making meetings challenging. Consider asynchronous communication for teams spanning these two cities.' } }
  ]),

  '/time-difference/istanbul-london': timeDiffSchema('Istanbul', 'London', SITE + '/time-difference/istanbul-london', 'TRT', 'GMT/BST', 'Istanbul is 3 hours ahead of London in winter, 2 hours in summer.', '9 AM–5 PM London / 12 noon–8 PM Istanbul', [
    { '@type': 'Question', name: 'How many hours ahead is Istanbul compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Istanbul (TRT, UTC+3) is 3 hours ahead of London in winter (GMT, UTC+0) and 2 hours ahead during British Summer Time (BST, UTC+1). Turkey no longer observes DST.' } },
    { '@type': 'Question', name: 'What is the best time for an Istanbul–London meeting?', acceptedAnswer: { '@type': 'Answer', text: 'Excellent overlap: 9 AM–5 PM London time = 12 noon–8 PM Istanbul. Both cities share a solid 8-hour business hour window.' } }
  ]),

  '/time-difference/riyadh-london': timeDiffSchema('Riyadh', 'London', SITE + '/time-difference/riyadh-london', 'AST', 'GMT/BST', 'Riyadh is 3 hours ahead of London in winter, 2 hours in summer.', '9 AM–5 PM London / 12 noon–8 PM Riyadh', [
    { '@type': 'Question', name: 'How many hours ahead is Riyadh compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Riyadh (AST, UTC+3) is 3 hours ahead of London in winter (GMT) and 2 hours ahead during British Summer Time (BST, UTC+1). Saudi Arabia does not observe DST.' } },
    { '@type': 'Question', name: 'What is the best time for a Riyadh–London meeting?', acceptedAnswer: { '@type': 'Answer', text: '9 AM–2 PM London aligns with 12 noon–5 PM Riyadh. Both cities have good business-hour overlap, making scheduling relatively easy.' } }
  ]),

  '/time-difference/abu-dhabi-london': timeDiffSchema('Abu Dhabi', 'London', SITE + '/time-difference/abu-dhabi-london', 'GST', 'GMT/BST', 'Abu Dhabi is 4 hours ahead of London in winter, 3 hours in summer.', '9 AM–1 PM London / 12–4 PM Abu Dhabi', [
    { '@type': 'Question', name: 'How many hours ahead is Abu Dhabi compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Abu Dhabi (GST, UTC+4) is 4 hours ahead of London in winter (GMT) and 3 hours ahead during British Summer Time (BST). The UAE does not observe DST.' } },
    { '@type': 'Question', name: 'What is the best time for an Abu Dhabi–London meeting?', acceptedAnswer: { '@type': 'Answer', text: '9 AM–1 PM London = 12 noon–4 PM Abu Dhabi in winter. During BST, it widens slightly: 9 AM–2 PM London = 12 noon–5 PM Abu Dhabi.' } }
  ]),

  '/time-difference/dubai-singapore': timeDiffSchema('Dubai', 'Singapore', SITE + '/time-difference/dubai-singapore', 'GST', 'SGT', 'Singapore is 4 hours ahead of Dubai year-round.', '9 AM–1 PM Dubai / 1–5 PM Singapore', [
    { '@type': 'Question', name: 'How many hours ahead is Singapore compared to Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Singapore (SGT, UTC+8) is always 4 hours ahead of Dubai (GST, UTC+4). Neither country observes daylight saving time, so this difference never changes.' } },
    { '@type': 'Question', name: 'What is the best time for a Dubai–Singapore meeting?', acceptedAnswer: { '@type': 'Answer', text: '9 AM–1 PM Dubai = 1 PM–5 PM Singapore. This gives a 4-hour afternoon overlap in Singapore and morning in Dubai — ideal for business calls.' } }
  ]),

  '/time-difference/london-tokyo': timeDiffSchema('London', 'Tokyo', SITE + '/time-difference/london-tokyo', 'GMT/BST', 'JST', 'Tokyo is 9 hours ahead of London in winter, 8 hours during BST.', 'Very limited — early London morning meets Tokyo late afternoon', [
    { '@type': 'Question', name: 'How many hours ahead is Tokyo compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Tokyo (JST, UTC+9) is 9 hours ahead of London in winter (GMT) and 8 hours ahead during British Summer Time (BST). Japan does not observe DST.' } },
    { '@type': 'Question', name: 'What is the best time for a London–Tokyo meeting?', acceptedAnswer: { '@type': 'Answer', text: '8–9 AM London time = 5–6 PM Tokyo. This is the only practical overlap as Tokyo\'s morning (9 AM) is midnight in London.' } }
  ]),

  '/time-difference/new-york-tokyo': timeDiffSchema('New York', 'Tokyo', SITE + '/time-difference/new-york-tokyo', 'EST/EDT', 'JST', 'Tokyo is 14 hours ahead of New York in winter.', 'Near-impossible overlap — teams typically rely on async', [
    { '@type': 'Question', name: 'How many hours ahead is Tokyo compared to New York?', acceptedAnswer: { '@type': 'Answer', text: 'Tokyo (JST, UTC+9) is 14 hours ahead of New York (EST, UTC-5) in winter and 13 hours ahead during EDT (UTC-4) in summer.' } },
    { '@type': 'Question', name: 'What is the best time for a New York–Tokyo meeting?', acceptedAnswer: { '@type': 'Answer', text: '8 AM EST (New York) = 10 PM JST (Tokyo next day). Meetings between New York and Tokyo almost always require someone to work very early or very late.' } }
  ]),

  '/time-difference/los-angeles-london': timeDiffSchema('Los Angeles', 'London', SITE + '/time-difference/los-angeles-london', 'PST/PDT', 'GMT/BST', 'London is 8 hours ahead of Los Angeles in winter.', 'Morning London aligns with late evening LA the day before', [
    { '@type': 'Question', name: 'How many hours ahead is London compared to Los Angeles?', acceptedAnswer: { '@type': 'Answer', text: 'London (GMT, UTC+0) is 8 hours ahead of Los Angeles (PST, UTC-8) in winter. During BST and PDT transitions, the difference can briefly be 7 or 9 hours.' } },
    { '@type': 'Question', name: 'What is the best time for a London–Los Angeles meeting?', acceptedAnswer: { '@type': 'Answer', text: '4–5 PM London (GMT) = 8–9 AM Los Angeles (PST). This end-of-London-day and start-of-LA-day is the best practical window.' } }
  ]),

  '/time-difference/paris-london': timeDiffSchema('Paris', 'London', SITE + '/time-difference/paris-london', 'CET/CEST', 'GMT/BST', 'Paris is always 1 hour ahead of London.', 'Excellent overlap — only 1 hour apart', [
    { '@type': 'Question', name: 'How many hours ahead is Paris compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Paris (CET/CEST) is always 1 hour ahead of London (GMT/BST). Both change clocks on the same day, so the 1-hour gap is constant year-round.' } },
    { '@type': 'Question', name: 'What is the time in London when it is 9 AM in Paris?', acceptedAnswer: { '@type': 'Answer', text: 'When it is 9 AM in Paris (CET or CEST), it is 8 AM in London (GMT or BST).' } }
  ]),

  '/time-difference/oslo-london': timeDiffSchema('Oslo', 'London', SITE + '/time-difference/oslo-london', 'CET/CEST', 'GMT/BST', 'Oslo is always 1 hour ahead of London.', 'Excellent overlap — only 1 hour apart', [
    { '@type': 'Question', name: 'How many hours ahead is Oslo compared to London?', acceptedAnswer: { '@type': 'Answer', text: 'Oslo (CET, UTC+1 / CEST, UTC+2) is always 1 hour ahead of London. Both countries switch clocks on the same dates, maintaining a constant 1-hour gap.' } },
    { '@type': 'Question', name: 'What is the best time for an Oslo–London meeting?', acceptedAnswer: { '@type': 'Answer', text: 'Almost any time during business hours works. Oslo is only 1 hour ahead, so both cities share virtually the full workday. 9 AM London = 10 AM Oslo.' } }
  ]),

  '/blog': [
    {
      '@type': 'Blog',
      name: 'Time Zone Tips & Remote Work Guides — MyZoneTime Blog',
      url: 'https://myzonetime.com/blog',
      description: 'Expert guides on scheduling across time zones, remote team management, Hijri calendar dates, and international meeting planning.'
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://myzonetime.com/blog' }] }
  ],
};

// ── Build JSON-LD block per route ─────────────────────────────────────────────
function buildJsonLd(pathname) {
  var schemas = routeSchemas[pathname];
  if (!schemas || schemas.length === 0) return '';
  var graph = {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
  return '<script type="application/ld+json">' + JSON.stringify(graph) + '<\/script>';
}

// ── SSR meta + H1 injection ───────────────────────────────────────────────────
function injectMeta(html, meta, pathname) {
  var geo = geoMeta[pathname] || null;

  var metaTags = [
    '<title>' + meta.title + '</title>',
    '<meta name="description" content="' + meta.description + '">',
    '<meta name="author" content="MyZoneTime">',
    '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">',
    '<link rel="canonical" href="' + meta.canonical + '">',
    geo ? '<meta name="geo.region" content="'    + geo.region    + '">' : '',
    geo ? '<meta name="geo.placename" content="' + geo.placename + '">' : '',
    geo ? '<meta name="geo.position" content="'  + geo.pos       + '">' : '',
    geo ? '<meta name="ICBM" content="'          + geo.icbm      + '">' : '',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="MyZoneTime">',
    '<meta property="og:locale" content="en_US">',
    '<meta property="og:url" content="'         + meta.canonical + '">',
    '<meta property="og:title" content="'       + meta.title     + '">',
    '<meta property="og:description" content="' + meta.description + '">',
    '<meta property="og:image" content="'       + OG + '">',
    '<meta property="og:image:type" content="image/jpeg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="MyZoneTime — World Clock &amp; Time Zone Tools">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:site" content="@myzonetime">',
    '<meta name="twitter:creator" content="@myzonetime">',
    '<meta name="twitter:title" content="'       + meta.title       + '">',
    '<meta name="twitter:description" content="' + meta.description + '">',
    '<meta name="twitter:image" content="'       + OG + '">',
    '<meta name="twitter:image:alt" content="MyZoneTime — World Clock">',
    buildJsonLd(pathname),
  ].filter(Boolean).join('\n    ');

  html = html.replace('<!-- SSR meta tags injected by server/index.js go here -->', metaTags);

  var h1Html = meta.h1
    ? '<h1 style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">' + meta.h1 + '</h1>'
    : '';
  html = html.replace('<!-- SSR_H1_INJECT -->', h1Html);

  return html;
}

// ── Route meta ────────────────────────────────────────────────────────────────
var routeMeta = {
  '/': {
    title:       'World Clock & Time Zone Converter — Free | MyZoneTime',
    description: 'Free world clock showing live time in 500+ cities. Time zone converter, meeting planner, Hijri calendar, work hours calculator. Trusted by global teams. No signup needed.',
    h1:          'World Clock & Time Zone Converter',
    canonical:   SITE + '/',
  },
  '/world-clock': {
    title:       'World Clock — Live Time in 500+ Cities | MyZoneTime',
    description: 'Live world clock for 500+ cities. Instantly see current local time in Dubai, London, New York, Tokyo, Singapore, Sydney, and hundreds more. Free, no signup.',
    h1:          'World Clock — Live Time in 500+ Cities',
    canonical:   SITE + '/world-clock',
  },
  '/timezone-converter': {
    title:       'Time Zone Converter — Compare Any Two Cities Free | MyZoneTime',
    description: 'Free time zone converter. Compare exact local time between any two cities instantly. Accounts for daylight saving time. Perfect for scheduling international meetings.',
    h1:          'Time Zone Converter — Compare Any Two Cities',
    canonical:   SITE + '/timezone-converter',
  },
  '/meeting-planner': {
    title:       'Meeting Planner — Best Time Across Time Zones Free | MyZoneTime',
    description: 'Find the best meeting time across multiple time zones. Colour-coded business hours for up to 7 cities. DST-aware, shareable links. Free international meeting scheduler.',
    h1:          'Meeting Planner — Find the Best Time to Meet Across Time Zones',
    canonical:   SITE + '/meeting-planner',
  },
  '/hijri-calendar': {
    title:       "Hijri Calendar 2026 — Today's Islamic Date | MyZoneTime",
    description: "Today's Hijri Islamic date with Gregorian conversion. Free Hijri calendar 2026 for Muslims and GCC users. Check the current Islamic month, year, and convert any date.",
    h1:          "Hijri Calendar — Today's Islamic Date 2026",
    canonical:   SITE + '/hijri-calendar',
  },
  '/stopwatch': {
    title:       'Free Online Stopwatch — Lap Timer, Millisecond Precision | MyZoneTime',
    description: 'Free online stopwatch with lap timer and millisecond precision. No download needed. Works on all devices directly in your browser.',
    h1:          'Online Stopwatch',
    canonical:   SITE + '/stopwatch',
  },
  '/timer': {
    title:       'Online Countdown Timer — Set Any Duration Free | MyZoneTime',
    description: 'Free online countdown timer. Set any hours, minutes, and seconds. Plays an audio alert when complete. No signup. Works on all devices in your browser.',
    h1:          'Online Countdown Timer',
    canonical:   SITE + '/timer',
  },
  '/countdown': {
    title:       'Event Countdown — Days Until Any Date | MyZoneTime',
    description: 'Free event countdown timer. Count days, hours, minutes, and seconds until any future date. Perfect for holidays, launches, deadlines, and special occasions.',
    h1:          'Event Countdown Timer',
    canonical:   SITE + '/countdown',
  },
  '/date-calculator': {
    title:       'Date Calculator — Days Between Dates Free | MyZoneTime',
    description: 'Calculate the exact number of days, weeks, months, or years between any two dates. Free online date difference calculator with instant results.',
    h1:          'Date Calculator — Days Between Dates',
    canonical:   SITE + '/date-calculator',
  },
  '/work-hours-calculator': {
    title:       'Work Hours Calculator — Free Timesheet & Payroll | MyZoneTime',
    description: 'Calculate total work hours and payroll for any period. Add breaks, multiple shifts. Free online timesheet calculator for employees and freelancers.',
    h1:          'Work Hours Calculator — Timesheet & Payroll',
    canonical:   SITE + '/work-hours-calculator',
  },
  '/time-difference-calculator': {
    title:       'Time Difference Calculator — Any Two Cities | MyZoneTime',
    description: 'Calculate the exact time difference between any two cities or countries. Free, DST-aware. Instantly find how many hours apart New York, London, Dubai, or any city is.',
    h1:          'Time Difference Calculator',
    canonical:   SITE + '/time-difference-calculator',
  },
  '/world-clock-widget': {
    title:       'Free World Clock Widget — Embed on Any Website | MyZoneTime',
    description: 'Add a free embeddable world clock widget to your website. Display live local time for multiple cities with a simple copy-paste HTML snippet. No coding required.',
    h1:          'World Clock Widget — Free Embeddable Clock',
    canonical:   SITE + '/world-clock-widget',
  },
  '/privacy-policy': {
    title:       'Privacy Policy | MyZoneTime',
    description: 'Read the privacy policy for MyZoneTime. Learn how we handle your data when you use our free world clock, time zone converter, and related tools.',
    h1:          'Privacy Policy',
    canonical:   SITE + '/privacy-policy',
  },
  '/terms-of-service': {
    title:       'Terms of Service | MyZoneTime',
    description: 'Read the terms and conditions for using MyZoneTime. Understand your rights and responsibilities when using our free world clock and time zone tools.',
    h1:          'Terms of Service',
    canonical:   SITE + '/terms-of-service',
  },

  // ── City pages ──────────────────────────────────────────────────────────────
  '/dubai': {
    title:       'Current Time in Dubai, UAE — Live Clock UTC+4 | MyZoneTime',
    description: 'Live clock for Dubai, UAE. Gulf Standard Time (GST), UTC+4. No daylight saving. Current time, weather, business hours, and best time to call Dubai from anywhere.',
    h1:          'Current Time in Dubai, United Arab Emirates',
    canonical:   SITE + '/dubai',
  },
  '/london': {
    title:       'Current Time in London, UK — Live Clock GMT/BST | MyZoneTime',
    description: 'Live clock for London, UK. Greenwich Mean Time (GMT/BST), UTC+0 or UTC+1. Current time, weather, business hours, and best time to call London from anywhere.',
    h1:          'Current Time in London, United Kingdom',
    canonical:   SITE + '/london',
  },
  '/new-york': {
    title:       'Current Time in New York — Live Clock EST/EDT | MyZoneTime',
    description: 'Live clock for New York, USA. Eastern Standard/Daylight Time (EST/EDT), UTC-5 or UTC-4. Current time, weather, business hours, and best time to call New York.',
    h1:          'Current Time in New York, United States',
    canonical:   SITE + '/new-york',
  },
  '/tokyo': {
    title:       'Current Time in Tokyo, Japan — Live Clock UTC+9 | MyZoneTime',
    description: 'Live clock for Tokyo, Japan. Japan Standard Time (JST), UTC+9. No daylight saving. Current time, weather, business hours, and best time to call Tokyo from anywhere.',
    h1:          'Current Time in Tokyo, Japan',
    canonical:   SITE + '/tokyo',
  },
  '/singapore': {
    title:       'Current Time in Singapore — Live Clock UTC+8 | MyZoneTime',
    description: 'Live clock for Singapore. Singapore Standard Time (SGT), UTC+8. No daylight saving. Current time, weather, business hours, and best time to call Singapore.',
    h1:          'Current Time in Singapore',
    canonical:   SITE + '/singapore',
  },
  '/sydney': {
    title:       'Current Time in Sydney, Australia — Live Clock AEST/AEDT | MyZoneTime',
    description: 'Live clock for Sydney, Australia. AEST (UTC+10) in winter, AEDT (UTC+11) in summer. DST observed October–April. Business hours and best call times included.',
    h1:          'Current Time in Sydney, Australia',
    canonical:   SITE + '/sydney',
  },
  '/riyadh': {
    title:       'Current Time in Riyadh, Saudi Arabia — Live Clock UTC+3 | MyZoneTime',
    description: 'Live clock for Riyadh, Saudi Arabia. Arabia Standard Time (AST), UTC+3. No daylight saving. Current time, weather, business hours, and best time to call Riyadh.',
    h1:          'Current Time in Riyadh, Saudi Arabia',
    canonical:   SITE + '/riyadh',
  },
  '/abu-dhabi': {
    title:       'Current Time in Abu Dhabi, UAE Capital — Live Clock UTC+4 | MyZoneTime',
    description: 'Live clock for Abu Dhabi, UAE capital. Gulf Standard Time (GST), UTC+4. No daylight saving. Current time, weather, business hours, and best time to call Abu Dhabi.',
    h1:          'Current Time in Abu Dhabi, United Arab Emirates',
    canonical:   SITE + '/abu-dhabi',
  },
  '/istanbul': {
    title:       'Current Time in Istanbul, Turkey — Live Clock TRT (UTC+3) | MyZoneTime',
    description: 'Live clock for Istanbul, Turkey. Turkey Time (TRT), UTC+3. No daylight saving since 2016. Current time, weather, business hours, and best time to call Istanbul.',
    h1:          'Current Time in Istanbul, Turkey',
    canonical:   SITE + '/istanbul',
  },
  '/oslo': {
    title:       'Current Time in Oslo, Norway — Live Clock CET/CEST | MyZoneTime',
    description: 'Live clock for Oslo, Norway. Central European Time (CET/CEST), UTC+1 or UTC+2. Current time, weather, business hours, and best time to call Oslo from anywhere.',
    h1:          'Current Time in Oslo, Norway',
    canonical:   SITE + '/oslo',
  },
  '/paris': {
    title:       'Current Time in Paris, France — Live Clock CET/CEST | MyZoneTime',
    description: 'Live clock for Paris, France. Central European Time (CET/CEST), UTC+1 or UTC+2 in summer. Current time, weather, business hours, and best time to call Paris.',
    h1:          'Current Time in Paris, France',
    canonical:   SITE + '/paris',
  },
  '/kuala-lumpur': {
    title:       'Current Time in Kuala Lumpur, Malaysia — Live Clock MYT (UTC+8) | MyZoneTime',
    description: 'Live clock for Kuala Lumpur, Malaysia. Malaysia Time (MYT), UTC+8. No daylight saving. Current time, weather, business hours, and best time to call KL.',
    h1:          'Current Time in Kuala Lumpur, Malaysia',
    canonical:   SITE + '/kuala-lumpur',
  },
  '/bangkok': {
    title:       'Current Time in Bangkok, Thailand — Live Clock ICT (UTC+7) | MyZoneTime',
    description: 'Live clock for Bangkok, Thailand. Indochina Time (ICT), UTC+7. No daylight saving. Current time, weather, business hours, and best time to call Bangkok.',
    h1:          'Current Time in Bangkok, Thailand',
    canonical:   SITE + '/bangkok',
  },

  // ── Time-difference pages ────────────────────────────────────────────────────
  '/time-difference/new-york-london': {
    title:       'Time Difference: New York vs London — EST/GMT | MyZoneTime',
    description: 'Exact time difference between New York and London. New York is 5 hours behind London (GMT) in winter and 4–5 hours behind during BST. Live clock and meeting planner.',
    h1:          'Time Difference Between New York and London',
    canonical:   SITE + '/time-difference/new-york-london',
  },
  '/time-difference/dubai-london': {
    title:       'Time Difference: Dubai vs London — GST/GMT | MyZoneTime',
    description: 'Exact time difference between Dubai and London. Dubai (UTC+4) is 3 hours ahead of London in summer (BST) and 4 hours ahead in winter (GMT). Live clocks and overlap tool.',
    h1:          'Time Difference Between Dubai and London',
    canonical:   SITE + '/time-difference/dubai-london',
  },
  '/time-difference/dubai-new-york': {
    title:       'Time Difference: Dubai vs New York — GST/EST | MyZoneTime',
    description: 'Exact time difference between Dubai and New York. Dubai (UTC+4) is 8–9 hours ahead of New York. Best overlap for meetings: 5–6 PM Dubai, 9–10 AM New York.',
    h1:          'Time Difference Between Dubai and New York',
    canonical:   SITE + '/time-difference/dubai-new-york',
  },
  '/time-difference/london-singapore': {
    title:       'Time Difference: London vs Singapore — GMT/SGT | MyZoneTime',
    description: 'Exact time difference between London and Singapore. Singapore (UTC+8) is 7 hours ahead of London (GMT) and 8 hours ahead during BST. Best meeting window: 9–10 AM London.',
    h1:          'Time Difference Between London and Singapore',
    canonical:   SITE + '/time-difference/london-singapore',
  },
  '/time-difference/sydney-london': {
    title:       'Time Difference: Sydney vs London — AEST/GMT | MyZoneTime',
    description: 'Exact time difference between Sydney and London. Sydney is 10–11 hours ahead of London. Very limited daily overlap — plan early London morning for Sydney afternoon.',
    h1:          'Time Difference Between Sydney and London',
    canonical:   SITE + '/time-difference/sydney-london',
  },
  '/time-difference/sydney-new-york': {
    title:       'Time Difference: Sydney vs New York — AEST/EST | MyZoneTime',
    description: 'Exact time difference between Sydney, Australia and New York, USA. Sydney is 14–16 hours ahead. Meetings require very early morning one side or late evening the other.',
    h1:          'Time Difference Between Sydney and New York',
    canonical:   SITE + '/time-difference/sydney-new-york',
  },
  '/time-difference/oslo-london': {
    title:       'Time Difference: Oslo vs London — CET/GMT | MyZoneTime',
    description: 'Time difference between Oslo, Norway (CET/CEST) and London. Oslo is always 1 hour ahead of London. Excellent meeting overlap year-round.',
    h1:          'Time Difference Between Oslo and London',
    canonical:   SITE + '/time-difference/oslo-london',
  },
  '/time-difference/oslo-new-york': {
    title:       'Time Difference: Oslo vs New York — CET/EST | MyZoneTime',
    description: 'Time difference between Oslo (UTC+1/+2) and New York (UTC-5/-4). Oslo is typically 6 hours ahead of New York. Good morning New York / afternoon Oslo overlap.',
    h1:          'Time Difference Between Oslo and New York',
    canonical:   SITE + '/time-difference/oslo-new-york',
  },
  '/time-difference/istanbul-london': {
    title:       'Time Difference: Istanbul vs London — TRT/GMT | MyZoneTime',
    description: 'Time difference between Istanbul (TRT, UTC+3) and London. Istanbul is 3 hours ahead in winter and 2 hours ahead during BST. Excellent business overlap.',
    h1:          'Time Difference Between Istanbul and London',
    canonical:   SITE + '/time-difference/istanbul-london',
  },
  '/time-difference/istanbul-new-york': {
    title:       'Time Difference: Istanbul vs New York — TRT/EST | MyZoneTime',
    description: 'Time difference between Istanbul (UTC+3) and New York (UTC-5/-4). Istanbul is 8 hours ahead of New York in winter. Limited but workable overlap in early afternoon.',
    h1:          'Time Difference Between Istanbul and New York',
    canonical:   SITE + '/time-difference/istanbul-new-york',
  },
  '/time-difference/istanbul-dubai': {
    title:       'Time Difference: Istanbul vs Dubai — TRT/GST | MyZoneTime',
    description: 'Time difference between Istanbul (UTC+3) and Dubai (UTC+4). Dubai is 1 hour ahead of Istanbul year-round. Excellent overlap for business between Turkey and UAE.',
    h1:          'Time Difference Between Istanbul and Dubai',
    canonical:   SITE + '/time-difference/istanbul-dubai',
  },
  '/time-difference/riyadh-london': {
    title:       'Time Difference: Riyadh vs London — AST/GMT | MyZoneTime',
    description: 'Time difference between Riyadh, Saudi Arabia (UTC+3) and London. Riyadh is 3 hours ahead in winter and 2 hours ahead during BST. Meeting planner included.',
    h1:          'Time Difference Between Riyadh and London',
    canonical:   SITE + '/time-difference/riyadh-london',
  },
  '/time-difference/riyadh-new-york': {
    title:       'Time Difference: Riyadh vs New York — AST/EST | MyZoneTime',
    description: 'Time difference between Riyadh (UTC+3) and New York (UTC-5). Riyadh is 8 hours ahead in winter and 7 hours in summer. Early morning New York overlaps afternoon Riyadh.',
    h1:          'Time Difference Between Riyadh and New York',
    canonical:   SITE + '/time-difference/riyadh-new-york',
  },
  '/time-difference/abu-dhabi-london': {
    title:       'Time Difference: Abu Dhabi vs London — GST/GMT | MyZoneTime',
    description: 'Time difference between Abu Dhabi (GST, UTC+4) and London. Abu Dhabi is 3 hours ahead in summer (BST) and 4 hours ahead in winter (GMT). Live clocks and overlap tool.',
    h1:          'Time Difference Between Abu Dhabi and London',
    canonical:   SITE + '/time-difference/abu-dhabi-london',
  },
  '/time-difference/abu-dhabi-new-york': {
    title:       'Time Difference: Abu Dhabi vs New York — GST/EST | MyZoneTime',
    description: 'Time difference between Abu Dhabi (UTC+4) and New York (UTC-5). Abu Dhabi is 8–9 hours ahead. Very limited business-hour overlap — use the meeting planner.',
    h1:          'Time Difference Between Abu Dhabi and New York',
    canonical:   SITE + '/time-difference/abu-dhabi-new-york',
  },
  '/time-difference/dubai-singapore': {
    title:       'Time Difference: Dubai vs Singapore — GST/SGT | MyZoneTime',
    description: 'Time difference between Dubai (UTC+4) and Singapore (UTC+8). Singapore is 4 hours ahead of Dubai. Good business hour overlap exists. Live clocks and meeting planner.',
    h1:          'Time Difference Between Dubai and Singapore',
    canonical:   SITE + '/time-difference/dubai-singapore',
  },
  '/time-difference/dubai-tokyo': {
    title:       'Time Difference: Dubai vs Tokyo — GST/JST | MyZoneTime',
    description: 'Time difference between Dubai (UTC+4) and Tokyo (UTC+9). Tokyo is 5 hours ahead of Dubai year-round. Dubai morning aligns with Tokyo afternoon.',
    h1:          'Time Difference Between Dubai and Tokyo',
    canonical:   SITE + '/time-difference/dubai-tokyo',
  },
  '/time-difference/london-tokyo': {
    title:       'Time Difference: London vs Tokyo — GMT/JST | MyZoneTime',
    description: 'Time difference between London and Tokyo (UTC+9). Tokyo is 9 hours ahead in winter and 8 hours ahead during BST. Limited overlap: 8–9 AM London = 5–6 PM Tokyo.',
    h1:          'Time Difference Between London and Tokyo',
    canonical:   SITE + '/time-difference/london-tokyo',
  },
  '/time-difference/new-york-tokyo': {
    title:       'Time Difference: New York vs Tokyo — EST/JST | MyZoneTime',
    description: 'Time difference between New York and Tokyo (UTC+9). Tokyo is 14 hours ahead in winter (EST). Very limited overlap — most teams rely on asynchronous communication.',
    h1:          'Time Difference Between New York and Tokyo',
    canonical:   SITE + '/time-difference/new-york-tokyo',
  },
  '/time-difference/london-mumbai': {
    title:       'Time Difference: London vs Mumbai — GMT/IST | MyZoneTime',
    description: 'Time difference between London and Mumbai, India (IST, UTC+5:30). Mumbai is 5.5 hours ahead of London in winter and 4.5 hours during BST.',
    h1:          'Time Difference Between London and Mumbai',
    canonical:   SITE + '/time-difference/london-mumbai',
  },
  '/time-difference/new-york-mumbai': {
    title:       'Time Difference: New York vs Mumbai — EST/IST | MyZoneTime',
    description: 'Time difference between New York and Mumbai (IST, UTC+5:30). Mumbai is 10.5 hours ahead of New York in winter (EST). Morning New York = late evening Mumbai.',
    h1:          'Time Difference Between New York and Mumbai',
    canonical:   SITE + '/time-difference/new-york-mumbai',
  },
  '/time-difference/london-bangkok': {
    title:       'Time Difference: London vs Bangkok — GMT/ICT | MyZoneTime',
    description: 'Time difference between London and Bangkok (ICT, UTC+7). Bangkok is 7 hours ahead in winter and 6 hours during BST. Good afternoon London / evening Bangkok overlap.',
    h1:          'Time Difference Between London and Bangkok',
    canonical:   SITE + '/time-difference/london-bangkok',
  },
  '/time-difference/london-hong-kong': {
    title:       'Time Difference: London vs Hong Kong — GMT/HKT | MyZoneTime',
    description: 'Time difference between London and Hong Kong (HKT, UTC+8). Hong Kong is 8 hours ahead in winter and 7 hours ahead during BST.',
    h1:          'Time Difference Between London and Hong Kong',
    canonical:   SITE + '/time-difference/london-hong-kong',
  },
  '/time-difference/new-york-hong-kong': {
    title:       'Time Difference: New York vs Hong Kong — EST/HKT | MyZoneTime',
    description: 'Time difference between New York and Hong Kong (HKT, UTC+8). Hong Kong is 13 hours ahead in winter (EST). Best overlap: very early New York / late afternoon Hong Kong.',
    h1:          'Time Difference Between New York and Hong Kong',
    canonical:   SITE + '/time-difference/new-york-hong-kong',
  },
  '/time-difference/london-kuala-lumpur': {
    title:       'Time Difference: London vs Kuala Lumpur — GMT/MYT | MyZoneTime',
    description: 'Time difference between London and Kuala Lumpur (MYT, UTC+8). KL is 8 hours ahead of London in winter and 7 hours during BST.',
    h1:          'Time Difference Between London and Kuala Lumpur',
    canonical:   SITE + '/time-difference/london-kuala-lumpur',
  },
  '/time-difference/sydney-dubai': {
    title:       'Time Difference: Sydney vs Dubai — AEST/GST | MyZoneTime',
    description: 'Time difference between Sydney and Dubai. Sydney is 6–7 hours ahead of Dubai depending on season. Both cities have good business-hour overlap in the afternoon.',
    h1:          'Time Difference Between Sydney and Dubai',
    canonical:   SITE + '/time-difference/sydney-dubai',
  },
  '/time-difference/auckland-london': {
    title:       'Time Difference: Auckland vs London — NZST/GMT | MyZoneTime',
    description: 'Time difference between Auckland, New Zealand and London. Auckland is 12–13 hours ahead depending on DST. Very limited overlap — async communication recommended.',
    h1:          'Time Difference Between Auckland and London',
    canonical:   SITE + '/time-difference/auckland-london',
  },
  '/time-difference/paris-london': {
    title:       'Time Difference: Paris vs London — CET/GMT | MyZoneTime',
    description: 'Paris (CET/CEST) is always 1 hour ahead of London (GMT/BST). Both change clocks on the same dates. Excellent overlap for business meetings.',
    h1:          'Time Difference Between Paris and London',
    canonical:   SITE + '/time-difference/paris-london',
  },
  '/time-difference/paris-new-york': {
    title:       'Time Difference: Paris vs New York — CET/EST | MyZoneTime',
    description: 'Time difference between Paris (CET, UTC+1) and New York (EST, UTC-5). Paris is 6 hours ahead of New York in winter. Afternoon Paris aligns with New York morning.',
    h1:          'Time Difference Between Paris and New York',
    canonical:   SITE + '/time-difference/paris-new-york',
  },
  '/time-difference/berlin-london': {
    title:       'Time Difference: Berlin vs London — CET/GMT | MyZoneTime',
    description: 'Time difference between Berlin, Germany (CET/CEST) and London. Berlin is always 1 hour ahead of London. Both cities observe DST on the same dates.',
    h1:          'Time Difference Between Berlin and London',
    canonical:   SITE + '/time-difference/berlin-london',
  },
  '/time-difference/amsterdam-london': {
    title:       'Time Difference: Amsterdam vs London — CET/GMT | MyZoneTime',
    description: 'Time difference between Amsterdam (CET/CEST) and London (GMT/BST). Amsterdam is always 1 hour ahead of London. Excellent meeting overlap.',
    h1:          'Time Difference Between Amsterdam and London',
    canonical:   SITE + '/time-difference/amsterdam-london',
  },
  '/time-difference/doha-london': {
    title:       'Time Difference: Doha vs London — AST/GMT | MyZoneTime',
    description: 'Time difference between Doha, Qatar (AST, UTC+3) and London. Doha is 3 hours ahead in winter and 2 hours during BST. Qatar does not observe DST.',
    h1:          'Time Difference Between Doha and London',
    canonical:   SITE + '/time-difference/doha-london',
  },
  '/time-difference/cairo-london': {
    title:       'Time Difference: Cairo vs London — EET/GMT | MyZoneTime',
    description: 'Time difference between Cairo, Egypt (EET, UTC+2) and London. Cairo is 2 hours ahead of London in winter and 1 hour ahead during BST.',
    h1:          'Time Difference Between Cairo and London',
    canonical:   SITE + '/time-difference/cairo-london',
  },
  '/time-difference/nairobi-london': {
    title:       'Time Difference: Nairobi vs London — EAT/GMT | MyZoneTime',
    description: 'Time difference between Nairobi, Kenya (EAT, UTC+3) and London. Nairobi is 3 hours ahead in winter and 2 hours ahead during BST. Kenya does not observe DST.',
    h1:          'Time Difference Between Nairobi and London',
    canonical:   SITE + '/time-difference/nairobi-london',
  },
  '/time-difference/johannesburg-london': {
    title:       'Time Difference: Johannesburg vs London — SAST/GMT | MyZoneTime',
    description: 'Time difference between Johannesburg (SAST, UTC+2) and London. Johannesburg is 2 hours ahead of London in winter and 1 hour ahead during BST. South Africa does not observe DST.',
    h1:          'Time Difference Between Johannesburg and London',
    canonical:   SITE + '/time-difference/johannesburg-london',
  },
  '/time-difference/los-angeles-london': {
    title:       'Time Difference: Los Angeles vs London — PST/GMT | MyZoneTime',
    description: 'Time difference between Los Angeles (PST/PDT, UTC-8/-7) and London. London is 8 hours ahead in winter. Best overlap: 4–5 PM London = 8–9 AM Los Angeles.',
    h1:          'Time Difference Between Los Angeles and London',
    canonical:   SITE + '/time-difference/los-angeles-london',
  },
  '/time-difference/chicago-london': {
    title:       'Time Difference: Chicago vs London — CST/GMT | MyZoneTime',
    description: 'Time difference between Chicago (CST/CDT, UTC-6/-5) and London. London is 6 hours ahead in winter. Good overlap: 2–5 PM London = 8 AM–11 AM Chicago.',
    h1:          'Time Difference Between Chicago and London',
    canonical:   SITE + '/time-difference/chicago-london',
  },
  '/time-difference/new-york-singapore': {
    title:       'Time Difference: New York vs Singapore — EST/SGT | MyZoneTime',
    description: 'Time difference between New York (EST, UTC-5) and Singapore (SGT, UTC+8). Singapore is 13 hours ahead of New York in winter. Very limited business-hour overlap.',
    h1:          'Time Difference Between New York and Singapore',
    canonical:   SITE + '/time-difference/new-york-singapore',
  },
  '/time-difference/new-york-dubai': {
    title:       'Time Difference: New York vs Dubai — EST/GST | MyZoneTime',
    description: 'Time difference between New York and Dubai. Dubai is 8 hours ahead of EST (9 hours in summer EDT). Very limited business hour overlap — plan carefully.',
    h1:          'Time Difference Between New York and Dubai',
    canonical:   SITE + '/time-difference/new-york-dubai',
  },
  '/time-difference/london-dubai': {
    title:       'Time Difference: London vs Dubai — GMT/GST | MyZoneTime',
    description: 'Time difference between London and Dubai. Dubai (UTC+4) is 3 hours ahead during BST and 4 hours ahead during GMT winter. Live clocks and meeting overlap tool included.',
    h1:          'Time Difference Between London and Dubai',
    canonical:   SITE + '/time-difference/london-dubai',
  },
  '/blog': {
    title:       'Time Zone Tips & Remote Work Guides | MyZoneTime Blog',
    description: 'Expert guides on scheduling across time zones, remote team management, Hijri calendar dates, and international meeting planning. Free resources from MyZoneTime.',
    h1:          'Time Zone Tips & Remote Work Guides',
    canonical:   SITE + '/blog',
  },
};

// ── Load index.html at startup ────────────────────────────────────────────────
var indexTemplate = '';
try {
  indexTemplate = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
  console.log('✅ index.html loaded (' + indexTemplate.length + ' bytes)');
} catch(e) {
  console.error('⚠️  dist/index.html missing. Run: npm run build\n   Path: ' + DIST);
}

// ── Permanent redirects ───────────────────────────────────────────────────────
app.get('/converter',    function(req, res) { res.redirect(301, '/timezone-converter'); });
app.get('/newyork',      function(req, res) { res.redirect(301, '/new-york'); });
app.get('/abudhabi',     function(req, res) { res.redirect(301, '/abu-dhabi'); });
app.get('/world_clock',  function(req, res) { res.redirect(301, '/world-clock'); });
app.get('/time-difference/london-new-york', function(req, res) { res.redirect(301, '/time-difference/new-york-london'); });
app.get('/time-difference/new-york-london', function(req, res, next) { next(); });

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', function(req, res) {
  res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'dev', distReady: !!indexTemplate, dist: DIST, ts: new Date().toISOString() });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', function(req, res) {
  if (!indexTemplate) {
    return res.status(503).send('<h1>Building...</h1><p>Please refresh in 30 seconds.</p>');
  }
  var pathname = req.path.replace(/\/+$/, '') || '/';
  var meta = routeMeta[pathname] || {
    title:       'MyZoneTime — World Clock & Time Zone Tools',
    description: 'Free world clock, time zone converter, meeting planner, and more. Track live time in 500+ cities worldwide.',
    h1:          'World Clock & Time Zone Tools',
    canonical:   SITE + pathname,
  };
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
  res.status(200).send(injectMeta(indexTemplate, meta, pathname));
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(function(err, req, res, next) {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', function() {
  console.log('✅ MyZoneTime → http://0.0.0.0:' + PORT);
  console.log('   NODE_ENV : ' + (process.env.NODE_ENV || 'development'));
  console.log('   Dist     : ' + DIST);
});
