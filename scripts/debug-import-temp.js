const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const sourcePath = path.join(__dirname, '..', 'data', 'world-cities.xlsm');
console.log('sourcePath:', sourcePath);
console.log('exists:', fs.existsSync(sourcePath));
const workbook = xlsx.readFile(sourcePath, { cellDates: true });
console.log('sheets:', workbook.SheetNames);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
console.log('rowCount:', rows.length);
rows.slice(0, 6).forEach((row, idx) => {
  console.log(idx, JSON.stringify(row));
});
