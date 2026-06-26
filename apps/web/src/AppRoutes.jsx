/**
 * AppRoutes.jsx
 * Shared route tree used by both the client (App.jsx) and the SSR
 * pre-render entry (entry-server.jsx).  No Router/HelmetProvider here —
 * those are provided by the parent in each context.
 */
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useSettings } from './hooks/useSettings.js';

// ── Core tool pages ──────────────────────────────────────────────────────────
const HomePage                     = React.lazy(() => import('./pages/HomePage.jsx'));
const WorldClockPage               = React.lazy(() => import('./pages/WorldClockPage.jsx'));
const TimeZoneConverterPage        = React.lazy(() => import('./pages/TimeZoneConverterPage.jsx'));
const StopwatchPage                = React.lazy(() => import('./pages/StopwatchPage.jsx'));
const TimerPage                    = React.lazy(() => import('./pages/TimerPage.jsx'));
const CountdownPage                = React.lazy(() => import('./pages/CountdownPage.jsx'));
const DateCalculatorPage           = React.lazy(() => import('./pages/DateCalculatorPage.jsx'));
const WorkHoursCalculatorPage      = React.lazy(() => import('./pages/WorkHoursCalculatorPage.jsx'));
const MeetingPlannerPage           = React.lazy(() => import('./pages/MeetingPlannerPage.jsx'));
const AIMeetingPlannerPage         = React.lazy(() => import('./pages/AIMeetingPlannerPage.jsx'));
const HijriCalendarPage            = React.lazy(() => import('./pages/HijriCalendarPage.jsx'));
const IndiaTimePage                = React.lazy(() => import('./pages/IndiaTimePage.jsx'));
const TimeCalculatorPage           = React.lazy(() => import('./pages/TimeCalculatorPage.jsx'));
const TimeManagementTipsPage       = React.lazy(() => import('./pages/TimeManagementTipsPage.jsx'));
const WindowsTimeSettingsPage      = React.lazy(() => import('./pages/WindowsTimeSettingsPage.jsx'));
const TimeDifferenceCalculatorPage = React.lazy(() => import('./pages/TimeDifferenceCalculatorPage.jsx'));
const WorldClockWidgetPage         = React.lazy(() => import('./pages/WorldClockWidgetPage.jsx'));
const EmbedPage                    = React.lazy(() => import('./pages/EmbedPage.jsx'));
const PrivacyPolicyPage            = React.lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage           = React.lazy(() => import('./pages/TermsOfServicePage.jsx'));
const AboutPage                    = React.lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage                  = React.lazy(() => import('./pages/ContactPage.jsx'));
const TimeDifferencePairPage       = React.lazy(() => import('./pages/TimeDifferencePairPage.jsx'));
const TimezoneIndexPage            = React.lazy(() => import('./pages/TimezoneIndexPage.jsx'));
const DynamicTimezonePage          = React.lazy(() => import('./pages/DynamicTimezonePage.jsx'));

// Tier-1 city pages
const London      = React.lazy(() => import('./pages/cities/London.jsx'));
const Dubai       = React.lazy(() => import('./pages/cities/Dubai.jsx'));
const NewYork     = React.lazy(() => import('./pages/cities/NewYork.jsx'));
const Tokyo       = React.lazy(() => import('./pages/cities/Tokyo.jsx'));
const Singapore   = React.lazy(() => import('./pages/cities/Singapore.jsx'));
const Sydney      = React.lazy(() => import('./pages/cities/Sydney.jsx'));
const Riyadh      = React.lazy(() => import('./pages/cities/Riyadh.jsx'));
const AbuDhabi    = React.lazy(() => import('./pages/cities/AbuDhabi.jsx'));
const Istanbul    = React.lazy(() => import('./pages/cities/Istanbul.jsx'));
const Oslo        = React.lazy(() => import('./pages/cities/Oslo.jsx'));
const Bangkok     = React.lazy(() => import('./pages/cities/Bangkok.jsx'));
const Paris       = React.lazy(() => import('./pages/cities/Paris.jsx'));
const KualaLumpur = React.lazy(() => import('./pages/cities/KualaLumpur.jsx'));

// Tier-2 dynamic city page
const DynamicCityPage = React.lazy(() => import('./pages/DynamicCityPage.jsx'));
const NotFoundPage    = React.lazy(() => import('./pages/NotFoundPage.jsx'));

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse" aria-hidden="true">
      <div className="container py-20 space-y-8 max-w-6xl mx-auto">
        <div className="h-10 w-2/3 bg-muted rounded-xl mx-auto" />
        <div className="h-5 w-1/2 bg-muted/60 rounded-xl mx-auto" />
      </div>
    </div>
  );
}

function AppContent({ settings, updateSetting }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header settings={settings} updateSetting={updateSetting} />
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageSkeleton />}>
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
            <Route path="/embed/world-clock"            element={<EmbedPage />} />
            <Route path="/about"                        element={<AboutPage />} />
            <Route path="/privacy-policy"               element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service"             element={<TermsOfServicePage />} />
            <Route path="/contact-us"                   element={<ContactPage />} />
            <Route path="/timezone"                     element={<TimezoneIndexPage />} />
            <Route path="/timezone/:tz"                 element={<DynamicTimezonePage />} />
            <Route path="/time-difference/:pair"        element={<TimeDifferencePairPage />} />
            <Route path="/converter"    element={<Navigate to="/timezone-converter" replace />} />
            <Route path="/newyork"      element={<Navigate to="/new-york"           replace />} />
            <Route path="/abudhabi"     element={<Navigate to="/abu-dhabi"          replace />} />
            <Route path="/world_clock"  element={<Navigate to="/world-clock"        replace />} />
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
            <Route path="/404"          element={<NotFoundPage />} />
            <Route path="*"             element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default function AppRoutes() {
  const { settings, updateSetting } = useSettings();
  return <AppContent settings={settings} updateSetting={updateSetting} />;
}
