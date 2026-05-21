import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function Singapore() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour12: true, hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      question: "What time is it in Singapore right now?",
      answer: `The current time in Singapore is ${timeStr}. This time is synchronized automatically with the Asia/Singapore timezone.`
    },
    {
      question: "What timezone is Singapore in?",
      answer: "Singapore is in the Asia/Singapore timezone. It observes Singapore Standard Time (SST), which is UTC+8."
    },
    {
      question: "Is Singapore observing daylight saving time?",
      answer: "No, Singapore does not observe Daylight Saving Time. It remains on Singapore Standard Time (UTC+8) year-round."
    }
  ];

  const citySchema = {
    "@type": "City",
    "name": "Singapore",
    "containedInPlace": {
      "@type": "Country",
      "name": "Singapore"
    },
    "description": "Current local time in Singapore. Timezone: SGT (UTC+8).",
    "url": "https://myzonetime.com/singapore"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Singapore", "item": "https://myzonetime.com/singapore" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in Singapore — UTC+8 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in Singapore now. Live clock, timezone info (SGT, UTC+8), weather, and best time to call Singapore." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="SG" />
        <meta name="geo.placename" content="Singapore, Singapore" />
        <meta name="geo.position" content="1.3521;103.8198" />
        <meta name="ICBM" content="1.3521, 103.8198" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/singapore" />
        <meta property="og:title" content="Current Time in Singapore — UTC+8 | MyZoneTime" />
        <meta property="og:description" content="Live clock for Singapore. Singapore Standard Time (SGT), UTC+8. No daylight saving. Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in Singapore — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in Singapore — UTC+8 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for Singapore. Singapore Standard Time (SGT), UTC+8. No daylight saving. Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in Singapore — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/singapore" />

      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="Singapore" timezone="Asia/Singapore" utcOffset="+8" currentTime={timeStr} />

      <CityPage 
        city="Singapore" 
        country="Singapore" 
        region="Southeast Asia"
        currency="SGD (S$)"
        timezone="Asia/Singapore" 
        lat={1.3521} 
        lon={103.8198} 
        pathname="/singapore"
        description="Singapore operates on Singapore Standard Time (SST) year-round. Despite its geographical location, it aligns its time zone with Malaysia and China for business convenience."
      >
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Singapore" relatedCity="Tokyo" />
      </CityPage>
    </>
  );
}