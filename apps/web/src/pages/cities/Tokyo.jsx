import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function Tokyo() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Tokyo in?', answer: 'Tokyo is in the Japan Standard Time (JST) zone, which is UTC+9. Japan is one of the few major economies that uses a single nationwide timezone with no regional variations.' },
    { question: 'Does Tokyo observe daylight saving time?', answer: 'No. Japan abolished daylight saving time in 1952 and has never reintroduced it. Tokyo stays on JST (UTC+9) every day of the year, making it very predictable for international scheduling.' },
    { question: 'What are standard business hours in Tokyo?', answer: 'Standard business hours in Tokyo are Monday to Friday, 9:00 AM to 6:00 PM JST. Japanese business culture often extends working hours beyond 6 PM. The Tokyo Stock Exchange (TSE) trades from 9:00 AM to 3:30 PM JST with a lunch break from 11:30 AM to 12:30 PM.' },
    { question: 'What is the time difference between Tokyo and London?', answer: 'Tokyo (JST, UTC+9) is 9 hours ahead of London in winter (GMT, UTC+0) and 8 hours ahead in summer when London is on BST (UTC+1). Tokyo\'s clock never changes, so any variation is always due to London\'s DST.' },
    { question: 'What is the time difference between Tokyo and New York?', answer: 'Tokyo (JST, UTC+9) is 14 hours ahead of New York in winter (EST, UTC−5) and 13 hours ahead in summer (EDT, UTC−4). This large gap means the two cities\' business hours have almost no overlap.' },
    { question: 'What is the time difference between Tokyo and Sydney?', answer: 'Tokyo (UTC+9) is typically 1–2 hours behind Sydney. In Sydney\'s summer (AEDT, UTC+11), Tokyo is 2 hours behind. In Sydney\'s winter (AEST, UTC+10), Tokyo is 1 hour behind.' },
    { question: 'What is the best time to call Tokyo from Europe?', answer: 'The best time to call Tokyo from London is 8:00 AM–10:00 AM GMT, when it is 5:00 PM–7:00 PM in Tokyo — just before or right at the end of the business day. Earlier morning in Europe catches Tokyo\'s full business hours.' },
    { question: 'Why does Japan use only one time zone despite its size?', answer: 'Japan spans about 30 degrees of longitude, enough for two time zones, but chose to standardize on a single zone (JST, UTC+9) after adopting the Western time system in 1886. This simplifies domestic scheduling across the country\'s four main islands.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/tokyo#city',
        name: 'Tokyo',
        url: BASE + '/tokyo',
        containedInPlace: { '@type': 'Country', name: 'Japan' },
        geo: { '@type': 'GeoCoordinates', latitude: 35.6762, longitude: 139.6503 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Asia/Tokyo' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+9' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'JST' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'No' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/tokyo#webpage',
        url: BASE + '/tokyo',
        name: 'Tokyo Time — Live Clock, JST UTC+9 | MyZoneTime',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/tokyo#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'Tokyo Time', item: BASE + '/tokyo' },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': BASE + '/tokyo#webapp',
        name: 'Tokyo World Clock',
        url: BASE + '/tokyo',
        description: 'Live current time in Tokyo, Japan. JST (UTC+9). Accurate world clock with DST-aware time zone tools.',
        applicationCategory: 'UtilitiesApplication',
        applicationSubCategory: 'World Clock',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@id': BASE + '/#organization' },
        isPartOf: { '@id': BASE + '/#website' },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Tokyo Time — Live Clock, JST UTC+9 | MyZoneTime</title>
        <meta name="description" content="Current time in Tokyo, Japan. Japan Standard Time (JST, UTC+9), no DST. TSE hours, time differences to London and New York." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="JP-13" />
        <meta name="geo.placename" content="Tokyo, Japan" />
        <meta name="geo.position" content="35.6762;139.6503" />
        <meta name="ICBM" content="35.6762, 139.6503" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/tokyo" />
        <meta property="og:title" content="Tokyo Time — Live Clock JST UTC+9 | MyZoneTime" />
        <meta property="og:description" content="Live time in Tokyo, Japan. JST (UTC+9), no daylight saving. TSE hours and time differences to London, New York and Sydney." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Tokyo Time — JST Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Tokyo. JST (UTC+9), never changes. Time differences to London, NY and Sydney." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/tokyo" />
      <StructuredData schema={schema} />
      <CityPage
        city="Tokyo" country="Japan" timezone="Asia/Tokyo"
        lat={35.6762} lon={139.6503}
        heroImage="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"
        pathname="/tokyo"
        description="Tokyo operates on Japan Standard Time (JST, UTC+9) every day of the year with absolutely no daylight saving adjustments. As Asia's largest financial centre and home to the Tokyo Stock Exchange — the world's third-largest by market capitalisation — Tokyo anchors the Asian trading session and sets the day in motion before London and New York open."
      >
        <section className="py-10 border-t border-border/40">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Tokyo Time Zone: Japan Standard Time (JST, UTC+9)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Tokyo and all of Japan operate on Japan Standard Time (JST), which is UTC+9 year-round. Japan abolished daylight saving time in 1952 after a brief post-war experiment and has not observed it since. This makes JST one of the most stable major time zones in the world — the offset never changes, making it straightforward to schedule calls with Tokyo partners without worrying about seasonal adjustments.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                JST is shared across all of Japan. South Korea (KST) and North Korea (Pyongyang Time) also use UTC+9, making the time the same in Seoul and Tokyo. Indonesia's Eastern Time (WIT) also uses UTC+9, covering Papua and the Maluku Islands.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Tokyo Stock Exchange (TSE) Trading Hours</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Tokyo Stock Exchange (TSE) — now part of the Japan Exchange Group (JPX) — operates Monday to Friday. The morning session runs 9:00 AM to 11:30 AM JST and the afternoon session from 12:30 PM to 3:30 PM JST. In 2024, the TSE extended its afternoon close from 3:00 PM to 3:30 PM, giving traders additional time to react to US and European news.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Standard business hours in Japan are typically 9:00 AM to 6:00 PM JST, Monday to Friday, though many Japanese companies — especially in finance and technology — expect longer working hours. The concept of "karoshi" (overwork) has led to government reforms encouraging shorter hours, and many modern firms now operate closer to 9:00 AM to 5:30 PM.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Time Differences: Tokyo to Major Cities</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="border-b border-border"><th className="text-left py-2 pr-4 font-semibold">City</th><th className="text-left py-2 font-semibold">Difference from Tokyo (JST)</th></tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">London (GMT)</td><td className="py-2">−9 hrs (winter) / −8 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">New York (EST)</td><td className="py-2">−14 hrs (winter) / −13 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Dubai (GST)</td><td className="py-2">−5 hrs (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Singapore (SGT)</td><td className="py-2">−1 hr (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Sydney (AEST)</td><td className="py-2">+1 hr (AEST) / +2 hrs (AEDT)</td></tr>
                    <tr><td className="py-2 pr-4">Los Angeles (PST)</td><td className="py-2">−17 hrs (winter) / −16 hrs (summer)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Best Times to Call Tokyo from Other Cities</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                <li><strong className="text-foreground">Tokyo ↔ Singapore:</strong> Nearly full business day overlap. 9:00 AM–6:00 PM Tokyo = 8:00 AM–5:00 PM Singapore — the best Asian city pairing for scheduling.</li>
                <li><strong className="text-foreground">Tokyo ↔ Dubai:</strong> 2:00–6:00 PM Tokyo = 9:00 AM–1:00 PM Dubai. Tokyo afternoon aligns well with Dubai mornings.</li>
                <li><strong className="text-foreground">Tokyo ↔ London:</strong> Window is very tight. 5:00–6:00 PM Tokyo = 9:00–10:00 AM London (GMT). Tokyo must call early evening; London must call first thing in the morning.</li>
                <li><strong className="text-foreground">Tokyo ↔ New York:</strong> No business-hours overlap exists. When Tokyo business opens at 9 AM, it is 7 PM the previous day in New York. Video calls must be done outside normal hours for one party.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About Tokyo</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tokyo is the capital of Japan and the most populous metropolitan area in the world, with over 37 million people in the greater Tokyo area. It is Japan's political, economic, and cultural centre, home to the Imperial Palace, the Japanese government, and the headquarters of many of the world's largest companies including Toyota, Sony, Mitsubishi, and SoftBank. Tokyo consistently ranks among the world's top global cities for finance, innovation, and quality of life. Its train network — the most extensive in the world — moves millions of commuters daily with extraordinary punctuality, a reflection of the Japanese cultural emphasis on precision and time.
              </p>
            </div>
          </div>
        </section>
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Tokyo" relatedCity="Singapore" />
      </CityPage>
    </>
  );
}
