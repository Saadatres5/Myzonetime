import { useState, useEffect } from 'react';

export function useTimeFormat() {
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem('chronosync-time-format');
    return saved ? saved === '24' : true;
  });
  
  useEffect(() => {
    localStorage.setItem('chronosync-time-format', is24Hour ? '24' : '12');
  }, [is24Hour]);
  
  const toggleFormat = () => {
    setIs24Hour(prev => !prev);
  };
  
  return { is24Hour, toggleFormat };
}