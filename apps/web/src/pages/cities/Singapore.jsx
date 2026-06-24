import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function Singapore() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Singapore in?', answer: 'Singapore is in the Singapore Standard Time (SGT) zone, which is UTC+8. Singapore uses a single national timezone and has no regional variations.' },
    { question: 'Does Singapore observe daylight saving time?', answer: 'No. Singapore does not observe daylight saving time. It has remained on SGT (UTC+8) without change since 1982, making it one of the most predictable clocks in Asia for international scheduling.' },
    { question: 'What are standard business hours in Singapore?', answer: 'Standard business hours in Singapore are Monday to Friday, 9:00 AM to 6:00 PM SGT. The Singapore Exchange (SGX) operates from 9:00 AM to 5:00 PM SGT. Many multinationals maintain early-start schedules to overlap with European afternoon hours.' },
    { question: 'What is the time difference between Singapore and London?', answer: 'Singapore (SGT, UTC+8) is 8 hours ahead of London in winter (GMT, UTC+0) and 7 hours ahead in summer when London is on BST (UTC+1). Singapore\'s clock never changes, so any variation is caused by London\'s DST.' },
    { question: 'What is the time difference between Singapore and Dubai?', answer: 'Singapore (SGT, UTC+8) is 4 hours ahead of Dubai (GST, UTC+4). Since neither city observes daylight saving time, this 4-hour difference is constant year-round.' },
    { question: 'What is the time difference between Singapore and Sydney?', answer: 'Sydney is typically 2–3 hours ahead of Singapore. When Sydney is on AEDT (UTC+11, October–April), it is 3 hours ahead. When on AEST (UTC+10, April–October), it is 2 hours ahead. Singapore never changes.' },
    { question: 'What is the best time to call Singapore from Europe?', answer: 'The best time to call Singapore from London is 1:00 AM–9:00 AM GMT, which corresponds to 9:00 AM–5:00 PM SGT — Singapore\'s full business day. For a more practical overlap, call between 7:00 AM–9:00 AM London time for Singapore\'s late afternoon.' },
    { question: 'Why is Singapore in UTC+8 despite being geographically in UTC+7?', answer: 'Singapore sits close to the UTC+7 meridian geographically, but adopted UTC+8 in 1982 to align with Malaysia and facilitate closer economic integration. The decision prioritised regional business convenience over geographic accuracy.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/singapore#city',
        name: 'Singapore',
        url: BASE + '/singapore',
        containedInPlace: { '@type': 'Country', name: 'Singapore' },
        geo: { '@type': 'GeoCoordinates', latitude: 1.3521, longitude: 103.8198 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Asia/Singapore' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+8' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'SGT' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'No' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/singapore#webpage',
        url: BASE + '/singapore',
        name: 'Singapore Time — Live Clock, SGT UTC+8 | MyZoneTime',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/singapore#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'Singapore Time', item: BASE + '/singapore' },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': BASE + '/singapore#webapp',
        name: 'Singapore World Clock',
        url: BASE + '/singapore',
        description: 'Live current time in Singapore, Singapore. SGT (UTC+8). Accurate world clock with DST-aware time zone tools.',
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
        <title>Singapore Time — Live Clock, SGT UTC+8 | MyZoneTime</title>
        <meta name="description" content="Current time in Singapore. Singapore Standard Time (SGT, UTC+8), no DST. SGX hours, time differences to London, Dubai, and Sydney." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="SG" />
        <meta name="geo.placename" content="Singapore" />
        <meta name="geo.position" content="1.3521;103.8198" />
        <meta name="ICBM" content="1.3521, 103.8198" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/singapore" />
        <meta property="og:title" content="Singapore Time — Live Clock SGT UTC+8 | MyZoneTime" />
        <meta property="og:description" content="Live time in Singapore. SGT (UTC+8), no daylight saving ever. SGX hours, time differences to London, Dubai and Sydney." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Singapore Time — SGT Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Singapore. SGT (UTC+8), fixed year-round. Time differences to London, Dubai, Sydney." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/singapore" />
      <StructuredData schema={schema} />
      <CityPage
        city="Singapore" country="Singapore" timezone="Asia/Singapore"
        lat={1.3521} lon={103.8198}
        heroImage="https://images.unsplash.com/photo-1525625293386-3f8f99389edd"
        pathname="/singapore"
        description="Singapore operates on Singapore Standard Time (SGT, UTC+8) year-round with no daylight saving. As Southeast Asia's premier financial hub and one of the world's busiest ports, Singapore's fixed clock makes it a reliable anchor for cross-timezone scheduling between European, Middle Eastern and Asia-Pacific business partners."
      >
        <section className="py-10 border-t border-border/40">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Singapore Time Zone: SGT (UTC+8)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Singapore uses Singapore Standard Time (SGT), which is UTC+8 year-round. The country abolished daylight saving time in 1982 and has not observed it since, giving businesses and residents a completely stable clock with no seasonal adjustments. This predictability is one reason Singapore is favoured as a regional headquarters for multinational companies operating across Asia.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                SGT is shared with several neighbouring countries including Malaysia, the Philippines, Brunei, and parts of Indonesia (Western Indonesia Time). Hong Kong and China also use UTC+8 (China Standard Time / Hong Kong Time), making Singapore's business hours naturally aligned with these major regional economies.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Singapore Business Hours and Financial Markets</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Standard business hours in Singapore are Monday to Friday, 9:00 AM to 6:00 PM SGT. The Singapore Exchange (SGX) operates two sessions: a morning session from 9:00 AM to 12:00 PM and an afternoon session from 1:00 PM to 5:00 PM SGT. Derivatives markets run extended hours.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Singapore's opening hours overlap with the tail end of the Tokyo and Sydney trading sessions and the early portion of the European session (which opens around 2:00–3:00 PM SGT in winter). This makes Singapore a genuine bridge between East Asian and European markets.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Time Differences: Singapore to Major Cities</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="border-b border-border"><th className="text-left py-2 pr-4 font-semibold">City</th><th className="text-left py-2 font-semibold">Difference from Singapore</th></tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">London (GMT)</td><td className="py-2">−8 hrs (winter) / −7 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Dubai (GST)</td><td className="py-2">−4 hrs (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">New York (EST)</td><td className="py-2">−13 hrs (winter) / −12 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Tokyo (JST)</td><td className="py-2">+1 hr (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Sydney (AEST)</td><td className="py-2">+2 hrs (winter) / +3 hrs (summer)</td></tr>
                    <tr><td className="py-2 pr-4">Mumbai (IST)</td><td className="py-2">−2:30 hrs (always)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About Singapore</h2>
              <p className="text-muted-foreground leading-relaxed">
                Singapore is a city-state and island nation at the southern tip of the Malay Peninsula. With a population of about 5.9 million, it is one of the world's most densely populated countries and consistently ranks as one of the most economically competitive. Singapore is Asia's leading financial centre, home to major banks, commodity traders, and tech firms, and its port is one of the world's busiest container ports. Its stable government, low taxes, and strategic location make it the preferred Asian base for thousands of international companies.
              </p>
            </div>
          </div>
        </section>
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Singapore" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}
