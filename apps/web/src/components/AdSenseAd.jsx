import React, { useEffect, useRef } from 'react';

/**
 * MyZoneTime AdSense Configuration
 * Publisher:  ca-pub-1017873487030471
 * Home Banner slot: 2320643248
 *
 * All placements use the same slot (2320643248) with responsive format.
 * Google auto-selects the best ad size per placement.
 */
const PUBLISHER_ID = 'ca-pub-1017873487030471';
const DEFAULT_SLOT  = '2320643248';

export const AD_SLOTS = {
  HOME_BANNER:          DEFAULT_SLOT,
  CITY_RECTANGLE:       DEFAULT_SLOT,
  TOOL_INLINE:          DEFAULT_SLOT,
  WORLD_CLOCK_BANNER:   DEFAULT_SLOT,
  FOOTER_LEADERBOARD:   DEFAULT_SLOT,
};

/**
 * CLS-safe AdSense ad unit.
 * Reserves minHeight before the ad loads — prevents layout shift.
 */
export default function AdSenseAd({
  slot = DEFAULT_SLOT,
  format = 'auto',
  responsive = 'true',
  className = '',
  minHeight = 90,
}) {
  const adRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!adRef.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {}
  }, []);

  return (
    <div
      className={`overflow-hidden rounded-xl ${className}`}
      style={{ minHeight, display: 'block' }}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
