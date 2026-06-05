/**
 * Istanbul.jsx — Current Time in Istanbul, Turkey
 *
 * SEO notes:
 *  - Title/description/canonical/JSON-LD are injected SERVER-SIDE by server.js
 *    for Googlebot and AI crawlers. The Helmet tags here are a client-side
 *    fallback only (e.g. for SPA navigations after initial load).
 *  - Istanbul is high-priority: already ranking ~position 40 in GSC.
 *  - Turkey stopped observing DST in 2016 — always UTC+3. This is a common
 *    misconception worth calling out clearly in the FAQ.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { Clock, MapPin, Globe2, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIMEZONE  = 'Asia/Istanbul';
const CITY      = 'Istanbul';
const COUNTRY   = 'Turkey';
const UTC_LABEL = 'UTC+3 (TRT)';
const FLAG      = '🇹🇷';

// Related cities — shown in the "Compare with other cities" section
const relatedCities = [
  { name: 'Dubai',    path: '/dubai',     tz: 'Asia/Dubai',      utc: 'UTC+4' },
  { name: 'London',   path: '/london',    tz: 'Europe/London',   utc: 'UTC+0/+1' },
  { name: 'Riyadh',   path: '/riyadh',    tz: 'Asia/Riyadh',     utc: 'UTC+3' },
  { name: 'New York', path: '/new-york',  tz: 'America/New_York', utc: 'UTC-5/-4' },
];

// Time-difference quick links
const timeDiffLinks = [
  { label: 'Istanbul vs London',   path: '/time-difference/istanbul-london'   },
  { label: 'Istanbul vs New York', path: '/time-difference/istanbul-new-york' },
  { label: 'Istanbul vs Dubai',    path: '/time-difference/istanbul-dubai'    },
];

const faqs = [
  {
    question: 'What time zone is Istanbul in?',
    answer: 'Istanbul uses Turkey Time (TRT), which is UTC+3. Turkey permanently stopped observing daylight saving time in 2016, so Istanbul remains at UTC+3 all year round — no clock changes.',
  },
  {
    question: 'Does Istanbul observe daylight saving time?',
    answer: 'No. Turkey discontinued daylight saving time on 8 September 2016 and moved to UTC+3 permanently. Istanbul clocks never change, making it the same offset as Moscow and Riyadh.',
  },
  {
    question: 'What is the time difference between Istanbul and London?',
    answer: 'Istanbul (UTC+3) is 3 hours ahead of London in winter (GMT, UTC+0) and 2 hours ahead during British Summer Time (BST, UTC+1) from late March to late October. Turkey no longer changes its clocks.',
  },
  {
    question: 'What is the time difference between Istanbul and Dubai?',
    answer: 'Dubai (UTC+4) is 1 hour ahead of Istanbul (UTC+3). This difference is constant year-round as neither Turkey nor the UAE observes daylight saving time.',
  },
  {
    question: 'What is the time difference between Istanbul and New York?',
    answer: 'Istanbul (UTC+3) is 8 hours ahead of New York (EST, UTC-5) in winter and 7 hours ahead during Eastern Daylight Time (EDT, UTC-4) in summer. Turkey does not change its clocks.',
  },
  {
    question: 'What are business hours in Istanbul?',
    answer: 'Standard business hours in Istanbul are Monday to Friday, 9 AM to 6 PM TRT (UTC+3). Government offices typically open 8:30 AM and close by 5:30 PM. The Turkish work week is Monday to Friday.',
  },
  {
    question: 'What is the best time to call Istanbul from London?',
    answer: 'The best time to call Istanbul from London is 9 AM–3 PM London time, which is 12 noon–6 PM Istanbul time. Both cities share most of the business day since Istanbul is only 2–3 hours ahead.',
  },
];

const schema = {
  '@type': 'WebPage',
  name: 'Current Time in Istanbul, Turkey',
  url: 'https://myzonetime.com/istanbul',
  description: 'Live clock and time zone info for Istanbul, Turkey. Turkey Time (TRT), UTC+3. No daylight saving since 2016.',
  about: { '@type': 'City', name: 'Istanbul', containedInPlace: { '@type': 'Country', name: 'Turkey' } },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://myzonetime.com' },
    { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' },
    { '@type': 'ListItem', position: 3, name: 'Istanbul',    item: 'https://myzonetime.com/istanbul' },
  ],
};

export default function Istanbul() {
  const { time, formatTime } = useLocalTime(TIMEZONE);

  return (
    <main id="main-content" className="flex-1 w-full bg-background text-foreground">
      {/* Client-side Helmet fallback — SSR tags set in server.js */}
      <Helmet>
        <title>Istanbul Time — Live Clock, TRT UTC+3 | MyZoneTime</title>
        <meta name="description" content="Live clock for Istanbul, Turkey. Turkey Time (TRT), UTC+3. No daylight saving since 2016. Current time, weather, business hours, and best time to call Istanbul." />
        <meta property="og:title" content="Current Time in Istanbul, Turkey — UTC+3 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Istanbul. Turkey Time (TRT), UTC+3 year-round. No DST since 2016." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Current Time in Istanbul, Turkey | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Istanbul. Turkey Time (TRT), UTC+3. No daylight saving." />
        <meta name="geo.region" content="TR-34" />
        <meta name="geo.placename" content="Istanbul, Turkey" />
        <meta name="geo.position" content="41.0082;28.9784" />
        <meta name="ICBM" content="41.0082, 28.9784" />
      </Helmet>
      <CanonicalTag pathname="/istanbul" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      {/* ── Hero ── */}
      <section className="relative w-full py-20 flex flex-col items-center justify-center text-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-card/30 to-background" aria-hidden="true" />
        <div className="relative z-10 container max-w-3xl mx-auto space-y-6 px-4">
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>{FLAG} {CITY}, {COUNTRY} — {UTC_LABEL}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Current Time in <span className="text-primary">Istanbul</span>
          </h1>

          {/* Live clock */}
          <div className="premium-card inline-flex flex-col items-center gap-2 px-10 py-6 rounded-3xl mx-auto" aria-live="polite" aria-label="Current time in Istanbul">
            <time
              dateTime={time?.toISOString()}
              className="font-mono-time text-6xl md:text-8xl font-bold text-primary tabular-nums tracking-tight"
            >
              {formatTime(time, TIMEZONE, false, false)}
            </time>
            <p className="text-muted-foreground text-lg font-medium">
              {time
                ? time.toLocaleDateString('en-US', { timeZone: TIMEZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                : ''}
            </p>
            <span className="text-xs text-muted-foreground bg-secondary/20 px-3 py-1 rounded-full mt-1">
              Turkey Time (TRT) · UTC+3 · No DST
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="rounded-full px-6">
              <Link to="/timezone-converter?from=Asia/Istanbul">
                <ArrowRightLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Convert Istanbul Time
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link to="/meeting-planner">
                <Globe2 className="w-4 h-4 mr-2" aria-hidden="true" />
                Meeting Planner
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd slot={AD_SLOTS.CITY_BANNER} format="horizontal" minHeight={90} />
      </div>

      {/* ── Time Zone Info ── */}
      <section className="py-16 border-b border-border/40" aria-labelledby="tz-info-heading">
        <div className="container max-w-4xl mx-auto px-4 space-y-8">
          <h2 id="tz-info-heading" className="text-2xl md:text-3xl font-bold">Istanbul Time Zone Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Time Zone Name', value: 'Turkey Time (TRT)' },
              { label: 'UTC Offset',     value: 'UTC+3 (fixed, year-round)' },
              { label: 'Daylight Saving', value: 'None — Turkey stopped DST in 2016' },
              { label: 'IANA Identifier', value: 'Europe/Istanbul' },
              { label: 'Same offset as', value: 'Moscow (MSK), Riyadh (AST), Nairobi (EAT)' },
              { label: 'Business Week',  value: 'Monday – Friday' },
              { label: 'Business Hours', value: '9:00 AM – 6:00 PM TRT' },
              { label: 'Currency',       value: 'Turkish Lira (TRY)' },
            ].map(({ label, value }) => (
              <div key={label} className="premium-card p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {/* Important DST note */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm leading-relaxed">
            <p className="font-semibold text-primary mb-1">⚠️ Important: Turkey permanently removed DST in 2016</p>
            <p className="text-muted-foreground">
              Many tools and calendars still incorrectly show Istanbul observing daylight saving time.
              Turkey moved to UTC+3 permanently on 8 September 2016. Istanbul is now always 3 hours
              ahead of London in winter and 2 hours during BST — <em>it never changes clocks</em>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Compare with other cities ── */}
      <section className="py-16 border-b border-border/40" aria-labelledby="compare-heading">
        <div className="container max-w-4xl mx-auto px-4 space-y-6">
          <h2 id="compare-heading" className="text-2xl font-bold">Compare Istanbul Time with Other Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedCities.map((city) => (
              <Link
                key={city.name}
                to={city.path}
                className="premium-card p-4 rounded-xl text-center hover:border-primary/40 transition-colors group"
              >
                <p className="font-semibold group-hover:text-primary transition-colors">{city.name}</p>
                <p className="font-mono text-primary text-lg font-bold mt-1">
                  {new Date().toLocaleTimeString('en-US', { timeZone: city.tz, hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{city.utc}</p>
              </Link>
            ))}
          </div>

          {/* Time difference quick links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {timeDiffLinks.map((link) => (
              <Button key={link.path} asChild variant="outline" size="sm" className="rounded-full">
                <Link to={link.path}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content: about Istanbul time zone ── */}
      <section className="py-16 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold text-foreground">About Istanbul's Time Zone</h2>
          <p>
            Istanbul, Turkey's largest city and cultural capital, operates on <strong className="text-foreground">Turkey Time (TRT)</strong>,
            which is fixed at <strong className="text-foreground">UTC+3</strong>. Unlike most European nations,
            Turkey permanently abandoned daylight saving time on 8 September 2016, aligning Istanbul
            with Moscow and Riyadh year-round rather than the rest of Europe.
          </p>
          <p>
            This makes scheduling meetings with Istanbul uniquely simple: it is always 3 hours
            ahead of London (GMT) in winter and always 2 hours ahead during British Summer Time —
            no seasonal adjustments needed. Business hours in Istanbul run Sunday to Friday (or
            Monday to Friday for international companies), typically 9 AM to 6 PM TRT.
          </p>
          <p>
            Istanbul straddles Europe and Asia across the Bosphorus Strait. Although geographically
            split, the entire city uses a single time zone. The Borsa Istanbul (stock exchange)
            trades 10 AM to 6 PM TRT on weekdays.
          </p>
          <p>
            For global teams coordinating with Istanbul, the best meeting window from London is
            <strong className="text-foreground"> 9 AM–2 PM London (12 noon–5 PM Istanbul)</strong>.
            From New York (EST), the overlap is limited to
            <strong className="text-foreground"> 2 PM–5 PM Istanbul (7 AM–10 AM New York)</strong>.
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
      </div>

      {/* ── FAQ ── */}
      <FAQSection faqs={faqs} />

      {/* ── Internal links ── */}
      <section className="py-12 border-t border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="text-xl font-semibold">More Time Zone Tools</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'World Clock',              path: '/world-clock'                },
              { label: 'Time Zone Converter',      path: '/timezone-converter'         },
              { label: 'Meeting Planner',          path: '/meeting-planner'            },
              { label: 'Time Difference Calculator', path: '/time-difference-calculator' },
              { label: 'Hijri Calendar',           path: '/hijri-calendar'             },
              { label: 'Work Hours Calculator',    path: '/work-hours-calculator'      },
            ].map((link) => (
              <Button key={link.path} asChild variant="outline" size="sm" className="rounded-full">
                <Link to={link.path}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
