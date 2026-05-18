import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center" id="main-content">
      <Helmet>
        <title>Page Not Found | MyZoneTime</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="space-y-6 max-w-md">
        <div className="text-8xl font-bold text-primary/30" aria-hidden="true">404</div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">Go Home</Link>
          <Link to="/world-clock" className="px-6 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors">World Clock</Link>
        </div>
      </div>
    </main>
  );
}
