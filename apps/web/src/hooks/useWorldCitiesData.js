import { useState, useEffect } from 'react';

export function useWorldCitiesData() {
  const [citiesData, setCitiesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    import('@/data/worldCitiesData.js')
      .then((module) => {
        if (!canceled) {
          setCitiesData(module.citiesData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!canceled) {
          setCitiesData([]);
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, []);

  return { citiesData, loading };
}
