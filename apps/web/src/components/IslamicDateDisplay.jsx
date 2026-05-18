import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useIslamicDate } from '@/hooks/useIslamicDate.js';

export default function IslamicDateDisplay({ 
  time, 
  date, 
  showIslamicDate = false,
  className = "",
  timeClassName = "text-2xl"
}) {
  // The useIslamicDate hook now safely handles new Date() instances 
  // without triggering an infinite update loop.
  const { formattedHijri, formattedGregorian } = useIslamicDate(date || new Date());

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className={`monospace-time font-bold text-primary glow-cyan mb-1 ${timeClassName}`}>
        {time}
      </div>
      
      <div className="text-xs text-muted-foreground mb-1.5">
        Gregorian: {formattedGregorian}
      </div>
      
      {showIslamicDate && formattedHijri && (
        <Badge variant="outline" className="islamic-badge px-2 py-0.5 mt-0.5 text-xs font-medium">
          {formattedHijri}
        </Badge>
      )}
    </div>
  );
}