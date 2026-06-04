import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Renders structured data as a single @graph JSON-LD block.
 * Prevents duplicate schema bugs by merging all schemas into one <script>.
 */
export default function StructuredData({ schemas, schema, breadcrumbSchema }) {
  const items = [];

  if (schemas && Array.isArray(schemas)) {
    items.push(...schemas);
  } else {
    if (schema) items.push({ '@context': 'https://schema.org', ...schema });
    if (breadcrumbSchema) items.push(breadcrumbSchema);
  }

  if (items.length === 0) return null;

  // If the server already injected JSON-LD (SSR), avoid re-injecting on the client
  // to prevent duplicate structured-data blocks. This check runs only in the browser.
  if (typeof document !== 'undefined' && document.querySelector('script[type="application/ld+json"]')) {
    return null;
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': items.map(({ '@context': _ctx, ...rest }) => rest),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  );
}
