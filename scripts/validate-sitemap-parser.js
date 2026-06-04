const fs = require('fs');
const path = require('path');

function parseTopLevelObjectKeys(filePath, exportName) {
  const text = fs.readFileSync(filePath, 'utf8');
  const marker = `export const ${exportName}`;
  const start = text.indexOf(marker);
  if (start === -1) return [];
  const braceStart = text.indexOf('{', start);
  if (braceStart === -1) return [];

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  const bodyStart = braceStart + 1;
  let i = bodyStart;

  for (; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') {
      depth++;
      continue;
    }
    if (ch === '}') {
      if (depth === 0) break;
      depth--;
      continue;
    }
  }

  const objectBody = text.slice(bodyStart, i);
  const keys = [];
  let j = 0;
  depth = 0;
  inString = false;
  quote = '';
  escaped = false;

  while (j < objectBody.length) {
    const ch = objectBody[j];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) inString = false;
      j++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      inString = true;
      let key = '';
      j++;
      while (j < objectBody.length) {
        const c = objectBody[j];
        if (escaped) {
          escaped = false;
          key += c;
          j++;
          continue;
        }
        if (c === '\\') {
          escaped = true;
          j++;
          continue;
        }
        if (c === quote) {
          inString = false;
          j++;
          break;
        }
        key += c;
        j++;
      }
      while (j < objectBody.length && /\s/.test(objectBody[j])) j++;
      if (objectBody[j] === ':') {
        keys.push(key);
      }
      j++;
      continue;
    }

    if (depth === 0) {
      if (/\s/.test(ch) || ch === ',') {
        j++;
        continue;
      }
      if (/[A-Za-z0-9_\-]/.test(ch)) {
        let key = '';
        while (j < objectBody.length && /[A-Za-z0-9_\-]/.test(objectBody[j])) {
          key += objectBody[j];
          j++;
        }
        while (j < objectBody.length && /\s/.test(objectBody[j])) j++;
        if (objectBody[j] === ':') {
          keys.push(key);
        }
        j++;
        continue;
      }
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      if (depth > 0) depth--;
    }
    j++;
  }

  return keys;
}

const cityPath = path.join(__dirname, '../apps/web/src/data/cityPageData.js');
const tzPath = path.join(__dirname, '../apps/web/src/data/timezoneData.js');
const cityKeys = parseTopLevelObjectKeys(cityPath, 'CITY_SEO_DATA');
const tzKeys = parseTopLevelObjectKeys(tzPath, 'TIMEZONE_DATA');
console.log('city count:', cityKeys.length);
console.log('first city keys:', cityKeys.slice(0, 10));
console.log('timezone count:', tzKeys.length);
console.log('first timezone keys:', tzKeys.slice(0, 10));
