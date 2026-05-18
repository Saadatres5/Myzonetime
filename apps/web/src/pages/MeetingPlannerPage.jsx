import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { citiesData } from '@/data/citiesData.js';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function MeetingPlannerPage() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    const initial = citiesData.filter(c => ['London', 'New York', 'Tokyo'].includes(c.name));
    setSelectedCities(initial);
    setAvailableCities(citiesData.filter(c => !initial.find(i => i.id === c.id)));
  }, []);

  const addCity = (e) => {
    const cityId = e.target.value;
    if (!cityId) return;
    const city = availableCities.find(c => c.id === cityId);
    if (city && selectedCities.length < 5) {
      setSelectedCities([...selectedCities, city]);
      setAvailableCities(availableCities.filter(c => c.id !== cityId));
    }
  };

  const removeCity = (cityId) => {
    const city = selectedCities.find(c => c.id === cityId);
    if (city) {
      setSelectedCities(selectedCities.filter(c => c.id !== cityId));
      setAvailableCities([...availableCities, city].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const schema = {
    "@type": "WebApplication",
    "name": "Meeting Planner",
    "description": "Find the perfect overlapping working hours across multiple time zones."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Meeting Planner", "item": "https://myzonetime.com/meeting-planner" }
    ]
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-16 max-w-5xl">
      <Helmet>
        <title>Meeting Planner — Find Best Time Across Time Zones | MyZoneTime</title>
        <meta name="description" content="Find the best time to schedule meetings across multiple time zones. See overlapping work hours for your team in real-time. Free meeting planner for remote teams." />
        <meta property="og:title" content="Meeting Planner | MyZoneTime" />
        <meta property="og:description" content="Schedule meetings across time zones. Find overlapping work hours for your distributed team instantly." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meeting Planner | MyZoneTime" />
        <meta name="twitter:description" content="Find the perfect overlapping working hours across multiple time zones." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      
      <CanonicalTag pathname="/meeting-planner" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Meeting Planner</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect overlapping working hours across multiple time zones. Green indicates standard business hours (9 AM - 6 PM).
          </p>
        </div>

        <div className="premium-card p-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" /> Selected Locations ({selectedCities.length}/5)
            </h2>
            
            <select 
              className="flex h-12 w-full sm:w-[300px] items-center justify-between rounded-xl border border-border/50 bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={addCity}
              value=""
              disabled={selectedCities.length >= 5}
            >
              <option value="" disabled>Add a city...</option>
              {availableCities.slice(0, 100).map(city => (
                <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedCities.map(city => (
              <div key={city.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50 shadow-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{city.name}</span>
                  <span className="text-sm text-muted-foreground">{city.timezone}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeCity(city.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {selectedCities.length >= 2 && (
          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Visual Timeline (UTC)</h2>
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[800px] space-y-4">
                {selectedCities.map(city => {
                  // Simplified visual timeline representation
                  return (
                    <div key={city.id} className="flex items-center gap-4">
                      <div className="w-32 font-medium text-sm shrink-0">{city.name}</div>
                      <div className="flex-1 flex h-12 rounded-lg overflow-hidden border border-border/50">
                        {[...Array(24)].map((_, i) => {
                          // Mock logic for visual representation
                          const isWorkHour = i >= 9 && i < 18;
                          const isPartial = (i >= 7 && i < 9) || (i >= 18 && i < 21);
                          return (
                            <div 
                              key={i} 
                              className={`flex-1 border-r border-background/20 last:border-0 ${
                                isWorkHour ? 'bg-green-500/80' : isPartial ? 'bg-yellow-500/80' : 'bg-red-500/80'
                              }`}
                              title={`${i}:00`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-32 shrink-0"></div>
                  <div className="flex-1 flex justify-between text-xs text-muted-foreground px-1">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}