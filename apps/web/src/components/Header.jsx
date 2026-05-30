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
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
    <header className={cn('sticky top-0 z-50 w-full transition-all duration-300 border-b', scrolled ? 'bg-background/80 backdrop-blur-xl border-border shadow-sm' : 'bg-background border-transparent')} role="banner">
      <div className="container h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label="MyZoneTime home">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors" aria-hidden="true">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold tracking-tight text-xl">MyZoneTime</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={cn('text-sm font-medium transition-colors hover:text-primary relative py-2', isActive(link.path) ? 'text-primary' : 'text-muted-foreground')}
              aria-current={isActive(link.path) ? 'page' : undefined}>
              {link.name}
              {isActive(link.path) && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" aria-hidden="true" />}
            </Link>
          ))}
          <Button asChild className="ml-2 rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20">
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
            <SheetContent side="right" className="w-[300px] border-l-border bg-background/95 backdrop-blur-xl overflow-y-auto">
              <SheetTitle className="text-left mb-8 flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" aria-hidden="true" /> Navigation
              </SheetTitle>
              <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                {[{ name: 'Home', path: '/', icon: Clock }, ...navLinks].map((link) => (
                  <Link key={link.path} to={link.path}
                    className={cn('flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors', isActive(link.path) ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground')}
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
