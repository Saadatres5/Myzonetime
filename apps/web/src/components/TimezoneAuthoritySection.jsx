import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TIMEZONE_DATA } from '@/data/timezoneData.js';

export default function TimezoneAuthoritySection({ cityName, timezoneKey, extraTimezoneKeys = [] }) {
  const timezoneInfo = timezoneKey ? TIMEZONE_DATA[timezoneKey] : null;
  const relatedKeys = Array.from(new Set([
    ...(timezoneInfo?.relatedTimezones || []),
    ...(Array.isArray(extraTimezoneKeys) ? extraTimezoneKeys : []),
  ]));

  return (
    <section className="py-10 border-t border-border/40">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Timezone authority for {cityName}</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Learn more about {timezoneInfo?.fullName || cityName}'s time zone and how it affects {cityName}'s local time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={timezoneInfo ? `/timezone/${timezoneKey}` : '/timezone'}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm"
          >
            <span>{timezoneInfo ? `${timezoneInfo.abbr} — ${timezoneInfo.fullName}` : 'Browse all time zones'}</span>
            <ArrowRight className="w-4 h-4 text-primary shrink-0" />
          </Link>
          {relatedKeys.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {relatedKeys.slice(0, 3).map(key => {
                const tz = TIMEZONE_DATA[key];
                if (!tz) return null;
                return (
                  <Link
                    key={key}
                    to={`/timezone/${key}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <span>{tz.abbr} — {tz.fullName}</span>
                    <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
