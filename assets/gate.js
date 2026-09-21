/* Larin City — pre-launch gate.
 *
 * Every page carries a tiny inline check in <head> that adds html.lc-locked
 * unless this browser has already entered the access code. While locked, the
 * page's own content stays hidden and this script paints the "قريباً جداً"
 * screen over it, with a discreet way in. The code itself is never stored in
 * the source — only its SHA-256.
 *
 * Re-lock this browser: open any page with #lock at the end of the address.
 */
(() => {
  const KEY  = 'lc-gate';
  const HASH = '83764ff80be4457f22a260ea6784dd3e568cfde028688515c147555ac32c20c7';
  const html = document.documentElement;

  if (location.hash === '#lock') {
    try { localStorage.removeItem(KEY); } catch (e) {}
    history.replaceState(null, '', location.pathname + location.search);
    html.classList.add('lc-locked');
  }
  if (!html.classList.contains('lc-locked')) return;

  if (!document.querySelector('link[href*="family=Almarai"]')) {
    const f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap';
    document.head.appendChild(f);
  }

  const css = `
  #lc-gate{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;text-align:center;
    font-family:Almarai,system-ui,sans-serif;color:#fff;background:#0B0A08;overflow:hidden;direction:rtl}
  #lc-gate .g-bg{position:absolute;inset:-4%;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
  #lc-gate .g-bg img{width:100%;height:100%;object-fit:cover;object-position:center 42%;
    transform-origin:58% 46%;will-change:transform;animation:lcDrift 26s ease-in-out infinite alternate}
  @keyframes lcDrift{0%{transform:scale(1.02) translate3d(1.2%,.6%,0)}
    50%{transform:scale(1.10) translate3d(-.8%,-.4%,0)}100%{transform:scale(1.17) translate3d(-2.2%,-1.4%,0)}}
  #lc-gate .g-sheen{position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;opacity:.55;
    background:linear-gradient(105deg,transparent 30%,rgba(255,214,150,.55) 48%,transparent 66%);
    background-size:260% 100%;animation:lcSheen 14s ease-in-out infinite}
  @keyframes lcSheen{0%{background-position:120% 0}100%{background-position:-60% 0}}
  #lc-gate .g-bg::after{content:"";position:absolute;inset:0;z-index:1;
    background:radial-gradient(120% 90% at 50% 40%,rgba(11,10,8,.18) 0%,rgba(11,10,8,.72) 58%,rgba(11,10,8,.94) 100%),
               linear-gradient(180deg,rgba(11,10,8,.72) 0%,rgba(11,10,8,.30) 34%,rgba(11,10,8,.88) 100%)}
  #lc-gate main{position:relative;z-index:2;padding:clamp(16px,4vh,32px) 22px clamp(64px,9vh,90px);max-height:100%;display:flex;flex-direction:column;align-items:center;
    animation:lcRise 1.1s cubic-bezier(.2,.8,.2,1) both}
  @keyframes lcRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  #lc-gate .g-logo{width:clamp(104px,min(26vw,24vh),260px);height:auto;margin-bottom:clamp(12px,3.4vh,40px);
    filter:drop-shadow(0 10px 30px rgba(0,0,0,.5))}
  #lc-gate h1{margin:0;font-size:clamp(32px,min(9vw,10.5vh),104px);font-weight:800;line-height:1.34;letter-spacing:-.01em;
    padding:.10em .06em .22em;background:linear-gradient(180deg,#E3C07A,#C9A45C);
    -webkit-background-clip:text;background-clip:text;color:transparent}
  #lc-gate .g-rule{width:clamp(70px,14vw,130px);height:2px;margin:clamp(10px,2.4vh,30px) 0;
    background:linear-gradient(90deg,transparent,#C9A45C,transparent)}
  #lc-gate .g-lead{margin:0;font-size:clamp(15px,2vw,21px);font-weight:700;opacity:.95}
  #lc-gate .g-sub{margin:12px 0 0;font-size:clamp(12px,1.5vw,15px);opacity:.62;letter-spacing:.14em}
  #lc-gate footer{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:20px clamp(16px,4vw,44px);
    display:flex;align-items:center;justify-content:space-between;gap:14px;font-size:11px;letter-spacing:.1em}
  #lc-gate footer .g-copy{opacity:.55}
  #lc-gate footer img{height:26px;width:auto;opacity:.8}
  #lc-gate .g-enter{background:none;border:0;color:#fff;opacity:.38;font:inherit;font-size:11px;
    letter-spacing:.2em;cursor:pointer;padding:6px 4px}
  #lc-gate .g-enter:hover{opacity:.8}
  #lc-gate form,#lc-gate input,#lc-gate form button{all:unset;box-sizing:border-box}
  #lc-gate form{display:none;margin-top:clamp(14px,3.4vh,34px);gap:8px;align-items:center;justify-content:center;
    background:transparent;border:0;box-shadow:none;padding:0;width:auto}
  #lc-gate form.on{display:flex;animation:lcRise .5s both}
  #lc-gate input{display:block;width:min(220px,58vw);background:rgba(255,255,255,.08);border:1px solid rgba(201,164,92,.45);
    border-radius:999px;padding:12px 18px;color:#fff;font:inherit;font-size:15px;text-align:center;outline:none}
  #lc-gate input:focus{border-color:#E3C07A;background:rgba(255,255,255,.12)}
  #lc-gate form button{display:inline-block;background:linear-gradient(180deg,#E3C07A,#C9A45C);color:#14140F;border:0;border-radius:999px;
    padding:12px 20px;font:inherit;font-weight:800;font-size:14px;cursor:pointer}
  #lc-gate .g-msg{min-height:18px;margin-top:10px;font-size:12px;color:#E8A08A}
  #lc-gate form.bad{animation:lcShake .42s}
  @keyframes lcShake{20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
  #lc-gate.out{opacity:0;transition:opacity .55s ease}
  @media (max-width:560px){#lc-gate footer{flex-direction:column;gap:10px;font-size:10px}}
  @media (prefers-reduced-motion:reduce){#lc-gate .g-bg img,#lc-gate .g-sheen{animation:none}}`;

  const build = () => {
    if (document.getElementById('lc-gate')) return;
    const st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    const g = document.createElement('div');
    g.id = 'lc-gate';
    g.innerHTML = `
      <div class="g-bg" id="lc-bg"><img src="/assets/aerial-sunset-02.jpg" alt="مجمع مدينة لارين السكنية"><div class="g-sheen"></div></div>
      <main>
        <img class="g-logo" src="/assets/logo-gold.png" alt="لارين سيتي">
        <h1>قريباً جداً</h1>
        <div class="g-rule"></div>
        <p class="g-lead">مجمع مدينة لارين السكنية</p>
        <p class="g-sub">بابل · مجاور جامعة الحلة</p>
        <form id="lc-form" autocomplete="off">
          <input id="lc-code" type="password" inputmode="text" placeholder="رمز الدخول" aria-label="رمز الدخول">
          <button type="submit">دخول</button>
        </form>
        <div class="g-msg" id="lc-msg"></div>
      </main>
      <footer>
        <span class="g-copy">© ٢٠٢٦ لارين سيتي</span>
        <button class="g-enter" id="lc-open" type="button">دخول</button>
        <img src="/assets/bait.png" alt="بيت العطاء">
      </footer>`;
    document.body.appendChild(g);

    const form = g.querySelector('#lc-form'), input = g.querySelector('#lc-code'), msg = g.querySelector('#lc-msg');
    g.querySelector('#lc-open').onclick = () => { form.classList.add('on'); input.focus(); };

    const sha256 = async (s) => {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    };
    form.onsubmit = async (e) => {
      e.preventDefault();
      const h = await sha256(input.value.trim().toLowerCase());
      if (h === HASH) {
        try { localStorage.setItem(KEY, HASH); } catch (err) {}
        g.classList.add('out');
        setTimeout(() => { html.classList.remove('lc-locked'); g.remove(); dispatchEvent(new Event('resize')); }, 520);
      } else {
        msg.textContent = 'رمز غير صحيح';
        form.classList.remove('bad'); void form.offsetWidth; form.classList.add('bad');
        input.select();
      }
    };

    // desktop: the aerial leans toward the pointer; touch devices keep the drift only
    const bg = g.querySelector('#lc-bg');
    if (matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let raf = 0;
      g.addEventListener('pointermove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          bg.style.transform = `translate3d(${(e.clientX / innerWidth - .5) * -2.2}%, ${(e.clientY / innerHeight - .5) * -1.6}%, 0)`;
        });
      });
    }
  };

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
