import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import StructuredData from '@/components/StructuredData.jsx';

export default function FAQSection({ faqs = [], title = 'Frequently Asked Questions' }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs.length) return null;

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <section className="py-16 border-t border-border/40" aria-labelledby="faq-heading">
      <StructuredData schemas={[faqSchema]} />
      <div className="container max-w-3xl mx-auto space-y-8">
        <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold tracking-tight text-center">{title}</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border/50 rounded-xl overflow-hidden bg-card/30">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/30 transition-colors"
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                <h3 className="font-semibold text-foreground text-base leading-snug">{faq.question}</h3>
                <ChevronDown className={cn('w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200', openIndex === i && 'rotate-180')} aria-hidden="true" />
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                hidden={openIndex !== i}
                className="px-6 pb-5"
              >
                <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
