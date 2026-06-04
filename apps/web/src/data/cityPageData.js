/**
 * cityPageData.js
 * Comprehensive SEO data for all city pages.
 * Each entry provides unique metadata, descriptions, FAQs, and schema content.
 */

// Core geo/tz data for all routable cities
export const CITY_SEO_DATA = {

  // ── MIDDLE EAST ──────────────────────────────────────────────────────────

  dubai: {
    name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', region: 'Middle East',
    timezone: 'Asia/Dubai', utcOffset: '+4:00', utcLabel: 'UTC+4',
    tzName: 'Gulf Standard Time', tzAbbr: 'GST', dst: false,
    lat: 25.2048, lon: 55.2708, geoRegion: 'AE-DU',
    currency: 'AED', callingCode: '+971',
    heroDescription: 'Dubai runs on Gulf Standard Time (GST, UTC+4) year-round with no daylight saving adjustments. As the commercial heart of the UAE and a global aviation hub, it bridges Asian mornings with European afternoons—making it one of the world\'s most strategically timed cities for international business.',
    overview: 'Dubai is the largest city in the United Arab Emirates and one of the world\'s most dynamic global business hubs. Situated on the Persian Gulf coast, it serves as a critical transit point for flights between Europe, Asia, and Africa. Its time zone—Gulf Standard Time (GST, UTC+4)—places it in an exceptionally strategic position: Dubai mornings overlap with Indian business hours, its afternoons align with European working hours, and its evenings catch the East Coast of the United States beginning their day. With no daylight saving time adjustments ever, Dubai\'s offset to any city in the world remains predictable and consistent throughout the year.',
    faqs: [
      { q: 'What time zone is Dubai in?', a: 'Dubai is in the Gulf Standard Time (GST) zone, which is UTC+4. It is 4 hours ahead of Coordinated Universal Time and does not shift for any season.' },
      { q: 'Does Dubai observe daylight saving time?', a: 'No. Dubai does not observe daylight saving time. The UAE permanently stays on GST (UTC+4) year-round, so the offset never changes regardless of the season.' },
      { q: 'What are standard business hours in Dubai?', a: 'Standard business hours in Dubai are Sunday to Thursday, 9:00 AM to 6:00 PM GST. Friday and Saturday form the UAE weekend. Many international businesses also operate Monday to Friday.' },
      { q: 'What is the time difference between Dubai and London?', a: 'Dubai (UTC+4) is 4 hours ahead of London in winter (GMT, UTC+0), and 3 hours ahead in summer when the UK observes British Summer Time (BST, UTC+1).' },
      { q: 'What is the time difference between Dubai and New York?', a: 'Dubai (UTC+4) is 9 hours ahead of New York in winter (EST, UTC−5) and 8 hours ahead in summer when New York observes EDT (UTC−4).' },
      { q: 'What is the time difference between Dubai and India?', a: 'Dubai (UTC+4) is 30 minutes behind India Standard Time (IST, UTC+5:30). When it is 12:00 PM in Dubai, it is 12:30 PM in Mumbai or Delhi.' },
      { q: 'What is the best time to call Dubai from Europe?', a: 'The best window to call Dubai from Europe is 9:00 AM–12:00 PM CET (Central European Time). At that time it is 12:00 PM–3:00 PM in Dubai, which is during standard Dubai business hours.' },
      { q: 'How do I convert Dubai time to my local time?', a: 'Add or subtract from UTC+4. For Los Angeles (UTC−8), subtract 12 hours. For Paris (UTC+1 in winter), subtract 3 hours. Use MyZoneTime\'s free time zone converter for an instant, DST-aware result.' },
    ],
    relatedCities: ['abu-dhabi', 'riyadh', 'doha', 'muscat', 'london', 'mumbai'],
    relatedTimezones: ['gst', 'ist', 'gmt'],
  },

  'abu-dhabi': {
    name: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', region: 'Middle East',
    timezone: 'Asia/Dubai', utcOffset: '+4:00', utcLabel: 'UTC+4',
    tzName: 'Gulf Standard Time', tzAbbr: 'GST', dst: false,
    lat: 24.4539, lon: 54.3773, geoRegion: 'AE-AZ',
    currency: 'AED', callingCode: '+971',
    heroDescription: 'Abu Dhabi, the UAE capital, operates on Gulf Standard Time (GST, UTC+4) with no daylight saving changes. Home to the federal government and major sovereign wealth funds, it shares its time zone with Dubai and the entire UAE.',
    overview: 'Abu Dhabi is the capital and second-largest city of the United Arab Emirates. As the seat of the UAE federal government and the Abu Dhabi Investment Authority—one of the world\'s largest sovereign wealth funds—it is a critical center of political and financial power in the Gulf region. Like all of the UAE, Abu Dhabi operates on Gulf Standard Time (GST, UTC+4) with no daylight saving time. This stable, no-DST schedule makes scheduling international calls and meetings straightforward throughout the year.',
    faqs: [
      { q: 'What time zone is Abu Dhabi in?', a: 'Abu Dhabi is in the Gulf Standard Time (GST) zone at UTC+4, the same as Dubai and the rest of the UAE.' },
      { q: 'Does Abu Dhabi observe daylight saving time?', a: 'No. The UAE does not observe daylight saving time. Abu Dhabi stays at UTC+4 year-round.' },
      { q: 'What is the difference between Abu Dhabi time and London time?', a: 'Abu Dhabi (UTC+4) is 4 hours ahead of London in winter (GMT) and 3 hours ahead in summer (BST).' },
      { q: 'What are Abu Dhabi business hours?', a: 'Government offices in Abu Dhabi operate Sunday to Thursday, 7:30 AM to 3:30 PM GST. Private businesses typically run Sunday to Thursday, 9:00 AM to 6:00 PM.' },
      { q: 'Is Abu Dhabi time the same as Dubai time?', a: 'Yes. Both Abu Dhabi and Dubai use Gulf Standard Time (GST, UTC+4). There is no time difference between the two cities.' },
    ],
    relatedCities: ['dubai', 'sharjah', 'riyadh', 'doha', 'london'],
    relatedTimezones: ['gst', 'gmt'],
  },

  riyadh: {
    name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', region: 'Middle East',
    timezone: 'Asia/Riyadh', utcOffset: '+3:00', utcLabel: 'UTC+3',
    tzName: 'Arabia Standard Time', tzAbbr: 'AST', dst: false,
    lat: 24.6877, lon: 46.7219, geoRegion: 'SA-01',
    currency: 'SAR', callingCode: '+966',
    heroDescription: 'Riyadh uses Arabia Standard Time (AST, UTC+3) year-round with no daylight saving. As Saudi Arabia\'s capital and the region\'s largest economic hub, it is 3 hours ahead of UTC with a consistent, predictable offset.',
    overview: 'Riyadh is the capital and largest city of Saudi Arabia, and one of the most economically significant cities in the Middle East. Home to Aramco headquarters, the Tadawul stock exchange, and major government ministries, Riyadh operates on Arabia Standard Time (AST, UTC+3). Saudi Arabia abolished daylight saving time in 2008, meaning Riyadh\'s UTC+3 offset is fully constant throughout the year. This makes it one hour behind Dubai (UTC+4), two hours ahead of Cairo in winter, and three hours ahead of London in winter.',
    faqs: [
      { q: 'What time zone is Riyadh in?', a: 'Riyadh uses Arabia Standard Time (AST), which is UTC+3. Saudi Arabia does not observe daylight saving time.' },
      { q: 'Does Saudi Arabia observe daylight saving time?', a: 'No. Saudi Arabia abolished daylight saving time in 2008. Riyadh stays at UTC+3 year-round.' },
      { q: 'What is the time difference between Riyadh and Dubai?', a: 'Riyadh (UTC+3) is 1 hour behind Dubai (UTC+4). When it is 10:00 AM in Riyadh, it is 11:00 AM in Dubai.' },
      { q: 'What is the time difference between Riyadh and London?', a: 'Riyadh (UTC+3) is 3 hours ahead of London in winter (GMT, UTC+0) and 2 hours ahead in summer (BST, UTC+1).' },
      { q: 'What is the time difference between Riyadh and New York?', a: 'Riyadh (UTC+3) is 8 hours ahead of New York in winter (EST, UTC−5) and 7 hours ahead in summer (EDT, UTC−4).' },
      { q: 'What are business hours in Riyadh?', a: 'Most businesses in Riyadh operate Sunday to Thursday, 8:00 AM to 5:00 PM AST. Government ministries may open as early as 7:30 AM.' },
    ],
    relatedCities: ['dubai', 'doha', 'muscat', 'cairo', 'london', 'new-york'],
    relatedTimezones: ['ast', 'gst', 'gmt'],
  },

  doha: {
    name: 'Doha', country: 'Qatar', countryCode: 'QA', region: 'Middle East',
    timezone: 'Asia/Qatar', utcOffset: '+3:00', utcLabel: 'UTC+3',
    tzName: 'Arabia Standard Time', tzAbbr: 'AST', dst: false,
    lat: 25.2854, lon: 51.5310, geoRegion: 'QA-DA',
    currency: 'QAR', callingCode: '+974',
    heroDescription: 'Doha runs on Arabia Standard Time (AST, UTC+3) permanently. Qatar does not observe daylight saving time, keeping Doha\'s offset stable year-round—ideal for scheduling international media events and financial meetings.',
    overview: 'Doha is the capital and most populous city of Qatar. Since hosting the 2022 FIFA World Cup, Doha has risen to global prominence as a hub for diplomacy, media (Al Jazeera), and international aviation (Qatar Airways hub at Hamad International Airport). Qatar operates on UTC+3 permanently—the same offset as Riyadh—with no daylight saving time. Its position 3 hours ahead of London and 8 hours ahead of New York (in winter) makes it a natural bridge for scheduling between European and American time zones.',
    faqs: [
      { q: 'What time zone is Doha in?', a: 'Doha uses Arabia Standard Time (AST), which is UTC+3. Qatar does not observe daylight saving time.' },
      { q: 'Does Qatar observe daylight saving time?', a: 'No. Qatar permanently operates at UTC+3 with no daylight saving adjustments.' },
      { q: 'What is the time difference between Doha and Dubai?', a: 'Doha (UTC+3) is 1 hour behind Dubai (UTC+4). When it is 9:00 AM in Doha, it is 10:00 AM in Dubai.' },
      { q: 'What is the time difference between Doha and London?', a: 'Doha is 3 hours ahead of London in winter (GMT) and 2 hours ahead in summer (BST).' },
      { q: 'Is Doha time the same as Riyadh time?', a: 'Yes. Both Doha and Riyadh use UTC+3 (Arabia Standard Time) and neither observes daylight saving time.' },
    ],
    relatedCities: ['dubai', 'riyadh', 'muscat', 'abu-dhabi', 'london'],
    relatedTimezones: ['ast', 'gst'],
  },

  muscat: {
    name: 'Muscat', country: 'Oman', countryCode: 'OM', region: 'Middle East',
    timezone: 'Asia/Muscat', utcOffset: '+4:00', utcLabel: 'UTC+4',
    tzName: 'Gulf Standard Time', tzAbbr: 'GST', dst: false,
    lat: 23.5880, lon: 58.3829, geoRegion: 'OM-MA',
    currency: 'OMR', callingCode: '+968',
    heroDescription: 'Muscat uses Gulf Standard Time (GST, UTC+4)—the same as Dubai—year-round with no daylight saving. Oman\'s capital is a growing hub for regional finance and tourism in the Arabian Sea.',
    overview: 'Muscat is the capital and largest city of Oman, strategically located on the northeastern coast of the Arabian Peninsula along the Gulf of Oman. Oman operates on Gulf Standard Time (GST, UTC+4), sharing its time zone with Dubai and Abu Dhabi. There is no daylight saving time in Oman. Muscat is emerging as a financial and logistics center, and its stable time zone makes it simple to coordinate with regional partners in Dubai or international partners in London and Mumbai.',
    faqs: [
      { q: 'What time zone is Muscat in?', a: 'Muscat is in the Gulf Standard Time (GST) zone at UTC+4, the same as Dubai and Abu Dhabi.' },
      { q: 'Does Oman observe daylight saving time?', a: 'No. Oman does not observe daylight saving time. Muscat remains at UTC+4 throughout the year.' },
      { q: 'What is the time difference between Muscat and London?', a: 'Muscat (UTC+4) is 4 hours ahead of London in winter and 3 hours ahead in summer (BST).' },
      { q: 'Is Muscat time the same as Dubai time?', a: 'Yes. Both Muscat and Dubai use Gulf Standard Time (GST, UTC+4) and neither observes DST.' },
    ],
    relatedCities: ['dubai', 'abu-dhabi', 'riyadh', 'karachi'],
    relatedTimezones: ['gst', 'ist'],
  },

  'kuwait-city': {
    name: 'Kuwait City', country: 'Kuwait', countryCode: 'KW', region: 'Middle East',
    timezone: 'Asia/Kuwait', utcOffset: '+3:00', utcLabel: 'UTC+3',
    tzName: 'Arabia Standard Time', tzAbbr: 'AST', dst: false,
    lat: 29.3759, lon: 47.9774, geoRegion: 'KW-KU',
    currency: 'KWD', callingCode: '+965',
    heroDescription: 'Kuwait City operates on Arabia Standard Time (UTC+3) with no daylight saving. As the Gulf state capital with one of the world\'s highest-value currencies, it keeps a stable 3-hour lead over UTC.',
    overview: 'Kuwait City is the capital of Kuwait and one of the most prosperous cities in the Gulf region, owing largely to its vast petroleum reserves. Kuwait operates on Arabia Standard Time (AST, UTC+3) year-round with no daylight saving time. Kuwait City shares its UTC+3 offset with Riyadh, Doha, and Baghdad, making intra-Gulf coordination seamless. The city is a key financial center and home to the Kuwait Investment Authority, one of the world\'s oldest sovereign wealth funds.',
    faqs: [
      { q: 'What time zone is Kuwait City in?', a: 'Kuwait City uses Arabia Standard Time (AST), which is UTC+3. Kuwait does not observe daylight saving time.' },
      { q: 'What is the time difference between Kuwait City and Dubai?', a: 'Kuwait City (UTC+3) is 1 hour behind Dubai (UTC+4).' },
      { q: 'What is the time difference between Kuwait City and London?', a: 'Kuwait City is 3 hours ahead of London in winter (GMT) and 2 hours ahead in summer (BST).' },
      { q: 'Is Kuwait time the same as Riyadh time?', a: 'Yes. Both Kuwait City and Riyadh operate on UTC+3 Arabia Standard Time with no daylight saving.' },
    ],
    relatedCities: ['riyadh', 'dubai', 'doha', 'baghdad'],
    relatedTimezones: ['ast', 'gst'],
  },

  // ── ASIA ──────────────────────────────────────────────────────────────────

  mumbai: {
    name: 'Mumbai', country: 'India', countryCode: 'IN', region: 'Asia',
    timezone: 'Asia/Kolkata', utcOffset: '+5:30', utcLabel: 'UTC+5:30',
    tzName: 'India Standard Time', tzAbbr: 'IST', dst: false,
    lat: 19.0760, lon: 72.8777, geoRegion: 'IN-MH',
    currency: 'INR', callingCode: '+91',
    heroDescription: 'Mumbai runs on India Standard Time (IST, UTC+5:30) year-round—one of the few time zones with a half-hour offset. As India\'s financial capital and home to the BSE and NSE stock exchanges, it\'s the commercial heartbeat of the world\'s most populous nation.',
    overview: 'Mumbai is the financial capital of India and one of the most populous cities in the world. Home to the Bombay Stock Exchange (BSE) and the National Stock Exchange (NSE), it drives a significant portion of India\'s economic activity. Mumbai uses India Standard Time (IST, UTC+5:30)—notable for its unusual half-hour offset from UTC. India does not observe daylight saving time, keeping IST constant throughout the year. Mumbai\'s time zone places it 30 minutes ahead of Dubai, 4.5 hours behind Singapore, and 5.5 hours ahead of London in winter.',
    faqs: [
      { q: 'What time zone is Mumbai in?', a: 'Mumbai uses India Standard Time (IST), which is UTC+5:30. India does not observe daylight saving time.' },
      { q: 'Why does India use a half-hour offset?', a: 'India chose UTC+5:30 as a compromise between its easternmost and westernmost points. This single time zone for the entire country simplifies administration, though it does create unusual offset calculations.' },
      { q: 'What is the time difference between Mumbai and Dubai?', a: 'Mumbai (UTC+5:30) is 1 hour 30 minutes ahead of Dubai (UTC+4).' },
      { q: 'What is the time difference between Mumbai and London?', a: 'Mumbai (UTC+5:30) is 5 hours 30 minutes ahead of London in winter (GMT) and 4 hours 30 minutes ahead in summer (BST).' },
      { q: 'What is the time difference between Mumbai and New York?', a: 'Mumbai (UTC+5:30) is 10 hours 30 minutes ahead of New York in winter (EST) and 9 hours 30 minutes ahead in summer (EDT).' },
      { q: 'What are business hours in Mumbai?', a: 'Most businesses in Mumbai operate Monday to Friday, 9:00 AM to 6:00 PM IST. Stock markets (BSE/NSE) trade from 9:15 AM to 3:30 PM IST.' },
    ],
    relatedCities: ['delhi', 'dubai', 'singapore', 'london', 'new-york'],
    relatedTimezones: ['ist', 'gst', 'sgt'],
  },

  delhi: {
    name: 'New Delhi', country: 'India', countryCode: 'IN', region: 'Asia',
    timezone: 'Asia/Kolkata', utcOffset: '+5:30', utcLabel: 'UTC+5:30',
    tzName: 'India Standard Time', tzAbbr: 'IST', dst: false,
    lat: 28.6139, lon: 77.2090, geoRegion: 'IN-DL',
    currency: 'INR', callingCode: '+91',
    heroDescription: 'New Delhi, India\'s capital, uses India Standard Time (IST, UTC+5:30) year-round. As the seat of government and home to over 32 million people in the NCR, it is the political and administrative center of the world\'s largest democracy.',
    overview: 'New Delhi is the capital territory of India and the seat of all three branches of the Indian government. Located in northern India, it forms part of the National Capital Region (NCR) with a combined population exceeding 32 million. Like all of India, New Delhi uses India Standard Time (IST, UTC+5:30) with no daylight saving time. The city hosts major government ministries, the Reserve Bank of India\'s regulatory functions, and numerous multinational headquarters—making accurate time coordination essential for global business dealings.',
    faqs: [
      { q: 'What time zone is New Delhi in?', a: 'New Delhi uses India Standard Time (IST), which is UTC+5:30. All of India operates on a single time zone without daylight saving.' },
      { q: 'What is the time difference between Delhi and London?', a: 'New Delhi (UTC+5:30) is 5 hours 30 minutes ahead of London in winter (GMT) and 4 hours 30 minutes ahead in summer (BST).' },
      { q: 'What is the time difference between Delhi and Dubai?', a: 'New Delhi (UTC+5:30) is 1 hour 30 minutes ahead of Dubai (UTC+4). When it is 10:00 AM in Dubai, it is 11:30 AM in Delhi.' },
      { q: 'What is the time difference between Delhi and Singapore?', a: 'Singapore (UTC+8) is 2 hours 30 minutes ahead of New Delhi (UTC+5:30).' },
      { q: 'What are business hours in New Delhi?', a: 'Government offices in Delhi typically operate Monday to Saturday, 9:00 AM to 5:30 PM IST. Private sector businesses usually follow a 9:00 AM to 6:00 PM schedule, Monday to Friday.' },
    ],
    relatedCities: ['mumbai', 'karachi', 'dubai', 'singapore', 'london'],
    relatedTimezones: ['ist', 'gst', 'pkt'],
  },

  karachi: {
    name: 'Karachi', country: 'Pakistan', countryCode: 'PK', region: 'Asia',
    timezone: 'Asia/Karachi', utcOffset: '+5:00', utcLabel: 'UTC+5',
    tzName: 'Pakistan Standard Time', tzAbbr: 'PKT', dst: false,
    lat: 24.8607, lon: 67.0011, geoRegion: 'PK-SD',
    currency: 'PKR', callingCode: '+92',
    heroDescription: 'Karachi operates on Pakistan Standard Time (PKT, UTC+5) year-round. As Pakistan\'s largest city and economic hub with a population of over 16 million, it is the country\'s financial center, home to the Karachi Stock Exchange and major port facilities.',
    overview: 'Karachi is the most populous city in Pakistan and one of the most populated urban areas in the world, with over 16 million residents. It serves as the commercial and financial capital of Pakistan, housing the Pakistan Stock Exchange (PSX) and the majority of the country\'s banking and industrial activity. Karachi uses Pakistan Standard Time (PKT, UTC+5), which places it 30 minutes behind India (IST, UTC+5:30) and 1 hour ahead of Dubai (UTC+4). Pakistan does not observe daylight saving time.',
    faqs: [
      { q: 'What time zone is Karachi in?', a: 'Karachi uses Pakistan Standard Time (PKT), which is UTC+5. Pakistan does not observe daylight saving time.' },
      { q: 'What is the time difference between Karachi and Dubai?', a: 'Karachi (UTC+5) is 1 hour ahead of Dubai (UTC+4). When it is 10:00 AM in Dubai, it is 11:00 AM in Karachi.' },
      { q: 'What is the time difference between Karachi and India?', a: 'Karachi (UTC+5) is 30 minutes behind India Standard Time (IST, UTC+5:30). When it is 12:00 PM in Karachi, it is 12:30 PM in Mumbai.' },
      { q: 'What is the time difference between Karachi and London?', a: 'Karachi (UTC+5) is 5 hours ahead of London in winter (GMT) and 4 hours ahead in summer (BST).' },
      { q: 'What are business hours in Karachi?', a: 'Most businesses in Karachi operate Monday to Friday, 9:00 AM to 6:00 PM PKT, with some banks and government offices also open on Saturdays.' },
    ],
    relatedCities: ['lahore', 'dubai', 'mumbai', 'london', 'new-york'],
    relatedTimezones: ['pkt', 'ist', 'gst'],
  },

  lahore: {
    name: 'Lahore', country: 'Pakistan', countryCode: 'PK', region: 'Asia',
    timezone: 'Asia/Karachi', utcOffset: '+5:00', utcLabel: 'UTC+5',
    tzName: 'Pakistan Standard Time', tzAbbr: 'PKT', dst: false,
    lat: 31.5497, lon: 74.3436, geoRegion: 'PK-PB',
    currency: 'PKR', callingCode: '+92',
    heroDescription: 'Lahore runs on Pakistan Standard Time (PKT, UTC+5) year-round. Pakistan\'s second-largest city and cultural capital, Lahore is the heart of Punjab province and a major center for education, arts, and technology.',
    overview: 'Lahore is the second-largest city in Pakistan and the capital of Punjab province, often called the cultural heart of Pakistan. With a history spanning millennia and a vibrant modern economy—particularly in textiles, IT, and education—Lahore is a city of immense significance. Like all Pakistani cities, it uses Pakistan Standard Time (PKT, UTC+5) with no daylight saving time. Its offset places it 1 hour ahead of Dubai, 30 minutes behind India, and 5 hours ahead of London in winter.',
    faqs: [
      { q: 'What time zone is Lahore in?', a: 'Lahore uses Pakistan Standard Time (PKT), which is UTC+5. Pakistan does not observe daylight saving time.' },
      { q: 'Is Lahore time the same as Karachi time?', a: 'Yes. Both Lahore and Karachi (and all of Pakistan) use the same Pakistan Standard Time (PKT, UTC+5).' },
      { q: 'What is the time difference between Lahore and London?', a: 'Lahore (UTC+5) is 5 hours ahead of London in winter and 4 hours ahead when the UK observes BST.' },
      { q: 'What is the time difference between Lahore and Dubai?', a: 'Lahore (PKT, UTC+5) is 1 hour ahead of Dubai (GST, UTC+4).' },
    ],
    relatedCities: ['karachi', 'islamabad', 'delhi', 'dubai'],
    relatedTimezones: ['pkt', 'ist'],
  },

  singapore: {
    name: 'Singapore', country: 'Singapore', countryCode: 'SG', region: 'Asia',
    timezone: 'Asia/Singapore', utcOffset: '+8:00', utcLabel: 'UTC+8',
    tzName: 'Singapore Standard Time', tzAbbr: 'SGT', dst: false,
    lat: 1.3521, lon: 103.8198, geoRegion: 'SG-01',
    currency: 'SGD', callingCode: '+65',
    heroDescription: 'Singapore uses Singapore Standard Time (SGT, UTC+8) year-round. As one of the world\'s most important financial centers and trading hubs, it shares UTC+8 with Hong Kong and Beijing—placing it at the center of Asian business.',
    overview: 'Singapore is a city-state and one of the world\'s most important financial, shipping, and trading centers. It operates on Singapore Standard Time (SGT, UTC+8) year-round with no daylight saving time. Sharing UTC+8 with Hong Kong, Beijing, Kuala Lumpur, and Perth, Singapore sits at the heart of the East Asian business day. Its stable, no-DST schedule means its offset to cities like London (8 hours in winter), New York (13 hours in winter), and Dubai (4 hours) never changes.',
    faqs: [
      { q: 'What time zone is Singapore in?', a: 'Singapore uses Singapore Standard Time (SGT), which is UTC+8. Singapore does not observe daylight saving time.' },
      { q: 'What is the time difference between Singapore and London?', a: 'Singapore (UTC+8) is 8 hours ahead of London in winter (GMT) and 7 hours ahead in summer (BST).' },
      { q: 'What is the time difference between Singapore and Dubai?', a: 'Singapore (UTC+8) is 4 hours ahead of Dubai (UTC+4) all year, as neither city observes DST.' },
      { q: 'What is the time difference between Singapore and New York?', a: 'Singapore (UTC+8) is 13 hours ahead of New York in winter (EST) and 12 hours ahead in summer (EDT).' },
      { q: 'Is Singapore time the same as Hong Kong time?', a: 'Yes. Singapore (SGT, UTC+8) and Hong Kong (HKT, UTC+8) share the same UTC offset, so there is no time difference between the two cities.' },
      { q: 'What are business hours in Singapore?', a: 'Most businesses in Singapore operate Monday to Friday, 9:00 AM to 6:00 PM SGT. The Singapore Stock Exchange (SGX) trades from 9:00 AM to 5:00 PM SGT.' },
    ],
    relatedCities: ['hong-kong', 'kuala-lumpur', 'tokyo', 'sydney', 'dubai', 'london'],
    relatedTimezones: ['sgt', 'hkt', 'jst'],
  },

  tokyo: {
    name: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'Asia',
    timezone: 'Asia/Tokyo', utcOffset: '+9:00', utcLabel: 'UTC+9',
    tzName: 'Japan Standard Time', tzAbbr: 'JST', dst: false,
    lat: 35.6762, lon: 139.6503, geoRegion: 'JP-13',
    currency: 'JPY', callingCode: '+81',
    heroDescription: 'Tokyo runs on Japan Standard Time (JST, UTC+9) year-round. As the world\'s most populous metropolitan area and a leading financial hub, Japan never observes daylight saving time—keeping its UTC+9 offset permanently stable.',
    overview: 'Tokyo is the capital of Japan and the most populous metropolitan area in the world, home to over 37 million people. As the hub of Japan\'s economy, it hosts the Tokyo Stock Exchange (TSE)—the third-largest in the world by market capitalization—along with headquarters of Sony, Toyota, and countless global corporations. Japan Standard Time (JST, UTC+9) has remained constant since 1951; Japan does not observe daylight saving time. Tokyo is 9 hours ahead of London in winter, 14 hours ahead of New York in winter, and 1 hour ahead of Beijing.',
    faqs: [
      { q: 'What time zone is Tokyo in?', a: 'Tokyo is in the Japan Standard Time (JST) zone, which is UTC+9. Japan does not observe daylight saving time.' },
      { q: 'Does Japan observe daylight saving time?', a: 'No. Japan abolished daylight saving time in 1952 and has not observed it since. Tokyo maintains UTC+9 year-round.' },
      { q: 'What is the time difference between Tokyo and London?', a: 'Tokyo (UTC+9) is 9 hours ahead of London in winter (GMT) and 8 hours ahead in summer (BST).' },
      { q: 'What is the time difference between Tokyo and New York?', a: 'Tokyo (UTC+9) is 14 hours ahead of New York in winter (EST) and 13 hours ahead in summer (EDT).' },
      { q: 'What is the time difference between Tokyo and Singapore?', a: 'Tokyo (UTC+9) is 1 hour ahead of Singapore (UTC+8). Neither city observes DST, so this difference is constant.' },
      { q: 'What are Tokyo Stock Exchange trading hours?', a: 'The Tokyo Stock Exchange (TSE) trades Monday to Friday, 9:00 AM to 3:30 PM JST (with a break from 11:30 AM to 12:30 PM).' },
    ],
    relatedCities: ['singapore', 'hong-kong', 'seoul', 'sydney', 'london', 'new-york'],
    relatedTimezones: ['jst', 'sgt', 'aest'],
  },

  'hong-kong': {
    name: 'Hong Kong', country: 'Hong Kong SAR', countryCode: 'HK', region: 'Asia',
    timezone: 'Asia/Hong_Kong', utcOffset: '+8:00', utcLabel: 'UTC+8',
    tzName: 'Hong Kong Time', tzAbbr: 'HKT', dst: false,
    lat: 22.3193, lon: 114.1694, geoRegion: 'HK',
    currency: 'HKD', callingCode: '+852',
    heroDescription: 'Hong Kong uses Hong Kong Time (HKT, UTC+8) permanently. A global financial powerhouse, it shares its UTC+8 offset with Singapore and Beijing, placing it at the center of Asian market hours.',
    overview: 'Hong Kong is a Special Administrative Region of China and one of the world\'s most significant financial centers. The Hong Kong Stock Exchange (HKEX) is among the world\'s largest by capitalization. Hong Kong uses Hong Kong Time (HKT, UTC+8) year-round with no daylight saving time. It shares its offset with Singapore, Beijing, Taipei, and Perth—making regional coordination straightforward. Hong Kong is 8 hours ahead of London in winter and 13 hours ahead of New York.',
    faqs: [
      { q: 'What time zone is Hong Kong in?', a: 'Hong Kong uses Hong Kong Time (HKT), which is UTC+8. There is no daylight saving time in Hong Kong.' },
      { q: 'Is Hong Kong time the same as Singapore time?', a: 'Yes. Both Hong Kong (HKT) and Singapore (SGT) are at UTC+8, so there is no time difference between the two.' },
      { q: 'What is the time difference between Hong Kong and London?', a: 'Hong Kong (UTC+8) is 8 hours ahead of London in winter (GMT) and 7 hours ahead in summer (BST).' },
      { q: 'What are HKEX trading hours?', a: 'The Hong Kong Stock Exchange trades Monday to Friday: 9:30 AM to 12:00 PM and 1:00 PM to 4:00 PM HKT.' },
    ],
    relatedCities: ['singapore', 'tokyo', 'beijing', 'sydney', 'london'],
    relatedTimezones: ['hkt', 'sgt', 'cst'],
  },

  seoul: {
    name: 'Seoul', country: 'South Korea', countryCode: 'KR', region: 'Asia',
    timezone: 'Asia/Seoul', utcOffset: '+9:00', utcLabel: 'UTC+9',
    tzName: 'Korea Standard Time', tzAbbr: 'KST', dst: false,
    lat: 37.5665, lon: 126.9780, geoRegion: 'KR-11',
    currency: 'KRW', callingCode: '+82',
    heroDescription: 'Seoul runs on Korea Standard Time (KST, UTC+9) permanently. South Korea\'s dynamic capital—home to Samsung, Hyundai, and the Korea Exchange—shares its JST offset with Tokyo, making coordination between the two cities effortless.',
    overview: 'Seoul is the capital of South Korea and one of the world\'s most technologically advanced cities. Home to global tech giants like Samsung, LG, and Hyundai, Seoul is a major hub for electronics, automobiles, and entertainment (K-pop, Korean cinema). Korea Standard Time (KST, UTC+9) is identical to Japan Standard Time, meaning Seoul and Tokyo have no time difference. South Korea does not observe daylight saving time.',
    faqs: [
      { q: 'What time zone is Seoul in?', a: 'Seoul uses Korea Standard Time (KST), which is UTC+9. South Korea does not observe daylight saving time.' },
      { q: 'Is Seoul time the same as Tokyo time?', a: 'Yes. Seoul (KST, UTC+9) and Tokyo (JST, UTC+9) share the same UTC offset. There is no time difference between the two cities.' },
      { q: 'What is the time difference between Seoul and London?', a: 'Seoul (UTC+9) is 9 hours ahead of London in winter (GMT) and 8 hours ahead in summer (BST).' },
      { q: 'What is the time difference between Seoul and New York?', a: 'Seoul (UTC+9) is 14 hours ahead of New York in winter (EST) and 13 hours ahead in summer (EDT).' },
    ],
    relatedCities: ['tokyo', 'hong-kong', 'singapore', 'beijing', 'sydney'],
    relatedTimezones: ['kst', 'jst', 'cst'],
  },

  beijing: {
    name: 'Beijing', country: 'China', countryCode: 'CN', region: 'Asia',
    timezone: 'Asia/Shanghai', utcOffset: '+8:00', utcLabel: 'UTC+8',
    tzName: 'China Standard Time', tzAbbr: 'CST', dst: false,
    lat: 39.9042, lon: 116.4074, geoRegion: 'CN-11',
    currency: 'CNY', callingCode: '+86',
    heroDescription: 'Beijing uses China Standard Time (CST, UTC+8) year-round. Despite China\'s vast east-west span, the entire country operates on a single time zone—making Beijing time the reference point for over 1.4 billion people.',
    overview: 'Beijing is the capital of the People\'s Republic of China—a global political and cultural center and one of the world\'s largest cities. China operates on a single time zone: China Standard Time (CST, UTC+8). Despite spanning five natural time zones geographically, Beijing\'s UTC+8 is mandated nationwide. China does not observe daylight saving time. Beijing shares its offset with Shanghai, Hong Kong, Singapore, Taipei, and Perth. The Beijing Stock Exchange and Shanghai Stock Exchange both operate on CST.',
    faqs: [
      { q: 'What time zone is Beijing in?', a: 'Beijing uses China Standard Time (CST), which is UTC+8. All of China uses a single time zone—no daylight saving is observed.' },
      { q: 'Is Beijing time the same as Shanghai time?', a: 'Yes. All of China uses China Standard Time (CST, UTC+8), so Beijing and Shanghai always have the same time.' },
      { q: 'What is the time difference between Beijing and London?', a: 'Beijing (UTC+8) is 8 hours ahead of London in winter (GMT) and 7 hours ahead in summer (BST).' },
      { q: 'What is the time difference between Beijing and New York?', a: 'Beijing (UTC+8) is 13 hours ahead of New York in winter (EST) and 12 hours ahead in summer (EDT).' },
    ],
    relatedCities: ['hong-kong', 'singapore', 'tokyo', 'seoul', 'sydney'],
    relatedTimezones: ['cst', 'hkt', 'sgt'],
  },

  // ── EUROPE ────────────────────────────────────────────────────────────────

  london: {
    name: 'London', country: 'United Kingdom', countryCode: 'GB', region: 'Europe',
    timezone: 'Europe/London', utcOffset: '+0:00 / +1:00', utcLabel: 'UTC+0 / UTC+1 (BST)',
    tzName: 'Greenwich Mean Time / British Summer Time', tzAbbr: 'GMT/BST', dst: true,
    dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October',
    lat: 51.5074, lon: -0.1278, geoRegion: 'GB-ENG',
    currency: 'GBP', callingCode: '+44',
    heroDescription: 'London operates on GMT (UTC+0) in winter and BST (UTC+1) in summer. As the global financial capital and home of Greenwich—the origin of world time—London\'s time zone is the benchmark against which all others are measured.',
    overview: 'London is the capital of the United Kingdom and one of the world\'s three primary financial centers alongside New York and Tokyo. Home to the London Stock Exchange, the Bank of England, and Lloyd\'s of London, the city processes an enormous share of global financial transactions. London uses Greenwich Mean Time (GMT, UTC+0) in winter and switches to British Summer Time (BST, UTC+1) from the last Sunday in March to the last Sunday in October. Greenwich, a borough of London, is the historic home of the prime meridian—making London the benchmark from which all time zones worldwide are calculated.',
    faqs: [
      { q: 'What time zone is London in?', a: 'London uses Greenwich Mean Time (GMT, UTC+0) in winter and British Summer Time (BST, UTC+1) in summer, running from the last Sunday in March to the last Sunday in October.' },
      { q: 'When does London change its clocks?', a: 'London clocks go forward 1 hour to BST (UTC+1) on the last Sunday of March, and back on the last Sunday of October to GMT (UTC+0).' },
      { q: 'What is the time difference between London and New York?', a: 'London is normally 5 hours ahead of New York (EST) in winter and 4 hours ahead in summer when both cities observe DST. For brief periods in spring/autumn when DST transitions fall on different dates, the gap may be 4 or 5 hours.' },
      { q: 'What is the time difference between London and Dubai?', a: 'Dubai (UTC+4) is 4 hours ahead of London in winter (GMT) and 3 hours ahead in summer (BST). Dubai never changes its clocks.' },
      { q: 'What is the time difference between London and Sydney?', a: 'The difference varies by season due to both cities observing DST at opposite times of year. It typically ranges from 9 to 11 hours, with Sydney ahead of London.' },
      { q: 'What are business hours in London?', a: 'Standard business hours are Monday to Friday, 9:00 AM to 5:30 PM GMT/BST. The City of London financial district often starts earlier, with trading floors active from 7:00 AM.' },
      { q: 'Is GMT the same as UTC?', a: 'For practical time-keeping purposes, yes—both are UTC+0. But they differ technically: UTC is maintained by atomic clocks, while GMT is a time zone based on solar time at the Greenwich meridian.' },
    ],
    relatedCities: ['new-york', 'dubai', 'paris', 'berlin', 'sydney', 'singapore'],
    relatedTimezones: ['gmt', 'est', 'cet'],
  },

  paris: {
    name: 'Paris', country: 'France', countryCode: 'FR', region: 'Europe',
    timezone: 'Europe/Paris', utcOffset: '+1:00 / +2:00', utcLabel: 'UTC+1 / UTC+2 (CEST)',
    tzName: 'Central European Time / Central European Summer Time', tzAbbr: 'CET/CEST', dst: true,
    dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October',
    lat: 48.8566, lon: 2.3522, geoRegion: 'FR-75',
    currency: 'EUR', callingCode: '+33',
    heroDescription: 'Paris runs on CET (UTC+1) in winter and CEST (UTC+2) in summer. The City of Light is France\'s diplomatic, economic, and cultural capital—and a key node in European time zone coordination.',
    overview: 'Paris is the capital of France and one of Europe\'s most important cities—serving as a global hub for fashion, diplomacy, finance, and culture. Paris uses Central European Time (CET, UTC+1) in winter, switching to Central European Summer Time (CEST, UTC+2) from the last Sunday in March to the last Sunday in October. As a member of the Eurozone and a major stock exchange hub (Euronext Paris), Paris shares its time zone with Berlin, Madrid, Rome, and Amsterdam—making intra-European business coordination seamless.',
    faqs: [
      { q: 'What time zone is Paris in?', a: 'Paris uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
      { q: 'What is the time difference between Paris and London?', a: 'Paris is 1 hour ahead of London both in winter (CET vs GMT) and in summer (CEST vs BST), as both cities change clocks on the same dates.' },
      { q: 'What is the time difference between Paris and New York?', a: 'Paris (CET, UTC+1) is 6 hours ahead of New York (EST) in winter and 5 hours ahead in summer when both observe summer time.' },
      { q: 'What is the time difference between Paris and Dubai?', a: 'Paris (CET, UTC+1 in winter) is 3 hours behind Dubai (UTC+4). In summer (CEST, UTC+2), Paris is 2 hours behind Dubai.' },
      { q: 'Does France observe daylight saving time?', a: 'Yes. France switches to CEST (UTC+2) on the last Sunday in March and returns to CET (UTC+1) on the last Sunday in October.' },
    ],
    relatedCities: ['london', 'berlin', 'madrid', 'rome', 'amsterdam', 'new-york'],
    relatedTimezones: ['cet', 'gmt', 'est'],
  },

  berlin: {
    name: 'Berlin', country: 'Germany', countryCode: 'DE', region: 'Europe',
    timezone: 'Europe/Berlin', utcOffset: '+1:00 / +2:00', utcLabel: 'UTC+1 / UTC+2 (CEST)',
    tzName: 'Central European Time / Central European Summer Time', tzAbbr: 'CET/CEST', dst: true,
    dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October',
    lat: 52.5200, lon: 13.4050, geoRegion: 'DE-BE',
    currency: 'EUR', callingCode: '+49',
    heroDescription: 'Berlin uses CET (UTC+1) in winter and CEST (UTC+2) in summer. Germany\'s capital and Europe\'s startup hub is at the heart of Central European time—1 hour ahead of London and perfectly aligned with Paris, Madrid, and Warsaw.',
    overview: 'Berlin is the capital of Germany and the most populous city in the European Union. As Germany\'s economic and political center, it hosts major tech companies, venture capital firms, and the German government. Berlin uses Central European Time (CET, UTC+1) in winter, switching to Central European Summer Time (CEST, UTC+2) in summer. The Frankfurt Stock Exchange (Deutsche Börse), Germany\'s primary exchange, operates on the same time zone as Berlin. Berlin shares CET/CEST with 20+ European countries, making it the most geographically central of the major European time zone cities.',
    faqs: [
      { q: 'What time zone is Berlin in?', a: 'Berlin uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
      { q: 'Is Berlin time the same as Paris time?', a: 'Yes. Both Berlin and Paris use CET in winter and CEST in summer, following the same DST schedule. There is no time difference.' },
      { q: 'What is the time difference between Berlin and London?', a: 'Berlin is 1 hour ahead of London in both winter (CET vs GMT) and summer (CEST vs BST), as both switch clocks on the same date.' },
      { q: 'What is the time difference between Berlin and New York?', a: 'Berlin is 6 hours ahead of New York in winter (CET vs EST) and 5 hours ahead in summer (CEST vs EDT).' },
      { q: 'Does Germany observe daylight saving time?', a: 'Yes. Germany switches to CEST (UTC+2) on the last Sunday in March and returns to CET (UTC+1) on the last Sunday in October, in line with EU DST rules.' },
    ],
    relatedCities: ['london', 'paris', 'amsterdam', 'vienna', 'warsaw', 'new-york'],
    relatedTimezones: ['cet', 'gmt', 'eet'],
  },

  rome: {
    name: 'Rome', country: 'Italy', countryCode: 'IT', region: 'Europe',
    timezone: 'Europe/Rome', utcOffset: '+1:00 / +2:00', utcLabel: 'UTC+1 / UTC+2 (CEST)',
    tzName: 'Central European Time / Central European Summer Time', tzAbbr: 'CET/CEST', dst: true,
    dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October',
    lat: 41.9028, lon: 12.4964, geoRegion: 'IT-RM',
    currency: 'EUR', callingCode: '+39',
    heroDescription: 'Rome runs on CET (UTC+1) in winter and CEST (UTC+2) in summer. Italy\'s capital—one of Europe\'s oldest and most historic cities—is the seat of the Italian government and home to the Vatican, perfectly aligned with Central European time.',
    overview: 'Rome is the capital of Italy and one of the world\'s most historically significant cities, combining ancient heritage with a modern economy. Italy\'s business landscape includes fashion, luxury goods, tourism, and manufacturing. Rome uses Central European Time (CET, UTC+1), switching to CEST (UTC+2) in summer alongside all other Central European countries. The Borsa Italiana (Italian Stock Exchange) operates on Rome time. Rome is 1 hour ahead of London and aligned with Paris, Berlin, and Madrid throughout the year.',
    faqs: [
      { q: 'What time zone is Rome in?', a: 'Rome uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
      { q: 'Is Rome time the same as Paris and Berlin time?', a: 'Yes. Rome, Paris, and Berlin all use CET in winter and CEST in summer. There are no time differences among these cities.' },
      { q: 'What is the time difference between Rome and London?', a: 'Rome is always 1 hour ahead of London—in winter (CET vs GMT) and in summer (CEST vs BST).' },
      { q: 'What is the time difference between Rome and New York?', a: 'Rome is 6 hours ahead of New York in winter and 5 hours ahead in summer.' },
    ],
    relatedCities: ['london', 'paris', 'berlin', 'madrid', 'athens'],
    relatedTimezones: ['cet', 'gmt', 'eet'],
  },

  madrid: {
    name: 'Madrid', country: 'Spain', countryCode: 'ES', region: 'Europe',
    timezone: 'Europe/Madrid', utcOffset: '+1:00 / +2:00', utcLabel: 'UTC+1 / UTC+2 (CEST)',
    tzName: 'Central European Time / Central European Summer Time', tzAbbr: 'CET/CEST', dst: true,
    dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October',
    lat: 40.4168, lon: -3.7038, geoRegion: 'ES-MD',
    currency: 'EUR', callingCode: '+34',
    heroDescription: 'Madrid operates on CET (UTC+1) in winter and CEST (UTC+2) in summer. Spain\'s capital and financial center uses the same time as Central Europe despite being geographically closer to the GMT meridian—a legacy of Franco-era alignment with Nazi Germany.',
    overview: 'Madrid is the capital and largest city of Spain, serving as the country\'s political, economic, and cultural center. Spain uses Central European Time (CET, UTC+1) despite being geographically close to the GMT meridian—a decision made in 1940 to align with Nazi Germany. Madrid houses the Madrid Stock Exchange (Bolsa de Madrid) and major multinational headquarters. Like all of the EU, it observes summer time (CEST, UTC+2) from the last Sunday in March to the last Sunday in October.',
    faqs: [
      { q: 'What time zone is Madrid in?', a: 'Madrid uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
      { q: 'Why is Spain on CET instead of GMT?', a: 'Spain adopted Central European Time in 1940 under Franco to align with Nazi Germany and Fascist Italy. Geographically, Spain is mostly in the GMT zone, but it has used CET ever since.' },
      { q: 'What is the time difference between Madrid and London?', a: 'Madrid is 1 hour ahead of London throughout the year—both in winter (CET vs GMT) and in summer (CEST vs BST).' },
      { q: 'Is Madrid time the same as Paris time?', a: 'Yes. Madrid and Paris both use CET in winter and CEST in summer. There is no time difference.' },
    ],
    relatedCities: ['london', 'paris', 'berlin', 'rome', 'lisbon'],
    relatedTimezones: ['cet', 'gmt', 'wet'],
  },

  amsterdam: {
    name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'Europe',
    timezone: 'Europe/Amsterdam', utcOffset: '+1:00 / +2:00', utcLabel: 'UTC+1 / UTC+2 (CEST)',
    tzName: 'Central European Time / Central European Summer Time', tzAbbr: 'CET/CEST', dst: true,
    dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October',
    lat: 52.3676, lon: 4.9041, geoRegion: 'NL-NH',
    currency: 'EUR', callingCode: '+31',
    heroDescription: 'Amsterdam runs on CET (UTC+1) in winter and CEST (UTC+2) in summer. The Dutch capital is home to Euronext Amsterdam, one of Europe\'s oldest stock exchanges, and ASML—a critical node in global tech supply chains.',
    overview: 'Amsterdam is the capital of the Netherlands and a major European financial and technology hub. Euronext Amsterdam, one of the world\'s oldest stock exchanges, is headquartered here, as is ASML—the world\'s sole manufacturer of extreme ultraviolet lithography machines critical to semiconductor production. Amsterdam uses Central European Time (CET, UTC+1) in winter and CEST (UTC+2) in summer, in sync with all other Central European financial centers.',
    faqs: [
      { q: 'What time zone is Amsterdam in?', a: 'Amsterdam uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
      { q: 'Is Amsterdam time the same as Berlin time?', a: 'Yes. Amsterdam, Berlin, Paris, and Rome all share CET/CEST and observe DST on the same dates. There is no time difference.' },
      { q: 'What is the time difference between Amsterdam and London?', a: 'Amsterdam is 1 hour ahead of London throughout the year.' },
    ],
    relatedCities: ['london', 'berlin', 'paris', 'brussels', 'frankfurt'],
    relatedTimezones: ['cet', 'gmt'],
  },

  istanbul: {
    name: 'Istanbul', country: 'Turkey', countryCode: 'TR', region: 'Europe',
    timezone: 'Europe/Istanbul', utcOffset: '+3:00', utcLabel: 'UTC+3',
    tzName: 'Turkey Time', tzAbbr: 'TRT', dst: false,
    lat: 41.0082, lon: 28.9784, geoRegion: 'TR-34',
    currency: 'TRY', callingCode: '+90',
    heroDescription: 'Istanbul uses Turkey Time (TRT, UTC+3) year-round since 2016, when Turkey permanently adopted summer time and stopped changing clocks. Straddling Europe and Asia, Istanbul is uniquely positioned to bridge both continents.',
    overview: 'Istanbul is Turkey\'s largest city and its economic, cultural, and historic heart, straddling the Bosphorus strait between Europe and Asia. Turkey permanently adopted UTC+3 in 2016 after ending daylight saving time adjustments. This means Istanbul now shares its time zone year-round with Moscow, Riyadh, and Baghdad—sitting 3 hours ahead of London in winter and 2 hours ahead in summer. Istanbul\'s Borsa İstanbul (BIST) is one of the largest stock exchanges in the region.',
    faqs: [
      { q: 'What time zone is Istanbul in?', a: 'Istanbul uses Turkey Time (TRT), which is UTC+3 year-round. Turkey stopped observing daylight saving time in September 2016.' },
      { q: 'Does Turkey observe daylight saving time?', a: 'No. Since September 2016, Turkey permanently uses UTC+3 (Turkey Time) with no seasonal clock changes.' },
      { q: 'What is the time difference between Istanbul and London?', a: 'Istanbul (UTC+3) is 3 hours ahead of London in winter (GMT) and 2 hours ahead in summer (BST).' },
      { q: 'Is Istanbul time the same as Moscow time?', a: 'Yes. Both Istanbul (TRT) and Moscow (MSK) are at UTC+3 year-round with no daylight saving adjustments.' },
      { q: 'What is the time difference between Istanbul and Dubai?', a: 'Istanbul (UTC+3) is 1 hour behind Dubai (UTC+4). When it is 10:00 AM in Istanbul, it is 11:00 AM in Dubai.' },
    ],
    relatedCities: ['london', 'dubai', 'moscow', 'riyadh', 'athens'],
    relatedTimezones: ['trt', 'msk', 'ast'],
  },

  oslo: {
    name: 'Oslo', country: 'Norway', countryCode: 'NO', region: 'Europe',
    timezone: 'Europe/Oslo', utcOffset: '+1:00 / +2:00', utcLabel: 'UTC+1 / UTC+2 (CEST)',
    tzName: 'Central European Time / Central European Summer Time', tzAbbr: 'CET/CEST', dst: true,
    dstStart: 'Last Sunday in March', dstEnd: 'Last Sunday in October',
    lat: 59.9139, lon: 10.7522, geoRegion: 'NO-03',
    currency: 'NOK', callingCode: '+47',
    heroDescription: 'Oslo runs on CET (UTC+1) in winter and CEST (UTC+2) in summer. Norway\'s capital is Scandinavia\'s oil and shipping hub, home to the Oslo Stock Exchange and a booming tech scene.',
    overview: 'Oslo is the capital of Norway and the economic center of Scandinavia. Norway is one of the world\'s largest oil exporters, and Oslo hosts the Oslo Stock Exchange (Oslo Børs) and Equinor (formerly Statoil) headquarters. Oslo uses Central European Time (CET, UTC+1) in winter and CEST (UTC+2) in summer—in line with continental European neighbors and 1 hour ahead of London year-round. Despite being geographically northern, Oslo\'s financial and tech sectors maintain strong ties with London, New York, and Singapore.',
    faqs: [
      { q: 'What time zone is Oslo in?', a: 'Oslo uses Central European Time (CET, UTC+1) in winter and Central European Summer Time (CEST, UTC+2) in summer.' },
      { q: 'Is Oslo time the same as Stockholm and Copenhagen?', a: 'Yes. Oslo, Stockholm (Sweden), and Copenhagen (Denmark) all use CET in winter and CEST in summer with no time differences.' },
      { q: 'What is the time difference between Oslo and London?', a: 'Oslo is 1 hour ahead of London year-round—CET vs GMT in winter, CEST vs BST in summer.' },
      { q: 'What is the time difference between Oslo and New York?', a: 'Oslo (CET, UTC+1) is 6 hours ahead of New York (EST) in winter and 5 hours ahead in summer (CEST vs EDT).' },
    ],
    relatedCities: ['london', 'berlin', 'paris', 'stockholm', 'copenhagen'],
    relatedTimezones: ['cet', 'gmt'],
  },

  // ── AMERICAS ──────────────────────────────────────────────────────────────

  'new-york': {
    name: 'New York', country: 'United States', countryCode: 'US', region: 'Americas',
    timezone: 'America/New_York', utcOffset: '-5:00 / -4:00', utcLabel: 'UTC−5 / UTC−4 (EDT)',
    tzName: 'Eastern Standard Time / Eastern Daylight Time', tzAbbr: 'EST/EDT', dst: true,
    dstStart: 'Second Sunday in March', dstEnd: 'First Sunday in November',
    lat: 40.7128, lon: -74.0060, geoRegion: 'US-NY',
    currency: 'USD', callingCode: '+1',
    heroDescription: 'New York uses Eastern Standard Time (EST, UTC−5) in winter and Eastern Daylight Time (EDT, UTC−4) in summer. Home to NYSE and NASDAQ, it\'s the world\'s leading financial center—and its time zone sets the pulse for global markets every morning.',
    overview: 'New York City is the financial capital of the world and home to the New York Stock Exchange (NYSE) and NASDAQ—together accounting for the largest share of global equity market capitalization. New York uses Eastern Standard Time (EST, UTC−5) in winter and Eastern Daylight Time (EDT, UTC−4) during daylight saving time (second Sunday in March through first Sunday in November). NY\'s time zone places it 5 hours behind London in winter, 9 hours behind Dubai, and 13 hours behind Singapore—making the 9:30 AM NYSE open a critical synchronization point for global trading.',
    faqs: [
      { q: 'What time zone is New York in?', a: 'New York uses Eastern Standard Time (EST, UTC−5) in winter and Eastern Daylight Time (EDT, UTC−4) during daylight saving time (second Sunday in March to first Sunday in November).' },
      { q: 'When does New York change its clocks?', a: 'New York clocks spring forward 1 hour on the second Sunday of March (to EDT, UTC−4) and fall back on the first Sunday of November (to EST, UTC−5).' },
      { q: 'What is the time difference between New York and London?', a: 'New York is normally 5 hours behind London in winter (EST vs GMT) and 4 hours behind in summer when both cities observe daylight saving time.' },
      { q: 'What is the time difference between New York and Dubai?', a: 'Dubai (UTC+4) is 9 hours ahead of New York in winter (EST) and 8 hours ahead in summer (EDT). Dubai never changes its clocks.' },
      { q: 'What is the NYSE trading schedule?', a: 'The New York Stock Exchange (NYSE) trades Monday to Friday, 9:30 AM to 4:00 PM Eastern Time (EST or EDT, depending on the season).' },
      { q: 'What is the time difference between New York and Los Angeles?', a: 'Los Angeles (PST/PDT) is 3 hours behind New York. When it is 12:00 PM in New York, it is 9:00 AM in Los Angeles.' },
    ],
    relatedCities: ['london', 'los-angeles', 'chicago', 'toronto', 'dubai', 'paris'],
    relatedTimezones: ['est', 'gmt', 'cst'],
  },

  'los-angeles': {
    name: 'Los Angeles', country: 'United States', countryCode: 'US', region: 'Americas',
    timezone: 'America/Los_Angeles', utcOffset: '-8:00 / -7:00', utcLabel: 'UTC−8 / UTC−7 (PDT)',
    tzName: 'Pacific Standard Time / Pacific Daylight Time', tzAbbr: 'PST/PDT', dst: true,
    dstStart: 'Second Sunday in March', dstEnd: 'First Sunday in November',
    lat: 34.0522, lon: -118.2437, geoRegion: 'US-CA',
    currency: 'USD', callingCode: '+1',
    heroDescription: 'Los Angeles uses PST (UTC−8) in winter and PDT (UTC−7) in summer. The entertainment capital of the world—home to Hollywood, Silicon Beach, and major tech hubs—is the gateway between the US and Asia-Pacific time zones.',
    overview: 'Los Angeles is the second-largest city in the United States and the entertainment capital of the world. Beyond Hollywood, it is also a major technology hub (Silicon Beach) and the largest US port complex (Port of Los Angeles/Long Beach). LA uses Pacific Standard Time (PST, UTC−8) in winter and Pacific Daylight Time (PDT, UTC−7) in summer. Its position 3 hours behind New York and 16 hours behind Sydney (in winter) makes it the last major US city to start the business day—but the first to overlap with Asian markets in the early morning.',
    faqs: [
      { q: 'What time zone is Los Angeles in?', a: 'Los Angeles uses Pacific Standard Time (PST, UTC−8) in winter and Pacific Daylight Time (PDT, UTC−7) during daylight saving time.' },
      { q: 'What is the time difference between Los Angeles and New York?', a: 'Los Angeles is 3 hours behind New York year-round (PST vs EST in winter, PDT vs EDT in summer).' },
      { q: 'What is the time difference between Los Angeles and London?', a: 'Los Angeles (PST, UTC−8) is 8 hours behind London in winter and 7-8 hours behind in summer (depending on when each city switches DST).' },
      { q: 'What is the time difference between Los Angeles and Tokyo?', a: 'Tokyo (JST, UTC+9) is 17 hours ahead of Los Angeles in winter (PST) and 16 hours ahead in summer (PDT).' },
    ],
    relatedCities: ['new-york', 'chicago', 'seattle', 'toronto', 'tokyo', 'sydney'],
    relatedTimezones: ['pst', 'est', 'jst'],
  },

  chicago: {
    name: 'Chicago', country: 'United States', countryCode: 'US', region: 'Americas',
    timezone: 'America/Chicago', utcOffset: '-6:00 / -5:00', utcLabel: 'UTC−6 / UTC−5 (CDT)',
    tzName: 'Central Standard Time / Central Daylight Time', tzAbbr: 'CST/CDT', dst: true,
    dstStart: 'Second Sunday in March', dstEnd: 'First Sunday in November',
    lat: 41.8781, lon: -87.6298, geoRegion: 'US-IL',
    currency: 'USD', callingCode: '+1',
    heroDescription: 'Chicago operates on CST (UTC−6) in winter and CDT (UTC−5) in summer. Home to CME Group—the world\'s largest futures exchange—and a major transportation hub, Chicago\'s Central Time bridges the East and West coasts.',
    overview: 'Chicago is the third-largest city in the United States and a critical hub for finance, manufacturing, and transportation. The CME Group (Chicago Mercantile Exchange), the CBOE (Chicago Board Options Exchange), and the Chicago Board of Trade are all based here, making Chicago the world\'s futures and options trading capital. Chicago uses Central Standard Time (CST, UTC−6) in winter and Central Daylight Time (CDT, UTC−5) in summer. It is 1 hour behind New York and 2 hours ahead of Los Angeles year-round.',
    faqs: [
      { q: 'What time zone is Chicago in?', a: 'Chicago uses Central Standard Time (CST, UTC−6) in winter and Central Daylight Time (CDT, UTC−5) during daylight saving time.' },
      { q: 'What is the time difference between Chicago and New York?', a: 'Chicago is 1 hour behind New York. When it is 12:00 PM in New York, it is 11:00 AM in Chicago.' },
      { q: 'What is the time difference between Chicago and London?', a: 'Chicago (CST, UTC−6) is 6 hours behind London in winter and 5 hours behind in summer.' },
      { q: 'What is the time difference between Chicago and Los Angeles?', a: 'Chicago is 2 hours ahead of Los Angeles year-round (CST vs PST in winter, CDT vs PDT in summer).' },
    ],
    relatedCities: ['new-york', 'los-angeles', 'toronto', 'london', 'dallas'],
    relatedTimezones: ['cst', 'est', 'pst'],
  },

  toronto: {
    name: 'Toronto', country: 'Canada', countryCode: 'CA', region: 'Americas',
    timezone: 'America/Toronto', utcOffset: '-5:00 / -4:00', utcLabel: 'UTC−5 / UTC−4 (EDT)',
    tzName: 'Eastern Standard Time / Eastern Daylight Time', tzAbbr: 'EST/EDT', dst: true,
    dstStart: 'Second Sunday in March', dstEnd: 'First Sunday in November',
    lat: 43.6510, lon: -79.3470, geoRegion: 'CA-ON',
    currency: 'CAD', callingCode: '+1',
    heroDescription: 'Toronto runs on Eastern Standard Time (EST, UTC−5) in winter and EDT (UTC−4) in summer—the same schedule as New York. Canada\'s financial capital and largest city, it houses the Toronto Stock Exchange and is a leading global financial center.',
    overview: 'Toronto is the largest city in Canada and one of the most diverse cities in the world. It serves as Canada\'s financial hub, home to the Toronto Stock Exchange (TSX)—the third-largest in North America—and major banks including RBC, TD, and Scotiabank. Toronto uses Eastern Standard Time (EST, UTC−5) and observes daylight saving time on the same schedule as New York, making coordination between the two cities seamless. In fact, Toronto and New York are in the same time zone and always show the same time.',
    faqs: [
      { q: 'What time zone is Toronto in?', a: 'Toronto uses Eastern Standard Time (EST, UTC−5) in winter and Eastern Daylight Time (EDT, UTC−4) in summer, on the same schedule as New York.' },
      { q: 'Is Toronto time the same as New York time?', a: 'Yes. Toronto and New York are both in the Eastern Time Zone and observe DST on the same dates. They always show the same time.' },
      { q: 'What is the time difference between Toronto and London?', a: 'Toronto (EST/EDT) is 5 hours behind London in winter and 4 hours behind in summer—the same as New York.' },
      { q: 'What are TSX trading hours?', a: 'The Toronto Stock Exchange (TSX) trades Monday to Friday, 9:30 AM to 4:00 PM Eastern Time—identical to NYSE hours.' },
    ],
    relatedCities: ['new-york', 'chicago', 'los-angeles', 'london', 'montreal'],
    relatedTimezones: ['est', 'gmt', 'cst'],
  },

  // ── PACIFIC ───────────────────────────────────────────────────────────────

  sydney: {
    name: 'Sydney', country: 'Australia', countryCode: 'AU', region: 'Pacific',
    timezone: 'Australia/Sydney', utcOffset: '+10:00 / +11:00', utcLabel: 'UTC+10 / UTC+11 (AEDT)',
    tzName: 'Australian Eastern Standard Time / Australian Eastern Daylight Time', tzAbbr: 'AEST/AEDT', dst: true,
    dstStart: 'First Sunday in October', dstEnd: 'First Sunday in April',
    lat: -33.8688, lon: 151.2093, geoRegion: 'AU-NSW',
    currency: 'AUD', callingCode: '+61',
    heroDescription: 'Sydney uses AEST (UTC+10) in winter and AEDT (UTC+11) in summer—note that Australian summer falls in the Northern Hemisphere\'s winter. Australia\'s largest city and financial hub anchors the Pacific region\'s trading day.',
    overview: 'Sydney is the largest city in Australia and its primary financial and business center, home to the Australian Securities Exchange (ASX). Sydney uses Australian Eastern Standard Time (AEST, UTC+10) in winter (April to October) and Australian Eastern Daylight Time (AEDT, UTC+11) in summer (October to April)—the Southern Hemisphere reversal means Sydney observes DST from the first Sunday in October to the first Sunday in April. This offset flip creates interesting coordination challenges with Northern Hemisphere partners, particularly London.',
    faqs: [
      { q: 'What time zone is Sydney in?', a: 'Sydney uses Australian Eastern Standard Time (AEST, UTC+10) in winter and Australian Eastern Daylight Time (AEDT, UTC+11) in summer (October to April, Southern Hemisphere summer).' },
      { q: 'Does Sydney observe daylight saving time?', a: 'Yes. New South Wales (including Sydney) observes DST from the first Sunday in October to the first Sunday in April—the reverse of the Northern Hemisphere schedule.' },
      { q: 'What is the time difference between Sydney and London?', a: 'The difference varies seasonally because both cities observe DST at opposite times of year, ranging from 9 to 11 hours, with Sydney ahead of London.' },
      { q: 'What is the time difference between Sydney and Dubai?', a: 'Sydney is 6 hours ahead of Dubai in Australian winter (AEST vs GST) and 7 hours ahead in Australian summer (AEDT vs GST).' },
      { q: 'What is the time difference between Sydney and New York?', a: 'Sydney is 15–16 hours ahead of New York, depending on the season and which city is observing DST.' },
      { q: 'What are ASX trading hours?', a: 'The Australian Securities Exchange (ASX) trades Monday to Friday, 10:00 AM to 4:00 PM AEST/AEDT.' },
    ],
    relatedCities: ['melbourne', 'auckland', 'singapore', 'tokyo', 'london', 'new-york'],
    relatedTimezones: ['aest', 'sgt', 'jst'],
  },

  // ── AFRICA ────────────────────────────────────────────────────────────────

  cairo: {
    name: 'Cairo', country: 'Egypt', countryCode: 'EG', region: 'Africa',
    timezone: 'Africa/Cairo', utcOffset: '+2:00', utcLabel: 'UTC+2',
    tzName: 'Eastern European Time', tzAbbr: 'EET', dst: false,
    lat: 30.0444, lon: 31.2357, geoRegion: 'EG-C',
    currency: 'EGP', callingCode: '+20',
    heroDescription: 'Cairo permanently uses Eastern European Time (EET, UTC+2). Egypt abandoned daylight saving time in 2011, keeping Cairo at a stable UTC+2 offset. Africa\'s largest city is 2 hours ahead of London in winter and a key hub for regional trade and finance.',
    overview: 'Cairo is the capital of Egypt and the largest city in Africa and the Arab world, with a metropolitan population exceeding 20 million. Egypt abandoned daylight saving time in 2011, and Cairo now permanently operates at UTC+2 (Eastern European Time). This stable offset is shared with Athens, Bucharest, and Kyiv (when not in summer time). Cairo is 2 hours ahead of London in winter (1 hour ahead in London\'s summer), 4 hours behind Dubai, and 7 hours ahead of New York in winter.',
    faqs: [
      { q: 'What time zone is Cairo in?', a: 'Cairo permanently uses Eastern European Time (EET), which is UTC+2. Egypt no longer observes daylight saving time since 2011.' },
      { q: 'Does Egypt observe daylight saving time?', a: 'No. Egypt abandoned daylight saving time in 2011. Cairo remains at UTC+2 throughout the entire year.' },
      { q: 'What is the time difference between Cairo and London?', a: 'Cairo (UTC+2) is 2 hours ahead of London in winter (GMT) and 1 hour ahead in summer (BST). Cairo\'s offset stays fixed while London changes.' },
      { q: 'What is the time difference between Cairo and Dubai?', a: 'Cairo (UTC+2) is 2 hours behind Dubai (UTC+4).' },
    ],
    relatedCities: ['dubai', 'istanbul', 'riyadh', 'nairobi', 'london'],
    relatedTimezones: ['eet', 'ast', 'gmt'],
  },

  nairobi: {
    name: 'Nairobi', country: 'Kenya', countryCode: 'KE', region: 'Africa',
    timezone: 'Africa/Nairobi', utcOffset: '+3:00', utcLabel: 'UTC+3',
    tzName: 'East Africa Time', tzAbbr: 'EAT', dst: false,
    lat: -1.2921, lon: 36.8219, geoRegion: 'KE-110',
    currency: 'KES', callingCode: '+254',
    heroDescription: 'Nairobi operates on East Africa Time (EAT, UTC+3) year-round. Kenya\'s capital is East Africa\'s primary financial and tech hub—often called the "Silicon Savannah"—with no daylight saving adjustments.',
    overview: 'Nairobi is the capital and largest city of Kenya and the primary economic and tech hub of East Africa. Often called the "Silicon Savannah," it hosts a thriving fintech and startup ecosystem alongside the Nairobi Securities Exchange (NSE). Nairobi uses East Africa Time (EAT, UTC+3) permanently, shared with Ethiopia, Tanzania, and Uganda. It has the same UTC offset as Riyadh, Kuwait City, and Moscow—3 hours ahead of London in winter and 1 hour behind Dubai.',
    faqs: [
      { q: 'What time zone is Nairobi in?', a: 'Nairobi uses East Africa Time (EAT), which is UTC+3. Kenya does not observe daylight saving time.' },
      { q: 'What is the time difference between Nairobi and London?', a: 'Nairobi (UTC+3) is 3 hours ahead of London in winter (GMT) and 2 hours ahead in summer (BST).' },
      { q: 'What is the time difference between Nairobi and Dubai?', a: 'Nairobi (UTC+3) is 1 hour behind Dubai (UTC+4).' },
    ],
    relatedCities: ['dubai', 'cairo', 'johannesburg', 'addis-ababa', 'london'],
    relatedTimezones: ['eat', 'ast', 'gmt'],
  },

  johannesburg: {
    name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', region: 'Africa',
    timezone: 'Africa/Johannesburg', utcOffset: '+2:00', utcLabel: 'UTC+2',
    tzName: 'South Africa Standard Time', tzAbbr: 'SAST', dst: false,
    lat: -26.2041, lon: 28.0473, geoRegion: 'ZA-GT',
    currency: 'ZAR', callingCode: '+27',
    heroDescription: 'Johannesburg uses South Africa Standard Time (SAST, UTC+2) year-round. Africa\'s financial capital and home to the Johannesburg Stock Exchange (JSE)—Africa\'s largest—maintains a stable UTC+2 offset with no seasonal changes.',
    overview: 'Johannesburg is the largest city in South Africa and the continent\'s economic powerhouse. Home to the Johannesburg Stock Exchange (JSE)—the largest in Africa—and major mining and financial conglomerates, it drives South Africa\'s economy. South Africa uses South Africa Standard Time (SAST, UTC+2) year-round with no daylight saving time, making it one of the most time-stable major cities in the world. Its UTC+2 offset is 2 hours ahead of London in winter and 2 hours behind Dubai.',
    faqs: [
      { q: 'What time zone is Johannesburg in?', a: 'Johannesburg uses South Africa Standard Time (SAST), which is UTC+2. South Africa does not observe daylight saving time.' },
      { q: 'What is the time difference between Johannesburg and London?', a: 'Johannesburg (UTC+2) is 2 hours ahead of London in winter (GMT) and 1 hour ahead in summer (BST).' },
      { q: 'What is the time difference between Johannesburg and Dubai?', a: 'Johannesburg (UTC+2) is 2 hours behind Dubai (UTC+4).' },
      { q: 'Is Johannesburg time the same as Cairo time?', a: 'Yes. Both Johannesburg (SAST) and Cairo (EET) are at UTC+2 year-round with no DST.' },
    ],
    relatedCities: ['cairo', 'nairobi', 'london', 'dubai', 'sao-paulo'],
    relatedTimezones: ['sast', 'eet', 'gmt'],
  },

  // ── ADDITIONAL KEY CITIES ─────────────────────────────────────────────────

  bangkok: {
    name: 'Bangkok', country: 'Thailand', countryCode: 'TH', region: 'Asia',
    timezone: 'Asia/Bangkok', utcOffset: '+7:00', utcLabel: 'UTC+7',
    tzName: 'Indochina Time', tzAbbr: 'ICT', dst: false,
    lat: 13.7563, lon: 100.5018, geoRegion: 'TH-10',
    currency: 'THB', callingCode: '+66',
    heroDescription: 'Bangkok uses Indochina Time (ICT, UTC+7) year-round. Thailand\'s capital—Southeast Asia\'s most visited city—operates on a stable, no-DST schedule 7 hours ahead of UTC.',
    overview: 'Bangkok is the capital and primate city of Thailand, serving as the country\'s political, commercial, and cultural center. Thailand uses Indochina Time (ICT, UTC+7) permanently with no daylight saving time. Bangkok is 7 hours ahead of London in winter, 2 hours behind Singapore, and 3 hours ahead of Dubai. Its time zone is shared with Ho Chi Minh City, Hanoi, Phnom Penh, and Jakarta. Bangkok is a key hub for regional business, particularly in tourism, manufacturing, and finance.',
    faqs: [
      { q: 'What time zone is Bangkok in?', a: 'Bangkok uses Indochina Time (ICT), which is UTC+7. Thailand does not observe daylight saving time.' },
      { q: 'What is the time difference between Bangkok and London?', a: 'Bangkok (UTC+7) is 7 hours ahead of London in winter (GMT) and 6 hours ahead in summer (BST).' },
      { q: 'What is the time difference between Bangkok and Singapore?', a: 'Singapore (UTC+8) is 1 hour ahead of Bangkok (UTC+7). Neither city observes DST.' },
      { q: 'What is the time difference between Bangkok and Dubai?', a: 'Bangkok (UTC+7) is 3 hours ahead of Dubai (UTC+4).' },
    ],
    relatedCities: ['singapore', 'kuala-lumpur', 'hong-kong', 'dubai', 'london'],
    relatedTimezones: ['ict', 'sgt', 'gst'],
  },

  'kuala-lumpur': {
    name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', region: 'Asia',
    timezone: 'Asia/Kuala_Lumpur', utcOffset: '+8:00', utcLabel: 'UTC+8',
    tzName: 'Malaysia Time', tzAbbr: 'MYT', dst: false,
    lat: 3.1390, lon: 101.6869, geoRegion: 'MY-14',
    currency: 'MYR', callingCode: '+60',
    heroDescription: 'Kuala Lumpur uses Malaysia Time (MYT, UTC+8) year-round. Malaysia\'s capital shares its UTC+8 offset with Singapore, making cross-border business between the two neighbors completely time-seamless.',
    overview: 'Kuala Lumpur is the capital and largest city of Malaysia, serving as the country\'s economic, cultural, and financial hub. Malaysia uses Malaysia Time (MYT, UTC+8) year-round with no daylight saving time. KL shares its UTC+8 offset with Singapore (which is directly to the south), Hong Kong, Beijing, and Perth. The Bursa Malaysia stock exchange operates on MYT. Kuala Lumpur is a major hub for Islamic finance and a growing destination for regional tech investment.',
    faqs: [
      { q: 'What time zone is Kuala Lumpur in?', a: 'Kuala Lumpur uses Malaysia Time (MYT), which is UTC+8. Malaysia does not observe daylight saving time.' },
      { q: 'Is KL time the same as Singapore time?', a: 'Yes. Both Kuala Lumpur (MYT) and Singapore (SGT) are at UTC+8. There is no time difference between them.' },
      { q: 'What is the time difference between Kuala Lumpur and London?', a: 'Kuala Lumpur (UTC+8) is 8 hours ahead of London in winter and 7 hours ahead in summer.' },
      { q: 'What is the time difference between Kuala Lumpur and Dubai?', a: 'Kuala Lumpur (UTC+8) is 4 hours ahead of Dubai (UTC+4). Neither observes DST.' },
    ],
    relatedCities: ['singapore', 'bangkok', 'jakarta', 'hong-kong', 'dubai'],
    relatedTimezones: ['myt', 'sgt', 'ict'],
  },
};

// Generate slug from city name
export function getCitySlug(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Get all city slugs that have SEO data
export function getAllCitySlugs() {
  return Object.keys(CITY_SEO_DATA);
}

// Get city data by slug
export function getCityData(slug) {
  return CITY_SEO_DATA[slug] || null;
}
