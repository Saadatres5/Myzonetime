/**
 * generate-sitemap.mjs
 * Builds public/sitemap.xml and public/robots.txt from the single source of
 * truth: the ROUTES list in prerender.mjs, plus dynamic data files.
 *
 * Run BEFORE `vite build` so sitemap.xml ships in dist/.
 * Wired into package.json as part of `npm run build:ssg`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://myzonetime.com';
const TODAY = new Date().toISOString().split('T')[0];

// ── Static, high-priority pages ──────────────────────────────────────────────
const STATIC_PAGES = [
  { url: '/',                            priority: '1.0', freq: 'daily' },
  { url: '/world-clock',                 priority: '0.9', freq: 'daily' },
  { url: '/timezone-converter',          priority: '0.9', freq: 'daily' },
  { url: '/meeting-planner',             priority: '0.8', freq: 'weekly' },
  { url: '/ai-meeting-planner',          priority: '0.8', freq: 'weekly' },
  { url: '/time-difference-calculator',  priority: '0.8', freq: 'weekly' },
  { url: '/time-calculator',             priority: '0.7', freq: 'monthly' },
  { url: '/work-hours-calculator',       priority: '0.7', freq: 'monthly' },
  { url: '/date-calculator',             priority: '0.7', freq: 'monthly' },
  { url: '/hijri-calendar',              priority: '0.8', freq: 'daily' },
  { url: '/india-time',                  priority: '0.7', freq: 'daily' },
  { url: '/sunrise-sunset',              priority: '0.7', freq: 'daily' },
  { url: '/week-number',                 priority: '0.7', freq: 'weekly' },
  { url: '/unix-time',                   priority: '0.6', freq: 'daily' },
  { url: '/stopwatch',                   priority: '0.6', freq: 'monthly' },
  { url: '/timer',                       priority: '0.6', freq: 'monthly' },
  { url: '/countdown',                   priority: '0.6', freq: 'monthly' },
  { url: '/time-management-tips',        priority: '0.5', freq: 'monthly' },
  { url: '/windows-time-settings',       priority: '0.5', freq: 'monthly' },
  { url: '/world-clock-widget',          priority: '0.5', freq: 'monthly' },
  { url: '/timezone',                    priority: '0.7', freq: 'weekly' },
  { url: '/about',                       priority: '0.4', freq: 'monthly' },
  { url: '/contact-us',                  priority: '0.4', freq: 'monthly' },
  { url: '/privacy-policy',              priority: '0.3', freq: 'yearly' },
  { url: '/terms-of-service',            priority: '0.3', freq: 'yearly' },
  { url: '/ar',                          priority: '0.8', freq: 'daily' },
  { url: '/hi',                          priority: '0.8', freq: 'daily' },
  { url: '/es',                          priority: '0.8', freq: 'daily' },
];

// ── Tier-1 hand-crafted city pages ───────────────────────────────────────────
const TIER1_CITIES = [
  'london', 'dubai', 'new-york', 'tokyo', 'singapore', 'sydney', 'riyadh',
  'abu-dhabi', 'istanbul', 'oslo', 'bangkok', 'paris', 'kuala-lumpur',
];

// ── Tier-2 dynamic city pages (from cityPageData.js) ────────────────────────
async function getCitySlugs() {
  const mod = await import('../src/data/cityPageData.js');
  return Object.keys(mod.CITY_SEO_DATA).filter(s => !TIER1_CITIES.includes(s));
}

// ── Timezone pages ───────────────────────────────────────────────────────────
const TZ_SLUGS = ['utc', 'gmt', 'est', 'edt', 'cst', 'pst', 'ist', 'gst', 'cet', 'eet', 'jst', 'aest', 'sgt', 'mst'];

// ── Time-difference pair pages (highest-traffic pairs) ──────────────────────
const TD_PAIRS = [
  'dubai-and-london', 'dubai-and-new-york', 'dubai-and-india', 'dubai-and-singapore',
  'london-and-new-york', 'london-and-dubai', 'new-york-and-london', 'tokyo-and-london',
  'singapore-and-london', 'istanbul-and-dubai', 'paris-and-dubai', 'sydney-and-dubai',
  'new-york-and-dubai', 'bangkok-and-london', 'kuala-lumpur-and-london', 'singapore-and-new-york',
];

function urlEntry({ url, priority, freq, lastmod = TODAY }) {
  return `  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  const citySlugs = await getCitySlugs();

  const entries = [
    ...STATIC_PAGES.map(urlEntry),
    ...TIER1_CITIES.map(slug => urlEntry({ url: `/${slug}`, priority: '0.8', freq: 'daily' })),
    ...citySlugs.map(slug => urlEntry({ url: `/${slug}`, priority: '0.7', freq: 'daily' })),
    ...TZ_SLUGS.map(tz => urlEntry({ url: `/timezone/${tz}`, priority: '0.6', freq: 'weekly' })),
    ...TD_PAIRS.map(pair => urlEntry({ url: `/time-difference/${pair}`, priority: '0.6', freq: 'weekly' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  const outPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf-8');
  console.log(`✅  sitemap.xml written — ${entries.length} URLs → ${outPath}`);

  // ── robots.txt ──────────────────────────────────────────────────────────
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
  const robotsPath = path.resolve(__dirname, '../public/robots.txt');
  fs.writeFileSync(robotsPath, robots, 'utf-8');
  console.log(`✅  robots.txt written → ${robotsPath}`);
}

generate().catch(err => {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
});
