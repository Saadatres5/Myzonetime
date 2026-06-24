import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function Dubai() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Dubai in?', answer: 'Dubai is in the Gulf Standard Time (GST) zone, which is UTC+4. It is 4 hours ahead of Coordinated Universal Time (UTC) and does not shift for any season.' },
    { question: 'Does Dubai observe daylight saving time?', answer: 'No. Dubai does not observe daylight saving time. The UAE permanently stays on GST (UTC+4) year-round, so the offset never changes regardless of the season.' },
    { question: 'What are standard business hours in Dubai?', answer: 'Standard business hours in Dubai are Sunday to Thursday, 9:00 AM to 6:00 PM GST. Friday and Saturday form the UAE weekend. Many international businesses also operate Monday to Friday.' },
    { question: 'What is the time difference between Dubai and London?', answer: 'Dubai (UTC+4) is 4 hours ahead of London in winter (when London is on GMT, UTC+0), and 3 hours ahead in summer when the UK observes British Summer Time (BST, UTC+1).' },
    { question: 'What is the time difference between Dubai and New York?', answer: 'Dubai (UTC+4) is 9 hours ahead of New York in winter (when New York is on EST, UTC−5) and 8 hours ahead in summer when New York observes EDT (UTC−4).' },
    { question: 'What is the time difference between Dubai and India?', answer: 'Dubai (UTC+4) is 30 minutes behind India Standard Time (IST, UTC+5:30). For example, when it is 12:00 PM in Dubai, it is 12:30 PM in Mumbai or Delhi.' },
    { question: 'Is Dubai a good location for international business calls?', answer: 'Yes. Dubai\'s UTC+4 position overlaps with European afternoons and Asian mornings, making 9 AM–12 PM Dubai time an excellent window for calls with both London (5–8 AM GMT) and Mumbai (10:30 AM–1:30 PM IST).' },
    { question: 'How do I convert Dubai time to my local time?', answer: 'Add or subtract from UTC+4. For Los Angeles (UTC−8), subtract 12 hours. For Paris (UTC+1 in winter), subtract 3 hours. Use MyZoneTime\'s free time zone converter for an instant, DST-aware result.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/dubai#city',
        name: 'Dubai',
        url: BASE + '/dubai',
        containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' },
        geo: { '@type': 'GeoCoordinates', latitude: 25.2048, longitude: 55.2708 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Asia/Dubai' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+4' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'GST' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'No' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/dubai#webpage',
        url: BASE + '/dubai',
        name: 'Dubai Time — Live Clock, GST UTC+4 | MyZoneTime',
        description: 'Current local time in Dubai, UAE. Gulf Standard Time (GST, UTC+4). No daylight saving. Business hours, time differences to London, New York and India.',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/dubai#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'Dubai Time', item: BASE + '/dubai' },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': BASE + '/dubai#webapp',
        name: 'Dubai World Clock',
        url: BASE + '/dubai',
        description: 'Live current time in Dubai, UAE. Gulf Standard Time (GST, UTC+4). Accurate clock with DST-aware time zone comparison tools.',
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
        <title>Dubai Time — Live Clock, GST UTC+4 | MyZoneTime</title>
        <meta name="description" content="Current time in Dubai, UAE. Gulf Standard Time (GST, UTC+4), no DST. Business hours, time differences to London and New York." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai, United Arab Emirates" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/dubai" />
        <meta property="og:title" content="Dubai Time — Live Clock, GST UTC+4 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Dubai, UAE. Gulf Standard Time (GST, UTC+4). No daylight saving ever. Business hours, call windows, and time differences." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Dubai Time — Live Clock GST UTC+4 | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Dubai, UAE. GST (UTC+4), no daylight saving. Compare with London, New York, India." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/dubai" />
      <StructuredData schema={schema} />
      <CityPage
        city="Dubai" country="United Arab Emirates" timezone="Asia/Dubai"
        lat={25.2048} lon={55.2708}
        heroImage="https://images.unsplash.com/photo-1637739256584-43c96dac387f"
        pathname="/dubai"
        description="Dubai runs on Gulf Standard Time (GST, UTC+4) year-round with no daylight saving adjustments. As the commercial heart of the UAE and a global aviation hub, it bridges Asian mornings with European afternoons — making it one of the world's most strategically timed cities for international business."
      >
        {/* Rich content for AdSense quality */}
        <section className="py-10 border-t border-border/40">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Dubai Time Zone: Gulf Standard Time (GST, UTC+4)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dubai operates on Gulf Standard Time (GST), which is UTC+4 — meaning it is always 4 hours ahead of Coordinated Universal Time. Unlike most major financial hubs, Dubai does not observe daylight saving time. The UAE made this permanent decision decades ago, giving businesses and residents a consistent, predictable clock year-round. This stability makes Dubai particularly reliable for international scheduling: you never need to recalculate offsets in March or November.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Gulf Standard Time zone is shared by the UAE and Oman. Other neighbouring countries use slightly different offsets: Saudi Arabia is on AST (UTC+3), Qatar on AST (UTC+3), and Bahrain also on AST (UTC+3) — all one hour behind Dubai. India, just across the Arabian Sea, uses IST (UTC+5:30), making Dubai 30 minutes behind Mumbai and Delhi despite being geographically close.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Dubai Business Hours and the Working Week</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The standard UAE working week runs Sunday through Thursday, with Friday and Saturday as the official weekend. Standard business hours are 9:00 AM to 6:00 PM GST, though many companies in the financial and technology sectors operate 8:00 AM to 5:00 PM or 9:00 AM to 5:00 PM Monday through Friday to align with Western counterparts.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Dubai International Financial Centre (DIFC) and Abu Dhabi Global Market (ADGM) shifted to a Monday–Friday working week in January 2022, following a government reform. Many multinational companies operating out of Dubai now follow this schedule to better overlap with European and American markets.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                During Ramadan, working hours are legally reduced. Government employees work 6 hours per day, and many private businesses follow suit. The exact dates of Ramadan shift each year because they follow the Islamic lunar calendar.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Time Differences: Dubai to Major World Cities</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold">City</th>
                      <th className="text-left py-2 pr-4 font-semibold">Time Zone</th>
                      <th className="text-left py-2 font-semibold">Difference from Dubai</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">London</td><td className="py-2 pr-4">GMT/BST</td><td className="py-2">−4 hrs (winter) / −3 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">New York</td><td className="py-2 pr-4">EST/EDT</td><td className="py-2">−9 hrs (winter) / −8 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Mumbai / Delhi</td><td className="py-2 pr-4">IST</td><td className="py-2">+0:30 hrs (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Singapore</td><td className="py-2 pr-4">SGT</td><td className="py-2">+4 hrs (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Tokyo</td><td className="py-2 pr-4">JST</td><td className="py-2">+5 hrs (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Sydney</td><td className="py-2 pr-4">AEST/AEDT</td><td className="py-2">+6 hrs (winter) / +7 hrs (summer)</td></tr>
                    <tr><td className="py-2 pr-4">Paris / Berlin</td><td className="py-2 pr-4">CET/CEST</td><td className="py-2">−3 hrs (winter) / −2 hrs (summer)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Best Time to Schedule Calls with Dubai</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dubai's UTC+4 position places it in an advantageous crossroads for global business. Here are the best overlap windows for scheduling calls:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                <li><strong className="text-foreground">Dubai ↔ London:</strong> 9:00 AM–1:00 PM Dubai time overlaps with 5:00–9:00 AM London (GMT). The afternoon window of 1:00–5:00 PM Dubai aligns with 9:00 AM–1:00 PM London.</li>
                <li><strong className="text-foreground">Dubai ↔ New York:</strong> Best window is 4:00–6:00 PM Dubai (8:00–10:00 AM New York EST). Morning Dubai time (9:00–11:00 AM) falls in the early hours in New York (1:00–3:00 AM), so late afternoon Dubai is strongly preferred.</li>
                <li><strong className="text-foreground">Dubai ↔ India:</strong> Nearly all of the Dubai business day overlaps with India. Any time from 9:00 AM to 6:00 PM Dubai is 9:30 AM to 6:30 PM in Mumbai or Delhi.</li>
                <li><strong className="text-foreground">Dubai ↔ Singapore / Hong Kong:</strong> 9:00 AM–2:00 PM Dubai time maps to 1:00–6:00 PM in Singapore (SGT, UTC+8). A productive overlap for trade and financial calls.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About Dubai</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dubai is the most populous city in the United Arab Emirates and one of the world's leading financial, commercial, and tourism hubs. Located on the southeast coast of the Persian Gulf, it is part of the emirate of Dubai and serves as the country's business capital. The city is home to the world's tallest building, the Burj Khalifa, and one of the busiest airports in the world, Dubai International Airport (DXB).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The city's population is highly international — over 85% of residents are expatriates from more than 200 nationalities. This diversity means that Dubai workers and businesses regularly interact across nearly every time zone on the planet, making accurate time zone tools essential for daily communication and scheduling.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Dubai" relatedCity="London" />
      </CityPage>
    </>
  );
}
