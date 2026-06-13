import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function DateCalculatorPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - start;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (totalDays < 0) {
      setResults({ error: 'End date must be after start date' });
      return;
    }

    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    let businessDays = 0;
    const current = new Date(start);
    while (current < end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    setResults({
      totalDays,
      weeks,
      remainingDays,
      businessDays
    });
  }, [startDate, endDate]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Date Calculator",
    "applicationCategory": "UtilityApplication",
    "description": "Calculate days, weeks, and business days between two dates."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Date Calculator", "item": "https://myzonetime.com/date-calculator" }
    ]
  };

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Date Calculator — Calculate Days Between Dates | MyZoneTime</title>
        <meta name="description" content="Free date calculator. Find the number of days, weeks, and months between any two dates." />
        <meta property="og:title" content="Date Calculator — Calculate Days Between Dates | MyZoneTime" />
        <meta property="og:description" content="Free date calculator. Find the number of days, weeks, and months between any two dates." />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Date Calculator | MyZoneTime" />
        <meta name="twitter:description" content="Free date calculator. Find the number of days, weeks, and months between any two dates." />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname="/date-calculator" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="w-full max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Date Calculator</h1>
          <p className="text-muted-foreground">Find the exact duration between two dates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <Label htmlFor="start-date" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <Label htmlFor="end-date" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {results && (
          <div className="bg-secondary/30 border border-border rounded-2xl p-8">
            {results.error ? (
              <div className="text-center text-destructive font-medium">
                {results.error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold tabular-nums">{results.totalDays}</div>
                  <h2 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Days</h2>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold tabular-nums">
                    {results.weeks}<span className="text-2xl text-muted-foreground font-normal ml-1">w</span> {results.remainingDays}<span className="text-2xl text-muted-foreground font-normal ml-1">d</span>
                  </div>
                  <h2 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Weeks & Days</h2>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold tabular-nums text-primary">{results.businessDays}</div>
                  <h2 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Business Days</h2>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}