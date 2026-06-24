import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar as CalendarIcon, Type, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function CountdownPage() {
  const [eventName, setEventName] = useState(() => {
    return localStorage.getItem('countdown_eventName') || '';
  });
  
  const [targetDate, setTargetDate] = useState(() => {
    const savedDate = localStorage.getItem('countdown_targetDate');
    if (savedDate) return savedDate;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(tomorrow - tzoffset)).toISOString().slice(0, 16);
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (eventName || targetDate) {
      localStorage.setItem('countdown_eventName', eventName);
      localStorage.setItem('countdown_targetDate', targetDate);
    }
  }, [eventName, targetDate]);

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsExpired(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const handleDateChange = (e) => setTargetDate(e.target.value);
  const handleNameChange = (e) => setEventName(e.target.value);

  const handleReset = () => {
    setEventName('');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const defaultDate = (new Date(tomorrow - tzoffset)).toISOString().slice(0, 16);
    
    setTargetDate(defaultDate);
    
    localStorage.removeItem('countdown_eventName');
    localStorage.removeItem('countdown_targetDate');
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Countdown Timer",
    "applicationCategory": "UtilityApplication",
    "description": "Create a countdown to any future date and time."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Countdown", "item": "https://myzonetime.com/countdown" }
    ]
  };

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Countdown Timer — Days Until Event | MyZoneTime</title>
        <meta name="description" content="Create custom countdown timers for events, holidays, and important dates. Track days, hours, and minutes remaining." />
        <meta property="og:title" content="Countdown Timer — Days Until Event | MyZoneTime" />
        <meta property="og:description" content="Create custom countdown timers for events, holidays, and important dates. Track days, hours, and minutes remaining." />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Countdown Timer | MyZoneTime" />
        <meta name="twitter:description" content="Create custom countdown timers for events, holidays, and important dates. Track days, hours, and minutes remaining." />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname="/countdown" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="w-full max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Countdown</h1>
          <p className="text-muted-foreground">Track time remaining until your event</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <Label htmlFor="event-name" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Event Name <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="event-name"
              type="text"
              placeholder="e.g., Product Launch, New Year..."
              value={eventName}
              onChange={handleNameChange}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="target-date" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Target Date & Time
            </Label>
            <Input
              id="target-date"
              type="datetime-local"
              value={targetDate}
              onChange={handleDateChange}
              className="w-full"
            />
          </div>

          <Button 
            variant="outline" 
            onClick={handleReset}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Countdown
          </Button>
        </div>

        <div className="py-8">
          {eventName && (
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground">
              {eventName}
            </h2>
          )}
          
          {isExpired ? (
            <div className="text-center p-8 bg-secondary/50 rounded-2xl border border-border">
              <h2 className="text-2xl font-semibold text-foreground">Event has passed!</h2>
              <p className="text-muted-foreground mt-2">The selected date and time is in the past.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-sm">
                  <span className="text-4xl md:text-5xl font-mono-time font-medium tabular-nums">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mt-2 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="py-14 border-t border-border/40">
        <div className="container max-w-3xl mx-auto px-4 space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Countdown Timer to Any Date</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Use this countdown timer to count down the days, hours, minutes, and seconds to any future date and time. Set a target date — a birthday, product launch, wedding, exam, holiday, or deadline — and watch the live countdown tick in real time. The countdown updates every second directly in your browser with no page refresh needed.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You can create multiple named countdowns at once, each tracking a different event. All countdowns are saved locally in your browser so they persist between visits without requiring an account or signup.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Popular Uses for a Countdown Timer</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 leading-relaxed">
              <li><strong className="text-foreground">Product launches:</strong> Count down to a go-live date or public announcement to build team anticipation and keep everyone aligned on the deadline.</li>
              <li><strong className="text-foreground">Events and celebrations:</strong> Weddings, birthdays, anniversaries, holidays — see exactly how long until the big day.</li>
              <li><strong className="text-foreground">Exams and deadlines:</strong> Students and professionals use countdowns to maintain urgency on submission dates and revision schedules.</li>
              <li><strong className="text-foreground">Travel:</strong> Count down to your next flight, holiday, or visa renewal date.</li>
              <li><strong className="text-foreground">Sports events:</strong> Track the countdown to a match, race, or tournament you're following.</li>
              <li><strong className="text-foreground">New Year and religious holidays:</strong> Countdown to Eid, Christmas, Diwali, Ramadan, or any date in the Hijri or Gregorian calendar.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">How the Countdown Is Calculated</h2>
            <p className="text-muted-foreground leading-relaxed">
              The countdown calculates the difference between your target date/time and the current time in your local browser timezone. It subtracts the current timestamp from the target timestamp and breaks the result into days, hours, minutes, and seconds. The display updates every second. If your target date has already passed, the countdown will show zeroes or indicate that the event has occurred.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}