export const islamicCountriesList = [
  'SA', // Saudi Arabia
  'AE', // United Arab Emirates
  'EG', // Egypt
  'PK', // Pakistan
  'ID', // Indonesia
  'MY', // Malaysia
  'TR', // Turkey
  'IR', // Iran
  'IQ', // Iraq
  'JO', // Jordan
  'LB', // Lebanon
  'PS', // Palestine
  'SY', // Syria
  'YE', // Yemen
  'OM', // Oman
  'QA', // Qatar
  'BH', // Bahrain
  'KW', // Kuwait
  'MA', // Morocco
  'DZ', // Algeria
  'TN', // Tunisia
  'LY', // Libya
  'SD', // Sudan
  'SO', // Somalia
  'MR', // Mauritania
  'DJ', // Djibouti
  'KM', // Comoros
  'MV', // Maldives
  'BD', // Bangladesh
  'BN', // Brunei
  'AF', // Afghanistan
  'AL', // Albania
  'AZ', // Azerbaijan
  'BF', // Burkina Faso
  'TD', // Chad
  'GM', // Gambia
  'GN', // Guinea
  'GW', // Guinea-Bissau
  'KZ', // Kazakhstan
  'KG', // Kyrgyzstan
  'ML', // Mali
  'NE', // Niger
  'NG', // Nigeria
  'SN', // Senegal
  'TJ', // Tajikistan
  'TM', // Turkmenistan
  'UZ', // Uzbekistan
  'EH'  // Western Sahara
];

export function isIslamicCountry(countryCode) {
  if (!countryCode) return false;
  return islamicCountriesList.includes(countryCode.toUpperCase());
}