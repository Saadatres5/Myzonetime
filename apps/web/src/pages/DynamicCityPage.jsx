/**
 * DynamicCityPage.jsx
 * Universal programmatic city page — renders any city from cityPageData.js or worldCitiesData.js.
 * Route: /:citySlug  (matched by App.jsx after known static routes)
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Globe, ArrowRight, Sun, Info } from 'lucide-react';
import { getCityData } from '@/data/cityPageData.js';
import { citiesData as worldCitiesData } from '@/data/worldCitiesData.js';
import { TIMEZONE_DATA } from '@/data/timezoneData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import TimezoneAuthoritySection from '@/components/TimezoneAuthoritySection.jsx';
import CityPage from './CityPage.jsx';

function getWorldCityData(slug) {
  return worldCitiesData.find(city => city.id === slug) || null;
}

const TIMEZONE_IANA_TO_KEY = Object.entries(TIMEZONE_DATA).reduce((map, [key, value]) => {
  if (value?.ianaTz) map[value.ianaTz] = key;
  return map;
}, {});

function findTimezoneKeyByIana(ianaTz) {
  return TIMEZONE_IANA_TO_KEY[ianaTz] || null;
}

function getCityLabelFromSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getRelatedWorldCities(city, limit = 6) {
  return worldCitiesData
    .filter(c => c.timezone === city.timezone && c.id !== city.id)
    .slice(0, limit)
    .map(c => c.id);
}

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
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };
}

export default function DynamicCityPage() {
  const { citySlug } = useParams();
  const primaryCity = getCityData(citySlug);
  const city = primaryCity || getWorldCityData(citySlug);

  // Redirect unknown slugs to 404
  if (!city) return <Navigate to="/404" replace />;

  const fallbackFaqs = [
    { q: `What time zone is ${city.name} in?`, a: `${city.name} currently uses the ${city.timezone} time zone.` },
    { q: `What is the current local time in ${city.name}?`, a: `This page shows the live local time for ${city.name} based on its current time zone.` },
    { q: `Does ${city.name} observe daylight saving time?`, a: city.dst === true ? `Yes, ${city.name} uses daylight saving time seasonally.` : city.dst === false ? `No, ${city.name} does not observe daylight saving time.` : `Daylight saving rules vary by location; check the local time zone for ${city.name}.` },
  ];

  const tzKey = findTimezoneKeyByIana(city.timezone);
  const timezoneInfo = tzKey ? TIMEZONE_DATA[tzKey] : null;
  const relatedCities = city.relatedCities?.slice(0, 6) || getRelatedWorldCities(city, 6);
  const relatedTimezones = city.relatedTimezones || (timezoneInfo ? [tzKey] : []);
  const timezoneLinkKeys = Array.from(new Set(relatedTimezones.filter(Boolean)));
  const extraTimezoneLinks = timezoneLinkKeys.filter(key => key !== tzKey);
  const heroDescription = city.heroDescription || `Live local time in ${city.name}${city.country ? `, ${city.country}` : ''}. Current time is based on ${timezoneInfo?.fullName || city.timezone}.`;
  const overview = city.overview || `Find the current time in ${city.name}${city.country ? `, ${city.country}` : ''}. This page shows local clock details and timezone information for ${timezoneInfo?.fullName || city.timezone}.`;

  const faqs = (city.faqs || fallbackFaqs).map(f => ({ question: f.q, answer: f.a }));
  const schema = buildSchema(city, citySlug, faqs);

  const tzName = city.tzName || (timezoneInfo ? timezoneInfo.fullName : city.timezone);
  const tzAbbr = city.tzAbbr || (timezoneInfo ? timezoneInfo.abbr : city.timezone.split('/').slice(-1)[0].replace(/_/g, ' '));
  const utcLabel = city.utcLabel || timezoneInfo?.utcLabel || '';
  const dstPhrase = city.dst === true ? 'daylight saving time info,' : city.dst === false ? 'no daylight saving,' : '';
  const title = `Current Time in ${city.name}${city.country ? `, ${city.country}` : ''} — ${city.timezone} | MyZoneTime`;
  const description = `Check the current local time in ${city.name}${city.country ? `, ${city.country}` : ''}. View live clock, ${tzName} (${tzAbbr})${utcLabel ? `, ${utcLabel}` : ''}${dstPhrase ? `, ${dstPhrase}` : ''} and time zone details.`;
  const canonicalUrl = `https://myzonetime.com/${citySlug}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {city.geoRegion && <meta name="geo.region" content={city.geoRegion} />}
        <meta name="geo.placename" content={`${city.name}, ${city.country}`} />
        {city.lat != null && city.lon != null && (
          <>
            <meta name="geo.position" content={`${city.lat};${city.lon}`} />
            <meta name="ICBM" content={`${city.lat}, ${city.lon}`} />
          </>
        )}
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
        {relatedCities.length > 0 && (
          <section className="py-10 border-t border-border/40">
            <div className="container max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Time in Related Cities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedCities.map(slug => {
                  const rel = getCityData(slug);
                  const label = rel ? rel.name : getCityLabelFromSlug(slug);
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
              {relatedCities.map(slug => {
                const rel = getCityData(slug);
                const label = rel ? rel.name : getCityLabelFromSlug(slug);
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

        <TimezoneAuthoritySection
          cityName={city.name}
          timezoneKey={tzKey}
          extraTimezoneKeys={extraTimezoneLinks}
        />

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

        <FAQSection faqs={faqs} includeSchema={false} title={`${city.name} Time Zone — FAQ`} />
      </CityPage>
    </>
  );
}

