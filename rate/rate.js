/* صفحة تقييم موظف المبيعات (رمز QR): larincity.com/rate/#<رمز الموظف> — بلا تسجيل دخول. الخادم: app.larincity.com/rate (core/src/rate.js) */
(() => {
  const box = document.getElementById('box');
  const t = (location.hash || '').replace('#', '').trim().toLowerCase();
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
  const SL = ['', 'سيئة جداً', 'سيئة', 'مقبولة', 'جيدة', 'ممتازة'];
  const bad = (m) => { box.innerHTML = `<div class="done"><h1>${m}</h1><p>تأكد من الرمز أو اطلب من الموظف رمزاً جديداً</p></div>`; };
  if (!/^[a-f0-9]{32}$/.test(t)) return bad('هذا الرابط غير صحيح');
  const API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://127.0.0.1:8819/rate' : 'https://app.larincity.com/rate';
  fetch(API + '?t=' + t).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((P) => {
    const ini = (P.name || '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join(' ');
    box.innerHTML = `<div class="who"><span class="av">${esc(ini)}</span><div><h1>${esc(P.name)}</h1><p>${esc(P.title || 'فريق المبيعات')}</p></div></div>
      <h2>كيف كانت خدمة ${esc(P.name.split(' ')[0])} لك؟</h2>
      <div class="stars" data-s>${[1, 2, 3, 4, 5].map((i) => `<button type="button" data-v="${i}" aria-label="${i} من 5">${STAR}</button>`).join('')}</div><div class="sl" data-sl></div>
      <h2>هل تنصح أقاربك وأصدقاءك بمجمع لارين؟</h2><p class="hint">من 0 إلى 10</p>
      <div class="nps" data-n>${Array.from({ length: 11 }, (_, i) => `<button type="button" data-v="${i}">${i}</button>`).join('')}</div><div class="npl"><span>لا أنصح أبداً</span><span>أنصح بالتأكيد</span></div>
      <label>ملاحظاتك<textarea data-tx maxlength="600" required placeholder="ما الذي أعجبك؟ وما الذي نحسّنه؟"></textarea></label>
      <div class="row"><label>اسمك<input data-nm maxlength="80" autocomplete="name" required></label><label>رقم هاتفك<input data-ph maxlength="20" inputmode="tel" dir="ltr" autocomplete="tel" placeholder="07XXXXXXXXX" required></label></div>
      <div class="msg" data-m></div><button type="button" class="go" data-go disabled>إرسال التقييم</button>`;
    let s = 0, n = -1; const go = box.querySelector('[data-go]'), m = box.querySelector('[data-m]');
    const nm = box.querySelector('[data-nm]'), ph = box.querySelector('[data-ph]'), tx = box.querySelector('[data-tx]');
    const upd = () => { go.disabled = !(s && n >= 0 && tx.value.trim().length >= 3 && nm.value.trim().length >= 2 && ph.value.replace(/\D/g, '').length >= 10); };
    nm.addEventListener('input', upd); ph.addEventListener('input', upd); tx.addEventListener('input', upd);
    box.querySelector('[data-s]').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; s = +b.dataset.v;
      box.querySelectorAll('[data-s] button').forEach((x) => x.classList.toggle('on', +x.dataset.v <= s)); box.querySelector('[data-sl]').textContent = SL[s]; upd(); });
    box.querySelector('[data-n]').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; n = +b.dataset.v;
      box.querySelectorAll('[data-n] button').forEach((x) => x.classList.toggle('on', x === b)); upd(); });
    go.addEventListener('click', async () => { go.disabled = true; m.textContent = '';
      try { const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t, s, n, tx: tx.value, name: nm.value, phone: ph.value }) });
        if (r.status === 429) throw new Error('أرسلت تقييمات كثيرة، حاول بعد قليل');
        if (!r.ok) { const e = (await r.json().catch(() => ({}))).error; throw new Error(e === 'name_required' ? 'اكتب اسمك' : e === 'phone_required' ? 'اكتب رقم هاتفك كاملاً' : e === 'comment_required' ? 'اكتب ملاحظاتك' : 'لم يُرسل التقييم، حاول مرة أخرى'); }
        box.innerHTML = `<div class="done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg><h1>شكراً لك</h1><p>وصل تقييمك إلى إدارة مجمع لارين السكني<br>نسعد بخدمتك دائماً</p></div>`;
      } catch (e) { m.textContent = e.message; go.disabled = false; } });
  }).catch(() => bad('هذا الرمز غير فعّال'));
})();
