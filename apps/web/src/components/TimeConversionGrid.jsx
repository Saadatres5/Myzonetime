import React, { useEffect } from 'react';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { isWorkingHours, isSleepHours } from '@/utils/getTimeOfDay.js';
import { getUTCOffset } from '@/utils/getUTCOffset.js';
import { citiesData } from '@/data/worldCitiesData.js';
import { useGeolocation } from '@/hooks/useGeolocation.js';
import { isIslamicCountry } from '@/utils/islamicCountries.js';
import IslamicDateDisplay from '@/components/IslamicDateDisplay.jsx';

const TimeConversionGrid = ({ is24Hour, selectedCity = null }) => {
  useEffect(() => {
    console.log('[TimeConversionGrid] Received selectedCity prop:', selectedCity ? selectedCity.name : 'None');
  }, [selectedCity]);

  const safeCitiesData = Array.isArray(citiesData) ? citiesData : [];

  // Default cities to always show in the grid
  const defaultCityNames = ['New York', 'London', 'Tokyo', 'Sydney', 'Dubai', 'Mumbai', 'São Paulo', 'Cairo', 'Moscow', 'Beijing', 'Singapore'];
  
  let displayCities = safeCitiesData.filter(c => c && c.name && defaultCityNames.includes(c.name));

  // If a city is selected from search, ensure it's at the top of the grid
  if (selectedCity) {
    // Remove it if it's already in the default list to avoid duplicates
    displayCities = displayCities.filter(c => c.name !== selectedCity.name);
    // Add to the very top
    displayCities.unshift(selectedCity);
    console.log('[TimeConversionGrid] Updated displayCities with selectedCity at top:', displayCities.map(c => c.name));
  }
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const { countryCode } = useGeolocation();
  const isUserIslamic = isIslamicCountry(countryCode);
  
  return (
    <section className="py-12 bg-muted rounded-3xl mt-12 w-full">
      <div className="fluid-container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold font-montserrat text-foreground">24-Hour Time Conversion Grid</h2>
          {selectedCity && (
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              Showing results for: {selectedCity.name}, {selectedCity.country}
            </div>
          )}
        </div>
        
        {displayCities.length > 0 ? (
          <div className="overflow-x-auto w-full pb-4">
            <div className="inline-block min-w-full">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg w-full">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground border-r border-border sticky left-0 bg-muted z-20 min-w-[200px] md:min-w-[250px]">
                        Location & Time
                      </th>
                      {hours.map(hour => (
                        <th key={`header-hour-${hour}`} className="px-2 py-3 text-center text-xs font-medium text-muted-foreground tabular-nums">
                          {String(hour).padStart(2, '0')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayCities.map((city, cityIndex) => (
                      <CityRow 
                        key={`${city.name}-${city.timezone}`} 
                        city={city} 
                        hours={hours} 
                        is24Hour={is24Hour} 
                        isEven={cityIndex % 2 === 0}
                        isUserIslamic={isUserIslamic}
                        isSelected={selectedCity && selectedCity.name === city.name}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl shadow-sm w-full">
            <p className="text-lg text-muted-foreground font-medium">No cities available to display.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const CityRow = ({ city, hours, is24Hour, isEven, isUserIslamic, isSelected }) => {
  const localTimeResult = useLocalTime(city?.timezone || 'UTC');
  
  useEffect(() => {
    if (isSelected) {
      console.log(`[CityRow] Calculating time for selected city: ${city.name} | Timezone: ${city.timezone}`);
    }
  }, [isSelected, city.name, city.timezone]);

  if (!city || !city.timezone) {
    return null;
  }

  const baseDate = localTimeResult?.time || new Date();
  
  let formattedTime = "";
  if (localTimeResult?.formatTime) {
    formattedTime = localTimeResult.formatTime(baseDate, city.timezone, is24Hour, false);
  }
  
  let currentHour = 0;
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: city.timezone,
      hour: 'numeric',
      hourCycle: 'h23'
    });
    const formattedHour = formatter.format(baseDate);
    currentHour = parseInt(formattedHour, 10);
    
    if (isNaN(currentHour)) {
      currentHour = baseDate.getHours();
    }
  } catch (e) {
    console.error(`[CityRow] Error formatting hour for ${city.name}:`, e);
    currentHour = baseDate.getHours();
  }

  let utcOffset = "UTC";
  try {
    if (typeof getUTCOffset === 'function') {
      utcOffset = getUTCOffset(city.timezone) || "UTC";
    }
  } catch (e) {
    // Ignore error
  }
  
  const rowBg = isSelected 
    ? 'bg-primary/5 hover:bg-primary/10' 
    : (isEven ? 'bg-card hover:bg-muted/50' : 'bg-card/50 hover:bg-muted/50');

  const stickyBg = isSelected
    ? 'hsl(var(--primary) / 0.05)'
    : (isEven ? 'hsl(var(--card))' : 'hsl(var(--card) / 0.5)');

  return (
    <tr className={`border-b border-border/50 transition-colors ${rowBg}`}>
      <td className="px-4 py-4 border-r border-border sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: stickyBg }}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
            {city.name || 'Unknown'}
            {isSelected && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
          </span>
          <span className="text-[10px] text-muted-foreground tabular-nums bg-muted px-1.5 py-0.5 rounded">{utcOffset}</span>
        </div>
        
        <IslamicDateDisplay 
          time={formattedTime} 
          date={baseDate} 
          showIslamicDate={isUserIslamic} 
          timeClassName="text-base"
        />
      </td>
      {hours.map(hour => {
        let isWorking = false;
        let isSleep = false;
        
        try {
          const testDate = new Date(baseDate);
          testDate.setHours(hour, 0, 0, 0);
          
          if (typeof isWorkingHours === 'function') isWorking = isWorkingHours(testDate);
          if (typeof isSleepHours === 'function') isSleep = isSleepHours(testDate);
        } catch (e) {
          // Ignore
        }
        
        const isCurrentHour = hour === currentHour;
        let cellClass = 'px-2 py-3 text-center text-xs tabular-nums transition-all duration-200 border-r border-border/30 last:border-r-0';
        
        if (isCurrentHour) {
          cellClass += ' bg-primary text-primary-foreground font-bold shadow-inner relative z-0 scale-105 rounded-sm my-1 mx-0.5';
        } else if (isWorking) {
          cellClass += ' text-foreground font-medium';
        } else if (isSleep) {
          cellClass += ' text-muted-foreground/40 bg-muted/40';
        } else {
          cellClass += ' text-muted-foreground';
        }
        
        return (
          <td key={`cell-${city.timezone}-${hour}`} className={cellClass}>
            {String(hour).padStart(2, '0')}
          </td>
        );
      })}
    </tr>
  );
};

export default TimeConversionGrid;