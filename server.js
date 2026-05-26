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

// ── Explicit XML/TXT routes ────────────────────────────────────────────────────
// These run BEFORE express.static so Google always gets XML, never the SPA HTML.
// Root cause of "Couldn't fetch" in GSC: express.static misses files when the
// Vite dist folder doesn't exist yet at startup, so requests fall through to
// the SPA handler which returns text/html — Google rejects it as invalid XML.
var XML_FILES = [
  'sitemap.xml',
  'sitemap-core.xml',
  'sitemap-cities.xml',
  'sitemap-pairs.xml',
];

XML_FILES.forEach(function(file) {
  app.get('/' + file, function(req, res) {
    var fp = path.join(DIST, file);
    if (!fs.existsSync(fp)) {
      // File missing — return a minimal valid XML so GSC doesn't get HTML
      console.error('[sitemap] Missing file: ' + fp);
      res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
      res.status(404).send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap not built yet. Run npm run build.</error>');
      return;
    }
    res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Robots-Tag', 'noindex'); // sitemaps themselves should not be indexed
    res.sendFile(fp);
  });
});

// robots.txt and llms.txt — explicit routes for same reason
app.get('/robots.txt', function(req, res) {
  var fp = path.join(DIST, 'robots.txt');
  if (!fs.existsSync(fp)) { return res.status(404).send('User-agent: *\nAllow: /\nSitemap: https://myzonetime.com/sitemap.xml\n'); }
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(fp);
});

app.get('/llms.txt', function(req, res) {
  var fp = path.join(DIST, 'llms.txt');
  if (!fs.existsSync(fp)) { return res.status(404).send('# MyZoneTime\nhttps://myzonetime.com\n'); }
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(fp);
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

// ── Per-route JSON-LD schemas ─────────────────────────────────────────────────
// These are injected SERVER-SIDE so Google sees them without JS execution.
var routeSchemas = {

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
        { '@type': 'Question', name: 'What is MyZoneTime?', acceptedAnswer: { '@type': 'Answer', text: 'MyZoneTime is a free world clock and time zone tool that shows live local time in 500+ cities. It includes a meeting planner, time zone converter, Hijri calendar, work hours calculator, and more.' } },
        { '@type': 'Question', name: 'How do I find the time difference between two cities?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Time Difference Calculator at myzonetime.com/time-difference-calculator. Select any two cities and the tool instantly calculates the hours difference, accounting for daylight saving time.' } },
        { '@type': 'Question', name: 'How do I plan a meeting across time zones?', acceptedAnswer: { '@type': 'Answer', text: 'Go to myzonetime.com/meeting-planner and add up to 7 cities. The tool shows a colour-coded grid of business hours so you can find the best overlap time for your global team.' } },
        { '@type': 'Question', name: 'Is MyZoneTime free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. MyZoneTime is completely free. All tools — world clock, time zone converter, meeting planner, Hijri calendar, and more — are available with no account or payment required.' } }
      ]
    }
  ],

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
        { '@type': 'Question', name: 'What is a meeting time zone planner?', acceptedAnswer: { '@type': 'Answer', text: 'A meeting time zone planner is a tool that shows the local time in multiple cities simultaneously on a 24-hour grid, colour-coding business hours so you can instantly identify when all participants are available during working hours.' } },
        { '@type': 'Question', name: 'How many cities can I add to the meeting planner?', acceptedAnswer: { '@type': 'Answer', text: 'The MyZoneTime meeting planner supports up to 7 cities at once, which is enough for most global teams. You can search from 500+ cities and reorder them using the arrow buttons.' } },
        { '@type': 'Question', name: 'Does the meeting planner account for daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The meeting planner automatically adjusts for daylight saving time based on the date you select. This means it correctly shows BST vs GMT for London, EDT vs EST for New York, and so on.' } },
        { '@type': 'Question', name: 'What is the best time to schedule a meeting between New York and London?', acceptedAnswer: { '@type': 'Answer', text: 'The best overlap for a New York–London meeting is typically 1 PM–5 PM London time (8 AM–12 PM New York time) during BST, or 2 PM–5 PM London time (9 AM–12 PM New York) during GMT. Use the meeting planner to see this colour-coded grid and share a link with your team.' } },
        { '@type': 'Question', name: 'What is the best time to schedule a meeting between Dubai and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) and New York (UTC-4 or -5) have an 8–9 hour difference, so overlap is very limited. The best window is typically 5 PM–6 PM Dubai time, which equals 9 AM–10 AM in New York. The meeting planner will highlight this window in green.' } },
        { '@type': 'Question', name: 'Can I share the meeting plan with my team?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Click the Share button and the meeting planner copies a URL to your clipboard. The URL encodes your city selection so anyone who opens it sees the exact same view.' } },
        { '@type': 'Question', name: 'What does the colour coding in the meeting grid mean?', acceptedAnswer: { '@type': 'Answer', text: 'Green means standard business hours (9 AM–5 PM local time). Yellow means early or late business hours (7–9 AM and 5–8 PM). Red means night or off-hours. The brightest green highlights where all cities are in business hours simultaneously.' } },
        { '@type': 'Question', name: 'Is the meeting planner free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, the MyZoneTime meeting planner is completely free with no account required. It works in any browser on desktop, tablet, or mobile.' } }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Meeting Planner', item: 'https://myzonetime.com/meeting-planner' }
      ]
    }
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
        { '@type': 'Question', name: 'What is the time difference between Dubai and London?', acceptedAnswer: { '@type': 'Answer', text: 'Dubai (GST, UTC+4) is 3 hours ahead of London during BST (British Summer Time) and 4 hours ahead during GMT (winter). Use the time zone converter at myzonetime.com to see the exact current difference.' } },
        { '@type': 'Question', name: 'What is the time difference between New York and London?', acceptedAnswer: { '@type': 'Answer', text: 'London is typically 5 hours ahead of New York (EST) in winter and 4 or 5 hours ahead during the spring transition period when the UK and US change clocks on different dates. Use the converter for today\'s exact difference.' } },
        { '@type': 'Question', name: 'Does the converter handle daylight saving time?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The time zone converter automatically handles daylight saving time for all cities worldwide, using the IANA timezone database to apply the correct DST rules for any date.' } }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Time Zone Converter', item: 'https://myzonetime.com/timezone-converter' }
      ]
    }
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
        { '@type': 'Question', name: 'How do I calculate the time difference between two countries?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Time Difference Calculator at myzonetime.com/time-difference-calculator. Select any two cities or countries, and the tool instantly shows how many hours apart they are, including automatic daylight saving time adjustments.' } },
        { '@type': 'Question', name: 'What is the time difference between UAE and UK?', acceptedAnswer: { '@type': 'Answer', text: 'The UAE (UTC+4) is 3 hours ahead of the UK during British Summer Time (BST, UTC+1) and 4 hours ahead during Greenwich Mean Time (GMT, UTC+0) in winter.' } },
        { '@type': 'Question', name: 'What is the time difference between USA and India?', acceptedAnswer: { '@type': 'Answer', text: 'India (IST, UTC+5:30) is 10.5 hours ahead of New York (EST, UTC-5) in winter and 9.5 hours ahead during EDT (UTC-4) in summer. India does not observe daylight saving time.' } },
        { '@type': 'Question', name: 'How many hours ahead is Australia from the UK?', acceptedAnswer: { '@type': 'Answer', text: 'Sydney, Australia (AEST, UTC+10) is 10 hours ahead of London (GMT, UTC+0) in winter and 9 hours ahead during British Summer Time. This varies because both countries observe daylight saving at different times of year.' } }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Time Difference Calculator', item: 'https://myzonetime.com/time-difference-calculator' }
      ]
    }
  ],

  '/hijri-calendar': [
    {
      '@type': 'WebApplication',
      name: 'Hijri Calendar — Islamic Date Today',
      url: 'https://myzonetime.com/hijri-calendar',
      description: 'Free Islamic Hijri calendar. View today\'s Hijri date and convert between Hijri and Gregorian calendars.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is today\'s date in the Hijri calendar?', acceptedAnswer: { '@type': 'Answer', text: 'The current Hijri date is shown live on myzonetime.com/hijri-calendar. The Islamic calendar is a lunar calendar of 12 months, each beginning with the sighting of the new moon. The Hijri year is approximately 354 days, making it shorter than the Gregorian year.' } },
        { '@type': 'Question', name: 'How do I convert a Gregorian date to Hijri?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Hijri calendar converter at myzonetime.com/hijri-calendar. Enter any Gregorian (Western) date and the tool instantly shows the corresponding Islamic Hijri date.' } },
        { '@type': 'Question', name: 'What is the current Islamic year?', acceptedAnswer: { '@type': 'Answer', text: 'The current Islamic Hijri year is 1447 AH (Anno Hegirae). The Hijri calendar began in 622 CE with the Prophet Muhammad\'s migration from Mecca to Medina.' } },
        { '@type': 'Question', name: 'How many months are in the Hijri calendar?', acceptedAnswer: { '@type': 'Answer', text: 'The Hijri calendar has 12 months: Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Awwal, Jumada al-Thani, Rajab, Sha\'ban, Ramadan, Shawwal, Dhu al-Qa\'dah, and Dhu al-Hijjah.' } }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Hijri Calendar', item: 'https://myzonetime.com/hijri-calendar' }
      ]
    }
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
        { '@type': 'Question', name: 'How do I calculate total work hours?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Work Hours Calculator at myzonetime.com/work-hours-calculator. Enter your start and end times for each shift, add any break durations, and the calculator instantly totals your work hours for the day, week, or pay period.' } },
        { '@type': 'Question', name: 'How do I calculate pay from work hours?', acceptedAnswer: { '@type': 'Answer', text: 'Enter your hourly rate in the Work Hours Calculator. After entering your hours and breaks, the calculator multiplies total hours by your rate to give you your gross pay for the period.' } },
        { '@type': 'Question', name: 'How many work hours are in a standard week?', acceptedAnswer: { '@type': 'Answer', text: 'A standard full-time work week is 40 hours (8 hours per day over 5 days). Part-time arrangements vary. The UAE standard working week is 48 hours for the private sector. Use the calculator to total your specific hours.' } }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Work Hours Calculator', item: 'https://myzonetime.com/work-hours-calculator' }
      ]
    }
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
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' }
      ]
    }
  ]
};

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
    description: 'Read the MyZoneTime privacy policy. Learn how we collect, use, and protect your data. We are committed to your privacy and data security.',
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
    title:       'Current Time in Sydney, Australia — Live Clock AEST | MyZoneTime',
    description: 'Live clock for Sydney, Australia. AEST (UTC+10) or AEDT (UTC+11). Current time, weather, business hours, and best time to call Sydney from anywhere.',
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
    title:       'Current Time in Abu Dhabi, UAE — Live Clock UTC+4 | MyZoneTime',
    description: 'Live clock for Abu Dhabi, UAE. Gulf Standard Time (GST), UTC+4. No daylight saving. Current time, weather, business hours, and best time to call Abu Dhabi.',
    h1:          'Current Time in Abu Dhabi, United Arab Emirates',
    canonical:   SITE + '/abu-dhabi',
  },
  '/oslo': {
    title:       'Current Time in Oslo, Norway — Live Clock CET/CEST | MyZoneTime',
    description: 'Live clock for Oslo, Norway. Central European Time (CET/CEST), UTC+1 or UTC+2. Current time, weather, business hours, and best time to call Oslo from anywhere.',
    h1:          'Current Time in Oslo, Norway',
    canonical:   SITE + '/oslo',
  },
  '/paris': {
    title:       'Current Time in Paris, France — Live Clock CET/CEST | MyZoneTime',
    description: 'Live clock for Paris, France. Central European Time (CET/CEST), UTC+1 or UTC+2. Current time, weather, business hours, and best time to call Paris from anywhere.',
    h1:          'Current Time in Paris, France',
    canonical:   SITE + '/paris',
  },
  '/istanbul': {
    title:       'Current Time in Istanbul, Turkey — Live Clock UTC+3 | MyZoneTime',
    description: 'Live clock for Istanbul, Turkey. Turkey Time (TRT), UTC+3. No daylight saving. Current time, weather, business hours, and best time to call Istanbul.',
    h1:          'Current Time in Istanbul, Turkey',
    canonical:   SITE + '/istanbul',
  },
  '/kuala-lumpur': {
    title:       'Current Time in Kuala Lumpur, Malaysia — Live Clock UTC+8 | MyZoneTime',
    description: 'Live clock for Kuala Lumpur, Malaysia. Malaysia Time (MYT), UTC+8. No daylight saving. Current time, weather, business hours, and best time to call KL.',
    h1:          'Current Time in Kuala Lumpur, Malaysia',
    canonical:   SITE + '/kuala-lumpur',
  },
  '/bangkok': {
    title:       'Current Time in Bangkok, Thailand — Live Clock UTC+7 | MyZoneTime',
    description: 'Live clock for Bangkok, Thailand. Indochina Time (ICT), UTC+7. No daylight saving. Current time, weather, business hours, and best time to call Bangkok.',
    h1:          'Current Time in Bangkok, Thailand',
    canonical:   SITE + '/bangkok',
  },

  // ── Time-difference city-pair pages ─────────────────────────────────────────
  '/time-difference/new-york-london': {
    title:       'Time Difference: New York vs London — EST/GMT | MyZoneTime',
    description: 'Exact time difference between New York and London. New York is 5 hours behind London (GMT) in winter and 4–5 hours behind during BST. Live clock and meeting planner.',
    h1:          'Time Difference Between New York and London',
    canonical:   SITE + '/time-difference/new-york-london',
  },
  '/time-difference/dubai-london': {
    title:       'Time Difference: Dubai vs London — GST/GMT | MyZoneTime',
    description: 'Exact time difference between Dubai and London. Dubai (UTC+4) is 3 hours ahead of London in summer (BST) and 4 hours ahead in winter (GMT). Live clock and overlap tool.',
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
    description: 'Exact time difference between London and Singapore. Singapore (UTC+8) is 7 hours ahead of London (GMT) and 8 hours ahead during BST. Ideal meeting window: 9–10 AM London.',
    h1:          'Time Difference Between London and Singapore',
    canonical:   SITE + '/time-difference/london-singapore',
  },
  '/time-difference/new-york-dubai': {
    title:       'Time Difference: New York vs Dubai — EST/GST | MyZoneTime',
    description: 'Time difference between New York and Dubai. Dubai is 8 hours ahead of EST (9 hours ahead in summer EDT). Very limited business hour overlap — plan carefully.',
    h1:          'Time Difference Between New York and Dubai',
    canonical:   SITE + '/time-difference/new-york-dubai',
  },
  '/time-difference/london-dubai': {
    title:       'Time Difference: London vs Dubai — GMT/GST | MyZoneTime',
    description: 'Time difference between London and Dubai. Dubai (UTC+4) is 3 hours ahead during BST and 4 hours ahead during GMT winter. Live clocks and meeting overlap tool included.',
    h1:          'Time Difference Between London and Dubai',
    canonical:   SITE + '/time-difference/london-dubai',
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
  '/time-difference/dubai-singapore': {
    title:       'Time Difference: Dubai vs Singapore — GST/SGT | MyZoneTime',
    description: 'Time difference between Dubai (UTC+4) and Singapore (UTC+8). Singapore is 4 hours ahead of Dubai. Good business hour overlap exists. Live clocks and meeting planner.',
    h1:          'Time Difference Between Dubai and Singapore',
    canonical:   SITE + '/time-difference/dubai-singapore',
  },
  '/time-difference/riyadh-london': {
    title:       'Time Difference: Riyadh vs London — AST/GMT | MyZoneTime',
    description: 'Time difference between Riyadh, Saudi Arabia (UTC+3) and London. Riyadh is 3 hours ahead of London in winter and 2 hours ahead during BST. Meeting planner included.',
    h1:          'Time Difference Between Riyadh and London',
    canonical:   SITE + '/time-difference/riyadh-london',
  },
  '/time-difference/new-york-singapore': {
    title:       'Time Difference: New York vs Singapore — EST/SGT | MyZoneTime',
    description: 'Time difference between New York and Singapore. Singapore (UTC+8) is 13 hours ahead of EST. Limited overlap for business hours — the morning in New York is late evening in Singapore.',
    h1:          'Time Difference Between New York and Singapore',
    canonical:   SITE + '/time-difference/new-york-singapore',
  },
  '/time-difference/oslo-london': {
    title:       'Time Difference: Oslo vs London — CET/GMT | MyZoneTime',
    description: 'Time difference between Oslo, Norway (CET/CEST) and London. Oslo is 1 hour ahead of London in winter (GMT) and 1 hour ahead during summer (both on BST/CEST). Great meeting overlap.',
    h1:          'Time Difference Between Oslo and London',
    canonical:   SITE + '/time-difference/oslo-london',
  },
  '/time-difference/abu-dhabi-london': {
    title:       'Time Difference: Abu Dhabi vs London — GST/GMT | MyZoneTime',
    description: 'Time difference between Abu Dhabi (GST, UTC+4) and London. Abu Dhabi is 3 hours ahead in summer (BST) and 4 hours ahead in winter (GMT). Live clocks and meeting overlap tool.',
    h1:          'Time Difference Between Abu Dhabi and London',
    canonical:   SITE + '/time-difference/abu-dhabi-london',
  },

  // ── Blog / guides ────────────────────────────────────────────────────────────
  '/blog': {
    title:       'Time Zone Tips & Remote Work Guides | MyZoneTime Blog',
    description: 'Expert guides on scheduling across time zones, remote team management, Hijri calendar dates, and international meeting planning. Free resources from MyZoneTime.',
    h1:          'Time Zone Tips & Remote Work Guides',
    canonical:   SITE + '/blog',
  },
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
    // Server-side JSON-LD injection (critical for Googlebot, AEO, AI crawlers)
    buildJsonLd(pathname),
  ].filter(Boolean).join('\n    ');

  html = html.replace('<!-- SSR meta tags injected by server/index.js go here -->', metaTags);

  var h1Html = meta.h1
    ? '<h1 style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">' + meta.h1 + '</h1>'
    : '';
  html = html.replace('<!-- SSR_H1_INJECT -->', h1Html);

  return html;
}

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
// Canonical time-difference: redirect reversed pairs to canonical
app.get('/time-difference/london-new-york',    function(req, res) { res.redirect(301, '/time-difference/new-york-london'); });
app.get('/time-difference/new-york-london',    function(req, res, next) { next(); });

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
