import { useMemo } from 'react';
import { gregorianToHijri, formatHijriDate } from '@/utils/islamicDateConverter.js';

export function useIslamicDate(inputDate) {
  // Use a primitive date string (e.g., "Wed Apr 29 2026") as the dependency.
  // This prevents infinite loops and unnecessary recalculations even if a 
  // new Date object is passed on every render, as it only changes when the actual day changes.
  const dateString = inputDate instanceof Date ? inputDate.toDateString() : '';

  // Replace useState + useEffect with useMemo to synchronously derive state.
  // This completely eliminates any possibility of an infinite render loop.
  return useMemo(() => {
    if (!inputDate || !dateString) {
      return {
        hijriDate: null,
        formattedHijri: '',
        gregorianDate: null,
        formattedGregorian: ''
      };
    }

    try {
      const hijri = gregorianToHijri(inputDate);
      
      const gregorianFormatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium'
      });

      return {
        hijriDate: hijri,
        formattedHijri: formatHijriDate(hijri),
        gregorianDate: inputDate,
        formattedGregorian: gregorianFormatter.format(inputDate)
      };
    } catch (error) {
      console.error('Error formatting dates in useIslamicDate:', error);
      return {
        hijriDate: null,
        formattedHijri: '',
        gregorianDate: inputDate,
        formattedGregorian: ''
      };
    }
  }, [dateString, inputDate]);
}