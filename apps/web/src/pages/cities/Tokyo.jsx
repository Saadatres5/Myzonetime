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
  }
  };

  return (
    <>
      <Helmet>
        <title>Tokyo Time — Live Clock, JST UTC+9 | MyZoneTime</title>
        <meta name="description" content="Current local time in Tokyo, Japan. JST (UTC+9), no daylight saving ever. TSE hours, time differences to London, New York and Sydney explained." />
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
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Tokyo" relatedCity="Singapore" />
      </CityPage>
    </>
  );
}
