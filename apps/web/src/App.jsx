import React, { Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

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
const HijriCalendarPage            = React.lazy(() => import('./pages/HijriCalendarPage.jsx'));
const TimeDifferenceCalculatorPage = React.lazy(() => import('./pages/TimeDifferenceCalculatorPage.jsx'));
const WorldClockWidgetPage         = React.lazy(() => import('./pages/WorldClockWidgetPage.jsx'));
const EmbedPage                    = React.lazy(() => import('./pages/EmbedPage.jsx'));
const PrivacyPolicyPage            = React.lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage           = React.lazy(() => import('./pages/TermsOfServicePage.jsx'));
const ContactPage                  = React.lazy(() => import('./pages/ContactPage.jsx'));

// ── City-pair time-difference pages (new — SEO/GEO traffic) ─────────────────
// Single component handles all /time-difference/:pair routes.
// Reversed pairs are 301-redirected to canonical order inside the component.
const TimeDifferencePairPage = React.lazy(() => import('./pages/TimeDifferencePairPage.jsx'));

// ── City pages (existing) ────────────────────────────────────────────────────
const London    = React.lazy(() => import('./pages/cities/London.jsx'));
const Dubai     = React.lazy(() => import('./pages/cities/Dubai.jsx'));
const NewYork   = React.lazy(() => import('./pages/cities/NewYork.jsx'));
const Tokyo     = React.lazy(() => import('./pages/cities/Tokyo.jsx'));
const Singapore = React.lazy(() => import('./pages/cities/Singapore.jsx'));
const Sydney    = React.lazy(() => import('./pages/cities/Sydney.jsx'));
const Riyadh    = React.lazy(() => import('./pages/cities/Riyadh.jsx'));
const AbuDhabi  = React.lazy(() => import('./pages/cities/AbuDhabi.jsx'));

// ── New city pages (to be created — stub to CityPage until built) ────────────
// Each city is lazily loaded. If the file doesn't exist yet, React.lazy
// will throw and ErrorBoundary will catch it. Create each file when ready.
const Istanbul    = React.lazy(() => import('./pages/cities/Istanbul.jsx'));
const Oslo        = React.lazy(() => import('./pages/cities/Oslo.jsx'));
const Bangkok     = React.lazy(() => import('./pages/cities/Bangkok.jsx'));
const Paris       = React.lazy(() => import('./pages/cities/Paris.jsx'));
const KualaLumpur = React.lazy(() => import('./pages/cities/KualaLumpur.jsx'));

// ── 404 page ─────────────────────────────────────────────────────────────────
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage.jsx'));

// ── Loading skeleton ──────────────────────────────────────────────────────────
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
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header />
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>

            {/* ── Core tools ──────────────────────────────────────────────── */}
            <Route path="/"                             element={<HomePage />} />
            <Route path="/world-clock"                  element={<WorldClockPage />} />
            <Route path="/timezone-converter"           element={<TimeZoneConverterPage />} />
            <Route path="/stopwatch"                    element={<StopwatchPage />} />
            <Route path="/timer"                        element={<TimerPage />} />
            <Route path="/countdown"                    element={<CountdownPage />} />
            <Route path="/date-calculator"              element={<DateCalculatorPage />} />
            <Route path="/work-hours-calculator"        element={<WorkHoursCalculatorPage />} />
            <Route path="/meeting-planner"              element={<MeetingPlannerPage />} />
            <Route path="/hijri-calendar"               element={<HijriCalendarPage />} />
            <Route path="/time-difference-calculator"   element={<TimeDifferenceCalculatorPage />} />
            <Route path="/world-clock-widget"           element={<WorldClockWidgetPage />} />
            <Route path="/embed/world-clock"            element={<EmbedPage />} />
            <Route path="/privacy-policy"               element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service"             element={<TermsOfServicePage />} />
            <Route path="/contact-us"                  element={<ContactPage />} />

            {/* ── City-pair time-difference pages ─────────────────────────── */}
            {/*
              /time-difference/:pair handles all city-pair URLs.
              The component itself parses the pair string, resolves cities
              from citiesData, and redirects reversed pairs to canonical.
              Examples:
                /time-difference/new-york-london
                /time-difference/dubai-london
                /time-difference/london-new-york  (→ redirects to new-york-london)
            */}
            <Route path="/time-difference/:pair"        element={<TimeDifferencePairPage />} />

            {/* ── Legacy / short redirects (301 permanent via Navigate) ───── */}
            <Route path="/converter"    element={<Navigate to="/timezone-converter" replace />} />
            <Route path="/newyork"      element={<Navigate to="/new-york"           replace />} />
            <Route path="/abudhabi"     element={<Navigate to="/abu-dhabi"          replace />} />
            <Route path="/world_clock"  element={<Navigate to="/world-clock"        replace />} />

            {/* ── City pages (Tier 1 — existing) ──────────────────────────── */}
            <Route path="/london"    element={<London />} />
            <Route path="/dubai"     element={<Dubai />} />
            <Route path="/new-york"  element={<NewYork />} />
            <Route path="/tokyo"     element={<Tokyo />} />
            <Route path="/singapore" element={<Singapore />} />
            <Route path="/sydney"    element={<Sydney />} />
            <Route path="/riyadh"    element={<Riyadh />} />
            <Route path="/abu-dhabi" element={<AbuDhabi />} />

            {/* ── City pages (Tier 2 — new, build these files next) ───────── */}
            {/*
              ⚠️ CREATE THESE FILES before deploying:
                apps/web/src/pages/cities/Istanbul.jsx
                apps/web/src/pages/cities/Oslo.jsx
                apps/web/src/pages/cities/Bangkok.jsx
                apps/web/src/pages/cities/Paris.jsx
                apps/web/src/pages/cities/KualaLumpur.jsx
              Copy Dubai.jsx as a template and change:
                - cityName, timezone, region, UTC offset text
                - FAQs (update DST status, business hours, UTC offset)
                - Helmet title/description
                - geoMeta values (lat/lng)
              Istanbul is highest priority: it has position 40 in GSC already.
            */}
            <Route path="/istanbul"     element={<Istanbul />} />
            <Route path="/oslo"         element={<Oslo />} />
            <Route path="/bangkok"      element={<Bangkok />} />
            <Route path="/paris"        element={<Paris />} />
            <Route path="/kuala-lumpur" element={<KualaLumpur />} />

            {/* ── 404 ─────────────────────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />

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
        titleTemplate="%s"
      >
        <html lang="en" />
        <meta name="application-name" content="MyZoneTime" />
        <meta property="og:site_name" content="MyZoneTime" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:creator" content="@myzonetime" />
        <meta name="theme-color" content="#0EA5E9" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/* Mobile / PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyZoneTime" />
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//api.open-meteo.com" />
      </Helmet>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}
