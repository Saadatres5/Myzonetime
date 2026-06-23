import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';

export default function TimerPage() {
  const [inputHours, setInputHours] = useState('00');
  const [inputMinutes, setInputMinutes] = useState('05');
  const [inputSeconds, setInputSeconds] = useState('00');
  
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current);
      playAlarm();
      toast.success("Timer completed!");
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, remainingSeconds]);

  const playAlarm = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  const handleStart = () => {
    if (remainingSeconds === 0) {
      const h = parseInt(inputHours) || 0;
      const m = parseInt(inputMinutes) || 0;
      const s = parseInt(inputSeconds) || 0;
      const total = h * 3600 + m * 60 + s;
      if (total > 0) {
        setTotalSeconds(total);
        setRemainingSeconds(total);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    const h = parseInt(inputHours) || 0;
    const m = parseInt(inputMinutes) || 0;
    const s = parseInt(inputSeconds) || 0;
    const total = h * 3600 + m * 60 + s;
    setTotalSeconds(total);
    setRemainingSeconds(total);
  };

  const handleInputChange = (type, value) => {
    let val = value.replace(/\D/g, '').slice(0, 2);
    if (type === 'h') setInputHours(val);
    if (type === 'm') setInputMinutes(val);
    if (type === 's') setInputSeconds(val);
    
    setIsRunning(false);
    const h = type === 'h' ? parseInt(val || 0) : parseInt(inputHours || 0);
    const m = type === 'm' ? parseInt(val || 0) : parseInt(inputMinutes || 0);
    const s = type === 's' ? parseInt(val || 0) : parseInt(inputSeconds || 0);
    const total = h * 3600 + m * 60 + s;
    setTotalSeconds(total);
    setRemainingSeconds(total);
  };

  const formatDisplay = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const display = formatDisplay(remainingSeconds);
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Timer",
    "applicationCategory": "UtilityApplication",
    "description": "Customizable countdown timer with alerts."
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myzonetime.com" },
      { "@type": "ListItem", "position": 2, "name": "Timer", "item": "https://myzonetime.com/timer" }
    ]
  };

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Online Timer — Set Countdown Timer | MyZoneTime</title>
        <meta name="description" content="Free online countdown timer. Set custom time intervals for workouts, cooking, studying, and more." />
        <meta property="og:title" content="Online Timer — Set Countdown Timer | MyZoneTime" />
        <meta property="og:description" content="Free online countdown timer. Set custom time intervals for workouts, cooking, studying, and more." />
        <meta property="og:image" content="https://myzonetime.com/favicon.svg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:site" content="@myzonetime" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Timer | MyZoneTime" />
        <meta name="twitter:description" content="Customizable countdown timer with alerts." />
        <meta name="twitter:image" content="https://myzonetime.com/favicon.svg" />
      </Helmet>
      <CanonicalTag pathname="/timer" />
      <StructuredData schema={schema} breadcrumbSchema={breadcrumbSchema} />

      <div className="w-full max-w-md mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Online Countdown Timer - Free Time Management Tool
          </h1>
          <p className="text-muted-foreground">Set a custom countdown timer</p>
        </div>

        {!isRunning && remainingSeconds === totalSeconds ? (
          <div className="flex justify-center items-center gap-4 py-8">
            <div className="flex flex-col items-center gap-2">
              <Input 
                type="text" 
                value={inputHours} 
                onChange={(e) => handleInputChange('h', e.target.value)}
                className="w-20 h-20 text-4xl text-center font-mono-time"
                placeholder="00"
              />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Hours</span>
            </div>
            <span className="text-4xl font-light pb-6">:</span>
            <div className="flex flex-col items-center gap-2">
              <Input 
                type="text" 
                value={inputMinutes} 
                onChange={(e) => handleInputChange('m', e.target.value)}
                className="w-20 h-20 text-4xl text-center font-mono-time"
                placeholder="00"
              />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Min</span>
            </div>
            <span className="text-4xl font-light pb-6">:</span>
            <div className="flex flex-col items-center gap-2">
              <Input 
                type="text" 
                value={inputSeconds} 
                onChange={(e) => handleInputChange('s', e.target.value)}
                className="w-20 h-20 text-4xl text-center font-mono-time"
                placeholder="00"
              />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Sec</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-8">
            <div className="text-6xl md:text-7xl font-mono-time font-medium tracking-tighter flex items-baseline">
              {parseInt(display.h) > 0 && (
                <>
                  <span className="time-segment">{display.h}</span>
                  <span className="time-separator">:</span>
                </>
              )}
              <span className="time-segment">{display.m}</span>
              <span className="time-separator">:</span>
              <span className="time-segment">{display.s}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        )}

        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button 
              size="lg" 
              className="w-24 h-24 rounded-full flex flex-col gap-1"
              onClick={handleStart}
              disabled={totalSeconds === 0}
            >
              <Play className="w-6 h-6 ml-1" />
              <span className="text-xs">Start</span>
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              className="w-24 h-24 rounded-full flex flex-col gap-1"
              onClick={handlePause}
            >
              <Pause className="w-6 h-6" />
              <span className="text-xs">Pause</span>
            </Button>
          )}
          
          <Button 
            size="lg" 
            variant="outline"
            className="w-24 h-24 rounded-full flex flex-col gap-1"
            onClick={handleReset}
            disabled={remainingSeconds === totalSeconds && !isRunning}
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-xs">Reset</span>
          </Button>
        </div>
      </div>

      {/* SEO content */}
      <section className="py-14 border-t border-border/40">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Countdown Timer</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Use this free countdown timer for cooking, workouts, meetings, study sessions, or any task that benefits from a time limit. Set hours, minutes, and seconds, then start the countdown. An audio alert plays when the timer reaches zero.
          </p>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Using the Timer for Productivity</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Pomodoro technique recommends 25-minute focus sessions followed by 5-minute breaks. Set this timer for 25 minutes, work without distraction, then take a short break. Repeat four times and take a longer 15–30 minute rest. This method is proven to improve focus and reduce mental fatigue.
          </p>
        </div>
      </section>
    </main>
  );
}