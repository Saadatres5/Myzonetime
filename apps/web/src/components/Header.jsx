import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Clock, Globe2, ArrowRightLeft, Calendar, Moon, Code, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'World Clock', path: '/world-clock', icon: Globe2 },
    { name: 'Converter', path: '/timezone-converter', icon: ArrowRightLeft },
    { name: 'Meeting Planner', path: '/meeting-planner', icon: Calendar },
    { name: 'Time Difference', path: '/time-difference-calculator', icon: Timer },
    { name: 'Hijri Calendar', path: '/hijri-calendar', icon: Moon },
    { name: 'Widget', path: '/world-clock-widget', icon: Code },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className={cn('sticky top-0 z-50 w-full transition-all duration-300 border-b', scrolled ? 'bg-background/92 backdrop-blur-2xl border-border/70 shadow-sm shadow-black/10' : 'bg-background/90 border-transparent') } role="banner">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group" aria-label="MyZoneTime home">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary shadow-lg shadow-primary/10 transition-all duration-300 group-hover:scale-[1.02]">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold tracking-tight text-lg text-foreground">MyZoneTime</p>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Global time tools</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={cn('text-sm font-medium transition-colors duration-200 relative py-2 uppercase tracking-[0.08em]', isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
              aria-current={isActive(link.path) ? 'page' : undefined}>
              {link.name}
              {isActive(link.path) && <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary" aria-hidden="true" />}
            </Link>
          ))}
          <Button asChild className="ml-2 rounded-full px-6 py-3 shadow-xl shadow-primary/15">
            <Link to="/world-clock">Get Started</Link>
          </Button>
        </nav>

        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" aria-label="Open navigation menu" aria-expanded={mobileOpen}>
                <Menu className="w-6 h-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-border bg-background/95 backdrop-blur-2xl overflow-y-auto">
              <SheetTitle className="mb-8 flex items-center gap-3 text-lg font-semibold text-foreground">
                <Clock className="w-5 h-5 text-primary" aria-hidden="true" /> Navigation
              </SheetTitle>
              <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                {[{ name: 'Home', path: '/', icon: Clock }, ...navLinks].map((link) => (
                  <Link key={link.path} to={link.path}
                    className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors duration-200', isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground')}
                    aria-current={isActive(link.path) ? 'page' : undefined}>
                    <link.icon className="w-5 h-5" aria-hidden="true" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
