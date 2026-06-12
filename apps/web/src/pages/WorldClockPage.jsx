import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, X, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import { citiesData } from '@/data/citiesData.js';

// ─── Default 8 cities (matching screenshot order) ─────────────────────────
const DEFAULT_CITY_IDS = ['dxb', 'auh', 'shj', 'ruh', 'jed', 'dmm', 'mcc', 'med'];

const STORAGE_KEY = 'mzt_displayed_cities';

function loadDisplayedCities() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const ids = JSON.parse(saved);
      if (Array.isArray(ids) && ids.length === 8) {
        const cities = ids.map(id => citiesData.find(c => c.id === id)).filter(Boolean);
        if (cities.length === 8) return cities;
      }
    }
  } catch (_) {}
  return DEFAULT_CITY_IDS.map(id => citiesData.find(c => c.id === id)).filter(Boolean);
}

function saveDisplayedCities(cities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities.map(c => c.id)));
  } catch (_) {}
}

function getUTCOffset(timezone) {
  try {
    const date = new Date();
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tz  = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const diff = (tz - utc) / (1000 * 60 * 60);
    const h = Math.floor(Math.abs(diff));
    const m = Math.round((Math.abs(diff) - h) * 60);
    const sign = diff >= 0 ? '+' : '-';
    return m > 0
      ? `UTC${sign}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
      : `UTC${sign}${h}`;
  } catch (_) { return 'UTC'; }
}

const knownRoutes = new Set([
  'london','dubai','new-york','newyork','tokyo','singapore',
  'sydney','riyadh','abu-dhabi','abudhabi','istanbul','paris',
  'oslo','bangkok','kuala-lumpur','kualalumpur'
]);

function getCityPath(cityName) {
  const slug = cityName.toLowerCase().replace(/\s+/g, '-');
  const slugNoHyphen = slug.replace(/-/g,'');
  if (knownRoutes.has(slug) || knownRoutes.has(slugNoHyphen)) return `/${slug}`;
  return null;
}

// ─── Single city card ──────────────────────────────────────────────────────
function CityCard({ city, time, onRemove, index }) {
  const timeStr = time.toLocaleTimeString('en-US', {
    timeZone: city.timezone,
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });

  const path = getCityPath(city.name);
  const offset = getUTCOffset(city.timezone);

  const CardContent = (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col justify-between
                    transition-all hover:shadow-md hover:border-foreground/20 group relative">
      {/* Remove button */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(index); }}
        className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground/40
                   hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100
                   focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Remove ${city.name}`}
        title="Remove city"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div>
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors pr-6">
          {city.name}
        </h3>
        <p className="text-sm text-muted-foreground">{city.country}</p>
      </div>

      <div className="mt-6">
        <div className="text-3xl font-medium tabular-nums tracking-tight">{timeStr}</div>
        <p className="text-sm text-muted-foreground mt-1">{offset}</p>
      </div>
    </div>
  );

  if (path) {
    return (
      <Link to={path} className="block h-full" aria-label={`View time in ${city.name}`}>
        {CardContent}
      </Link>
    );
  }
  return <div className="h-full">{CardContent}</div>;
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function WorldClockPage() {
  const [displayedCities, setDisplayedCities] = useState(loadDisplayedCities);
  const [time, setTime]                       = useState(new Date());
  const [search, setSearch]                   = useState('');
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [activeIdx, setActiveIdx]             = useState(-1);
  const searchRef  = useRef(null);
  const dropdownRef = useRef(null);

  // Tick every second
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Persist displayed cities
  useEffect(() => {
    saveDisplayedCities(displayedCities);
  }, [displayedCities]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        searchRef.current  && !searchRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setSearch('');
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter cities for dropdown — exclude already displayed
  const displayedIds = new Set(displayedCities.map(c => c.id));
  const searchResults = search.trim().length > 0
    ? citiesData
        .filter(c =>
          !displayedIds.has(c.id) &&
          (c.name.toLowerCase().includes(search.toLowerCase()) ||
           c.country.toLowerCase().includes(search.toLowerCase()))
        )
        .slice(0, 40)
    : [];

  const addCity = useCallback((city) => {
    setDisplayedCities(prev => {
      // Remove first (oldest), add new city at the end
      const next = [...prev.slice(1), city];
      return next;
    });
    setSearch('');
    setDropdownOpen(false);
    setActiveIdx(-1);
    searchRef.current?.blur();
  }, []);

  const removeCity = useCallback((index) => {
    setDisplayedCities(prev => {
      // Replace removed slot with a fallback city not already displayed
      const remaining = prev.filter((_, i) => i !== index);
      const remainingIds = new Set(remaining.map(c => c.id));
      const fallback = citiesData.find(c =>
        !remainingIds.has(c.id) &&
        !DEFAULT_CITY_IDS.slice(0, 8).some(id => id === c.id && remainingIds.has(id))
      );
      if (fallback) return [...remaining, fallback];
      return remaining; // allow < 8 if no fallback (edge case)
    });
  }, []);

  // Keyboard navigation for dropdown
  const handleKeyDown = (e) => {
    if (!dropdownOpen || searchResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      addCity(searchResults[activeIdx]);
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
      setSearch('');
      setActiveIdx(-1);
    }
  };

  // Schemas
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'World Clock',
    applicationCategory: 'UtilityApplication',
    description: 'Live world clock showing current time in 500+ cities. Search any city worldwide.',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' },
    ],
  };

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
      <Helmet>
        <title>World Clock — Live Time in 500+ Cities | MyZoneTime</title>
        <meta name="description" content="Live world clock showing current time in 500+ cities worldwide. Search any city and track multiple time zones at once. Free, no sign-up." />
        <meta property="og:title"       content="World Clock — Live Time in 500+ Cities | MyZoneTime" />
        <meta property="og:description" content="Live world clock showing current time in 500+ cities. Track time zones for Dubai, London, New York, Tokyo, Singapore, Sydney, and more." />
        <meta property="og:image"       content="https://myzonetime.com/favicon.svg" />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:site"       content="@myzonetime" />
        <meta name="twitter:title"      content="World Clock | MyZoneTime" />
        <meta name="twitter:description" content="Check the current time in any city worldwide. Search 500+ cities instantly." />
        <meta name="twitter:image"      content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname="/world-clock" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="space-y-12">

        {/* Heading */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            World Clock – Real-Time Global Time Zones
          </h1>
          <p className="text-lg text-muted-foreground">
            Current local time in major cities worldwide.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-expanded={dropdownOpen}
              aria-autocomplete="list"
              aria-controls="city-search-listbox"
              aria-activedescendant={activeIdx >= 0 ? `city-option-${activeIdx}` : undefined}
              placeholder="Search cities..."
              className="w-full pl-12 pr-10 h-12 rounded-full bg-secondary/50 border border-transparent
                         focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring
                         text-foreground placeholder:text-muted-foreground text-sm transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setDropdownOpen(true);
                setActiveIdx(-1);
              }}
              onFocus={() => { if (search.trim()) setDropdownOpen(true); }}
              onKeyDown={handleKeyDown}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setDropdownOpen(false); setActiveIdx(-1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {dropdownOpen && searchResults.length > 0 && (
            <ul
              id="city-search-listbox"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl
                         shadow-xl overflow-hidden z-50 divide-y divide-border/50"
            >
              {searchResults.map((city, i) => (
                <li
                  key={city.id}
                  id={`city-option-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                    ${i === activeIdx ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/60'}`}
                  onMouseDown={(e) => { e.preventDefault(); addCity(city); }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div>
                    <span className="font-medium text-sm">{city.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{city.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {getUTCOffset(city.timezone)}
                    </span>
                    <Plus className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  </div>
                </li>
              ))}
              <li className="px-4 py-2 text-xs text-muted-foreground text-center bg-secondary/20">
                <Clock className="w-3 h-3 inline mr-1" aria-hidden="true" />
                Click or press Enter to add — replaces the oldest city
              </li>
            </ul>
          )}

          {dropdownOpen && search.trim().length > 0 && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border
                            rounded-2xl shadow-xl px-4 py-4 z-50 text-center text-sm text-muted-foreground">
              No cities found for "{search}"
            </div>
          )}
        </div>

        {/* 8-city grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCities.map((city, i) => (
            <CityCard
              key={city.id}
              city={city}
              time={time}
              onRemove={removeCity}
              index={i}
            />
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-muted-foreground">
          Hover a card and click ✕ to remove a city · Search above to add any city in the world
        </p>

      </div>
    </main>
  );
}
