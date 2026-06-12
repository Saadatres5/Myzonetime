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
    { question: 'What time zone is New York in?', answer: 'New York is in the Eastern Time Zone. It observes Eastern Standard Time (EST, UTC−5) from the first Sunday of November to the second Sunday of March, and Eastern Daylight Time (EDT, UTC−4) during the rest of the year.' },
    { question: 'Does New York observe daylight saving time?', answer: 'Yes. New York observes daylight saving time (DST). Clocks spring forward 1 hour to EDT (UTC−4) on the second Sunday of March, and fall back 1 hour to EST (UTC−5) on the first Sunday of November.' },
    { question: 'What are standard business hours in New York?', answer: 'Standard business hours in New York are Monday to Friday, 9:00 AM to 5:00 PM ET. Wall Street and financial firms often open earlier, with the New York Stock Exchange (NYSE) trading from 9:30 AM to 4:00 PM ET.' },
    { question: 'What is the time difference between New York and London?', answer: 'New York (EST, UTC−5) is 5 hours behind London (GMT, UTC+0) in winter. In summer, the gap is usually 4 or 5 hours depending on when each region changes clocks. London switches DST a few weeks before New York, creating a brief 4-hour window.' },
    { question: 'What is the time difference between New York and Los Angeles?', answer: 'New York (Eastern Time) is always 3 hours ahead of Los Angeles (Pacific Time). Both cities observe DST simultaneously, so the 3-hour difference never changes throughout the year.' },
    { question: 'What is the time difference between New York and Dubai?', answer: 'Dubai (GST, UTC+4) is 9 hours ahead of New York in winter (EST, UTC−5) and 8 hours ahead in summer (EDT, UTC−4). Dubai does not change its clocks, so the difference shifts only when New York changes for DST.' },
    { question: 'What is the best time to call New York from Europe?', answer: 'The best time to call New York from London is 2:00 PM–6:00 PM GMT/BST (9:00 AM–1:00 PM New York time). From Paris (CET, UTC+1), call between 3:00 PM–7:00 PM local to reach New York during business hours.' },
    { question: 'Is New York always UTC−5?', answer: 'No. New York is UTC−5 only during Eastern Standard Time (EST), which runs from November to March. During daylight saving (March to November), New York is UTC−4 (EDT). Use MyZoneTime\'s live clock for the exact current offset.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/new-york#city',
        name: 'New York',
        url: BASE + '/new-york',
        containedInPlace: { '@type': 'Country', name: 'United States' },
        geo: { '@type': 'GeoCoordinates', latitude: 40.7128, longitude: -74.006 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'America/New_York' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC-5/UTC-4' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'EST/EDT' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'Yes' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/new-york#webpage',
        url: BASE + '/new-york',
        name: 'New York Time — Live Clock, EST/EDT | MyZoneTime',
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
      {
        '@type': 'WebApplication',
        '@id': BASE + '/new-york#webapp',
        name: 'New York World Clock',
        url: BASE + '/new-york',
        description: 'Live current time in New York, United States. EST/EDT (UTC-5/UTC-4). Accurate world clock with DST-aware time zone tools.',
        applicationCategory: 'UtilitiesApplication',
        applicationSubCategory: 'World Clock',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@id': BASE + '/#organization' },
        isPartOf: { '@id': BASE + '/#website' },
      },
    ],
  }
  };

  return (
    <>
      <Helmet>
        <title>New York Time — Live Clock, EST/EDT UTC−5/−4 | MyZoneTime</title>
        <meta name="description" content="Current local time in New York City, USA. Eastern Standard Time (EST, UTC−5) in winter, EDT (UTC−4) in summer. NYSE hours, DST dates and time differences." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="New York City, United States" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/new-york" />
        <meta property="og:title" content="New York Time — Live Clock EST/EDT | MyZoneTime" />
        <meta property="og:description" content="Live time in New York City. EST (UTC−5) in winter, EDT (UTC−4) in summer. NYSE hours, DST schedule and time differences to London, LA and Dubai." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="New York Time — EST/EDT Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in New York. EST in winter, EDT in summer. Time differences to London, LA and Dubai." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/new-york" />
      <StructuredData schema={schema} />
      <CityPage
        city="New York" country="United States" timezone="America/New_York"
        lat={40.7128} lon={-74.0060}
        heroImage="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"
        pathname="/new-york"
        description="New York City operates on Eastern Time (ET), shifting between EST (UTC−5) in winter and EDT (UTC−4) in summer. Home to the New York Stock Exchange and the world's largest financial market, New York's clock sets the pace for the US trading day and is the critical overlap point between European and American business hours."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="New York" relatedCity="London" />
      </CityPage>
    </>
  );
}
