import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Dubai() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    { question: "What timezone is Dubai in?", answer: "Dubai is in the Asia/Dubai timezone. It observes Gulf Standard Time (GST), which is UTC+4." },
    { question: "Is Dubai observing daylight saving time?", answer: "No, Dubai does not observe Daylight Saving Time. It remains on Gulf Standard Time (UTC+4) year-round." },
    { question: "What are standard business hours in Dubai?", answer: "Standard business hours are typically Monday to Friday, 9:00 AM to 6:00 PM. The weekend is Saturday and Sunday." }
  ];

  const citySchema = {
    "@type": "City",
    "name": "Dubai",
    "containedInPlace": {
      "@type": "Country",
      "name": "United Arab Emirates"
    },
    "description": "Current local time in Dubai. Timezone: GST (UTC+4).",
    "url": "https://myzonetime.com/dubai"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Dubai", "item": "https://myzonetime.com/dubai" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in Dubai, United Arab Emirates — UTC+4 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in Dubai now. Live clock, timezone info (GST, UTC+4), weather, and best time to call Dubai." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai, United Arab Emirates" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/dubai" />
        <meta property="og:title" content="Current Time in Dubai, United Arab Emirates — UTC+4 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Dubai, UAE. Gulf Standard Time (GST), UTC+4. No daylight saving. Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Dubai — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Dubai, United Arab Emirates — UTC+4 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Dubai, UAE. Gulf Standard Time (GST), UTC+4. No daylight saving. Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in Dubai — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/dubai" />
      
      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Dubai" timezone="Asia/Dubai" utcOffset="+4" currentTime={timeStr} />
      
      <CityPage 
        city="Dubai" 
        country="United Arab Emirates" 
        timezone="Asia/Dubai" 
        lat={25.2048} 
        lon={55.2708} 
        heroImage="https://images.unsplash.com/photo-1637739256584-43c96dac387f"
        pathname="/dubai"
        description="Dubai operates on Gulf Standard Time (GST) year-round and does not observe Daylight Saving Time. It serves as a crucial bridge between Asian and European markets, making it a global hub for international business."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Dubai" relatedCity="London" />
      </CityPage>
    </>
  );
}