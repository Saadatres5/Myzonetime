import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Bangkok() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What timezone is Bangkok in?', answer: 'Bangkok is in the Asia/Bangkok timezone, observing Indochina Time (ICT), which is UTC+7 year-round.' },
    { question: 'Does Bangkok observe daylight saving time?', answer: 'No. Thailand does not observe daylight saving time. Bangkok remains on ICT (UTC+7) throughout the entire year.' },
    { question: 'What is the time difference between Bangkok and London?', answer: 'Bangkok (UTC+7) is 7 hours ahead of London during GMT (winter) and 6 hours ahead during British Summer Time (BST) in summer.' },
    { question: 'What is the time difference between Bangkok and Dubai?', answer: 'Bangkok (UTC+7) is 3 hours ahead of Dubai (UTC+4) year-round. Both cities do not observe daylight saving time, so this difference never changes.' },
    { question: 'What is the time difference between Bangkok and New York?', answer: 'Bangkok (UTC+7) is 12 hours ahead of New York (EST, UTC-5) in winter and 11 hours ahead during EDT (UTC-4) in summer.' },
    { question: 'What are standard business hours in Bangkok?', answer: 'Standard business hours in Bangkok are Monday to Friday, 8:30 AM to 5:30 PM. Many businesses also operate on Saturday mornings.' },
  ];

  const citySchema = {
    '@type': 'City',
    name: 'Bangkok',
    containedInPlace: { '@type': 'Country', name: 'Thailand' },
    description: 'Current local time in Bangkok, Thailand. Timezone: ICT (UTC+7). No daylight saving time.',
    url: 'https://myzonetime.com/bangkok',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Bangkok', item: 'https://myzonetime.com/bangkok' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Current Time in Bangkok, Thailand — UTC+7 | MyZoneTime</title>
        <meta name="description" content="Live clock for Bangkok, Thailand. Indochina Time (ICT), UTC+7. No daylight saving time. Current time, weather, business hours, and best time to call Bangkok." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="TH-10" />
        <meta name="geo.placename" content="Bangkok, Thailand" />
        <meta name="geo.position" content="13.7563;100.5018" />
        <meta name="ICBM" content="13.7563, 100.5018" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/bangkok" />
        <meta property="og:title" content="Current Time in Bangkok, Thailand — UTC+7 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Bangkok, Thailand. ICT, UTC+7. No daylight saving. Current time, weather, and best time to call Bangkok." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Bangkok — MyZoneTime world clock" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Bangkok, Thailand — UTC+7 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Bangkok. ICT, UTC+7. No daylight saving. Weather and business hours." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/bangkok" />
      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Bangkok" timezone="Asia/Bangkok" utcOffset="+7" currentTime={timeStr} faqs={faqs} />
      <CityPage
        city="Bangkok"
        country="Thailand"
        timezone="Asia/Bangkok"
        lat={13.7563}
        lon={100.5018}
        heroImage="https://images.unsplash.com/photo-1508009603885-50cf7c579365"
        pathname="/bangkok"
        description="Bangkok operates on Indochina Time (ICT, UTC+7) year-round with no daylight saving time. As Southeast Asia's largest city and Thailand's capital, Bangkok is a major regional business, tourism, and logistics hub."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Bangkok" relatedCity="Singapore" />
      </CityPage>
    </>
  );
}
