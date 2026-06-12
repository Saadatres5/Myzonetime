import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function London() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is London in?', answer: 'London uses Greenwich Mean Time (GMT, UTC+0) in winter, and switches to British Summer Time (BST, UTC+1) in summer. BST begins on the last Sunday in March and ends on the last Sunday in October.' },
    { question: 'Does London observe daylight saving time?', answer: 'Yes. London observes daylight saving time (DST). Clocks go forward 1 hour to BST (UTC+1) on the last Sunday of March, and back 1 hour to GMT (UTC+0) on the last Sunday of October.' },
    { question: 'What are standard business hours in London?', answer: 'Standard business hours in London are Monday to Friday, 9:00 AM to 5:30 PM GMT/BST. The City of London financial district often starts earlier, with trading floors active from 7:00 AM.' },
    { question: 'What is the time difference between London and New York?', answer: 'London is normally 5 hours ahead of New York (EST, UTC−5) in winter. In summer, the gap narrows to 4 hours when New York switches to EDT (UTC−4) and London is on BST (UTC+1). There are brief periods in spring and autumn when it is only 4 hours due to DST changes happening on different dates.' },
    { question: 'What is the time difference between London and Dubai?', answer: 'Dubai (GST, UTC+4) is 4 hours ahead of London in winter (GMT, UTC+0) and 3 hours ahead in summer when London is on BST (UTC+1). Dubai never changes its clocks.' },
    { question: 'What is the time difference between London and Sydney?', answer: 'Sydney is 10–11 hours ahead of London when both are on standard time, but this shifts seasonally because Australia observes DST in the opposite hemisphere. The gap ranges from 9 to 11 hours depending on the time of year.' },
    { question: 'What is the best time to call London from the US?', answer: 'The best time to call London from the US East Coast is 8:00 AM–12:00 PM Eastern Time (1:00 PM–5:00 PM London time). From the US West Coast, try 5:00 AM–9:00 AM Pacific Time to catch London during business hours.' },
    { question: 'Is London GMT the same as UTC?', answer: 'GMT and UTC are effectively the same offset (both UTC+0) but are different standards. UTC is the modern international time standard maintained by atomic clocks, while GMT is a historical timezone. For practical purposes of telling time, they are identical.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/london#city',
        name: 'London',
        url: BASE + '/london',
        containedInPlace: { '@type': 'Country', name: 'United Kingdom' },
        geo: { '@type': 'GeoCoordinates', latitude: 51.5074, longitude: -0.1278 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Europe/London' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+0/UTC+1' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'GMT/BST' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'Yes' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/london#webpage',
        url: BASE + '/london',
        name: 'London Time — Live Clock, GMT/BST | MyZoneTime',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/london#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'London Time', item: BASE + '/london' },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': BASE + '/london#webapp',
        name: 'London World Clock',
        url: BASE + '/london',
        description: 'Live current time in London, United Kingdom. GMT/BST (UTC+0/UTC+1). Accurate world clock with DST-aware time zone tools.',
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
        <title>London Time — Live Clock, GMT/BST UTC+0/+1 | MyZoneTime</title>
        <meta name="description" content="Current local time in London, UK. GMT (UTC+0) in winter, BST (UTC+1) in summer. Business hours, DST dates and time differences to NY and Dubai." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="GB-ENG" />
        <meta name="geo.placename" content="London, United Kingdom" />
        <meta name="geo.position" content="51.5074;-0.1278" />
        <meta name="ICBM" content="51.5074, -0.1278" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/london" />
        <meta property="og:title" content="London Time — Live Clock GMT/BST | MyZoneTime" />
        <meta property="og:description" content="Live time in London, UK. GMT (UTC+0) in winter, BST (UTC+1) in summer. DST schedule, business hours and time differences to New York, Dubai and Sydney." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="London Time — GMT/BST Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in London. GMT in winter, BST in summer. Time differences to NY, Dubai, Sydney." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/london" />
      <StructuredData schema={schema} />
      <CityPage
        city="London" country="United Kingdom" timezone="Europe/London"
        lat={51.5074} lon={-0.1278}
        heroImage="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad"
        pathname="/london"
        description="London operates on Greenwich Mean Time (GMT, UTC+0) in winter and British Summer Time (BST, UTC+1) from late March to late October. As the financial capital of Europe and home to the London Stock Exchange, it sets the rhythm for global markets between New York and Tokyo trading sessions."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="London" relatedCity="New York" />
      </CityPage>
    </>
  );
}
