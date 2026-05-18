import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RegionFilterTabs = ({ selectedRegion, onRegionChange }) => {
  const regions = [
    { value: 'All', label: 'All Regions' },
    { value: 'Americas', label: 'Americas' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Africa', label: 'Africa' },
    { value: 'MiddleEast', label: 'Middle East' },
    { value: 'SouthAsia', label: 'South Asia' },
    { value: 'EastAsia', label: 'East Asia' },
    { value: 'Oceania', label: 'Oceania' },
    { value: 'Pacific', label: 'Pacific' },
  ];
  
  return (
    <div className="mb-6">
      <Tabs value={selectedRegion} onValueChange={onRegionChange}>
        <TabsList className="bg-muted flex-wrap h-auto gap-2 p-2">
          {regions.map(region => (
            <TabsTrigger
              key={region.value}
              value={region.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              {region.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default RegionFilterTabs;