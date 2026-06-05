/**
 * timezoneData.js
 * Data for all /timezone/:tz pages — unique content, FAQs, schema per timezone.
 */

export const TIMEZONE_DATA = {
  utc: {
    abbr: 'UTC', fullName: 'Coordinated Universal Time', offset: '+0:00', utcLabel: 'UTC+0',
    ianaTz: 'UTC', dst: false,
    countries: ['Used worldwide as the international time standard'],
    cities: ['Reykjavik', 'Accra', 'Dakar', 'Monrovia', 'Abidjan'],
    description: 'Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time. It is maintained by a network of over 400 atomic clocks in 70 national laboratories worldwide, coordinated by the International Bureau of Weights and Measures (BIPM). UTC replaced Greenwich Mean Time (GMT) as the world standard in 1972 and serves as the reference point from which all other time zones are calculated. UTC+0 is observed as a local time in Iceland, Ghana, and several West African nations, and is used universally in aviation, maritime navigation, computing, and international broadcasting.',
    faqs: [
      { q: 'What is UTC?', a: 'UTC (Coordinated Universal Time) is the world\'s primary time standard, maintained by atomic clocks and used as the reference point for all other time zones. It replaced GMT as the international standard in 1972.' },
      { q: 'What is the difference between UTC and GMT?', a: 'UTC and GMT are both UTC+0, but they differ technically. UTC is maintained by atomic clocks and is the international civil standard. GMT is a time zone based on solar time at the Greenwich meridian. For practical purposes of telling the time, they are identical.' },
      { q: 'Which countries use UTC as their local time?', a: 'Iceland (year-round), Ghana, Ivory Coast, Senegal, Guinea, Togo, Burkina Faso, Mali, Sierra Leone, and several other West African countries use UTC+0 as their permanent local time.' },
      { q: 'Why is UTC used in aviation and computing?', a: 'UTC provides a single unambiguous reference time that eliminates confusion caused by different time zones and daylight saving schedules. Aviation uses UTC (called Zulu time) for flight plans and communications. Computing systems log events in UTC to allow accurate cross-timezone comparison.' },
    ],
    relatedTimezones: ['gmt', 'est', 'cet', 'ist'],
    relatedCities: ['london', 'reykjavik'],
  },

  gmt: {
    abbr: 'GMT', fullName: 'Greenwich Mean Time', offset: '+0:00', utcLabel: 'UTC+0',
    ianaTz: 'Europe/London', dst: false,
    countries: ['United Kingdom (winter)', 'Ireland (winter)', 'Portugal (winter)', 'Ghana', 'Iceland'],
    cities: ['London', 'Dublin', 'Lisbon', 'Reykjavik', 'Accra', 'Dakar'],
    description: 'Greenwich Mean Time (GMT) is the time zone at UTC+0, historically defined by the mean solar time at the Royal Observatory in Greenwich, London. It is the time standard from which all other world time zones are offset. In winter, the United Kingdom, Ireland, and Portugal observe GMT. In summer, these countries switch to daylight saving time (BST, WEST respectively). GMT itself does not change—it remains at UTC+0 year-round. Some countries (like Ghana and Iceland) use GMT as a permanent local time without seasonal adjustments.',
    faqs: [
      { q: 'What is GMT?', a: 'GMT (Greenwich Mean Time) is the time at UTC+0, historically defined by the mean solar time at the Royal Observatory in Greenwich, London. It is the baseline from which all other time zones are measured.' },
      { q: 'Is GMT the same as UTC?', a: 'For practical purposes of telling the time, yes—both are UTC+0. The difference is technical: UTC is maintained by atomic clocks, while GMT is based on the Earth\'s rotation. They are never more than 0.9 seconds apart.' },
      { q: 'Which countries are in GMT?', a: 'The UK and Ireland use GMT in winter (switching to BST in summer). Portugal uses WET (Western European Time, also UTC+0) in winter. Iceland and Ghana use UTC+0 year-round.' },
      { q: 'What countries are currently on GMT year-round?', a: 'Iceland uses UTC+0 permanently. Most West African countries (Ghana, Ivory Coast, Senegal, Gambia, Togo, Burkina Faso, Guinea, Sierra Leone, Liberia) observe UTC+0 without DST.' },
    ],
    relatedTimezones: ['utc', 'bst', 'cet', 'est'],
    relatedCities: ['london', 'dublin', 'lisbon'],
  },

  est: {
    abbr: 'EST', fullName: 'Eastern Standard Time', offset: '-5:00', utcLabel: 'UTC−5',
    ianaTz: 'America/New_York', dst: false,
    countries: ['United States (eastern states, winter)', 'Canada (Ontario, Quebec, winter)', 'Jamaica', 'Panama'],
    cities: ['New York', 'Toronto', 'Boston', 'Miami', 'Washington DC', 'Atlanta', 'Philadelphia', 'Kingston', 'Panama City'],
    description: 'Eastern Standard Time (EST) is the time zone at UTC−5, observed in the eastern United States and Canada during the winter months (November to March). EST covers the US East Coast—including New York, Boston, Washington DC, Miami, and Toronto—the most economically significant time zone in the Western Hemisphere. During daylight saving time (second Sunday in March to first Sunday in November), most EST regions switch to Eastern Daylight Time (EDT, UTC−4). EST is home to the New York Stock Exchange and NASDAQ, making it the financial time zone of the Americas.',
    faqs: [
      { q: 'What is Eastern Standard Time (EST)?', a: 'EST is UTC−5, observed in the eastern United States and Canada during winter (first Sunday in November to second Sunday in March). It switches to EDT (UTC−4) during summer daylight saving time.' },
      { q: 'What states are in the EST zone?', a: 'All or part of: New York, New Jersey, Connecticut, Massachusetts, Rhode Island, Vermont, New Hampshire, Maine, Pennsylvania, Delaware, Maryland, Virginia, West Virginia, North Carolina, South Carolina, Georgia, Florida, Ohio, Indiana (most), Michigan, and Kentucky (eastern part).' },
      { q: 'What is the difference between EST and EDT?', a: 'EST is UTC−5 (standard time, winter). EDT is UTC−4 (daylight saving time, summer). The switch happens on the second Sunday of March (forward) and the first Sunday of November (back).' },
      { q: 'What is the time difference between EST and GMT?', a: 'EST (UTC−5) is 5 hours behind GMT (UTC+0). When it is 12:00 PM (noon) GMT, it is 7:00 AM EST.' },
    ],
    relatedTimezones: ['edt', 'cst', 'gmt', 'pst'],
    relatedCities: ['new-york', 'toronto', 'miami', 'boston'],
  },

  edt: {
    abbr: 'EDT', fullName: 'Eastern Daylight Time', offset: '-4:00', utcLabel: 'UTC−4',
    ianaTz: 'America/New_York', dst: true,
    countries: ['United States (eastern states, summer)', 'Canada (Ontario, Quebec, summer)'],
    cities: ['New York', 'Toronto', 'Boston', 'Miami', 'Washington DC', 'Atlanta', 'Philadelphia'],
    description: 'Eastern Daylight Time (EDT) is the daylight saving time zone at UTC−4, observed in the eastern United States and Canada from the second Sunday in March to the first Sunday in November. During EDT, clocks are set 1 hour ahead of Eastern Standard Time (EST, UTC−5) to extend evening daylight. EDT is active for approximately 7–8 months of the year—longer than EST—making it the dominant offset for eastern North America for most of the calendar year.',
    faqs: [
      { q: 'What is Eastern Daylight Time (EDT)?', a: 'EDT is UTC−4, the daylight saving time offset for the eastern US and Canada, active from the second Sunday in March to the first Sunday in November.' },
      { q: 'When does EDT start and end?', a: 'EDT begins on the second Sunday in March (clocks spring forward 1 hour at 2:00 AM) and ends on the first Sunday in November (clocks fall back at 2:00 AM).' },
      { q: 'What is the difference between EDT and EST?', a: 'EDT (UTC−4) is 1 hour ahead of EST (UTC−5). EDT is summer/spring time; EST is winter time.' },
    ],
    relatedTimezones: ['est', 'cst', 'gmt'],
    relatedCities: ['new-york', 'toronto', 'boston'],
  },

  cst: {
    abbr: 'CST', fullName: 'Central Standard Time', offset: '-6:00', utcLabel: 'UTC−6',
    ianaTz: 'America/Chicago', dst: false,
    countries: ['United States (central states, winter)', 'Canada (Manitoba, Saskatchewan)', 'Mexico (most regions)', 'Costa Rica', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Belize'],
    cities: ['Chicago', 'Houston', 'Dallas', 'Minneapolis', 'Kansas City', 'Mexico City', 'Monterrey', 'San Jose (CR)', 'Guatemala City'],
    description: 'Central Standard Time (CST) is the time zone at UTC−6, observed in the central United States and much of Central America. During winter months, CST covers Chicago, Houston, Dallas, and Minneapolis. Chicago is home to CME Group—the world\'s largest futures and derivatives exchange. During daylight saving time (second Sunday in March to first Sunday in November), most CST regions switch to CDT (UTC−5). Mexico City and most of Mexico observe CST in winter and CDT in summer. Some Central American countries (Costa Rica, Guatemala, Nicaragua) use CST permanently without DST.',
    faqs: [
      { q: 'What is Central Standard Time (CST)?', a: 'CST is UTC−6, the standard time zone for the central United States, Canada\'s Manitoba province, and most Central American countries. It switches to CDT (UTC−5) in summer for US and Canadian regions.' },
      { q: 'What is the time difference between CST and EST?', a: 'CST (UTC−6) is 1 hour behind EST (UTC−5). When it is 12:00 PM EST, it is 11:00 AM CST.' },
      { q: 'Which countries use CST year-round without DST?', a: 'Costa Rica, Guatemala, Honduras, El Salvador, Nicaragua, and Belize all use UTC−6 year-round without observing daylight saving time.' },
    ],
    relatedTimezones: ['cdt', 'est', 'mst', 'pst'],
    relatedCities: ['chicago', 'houston', 'dallas', 'mexico-city'],
  },

  pst: {
    abbr: 'PST', fullName: 'Pacific Standard Time', offset: '-8:00', utcLabel: 'UTC−8',
    ianaTz: 'America/Los_Angeles', dst: false,
    countries: ['United States (western coast, winter)', 'Canada (British Columbia, winter)'],
    cities: ['Los Angeles', 'San Francisco', 'Seattle', 'Portland', 'Las Vegas', 'Vancouver'],
    description: 'Pacific Standard Time (PST) is UTC−8, the standard time for the US West Coast during winter months. Los Angeles, San Francisco, Seattle, and Las Vegas all use PST in winter. Silicon Valley—home to Apple, Google, Meta, and hundreds of major tech companies—operates on PST/PDT, making it the tech industry\'s home time zone. PST is active from the first Sunday in November to the second Sunday in March, when it switches to PDT (UTC−7).',
    faqs: [
      { q: 'What is Pacific Standard Time (PST)?', a: 'PST is UTC−8, the standard time zone for the US and Canadian West Coast, active from the first Sunday of November to the second Sunday of March, when it switches to PDT (UTC−7).' },
      { q: 'What is the time difference between PST and EST?', a: 'PST (UTC−8) is 3 hours behind EST (UTC−5). When it is 12:00 PM EST, it is 9:00 AM PST.' },
      { q: 'What major cities use PST?', a: 'Los Angeles, San Francisco, San Jose (Silicon Valley), Seattle, Portland, Las Vegas, and Vancouver (Canada) all use PST in winter.' },
    ],
    relatedTimezones: ['pdt', 'mst', 'est', 'jst'],
    relatedCities: ['los-angeles', 'seattle', 'san-francisco', 'vancouver'],
  },

  ist: {
    abbr: 'IST', fullName: 'India Standard Time', offset: '+5:30', utcLabel: 'UTC+5:30',
    ianaTz: 'Asia/Kolkata', dst: false,
    countries: ['India', 'Sri Lanka'],
    cities: ['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Colombo'],
    description: 'India Standard Time (IST) is UTC+5:30, one of the most unusual time zones in the world due to its half-hour offset from the full-hour UTC grid. India uses a single time zone for the entire country despite spanning approximately 30 degrees of longitude—equivalent to two natural time zones. IST was established in 1905 as a compromise between Bombay Time and Calcutta Time. India does not observe daylight saving time. With over 1.4 billion people, IST is the time zone of the world\'s most populous country, covering the Bombay Stock Exchange (BSE), the National Stock Exchange (NSE), and a massive IT industry based in Bengaluru.',
    faqs: [
      { q: 'What is India Standard Time (IST)?', a: 'IST is UTC+5:30, India\'s single national time zone. India does not observe daylight saving time, and IST applies everywhere from Mumbai to Kolkata.' },
      { q: 'Why does India use a half-hour offset?', a: 'India chose UTC+5:30 as a compromise between its easternmost and westernmost time zone needs. This avoids the disruption of having two separate time zones across the country.' },
      { q: 'What is the time difference between IST and GMT?', a: 'IST (UTC+5:30) is 5 hours and 30 minutes ahead of GMT (UTC+0).' },
      { q: 'What is the time difference between IST and EST?', a: 'IST (UTC+5:30) is 10 hours 30 minutes ahead of EST (UTC−5) in winter, and 9 hours 30 minutes ahead of EDT (UTC−4) in summer.' },
      { q: 'What is the time difference between IST and GST (Dubai)?', a: 'IST (UTC+5:30) is 1 hour 30 minutes ahead of GST/Dubai time (UTC+4). When it is 10:00 AM in Dubai, it is 11:30 AM in India.' },
    ],
    relatedTimezones: ['pkt', 'gst', 'sgt', 'gmt'],
    relatedCities: ['mumbai', 'delhi', 'bangalore', 'colombo'],
  },

  gst: {
    abbr: 'GST', fullName: 'Gulf Standard Time', offset: '+4:00', utcLabel: 'UTC+4',
    ianaTz: 'Asia/Dubai', dst: false,
    countries: ['United Arab Emirates', 'Oman'],
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Muscat', 'Salalah'],
    description: 'Gulf Standard Time (GST) is UTC+4, the permanent time zone for the United Arab Emirates and Oman. No daylight saving time is ever observed in these countries, making GST one of the world\'s most stable and predictable offsets. Dubai—the UAE\'s largest city—uses GST and serves as a major global aviation, finance, and logistics hub. GST places the Gulf between the time zones of Europe (CET, UTC+1 to UTC+2) and South Asia (IST, UTC+5:30), giving it a natural position as a bridge between Western and Eastern business hours.',
    faqs: [
      { q: 'What is Gulf Standard Time (GST)?', a: 'GST is UTC+4, the permanent time zone for the United Arab Emirates (Dubai, Abu Dhabi, Sharjah) and Oman (Muscat). No daylight saving time is observed.' },
      { q: 'Which countries use GST?', a: 'The United Arab Emirates and Oman use Gulf Standard Time (UTC+4) year-round without daylight saving.' },
      { q: 'What is the time difference between GST and GMT?', a: 'GST (UTC+4) is 4 hours ahead of GMT (UTC+0).' },
      { q: 'Is GST the same as Gulf Cooperation Council time?', a: 'Not entirely. Qatar, Bahrain, Saudi Arabia, Kuwait, and Iraq use UTC+3 (Arabia Standard Time), not UTC+4. Only the UAE and Oman use GST (UTC+4).' },
    ],
    relatedTimezones: ['ast', 'ist', 'gmt', 'msk'],
    relatedCities: ['dubai', 'abu-dhabi', 'muscat'],
  },

  cet: {
    abbr: 'CET', fullName: 'Central European Time', offset: '+1:00', utcLabel: 'UTC+1',
    ianaTz: 'Europe/Paris', dst: false,
    countries: ['Germany', 'France', 'Italy', 'Spain', 'Poland', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Czech Republic', 'Hungary', 'Sweden', 'Norway', 'Denmark', 'Croatia', 'Serbia', 'and more'],
    cities: ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Brussels', 'Vienna', 'Warsaw', 'Stockholm', 'Oslo', 'Copenhagen', 'Zurich'],
    description: 'Central European Time (CET) is UTC+1, the standard time for most of Central and Western Europe during winter months. It is one of the most widely used time zones in the world by number of countries, covering over 20 European nations. In summer, CET regions switch to Central European Summer Time (CEST, UTC+2) from the last Sunday in March to the last Sunday in October. CET is home to major European stock exchanges including Frankfurt (Deutsche Börse), Paris (Euronext), Amsterdam (Euronext), and Milan (Borsa Italiana).',
    faqs: [
      { q: 'What is Central European Time (CET)?', a: 'CET is UTC+1, the standard time for most of Central and Western Europe during winter. In summer, it becomes CEST (UTC+2).' },
      { q: 'Which countries use CET?', a: 'Major CET countries include Germany, France, Italy, Spain, Poland, Netherlands, Belgium, Austria, Switzerland, Czech Republic, Hungary, Sweden, Norway, Denmark, and over a dozen others.' },
      { q: 'What is the difference between CET and GMT?', a: 'CET (UTC+1) is 1 hour ahead of GMT (UTC+0). In summer, CEST (UTC+2) is 2 hours ahead of GMT.' },
      { q: 'What is the difference between CET and EST?', a: 'CET (UTC+1) is 6 hours ahead of EST (UTC−5). In summer, CEST (UTC+2) is 6 hours ahead of EDT (UTC−4).' },
    ],
    relatedTimezones: ['cest', 'gmt', 'est', 'eet'],
    relatedCities: ['paris', 'berlin', 'rome', 'madrid', 'amsterdam'],
  },

  eet: {
    abbr: 'EET', fullName: 'Eastern European Time', offset: '+2:00', utcLabel: 'UTC+2',
    ianaTz: 'Europe/Athens', dst: false,
    countries: ['Greece', 'Romania', 'Bulgaria', 'Ukraine', 'Finland', 'Estonia', 'Latvia', 'Lithuania', 'Egypt', 'Jordan', 'Israel', 'Lebanon', 'South Africa'],
    cities: ['Athens', 'Bucharest', 'Sofia', 'Kyiv', 'Helsinki', 'Tallinn', 'Riga', 'Vilnius', 'Cairo', 'Johannesburg'],
    description: 'Eastern European Time (EET) is UTC+2, used by eastern European countries in winter and by some countries in the Middle East and Africa permanently. In Europe, EET regions switch to Eastern European Summer Time (EEST, UTC+3) from the last Sunday in March to the last Sunday in October. Egypt and South Africa use UTC+2 permanently without seasonal adjustments. EET is the home time zone of the Athens Stock Exchange, Bucharest Stock Exchange, and Tel Aviv Stock Exchange.',
    faqs: [
      { q: 'What is Eastern European Time (EET)?', a: 'EET is UTC+2. European countries using EET switch to EEST (UTC+3) in summer. Countries like Egypt and South Africa use UTC+2 permanently.' },
      { q: 'Which countries use EET?', a: 'European EET countries include Greece, Romania, Bulgaria, Ukraine, Finland, Estonia, Latvia, Lithuania, Cyprus, and Lebanon. Egypt, South Africa, and Jordan use UTC+2 permanently.' },
      { q: 'What is the difference between EET and CET?', a: 'EET (UTC+2) is 1 hour ahead of CET (UTC+1). Both are European winter time zones.' },
    ],
    relatedTimezones: ['cet', 'msk', 'gmt', 'ast'],
    relatedCities: ['athens', 'cairo', 'johannesburg', 'kyiv'],
  },

  jst: {
    abbr: 'JST', fullName: 'Japan Standard Time', offset: '+9:00', utcLabel: 'UTC+9',
    ianaTz: 'Asia/Tokyo', dst: false,
    countries: ['Japan', 'South Korea (KST, same offset)'],
    cities: ['Tokyo', 'Osaka', 'Yokohama', 'Sapporo', 'Fukuoka', 'Seoul', 'Busan'],
    description: 'Japan Standard Time (JST) is UTC+9, the permanent time zone of Japan. Japan has not observed daylight saving time since 1952. JST is shared by South Korea, whose Korea Standard Time (KST) has the same UTC+9 offset. JST is 9 hours ahead of UTC, 9 hours ahead of London in winter, and 14 hours ahead of New York in winter. The Tokyo Stock Exchange—the third largest in the world by market capitalization—operates on JST, and trading hours are 9:00 AM to 3:30 PM JST.',
    faqs: [
      { q: 'What is Japan Standard Time (JST)?', a: 'JST is UTC+9, Japan\'s permanent time zone. Japan does not observe daylight saving time. JST is also shared by South Korea (KST, UTC+9).' },
      { q: 'Does Japan observe daylight saving time?', a: 'No. Japan abandoned daylight saving time in 1952 and has not observed it since. JST stays at UTC+9 year-round.' },
      { q: 'What is the time difference between JST and GMT?', a: 'JST (UTC+9) is 9 hours ahead of GMT (UTC+0).' },
      { q: 'What is the time difference between JST and EST?', a: 'JST (UTC+9) is 14 hours ahead of EST (UTC−5) in winter and 13 hours ahead of EDT (UTC−4) in summer.' },
    ],
    relatedTimezones: ['kst', 'cst', 'sgt', 'aest'],
    relatedCities: ['tokyo', 'osaka', 'seoul'],
  },

  sgt: {
    abbr: 'SGT', fullName: 'Singapore Standard Time', offset: '+8:00', utcLabel: 'UTC+8',
    ianaTz: 'Asia/Singapore', dst: false,
    countries: ['Singapore', 'Malaysia (MYT, same offset)', 'Brunei', 'Philippines', 'China (CST)', 'Hong Kong', 'Taiwan', 'Western Australia (AWST)'],
    cities: ['Singapore', 'Kuala Lumpur', 'Hong Kong', 'Beijing', 'Shanghai', 'Taipei', 'Manila', 'Perth'],
    description: 'Singapore Standard Time (SGT) is UTC+8, a highly significant time zone shared by Singapore, Malaysia, Hong Kong, China, Taipei, Manila, and Perth. UTC+8 covers some of the world\'s most economically dynamic cities and is the time zone for a combined GDP that rivals any other regional bloc. Singapore, Hong Kong, and Shanghai are all major global financial centers operating on UTC+8. No country or territory using UTC+8 as a primary time zone currently observes daylight saving time.',
    faqs: [
      { q: 'What is Singapore Standard Time (SGT)?', a: 'SGT is UTC+8, the permanent time zone of Singapore. It is shared by Malaysia, Hong Kong, China, Taiwan, Philippines, and Perth (Australia).' },
      { q: 'Which cities share the UTC+8 time zone?', a: 'Singapore, Kuala Lumpur, Hong Kong, Beijing, Shanghai, Taipei, Manila, and Perth all use UTC+8. None observe daylight saving time.' },
      { q: 'What is the time difference between SGT and GMT?', a: 'SGT (UTC+8) is 8 hours ahead of GMT (UTC+0).' },
      { q: 'What is the time difference between SGT and EST?', a: 'SGT (UTC+8) is 13 hours ahead of EST (UTC−5) in winter and 12 hours ahead of EDT (UTC−4) in summer.' },
    ],
    relatedTimezones: ['jst', 'cst', 'ist', 'aest'],
    relatedCities: ['singapore', 'hong-kong', 'kuala-lumpur', 'beijing'],
  },

  aest: {
    abbr: 'AEST', fullName: 'Australian Eastern Standard Time', offset: '+10:00', utcLabel: 'UTC+10',
    ianaTz: 'Australia/Sydney', dst: false,
    countries: ['Australia (Queensland, New South Wales, Victoria, ACT, Tasmania in winter)'],
    cities: ['Sydney (winter)', 'Melbourne (winter)', 'Brisbane', 'Canberra (winter)', 'Hobart (winter)'],
    description: 'Australian Eastern Standard Time (AEST) is UTC+10, the standard time for eastern Australia. Queensland uses AEST year-round with no daylight saving time. New South Wales, Victoria, ACT, and Tasmania use AEST in winter (April to October) and switch to AEDT (UTC+11) in summer. The Australian Securities Exchange (ASX) in Sydney operates on AEST/AEDT. Brisbane (Queensland) is notable for using AEST permanently—it never observes daylight saving time.',
    faqs: [
      { q: 'What is Australian Eastern Standard Time (AEST)?', a: 'AEST is UTC+10, the standard time for eastern Australia. Queensland uses it year-round; other eastern states switch to AEDT (UTC+11) in summer (October to April).' },
      { q: 'What is the difference between AEST and AEDT?', a: 'AEST is UTC+10 (standard time, Australian winter). AEDT is UTC+11 (daylight saving time, Australian summer, October to April).' },
      { q: 'Which Australian states use AEST permanently?', a: 'Queensland uses AEST (UTC+10) year-round without observing daylight saving time. New South Wales, Victoria, ACT, and Tasmania switch to AEDT in summer.' },
    ],
    relatedTimezones: ['aedt', 'jst', 'sgt', 'nzst'],
    relatedCities: ['sydney', 'melbourne', 'brisbane'],
  },

  msk: {
    abbr: 'MSK', fullName: 'Moscow Standard Time', offset: '+3:00', utcLabel: 'UTC+3',
    ianaTz: 'Europe/Moscow', dst: false,
    countries: ['Russia (western regions)', 'Belarus', 'Turkey (TRT, same offset)'],
    cities: ['Moscow', 'Saint Petersburg', 'Istanbul', 'Ankara', 'Minsk', 'Kazan', 'Nizhny Novgorod'],
    description: 'Moscow Standard Time (MSK) is UTC+3, the time zone for western Russia including Moscow, Saint Petersburg, and Kazan. Russia abolished daylight saving time in 2014, and MSK is now permanent year-round. Turkey adopted the same UTC+3 offset permanently in 2016. MSK is shared with Istanbul, making it the time zone of the two countries that bridge Europe and Asia. MSK is 3 hours ahead of London in winter, 1 hour ahead of Dubai, and 2 hours behind Singapore.',
    faqs: [
      { q: 'What is Moscow Standard Time (MSK)?', a: 'MSK is UTC+3, the permanent time zone for Moscow and western Russia. Russia abolished DST in 2014, so MSK is observed year-round.' },
      { q: 'Does Russia observe daylight saving time?', a: 'No. Russia permanently abolished daylight saving time in 2014. Moscow and western Russia stay at UTC+3 year-round.' },
      { q: 'Is Istanbul time the same as Moscow time?', a: 'Yes. Turkey permanently switched to UTC+3 (Turkey Time, TRT) in 2016, the same offset as Moscow Standard Time.' },
      { q: 'What is the time difference between MSK and GMT?', a: 'MSK (UTC+3) is 3 hours ahead of GMT (UTC+0).' },
    ],
    relatedTimezones: ['ast', 'eet', 'gst', 'gmt'],
    relatedCities: ['moscow', 'istanbul', 'saint-petersburg'],
  },
};

export function getAllTimezoneKeys() {
  return Object.keys(TIMEZONE_DATA);
}

export function getTimezoneData(key) {
  return TIMEZONE_DATA[key] || null;
}
