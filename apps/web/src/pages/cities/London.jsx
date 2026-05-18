import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';
import FAQSchema from '@/components/FAQSchema.jsx';

export default function London() {
  const [timeStr, setTimeStr] = useState('');
  const [isDst, setIsDst] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour12: true, hour: 'numeric', minute: '2-digit' }));
      
      // Simple DST check for London (BST is UTC+1, GMT is UTC+0)
      const offset = -new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' })).getTimezoneOffset();
      setIsDst(offset !== 0);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      question: "What time is it in London right now?",
      answer: `The current time in London is ${timeStr}. This time is synchronized automatically with the Europe/London timezone.`
    },
    {
      question: "What timezone is London in?",
      answer: "London is in the Europe/London timezone. During the winter months, it observes Greenwich Mean Time (GMT, UTC+0). During the summer, it observes British Summer Time (BST, UTC+1)."
    },
    {
      question: "Is London observing daylight saving time?",
      answer: isDst ? "Yes, London is currently observing Daylight Saving Time (British Summer Time)." : "No, London is currently not observing Daylight Saving Time (Greenwich Mean Time)."
    }
  ];

  const citySchema = {
    "@type": "City",
    "name": "London",
    "containedInPlace": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "description": "Current local time in London. Timezone: GMT/BST (UTC+0/+1).",
    "url": "https://myzonetime.com/london"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "London", "item": "https://myzonetime.com/london" }
    ]
  };

  return (
    <>
            <Helmet>
        <title>Current Time in London, United Kingdom — UTC+0/+1 | MyZoneTime</title>
        <meta name="description" content="Check the exact time in London now. Live clock, timezone info (GMT/BST, UTC+0/+1), weather, and best time to call London." />
        <meta name="author" content="MyZoneTime" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* GEO targeting */}
        <meta name="geo.region" content="GB-ENG" />
        <meta name="geo.placename" content="London, United Kingdom" />
        <meta name="geo.position" content="51.5074;-0.1278" />
        <meta name="ICBM" content="51.5074, -0.1278" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://myzonetime.com/london" />
        <meta property="og:title" content="Current Time in London, United Kingdom — UTC+0/+1 | MyZoneTime" />
        <meta property="og:description" content="Live clock for London, UK. Greenwich Mean Time (GMT) / British Summer Time (BST). Weather, business hours, and best time to call." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Current time in London — MyZoneTime world clock" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="twitter:title" content="Current Time in London, United Kingdom — UTC+0/+1 | MyZoneTime" />
        <meta name="twitter:description" content="Live clock for London, UK. Greenwich Mean Time (GMT) / British Summer Time (BST). Weather, business hours, and best time to call." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="Current time in London — MyZoneTime" />
      </Helmet>
      <CanonicalTag pathname="/london" />

      <StructuredData schema={citySchema} breadcrumbSchema={breadcrumbSchema} />
      <FAQSchema cityName="London" timezone="Europe/London" utcOffset="+0/+1" currentTime={timeStr} />

      <CityPage 
        city="London" 
        country="United Kingdom" 
        region="England"
        currency="GBP (£)"
        timezone="Europe/London" 
        lat={51.5074} 
        lon={-0.1278} 
        pathname="/london"
        description="London operates on Greenwich Mean Time (GMT) during the winter and British Summer Time (BST) during the summer. As a major global financial hub, coordinating with London time is essential for international business."
      >
        <FAQSection faqs={faqs} />
        <RelatedTools city="London" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}