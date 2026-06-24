import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import CityPage from '../CityPage.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import RelatedTools from '@/components/RelatedTools.jsx';

export default function London() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour12: true, hour: 'numeric', minute: '2-digit' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    { question: 'What time zone is London in?', answer: 'London uses GMT (Greenwich Mean Time, UTC+0) in winter and BST (British Summer Time, UTC+1) in summer. Clocks go forward in late March and back in late October.' },
    { question: 'When does London change clocks?', answer: 'London clocks go forward by 1 hour at 1:00 AM on the last Sunday of March (start of BST) and go back at 2:00 AM on the last Sunday of October (return to GMT).' },
    { question: 'What are business hours in London?', answer: 'Standard London business hours are Monday to Friday, 9:00 AM to 5:30 PM GMT/BST. The London Stock Exchange (LSE) operates from 8:00 AM to 4:30 PM GMT.' },
    { question: 'What is the time difference between London and New York?', answer: 'London is 5 hours ahead of New York in winter (GMT vs EST) and 4 hours ahead in summer (BST vs EDT). The gap can be 4 or 5 hours depending on when each country switches clocks.' },
    { question: 'What is the time difference between London and Dubai?', answer: 'Dubai (UTC+4) is 4 hours ahead of London in winter (GMT) and 3 hours ahead in summer (BST, UTC+1).' },
    { question: 'What is the time difference between London and Sydney?', answer: 'Sydney is typically 10–11 hours ahead of London, depending on whether the UK and Australia are both observing summer time. The gap varies between 9 and 11 hours throughout the year.' },
    { question: 'Does London observe daylight saving time?', answer: 'Yes. The UK observes British Summer Time (BST, UTC+1) from the last Sunday of March to the last Sunday of October each year.' },
    { question: 'What is GMT?', answer: 'GMT stands for Greenwich Mean Time — the time at the Royal Observatory in Greenwich, London. It is UTC+0 and serves as the baseline from which all world time zones are measured.' },
  ];

  const BASE = 'https://myzonetime.com';
  const TODAY = new Date().toISOString().split('T')[0];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['City', 'Place'],
        '@id': BASE + '/london#city',
        name: 'London',
        url: BASE + '/london',
        containedInPlace: { '@type': 'Country', name: 'United Kingdom' },
        geo: { '@type': 'GeoCoordinates', latitude: 51.5074, longitude: -0.1278 },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'IANA Time Zone', value: 'Europe/London' },
          { '@type': 'PropertyValue', name: 'UTC Offset (Winter)', value: 'UTC+0' },
          { '@type': 'PropertyValue', name: 'UTC Offset (Summer)', value: 'UTC+1' },
          { '@type': 'PropertyValue', name: 'Time Zone Abbreviation', value: 'GMT/BST' },
          { '@type': 'PropertyValue', name: 'Observes DST', value: 'Yes' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': BASE + '/london#webpage',
        url: BASE + '/london',
        name: 'London Time — Live Clock, GMT/BST | MyZoneTime',
        description: 'Current local time in London, UK. GMT (UTC+0) in winter, BST (UTC+1) in summer. DST dates, business hours, time differences.',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
        about: { '@id': BASE + '/london#city' },
        dateModified: TODAY,
        inLanguage: 'en',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
            { '@type': 'ListItem', position: 2, name: 'London Time', item: BASE + '/london' },
          ],
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>London Time — Live Clock, GMT/BST | MyZoneTime</title>
        <meta name="description" content="Current time in London, UK. GMT (UTC+0) winter, BST (UTC+1) summer. Business hours, DST dates, time differences to NY and Dubai." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="GB-ENG" />
        <meta name="geo.placename" content="London, United Kingdom" />
        <meta name="geo.position" content="51.5074;-0.1278" />
        <meta name="ICBM" content="51.5074, -0.1278" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:url" content="https://myzonetime.com/london" />
        <meta property="og:title" content="London Time — Live Clock GMT/BST | MyZoneTime" />
        <meta property="og:description" content="Live clock for London, UK. GMT (UTC+0) in winter, BST (UTC+1) in summer. Business hours, LSE trading hours, and time differences." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:title" content="London Time — GMT/BST Live Clock | MyZoneTime" />
        <meta name="twitter:description" content="Live time in London, UK. GMT in winter, BST in summer. Compare with New York, Dubai, Sydney." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/london" />
      <StructuredData schema={schema} />
      <CityPage
        city="London" country="United Kingdom" timezone="Europe/London"
        lat={51.5074} lon={-0.1278}
        pathname="/london"
        description="London follows Greenwich Mean Time (GMT, UTC+0) in winter and British Summer Time (BST, UTC+1) in summer. As the home of the Greenwich meridian, London is the reference point from which all world time zones are measured — making it uniquely central to global timekeeping."
      >
        <section className="py-10 border-t border-border/40">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">London Time Zone: GMT and BST Explained</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                London is the home of Greenwich Mean Time (GMT), the world's original time standard established at the Royal Observatory in Greenwich in 1884. GMT is UTC+0 — it serves as the zero point from which all other time zones on Earth are measured. During British Summer Time (BST), the UK moves to UTC+1, shifting clocks forward by one hour to extend evening daylight.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The transition to BST happens at 1:00 AM on the last Sunday of March each year, and clocks return to GMT at 2:00 AM on the last Sunday of October. This means London's UTC offset changes twice a year, which is important to account for when scheduling international calls or meetings that span the clock-change dates.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">London Business Hours and Financial Markets</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Standard business hours in London are Monday to Friday, 9:00 AM to 5:30 PM GMT/BST. The City of London — London's financial district — often starts earlier, with many traders and bankers at their desks by 7:00 or 8:00 AM.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The London Stock Exchange (LSE) opens at 8:00 AM and closes at 4:30 PM GMT. This makes London's morning session the critical overlap period where European, Middle Eastern, and early American markets are all active simultaneously. London's afternoon session (2:00–4:30 PM GMT) coincides with the New York market open (9:30 AM EST), creating the world's highest-volume trading window.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Time Differences: London to Major World Cities</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold">City</th>
                      <th className="text-left py-2 pr-4 font-semibold">Time Zone</th>
                      <th className="text-left py-2 font-semibold">Difference from London</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">New York</td><td className="py-2 pr-4">EST/EDT</td><td className="py-2">−5 hrs (winter) / −4 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Dubai</td><td className="py-2 pr-4">GST</td><td className="py-2">+4 hrs (winter) / +3 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Mumbai / Delhi</td><td className="py-2 pr-4">IST</td><td className="py-2">+5:30 hrs (winter) / +4:30 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Singapore</td><td className="py-2 pr-4">SGT</td><td className="py-2">+8 hrs (winter) / +7 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Tokyo</td><td className="py-2 pr-4">JST</td><td className="py-2">+9 hrs (winter) / +8 hrs (summer)</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 pr-4">Sydney</td><td className="py-2 pr-4">AEST/AEDT</td><td className="py-2">+10–11 hrs (varies)</td></tr>
                    <tr><td className="py-2 pr-4">Los Angeles</td><td className="py-2 pr-4">PST/PDT</td><td className="py-2">−8 hrs (winter) / −7 hrs (summer)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Best Times to Schedule Calls with London</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
                <li><strong className="text-foreground">London ↔ New York:</strong> 2:00–5:00 PM London time = 9:00 AM–12:00 PM New York (EST). This is the prime transatlantic window used by most financial and tech firms.</li>
                <li><strong className="text-foreground">London ↔ Dubai:</strong> 9:00 AM–1:00 PM London = 1:00–5:00 PM Dubai. Morning London sessions align well with Dubai afternoons.</li>
                <li><strong className="text-foreground">London ↔ Singapore:</strong> 8:00–10:00 AM London = 4:00–6:00 PM Singapore. The window is narrow but usable at the start of the London day.</li>
                <li><strong className="text-foreground">London ↔ Los Angeles:</strong> 4:00–6:00 PM London = 8:00–10:00 AM Los Angeles (PST). Late afternoon London aligns with early morning Pacific Time.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About London</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                London is the capital and largest city of England and the United Kingdom. With a population of over 9 million in the city proper and around 14 million in the greater metropolitan area, it is one of the world's most populous cities. London is a global centre of finance, culture, media, education, and government.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As the home of Greenwich and the prime meridian, London has a unique historical claim as the anchor of world timekeeping. The concept of time zones itself was formalised at the International Meridian Conference held in Washington D.C. in 1884, where Greenwich was chosen as the prime meridian — making London's local time the global reference point still used today.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} includeSchema={false} />
        <RelatedTools city="London" relatedCity="New York" />
      </CityPage>
    </>
  );
}
