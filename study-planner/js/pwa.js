// Registers the service worker so the app can be installed and work offline.
// It has nothing to do with the MVC code, so it lives in its own file.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.error('Service worker registration failed:', err);
    });
  });
}
