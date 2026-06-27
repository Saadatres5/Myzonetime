/**
 * UnixTimePage.jsx
 * Unix timestamp converter + current Unix time display.
 * time.is ranks for "unix time" and "epoch time" — high developer traffic.
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Code, Copy, Check, RefreshCw } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

function fmtDate(date, tz = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  return date.toLocaleString('en-US', {
    timeZone: tz, weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
}

const FAQS = [
  { question: 'What is Unix time?', answer: 'Unix time (also called Epoch time, POSIX time, or Unix timestamp) is the number of seconds that have elapsed since 00:00:00 UTC on Thursday, January 1, 1970 (the Unix Epoch). It is widely used in computing to represent dates and times as a single integer, making date calculations and storage simpler.' },
  { question: 'What is the Unix Epoch?', answer: 'The Unix Epoch is the reference point for Unix time: 00:00:00 UTC on January 1, 1970. All Unix timestamps are measured in seconds (or milliseconds in some systems) from this moment. The date was chosen arbitrarily when Unix was being developed in the late 1960s and early 1970s.' },
  { question: 'How do I convert a Unix timestamp to a human-readable date?', answer: 'Enter any Unix timestamp in the converter above and it instantly shows the corresponding date and time in UTC, your local time, and any other time zone. In code: JavaScript uses new Date(timestamp * 1000) (multiply by 1000 since JS uses milliseconds), Python uses datetime.fromtimestamp(timestamp), and SQL uses FROM_UNIXTIME(timestamp).' },
  { question: 'What is the difference between Unix time and milliseconds?', answer: 'Standard Unix time counts seconds since the Epoch. JavaScript and many APIs use milliseconds (multiply seconds by 1,000). A Unix timestamp of 1,700,000,000 seconds equals 1,700,000,000,000 milliseconds. When you see a very large number (13+ digits), it\'s likely in milliseconds. Numbers with 10 digits are seconds.' },
  { question: 'What happens at the Year 2038 problem?', answer: 'The Year 2038 problem (also called Y2K38) affects 32-bit systems that store Unix timestamps as a signed 32-bit integer. The maximum value (2,147,483,647) represents January 19, 2038 at 03:14:07 UTC. After that moment, the counter overflows to a negative number representing December 13, 1901. Modern 64-bit systems are not affected.' },
  { question: 'How do I get the current Unix timestamp?', answer: 'In JavaScript: Math.floor(Date.now() / 1000) or Date.now() for milliseconds. In Python: import time; int(time.time()). In PHP: time(). In MySQL: UNIX_TIMESTAMP(). In bash/Linux: date +%s. The current Unix timestamp is displayed live at the top of this page.' },
  { question: 'What is UTC and how does it relate to Unix time?', answer: 'UTC (Coordinated Universal Time) is the time standard at 0° longitude, with no daylight saving adjustments. Unix time is always measured in UTC seconds from the Epoch. When converting to local time, you apply the UTC offset for your time zone. A Unix timestamp always refers to the same absolute moment in time globally, regardless of where you are.' },
];

export default function UnixTimePage() {
  const [now, setNow] = useState(new Date());
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState(null);
  const [parseError, setParseError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const unixSec = Math.floor(now.getTime() / 1000);
  const unixMs  = now.getTime();

  const handleConvert = () => {
    const val = input.trim();
    if (!val) { setParsed(null); setParseError(''); return; }
    const num = Number(val);
    if (isNaN(num)) { setParseError('Enter a valid number.'); setParsed(null); return; }
    // Auto-detect ms vs seconds
    const date = num > 9_999_999_999 ? new Date(num) : new Date(num * 1000);
    if (isNaN(date.getTime())) { setParseError('Invalid timestamp.'); setParsed(null); return; }
    setParseError('');
    setParsed(date);
  };

  // Convert a human date to Unix
  const [dateInput, setDateInput] = useState('');
  const [dateToUnix, setDateToUnix] = useState(null);
  const handleDateConvert = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) { setDateToUnix(null); return; }
    setDateToUnix(Math.floor(d.getTime() / 1000));
  };

  const copyToClipboard = (val) => {
    navigator.clipboard.writeText(String(val));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Unix Time — Current Epoch Timestamp Converter | MyZoneTime</title>
        <meta name="description" content="Current Unix timestamp in seconds and milliseconds. Convert any Unix epoch time to human-readable date and time instantly." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Unix Time & Epoch Timestamp Converter | MyZoneTime" />
        <meta property="og:description" content="Live Unix timestamp + instant epoch to date converter. Convert seconds, milliseconds to readable dates in any timezone." />
        <meta property="og:type" content="website" />
      </Helmet>
      <CanonicalTag pathname="/unix-time" />

      <main className="flex-1 w-full bg-background text-foreground" id="main-content">
        {/* Hero */}
        <section className="relative w-full py-20 md:py-24 overflow-hidden bg-gradient-to-b from-card/50 to-background border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="container relative z-10 max-w-3xl mx-auto text-center space-y-4 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Code className="w-4 h-4" /> Epoch / Unix Timestamp
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Unix Time Now</h1>

            {/* Live counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl mx-auto">
              <div className="p-4 rounded-2xl bg-card border border-border/60 text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Seconds (Unix)</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-bold tabular-nums">{unixSec.toLocaleString()}</span>
                  <button onClick={() => copyToClipboard(unixSec)} className="p-1 hover:text-primary transition-colors" aria-label="Copy">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border/60 text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Milliseconds</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-bold tabular-nums">{unixMs.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {fmtDate(now, 'UTC')} UTC
            </p>
          </div>
        </section>

        {/* Converters */}
        <section className="container max-w-3xl mx-auto px-4 py-12 space-y-8">
          {/* Unix → Date */}
          <div className="p-6 rounded-2xl bg-card border border-border/60">
            <h2 className="text-lg font-semibold mb-4">Unix Timestamp → Human Date</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleConvert()}
                placeholder="e.g. 1700000000 or 1700000000000"
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-sm font-mono"
              />
              <button
                onClick={handleConvert}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Convert
              </button>
            </div>
            {parseError && <p className="text-red-400 text-sm">{parseError}</p>}
            {parsed && (
              <div className="space-y-2 text-sm">
                {[
                  { label: 'UTC',        val: fmtDate(parsed, 'UTC') },
                  { label: 'Your Local', val: fmtDate(parsed) },
                  { label: 'ISO 8601',   val: parsed.toISOString() },
                  { label: 'Unix (sec)', val: Math.floor(parsed.getTime()/1000) },
                  { label: 'Unix (ms)',  val: parsed.getTime() },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground w-28 flex-shrink-0">{label}</span>
                    <span className="font-mono text-xs text-right break-all">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date → Unix */}
          <div className="p-6 rounded-2xl bg-card border border-border/60">
            <h2 className="text-lg font-semibold mb-4">Date → Unix Timestamp</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="datetime-local"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-sm"
              />
              <button
                onClick={handleDateConvert}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Convert
              </button>
            </div>
            {dateToUnix !== null && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Unix (seconds)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{dateToUnix}</span>
                    <button onClick={() => copyToClipboard(dateToUnix)} className="p-1 hover:text-primary"><Copy className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Unix (milliseconds)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{dateToUnix * 1000}</span>
                    <button onClick={() => copyToClipboard(dateToUnix * 1000)} className="p-1 hover:text-primary"><Copy className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Code snippets */}
          <div className="p-6 rounded-2xl bg-card border border-border/60">
            <h2 className="text-lg font-semibold mb-4">Get Current Unix Timestamp — Code Examples</h2>
            <div className="space-y-4">
              {[
                { lang: 'JavaScript', code: 'Math.floor(Date.now() / 1000)' },
                { lang: 'Python',     code: 'import time; int(time.time())' },
                { lang: 'PHP',        code: 'time()' },
                { lang: 'MySQL',      code: 'SELECT UNIX_TIMESTAMP()' },
                { lang: 'PostgreSQL', code: "SELECT extract(epoch FROM now())::bigint" },
                { lang: 'Bash',       code: 'date +%s' },
                { lang: 'Ruby',       code: 'Time.now.to_i' },
                { lang: 'Go',         code: 'time.Now().Unix()' },
                { lang: 'C# (.NET)', code: 'DateTimeOffset.UtcNow.ToUnixTimeSeconds()' },
              ].map(({ lang, code }) => (
                <div key={lang} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{lang}</span>
                  <code className="flex-1 text-xs bg-background px-3 py-2 rounded-lg border border-border font-mono break-all">{code}</code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container max-w-3xl mx-auto px-4 py-2">
          <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
        </div>

        {/* SEO content */}
        <section className="py-14 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">What Is Unix Time?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Unix time is a system for describing a point in time as a single integer — the number of seconds that have elapsed since 00:00:00 UTC on Thursday, January 1, 1970 (the Unix Epoch). This representation is language-agnostic, timezone-agnostic, and immune to daylight saving time complications, making it the universal standard for timestamps in computing, databases, APIs, and log files.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The current Unix timestamp is shown live at the top of this page. It increments by 1 every second. You can verify this against any other clock or timestamp service — the Unix timestamp at any given UTC moment is always the same globally, regardless of where you are in the world.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Seconds vs Milliseconds</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The original Unix timestamp is measured in seconds. However, many modern programming environments — most notably JavaScript — measure time internally in milliseconds (thousandths of a second). A seconds-based Unix timestamp currently has 10 digits. A milliseconds timestamp has 13 digits. When you receive a timestamp, check its digit count to determine which unit is being used.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The converter above automatically detects whether a number is in seconds or milliseconds based on its magnitude, so you can paste either format and get an accurate result.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">The Year 2038 Problem</h2>
              <p className="text-muted-foreground leading-relaxed">
                Legacy 32-bit systems that store Unix timestamps as a signed 32-bit integer can represent times up to 2,147,483,647 seconds past the Epoch — which corresponds to 03:14:07 UTC on January 19, 2038. After that second, the counter overflows to a negative number, causing systems to interpret the date as December 13, 1901. This is the Year 2038 problem (Y2K38). Modern 64-bit operating systems and programming languages are not affected, as 64-bit integers can represent dates billions of years into the future.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={FAQS} title="Unix Time — Frequently Asked Questions" />
      </main>
    </>
  );
}
