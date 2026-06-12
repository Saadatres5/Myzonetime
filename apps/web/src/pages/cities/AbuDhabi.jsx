import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function AbuDhabi() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Abu Dhabi in?', answer: 'Abu Dhabi is in the Gulf Standard Time (GST) zone, which is UTC+4. Abu Dhabi is the capital of the UAE and shares the same timezone as Dubai, Sharjah, Ajman, Fujairah, Ras Al Khaimah and Umm Al Quwain.' },
    { question: 'Does Abu Dhabi observe daylight saving time?', answer: 'No. Abu Dhabi does not observe daylight saving time. The UAE permanently stays on GST (UTC+4) year-round. This makes Abu Dhabi one of the most predictable time zones for international scheduling in the region.' },
    { question: 'What are standard business hours in Abu Dhabi?', answer: 'Standard government office hours in Abu Dhabi are Monday to Friday, 7:30 AM to 3:30 PM GST. Private sector businesses typically operate Monday to Friday, 9:00 AM to 6:00 PM GST. The Abu Dhabi Securities Exchange (ADX) operates Monday to Friday, 10:00 AM to 3:15 PM GST.' },
    { question: 'What is the difference between Abu Dhabi time and Dubai time?', answer: 'There is no difference. Abu Dhabi and Dubai are both in the same UAE timezone, Gulf Standard Time (GST, UTC+4). They always display exactly the same time, 24 hours a day, 365 days a year.' },
    { question: 'What is the time difference between Abu Dhabi and London?', answer: 'Abu Dhabi (GST, UTC+4) is 4 hours ahead of London in winter (GMT, UTC+0) and 3 hours ahead when London is on British Summer Time (BST, UTC+1) from late March to late October. Abu Dhabi\'s clock never changes.' },
    { question: 'What is the time difference between Abu Dhabi and New York?', answer: 'Abu Dhabi (GST, UTC+4) is 9 hours ahead of New York in winter (EST, UTC−5) and 8 hours ahead in summer (EDT, UTC−4). The variation is due entirely to New York\'s daylight saving schedule.' },
    { question: 'What is the time difference between Abu Dhabi and India?', answer: 'Abu Dhabi (GST, UTC+4) is 30 minutes behind India (IST, UTC+5:30). For example, when it is 9:00 AM in Abu Dhabi, it is 9:30 AM in Mumbai, New Delhi and Kolkata. Both countries have fixed offsets, so this 30-minute gap never changes.' },
    { question: 'What is the best time to call Abu Dhabi from the US?', answer: 'From New York, the best time to call Abu Dhabi is 8:00 PM–11:00 PM EST (which is 9:00 AM–12:00 PM the next day in Abu Dhabi). From Los Angeles (PST, UTC−8), call 5:00 PM–8:00 PM to reach Abu Dhabi at the start of its business day.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/abu-dhabi#city',
        name: 'Abu Dhabi',
        url: BASE + '/abu-dhabi',
        containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' },
        geo: { '@type': 'GeoCoordinates', latitude: 24.4539, longitude: 54.3773 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Asia/Dubai' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+4' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'GST' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'No' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/abu-dhabi#webpage',
        url: BASE + '/abu-dhabi',
        name: 'Abu Dhabi Time — Live Clock, GST UTC+4 | MyZoneTime',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/abu-dhabi#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'Abu Dhabi Time', item: BASE + '/abu-dhabi' },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': BASE + '/abu-dhabi#webapp',
        name: 'Abu Dhabi World Clock',
        url: BASE + '/abu-dhabi',
        description: 'Live current time in Abu Dhabi, United Arab Emirates. GST (UTC+4). Accurate world clock with DST-aware time zone tools.',
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
        <title>Abu Dhabi Time — Live Clock, GST UTC+4 | MyZoneTime</title>
        <meta name="description" content="Current time in Abu Dhabi, UAE. Gulf Standard Time (GST, UTC+4), no DST. ADX hours, time difference to London, India and New York explained." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="AE-AZ" />
        <meta name="geo.placename" content="Abu Dhabi, United Arab Emirates" />
        <meta name="geo.position" content="24.4539;54.3773" />
        <meta name="ICBM" content="24.4539, 54.3773" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/abu-dhabi" />
        <meta property="og:title" content="Abu Dhabi Time — Live Clock GST UTC+4 | MyZoneTime" />
        <meta property="og:description" content="Live time in Abu Dhabi, UAE. GST (UTC+4), no daylight saving. ADX hours, time differences to London, India and New York." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Abu Dhabi Time — GST Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Abu Dhabi. GST (UTC+4), fixed year-round. Time differences to London, India and New York." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/abu-dhabi" />
      <StructuredData schema={schema} />
      <CityPage
        city="Abu Dhabi" country="United Arab Emirates" timezone="Asia/Dubai"
        lat={24.4539} lon={54.3773}
        heroImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
        pathname="/abu-dhabi"
        description="Abu Dhabi, the capital of the UAE and seat of the federal government, operates on Gulf Standard Time (GST, UTC+4) year-round without daylight saving. Home to sovereign wealth fund ADIA, the Abu Dhabi Securities Exchange (ADX) and the headquarters of leading energy companies, Abu Dhabi's stable clock is a cornerstone of Gulf region financial scheduling."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Abu Dhabi" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}
