/**
 * Bangkok.jsx — Current Time in Bangkok, Thailand
 * Indochina Time (ICT), UTC+7. No DST.
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

const TIMEZONE  = 'Asia/Bangkok';
const CITY      = 'Bangkok';
const COUNTRY   = 'Thailand';
const UTC_LABEL = 'UTC+7 (ICT)';
const FLAG      = '🇹🇭';

const relatedCities = [
  { name: 'Singapore',     path: '/singapore',    tz: 'Asia/Singapore',    utc: 'UTC+8' },
  { name: 'Kuala Lumpur',  path: '/kuala-lumpur', tz: 'Asia/Kuala_Lumpur', utc: 'UTC+8' },
  { name: 'Dubai',         path: '/dubai',         tz: 'Asia/Dubai',        utc: 'UTC+4' },
  { name: 'London',        path: '/london',        tz: 'Europe/London',     utc: 'UTC+0/+1' },
];

const timeDiffLinks = [
  { label: 'Bangkok vs London', path: '/time-difference/london-bangkok' },
];

const faqs = [
  {
    question: 'What time zone is Bangkok in?',
    answer: 'Bangkok uses Indochina Time (ICT), which is UTC+7. Thailand does not observe daylight saving time, so the offset is fixed at UTC+7 all year round.',
  },
  {
    question: 'Does Thailand observe daylight saving time?',
    answer: 'No. Thailand does not observe daylight saving time. Bangkok remains at UTC+7 (ICT) year-round with no seasonal clock changes.',
  },
  {
    question: 'What is the time difference between Bangkok and London?',
    answer: 'Bangkok (UTC+7) is 7 hours ahead of London in winter (GMT, UTC+0) and 6 hours ahead during British Summer Time (BST, UTC+1) from late March to late October.',
  },
  {
    question: 'What is the time difference between Bangkok and Singapore?',
    answer: 'Singapore (UTC+8) is 1 hour ahead of Bangkok (UTC+7). This difference is constant year-round as neither country observes daylight saving time.',
  },
  {
    question: 'What is the time difference between Bangkok and Dubai?',
    answer: 'Bangkok (UTC+7) is 3 hours ahead of Dubai (UTC+4). This difference never changes as neither Thailand nor the UAE observes DST.',
  },
  {
    question: 'What are business hours in Bangkok?',
    answer: 'Standard business hours in Bangkok are Monday to Friday, 8:30 AM to 5:30 PM ICT (UTC+7). Government offices typically close by 4:30 PM. The Thai work week is Monday to Friday.',
  },
  {
    question: 'What is the best time to call Bangkok from London?',
    answer: 'The best time to call Bangkok from London is 8 AM–11 AM London time (3 PM–6 PM Bangkok). In summer (BST), 9 AM–11 AM London equals 3 PM–5 PM Bangkok.',
  },
];

const schema = {
  '@type': 'WebPage',
  name: 'Current Time in Bangkok, Thailand',
  url: 'https://myzonetime.com/bangkok',
  description: 'Live clock and time zone info for Bangkok, Thailand. Indochina Time (ICT), UTC+7. No daylight saving.',
  about: { '@type': 'City', name: 'Bangkok', containedInPlace: { '@type': 'Country', name: 'Thailand' } },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://myzonetime.com' },
    { '@type': 'ListItem', position: 2, name: 'World Clock', item: 'https://myzonetime.com/world-clock' },
    { '@type': 'ListItem', position: 3, name: 'Bangkok',     item: 'https://myzonetime.com/bangkok' },
  ],
};

export default function Bangkok() {
  const { time, formatTime } = useLocalTime(TIMEZONE);

  return (
    <main id="main-content" className="flex-1 w-full bg-background text-foreground">
      <Helmet>
        <title>Bangkok Time — Live Clock, ICT UTC+7 | MyZoneTime</title>
        <meta name="description" content="Live clock for Bangkok, Thailand. Indochina Time (ICT), UTC+7. No daylight saving. Current time, weather, business hours, and best time to call Bangkok." />
        <meta property="og:title" content="Current Time in Bangkok, Thailand — UTC+7 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Bangkok. Indochina Time (ICT), UTC+7. No DST." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="TH-10" />
        <meta name="geo.placename" content="Bangkok, Thailand" />
        <meta name="geo.position" content="13.7563;100.5018" />
        <meta name="ICBM" content="13.7563, 100.5018" />
      </Helmet>
      <CanonicalTag pathname="/bangkok" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <section className="relative w-full py-20 flex flex-col items-center justify-center text-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-card/30 to-background" aria-hidden="true" />
        <div className="relative z-10 container max-w-3xl mx-auto space-y-6 px-4">
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>{FLAG} {CITY}, {COUNTRY} — {UTC_LABEL}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Current Time in <span className="text-primary">Bangkok</span>
          </h1>
          <div className="premium-card inline-flex flex-col items-center gap-2 px-10 py-6 rounded-3xl mx-auto" aria-live="polite" aria-label="Current time in Bangkok">
            <time dateTime={time?.toISOString()} className="font-mono-time text-6xl md:text-8xl font-bold text-primary tabular-nums tracking-tight">
              {formatTime(time, TIMEZONE, false, false)}
            </time>
            <p className="text-muted-foreground text-lg font-medium">
              {time ? time.toLocaleDateString('en-US', { timeZone: TIMEZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </p>
            <span className="text-xs text-muted-foreground bg-secondary/20 px-3 py-1 rounded-full mt-1">
              Indochina Time (ICT) · UTC+7 · No DST
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="rounded-full px-6">
              <Link to="/timezone-converter?from=Asia/Bangkok"><ArrowRightLeft className="w-4 h-4 mr-2" />Convert Bangkok Time</Link>
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
          <h2 className="text-2xl md:text-3xl font-bold">Bangkok Time Zone Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Time Zone Name',  value: 'Indochina Time (ICT)' },
              { label: 'UTC Offset',      value: 'UTC+7 (fixed, year-round)' },
              { label: 'Daylight Saving', value: 'None — Thailand does not observe DST' },
              { label: 'IANA Identifier', value: 'Asia/Bangkok' },
              { label: 'Same offset as',  value: 'Jakarta, Ho Chi Minh City, Hanoi, Phnom Penh' },
              { label: 'Business Week',   value: 'Monday – Friday' },
              { label: 'Business Hours',  value: '8:30 AM – 5:30 PM ICT' },
              { label: 'Currency',        value: 'Thai Baht (THB)' },
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
          <h2 className="text-2xl font-bold">Compare Bangkok Time with Other Cities</h2>
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
          <h2 className="text-2xl font-bold text-foreground">About Bangkok's Time Zone</h2>
          <p>Bangkok, Thailand's capital and largest city, operates on <strong className="text-foreground">Indochina Time (ICT, UTC+7)</strong>. Thailand has never observed daylight saving time, making Bangkok's offset predictable and constant year-round — a significant convenience for international business scheduling.</p>
          <p>Bangkok shares ICT with several Southeast Asian neighbours including Ho Chi Minh City, Hanoi, Phnom Penh, and Vientiane. Singapore and Kuala Lumpur are 1 hour ahead (UTC+8), while Jakarta is on the same offset (UTC+7).</p>
          <p>For teams coordinating with Bangkok from London, the sweet spot is <strong className="text-foreground">8–11 AM London time (3–6 PM Bangkok)</strong>. From Dubai (UTC+4), Bangkok is 3 hours ahead — a 9 AM Dubai start equals noon in Bangkok, providing excellent morning overlap.</p>
          <p>The Stock Exchange of Thailand (SET) trades <strong className="text-foreground">10 AM to 12:30 PM and 2:30 PM to 4:30 PM ICT</strong> on weekdays.</p>
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
