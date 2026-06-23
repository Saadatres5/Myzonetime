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
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Dubai" relatedCity="London" />
      </CityPage>
    </>
  );
}
