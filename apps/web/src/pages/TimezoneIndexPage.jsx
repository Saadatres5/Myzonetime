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
        <meta name="description" content="Browse every major time zone: UTC, GMT, EST, PST, IST, GST, CET, JST and more. See UTC offsets, DST rules, and current local time." />
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

        {/* SEO content */}
        <section className="py-14 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Understanding Time Zones</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A time zone is a region of the world that observes a uniform standard time for legal, commercial, and social purposes. The Earth is divided into 24 primary time zones, each roughly 15 degrees of longitude wide, corresponding to one hour of the day. However, the actual boundaries of time zones are determined by countries and regions for practical reasons — political borders, economic ties, and geographic convenience all influence where one zone ends and another begins.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All time zones are defined relative to Coordinated Universal Time (UTC), the world's primary time standard. Zones are expressed as UTC+ or UTC− followed by the number of hours (and sometimes minutes) of offset. For example, UTC+5:30 is used by India, and UTC−5 is used by the US East Coast in winter.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Daylight Saving Time (DST) Explained</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Many countries shift their clocks forward by one hour in spring and back by one hour in autumn to make better use of natural daylight during longer summer days. This practice, known as Daylight Saving Time (DST) or Summer Time, effectively moves an hour of morning daylight to the evening.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Not all countries observe DST. Major countries that do <strong className="text-foreground">not</strong> use daylight saving include: the UAE, Saudi Arabia, Qatar, Japan, China, India, Singapore, and most of Africa. Countries that do observe DST include the United States, Canada, most of Europe, Australia, New Zealand, and parts of South America.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The dates of DST transitions differ between regions. The US switches clocks on the second Sunday of March and first Sunday of November. The EU uses the last Sunday of March and last Sunday of October. Australia's DST runs in reverse (spring is October, autumn is April). These differences mean the gap between two cities can change by 1–2 hours several times a year, depending on which DST rules apply to each.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Common Time Zone Abbreviations</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold">Abbreviation</th>
                      <th className="text-left py-2 pr-4 font-semibold">Full Name</th>
                      <th className="text-left py-2 font-semibold">UTC Offset</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">GMT</td><td className="py-2 pr-4">Greenwich Mean Time</td><td className="py-2">UTC+0</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">UTC</td><td className="py-2 pr-4">Coordinated Universal Time</td><td className="py-2">UTC+0</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">EST / EDT</td><td className="py-2 pr-4">Eastern Standard / Daylight Time</td><td className="py-2">UTC−5 / UTC−4</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">CST / CDT</td><td className="py-2 pr-4">Central Standard / Daylight Time</td><td className="py-2">UTC−6 / UTC−5</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">PST / PDT</td><td className="py-2 pr-4">Pacific Standard / Daylight Time</td><td className="py-2">UTC−8 / UTC−7</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">CET / CEST</td><td className="py-2 pr-4">Central European (Summer) Time</td><td className="py-2">UTC+1 / UTC+2</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">GST</td><td className="py-2 pr-4">Gulf Standard Time</td><td className="py-2">UTC+4</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">IST</td><td className="py-2 pr-4">India Standard Time</td><td className="py-2">UTC+5:30</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">SGT</td><td className="py-2 pr-4">Singapore Standard Time</td><td className="py-2">UTC+8</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">JST</td><td className="py-2 pr-4">Japan Standard Time</td><td className="py-2">UTC+9</td></tr>
                    <tr><td className="py-2 pr-4">AEST / AEDT</td><td className="py-2 pr-4">Australian Eastern (Daylight) Time</td><td className="py-2">UTC+10 / UTC+11</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">The IANA Time Zone Database</h2>
              <p className="text-muted-foreground leading-relaxed">
                The IANA Time Zone Database (also called the Olson database or tzdata) is the authoritative source for time zone rules used by virtually every operating system, programming language, and browser in the world. It contains historical and current rules for every time zone on Earth, including all past DST transitions and offset changes. MyZoneTime uses this database to ensure all clocks and conversions are accurate — including edge cases like Samoa's 2011 calendar skip, Morocco's Ramadan DST suspension, and Lord Howe Island's unusual 30-minute DST shift.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
