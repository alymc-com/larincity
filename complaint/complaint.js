/* صفحة الشكاوى العامة (رمز QR واحد للمجمع): larincity.com/complaint/ — بلا تسجيل دخول. الخادم: app.larincity.com/complaint (core/src/rate.js) */
(() => {
  const box = document.getElementById('box');
  const API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://127.0.0.1:8819/complaint' : 'https://app.larincity.com/complaint';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v4"/><path d="M12 15h.01"/></svg>';
  fetch(API).then((r) => (r.ok ? r.json() : Promise.reject())).then((J) => {
    box.innerHTML = `<div class="who"><span class="ic2">${ICON}</span><div><h1>تقديم شكوى</h1><p>كل الحقول مطلوبة حتى نتواصل معك</p></div></div>
      <label>موضوع الشكوى<select data-tp><option value="">اختر الموضوع</option>${J.topics.map((t) => `<option>${esc(t)}</option>`).join('')}</select></label>
      <div><h2 style="margin-bottom:8px">أنت الآن</h2><div class="seg" data-stg><button type="button" data-v="i" class="on">مهتم</button><button type="button" data-v="b">حجزت بيتاً</button><button type="button" data-v="h">استلمت بيتي</button></div></div>
      <label>تفاصيل المشكلة<textarea data-det maxlength="1500" placeholder="اكتب ما حدث بالتفصيل"></textarea></label>
      <div class="row"><label>اسمك<input data-nm maxlength="80" autocomplete="name"></label><label>رقم هاتفك<input data-ph maxlength="20" inputmode="tel" dir="ltr" autocomplete="tel" placeholder="07XXXXXXXXX"></label></div>
      <div class="msg" data-m></div><button type="button" class="go" data-go disabled>إرسال الشكوى</button>`;
    let stg = 'i'; const q = (k) => box.querySelector(k), tp = q('[data-tp]'), det = q('[data-det]'), nm = q('[data-nm]'), ph = q('[data-ph]'), go = q('[data-go]'), m = q('[data-m]');
    const upd = () => { go.disabled = !(tp.value && det.value.trim().length >= 5 && nm.value.trim().length >= 2 && ph.value.replace(/\D/g, '').length >= 10); };
    [tp, det, nm, ph].forEach((e) => { e.addEventListener('input', upd); e.addEventListener('change', upd); });
    q('[data-stg]').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; stg = b.dataset.v; box.querySelectorAll('[data-stg] button').forEach((x) => x.classList.toggle('on', x === b)); });
    go.addEventListener('click', async () => { go.disabled = true; m.textContent = '';
      try { const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tp: tp.value, det: det.value, name: nm.value, phone: ph.value, stg }) });
        if (r.status === 429) throw new Error('أرسلت شكاوى كثيرة، حاول بعد ساعة');
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(({ name_required: 'اكتب اسمك', phone_required: 'اكتب رقم هاتفك كاملاً', topic_required: 'اختر موضوع الشكوى', details_required: 'اكتب تفاصيل المشكلة' })[j.error] || 'لم تُرسل الشكوى، حاول مرة أخرى');
        box.innerHTML = `<div class="done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg><h1>وصلت شكواك</h1><p>رقم الشكوى <b dir="ltr">${esc(j.ref || '')}</b><br>سيتواصل معك فريقنا على رقمك قريباً</p></div>`;
      } catch (e) { m.textContent = e.message; go.disabled = false; } });
  }).catch(() => { box.innerHTML = '<div class="done"><h1>تعذّر فتح الصفحة</h1><p>حاول بعد قليل</p></div>'; });
})();
