/**
 * Paris.jsx — Current Time in Paris, France
 * Central European Time (CET, UTC+1) in winter, CEST (UTC+2) in summer.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { Globe2, ArrowRightLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIMEZONE  = 'Europe/Paris';
const CITY      = 'Paris';
const COUNTRY   = 'France';
const UTC_LABEL = 'UTC+1/+2 (CET/CEST)';
const FLAG      = '🇫🇷';

const relatedCities = [
  { name: 'London',   path: '/london',    tz: 'Europe/London',    utc: 'UTC+0/+1' },
  { name: 'Oslo',     path: '/oslo',      tz: 'Europe/Oslo',      utc: 'UTC+1/+2' },
  { name: 'Dubai',    path: '/dubai',     tz: 'Asia/Dubai',       utc: 'UTC+4' },
  { name: 'New York', path: '/new-york',  tz: 'America/New_York', utc: 'UTC-5/-4' },
];

const timeDiffLinks = [
  { label: 'Paris vs London',   path: '/time-difference/paris-london'   },
  { label: 'Paris vs New York', path: '/time-difference/paris-new-york' },
];

const faqs = [
  {
    question: 'What time zone is Paris in?',
    answer: 'Paris uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer, from the last Sunday in March to the last Sunday in October.',
  },
  {
    question: 'Does France observe daylight saving time?',
    answer: 'Yes. France observes daylight saving time following EU rules. Clocks go forward 1 hour on the last Sunday in March and back on the last Sunday in October.',
  },
  {
    question: 'What is the time difference between Paris and London?',
    answer: 'Paris is always 1 hour ahead of London. Both France and the UK change their clocks on the same dates, so the 1-hour difference between CET/GMT and CEST/BST is constant all year.',
  },
  {
    question: 'What is the time difference between Paris and New York?',
    answer: 'Paris (CET, UTC+1) is 6 hours ahead of New York (EST, UTC-5) in winter. During spring and summer transitions, the difference can briefly be 5 or 7 hours depending on clock-change dates.',
  },
  {
    question: 'What is the time difference between Paris and Dubai?',
    answer: 'Dubai (UTC+4) is 3 hours ahead of Paris in winter (CET, UTC+1) and 2 hours ahead in summer (CEST, UTC+2). Dubai does not observe DST.',
  },
  {
    question: 'What are business hours in Paris?',
    answer: 'Standard business hours in Paris are Monday to Friday, 9 AM to 6 PM CET/CEST. Lunch breaks (12–2 PM) are culturally important in France. Government offices often close at 5 PM.',
  },
  {
    question: 'What is the best time to call Paris from London?',
    answer: 'Any time during London business hours works well — Paris is only 1 hour ahead. A 9 AM start in London equals 10 AM in Paris, and both cities close around the same local time.',
  },
];

const BASE = 'https://myzonetime.com';
const TODAY = new Date().toISOString().split('T')[0];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['City', 'Place'],
      '@id': BASE + '/paris#city',
      name: 'Paris',
      url: BASE + '/paris',
      containedInPlace: { '@type': 'Country', name: 'France' },
      geo: { '@type': 'GeoCoordinates', latitude: 48.8566, longitude: 2.3522 },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Europe/Paris' },
        { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+1/UTC+2' },
        { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'CET/CEST' },
        { '@type': 'PropertyValue', name: 'Observes DST', value: 'Yes' },
      ],
    },
    {
      '@type': 'WebPage',
      '@id': BASE + '/paris#webpage',
      url: BASE + '/paris',
      name: 'Paris Time — Live Clock, CET/CEST | MyZoneTime',
      isPartOf: { '@id': BASE + '/#website' },
      publisher: { '@id': BASE + '/#organization' },
      about: { '@id': BASE + '/paris#city' },
      dateModified: TODAY,
      inLanguage: 'en',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Paris Time', item: BASE + '/paris' },
        ],
      },
    },
    {
      '@type': 'WebApplication',
      '@id': BASE + '/paris#webapp',
      name: 'Paris World Clock',
      url: BASE + '/paris',
      description: 'Live current time in Paris, France. CET/CEST (UTC+1/UTC+2). Accurate world clock with DST-aware time zone tools.',
      applicationCategory: 'UtilitiesApplication',
      applicationSubCategory: 'World Clock',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@id': BASE + '/#organization' },
      isPartOf: { '@id': BASE + '/#website' },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://myzonetime.com' },
    { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' },
    { '@type': 'ListItem', position: 3, name: 'Paris',       item: 'https://myzonetime.com/paris' },
  ],
};

export default function Paris() {
  const { time, formatTime } = useLocalTime(TIMEZONE);

  return (
    <main id="main-content" className="flex-1 w-full bg-background text-foreground">
      <Helmet>
        <title>Current Time in Paris, France — Live Clock CET/CEST | MyZoneTime</title>
        <meta name="description" content="Live clock for Paris, France. Central European Time (CET/CEST), UTC+1 or UTC+2 in summer. Current time, weather, business hours, and best time to call Paris." />
        <meta property="og:title" content="Current Time in Paris, France — CET/CEST | MyZoneTime" />
        <meta property="og:description" content="Live clock for Paris. CET (UTC+1) in winter, CEST (UTC+2) in summer." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="FR-75" />
        <meta name="geo.placename" content="Paris, France" />
        <meta name="geo.position" content="48.8566;2.3522" />
        <meta name="ICBM" content="48.8566, 2.3522" />
      </Helmet>
      <CanonicalTag pathname="/paris" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <section className="relative w-full py-20 flex flex-col items-center justify-center text-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-card/30 to-background" aria-hidden="true" />
        <div className="relative z-10 container max-w-3xl mx-auto space-y-6 px-4">
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>{FLAG} {CITY}, {COUNTRY} — {UTC_LABEL}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Current Time in <span className="text-primary">Paris</span>
          </h1>
          <div className="premium-card inline-flex flex-col items-center gap-2 px-10 py-6 rounded-3xl mx-auto" aria-live="polite" aria-label="Current time in Paris">
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
              <Link to="/timezone-converter?from=Europe/Paris"><ArrowRightLeft className="w-4 h-4 mr-2" />Convert Paris Time</Link>
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

      <section className="py-16 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold">Paris Time Zone Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Time Zone Name',    value: 'Central European Time (CET)' },
              { label: 'Winter UTC Offset', value: 'UTC+1 (CET) — late Oct to late Mar' },
              { label: 'Summer UTC Offset', value: 'UTC+2 (CEST) — late Mar to late Oct' },
              { label: 'DST Change',        value: 'Last Sunday in March / Last Sunday in October' },
              { label: 'IANA Identifier',   value: 'Europe/Paris' },
              { label: 'Same offset as',    value: 'Berlin, Amsterdam, Madrid, Rome, Oslo, Brussels' },
              { label: 'Business Hours',    value: 'Mon–Fri, 9:00 AM – 6:00 PM CET/CEST' },
              { label: 'Currency',          value: 'Euro (EUR)' },
            ].map(({ label, value }) => (
              <div key={label} className="premium-card p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-bold">Compare Paris Time with Other Cities</h2>
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

      <section className="py-16 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold text-foreground">About Paris's Time Zone</h2>
          <p>Paris, the capital of France and a global hub for fashion, finance, and diplomacy, uses <strong className="text-foreground">Central European Time (CET, UTC+1)</strong> in winter and <strong className="text-foreground">Central European Summer Time (CEST, UTC+2)</strong> in summer. France follows EU-wide daylight saving rules, changing clocks on the last Sunday in March and October.</p>
          <p>Paris is always <strong className="text-foreground">exactly 1 hour ahead of London</strong> — an exceptionally convenient gap for the two cities' significant economic relationship. Paris also shares its time zone with Berlin, Madrid, Rome, Amsterdam, and Brussels, giving it seamless connectivity across Western and Central Europe.</p>
          <p>The Paris Stock Exchange (Euronext Paris) trades <strong className="text-foreground">9 AM to 5:30 PM CET/CEST</strong>. French business culture typically includes a 1–2 hour lunch break, making the morning and late afternoon the most productive windows for meetings.</p>
          <p>From New York (EST), Paris is 6 hours ahead — a <strong className="text-foreground">2 PM–5 PM Paris window (8 AM–11 AM New York)</strong> works well for transatlantic calls.</p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
      </div>

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
