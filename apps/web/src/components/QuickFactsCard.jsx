import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Map, Clock, Coins } from 'lucide-react';

export default function QuickFactsCard({ utcOffset, country, region, currency }) {
  const facts = [
    { label: 'Country', value: country, icon: Globe },
    { label: 'Region', value: region || 'N/A', icon: Map },
    { label: 'UTC Offset', value: utcOffset, icon: Clock },
    { label: 'Currency', value: currency || 'N/A', icon: Coins },
  ];

  return (
    <Card className="w-full bg-card border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          Quick Facts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="p-2 bg-background rounded-lg text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{fact.label}</p>
                  <p className="text-base font-semibold text-foreground">{fact.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}