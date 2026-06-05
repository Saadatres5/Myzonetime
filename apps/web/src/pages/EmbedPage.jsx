import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Globe2 } from 'lucide-react';

const defaultCities = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' }
];

function WidgetCityRow({ name, timezone }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', { 
    timeZone: timezone, 
    hour12: true, 
    hour: 'numeric', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const dateString = time.toLocaleDateString('en-US', { 
    timeZone: timezone, 
    weekday: 'short',
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{dateString}</span>
      </div>
      <span className="font-mono-time font-bold text-primary text-lg tracking-tight tabular-nums">
        {timeString}
      </span>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground p-4 sm:p-6 flex flex-col">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <Globe2 className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">World Clock</h1>
      </div>
      
      <div className="flex-1 space-y-1">
        {defaultCities.map(city => (
          <WidgetCityRow key={city.name} name={city.name} timezone={city.timezone} />
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50 text-center">
        <a 
          href="https://myzonetime.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          Powered by MyZoneTime
        </a>
      </div>
    </div>
  );
}