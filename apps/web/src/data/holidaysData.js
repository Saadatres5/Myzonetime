export function getHolidayForDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Fixed date holidays
  if (month === 1 && day === 1) return "New Year's Day";
  if (month === 2 && day === 14) return "Valentine's Day";
  if (month === 3 && day === 8) return "International Women's Day";
  if (month === 4 && day === 22) return "Earth Day";
  if (month === 4 && day === 24) return "Armenian Genocide Remembrance Day";
  if (month === 5 && day === 1) return "International Workers' Day";
  if (month === 10 && day === 31) return "Halloween";
  if (month === 12 && day === 25) return "Christmas Day";
  if (month === 12 && day === 26) return "Boxing Day";
  if (month === 12 && day === 31) return "New Year's Eve";
  
  // Thanksgiving (4th Thursday of November)
  if (month === 11) {
    const firstDay = new Date(date.getFullYear(), 10, 1);
    const firstThursday = 1 + ((11 - firstDay.getDay()) % 7);
    const fourthThursday = firstThursday + 21;
    if (day === fourthThursday) return "Thanksgiving Day";
  }
  
  // Approximate dates for variable holidays (2026)
  if (month === 3 && (day >= 30 && day <= 31)) return "Eid al-Fitr (approx)";
  if (month === 6 && (day >= 6 && day <= 7)) return "Eid al-Adha (approx)";
  if (month === 10 && (day >= 20 && day <= 24)) return "Diwali (approx)";
  
  return null;
}