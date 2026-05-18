export function gregorianToHijri(date) {
  if (!date) return null;
  
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      calendar: 'islamic-umalqura',
      timeZone: 'Asia/Riyadh',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    
    const day = parts.find(p => p.type === 'day')?.value;
    const monthName = parts.find(p => p.type === 'month')?.value;
    // Year might contain " AH" at the end, so we extract just the number
    const yearString = parts.find(p => p.type === 'year')?.value || '';
    const year = yearString.split(' ')[0];

    return { 
      day, 
      month: monthName, 
      year, 
      monthName 
    };
  } catch (error) {
    console.error("Error converting to Hijri date:", error);
    return null;
  }
}

export function formatHijriDate(hijriDate) {
  if (!hijriDate || !hijriDate.day || !hijriDate.monthName || !hijriDate.year) {
    return '';
  }
  return `Hijri Date: ${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year}`;
}