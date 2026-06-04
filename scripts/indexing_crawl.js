const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'apps', 'web', 'public');
const SRC = path.join(ROOT, 'apps', 'web', 'src');
const SERVER = path.join(ROOT, 'server.js');

function readSitemap(p) {
  if (!fs.existsSync(p)) return [];
  const xml = fs.readFileSync(p, 'utf8');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
  return locs;
}

function sitemapPaths() {
  // prefer dist sitemap if exists
  const distSitemap = path.join(ROOT, 'apps', 'web', 'dist', 'sitemap.xml');
  const publicSitemap = path.join(PUBLIC, 'sitemap.xml');
  const chosen = fs.existsSync(distSitemap) ? distSitemap : publicSitemap;
  return readSitemap(chosen).map(u => {
    try { return new URL(u).pathname.replace(/\/$/, '') || '/'; } catch { return u; }
  });
}

function grepInternalLinks() {
  const files = walkSync(SRC).filter(f => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.html'));
  const hrefs = new Set();
  const hrefRe = /href=["'](\/[^"'#? ]+)/g;
  const toRe = /(?:to|href)=["'](\/[^"'#? ]+)/g;
  const routeRe = /<Route\s+path=["'](\/[^"']*)["']/g;
  const navigateRe = /navigate\((?:'|\")([^'\"#? ]+)(?:'|\")/g;
  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf8');
    for (const m of txt.matchAll(hrefRe)) {
      let p = m[1].replace(/\/$/, '') || '/';
      hrefs.add(p);
    }
    for (const m of txt.matchAll(toRe)) {
      let p = m[1].replace(/\/$/, '') || '/';
      hrefs.add(p);
    }
    for (const m of txt.matchAll(routeRe)) {
      let p = m[1].replace(/\/$/, '') || '/';
      hrefs.add(p);
    }
    for (const m of txt.matchAll(navigateRe)) {
      let p = m[1];
      if (p.startsWith('/')) { p = p.replace(/\/$/, '') || '/'; hrefs.add(p); }
    }
  }
  return Array.from(hrefs).sort();
}

function walkSync(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat && stat.isDirectory()) results = results.concat(walkSync(fp));
    else results.push(fp);
  }
  return results;
}

function parseServerMeta() {
  const txt = fs.readFileSync(SERVER, 'utf8');
  const metaBlock = txt.match(/const META = \{([\s\S]*?)\};/m);
  if (!metaBlock) return {};
  const body = metaBlock[1];
  // crude parse: find entries like "/path": { title: "...", description: "...", canonical: `...`, noindex: true }
  const entries = {};
  const routeRe = /\"?(?:'|\")?\/?([^"'\n]+)\"?:\s*\{([\s\S]*?)\n\s*\},?/g;
  for (const m of body.matchAll(routeRe)) {
    const keyRaw = m[1].trim();
    const route = keyRaw.startsWith('/') ? keyRaw : '/' + keyRaw;
    const obj = m[2];
    const titleM = obj.match(/title:\s*\"([^\"]+)\"/m) || obj.match(/title:\s*'([^']+)'/m);
    const descM = obj.match(/description:\s*\"([^\"]+)\"/m) || obj.match(/description:\s*'([^']+)'/m);
    const canonicalM = obj.match(/canonical:\s*`([^`]+)`/m) || obj.match(/canonical:\s*\"([^\"]+)\"/m);
    const noindexM = obj.match(/noindex:\s*(true|false)/m);
    entries[route.replace(/\/$/, '') || '/'] = {
      title: titleM ? titleM[1].trim() : null,
      description: descM ? descM[1].trim() : null,
      canonical: canonicalM ? canonicalM[1].trim() : null,
      noindex: noindexM ? (noindexM[1] === 'true') : false,
    };
  }
  return entries;
}

function parseSeoConfig() {
  const p = path.join(SRC, 'seo', 'seoConfig.js');
  if (!fs.existsSync(p)) return {};
  const txt = fs.readFileSync(p, 'utf8');
  const entries = {};
  const routeRe = /\"?(?:'|\")?\/?([^"'\n]+)\"?:\s*\{([\s\S]*?)\n\s*\},?/g;
  const bodyMatch = txt.match(/export default \{([\s\S]*?)\};/m);
  const body = bodyMatch ? bodyMatch[1] : txt;
  for (const m of body.matchAll(routeRe)) {
    const keyRaw = m[1].trim();
    const route = keyRaw.startsWith('/') ? keyRaw : '/' + keyRaw;
    const obj = m[2];
    const titleM = obj.match(/title:\s*\`([^\`]+)\`/m) || obj.match(/title:\s*\"([^\"]+)\"/m) || obj.match(/title:\s*'([^']+)'/m);
    const descM = obj.match(/description:\s*\`([^\`]+)\`/m) || obj.match(/description:\s*\"([^\"]+)\"/m) || obj.match(/description:\s*'([^']+)'/m);
    const canonicalM = obj.match(/canonical:\s*\`([^\`]+)\`/m) || obj.match(/canonical:\s*\"([^\"]+)\"/m);
    entries[route.replace(/\/$/, '') || '/'] = {
      title: titleM ? titleM[1].trim() : null,
      description: descM ? descM[1].trim() : null,
      canonical: canonicalM ? canonicalM[1].trim() : null,
    };
  }
  return entries;
}

function findDuplicates(map, key) {
  const rev = {};
  for (const [k, v] of Object.entries(map)) {
    const val = v && v[key] ? v[key] : null;
    if (!val) continue;
    rev[val] = rev[val] || [];
    rev[val].push(k);
  }
  const dups = Object.fromEntries(Object.entries(rev).filter(([_, a]) => a.length > 1));
  return dups;
}

(async function main(){
  const sitemap = sitemapPaths();
  const links = grepInternalLinks();
  const serverMeta = parseServerMeta();
  const seoConfig = parseSeoConfig();

  const results = { totalSitemap: sitemap.length, sitemap, internalLinksCount: links.length };

  // Orphan detection: sitemap pages not referenced by any internal link
  const linkedSet = new Set(links.map(p => p.replace(/\/$/, '') || '/'));
  const orphan = sitemap.filter(p => !linkedSet.has(p));

  // Recognize dynamic meta rules (same as server-side): time-difference pair and single-city slugs
  function hasDynamicMeta(route) {
    if (route.startsWith('/time-difference/')) return true;
    if (/^\/[a-z0-9\-]+$/.test(route)) return true;
    return false;
  }

  // Missing meta: sitemap pages not covered by serverMeta or seoConfig (consider dynamic server generation)
  const missingMeta = sitemap.filter(p => {
    const key = p.replace(/\/$/, '') || '/';
    if (serverMeta[key] || seoConfig[key]) return false;
    if (hasDynamicMeta(key)) return false; // server will generate meta at runtime
    return true;
  });

  // Duplicate titles/descriptions across serverMeta + seoConfig
  const combined = {};
  for (const s of sitemap) {
    const k = s.replace(/\/$/, '') || '/';
    combined[k] = Object.assign({}, seoConfig[k] || {}, serverMeta[k] || {});
  }
  const titleDups = findDuplicates(combined, 'title');
  const descDups = findDuplicates(combined, 'description');
  const canonicalDups = findDuplicates(combined, 'canonical');

  // Noindex pages detected in serverMeta
  const noindex = Object.entries(serverMeta).filter(([p, v]) => v.noindex).map(([p]) => p);

  // Count structured-data occurrences in built dist index.html
  const distIndex = path.join(ROOT, 'apps', 'web', 'dist', 'index.html');
  let ldCount = 0, canonicalCount = 0;
  if (fs.existsSync(distIndex)) {
    const html = fs.readFileSync(distIndex, 'utf8');
    ldCount = (html.match(/<script[^>]+type=['"]application\/ld\+json['"]/g) || []).length;
    canonicalCount = (html.match(/<link[^>]+rel=['"]canonical['"]/g) || []).length;
  }

  results.orphan = orphan;
  results.missingMeta = missingMeta;
  results.duplicateTitles = titleDups;
  results.duplicateDescriptions = descDups;
  results.duplicateCanonicals = canonicalDups;
  results.noindex = noindex;
  results.distLdCount = ldCount;
  results.distCanonicalCount = canonicalCount;

  const out = path.join(ROOT, 'scripts', 'indexing_crawl_report.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log('Indexing crawl completed. Report:', out);
})();
