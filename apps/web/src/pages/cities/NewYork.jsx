import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function NewYork() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is New York in?', answer: 'New York City is in the Eastern Time Zone. It uses Eastern Standard Time (EST, UTC−5) in winter and Eastern Daylight Time (EDT, UTC−4) in summer.' },
    { question: 'When does New York change clocks?', answer: 'New York clocks spring forward at 2:00 AM on the second Sunday of March and fall back at 2:00 AM on the first Sunday of November.' },
    { question: 'What are NYSE trading hours?', answer: 'The New York Stock Exchange (NYSE) and Nasdaq are open Monday through Friday from 9:30 AM to 4:00 PM Eastern Time. Pre-market trading runs 4:00–9:30 AM and after-hours trading 4:00–8:00 PM ET.' },
    { question: 'What is the time difference between New York and London?', answer: 'New York is 5 hours behind London in winter (EST vs GMT) and 4 hours behind in summer (EDT vs BST). The gap briefly differs in late March and early November when the two countries switch clocks on different dates.' },
    { question: 'What is the time difference between New York and Los Angeles?', answer: 'New York (ET) is always 3 hours ahead of Los Angeles (PT), regardless of daylight saving time, because both cities observe DST on the same schedule.' },
    { question: 'What is the time difference between New York and Dubai?', answer: 'Dubai (UTC+4) is 9 hours ahead of New York in winter (EST, UTC−5) and 8 hours ahead in summer (EDT, UTC−4).' },
    { question: 'What is EST vs EDT?', answer: 'EST (Eastern Standard Time) is UTC−5, observed from November to March. EDT (Eastern Daylight Time) is UTC−4, observed from March to November. Collectively they are referred to as Eastern Time (ET).' },
    { question: 'What is the time in New York right now?', answer: 'You can see the live current time in New York at the top of this page, updated every second. New York is in the Eastern Time zone (EST or EDT depending on the time of year).' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/new-york#city',
        name: 'New York City',
        url: BASE + '/new-york',
        containedInPlace: { '@type': 'Country', name: 'United States' },
        geo: { '@type': 'GeoCoordinates', latitude: 40.7128, longitude: -74.006 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'America/New_York' },
          { '@type': 'PropertyValue', name: 'UTC Offset (Winter)', value: 'UTC−5' },
          { '@type': 'PropertyValue', name: 'UTC Offset (Summer)', value: 'UTC−4' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'Yes' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/new-york#webpage',
        url: BASE + '/new-york',
        name: 'New York Time — Live Clock, EST/EDT | MyZoneTime',
        description: 'Current local time in New York City. Eastern Time — EST (UTC−5) in winter, EDT (UTC−4) in summer. NYSE hours and time differences.',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/new-york#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'New York Time', item: BASE + '/new-york' },
          ],
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>New York Time — Live Clock, EST/EDT | MyZoneTime</title>
        <meta name="description" content="Current time in New York. EST (UTC−5) winter, EDT (UTC−4) summer. NYSE hours, DST dates, and time differences to other cities." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="New York City, United States" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/new-york" />
        <meta property="og:title" content="New York Time — Live Clock EST/EDT | MyZoneTime" />
        <meta property="og:description" content="Live clock for New York City. Eastern Time — EST (UTC−5) in winter, EDT (UTC−4) in summer. NYSE hours and time differences." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="New York Time — EST/EDT Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in New York City. EST winter, EDT summer. Compare with London, Dubai, Los Angeles." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/new-york" />
      <StructuredData schema={schema} />
      <CityPage
        city="New York" country="United States" timezone="America/New_York"
        lat={40.7128} lon={-74.006}
        pathname="/new-york"
        description="New York City runs on Eastern Time — EST (UTC−5) in winter and EDT (UTC−4) in summer. Home to the New York Stock Exchange and Nasdaq, New York's financial markets set the global trading agenda each afternoon and are the most-watched market close in the world."
      >
        <section className="py-10 border-t border-border/40">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">New York Time Zone: Eastern Time (EST / EDT)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                New York City observes Eastern Time, which switches between Eastern Standard Time (EST, UTC−5) in winter and Eastern Daylight Time (EDT, UTC−4) in summer. The transition follows US federal law: clocks spring forward at 2:00 AM on the second Sunday of March and fall back at 2:00 AM on the first Sunday of November.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Eastern Time Zone covers the US East Coast including New York, New Jersey, Pennsylvania, Florida, Georgia, and more than a dozen other states. It is also used by the Canadian provinces of Ontario and Quebec, and by parts of the Caribbean.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">NYSE and Nasdaq Trading Hours (Eastern Time)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The New York Stock Exchange (NYSE) and Nasdaq — the two largest stock exchanges in the world by market capitalisation — are both located in New York City and operate on Eastern Time. Their standard session runs Monday to Friday, 9:30 AM to 4:00 PM ET, excluding US federal holidays.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold">Session</th>
                      <th className="text-left py-2 font-semibold">Hours (ET)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Pre-market</td><td className="py-2">4:00 AM – 9:30 AM</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Regular session</td><td className="py-2">9:30 AM – 4:00 PM</td></tr>
                    <tr><td className="py-2 pr-4">After-hours</td><td className="py-2">4:00 PM – 8:00 PM</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Time Differences: New York to Major World Cities</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold">City</th>
                      <th className="text-left py-2 pr-4 font-semibold">Time Zone</th>
                      <th className="text-left py-2 font-semibold">Difference from New York</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">London</td><td className="py-2 pr-4">GMT/BST</td><td className="py-2">+5 hrs (winter) / +4 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Dubai</td><td className="py-2 pr-4">GST</td><td className="py-2">+9 hrs (winter) / +8 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Paris / Berlin</td><td className="py-2 pr-4">CET/CEST</td><td className="py-2">+6 hrs (winter) / +5 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Mumbai</td><td className="py-2 pr-4">IST</td><td className="py-2">+10:30 hrs (winter) / +9:30 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Singapore</td><td className="py-2 pr-4">SGT</td><td className="py-2">+13 hrs (winter) / +12 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Los Angeles</td><td className="py-2 pr-4">PST/PDT</td><td className="py-2">−3 hrs (always)</td></tr>
                    <tr><td className="py-2 pr-4">Chicago</td><td className="py-2 pr-4">CST/CDT</td><td className="py-2">−1 hr (always)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Best Times to Schedule Calls with New York</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                <li><strong className="text-foreground">New York ↔ London:</strong> 9:00 AM–12:00 PM New York = 2:00–5:00 PM London. The overlap after New York's market open is the most productive transatlantic window.</li>
                <li><strong className="text-foreground">New York ↔ Dubai:</strong> 8:00–10:00 AM New York = 4:00–6:00 PM Dubai. New York mornings catch Dubai's late business day before it closes.</li>
                <li><strong className="text-foreground">New York ↔ Los Angeles:</strong> Any time during business hours works — LA is always 3 hours behind, so a 9 AM New York call is 6 AM LA (early but workable), while 12 PM New York = 9 AM LA is ideal.</li>
                <li><strong className="text-foreground">New York ↔ Singapore:</strong> There is no clean business-hours overlap. 8:00 AM New York = 9:00 PM Singapore. Early New York morning or Singapore end-of-day are the only options.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About New York City</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                New York City is the most populous city in the United States, with over 8 million residents and a metropolitan area of more than 20 million. It is a global centre for finance, media, fashion, arts, and culture. The city is home to the United Nations headquarters, Wall Street, and more Fortune 500 companies than any other American city.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                New York City comprises five boroughs: Manhattan, Brooklyn, Queens, The Bronx, and Staten Island. All five boroughs are on Eastern Time. The city is one of the most internationally connected on earth, with residents from nearly every country and business ties to every major financial centre worldwide.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="New York" relatedCity="London" />
      </CityPage>
    </>
  );
}
