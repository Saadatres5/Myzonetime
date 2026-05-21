import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Tokyo() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      question: "What time is it in Tokyo right now?",
      answer: `The current time in Tokyo is ${timeStr}. This time is synchronized automatically with the Asia/Tokyo timezone.`
    },
    {
      question: "What timezone is Tokyo in?",
      answer: "Tokyo is in the Asia/Tokyo timezone. It observes Japan Standard Time (JST), which is UTC+9."
    },
    {
      question: "Is Tokyo observing daylight saving time?",
      answer: "No, Japan does not observe Daylight Saving Time. Tokyo remains on Japan Standard Time (UTC+9) year-round."
    }
  ];

  const citySchema = {
    "@type": "City",
    "name": "Tokyo",
    "containedInPlace": {
      "@type": "Country",
      "name": "Japan"
    },
    "description": "Current local time in Tokyo. Timezone: JST (UTC+9).",
    "url": "https://myzonetime.com/tokyo"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Tokyo", "item": "https://myzonetime.com/tokyo" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in Tokyo, Japan — UTC+9 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in Tokyo now. Live clock, timezone info (JST, UTC+9), weather, and best time to call Tokyo." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="JP-13" />
        <meta name="geo.placename" content="Tokyo, Japan" />
        <meta name="geo.position" content="35.6762;139.6503" />
        <meta name="ICBM" content="35.6762, 139.6503" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/tokyo" />
        <meta property="og:title" content="Current Time in Tokyo, Japan — UTC+9 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Tokyo, Japan. Japan Standard Time (JST), UTC+9. No daylight saving. Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Tokyo — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Tokyo, Japan — UTC+9 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Tokyo, Japan. Japan Standard Time (JST), UTC+9. No daylight saving. Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in Tokyo — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/tokyo" />

      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Tokyo" timezone="Asia/Tokyo" utcOffset="+9" currentTime={timeStr} />

      <CityPage 
        city="Tokyo" 
        country="Japan" 
        region="Kanto"
        currency="JPY (¥)"
        timezone="Asia/Tokyo" 
        lat={35.6762} 
        lon={139.6503} 
        pathname="/tokyo"
        description="Tokyo operates on Japan Standard Time (JST) year-round and does not observe Daylight Saving Time. It is one of the first major global financial centers to open each day."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Tokyo" relatedCity="Singapore" />
      </CityPage>
    </>
  );
}