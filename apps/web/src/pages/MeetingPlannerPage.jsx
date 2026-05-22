import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Globe, X, Search, Share2, Check, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { citiesData } from '@/data/citiesData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

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

function encodeCity(id) { return id; }
function decodeCities(param) {
  if (!param) return [];
  return param.split(',').filter(Boolean);
}

// ─── component ──────────────────────────────────────────────────────────────

const DEFAULT_CITIES = ['lon', 'nyc', 'tyo'];

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

  // Overlap hours
  const overlapHours = selectedCities.length >= 2
    ? Array.from({ length: 24 }, (_, i) => i).filter(h => isOverlapHour(h, selectedCities))
    : [];

  const schema = {
    "@type": "WebApplication",
    "name": "Meeting Planner",
    "description": "Find the perfect overlapping working hours across multiple time zones.",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Meeting Planner", "item": "https://myzonetime.com/meeting-planner" },
    ],
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
      <Helmet>
        <title>Meeting Planner — Find Best Time Across Time Zones | MyZoneTime</title>
        <meta name="description" content="Find the best time to schedule meetings across multiple time zones. Color-coded business hours, DST support, shareable link. Free meeting planner for remote teams." />
        <meta property="og:title" content="Meeting Planner | MyZoneTime" />
        <meta property="og:description" content="Schedule meetings across time zones. Find overlapping work hours for your distributed team instantly." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meeting Planner | MyZoneTime" />
        <meta name="twitter:description" content="Find the perfect overlapping working hours across multiple time zones." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>

      <CanonicalTag pathname="/meeting-planner" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="space-y-8">

        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Meeting Planner</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the best time to meet across cities and countries. Green = business hours (9 AM–5 PM).
          </p>
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
              />
            </div>

            {/* City search */}
            <div className="relative flex-1 max-w-sm" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder={selectedCities.length >= 7 ? "Max 7 cities reached" : "Search city or country…"}
                  value={searchQuery}
                  disabled={selectedCities.length >= 7}
                  onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              {/* Dropdown */}
              {showDropdown && filteredCities.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 top-full mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-border/50 bg-popover shadow-xl"
                >
                  {filteredCities.map(city => (
                    <button
                      key={city.id}
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
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>

          {/* Selected city pills */}
          <div className="flex flex-wrap gap-2">
            {selectedCities.map((city, idx) => (
              <div
                key={city.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm border border-border/40 group"
              >
                <button
                  onClick={() => moveCity(city.id, -1)}
                  disabled={idx === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                  title="Move left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-medium">{city.name}</span>
                <span className="text-muted-foreground text-xs hidden sm:inline">{city.country}</span>
                <button
                  onClick={() => moveCity(city.id, 1)}
                  disabled={idx === selectedCities.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                  title="Move right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeCity(city.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                  title="Remove"
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
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-500/80" />
            <span className="text-muted-foreground">Business hours (9 AM–5 PM)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-yellow-400/70" />
            <span className="text-muted-foreground">Early / late (7–9 AM, 5–8 PM)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-500/50" />
            <span className="text-muted-foreground">Night / off hours</span>
          </div>
          {overlapHours.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-green-400 ring-2 ring-green-300" />
              <span className="text-muted-foreground font-medium text-green-400">Best overlap</span>
            </div>
          )}
        </div>

        {/* ── Time Grid ── */}
        {selectedCities.length >= 1 && (
          <div className="premium-card p-6 overflow-x-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Time Grid
              {hoveredHour !== null && (
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  UTC {hoveredHour}:00
                </span>
              )}
            </h2>

            <div className="min-w-[700px]">
              {/* Hour header */}
              <div className="flex items-center gap-2 mb-2">
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
                      <div className="flex-1 flex h-10 rounded-lg overflow-hidden border border-border/30">
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
              <div className="flex items-center gap-2 mt-1">
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
          </div>
        )}

        {/* ── Overlap Summary ── */}
        {selectedCities.length >= 2 && (
          <div className="premium-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Best Times to Meet
            </h2>

            {overlapHours.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The following UTC hours fall within business hours (9 AM–5 PM) for all selected cities:
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
                <p className="text-sm text-muted-foreground">Try adjusting the date or selecting cities in closer time zones.</p>
              </div>
            )}
          </div>
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
        <div className="premium-card p-6 space-y-3 text-sm text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">How to use this planner</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Search and add up to 7 cities using the search box above.</li>
            <li>Pick a date — the grid adjusts for Daylight Saving Time automatically.</li>
            <li>Green cells = business hours (9 AM–5 PM local time). Hover over any cell to see local times.</li>
            <li>The "Best Times to Meet" section shows hours where all cities are in business hours.</li>
            <li>Hit <strong className="text-foreground">Share</strong> to copy a link pre-loaded with your city selection.</li>
          </ol>
        </div>

      </div>
    </main>
  );
}
