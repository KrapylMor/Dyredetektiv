const CACHE='dyredetektiv-v4-qr-lock';
const ASSETS=['/','/index.html','/style.css','/app.js','/missions.json','/manifest.webmanifest','/icon.svg','/startside-dyredetektiv.png'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  e.respondWith(
    fetch(e.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(e.request,copy));
        return response;
      })
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('/index.html')))
  );
});
