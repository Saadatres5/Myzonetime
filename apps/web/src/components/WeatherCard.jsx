import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Loader2, AlertCircle } from 'lucide-react';

const getWeatherIcon = (code) => {
  if (code <= 3) return <Sun className="w-8 h-8 text-yellow-400" />;
  if (code <= 49) return <Cloud className="w-8 h-8 text-gray-400" />;
  if (code <= 69) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code <= 79) return <CloudSnow className="w-8 h-8 text-white" />;
  if (code <= 99) return <CloudLightning className="w-8 h-8 text-yellow-500" />;
  return <Cloud className="w-8 h-8 text-gray-400" />;
};

const getWeatherDesc = (code) => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 49) return 'Fog / Overcast';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

export default function WeatherCard({ lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setWeather({
          tempC: Math.round(data.current.temperature_2m),
          tempF: Math.round((data.current.temperature_2m * 9/5) + 32),
          code: data.current.weather_code
        });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [lat, lon]);

  return (
    <div className="premium-card p-6 flex flex-col justify-center h-full min-h-[160px]">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Cloud className="w-5 h-5 text-primary" /> Current Weather
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-1 text-destructive gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Failed to load weather</span>
        </div>
      ) : weather ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.code)}
            <div>
              <div className="text-3xl font-bold tabular-nums text-foreground">
                {weather.tempC}°C <span className="text-lg text-muted-foreground font-normal">/ {weather.tempF}°F</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {getWeatherDesc(weather.code)}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}