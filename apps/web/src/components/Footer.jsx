import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-border mt-auto relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 mb-16">
          <div className="space-y-6 max-w-sm">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold tracking-tight text-xl">MyZoneTime</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The premium global time intelligence platform. Seamlessly sync your team, convert time zones, and plan meetings across the world with uncompromising accuracy.
            </p>
          </div>
          
          <div className="flex gap-16 md:gap-24">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground tracking-wide">Platform</h4>
              <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
                <Link to="/world-clock" className="hover:text-primary transition-colors">World Clock</Link>
                <Link to="/timezone-converter" className="hover:text-primary transition-colors">Time Converter</Link>
                <Link to="/meeting-planner" className="hover:text-primary transition-colors">Meeting Planner</Link>
                <Link to="/work-hours-calculator" className="hover:text-primary transition-colors">Timesheet Calc</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground tracking-wide">Top Cities</h4>
              <nav className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <Link to="/dubai" className="hover:text-primary transition-colors">Dubai</Link>
                <Link to="/london" className="hover:text-primary transition-colors">London</Link>
                <Link to="/new-york" className="hover:text-primary transition-colors">New York</Link>
                <Link to="/tokyo" className="hover:text-primary transition-colors">Tokyo</Link>
                <Link to="/singapore" className="hover:text-primary transition-colors">Singapore</Link>
                <Link to="/sydney" className="hover:text-primary transition-colors">Sydney</Link>
                <Link to="/riyadh" className="hover:text-primary transition-colors">Riyadh</Link>
                <Link to="/abu-dhabi" className="hover:text-primary transition-colors">Abu Dhabi</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 MyZoneTime. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}