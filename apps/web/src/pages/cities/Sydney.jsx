import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Sydney() {
  const [timeStr, setTimeStr] = useState('');
  const [isDst, setIsDst] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Australia/Sydney', hour12: true, hour: 'numeric', minute: '2-digit' }));
      
      const jan = new Date(now.getFullYear(), 0, 1);
      const jul = new Date(now.getFullYear(), 6, 1);
      const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
      setIsDst(now.getTimezoneOffset() < stdTimezoneOffset);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      question: "What time is it in Sydney right now?",
      answer: `The current time in Sydney is ${timeStr}. This time is synchronized automatically with the Australia/Sydney timezone.`
    },
    {
      question: "What timezone is Sydney in?",
      answer: "Sydney is in the Australia/Sydney timezone. It observes Australian Eastern Standard Time (AEST, UTC+10) during the winter and Australian Eastern Daylight Time (AEDT, UTC+11) during the summer."
    },
    {
      question: "Is Sydney observing daylight saving time?",
      answer: isDst ? "Yes, Sydney is currently observing Daylight Saving Time (AEDT)." : "No, Sydney is currently not observing Daylight Saving Time (AEST)."
    }
  ];

  const citySchema = {
    "@type": "City",
    "name": "Sydney",
    "containedInPlace": {
      "@type": "Country",
      "name": "Australia"
    },
    "description": "Current local time in Sydney. Timezone: AEDT/AEST (UTC+10/+11).",
    "url": "https://myzonetime.com/sydney"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Sydney", "item": "https://myzonetime.com/sydney" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in Sydney, Australia — UTC+10/+11 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in Sydney now. Live clock, timezone info (AEST/AEDT, UTC+10/+11), weather, and best time to call Sydney." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="AU-NSW" />
        <meta name="geo.placename" content="Sydney, Australia" />
        <meta name="geo.position" content="-33.8688;151.2093" />
        <meta name="ICBM" content="-33.8688, 151.2093" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/sydney" />
        <meta property="og:title" content="Current Time in Sydney, Australia — UTC+10/+11 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Sydney, Australia. Australian Eastern Time (AEST/AEDT), UTC+10/+11. Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Sydney — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Sydney, Australia — UTC+10/+11 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Sydney, Australia. Australian Eastern Time (AEST/AEDT), UTC+10/+11. Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in Sydney — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/sydney" />

      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Sydney" timezone="Australia/Sydney" utcOffset="+11/+10" currentTime={timeStr} />

      <CityPage 
        city="Sydney" 
        country="Australia" 
        region="New South Wales"
        currency="AUD (A$)"
        timezone="Australia/Sydney" 
        lat={-33.8688} 
        lon={151.2093} 
        pathname="/sydney"
        description="Sydney operates on Australian Eastern Standard Time (AEST) and observes Daylight Saving Time (AEDT) during the Southern Hemisphere summer."
      >
        <FAQSection faqs={faqs} />
        <RelatedTools city="Sydney" relatedCity="Singapore" />
      </CityPage>
    </>
  );
}