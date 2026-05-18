import React from 'react';
import { Helmet } from 'react-helmet-async';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function TermsOfServicePage() {
  const lastUpdated = 'May 4, 2026';

  const schema = {
    '@type': 'WebPage',
    name: 'Terms of Service — MyZoneTime',
    url: 'https://myzonetime.com/terms-of-service',
    description: 'Read the terms and conditions for using MyZoneTime.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://myzonetime.com' },
        { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: 'https://myzonetime.com/terms-of-service' },
      ],
    },
  };

  return (
    <main className="flex-1 bg-background py-12 md:py-20" id="main-content">
      {/* Helmet — only real HTML tags allowed as children */}
      <Helmet>
        <title>Terms of Service | MyZoneTime</title>
        <meta name="description" content="Read the terms and conditions for using MyZoneTime. Understand your rights and responsibilities as a user." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* CanonicalTag and StructuredData MUST be outside <Helmet> */}
      <CanonicalTag pathname="/terms-of-service" />
      <StructuredData schemas={[schema]} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <header className="mb-10 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-10 text-base leading-relaxed text-muted-foreground">

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. User Agreement</h2>
            <p>
              By accessing or using MyZoneTime, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Acceptable Use</h2>
            <p>
              MyZoneTime grants you a limited, non-exclusive, non-transferable licence to access and use the platform for personal or internal business purposes. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Use the platform in any way that violates applicable local, national, or international law.</li>
              <li>Attempt to decompile, reverse-engineer, or extract the source code of the platform.</li>
              <li>Interfere with or disrupt the integrity or performance of the service or its underlying infrastructure.</li>
              <li>Use automated scripts, bots, or scrapers to access or extract data from our APIs without explicit permission.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Intellectual Property</h2>
            <p>
              All content on MyZoneTime — including text, graphics, logos, and software — is the property of MyZoneTime and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this platform without our express written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Advertising</h2>
            <p>
              MyZoneTime is supported by advertising through Google AdSense. By using this site, you acknowledge that advertisements may be displayed. We are not responsible for the content of third-party advertisements. If you wish to opt out of personalised ads, visit <a href="https://www.google.com/settings/ads" className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Disclaimer of Warranties</h2>
            <p>
              The materials and data provided on MyZoneTime (including time conversions, dates, and weather information) are provided on an "as is" basis. While we strive for accuracy, MyZoneTime makes no warranties, expressed or implied, including without limitation implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>
              In no event shall MyZoneTime or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website, even if MyZoneTime has been notified of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the relevant courts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Changes to Terms</h2>
            <p>
              MyZoneTime reserves the right to update these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of the platform after any changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
            <p>If you have any questions or concerns regarding these Terms of Service, please contact us at:</p>
            <p className="font-medium text-foreground">info@myzonetime.com</p>
          </section>

        </div>
      </div>
    </main>
  );
}
