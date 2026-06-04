import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import TimezoneAuthoritySection from '@/components/TimezoneAuthoritySection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function Riyadh() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Riyadh', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Riyadh in?', answer: 'Riyadh is in the Arabia Standard Time (AST) zone, which is UTC+3. This is the official timezone for the entire Kingdom of Saudi Arabia.' },
    { question: 'Does Riyadh observe daylight saving time?', answer: 'No. Saudi Arabia does not observe daylight saving time. Riyadh stays on AST (UTC+3) year-round, making it a highly predictable clock for international business and Islamic prayer-time calculations.' },
    { question: 'What are standard business hours in Riyadh?', answer: 'Standard government and public business hours in Riyadh are Sunday to Thursday, 7:30 AM to 3:30 PM AST. Private sector businesses typically operate Sunday to Thursday, 9:00 AM to 6:00 PM AST. Friday and Saturday form the Saudi weekend. Prayer times may cause brief business closures throughout the day.' },
    { question: 'What is the time difference between Riyadh and London?', answer: 'Riyadh (AST, UTC+3) is 3 hours ahead of London in winter (GMT, UTC+0) and 2 hours ahead in summer when London is on BST (UTC+1). Saudi Arabia never changes its clocks.' },
    { question: 'What is the time difference between Riyadh and Dubai?', answer: 'Riyadh (AST, UTC+3) and Dubai (GST, UTC+4) differ by exactly 1 hour — Dubai is always 1 hour ahead. Neither city observes DST, so this difference is constant throughout the year.' },
    { question: 'What is the time difference between Riyadh and New York?', answer: 'Riyadh (AST, UTC+3) is 8 hours ahead of New York in winter (EST, UTC−5) and 7 hours ahead in summer (EDT, UTC−4). The variation is caused entirely by New York\'s daylight saving schedule.' },
    { question: 'What is the best time to call Riyadh from the UK?', answer: 'The best time to call Riyadh from London is 7:00 AM–1:00 PM GMT in winter (10:00 AM–4:00 PM Riyadh time) or 7:00 AM–12:00 PM BST in summer. Avoid calling around prayer times, especially Dhuhr (midday) and Asr (mid-afternoon).' },
    { question: 'What is Riyadh time called in English?', answer: 'Riyadh time is officially called Arabia Standard Time (AST), abbreviated as AST and running at UTC+3. It is shared by Saudi Arabia, Iraq, Kuwait, Yemen, Bahrain and Qatar (though Qatar officially uses its own Qatar Time label for the same UTC+3 offset).' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'City', name: 'Riyadh', containedInPlace: { '@type': 'Country', name: 'Saudi Arabia' }, url: 'https://myzonetime.com/riyadh' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Riyadh Time', item: 'https://myzonetime.com/riyadh' },
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
        <title>Riyadh Time — Live Clock, AST UTC+3 | MyZoneTime</title>
        <meta name="description" content="Current local time in Riyadh, Saudi Arabia. AST (UTC+3), no daylight saving. Business hours, prayer schedule and time differences to London and Dubai." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="SA-01" />
        <meta name="geo.placename" content="Riyadh, Saudi Arabia" />
        <meta name="geo.position" content="24.7136;46.6753" />
        <meta name="ICBM" content="24.7136, 46.6753" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/riyadh" />
        <meta property="og:title" content="Riyadh Time — Live Clock AST UTC+3 | MyZoneTime" />
        <meta property="og:description" content="Live time in Riyadh, Saudi Arabia. AST (UTC+3), no daylight saving. Saudi business hours and time differences to London, Dubai and New York." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Riyadh Time — AST Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Riyadh. AST (UTC+3), never changes. Time differences to London, Dubai and New York." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <CanonicalTag pathname="/riyadh" />
      <StructuredData schema={schema} />
      <CityPage
        city="Riyadh" country="Saudi Arabia" timezone="Asia/Riyadh"
        lat={24.7136} lon={46.6753}
        heroImage="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6"
        pathname="/riyadh"
        description="Riyadh, the capital of Saudi Arabia, operates on Arabia Standard Time (AST, UTC+3) all year with no daylight saving adjustments. As the political and economic capital of the Arab world's largest economy and home to Saudi Aramco headquarters, Riyadh's fixed clock is a key reference point for energy markets, Islamic finance and Gulf region business scheduling."
      >
        <TimezoneAuthoritySection cityName="Riyadh" timezoneKey="ast" />
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Riyadh" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}

