import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function NewYork() {
  const [timeStr, setTimeStr] = useState('');
  const [isDst, setIsDst] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: '2-digit' }));
      
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
      question: "What time is it in New York right now?",
      answer: `The current time in New York is ${timeStr}. This time is synchronized automatically with the America/New_York timezone.`
    },
    {
      question: "What timezone is New York in?",
      answer: "New York is in the America/New_York timezone. It observes Eastern Standard Time (EST, UTC-5) during the winter and Eastern Daylight Time (EDT, UTC-4) during the summer."
    },
    {
      question: "Is New York observing daylight saving time?",
      answer: isDst ? "Yes, New York is currently observing Daylight Saving Time (EDT)." : "No, New York is currently not observing Daylight Saving Time (EST)."
    }
  ];

  const citySchema = {
    "@type": "City",
    "name": "New York",
    "containedInPlace": {
      "@type": "Country",
      "name": "United States"
    },
    "description": "Current local time in New York. Timezone: EST/EDT (UTC-5/-4).",
    "url": "https://myzonetime.com/new-york"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "New York", "item": "https://myzonetime.com/new-york" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in New York, United States — UTC-5/-4 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in New York now. Live clock, timezone info (EST/EDT, UTC-5/-4), weather, and best time to call New York." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="New York, United States" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/new-york" />
        <meta property="og:title" content="Current Time in New York, United States — UTC-5/-4 | MyZoneTime" />
        <meta property="og:description" content="Live clock for New York, USA. Eastern Standard Time (EST/EDT), UTC-5/-4. Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in New York — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in New York, United States — UTC-5/-4 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for New York, USA. Eastern Standard Time (EST/EDT), UTC-5/-4. Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in New York — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/newyork" />

      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="New York" timezone="America/New_York" utcOffset="-5/-4" currentTime={timeStr} />

      <CityPage 
        city="New York" 
        country="United States" 
        region="New York State"
        currency="USD ($)"
        timezone="America/New_York" 
        lat={40.7128} 
        lon={-74.0060} 
        pathname="/newyork"
        description="New York operates on Eastern Standard Time (EST) and observes Daylight Saving Time (EDT) in the summer. It is the primary time zone reference for the East Coast of the United States and major financial markets."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="NewYork" relatedCity="London" />
      </CityPage>
    </>
  );
}