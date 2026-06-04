const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const tzlookup = require('tz-lookup');

const sourcePath = path.join(__dirname, '..', 'data', 'world-cities.xlsm');
const workbook = xlsx.readFile(sourcePath, { cellDates: true });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
const headers = rows[0].map(header => header.toString().trim().toLowerCase().replace(/\s+/g, '_'));
const dataRows = rows.slice(1);
console.log('headers', headers);
console.log('dataRows', dataRows.length);
let count = 0;
const cities = dataRows.reduce((list, row, index) => {
  const record = {};
  headers.forEach((header, i) => {
    record[header] = row[i] != null ? row[i].toString().trim() : '';
  });
  const name = ['city', 'city_name', 'name', 'cities'].map(k => record[k]).find(v => v);
  const country = ['country', 'country_name', 'countryname'].map(k => record[k]).find(v => v);
  const timezone = ['timezone', 'tz', 'time_zone'].map(k => record[k]).find(v => v);
  const latitude = ['lat', 'latitude'].map(k => record[k]).find(v => v);
  const longitude = ['lng', 'long', 'longitude', 'lon'].map(k => record[k]).find(v => v);
  if (!name || !country) {
    if (index < 5) console.log('skip', index, record);
    return list;
  }
  if (index < 3) console.log('valid', index, name, country, latitude, longitude, timezone);
  list.push({ name, country, timezone, latitude, longitude });
  return list;
}, []);
console.log('cities length', cities.length);
