/**
 * WindowsTimeSettingsPage.jsx — Route: /windows-time-settings
 * Targets: "change time format in windows", "set your time and time zone manually windows"
 * Highest combined search volume of the keyword batch (~1.2M impressions)
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Monitor, Settings, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

const BASE = 'https://myzonetime.com';

const SET_TIME_STEPS = [
  { step: 1, title: 'Open Settings', body: 'Press Win + I to open Windows Settings, or click the Start menu and select the gear icon.' },
  { step: 2, title: 'Go to Time & Language', body: 'In the Settings window, click "Time & Language" from the left sidebar (or the main menu on Windows 11).' },
  { step: 3, title: 'Open Date & Time', body: 'Click "Date & time" to see your current time, date, and time zone settings.' },
  { step: 4, title: 'Turn off "Set time automatically"', body: 'Toggle off the "Set time automatically" switch. This unlocks manual control over the clock.' },
  { step: 5, title: 'Click "Change"', body: 'Under the manual section, click the "Change" button next to the date and time fields.' },
  { step: 6, title: 'Enter the correct date and time', body: 'Manually type or select the correct date and time, then click "Change" to confirm.' },
  { step: 7, title: 'Set your time zone manually', body: 'Also toggle off "Set time zone automatically" if needed, then choose your correct time zone from the dropdown list.' },
];

const FORMAT_STEPS = [
  { step: 1, title: 'Open Settings → Time & Language', body: 'Press Win + I, then navigate to "Time & Language" in the sidebar.' },
  { step: 2, title: 'Click "Language & region"', body: 'Select "Language & region" from the Time & Language menu.' },
  { step: 3, title: 'Open "Regional format"', body: 'Scroll down and click on "Regional format" to access detailed formatting options.' },
  { step: 4, title: 'Click "Additional date, time & regional settings"', body: 'This opens the legacy Control Panel dialog with full format customization.' },
  { step: 5, title: 'Select "Change date or time formats"', body: 'Under the Region section, click this link to open the Customize Format dialog.' },
  { step: 6, title: 'Choose 12-hour or 24-hour format', body: 'In the "Short time" or "Long time" dropdown, select a format using "h" (12-hour) or "H" (24-hour) notation — for example, h:mm tt for 12-hour with AM/PM, or HH:mm for 24-hour.' },
  { step: 7, title: 'Click Apply, then OK', body: 'Confirm your changes. The new time format will appear immediately in the taskbar clock.' },
];

const WINDOWS_FAQS = [
  {
    question: 'How do I change the time format in Windows from 12-hour to 24-hour?',
    answer: 'Go to Settings → Time & Language → Language & region → Regional format → Additional date, time & regional settings → Change date or time formats. In the Short time dropdown, select a format using capital "H" (such as HH:mm) for 24-hour time, or lowercase "h" with "tt" (such as h:mm tt) for 12-hour time with AM/PM.',
  },
  {
    question: 'How do I set my time and time zone manually in Windows?',
    answer: 'Open Settings (Win + I) → Time & Language → Date & time. Turn off "Set time automatically," then click "Change" to manually enter the date and time. To set the time zone manually, also turn off "Set time zone automatically" and choose your zone from the dropdown.',
  },
  {
    question: 'Why won\'t Windows let me change the time manually?',
    answer: 'If the "Change" button is greyed out, the "Set time automatically" toggle is still on — switch it off first. If you still cannot change it after that, check that your Windows account has administrator privileges, since standard user accounts may be restricted from changing system time.',
  },
  {
    question: 'How do I fix Windows showing the wrong time zone automatically?',
    answer: 'Windows often gets the time zone wrong when location services are disabled. Go to Settings → Privacy & security → Location and ensure location access is turned on, then go back to Date & time and toggle "Set time zone automatically" off and on again, or set it manually using the dropdown.',
  },
  {
    question: 'What is the difference between Short time and Long time format in Windows?',
    answer: 'Short time format controls how the clock appears in the taskbar and most apps (e.g. 2:30 PM). Long time format includes seconds and is used in some file properties and system dialogs (e.g. 2:30:45 PM). Both can be customized independently in the Regional format settings.',
  },
  {
    question: 'How do I sync my Windows clock with an internet time server?',
    answer: 'Go to Settings → Time & Language → Date & time → Additional clocks and time settings (or "Sync now" in newer Windows versions). Windows uses time.windows.com by default; you can change the server under the Internet Time tab in the Control Panel Date and Time dialog.',
  },
];

function StepList({ steps }) {
  return (
    <ol className="space-y-4">
      {steps.map(s => (
        <li key={s.step} className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {s.step}
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">{s.title}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function WindowsTimeSettingsPage() {
  const TODAY = new Date().toISOString().split('T')[0];

  const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${BASE}/windows-time-settings#webpage`,
    url: `${BASE}/windows-time-settings`,
    name: 'How to Set Time, Time Zone & Time Format in Windows | MyZoneTime',
    description: 'Step-by-step guide: set your time and time zone manually in Windows, and change the time format from 12-hour to 24-hour.',
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#organization` },
    dateModified: TODAY,
    inLanguage: 'en',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Windows Time Settings', item: `${BASE}/windows-time-settings` },
      ],
    },
  };

  const howToSchema1 = {
    '@type': 'HowTo',
    '@id': `${BASE}/windows-time-settings#howto-settime`,
    name: 'How to Set Your Time and Time Zone Manually in Windows',
    description: 'Step-by-step instructions to manually set the date, time, and time zone in Windows 10 and Windows 11.',
    step: SET_TIME_STEPS.map(s => ({
      '@type': 'HowToStep',
      position: s.step,
      name: s.title,
      text: s.body,
    })),
  };

  const howToSchema2 = {
    '@type': 'HowTo',
    '@id': `${BASE}/windows-time-settings#howto-format`,
    name: 'How to Change Time Format in Windows (12-hour to 24-hour)',
    description: 'Step-by-step instructions to change the clock display format in Windows between 12-hour and 24-hour time.',
    step: FORMAT_STEPS.map(s => ({
      '@type': 'HowToStep',
      position: s.step,
      name: s.title,
      text: s.body,
    })),
  };

  return (
    <>
      <CanonicalTag pathname="/windows-time-settings" />
      <Helmet>
        <title>How to Set Time & Change Time Format in Windows | MyZoneTime</title>
        <meta name="description" content="How to set time and time zone in Windows 10/11, and switch between 12-hour and 24-hour format. Step-by-step, simple instructions." />
        <meta property="og:title" content="Set Time & Time Zone Manually in Windows | MyZoneTime" />
        <meta property="og:description" content="Complete guide to manually setting time, time zone, and changing time format in Windows." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <StructuredData schemas={[webPageSchema, howToSchema1, howToSchema2]} />

      <main id="main-content" className="min-h-screen bg-background">

        <section className="relative py-14 md:py-20 border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl bg-primary/15 rounded-full blur-[80px] opacity-40" />
          </div>
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-sm font-medium text-primary mb-6">
              <Monitor className="w-4 h-4" /> Windows 10 &amp; 11
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              How to Set Time &amp; Change Time Format in Windows
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Two complete step-by-step guides: setting your time/time zone manually, and switching between 12-hour and 24-hour format.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">
            <AdSenseAd slot={AD_SLOTS.HOME_BANNER} format="horizontal" minHeight={90} />
          </div>
        </section>

        {/* Guide 1: Set time/timezone manually */}
        <section className="py-12">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">
            <div className="premium-card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Set Your Time and Time Zone Manually in Windows
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Use this when your clock drifts, shows the wrong time zone, or you need to set a specific time for testing purposes.
              </p>
              <StepList steps={SET_TIME_STEPS} />
              <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
                <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Manually setting the time disables automatic internet time sync. Remember to turn "Set time automatically" back on once you no longer need manual control, to avoid future clock drift.
              </div>
            </div>
          </div>
        </section>

        {/* Guide 2: Change time format */}
        <section className="py-4">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">
            <div className="premium-card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Change Time Format in Windows (12-hour ↔ 24-hour)
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Switch your taskbar clock and system-wide time display between 12-hour (AM/PM) and 24-hour format.
              </p>
              <StepList steps={FORMAT_STEPS} />
              <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Format codes reference: "h" = 12-hour, "H" = 24-hour, "mm" = minutes, "ss" = seconds, "tt" = AM/PM indicator. Example: <code className="text-foreground">HH:mm:ss</code> displays as 14:30:45.
              </div>
            </div>
          </div>
        </section>

        {/* Cross-sell */}
        <section className="py-10">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">
            <div className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-foreground mb-1">Need to check the time in another city first?</h2>
                <p className="text-sm text-muted-foreground">
                  Use the world clock to find the correct local time anywhere before setting it manually in Windows.
                </p>
              </div>
              <Link to="/world-clock" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex-shrink-0">
                Open World Clock <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <FAQSection faqs={WINDOWS_FAQS} title="Windows Time Settings — Frequently Asked Questions" />

</main>
    </>
  );
}
