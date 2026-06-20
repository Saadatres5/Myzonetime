import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Globe, ArrowRightLeft, Calendar, Timer, Moon, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const toolLinks = [
    { to: '/world-clock',               label: 'World Clock' },
    { to: '/timezone-converter',        label: 'Time Zone Converter' },
    { to: '/meeting-planner',           label: 'Meeting Planner' },
    { to: '/ai-meeting-planner',        label: 'AI Meeting Planner' },
    { to: '/time-difference-calculator',label: 'Time Difference' },
    { to: '/time-calculator',           label: 'Time Calculator' },
    { to: '/work-hours-calculator',     label: 'Work Hours Calculator' },
    { to: '/date-calculator',           label: 'Date Calculator' },
    { to: '/hijri-calendar',            label: 'Hijri Calendar' },
    { to: '/india-time',                label: 'India Time' },
    { to: '/stopwatch',                 label: 'Stopwatch' },
    { to: '/timer',                     label: 'Timer' },
    { to: '/countdown',                 label: 'Countdown' },
    { to: '/time-management-tips',      label: 'Time Management Tips' },
    { to: '/windows-time-settings',     label: 'Windows Time Settings' },
  ];

  const cityLinks = [
    { to: '/dubai',       label: 'Dubai Time' },
    { to: '/london',      label: 'London Time' },
    { to: '/new-york',    label: 'New York Time' },
    { to: '/tokyo',       label: 'Tokyo Time' },
    { to: '/singapore',   label: 'Singapore Time' },
    { to: '/sydney',      label: 'Sydney Time' },
    { to: '/riyadh',      label: 'Riyadh Time' },
    { to: '/abu-dhabi',   label: 'Abu Dhabi Time' },
    { to: '/istanbul',    label: 'Istanbul Time' },
    { to: '/paris',       label: 'Paris Time' },
    { to: '/bangkok',     label: 'Bangkok Time' },
    { to: '/kuala-lumpur',label: 'Kuala Lumpur Time' },
  ];

  const timeDiffLinks = [
    { to: '/time-difference/new-york-and-london',   label: 'New York ↔ London' },
    { to: '/time-difference/dubai-and-london',      label: 'Dubai ↔ London' },
    { to: '/time-difference/dubai-and-new-york',    label: 'Dubai ↔ New York' },
    { to: '/time-difference/london-and-singapore',  label: 'London ↔ Singapore' },
    { to: '/time-difference/sydney-and-london',     label: 'Sydney ↔ London' },
    { to: '/time-difference/riyadh-and-london',     label: 'Riyadh ↔ London' },
  ];

  return (
    <footer
      className="relative w-full border-t border-border bg-background"
      aria-label="Site footer"
    >
      {/* Top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* ── Brand + Description ── */}
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] lg:grid-cols-[1.8fr_1fr_1fr_1fr] mb-12">

          <div>
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit" aria-label="MyZoneTime home">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-lg shadow-primary/10">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-foreground">MyZoneTime</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Global time intelligence</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Free world clock and time zone tools for global teams. Convert time zones, plan
              meetings, check the Hijri calendar, and explore 500+ city clocks — all at no cost.
            </p>
            <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
              <Link to="/contact-us" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5" aria-hidden="true" /> Contact Us
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/timezone" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" /> All Timezones
              </Link>
            </div>
          </div>

          {/* ── Tools ── */}
          <nav aria-label="Tool pages">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-4">Tools</p>
            <ul className="space-y-2.5 text-sm">
              {toolLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-foreground/80 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── City Pages ── */}
          <nav aria-label="City time pages">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-4">City Clocks</p>
            <ul className="space-y-2.5 text-sm">
              {cityLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-foreground/80 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Time Differences ── */}
          <nav aria-label="Time difference pages">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-4">Time Differences</p>
            <ul className="space-y-2.5 text-sm">
              {timeDiffLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-foreground/80 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/time-difference-calculator" className="text-primary hover:underline text-sm">
                  Compare any two cities →
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} MyZoneTime. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Legal links">
            <Link to="/about"             className="hover:text-primary transition-colors">About</Link>
            <Link to="/privacy-policy"  className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/contact-us"      className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/world-clock-widget" className="hover:text-primary transition-colors">Embed Widget</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
