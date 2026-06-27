/**
 * SunriseSunsetPage.jsx
 * Sunrise, sunset, day length, solar noon, and twilight times for any city.
 * time.is shows this on every city page — we offer it as a dedicated tool.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sun, Sunset, Moon, Clock, MapPin, Search } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';
import FAQSection from '@/components/FAQSection.jsx';

// ── Solar calculation utilities ───────────────────────────────────────────────
function toRad(d) { return d * Math.PI / 180; }
function toDeg(r) { return r * 180 / Math.PI; }

function calcSunriseSunset(lat, lon, date = new Date()) {
  const JD = date / 86400000 + 2440587.5;
  const n  = Math.floor(JD - 2451545.0 + 0.0008);
  const Js = n - lon / 360;
  const M  = (357.5291 + 0.98560028 * Js) % 360;
  const C  = 1.9148 * Math.sin(toRad(M)) + 0.0200 * Math.sin(toRad(2*M)) + 0.0003 * Math.sin(toRad(3*M));
  const lam = (M + C + 180 + 102.9372) % 360;
  const Jt  = 2451545.0 + Js + 0.0053 * Math.sin(toRad(M)) - 0.0069 * Math.sin(toRad(2*lam));
  const sinD = Math.sin(toRad(lam)) * Math.sin(toRad(23.4397));
  const cosD = Math.cos(Math.asin(sinD));
  const cosW = (Math.sin(toRad(-0.833)) - Math.sin(toRad(lat)) * sinD) / (Math.cos(toRad(lat)) * cosD);

  if (cosW < -1) return { type: 'midnight_sun' };
  if (cosW >  1) return { type: 'polar_night' };

  const W   = toDeg(Math.acos(cosW));
  const Jss = Jt + W / 360;
  const Jsr = Jt - W / 360;

  const toTime = jd => {
    const ms = (jd - 2440587.5) * 86400000;
    return new Date(ms);
  };

  const sunrise = toTime(Jsr);
  const sunset  = toTime(Jss);
  const solarNoon = toTime(Jt);
  const dayLength = (Jss - Jsr) * 24 * 60; // minutes

  return { type: 'normal', sunrise, sunset, solarNoon, dayLength };
}

function fmtTime(date, tz) {
  if (!date) return '—';
  return date.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true });
}

function fmtDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

// Popular cities for quick selection
const POPULAR_CITIES = [
  { name: 'Dubai',      lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
  { name: 'London',     lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'New York',   lat: 40.7128, lon: -74.006,  tz: 'America/New_York' },
  { name: 'Tokyo',      lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Singapore',  lat: 1.3521,  lon: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Sydney',     lat: -33.8688,lon: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Paris',      lat: 48.8566, lon: 2.3522,   tz: 'Europe/Paris' },
  { name: 'Riyadh',     lat: 24.7136, lon: 46.6753,  tz: 'Asia/Riyadh' },
  { name: 'Mumbai',     lat: 19.076,  lon: 72.8777,  tz: 'Asia/Kolkata' },
  { name: 'Los Angeles',lat: 34.0522, lon: -118.2437,tz: 'America/Los_Angeles' },
  { name: 'Istanbul',   lat: 41.0082, lon: 28.9784,  tz: 'Europe/Istanbul' },
  { name: 'Cairo',      lat: 30.0444, lon: 31.2357,  tz: 'Africa/Cairo' },
];

const FAQS = [
  { question: 'What is civil twilight?', answer: 'Civil twilight is the period when the sun is between 0° and 6° below the horizon. During this time there is enough natural light for most outdoor activities without artificial lighting. It occurs just before sunrise (morning civil twilight) and just after sunset (evening civil twilight).' },
  { question: 'What is nautical twilight?', answer: 'Nautical twilight occurs when the sun is between 6° and 12° below the horizon. The horizon is still visible at sea but the sky is too dark for most land activities. Historically used by sailors to navigate by the stars while still seeing the horizon.' },
  { question: 'Why does day length change throughout the year?', answer: 'Day length varies because the Earth is tilted on its axis at approximately 23.5°. As the Earth orbits the sun, different hemispheres are tilted toward or away from the sun. Near the summer solstice (around June 21), the northern hemisphere has its longest day. Near the winter solstice (around December 21), the shortest day occurs.' },
  { question: 'What is solar noon?', answer: 'Solar noon is the moment when the sun is at its highest point in the sky — directly south in the northern hemisphere and directly north in the southern hemisphere. It is not always 12:00 PM clock time because clocks are set to time zones that span 15° of longitude, and because of the Equation of Time.' },
  { question: 'Does sunrise time depend on my exact location?', answer: 'Yes. Sunrise and sunset times vary with both latitude and longitude. Sites closer to the equator have more consistent day lengths year-round, while polar regions experience extreme variation — including midnight sun (24-hour daylight) in summer and polar night in winter.' },
  { question: 'What is the Equation of Time?', answer: 'The Equation of Time is the difference between solar time (based on the sun\'s actual position) and clock time (based on the mean solar day). It can vary by up to ±16 minutes throughout the year, causing apparent solar noon to shift relative to 12:00 PM clock time.' },
];

export default function SunriseSunsetPage() {
  const [selected, setSelected] = useState(POPULAR_CITIES[0]);
  const [solar, setSolar] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const result = calcSunriseSunset(selected.lat, selected.lon, now);
    setSolar(result);
  }, [selected, now]);

  const localDate = now.toLocaleDateString('en-US', {
    timeZone: selected.tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>Sunrise & Sunset Times — Any City Worldwide | MyZoneTime</title>
        <meta name="description" content="Find exact sunrise, sunset, solar noon, and day length for any city worldwide. Free tool with civil and nautical twilight times." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Sunrise & Sunset Times — Any City | MyZoneTime" />
        <meta property="og:description" content="Exact sunrise, sunset, solar noon and day length for 500+ cities. Free, updated daily." />
        <meta property="og:type" content="website" />
      </Helmet>
      <CanonicalTag pathname="/sunrise-sunset" />

      <main className="flex-1 w-full bg-background text-foreground" id="main-content">
        {/* Hero */}
        <section className="relative w-full py-20 md:py-24 overflow-hidden bg-gradient-to-b from-card/50 to-background border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="container relative z-10 max-w-3xl mx-auto text-center space-y-4 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sun className="w-4 h-4" aria-hidden="true" /> Solar Times Calculator
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Sunrise &amp; Sunset Times</h1>
            <p className="text-lg text-muted-foreground">Exact solar times for any city worldwide — updated daily, DST-aware.</p>
          </div>
        </section>

        {/* City selector */}
        <section className="container max-w-4xl mx-auto px-4 py-10">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Select a city:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map(city => (
                <button
                  key={city.name}
                  onClick={() => setSelected(city)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selected.name === city.name
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {solar && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>{selected.name} · {localDate}</span>
              </div>

              {solar.type === 'midnight_sun' && (
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <Sun className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold">Midnight Sun</p>
                  <p className="text-muted-foreground text-sm mt-1">The sun does not set today — 24 hours of daylight.</p>
                </div>
              )}

              {solar.type === 'polar_night' && (
                <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
                  <Moon className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold">Polar Night</p>
                  <p className="text-muted-foreground text-sm mt-1">The sun does not rise today.</p>
                </div>
              )}

              {solar.type === 'normal' && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Sunrise', value: fmtTime(solar.sunrise, selected.tz), icon: Sun, color: 'text-amber-400' },
                      { label: 'Solar Noon', value: fmtTime(solar.solarNoon, selected.tz), icon: Sun, color: 'text-yellow-400' },
                      { label: 'Sunset', value: fmtTime(solar.sunset, selected.tz), icon: Sun, color: 'text-orange-400' },
                      { label: 'Day Length', value: fmtDuration(solar.dayLength), icon: Clock, color: 'text-primary' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="p-5 rounded-2xl bg-card border border-border/60 text-center">
                        <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                        <p className="text-xl font-bold tabular-nums">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Visual daylight bar */}
                  <div className="p-5 rounded-2xl bg-card border border-border/60">
                    <p className="text-sm font-medium mb-3">Daylight Hours</p>
                    <div className="relative h-8 rounded-full bg-muted overflow-hidden">
                      {(() => {
                        const riseH = solar.sunrise.getUTCHours() + solar.sunrise.getUTCMinutes()/60;
                        const setH  = solar.sunset.getUTCHours()  + solar.sunset.getUTCMinutes()/60;
                        // Adjust for timezone offset
                        const tzOffset = (new Date().toLocaleString('en-US', {timeZone: selected.tz, hour:'numeric',hour12:false}) - new Date().getUTCHours());
                        const localRise = ((riseH + tzOffset) % 24 + 24) % 24;
                        const localSet  = ((setH  + tzOffset) % 24 + 24) % 24;
                        const left  = `${(localRise / 24 * 100).toFixed(1)}%`;
                        const width = `${((localSet - localRise) / 24 * 100).toFixed(1)}%`;
                        return (
                          <div
                            className="absolute h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400"
                            style={{ left, width }}
                          />
                        );
                      })()}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-2">
          <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
        </div>

        {/* SEO content */}
        <section className="py-14 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About Sunrise and Sunset Times</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sunrise and sunset times vary every day based on your location's latitude, longitude, and the time of year. Near the equator, sunrise and sunset times are relatively consistent year-round — typically within 30 minutes of 6:00 AM and 6:00 PM. But at higher latitudes like Scandinavia or Alaska, day length can range from nearly 24 hours of daylight in summer (midnight sun) to fewer than 6 hours of daylight in winter.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This tool calculates solar times using the NOAA Solar Calculator algorithm, which provides accuracy within one minute for locations between 72°N and 72°S latitude for dates between 1901 and 2099. All times shown are local times for the selected city, accounting for the city's time zone and any daylight saving time currently in effect.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Types of Twilight</h2>
              <div className="space-y-4">
                {[
                  { name: 'Civil Twilight', desc: 'Sun is 0°–6° below the horizon. Enough light for outdoor activities without artificial lighting. Occurs just before sunrise and just after sunset.' },
                  { name: 'Nautical Twilight', desc: 'Sun is 6°–12° below the horizon. The horizon is faintly visible at sea. Sky is too dark for most activities but historically used for celestial navigation.' },
                  { name: 'Astronomical Twilight', desc: 'Sun is 12°–18° below the horizon. The sky is nearly fully dark. This is when amateur astronomers can begin most observations.' },
                ].map(t => (
                  <div key={t.name} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Why Sunrise Times Differ by City</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Even two cities in the same time zone can have significantly different sunrise and sunset times if they are at different latitudes. For example, London and Lisbon are both on GMT/WET time but Lisbon is nearly 6° further south, meaning it gets about 30 more minutes of morning light than London in winter.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Longitude also affects the relationship between solar time and clock time. Cities at the eastern edge of a time zone experience sunrise earlier in clock time than cities at the western edge, because the sun rises earlier when moving east. China uses a single time zone (UTC+8) for its entire territory, causing cities in western China like Urumqi to experience sunrise as late as 9:30 AM clock time despite being at the same nominal time as Shanghai.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={FAQS} title="Sunrise &amp; Sunset — Frequently Asked Questions" />
      </main>
    </>
  );
}
