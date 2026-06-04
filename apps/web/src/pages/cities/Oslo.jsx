/**
 * Oslo.jsx — Current Time in Oslo, Norway
 * Turkey stopped DST in 2016; Oslo/Norway still observes EU DST rules.
 * CET (UTC+1) in winter, CEST (UTC+2) in summer.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import TimezoneAuthoritySection from '@/components/TimezoneAuthoritySection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { Globe2, ArrowRightLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIMEZONE  = 'Europe/Oslo';
const CITY      = 'Oslo';
const COUNTRY   = 'Norway';
const UTC_LABEL = 'UTC+1/+2 (CET/CEST)';
const FLAG      = '🇳🇴';

const relatedCities = [
  { name: 'London',   path: '/london',    tz: 'Europe/London',    utc: 'UTC+0/+1' },
  { name: 'Paris',    path: '/paris',     tz: 'Europe/Paris',     utc: 'UTC+1/+2' },
  { name: 'Dubai',    path: '/dubai',     tz: 'Asia/Dubai',       utc: 'UTC+4' },
  { name: 'New York', path: '/new-york',  tz: 'America/New_York', utc: 'UTC-5/-4' },
];

const timeDiffLinks = [
  { label: 'Oslo vs London',   path: '/time-difference/oslo-london'   },
  { label: 'Oslo vs New York', path: '/time-difference/oslo-new-york' },
];

const faqs = [
  {
    question: 'What time zone is Oslo in?',
    answer: 'Oslo uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) from the last Sunday in March to the last Sunday in October.',
  },
  {
    question: 'Does Norway observe daylight saving time?',
    answer: 'Yes. Norway follows EU daylight saving rules. Clocks go forward 1 hour on the last Sunday in March (to CEST, UTC+2) and back on the last Sunday in October (to CET, UTC+1).',
  },
  {
    question: 'What is the time difference between Oslo and London?',
    answer: 'Oslo is always exactly 1 hour ahead of London. Both Norway and the UK change their clocks on the same dates, so the 1-hour gap between CET/GMT and CEST/BST is constant all year.',
  },
  {
    question: 'What is the time difference between Oslo and New York?',
    answer: 'Oslo (CET, UTC+1) is 6 hours ahead of New York (EST, UTC-5) in winter and 5–6 hours ahead during spring and summer, depending on when each country switches its clocks.',
  },
  {
    question: 'What is the time difference between Oslo and Dubai?',
    answer: 'Dubai (UTC+4) is 3 hours ahead of Oslo in winter (CET, UTC+1) and 2 hours ahead during summer (CEST, UTC+2). Dubai does not observe DST.',
  },
  {
    question: 'What are business hours in Oslo?',
    answer: 'Standard business hours in Oslo are Monday to Friday, 8 AM to 4 PM or 9 AM to 5 PM CET/CEST. Norway has a reputation for strict work-life balance and most offices close by 4–5 PM.',
  },
  {
    question: 'What is the best time to call Oslo from London?',
    answer: 'Any time during London business hours works — Oslo is only 1 hour ahead. An 8 AM start in London equals 9 AM in Oslo; a 5 PM close in London equals 6 PM in Oslo.',
  },
];

const schema = {
  '@type': 'WebPage',
  name: 'Current Time in Oslo, Norway',
  url: 'https://myzonetime.com/oslo',
  description: 'Live clock and time zone info for Oslo, Norway. CET (UTC+1) in winter, CEST (UTC+2) in summer.',
  about: { '@type': 'City', name: 'Oslo', containedInPlace: { '@type': 'Country', name: 'Norway' } },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://myzonetime.com' },
    { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' },
    { '@type': 'ListItem', position: 3, name: 'Oslo',        item: 'https://myzonetime.com/oslo' },
  ],
};

export default function Oslo() {
  const { time, formatTime } = useLocalTime(TIMEZONE);

  return (
    <main id="main-content" className="flex-1 w-full bg-background text-foreground">
      <Helmet>
        <title>Current Time in Oslo, Norway — Live Clock CET/CEST | MyZoneTime</title>
        <meta name="description" content="Live clock for Oslo, Norway. Central European Time (CET/CEST), UTC+1 or UTC+2. Current time, weather, business hours, and best time to call Oslo from anywhere." />
        <meta property="og:title" content="Current Time in Oslo, Norway — CET/CEST | MyZoneTime" />
        <meta property="og:description" content="Live clock for Oslo. CET (UTC+1) in winter, CEST (UTC+2) in summer." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="NO-03" />
        <meta name="geo.placename" content="Oslo, Norway" />
        <meta name="geo.position" content="59.9139;10.7522" />
        <meta name="ICBM" content="59.9139, 10.7522" />
      </Helmet>
      <CanonicalTag pathname="/oslo" />
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
            Current Time in <span className="text-primary">Oslo</span>
          </h1>
          <div className="premium-card inline-flex flex-col items-center gap-2 px-10 py-6 rounded-3xl mx-auto" aria-live="polite" aria-label="Current time in Oslo">
            <time dateTime={time?.toISOString()} className="font-mono-time text-6xl md:text-8xl font-bold text-primary tabular-nums tracking-tight">
              {formatTime(time, TIMEZONE, false, false)}
            </time>
            <p className="text-muted-foreground text-lg font-medium">
              {time ? time.toLocaleDateString('en-US', { timeZone: TIMEZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </p>
            <span className="text-xs text-muted-foreground bg-secondary/20 px-3 py-1 rounded-full mt-1">
              Central European Time · CET (UTC+1) / CEST (UTC+2)
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="rounded-full px-6">
              <Link to="/timezone-converter?from=Europe/Oslo"><ArrowRightLeft className="w-4 h-4 mr-2" />Convert Oslo Time</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link to="/meeting-planner"><Globe2 className="w-4 h-4 mr-2" />Meeting Planner</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd slot={AD_SLOTS.CITY_BANNER} format="horizontal" minHeight={90} />
      </div>

      {/* ── Time Zone Info ── */}
      <section className="py-16 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold">Oslo Time Zone Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Time Zone Name',   value: 'Central European Time (CET)' },
              { label: 'Winter UTC Offset', value: 'UTC+1 (CET) — late Oct to late Mar' },
              { label: 'Summer UTC Offset', value: 'UTC+2 (CEST) — late Mar to late Oct' },
              { label: 'DST Change',        value: 'Last Sunday in March / Last Sunday in October' },
              { label: 'IANA Identifier',   value: 'Europe/Oslo' },
              { label: 'Same offset as',    value: 'Paris, Berlin, Amsterdam, Stockholm, Copenhagen' },
              { label: 'Business Hours',    value: 'Mon–Fri, 8:00 AM – 4:00/5:00 PM CET/CEST' },
              { label: 'Currency',          value: 'Norwegian Krone (NOK)' },
            ].map(({ label, value }) => (
              <div key={label} className="premium-card p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compare ── */}
      <section className="py-16 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-bold">Compare Oslo Time with Other Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedCities.map((city) => (
              <Link key={city.name} to={city.path} className="premium-card p-4 rounded-xl text-center hover:border-primary/40 transition-colors group">
                <p className="font-semibold group-hover:text-primary transition-colors">{city.name}</p>
                <p className="font-mono text-primary text-lg font-bold mt-1">
                  {new Date().toLocaleTimeString('en-US', { timeZone: city.tz, hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{city.utc}</p>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {timeDiffLinks.map((link) => (
              <Button key={link.path} asChild variant="outline" size="sm" className="rounded-full">
                <Link to={link.path}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold text-foreground">About Oslo's Time Zone</h2>
          <p>Oslo, the capital of Norway, uses <strong className="text-foreground">Central European Time (CET, UTC+1)</strong> in winter and <strong className="text-foreground">Central European Summer Time (CEST, UTC+2)</strong> in summer, following the same DST rules as the rest of the European Union. Clocks change on the last Sunday in March and October.</p>
          <p>Oslo is always <strong className="text-foreground">exactly 1 hour ahead of London</strong>, making it one of the easiest European cities to schedule meetings with from the UK. Oslo shares its time zone with Paris, Berlin, Amsterdam, Stockholm, and Copenhagen — providing excellent business connectivity across Western and Northern Europe.</p>
          <p>The Oslo Stock Exchange (Oslo Børs) trades <strong className="text-foreground">9 AM to 4:30 PM CET/CEST</strong>. Norwegian business culture typically runs 8 AM to 4 PM, with an early start and early finish compared to many Southern European counterparts.</p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
      </div>

      <TimezoneAuthoritySection cityName="Oslo" timezoneKey="cet" />
      <FAQSection faqs={faqs} />

      <section className="py-12 border-t border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="text-xl font-semibold">More Time Zone Tools</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'World Clock', path: '/world-clock' },
              { label: 'Time Zone Converter', path: '/timezone-converter' },
              { label: 'Meeting Planner', path: '/meeting-planner' },
              { label: 'Time Difference Calculator', path: '/time-difference-calculator' },
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

