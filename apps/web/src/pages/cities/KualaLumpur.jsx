/**
 * KualaLumpur.jsx — Current Time in Kuala Lumpur, Malaysia
 * Malaysia Time (MYT), UTC+8. No DST. Same offset as Singapore.
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

const TIMEZONE  = 'Asia/Kuala_Lumpur';
const CITY      = 'Kuala Lumpur';
const COUNTRY   = 'Malaysia';
const UTC_LABEL = 'UTC+8 (MYT)';
const FLAG      = '🇲🇾';

const relatedCities = [
  { name: 'Singapore',  path: '/singapore', tz: 'Asia/Singapore',    utc: 'UTC+8' },
  { name: 'Bangkok',    path: '/bangkok',   tz: 'Asia/Bangkok',      utc: 'UTC+7' },
  { name: 'Dubai',      path: '/dubai',     tz: 'Asia/Dubai',        utc: 'UTC+4' },
  { name: 'London',     path: '/london',    tz: 'Europe/London',     utc: 'UTC+0/+1' },
];

const timeDiffLinks = [
  { label: 'KL vs London', path: '/time-difference/london-kuala-lumpur' },
];

const faqs = [
  {
    question: 'What time zone is Kuala Lumpur in?',
    answer: 'Kuala Lumpur uses Malaysia Time (MYT), which is UTC+8. Malaysia does not observe daylight saving time — the offset is fixed at UTC+8 all year.',
  },
  {
    question: 'Is Kuala Lumpur in the same time zone as Singapore?',
    answer: 'Yes. Kuala Lumpur and Singapore share the same UTC+8 offset. Malaysian Time (MYT) and Singapore Standard Time (SGT) are equivalent. Neither country observes DST.',
  },
  {
    question: 'What is the time difference between Kuala Lumpur and London?',
    answer: 'Kuala Lumpur (UTC+8) is 8 hours ahead of London in winter (GMT, UTC+0) and 7 hours ahead during British Summer Time (BST, UTC+1) from late March to late October.',
  },
  {
    question: 'What is the time difference between Kuala Lumpur and Dubai?',
    answer: 'Kuala Lumpur (UTC+8) is 4 hours ahead of Dubai (UTC+4). This difference is constant year-round as neither Malaysia nor the UAE observes daylight saving time.',
  },
  {
    question: 'What is the time difference between Kuala Lumpur and Bangkok?',
    answer: 'Kuala Lumpur (UTC+8) is 1 hour ahead of Bangkok (UTC+7). This difference never changes as neither Malaysia nor Thailand observes DST.',
  },
  {
    question: 'What are business hours in Kuala Lumpur?',
    answer: 'Standard business hours in Kuala Lumpur are Monday to Friday, 9 AM to 6 PM MYT (UTC+8). Some government departments work Monday to Thursday 8 AM–4:30 PM and Friday 8 AM–12:30 PM.',
  },
  {
    question: 'What is the best time to call Kuala Lumpur from London?',
    answer: 'The best time is 8–10 AM London time (4–6 PM Kuala Lumpur). During BST, 9 AM–11 AM London equals 4–6 PM KL. This keeps both sides within business hours.',
  },
];

const schema = {
  '@type': 'WebPage',
  name: 'Current Time in Kuala Lumpur, Malaysia',
  url: 'https://myzonetime.com/kuala-lumpur',
  description: 'Live clock and time zone info for Kuala Lumpur, Malaysia. Malaysia Time (MYT), UTC+8. No DST.',
  about: { '@type': 'City', name: 'Kuala Lumpur', containedInPlace: { '@type': 'Country', name: 'Malaysia' } },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://myzonetime.com' },
    { '@type': 'ListItem', position: 2, name: 'World Clock',   item: 'https://myzonetime.com/world-clock' },
    { '@type': 'ListItem', position: 3, name: 'Kuala Lumpur',  item: 'https://myzonetime.com/kuala-lumpur' },
  ],
};

export default function KualaLumpur() {
  const { time, formatTime } = useLocalTime(TIMEZONE);

  return (
    <main id="main-content" className="flex-1 w-full bg-background text-foreground">
      <Helmet>
        <title>Kuala Lumpur Time — Live Clock, MYT UTC+8 | MyZoneTime</title>
        <meta name="description" content="Live clock for Kuala Lumpur, Malaysia. Malaysia Time (MYT), UTC+8. No daylight saving. Current time, weather, business hours, and best time to call KL." />
        <meta property="og:title" content="Current Time in Kuala Lumpur, Malaysia — UTC+8 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Kuala Lumpur. Malaysia Time (MYT), UTC+8. No DST." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="MY-14" />
        <meta name="geo.placename" content="Kuala Lumpur, Malaysia" />
        <meta name="geo.position" content="3.1390;101.6869" />
        <meta name="ICBM" content="3.1390, 101.6869" />
      </Helmet>
      <CanonicalTag pathname="/kuala-lumpur" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <section className="relative w-full py-20 flex flex-col items-center justify-center text-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-card/30 to-background" aria-hidden="true" />
        <div className="relative z-10 container max-w-3xl mx-auto space-y-6 px-4">
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>{FLAG} {CITY}, {COUNTRY} — {UTC_LABEL}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Current Time in <span className="text-primary">Kuala Lumpur</span>
          </h1>
          <div className="premium-card inline-flex flex-col items-center gap-2 px-10 py-6 rounded-3xl mx-auto" aria-live="polite" aria-label="Current time in Kuala Lumpur">
            <time dateTime={time?.toISOString()} className="font-mono-time text-6xl md:text-8xl font-bold text-primary tabular-nums tracking-tight">
              {formatTime(time, TIMEZONE, false, false)}
            </time>
            <p className="text-muted-foreground text-lg font-medium">
              {time ? time.toLocaleDateString('en-US', { timeZone: TIMEZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </p>
            <span className="text-xs text-muted-foreground bg-secondary/20 px-3 py-1 rounded-full mt-1">
              Malaysia Time (MYT) · UTC+8 · No DST
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="rounded-full px-6">
              <Link to="/timezone-converter?from=Asia/Kuala_Lumpur"><ArrowRightLeft className="w-4 h-4 mr-2" />Convert KL Time</Link>
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
          <h2 className="text-2xl md:text-3xl font-bold">Kuala Lumpur Time Zone Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Time Zone Name',  value: 'Malaysia Time (MYT)' },
              { label: 'UTC Offset',      value: 'UTC+8 (fixed, year-round)' },
              { label: 'Daylight Saving', value: 'None — Malaysia does not observe DST' },
              { label: 'IANA Identifier', value: 'Asia/Kuala_Lumpur' },
              { label: 'Same offset as',  value: 'Singapore, Hong Kong, Perth, Taipei, Beijing' },
              { label: 'Business Week',   value: 'Monday – Friday (some states: Sun–Thu)' },
              { label: 'Business Hours',  value: '9:00 AM – 6:00 PM MYT' },
              { label: 'Currency',        value: 'Malaysian Ringgit (MYR)' },
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
          <h2 className="text-2xl font-bold">Compare Kuala Lumpur Time with Other Cities</h2>
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
          <h2 className="text-2xl font-bold text-foreground">About Kuala Lumpur's Time Zone</h2>
          <p>Kuala Lumpur, Malaysia's federal capital and largest city, operates on <strong className="text-foreground">Malaysia Time (MYT, UTC+8)</strong>. Malaysia has not observed daylight saving time since the 1930s, making scheduling across time zones simple and predictable.</p>
          <p>Kuala Lumpur shares its UTC+8 offset with <strong className="text-foreground">Singapore, Hong Kong, Perth, Taipei, and Beijing</strong> — a large economic corridor where scheduling is effortless. It is 1 hour ahead of Bangkok (UTC+7) and 4 hours ahead of Dubai (UTC+4).</p>
          <p>Note that some Malaysian states — Kelantan, Terengganu, Johor, Kedah, and Perlis — observe a Friday/Saturday weekend rather than Saturday/Sunday, reflecting local Islamic governance. Kuala Lumpur (federal territory) follows the standard Monday–Friday week.</p>
          <p>The Bursa Malaysia stock exchange trades <strong className="text-foreground">9 AM to 12:30 PM and 2:30 PM to 5 PM MYT</strong> on weekdays. For London teams, the best window to call KL is <strong className="text-foreground">8–10 AM London time (4–6 PM KL)</strong>.</p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
      </div>

      <TimezoneAuthoritySection cityName="Kuala Lumpur" timezoneKey="sgt" />
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

