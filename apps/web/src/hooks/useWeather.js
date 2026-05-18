import { useState, useEffect } from 'react';

const getWeatherCondition = (code) => {
  if (code === 0) return { condition: 'Sunny', icon: '☀️' };
  if (code === 1) return { condition: 'Mostly Sunny', icon: '🌤️' };
  if (code === 2) return { condition: 'Partly Cloudy', icon: '⛅' };
  if (code === 3) return { condition: 'Cloudy', icon: '☁️' };
  if (code === 45 || code === 48) return { condition: 'Fog', icon: '🌫️' };
  if (code >= 51 && code <= 57) return { condition: 'Drizzle', icon: '🌧️' };
  if (code >= 61 && code <= 67) return { condition: 'Rain', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: '🌦️' };
  if (code >= 85 && code <= 86) return { condition: 'Snow Showers', icon: '🌨️' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Unknown', icon: '🌈' };
};

export function useWeather(lat, lng) {
  const [weather, setWeather] = useState({
    tempC: null,
    tempF: null,
    condition: '',
    icon: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!lat || !lng) {
      setWeather(prev => ({ ...prev, loading: false }));
      return;
    }

    let mounted = true;

    const fetchWeather = async () => {
      try {
        setWeather(prev => ({ ...prev, loading: true, error: null }));
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code`
        );
        
        if (!res.ok) throw new Error('Failed to fetch weather data');
        
        const data = await res.json();
        if (!mounted) return;

        const tempC = data.current.temperature_2m;
        const tempF = (tempC * 9/5) + 32;
        const { condition, icon } = getWeatherCondition(data.current.weather_code);

        setWeather({
          tempC: Math.round(tempC),
          tempF: Math.round(tempF),
          condition,
          icon,
          loading: false,
          error: null
        });
      } catch (err) {
        if (mounted) {
          setWeather(prev => ({ ...prev, loading: false, error: err.message }));
        }
      }
    };

    fetchWeather();

    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [lat, lng]);

  return weather;
}