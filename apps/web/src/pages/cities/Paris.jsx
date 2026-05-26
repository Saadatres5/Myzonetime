import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Paris() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Paris', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What timezone is Paris in?', answer: 'Paris is in the Europe/Paris timezone, observing Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
    { question: 'Does Paris observe daylight saving time?', answer: 'Yes. Paris switches to CEST (UTC+2) on the last Sunday of March and reverts to CET (UTC+1) on the last Sunday of October, following EU daylight saving rules.' },
    { question: 'What is the time difference between Paris and London?', answer: 'Paris (CET/CEST) is 1 hour ahead of London (GMT/BST) year-round. Both cities observe daylight saving time on the same dates, so the 1-hour gap is constant.' },
    { question: 'What is the time difference between Paris and New York?', answer: 'Paris (CET, UTC+1) is 6 hours ahead of New York (EST, UTC-5) in winter, and 6 hours ahead during CEST/EDT. The difference is consistently 6 hours for most of the year.' },
    { question: 'What is the time difference between Paris and Dubai?', answer: 'Paris (CET, UTC+1) is 3 hours behind Dubai (UTC+4) in winter and 2 hours behind during CEST (UTC+2) in summer.' },
    { question: 'What are standard business hours in Paris?', answer: 'Standard business hours in Paris are Monday to Friday, 9:00 AM to 6:00 PM. The lunch break (12–2 PM) is strongly observed in many French businesses.' },
  ];

  const citySchema = {
    '@type': 'City',
    name: 'Paris',
    containedInPlace: { '@type': 'Country', name: 'France' },
    description: 'Current local time in Paris, France. Timezone: CET/CEST (UTC+1/+2). Observes daylight saving time.',
    url: 'https://myzonetime.com/paris',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Paris', item: 'https://myzonetime.com/paris' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Current Time in Paris, France — CET/CEST UTC+1/+2 | MyZoneTime</title>
        <meta name="description" content="Live clock for Paris, France. Central European Time (CET/CEST), UTC+1 or UTC+2. Current time, weather, business hours, and best time to call Paris from anywhere." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="FR-75" />
        <meta name="geo.placename" content="Paris, France" />
        <meta name="geo.position" content="48.8566;2.3522" />
        <meta name="ICBM" content="48.8566, 2.3522" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/paris" />
        <meta property="og:title" content="Current Time in Paris, France — CET/CEST | MyZoneTime" />
        <meta property="og:description" content="Live clock for Paris, France. CET/CEST, UTC+1 or +2. Observes DST. Current time, weather, and best time to call Paris." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Paris — MyZoneTime world clock" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Paris, France — CET/CEST | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Paris. CET/CEST, UTC+1/+2. Observes DST. Weather and business hours." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/paris" />
      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Paris" timezone="Europe/Paris" utcOffset="+1/+2" currentTime={timeStr} faqs={faqs} />
      <CityPage
        city="Paris"
        country="France"
        timezone="Europe/Paris"
        lat={48.8566}
        lon={2.3522}
        heroImage="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
        pathname="/paris"
        description="Paris operates on Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer. As France's capital and a global centre for business, fashion, and culture, Paris is one of Europe's most connected international cities."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Paris" relatedCity="London" />
      </CityPage>
    </>
  );
}
