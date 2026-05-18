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

  const embedCode = `<iframe src="https://myzonetime.com/embed/world-clock" width="100%" height="400" frameborder="0" style="border:1px solid #1e293b;border-radius:12px;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@type": "SoftwareApplication",
    "name": "World Clock Widget",
    "description": "Embed a live world clock widget on your website or blog."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "World Clock Widget", "item": "https://myzonetime.com/world-clock-widget" }
    ]
  };

  return (
    <main className="flex-1 w-full bg-background text-foreground">
      <Helmet>
        <title>Embeddable World Clock Widget — Add Live Clock to Your Website | MyZoneTime</title>
        <meta name="description" content="Free embeddable world clock widget for your website. Add a live clock showing multiple cities to WordPress, Webflow, or any website. Easy embed code." />
        <meta property="og:title" content="World Clock Widget | MyZoneTime" />
        <meta property="og:description" content="Embeddable world clock widget. Add live time display to your website with easy copy-paste code." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="World Clock Widget | MyZoneTime" />
        <meta name="twitter:description" content="Embed a live world clock widget on your website or blog." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/world-clock-widget" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1639060015191-9d83063eab2a" 
            alt="Abstract digital globe" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-4 backdrop-blur-md border border-primary/30">
            <Code className="w-4 h-4" />
            Developer Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
            Add a Live World Clock to Your Website
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Keep your international visitors informed with a beautiful, embeddable world clock widget.
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
                Whether you run a global remote team, an international e-commerce store, or a travel blog, showing local times helps your users stay connected. Our widget is lightweight, updates in real-time, and automatically handles daylight saving time changes.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Globe2 className="w-6 h-6 text-primary" /> How to Embed
              </h3>
              <ol className="space-y-4 list-decimal list-inside text-muted-foreground text-lg">
                <li>Copy the HTML iframe code snippet below.</li>
                <li>Paste it into your website's HTML, WordPress custom HTML block, or Webflow embed element.</li>
              </ol>
            </div>

            <div className="premium-card p-6 relative group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Embed Code</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-primary hover:text-primary hover:bg-primary/10">
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
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
                <Globe2 className="w-6 h-6 text-primary" />
                <h4 className="text-xl font-bold">World Clock</h4>
              </div>
              
              <div className="space-y-2">
                <WidgetCityRow name="New York" timezone="America/New_York" />
                <WidgetCityRow name="London" timezone="Europe/London" />
                <WidgetCityRow name="Dubai" timezone="Asia/Dubai" />
                <WidgetCityRow name="Tokyo" timezone="Asia/Tokyo" />
                <WidgetCityRow name="Sydney" timezone="Australia/Sydney" />
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50 text-center">
                <span className="text-xs text-muted-foreground">Powered by MyZoneTime</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}