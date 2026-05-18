import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [state, setState] = useState({ latitude: null, longitude: null, error: null, loading: true });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ latitude: null, longitude: null, error: 'Geolocation not supported', loading: false });
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setState(s => ({ ...s, loading: false, error: 'Location timeout' }));
    }, 5000); // 5s timeout (was 20s — bad UX)

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        clearTimeout(timeout);
        if (!cancelled) setState({ latitude: coords.latitude, longitude: coords.longitude, error: null, loading: false });
      },
      (err) => {
        clearTimeout(timeout);
        if (!cancelled) setState({ latitude: null, longitude: null, error: err.message, loading: false });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 3_600_000 }
    );

    return () => { cancelled = true; clearTimeout(timeout); };
  }, []);

  return state;
}
