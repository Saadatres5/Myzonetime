import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Globe2, Calendar, ArrowRightLeft, MapPin, Thermometer, Clock, Search, Moon, Timer } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';
import { useGeolocation } from '@/hooks/useGeolocation.js';
import { useWeather } from '@/hooks/useWeather.js';

function unsplashUrl(url, width = 400, quality = 40) {
  try {
    const u = new URL(url);
    u.searchParams.set('w', width);
    u.searchParams.set('auto', 'format');
    u.searchParams.set('q', quality);
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('fm', 'webp');
    return u.toString();
  } catch { return url; }
}

const topCities = [
  { name: 'Dubai', path: '/dubai', img: 'https://images.unsplash.com/photo-1638180940769-bc94c1ffc9cd', tz: 'Asia/Dubai' },
  { name: 'London', path: '/london', img: 'https://images.unsplash.com/photo-1694934985423-9fe08c27bb56', tz: 'Europe/London' },
  { name: 'New York', path: '/new-york', img: 'https://images.unsplash.com/photo-1620545391948-8a4e666ddc3c', tz: 'America/New_York' },
  { name: 'Tokyo', path: '/tokyo', img: 'https://images.unsplash.com/photo-1547518069-405752a21a35', tz: 'Asia/Tokyo' },
  { name: 'Singapore', path: '/singapore', img: 'https://images.unsplash.com/photo-1559329389-e8442e119288', tz: 'Asia/Singapore' },
  { name: 'Sydney', path: '/sydney', img: 'https://images.unsplash.com/photo-1532984601283-d68a3ee3e51f', tz: 'Australia/Sydney' },
  { name: 'Riyadh', path: '/riyadh', img: 'https://images.unsplash.com/photo-1677530655269-3f0d07759687', tz: 'Asia/Riyadh' },
  { name: 'Abu Dhabi', path: '/abu-dhabi', img: 'https://images.unsplash.com/photo-1631887493521-22b259b9c748', tz: 'Asia/Dubai' },
];

const knownCityPaths = {
  'london': '/london', 'dubai': '/dubai', 'new york': '/new-york',
  'tokyo': '/tokyo', 'singapore': '/singapore', 'sydney': '/sydney',
  'riyadh': '/riyadh', 'abu dhabi': '/abu-dhabi',
};

export default function HomePage() {
  const navigate = useNavigate();
  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  const weather = useWeather(latitude, longitude);
  const [localTime, setLocalTime] = useState(new Date());
  const [cityQuery, setCityQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [citiesData, setCitiesData] = useState([]);
  const searchRef = useRef(null);
  const dropdownId = 'city-search-results';
  const MAX_CITY_SEARCH_RESULTS = 60;

  const loadCitiesData = useCallback(async () => {
    if (citiesData.length === 0) {
      const { citiesData: data } = await import('@/data/citiesData.js');
      setCitiesData(data);
    }
  }, [citiesData.length]);

  useEffect(() => {
    const tick = () => { if (!document.hidden) setLocalTime(new Date()); };
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, []);

  // Hide static hero placeholder once React has rendered
  useEffect(() => {
    document.body.classList.add('react-ready');
    const el = document.getElementById('static-hero');
    if (el) el.style.display = 'none';
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInput = useCallback(async (e) => {
    const val = e.target.value;
    setCityQuery(val);
    await loadCitiesData();
    setShowDropdown(true);
  }, [loadCitiesData]);

  const filteredCities = citiesData.length > 0
    ? (cityQuery.trim().length > 0
        ? citiesData.filter(c =>
            c.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
            c.country.toLowerCase().includes(cityQuery.toLowerCase())
          )
        : citiesData)
      .slice(0, MAX_CITY_SEARCH_RESULTS)
    : [];

  const handleCitySelect = (city) => {
    const path = knownCityPaths[city.name.toLowerCase()] || `/world-clock?search=${encodeURIComponent(city.name)}`;
    navigate(path);
    setShowDropdown(false);
    setCityQuery('');
  };


  // ── Entity-first schema system ──────────────────────────────────────────────
  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'MyZoneTime',
    alternateName: ['MyZoneTime.com', 'MZT'],
    url: BASE,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE}/#logo`,
      url: `${BASE}/favicon.svg`,
      width: 512,
      height: 512,
      caption: 'MyZoneTime — World Clock & Time Zone Tools',
    },
    image: { '@type': 'ImageObject', url: `${BASE}/og-image.jpg`, width: 1200, height: 630 },
    description: 'MyZoneTime is a free global time intelligence platform providing world clocks, time zone converters, meeting planners, Hijri calendar, and AI-powered scheduling tools for 500+ cities worldwide.',
    knowsAbout: [
      { '@type': 'Thing', name: 'Time zones', sameAs: 'https://en.wikipedia.org/wiki/Time_zone' },
      { '@type': 'Thing', name: 'Coordinated Universal Time', sameAs: 'https://en.wikipedia.org/wiki/Coordinated_Universal_Time' },
      { '@type': 'Thing', name: 'Daylight saving time', sameAs: 'https://en.wikipedia.org/wiki/Daylight_saving_time' },
      { '@type': 'Thing', name: 'Islamic calendar', sameAs: 'https://en.wikipedia.org/wiki/Islamic_calendar' },
      { '@type': 'Thing', name: 'Gulf Standard Time', sameAs: 'https://en.wikipedia.org/wiki/Gulf_Standard_Time' },
      { '@type': 'Thing', name: 'International meeting scheduling' },
    ],
    sameAs: [
      'https://twitter.com/myzonetime',
      'https://www.facebook.com/myzonetime',
      'https://www.linkedin.com/company/myzonetime',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'MyZoneTime Free Tools',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'WebApplication', name: 'World Clock', url: `${BASE}/world-clock` } },
        { '@type': 'Offer', itemOffered: { '@type': 'WebApplication', name: 'Time Zone Converter', url: `${BASE}/timezone-converter` } },
        { '@type': 'Offer', itemOffered: { '@type': 'WebApplication', name: 'Global Meeting Planner', url: `${BASE}/meeting-planner` } },
        { '@type': 'Offer', itemOffered: { '@type': 'WebApplication', name: 'AI Meeting Planner', url: `${BASE}/ai-meeting-planner` } },
        { '@type': 'Offer', itemOffered: { '@type': 'WebApplication', name: 'Hijri Calendar', url: `${BASE}/hijri-calendar` } },
        { '@type': 'Offer', itemOffered: { '@type': 'WebApplication', name: 'Time Difference Calculator', url: `${BASE}/time-difference-calculator` } },
        { '@type': 'Offer', itemOffered: { '@type': 'WebApplication', name: 'Work Hours Calculator', url: `${BASE}/work-hours` } },
      ],
    },
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: ['English', 'Arabic'], url: `${BASE}/contact` },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
  };

  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    name: 'MyZoneTime',
    url: BASE,
    publisher: { '@id': `${BASE}/#organization` },
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/world-clock?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  const homePageSchema = {
    '@type': 'WebPage',
    '@id': `${BASE}/#webpage`,
    url: BASE,
    name: 'World Clock & Time Zone Converter — Live Time in 500+ Cities | MyZoneTime',
    description: 'Free world clock for 500+ cities. Time zone converter, meeting planner, Hijri calendar, and AI-powered scheduling tools for global teams.',
    isPartOf: { '@id': `${BASE}/#website` },
    about: { '@id': `${BASE}/#organization` },
    publisher: { '@id': `${BASE}/#organization` },
    dateModified: TODAY,
    inLanguage: 'en',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE }],
    },
    significantLink: [
      `${BASE}/world-clock`,
      `${BASE}/meeting-planner`,
      `${BASE}/ai-meeting-planner`,
      `${BASE}/timezone-converter`,
      `${BASE}/hijri-calendar`,
    ],
  };

  const webApplicationSchema = {
    '@type': 'WebApplication',
    '@id': `${BASE}/#webapp`,
    name: 'MyZoneTime — Global Time Intelligence Platform',
    url: BASE,
    description: 'AI-powered world clock and time zone tools for global teams. World clock, converter, meeting planner, Hijri calendar, and AI scheduling for 500+ cities.',
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Time & Clock Tools',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/OnlineOnly' },
    provider: { '@id': `${BASE}/#organization` },
    publisher: { '@id': `${BASE}/#organization` },
    featureList: [
      'Live world clock for 500+ cities',
      'DST-aware time zone converter',
      'International meeting planner with business hours grid',
      'AI meeting planner with natural language scheduling',
      'Hijri/Islamic calendar with Gregorian conversion',
      'Time difference calculator',
      'Work hours calculator for remote teams',
      'Stopwatch, timer, and countdown tools',
    ],
    dateModified: TODAY,
  };

  const siteNavSchema = {
    '@type': 'SiteNavigationElement',
    '@id': `${BASE}/#navigation`,
    name: 'MyZoneTime Main Navigation',
    hasPart: [
      { '@type': 'SiteNavigationElement', name: 'World Clock',                url: `${BASE}/world-clock` },
      { '@type': 'SiteNavigationElement', name: 'Time Zone Converter',        url: `${BASE}/timezone-converter` },
      { '@type': 'SiteNavigationElement', name: 'Global Meeting Planner',     url: `${BASE}/meeting-planner` },
      { '@type': 'SiteNavigationElement', name: 'AI Meeting Planner',         url: `${BASE}/ai-meeting-planner` },
      { '@type': 'SiteNavigationElement', name: 'Time Difference Calculator', url: `${BASE}/time-difference-calculator` },
      { '@type': 'SiteNavigationElement', name: 'Hijri Calendar',             url: `${BASE}/hijri-calendar` },
      { '@type': 'SiteNavigationElement', name: 'Work Hours Calculator',      url: `${BASE}/work-hours` },
    ],
  };



  const homeFaqs = [
    { question: 'What is the time difference between Dubai and London?', answer: 'Dubai (GST, UTC+4) is typically 4 hours ahead of London (GMT, UTC+0) in winter, and 3 hours ahead when the UK observes British Summer Time (BST). Dubai does not observe daylight saving time.' },
    { question: 'How do I schedule a meeting across time zones?', answer: 'Use the Meeting Planner on MyZoneTime. Add all participant cities and it highlights overlapping business hours (9 AM – 6 PM) in green automatically. You can plan meetings for up to 5 cities simultaneously.' },
    { question: 'What is UTC and why does it matter?', answer: 'UTC (Coordinated Universal Time) is the global time standard based on atomic clocks. It never observes daylight saving time, making it the universal baseline for aviation, finance, and international business.' },
    { question: 'Does daylight saving time affect time zone conversions?', answer: 'Yes. When a region shifts clocks for daylight saving time, its UTC offset changes. MyZoneTime accounts for all DST transitions automatically across 500+ cities in real-time.' },
    { question: 'What is the current Hijri date?', answer: 'The current Islamic (Hijri) date is shown on our dedicated Hijri Calendar page. The Hijri calendar is a lunar calendar that shifts approximately 11 days earlier each Gregorian year.' },
  ];

  return (
    <main className="flex-1 w-full bg-background text-foreground" id="main-content">
      <Helmet>
        <title>World Clock &amp; Time Zone Converter — Live Time in 500+ Cities | MyZoneTime</title>
        <meta name="description" content="Free world clock for 500+ cities. Convert time zones, plan meetings, check Hijri dates — no signup needed." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* hreflang — tells Google which language version to serve per user */}
        <link rel="alternate" hrefLang="en"       href="https://myzonetime.com/" />
        <link rel="alternate" hrefLang="ar"       href="https://myzonetime.com/ar" />
        <link rel="alternate" hrefLang="hi"       href="https://myzonetime.com/hi" />
        <link rel="alternate" hrefLang="es"       href="https://myzonetime.com/es" />
        <link rel="alternate" hrefLang="x-default" href="https://myzonetime.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/" />
        <meta property="og:title" content="World Clock &amp; Time Zone Converter — Live Time in 500+ Cities | MyZoneTime" />
        <meta property="og:description" content="Free world clock showing live time in 500+ cities. Time zone converter, meeting planner, Hijri calendar, and live weather. Trusted by global teams." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="MyZoneTime — World Clock and Time Zone Tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="World Clock &amp; Time Zone Converter | MyZoneTime" />
        <meta name="twitter:description" content="Free world clock, time zone converter, meeting planner, and live weather for 500+ cities." />
         <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
        <meta name="twitter:image:alt" content="MyZoneTime — World Clock" />
      </Helmet>
      <CanonicalTag pathname="/" />
      <StructuredData schemas={[organizationSchema, websiteSchema, homePageSchema, webApplicationSchema, siteNavSchema, {
        '@type': 'WebPage',
        '@id': 'https://myzonetime.com/#speakable',
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.hero-description', '.utc-banner'],
        },
        url: 'https://myzonetime.com/',
      }]} />

      {/* ── Hero ── */}
      <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center py-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-4xl bg-primary/20 rounded-full blur-[80px] pointer-events-none opacity-50 mix-blend-screen" aria-hidden="true" style={{contain:'strict',width:'min(80vw,56rem)',height:'min(80vw,56rem)'}} />
        <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-sm font-medium mb-4">
            <Globe2 className="w-4 h-4 text-primary" aria-hidden="true" />
            AI-powered global time intelligence — 500+ Cities
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl" style={{ textWrap: 'balance' }}>
            World Clock &amp; Time Zone Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-first city search and time tools for modern global teams. Convert time zones, plan meetings, and attract the right audience with smarter world clock insights.
          </p>

          {/* Accessible Search Combobox */}
          <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mt-8 z-50" role="search">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                value={cityQuery}
                onChange={handleSearchInput}
                onFocus={() => { loadCitiesData(); setShowDropdown(true); }}
                placeholder="Search any city worldwide with AI-informed suggestions…"
                aria-label="Search for a city"
                aria-autocomplete="list"
                aria-controls={dropdownId}
                aria-expanded={showDropdown && filteredCities.length > 0}
                role="combobox"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg shadow-sm transition-all"
              />
            </div>
            {showDropdown && filteredCities.length > 0 && (
              <div id={dropdownId} role="listbox" aria-label="City suggestions" className="absolute top-full left-0 right-0 mt-2 py-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {filteredCities.map(city => (
                  <button key={city.id} role="option" aria-selected="false"
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
                    <div>
                      <span className="font-bold text-foreground">{city.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">{city.country}</span>
                    </div>
                    <span className="font-mono text-sm bg-secondary/20 px-2 py-1 rounded">
                      {new Date().toLocaleTimeString('en-US', { timeZone: city.timezone, hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Local time / weather strip */}
          <div className="w-full flex flex-col items-center justify-center">
            {!geoLoading && latitude && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 px-6 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm text-sm w-full max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                  <time dateTime={localTime.toISOString()} className="font-mono text-lg font-semibold tabular-nums">
                    {localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </time>
                </div>
                {!weather.loading && !weather.error && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="font-semibold">{weather.icon} {weather.tempC}°C / {weather.tempF}°F</span>
                    <span className="text-muted-foreground">{weather.condition}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" aria-hidden="true" /><span className="text-xs">Your location</span>
                </div>
              </div>
            )}
            {geoLoading && <p className="text-sm text-muted-foreground">Detecting your location…</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button asChild className="premium-button px-8 py-6 text-lg rounded-full">
              <Link to="/timezone-converter"><ArrowRightLeft className="w-5 h-5 mr-2" aria-hidden="true" />Time Converter</Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-6 text-lg rounded-full border-border/50 hover:bg-secondary/10 hover:text-secondary">
              <Link to="/meeting-planner"><Calendar className="w-5 h-5 mr-2" aria-hidden="true" />Meeting Planner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AdSense — below hero, CLS-safe reserved height */}
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd slot={AD_SLOTS.HOME_BANNER} format="horizontal" minHeight={90} />
      </div>

      {/* ── Popular Cities Grid ── */}
      <section className="py-24 bg-card/30 border-t border-border/50" style={{contentVisibility:'auto',containIntrinsicSize:'0 600px'}} aria-labelledby="cities-heading">
        <div className="container max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 id="cities-heading" className="text-3xl md:text-4xl font-bold tracking-tight">Explore Popular Cities</h2>
            <p className="text-lg text-muted-foreground">Live time in major cities — click any city for detailed info</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCities.map((city, index) => (
              <Link key={city.name} to={city.path}
                className="block group relative h-48 rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                aria-label={`Current time in ${city.name}`}>
                <img
                  src={unsplashUrl(city.img, 400, index === 0 ? 50 : 30)}
                  srcSet={`${unsplashUrl(city.img, 200, 30)} 200w, ${unsplashUrl(city.img, 400, index === 0 ? 50 : 30)} 400w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  alt=""
                  aria-hidden="true"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async"
                  width="400"
                  height="200"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{city.name}</h3>
                  <p className="text-primary font-mono text-sm mt-1 font-semibold">
                    {new Date().toLocaleTimeString('en-US', { timeZone: city.tz, hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" className="rounded-full px-8 py-5 border-border/50 hover:bg-primary/10 hover:text-primary">
              <Link to="/world-clock"><Globe2 className="w-4 h-4 mr-2" aria-hidden="true" />View All 500+ Cities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 border-t border-border/40" style={{contentVisibility:'auto',containIntrinsicSize:'0 800px'}} aria-labelledby="features-heading">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need for AI-Smart Global Time</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Professional tools for remote teams, international business, and modern audience growth</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe2, title: 'World Clock', desc: 'Live time in 500+ cities with instant AI search and favourites.', path: '/world-clock' },
              { icon: ArrowRightLeft, title: 'Time Zone Converter', desc: 'Compare any two cities side-by-side with exact hour differences and share links.', path: '/timezone-converter' },
              { icon: Calendar, title: 'Meeting Planner', desc: 'Find overlapping business hours for distributed teams across up to 5 cities.', path: '/meeting-planner' },
              { icon: Moon, title: 'Hijri Calendar', desc: "Today's Islamic date with full Gregorian comparison and month guide.", path: '/hijri-calendar' },
              { icon: Timer, title: 'Time Difference', desc: 'Calculate exact hours between any two cities, DST-aware and always accurate.', path: '/time-difference-calculator' },
              { icon: MapPin, title: 'City Pages', desc: 'Deep-dive city pages built for global audiences with weather, FAQs, and intelligent discovery.', path: '/world-clock' },
            ].map(({ icon: Icon, title, desc, path }) => (
              <Link key={title} to={path} className="premium-card p-6 flex flex-col gap-4">
                <div className="p-3 bg-primary/10 rounded-xl w-fit">
                  <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Inline ad */}
      <div className="container max-w-4xl mx-auto px-4 py-2">
        <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
      </div>

      {/* ── SEO Content Section ── */}
      <section className="py-20 border-t border-border/40" aria-labelledby="about-heading">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 id="about-heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Free World Clock &amp; Time Zone Tools for Global Teams
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            MyZoneTime is a free, no-signup platform that gives individuals and teams instant access to live time data for 500+ cities worldwide. Whether you need to schedule an international meeting, check prayer times, convert between time zones, or simply see what time it is right now in Tokyo or New York — we have a tool for that.
          </p>

          <div className="grid gap-10 md:grid-cols-2 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-3">World Clock for 500+ Cities</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our world clock displays live local times across hundreds of cities simultaneously. From Dubai and London to Sydney and Singapore, you can track multiple time zones at a glance. Each city page includes current time, UTC offset, daylight saving status, and local weather.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Time Zone Converter</h3>
              <p className="text-muted-foreground leading-relaxed">
                Convert between any two time zones in seconds. Our converter is DST-aware and updates automatically when clocks change. Perfect for remote workers, international clients, and global businesses that need accurate, real-time conversions every day.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Global Meeting Planner</h3>
              <p className="text-muted-foreground leading-relaxed">
                Planning a meeting across multiple continents? Our meeting planner highlights overlapping business hours for up to 5 cities at once. Stop guessing and avoid scheduling calls at 3am for someone on your team. Find the best time that works for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Hijri Calendar &amp; Islamic Date</h3>
              <p className="text-muted-foreground leading-relaxed">
                View today's Hijri (Islamic) date alongside the Gregorian calendar. Our Hijri calendar is updated daily and is widely used by Muslim communities worldwide for tracking prayer times, Ramadan dates, and Islamic holidays.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Time Difference Calculator</h3>
              <p className="text-muted-foreground leading-relaxed">
                Calculate the exact hour difference between any two cities — accounting for daylight saving time. Get shareable links to send colleagues or clients so everyone sees the same result instantly.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Work Hours &amp; Date Calculators</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track billable work hours, calculate how many days between two dates, and use our countdown timer for deadlines or events. All tools are free, fast, and work directly in your browser — no app download or account needed.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Sunrise &amp; Sunset Times</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find exact sunrise, sunset, solar noon, and day length for any city worldwide. Our <a href="/sunrise-sunset" className="text-primary hover:underline">sunrise and sunset calculator</a> is updated daily and accounts for your city's exact coordinates and daylight saving time.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Week Number &amp; ISO Calendar</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find the current <a href="/week-number" className="text-primary hover:underline">ISO week number</a> instantly, or browse the full year's week calendar to find any week number by date. Follows the ISO 8601 standard used in Europe and international business.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Unix Time &amp; Epoch Converter</h3>
              <p className="text-muted-foreground leading-relaxed">
                See the live <a href="/unix-time" className="text-primary hover:underline">Unix timestamp</a> and convert any epoch time to a human-readable date. Includes code examples in JavaScript, Python, PHP, MySQL, Go, and more.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-4">Why Use MyZoneTime?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Unlike many time zone tools, MyZoneTime is completely free with no account required. We focus on speed, accuracy, and accessibility. Our tools are built for remote workers, digital nomads, international teams, and anyone who regularly works across time zones. The platform is mobile-friendly and designed to load instantly.
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm leading-relaxed">
            <li>Live time updates every second — always accurate</li>
            <li>500+ cities across every continent and time zone</li>
            <li>DST-aware conversions — no manual adjustments needed</li>
            <li>Hijri Islamic calendar built in</li>
            <li>Sunrise and sunset times for every city</li>
            <li>ISO week number calendar for the full year</li>
            <li>Unix/Epoch timestamp converter for developers</li>
            <li>No signup, no ads popup, no tracking walls</li>
            <li>Embeddable world clock widget for your own website</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={homeFaqs} />
    </main>
  );
}
