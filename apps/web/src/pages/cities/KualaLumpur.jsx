import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function KualaLumpur() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kuala_Lumpur', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What timezone is Kuala Lumpur in?', answer: 'Kuala Lumpur is in the Asia/Kuala_Lumpur timezone, observing Malaysia Time (MYT), which is UTC+8 year-round.' },
    { question: 'Does Kuala Lumpur observe daylight saving time?', answer: 'No. Malaysia does not observe daylight saving time. Kuala Lumpur remains on MYT (UTC+8) throughout the entire year.' },
    { question: 'What is the time difference between Kuala Lumpur and London?', answer: 'Kuala Lumpur (UTC+8) is 8 hours ahead of London during GMT (winter) and 7 hours ahead during British Summer Time (BST) in summer.' },
    { question: 'What is the time difference between Kuala Lumpur and Dubai?', answer: 'Kuala Lumpur (UTC+8) is 4 hours ahead of Dubai (UTC+4) year-round. Neither city observes daylight saving time, so this difference is constant.' },
    { question: 'What is the time difference between Kuala Lumpur and Singapore?', answer: 'Kuala Lumpur (MYT, UTC+8) and Singapore (SGT, UTC+8) are in the same time zone. There is no time difference between them.' },
    { question: 'What are standard business hours in Kuala Lumpur?', answer: 'Standard business hours in Kuala Lumpur are Monday to Friday, 9:00 AM to 6:00 PM. Friday prayers (12:30–2:30 PM) may affect schedules in some organisations.' },
  ];

  const citySchema = {
    '@type': 'City',
    name: 'Kuala Lumpur',
    containedInPlace: { '@type': 'Country', name: 'Malaysia' },
    description: 'Current local time in Kuala Lumpur, Malaysia. Timezone: MYT (UTC+8). No daylight saving time.',
    url: 'https://myzonetime.com/kuala-lumpur',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Kuala Lumpur', item: 'https://myzonetime.com/kuala-lumpur' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Current Time in Kuala Lumpur, Malaysia — UTC+8 | MyZoneTime</title>
        <meta name="description" content="Live clock for Kuala Lumpur, Malaysia. Malaysia Time (MYT), UTC+8. No daylight saving time. Current time, weather, business hours, and best time to call KL." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="MY-14" />
        <meta name="geo.placename" content="Kuala Lumpur, Malaysia" />
        <meta name="geo.position" content="3.1390;101.6869" />
        <meta name="ICBM" content="3.1390, 101.6869" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/kuala-lumpur" />
        <meta property="og:title" content="Current Time in Kuala Lumpur, Malaysia — UTC+8 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Kuala Lumpur, Malaysia. MYT, UTC+8. No daylight saving. Current time, weather, and best time to call KL." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Kuala Lumpur — MyZoneTime world clock" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Kuala Lumpur, Malaysia — UTC+8 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Kuala Lumpur. MYT, UTC+8. No daylight saving. Weather and business hours." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/kuala-lumpur" />
      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Kuala Lumpur" timezone="Asia/Kuala_Lumpur" utcOffset="+8" currentTime={timeStr} faqs={faqs} />
      <CityPage
        city="Kuala Lumpur"
        country="Malaysia"
        timezone="Asia/Kuala_Lumpur"
        lat={3.1390}
        lon={101.6869}
        heroImage="https://images.unsplash.com/photo-1596422846543-75c6fc197f07"
        pathname="/kuala-lumpur"
        description="Kuala Lumpur operates on Malaysia Time (MYT, UTC+8) year-round with no daylight saving time. Malaysia's capital is a thriving Southeast Asian business hub, sharing the same timezone as Singapore, Hong Kong, and Perth."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Kuala Lumpur" relatedCity="Singapore" />
      </CityPage>
    </>
  );
}
