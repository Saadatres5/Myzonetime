import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useSearchParams } from 'react-router-dom';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import { citiesData } from '@/data/citiesData.js';
import { useSettings } from '@/hooks/useSettings.js';

export default function WorldClockPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [time, setTime] = useState(new Date());
  
  const { toggleFavorite, isFavorite } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCities = citiesData.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteCities = filteredCities.filter(c => isFavorite(c.name));
  const otherCities = filteredCities.filter(c => !isFavorite(c.name));

  const getOffset = (tz) => {
    try {
      const date = new Date();
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
      const diff = (tzDate - utcDate) / (1000 * 60 * 60);
      return `UTC${diff >= 0 ? '+' : ''}${diff}`;
    } catch (e) {
      return 'UTC';
    }
  };

  const getCityPath = (cityName) => {
    const knownCities = ['london', 'dubai', 'newyork', 'tokyo', 'singapore', 'sydney', 'riyadh', 'abudhabi'];
    const formattedName = cityName.toLowerCase().replace(/\s+/g, '');
    return knownCities.includes(formattedName) ? `/${formattedName}` : `/world-clock?search=${encodeURIComponent(cityName)}`;
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "World Clock",
    "applicationCategory": "UtilityApplication",
    "description": "Check the current time in major cities around the world. Search and filter global time zones instantly."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "World Clock", "item": "https://myzonetime.com/world-clock" }
    ]
  };

  const CityCard = ({ city }) => {
    const isFav = isFavorite(city.name);
    
    return (
      <div className="relative group h-full">
        <Link to={getCityPath(city.name)} className="block h-full">
          <div className="bg-card border border-border rounded-2xl p-6 transition-all hover:shadow-md hover:border-foreground/20 h-full flex flex-col justify-between">
            <div className="pr-8">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{city.name}</h3>
              <p className="text-sm text-muted-foreground">{city.country}</p>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-medium tabular-nums tracking-tight">
                {time.toLocaleTimeString('en-US', { timeZone: city.timezone, hour12: true, hour: 'numeric', minute: '2-digit' })}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{getOffset(city.timezone)}</p>
            </div>
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(city.name);
          }}
          className="absolute top-6 right-6 p-2 -m-2 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          aria-label={isFav ? `Remove ${city.name} from favorites` : `Add ${city.name} to favorites`}
        >
          <Star className={`w-5 h-5 transition-all ${isFav ? 'fill-primary text-primary' : ''}`} />
        </button>
      </div>
    );
  };

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
      <Helmet>
        <title>World Clock — Live Time in 500+ Cities | MyZoneTime</title>
        <meta name="description" content="Live world clock showing current time in 500+ cities. Track time zones for Dubai, London, New York, Tokyo, Singapore, Sydney, and more." />
        <meta property="og:title" content="World Clock — Live Time in 500+ Cities | MyZoneTime" />
        <meta property="og:description" content="Live world clock showing current time in 500+ cities. Track time zones for Dubai, London, New York, Tokyo, Singapore, Sydney, and more." />
        <meta property="og:image" content="https://myzonetime.com/og-image.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="World Clock | MyZoneTime" />
        <meta name="twitter:description" content="Check the current time in major cities around the world. Search and filter global time zones instantly." />
        <meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />
      </Helmet>
      <CanonicalTag pathname="/world-clock" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="space-y-12">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            World Clock - Real-Time Global Time Zones
          </h1>
          <p className="text-lg text-muted-foreground">Current local time in major cities worldwide.</p>
        </div>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search cities..." 
            className="w-full pl-12 h-12 rounded-full bg-secondary/50 border-none focus-visible:ring-2 focus-visible:ring-ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {favoriteCities.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Star className="w-6 h-6 fill-primary text-primary" />
              Your Cities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteCities.map((city) => (
                <CityCard key={`fav-${city.id}`} city={city} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {favoriteCities.length > 0 && (
            <h2 className="text-2xl font-semibold tracking-tight pt-8 border-t border-border/50">
              All Cities
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherCities.map((city) => (
              <CityCard key={`other-${city.id}`} city={city} />
            ))}
            {filteredCities.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No cities found matching "{search}"
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}