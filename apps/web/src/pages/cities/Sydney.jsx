import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function Sydney() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Australia/Sydney', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Sydney in?', answer: 'Sydney is in the Australian Eastern Time Zone. It uses Australian Eastern Standard Time (AEST, UTC+10) in winter and Australian Eastern Daylight Time (AEDT, UTC+11) in summer.' },
    { question: 'Does Sydney observe daylight saving time?', answer: 'Yes. New South Wales (where Sydney is located) observes daylight saving time. Clocks move forward 1 hour to AEDT (UTC+11) on the first Sunday in October, and back to AEST (UTC+10) on the first Sunday in April. Note: Queensland (Brisbane) does NOT observe DST, creating a split within Australia.' },
    { question: 'What are standard business hours in Sydney?', answer: 'Standard business hours in Sydney are Monday to Friday, 9:00 AM to 5:30 PM AEST/AEDT. The Australian Securities Exchange (ASX) trades from 10:00 AM to 4:00 PM Sydney time. Financial services often start from 7:30 AM.' },
    { question: 'What is the time difference between Sydney and London?', answer: 'The time difference varies due to opposite hemisphere DST. In Sydney\'s summer (AEDT, UTC+11, Oct–Apr), Sydney is 11 hours ahead of London GMT. In Sydney\'s winter (AEST, UTC+10, Apr–Oct) when London is on BST (UTC+1), the gap is just 9 hours. It ranges from 9 to 11 hours throughout the year.' },
    { question: 'What is the time difference between Sydney and New York?', answer: 'Sydney is typically 14–16 hours ahead of New York. The exact gap changes four times per year as each city independently starts and ends daylight saving on different schedules. In Sydney\'s summer/New York\'s winter it can be 16 hours; in Sydney\'s winter/New York\'s summer it can be 14 hours.' },
    { question: 'What is the time difference between Sydney and Dubai?', answer: 'Sydney (AEST, UTC+10) is 6 hours ahead of Dubai (GST, UTC+4) in Sydney\'s winter. When Sydney is on AEDT (UTC+11), it is 7 hours ahead. Dubai never changes its clocks.' },
    { question: 'What is the best time to call Sydney from the UK?', answer: 'The best overlap for UK–Sydney calls is 7:00 AM–9:00 AM London time (5:00 PM–7:00 PM Sydney time in winter, 6:00 PM–8:00 PM in summer). This catches Sydney near the end of business and London at the start of the working day.' },
    { question: 'Why does Brisbane not follow Sydney time during summer?', answer: 'Queensland (Brisbane, UTC+10) does not observe daylight saving time, while New South Wales (Sydney) does. During Sydney\'s summer (AEDT, UTC+11), Sydney is 1 hour ahead of Brisbane. This creates scheduling complexity within Australia from October to April each year.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/sydney#city',
        name: 'Sydney',
        url: BASE + '/sydney',
        containedInPlace: { '@type': 'Country', name: 'Australia' },
        geo: { '@type': 'GeoCoordinates', latitude: -33.8688, longitude: 151.2093 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Australia/Sydney' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+10/UTC+11' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'AEST/AEDT' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'Yes' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/sydney#webpage',
        url: BASE + '/sydney',
        name: 'Sydney Time — Live Clock, AEST/AEDT | MyZoneTime',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/sydney#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'Sydney Time', item: BASE + '/sydney' },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': BASE + '/sydney#webapp',
        name: 'Sydney World Clock',
        url: BASE + '/sydney',
        description: 'Live current time in Sydney, Australia. AEST/AEDT (UTC+10/UTC+11). Accurate world clock with DST-aware time zone tools.',
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
        <title>Sydney Time — Live Clock, AEST/AEDT UTC+10/+11 | MyZoneTime</title>
        <meta name="description" content="Current time in Sydney. AEST (UTC+10) winter, AEDT (UTC+11) summer. ASX hours, DST dates, time differences to London and New York." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="AU-NSW" />
        <meta name="geo.placename" content="Sydney, Australia" />
        <meta name="geo.position" content="-33.8688;151.2093" />
        <meta name="ICBM" content="-33.8688, 151.2093" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/sydney" />
        <meta property="og:title" content="Sydney Time — Live Clock AEST/AEDT | MyZoneTime" />
        <meta property="og:description" content="Live time in Sydney, Australia. AEST (UTC+10) in winter, AEDT (UTC+11) in summer. ASX hours and time differences to London and New York." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Sydney Time — AEST/AEDT Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Sydney. AEST in winter, AEDT in summer. Time differences to London and New York." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/sydney" />
      <StructuredData schema={schema} />
      <CityPage
        city="Sydney" country="Australia" timezone="Australia/Sydney"
        lat={-33.8688} lon={151.2093}
        heroImage="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9"
        pathname="/sydney"
        description="Sydney runs on Australian Eastern Time — AEST (UTC+10) in autumn and winter, and AEDT (UTC+11) in spring and summer. As Australia's largest city and financial capital, home to the ASX, Sydney is the first major financial centre to open each trading day, setting the tone for Asian and then global markets."
      >
        <section className="py-10 border-t border-border/40">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Sydney Time Zone: AEST and AEDT</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sydney uses Australian Eastern Time, which switches between AEST (Australian Eastern Standard Time, UTC+10) and AEDT (Australian Eastern Daylight Time, UTC+11). Australia's DST runs in the opposite direction to the northern hemisphere: clocks spring forward in early October and fall back in early April. This means Sydney is at UTC+11 during the Australian summer (October–April) and UTC+10 during winter (April–October).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This reversed DST schedule can cause confusion when scheduling with Northern Hemisphere counterparts, because both parties may be shifting clocks at similar times of year — narrowing or widening the gap unpredictably. Always verify Sydney's current UTC offset before scheduling international calls in March–April or September–October.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">ASX Trading Hours and Sydney Business Day</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Australian Securities Exchange (ASX) operates Monday to Friday with its main equities session from 10:00 AM to 4:00 PM AEST/AEDT. A pre-open phase runs 7:00–10:00 AM and a closing auction from 4:00–4:12 PM. As the first major equity market to open each day, the ASX gives global investors their first look at market sentiment before Tokyo, Hong Kong, London, or New York open.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Standard business hours in Sydney are Monday to Friday, 9:00 AM to 5:00 PM AEST/AEDT. Sydney is UTC+10/+11, making it one of the most advanced time zones relative to global peers — while Sydney is having lunch, it is still yesterday evening in New York.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Time Differences: Sydney to Major Cities</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="border-b border-border"><th className="text-left py-2 pr-4 font-semibold">City</th><th className="text-left py-2 font-semibold">Difference from Sydney</th></tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">London (GMT)</td><td className="py-2">−10 hrs (AEST) / −11 hrs (AEDT)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Dubai (GST)</td><td className="py-2">−6 hrs (AEST) / −7 hrs (AEDT)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">New York (EST)</td><td className="py-2">−15 hrs (AEST) / −16 hrs (AEDT)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Singapore (SGT)</td><td className="py-2">−2 hrs (AEST) / −3 hrs (AEDT)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Tokyo (JST)</td><td className="py-2">−1 hr (AEST) / −2 hrs (AEDT)</td></tr>
                    <tr><td className="py-2 pr-4">Mumbai (IST)</td><td className="py-2">−4:30 hrs (AEST) / −5:30 hrs (AEDT)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About Sydney</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sydney is Australia's largest city with a population of over 5.3 million in the greater metropolitan area. It is the capital of New South Wales and the country's primary financial, commercial, and cultural hub. Sydney Harbour, the Opera House, and the Harbour Bridge make it one of the world's most recognisable cities. As a financial centre, Sydney hosts the headquarters of Australia's four major banks, the ASX, and hundreds of multinational regional offices. Its port and airport are the largest in Australia by volume, connecting it to every major time zone on earth.
              </p>
            </div>
          </div>
        </section>
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Sydney" relatedCity="London" />
      </CityPage>
    </>
  );
}
