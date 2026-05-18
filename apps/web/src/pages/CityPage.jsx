import React, { useState, useEffect, useMemo } from 'react';
import WeatherCard from '@/components/WeatherCard.jsx';
import BestTimeToCallSection from '@/components/BestTimeToCallSection.jsx';
import DailyInfoCards from '@/components/DailyInfoCards.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

/**
 * CityPage — layout-only component. NO <Helmet> here.
 * All meta tags, canonical, and schema belong in the city wrapper (Dubai.jsx etc.)
 */
export default function CityPage({ city, country, region, currency, timezone, lat, lon, description, children }) {
  const [time, setTime] = useState(new Date());

  // Pause ticking when tab is hidden — saves CPU
  useEffect(() => {
    const tick = () => { if (!document.hidden) setTime(new Date()); };
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, []);

  // UTC offset computed once per timezone (not every second)
  const utcOffset = useMemo(() => {
    try {
      const now = new Date();
      const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const local = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
      const diff = (local - utc) / 3_600_000;
      return `UTC${diff >= 0 ? '+' : ''}${diff}`;
    } catch { return 'UTC'; }
  }, [timezone]);

  const timeString = time.toLocaleTimeString('en-US', { timeZone: timezone, hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const dateString = time.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="flex-1 w-full bg-background text-foreground" id="main-content">
      {/* Hero */}
      <section className="relative w-full py-20 md:py-28 overflow-hidden bg-gradient-to-b from-card/50 to-background border-b border-border/40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="container relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            {country} {region ? `· ${region}` : ''} · {utcOffset}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Current Time in {city}
          </h1>
          <time
            dateTime={time.toISOString()}
            className="text-clock-giant font-mono-time font-bold text-primary tabular-nums block"
            aria-label={`Current time in ${city}: ${timeString}`}
          >
            {timeString}
          </time>
          <p className="text-xl text-muted-foreground">{dateString}</p>
          {description && (
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-4">{description}</p>
          )}
        </div>
      </section>

      {/* Ad — city rectangle, high RPM placement */}
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <AdSenseAd slot={AD_SLOTS.CITY_RECTANGLE} format="rectangle" minHeight={250} />
      </div>

      {/* Info cards */}
      <section className="container max-w-6xl mx-auto px-4 py-12 space-y-12">
        <DailyInfoCards timezone={timezone} utcOffset={utcOffset} currency={currency} />

        {lat && lon && <WeatherCard lat={lat} lon={lon} city={city} />}

        <BestTimeToCallSection timezone={timezone} city={city} currentTime={time} />

        {/* Page-specific content (FAQs, RelatedTools etc.) */}
        {children}
      </section>
    </main>
  );
}
