/**
 * TimeCalculatorPage.jsx — Route: /time-calculator
 * Targets: "time calculator"
 * Adds/subtracts hours, minutes, seconds from a given time, and computes duration between two times.
 */
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

const BASE = 'https://myzonetime.com';

const CALC_FAQS = [
  {
    question: 'What is a time calculator used for?',
    answer: 'A time calculator lets you add or subtract hours, minutes, and seconds from a starting time, or calculate the exact duration between two times. It is commonly used for shift scheduling, billing hours, cooking timers, project deadlines, and any task involving time arithmetic that is error-prone to do by hand.',
  },
  {
    question: 'How do I add hours and minutes to a time?',
    answer: 'Enter your starting time, then enter the number of hours and minutes you want to add. The calculator instantly returns the resulting time, automatically handling rollovers past midnight (e.g. adding 5 hours to 9:00 PM correctly returns 2:00 AM the next day).',
  },
  {
    question: 'How do I calculate the duration between two times?',
    answer: 'Enter a start time and an end time. The calculator computes the total duration in hours and minutes. If the end time is earlier than the start time, it assumes the duration spans into the next day.',
  },
  {
    question: 'Can this time calculator handle negative time subtraction?',
    answer: 'Yes. Subtracting more time than is available before midnight correctly rolls back to the previous day — for example, subtracting 3 hours from 1:00 AM returns 10:00 PM the previous day.',
  },
];

function pad(n) { return n.toString().padStart(2, '0'); }

export default function TimeCalculatorPage() {
  // ── Add/Subtract calculator state ──
  const [baseTime, setBaseTime] = useState('09:00');
  const [hoursToAdd, setHoursToAdd] = useState(0);
  const [minutesToAdd, setMinutesToAdd] = useState(0);
  const [operation, setOperation] = useState('add'); // 'add' | 'subtract'

  // ── Duration calculator state ──
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');

  const resultTime = useMemo(() => {
    const [h, m] = baseTime.split(':').map(Number);
    let totalMinutes = h * 60 + m;
    const deltaMinutes = (Number(hoursToAdd) || 0) * 60 + (Number(minutesToAdd) || 0);
    totalMinutes = operation === 'add' ? totalMinutes + deltaMinutes : totalMinutes - deltaMinutes;
    // Normalize to 0-1439 range (24h), tracking day offset
    let dayOffset = 0;
    while (totalMinutes < 0) { totalMinutes += 1440; dayOffset -= 1; }
    while (totalMinutes >= 1440) { totalMinutes -= 1440; dayOffset += 1; }
    const resH = Math.floor(totalMinutes / 60);
    const resM = totalMinutes % 60;
    return { time: `${pad(resH)}:${pad(resM)}`, dayOffset };
  }, [baseTime, hoursToAdd, minutesToAdd, operation]);

  const duration = useMemo(() => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    let diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff < 0) diff += 1440; // spans midnight
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return { hours: h, minutes: m, totalMinutes: diff };
  }, [startTime, endTime]);

  const TODAY = new Date().toISOString().split('T')[0];

  const webAppSchema = {
    '@type': 'WebApplication',
    '@id': `${BASE}/time-calculator#webapp`,
    name: 'Time Calculator — Add, Subtract & Find Duration',
    url: `${BASE}/time-calculator`,
    description: 'Free online time calculator. Add or subtract hours and minutes from any time, or calculate the exact duration between two times.',
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Time Calculator',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@id': `${BASE}/#organization` },
    publisher: { '@id': `${BASE}/#organization` },
    isPartOf: { '@id': `${BASE}/#website` },
    dateModified: TODAY,
  };

  const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${BASE}/time-calculator#webpage`,
    url: `${BASE}/time-calculator`,
    name: 'Time Calculator — Add, Subtract & Find Time Duration | MyZoneTime',
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#organization` },
    dateModified: TODAY,
    inLanguage: 'en',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Time Calculator', item: `${BASE}/time-calculator` },
      ],
    },
  };

  return (
    <>
      <CanonicalTag pathname="/time-calculator" />
      <Helmet>
        <title>Time Calculator — Add, Subtract & Find Time Duration | MyZoneTime</title>
        <meta name="description" content="Free time calculator. Add or subtract hours and minutes from any time, or calculate the exact duration between two times. Instant, no signup." />
        <meta property="og:title" content="Time Calculator | MyZoneTime" />
        <meta property="og:description" content="Add, subtract, or find the duration between times instantly. Free online time calculator." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <StructuredData schemas={[webPageSchema, webAppSchema]} />

      <main id="main-content" className="min-h-screen bg-background">

        <section className="relative py-14 md:py-20 border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl bg-primary/15 rounded-full blur-[80px] opacity-40" />
          </div>
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Time Calculator</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Add or subtract hours and minutes from any time, or find the exact duration between two times.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 space-y-8">

            {/* Add/Subtract calculator */}
            <div className="premium-card p-6 md:p-8">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Add or Subtract Time
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Starting time</label>
                  <input type="time" value={baseTime} onChange={e => setBaseTime(e.target.value)}
                    className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOperation('add')}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${operation === 'add' ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground'}`}>
                    <Plus className="w-4 h-4" /> Add
                  </button>
                  <button onClick={() => setOperation('subtract')}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${operation === 'subtract' ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground'}`}>
                    <Minus className="w-4 h-4" /> Subtract
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Hours</label>
                  <input type="number" min="0" value={hoursToAdd} onChange={e => setHoursToAdd(e.target.value)}
                    className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Minutes</label>
                  <input type="number" min="0" max="59" value={minutesToAdd} onChange={e => setMinutesToAdd(e.target.value)}
                    className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-5 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Result</div>
                <div className="text-3xl font-mono font-bold text-primary">{resultTime.time}</div>
                {resultTime.dayOffset !== 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {resultTime.dayOffset > 0 ? `+${resultTime.dayOffset} day(s)` : `${resultTime.dayOffset} day(s)`}
                  </div>
                )}
              </div>
            </div>

            {/* Duration calculator */}
            <div className="premium-card p-6 md:p-8">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" /> Time Duration Calculator
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Start time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">End time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-5 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Duration</div>
                <div className="text-3xl font-bold text-primary">
                  {duration.hours}h {duration.minutes}m
                </div>
                <div className="text-xs text-muted-foreground mt-1">{duration.totalMinutes} minutes total</div>
              </div>
            </div>

            <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
          </div>
        </section>

        <section className="py-12 border-t border-border/40 bg-muted/10">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 prose prose-sm max-w-none text-muted-foreground space-y-4">
            <h2 className="text-2xl font-bold text-foreground">About This Time Calculator</h2>
            <p>
              This free time calculator handles two common needs: adding or subtracting a duration from a starting time, and computing the exact length of time between two points. Both calculations correctly handle midnight rollovers, so adding hours past 24:00 or subtracting hours before 00:00 always returns the accurate result with day adjustments noted.
            </p>
            <p>
              Common uses include calculating work shift lengths, figuring out what time a task will finish if started now, billing hourly work, and converting between 12-hour and 24-hour time arithmetic without manual calculation errors.
            </p>
          </div>
        </section>

        <FAQSection faqs={CALC_FAQS} title="Time Calculator — Frequently Asked Questions" />

</main>
    </>
  );
}
