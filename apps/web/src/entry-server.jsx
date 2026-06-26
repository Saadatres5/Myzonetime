/**
 * entry-server.jsx
 * SSR entry for pre-rendering. Called by prerender.mjs at build time.
 * Uses renderToString so the client can hydrate the result.
 */
import React, { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// ── Import all pages directly (no React.lazy for SSR) ────────────────────────
import HomePage                     from './pages/HomePage.jsx';
import WorldClockPage               from './pages/WorldClockPage.jsx';
import TimeZoneConverterPage        from './pages/TimeZoneConverterPage.jsx';
import StopwatchPage                from './pages/StopwatchPage.jsx';
import TimerPage                    from './pages/TimerPage.jsx';
import CountdownPage                from './pages/CountdownPage.jsx';
import DateCalculatorPage           from './pages/DateCalculatorPage.jsx';
import WorkHoursCalculatorPage      from './pages/WorkHoursCalculatorPage.jsx';
import MeetingPlannerPage           from './pages/MeetingPlannerPage.jsx';
import HijriCalendarPage            from './pages/HijriCalendarPage.jsx';
import IndiaTimePage                from './pages/IndiaTimePage.jsx';
import TimeCalculatorPage           from './pages/TimeCalculatorPage.jsx';
import TimeManagementTipsPage       from './pages/TimeManagementTipsPage.jsx';
import WindowsTimeSettingsPage      from './pages/WindowsTimeSettingsPage.jsx';
import TimeDifferenceCalculatorPage from './pages/TimeDifferenceCalculatorPage.jsx';
import WorldClockWidgetPage         from './pages/WorldClockWidgetPage.jsx';
import AboutPage                    from './pages/AboutPage.jsx';
import PrivacyPolicyPage            from './pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage           from './pages/TermsOfServicePage.jsx';
import ContactPage                  from './pages/ContactPage.jsx';
import TimezoneIndexPage            from './pages/TimezoneIndexPage.jsx';
import DynamicTimezonePage          from './pages/DynamicTimezonePage.jsx';
import TimeDifferencePairPage       from './pages/TimeDifferencePairPage.jsx';
import AIMeetingPlannerPage         from './pages/AIMeetingPlannerPage.jsx';
// Tier-1 city pages
import London      from './pages/cities/London.jsx';
import Dubai       from './pages/cities/Dubai.jsx';
import NewYork     from './pages/cities/NewYork.jsx';
import Tokyo       from './pages/cities/Tokyo.jsx';
import Singapore   from './pages/cities/Singapore.jsx';
import Sydney      from './pages/cities/Sydney.jsx';
import Riyadh      from './pages/cities/Riyadh.jsx';
import AbuDhabi    from './pages/cities/AbuDhabi.jsx';
import Istanbul    from './pages/cities/Istanbul.jsx';
import Oslo        from './pages/cities/Oslo.jsx';
import Bangkok     from './pages/cities/Bangkok.jsx';
import Paris       from './pages/cities/Paris.jsx';
import KualaLumpur from './pages/cities/KualaLumpur.jsx';
import DynamicCityPage from './pages/DynamicCityPage.jsx';
import NotFoundPage    from './pages/NotFoundPage.jsx';

function SSRApp({ url, helmetContext }) {
  return (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
          <Header settings={{}} updateSetting={() => {}} />
          <Routes>
            <Route path="/"                             element={<HomePage />} />
            <Route path="/world-clock"                  element={<WorldClockPage />} />
            <Route path="/timezone-converter"           element={<TimeZoneConverterPage />} />
            <Route path="/stopwatch"                    element={<StopwatchPage />} />
            <Route path="/timer"                        element={<TimerPage />} />
            <Route path="/countdown"                    element={<CountdownPage />} />
            <Route path="/date-calculator"              element={<DateCalculatorPage />} />
            <Route path="/work-hours-calculator"        element={<WorkHoursCalculatorPage />} />
            <Route path="/meeting-planner"              element={<MeetingPlannerPage />} />
            <Route path="/ai-meeting-planner"           element={<AIMeetingPlannerPage />} />
            <Route path="/hijri-calendar"               element={<HijriCalendarPage />} />
            <Route path="/india-time"                   element={<IndiaTimePage />} />
            <Route path="/time-calculator"              element={<TimeCalculatorPage />} />
            <Route path="/time-management-tips"         element={<TimeManagementTipsPage />} />
            <Route path="/windows-time-settings"        element={<WindowsTimeSettingsPage />} />
            <Route path="/time-difference-calculator"   element={<TimeDifferenceCalculatorPage />} />
            <Route path="/world-clock-widget"           element={<WorldClockWidgetPage />} />
            <Route path="/about"                        element={<AboutPage />} />
            <Route path="/privacy-policy"               element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service"             element={<TermsOfServicePage />} />
            <Route path="/contact-us"                   element={<ContactPage />} />
            <Route path="/timezone"                     element={<TimezoneIndexPage />} />
            <Route path="/timezone/:tz"                 element={<DynamicTimezonePage />} />
            <Route path="/time-difference/:pair"        element={<TimeDifferencePairPage />} />
            <Route path="/london"       element={<London />} />
            <Route path="/dubai"        element={<Dubai />} />
            <Route path="/new-york"     element={<NewYork />} />
            <Route path="/tokyo"        element={<Tokyo />} />
            <Route path="/singapore"    element={<Singapore />} />
            <Route path="/sydney"       element={<Sydney />} />
            <Route path="/riyadh"       element={<Riyadh />} />
            <Route path="/abu-dhabi"    element={<AbuDhabi />} />
            <Route path="/istanbul"     element={<Istanbul />} />
            <Route path="/oslo"         element={<Oslo />} />
            <Route path="/bangkok"      element={<Bangkok />} />
            <Route path="/paris"        element={<Paris />} />
            <Route path="/kuala-lumpur" element={<KualaLumpur />} />
            <Route path="/:citySlug"    element={<DynamicCityPage />} />
            <Route path="*"             element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </StaticRouter>
    </HelmetProvider>
  );
}

export function render(url, helmetContext = {}) {
  const html = renderToString(<SSRApp url={url} helmetContext={helmetContext} />);
  return { html, helmetContext };
}
