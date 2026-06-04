from pathlib import Path

timezone_keys = {
    'AbuDhabi.jsx': ('Abu Dhabi', 'gst'),
    'Bangkok.jsx': ('Bangkok', 'ict'),
    'Dubai.jsx': ('Dubai', 'gst'),
    'Istanbul.jsx': ('Istanbul', 'msk'),
    'KualaLumpur.jsx': ('Kuala Lumpur', 'sgt'),
    'London.jsx': ('London', 'gmt'),
    'NewYork.jsx': ('New York', 'est'),
    'Oslo.jsx': ('Oslo', 'cet'),
    'Paris.jsx': ('Paris', 'cet'),
    'Riyadh.jsx': ('Riyadh', 'ast'),
    'Singapore.jsx': ('Singapore', 'sgt'),
    'Sydney.jsx': ('Sydney', 'aest'),
    'Tokyo.jsx': ('Tokyo', 'jst'),
}

base = Path('apps/web/src/pages/cities')
for filename, (city_name, tz_key) in timezone_keys.items():
    path = base / filename
    text = path.read_text(encoding='utf-8')
    if 'TimezoneAuthoritySection' in text:
        print(f'Skipped {filename} already updated')
        continue
    if "import FAQSection from '@/components/FAQSection.jsx';\n" not in text:
        raise RuntimeError(f'FAQSection import not found in {filename}')
    text = text.replace(
        "import FAQSection from '@/components/FAQSection.jsx';\n",
        "import FAQSection from '@/components/FAQSection.jsx';\nimport TimezoneAuthoritySection from '@/components/TimezoneAuthoritySection.jsx';\n"
    )
    insert = f'        <TimezoneAuthoritySection cityName="{city_name}" timezoneKey="{tz_key}" />\n'
    if '<FAQSection' not in text:
        raise RuntimeError(f'FAQSection tag not found in {filename}')
    text = text.replace('<FAQSection', insert + '<FAQSection', 1)
    path.write_text(text, encoding='utf-8')
    print(f'Updated {filename}')

path = Path('apps/web/src/pages/DynamicCityPage.jsx')
text = path.read_text(encoding='utf-8')
if 'TimezoneAuthoritySection' not in text:
    if "import FAQSection from '@/components/FAQSection.jsx';\n" not in text:
        raise RuntimeError('FAQSection import not found in DynamicCityPage.jsx')
    text = text.replace(
        "import FAQSection from '@/components/FAQSection.jsx';\n",
        "import FAQSection from '@/components/FAQSection.jsx';\nimport TimezoneAuthoritySection from '@/components/TimezoneAuthoritySection.jsx';\n"
    )
    start = text.index('        {/* Timezone authority links */}')
    end = text.index('        {/* Tools links */}')
    replacement = '''        <TimezoneAuthoritySection
          cityName={city.name}
          timezoneKey={tzKey}
          extraTimezoneKeys={extraTimezoneLinks}
        />
'''
    text = text[:start] + replacement + text[end:]
    path.write_text(text, encoding='utf-8')
    print('Updated DynamicCityPage.jsx')
else:
    print('Skipped DynamicCityPage.jsx already updated')
