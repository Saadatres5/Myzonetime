import React from 'react';
import StructuredData from '@/components/StructuredData.jsx';

/**
 * FAQSchema — emits FAQ structured data via a single @graph block.
 * Uses IANA timezone + UTC offset for AEO-friendly answer text.
 */
export default function FAQSchema({ cityName, timezone, utcOffset, currentTime, faqs: customFaqs }) {
  const questions = customFaqs || [
    {
      question: `What time is it in ${cityName} right now?`,
      answer: `The current local time in ${cityName} is ${currentTime || 'updated live on the page'}. ${cityName} uses the ${timezone} timezone (${utcOffset}).`,
    },
    {
      question: `What timezone does ${cityName} use?`,
      answer: `${cityName} observes the ${timezone} timezone, which is ${utcOffset} from Coordinated Universal Time (UTC). You can check the live clock at myzonetime.com/${cityName.toLowerCase().replace(/ /g, '-')}.`,
    },
    {
      question: `What is the UTC offset for ${cityName}?`,
      answer: `The UTC offset for ${cityName} is ${utcOffset}. This is based on the ${timezone} timezone. Check myzonetime.com for any daylight saving time adjustments.`,
    },
    {
      question: `Is ${cityName} currently observing daylight saving time?`,
      answer: `Whether ${cityName} observes daylight saving time depends on the ${timezone} timezone rules. Visit myzonetime.com/${cityName.toLowerCase().replace(/ /g, '-')} for the live, automatically adjusted time.`,
    },
  ];

  const schema = {
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return <StructuredData schemas={[schema]} />;
}
