import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Moon, Info } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import { useIslamicDate } from '@/hooks/useIslamicDate.js';

export default function HijriCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { hijriDate, formattedHijri, formattedGregorian } = useIslamicDate(currentDate);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000 * 60 * 60); // Update every hour
    return () => clearInterval(timer);
  }, []);

  const schema = {
    "@type": "WebPage",
    "name": "Hijri Calendar - Islamic Date Converter",
    "description": "View today's Hijri date, understand the Islamic calendar system, and compare Gregorian and Hijri months."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Hijri Calendar", "item": "https://myzonetime.com/hijri-calendar" }
    ]
  };

  const monthsComparison = [
    { greg: "January", hijri: "Muharram", days: "29 or 30", approx: "Varies yearly" },
    { greg: "February", hijri: "Safar", days: "29 or 30", approx: "Varies yearly" },
    { greg: "March", hijri: "Rabi' al-Awwal", days: "29 or 30", approx: "Varies yearly" },
    { greg: "April", hijri: "Rabi' al-Thani", days: "29 or 30", approx: "Varies yearly" },
    { greg: "May", hijri: "Jumada al-Awwal", days: "29 or 30", approx: "Varies yearly" },
    { greg: "June", hijri: "Jumada al-Thani", days: "29 or 30", approx: "Varies yearly" },
    { greg: "July", hijri: "Rajab", days: "29 or 30", approx: "Varies yearly" },
    { greg: "August", hijri: "Sha'ban", days: "29 or 30", approx: "Varies yearly" },
    { greg: "September", hijri: "Ramadan", days: "29 or 30", approx: "Varies yearly" },
    { greg: "October", hijri: "Shawwal", days: "29 or 30", approx: "Varies yearly" },
    { greg: "November", hijri: "Dhu al-Qi'dah", days: "29 or 30", approx: "Varies yearly" },
    { greg: "December", hijri: "Dhu al-Hijjah", days: "29 or 30", approx: "Varies yearly" }
  ];

  const hijriFaqs = [
    {
      question: "What is today's Hijri date?",
      answer: `Today's Hijri date is displayed at the top of the page. The Hijri calendar is a lunar calendar used in Islamic tradition. Today's date in the Islamic calendar is ${formattedHijri || 'loading...'}. You can use the converter tool to check any Gregorian date's corresponding Hijri date.`
    },
    {
      question: "What year is it in the Islamic calendar?",
      answer: `The current Islamic year is ${hijriDate?.year || 'loading...'}. The Islamic calendar started in 622 CE (Common Era) with the Hijra (migration of Prophet Muhammad from Mecca to Medina). Each Islamic year is approximately 354-355 days long, making it about 11 days shorter than the Gregorian year.`
    },
    {
      question: "When does Ramadan start in 2026?",
      answer: "Ramadan dates vary each year because the Islamic calendar is lunar-based. In 2026, Ramadan is expected to begin around late August or early September (Gregorian calendar). The exact date depends on the sighting of the new moon. Use our Hijri calendar converter to check the precise dates for any year."
    },
    {
      question: "How does the Hijri calendar work?",
      answer: "The Hijri calendar is a purely lunar calendar with 12 months of 29 or 30 days each. Unlike the Gregorian calendar, it doesn't account for the solar year, so Islamic dates shift approximately 11 days earlier each Gregorian year. This means Ramadan and other Islamic holidays occur at different times each year in the Gregorian calendar."
    },
    {
      question: "What is the difference between Hijri and Gregorian calendar?",
      answer: "The Gregorian calendar is solar-based (365.25 days per year), while the Hijri calendar is lunar-based (354-355 days per year). The Gregorian calendar is used internationally for civil purposes, while the Hijri calendar is used for Islamic religious observances and in some Muslim-majority countries. The Hijri year is about 11 days shorter, causing Islamic holidays to shift earlier each Gregorian year."
    }
  ];

  return (
    <main className="flex-1 w-full bg-background text-foreground">
      <Helmet>
        <title>Islamic / Hijri Date Today — Hijri Calendar Converter | MyZoneTime</title>
        <meta name="description" content="Check today's Islamic (Hijri) date. Free Hijri calendar converter with Gregorian comparison. Perfect for Muslims and GCC region users." />
        <meta property="og:title" content="Islamic / Hijri Date Today | MyZoneTime" />
        <meta property="og:description" content="Today's Hijri date with Islamic calendar explanation and Gregorian comparison table." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hijri Calendar | MyZoneTime" />
        <meta name="twitter:description" content="View today's Hijri date, understand the Islamic calendar system, and compare Gregorian and Hijri months." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <CanonicalTag />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1696697386326-687ee5e69bdd" 
            alt="Islamic architecture" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4 backdrop-blur-md border border-secondary/30">
            <Moon className="w-4 h-4" />
            Islamic Calendar
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg text-balance">
            Today's Hijri Date
          </h1>
          
          <div className="py-8">
            <div className="text-3xl md:text-5xl font-bold tracking-tight text-primary drop-shadow-xl">
              {formattedHijri || 'Loading...'}
            </div>
            <p className="text-xl text-white/80 mt-4 font-medium drop-shadow-md">
              Gregorian: {formattedGregorian}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16">
        
        {/* Additional Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="premium-card p-6 flex flex-col items-center text-center">
            <Calendar className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Islamic Year</h3>
            <p className="text-3xl font-bold mt-2">{hijriDate?.year || '--'} AH</p>
          </div>
          <div className="premium-card p-6 flex flex-col items-center text-center">
            <Moon className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Current Month</h3>
            <p className="text-3xl font-bold mt-2">{hijriDate?.monthName || '--'}</p>
          </div>
          <div className="premium-card p-6 flex flex-col items-center text-center">
            <Info className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Current Day</h3>
            <p className="text-3xl font-bold mt-2">{hijriDate?.day || '--'}</p>
          </div>
        </section>

        {/* Explanation Section */}
        <section className="prose prose-neutral dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-6 text-foreground">How the Islamic Calendar Works</h2>
          <div className="text-muted-foreground leading-relaxed text-lg space-y-6">
            <p>
              The Hijri calendar, also known as the Islamic calendar, is a lunar calendar consisting of 12 months in a year of 354 or 355 days. It is used to determine the proper days of Islamic holidays and rituals, such as the annual period of fasting and the proper time for the Hajj (pilgrimage to Mecca).
            </p>
            <p>
              Unlike the Gregorian calendar, which is solar-based, the Hijri calendar relies on the sighting of the moon to determine the start of a new month. Because a lunar year is about 11 days shorter than a solar year, Islamic holidays shift slightly each year relative to the Gregorian calendar.
            </p>
            <p>
              The calendar began in 622 CE, the year of the Hijra—the migration of the Prophet Muhammad from Mecca to Medina. Years are denoted by "AH" (Anno Hegirae), which means "in the year of the Hijra."
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="premium-card p-8 overflow-hidden">
          <h2 className="text-2xl font-bold mb-6">Months Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Gregorian Month</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Hijri Month</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Days</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Approx. Dates</th>
                </tr>
              </thead>
              <tbody>
                {monthsComparison.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 font-medium">{row.greg}</td>
                    <td className="py-4 px-4 text-primary font-medium">{row.hijri}</td>
                    <td className="py-4 px-4 text-muted-foreground">{row.days}</td>
                    <td className="py-4 px-4 text-muted-foreground">{row.approx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Hijri Calendar FAQs */}
      <FAQSection 
        title="Hijri Calendar FAQs" 
        description="Common questions regarding the Islamic lunar calendar, how it works, and how it compares to the Gregorian calendar." 
        faqs={hijriFaqs} 
      />
    </main>
  );
}
