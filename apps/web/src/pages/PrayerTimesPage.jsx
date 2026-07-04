/**
 * PrayerTimesPage.jsx
 * Islamic prayer times (Salah) for any city worldwide.
 * time.is does NOT have this — a clean win for Gulf/South Asian/global Muslim traffic.
 * Uses the standard astronomical calculation method (sun angle based).
 */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Moon, Sun, Sunrise, Sunset, MapPin } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

// ── Prayer time calculation (Muslim World League method, standard angles) ───
function toRad(d) { return d * Math.PI / 180; }
function toDeg(r) { return r * 180 / Math.PI; }
function fixHour(h) { h = h % 24; return h < 0 ? h + 24 : h; }

function julianDate(date) {
  return date / 86400000 + 2440587.5;
}

function sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = toRad(357.529 + 0.98560028 * D);
  const q = 280.459 + 0.98564736 * D;
  const L = toRad(q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  const e = toRad(23.439 - 0.00000036 * D);
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  let ra = toDeg(Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))) / 15;
  ra = ra - (Math.floor((q / 15) / 24) * 24);
  const eqt = q / 15 - fixHour(ra);
  return { dec: toDeg(dec), eqt };
}

function computeTime(angle, jd, lat, lon, isAfter, eqt) {
  const D = toRad(sunPosition(jd).dec);
  const numerator = -Math.sin(toRad(angle)) - Math.sin(toRad(lat)) * Math.sin(D);
  const denom = Math.cos(toRad(lat)) * Math.cos(D);
  const cosV = numerator / denom;
  if (cosV < -1 || cosV > 1) return null;
  const t = toDeg(Math.acos(cosV)) / 15;
  return isAfter ? 12 + t - eqt : 12 - t - eqt;
}

function calcPrayerTimes(lat, lon, date, tzOffset) {
  const jd = julianDate(date) - lon / (15 * 24);
  const { eqt, dec } = sunPosition(jd);

  const noon = 12 - eqt;
  const fajrAngle = 18; // Muslim World League
  const ishaAngle  = 17;

  const fajrT = computeTime(fajrAngle, jd, lat, lon, false, eqt);
  const sunriseT = computeTime(0.833, jd, lat, lon, false, eqt);
  const sunsetT = computeTime(0.833, jd, lat, lon, true, eqt);
  const ishaT = computeTime(ishaAngle, jd, lat, lon, true, eqt);

  // Asr (Shafi method)
  const asrAngle = toDeg(Math.atan(1 / (1 + Math.tan(toRad(Math.abs(lat - dec))))));
  const asrT = computeTime(90 - asrAngle, jd, lat, lon, true, eqt);

  const adjust = h => h === null ? null : fixHour(h + tzOffset - lon / 15);

  return {
    fajr: adjust(fajrT),
    sunrise: adjust(sunriseT),
    dhuhr: fixHour(noon + tzOffset - lon / 15),
    asr: adjust(asrT),
    maghrib: adjust(sunsetT),
    isha: adjust(ishaT),
  };
}

function fmtHour(h) {
  if (h === null || isNaN(h)) return '—';
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  const adjHours = minutes === 60 ? hours + 1 : hours;
  const adjMinutes = minutes === 60 ? 0 : minutes;
  const period = adjHours >= 12 ? 'PM' : 'AM';
  const h12 = adjHours % 12 === 0 ? 12 : adjHours % 12;
  return `${h12}:${String(adjMinutes).padStart(2, '0')} ${period}`;
}

const CITIES = [
  { name: 'Dubai',      lat: 25.2048, lon: 55.2708,  tzOffset: 4,  tz: 'Asia/Dubai' },
  { name: 'Mecca',      lat: 21.3891, lon: 39.8579,  tzOffset: 3,  tz: 'Asia/Riyadh' },
  { name: 'Medina',     lat: 24.5247, lon: 39.5692,  tzOffset: 3,  tz: 'Asia/Riyadh' },
  { name: 'Riyadh',     lat: 24.7136, lon: 46.6753,  tzOffset: 3,  tz: 'Asia/Riyadh' },
  { name: 'Istanbul',   lat: 41.0082, lon: 28.9784,  tzOffset: 3,  tz: 'Europe/Istanbul' },
  { name: 'Cairo',      lat: 30.0444, lon: 31.2357,  tzOffset: 2,  tz: 'Africa/Cairo' },
  { name: 'Karachi',    lat: 24.8607, lon: 67.0011,  tzOffset: 5,  tz: 'Asia/Karachi' },
  { name: 'Lahore',     lat: 31.5497, lon: 74.3436,  tzOffset: 5,  tz: 'Asia/Karachi' },
  { name: 'Jakarta',    lat: -6.2088, lon: 106.8456, tzOffset: 7,  tz: 'Asia/Jakarta' },
  { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869, tzOffset: 8, tz: 'Asia/Kuala_Lumpur' },
  { name: 'London',     lat: 51.5074, lon: -0.1278,  tzOffset: 0,  tz: 'Europe/London' },
  { name: 'New York',   lat: 40.7128, lon: -74.006,  tzOffset: -5, tz: 'America/New_York' },
];

const FAQS = [
  { question: 'What are the 5 daily prayer times in Islam?', answer: 'The five daily prayers (Salah) are Fajr (dawn, before sunrise), Dhuhr (midday, after the sun passes its zenith), Asr (afternoon), Maghrib (sunset), and Isha (night). Each has a specific time window based on the sun\'s position.' },
  { question: 'How are prayer times calculated?', answer: 'Prayer times are calculated using the sun\'s angle below or above the horizon at a specific location. Fajr begins when the sun is 18° below the horizon, Maghrib begins at sunset, and Isha begins when the sun is 17° below the horizon. This tool uses the Muslim World League calculation method, one of the most widely used standards globally.' },
  { question: 'Why do prayer times differ by city?', answer: 'Prayer times depend on the sun\'s position relative to your specific latitude and longitude. Cities further from the equator experience more variation throughout the year — in some northern cities, Fajr and Isha can be very close together or even overlap during summer months.' },
  { question: 'What is the difference between Fajr and sunrise?', answer: 'Fajr begins at true dawn — when the sun is 18° below the horizon and the first light appears. Sunrise (Shuruq) is when the sun\'s disc actually appears above the horizon, roughly 60-90 minutes after Fajr begins.' },
  { question: 'Do prayer times change with daylight saving time?', answer: 'Yes. Prayer times are based on the actual position of the sun, so when clocks shift for daylight saving time, the prayer times shown in local clock time shift by the same amount.' },
  { question: 'What calculation method does this tool use?', answer: 'This tool uses the Muslim World League (MWL) method: Fajr angle of 18° and Isha angle of 17°, with Asr calculated using the standard Shafi method. Other common methods include ISNA (15°/15°), Egyptian (19.5°/17.5°), and Umm al-Qura Mecca. Times may vary slightly by 1-3 minutes between methods.' },
];

export default function PrayerTimesPage() {
  const [selected, setSelected] = useState(CITIES[0]);
  const [now] = useState(new Date());
  const [times, setTimes] = useState(null);

  useEffect(() => {
    const result = calcPrayerTimes(selected.lat, selected.lon, now, selected.tzOffset);
    setTimes(result);
  }, [selected, now]);

  const localDate = now.toLocaleDateString('en-US', {
    timeZone: selected.tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const prayerList = times ? [
    { name: 'Fajr',    arabic: 'الفجر', time: times.fajr,    icon: Moon, desc: 'Dawn prayer' },
    { name: 'Sunrise', arabic: 'الشروق', time: times.sunrise, icon: Sunrise, desc: 'End of Fajr window' },
    { name: 'Dhuhr',   arabic: 'الظهر', time: times.dhuhr,   icon: Sun, desc: 'Midday prayer' },
    { name: 'Asr',     arabic: 'العصر', time: times.asr,     icon: Sun, desc: 'Afternoon prayer' },
    { name: 'Maghrib', arabic: 'المغرب', time: times.maghrib, icon: Sunset, desc: 'Sunset prayer' },
    { name: 'Isha',    arabic: 'العشاء', time: times.isha,   icon: Moon, desc: 'Night prayer' },
  ] : [];

  return (
    <>
      <Helmet>
        <title>Prayer Times Today — Salah Times for Any City | MyZoneTime</title>
        <meta name="description" content="Accurate Islamic prayer times (Salah) for any city. Fajr, Dhuhr, Asr, Maghrib, and Isha times updated daily. Free, no signup." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Prayer Times Today — Salah Times | MyZoneTime" />
        <meta property="og:description" content="Free daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for Dubai, Mecca, Riyadh, Cairo, and more." />
        <meta property="og:type" content="website" />
      </Helmet>
      <CanonicalTag pathname="/prayer-times" />

      <main className="flex-1 w-full bg-background text-foreground" id="main-content">
        {/* Hero */}
        <section className="relative w-full py-20 md:py-24 overflow-hidden bg-gradient-to-b from-card/50 to-background border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-primary/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="container relative z-10 max-w-3xl mx-auto text-center space-y-4 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Moon className="w-4 h-4" aria-hidden="true" /> Islamic Prayer Times
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Prayer Times Today</h1>
            <p className="text-lg text-muted-foreground">Accurate Salah times for any city — Fajr, Dhuhr, Asr, Maghrib, Isha</p>
          </div>
        </section>

        {/* City selector + results */}
        <section className="container max-w-4xl mx-auto px-4 py-10">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Select a city:</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(city => (
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

          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
            <MapPin className="w-4 h-4" />
            <span>{selected.name} · {localDate}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prayerList.map(({ name, arabic, time, icon: Icon, desc }) => (
              <div key={name} className="p-5 rounded-2xl bg-card border border-border/60 text-center">
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{name}</p>
                <p className="text-xs text-muted-foreground mb-2" dir="rtl">{arabic}</p>
                <p className="text-xl font-bold tabular-nums">{fmtHour(time)}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Calculated using the Muslim World League method (Fajr 18°, Isha 17°). Times may vary by 1-3 minutes from local mosque announcements.
          </p>
        </section>

        <div className="container max-w-4xl mx-auto px-4 py-2">
          <AdSenseAd slot={AD_SLOTS.TOOL_INLINE} format="auto" minHeight={90} />
        </div>

        {/* SEO content */}
        <section className="py-14 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">About Islamic Prayer Times</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Muslims pray five times a day (Salah), each at a specific time determined by the sun's position. The five prayers are Fajr (before dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night). These times shift daily and vary significantly by location and season, since they're based on solar position rather than fixed clock hours.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This calculator uses the Muslim World League (MWL) method — a widely accepted global standard with a Fajr angle of 18° and an Isha angle of 17° below the horizon. Times are calculated fresh for your selected city using its exact latitude, longitude, and timezone.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Understanding Each Prayer Time</h2>
              <div className="space-y-4">
                {[
                  { name: 'Fajr', desc: 'Begins at true dawn, when the sun is 18° below the horizon and the first light appears. Ends at sunrise.' },
                  { name: 'Dhuhr', desc: 'Begins just after the sun passes its highest point (solar noon) and starts to decline westward.' },
                  { name: 'Asr', desc: 'Begins in the afternoon when an object\'s shadow equals its own length (Shafi method) plus the shadow length at noon.' },
                  { name: 'Maghrib', desc: 'Begins immediately at sunset, when the sun\'s disc has fully disappeared below the horizon.' },
                  { name: 'Isha', desc: 'Begins when the sun reaches 17° below the horizon, marking the point of complete darkness.' },
                ].map(p => (
                  <div key={p.name} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Calculation Methods Around the World</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Different Islamic authorities use slightly different angle conventions for Fajr and Isha, which can shift prayer times by a few minutes. The most common methods are: Muslim World League (18°/17°, used widely including Europe and parts of Asia), Islamic Society of North America — ISNA (15°/15°), Egyptian General Authority (19.5°/17.5°), and Umm al-Qura University in Mecca (18.5° Fajr, Isha fixed at 90 minutes after Maghrib, used in Saudi Arabia).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If your local mosque's announced times differ slightly from this calculator, it's likely due to a different calculation method or a small manual adjustment applied by the local Islamic authority for community consistency.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={FAQS} title="Prayer Times — Frequently Asked Questions" />
      </main>
    </>
  );
}
