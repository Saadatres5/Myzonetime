/**
 * WeekNumberPage.jsx
 * Current ISO week number, week calendar, and week number calculator.
 * time.is ranks #1 for "week number" globally — this targets that keyword.
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

// ISO week number calculation (ISO 8601 standard)
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return { week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7), year: d.getUTCFullYear() };
}

function getWeeksInYear(year) {
  const dec28 = new Date(year, 11, 28);
  return getISOWeek(dec28).week;
}

function getFirstDayOfISOWeek(week, year) {
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - jan4Day + 1);
  const result = new Date(startOfWeek1);
  result.setDate(startOfWeek1.getDate() + (week - 1) * 7);
  return result;
}

function getWeeksForYear(year) {
  const weeks = [];
  const totalWeeks = getWeeksInYear(year);
  for (let w = 1; w <= totalWeeks; w++) {
    const start = getFirstDayOfISOWeek(w, year);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    weeks.push({ week: w, start, end });
  }
  return weeks;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function fmtDate(d) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const FAQS = [
  { question: 'What week number is it today?', answer: 'The current ISO week number is shown at the top of this page and updates automatically. Week numbers follow the ISO 8601 standard, where week 1 is the week containing the first Thursday of the year.' },
  { question: 'What is ISO week numbering?', answer: 'ISO 8601 defines a week as starting on Monday and ending on Sunday. Week 1 of any year is the week that contains the year\'s first Thursday. This means January 1 can sometimes fall in week 52 or 53 of the previous year.' },
  { question: 'Does every year have 52 weeks?', answer: 'Most years have 52 ISO weeks. However, some years (called "long years") have 53 weeks. This happens when January 1 falls on a Thursday, or on a Wednesday in a leap year. About 71% of years have 52 weeks and 29% have 53 weeks.' },
  { question: 'What day does an ISO week start?', answer: 'According to ISO 8601, a week starts on Monday and ends on Sunday. This is the standard used in most of Europe, Australia, and international business. In the United States, weeks are commonly considered to start on Sunday.' },
  { question: 'Why is January 1 sometimes in week 52?', answer: 'If January 1 falls on a Friday, Saturday, or Sunday, that week\'s Thursday belongs to the previous year, so January 1 is placed in week 52 or 53 of the prior year under ISO 8601 rules. The first "ISO week 1" of the new year begins the following Monday.' },
  { question: 'How many weeks are in 2026?', answer: '2026 has 53 ISO weeks. Week 1 of 2026 begins on Monday, December 29, 2025, and week 53 ends on Sunday, January 3, 2027.' },
];

export default function WeekNumberPage() {
  const [now, setNow] = useState(new Date());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const { week: currentWeek, year: currentYear } = getISOWeek(now);
  const weeks = getWeeksForYear(viewYear);
  const totalWeeks = getWeeksInYear(viewYear);

  const todayWeekInfo = getFirstDayOfISOWeek(currentWeek, currentYear);
  const todayWeekEnd = new Date(todayWeekInfo);
  todayWeekEnd.setDate(todayWeekInfo.getDate() + 6);

  return (
    <>
      <Helmet>
        <title>{`What Week Number Is It? — ISO Week Calendar ${new Date().getFullYear()} | MyZoneTime`}</title>
        <meta name="description" content={`Current ISO week number is Week ${currentWeek} of ${currentYear}. Full ${viewYear} week number calendar with dates. ISO 8601 standard.`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Week Number ${currentWeek} — ${currentYear} | MyZoneTime`} />
        <meta property="og:description" content={`It is currently Week ${currentWeek} of ${currentYear}. Browse the full year week calendar and find any week number by date.`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <CanonicalTag pathname="/week-number" />

      <main className="flex-1 w-full bg-background text-foreground" id="main-content">
        {/* Hero */}
        <section className="relative w-full py-20 md:py-24 overflow-hidden bg-gradient-to-b from-card/50 to-background border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="container relative z-10 max-w-3xl mx-auto text-center space-y-4 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Calendar className="w-4 h-4" /> ISO 8601 Week Numbers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">What Week Number Is It?</h1>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl text-muted-foreground">It is currently</p>
              <div className="text-7xl md:text-9xl font-bold text-primary tabular-nums">W{currentWeek}</div>
              <p className="text-2xl font-semibold">{currentYear}</p>
              <p className="text-muted-foreground text-sm mt-1">
                {todayWeekInfo.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} –{' '}
                {todayWeekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Week calendar table */}
        <section className="container max-w-4xl mx-auto px-4 py-12">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setViewYear(y => y - 1)} className="p-2 rounded-lg hover:bg-card border border-border transition-colors" aria-label="Previous year">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Week Numbers {viewYear}</h2>
            <button onClick={() => setViewYear(y => y + 1)} className="p-2 rounded-lg hover:bg-card border border-border transition-colors" aria-label="Next year">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-6 text-center">
            {viewYear} has <strong className="text-foreground">{totalWeeks} weeks</strong>. Weeks run Monday–Sunday (ISO 8601).
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-20">Week</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Monday</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Sunday</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Month(s)</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map(({ week, start, end }) => {
                  const isCurrentWeek = week === currentWeek && viewYear === currentYear;
                  const months = start.getMonth() === end.getMonth()
                    ? MONTH_NAMES[start.getMonth()]
                    : `${MONTHS[start.getMonth()]} / ${MONTHS[end.getMonth()]}`;
                  return (
                    <tr
                      key={week}
                      className={`border-b border-border/50 transition-colors cursor-pointer ${
                        isCurrentWeek
                          ? 'bg-primary/10 font-semibold'
                          : 'hover:bg-card/60'
                      }`}
                      onClick={() => setSelectedWeek(week === selectedWeek ? null : week)}
                    >
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold ${
                          isCurrentWeek ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
                        }`}>
                          {week}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: start.getFullYear() !== viewYear ? 'numeric' : undefined })}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: end.getFullYear() !== viewYear ? 'numeric' : undefined })}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{months}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-2">
          <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
        </div>

        {/* SEO content */}
        <section className="py-14 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About ISO Week Numbers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The ISO 8601 standard defines a week as starting on Monday and ending on Sunday. Week 1 of any year is defined as the week containing the year's first Thursday. This rule means that January 1 can sometimes belong to Week 52 or 53 of the previous year — for example, if January 1 falls on a Friday, Saturday, or Sunday, the entire week belongs to the prior year since that week's Thursday is in the previous year.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                ISO week numbering is the international business standard and is widely used in European countries, international logistics, project management software, and financial reporting. Many industries use week numbers instead of calendar dates for planning, since weeks provide a clean 7-day structure that doesn't split like months do.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">How to Find the Week Number for Any Date</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To find the ISO week number for any date, scroll to the week calendar above and locate the row where your target date falls between the Monday and Sunday columns. Click any week row to highlight it. The table covers all 52 or 53 weeks of the selected year. Use the year navigation arrows to switch between years.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Most spreadsheet software also supports week number functions: in Excel use <code className="bg-muted px-1 rounded text-xs">WEEKNUM(date,2)</code> for ISO week numbers (the second argument "2" specifies Monday as the week start). In Google Sheets use <code className="bg-muted px-1 rounded text-xs">ISOWEEKNUM(date)</code>.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Which Countries Use ISO Week Numbers?</h2>
              <p className="text-muted-foreground leading-relaxed">
                ISO week numbering is the official standard in most European countries including Germany, France, the Netherlands, Scandinavia, and the UK. It is also standard in Australia, New Zealand, and most international business contexts. In the United States, weeks traditionally start on Sunday and week numbering follows a different convention — many US calendar applications use Sunday-based week 1 rules where January 1 always begins week 1. When working across US and European teams, always clarify which week number standard is being used to avoid scheduling confusion.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={FAQS} title="Week Numbers — Frequently Asked Questions" />
      </main>
    </>
  );
}
