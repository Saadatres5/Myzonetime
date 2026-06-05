import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * StructuredData — injects JSON-LD structured data via react-helmet-async.
 *
 * Accepts either:
 *   <StructuredData schemas={[...]}  />    — array of schema objects
 *   <StructuredData schema={...} breadcrumbSchema={...} />  — individual objects
 *
 * Merges everything into one @graph block to avoid duplicate <script> tags.
 * Does NOT suppress injection based on existing DOM nodes (that was causing
 * all client-side schema to be silently dropped on every navigation).
 */
export default function StructuredData({ schemas, schema, breadcrumbSchema }) {
  const items = [];

  if (schemas && Array.isArray(schemas)) {
    items.push(...schemas);
  } else {
    if (schema) items.push(schema);
    if (breadcrumbSchema) items.push(breadcrumbSchema);
  }

  if (items.length === 0) return null;

  // Strip any top-level @context from individual items before merging into @graph
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
