import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function AbuDhabi() {
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
    {
      question: "What time is it in Abu Dhabi right now?",
      answer: `The current time in Abu Dhabi is ${timeStr}. This time is synchronized automatically with the Asia/Dubai timezone.`
    },
    {
      question: "What timezone is Abu Dhabi in?",
      answer: "Abu Dhabi is in the Asia/Dubai timezone. It observes Gulf Standard Time (GST), which is UTC+4."
    },
    {
      question: "Is Abu Dhabi observing daylight saving time?",
      answer: "No, the United Arab Emirates does not observe Daylight Saving Time. Abu Dhabi remains on Gulf Standard Time (UTC+4) year-round."
    }
  ];

  const citySchema = {
    "@type": "City",
    "name": "Abu Dhabi",
    "containedInPlace": {
      "@type": "Country",
      "name": "United Arab Emirates"
    },
    "description": "Current local time in Abu Dhabi. Timezone: GST (UTC+4).",
    "url": "https://myzonetime.com/abudhabi"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Abu Dhabi", "item": "https://myzonetime.com/abudhabi" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in Abu Dhabi, United Arab Emirates — UTC+4 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in Abu Dhabi now. Live clock, timezone info (GST, UTC+4), weather, and best time to call Abu Dhabi." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="AE-AZ" />
        <meta name="geo.placename" content="Abu Dhabi, United Arab Emirates" />
        <meta name="geo.position" content="24.4539;54.3773" />
        <meta name="ICBM" content="24.4539, 54.3773" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/abu-dhabi" />
        <meta property="og:title" content="Current Time in Abu Dhabi, United Arab Emirates — UTC+4 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Abu Dhabi, UAE. Gulf Standard Time (GST), UTC+4. No daylight saving. Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Abu Dhabi — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Abu Dhabi, United Arab Emirates — UTC+4 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Abu Dhabi, UAE. Gulf Standard Time (GST), UTC+4. No daylight saving. Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in Abu Dhabi — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/abudhabi" />

      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Abu Dhabi" timezone="Asia/Dubai" utcOffset="+4" currentTime={timeStr} />

      <CityPage 
        city="Abu Dhabi" 
        country="United Arab Emirates" 
        region="Emirate of Abu Dhabi"
        currency="AED (د.إ)"
        timezone="Asia/Dubai" 
        lat={24.4539} 
        lon={54.3773} 
        pathname="/abudhabi"
        description="Abu Dhabi operates on Gulf Standard Time (GST) year-round, sharing the same time zone as Dubai. It does not observe Daylight Saving Time."
      >
        <FAQSection faqs={faqs} />
        <RelatedTools city="AbuDhabi" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}