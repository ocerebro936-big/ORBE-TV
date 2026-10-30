import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Defensive handler to prevent external browser extensions (e.g. MetaMask inpage.js)
// from polluting the console or breaking the application runtime
if (typeof window !== 'undefined') {
  const isExtensionError = (err: any) => {
    const str = String(err?.message || err?.stack || err?.reason || err || '');
    return (
      str.includes('MetaMask') ||
      str.includes('Failed to connect to MetaMask') ||
      str.includes('ethereum') ||
      str.includes('inpage.js') ||
      str.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionError(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('error', (event) => {
    if (isExtensionError(event.error || event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
