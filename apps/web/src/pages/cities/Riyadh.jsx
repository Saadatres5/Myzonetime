import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
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

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/riyadh#city',
        name: 'Riyadh',
        url: BASE + '/riyadh',
        containedInPlace: { '@type': 'Country', name: 'Saudi Arabia' },
        geo: { '@type': 'GeoCoordinates', latitude: 24.7136, longitude: 46.6753 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Asia/Riyadh' },
          { '@type': 'PropertyValue', name: 'UTC Offset', value: 'UTC+3' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'AST' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'No' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/riyadh#webpage',
        url: BASE + '/riyadh',
        name: 'Riyadh Time — Live Clock, AST UTC+3 | MyZoneTime',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/riyadh#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'Riyadh Time', item: BASE + '/riyadh' },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        '@id': BASE + '/riyadh#webapp',
        name: 'Riyadh World Clock',
        url: BASE + '/riyadh',
        description: 'Live current time in Riyadh, Saudi Arabia. AST (UTC+3). Accurate world clock with DST-aware time zone tools.',
        applicationCategory: 'UtilitiesApplication',
        applicationSubCategory: 'World Clock',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        provider: { '@id': BASE + '/#organization' },
        isPartOf: { '@id': BASE + '/#website' },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Riyadh Time — Live Clock, AST UTC+3 | MyZoneTime</title>
        <meta name="description" content="Current time in Riyadh, Saudi Arabia. AST (UTC+3), no DST. Business hours, prayer schedule, time differences to London and Dubai." />
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
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="Riyadh Time — AST Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in Riyadh. AST (UTC+3), never changes. Time differences to London, Dubai and New York." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
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
        <section className="py-10 border-t border-border/40">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Riyadh Time Zone: Arabia Standard Time (AST, UTC+3)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Riyadh and all of Saudi Arabia operate on Arabia Standard Time (AST), which is UTC+3 year-round. Saudi Arabia does not observe daylight saving time, so the UTC offset stays fixed at +3 regardless of the season. This makes it straightforward to calculate time differences with Riyadh throughout the year.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                AST (UTC+3) is shared with several neighbouring countries: Kuwait, Qatar, Bahrain, and Yemen all use the same UTC+3 offset. This makes the entire core Gulf Cooperation Council (GCC) region — except the UAE and Oman (UTC+4) — operate on the same clock as Riyadh.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Riyadh Business Hours and the Saudi Working Week</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Saudi Arabia officially moved to a Monday–Friday working week for government and most businesses in 2013, aligning with international norms. Standard government and bank hours are 7:30 AM to 3:30 PM AST. Private sector companies typically work 9:00 AM to 6:00 PM, with a midday break in some traditional businesses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                During Ramadan, working hours are legally shortened. Government employees work 6 hours per day, and many private businesses reduce to a 6-hour day as well. Friday remains a day of special significance — Friday prayers (Jumu'ah) typically take place around midday, and many businesses close or reduce hours on Friday afternoons.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Time Differences: Riyadh to Major Cities</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="border-b border-border"><th className="text-left py-2 pr-4 font-semibold">City</th><th className="text-left py-2 font-semibold">Difference from Riyadh (AST)</th></tr></thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">London (GMT)</td><td className="py-2">−3 hrs (winter) / −2 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Dubai (GST)</td><td className="py-2">+1 hr (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">New York (EST)</td><td className="py-2">−8 hrs (winter) / −7 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Mumbai (IST)</td><td className="py-2">+2:30 hrs (always)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Singapore (SGT)</td><td className="py-2">+5 hrs (always)</td></tr>
                    <tr><td className="py-2 pr-4">Cairo (EET)</td><td className="py-2">−1 hr (always)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About Riyadh</h2>
              <p className="text-muted-foreground leading-relaxed">
                Riyadh is the capital and largest city of Saudi Arabia, with a population of over 7.5 million. It serves as the political, administrative, and economic centre of the country. Saudi Arabia holds the world's second-largest proven oil reserves, and Riyadh is home to Saudi Aramco — the world's most valuable company by market capitalisation. The city is also the headquarters of the Saudi Central Bank (SAMA), the Saudi Exchange (Tadawul), and the sovereign wealth fund PIF (Public Investment Fund), which manages over $700 billion in assets. Riyadh is undergoing rapid transformation as part of Vision 2030, the government's plan to diversify the economy beyond oil.
              </p>
            </div>
          </div>
        </section>
        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="Riyadh" relatedCity="Dubai" />
      </CityPage>
    </>
  );
}
