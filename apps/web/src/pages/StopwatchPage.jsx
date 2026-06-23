import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Play, Square, RotateCcw, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function StopwatchPage() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStartStop = () => setIsRunning(!isRunning);
  const handleReset = () => { setIsRunning(false); setTime(0); setLaps([]); };
  const handleLap = () => { if (isRunning) setLaps((prevLaps) => [time, ...prevLaps]); };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return {
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0')
    };
  };

  const current = formatTime(time);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Stopwatch",
    "applicationCategory": "UtilityApplication",
    "description": "Precision online stopwatch with lap tracking."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Stopwatch", "item": "https://myzonetime.com/stopwatch" }
    ]
  };

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Online Stopwatch — Free Accurate Timer | MyZoneTime</title>
        <meta name="description" content="Free online stopwatch with millisecond precision. Perfect for timing workouts, races, and productivity sessions." />
        <meta property="og:title" content="Online Stopwatch — Free Accurate Timer | MyZoneTime" />
        <meta property="og:description" content="Free online stopwatch with millisecond precision. Perfect for timing workouts, races, and productivity sessions." />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stopwatch | MyZoneTime" />
        <meta name="twitter:description" content="Precision online stopwatch with lap tracking." />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname="/stopwatch" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="w-full max-w-md mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Free Online Stopwatch - Accurate Time Tracking
          </h1>
          <p className="text-muted-foreground">Precision timing with lap tracking</p>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl md:text-7xl font-mono-time font-medium tracking-tighter flex items-baseline">
            <span className="time-segment">{current.m}</span>
            <span className="time-separator">:</span>
            <span className="time-segment">{current.s}</span>
            <span className="time-separator text-muted-foreground/30">.</span>
            <span className="time-segment text-4xl md:text-5xl text-muted-foreground">{current.ms}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            variant={isRunning ? "destructive" : "default"}
            className="w-24 h-24 rounded-full flex flex-col gap-1"
            onClick={handleStartStop}
          >
            {isRunning ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            <span className="text-xs">{isRunning ? 'Stop' : 'Start'}</span>
          </Button>
          
          <Button 
            size="lg" 
            variant="secondary"
            className="w-24 h-24 rounded-full flex flex-col gap-1"
            onClick={isRunning ? handleLap : handleReset}
            disabled={!isRunning && time === 0}
          >
            {isRunning ? <Flag className="w-6 h-6" /> : <RotateCcw className="w-6 h-6" />}
            <span className="text-xs">{isRunning ? 'Lap' : 'Reset'}</span>
          </Button>
        </div>

        {laps.length > 0 && (
          <div className="mt-12 border-t border-border pt-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 px-2">Laps</h2>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
              {laps.map((lapTime, index) => {
                const lapFormatted = formatTime(lapTime);
                const prevLapTime = index === laps.length - 1 ? 0 : laps[index + 1];
                const diffFormatted = formatTime(lapTime - prevLapTime);
                
                return (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 text-sm font-mono-time">
                    <span className="text-muted-foreground">Lap {laps.length - index}</span>
                    <div className="flex gap-4 text-right">
                      <span className="text-muted-foreground w-20">+{diffFormatted.m}:{diffFormatted.s}.{diffFormatted.ms}</span>
                      <span className="font-medium w-20">{lapFormatted.m}:{lapFormatted.s}.{lapFormatted.ms}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SEO content */}
      <section className="py-14 border-t border-border/40">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Stopwatch with Lap Timer</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This free stopwatch measures elapsed time to the millisecond. Use it for sports training, cooking, experiments, presentations, or any task where you need precise time tracking. Tap the Lap button to record split times without stopping the clock.
          </p>
          <h2 className="text-2xl font-bold tracking-tight mb-4">How to Use the Lap Timer</h2>
          <p className="text-muted-foreground leading-relaxed">
            Press Start to begin counting. Press Lap each time you want to record a split time — the stopwatch keeps running. Each lap entry shows both the individual lap duration and cumulative elapsed time. Press Reset to clear all laps and return to zero.
          </p>
        </div>
      </section>
    </main>
  );
}