/**
 * AboutPage.jsx — Route: /about
 * Critical E-E-A-T page. Establishes brand identity, expertise, and trust signals.
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Globe2, Clock, Users, Zap, Shield, Heart, MapPin, ChevronRight } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

const BASE = 'https://myzonetime.com';

const TOOLS = [
  { name: 'World Clock', path: '/world-clock', desc: 'Live time in 500+ cities' },
  { name: 'Meeting Planner', path: '/meeting-planner', desc: 'Best meeting time across 7 cities' },
  { name: 'AI Meeting Planner', path: '/ai-meeting-planner', desc: 'Natural language scheduling' },
  { name: 'Time Zone Converter', path: '/timezone-converter', desc: 'DST-aware conversion' },
  { name: 'Hijri Calendar', path: '/hijri-calendar', desc: 'Islamic date & Gregorian conversion' },
  { name: 'Time Difference Calculator', path: '/time-difference-calculator', desc: 'Exact hours between cities' },
  { name: 'Work Hours Calculator', path: '/work-hours-calculator', desc: 'Overlap hours for remote teams' },
  { name: 'India Time', path: '/india-time', desc: 'Live IST clock & comparisons' },
];

const VALUES = [
  { icon: Zap, title: 'Fast & Free', desc: 'Every tool loads in under 2 seconds and costs nothing. No signup, no subscription, no catch.' },
  { icon: Shield, title: 'Accurate', desc: 'We use IANA timezone data — the authoritative global standard — ensuring correct DST handling for every city.' },
  { icon: Globe2, title: 'Globally inclusive', desc: 'We build for every region, not just the West. The Gulf, South Asia, East Asia, and Africa are first-class citizens here.' },
  { icon: Heart, title: 'Privacy-first', desc: 'We collect no personal data, require no accounts, and our tools work entirely in your browser.' },
];

export default function AboutPage() {
  const TODAY = new Date().toISOString().split('T')[0];

  const orgSchema = {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'MyZoneTime',
    url: BASE,
    description: 'MyZoneTime is a free global time intelligence platform providing world clocks, time zone converters, international meeting planners, Hijri calendar, and AI-powered scheduling tools for 500+ cities worldwide. Built for global remote teams, international businesses, and the Muslim world.',
    logo: { '@type': 'ImageObject', url: `${BASE}/favicon.svg`, width: 512, height: 512 },
    foundingLocation: { '@type': 'Place', name: 'United Arab Emirates' },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    sameAs: [
      'https://twitter.com/myzonetime',
      'https://www.linkedin.com/company/myzonetime',
    ],
  };

  const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${BASE}/about#webpage`,
    url: `${BASE}/about`,
    name: 'About MyZoneTime — Free Global Time Intelligence Platform',
    description: 'MyZoneTime provides free world clocks, time zone tools, meeting planners, and Hijri calendar for 500+ cities worldwide. Learn about our mission and tools.',
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#organization` },
    about: { '@id': `${BASE}/#organization` },
    dateModified: TODAY,
    inLanguage: 'en',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE}/about` },
      ],
    },
  };

  return (
    <>
      <CanonicalTag pathname="/about" />
      <Helmet>
        <title>About MyZoneTime — Free Global Time Tools for 500+ Cities | MyZoneTime</title>
        <meta name="description" content="MyZoneTime offers free world clocks, time zone converters, meeting planners, and Hijri calendar for 500+ cities globally." />
        <meta property="og:title" content="About MyZoneTime — Free Global Time Intelligence Platform" />
        <meta property="og:description" content="Free world clocks, time zone tools, meeting planners, and Hijri calendar for 500+ cities worldwide." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <StructuredData schemas={[webPageSchema, orgSchema]} />

      <main id="main-content" className="min-h-screen bg-background">

        {/* Hero */}
        <section className="relative py-16 md:py-24 border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl bg-primary/15 rounded-full blur-[80px] opacity-40" />
          </div>
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-sm font-medium text-primary mb-6">
              <MapPin className="w-4 h-4" /> Made in the UAE · Used Worldwide
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              About MyZoneTime
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We build free, fast, accurate time zone tools for global teams, travellers, and businesses worldwide — with special focus on the Gulf, South Asia, and Muslim communities.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 border-b border-border/40">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 space-y-5 text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">Our mission</h2>
            <p>
              Time zone confusion costs global teams real productivity every week. Someone shows up to a call an hour early. A deadline gets missed because of a DST transition nobody noticed. A meeting between Dubai and New York gets scheduled at 2 AM for one side because nobody checked the overlap.
            </p>
            <p>
              MyZoneTime exists to solve these problems — for free, for everyone, without requiring an account or a subscription. We built the tools we personally needed when coordinating across the Gulf, UK, and India, and we made them public.
            </p>
            <p>
              We are particularly focused on serving the Middle East and Gulf market, which is often underserved by Western-centric time zone tools. Abu Dhabi and Dubai are first-class cities in our platform — not afterthoughts. Our Hijri calendar is built for the Muslim world, not bolted on.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/10 border-b border-border/40">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-8">What we stand for</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {VALUES.map(v => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="premium-card p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{v.title}</div>
                      <div className="text-sm text-muted-foreground">{v.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="py-16 border-b border-border/40">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-2">Our tools</h2>
            <p className="text-muted-foreground mb-8">All free. No account. No limits.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOOLS.map(t => (
                <Link key={t.path} to={t.path} className="premium-card p-4 flex items-center justify-between group hover:border-primary/40 transition-colors">
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted/10 border-b border-border/40">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: '500+', label: 'Cities covered' },
                { value: '14', label: 'Time zone pages' },
                { value: '528+', label: 'City pair comparisons' },
                { value: '100%', label: 'Free, always' },
              ].map(s => (
                <div key={s.label} className="premium-card p-5">
                  <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="container max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Get in touch</h2>
            <p className="text-muted-foreground mb-6">
              Questions, suggestions, or feedback? We'd love to hear from you.
            </p>
            <Link to="/contact-us" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Contact Us <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="py-16 border-t border-border/40">
          <div className="container max-w-3xl mx-auto px-4 space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Why Time Zone Tools Matter</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As remote work, international trade, and global communication continue to grow, the ability to quickly and accurately work across time zones has become an essential skill. Scheduling errors caused by time zone confusion cost businesses millions of hours each year — missed calls, late deliveries, and rescheduled meetings all stem from the deceptively simple question: "What time is it there?"
              </p>
              <p className="text-muted-foreground leading-relaxed">
                MyZoneTime was built to eliminate that uncertainty. We provide the tools that make it easy for anyone — whether a freelancer, a corporate team, or a traveller — to understand time across borders instantly and without confusion.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Built for the Gulf Region and Global Teams</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While MyZoneTime serves users worldwide, we pay particular attention to the needs of users in the Gulf Cooperation Council (GCC) region — the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman. This region has a unique time zone landscape: no daylight saving time, a historically Friday-Saturday weekend (now shifting to Saturday-Sunday in many private sector companies), and close business ties with both Asian and European markets simultaneously.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We also include the Hijri Islamic calendar alongside the Gregorian calendar, recognising that for hundreds of millions of people, Hijri dates are as important as Gregorian ones for religious observance, legal documents, and cultural events.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Our Commitment to Accuracy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All time data on MyZoneTime uses the IANA Time Zone Database — the same standard used by operating systems, browsers, and most programming languages worldwide. This ensures our clocks and conversions are accurate for every city, including correct handling of daylight saving transitions, historical rule changes, and unusual offsets like Nepal's UTC+5:45.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We update our tools continuously to reflect policy changes — when a country changes its DST rules or UTC offset (as Samoa did in 2011 and Turkey did in 2016), we ensure our platform reflects the new reality as quickly as possible.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Free, Forever</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every tool on MyZoneTime is free to use. There are no paywalls, no account requirements, and no feature tiers. We believe that access to accurate time information is a basic utility, not a premium feature. We sustain the platform through non-intrusive advertising so that all core tools remain permanently accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
