import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Oslo() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Oslo', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What timezone is Oslo in?', answer: 'Oslo is in the Europe/Oslo timezone, observing Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
    { question: 'Does Oslo observe daylight saving time?', answer: 'Yes. Oslo switches to CEST (UTC+2) on the last Sunday of March and reverts to CET (UTC+1) on the last Sunday of October.' },
    { question: 'What is the time difference between Oslo and London?', answer: 'Oslo is 1 hour ahead of London year-round. London is on GMT (UTC+0) in winter and BST (UTC+1) in summer; Oslo is on CET (UTC+1) in winter and CEST (UTC+2) in summer.' },
    { question: 'What is the time difference between Oslo and New York?', answer: 'Oslo (CET, UTC+1) is 6 hours ahead of New York (EST, UTC-5) in winter, and 6 hours ahead during CEST/EDT as well. The difference stays at 6 hours for most of the year.' },
    { question: 'What are standard business hours in Oslo?', answer: 'Standard business hours in Oslo are Monday to Friday, 8:00 AM to 4:00 PM. Some offices operate 9 AM–5 PM. Norway has strict working hour regulations.' },
  ];

  const citySchema = {
    '@type': 'City',
    name: 'Oslo',
    containedInPlace: { '@type': 'Country', name: 'Norway' },
    description: 'Current local time in Oslo, Norway. Timezone: CET/CEST (UTC+1/+2). Observes daylight saving time.',
    url: 'https://myzonetime.com/oslo',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Oslo', item: 'https://myzonetime.com/oslo' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Current Time in Oslo, Norway — CET/CEST UTC+1/+2 | MyZoneTime</title>
        <meta name="description" content="Live clock for Oslo, Norway. Central European Time (CET/CEST), UTC+1 or UTC+2. Current time, weather, business hours, and best time to call Oslo from anywhere." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="NO-03" />
        <meta name="geo.placename" content="Oslo, Norway" />
        <meta name="geo.position" content="59.9139;10.7522" />
        <meta name="ICBM" content="59.9139, 10.7522" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/oslo" />
        <meta property="og:title" content="Current Time in Oslo, Norway — CET/CEST | MyZoneTime" />
        <meta property="og:description" content="Live clock for Oslo, Norway. CET/CEST, UTC+1 or +2. Observes DST. Current time, weather, and best time to call Oslo." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Oslo — MyZoneTime world clock" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Oslo, Norway — CET/CEST | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Oslo. CET/CEST, UTC+1/+2. Observes DST. Weather and business hours." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/oslo" />
      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Oslo" timezone="Europe/Oslo" utcOffset="+1/+2" currentTime={timeStr} faqs={faqs} />
      <CityPage
        city="Oslo"
        country="Norway"
        timezone="Europe/Oslo"
        lat={59.9139}
        lon={10.7522}
        heroImage="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc"
        pathname="/oslo"
        description="Oslo operates on Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer. As Norway's capital, Oslo is a major Nordic business and energy industry hub."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Oslo" relatedCity="London" />
      </CityPage>
    </>
  );
}
