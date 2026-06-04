import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRightLeft, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import { citiesData } from '@/data/citiesData.js';
import { useLocalTime } from '@/hooks/useLocalTime.js';

export default function TimeDifferenceCalculatorPage() {
  const [city1Id, setCity1Id] = useState('lon');
  const [city2Id, setCity2Id] = useState('dxb');

  const city1 = citiesData.find(c => c.id === city1Id) || citiesData[0];
  const city2 = citiesData.find(c => c.id === city2Id) || citiesData[1];

  const { time: time1, formatTime: formatTime1 } = useLocalTime(city1.timezone);
  const { time: time2, formatTime: formatTime2 } = useLocalTime(city2.timezone);

  const getOffsetDiff = () => {
    try {
      const date = new Date();
      const tz1Date = new Date(date.toLocaleString('en-US', { timeZone: city1.timezone }));
      const tz2Date = new Date(date.toLocaleString('en-US', { timeZone: city2.timezone }));
      return (tz2Date - tz1Date) / (1000 * 60 * 60);
    } catch (e) {
      return 0;
    }
  };

  const diff = getOffsetDiff();
  const diffAbs = Math.abs(diff);
  const diffText = diff === 0 
    ? `${city1.name} and ${city2.name} are in the same time zone.` 
    : `${city2.name} is ${diffAbs} hour${diffAbs !== 1 ? 's' : ''} ${diff > 0 ? 'ahead of' : 'behind'} ${city1.name}.`;

  const getMeetingTip = () => {
    if (diff === 0) return `Business hours align perfectly. Call anytime between 9 AM and 5 PM.`;
    if (diffAbs > 8) return `Large time difference. Consider early morning in ${diff > 0 ? city1.name : city2.name} and late evening in ${diff > 0 ? city2.name : city1.name}.`;
    if (diff > 0) return `Best time to call: Morning in ${city1.name} (e.g., 9 AM) is afternoon in ${city2.name} (e.g., ${9 + diffAbs > 12 ? (9 + diffAbs - 12) + ' PM' : (9 + diffAbs) + ' AM'}).`;
    return `Best time to call: Afternoon in ${city1.name} (e.g., 4 PM) is morning in ${city2.name} (e.g., ${16 - diffAbs > 12 ? (16 - diffAbs - 12) + ' PM' : (16 - diffAbs) + ' AM'}).`;
  };

  const schema = {
    "@type": "WebApplication",
    "name": "Time Difference Calculator",
    "description": "Calculate the exact time difference between any two cities globally."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Time Difference Calculator", "item": "https://myzonetime.com/time-difference" }
    ]
  };

  return (
    <main className="flex-1 w-full bg-background text-foreground">
      <Helmet>
        <title>Time Difference Calculator — Find Time Difference Between Cities | MyZoneTime</title>
        <meta name="description" content="Calculate the exact time difference between any two cities. Free time difference calculator with meeting window suggestions for remote teams." />
        <meta property="og:title" content="Time Difference Calculator | MyZoneTime" />
        <meta property="og:description" content="Find the exact time difference between any two cities. Get meeting window suggestions instantly." />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Time Difference Calculator | MyZoneTime" />
        <meta name="twitter:description" content="Calculate the exact time difference between any two cities globally." />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname="/time-difference" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585858229735-cd08d8cb510d" 
            alt="Clocks on wall" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
            Time Difference Calculator
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Instantly find the exact hour difference between any two cities worldwide.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
        
        {/* Calculator Section */}
        <div className="premium-card p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            
            {/* City 1 */}
            <div className="space-y-6">
              <Select value={city1Id} onValueChange={setCity1Id}>
                <SelectTrigger className="h-14 text-lg bg-background rounded-xl border-border/50">
                  <SelectValue placeholder="Select first city" />
                </SelectTrigger>
                <SelectContent>
                  {citiesData.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.country})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-center bg-background rounded-2xl p-8 border border-border/50 shadow-inner">
                <div className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">Current Time</div>
                <div className="text-4xl font-bold tabular-nums tracking-tight text-primary">
                  {formatTime1(time1, city1.timezone, false, true)}
                </div>
                <div className="text-sm text-muted-foreground mt-3 font-medium">{city1.name}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center">
              <div className="p-4 bg-secondary/10 rounded-full">
                <ArrowRightLeft className="w-8 h-8 text-secondary" />
              </div>
            </div>

            {/* City 2 */}
            <div className="space-y-6">
              <Select value={city2Id} onValueChange={setCity2Id}>
                <SelectTrigger className="h-14 text-lg bg-background rounded-xl border-border/50">
                  <SelectValue placeholder="Select second city" />
                </SelectTrigger>
                <SelectContent>
                  {citiesData.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.country})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-center bg-background rounded-2xl p-8 border border-border/50 shadow-inner">
                <div className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">Current Time</div>
                <div className="text-4xl font-bold tabular-nums tracking-tight text-secondary">
                  {formatTime2(time2, city2.timezone, false, true)}
                </div>
                <div className="text-sm text-muted-foreground mt-3 font-medium">{city2.name}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="premium-card p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Time Difference</h3>
            </div>
            <p className="text-2xl font-bold text-foreground leading-snug">
              {diffText}
            </p>
          </div>

          <div className="premium-card p-8 flex flex-col justify-center bg-secondary/5 border-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-secondary" />
              <h3 className="text-xl font-semibold">Meeting Tip</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {getMeetingTip()}
            </p>
          </div>
        </div>

      </div>

      {/* SEO: internal links to common time-difference pairs to avoid orphan pages */}
      <nav aria-hidden="true" className="sr-only">
        <a href="/time-difference/new-york-and-london">New York and London</a>
        <a href="/time-difference/dubai-and-london">Dubai and London</a>
        <a href="/time-difference/dubai-and-new-york">Dubai and New York</a>
        <a href="/time-difference/tokyo-and-new-york">Tokyo and New York</a>
        <a href="/time-difference/london-and-sydney">London and Sydney</a>
        <a href="/time-difference/singapore-and-london">Singapore and London</a>
        <a href="/time-difference/riyadh-and-london">Riyadh and London</a>
        <a href="/time-difference/istanbul-and-dubai">Istanbul and Dubai</a>
        <a href="/time-difference/paris-and-dubai">Paris and Dubai</a>
        <a href="/time-difference/sydney-and-dubai">Sydney and Dubai</a>
        <a href="/time-difference/new-york-and-dubai">New York and Dubai</a>
        <a href="/time-difference/bangkok-and-london">Bangkok and London</a>
        <a href="/time-difference/kuala-lumpur-and-london">Kuala Lumpur and London</a>
        <a href="/time-difference/tokyo-and-london">Tokyo and London</a>
        <a href="/time-difference/singapore-and-new-york">Singapore and New York</a>
      </nav>
    </main>
  );
}