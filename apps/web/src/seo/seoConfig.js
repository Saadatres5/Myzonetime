/**
 * MyZoneTime — SEO Configuration
 * Unique title, description, canonical, and structured data for every route.
 *
 * Changes vs previous version:
 *  1. Added keyword-rich trending queries from GSC data (meeting planner variants,
 *     city time queries, unix time, hijri, time calculator, etc.)
 *  2. Updated Hijri calendar title to 2026-2027
 *  3. Added missing static pages that are getting impressions:
 *     /beijing, /unix-time, /timezone/est, /timezone/cet, /timezone/gst,
 *     /timezone/sgt, /timezone/gmt, /timezone/aest, /prayer-times,
 *     /sunrise-sunset, /lisbon, /kuwait-city, /los-angeles, /istanbul, /bangkok
 *  4. Enhanced /meeting-planner with all high-impression keyword variants
 *  5. Added dynamic SEO for /time-difference/:pair with better city name formatting
 *  6. Fixed www/http indexing: sitemap uses canonical https non-www only
 */

export const SEO = {

  // ─── HOME ──────────────────────────────────────────────────────────────────
  '/': {
    title: 'World Clock & Time Zone Converter — Free | MyZoneTime',
    description:
      'Free world clock, time zone converter, meeting planner, and time difference calculator for 500+ cities worldwide. Check current time anywhere, schedule across time zones. No signup.',
    keywords:
      'world clock, time zone converter, meeting planner, time difference calculator, current time, schedule meetings across time zones, global clock, live city time',
    canonical: 'https://myzonetime.com/',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'MyZoneTime',
      url: 'https://myzonetime.com/',
      description:
        'Free world clock and time zone tools — converter, meeting planner, Hijri calendar, unix time, and more.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://myzonetime.com/world-clock?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  },

  // ─── TOOLS ─────────────────────────────────────────────────────────────────
  '/world-clock': {
    title: 'World Clock — Live Time in 500+ Cities | MyZoneTime',
    description:
      'Compare time zones instantly with a live world clock for 500+ cities. Search any city, see UTC offsets, DST status, and schedule global meetings. Free, no login required.',
    keywords:
      'world clock, live time, compare time zones, global clock, city time, world time zone, current time cities',
    canonical: 'https://myzonetime.com/world-clock',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'World Clock — MyZoneTime',
      url: 'https://myzonetime.com/world-clock',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Live world clock showing current time in 500+ cities with UTC offsets and DST.',
    },
  },

  '/timezone-converter': {
    title: 'Time Zone Converter — Convert Time Between Cities Free | MyZoneTime',
    description:
      'Convert time between any two cities or time zones instantly. Free DST-aware time zone converter for remote teams and international scheduling. Compare time zones and find overlapping hours.',
    keywords:
      'time zone converter, convert time, convert time zones, online time zone converter, DST-aware converter, compare time zones, city time conversion, world time converter',
    canonical: 'https://myzonetime.com/timezone-converter',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Time Zone Converter — MyZoneTime',
      url: 'https://myzonetime.com/timezone-converter',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free time zone converter for any two cities, DST-aware and always accurate.',
      featureList: ['DST-aware conversion', '500+ city database', 'UTC offset display'],
    },
  },

  '/meeting-planner': {
    title: 'Meeting Planner — Schedule Global Meetings Across Time Zones | MyZoneTime',
    description:
      'Free online meeting planner and scheduler for global teams. Find the best meeting time across multiple time zones, see business hours overlap, and share meeting links instantly. Used by remote and international teams worldwide.',
    keywords:
      'meeting planner, online meeting scheduler, international meeting planner, global meeting planner, schedule meetings across time zones, meeting time planner, world meeting planner, time zone meeting planner, meeting planner time zones, global meeting scheduler, conference planner, meeting coordinator, schedule meeting time zones, remote team scheduling, business hours overlap, world clock meeting planner, meeting planner worldwide, meeting time zone, meeting scheduler',
    canonical: 'https://myzonetime.com/meeting-planner',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Meeting Planner — MyZoneTime',
      url: 'https://myzonetime.com/meeting-planner',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Free meeting planner to find the best call time for distributed and remote teams across time zones.',
      featureList: [
        'Multi-timezone overlap finder',
        'Business hours highlighting',
        'Shareable meeting links',
        'International meeting scheduling',
        'Conference call planner',
      ],
    },
  },

  '/ai-meeting-planner': {
    title: 'AI Meeting Planner — Smart Scheduler for Global Teams | MyZoneTime',
    description:
      'AI-powered meeting planner that finds the best meeting time across time zones automatically. Smart global team scheduler with business hours detection. Free to use.',
    keywords:
      'AI meeting planner, smart meeting scheduler, automatic meeting planner, global team meeting, AI scheduler, best meeting time',
    canonical: 'https://myzonetime.com/ai-meeting-planner',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AI Meeting Planner — MyZoneTime',
      url: 'https://myzonetime.com/ai-meeting-planner',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'AI-powered meeting scheduler that finds optimal times for global teams.',
    },
  },

  '/time-difference-calculator': {
    title: 'Time Difference Calculator — Hours Between Any Two Cities | MyZoneTime',
    description:
      'Calculate the exact time difference between any two cities, countries, or time zones. Free DST-aware calculator — see hours ahead or behind for international scheduling and travel.',
    keywords:
      'time difference calculator, hours between cities, city time difference, time zone offset calculator, DST-aware time difference, time difference between, calculate time difference, time zone difference',
    canonical: 'https://myzonetime.com/time-difference-calculator',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Time Difference Calculator — MyZoneTime',
      url: 'https://myzonetime.com/time-difference-calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Find the exact hour difference between any two cities, DST-adjusted.',
    },
  },

  '/time-calculator': {
    title: 'Time Calculator — Add, Subtract & Calculate Hours & Minutes | MyZoneTime',
    description:
      'Free online time calculator to add or subtract hours and minutes. Calculate time between two times, total time from multiple entries, and add hours to a time. Fast and accurate.',
    keywords:
      'time calculator, add time, subtract time, time addition calculator, add hours and minutes, time calculator online, time between two times, add hours to time, total time calculator, time adder, calculate time, time calculator minutes',
    canonical: 'https://myzonetime.com/time-calculator',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Time Calculator — MyZoneTime',
      url: 'https://myzonetime.com/time-calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Add, subtract, and calculate hours, minutes, and seconds online for free.',
      featureList: ['Add time', 'Subtract time', 'Time between two times', 'Multiple time addition'],
    },
  },

  '/unix-time': {
    title: 'Unix Time — Current Epoch Timestamp Converter | MyZoneTime',
    description:
      'View the current Unix (epoch) timestamp in seconds and milliseconds. Convert Unix time to human-readable date and time. Free online Unix timestamp converter and epoch clock.',
    keywords:
      'unix time, unix timestamp, epoch time, unix epoch, current epoch, epoch timestamp, unix time converter, unix time now, posix time, epoch unix timestamp, unix time seconds, unix time milliseconds',
    canonical: 'https://myzonetime.com/unix-time',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Unix Timestamp Converter — MyZoneTime',
      url: 'https://myzonetime.com/unix-time',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Live Unix epoch timestamp with conversion to and from human-readable date/time.',
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Unix time?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Unix time (also called epoch time or POSIX time) is the number of seconds elapsed since January 1, 1970 at 00:00:00 UTC. It is used widely in computing for timestamps.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the current Unix timestamp?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The current Unix timestamp changes every second. You can see the live value at myzonetime.com/unix-time.',
            },
          },
        ],
      },
    },
  },

  '/hijri-calendar': {
    title: 'Hijri Calendar 2026–2027 — Islamic Date & Converter | MyZoneTime',
    description:
      'View the Hijri (Islamic) calendar for 1447–1448 AH / 2026–2027. Convert between Hijri and Gregorian dates. Includes Islamic holidays, today\'s Hijri date, and prayer month schedules.',
    keywords:
      'hijri calendar, hijri date today, islamic calendar, islamic date today, hijri to gregorian, today hijri date, current hijri date, hijri calendar today, islamic date now, arabic date today',
    canonical: 'https://myzonetime.com/hijri-calendar',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Hijri Calendar — MyZoneTime',
      url: 'https://myzonetime.com/hijri-calendar',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Free Hijri / Islamic calendar for 2026–2027 with Gregorian date converter and Islamic holiday dates.',
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is today\'s Hijri date?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can check today\'s exact Hijri date at myzonetime.com/hijri-calendar. The Islamic calendar is a lunar calendar with 12 months, approximately 11 days shorter than the Gregorian year.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I convert a Gregorian date to Hijri?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Use the Hijri date converter at myzonetime.com/hijri-calendar. Enter any Gregorian date and instantly see the corresponding Islamic calendar date.',
            },
          },
        ],
      },
    },
  },

  '/prayer-times': {
    title: 'Prayer Times Today — Fajr, Dhuhr, Asr, Maghrib, Isha | MyZoneTime',
    description:
      'Accurate daily prayer times for your location — Fajr, Dhuhr, Asr, Maghrib, and Isha. Free Islamic prayer timetable based on your city and calculation method.',
    keywords:
      'prayer times, prayer times today, dhuhr prayer time today, asr prayer time today, fajr time, namaz time, salah time, islamic prayer schedule, zohor time',
    canonical: 'https://myzonetime.com/prayer-times',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Prayer Times — MyZoneTime',
      url: 'https://myzonetime.com/prayer-times',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Accurate daily Islamic prayer times for any city worldwide.',
    },
  },

  '/sunrise-sunset': {
    title: 'Sunrise & Sunset Times Today at My Location | MyZoneTime',
    description:
      'Check today\'s sunrise and sunset times for your location or any city worldwide. Free solar schedule with golden hour, civil twilight, and day length information.',
    keywords:
      'sunrise sunset, sunrise time today, sunset time today, sunrise today at my location, sun schedule, golden hour, day length, solar times',
    canonical: 'https://myzonetime.com/sunrise-sunset',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Sunrise & Sunset — MyZoneTime',
      url: 'https://myzonetime.com/sunrise-sunset',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Today\'s sunrise, sunset, and golden hour times for any location worldwide.',
    },
  },

  '/stopwatch': {
    title: 'Online Stopwatch with Lap Timer — Free | MyZoneTime',
    description:
      'Free online stopwatch with lap recording, accurate to milliseconds. Works in any browser with no download. Perfect for sports, cooking, study sessions, and timed tasks.',
    canonical: 'https://myzonetime.com/stopwatch',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Online Stopwatch — MyZoneTime',
      url: 'https://myzonetime.com/stopwatch',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Browser-based stopwatch with lap timer, accurate to milliseconds.',
    },
  },

  '/timer': {
    title: 'Online Countdown Timer — Free Browser Timer with Sound | MyZoneTime',
    description:
      'Set a free online countdown timer for any duration with sound alerts. No app download needed — works in any browser. Perfect for cooking, workouts, pomodoro, and meetings.',
    canonical: 'https://myzonetime.com/timer',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Countdown Timer — MyZoneTime',
      url: 'https://myzonetime.com/timer',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free online countdown timer with browser-based sound alerts.',
    },
  },

  '/countdown': {
    title: 'Event Countdown Timer — Days Until Your Date | MyZoneTime',
    description:
      'Count down the days, hours, and minutes to any event or date. Free event countdown clock for birthdays, holidays, product launches, and deadlines.',
    canonical: 'https://myzonetime.com/countdown',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Event Countdown — MyZoneTime',
      url: 'https://myzonetime.com/countdown',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free event countdown clock showing days, hours, and minutes to any date.',
    },
  },

  '/date-calculator': {
    title: 'Date Calculator — Days Between Dates | MyZoneTime',
    description:
      'Calculate the number of days, weeks, or months between any two dates. Free date difference calculator — add or subtract days from any date instantly.',
    canonical: 'https://myzonetime.com/date-calculator',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Date Calculator — MyZoneTime',
      url: 'https://myzonetime.com/date-calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Calculate days between dates or add/subtract days from a starting date.',
    },
  },

  '/work-hours-calculator': {
    title: 'Work Hours Calculator — Timesheet & Hours Tracker | MyZoneTime',
    description:
      'Calculate total work hours, overtime, and breaks from your timesheet. Free work hours calculator for employees and freelancers. Supports multiple shifts and weekly totals.',
    keywords:
      'work hours calculator, timesheet calculator, working hours calculator, work time calculator, hour calculator, how many hours am i working, weekly hours calculator',
    canonical: 'https://myzonetime.com/work-hours-calculator',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Work Hours Calculator — MyZoneTime',
      url: 'https://myzonetime.com/work-hours-calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free timesheet calculator for total work hours, overtime, and break deductions.',
      featureList: ['Multi-shift support', 'Break deduction', 'Overtime calculation', 'Weekly total'],
    },
  },

  '/windows-time-settings': {
    title: 'How to Change Time & Date in Windows 10 & 11 | MyZoneTime',
    description:
      'Step-by-step guide to change time, date, and time zone settings in Windows 10 and Windows 11. Fix wrong clock, sync with internet time, and change time format.',
    keywords:
      'windows time settings, how to change time on windows, change windows time, windows time format, change time format windows 10, windows change clock, sync windows time',
    canonical: 'https://myzonetime.com/windows-time-settings',
    ogType: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Change Time and Date in Windows 10 & 11',
      url: 'https://myzonetime.com/windows-time-settings',
      description: 'Step-by-step guide for changing time, date, and time zone in Windows.',
    },
  },

  // ─── TIMEZONE PAGES ────────────────────────────────────────────────────────
  '/timezone/est': {
    title: 'EST Time Zone — Eastern Standard Time (UTC−5) | MyZoneTime',
    description:
      'Eastern Standard Time (EST) is UTC−5. Used by New York, Toronto, Miami, and most of the US East Coast in winter. See current EST time, countries, and DST schedule.',
    keywords:
      'EST time zone, eastern standard time, EST UTC-5, eastern time new york, time zone EST, what is EST, EST time now, eastern time zone',
    canonical: 'https://myzonetime.com/timezone/est',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'EST — Eastern Standard Time Zone',
      url: 'https://myzonetime.com/timezone/est',
      description: 'Complete guide to EST (Eastern Standard Time, UTC−5) — cities, DST, and current time.',
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is EST time zone?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'EST (Eastern Standard Time) is UTC−5, used in winter by the US East Coast including New York, Miami, Boston, and Toronto. During summer, the region switches to EDT (UTC−4).',
            },
          },
          {
            '@type': 'Question',
            name: 'Is New York in EST?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. New York uses EST (UTC−5) from November to March, and EDT (UTC−4) from March to November when daylight saving time is in effect.',
            },
          },
        ],
      },
    },
  },

  '/timezone/cet': {
    title: 'CET Time Zone — Central European Time (UTC+1) | MyZoneTime',
    description:
      'Central European Time (CET) is UTC+1. Used by France, Germany, Italy, Spain, Norway, and most of Europe in winter. See current CET time, CET countries, and CEST summer schedule.',
    keywords:
      'CET time zone, central european time, CET UTC+1, CET countries, what is CET, CET time now, CET timezone, central europe time zone, time zones CET',
    canonical: 'https://myzonetime.com/timezone/cet',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'CET — Central European Time Zone',
      url: 'https://myzonetime.com/timezone/cet',
      description: 'Guide to CET (Central European Time, UTC+1) — countries, cities, and DST transition.',
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What countries are in CET?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'CET is used by most of Europe in winter, including France, Germany, Italy, Spain, Netherlands, Belgium, Austria, Switzerland, Poland, Norway, Sweden, Denmark, and others.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is CET in UTC?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'CET (Central European Time) is UTC+1. During summer, Central European countries switch to CEST (Central European Summer Time) at UTC+2.',
            },
          },
        ],
      },
    },
  },

  '/timezone/gst': {
    title: 'GST Time Zone — Gulf Standard Time (UTC+4) | MyZoneTime',
    description:
      'Gulf Standard Time (GST) is UTC+4. Used year-round by the UAE (Dubai, Abu Dhabi), Oman, and other Gulf countries. No daylight saving time. See current GST time.',
    keywords:
      'GST time zone, Gulf Standard Time, GST UTC+4, Dubai time zone, UAE time zone, Gulf time, GST time now, GST timing',
    canonical: 'https://myzonetime.com/timezone/gst',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'GST — Gulf Standard Time Zone',
      url: 'https://myzonetime.com/timezone/gst',
      description: 'Guide to GST (Gulf Standard Time, UTC+4) — UAE, Oman, and Gulf region time zone.',
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is GST time zone?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'GST (Gulf Standard Time) is UTC+4. It is used year-round in the UAE (Dubai, Abu Dhabi), Oman, and other Gulf countries. Gulf countries do not observe daylight saving time.',
            },
          },
        ],
      },
    },
  },

  '/timezone/sgt': {
    title: 'SGT Time Zone — Singapore Standard Time (UTC+8) | MyZoneTime',
    description:
      'Singapore Standard Time (SGT) is UTC+8. Used year-round in Singapore and Brunei. No daylight saving time. See current SGT time and convert SGT to UTC or any other time zone.',
    keywords:
      'SGT time zone, Singapore Standard Time, SGT UTC+8, SGT to UTC, UTC to SGT, sgt timezone, Singapore time zone',
    canonical: 'https://myzonetime.com/timezone/sgt',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'SGT — Singapore Standard Time Zone',
      url: 'https://myzonetime.com/timezone/sgt',
      description: 'Guide to SGT (Singapore Standard Time, UTC+8) including conversions to UTC and other zones.',
    },
  },

  '/timezone/gmt': {
    title: 'GMT Time Zone — Greenwich Mean Time (UTC+0) | MyZoneTime',
    description:
      'Greenwich Mean Time (GMT) is UTC+0 — the world\'s time reference. Used by UK in winter, Ireland, Iceland, Ghana, and more. See current GMT time and how it compares globally.',
    keywords:
      'GMT time zone, Greenwich Mean Time, GMT UTC+0, GMT time now, gmt time london, what is GMT, london time GMT, UK time GMT',
    canonical: 'https://myzonetime.com/timezone/gmt',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'GMT — Greenwich Mean Time Zone',
      url: 'https://myzonetime.com/timezone/gmt',
      description: 'Complete guide to GMT (Greenwich Mean Time, UTC+0) — the world\'s primary time reference.',
    },
  },

  '/timezone/aest': {
    title: 'AEST Time Zone — Australian Eastern Standard Time (UTC+10) | MyZoneTime',
    description:
      'Australian Eastern Standard Time (AEST) is UTC+10. Used by Sydney, Melbourne, Brisbane in winter. During summer, NSW and Victoria switch to AEDT (UTC+11). See current AEST time.',
    keywords:
      'AEST time zone, Australian Eastern Standard Time, AEST UTC+10, Sydney time zone, Australia east time, AEDT',
    canonical: 'https://myzonetime.com/timezone/aest',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'AEST — Australian Eastern Standard Time Zone',
      url: 'https://myzonetime.com/timezone/aest',
      description: 'Guide to AEST (Australian Eastern Standard Time, UTC+10) and AEDT (UTC+11).',
    },
  },

  // ─── CITY PAGES ────────────────────────────────────────────────────────────
  '/dubai': {
    title: 'Current Time in Dubai — UAE (UTC+4, GST) | MyZoneTime',
    description:
      'Live current time in Dubai, United Arab Emirates. Dubai uses Gulf Standard Time (GST, UTC+4) year-round with no daylight saving time. Convert Dubai time to any world city.',
    keywords:
      'current time in dubai, dubai time, dubai time zone, dubai gmt, what time is it in dubai, dubai utc+4, dubai GST',
    canonical: 'https://myzonetime.com/dubai',
    ogType: 'website',
    cityData: {
      city: 'Dubai',
      country: 'United Arab Emirates',
      timezone: 'Asia/Dubai',
      utcOffset: '+4:00',
      dst: false,
      currency: 'AED',
      callingCode: '+971',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Dubai, UAE',
      url: 'https://myzonetime.com/dubai',
      description: 'Live clock and time zone information for Dubai, UAE (GST, UTC+4).',
      about: { '@type': 'City', name: 'Dubai', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is Dubai in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Dubai is in Gulf Standard Time (GST, UTC+4). Dubai does not observe daylight saving time, so the offset stays at UTC+4 all year.' },
          },
          {
            '@type': 'Question',
            name: 'What is the time difference between Dubai and London?',
            acceptedAnswer: { '@type': 'Answer', text: 'Dubai (UTC+4) is typically 4 hours ahead of London (UTC+0). During British Summer Time (late March–late October), the difference reduces to 3 hours.' },
          },
          {
            '@type': 'Question',
            name: 'Does Dubai observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Dubai and the UAE do not observe daylight saving time. Clocks remain at UTC+4 throughout the year.' },
          },
        ],
      },
    },
  },

  '/london': {
    title: 'Current Time in London — England (GMT/BST) | MyZoneTime',
    description:
      'Live current time in London, England. London uses GMT (UTC+0) in winter and BST (UTC+1) in summer. Includes time zone info, DST dates, and free London time converter.',
    keywords:
      'current time in london, london time, london time zone, london GMT, london BST, what time is it in london, british time',
    canonical: 'https://myzonetime.com/london',
    ogType: 'website',
    cityData: { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', utcOffset: '+0:00 / +1:00 BST', dst: true, dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October', currency: 'GBP', callingCode: '+44' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in London, England',
      url: 'https://myzonetime.com/london',
      description: 'Live clock and time zone info for London, UK (GMT/BST).',
      about: { '@type': 'City', name: 'London', containedInPlace: { '@type': 'Country', name: 'United Kingdom' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is London in?',
            acceptedAnswer: { '@type': 'Answer', text: 'London is in GMT (UTC+0) in winter and BST (UTC+1, British Summer Time) in summer, from the last Sunday in March to the last Sunday in October.' },
          },
          {
            '@type': 'Question',
            name: 'Is London GMT?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, London is the home of Greenwich Mean Time (GMT, UTC+0) in winter. During summer (BST), London is at UTC+1.' },
          },
        ],
      },
    },
  },

  '/new-york': {
    title: 'Current Time in New York — EST/EDT (UTC−5/−4) | MyZoneTime',
    description:
      'Live current time in New York City, USA. New York is in the Eastern Time Zone — EST (UTC−5) in winter and EDT (UTC−4) in summer. Free New York time converter.',
    keywords:
      'current time in new york, new york time, new york time zone, eastern time new york, EST new york, EDT new york, what time is it in new york, new york eastern time',
    canonical: 'https://myzonetime.com/new-york',
    ogType: 'website',
    cityData: { city: 'New York', country: 'United States', timezone: 'America/New_York', utcOffset: '−5:00 / −4:00 EDT', dst: true, dstStart: 'Second Sunday in March', dstEnd: 'First Sunday in November', currency: 'USD', callingCode: '+1' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in New York, USA',
      url: 'https://myzonetime.com/new-york',
      description: 'Live clock and time zone info for New York City (EST/EDT).',
      about: { '@type': 'City', name: 'New York', containedInPlace: { '@type': 'Country', name: 'United States' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is New York in?',
            acceptedAnswer: { '@type': 'Answer', text: 'New York is in the Eastern Time Zone — EST (UTC−5) from November to March, and EDT (UTC−4) from March to November.' },
          },
          {
            '@type': 'Question',
            name: 'What is Eastern Time in New York?',
            acceptedAnswer: { '@type': 'Answer', text: 'Eastern Time refers to either EST (Eastern Standard Time, UTC−5) in winter or EDT (Eastern Daylight Time, UTC−4) in summer.' },
          },
        ],
      },
    },
  },

  '/tokyo': {
    title: 'Current Time in Tokyo — Japan (JST, UTC+9) | MyZoneTime',
    description:
      'Live current time in Tokyo, Japan. Tokyo uses Japan Standard Time (JST, UTC+9) year-round with no daylight saving time. Convert Tokyo time to any city.',
    keywords: 'current time in tokyo, tokyo time, japan time, JST, japan standard time, what time is it in tokyo',
    canonical: 'https://myzonetime.com/tokyo',
    ogType: 'website',
    cityData: { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', utcOffset: '+9:00', dst: false, currency: 'JPY', callingCode: '+81' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Tokyo, Japan',
      url: 'https://myzonetime.com/tokyo',
      description: 'Live clock and time zone info for Tokyo, Japan (JST, UTC+9).',
      about: { '@type': 'City', name: 'Tokyo', containedInPlace: { '@type': 'Country', name: 'Japan' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Tokyo in?', acceptedAnswer: { '@type': 'Answer', text: 'Tokyo is in JST (Japan Standard Time, UTC+9). Japan does not observe daylight saving time.' } },
          { '@type': 'Question', name: 'What is the time difference between Tokyo and New York?', acceptedAnswer: { '@type': 'Answer', text: 'Tokyo (UTC+9) is 14 hours ahead of New York (UTC−5) in winter and 13 hours ahead during EDT (UTC−4).' } },
        ],
      },
    },
  },

  '/singapore': {
    title: 'Current Time in Singapore — SGT (UTC+8) | MyZoneTime',
    description:
      'Live current time in Singapore. Singapore uses SGT (UTC+8) all year with no daylight saving time. Free Singapore time converter and time zone information.',
    keywords: 'current time in singapore, singapore time, SGT, singapore standard time, singapore time zone UTC+8',
    canonical: 'https://myzonetime.com/singapore',
    ogType: 'website',
    cityData: { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', utcOffset: '+8:00', dst: false, currency: 'SGD', callingCode: '+65' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Singapore',
      url: 'https://myzonetime.com/singapore',
      description: 'Live clock and time zone info for Singapore (SGT, UTC+8).',
      about: { '@type': 'City', name: 'Singapore', containedInPlace: { '@type': 'Country', name: 'Singapore' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is Singapore time (SGT) in UTC?', acceptedAnswer: { '@type': 'Answer', text: 'SGT (Singapore Standard Time) is UTC+8. Singapore does not observe daylight saving time.' } },
        ],
      },
    },
  },

  '/sydney': {
    title: 'Current Time in Sydney — AEDT/AEST (UTC+11/+10) | MyZoneTime',
    description:
      'Live current time in Sydney, Australia. Sydney uses AEST (UTC+10) in winter and AEDT (UTC+11) during daylight saving time. Free Sydney time converter.',
    canonical: 'https://myzonetime.com/sydney',
    ogType: 'website',
    cityData: { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', utcOffset: '+10:00 / +11:00 AEDT', dst: true, dstStart: 'First Sunday in October', dstEnd: 'First Sunday in April', currency: 'AUD', callingCode: '+61' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Sydney, Australia',
      url: 'https://myzonetime.com/sydney',
      description: 'Live clock and time zone info for Sydney (AEST/AEDT, UTC+10/+11).',
      about: { '@type': 'City', name: 'Sydney', containedInPlace: { '@type': 'Country', name: 'Australia' } },
    },
  },

  '/riyadh': {
    title: 'Current Time in Riyadh — Saudi Arabia (AST, UTC+3) | MyZoneTime',
    description:
      'Live current time in Riyadh, Saudi Arabia. Riyadh uses Arabia Standard Time (AST, UTC+3) year-round with no daylight saving time. Convert Riyadh time to any world city.',
    keywords:
      'current time in riyadh, riyadh time, riyadh time now, saudi arabia time, riyadh time zone, what time is it in riyadh, time in riyadh saudi arabia, KSA time',
    canonical: 'https://myzonetime.com/riyadh',
    ogType: 'website',
    cityData: { city: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', utcOffset: '+3:00', dst: false, currency: 'SAR', callingCode: '+966' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Riyadh, Saudi Arabia',
      url: 'https://myzonetime.com/riyadh',
      description: 'Live clock and time zone info for Riyadh, Saudi Arabia (AST, UTC+3).',
      about: { '@type': 'City', name: 'Riyadh', containedInPlace: { '@type': 'Country', name: 'Saudi Arabia' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Riyadh in?', acceptedAnswer: { '@type': 'Answer', text: 'Riyadh uses Arabia Standard Time (AST, UTC+3). Saudi Arabia does not observe daylight saving time.' } },
          { '@type': 'Question', name: 'What time is it now in Riyadh?', acceptedAnswer: { '@type': 'Answer', text: 'You can see the live current time in Riyadh at myzonetime.com/riyadh. Riyadh is always UTC+3 year-round.' } },
        ],
      },
    },
  },

  '/abu-dhabi': {
    title: 'Current Time in Abu Dhabi — UAE Capital (UTC+4, GST) | MyZoneTime',
    description:
      'Live current time in Abu Dhabi, capital of the UAE. Abu Dhabi uses Gulf Standard Time (GST, UTC+4) year-round with no daylight saving time. Free time converter.',
    keywords:
      'current time in abu dhabi, abu dhabi time, abu dhabi time zone, time in abu dhabi, what time is it in abu dhabi, abu dhabi UAE time, abu dhabi now',
    canonical: 'https://myzonetime.com/abu-dhabi',
    ogType: 'website',
    cityData: { city: 'Abu Dhabi', country: 'United Arab Emirates', timezone: 'Asia/Dubai', utcOffset: '+4:00', dst: false, currency: 'AED', callingCode: '+971' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Abu Dhabi, UAE',
      url: 'https://myzonetime.com/abu-dhabi',
      description: 'Live clock and time zone info for Abu Dhabi, UAE capital (GST, UTC+4).',
      about: { '@type': 'City', name: 'Abu Dhabi', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Abu Dhabi in?', acceptedAnswer: { '@type': 'Answer', text: 'Abu Dhabi is in Gulf Standard Time (GST, UTC+4), the same as Dubai. The UAE does not observe daylight saving time.' } },
        ],
      },
    },
  },

  '/beijing': {
    title: 'Current Time in Beijing — China Standard Time (CST, UTC+8) | MyZoneTime',
    description:
      'Live current time in Beijing, China. Beijing uses China Standard Time (CST, UTC+8) year-round with no daylight saving time. Convert Beijing time to any world city.',
    keywords:
      'current time in beijing, beijing time, beijing time now, china time, china standard time, CST UTC+8, what time is it in beijing, time in china beijing, beijing local time',
    canonical: 'https://myzonetime.com/beijing',
    ogType: 'website',
    cityData: { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', utcOffset: '+8:00', dst: false, currency: 'CNY', callingCode: '+86' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Beijing, China',
      url: 'https://myzonetime.com/beijing',
      description: 'Live clock and time zone info for Beijing, China (CST, UTC+8).',
      about: { '@type': 'City', name: 'Beijing', containedInPlace: { '@type': 'Country', name: 'China' } },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Beijing in?', acceptedAnswer: { '@type': 'Answer', text: 'Beijing uses China Standard Time (CST, UTC+8). China does not observe daylight saving time.' } },
          { '@type': 'Question', name: 'What is the current time in Beijing China?', acceptedAnswer: { '@type': 'Answer', text: 'You can see the live current time in Beijing at myzonetime.com/beijing. Beijing is always UTC+8.' } },
        ],
      },
    },
  },

  '/istanbul': {
    title: 'Current Time in Istanbul — Turkey (TRT, UTC+3) | MyZoneTime',
    description:
      'Live current time in Istanbul, Turkey. Istanbul uses Turkey Time (TRT, UTC+3) year-round since Turkey abolished daylight saving in 2016. Free Istanbul time converter.',
    keywords:
      'current time in istanbul, istanbul time, turkey time, TRT UTC+3, what time is it in istanbul, istanbul time zone',
    canonical: 'https://myzonetime.com/istanbul',
    ogType: 'website',
    cityData: { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', utcOffset: '+3:00', dst: false, currency: 'TRY', callingCode: '+90' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Istanbul, Turkey',
      url: 'https://myzonetime.com/istanbul',
      description: 'Live clock and time zone info for Istanbul, Turkey (TRT, UTC+3).',
      about: { '@type': 'City', name: 'Istanbul', containedInPlace: { '@type': 'Country', name: 'Turkey' } },
    },
  },

  '/bangkok': {
    title: 'Current Time in Bangkok — Thailand (ICT, UTC+7) | MyZoneTime',
    description:
      'Live current time in Bangkok, Thailand. Bangkok uses Indochina Time (ICT, UTC+7) year-round with no daylight saving time. Free Bangkok time converter.',
    keywords:
      'current time in bangkok, bangkok time, thailand time, ICT UTC+7, indochina time, what time is it in bangkok, bangkok time zone',
    canonical: 'https://myzonetime.com/bangkok',
    ogType: 'website',
    cityData: { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', utcOffset: '+7:00', dst: false, currency: 'THB', callingCode: '+66' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Bangkok, Thailand',
      url: 'https://myzonetime.com/bangkok',
      description: 'Live clock and time zone info for Bangkok, Thailand (ICT, UTC+7).',
      about: { '@type': 'City', name: 'Bangkok', containedInPlace: { '@type': 'Country', name: 'Thailand' } },
    },
  },

  '/lisbon': {
    title: 'Current Time in Lisbon — Portugal (WET/WEST) | MyZoneTime',
    description:
      'Live current time in Lisbon, Portugal. Lisbon uses WET (UTC+0) in winter and WEST (UTC+1) in summer. Convert Lisbon time and check the Portugal time zone.',
    keywords:
      'current time in lisbon, lisbon time, portugal time zone, lisbon time zone, WET WEST portugal, what time is it in lisbon',
    canonical: 'https://myzonetime.com/lisbon',
    ogType: 'website',
    cityData: { city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', utcOffset: '+0:00 / +1:00 WEST', dst: true, currency: 'EUR', callingCode: '+351' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Lisbon, Portugal',
      url: 'https://myzonetime.com/lisbon',
      description: 'Live clock and time zone info for Lisbon, Portugal (WET/WEST).',
      about: { '@type': 'City', name: 'Lisbon', containedInPlace: { '@type': 'Country', name: 'Portugal' } },
    },
  },

  '/kuwait-city': {
    title: 'Current Time in Kuwait City — Kuwait (AST, UTC+3) | MyZoneTime',
    description:
      'Live current time in Kuwait City, Kuwait. Kuwait uses Arabia Standard Time (AST, UTC+3) year-round with no daylight saving time. Free Kuwait time converter.',
    keywords:
      'current time in kuwait, kuwait city time, kuwait time zone, AST kuwait, what time is it in kuwait city',
    canonical: 'https://myzonetime.com/kuwait-city',
    ogType: 'website',
    cityData: { city: 'Kuwait City', country: 'Kuwait', timezone: 'Asia/Kuwait', utcOffset: '+3:00', dst: false, currency: 'KWD', callingCode: '+965' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Kuwait City, Kuwait',
      url: 'https://myzonetime.com/kuwait-city',
      description: 'Live clock and time zone info for Kuwait City, Kuwait (AST, UTC+3).',
      about: { '@type': 'City', name: 'Kuwait City', containedInPlace: { '@type': 'Country', name: 'Kuwait' } },
    },
  },

  '/los-angeles': {
    title: 'Current Time in Los Angeles — PST/PDT (UTC−8/−7) | MyZoneTime',
    description:
      'Live current time in Los Angeles, California. LA uses Pacific Standard Time (PST, UTC−8) in winter and Pacific Daylight Time (PDT, UTC−7) in summer. Free LA time converter.',
    keywords:
      'current time in los angeles, los angeles time, LA time, pacific time, PST PDT, what time is it in los angeles, california time',
    canonical: 'https://myzonetime.com/los-angeles',
    ogType: 'website',
    cityData: { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', utcOffset: '−8:00 / −7:00 PDT', dst: true, currency: 'USD', callingCode: '+1' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Los Angeles, USA',
      url: 'https://myzonetime.com/los-angeles',
      description: 'Live clock and time zone info for Los Angeles, California (PST/PDT).',
      about: { '@type': 'City', name: 'Los Angeles', containedInPlace: { '@type': 'Country', name: 'United States' } },
    },
  },

};

// ─── DYNAMIC SEO HELPERS ─────────────────────────────────────────────────────

function toTitleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Known city name overrides for clean display
const CITY_NAME_MAP = {
  'abu-dhabi': 'Abu Dhabi',
  'new-york': 'New York',
  'los-angeles': 'Los Angeles',
  'kuala-lumpur': 'Kuala Lumpur',
  'hong-kong': 'Hong Kong',
  'saudi-arabia': 'Saudi Arabia',
  'united-arab-emirates': 'United Arab Emirates',
  'south-africa': 'South Africa',
  'new-zealand': 'New Zealand',
  'costa-rica': 'Costa Rica',
  'buenos-aires': 'Buenos Aires',
  'mexico-city': 'Mexico City',
  'sao-paulo': 'São Paulo',
};

function formatCitySlug(slug) {
  return CITY_NAME_MAP[slug] || toTitleCase(slug);
}

function getDynamicSEO(pathname) {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // /time-difference/:pair — e.g. /time-difference/dubai-and-london
  if (cleanPath.startsWith('/time-difference/')) {
    const tail = cleanPath.replace('/time-difference/', '');
    const parts = tail.split('-and-');
    if (parts.length === 2) {
      const city1 = formatCitySlug(parts[0]);
      const city2 = formatCitySlug(parts[1]);
      return {
        title: `Time Difference: ${city1} and ${city2} — Live Clocks | MyZoneTime`,
        description: `See the current time difference between ${city1} and ${city2}. Live local clocks, best meeting windows, UTC offsets, and DST-aware conversion.`,
        keywords: `time difference ${city1} ${city2}, ${city1} ${city2} time difference, ${city1.toLowerCase()} and ${city2.toLowerCase()} time`,
        canonical: `https://myzonetime.com/time-difference/${parts[0]}-and-${parts[1]}`,
        ogType: 'website',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `Time Difference: ${city1} and ${city2}`,
          url: `https://myzonetime.com/time-difference/${parts[0]}-and-${parts[1]}`,
          description: `Current time difference between ${city1} and ${city2} with live clocks and meeting overlap.`,
          mainEntity: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `What is the time difference between ${city1} and ${city2}?`,
                acceptedAnswer: { '@type': 'Answer', text: `Check the live time difference between ${city1} and ${city2} at myzonetime.com/time-difference/${parts[0]}-and-${parts[1]}. The difference changes when either city observes daylight saving time.` },
              },
            ],
          },
        },
      };
    }
    // Legacy slug without "-and-" (e.g. /time-difference/istanbul-dubai)
    const dashIdx = tail.indexOf('-', tail.indexOf('-') + 1);
    if (dashIdx > 0) {
      return {
        title: `Time Difference: ${toTitleCase(tail)} | MyZoneTime`,
        description: `See the live time difference for ${toTitleCase(tail)}. Live clocks, UTC offsets, and meeting overlap finder.`,
        canonical: `https://myzonetime.com/time-difference/${tail}`,
        ogType: 'website',
      };
    }
  }

  // /timezone/:tz dynamic pages
  if (cleanPath.startsWith('/timezone/') && !SEO[cleanPath]) {
    const tzSlug = cleanPath.replace('/timezone/', '');
    const prettyName = tzSlug.toUpperCase();
    return {
      title: `${prettyName} Time Zone — UTC Offset, Countries & Current Time | MyZoneTime`,
      description: `Learn about the ${prettyName} time zone. See current ${prettyName} time, UTC offset, countries that use ${prettyName}, and daylight saving rules.`,
      keywords: `${prettyName} time zone, ${prettyName} time, ${prettyName} UTC offset, ${tzSlug} timezone`,
      canonical: `https://myzonetime.com/timezone/${tzSlug}`,
      ogType: 'website',
    };
  }

  // Dynamic city pages (/:citySlug)
  if (/^\/[a-z0-9-]+$/.test(cleanPath)) {
    const citySlug = cleanPath.slice(1);
    const cityName = formatCitySlug(citySlug);
    return {
      title: `Current Time in ${cityName} — Local Clock & Time Zone | MyZoneTime`,
      description: `Check the current local time in ${cityName}. Live city clock, time zone details, UTC offset, and DST-aware time conversion for international scheduling.`,
      keywords: `current time in ${cityName.toLowerCase()}, ${cityName.toLowerCase()} time, ${cityName.toLowerCase()} time zone, what time is it in ${cityName.toLowerCase()}`,
      canonical: `https://myzonetime.com${cleanPath}`,
      ogType: 'website',
    };
  }

  return null;
}

export function getSEO(pathname) {
  const config = SEO[pathname];
  return config || getDynamicSEO(pathname) || SEO['/'];
}

export function getStructuredDataScript(pathname) {
  const config = getSEO(pathname);
  if (!config?.structuredData) return '';
  return `<script type="application/ld+json">${JSON.stringify(config.structuredData, null, 2)}</script>`;
}
