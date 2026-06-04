import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import TimezoneAuthoritySection from '@/components/TimezoneAuthoritySection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function Singapore() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Singapore in?', answer: 'Singapore is in the Singapore Standard Time (SGT) zone, which is UTC+8. Singapore uses a single national timezone and has no regional variations.' },
    { question: 'Does Singapore observe daylight saving time?', answer: 'No. Singapore does not observe daylight saving time. It has remained on SGT (UTC+8) without change since 1982, making it one of the most predictable clocks in Asia for international scheduling.' },
    { question: 'What are standard business hours in Singapore?', answer: 'Standard business hours in Singapore are Monday to Friday, 9:00 AM to 6:00 PM SGT. The Singapore Exchange (SGX) operates from 9:00 AM to 5:00 PM SGT. Many multinationals maintain early-start schedules to overlap with European afternoon hours.' },
    { question: 'What is the time difference between Singapore and London?', answer: 'Singapore (SGT, UTC+8) is 8 hours ahead of London in winter (GMT, UTC+0) and 7 hours ahead in summer when London is on BST (UTC+1). Singapore\'s clock never changes, so any variation is caused by London\'s DST.' },
    { question: 'What is the time difference between Singapore and Dubai?', answer: 'Singapore (SGT, UTC+8) is 4 hours ahead of Dubai (GST, UTC+4). Since neither city observes daylight saving time, this 4-hour difference is constant year-round.' },
    { question: 'What is the time difference between Singapore and Sydney?', answer: 'Sydney is typically 2–3 hours ahead of Singapore. When Sydney is on AEDT (UTC+11, October–April), it is 3 hours ahead. When on AEST (UTC+10, April–October), it is 2 hours ahead. Singapore never changes.' },
    { question: 'What is the best time to call Singapore from Europe?', answer: 'The best time to call Singapore from London is 1:00 AM–9:00 AM GMT, which corresponds to 9:00 AM–5:00 PM SGT — Singapore\'s full business day. For a more practical overlap, call between 7:00 AM–9:00 AM London time for Singapore\'s late afternoon.' },
    { question: 'Why is Singapore in UTC+8 despite being geographically in UTC+7?', answer: 'Singapore sits close to the UTC+7 meridian geographically, but adopted UTC+8 in 1982 to align with Malaysia and facilitate closer economic integration. The decision prioritised regional business convenience over geographic accuracy.' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'City', name: 'Singapore', containedInPlace: { '@type': 'Country', name: 'Singapore' }, url: 'https://myzonetime.com/singapore' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Singapore Time', item: 'https://myzonetime.com/singapore' },
      ]},
      { '@type': 'FAQPage', mainEntity: faqs.map(f => ({
        '@type': 'Question', name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      }))},
    ],
  };

  return (
    <>
      <Helmet>
        <title>Singapore Time — Live Clock, SGT UTC+8 | MyZoneTime</title>
        <meta name="description" content="Current local time in Singapore. Singapore Standard Time (SGT, UTC+8), no daylight saving. SGX trading hours, time differences to London, Dubai and Sydney." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="SG" />
        <meta name="geo.placename" content="Singapore" />
        <meta name="geo.position" content="1.3521;103.8198" />
        <meta name="ICBM" content="1.3521, 103.8198" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/singapore" />
        <meta property="og:title" content="Singapore Time — Live Clock SGT UTC+8 | MyZoneTime" />
        <meta property="og:description" content="Live time in Singapore. SGT (UTC+8), no daylight saving ever. SGX hours, time differences to London, Dubai and Sydney." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Singapore Time — SGT Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Singapore. SGT (UTC+8), fixed year-round. Time differences to London, Dubai, Sydney." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <CanonicalTag pathname="/singapore" />
      <StructuredData schema={schema} />
      <CityPage
        city="Singapore" country="Singapore" timezone="Asia/Singapore"
        lat={1.3521} lon={103.8198}
        heroImage="https://images.unsplash.com/photo-1525625293386-3f8f99389edd"
        pathname="/singapore"
        description="Singapore operates on Singapore Standard Time (SGT, UTC+8) year-round with no daylight saving. As Southeast Asia's premier financial hub and one of the world's busiest ports, Singapore's fixed clock makes it a reliable anchor for cross-timezone scheduling between European, Middle Eastern and Asia-Pacific business partners."
      >
        <TimezoneAuthoritySection cityName="Singapore" timezoneKey="sgt" />
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Singapore" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}

