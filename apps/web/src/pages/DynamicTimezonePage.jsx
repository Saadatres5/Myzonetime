/**
 * DynamicTimezonePage.jsx
 * Route: /timezone/:tz  — e.g. /timezone/utc, /timezone/est, /timezone/gst
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Globe, ArrowRight, MapPin } from 'lucide-react';
import { getTimezoneData } from '@/data/timezoneData.js';
import { getCityData } from '@/data/cityPageData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';

function LiveClock({ ianaTz }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      try {
        setTime(new Intl.DateTimeFormat('en-US', {
          timeZone: ianaTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        }).format(new Date()));
      } catch { setTime('--:--:--'); }
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [ianaTz]);
  return <span className="font-mono tabular-nums">{time}</span>;
}

export default function DynamicTimezonePage() {
  const { tz } = useParams();
  const tzKey = tz?.toLowerCase();
  const data = getTimezoneData(tzKey);

  if (!data) return <Navigate to="/404" replace />;

  const faqs = data.faqs.map(f => ({ question: f.q, answer: f.a }));
  const canonicalUrl = `https://myzonetime.com/timezone/${tzKey}`;
  const title = `${data.abbr} — ${data.fullName} (${data.utcLabel}) | MyZoneTime`;
  const description = `What is ${data.abbr}? ${data.fullName} is ${data.utcLabel}. Learn which countries and cities use ${data.abbr}, current time, UTC offset, DST rules, and conversion examples.`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTerm',
        name: data.abbr,
        description: `${data.fullName} (${data.abbr}) is a time zone at ${data.utcLabel}.`,
        url: canonicalUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
          { '@type': 'ListItem', position: 2, name: 'Timezones', item: 'https://myzonetime.com/timezone' },
          { '@type': 'ListItem', position: 3, name: data.abbr, item: canonicalUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question', name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname={`/timezone/${tzKey}`} />
      <StructuredData schema={schema} />

      <main className="flex-1 w-full bg-background text-foreground" id="main-content">
        {/* Hero */}
        <section className="relative w-full py-20 md:py-28 overflow-hidden bg-gradient-to-b from-card/50 to-background border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="container relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              Time Zone · {data.utcLabel} · {data.dst ? 'DST Observed' : 'No DST'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{data.abbr}</h1>
            <p className="text-xl text-muted-foreground">{data.fullName}</p>
            <div className="text-4xl font-mono font-bold text-primary tabular-nums">
              <LiveClock ianaTz={data.ianaTz} />
            </div>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">{data.utcLabel} — {data.dst ? 'Observes daylight saving time' : 'No daylight saving time'}</p>
          </div>
        </section>

        <section className="container max-w-4xl mx-auto px-4 py-12 space-y-14">

          {/* Quick facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Abbreviation', value: data.abbr },
              { label: 'UTC Offset', value: data.utcLabel },
              { label: 'Full Name', value: data.fullName },
              { label: 'DST', value: data.dst ? 'Yes' : 'No' },
            ].map(item => (
              <div key={item.label} className="rounded-xl bg-card border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="font-bold text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4">About {data.abbr} — {data.fullName}</h2>
            <p className="text-muted-foreground leading-relaxed">{data.description}</p>
          </section>

          {/* Countries */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Countries Using {data.abbr}</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {data.countries.map(c => (
                <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </section>

          {/* Cities */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Major Cities in {data.abbr}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.cities.map(cityName => {
                const slug = cityName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
                const cityData = getCityData(slug);
                return cityData ? (
                  <Link key={cityName} to={`/${slug}`}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary shrink-0" /> {cityName}
                  </Link>
                ) : (
                  <div key={cityName} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border/50 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" /> {cityName}
                  </div>
                );
              })}
            </div>
          </section>

          {/* UTC conversion examples */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Conversion Examples for {data.abbr}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border/50 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold">UTC Time</th>
                    <th className="text-left px-4 py-3 font-semibold">{data.abbr} ({data.utcLabel})</th>
                  </tr>
                </thead>
                <tbody>
                  {['00:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((utcTime, i) => {
                    const [h, m] = utcTime.split(':').map(Number);
                    const offsetMatch = data.offset.match(/([+-])(\d+):(\d+)/);
                    const sign = offsetMatch?.[1] === '+' ? 1 : -1;
                    const oh = parseInt(offsetMatch?.[2] || 0);
                    const om = parseInt(offsetMatch?.[3] || 0);
                    const totalMin = h * 60 + m + sign * (oh * 60 + om);
                    const normMin = ((totalMin % 1440) + 1440) % 1440;
                    const lh = String(Math.floor(normMin / 60)).padStart(2, '0');
                    const lm = String(normMin % 60).padStart(2, '0');
                    return (
                      <tr key={utcTime} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-4 py-3 text-muted-foreground">{utcTime} UTC</td>
                        <td className="px-4 py-3 font-mono font-medium">{lh}:{lm} {data.abbr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Related timezones */}
          {data.relatedTimezones?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Related Time Zones</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.relatedTimezones.map(relKey => (
                  <Link key={relKey} to={`/timezone/${relKey}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm font-medium uppercase tracking-wide">
                    {relKey}
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tools */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/timezone-converter" className="flex items-center gap-3 px-5 py-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Timezone Converter</p>
                  <p className="text-xs text-muted-foreground">Convert {data.abbr} to any city</p>
                </div>
              </Link>
              <Link to="/meeting-planner" className="flex items-center gap-3 px-5 py-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Meeting Planner</p>
                  <p className="text-xs text-muted-foreground">Schedule across {data.abbr} and other zones</p>
                </div>
              </Link>
            </div>
          </section>

          <FAQSection faqs={faqs} includeSchema={false} title={`${data.abbr} — Frequently Asked Questions`} />
        </section>
      </main>
    </>
  );
}
