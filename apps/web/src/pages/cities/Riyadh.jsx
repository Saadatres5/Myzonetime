import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Riyadh() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Riyadh', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      question: "What time is it in Riyadh right now?",
      answer: `The current time in Riyadh is ${timeStr}. This time is synchronized automatically with the Asia/Riyadh timezone.`
    },
    {
      question: "What timezone is Riyadh in?",
      answer: "Riyadh is in the Asia/Riyadh timezone. It observes Arabia Standard Time (AST), which is UTC+3."
    },
    {
      question: "Is Riyadh observing daylight saving time?",
      answer: "No, Saudi Arabia does not observe Daylight Saving Time. Riyadh remains on Arabia Standard Time (UTC+3) year-round."
    }
  ];

  const citySchema = {
    "@type": "City",
    "name": "Riyadh",
    "containedInPlace": {
      "@type": "Country",
      "name": "Saudi Arabia"
    },
    "description": "Current local time in Riyadh. Timezone: AST (UTC+3).",
    "url": "https://myzonetime.com/riyadh"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Riyadh", "item": "https://myzonetime.com/riyadh" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in Riyadh, Saudi Arabia — UTC+3 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in Riyadh now. Live clock, timezone info (AST, UTC+3), weather, and best time to call Riyadh." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="SA-01" />
        <meta name="geo.placename" content="Riyadh, Saudi Arabia" />
        <meta name="geo.position" content="24.7136;46.6753" />
        <meta name="ICBM" content="24.7136, 46.6753" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/riyadh" />
        <meta property="og:title" content="Current Time in Riyadh, Saudi Arabia — UTC+3 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Riyadh, Saudi Arabia. Arabia Standard Time (AST), UTC+3. No daylight saving. Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Riyadh — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Riyadh, Saudi Arabia — UTC+3 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Riyadh, Saudi Arabia. Arabia Standard Time (AST), UTC+3. No daylight saving. Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in Riyadh — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/riyadh" />

      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Riyadh" timezone="Asia/Riyadh" utcOffset="+3" currentTime={timeStr} />

      <CityPage 
        city="Riyadh" 
        country="Saudi Arabia" 
        region="Riyadh Province"
        currency="SAR (ر.س)"
        timezone="Asia/Riyadh" 
        lat={24.7136} 
        lon={46.6753} 
        pathname="/riyadh"
        description="Riyadh operates on Arabia Standard Time (AST) year-round and does not observe Daylight Saving Time. It is a central time zone for the Middle East."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Riyadh" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}