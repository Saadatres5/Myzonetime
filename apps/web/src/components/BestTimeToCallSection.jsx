import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, CheckCircle2, XCircle } from 'lucide-react';

export default function BestTimeToCallSection({ timezone }) {
  const [localTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [callInfo, setCallInfo] = useState({
    localStart: '',
    localEnd: '',
    isGoodTime: false,
    message: ''
  });

  useEffect(() => {
    try {
      const now = new Date();
      
      // Create dates for 9 AM and 6 PM in the target timezone
      const targetDateStr = now.toLocaleDateString('en-US', { timeZone: timezone });
      const targetStart = new Date(`${targetDateStr} 09:00:00`);
      const targetEnd = new Date(`${targetDateStr} 18:00:00`);

      // Format these times in the local timezone
      const localStartStr = targetStart.toLocaleTimeString('en-US', { timeZone: localTimezone, hour: 'numeric', minute: '2-digit', hour12: true });
      const localEndStr = targetEnd.toLocaleTimeString('en-US', { timeZone: localTimezone, hour: 'numeric', minute: '2-digit', hour12: true });

      // Check if current local time overlaps with target business hours
      const currentTargetHour = parseInt(now.toLocaleTimeString('en-US', { timeZone: timezone, hour: 'numeric', hour12: false }), 10);
      const isBusinessHours = currentTargetHour >= 9 && currentTargetHour < 18;

      setCallInfo({
        localStart: localStartStr,
        localEnd: localEndStr,
        isGoodTime: isBusinessHours,
        message: isBusinessHours ? 'Good time to call' : 'Outside business hours'
      });
    } catch (error) {
      console.error("Error calculating best time to call:", error);
    }
  }, [timezone, localTimezone]);

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-primary" />
          Best Time to Call
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Typical business hours (9:00 AM - 6:00 PM) in this city translate to:
        </p>
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
          <div className="text-lg font-semibold tabular-nums">
            {callInfo.localStart} - {callInfo.localEnd}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Your Time ({localTimezone.replace(/_/g, ' ')})
          </div>
        </div>
        
        <div className={`flex items-center gap-2 p-3 rounded-lg font-medium ${callInfo.isGoodTime ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
          {callInfo.isGoodTime ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {callInfo.message}
        </div>
      </CardContent>
    </Card>
  );
}