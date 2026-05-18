import React from 'react';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation.js';
import { isIslamicCountry } from '@/utils/islamicCountries.js';
import { useIslamicDate } from '@/hooks/useIslamicDate.js';

const AtomicClock = ({ is24Hour }) => {
  const { formattedTime, formattedDate, localTime } = useLocalTime('UTC', is24Hour);
  
  const { countryCode } = useGeolocation();
  const isUserInIslamicCountry = isIslamicCountry(countryCode);
  const { formattedHijri } = useIslamicDate(localTime);
  
  const getDayOfYear = () => {
    const start = new Date(localTime.getFullYear(), 0, 0);
    const diff = localTime - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };
  
  const getISOWeek = () => {
    const date = new Date(localTime.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };
  
  return (
    <section className="py-12 bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold condensed-heading text-primary mb-8">Atomic Clock</h2>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <div className="time-display text-6xl md:text-8xl font-bold text-primary mb-4">
              {formattedTime}
            </div>
            
            <div className="flex flex-col items-center mb-8 gap-3">
              <div className="text-xl text-muted-foreground">
                {formattedDate}
              </div>
              
              {isUserInIslamicCountry && formattedHijri && (
                <Badge variant="outline" className="islamic-badge px-3 py-1 text-sm font-medium">
                  {formattedHijri}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Day of Year</div>
                <div className="text-2xl font-bold time-display !min-w-0 text-foreground">{getDayOfYear()}</div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">ISO Week</div>
                <div className="text-2xl font-bold time-display !min-w-0 text-foreground">{getISOWeek()}</div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-sm text-muted-foreground mb-1">Sync Status</div>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  <Activity className="w-3 h-3 mr-1" />
                  Synced
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtomicClock;