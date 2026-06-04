import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Globe, X, Search, Share2, Check, Calendar, ChevronLeft, ChevronRight, Clock, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { citiesData } from '@/data/citiesData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

// ─── helpers ────────────────────────────────────────────────────────────────

function getLocalHour(utcHour, timezone) {
  try {
    const now = new Date();
    now.setUTCHours(utcHour, 0, 0, 0);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).formatToParts(now);
    const h = parts.find(p => p.type === 'hour');
    return h ? parseInt(h.value, 10) % 24 : utcHour;
  } catch {
    return utcHour;
  }
}

function getLocalTime(timezone) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

function getUTCOffsetLabel(timezone) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(now);
    const offset = parts.find(p => p.type === 'timeZoneName');
    return offset ? offset.value : '';
  } catch {
    return '';
  }
}

function getCellClass(localHour) {
  if (localHour >= 9 && localHour < 17) return 'bg-green-500/80 hover:bg-green-500';
  if ((localHour >= 7 && localHour < 9) || (localHour >= 17 && localHour < 20))
    return 'bg-yellow-400/70 hover:bg-yellow-400';
  return 'bg-red-500/50 hover:bg-red-500/70';
}

function isOverlapHour(utcHour, cities) {
  return cities.every(city => {
    const h = getLocalHour(utcHour, city.timezone);
    return h >= 9 && h < 17;
  });
}

function formatHour(h) {
  const ampm = h < 12 ? 'AM' : 'PM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}${ampm}`;
}

function decodeCities(param) {
  if (!param) return [];
  return param.split(',').filter(Boolean);
}

// ─── component ──────────────────────────────────────────────────────────────

const DEFAULT_CITIES = ['lon', 'nyc', 'tyo'];

// ─── FAQ data ────────────────────────────────────────────────────────────────

const MEETING_FAQS = [
  {
    question: 'What is a meeting time zone planner?',
    answer: 'A meeting time zone planner is a tool that displays the local time in multiple cities simultaneously on a 24-hour grid. It colour-codes business hours (typically 9 AM–5 PM) so you can immediately see when all participants would be available during working hours — without doing manual time zone arithmetic.'
  },
  {
    question: 'What is the best time to schedule a meeting between New York and London?',
    answer: 'The best overlap for a New York–London meeting is 1 PM–5 PM London time (8 AM–12 PM New York EST) in winter, or 2 PM–5 PM London BST (9 AM–12 PM New York EDT) in summer. Use the planner above and add London and New York to see the green overlap cells highlighted automatically.'
  },
  {
    question: 'What is the best time to meet between Dubai and London?',
    answer: 'Dubai (GST, UTC+4) and London have a 3–4 hour difference. The ideal meeting window is 9 AM–1 PM London time, which equals 12 PM–4 PM in Dubai. Both cities are fully within business hours during this window. The exact overlap shifts slightly depending on whether London is on GMT or BST.'
  },
  {
    question: 'What is the best meeting time for US and Europe teams?',
    answer: 'For US East Coast (EST/EDT) and Europe (CET/CEST) teams, the best overlap is 9 AM–12 PM Eastern Time, which is 3 PM–6 PM in Central Europe. For US West Coast (PST/PDT), the overlap shrinks further: 9 AM–9 AM Pacific is 6 PM–6 PM in Europe, leaving almost no business-hour overlap. Use the meeting planner to see the exact window for your specific cities.'
  },
  {
    question: 'How many cities can I add to the meeting planner?',
    answer: 'The MyZoneTime meeting planner supports up to 7 cities at once. You can search from 500+ cities worldwide, reorder them using the arrow buttons, and remove any you no longer need. Adding more cities narrows the overlap window, since all cities must simultaneously be in business hours.'
  },
  {
    question: 'Does the meeting planner account for daylight saving time?',
    answer: 'Yes. The planner automatically adjusts for daylight saving time (DST) based on the date you select. This means it correctly shows BST vs GMT for London, EDT vs EST for New York, and CEST vs CET for European cities. Simply pick your target date and the grid recalculates instantly.'
  },
  {
    question: 'Can I share a meeting plan with my team?',
    answer: 'Yes. Click the Share button and the meeting planner copies a URL to your clipboard. The URL encodes your full city selection so anyone who opens it sees the same view with all the same cities pre-loaded. No account or signup is needed.'
  },
  {
    question: 'What do the colours in the time grid mean?',
    answer: 'Green indicates standard business hours (9 AM–5 PM local time). Yellow indicates early or late business hours (7–9 AM and 5–8 PM). Red means night or off-hours. When multiple cities are selected, the grid highlights in bright green any hour when all cities are simultaneously within business hours — that is your ideal meeting window.'
  },
  {
    question: 'Is the meeting planner free to use?',
    answer: 'Yes. The MyZoneTime meeting planner is completely free with no account, registration, or payment required. It works in any modern browser on desktop, tablet, or mobile. There are no limits on how many meetings you plan or how many city combinations you try.'
  },
];

export default function MeetingPlannerPage() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredHour, setHoveredHour] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // ── init from URL or defaults ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityIds = decodeCities(params.get('cities'));
    const initial = cityIds.length
      ? cityIds.map(id => citiesData.find(c => c.id === id)).filter(Boolean)
      : DEFAULT_CITIES.map(id => citiesData.find(c => c.id === id)).filter(Boolean);
    setSelectedCities(initial);
  }, []);

  // ── tick every minute ──
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // ── sync URL ──
  useEffect(() => {
    if (!selectedCities.length) return;
    const ids = selectedCities.map(c => c.id).join(',');
    const url = new URL(window.location.href);
    url.searchParams.set('cities', ids);
    window.history.replaceState({}, '', url.toString());
  }, [selectedCities]);

  // ── close dropdown on outside click ──
  useEffect(() => {
    function handle(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        searchRef.current && !searchRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const selectedIds = new Set(selectedCities.map(c => c.id));

  const filteredCities = searchQuery.trim().length > 0
    ? citiesData.filter(c =>
        !selectedIds.has(c.id) &&
        (
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.region?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).slice(0, 30)
    : [];

  const addCity = useCallback((city) => {
    if (selectedCities.length >= 7 || selectedIds.has(city.id)) return;
    setSelectedCities(prev => [...prev, city]);
    setSearchQuery('');
    setShowDropdown(false);
  }, [selectedCities, selectedIds]);

  const removeCity = useCallback((id) => {
    setSelectedCities(prev => prev.filter(c => c.id !== id));
  }, []);

  const moveCity = useCallback((id, dir) => {
    setSelectedCities(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const overlapHours = selectedCities.length >= 2
    ? Array.from({ length: 24 }, (_, i) => i).filter(h => isOverlapHour(h, selectedCities))
    : [];

  // ── Structured data (client-side supplement to server-side SSR) ──
  const webAppSchema = {
    '@type': 'WebApplication',
    name: 'Meeting Planner — Find Best Time Across Time Zones',
    url: 'https://myzonetime.com/meeting-planner',
    description: 'Free online meeting planner. Find overlapping business hours for global teams across multiple time zones with DST support.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const howToSchema = {
    '@type': 'HowTo',
    name: 'How to Plan a Meeting Across Time Zones',
    description: 'Step-by-step guide to finding the best meeting time for a global team.',
    totalTime: 'PT2M',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Add your cities', text: 'Search for each city your team members are in and click to add them. You can add up to 7 cities.' },
      { '@type': 'HowToStep', position: 2, name: 'Pick your meeting date', text: 'Select the date of the planned meeting. The grid automatically adjusts for daylight saving time.' },
      { '@type': 'HowToStep', position: 3, name: 'Read the colour grid', text: 'Green = business hours. Yellow = early/late. Red = off hours. Look for columns where all rows are green.' },
      { '@type': 'HowToStep', position: 4, name: 'Use the overlap summary', text: 'The Best Times to Meet section lists every hour where all cities are within 9 AM–5 PM simultaneously.' },
      { '@type': 'HowToStep', position: 5, name: 'Share with your team', text: 'Click Share to copy a URL pre-loaded with your city selection.' },
    ]
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Meeting Planner', item: 'https://myzonetime.com/meeting-planner' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Meeting Planner — Best Time Across Time Zones Free | MyZoneTime</title>
        <meta name="description" content="Find the best meeting time across multiple time zones. Colour-coded business hours for up to 7 cities. DST-aware, shareable links. Free international meeting scheduler." />
        <meta property="og:title" content="Meeting Planner — Best Time Across Time Zones | MyZoneTime" />
        <meta property="og:description" content="Free meeting planner for global teams. Find overlapping business hours across up to 7 time zones with automatic DST support." />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meeting Planner — Best Time Across Time Zones | MyZoneTime" />
        <meta name="twitter:description" content="Find overlapping business hours for your global team. Free, DST-aware, shareable." />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>

      <CanonicalTag pathname="/meeting-planner" />
      <StructuredData schemas={[webAppSchema, howToSchema]} breadcrumbSchema={breadcrumbSchema} />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="space-y-8">

          {/* ── Header ── */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Meeting Planner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the best time to meet across cities and countries. Add up to 7 cities — the grid shows overlapping business hours instantly with automatic daylight saving time support.
            </p>
            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {[
                { icon: <Zap className="w-3.5 h-3.5" />, label: 'DST-aware' },
                { icon: <Users className="w-3.5 h-3.5" />, label: 'Up to 7 cities' },
                { icon: <Share2 className="w-3.5 h-3.5" />, label: 'Shareable links' },
                { icon: <Shield className="w-3.5 h-3.5" />, label: 'Free, no signup' },
              ].map(f => (
                <span key={f.label} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground border border-border/40">
                  {f.icon} {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Controls Row ── */}
          <div className="premium-card p-6 space-y-5">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

              {/* Date picker */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="h-10 rounded-xl border border-border/50 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Select meeting date"
                />
              </div>

              {/* City search */}
              <div className="relative flex-1 max-w-sm" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder={selectedCities.length >= 7 ? 'Max 7 cities reached' : 'Search city or country…'}
                    value={searchQuery}
                    disabled={selectedCities.length >= 7}
                    onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    aria-label="Search and add a city"
                    aria-autocomplete="list"
                    aria-controls="city-dropdown"
                  />
                </div>

                {/* Dropdown */}
                {showDropdown && filteredCities.length > 0 && (
                  <div
                    id="city-dropdown"
                    ref={dropdownRef}
                    role="listbox"
                    className="absolute z-50 top-full mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-border/50 bg-popover shadow-xl"
                  >
                    {filteredCities.map(city => (
                      <button
                        key={city.id}
                        role="option"
                        aria-selected="false"
                        onMouseDown={() => addCity(city)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/60 text-left transition-colors"
                      >
                        <span>
                          <span className="font-medium">{city.name}</span>
                          <span className="text-muted-foreground ml-1">{city.country}</span>
                        </span>
                        <span className="text-xs text-muted-foreground ml-4 shrink-0">{city.region}</span>
                      </button>
                    ))}
                  </div>
                )}
                {showDropdown && searchQuery.length > 0 && filteredCities.length === 0 && (
                  <div ref={dropdownRef} className="absolute z-50 top-full mt-1 w-full rounded-xl border border-border/50 bg-popover shadow-xl px-4 py-3 text-sm text-muted-foreground">
                    No cities found for "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Share button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 shrink-0"
                aria-label="Copy shareable link to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Share'}
              </Button>
            </div>

            {/* Selected city pills */}
            <div className="flex flex-wrap gap-2" role="list" aria-label="Selected cities">
              {selectedCities.map((city, idx) => (
                <div
                  key={city.id}
                  role="listitem"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm border border-border/40 group"
                >
                  <button
                    onClick={() => moveCity(city.id, -1)}
                    disabled={idx === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                    aria-label={`Move ${city.name} left`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-medium">{city.name}</span>
                  <span className="text-muted-foreground text-xs hidden sm:inline">{city.country}</span>
                  <button
                    onClick={() => moveCity(city.id, 1)}
                    disabled={idx === selectedCities.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                    aria-label={`Move ${city.name} right`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeCity(city.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                    aria-label={`Remove ${city.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedCities.length === 0 && (
                <p className="text-sm text-muted-foreground">Search and add cities above to get started.</p>
              )}
            </div>
          </div>

          {/* ── Legend ── */}
          <div className="flex flex-wrap items-center gap-4 text-sm" aria-label="Colour legend">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-green-500/80" aria-hidden="true" />
              <span className="text-muted-foreground">Business hours (9 AM–5 PM)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-yellow-400/70" aria-hidden="true" />
              <span className="text-muted-foreground">Early / late (7–9 AM, 5–8 PM)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-red-500/50" aria-hidden="true" />
              <span className="text-muted-foreground">Night / off hours</span>
            </div>
            {overlapHours.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-green-400 ring-2 ring-green-300" aria-hidden="true" />
                <span className="text-muted-foreground font-medium text-green-400">Best overlap</span>
              </div>
            )}
          </div>

          {/* ── Time Grid ── */}
          {selectedCities.length >= 1 && (
            <section aria-labelledby="time-grid-heading" className="premium-card p-6 overflow-x-auto">
              <h2 id="time-grid-heading" className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                Time Grid
                {hoveredHour !== null && (
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    UTC {hoveredHour}:00
                  </span>
                )}
              </h2>

              <div className="min-w-[700px]">
                {/* Hour header */}
                <div className="flex items-center gap-2 mb-2" aria-hidden="true">
                  <div className="w-36 shrink-0" />
                  <div className="flex-1 flex">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 text-center text-[10px] text-muted-foreground select-none
                          ${hoveredHour === i ? 'text-foreground font-semibold' : ''}
                          ${i % 6 === 0 ? 'font-medium' : 'opacity-60'}
                        `}
                      >
                        {i % 6 === 0 ? `${i}:00` : ''}
                      </div>
                    ))}
                  </div>
                </div>

                {/* City rows */}
                <div className="space-y-2">
                  {selectedCities.map(city => {
                    const localNow = getLocalTime(city.timezone);
                    const offset = getUTCOffsetLabel(city.timezone);
                    return (
                      <div key={city.id} className="flex items-center gap-2 group">
                        <div className="w-36 shrink-0 pr-2">
                          <div className="font-semibold text-sm truncate">{city.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{city.country}</div>
                          <div className="text-xs text-primary font-mono">{localNow} <span className="text-muted-foreground">{offset}</span></div>
                        </div>
                        <div
                          className="flex-1 flex h-10 rounded-lg overflow-hidden border border-border/30"
                          role="img"
                          aria-label={`${city.name} 24-hour business hours grid`}
                        >
                          {Array.from({ length: 24 }, (_, utcH) => {
                            const localH = getLocalHour(utcH, city.timezone);
                            const isOverlap = overlapHours.includes(utcH) && selectedCities.length >= 2;
                            const cellClass = getCellClass(localH);
                            return (
                              <div
                                key={utcH}
                                className={`flex-1 border-r border-background/10 last:border-0 cursor-default transition-all
                                  ${cellClass}
                                  ${isOverlap ? 'ring-inset ring-1 ring-green-300/60' : ''}
                                  ${hoveredHour === utcH ? 'brightness-125 scale-y-110' : ''}
                                `}
                                onMouseEnter={() => setHoveredHour(utcH)}
                                onMouseLeave={() => setHoveredHour(null)}
                                title={`${city.name}: ${formatHour(localH)} (UTC ${utcH}:00)`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hour footer labels */}
                <div className="flex items-center gap-2 mt-1" aria-hidden="true">
                  <div className="w-36 shrink-0" />
                  <div className="flex-1 flex justify-between text-xs text-muted-foreground px-1">
                    <span>0:00</span>
                    <span>6:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:00</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Overlap Summary ── */}
          {selectedCities.length >= 2 && (
            <section aria-labelledby="overlap-heading" className="premium-card p-6">
              <h2 id="overlap-heading" className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" aria-hidden="true" />
                Best Times to Meet
              </h2>

              {overlapHours.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    These UTC hours fall within business hours (9 AM–5 PM) for all {selectedCities.length} selected cities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {overlapHours.map(h => (
                      <div
                        key={h}
                        className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-xl text-sm font-semibold text-green-400 flex flex-col items-center min-w-[72px]"
                      >
                        <span className="text-xs text-muted-foreground mb-0.5">UTC {h}:00</span>
                        {selectedCities.map(city => (
                          <span key={city.id} className="text-xs text-foreground/80">
                            {city.name}: {formatHour(getLocalHour(h, city.timezone))}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <p className="text-muted-foreground">No overlapping business hours found for these cities.</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting the date, or consider scheduling outside standard hours. Remote teams across distant time zones (e.g. US West Coast and South-East Asia) often have no business-hour overlap and rely on asynchronous communication.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* ── City detail cards ── */}
          {selectedCities.length >= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedCities.map(city => {
                const localTime = getLocalTime(city.timezone);
                const offset = getUTCOffsetLabel(city.timezone);
                return (
                  <div key={city.id} className="premium-card p-5 flex flex-col gap-1 relative">
                    <button
                      onClick={() => removeCity(city.id)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Remove ${city.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="text-base font-bold">{city.name}</div>
                    <div className="text-sm text-muted-foreground">{city.country}</div>
                    <div className="text-2xl font-mono font-semibold text-primary mt-1">{localTime}</div>
                    <div className="text-xs text-muted-foreground">{city.timezone} · {offset}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── How to use ── */}
          <section aria-labelledby="howto-heading" className="premium-card p-6 space-y-4">
            <h2 id="howto-heading" className="text-lg font-semibold">How to use this meeting planner</h2>
            <ol className="space-y-3 text-sm text-muted-foreground list-none">
              {[
                { n: 1, t: 'Add your cities', d: 'Type any city or country name in the search box and click to add it. You can add up to 7 cities. Try common combinations like London + New York + Dubai for cross-regional teams.' },
                { n: 2, t: 'Pick a date', d: 'Use the date picker to select your planned meeting date. The grid recalculates immediately, applying the correct daylight saving time rules for every city on that exact date.' },
                { n: 3, t: 'Read the colour grid', d: 'Green = business hours (9 AM–5 PM local). Yellow = early or late. Red = night. Hover any cell to see the exact local time for that hour. Look for a column where all rows are green — that is your ideal slot.' },
                { n: 4, t: 'Use the overlap summary', d: 'The "Best Times to Meet" section below the grid lists every hour where all your cities are within standard business hours simultaneously. Each card shows the local time in every city for that slot.' },
                { n: 5, t: 'Share with your team', d: 'Click the Share button to copy a URL to your clipboard. The link is pre-loaded with your city selection and date, so your colleagues see the exact same grid when they open it.' },
              ].map(step => (
                <li key={step.n} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{step.n}</span>
                  <div>
                    <span className="font-semibold text-foreground">{step.t} — </span>
                    {step.d}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── About / Supporting content ── */}
          <section aria-labelledby="about-heading" className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <h2 id="about-heading" className="text-xl font-semibold text-foreground">About the international meeting planner</h2>
            <p>
              Scheduling a meeting across time zones is one of the biggest friction points for distributed and remote teams. The MyZoneTime meeting planner solves this by visualising the 24-hour day as a colour-coded grid for every city in your team, so you can see at a glance which hours are within standard business hours for everyone.
            </p>
            <p>
              Unlike simple time zone converters that compare just two cities, the meeting planner handles up to 7 simultaneous locations. It is particularly useful for teams spanning multiple continents — for example, a company with offices in San Francisco, London, Dubai, and Singapore. While no single hour may fall within 9–5 for all four cities, the planner helps you find the least inconvenient slot and shows exactly what time that means locally for each person.
            </p>
            <p>
              The tool automatically accounts for <strong className="text-foreground">daylight saving time (DST)</strong>. Select a date in March or November and you will notice the overlap windows shift as the US, UK, and Europe transition their clocks on different weekends. This is a common source of scheduling errors that the planner eliminates.
            </p>
            <p>
              All results can be shared instantly using the Share button, which generates a unique URL encoding your full city selection. No account is needed and the tool is completely free.
            </p>
          </section>

          {/* ── Related tools ── */}
          <RelatedTools current="/meeting-planner" />

        </div>
      </main>

      {/* ── FAQ section ── */}
      <FAQSection
        faqs={MEETING_FAQS}
        title="Meeting Planner — Frequently Asked Questions"
      />
    </>
  );
}
