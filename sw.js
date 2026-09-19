/* عامل الخدمة: يجعل الموقع قابلاً للتثبيت كتطبيق، ويعرض آخر نسخة محفوظة عند انقطاع الإنترنت.
   الصفحات: الشبكة أولاً (تصل التحديثات فوراً)، والصور والخطوط: المحفوظ أولاً ثم التحديث في الخلفية. */
const V = 'lc-202609191231';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => c.addAll(['/', '/homes/', '/map/', '/assets/app-icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/screen/')) return;   // لا نتدخل في الطلبات الخارجية ولا شاشة المبيعات
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
