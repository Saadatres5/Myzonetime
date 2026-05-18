import React, { useMemo } from 'react';
import { getHolidayForDate } from '@/data/holidaysData.js';
import { Quote, Calendar } from 'lucide-react';

const DailyInfoCards = () => {
  const quotes = [
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { text: "Lost time is never found again.", author: "Benjamin Franklin" },
    { text: "Time flies over us, but leaves its shadow behind.", author: "Nathaniel Hawthorne" },
    { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
    { text: "Time is the wisest counselor of all.", author: "Pericles" },
    { text: "Time is the most valuable thing a person can spend.", author: "Theophrastus" },
    { text: "Time is a created thing. To say 'I don't have time' is like saying 'I don't want to.'", author: "Lao Tzu" },
    { text: "The future is something which everyone reaches at the rate of sixty minutes an hour.", author: "C.S. Lewis" },
  ];
  
  const randomQuote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);
  
  const today = new Date();
  const holiday = getHolidayForDate(today);
  
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg text-foreground italic leading-relaxed mb-2">
                  "{randomQuote.text}"
                </p>
                <p className="text-sm text-muted-foreground font-medium">— {randomQuote.author}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-md">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Today's Observance</h3>
                <p className="text-lg text-foreground font-medium">
                  {holiday || 'No major observance today.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyInfoCards;