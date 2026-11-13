// Service worker : l'appli marche hors ligne.
const CACHE = 'baobab-primaire-20261113-1944';
const FILES = ['./', './index.html', './style.css', './data.js', './textes.js', './aide.js', './generateurs.js', './generateurs2.js', './generateurs3.js', './francais.js', './ueben.js', './robot.js', './guide.js', './version-test.js', './app.js', './installer.js',
  './manifest.webmanifest', './icons/icon.svg', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png',
  './fonts/andika-400-latin.woff2', './fonts/andika-400-latin-ext.woff2', './fonts/andika-700-latin.woff2', './fonts/andika-700-latin-ext.woff2', './fonts/fredoka-latin.woff2', './fonts/fredoka-latin-ext.woff2'];
// Installation : on télécharge des fichiers neufs (pas ceux gardés par le navigateur) et on active tout de suite.
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});
// Activation : on efface les anciennes versions et on prend la main sur les pages ouvertes.
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks =>
  Promise.all(ks.filter(k => k !== CACHE && k.startsWith('baobab-primaire-')).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// Avec internet : toujours la version la plus récente (et on la garde en mémoire).
// Sans internet : la version gardée en mémoire.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request.url, { cache: 'no-cache' }).then(r => {
    if (r.ok) { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
