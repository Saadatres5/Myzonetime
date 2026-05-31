import React, { useEffect, useRef, useState } from 'react';

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
 * - Reserves minHeight to prevent layout shift.
 * - Uses IntersectionObserver to defer .push({}) until ad is near viewport.
 * - Improves LCP/FCP by not blocking main thread at page load.
 */
export default function AdSenseAd({
  slot = DEFAULT_SLOT,
  format = 'auto',
  responsive = 'true',
  className = '',
  minHeight = 90,
}) {
  const adRef      = useRef(null);
  const initialized = useRef(false);
  const [visible, setVisible] = useState(false);

  // Become visible when within 200px of viewport
  useEffect(() => {
    if (!adRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  // Push ad only after visible + adsbygoogle script is loaded
  useEffect(() => {
    if (!visible || initialized.current) return;
    if (!adRef.current) return;
    initialized.current = true;

    const push = () => {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) {}
    };

    // If adsbygoogle already loaded, push immediately; else wait for script
    if (window.adsbygoogle && window.adsbygoogle.loaded) {
      push();
    } else {
      window.addEventListener('load', push, { once: true });
    }
  }, [visible]);

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
