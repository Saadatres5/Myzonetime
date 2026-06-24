/**
 * DynamicCityPage.jsx
 * Universal programmatic city page — renders any city from cityPageData.js.
 * Route: /:citySlug  (matched by App.jsx after known static routes)
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Globe, ArrowRight, Sun, Info } from 'lucide-react';
import { getCityData } from '@/data/cityPageData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import CityPage from './CityPage.jsx';

function buildSchema(city, slug, faqs) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'City',
        name: city.name,
        containedInPlace: { '@type': 'Country', name: city.country },
        url: `https://myzonetime.com/${slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
          { '@type': 'ListItem', position: 2, name: `${city.name} Time`, item: `https://myzonetime.com/${slug}` },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `https://myzonetime.com/${slug}#webpage`,
        url: `https://myzonetime.com/${slug}`,
        name: `${city.name} Time — Live Clock ${city.tz} | MyZoneTime`,
        isPartOf: { '@id': 'https://myzonetime.com/#website' },
        publisher: { '@id': 'https://myzonetime.com/#organization' },
        about: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'Country', name: city.country } },
        inLanguage: 'en',
        dateModified: new Date().toISOString().split('T')[0],
      },
      {
        '@type': 'WebApplication',
        '@id': `https://myzonetime.com/${slug}#webapp`,
        name: `${city.name} World Clock`,
        url: `https://myzonetime.com/${slug}`,
        applicationCategory: 'UtilitiesApplication',
        applicationSubCategory: 'World Clock',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@id': 'https://myzonetime.com/#organization' },
        isPartOf: { '@id': 'https://myzonetime.com/#website' },
      },
    ],
  };
}

export default function DynamicCityPage() {
  const { citySlug } = useParams();
  const city = getCityData(citySlug);

  // Redirect unknown slugs to 404
  if (!city) return <Navigate to="/404" replace />;

  const faqs = city.faqs.map(f => ({ question: f.q, answer: f.a }));
  const schema = buildSchema(city, citySlug, faqs);

  const title = `Current Time in ${city.name} — ${city.country} (${city.utcLabel}) | MyZoneTime`;
  const description = `Check the current local time in ${city.name}, ${city.country}. View live clock, ${city.tzName} (${city.tzAbbr}), UTC offset ${city.utcLabel}, ${city.dst ? 'daylight saving time info,' : 'no daylight saving,'} and time zone details.`;
  const canonicalUrl = `https://myzonetime.com/${citySlug}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content={city.geoRegion} />
        <meta name="geo.placename" content={`${city.name}, ${city.country}`} />
        <meta name="geo.position" content={`${city.lat};${city.lon}`} />
        <meta name="ICBM" content={`${city.lat}, ${city.lon}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <CanonicalTag pathname={`/${citySlug}`} />
      <StructuredData schema={schema} />
      <CityPage
        city={city.name}
        country={city.country}
        timezone={city.timezone}
        lat={city.lat}
        lon={city.lon}
        currency={city.currency}
        pathname={`/${citySlug}`}
        description={city.heroDescription}
      >
        {/* City overview */}
        <section className="py-10 border-t border-border/40">
          <div className="container max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">About {city.name} Time Zone</h2>
            <p className="text-muted-foreground leading-relaxed">{city.overview}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="rounded-xl bg-card border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">UTC Offset</p>
                <p className="font-bold text-primary">{city.utcLabel}</p>
              </div>
              <div className="rounded-xl bg-card border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Timezone</p>
                <p className="font-bold">{city.tzAbbr}</p>
              </div>
              <div className="rounded-xl bg-card border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">DST</p>
                <p className="font-bold">{city.dst ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-xl bg-card border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Currency</p>
                <p className="font-bold">{city.currency}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related cities internal links */}
        {city.relatedCities?.length > 0 && (
          <section className="py-10 border-t border-border/40">
            <div className="container max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Time in Related Cities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {city.relatedCities.map(slug => {
                  const rel = getCityData(slug);
                  const label = rel ? rel.name : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  return (
                    <Link
                      key={slug}
                      to={`/${slug}`}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm font-medium"
                    >
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Time difference links */}
        <section className="py-10 border-t border-border/40">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Time Difference from {city.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(city.relatedCities || []).slice(0, 6).map(slug => {
                const rel = getCityData(slug);
                const label = rel ? rel.name : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <Link
                    key={slug}
                    to={`/time-difference/${citySlug}-and-${slug}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <span>{city.name} vs {label}</span>
                    <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tools links */}
        <section className="py-10 border-t border-border/40">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Tools for {city.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/timezone-converter" className="flex flex-col gap-2 px-4 py-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Timezone Converter</span>
                <span className="text-xs text-muted-foreground">Convert {city.name} time to any city</span>
              </Link>
              <Link to="/meeting-planner" className="flex flex-col gap-2 px-4 py-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Sun className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Meeting Planner</span>
                <span className="text-xs text-muted-foreground">Find overlap with {city.name}</span>
              </Link>
              <Link to="/world-clock" className="flex flex-col gap-2 px-4 py-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Info className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">World Clock</span>
                <span className="text-xs text-muted-foreground">Compare {city.name} with 500+ cities</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About the {city.name} Time Zone</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {city.name} is in the <strong className="text-foreground">{city.timezone}</strong> time zone. The current UTC offset is displayed at the top of this page and updates automatically to reflect any daylight saving time changes. All times shown are sourced from the IANA Time Zone Database — the same standard used by operating systems, browsers, and programming languages worldwide — ensuring accuracy for every city, every day of the year.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Use the tools above to convert {city.name} time to any other city, plan meetings across time zones, or compare {city.name} alongside other cities on the world clock. All tools are free, require no signup, and work directly in your browser.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Scheduling Across Time Zones</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Working across time zones requires knowing not just the current offset, but also whether daylight saving time applies and when transitions occur. A city might be UTC+1 in winter and UTC+2 in summer — meaning the gap between it and a non-DST city changes by an hour twice a year. This is why it's important to use a DST-aware tool like MyZoneTime rather than relying on a fixed offset.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For international teams, the most practical approach is to identify the overlapping business hours between your locations. Our Meeting Planner does exactly this — enter up to five cities and it highlights the hours when everyone is within their standard working day, making it easy to find a time that works for all participants without anyone having to join a call at an unusual hour.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">How to Read UTC Offsets</h2>
              <p className="text-muted-foreground leading-relaxed">
                A UTC offset like UTC+4 means the local time is 4 hours ahead of Coordinated Universal Time. UTC−5 means the local time is 5 hours behind UTC. When comparing two cities, subtract one offset from the other to get the time difference. For example, UTC+4 (Dubai) vs UTC−5 (New York) gives a difference of 9 hours — Dubai is 9 hours ahead of New York in winter. During summer, when New York moves to EDT (UTC−4), the gap shrinks to 8 hours. Always check whether DST is currently active before assuming a fixed offset applies.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} includeSchema={false} title={`${city.name} Time Zone — FAQ`} />
      </CityPage>
    </>
  );
}
