/**
 * MyZoneTime — SEO Configuration
 * Unique title, description, canonical, and structured data for every route.
 * Import this in your router / meta-injection logic.
 *
 * Fix addressed:
 *  1. Every page now has a UNIQUE title tag (no duplicates).
 *  2. Every description is keyword-rich and distinct.
 *  3. Structured data (JSON-LD) added per page for rich results.
 */

export const SEO = {

  // ─── HOME ──────────────────────────────────────────────────────────────────
  '/': {
    title: 'World Clock & Time Zone Converter — Free | MyZoneTime',
    description:
      'Free world clock showing live time in 500+ cities. Time zone converter, meeting planner, Hijri calendar, and work hours calculator. No signup needed. Trusted by global teams.',
    canonical: 'https://myzonetime.com/',
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'MyZoneTime',
      url: 'https://myzonetime.com/',
      description:
        'Free world clock and time zone tools for global teams — converter, meeting planner, Hijri calendar, and more.',
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
      'Check the current local time in over 500 cities around the world. Live, auto-updating world clock with city search, UTC offsets, and DST indicators.',
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
      'Convert time between any two cities or time zones instantly. Free time zone converter with DST-aware calculations. No account required.',
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
    title: 'Meeting Planner — Best Time for Global Team Calls | MyZoneTime',
    description:
      'Find the perfect meeting time across multiple time zones. Free online meeting planner for remote teams — see overlapping business hours across cities at a glance.',
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
      ],
    },
  },

  '/time-difference-calculator': {
    title: 'Time Difference Calculator — Hours Between Cities | MyZoneTime',
    description:
      'Calculate the exact time difference between any two cities or countries. Get the hour offset instantly, including DST adjustments. Free and no sign-up needed.',
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

  '/hijri-calendar': {
    title: 'Hijri Calendar 2025–2026 — Islamic Date Converter | MyZoneTime',
    description:
      'View the Hijri (Islamic) calendar for 2025 and 2026. Convert between Hijri and Gregorian dates instantly. Includes Islamic holidays and prayer month schedules.',
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
        'Free Hijri / Islamic calendar for 2025–2026 with Gregorian date converter and Islamic holiday dates.',
    },
  },

  '/stopwatch': {
    title: 'Online Stopwatch with Lap Timer — Free | MyZoneTime',
    description:
      'Free online stopwatch with lap recording. Accurate to milliseconds. Works in any browser, no download needed. Perfect for sports, cooking, and study sessions.',
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
    title: 'Online Countdown Timer — Free Browser Timer | MyZoneTime',
    description:
      'Set a free online countdown timer for any duration. Works in any browser with sound alerts. No app download needed — perfect for cooking, workouts, and meetings.',
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
    title: 'Work Hours Calculator — Timesheet & Payroll Tool | MyZoneTime',
    description:
      'Calculate total work hours, overtime, and breaks from your timesheet. Free work hours calculator for employees and freelancers. Supports multiple shifts.',
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
      featureList: [
        'Multi-shift support',
        'Break deduction',
        'Overtime calculation',
        'Weekly total',
      ],
    },
  },

  // ─── CITY PAGES ────────────────────────────────────────────────────────────
  '/dubai': {
    title: 'Dubai Time Now — Current UAE Time in Dubai (UTC+4) | MyZoneTime',
    description:
      'Dubai time now — live UAE time, time dubai, and current time in Dubai. Dubai uses Gulf Standard Time (UTC+4) with no daylight saving. Convert Dubai time to any world city.',
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
      name: 'Dubai Time Now — Current UAE Time',
      url: 'https://myzonetime.com/dubai',
      description: 'Live Dubai time now and UAE time in Dubai. Accurate current time in Dubai with Gulf Standard Time (UTC+4).',
      about: {
        '@type': 'City',
        name: 'Dubai',
        containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is Dubai in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Dubai is in the Gulf Standard Time (GST) zone, which is UTC+4. Dubai does not observe daylight saving time.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Dubai observe daylight saving time?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Dubai and the rest of the UAE do not observe daylight saving time. The clocks in Dubai remain at UTC+4 all year round.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the time difference between Dubai and London?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Dubai (UTC+4) is typically 4 hours ahead of London (UTC+0/+1). During British Summer Time (late March–late October), the difference reduces to 3 hours.',
            },
          },
        ],
      },
    },
  },

  '/london': {
    title: 'Current Time in London — England (GMT/BST) | MyZoneTime',
    description:
      'Live current time in London, England. London uses GMT (UTC+0) in winter and BST (UTC+1) in summer. Convert London time to any city with our free time zone converter.',
    canonical: 'https://myzonetime.com/london',
    ogType: 'website',
    cityData: {
      city: 'London',
      country: 'United Kingdom',
      timezone: 'Europe/London',
      utcOffset: '+0:00 / +1:00 BST',
      dst: true,
      dstStart: 'Last Sunday in March',
      dstEnd: 'Last Sunday in October',
      currency: 'GBP',
      callingCode: '+44',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in London, England',
      url: 'https://myzonetime.com/london',
      description: 'Live clock and time zone information for London, UK (GMT/BST).',
      about: {
        '@type': 'City',
        name: 'London',
        containedInPlace: { '@type': 'Country', name: 'United Kingdom' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is London in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'London is in the Greenwich Mean Time (GMT, UTC+0) zone in winter and British Summer Time (BST, UTC+1) in summer.',
            },
          },
          {
            '@type': 'Question',
            name: 'When does London change its clocks?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'London clocks go forward one hour on the last Sunday in March (to BST, UTC+1), and back on the last Sunday in October (back to GMT, UTC+0).',
            },
          },
        ],
      },
    },
  },

  '/new-york': {
    title: 'Current Time in New York — EST/EDT (UTC−5/−4) | MyZoneTime',
    description:
      'Live current time in New York City, USA. New York uses Eastern Standard Time (EST, UTC−5) in winter and Eastern Daylight Time (EDT, UTC−4) in summer.',
    canonical: 'https://myzonetime.com/new-york',
    ogType: 'website',
    cityData: {
      city: 'New York',
      country: 'United States',
      timezone: 'America/New_York',
      utcOffset: '−5:00 / −4:00 EDT',
      dst: true,
      dstStart: 'Second Sunday in March',
      dstEnd: 'First Sunday in November',
      currency: 'USD',
      callingCode: '+1',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in New York, USA',
      url: 'https://myzonetime.com/new-york',
      description: 'Live clock and time zone info for New York City (EST/EDT).',
      about: {
        '@type': 'City',
        name: 'New York',
        containedInPlace: { '@type': 'Country', name: 'United States' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is New York in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'New York is in the Eastern Time Zone — EST (UTC−5) in winter and EDT (UTC−4) during daylight saving time.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the time difference between New York and London?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'New York is typically 5 hours behind London in winter (EST vs GMT) and 4 hours behind in spring/summer when both cities observe daylight saving time.',
            },
          },
        ],
      },
    },
  },

  '/tokyo': {
    title: 'Current Time in Tokyo — Japan (JST, UTC+9) | MyZoneTime',
    description:
      'Live current time in Tokyo, Japan. Tokyo uses Japan Standard Time (JST, UTC+9) year-round and does not observe daylight saving time. Convert Tokyo time to any city.',
    canonical: 'https://myzonetime.com/tokyo',
    ogType: 'website',
    cityData: {
      city: 'Tokyo',
      country: 'Japan',
      timezone: 'Asia/Tokyo',
      utcOffset: '+9:00',
      dst: false,
      currency: 'JPY',
      callingCode: '+81',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Tokyo, Japan',
      url: 'https://myzonetime.com/tokyo',
      description: 'Live clock and time zone information for Tokyo, Japan (JST, UTC+9).',
      about: {
        '@type': 'City',
        name: 'Tokyo',
        containedInPlace: { '@type': 'Country', name: 'Japan' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is Tokyo in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tokyo is in the Japan Standard Time (JST) zone, which is UTC+9. Japan does not observe daylight saving time.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the time difference between Tokyo and New York?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tokyo (UTC+9) is 14 hours ahead of New York (UTC−5) in winter, and 13 hours ahead when New York observes EDT (UTC−4).',
            },
          },
        ],
      },
    },
  },

  '/singapore': {
    title: 'Current Time in Singapore — SGT (UTC+8) | MyZoneTime',
    description:
      'Live current time in Singapore. Singapore uses Singapore Standard Time (SGT, UTC+8) all year and does not observe daylight saving time. Convert Singapore time freely.',
    canonical: 'https://myzonetime.com/singapore',
    ogType: 'website',
    cityData: {
      city: 'Singapore',
      country: 'Singapore',
      timezone: 'Asia/Singapore',
      utcOffset: '+8:00',
      dst: false,
      currency: 'SGD',
      callingCode: '+65',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Singapore',
      url: 'https://myzonetime.com/singapore',
      description: 'Live clock and time zone info for Singapore (SGT, UTC+8).',
      about: {
        '@type': 'City',
        name: 'Singapore',
        containedInPlace: { '@type': 'Country', name: 'Singapore' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is Singapore in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Singapore uses Singapore Standard Time (SGT), which is UTC+8. Singapore does not observe daylight saving time, so the offset is constant year-round.',
            },
          },
        ],
      },
    },
  },

  '/sydney': {
    title: 'Current Time in Sydney — AEDT/AEST (UTC+11/+10) | MyZoneTime',
    description:
      'Live current time in Sydney, Australia. Sydney uses AEST (UTC+10) in winter and AEDT (UTC+11) in summer (daylight saving). Convert Sydney time to any world city.',
    canonical: 'https://myzonetime.com/sydney',
    ogType: 'website',
    cityData: {
      city: 'Sydney',
      country: 'Australia',
      timezone: 'Australia/Sydney',
      utcOffset: '+10:00 / +11:00 AEDT',
      dst: true,
      dstStart: 'First Sunday in October',
      dstEnd: 'First Sunday in April',
      currency: 'AUD',
      callingCode: '+61',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Sydney, Australia',
      url: 'https://myzonetime.com/sydney',
      description: 'Live clock and time zone info for Sydney (AEST/AEDT, UTC+10/+11).',
      about: {
        '@type': 'City',
        name: 'Sydney',
        containedInPlace: { '@type': 'Country', name: 'Australia' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Does Sydney observe daylight saving time?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes. Sydney (New South Wales) observes daylight saving time from the first Sunday in October to the first Sunday in April — the opposite of the Northern Hemisphere's schedule.",
            },
          },
        ],
      },
    },
  },

  '/riyadh': {
    title: 'Current Time in Riyadh — Saudi Arabia (AST, UTC+3) | MyZoneTime',
    description:
      'Live current time in Riyadh, Saudi Arabia. Riyadh uses Arabia Standard Time (AST, UTC+3) and does not observe daylight saving time. Convert Riyadh time to any city.',
    canonical: 'https://myzonetime.com/riyadh',
    ogType: 'website',
    cityData: {
      city: 'Riyadh',
      country: 'Saudi Arabia',
      timezone: 'Asia/Riyadh',
      utcOffset: '+3:00',
      dst: false,
      currency: 'SAR',
      callingCode: '+966',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Current Time in Riyadh, Saudi Arabia',
      url: 'https://myzonetime.com/riyadh',
      description: 'Live clock and time zone info for Riyadh, Saudi Arabia (AST, UTC+3).',
      about: {
        '@type': 'City',
        name: 'Riyadh',
        containedInPlace: { '@type': 'Country', name: 'Saudi Arabia' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What time zone is Riyadh in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Riyadh uses Arabia Standard Time (AST), which is UTC+3. Saudi Arabia does not observe daylight saving time.',
            },
          },
        ],
      },
    },
  },

  '/abu-dhabi': {
    title: 'Current Time in Abu Dhabi — UAE Capital (UTC+4) | MyZoneTime',
    description:
      'Live current time in Abu Dhabi, capital of the United Arab Emirates. Abu Dhabi uses Gulf Standard Time (GST, UTC+4) and does not observe daylight saving time.',
    canonical: 'https://myzonetime.com/abu-dhabi',
    ogType: 'website',
    cityData: {
      city: 'Abu Dhabi',
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
      name: 'Current Time in Abu Dhabi, UAE',
      url: 'https://myzonetime.com/abu-dhabi',
      description:
        'Live clock and time zone info for Abu Dhabi, UAE capital (Gulf Standard Time, UTC+4).',
      about: {
        '@type': 'City',
        name: 'Abu Dhabi',
        containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' },
      },
      mainEntity: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the time zone in Abu Dhabi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Abu Dhabi is in the Gulf Standard Time (GST) zone at UTC+4, the same as Dubai. The UAE does not observe daylight saving time.',
            },
          },
        ],
      },
    },
  },
};

/**
 * Helper: get SEO config for a given pathname.
 * Falls back to home config if route is not found.
 */
function formatSlugToWords(slug) {
  return slug
    .replace(/\//g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function getDynamicSEO(pathname) {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  if (cleanPath.startsWith('/time-difference/')) {
    const tail = cleanPath.replace('/time-difference/', '');
    const parts = tail.split('-and-');
    if (parts.length === 2) {
      const city1 = formatSlugToWords(parts[0]);
      const city2 = formatSlugToWords(parts[1]);
      return {
        title: `Time Difference: ${city1} vs ${city2} — Live Clock & Meeting Planner | MyZoneTime`,
        description: `Calculate the current time difference between ${city1} and ${city2}. See live local times, best meeting windows, and DST-aware conversion tips.`,
        canonical: `https://myzonetime.com/time-difference/${parts[0]}-and-${parts[1]}`,
        ogType: 'website',
      };
    }
  }

  if (cleanPath.startsWith('/timezone/') && !SEO[cleanPath]) {
    const tzSlug = cleanPath.replace('/timezone/', '');
    const prettyName = formatSlugToWords(tzSlug);
    return {
      title: `${prettyName} — Time Zone Info & Current UTC Offset | MyZoneTime`,
      description: `Learn the current UTC offset for ${prettyName}. Explore countries, cities, daylight saving rules, and time conversion examples for this time zone.`,
      canonical: `https://myzonetime.com/timezone/${tzSlug}`,
      ogType: 'website',
    };
  }

  if (/^\/[a-z0-9-]+$/.test(cleanPath)) {
    const cityName = formatSlugToWords(cleanPath.slice(1));
    return {
      title: `Current Time in ${cityName} — ${cityName} Local Clock | MyZoneTime`,
      description: `Check the current local time in ${cityName}. Live city clock, time zone details, and DST-aware conversion for international scheduling.`,
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

/**
 * Helper: render JSON-LD structured data script tag string.
 */
export function getStructuredDataScript(pathname) {
  const config = getSEO(pathname);
  if (!config.structuredData) return '';
  return `<script type="application/ld+json">${JSON.stringify(config.structuredData, null, 2)}</script>`;
}
