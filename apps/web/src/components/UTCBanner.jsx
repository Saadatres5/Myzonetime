import React from 'react';
import { useLocalTime } from '@/hooks/useLocalTime.js';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UTCBanner = ({ is24Hour }) => {
  const { formattedTime, localTime } = useLocalTime('UTC', is24Hour);
  const unixTimestamp = Math.floor(localTime.getTime() / 1000);
  
  return (
    <div className="bg-muted border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 gap-4 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-medium">UTC</span>
            <span className="monospace-time text-foreground font-semibold">{formattedTime}</span>
            <span className="text-muted-foreground">Unix: {unixTimestamp}</span>
          </div>
          
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground glow-green">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            CLOCK SYNCED
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UTCBanner;