import React, { Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Lazy load Pages
const HomePage                    = React.lazy(() => import('./pages/HomePage.jsx'));
const WorldClockPage              = React.lazy(() => import('./pages/WorldClockPage.jsx'));
const TimeZoneConverterPage       = React.lazy(() => import('./pages/TimeZoneConverterPage.jsx'));
const StopwatchPage               = React.lazy(() => import('./pages/StopwatchPage.jsx'));
const TimerPage                   = React.lazy(() => import('./pages/TimerPage.jsx'));
const CountdownPage               = React.lazy(() => import('./pages/CountdownPage.jsx'));
const DateCalculatorPage          = React.lazy(() => import('./pages/DateCalculatorPage.jsx'));
const WorkHoursCalculatorPage     = React.lazy(() => import('./pages/WorkHoursCalculatorPage.jsx'));
const MeetingPlannerPage          = React.lazy(() => import('./pages/MeetingPlannerPage.jsx'));
const HijriCalendarPage           = React.lazy(() => import('./pages/HijriCalendarPage.jsx'));
const TimeDifferenceCalculatorPage = React.lazy(() => import('./pages/TimeDifferenceCalculatorPage.jsx'));
const WorldClockWidgetPage        = React.lazy(() => import('./pages/WorldClockWidgetPage.jsx'));
const EmbedPage                   = React.lazy(() => import('./pages/EmbedPage.jsx'));
const PrivacyPolicyPage           = React.lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage          = React.lazy(() => import('./pages/TermsOfServicePage.jsx'));

// City Pages
const London    = React.lazy(() => import('./pages/cities/London.jsx'));
const Dubai     = React.lazy(() => import('./pages/cities/Dubai.jsx'));
const NewYork   = React.lazy(() => import('./pages/cities/NewYork.jsx'));
const Tokyo     = React.lazy(() => import('./pages/cities/Tokyo.jsx'));
const Singapore = React.lazy(() => import('./pages/cities/Singapore.jsx'));
const Sydney    = React.lazy(() => import('./pages/cities/Sydney.jsx'));
const Riyadh    = React.lazy(() => import('./pages/cities/Riyadh.jsx'));
const AbuDhabi  = React.lazy(() => import('./pages/cities/AbuDhabi.jsx'));

const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage.jsx'));

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse" aria-hidden="true">
      <div className="container py-20 space-y-8 max-w-6xl mx-auto">
        <div className="h-10 w-2/3 bg-muted rounded-xl mx-auto" />
        <div className="h-5 w-1/2 bg-muted/60 rounded-xl mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-muted/40 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  // KEY FIX: location.pathname is used as ErrorBoundary key so it fully
  // resets on every route change — prevents stale hasError=true across navigations.
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header />
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/"                            element={<HomePage />} />
            <Route path="/world-clock"                 element={<WorldClockPage />} />
            <Route path="/converter"                   element={<Navigate to="/timezone-converter" replace />} />
            <Route path="/timezone-converter"          element={<TimeZoneConverterPage />} />
            <Route path="/stopwatch"                   element={<StopwatchPage />} />
            <Route path="/timer"                       element={<TimerPage />} />
            <Route path="/countdown"                   element={<CountdownPage />} />
            <Route path="/date-calculator"             element={<DateCalculatorPage />} />
            <Route path="/work-hours-calculator"       element={<WorkHoursCalculatorPage />} />
            <Route path="/meeting-planner"             element={<MeetingPlannerPage />} />
            <Route path="/hijri-calendar"              element={<HijriCalendarPage />} />
            <Route path="/time-difference-calculator"  element={<TimeDifferenceCalculatorPage />} />
            <Route path="/world-clock-widget"          element={<WorldClockWidgetPage />} />
            <Route path="/embed/world-clock"           element={<EmbedPage />} />
            <Route path="/privacy-policy"              element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service"            element={<TermsOfServicePage />} />
            {/* Slug redirects */}
            <Route path="/newyork"   element={<Navigate to="/new-york"  replace />} />
            <Route path="/abudhabi"  element={<Navigate to="/abu-dhabi" replace />} />
            {/* City pages */}
            <Route path="/london"    element={<London />} />
            <Route path="/dubai"     element={<Dubai />} />
            <Route path="/new-york"  element={<NewYork />} />
            <Route path="/tokyo"     element={<Tokyo />} />
            <Route path="/singapore" element={<Singapore />} />
            <Route path="/sydney"    element={<Sydney />} />
            <Route path="/riyadh"    element={<Riyadh />} />
            <Route path="/abu-dhabi" element={<AbuDhabi />} />
            <Route path="*"          element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Helmet
        defaultTitle="MyZoneTime — World Clock & Time Zone Tools"
        titleTemplate="%s | MyZoneTime"
      >
        <html lang="en" />
        <meta name="application-name" content="MyZoneTime" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="theme-color" content="#0EA5E9" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      </Helmet>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}
