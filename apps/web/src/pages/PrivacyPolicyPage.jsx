import React from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'May 4, 2026';

  const schema = {
    '@type': 'WebPage',
    name: 'Privacy Policy — MyZoneTime',
    url: 'https://myzonetime.com/privacy-policy',
    description: 'Learn how MyZoneTime collects, uses, and protects your data.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',           item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://myzonetime.com/privacy-policy' },
      ],
    },
  };

  return (
    <main className="flex-1 bg-background py-12 md:py-20" id="main-content">
      {/* Helmet — only real HTML tags allowed as children */}
      <Helmet>
        <title>Privacy Policy | MyZoneTime</title>
        <meta name="description" content="Learn how MyZoneTime collects, uses, and protects your data. Read our comprehensive privacy policy." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* CanonicalTag and StructuredData MUST be outside <Helmet> */}
      <CanonicalTag pathname="/privacy-policy" />
      <StructuredData schemas={[schema]} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <header className="mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-10 text-base leading-relaxed text-muted-foreground">

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Data Collection</h2>
            <p>
              MyZoneTime minimises data collection to only what is strictly necessary to provide our services. When you use our platform, we may collect non-personally identifiable information such as your estimated location (for local time and weather features), browser type, and anonymous usage metrics to help us improve the platform.
            </p>
            <p>
              If you choose to use features that require local storage (such as saving favourite cities), this data is stored directly on your device and is never transmitted to our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Data Usage</h2>
            <p>We use the limited information we collect exclusively to operate, maintain, and enhance MyZoneTime. Specifically, your data is used to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Automatically determine your local time zone upon your first visit.</li>
              <li>Fetch relevant weather data based on your coordinates (if location access is explicitly granted).</li>
              <li>Analyse aggregate traffic patterns to ensure our servers remain responsive.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Cookies &amp; Advertising</h2>
            <p>
              MyZoneTime uses Google AdSense to display advertisements. Google AdSense may use cookies and similar tracking technologies to show personalised ads based on your browsing behaviour. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </p>
            <p>
              We do not directly set advertising cookies. All advertising-related cookies are governed by Google's privacy policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Data Protection</h2>
            <p>
              We implement industry-standard security measures to protect any information against unauthorised access, alteration, disclosure, or destruction. We do not sell, trade, or otherwise transfer your information to outside parties. All external API calls (e.g., fetching weather) are processed over secure, encrypted connections.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>
              Because we do not store personal accounts or server-side profiles, you retain full control over your data. You can clear your saved cities and preferences at any time by clearing your browser's local storage or cache. If you have granted location permissions, you can revoke them directly through your browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Third-Party Services</h2>
            <p>Our platform integrates with the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong className="text-foreground">Open-Meteo</strong> — open-source weather API. No personal data is shared.</li>
              <li><strong className="text-foreground">Google AdSense</strong> — advertising network. Subject to <a href="https://policies.google.com/privacy" className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
              <li><strong className="text-foreground">Unsplash</strong> — city photography. No user data is shared.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
            <p>For any questions, concerns, or feedback regarding this Privacy Policy, please contact us at:</p>
            <p className="font-medium text-foreground">info@myzonetime.com</p>
          </section>

        </div>
      </div>
    </main>
  );
}
