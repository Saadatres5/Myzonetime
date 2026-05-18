import { useState, useEffect } from 'react';

export function useLocalTime(timezone) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedParts = () => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      
      const parts = formatter.formatToParts(time);
      const hours = parts.find(p => p.type === 'hour')?.value || '00';
      const minutes = parts.find(p => p.type === 'minute')?.value || '00';
      const seconds = parts.find(p => p.type === 'second')?.value || '00';
      
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return { hours, minutes, seconds, date: dateFormatter.format(time) };
    } catch (e) {
      return { hours: '00', minutes: '00', seconds: '00', date: '' };
    }
  };

  const { hours, minutes, seconds, date } = getFormattedParts();

  const formatTime = (dateObj, tz, is24Hour, showSeconds) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: showSeconds ? '2-digit' : undefined,
        hour12: !is24Hour
      }).format(dateObj);
    } catch (e) {
      return '';
    }
  };

  const formatDate = (dateObj, tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (e) {
      return '';
    }
  };

  return { time, hours, minutes, seconds, date, formatTime, formatDate };
}