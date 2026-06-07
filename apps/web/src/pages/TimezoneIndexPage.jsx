/**
 * TimezoneIndexPage.jsx
 * Route: /timezone  — lists all timezone pages for SEO crawlability
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { TIMEZONE_DATA } from '@/data/timezoneData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function TimezoneIndexPage() {
  const timezones = Object.entries(TIMEZONE_DATA);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'All Time Zones — MyZoneTime',
        url: 'https://myzonetime.com/timezone',
        description: 'Browse all major time zones with UTC offsets, current times, countries, cities, and DST rules.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
          { '@type': 'ListItem', position: 2, name: 'Time Zones', item: 'https://myzonetime.com/timezone' },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>All Time Zones — UTC Offsets, Countries & DST Rules | MyZoneTime</title>
        <meta name="description" content="Browse every major time zone: UTC, GMT, EST, CST, PST, IST, GST, CET, JST and more. See UTC offsets, which countries use each zone, DST rules, and current local time." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="All Time Zones — UTC Offsets & DST Rules | MyZoneTime" />
        <meta property="og:description" content="Explore every major time zone with current times, UTC offsets, countries, and DST schedules." />
        <meta property="og:url" content="https://myzonetime.com/timezone" />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/timezone" />
      <StructuredData schema={schema} />

      <main className="flex-1 w-full bg-background text-foreground" id="main-content">
        <section className="w-full py-16 border-b border-border/40 bg-gradient-to-b from-card/50 to-background">
          <div className="container max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Globe className="w-4 h-4" /> Time Zone Reference
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">All Time Zones</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse every major world time zone. Find UTC offsets, which countries observe each zone, DST rules, and live current times.
            </p>
          </div>
        </section>

        <section className="container max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timezones.map(([key, tz]) => (
              <Link
                key={key}
                to={`/timezone/${key}`}
                className="flex flex-col gap-2 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{tz.abbr}</span>
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-full">{tz.utcLabel}</span>
                </div>
                <p className="text-sm font-medium">{tz.fullName}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{tz.cities.slice(0, 3).join(', ')}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{tz.dst ? 'DST observed' : 'No DST'}</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
