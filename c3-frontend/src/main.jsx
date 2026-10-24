import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Guarded auto-reload for missing hashed chunks after new production deployments
const CHUNK_RELOAD_KEY = 'c3_chunk_reload_attempted';

function handleChunkLoadError() {
  if (typeof window === 'undefined') return;
  try {
    const alreadyRetried = sessionStorage.getItem(CHUNK_RELOAD_KEY);
    if (!alreadyRetried) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, 'true');
      console.warn('[PWA] Stale dynamic chunk detected after deployment, reloading page once...');
      window.location.reload();
    }
  } catch {}
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  handleChunkLoadError();
});

window.addEventListener('error', (event) => {
  const msg = event?.message || '';
  if (
    msg.includes('dynamically imported module') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Loading chunk') ||
    msg.includes('error loading dynamically imported module')
  ) {
    handleChunkLoadError();
  }
});

// Reset the guard flag once window load has succeeded stably
window.addEventListener('load', () => {
  setTimeout(() => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {}
  }, 4000);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
