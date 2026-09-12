const CACHE='caap-v3';
const CORE=[
  './','./index.html','./styles.css','./app.js','./resources.js','./config.js','./photos.js',
  './manifest.webmanifest','./logo-caap.png','./icon-192.png','./icon-512.png','./assets/hero-home.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp}).catch(()=>r))));
