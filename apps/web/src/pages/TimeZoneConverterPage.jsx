import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRightLeft, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { citiesData } from '@/data/citiesData.js';
import StructuredData from '@/components/StructuredData.jsx';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

/* ─── helpers ───────────────────────────────────────────────────────────────── */
function getCityById(id) {
  return citiesData.find(c => c.id === id) || citiesData[0];
}

function formatTime(tz, date) {
  try {
    return date.toLocaleTimeString('en-US', {
      timeZone: tz, hour12: true,
      hour: 'numeric', minute: '2-digit', second: '2-digit',
    });
  } catch { return '--:--'; }
}

function formatDate(tz, date) {
  try {
    return date.toLocaleDateString('en-US', {
      timeZone: tz, weekday: 'short', month: 'short', day: 'numeric',
    });
  } catch { return ''; }
}

function getUTCOffsetLabel(tz) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    return parts.find(p => p.type === 'timeZoneName')?.value || '';
  } catch { return ''; }
}

function getHoursDiff(tz1, tz2) {
  try {
    const now = new Date();
    const t1 = new Date(now.toLocaleString('en-US', { timeZone: tz1 }));
    const t2 = new Date(now.toLocaleString('en-US', { timeZone: tz2 }));
    return (t2 - t1) / 3_600_000;
  } catch { return 0; }
}

/* ─── CitySelect ─────────────────────────────────────────────────────────────── */
function CitySelect({ value, onChange, excludeId, label }) {
  const options = useMemo(
    () => citiesData.filter(c => c.id !== excludeId),
    [excludeId]
  );

  return (
    <div className="relative w-full">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 px-4 pr-8 rounded-xl border border-border/60 bg-background text-foreground text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 truncate"
        aria-label={label}
      >
        {options.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} — {c.country}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </div>
  );
}

/* ─── ConversionTable ─────────────────────────────────────────────────────────── */
function ConversionTable({ tz1, tz2, city1Name, city2Name }) {
  const rows = useMemo(() => {
    const result = [];
    for (let h = 0; h < 24; h += 3) {
      const d = new Date();
      d.setUTCHours(h, 0, 0, 0);
      const fmt = (tz) => new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true,
      }).format(d);
      result.push({ utc: `${String(h).padStart(2,'0')}:00`, t1: fmt(tz1), t2: fmt(tz2) });
    }
    return result;
  }, [tz1, tz2]);

  return (
    <div className="overflow-x-auto rounded-xl border border-border/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 text-left">
            <th className="px-4 py-3 font-semibold text-muted-foreground">UTC</th>
            <th className="px-4 py-3 font-semibold text-primary truncate max-w-[120px]">{city1Name}</th>
            <th className="px-4 py-3 font-semibold text-secondary truncate max-w-[120px]">{city2Name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.utc} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
              <td className="px-4 py-2.5 text-muted-foreground font-mono">{row.utc}</td>
              <td className="px-4 py-2.5 font-mono text-primary">{row.t1}</td>
              <td className="px-4 py-2.5 font-mono text-secondary">{row.t2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

const TZ_CONVERTER_FAQS = [
  { question: 'How do I convert time between two time zones?', answer: 'Enter your source city and destination city in the converter, then select the time you want to convert. The converter shows the exact equivalent time in the destination city, automatically accounting for UTC offsets and daylight saving time rules.' },
  { question: 'Why does the time conversion differ in summer vs winter?', answer: 'Many countries observe daylight saving time (DST), advancing their clocks by one hour in summer and returning to standard time in winter. When two cities have different DST schedules — or one observes DST and the other does not — the time difference between them changes seasonally. For example, the gap between London and Dubai is 4 hours in winter and 3 hours in summer.' },
  { question: 'What does UTC+0 mean?', answer: 'UTC+0 means a time zone that is exactly aligned with Coordinated Universal Time — zero hours ahead or behind. London in winter (GMT) and Reykjavik (year-round) use UTC+0. It serves as the reference point from which all other time zones are calculated.' },
  { question: 'What is the time difference between IST and EST?', answer: 'India Standard Time (IST, UTC+5:30) is 10 hours 30 minutes ahead of US Eastern Standard Time (EST, UTC-5) in winter, and 9 hours 30 minutes ahead during Eastern Daylight Time (EDT, UTC-4) in summer. Since India does not observe DST, any change in the offset is caused entirely by the US clock change.' },
  { question: 'What is the time difference between GST (Dubai) and GMT (London)?', answer: 'Dubai (Gulf Standard Time, GST, UTC+4) is 4 hours ahead of London in winter (GMT, UTC+0) and 3 hours ahead in summer (BST, UTC+1). GST does not change — the seasonal variation is entirely due to London switching between GMT and BST.' },
];
export default function TimeZoneConverterPage() {
  const [fromId, setFromId] = useState('nyc');
  const [toId, setToId]     = useState('lon');
  const [now, setNow]       = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fromCity = getCityById(fromId);
  const toCity   = getCityById(toId);
  const diff     = getHoursDiff(fromCity.timezone, toCity.timezone);
  const absD     = Math.abs(diff);
  const h        = Math.floor(absD);
  const m        = Math.round((absD - h) * 60);
  const diffStr  = diff === 0 ? 'Same time'
    : `${h}${m > 0 ? `h ${m}m` : 'h'} ${diff > 0 ? 'ahead' : 'behind'}`;

  const fromOffset = getUTCOffsetLabel(fromCity.timezone);
  const toOffset   = getUTCOffsetLabel(toCity.timezone);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch { toast.error('Could not copy link.'); }
  };

  const swap = () => { setFromId(toId); setToId(fromId); };

  const schema = {
    '@type': 'WebApplication',
    name: 'Time Zone Converter — MyZoneTime',
    url: 'https://myzonetime.com/timezone-converter',
    description: 'Convert time between any two cities instantly. DST-aware. 500+ cities.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Time Zone Converter', item: 'https://myzonetime.com/timezone-converter' },
    ],
  };

  const pageTitle = `Time Zone Converter — Convert ${fromCity.name} to ${toCity.name} Time | MyZoneTime`;
  const pageDesc  = `Free time zone converter. Currently: ${fromCity.name} (${fromOffset}) is ${diffStr} ${toCity.name} (${toOffset}). DST-aware, 500+ cities. No signup needed.`;

  return (
    <main className="flex-1 w-full" id="main-content">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content="https://myzonetime.com/timezone-converter" />
        <meta property="og:type"        content="website" />
        <meta property="og:image"       content="https://myzonetime.com/og-image.svg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <CanonicalTag pathname="/timezone-converter" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumb} />

      <div className="container max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2">
            <Clock className="w-3.5 h-3.5" /> Live · DST-Aware · 500+ Cities
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Time Zone Converter</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Compare live times between any two cities. Updates every second.
          </p>
        </div>

        {/* Converter Card */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-stretch gap-6">

            {/* From city */}
            <div className="flex-1 space-y-4 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">From</p>
              <CitySelect value={fromId} onChange={setFromId} excludeId={toId} label="Select source city" />
              <div className="text-center rounded-xl bg-background border border-border/40 p-6">
                <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-primary font-mono-time">
                  {formatTime(fromCity.timezone, now)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{formatDate(fromCity.timezone, now)}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">{fromOffset}</div>
              </div>
            </div>

            {/* Swap + diff */}
            <div className="flex md:flex-col items-center justify-center gap-3 py-2">
              <button
                onClick={swap}
                aria-label="Swap cities"
                className="p-3 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors text-secondary"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold bg-background border border-border/40 px-3 py-1.5 rounded-full whitespace-nowrap text-foreground shadow-sm">
                {diffStr}
              </span>
            </div>

            {/* To city */}
            <div className="flex-1 space-y-4 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">To</p>
              <CitySelect value={toId} onChange={setToId} excludeId={fromId} label="Select target city" />
              <div className="text-center rounded-xl bg-background border border-border/40 p-6">
                <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-secondary font-mono-time">
                  {formatTime(toCity.timezone, now)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{formatDate(toCity.timezone, now)}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">{toOffset}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={handleShare} variant="outline" size="sm" className="gap-2 rounded-full px-6">
              <Share2 className="w-4 h-4" />
              Share this conversion
            </Button>
          </div>
        </div>

        {/* Ad */}
        <div className="mt-6">
          <AdSenseAd slot={AD_SLOTS?.CONVERTER_BANNER || 'converter'} format="banner" minHeight={90} />
        </div>

        {/* Conversion table */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">
            {fromCity.name} ↔ {toCity.name} — 24-Hour Conversion Table
          </h2>
          <ConversionTable tz1={fromCity.timezone} tz2={toCity.timezone} city1Name={fromCity.name} city2Name={toCity.name} />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[
            { label: 'From', city: fromCity, offset: fromOffset },
            { label: 'To',   city: toCity,   offset: toOffset },
          ].map(({ label, city, offset }) => (
            <div key={label} className="rounded-xl border border-border/40 bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="font-semibold text-sm truncate">{city.name}, {city.country}</p>
              <p className="text-xs text-muted-foreground font-mono">{city.timezone} · {offset}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-10 space-y-3">
          <h2 className="text-lg font-semibold">About Time Zone Conversion</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            {[
              {
                q: 'What is a time zone converter?',
                a: 'A time zone converter shows you the equivalent local time in any other city. It automatically accounts for UTC offsets and Daylight Saving Time (DST) transitions.',
              },
              {
                q: 'Does this converter account for daylight saving time?',
                a: 'Yes. MyZoneTime uses the IANA timezone database which updates automatically for all DST changes worldwide — the same database used by your operating system.',
              },
              {
                q: 'How many cities are available?',
                a: 'Over 500 major cities across all continents. Use the dropdown to find any city or country.',
              },
              {
                q: `What is the time difference between ${fromCity.name} and ${toCity.name}?`,
                a: `Currently, ${toCity.name} is ${diffStr} ${fromCity.name}. This reflects the live DST-adjusted difference right now.`,
              },
            ].map((item, i) => (
              <details key={i} className="rounded-xl border border-border/40 p-4 group">
                <summary className="font-medium text-foreground cursor-pointer list-none flex justify-between items-center">
                  {item.q}
                  <span className="ml-2 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
                </summary>
                <p className="mt-2">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
