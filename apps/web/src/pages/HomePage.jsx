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

function unsplashUrl(url, width = 400) {
  try {
    const u = new URL(url);
    u.searchParams.set('w', width);
    u.searchParams.set('auto', 'format');
    u.searchParams.set('q', '50');
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

  useEffect(() => {
    const tick = () => { if (!document.hidden) setLocalTime(new Date()); };
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
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
    if (val.length > 1) {
      if (citiesData.length === 0) {
        const { citiesData: data } = await import('@/data/citiesData.js');
        setCitiesData(data);
      }
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [citiesData]);

  const filteredCities = cityQuery.length > 1 && citiesData.length > 0
    ? citiesData.filter(c =>
        c.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(cityQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleCitySelect = (city) => {
    const path = knownCityPaths[city.name.toLowerCase()] || `/world-clock?search=${encodeURIComponent(city.name)}`;
    navigate(path);
    setShowDropdown(false);
    setCityQuery('');
  };


  const organizationSchema = {
    '@type': 'Organization',
    name: 'MyZoneTime',
    url: 'https://myzonetime.com',
    logo: { '@type': 'ImageObject', url: 'https://myzonetime.com/og-image.png', width: 1200, height: 630 },
    sameAs: [],
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: 'English' },
  };

  const webApplicationSchema = {
    '@type': 'WebApplication',
    name: 'MyZoneTime',
    url: 'https://myzonetime.com',
    description: 'World Clock & Time Zone Converter — Live time in 500+ cities, meeting planner, Hijri calendar and more.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    image: 'https://myzonetime.com/og-image.jpg',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Time zone conversion', 'World clock', 'Meeting planner', 'Hijri calendar', 'Live weather'],
  };

  const websiteSchema = {
    '@type': 'WebSite',
    name: 'MyZoneTime',
    url: 'https://myzonetime.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://myzonetime.com/world-clock?search={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' }],
  };
  const sitelinksSchema = {
    '@type': 'ItemList',
    name: 'MyZoneTime Tools',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'World Clock', url: 'https://myzonetime.com/world-clock' },
      { '@type': 'ListItem', position: 2, name: 'Time Zone Converter', url: 'https://myzonetime.com/timezone-converter' },
      { '@type': 'ListItem', position: 3, name: 'Meeting Planner', url: 'https://myzonetime.com/meeting-planner' },
      { '@type': 'ListItem', position: 4, name: 'Hijri Calendar', url: 'https://myzonetime.com/hijri-calendar' },
      { '@type': 'ListItem', position: 5, name: 'Time Difference Calculator', url: 'https://myzonetime.com/time-difference-calculator' },
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
        <meta name="description" content="Check the exact local time in 500+ cities worldwide. Free world clock, time zone converter, meeting planner, and live weather for Dubai, London, New York, Tokyo and more." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
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
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="MyZoneTime — World Clock" />
      </Helmet>
      <CanonicalTag pathname="/" />
      <StructuredData schemas={[organizationSchema, webApplicationSchema, websiteSchema, breadcrumbSchema, sitelinksSchema]} />

      {/* ── Hero ── */}
      <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center py-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-4xl bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen will-change-transform" aria-hidden="true" style={{contain:'strict',width:'min(80vw,56rem)',height:'min(80vw,56rem)'}} />
        <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-sm font-medium mb-4">
            <Globe2 className="w-4 h-4 text-primary" aria-hidden="true" />
            Global Time Intelligence — 500+ Cities
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl" style={{ textWrap: 'balance' }}>
            World Clock &amp; Time Zone Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The premium platform for international teams. Convert time zones, plan meetings, and track global business hours effortlessly.
          </p>

          {/* Accessible Search Combobox */}
          <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mt-8 z-50" role="search">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                value={cityQuery}
                onChange={handleSearchInput}
                onFocus={() => cityQuery.length > 1 && setShowDropdown(true)}
                placeholder="Search any city in the world…"
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
      <section className="py-24 bg-card/30 border-t border-border/50" aria-labelledby="cities-heading">
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
                  src={unsplashUrl(city.img, 400)}
                  srcSet={`${unsplashUrl(city.img, 300)} 300w, ${unsplashUrl(city.img, 600)} 600w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  alt=""
                  aria-hidden="true"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding={index === 0 ? 'sync' : 'async'}
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
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need for Global Time</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Professional tools for remote teams, international business, and global travellers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe2, title: 'World Clock', desc: 'Live time in 500+ cities with instant search and favourites.', path: '/world-clock' },
              { icon: ArrowRightLeft, title: 'Time Zone Converter', desc: 'Compare any two cities side-by-side with exact hour differences and share links.', path: '/timezone-converter' },
              { icon: Calendar, title: 'Meeting Planner', desc: 'Find overlapping business hours for distributed teams across up to 5 cities.', path: '/meeting-planner' },
              { icon: Moon, title: 'Hijri Calendar', desc: "Today's Islamic date with full Gregorian comparison and month guide.", path: '/hijri-calendar' },
              { icon: Timer, title: 'Time Difference', desc: 'Calculate exact hours between any two cities, DST-aware and always accurate.', path: '/time-difference-calculator' },
              { icon: MapPin, title: 'City Pages', desc: 'Deep-dive pages for Dubai, London, Tokyo and 200+ more — weather, FAQs included.', path: '/world-clock' },
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

      <FAQSection faqs={homeFaqs} />
    </main>
  );
}
