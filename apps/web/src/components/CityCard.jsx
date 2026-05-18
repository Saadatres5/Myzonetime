import React from 'react';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { isDaytime } from '@/utils/getTimeOfDay.js';
import { getUTCOffset } from '@/utils/getUTCOffset.js';
import { Badge } from '@/components/ui/badge';
import { useGeolocation } from '@/hooks/useGeolocation.js';
import { isIslamicCountry } from '@/utils/islamicCountries.js';
import IslamicDateDisplay from '@/components/IslamicDateDisplay.jsx';

const CityCard = ({ city, is24Hour }) => {
  const { formattedTime, localTime } = useLocalTime(city.timezone, is24Hour);
  const utcOffset = getUTCOffset(city.timezone);
  const isDay = isDaytime(localTime);
  
  const { countryCode } = useGeolocation();
  const isUserInIslamicCountry = isIslamicCountry(countryCode);
  
  // Determine if it's the user's local time zone or Mecca/Riyadh
  const isLocalTime = Intl.DateTimeFormat().resolvedOptions().timeZone === city.timezone;
  const isMeccaRiyadh = city.timezone === 'Asia/Riyadh';
  
  const showIslamicDate = isUserInIslamicCountry && (isLocalTime || isMeccaRiyadh);
  
  return (
    <article className={`bg-card border border-border rounded-xl p-5 sm:p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full w-full ${isDay ? 'daytime-border' : 'nighttime-border'}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Place",
          "name": city.cityName || city.name,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": city.countryName || city.country
          },
          "additionalProperty": {
            "@type": "PropertyValue",
            "name": "Timezone",
            "value": city.timezone
          }
        })
      }} />
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">{city.flagEmoji || '🏳️'}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg sm:text-xl text-foreground leading-tight truncate pr-2" title={city.cityName || city.name}>
              {city.cityName || city.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate" title={city.countryName || city.country}>
              {city.countryName || city.country}
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className="text-[10px] sm:text-xs monospace-time px-2 py-0.5 whitespace-nowrap shrink-0">
          {utcOffset}
        </Badge>
      </div>
      
      <div className="mt-auto">
        <IslamicDateDisplay 
          time={formattedTime} 
          date={localTime} 
          showIslamicDate={showIslamicDate}
          timeClassName="text-2xl sm:text-3xl lg:text-4xl"
        />
      </div>
    </article>
  );
};

export default CityCard;