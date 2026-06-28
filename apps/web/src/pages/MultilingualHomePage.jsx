/**
 * MultilingualHomePage.jsx
 * Renders a fully localised home page for Arabic, Hindi, or Spanish.
 * Route: /ar  /hi  /es
 *
 * Strategy: Each language page targets non-English search queries
 * like "الوقت الآن في دبي", "दुबई में अभी क्या समय है", "hora en Dubai ahora".
 * time.is gets ~80% of traffic from non-English speakers — this closes that gap.
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Globe2, ArrowRightLeft, Calendar, Clock, Sun, Hash, Code } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';
import { TRANSLATIONS } from '@/data/translations.js';

// Live clocks for popular cities per language
const CITY_CLOCKS = {
  ar: [
    { name: 'دبي',       nameEn: 'Dubai',      tz: 'Asia/Dubai',      path: '/dubai' },
    { name: 'الرياض',    nameEn: 'Riyadh',     tz: 'Asia/Riyadh',     path: '/riyadh' },
    { name: 'أبوظبي',   nameEn: 'Abu Dhabi',  tz: 'Asia/Dubai',      path: '/abu-dhabi' },
    { name: 'لندن',      nameEn: 'London',     tz: 'Europe/London',   path: '/london' },
    { name: 'نيويورك',   nameEn: 'New York',   tz: 'America/New_York',path: '/new-york' },
    { name: 'مومباي',   nameEn: 'Mumbai',     tz: 'Asia/Kolkata',    path: '/mumbai' },
  ],
  hi: [
    { name: 'मुंबई',     nameEn: 'Mumbai',     tz: 'Asia/Kolkata',    path: '/mumbai' },
    { name: 'दिल्ली',    nameEn: 'Delhi',      tz: 'Asia/Kolkata',    path: '/delhi' },
    { name: 'दुबई',      nameEn: 'Dubai',      tz: 'Asia/Dubai',      path: '/dubai' },
    { name: 'लंदन',      nameEn: 'London',     tz: 'Europe/London',   path: '/london' },
    { name: 'न्यूयॉर्क', nameEn: 'New York',   tz: 'America/New_York',path: '/new-york' },
    { name: 'सिंगापुर',  nameEn: 'Singapore',  tz: 'Asia/Singapore',  path: '/singapore' },
  ],
  es: [
    { name: 'Madrid',        nameEn: 'Madrid',      tz: 'Europe/Madrid',   path: '/madrid' },
    { name: 'Ciudad de México', nameEn: 'Mexico City', tz: 'America/Mexico_City', path: '/mexico-city' },
    { name: 'Buenos Aires',  nameEn: 'Buenos Aires',tz: 'America/Argentina/Buenos_Aires', path: '/buenos-aires' },
    { name: 'Nueva York',    nameEn: 'New York',    tz: 'America/New_York',path: '/new-york' },
    { name: 'Londres',       nameEn: 'London',      tz: 'Europe/London',   path: '/london' },
    { name: 'Tokio',         nameEn: 'Tokyo',       tz: 'Asia/Tokyo',      path: '/tokyo' },
  ],
};

function CityCard({ city, t }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        timeZone: city.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      }));
      setDate(now.toLocaleDateString('en-US', {
        timeZone: city.tz, weekday: 'short', month: 'short', day: 'numeric',
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [city.tz]);

  return (
    <Link
      to={city.path}
      className="flex flex-col gap-1 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors"
    >
      <span className="text-sm font-semibold text-foreground">{city.name}</span>
      <span className="text-xs text-muted-foreground">{city.nameEn}</span>
      <span className="text-lg font-mono font-bold tabular-nums text-primary mt-1">{time}</span>
      <span className="text-xs text-muted-foreground">{date}</span>
    </Link>
  );
}

const TOOL_ICONS = {
  worldClock: Globe2,
  timezoneConverter: ArrowRightLeft,
  meetingPlanner: Calendar,
  hijriCalendar: Calendar,
  timeDifference: Clock,
  sunriseSunset: Sun,
  weekNumber: Hash,
  unixTime: Code,
};

const TOOL_PATHS = {
  worldClock: '/world-clock',
  timezoneConverter: '/timezone-converter',
  meetingPlanner: '/meeting-planner',
  hijriCalendar: '/hijri-calendar',
  timeDifference: '/time-difference-calculator',
  sunriseSunset: '/sunrise-sunset',
  weekNumber: '/week-number',
  unixTime: '/unix-time',
};

export default function MultilingualHomePage({ lang }) {
  const t = TRANSLATIONS[lang];
  if (!t) return null;

  const cities = CITY_CLOCKS[lang] || [];
  const isRTL = t.dir === 'rtl';
  const pathname = `/${lang}`;

  const BASE = 'https://myzonetime.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE}/${lang}#webpage`,
    url: `${BASE}/${lang}`,
    name: t.homeTitle,
    description: t.homeDesc,
    inLanguage: t.lang,
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#organization` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: t.langName, item: `${BASE}/${lang}` },
      ],
    },
  };

  const tools = ['worldClock','timezoneConverter','meetingPlanner','hijriCalendar','timeDifference','sunriseSunset','weekNumber','unixTime'];

  return (
    <>
      <Helmet>
        <html lang={t.lang} dir={t.dir} />
        <title>{t.homeTitle}</title>
        <meta name="description" content={t.homeDesc} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t.homeTitle} />
        <meta property="og:description" content={t.homeDesc} />
        <meta property="og:locale" content={t.locale} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE}/${lang}`} />
        {/* hreflang signals */}
        <link rel="alternate" hrefLang="en" href={BASE} />
        <link rel="alternate" hrefLang="ar" href={`${BASE}/ar`} />
        <link rel="alternate" hrefLang="hi" href={`${BASE}/hi`} />
        <link rel="alternate" hrefLang="es" href={`${BASE}/es`} />
        <link rel="alternate" hrefLang="x-default" href={BASE} />
      </Helmet>
      <CanonicalTag pathname={pathname} />
      <StructuredData schema={schema} />

      <main
        className="flex-1 w-full bg-background text-foreground"
        dir={t.dir}
        lang={t.lang}
        id="main-content"
      >
        {/* Hero */}
        <section className="relative w-full py-20 md:py-28 overflow-hidden bg-gradient-to-b from-card/50 to-background border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="container relative z-10 max-w-4xl mx-auto text-center space-y-5 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Globe2 className="w-4 h-4" aria-hidden="true" />
              <span>MyZoneTime</span>
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tight ${isRTL ? 'font-arabic' : ''}`}>
              {t.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/world-clock"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                {t.worldClock} →
              </Link>
              <Link
                to="/timezone-converter"
                className="px-6 py-3 bg-card border border-border rounded-xl font-semibold hover:border-primary/40 transition-colors text-sm"
              >
                {t.timezoneConverter}
              </Link>
            </div>
          </div>
        </section>

        {/* Live city clocks */}
        <section className="container max-w-5xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">{t.popularCities}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {cities.map(city => (
              <CityCard key={city.nameEn} city={city} t={t} />
            ))}
          </div>
        </section>

        {/* Tools grid */}
        <section className="border-t border-border/40 py-14 bg-card/30">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">{t.tools}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {tools.map(key => {
                const Icon = TOOL_ICONS[key];
                return (
                  <Link
                    key={key}
                    to={TOOL_PATHS[key]}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors text-center"
                  >
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium">{t[key]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-4">
          <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
        </div>

        {/* Time differences section */}
        <section className="py-14 border-t border-border/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">{t.diffSection}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {t.diffs.map(d => (
                <Link
                  key={d.path}
                  to={d.path}
                  className="px-4 py-2.5 rounded-xl bg-card border border-border/60 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why use section */}
        <section className="py-14 border-t border-border/40 bg-card/20">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-4">{t.whyUseTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{t.whyUseText}</p>
            <ul className="space-y-2">
              {t.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
              {lang === 'ar' ? 'الأسئلة الشائعة' : lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Preguntas Frecuentes'}
            </h2>
            <div className="space-y-6">
              {t.faqs.map((faq, i) => (
                <div key={i} className="border-b border-border/50 pb-6 last:border-0">
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Language switcher */}
        <section className="py-10 border-t border-border/40 bg-card/20">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {lang === 'ar' ? 'اقرأ بلغة أخرى' : lang === 'hi' ? 'अन्य भाषा में पढ़ें' : 'Leer en otro idioma'}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/"   className="px-4 py-2 rounded-lg bg-card border border-border text-sm hover:border-primary/40 transition-colors">🇺🇸 English</Link>
              {lang !== 'ar' && <Link to="/ar" className="px-4 py-2 rounded-lg bg-card border border-border text-sm hover:border-primary/40 transition-colors">🇦🇪 العربية</Link>}
              {lang !== 'hi' && <Link to="/hi" className="px-4 py-2 rounded-lg bg-card border border-border text-sm hover:border-primary/40 transition-colors">🇮🇳 हिन्दी</Link>}
              {lang !== 'es' && <Link to="/es" className="px-4 py-2 rounded-lg bg-card border border-border text-sm hover:border-primary/40 transition-colors">🇪🇸 Español</Link>}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
