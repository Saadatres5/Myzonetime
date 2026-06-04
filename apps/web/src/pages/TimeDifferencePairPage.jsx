/**
 * TimeDifferencePairPage.jsx
 * ──────────────────────────
 * Dynamic city-pair page: /time-difference/:city1-:city2
 *
 * Examples:
 *   /time-difference/new-york-london
 *   /time-difference/dubai-london
 *   /time-difference/sydney-new-york
 *
 * Purpose (SEO):
 *   Each URL is a unique, indexable page targeting a specific long-tail
 *   query like "time difference new york london" — low competition,
 *   high purchase/schedule intent. These pages unlock hundreds of
 *   city-pair keyword targets from a single component.
 *
 * Purpose (AEO):
 *   Structured content with FAQPage + BreadcrumbList schema, a
 *   direct TL;DR answer paragraph, and DST-aware facts make this
 *   ideal for AI answer engine citation.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRightLeft, Clock, Globe, CalendarDays, Users } from 'lucide-react';
import { citiesData } from '@/data/worldCitiesData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';

// ── City slug → citiesData lookup map ────────────────────────────────────────
const SLUG_TO_ID = {
  'new-york':         'nyc',
  'london':           'lon',
  'dubai':            'dxb',
  'singapore':        'sin',
  'sydney':           'syd',
  'tokyo':            'tyo',
  'riyadh':           'ruh',
  'abu-dhabi':        'auh',
  'oslo':             'osl',
  'paris':            'par',
  'istanbul':         'ist',
  'bangkok':          'bkk',
  'kuala-lumpur':     'kul',
  'hong-kong':        'hkg',
  'mumbai':           'bom',
  'toronto':          'yyz',
  'los-angeles':      'lax',
  'chicago':          'chi2',
  'amsterdam':        'ams',
  'berlin':           'ber',
  'doha':             'doh',
  'cairo':            'cai',
  'nairobi':          'nai',
  'johannesburg':     'jnb',
  'auckland':         'akl',
  'delhi':            'del',
  'karachi':          'khi',
  'lahore':           'lhe',
  'rome':             'rom',
  'madrid':           'mad',
  'beijing':          'bej',
  'seoul':            'sel',
  'muscat':           'mct',
  'kuwait-city':      'kwi',
  'moscow':           'mow',
  'frankfurt':        'fra',
  'zurich':           'zur',
  'brussels':         'bru',
  'vienna':           'vie',
  'warsaw':           'waw',
  'athens':           'ath',
  'stockholm':        'sto',
  'copenhagen':       'cph',
  'helsinki':         'hel',
  'lisbon':           'lis',
  'dublin':           'dub',
  'melbourne':        'mel',
  'brisbane':         'bne',
  'perth':            'per',
  'san-francisco':    'sfc',
  'seattle':          'sea',
  'miami':            'mia',
  'boston':           'bos',
  'washington-dc':    'wdc',
  'houston':          'hou',
  'dallas':           'dal',
  'denver':           'den',
  'las-vegas':        'las',
  'montreal':         'yul',
  'vancouver':        'yvr',
  'mexico-city':      'mex',
  'sao-paulo':        'sao',
  'buenos-aires':     'bue',
  'bogota':           'bog',
  'lima':             'lim',
  'santiago':         'scl',
  'lagos':            'lax2',
  'addis-ababa':      'add',
  'accra':            'acc',
  'casablanca':       'cas',
  'tunis':            'tun',
  'algiers':          'alg',
  'manila':           'mnl',
  'jakarta':          'jkt',
  'colombo':          'cmb',
  'dhaka':            'dac',
  'kathmandu':        'ktm',
  'tehran':           'thr',
  'baghdad':          'bgw',
  'amman':            'amm',
  'beirut':           'bey',
  'tel-aviv':         'tlv',
  'kyiv':             'kyi',
  'bucharest':        'buc',
  'budapest':         'bud',
  'prague':           'pra',
  'sofia':            'sof',
  'zagreb':           'zag',
  'tallinn':          'tal',
  'riga':             'rig',
  'vilnius':          'vil',
  'reykjavik':        'rey',
  'taipei':           'tpe',
  'osaka':            'osa',
};

// ── Canonical pair ordering ────────────────────────────────────────────────────
// Defines the "canonical" slug order for each pair.
// The lower-index slug in this array goes first.
const CANONICAL_ORDER = [
  'new-york','los-angeles','chicago','toronto',
  'london','oslo','paris','berlin','amsterdam',
  'dubai','abu-dhabi','riyadh','doha','istanbul','cairo',
  'mumbai','singapore','kuala-lumpur','bangkok','hong-kong','tokyo',
  'nairobi','johannesburg',
  'sydney','auckland',
];

function getCanonicalOrder(slug1, slug2) {
  const i1 = CANONICAL_ORDER.indexOf(slug1);
  const i2 = CANONICAL_ORDER.indexOf(slug2);
  if (i1 === -1 && i2 === -1) return [slug1, slug2];
  if (i1 === -1) return [slug2, slug1];
  if (i2 === -1) return [slug1, slug2];
  return i1 <= i2 ? [slug1, slug2] : [slug2, slug1];
}

// ── Time helpers ──────────────────────────────────────────────────────────────

function getLiveTime(timezone) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch { return '--:--:--'; }
}

function getUTCOffset(timezone) {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = fmt.formatToParts(new Date());
    const tz = parts.find(p => p.type === 'timeZoneName');
    return tz ? tz.value : '';
  } catch { return ''; }
}

function getTimezoneName(timezone) {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long',
    });
    const parts = fmt.formatToParts(new Date());
    const tz = parts.find(p => p.type === 'timeZoneName');
    return tz ? tz.value : timezone;
  } catch { return timezone; }
}

function getHoursDiff(tz1, tz2) {
  try {
    const now = new Date();
    const d1 = new Date(now.toLocaleString('en-US', { timeZone: tz1 }));
    const d2 = new Date(now.toLocaleString('en-US', { timeZone: tz2 }));
    return (d2 - d1) / 3600000; // hours
  } catch { return 0; }
}

function fmtDiff(diff) {
  const abs = Math.abs(diff);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  if (m === 0) return `${h} hour${h !== 1 ? 's' : ''}`;
  return `${h}h ${m}m`;
}

// ── Meeting overlap analysis ─────────────────────────────────────────────────

function getBestMeetingWindow(tz1, tz2) {
  const overlaps = [];
  for (let utcH = 0; utcH < 24; utcH++) {
    const d = new Date();
    d.setUTCHours(utcH, 0, 0, 0);
    const h1 = parseInt(
      new Intl.DateTimeFormat('en-US', { timeZone: tz1, hour: 'numeric', hour12: false }).format(d)
    ) % 24;
    const h2 = parseInt(
      new Intl.DateTimeFormat('en-US', { timeZone: tz2, hour: 'numeric', hour12: false }).format(d)
    ) % 24;
    if (h1 >= 9 && h1 < 17 && h2 >= 9 && h2 < 17) overlaps.push(utcH);
  }
  return overlaps;
}

function formatUTCHour(utcH, tz) {
  const d = new Date();
  d.setUTCHours(utcH, 0, 0, 0);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimeDifferencePairPage() {
  const { pair } = useParams(); // e.g. "new-york-and-london" or legacy "new-york-london"

  // Parse pair into two slugs
  // New canonical format: "city1-and-city2"
  // Legacy fallback: try all hyphen split points
  const [slug1, slug2] = useMemo(() => {
    if (!pair) return [null, null];

    // Try new canonical "-and-" separator first
    const andIdx = pair.indexOf('-and-');
    if (andIdx !== -1) {
      const s1 = pair.slice(0, andIdx);
      const s2 = pair.slice(andIdx + 5);
      if (SLUG_TO_ID[s1] && SLUG_TO_ID[s2]) return [s1, s2];
    }

    // Legacy fallback: try all hyphen cut points
    const parts = pair.split('-');
    for (let i = 1; i < parts.length; i++) {
      const s1 = parts.slice(0, i).join('-');
      const s2 = parts.slice(i).join('-');
      if (SLUG_TO_ID[s1] && SLUG_TO_ID[s2]) return [s1, s2];
    }
    return [null, null];
  }, [pair]);

  // Redirect legacy format to canonical -and- format
  const [canonical1, canonical2] = slug1 && slug2
    ? getCanonicalOrder(slug1, slug2)
    : [slug1, slug2];

  // Redirect legacy hyphen-only URLs to new -and- format
  const isLegacyFormat = slug1 && slug2 && pair && !pair.includes('-and-');
  if (isLegacyFormat) {
    return <Navigate to={`/time-difference/${canonical1}-and-${canonical2}`} replace />;
  }

  // Redirect reversed pairs to canonical
  const isReversed = slug1 && slug2 && canonical1 !== slug1;
  if (isReversed) {
    return <Navigate to={`/time-difference/${canonical1}-and-${canonical2}`} replace />;
  }

  const city1 = slug1 ? citiesData.find(c => c.id === SLUG_TO_ID[slug1]) : null;
  const city2 = slug2 ? citiesData.find(c => c.id === SLUG_TO_ID[slug2]) : null;

  // 404 if pair is not recognised
  if (!city1 || !city2) {
    return (
      <main className="flex-1 container mx-auto px-4 py-20 text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">City pair not found</h1>
        <p className="text-muted-foreground mb-8">
          We don't have a page for "{pair}" yet. Try the{' '}
          <Link to="/time-difference-calculator" className="text-primary underline">
            Time Difference Calculator
          </Link>{' '}
          to look up any two cities.
        </p>
        <Link to="/" className="text-primary underline">← Back to home</Link>
      </main>
    );
  }

  const [times, setTimes] = useState({ t1: getLiveTime(city1.timezone), t2: getLiveTime(city2.timezone) });
  const [diff, setDiff] = useState(getHoursDiff(city1.timezone, city2.timezone));
  const overlapHours = getBestMeetingWindow(city1.timezone, city2.timezone);

  useEffect(() => {
    const tick = () => {
      setTimes({ t1: getLiveTime(city1.timezone), t2: getLiveTime(city2.timezone) });
      setDiff(getHoursDiff(city1.timezone, city2.timezone));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [city1.timezone, city2.timezone]);

  const offset1 = getUTCOffset(city1.timezone);
  const offset2 = getUTCOffset(city2.timezone);
  const tzName1 = getTimezoneName(city1.timezone);
  const tzName2 = getTimezoneName(city2.timezone);
  const diffAbs = Math.abs(diff);
  const ahead = diff > 0 ? city2.name : city1.name;
  const behind = diff > 0 ? city1.name : city2.name;
  const canonicalUrl = `https://myzonetime.com/time-difference/${canonical1}-and-${canonical2}`;

  // ── Meta strings ──
  const pageTitle = `Time Difference: ${city1.name} vs ${city2.name} — ${offset1}/${offset2} | MyZoneTime`;
  const pageDesc = diff === 0
    ? `${city1.name} and ${city2.name} are in the same time zone (${offset1}). No time difference. Free live clock, meeting overlap, and scheduling tips.`
    : `${city2.name} is ${fmtDiff(diffAbs)} ${diff > 0 ? 'ahead of' : 'behind'} ${city1.name} right now. Live clocks, best meeting times, and DST-aware scheduling guide.`;

  // ── FAQ data ──
  const faqs = [
    {
      question: `What is the time difference between ${city1.name} and ${city2.name}?`,
      answer: diff === 0
        ? `${city1.name} and ${city2.name} are in the same time zone. Both use ${offset1}, so there is no time difference between them.`
        : `${city2.name} (${offset2}) is currently ${fmtDiff(diffAbs)} ${diff > 0 ? 'ahead of' : 'behind'} ${city1.name} (${offset1}). This difference can shift by 1 hour during daylight saving time transitions.`,
    },
    {
      question: `What is the best time to schedule a meeting between ${city1.name} and ${city2.name}?`,
      answer: overlapHours.length > 0
        ? `The best meeting window is ${formatUTCHour(overlapHours[0], city1.timezone)} in ${city1.name} / ${formatUTCHour(overlapHours[0], city2.timezone)} in ${city2.name}${overlapHours.length > 1 ? `, running until ${formatUTCHour(overlapHours[overlapHours.length - 1], city1.timezone)} / ${formatUTCHour(overlapHours[overlapHours.length - 1], city2.timezone)}` : ''}. These hours fall within standard business hours (9 AM–5 PM) for both cities.`
        : `There is no overlapping business hours window between ${city1.name} and ${city2.name}. The time difference of ${fmtDiff(diffAbs)} means that when one city is in business hours, the other is typically outside them. Consider early morning or late evening calls, or use asynchronous communication.`,
    },
    {
      question: `Is ${city1.name} ahead of or behind ${city2.name}?`,
      answer: diff === 0
        ? `${city1.name} and ${city2.name} are in the same time zone — neither is ahead or behind the other.`
        : `${ahead} is ${fmtDiff(diffAbs)} ahead of ${behind} right now.`,
    },
    {
      question: `What timezone does ${city1.name} use?`,
      answer: `${city1.name} uses the ${city1.timezone} timezone (${tzName1}), currently at ${offset1} UTC.`,
    },
    {
      question: `What timezone does ${city2.name} use?`,
      answer: `${city2.name} uses the ${city2.timezone} timezone (${tzName2}), currently at ${offset2} UTC.`,
    },
    {
      question: `Do ${city1.name} and ${city2.name} observe daylight saving time?`,
      answer: `Daylight saving time (DST) varies by city. If either city observes DST, the time difference between them will shift by 1 hour when their clocks change. Cities like Dubai, Singapore, Tokyo, and Riyadh do not observe DST. Use the live clock above to always see the current, accurate difference.`,
    },
  ];

  // ── Structured data ──
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Time Difference Calculator', item: 'https://myzonetime.com/time-difference-calculator' },
      { '@type': 'ListItem', position: 3, name: `${city1.name} vs ${city2.name}`, item: canonicalUrl },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>

      <CanonicalTag pathname={`/time-difference/${slug1}-${slug2}`} />
      <StructuredData schemas={[faqSchema]} breadcrumbSchema={breadcrumbSchema} />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <div className="space-y-8">

          {/* ── Breadcrumb ── */}
          <nav className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/time-difference-calculator" className="hover:text-primary transition-colors">Time Difference</Link>
            <span>/</span>
            <span className="text-foreground">{city1.name} vs {city2.name}</span>
          </nav>

          {/* ── Hero ── */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Time Difference: {city1.name} vs {city2.name}
            </h1>
            {/* TL;DR — the direct answer for AI extraction */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {diff === 0
                ? `${city1.name} and ${city2.name} are in the same time zone. No time difference.`
                : `${city2.name} is ${fmtDiff(diffAbs)} ${diff > 0 ? 'ahead of' : 'behind'} ${city1.name} right now.`
              }
            </p>
          </div>

          {/* ── Live Clocks ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { city: city1, time: times.t1, offset: offset1, tzName: tzName1 },
              { city: city2, time: times.t2, offset: offset2, tzName: tzName2 },
            ].map(({ city, time, offset, tzName }, i) => (
              <div key={i} className="premium-card p-6 text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{city.country}</div>
                <div className="text-2xl font-bold">{city.name}</div>
                <div className="text-4xl font-mono font-semibold text-primary tabular-nums">{time}</div>
                <div className="text-sm text-muted-foreground">{tzName}</div>
                <div className="inline-flex items-center gap-1 text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                  <Globe className="w-3 h-3" aria-hidden="true" /> {offset}
                </div>
              </div>
            ))}
          </div>

          {/* ── Difference banner ── */}
          <div className="premium-card p-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <ArrowRightLeft className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="text-lg font-semibold">
                {diff === 0
                  ? 'Same time zone — no difference'
                  : `${city2.name} is ${fmtDiff(diffAbs)} ${diff > 0 ? 'ahead of' : 'behind'} ${city1.name}`
                }
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {city1.name}: {offset1} · {city2.name}: {offset2}
            </p>
          </div>

          {/* ── Best meeting times ── */}
          <section aria-labelledby="meeting-window-heading" className="premium-card p-6 space-y-4">
            <h2 id="meeting-window-heading" className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" aria-hidden="true" />
              Best Meeting Times
            </h2>

            {overlapHours.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  These hours fall within business hours (9 AM–5 PM) for both cities simultaneously:
                </p>
                <div className="flex flex-wrap gap-2">
                  {overlapHours.map(h => (
                    <div key={h} className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-xl text-sm font-medium flex flex-col items-center min-w-[90px]">
                      <span className="text-xs text-muted-foreground mb-0.5">UTC {h}:00</span>
                      <span className="text-foreground/90">{city1.name}: {formatUTCHour(h, city1.timezone)}</span>
                      <span className="text-foreground/90">{city2.name}: {formatUTCHour(h, city2.timezone)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Use the <Link to={`/meeting-planner?cities=${SLUG_TO_ID[slug1]},${SLUG_TO_ID[slug2]}`} className="text-primary hover:underline">Meeting Planner</Link> for a full colour-coded grid including DST adjustments for any date.
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  There is no overlapping business hour window between {city1.name} and {city2.name}.
                </p>
                <p className="text-sm text-muted-foreground">
                  With a {fmtDiff(diffAbs)} time difference, when one city is in business hours the other is typically outside them. Recommend using asynchronous communication (email, recorded video) or scheduling at the edge of business hours in the city that adjusts better.
                </p>
                <Link to={`/meeting-planner?cities=${SLUG_TO_ID[slug1]},${SLUG_TO_ID[slug2]}`} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <CalendarDays className="w-4 h-4" aria-hidden="true" /> Open full meeting planner →
                </Link>
              </div>
            )}
          </section>

          {/* ── Context / supporting text ── */}
          <section aria-labelledby="context-heading" className="space-y-4 text-sm text-muted-foreground">
            <h2 id="context-heading" className="text-xl font-semibold text-foreground">
              About the {city1.name}–{city2.name} time difference
            </h2>
            <p>
              {city1.name} ({city1.country}) operates on the <strong className="text-foreground">{city1.timezone}</strong> timezone,
              currently at <strong className="text-foreground">{offset1}</strong>.{' '}
              {city2.name} ({city2.country}) operates on <strong className="text-foreground">{city2.timezone}</strong>,
              currently at <strong className="text-foreground">{offset2}</strong>.
            </p>
            {diff !== 0 && (
              <p>
                The current difference is <strong className="text-foreground">{fmtDiff(diffAbs)}</strong>, with{' '}
                <strong className="text-foreground">{ahead}</strong> being ahead.
                This difference may shift by 1 hour during daylight saving time transitions, since some cities
                observe DST and others do not.
              </p>
            )}
            <p>
              To check the time difference on a specific future date (important when DST transitions
              are approaching), use the{' '}
              <Link to="/timezone-converter" className="text-primary hover:underline">Time Zone Converter</Link>{' '}
              or the{' '}
              <Link to={`/meeting-planner?cities=${SLUG_TO_ID[slug1]},${SLUG_TO_ID[slug2]}`} className="text-primary hover:underline">Meeting Planner</Link>{' '}
              with the date selector.
            </p>
          </section>

          {/* ── Related pairs ── */}
          <section aria-labelledby="related-heading" className="space-y-3">
            <h2 id="related-heading" className="text-base font-semibold text-foreground">Related time differences</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                { a: 'new-york', b: 'london' },
                { a: 'dubai', b: 'london' },
                { a: 'dubai', b: 'new-york' },
                { a: 'london', b: 'singapore' },
                { a: 'sydney', b: 'london' },
                { a: 'oslo', b: 'london' },
                { a: 'istanbul', b: 'london' },
                { a: 'riyadh', b: 'london' },
              ]
                .filter(p => !(p.a === slug1 && p.b === slug2) && !(p.a === slug2 && p.b === slug1))
                .slice(0, 6)
                .map(p => {
                  const c1 = citiesData.find(c => c.id === SLUG_TO_ID[p.a]);
                  const c2 = citiesData.find(c => c.id === SLUG_TO_ID[p.b]);
                  if (!c1 || !c2) return null;
                  return (
                    <Link
                      key={`${p.a}-${p.b}`}
                      to={`/time-difference/${p.a}-${p.b}`}
                      className="px-3 py-1.5 rounded-full bg-muted border border-border/40 hover:bg-muted/70 hover:text-primary transition-colors"
                    >
                      {c1.name} ↔ {c2.name}
                    </Link>
                  );
                })}
              <Link
                to="/time-difference-calculator"
                className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
              >
                Compare any two cities →
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* ── FAQ section ── */}
      <FAQSection
        faqs={faqs}
        title={`${city1.name} vs ${city2.name} — Frequently Asked Questions`}
      />
    </>
  );
}
