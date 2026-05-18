export function getTimeOfDay(date) {
  if (!date || !(date instanceof Date)) return 'nighttime';
  
  const hours = date.getHours();
  
  // Working hours: 9am-6pm
  if (hours >= 9 && hours < 18) {
    return 'working-hours';
  }
  
  // Daytime: 6am-6pm
  if (hours >= 6 && hours < 18) {
    return 'daytime';
  }
  
  // Nighttime: 6pm-6am
  return 'nighttime';
}

export function isDaytime(date) {
  if (!date || !(date instanceof Date)) return false;
  const hours = date.getHours();
  return hours >= 6 && hours < 18;
}

export function isWorkingHours(date) {
  if (!date || !(date instanceof Date)) return false;
  const hours = date.getHours();
  return hours >= 9 && hours < 18;
}

export function isSleepHours(date) {
  if (!date || !(date instanceof Date)) return false;
  const hours = date.getHours();
  return hours >= 22 || hours < 6;
}