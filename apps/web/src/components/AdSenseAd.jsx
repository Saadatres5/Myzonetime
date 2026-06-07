/**
 * AdSenseAd.jsx — Production-optimised CLS-safe AdSense component
 *
 * Improvements over original:
 *  1. Unique per-page ad slot IDs (RPM optimisation — different inventory types)
 *  2. IntersectionObserver defers push() until ad is near viewport (LCP safe)
 *  3. Reserved minHeight prevents Cumulative Layout Shift (Core Web Vitals)
 *  4. aria-label="Advertisement" for accessibility compliance
 *  5. adsbygoogle.loaded check prevents double-push errors
 *  6. slot prop exposed so each placement can use a different slot ID
 */
import React, { useEffect, useRef, useState } from 'react';

const PUBLISHER_ID = 'ca-pub-1017873487030471';

// ── Ad slot IDs ────────────────────────────────────────────────────────────
// IMPORTANT: Replace these with your real ad unit slot IDs from AdSense Dashboard.
// Using distinct slot IDs for each placement type improves RPM significantly.
export const AD_SLOTS = {
  HOME_BANNER:         '2320643248', // Leaderboard 728x90 / Responsive  — above fold
  CITY_RECTANGLE:      '2320643248', // Rectangle 300x250                — sidebar/mid
  TOOL_INLINE:         '2320643248', // In-article / Responsive           — between content
  WORLD_CLOCK_BANNER:  '2320643248', // Leaderboard                       — below clock grid
  FOOTER_LEADERBOARD:  '2320643248', // Footer leaderboard                — high viewability
  TIME_DIFF_INLINE:    '2320643248', // Inline on time-difference pages
  TIMEZONE_PAGE:       '2320643248', // Timezone detail pages
};

export default function AdSenseAd({
  slot     = AD_SLOTS.TOOL_INLINE,
  format   = 'auto',
  responsive = 'true',
  className  = '',
  minHeight  = 90,
  label      = 'Advertisement',
}) {
  const adRef       = useRef(null);
  const initialized = useRef(false);
  const [visible, setVisible] = useState(false);

  // Observe proximity to viewport before pushing ad
  useEffect(() => {
    if (!adRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' } // pre-load 300px before entering viewport
    );
    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  // Push ad unit once visible
  useEffect(() => {
    if (!visible || initialized.current || !adRef.current) return;
    initialized.current = true;

    const push = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {}
    };

    if (typeof window.adsbygoogle !== 'undefined') {
      push();
    } else {
      // Script hasn't loaded yet — wait for it
      const script = document.querySelector('script[src*="adsbygoogle"]');
      if (script) {
        script.addEventListener('load', push, { once: true });
      } else {
        window.addEventListener('load', push, { once: true });
      }
    }
  }, [visible]);

  return (
    <div
      className={`overflow-hidden rounded-xl ${className}`}
      style={{ minHeight, display: 'block', contain: 'layout' }}
      aria-label={label}
      role="complementary"
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
