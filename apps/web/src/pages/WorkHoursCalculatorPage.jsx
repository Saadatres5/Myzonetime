import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function WorkHoursCalculatorPage() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMinutes, setBreakMinutes] = useState('60');
  
  const [workDays, setWorkDays] = useState({
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false
  });

  const [results, setResults] = useState({ daily: 0, weekly: 0 });

  const daysList = [
    { id: 'mon', label: 'Monday' },
    { id: 'tue', label: 'Tuesday' },
    { id: 'wed', label: 'Wednesday' },
    { id: 'thu', label: 'Thursday' },
    { id: 'fri', label: 'Friday' },
    { id: 'sat', label: 'Saturday' },
    { id: 'sun', label: 'Sunday' },
  ];

  useEffect(() => {
    if (!startTime || !endTime) return;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const breakMins = parseInt(breakMinutes) || 0;
    let dailyMinutes = endMinutes - startMinutes - breakMins;
    
    if (dailyMinutes < 0) dailyMinutes = 0;

    const activeDaysCount = Object.values(workDays).filter(Boolean).length;
    const weeklyMinutes = dailyMinutes * activeDaysCount;

    setResults({
      daily: dailyMinutes / 60,
      weekly: weeklyMinutes / 60,
      activeDays: activeDaysCount
    });
  }, [startTime, endTime, breakMinutes, workDays]);

  const handleDayToggle = (dayId) => {
    setWorkDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const formatHours = (decimalHours) => {
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Work Hours Calculator",
    "applicationCategory": "UtilityApplication",
    "description": "Calculate daily and weekly working hours."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Work Hours Calculator", "item": "https://myzonetime.com/work-hours" }
    ]
  };

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Work Hours Calculator — Calculate Working Hours | MyZoneTime</title>
        <meta name="description" content="Calculate total work hours between two times. Perfect for tracking billable hours and work time." />
        <meta property="og:title" content="Work Hours Calculator — Calculate Working Hours | MyZoneTime" />
        <meta property="og:description" content="Calculate total work hours between two times. Perfect for tracking billable hours and work time." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Work Hours Calculator | MyZoneTime" />
        <meta name="twitter:description" content="Calculate daily and weekly working hours." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <CanonicalTag pathname="/work-hours-calculator" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="w-full max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Work Hours Calculator</h1>
          <p className="text-muted-foreground">Calculate your daily and weekly working hours</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" /> Time Settings
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="break-time">Unpaid Break (minutes)</Label>
                <Input
                  id="break-time"
                  type="number"
                  min="0"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Work Days
            </h2>
            
            <div className="space-y-3">
              {daysList.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day.id}`} 
                    checked={workDays[day.id]}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label htmlFor={`day-${day.id}`} className="cursor-pointer font-normal">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">Daily Hours</h3>
              <div className="text-4xl font-bold tabular-nums">{formatHours(results.daily)}</div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">Weekly Hours ({results.activeDays} days)</h3>
              <div className="text-4xl font-bold tabular-nums">{formatHours(results.weekly)}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
