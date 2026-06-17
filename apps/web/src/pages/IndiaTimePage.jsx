/**
 * IndiaTimePage.jsx — Route: /india-time
 * Targets: "india time", "indian time", "time in india", "ist time"
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Globe2, MapPin, ArrowRight, Calendar } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

const BASE = 'https://myzonetime.com';
const IST_CITIES = ['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

const COMPARE_CITIES = [
  { name: 'London', tz: 'Europe/London', diffWinter: '5h 30m ahead', diffSummer: '4h 30m ahead' },
  { name: 'New York', tz: 'America/New_York', diffWinter: '10h 30m ahead', diffSummer: '9h 30m ahead' },
  { name: 'Dubai', tz: 'Asia/Dubai', diffWinter: '1h 30m ahead', diffSummer: '1h 30m ahead' },
  { name: 'Singapore', tz: 'Asia/Singapore', diffWinter: '2h 30m behind', diffSummer: '2h 30m behind' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', diffWinter: '3h 30m behind', diffSummer: '3h 30m behind' },
  { name: 'Sydney', tz: 'Australia/Sydney', diffWinter: '4h 30m behind', diffSummer: '5h 30m behind' },
];

function useISTClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    const update = () => {
      try {
        const now = new Date();
        setTime(new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        }).format(now));
        setDate(new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        }).format(now));
      } catch { setTime('--:--:--'); }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return { time, date };
}

const INDIA_FAQS = [
  {
    question: 'What is the current time in India right now?',
    answer: 'India follows a single national time zone called India Standard Time (IST), which is UTC+5:30. This applies across the entire country — from Mumbai to Kolkata, Delhi to Chennai — regardless of the time zone widget above showing the live current time in India.',
  },
  {
    question: 'What is IST time?',
    answer: 'IST stands for India Standard Time, fixed at UTC+5:30 — five hours and thirty minutes ahead of Coordinated Universal Time. It is one of only a handful of time zones in the world that uses a half-hour offset instead of a full hour. IST was officially adopted in 1947 and applies uniformly across all of India.',
  },
  {
    question: 'Why is Indian time 30 minutes off from other time zones?',
    answer: 'India spans roughly 30 degrees of longitude — wide enough to naturally cover two time zones. Instead of splitting the country, India adopted a single time zone at UTC+5:30, a compromise between the calculations for Mumbai in the west and Kolkata in the east. This half-hour offset (UTC+5:30 rather than UTC+5 or UTC+6) balances daylight hours across the country.',
  },
  {
    question: 'Does India observe daylight saving time?',
    answer: 'No. India does not observe daylight saving time (DST). Indian Standard Time remains fixed at UTC+5:30 throughout the entire year, with no seasonal clock changes. This makes calculating the time difference between India and other countries simpler in some ways, since only the other country\'s DST status changes the gap.',
  },
  {
    question: 'What is the time difference between India and the United States?',
    answer: 'India Standard Time (UTC+5:30) is 10 hours and 30 minutes ahead of US Eastern Time (EST, UTC-5) in winter, and 9 hours 30 minutes ahead during Eastern Daylight Time (EDT, UTC-4) in summer. For US Pacific Time, the gap is 13 hours 30 minutes in winter and 12 hours 30 minutes in summer.',
  },
  {
    question: 'What is the time difference between India and the UK?',
    answer: 'India Standard Time is 5 hours 30 minutes ahead of GMT (UK winter time) and 4 hours 30 minutes ahead of BST (UK summer time). When it is 12:00 PM in London during winter, it is 5:30 PM in India.',
  },
  {
    question: 'What is the time difference between India and Dubai?',
    answer: 'India Standard Time (UTC+5:30) is 1 hour 30 minutes ahead of Gulf Standard Time in Dubai (UTC+4). When it is 10:00 AM in Dubai, it is 11:30 AM in India. This offset stays constant year-round since neither India nor the UAE observes daylight saving time.',
  },
  {
    question: 'What time zone do Mumbai and Delhi use?',
    answer: 'Both Mumbai and Delhi use India Standard Time (IST, UTC+5:30) — the single time zone used across all of India. There is no time difference between any two cities within India, regardless of how far apart they are geographically.',
  },
];

export default function IndiaTimePage() {
  const { time, date } = useISTClock();
  const TODAY = new Date().toISOString().split('T')[0];

  const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${BASE}/india-time#webpage`,
    url: `${BASE}/india-time`,
    name: 'Current Time in India — IST Time Now (UTC+5:30) | MyZoneTime',
    description: 'Current time in India right now. India Standard Time (IST, UTC+5:30) — live clock, time difference to US, UK, Dubai, and more. No daylight saving.',
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#organization` },
    dateModified: TODAY,
    inLanguage: 'en',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'India Time', item: `${BASE}/india-time` },
      ],
    },
  };

  const webAppSchema = {
    '@type': 'WebApplication',
    '@id': `${BASE}/india-time#webapp`,
    name: 'India Time — Live IST Clock',
    url: `${BASE}/india-time`,
    description: 'Live current time in India (IST, UTC+5:30). Time difference calculator to major world cities.',
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'World Clock',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@id': `${BASE}/#organization` },
    isPartOf: { '@id': `${BASE}/#website` },
  };

  const placeSchema = {
    '@type': ['Country', 'Place'],
    '@id': `${BASE}/india-time#place`,
    name: 'India',
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Asia/Kolkata' },
      { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+5:30' },
      { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'IST' },
      { '@type': 'PropertyValue', name: 'Observes DST', value: 'No' },
    ],
  };

  return (
    <>
      <CanonicalTag pathname="/india-time" />
      <Helmet>
        <title>India Time Now — Current Time in India (IST UTC+5:30) | MyZoneTime</title>
        <meta name="description" content="What time is it in India right now? Live India Standard Time (IST, UTC+5:30) clock. Indian time difference to US, UK, Dubai, Singapore and more. No DST." />
        <meta property="og:title" content="India Time Now — Current IST Time | MyZoneTime" />
        <meta property="og:description" content="Live current time in India. IST (UTC+5:30), no daylight saving. Compare Indian time to any city worldwide." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <StructuredData schemas={[webPageSchema, webAppSchema, placeSchema]} />

      <main id="main-content" className="min-h-screen bg-background">

        {/* Hero — live clock */}
        <section className="relative py-14 md:py-20 border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl bg-primary/15 rounded-full blur-[80px] opacity-40" />
          </div>
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-sm font-medium text-primary mb-6">
              <MapPin className="w-4 h-4" /> India · IST · UTC+5:30
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Current Time in India
            </h1>
            <div className="text-6xl md:text-7xl font-mono font-bold tabular-nums text-primary mb-3">
              {time || '--:--:--'}
            </div>
            <p className="text-lg text-muted-foreground mb-2">{date}</p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              India Standard Time (IST) — UTC+5:30, used uniformly across the entire country with no daylight saving time.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <AdSenseAd slot={AD_SLOTS.HOME_BANNER} format="horizontal" minHeight={90} />
          </div>
        </section>

        {/* Major Indian cities */}
        <section className="py-12 border-t border-border/40">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-6">Indian Time Across Major Cities</h2>
            <p className="text-muted-foreground mb-6">
              All Indian cities share the exact same time — India Standard Time (IST). Unlike large countries such as the US or Russia, India uses a single time zone nationwide.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {IST_CITIES.map(city => (
                <div key={city} className="premium-card p-4 text-center">
                  <div className="font-semibold text-sm">{city}</div>
                  <div className="text-xs text-muted-foreground mt-1">IST · UTC+5:30</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Time difference table */}
        <section className="py-12 border-t border-border/40 bg-muted/10">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-6">Indian Time Difference to Major Cities</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-3 font-semibold">City</th>
                    <th className="text-left py-3 px-3 font-semibold">Winter Difference</th>
                    <th className="text-left py-3 px-3 font-semibold">Summer Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_CITIES.map(c => (
                    <tr key={c.name} className="border-b border-border/30">
                      <td className="py-3 px-3 font-medium">{c.name}</td>
                      <td className="py-3 px-3 text-muted-foreground">India is {c.diffWinter}</td>
                      <td className="py-3 px-3 text-muted-foreground">India is {c.diffSummer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              India does not observe daylight saving time, so any seasonal change in the difference is caused entirely by the other country's DST transition, not India's.
            </p>
          </div>
        </section>

        {/* About IST */}
        <section className="py-12 border-t border-border/40">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 prose prose-sm max-w-none text-muted-foreground space-y-4">
            <h2 className="text-2xl font-bold text-foreground">About India Standard Time (IST)</h2>
            <p>
              India Standard Time is the single time zone observed across the entire Republic of India, set at UTC+5:30 — five hours and thirty minutes ahead of Coordinated Universal Time. It is one of the few time zones in the world that uses a half-hour offset rather than a full hour, alongside places like Iran, Afghanistan, and parts of Australia.
            </p>
            <p>
              The unusual half-hour offset exists because India spans approximately 30 degrees of longitude — wide enough to naturally justify two separate time zones. Rather than splitting the country, India adopted a single compromise time in 1947, balancing the needs of the easternmost region (closer to UTC+6) and the westernmost region (closer to UTC+5).
            </p>
            <p>
              India has never observed daylight saving time. This means IST remains fixed at UTC+5:30 throughout the entire calendar year — a useful, predictable reference point when scheduling meetings or calls with Indian colleagues, clients, or family.
            </p>
          </div>
        </section>

        <FAQSection faqs={INDIA_FAQS} title="India Time — Frequently Asked Questions" />

</main>
    </>
  );
}
