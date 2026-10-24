/* عامل الخدمة: يجعل الموقع قابلاً للتثبيت كتطبيق، ويعرض آخر نسخة محفوظة عند انقطاع الإنترنت.
   الصفحات: الشبكة أولاً (تصل التحديثات فوراً)، والصور والخطوط: المحفوظ أولاً ثم التحديث في الخلفية.
   شاشة المبيعات دون اتصال (قرار المالك 2026-10-24): صفحتها، ونموذج المجمع ثلاثي الأبعاد وجولات الوحدات بما فُتح منها، ومكتبة الرسم،
   وآخر حالة للوحدات، كلها تُحفظ على الجهاز حين تُفتح مع الاتصال، فتعمل الشاشة بعدها دون إنترنت. */
const V = 'lc-202610241300';
const THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/', FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const API_UNITS = 'https://larin-assistant.larin-assistant.workers.dev/units', CDN3 = 'https://cdn.jsdelivr.net/npm/three@0.128.0/';
// المحفوظ أولاً لما لا يتغير (النموذج والجولات ومكتبة الرسم)، ويُحفظ أول مرة يُفتح فيها
const keep = (r) => caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }));
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => c.addAll(['/', '/homes/', '/map/', '/assets/app-icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  // حالة الوحدات: من الخادم أولاً، وحين ينقطع الاتصال آخر حالة وصلت
  if (r.url.startsWith(API_UNITS)) { e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(API_UNITS, cp)); } return res; }).catch(() => caches.match(API_UNITS).then(m => m || new Response('{"units":{}}', { headers: { 'Content-Type': 'application/json' } })))); return; }
  if (r.url.startsWith(CDN3) || r.url.startsWith(THREE) || FONTS.test(r.url)) { e.respondWith(keep(r)); return; }
  if (u.origin !== location.origin) return;   // لا نتدخل في غيرها من الطلبات الخارجية
  if (/^\/(city3d|pano)\//.test(u.pathname) && !/\.json$/.test(u.pathname)) { e.respondWith(keep(r)); return; }
  if (/^\/(city3d|pano)\/.*\.json$/.test(u.pathname)) { e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r, { ignoreSearch: true }))); return; }
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('/'))));
    return;
  }
  if (u.pathname.startsWith('/assets/')) {
    e.respondWith(caches.match(r).then(m => { const net = fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => m);
      return m || net; }));
  }
});
