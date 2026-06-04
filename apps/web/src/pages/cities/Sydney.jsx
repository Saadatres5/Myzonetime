import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import TimezoneAuthoritySection from '@/components/TimezoneAuthoritySection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function Sydney() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Australia/Sydney', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is Sydney in?', answer: 'Sydney is in the Australian Eastern Time Zone. It uses Australian Eastern Standard Time (AEST, UTC+10) in winter and Australian Eastern Daylight Time (AEDT, UTC+11) in summer.' },
    { question: 'Does Sydney observe daylight saving time?', answer: 'Yes. New South Wales (where Sydney is located) observes daylight saving time. Clocks move forward 1 hour to AEDT (UTC+11) on the first Sunday in October, and back to AEST (UTC+10) on the first Sunday in April. Note: Queensland (Brisbane) does NOT observe DST, creating a split within Australia.' },
    { question: 'What are standard business hours in Sydney?', answer: 'Standard business hours in Sydney are Monday to Friday, 9:00 AM to 5:30 PM AEST/AEDT. The Australian Securities Exchange (ASX) trades from 10:00 AM to 4:00 PM Sydney time. Financial services often start from 7:30 AM.' },
    { question: 'What is the time difference between Sydney and London?', answer: 'The time difference varies due to opposite hemisphere DST. In Sydney\'s summer (AEDT, UTC+11, Oct–Apr), Sydney is 11 hours ahead of London GMT. In Sydney\'s winter (AEST, UTC+10, Apr–Oct) when London is on BST (UTC+1), the gap is just 9 hours. It ranges from 9 to 11 hours throughout the year.' },
    { question: 'What is the time difference between Sydney and New York?', answer: 'Sydney is typically 14–16 hours ahead of New York. The exact gap changes four times per year as each city independently starts and ends daylight saving on different schedules. In Sydney\'s summer/New York\'s winter it can be 16 hours; in Sydney\'s winter/New York\'s summer it can be 14 hours.' },
    { question: 'What is the time difference between Sydney and Dubai?', answer: 'Sydney (AEST, UTC+10) is 6 hours ahead of Dubai (GST, UTC+4) in Sydney\'s winter. When Sydney is on AEDT (UTC+11), it is 7 hours ahead. Dubai never changes its clocks.' },
    { question: 'What is the best time to call Sydney from the UK?', answer: 'The best overlap for UK–Sydney calls is 7:00 AM–9:00 AM London time (5:00 PM–7:00 PM Sydney time in winter, 6:00 PM–8:00 PM in summer). This catches Sydney near the end of business and London at the start of the working day.' },
    { question: 'Why does Brisbane not follow Sydney time during summer?', answer: 'Queensland (Brisbane, UTC+10) does not observe daylight saving time, while New South Wales (Sydney) does. During Sydney\'s summer (AEDT, UTC+11), Sydney is 1 hour ahead of Brisbane. This creates scheduling complexity within Australia from October to April each year.' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'City', name: 'Sydney', containedInPlace: { '@type': 'Country', name: 'Australia' }, url: 'https://myzonetime.com/sydney' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Sydney Time', item: 'https://myzonetime.com/sydney' },
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
        <title>Sydney Time — Live Clock, AEST/AEDT UTC+10/+11 | MyZoneTime</title>
        <meta name="description" content="Current local time in Sydney. AEST (UTC+10) in winter, AEDT (UTC+11) in summer. ASX hours, DST dates and time differences to London and New York." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="AU-NSW" />
        <meta name="geo.placename" content="Sydney, Australia" />
        <meta name="geo.position" content="-33.8688;151.2093" />
        <meta name="ICBM" content="-33.8688, 151.2093" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/sydney" />
        <meta property="og:title" content="Sydney Time — Live Clock AEST/AEDT | MyZoneTime" />
        <meta property="og:description" content="Live time in Sydney, Australia. AEST (UTC+10) in winter, AEDT (UTC+11) in summer. ASX hours and time differences to London and New York." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Sydney Time — AEST/AEDT Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Sydney. AEST in winter, AEDT in summer. Time differences to London and New York." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <CanonicalTag pathname="/sydney" />
      <StructuredData schema={schema} />
      <CityPage
        city="Sydney" country="Australia" timezone="Australia/Sydney"
        lat={-33.8688} lon={151.2093}
        heroImage="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9"
        pathname="/sydney"
        description="Sydney runs on Australian Eastern Time — AEST (UTC+10) in autumn and winter, and AEDT (UTC+11) in spring and summer. As Australia's largest city and financial capital, home to the ASX, Sydney is the first major financial centre to open each trading day, setting the tone for Asian and then global markets."
      >
        <TimezoneAuthoritySection cityName="Sydney" timezoneKey="aest" />
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Sydney" relatedCity="London" />
      </CityPage>
    </>
  );
}

