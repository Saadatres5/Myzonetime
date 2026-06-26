import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const rootEl = document.getElementById('root');

// Use hydrateRoot when pre-rendered HTML is present (SSG mode),
// otherwise fall back to createRoot (pure SPA mode).
if (rootEl.innerHTML.trim()) {
  ReactDOM.hydrateRoot(
    rootEl,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
