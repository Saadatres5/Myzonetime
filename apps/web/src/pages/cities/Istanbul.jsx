import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Istanbul() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Istanbul', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What timezone is Istanbul in?', answer: 'Istanbul is in the Europe/Istanbul timezone, observing Turkey Time (TRT), which is UTC+3 year-round.' },
    { question: 'Does Istanbul observe daylight saving time?', answer: 'No. Turkey abolished daylight saving time in 2016. Istanbul stays permanently on UTC+3 (TRT) throughout the year.' },
    { question: 'What is the time difference between Istanbul and London?', answer: 'Istanbul (UTC+3) is 3 hours ahead of London during GMT (winter) and 2 hours ahead during BST (summer).' },
    { question: 'What is the time difference between Istanbul and Dubai?', answer: 'Istanbul (UTC+3) and Dubai (UTC+4) are 1 hour apart — Dubai is 1 hour ahead of Istanbul year-round.' },
    { question: 'What are standard business hours in Istanbul?', answer: 'Standard business hours in Istanbul are Monday to Friday, 9:00 AM to 6:00 PM. Many businesses also operate Saturday mornings.' },
  ];

  const citySchema = {
    '@type': 'City',
    name: 'Istanbul',
    containedInPlace: { '@type': 'Country', name: 'Turkey' },
    description: 'Current local time in Istanbul, Turkey. Timezone: TRT (UTC+3). No daylight saving time.',
    url: 'https://myzonetime.com/istanbul',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
      { '@type': 'ListItem', position: 2, name: 'Istanbul', item: 'https://myzonetime.com/istanbul' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Current Time in Istanbul, Turkey — UTC+3 | MyZoneTime</title>
        <meta name="description" content="Live clock for Istanbul, Turkey. Turkey Time (TRT), UTC+3. No daylight saving time. Current time, weather, business hours, and best time to call Istanbul." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="TR-34" />
        <meta name="geo.placename" content="Istanbul, Turkey" />
        <meta name="geo.position" content="41.0082;28.9784" />
        <meta name="ICBM" content="41.0082, 28.9784" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/istanbul" />
        <meta property="og:title" content="Current Time in Istanbul, Turkey — UTC+3 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Istanbul, Turkey. Turkey Time (TRT), UTC+3. No daylight saving. Current time, weather, and best time to call Istanbul." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Istanbul — MyZoneTime world clock" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Istanbul, Turkey — UTC+3 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Istanbul. TRT, UTC+3. No daylight saving. Weather and business hours." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/istanbul" />
      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Istanbul" timezone="Europe/Istanbul" utcOffset="+3" currentTime={timeStr} faqs={faqs} />
      <CityPage
        city="Istanbul"
        country="Turkey"
        timezone="Europe/Istanbul"
        lat={41.0082}
        lon={28.9784}
        heroImage="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200"
        pathname="/istanbul"
        description="Istanbul operates on Turkey Time (TRT, UTC+3) year-round with no daylight saving time since 2016. Straddling Europe and Asia, Istanbul is a major business hub bridging Western and Middle Eastern markets."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Istanbul" relatedCity="London" />
      </CityPage>
    </>
  );
}
