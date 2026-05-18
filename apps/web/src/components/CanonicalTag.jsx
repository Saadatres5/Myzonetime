import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function CanonicalTag({ pathname }) {
  const location = useLocation();
  const currentPath = pathname || location.pathname;
  const safePath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  const cleanPath = safePath === '/' ? '' : safePath.replace(/\/$/, '');
  const canonicalUrl = `https://myzonetime.com${cleanPath}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
