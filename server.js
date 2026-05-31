'use strict';

/**
 * server.js — MyZoneTime Express Server (FIXED)
 * Fixes applied:
 *   C-1  H1 injection placeholder now matches index.html
 *   C-2  Server-side JSON-LD injected for every route
 *   C-3  SearchAction uses correct ?search= parameter
 *   H-1  All 5 missing city routes + world-clock-widget added
 *   H-4  og:image standardised to og-image.jpg
 *   H-6  Dynamic /time-difference/:pair route with SSR meta
 *   M-1  Hijri calendar year computed dynamically
 *   M-5  /embed/* routes forced noindex
 */

const express     = require('express');
const path        = require('path');
const fs          = require('fs');
const compression = require('compression');
const helmet      = require('helmet');

const app     = express();
const PORT    = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const DIST    = path.join(__dirname, 'apps', 'web', 'dist');

// ─── Read index.html once at startup ──────────────────────────────────────
let indexTemplate = '';
try {
  indexTemplate = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  console.log('[server] index.html loaded from dist');
} catch (e) {
  console.error('[server] ERROR: apps/web/dist/index.html not found — run npm run build first');
}

// ─── Compute dynamic year for Hijri calendar title ────────────────────────
const CURRENT_YEAR = new Date().getFullYear();

// ─── SEO map: one entry per route ─────────────────────────────────────────
const SEO = {
  '/': {
    title:       'MyZoneTime – World Clock & Time Zone Converter',
    description: 'MyZoneTime: live world clock, time zone converter, meeting planner & Hijri calendar for 500+ cities. Free, accurate, no sign-up required.',
    h1:          'World Clock & Time Zone Converter',
    canonical:   'https://myzonetime.com/',
  },
  '/world-clock': {
    title:       'World Clock – Live Time in 500+ Cities | MyZoneTime',
    description: 'Check the current local time in 500+ cities worldwide with MyZoneTime\'s live world clock. Accurate, real-time and beautifully designed.',
    h1:          'World Clock – Live Time in 500+ Cities',
    canonical:   'https://myzonetime.com/world-clock',
  },
  '/timezone-converter': {
    title:       'Time Zone Converter – Convert Time Between Cities | MyZoneTime',
    description: 'Convert time between any two cities instantly. MyZoneTime\'s time zone converter handles daylight saving automatically for 500+ locations.',
    h1:          'Time Zone Converter',
    canonical:   'https://myzonetime.com/timezone-converter',
  },
  '/meeting-planner': {
    title:       'Meeting Planner – Best Time Across Time Zones | MyZoneTime',
    description: 'Find the best meeting time for remote teams across multiple time zones. Highlights overlap hours and business hours automatically.',
    h1:          'Meeting Planner – Find the Best Time Across Time Zones',
    canonical:   'https://myzonetime.com/meeting-planner',
  },
  '/time-difference-calculator': {
    title:       'Time Difference Calculator – Hours Between Cities | MyZoneTime',
    description: 'Calculate the exact time difference in hours between any two cities. Works across all time zones with automatic daylight saving adjustments.',
    h1:          'Time Difference Calculator',
    canonical:   'https://myzonetime.com/time-difference-calculator',
  },
  '/hijri-calendar': {
    title:       'Hijri Calendar ' + CURRENT_YEAR + '–' + (CURRENT_YEAR + 1) + ' — Islamic Date Converter | MyZoneTime',
    description: 'View today\'s Hijri (Islamic) date and convert between Gregorian and Hijri calendars. Accurate and updated daily.',
    h1:          'Hijri Calendar – Islamic Date & Converter',
    canonical:   'https://myzonetime.com/hijri-calendar',
  },
  '/stopwatch': {
    title:       'Online Stopwatch with Laps | MyZoneTime',
    description: 'Free online stopwatch with lap timer. Precision timing in your browser — no download needed. Great for workouts, cooking and productivity.',
    h1:          'Online Stopwatch with Laps',
    canonical:   'https://myzonetime.com/stopwatch',
  },
  '/timer': {
    title:       'Online Countdown Timer | MyZoneTime',
    description: 'Set a countdown timer in seconds, minutes, or hours. Free online timer that works in any browser with sound alerts when time is up.',
    h1:          'Online Countdown Timer',
    canonical:   'https://myzonetime.com/timer',
  },
  '/countdown': {
    title:       'Event Countdown – Days Until Your Event | MyZoneTime',
    description: 'Count down the days, hours and minutes to any event. Create a custom countdown for birthdays, holidays, launches, and more.',
    h1:          'Event Countdown Timer',
    canonical:   'https://myzonetime.com/countdown',
  },
  '/date-calculator': {
    title:       'Date Calculator – Days Between Dates | MyZoneTime',
    description: 'Calculate the number of days, weeks or months between two dates. Add or subtract days from any date — fast and free.',
    h1:          'Date Calculator – Days Between Dates',
    canonical:   'https://myzonetime.com/date-calculator',
  },
  '/work-hours-calculator': {
    title:       'Work Hours Calculator – Timesheet Tool | MyZoneTime',
    description: 'Calculate total work hours and overtime from your timesheet. Add multiple shifts, breaks and get instant totals. Free online timesheet tool.',
    h1:          'Work Hours Calculator',
    canonical:   'https://myzonetime.com/work-hours-calculator',
  },
  '/world-clock-widget': {
    title:       'Free Embeddable World Clock Widget — Copy HTML Code | MyZoneTime',
    description: 'Embed a free live world clock widget on your website. No account needed. Copy the iframe code and display real-time city clocks on any page.',
    h1:          'World Clock Widget – Free Embed Code',
    canonical:   'https://myzonetime.com/world-clock-widget',
  },

  // ── Tier-1 City pages ──
  '/dubai': {
    title:       'Dubai Time – Current Local Time in Dubai (GST, UTC+4) | MyZoneTime',
    description: 'What time is it in Dubai right now? Live Dubai clock showing Gulf Standard Time (GST, UTC+4). Dubai does not observe daylight saving. Updated in real time.',
    h1:          'Current Time in Dubai, UAE',
    canonical:   'https://myzonetime.com/dubai',
  },
  '/london': {
    title:       'London Time – Current Local Time in London (GMT/BST) | MyZoneTime',
    description: 'What time is it in London right now? Live London clock showing GMT (UTC+0) in winter and BST (UTC+1) in summer. Updated in real time.',
    h1:          'Current Time in London, UK',
    canonical:   'https://myzonetime.com/london',
  },
  '/new-york': {
    title:       'New York Time – Current Local Time in New York (EST/EDT) | MyZoneTime',
    description: 'What time is it in New York right now? Live New York clock showing Eastern Standard Time (EST, UTC-5) or EDT (UTC-4) in summer. Updated in real time.',
    h1:          'Current Time in New York, USA',
    canonical:   'https://myzonetime.com/new-york',
  },
  '/tokyo': {
    title:       'Tokyo Time – Current Local Time in Tokyo (JST, UTC+9) | MyZoneTime',
    description: 'What time is it in Tokyo right now? Live Tokyo clock showing Japan Standard Time (JST, UTC+9). Japan does not observe daylight saving. Updated in real time.',
    h1:          'Current Time in Tokyo, Japan',
    canonical:   'https://myzonetime.com/tokyo',
  },
  '/singapore': {
    title:       'Singapore Time – Current Local Time in Singapore (SGT, UTC+8) | MyZoneTime',
    description: 'What time is it in Singapore right now? Live Singapore clock showing Singapore Standard Time (SGT, UTC+8). No daylight saving. Updated in real time.',
    h1:          'Current Time in Singapore',
    canonical:   'https://myzonetime.com/singapore',
  },
  '/sydney': {
    title:       'Sydney Time – Current Local Time in Sydney (AEST/AEDT) | MyZoneTime',
    description: 'What time is it in Sydney right now? Live Sydney clock showing Australian Eastern Time (AEST, UTC+10 / AEDT, UTC+11 in summer). Updated in real time.',
    h1:          'Current Time in Sydney, Australia',
    canonical:   'https://myzonetime.com/sydney',
  },
  '/riyadh': {
    title:       'Riyadh Time – Current Local Time in Riyadh (AST, UTC+3) | MyZoneTime',
    description: 'What time is it in Riyadh right now? Live Riyadh clock showing Arabia Standard Time (AST, UTC+3). Saudi Arabia does not observe daylight saving. Updated in real time.',
    h1:          'Current Time in Riyadh, Saudi Arabia',
    canonical:   'https://myzonetime.com/riyadh',
  },
  '/abu-dhabi': {
    title:       'Abu Dhabi Time – Current Local Time in Abu Dhabi (GST, UTC+4) | MyZoneTime',
    description: 'What time is it in Abu Dhabi right now? Live Abu Dhabi clock showing Gulf Standard Time (GST, UTC+4). No daylight saving. Updated in real time.',
    h1:          'Current Time in Abu Dhabi, UAE',
    canonical:   'https://myzonetime.com/abu-dhabi',
  },

  // ── Tier-2 City pages (NEWLY ADDED — were missing) ──
  '/istanbul': {
    title:       'Istanbul Time – Current Local Time in Istanbul (TRT, UTC+3) | MyZoneTime',
    description: 'What time is it in Istanbul right now? Live Istanbul clock showing Turkey Time (TRT, UTC+3). Turkey has not observed daylight saving since 2016. Updated in real time.',
    h1:          'Current Time in Istanbul, Turkey',
    canonical:   'https://myzonetime.com/istanbul',
  },
  '/paris': {
    title:       'Paris Time – Current Local Time in Paris (CET/CEST) | MyZoneTime',
    description: 'What time is it in Paris right now? Live Paris clock showing CET (UTC+1) in winter and CEST (UTC+2) in summer. France observes daylight saving time. Updated in real time.',
    h1:          'Current Time in Paris, France',
    canonical:   'https://myzonetime.com/paris',
  },
  '/oslo': {
    title:       'Oslo Time – Current Local Time in Oslo (CET/CEST) | MyZoneTime',
    description: 'What time is it in Oslo right now? Live Oslo clock showing Central European Time (CET, UTC+1) in winter and CEST (UTC+2) in summer. Updated in real time.',
    h1:          'Current Time in Oslo, Norway',
    canonical:   'https://myzonetime.com/oslo',
  },
  '/bangkok': {
    title:       'Bangkok Time – Current Local Time in Bangkok (ICT, UTC+7) | MyZoneTime',
    description: 'What time is it in Bangkok right now? Live Bangkok clock showing Indochina Time (ICT, UTC+7). Thailand does not observe daylight saving. Updated in real time.',
    h1:          'Current Time in Bangkok, Thailand',
    canonical:   'https://myzonetime.com/bangkok',
  },
  '/kuala-lumpur': {
    title:       'Kuala Lumpur Time – Current Local Time in KL (MYT, UTC+8) | MyZoneTime',
    description: 'What time is it in Kuala Lumpur right now? Live KL clock showing Malaysia Time (MYT, UTC+8). Malaysia does not observe daylight saving. Updated in real time.',
    h1:          'Current Time in Kuala Lumpur, Malaysia',
    canonical:   'https://myzonetime.com/kuala-lumpur',
  },

  // ── Legal ──
  '/contact-us': {
    title:       'Contact Us — Queries & Suggestions | MyZoneTime',
    description: 'Have a question, suggestion or found a bug? Contact the MyZoneTime team. We read every message and reply within 48 hours.',
    h1:          'Contact Us',
    canonical:   'https://myzonetime.com/contact-us',
  },
  '/privacy-policy': {
    title:       'Privacy Policy | MyZoneTime',
    description: 'Read the MyZoneTime privacy policy. We explain what data we collect, how it is used, and your rights regarding your personal information.',
    h1:          'Privacy Policy',
    canonical:   'https://myzonetime.com/privacy-policy',
  },
  '/terms-of-service': {
    title:       'Terms of Service | MyZoneTime',
    description: 'Read the MyZoneTime terms of service. By using our site you agree to these terms governing your use of our world clock and time tools.',
    h1:          'Terms of Service',
    canonical:   'https://myzonetime.com/terms-of-service',
  },
};

const DEFAULT_SEO = SEO['/'];

// ─── Server-side JSON-LD schema map (C-2 fix) ─────────────────────────────
const SCHEMAS = {
  '/': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://myzonetime.com/#website',
        name: 'MyZoneTime',
        url: 'https://myzonetime.com/',
        description: 'Free world clock, time zone converter, meeting planner & Hijri calendar for 500+ cities.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://myzonetime.com/world-clock?search={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://myzonetime.com/#organization',
        name: 'MyZoneTime',
        url: 'https://myzonetime.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://myzonetime.com/og-image.jpg',
          width: 1200,
          height: 630
        }
      }
    ]
  }),
  '/dubai': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Dubai, UAE',
        url: 'https://myzonetime.com/dubai',
        about: { '@type': 'City', name: 'Dubai', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Dubai in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Dubai uses Gulf Standard Time (GST, UTC+4) year-round. It does not observe daylight saving time.' }},
          { '@type': 'Question', name: 'Does Dubai observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Dubai does not observe daylight saving time. It remains on Gulf Standard Time (GST, UTC+4) throughout the entire year.' }},
          { '@type': 'Question', name: 'What is the time difference between Dubai and London?',
            acceptedAnswer: { '@type': 'Answer', text: 'Dubai (GST, UTC+4) is 4 hours ahead of London (GMT, UTC+0) in winter, and 3 hours ahead when the UK observes BST (UTC+1) in summer.' }}
        ]
      }
    ]
  }),
  '/london': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in London, UK',
        url: 'https://myzonetime.com/london',
        about: { '@type': 'City', name: 'London', containedInPlace: { '@type': 'Country', name: 'United Kingdom' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is London in?',
            acceptedAnswer: { '@type': 'Answer', text: 'London uses Greenwich Mean Time (GMT, UTC+0) in winter and British Summer Time (BST, UTC+1) from the last Sunday in March to the last Sunday in October.' }},
          { '@type': 'Question', name: 'Does London observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. London observes British Summer Time (BST, UTC+1) from the last Sunday in March to the last Sunday in October each year, then reverts to GMT (UTC+0).' }}
        ]
      }
    ]
  }),
  '/new-york': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in New York, USA',
        url: 'https://myzonetime.com/new-york',
        about: { '@type': 'City', name: 'New York City', containedInPlace: { '@type': 'Country', name: 'United States' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is New York in?',
            acceptedAnswer: { '@type': 'Answer', text: 'New York is in the Eastern Time Zone. It uses Eastern Standard Time (EST, UTC-5) in winter and Eastern Daylight Time (EDT, UTC-4) in summer.' }},
          { '@type': 'Question', name: 'Does New York observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. New York observes daylight saving time, switching from EST (UTC-5) to EDT (UTC-4) on the second Sunday of March and back on the first Sunday of November.' }}
        ]
      }
    ]
  }),
  '/istanbul': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Istanbul, Turkey',
        url: 'https://myzonetime.com/istanbul',
        about: { '@type': 'City', name: 'Istanbul', containedInPlace: { '@type': 'Country', name: 'Turkey' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Istanbul in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Istanbul uses Turkey Time (TRT, UTC+3) year-round. Turkey abolished daylight saving time in 2016 and has remained on UTC+3 ever since.' }},
          { '@type': 'Question', name: 'Does Istanbul observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Turkey permanently abolished daylight saving time in September 2016. Istanbul stays on Turkey Time (TRT, UTC+3) throughout the entire year.' }}
        ]
      }
    ]
  }),
  '/paris': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Paris, France',
        url: 'https://myzonetime.com/paris',
        about: { '@type': 'City', name: 'Paris', containedInPlace: { '@type': 'Country', name: 'France' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Paris in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Paris uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) from the last Sunday in March to the last Sunday in October.' }},
          { '@type': 'Question', name: 'Does Paris observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Paris observes daylight saving time, using CEST (UTC+2) from the last Sunday in March to the last Sunday in October, then reverting to CET (UTC+1) in winter.' }}
        ]
      }
    ]
  }),
  '/bangkok': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Bangkok, Thailand',
        url: 'https://myzonetime.com/bangkok',
        about: { '@type': 'City', name: 'Bangkok', containedInPlace: { '@type': 'Country', name: 'Thailand' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Bangkok in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Bangkok uses Indochina Time (ICT, UTC+7) year-round. Thailand does not observe daylight saving time.' }},
          { '@type': 'Question', name: 'Does Bangkok observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Bangkok does not observe daylight saving time. Thailand stays on Indochina Time (ICT, UTC+7) throughout the entire year.' }}
        ]
      }
    ]
  }),
  '/kuala-lumpur': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Kuala Lumpur, Malaysia',
        url: 'https://myzonetime.com/kuala-lumpur',
        about: { '@type': 'City', name: 'Kuala Lumpur', containedInPlace: { '@type': 'Country', name: 'Malaysia' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Kuala Lumpur in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Kuala Lumpur uses Malaysia Time (MYT, UTC+8) year-round. Malaysia does not observe daylight saving time.' }},
          { '@type': 'Question', name: 'Does Kuala Lumpur observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Kuala Lumpur does not observe daylight saving time. Malaysia stays on Malaysia Time (MYT, UTC+8) throughout the entire year.' }}
        ]
      }
    ]
  }),
  '/world-clock': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'World Clock – MyZoneTime',
    url: 'https://myzonetime.com/world-clock',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Live world clock showing current time in 500+ cities with time zone information.'
  }),
  '/timezone-converter': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Time Zone Converter – MyZoneTime',
    url: 'https://myzonetime.com/timezone-converter',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Convert time between any two cities instantly with automatic DST handling.'
  }),
  '/meeting-planner': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Meeting Planner – MyZoneTime',
    url: 'https://myzonetime.com/meeting-planner',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Find the best meeting time across multiple time zones for remote teams.'
  }),
  '/abu-dhabi': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Abu Dhabi, UAE',
        url: 'https://myzonetime.com/abu-dhabi',
        about: { '@type': 'City', name: 'Abu Dhabi', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Abu Dhabi in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Abu Dhabi uses Gulf Standard Time (GST, UTC+4) year-round. The UAE does not observe daylight saving time.' }},
          { '@type': 'Question', name: 'Does Abu Dhabi observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Abu Dhabi does not observe daylight saving time. It stays on Gulf Standard Time (GST, UTC+4) throughout the entire year.' }}
        ]
      }
    ]
  }),
  '/oslo': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Oslo, Norway',
        url: 'https://myzonetime.com/oslo',
        about: { '@type': 'City', name: 'Oslo', containedInPlace: { '@type': 'Country', name: 'Norway' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Oslo in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Oslo uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' }},
          { '@type': 'Question', name: 'Does Oslo observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Oslo observes daylight saving time, switching to CEST (UTC+2) on the last Sunday in March and back to CET (UTC+1) on the last Sunday in October.' }}
        ]
      }
    ]
  }),
  '/riyadh': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Riyadh, Saudi Arabia',
        url: 'https://myzonetime.com/riyadh',
        about: { '@type': 'City', name: 'Riyadh', containedInPlace: { '@type': 'Country', name: 'Saudi Arabia' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Riyadh in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Riyadh uses Arabia Standard Time (AST, UTC+3) year-round. Saudi Arabia does not observe daylight saving time.' }},
          { '@type': 'Question', name: 'Does Riyadh observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Riyadh does not observe daylight saving time. Saudi Arabia remains on Arabia Standard Time (AST, UTC+3) throughout the entire year.' }}
        ]
      }
    ]
  }),
  '/singapore': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Singapore',
        url: 'https://myzonetime.com/singapore',
        about: { '@type': 'City', name: 'Singapore', containedInPlace: { '@type': 'Country', name: 'Singapore' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Singapore in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Singapore uses Singapore Standard Time (SGT, UTC+8) year-round. Singapore does not observe daylight saving time.' }},
          { '@type': 'Question', name: 'Does Singapore observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Singapore does not observe daylight saving time. It remains on Singapore Standard Time (SGT, UTC+8) throughout the entire year.' }}
        ]
      }
    ]
  }),
  '/sydney': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Sydney, Australia',
        url: 'https://myzonetime.com/sydney',
        about: { '@type': 'City', name: 'Sydney', containedInPlace: { '@type': 'Country', name: 'Australia' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Sydney in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Sydney uses Australian Eastern Standard Time (AEST, UTC+10) in winter and Australian Eastern Daylight Time (AEDT, UTC+11) in summer.' }},
          { '@type': 'Question', name: 'Does Sydney observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Sydney observes daylight saving time, switching to AEDT (UTC+11) on the first Sunday in October and back to AEST (UTC+10) on the first Sunday in April.' }}
        ]
      }
    ]
  }),
  '/tokyo': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Current Time in Tokyo, Japan',
        url: 'https://myzonetime.com/tokyo',
        about: { '@type': 'City', name: 'Tokyo', containedInPlace: { '@type': 'Country', name: 'Japan' } }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What time zone is Tokyo in?',
            acceptedAnswer: { '@type': 'Answer', text: 'Tokyo uses Japan Standard Time (JST, UTC+9) year-round. Japan does not observe daylight saving time.' }},
          { '@type': 'Question', name: 'Does Tokyo observe daylight saving time?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Tokyo does not observe daylight saving time. Japan remains on Japan Standard Time (JST, UTC+9) throughout the entire year.' }}
        ]
      }
    ]
  }),
  '/hijri-calendar': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Hijri Calendar — Islamic Date Converter',
        url: 'https://myzonetime.com/hijri-calendar',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'Convert between Hijri (Islamic) and Gregorian calendar dates. View today Islamic date updated daily.'
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is today Hijri date?',
            acceptedAnswer: { '@type': 'Answer', text: 'Today Hijri date is shown live on this page, automatically calculated and updated daily. The Hijri calendar is a lunar calendar used in Islamic countries.' }},
          { '@type': 'Question', name: 'How many days are in a Hijri year?',
            acceptedAnswer: { '@type': 'Answer', text: 'A Hijri (Islamic) year has 354 or 355 days, which is 10 to 11 days shorter than the Gregorian year. This is why Islamic dates shift earlier each Gregorian year.' }}
        ]
      }
    ]
  }),
  '/stopwatch': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Online Stopwatch with Laps — MyZoneTime',
    url: 'https://myzonetime.com/stopwatch',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online stopwatch with lap timer. Precision timing in your browser — no download needed.'
  }),
  '/timer': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Online Countdown Timer — MyZoneTime',
    url: 'https://myzonetime.com/timer',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online countdown timer. Set hours, minutes or seconds and get an alert when time is up.'
  }),
  '/countdown': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Event Countdown Timer — MyZoneTime',
    url: 'https://myzonetime.com/countdown',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Count down to any event — birthdays, holidays, launches. Shows days, hours, minutes and seconds.'
  }),
  '/date-calculator': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Date Calculator — Days Between Dates | MyZoneTime',
    url: 'https://myzonetime.com/date-calculator',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Calculate the number of days, weeks or months between two dates. Add or subtract days from any date.'
  }),
  '/work-hours-calculator': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Work Hours Calculator — Timesheet Tool | MyZoneTime',
    url: 'https://myzonetime.com/work-hours-calculator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Calculate total work hours and overtime from your timesheet. Add shifts and breaks instantly.'
  }),
  '/time-difference-calculator': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Time Difference Calculator — MyZoneTime',
    url: 'https://myzonetime.com/time-difference-calculator',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Calculate the exact time difference between any two cities with automatic DST handling.'
  }),
  '/world-clock-widget': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free Embeddable World Clock Widget — MyZoneTime',
    url: 'https://myzonetime.com/world-clock-widget',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free embeddable world clock widget. Copy the iframe code and display live city times on any website.'
  }),
};
// ─── Helper: title-case a hyphenated slug ─────────────────────────────────
function titleCase(str) {
  return String(str).replace(/-/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
}

// ─── Build the <head> meta + JSON-LD block ────────────────────────────────
function buildMetaBlock(seo, pathname) {
  var title       = seo.title;
  var description = seo.description;
  var canonical   = seo.canonical;
  var schema      = SCHEMAS[pathname] || null;

  var tags = [
    '<title>' + title + '</title>',
    '<meta name="description" content="' + description + '" />',
    '<link rel="canonical" href="' + canonical + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="MyZoneTime" />',
    '<meta property="og:title" content="' + title + '" />',
    '<meta property="og:description" content="' + description + '" />',
    '<meta property="og:url" content="' + canonical + '" />',
    '<meta property="og:image" content="https://myzonetime.com/og-image.jpg" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:type" content="image/jpeg" />',
    '<meta property="og:locale" content="en_US" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:site" content="@myzonetime" />',
    '<meta name="twitter:title" content="' + title + '" />',
    '<meta name="twitter:description" content="' + description + '" />',
    '<meta name="twitter:image" content="https://myzonetime.com/og-image.jpg" />',
  ];

  if (schema) {
    tags.push('<script type="application/ld+json">' + schema + '</script>');
  }

  return tags.join('\n    ');
}

// ─── Inject SEO + H1 into the HTML template ───────────────────────────────
function injectSeo(html, seo, pathname) {
  var metaBlock = buildMetaBlock(seo, pathname || '/');
  html = html.replace('</head>', '    ' + metaBlock + '\n  </head>');

  // C-1 FIX: placeholder in index.html is now exactly <!-- SSR_H1_INJECT -->
  var h1Tag = '<h1 class="sr-only">' + seo.h1 + '</h1>';
  html = html.replace('<!-- SSR_H1_INJECT -->', h1Tag);

  return html;
}

// ─── Middleware ────────────────────────────────────────────────────────────

// HTTPS redirect (production)
app.use(function (req, res, next) {
  if (IS_PROD && req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  }
  next();
});

// WWW → non-WWW redirect
app.use(function (req, res, next) {
  if (req.headers.host && req.headers.host.startsWith('www.')) {
    var bare = req.headers.host.slice(4);
    return res.redirect(301, (IS_PROD ? 'https' : 'http') + '://' + bare + req.url);
  }
  next();
});

// Gzip
app.use(compression({ level: 6 }));

// Helmet — CSP tuned for AdSense
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", "'unsafe-inline'",
                      'https://pagead2.googlesyndication.com',
                      'https://www.googletagmanager.com',
                      'https://adservice.google.com',
                      'https://tpc.googlesyndication.com'],
      scriptSrcAttr: ["'none'"],
      styleSrc:      ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:       ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:        ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc:    ["'self'", 'https://api.open-meteo.com',
                      'https://pagead2.googlesyndication.com'],
      frameSrc:      ['https://googleads.g.doubleclick.net',
                      'https://tpc.googlesyndication.com'],
      objectSrc:     ["'none'"],
    },
  },
  hsts: IS_PROD
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
  frameguard:     { action: 'sameorigin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ─── Static assets (hashed bundles — 1 year cache) ────────────────────────
app.use('/assets', express.static(path.join(DIST, 'assets'), {
  maxAge: '1y',
  immutable: true,
}));

// ─── Other static files (robots.txt, sitemap.xml, manifest, favicon…) ────
app.use(express.static(DIST, {
  maxAge: '1d',
  index: false,
}));

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', function (req, res) {
  res.json({ status: 'ok', uptime: process.uptime() });
});


// ─── Explicit sitemap.xml — correct Content-Type, immune to build wipe ──────
app.get('/sitemap.xml', function (req, res) {
  var sitemapPath = path.join(DIST, 'sitemap.xml');
  // Fallback to public/ if dist/ was wiped by a build
  if (!require('fs').existsSync(sitemapPath)) {
    sitemapPath = path.join(__dirname, 'apps', 'web', 'public', 'sitemap.xml');
  }
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.sendFile(sitemapPath);
});

// ─── Explicit robots.txt route ───────────────────────────────────────────────
app.get('/robots.txt', function (req, res) {
  var robotsPath = path.join(DIST, 'robots.txt');
  if (!require('fs').existsSync(robotsPath)) {
    robotsPath = path.join(__dirname, 'apps', 'web', 'public', 'robots.txt');
  }
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.sendFile(robotsPath);
});

// ─── M-5 FIX: Embed pages — forced noindex ────────────────────────────────
app.get('/embed/*', function (req, res) {
  if (!indexTemplate) {
    return res.status(503).send('Site is building.');
  }
  var html = indexTemplate.replace('</head>',
    '    <meta name="robots" content="noindex,nofollow" />\n  </head>');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(html);
});

// ─── H-6 FIX: Dynamic /time-difference/:pair route ────────────────────────
app.get('/time-difference/:pair', function (req, res) {
  if (!indexTemplate) {
    return res.status(503).send('Site is building.');
  }
  var pair  = req.params.pair;
  var parts = pair.split('-and-');
  var city1 = parts[0] ? titleCase(parts[0]) : 'City 1';
  var city2 = parts[1] ? titleCase(parts[1]) : 'City 2';

  var seo = {
    title:       'Time Difference Between ' + city1 + ' and ' + city2 + ' | MyZoneTime',
    description: 'What is the exact time difference between ' + city1 + ' and ' + city2 + '? Get the live, DST-aware hour offset updated in real time. Free.',
    h1:          'Time Difference: ' + city1 + ' and ' + city2,
    canonical:   'https://myzonetime.com/time-difference/' + pair,
  };

  var pairSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the time difference between ' + city1 + ' and ' + city2 + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The current time difference between ' + city1 + ' and ' + city2 + ' is shown on this page in real time, adjusted for daylight saving. Use the live clock above for the exact offset.'
        }
      }
    ]
  });

  var customSchemas = Object.assign({}, SCHEMAS);
  customSchemas['/time-difference/' + pair] = pairSchema;

  var html = injectSeo(indexTemplate, seo, '/time-difference/' + pair);
  // inject the pair schema manually since it's dynamic
  html = html.replace('</head>',
    '    <script type="application/ld+json">' + pairSchema + '</script>\n  </head>');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  res.send(html);
});

// ─── SPA catch-all ────────────────────────────────────────────────────────
app.get('*', function (req, res) {
  if (!indexTemplate) {
    return res.status(503).send(
      'Site is building — please run <code>npm run build</code> and restart.'
    );
  }

  var rawPath = req.path.toLowerCase().replace(/\/+$/, '') || '/';
  var seo     = SEO[rawPath] || DEFAULT_SEO;
  var html    = injectSeo(indexTemplate, seo, rawPath);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(html);
});

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', function () {
  console.log(
    '[server] MyZoneTime running on http://0.0.0.0:' + PORT +
    ' (' + (IS_PROD ? 'production' : 'development') + ')'
  );
});
