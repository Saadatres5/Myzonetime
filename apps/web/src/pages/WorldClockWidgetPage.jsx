/**
 * WorldClockWidgetPage.jsx
 *
 * Fix applied:
 *  - og:title was "World Clock Widget | MyZoneTime" (duplicate of old title pattern)
 *  - Now matches server.js SSR title exactly: "Free World Clock Widget — Embed on Any Website | MyZoneTime"
 *  - twitter:title synced too
 *  - Removed redundant og:title / twitter:title that conflicted with SSR injection
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Code, Copy, CheckCircle2, Globe2 } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { Button } from '@/components/ui/button';

function WidgetCityRow({ name, timezone }) {
  const { time, formatTime } = useLocalTime(timezone);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
      <span className="font-medium text-foreground">{name}</span>
      <span className="font-mono-time font-bold text-primary">
        {formatTime(time, timezone, false, false)}
      </span>
    </div>
  );
}

export default function WorldClockWidgetPage() {
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="https://myzonetime.com/embed/world-clock" width="100%" height="400" frameborder="0" style="border:1px solid #1e293b;border-radius:12px;" title="World Clock — MyZoneTime"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SSR injects the authoritative JSON-LD from server.js; this is a client fallback.
  const schema = {
    '@type': 'SoftwareApplication',
    name: 'World Clock Widget — Free Embeddable Clock',
    url: 'https://myzonetime.com/world-clock-widget',
    description: 'Free embeddable world clock widget for any website. Copy-paste HTML iframe. Shows live time for multiple cities.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',               item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'World Clock Widget', item: 'https://myzonetime.com/world-clock-widget' },
    ],
  };

  return (
    <main id="main-content" className="flex-1 w-full bg-background text-foreground">
      {/*
        These Helmet tags are client-side fallbacks only.
        The server.js SSR injection takes precedence for Googlebot/AI crawlers.
        Title here MUST match server.js routeMeta['/world-clock-widget'].title exactly.
      */}
      <Helmet>
        <title>Free World Clock Widget — Embed on Any Website | MyZoneTime</title>
        <meta name="description" content="Add a free embeddable world clock widget to your website. Display live local time for multiple cities with a simple copy-paste HTML snippet. No coding required." />
        <meta property="og:title" content="Free World Clock Widget — Embed on Any Website | MyZoneTime" />
        <meta property="og:description" content="Free embeddable world clock widget. Add live time display for multiple cities to your website with easy copy-paste HTML code." />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Free World Clock Widget — Embed on Any Website | MyZoneTime" />
        <meta name="twitter:description" content="Free embeddable world clock widget for your website or blog. Copy-paste HTML code, no signup required." />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname="/world-clock-widget" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1639060015191-9d83063eab2a?w=1400&auto=format&q=75&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
            decoding="async"
            width="1400"
            height="600"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-4 backdrop-blur-md border border-primary/30">
            <Code className="w-4 h-4" aria-hidden="true" />
            Developer Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
            Add a Live World Clock to Your Website
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Keep your international visitors informed with a beautiful, free embeddable world clock widget.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Description & Instructions */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Why use our widget?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you run a global remote team, an international e-commerce store, or a travel blog,
                showing live local times helps your users stay connected. Our widget is lightweight,
                updates in real-time, automatically handles daylight saving time changes, and requires
                zero JavaScript on your end.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Globe2 className="w-6 h-6 text-primary" aria-hidden="true" /> How to Embed
              </h3>
              <ol className="space-y-4 list-decimal list-inside text-muted-foreground text-lg">
                <li>Copy the HTML iframe code snippet below.</li>
                <li>Paste it into your website's HTML, WordPress custom HTML block, Webflow embed element, or any CMS that supports raw HTML.</li>
              </ol>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Widget features</h3>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  'Live clocks — updates every second',
                  'Automatic daylight saving time adjustments',
                  'Fully responsive — works on mobile and desktop',
                  '100% free — no API key or account required',
                  'Generates backlinks when you embed it (SEO benefit)',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-card p-6 relative group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Embed Code</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-primary hover:text-primary hover:bg-primary/10" aria-label={copied ? 'Code copied' : 'Copy embed code'}>
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2" aria-hidden="true" /> : <Copy className="w-4 h-4 mr-2" aria-hidden="true" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
              <pre className="bg-background p-4 rounded-xl overflow-x-auto border border-border/50 text-sm text-muted-foreground font-mono whitespace-pre-wrap break-all">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6 lg:pl-12">
            <h3 className="text-2xl font-semibold">Live Preview</h3>
            <div className="premium-card p-8 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <Globe2 className="w-6 h-6 text-primary" aria-hidden="true" />
                <h4 className="text-xl font-bold">World Clock</h4>
              </div>

              <div className="space-y-2" aria-label="Live world clock preview">
                <WidgetCityRow name="New York"  timezone="America/New_York" />
                <WidgetCityRow name="London"    timezone="Europe/London"    />
                <WidgetCityRow name="Dubai"     timezone="Asia/Dubai"       />
                <WidgetCityRow name="Tokyo"     timezone="Asia/Tokyo"       />
                <WidgetCityRow name="Sydney"    timezone="Australia/Sydney" />
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 text-center">
                <span className="text-xs text-muted-foreground">Powered by <a href="https://myzonetime.com" className="text-primary hover:underline">MyZoneTime</a></span>
              </div>
            </div>

            {/* Backlink note */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Good for your SEO too:</strong> Each embed includes a
              "Powered by MyZoneTime" attribution link, but this is a soft link and won't affect your site's
              performance. The widget itself is fast, loading via a single lightweight iframe.
            </p>
          </div>

        </div>

        {/* FAQ section for this page */}
        <section aria-labelledby="widget-faq-heading" className="space-y-6 border-t border-border/40 pt-12">
          <h2 id="widget-faq-heading" className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I add a world clock to my website?',
                a: 'Copy the iframe code above and paste it anywhere in your page HTML. It works in WordPress (Custom HTML block), Webflow (Embed element), Squarespace (Code block), and any raw HTML page.',
              },
              {
                q: 'Is the widget free?',
                a: 'Yes, completely free. No account, no API key, no payment. Just copy and paste.',
              },
              {
                q: 'Can I customise the cities shown?',
                a: 'The default widget shows New York, London, Dubai, Tokyo, and Sydney. If you need a custom set of cities, contact us and we can discuss a custom embed configuration.',
              },
              {
                q: 'Does the widget handle daylight saving time?',
                a: 'Yes. The widget uses the IANA timezone database and updates automatically when cities change their clocks for DST.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="premium-card p-5 rounded-xl group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-primary ml-2 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
