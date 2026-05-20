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
    return res.redirect(301, 'https://' + req.headers.host.replace(/^www\./,'') + req.url);
  }
  next();
});

// ── Rate limiter ─────────────────────────────────────────────────────────────
var rateMap = {};
app.use(function(req, res, next) {
  var ip = req.ip || 'unknown', now = Date.now();
  if (!rateMap[ip]) rateMap[ip] = [];
  rateMap[ip] = rateMap[ip].filter(function(t){ return now - t < 60000; });
  rateMap[ip].push(now);
  if (rateMap[ip].length > 300) return res.status(429).json({ error:'Too many requests.' });
  next();
});
setInterval(function(){
  var c = Date.now() - 60000;
  Object.keys(rateMap).forEach(function(ip){
    rateMap[ip] = (rateMap[ip]||[]).filter(function(t){ return t > c; });
    if (!rateMap[ip].length) delete rateMap[ip];
  });
}, 300000);

// ── Static — hashed assets, 1 year ──────────────────────────────────────────
app.use('/assets', express.static(path.join(DIST,'assets'), { maxAge:'1y', immutable:true, etag:true }));

// ── Static — public root files, 1 hour ──────────────────────────────────────
app.use(express.static(DIST, {
  maxAge:'1h', index:false, etag:true,
  setHeaders: function(res, fp){
    // Explicit Content-Type — prevents browsers treating XML as plain text
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

// ── SSR: site constant & OG image ────────────────────────────────────────────
var SITE = 'https://myzonetime.com';
var OG   = SITE + '/og-image.jpg';

// ── SSR: GEO meta per city route ─────────────────────────────────────────────
var geoMeta = {
  '/dubai':     { region:'AE-DU',  placename:'Dubai, United Arab Emirates',      pos:'25.2048;55.2708',    icbm:'25.2048, 55.2708' },
  '/london':    { region:'GB-ENG', placename:'London, United Kingdom',           pos:'51.5074;-0.1278',    icbm:'51.5074, -0.1278' },
  '/new-york':  { region:'US-NY',  placename:'New York, United States',          pos:'40.7128;-74.0060',   icbm:'40.7128, -74.0060' },
  '/tokyo':     { region:'JP-13',  placename:'Tokyo, Japan',                     pos:'35.6762;139.6503',   icbm:'35.6762, 139.6503' },
  '/singapore': { region:'SG',     placename:'Singapore',                        pos:'1.3521;103.8198',    icbm:'1.3521, 103.8198' },
  '/sydney':    { region:'AU-NSW', placename:'Sydney, Australia',                pos:'-33.8688;151.2093',  icbm:'-33.8688, 151.2093' },
  '/riyadh':    { region:'SA-01',  placename:'Riyadh, Saudi Arabia',             pos:'24.7136;46.6753',    icbm:'24.7136, 46.6753' },
  '/abu-dhabi': { region:'AE-AZ',  placename:'Abu Dhabi, United Arab Emirates',  pos:'24.4539;54.3773',    icbm:'24.4539, 54.3773' },
};

// ── SSR: route → meta map ────────────────────────────────────────────────────
var routeMeta = {
  '/': {
    title:'World Clock & Time Zone Converter — Live Time in 500+ Cities | MyZoneTime',
    description:'Check the exact local time in 500+ cities worldwide. Free world clock, time zone converter, meeting planner, and live weather for Dubai, London, New York, Tokyo and more.',
    canonical: SITE+'/',
  },
  '/world-clock': {
    title:'World Clock — Live Time in 500+ Cities | MyZoneTime',
    description:'Live world clock showing current time in 500+ cities. Track time zones for Dubai, London, New York, Tokyo, Singapore, Sydney, and more.',
    canonical: SITE+'/world-clock',
  },
  '/timezone-converter': {
    title:'Time Zone Converter — Compare Times Between Any Two Cities | MyZoneTime',
    description:'Free time zone converter. Compare the exact time between any two cities instantly. Perfect for scheduling meetings and coordinating across time zones.',
    canonical: SITE+'/timezone-converter',
  },
  '/meeting-planner': {
    title:'Meeting Planner — Find Best Time Across Time Zones | MyZoneTime',
    description:'Find the best time to schedule meetings across multiple time zones. See overlapping work hours for your team in real-time.',
    canonical: SITE+'/meeting-planner',
  },
  '/hijri-calendar': {
    title:'Islamic / Hijri Date Today — Hijri Calendar Converter | MyZoneTime',
    description:"Check today's Islamic (Hijri) date. Free Hijri calendar converter with Gregorian comparison. Perfect for Muslims and GCC region users.",
    canonical: SITE+'/hijri-calendar',
  },
  '/stopwatch': {
    title:'Online Stopwatch — Free Precision Timer | MyZoneTime',
    description:'Free online stopwatch with lap timer. Precise millisecond accuracy. No download required.',
    canonical: SITE+'/stopwatch',
  },
  '/timer': {
    title:'Online Countdown Timer — Set Any Duration | MyZoneTime',
    description:'Free online countdown timer. Set hours, minutes and seconds. Audio alert when complete.',
    canonical: SITE+'/timer',
  },
  '/countdown': {
    title:'Event Countdown — Days Until Any Date | MyZoneTime',
    description:'Count down to any future event or date. Days, hours, minutes, seconds until your event.',
    canonical: SITE+'/countdown',
  },
  '/date-calculator': {
    title:'Date Calculator — Days Between Dates | MyZoneTime',
    description:'Calculate the number of days, weeks, or months between any two dates. Free online date difference calculator.',
    canonical: SITE+'/date-calculator',
  },
  '/work-hours-calculator': {
    title:'Work Hours Calculator — Timesheet & Payroll | MyZoneTime',
    description:'Calculate total work hours for any period. Perfect for timesheets, payroll, and billing. Free online work hours calculator.',
    canonical: SITE+'/work-hours-calculator',
  },
  '/time-difference-calculator': {
    title:'Time Difference Calculator — Hours Between Cities | MyZoneTime',
    description:'Calculate the exact time difference between any two cities or time zones. Accounts for daylight saving time automatically.',
    canonical: SITE+'/time-difference-calculator',
  },
  '/world-clock-widget': {
    title:'World Clock Widget — Embeddable Time Zone Widget | MyZoneTime',
    description:'Free embeddable world clock widget. Show live time in multiple cities with a simple HTML snippet.',
    canonical: SITE+'/world-clock-widget',
  },
  '/privacy-policy': {
    title:'Privacy Policy | MyZoneTime',
    description:'Read the MyZoneTime privacy policy. We are committed to protecting your data and your privacy.',
    canonical: SITE+'/privacy-policy',
  },
  '/terms-of-service': {
    title:'Terms of Service | MyZoneTime',
    description:'Terms and conditions for using MyZoneTime — your free world clock and time zone tools.',
    canonical: SITE+'/terms-of-service',
  },
  '/dubai':     { title:'Current Time in Dubai, United Arab Emirates — UTC+4 | MyZoneTime',      description:'Check the exact time in Dubai now. Live clock, timezone info (GST, UTC+4), weather, and best time to call Dubai.',          canonical: SITE+'/dubai' },
  '/london':    { title:'Current Time in London, United Kingdom — UTC+0/+1 | MyZoneTime',        description:'Check the exact time in London now. Live clock, timezone info (GMT/BST), weather, and best time to call London.',           canonical: SITE+'/london' },
  '/new-york':  { title:'Current Time in New York, United States — UTC-5/-4 | MyZoneTime',       description:'Check the exact time in New York now. Live clock, timezone info (EST/EDT), weather, and best time to call New York.',       canonical: SITE+'/new-york' },
  '/tokyo':     { title:'Current Time in Tokyo, Japan — UTC+9 | MyZoneTime',                     description:'Check the exact time in Tokyo now. Live clock, timezone info (JST, UTC+9), weather, and best time to call Tokyo.',          canonical: SITE+'/tokyo' },
  '/singapore': { title:'Current Time in Singapore — UTC+8 | MyZoneTime',                        description:'Check the exact time in Singapore now. Live clock, timezone info (SGT, UTC+8), weather, and best time to call Singapore.',  canonical: SITE+'/singapore' },
  '/sydney':    { title:'Current Time in Sydney, Australia — UTC+10/+11 | MyZoneTime',           description:'Check the exact time in Sydney now. Live clock, timezone info (AEST/AEDT), weather, and best time to call Sydney.',         canonical: SITE+'/sydney' },
  '/riyadh':    { title:'Current Time in Riyadh, Saudi Arabia — UTC+3 | MyZoneTime',             description:'Check the exact time in Riyadh now. Live clock, timezone info (AST, UTC+3), weather, and best time to call Riyadh.',        canonical: SITE+'/riyadh' },
  '/abu-dhabi': { title:'Current Time in Abu Dhabi, United Arab Emirates — UTC+4 | MyZoneTime',  description:'Check the exact time in Abu Dhabi now. Live clock, timezone info (GST, UTC+4), weather, and best time to call Abu Dhabi.', canonical: SITE+'/abu-dhabi' },
};

// ── SSR: meta tag builder ─────────────────────────────────────────────────────
function injectMeta(html, meta, pathname) {
  var geo = geoMeta[pathname] || null;

  var tags = [
    '<title>'+meta.title+'</title>',
    '<meta name="description" content="'+meta.description+'">',
    '<meta name="author" content="MyZoneTime">',
    '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">',
    '<link rel="canonical" href="'+meta.canonical+'">',
    // GEO meta — only for city pages
    geo ? '<meta name="geo.region" content="'+geo.region+'">' : '',
    geo ? '<meta name="geo.placename" content="'+geo.placename+'">' : '',
    geo ? '<meta name="geo.position" content="'+geo.pos+'">' : '',
    geo ? '<meta name="ICBM" content="'+geo.icbm+'">' : '',
    // Open Graph
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="MyZoneTime">',
    '<meta property="og:locale" content="en_US">',
    '<meta property="og:url" content="'+meta.canonical+'">',
    '<meta property="og:title" content="'+meta.title+'">',
    '<meta property="og:description" content="'+meta.description+'">',
    '<meta property="og:image" content="'+OG+'">',
    '<meta property="og:image:type" content="image/jpeg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="MyZoneTime — World Clock &amp; Time Zone Tools">',
    // Twitter Card
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:site" content="@myzonetime">',
    '<meta name="twitter:creator" content="@myzonetime">',
    '<meta name="twitter:title" content="'+meta.title+'">',
    '<meta name="twitter:description" content="'+meta.description+'">',
    '<meta name="twitter:image" content="'+OG+'">',
    '<meta name="twitter:image:alt" content="MyZoneTime — World Clock">',
  ].filter(Boolean).join('\n    ');

  return html.replace('<!-- SSR meta tags injected by server/index.js go here -->', tags);
}

// ── Load index.html at startup ────────────────────────────────────────────────
var indexTemplate = '';
try {
  indexTemplate = fs.readFileSync(path.join(DIST,'index.html'), 'utf-8');
  console.log('✅ index.html loaded (' + indexTemplate.length + ' bytes)');
} catch(e) {
  console.error('⚠️  dist/index.html missing — run: npm run build\n   Looking in: ' + DIST);
}

// ── Permanent redirects ───────────────────────────────────────────────────────
app.get('/converter',    function(req,res){ res.redirect(301,'/timezone-converter'); });
app.get('/newyork',      function(req,res){ res.redirect(301,'/new-york'); });
app.get('/abudhabi',     function(req,res){ res.redirect(301,'/abu-dhabi'); });
app.get('/world_clock',  function(req,res){ res.redirect(301,'/world-clock'); });

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', function(req,res){
  res.json({ status:'ok', uptime:process.uptime(), env:process.env.NODE_ENV||'dev', distReady:!!indexTemplate, dist:DIST, ts:new Date().toISOString() });
});

// ── SPA fallback — SSR meta injected per route ────────────────────────────────
app.get('*', function(req, res) {
  if (!indexTemplate) {
    return res.status(503).send('<h1>Building...</h1><p>Please refresh in 30 seconds.</p>');
  }
  var pathname = req.path.replace(/\/+$/,'') || '/';
  var meta = routeMeta[pathname] || {
    title:       'MyZoneTime — World Clock & Time Zone Tools',
    description: 'Free world clock, time zone converter, meeting planner, and more. Track time in 500+ cities worldwide.',
    canonical:   SITE + pathname,
  };
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=300, stale-while-revalidate=3600');
  res.status(200).send(injectMeta(indexTemplate, meta, pathname));
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(function(err, req, res, next) {
  console.error('[Error]', err.message);
  res.status(500).json({ error:'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', function() {
  console.log('✅ MyZoneTime → http://0.0.0.0:' + PORT);
  console.log('   NODE_ENV : ' + (process.env.NODE_ENV||'development'));
  console.log('   Dist     : ' + DIST);
});
