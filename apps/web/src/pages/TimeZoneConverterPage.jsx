import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRightLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useWorldCitiesData } from '@/hooks/useWorldCitiesData.js';
import StructuredData from '@/components/StructuredData.jsx';
import CanonicalTag from '@/components/CanonicalTag.jsx';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function getCity(id) {
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

function offsetDiff(tz1, tz2) {
  try {
    const now = new Date();
    const t1 = new Date(now.toLocaleString('en-US', { timeZone: tz1 }));
    const t2 = new Date(now.toLocaleString('en-US', { timeZone: tz2 }));
    return (t2 - t1) / 3_600_000;
  } catch { return 0; }
}

/* ─── City Select ──────────────────────────────────────────────────────────── */
function CitySelect({ value, onChange, exclude }) {
  const options = useMemo(
    () => citiesData.filter(c => c.id !== exclude),
    [exclude]
  );
  const city = getCity(value);

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 px-4 pr-8 rounded-xl border border-border/60 bg-background text-foreground text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 truncate"
        aria-label="Select a city"
      >
        {options.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} — {c.country}
          </option>
        ))}
      </select>
      {/* chevron */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function TimeZoneConverterPage() {
  const { citiesData, loading } = useWorldCitiesData();
  const [id1, setId1] = useState('nyc');
  const [id2, setId2] = useState('lon');
  const [time, setTime]  = useState(new Date());

  if (loading) {
    return (
      <main className="flex-1 w-full bg-background text-foreground">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg font-medium">Loading time zone converter data…</p>
          <p className="text-sm text-muted-foreground mt-2">Preparing city list for instant conversion.</p>
        </div>
      </main>
    );
  }

  const getCity = (id) => (citiesData || []).find(c => c.id === id) || (citiesData?.[0] || { id: 'nyc', name: 'New York', country: 'United States', timezone: 'America/New_York' });
  const city1 = getCity(id1);
  const city2 = getCity(id2);

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const city1 = getCity(id1);
  const city2 = getCity(id2);
  const diff  = offsetDiff(city1.timezone, city2.timezone);
  const diffLabel =
    diff === 0  ? 'Same time'
    : diff > 0  ? `${Math.abs(diff)}h ahead`
    :             `${Math.abs(diff)}h behind`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Conversion link copied!');
    } catch { toast.error('Could not copy link.'); }
  };

  const swap = () => { setId1(id2); setId2(id1); };

  const schema = {
    '@type': 'WebApplication',
    name: 'Time Zone Converter',
    url: 'https://myzonetime.com/timezone-converter',
    description: 'Convert time between any two cities instantly. See the exact hour difference, DST-aware.',
    applicationCategory: 'UtilitiesApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',               item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Time Zone Converter', item: 'https://myzonetime.com/timezone-converter' },
    ],
  };

  return (
    <main className="flex-1 w-full" id="main-content">
      <Helmet>
        <title>Time Zone Converter — Compare Times Between Any Two Cities | MyZoneTime</title>
        <meta name="description" content="Free time zone converter. Compare the exact time between any two cities instantly. Perfect for scheduling meetings, calls, and coordinating across time zones." />
      </Helmet>
      <CanonicalTag pathname="/timezone-converter" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumb} />

      <div className="container max-w-4xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Time Zone Converter</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Compare times instantly across 500+ global cities.
          </p>
        </div>

        {/* ── Converter Card ── */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-stretch gap-6">

            {/* Left city */}
            <div className="flex-1 space-y-4 min-w-0">
              <CitySelect value={id1} onChange={setId1} exclude={id2} />
              <div className="text-center rounded-xl bg-background border border-border/40 p-6">
                <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-primary">
                  {formatTime(city1.timezone, time)}
                </div>
                <div className="text-xs text-muted-foreground mt-2 truncate">{city1.timezone}</div>
              </div>
            </div>

            {/* Middle swap button + diff */}
            <div className="flex md:flex-col items-center justify-center gap-3 py-2">
              <button
                onClick={swap}
                aria-label="Swap cities"
                className="p-3 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors text-secondary"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-semibold bg-background border border-border/40 px-3 py-1.5 rounded-full whitespace-nowrap text-foreground shadow-sm">
                {diffLabel}
              </span>
            </div>

            {/* Right city */}
            <div className="flex-1 space-y-4 min-w-0">
              <CitySelect value={id2} onChange={setId2} exclude={id1} />
              <div className="text-center rounded-xl bg-background border border-border/40 p-6">
                <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-secondary">
                  {formatTime(city2.timezone, time)}
                </div>
                <div className="text-xs text-muted-foreground mt-2 truncate">{city2.timezone}</div>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="gap-2 rounded-full px-6"
            >
              <Share2 className="w-4 h-4" />
              Share this conversion
            </Button>
          </div>
        </div>

        {/* ── Info grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[
            { label: 'From', value: `${city1.name}, ${city1.country}`, sub: city1.timezone },
            { label: 'To',   value: `${city2.name}, ${city2.country}`, sub: city2.timezone },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-xl border border-border/40 bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="font-semibold text-sm truncate">{value}</p>
              <p className="text-xs text-muted-foreground truncate">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── FAQ block for SEO/AEO ── */}
        <div className="mt-10 space-y-3">
          <h2 className="text-lg font-semibold">About Time Zone Conversion</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <details className="rounded-xl border border-border/40 p-4 group">
              <summary className="font-medium text-foreground cursor-pointer list-none flex justify-between items-center">
                What is a time zone converter?
                <span className="ml-2 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-2">A time zone converter shows you the equivalent local time in any other city or timezone. It automatically accounts for UTC offsets and Daylight Saving Time (DST) transitions.</p>
            </details>
            <details className="rounded-xl border border-border/40 p-4 group">
              <summary className="font-medium text-foreground cursor-pointer list-none flex justify-between items-center">
                Does this converter account for daylight saving time?
                <span className="ml-2 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-2">Yes. MyZoneTime uses the IANA timezone database (the same one used by your operating system) which updates automatically for all DST changes worldwide.</p>
            </details>
            <details className="rounded-xl border border-border/40 p-4 group">
              <summary className="font-medium text-foreground cursor-pointer list-none flex justify-between items-center">
                How many cities are available?
                <span className="ml-2 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-2">Over 500 cities across all continents. Use the dropdown to search by city or country name.</p>
            </details>
          </div>
        </div>

      </div>
    </main>
  );
}
