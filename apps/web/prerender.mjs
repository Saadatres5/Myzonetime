/**
 * prerender.mjs
 * Generates static HTML files for all routes using React's renderToString.
 * Run after `vite build` with: node prerender.mjs
 *
 * Output: dist/ directory gets one index.html per route path.
 * The hosting server (Netlify/Vercel/GitHub Pages) serves these static files
 * to crawlers, while the client-side JS hydrates the app for users.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir   = path.resolve(__dirname, 'dist');
const template  = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Find the entry-server output file (filename has hash)
const serverAssetsDir = path.join(distDir, 'server', 'assets');
const serverEntry = fs.readdirSync(serverAssetsDir)
  .find(f => f.startsWith('entry-server') && f.endsWith('.js'));

if (!serverEntry) {
  console.error('❌  Could not find entry-server*.js in dist/server/assets/');
  process.exit(1);
}

// ── All routes to pre-render ─────────────────────────────────────────────────
// Static routes
const STATIC_ROUTES = [
  '/',
  '/world-clock',
  '/timezone-converter',
  '/stopwatch',
  '/timer',
  '/countdown',
  '/date-calculator',
  '/work-hours-calculator',
  '/meeting-planner',
  '/ai-meeting-planner',
  '/hijri-calendar',
  '/india-time',
  '/time-calculator',
  '/time-management-tips',
  '/windows-time-settings',
  '/time-difference-calculator',
  '/world-clock-widget',
  '/about',
  '/privacy-policy',
  '/terms-of-service',
  '/contact-us',
  '/timezone',
  // Tier-1 city pages
  '/london',
  '/dubai',
  '/new-york',
  '/tokyo',
  '/singapore',
  '/sydney',
  '/riyadh',
  '/abu-dhabi',
  '/istanbul',
  '/oslo',
  '/bangkok',
  '/paris',
  '/kuala-lumpur',
  // New competitive pages
  '/sunrise-sunset',
  '/week-number',
  '/unix-time',
  // Multilingual pages
  '/ar',
  '/hi',
  '/es',
];

// Dynamic city routes from cityPageData
const CITY_SLUGS = [
  'dubai', 'abu-dhabi', 'riyadh', 'doha', 'muscat', 'kuwait-city', 'tehran',
  'mumbai', 'delhi', 'karachi', 'lahore', 'dhaka', 'colombo', 'kathmandu',
  'singapore', 'tokyo', 'hong-kong', 'seoul', 'beijing', 'jakarta', 'manila',
  'london', 'paris', 'berlin', 'rome', 'madrid', 'amsterdam', 'istanbul', 'oslo', 'moscow',
  'zurich', 'vienna', 'stockholm', 'brussels', 'lisbon', 'athens', 'warsaw', 'prague', 'budapest',
  'new-york', 'los-angeles', 'chicago', 'toronto', 'vancouver', 'miami', 'mexico-city', 'bogota', 'lima',
  'sao-paulo', 'buenos-aires',
  'sydney', 'melbourne', 'perth', 'auckland',
  'cairo', 'nairobi', 'johannesburg', 'lagos', 'accra', 'addis-ababa', 'casablanca',
  'bangkok', 'kuala-lumpur',
];

// Dynamic timezone routes
const TZ_SLUGS = ['utc', 'gmt', 'est', 'edt', 'cst', 'pst', 'ist', 'gst', 'cet', 'eet', 'jst', 'aest', 'sgt', 'mst'];

// Time-difference pair routes (highest-traffic pairs)
const TD_PAIRS = [
  'dubai-and-london', 'dubai-and-new-york', 'dubai-and-india',
  'dubai-and-singapore', 'london-and-new-york', 'london-and-dubai',
  'new-york-and-london', 'tokyo-and-london', 'singapore-and-london',
  'istanbul-and-dubai', 'paris-and-dubai', 'sydney-and-dubai',
  'new-york-and-dubai', 'bangkok-and-london', 'kuala-lumpur-and-london',
  'tokyo-and-london', 'singapore-and-new-york',
];

const ALL_ROUTES = [
  ...STATIC_ROUTES,
  ...CITY_SLUGS.map(s => `/${s}`),
  ...TZ_SLUGS.map(s => `/timezone/${s}`),
  ...TD_PAIRS.map(s => `/time-difference/${s}`),
  // deduplicate
].filter((v, i, a) => a.indexOf(v) === i);

// ── Write static HTML for each route ─────────────────────────────────────────
async function prerender() {
  // Load the SSR build (filename is hashed by Vite)
  const { render } = await import(`./dist/server/assets/${serverEntry}`);

  let success = 0;
  let failed  = 0;

  for (const url of ALL_ROUTES) {
    try {
      const helmetContext = {};
      const { html, helmetContext: ctx } = await render(url, helmetContext);

      // Extract helmet tags
      const { helmet } = ctx;
      const headTags = helmet
        ? [
            helmet.title?.toString()       || '',
            helmet.meta?.toString()        || '',
            helmet.link?.toString()        || '',
            helmet.script?.toString()      || '',
          ].join('\n    ')
        : '';

      // Inject rendered HTML + head tags into template
      let page = template
        .replace('<!--app-head-->', headTags)
        .replace('<!--app-html-->', html);

      // Write to dist directory
      const filePath = url === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, url.slice(1), 'index.html');

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, page, 'utf-8');

      console.log(`✅  ${url}`);
      success++;
    } catch (err) {
      console.error(`❌  ${url} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📦  Pre-render complete: ${success} pages built, ${failed} failed.`);
}

prerender().catch(err => {
  console.error('Pre-render failed:', err);
  process.exit(1);
});
