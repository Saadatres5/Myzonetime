import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-border bg-background px-4 py-14 sm:px-6 lg:px-8" style={{ contain: 'layout', minHeight: '420px' }}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto grid gap-10 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-panel p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-lg shadow-primary/10">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-foreground">MyZoneTime</p>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Global time intelligence</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            MyZoneTime gives you modern time zone tools with speed and clarity. Convert, compare, and plan across cities with a sleek interface built for international teams.
          </p>
        </div>

        <div className="grid gap-5 lg:gap-6">
          <div className="glass-panel p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Platform</p>
            <div className="mt-4 grid gap-3 text-sm text-foreground">
              <Link to="/world-clock" className="block hover:text-primary transition-colors">World Clock</Link>
              <Link to="/timezone-converter" className="block hover:text-primary transition-colors">Time Converter</Link>
              <Link to="/meeting-planner" className="block hover:text-primary transition-colors">Meeting Planner</Link>
              <Link to="/work-hours-calculator" className="block hover:text-primary transition-colors">Work Hours Calc</Link>
            </div>
          </div>
          <div className="glass-panel p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Top Cities</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-foreground">
              <Link to="/dubai" className="block hover:text-primary transition-colors">Dubai</Link>
              <Link to="/london" className="block hover:text-primary transition-colors">London</Link>
              <Link to="/new-york" className="block hover:text-primary transition-colors">New York</Link>
              <Link to="/tokyo" className="block hover:text-primary transition-colors">Tokyo</Link>
              <Link to="/singapore" className="block hover:text-primary transition-colors">Singapore</Link>
              <Link to="/sydney" className="block hover:text-primary transition-colors">Sydney</Link>
              <Link to="/riyadh" className="block hover:text-primary transition-colors">Riyadh</Link>
              <Link to="/abu-dhabi" className="block hover:text-primary transition-colors">Abu Dhabi</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-10 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} MyZoneTime. All rights reserved.</p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:justify-center md:gap-8">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}