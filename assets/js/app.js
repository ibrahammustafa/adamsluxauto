/* Adams Lux Auto — single-page site: intro, page wipes, hero slider, galleries, booking flow, forms. */
(function () {
  "use strict";
  const C = window.ALA_CONFIG, FLEET = window.ALA_FLEET, ADDONS = window.ALA_ADDONS, SPOTS = window.ALA_SPOTS;
  const POL = window.ALA_POLICIES, FAQ = window.ALA_FAQ, AG = window.ALA_AGREEMENT, INS = window.ALA_INSPECT, PRE = window.ALA_PRECAUTIONS;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPreview = /claude\.ai|claudeusercontent|anthropic/.test(location.hostname);
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* storage blocked */ } } };
  const carById = (id) => FLEET.find((c) => c.id === id);
  const view = $("#view");

  let sb = null;
  try {
    if (C.supabaseUrl && C.supabaseKey && window.supabase && !isPreview) sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  } catch (e) { sb = null; }

  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === "x" ? r : (r & 3) | 8).toString(16); }));
  const makeRef = () => "ALA-" + (Date.now() % 1679616).toString(36).toUpperCase().padStart(4, "0") + Math.random().toString(36).slice(2, 4).toUpperCase();
  const icon = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- Shell: brand, nav, footer ---------- */
  function brandHTML() {
    return (C.logoSrc ? `<img src="${esc(C.logoSrc)}" alt="">` : "") + `<span class="wm">ADAMS<small>LUX AUTO</small></span>`;
  }
  $("#brand").innerHTML = brandHTML();
  const telLink = C.phone ? `tel:${C.phone}` : "", smsLink = C.phone ? `sms:${C.phone}` : "";
  $("#foot").innerHTML = `
    <div><a class="brand" href="#home" style="margin-bottom:.8rem">${brandHTML()}</a><p>Private luxury and AMG rentals across the ${esc(C.serviceArea)}. Owner-operated, delivered to your door.</p></div>
    <div><h4>Explore</h4><a href="#fleet">Fleet</a><a href="#delivery">Delivery spots</a><a href="#policies">Policies & FAQ</a><a href="#agreement">Sign the rental agreement</a><a href="#checkin">Pickup & return check-in</a></div>
    <div><h4>Contact</h4>${C.phone ? `<a href="${telLink}">${esc(C.phoneDisplay)}</a>` : ""}<a href="mailto:${esc(C.email)}">${esc(C.email)}</a><a href="#contact">Send a message</a>${C.instagram ? `<a href="${esc(C.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ""}</div>
    <div><h4>Good to know</h4><p>All cars: ${money(C.deposit)} refundable deposit. ${C.includedMilesPerDay} mi/day included. Your own full-coverage insurance required.</p><p style="margin-top:.8rem">© ${new Date().getFullYear()} ${esc(C.business)}</p></div>`;

  const menuBtn = $("#menuBtn");
  menuBtn.addEventListener("click", () => { const open = document.body.classList.toggle("menu"); menuBtn.setAttribute("aria-expanded", String(open)); });
  $("#nav").addEventListener("click", (e) => { if (e.target.closest("a")) { document.body.classList.remove("menu"); menuBtn.setAttribute("aria-expanded", "false"); } });

  /* ---------- Intro ---------- */
  const intro = $("#intro");
  let introDone = false;
  const afterIntro = [];
  function finishIntro(fast) {
    if (introDone) return; introDone = true;
    intro.classList.add("open");
    setTimeout(() => intro.classList.add("gone"), fast ? 700 : 1100);
    afterIntro.splice(0).forEach((f) => f());
  }
  if (reduce || ss.get("ala_intro")) { intro.classList.add("gone"); introDone = true; }
  else {
    ss.set("ala_intro", "1");
    const word = "ADAMS LUX AUTO";
    $("#introWord").innerHTML = word.split("").map((ch, i) => `<span style="animation-delay:${(0.55 + i * 0.055).toFixed(3)}s">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
    $("#introSkip").addEventListener("click", () => finishIntro(true));
    setTimeout(() => finishIntro(false), 2900);
  }
  const whenIntroDone = (f) => (introDone ? f() : afterIntro.push(f));

  /* ---------- Router & page wipe ---------- */
  let cleanups = [];
  const onCleanup = (f) => cleanups.push(f);
  const PAGES = { home: pageHome, fleet: pageFleet, delivery: pageDelivery, policies: pagePolicies, agreement: pageAgreement, contact: pageContact, checkin: pageCheckin };
  function parse() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, "")) || "home";
    let m;
    if ((m = h.match(/^car-([\w-]+)$/)) && carById(m[1])) return ["car", m[1]];
    if ((m = h.match(/^book-([\w-]+)$/)) && carById(m[1])) return ["book", m[1]];
    return [PAGES[h] ? h : "home"];
  }
  let firstRender = true, routing = false;
  function render() {
    cleanups.splice(0).forEach((f) => { try { f(); } catch (e) { /* ignore */ } });
    const [name, arg] = parse();
    view.innerHTML = "";
    if (name === "car") pageCar(arg); else if (name === "book") pageBook(arg); else PAGES[name]();
    window.scrollTo(0, 0);
    $$("#nav a").forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + name || (name === "car" || name === "book") && a.getAttribute("href") === "#fleet"));
    $$("#nav a[aria-current]").forEach((a) => a.setAttribute("aria-current", "page"));
    view.classList.remove("enter"); void view.offsetWidth; view.classList.add("enter");
    reveal();
  }
  function route() {
    if (firstRender || reduce) { firstRender = false; render(); return; }
    if (routing) { render(); return; }
    routing = true;
    const w = $("#wipe");
    w.className = ""; void w.offsetWidth; w.classList.add("in");
    setTimeout(() => {
      render();
      w.classList.remove("in"); w.classList.add("out");
      setTimeout(() => { w.className = ""; routing = false; }, 700);
    }, 620);
  }
  window.addEventListener("hashchange", route);

  function reveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".rv", view).forEach((el) => { if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("pre"); io.observe(el); } });
    onCleanup(() => io.disconnect());
  }
  function setTitle(t) { document.title = t ? `${t} · ${C.business}` : `${C.business} · Private luxury car rentals, Bay Area`; }

  /* ---------- Shared bits ---------- */
  function photo(car, i = 0, cls = "") {
    const g = car.gallery[i];
    if (!g) return `<div class="nophoto ${cls}"><div><b>${esc(car.short)}</b><span>Photos coming soon</span></div></div>`;
    return `<img class="${cls}" src="${esc(g.src)}" alt="${esc(car.year + " " + car.make + " " + car.model)}" style="object-position:${g.pos}" loading="lazy" decoding="async">`;
  }
  function card(car) {
    return `<a class="car-card rv" href="#car-${car.id}" data-type="${esc(car.type)}" data-fuel="${esc(car.fuel)}" data-amg="${/AMG/.test(car.model) ? 1 : 0}">
      <div class="ph">${photo(car)}<span class="badge">${esc(car.tag)}</span></div>
      <div class="body">
        <span class="yr">${car.year} · ${esc(car.make)}</span>
        <h3>${esc(car.model)}</h3>
        <div class="chips"><span>${esc(car.drive)}</span><span>${esc(car.type)}</span><span>${car.fuel === "ev" ? "Electric" : car.fuel === "phev" ? "Plug-in hybrid" : "Gas"}</span><span>${car.minAge}+</span></div>
        <div class="row"><span><span class="gauge">${money(car.price)}</span> <small>/ day</small></span><small>${money(C.deposit)} refundable deposit</small></div>
      </div></a>`;
  }
  function contactButtons(compact) {
    let h = "";
    if (C.phone) h += `<a class="btn" href="${telLink}">${icon.phone}${compact ? "Call" : "Call " + esc(C.phoneDisplay)}</a><a class="btn" href="${smsLink}">${icon.text}Text</a>`;
    h += `<a class="btn ghost" href="mailto:${esc(C.email)}">${icon.mail}Email</a>`;
    return h;
  }
  function field(id, label, input, hint) {
    return `<div class="field" data-f="${id}"><label for="${id}">${label}</label>${input}${hint ? `<span class="hint">${hint}</span>` : ""}<span class="err" hidden></span></div>`;
  }
  const inp = (id, type = "text", attrs = "") => `<input id="${id}" name="${id}" type="${type}" ${attrs}>`;
  function setErr(root, id, msg) {
    const f = root.querySelector(`[data-f="${id}"]`); if (!f) return;
    f.classList.toggle("bad", !!msg); const e = f.querySelector(".err"); if (e) { e.textContent = msg || ""; e.hidden = !msg; }
  }
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const validPhone = (v) => (v.replace(/\D/g, "").length >= 10);
  function notice(el, kind, html) { el.className = "notice " + (kind || ""); el.innerHTML = html; el.hidden = false; }
  async function copyText(text, btn) {
    try { await navigator.clipboard.writeText(text); const o = btn.textContent; btn.textContent = "Copied"; setTimeout(() => (btn.textContent = o), 1400); }
    catch (e) { const r = document.createRange(); const t = btn.parentElement.querySelector(".gauge"); if (t) { r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
  }
  const previewMsg = "This is a preview. Submissions go live on adamsluxauto.com.";

  /* ---------- Home ---------- */
  function pageHome() {
    setTitle("");
    const heroCars = FLEET.filter((c) => c.hero);
    const dur = 6500;
    view.innerHTML = `
      <section class="hero" id="hero" aria-roledescription="carousel" aria-label="Featured cars">
        ${heroCars.map((c, i) => `
          <article class="slide${i === 0 ? " active" : ""}" aria-roledescription="slide" aria-label="${esc(c.short)}">
            <div class="bg"><img src="${esc(c.hero.src)}" alt="" style="object-position:${c.hero.pos}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>
            <div class="shade"></div>
            <div class="copy"><div class="wrap">
              <span class="eyebrow"><span>${c.year} · ${esc(c.make)} · ${esc(c.tag)}</span></span>
              <h1 class="model"><span>${esc(c.short)}</span></h1>
              <p class="line"><span>${esc(c.tagline)}</span></p>
              <div class="readout">
                <span class="price">${money(c.price)}<small> / day</small></span>
                <span class="chip">${esc(c.drive)}</span><span class="chip">${money(C.deposit)} DEPOSIT</span>
                <a class="btn primary" href="#book-${c.id}">Book ${esc(c.short)}</a>
                <a class="btn ghost" href="#car-${c.id}">Details ${icon.arrow}</a>
              </div>
            </div></div>
          </article>`).join("")}
        <div class="hero-nav"><div class="wrap">
          <div class="ticks">${heroCars.map((c, i) => `<button class="tick${i === 0 ? " on" : ""}" type="button" data-i="${i}" style="--dur:${dur}ms" aria-label="Show ${esc(c.short)}"><b>${esc(c.short)}</b><i></i></button>`).join("")}</div>
          <button class="arrow" type="button" data-dir="-1" aria-label="Previous car">‹</button>
          <button class="arrow" type="button" data-dir="1" aria-label="Next car">›</button>
        </div></div>
      </section>

      <section class="section"><div class="wrap">
        <div class="section-head rv"><div><span class="eyebrow">The fleet</span><h2>Six cars. One owner who knows every one.</h2>
          <p class="lede">Every car is personally maintained, detailed before each trip, and handed over by the owner. Same $1,000 refundable deposit across the fleet.</p></div>
          <a class="btn" href="#fleet">See all cars ${icon.arrow}</a></div>
        <div class="fleet">${FLEET.map(card).join("")}</div>
      </div></section>

      <section class="section" style="padding-top:0"><div class="wrap">
        <div class="mosaic rv">
          ${[["glb-37", "tall"], ["bmw-4", ""], ["c43-7", "wide"], ["e55-29", ""], ["ps-13", ""], ["glb-28", "wide"], ["eqb-33", ""], ["fob-41", ""], ["e55-1", "wide"]].map(([f, cls]) => `<figure class="${cls}"><img src="assets/img/${f}.webp" alt="" loading="lazy" decoding="async"></figure>`).join("")}
        </div>
      </div></section>

      <section class="section" style="padding-top:0"><div class="wrap">
        <div class="section-head rv"><div><span class="eyebrow">How it works</span><h2>From request to keys in four steps</h2></div></div>
        <div class="steps">
          ${[["Pick a car & dates", "Choose your car, trip dates, handoff spot and any add-ons. You'll see the full price before you send anything."],
             ["Verify once", "Upload your license and insurance card and sign the rental agreement online. Takes about five minutes."],
             ["Confirm & deposit", "We confirm availability, usually within a couple of hours, and send a secure link for payment and the $1,000 refundable deposit."],
             ["Meet the car", "Free host pickup in the South Bay, or we deliver to the airport, train, hotel or your door for a flat $120."]]
            .map(([h, p], i) => `<div class="step rv"><span class="n">STEP ${i + 1} / 4</span><h3>${h}</h3><p>${p}</p></div>`).join("")}
        </div>
      </div></section>

      <section class="section" style="padding-top:0"><div class="wrap">
        <div class="section-head rv"><div><span class="eyebrow">Delivery</span><h2>We bring it to you</h2>
          <p class="lede">One flat ${money(C.deliveryFee)} fee to any airport, station or Bay Area address. We pick it up from the same spot when you're done.</p></div>
          <a class="btn" href="#delivery">All delivery spots ${icon.arrow}</a></div>
        <div class="spots">${SPOTS.slice(0, 8).map(spotHTML).join("")}</div>
      </div></section>

      <section class="section" style="padding-top:0"><div class="wrap">
        <div class="cta rv"><span class="eyebrow">Ready when you are</span><h2>Tell us the dates. We'll handle the rest.</h2>
          <p class="lede">Questions about a car, a long rental or an event? Call or text and you'll talk to the owner directly.</p>
          <div class="acts"><a class="btn primary" href="#fleet">Choose a car</a>${contactButtons(false)}</div></div>
      </div></section>`;
    heroInit(dur);
  }

  function heroInit(dur) {
    const hero = $("#hero"); if (!hero) return;
    const slides = $$(".slide", hero), ticks = $$(".tick", hero);
    let i = 0, timer = null, paused = !introDone, leaveTimer = null;
    function paint() {
      ticks.forEach((t, k) => { t.classList.remove("on"); t.classList.toggle("done", k < i); });
      void hero.offsetWidth; ticks[i].classList.add("on");
    }
    function show(n) {
      const prev = slides[i];
      i = (n + slides.length) % slides.length;
      if (prev !== slides[i]) {
        slides.forEach((s) => s.classList.remove("leaving"));
        prev.classList.remove("active"); prev.classList.add("leaving");
        clearTimeout(leaveTimer); leaveTimer = setTimeout(() => prev.classList.remove("leaving"), 1250);
        slides[i].classList.add("active");
      }
      paint(); schedule();
    }
    function schedule() { clearTimeout(timer); if (!paused && !reduce) timer = setTimeout(() => show(i + 1), dur); }
    function pause(p) { paused = p; hero.classList.toggle("paused", p); if (p) clearTimeout(timer); else paint(), schedule(); }
    ticks.forEach((t) => t.addEventListener("click", () => show(+t.dataset.i)));
    $$(".hero-nav .arrow", hero).forEach((b) => b.addEventListener("click", () => show(i + +b.dataset.dir)));
    let sx = null, sy = null;
    hero.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
    hero.addEventListener("pointerup", (e) => { if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(i + (dx < 0 ? 1 : -1)); sx = null; });
    hero.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") pause(true); });
    hero.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") pause(false); });
    const onKey = (e) => { if (e.target.closest("input,textarea,select")) return; if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); };
    const onVis = () => pause(document.hidden);
    document.addEventListener("keydown", onKey); document.addEventListener("visibilitychange", onVis);
    onCleanup(() => { clearTimeout(timer); clearTimeout(leaveTimer); document.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVis); });
    hero.classList.toggle("paused", paused);
    whenIntroDone(() => { if (document.body.contains(hero)) { paused = false; hero.classList.remove("paused"); paint(); schedule(); } });
  }

  const spotHTML = (s) => `<div class="spot rv"><span class="grp">${esc(s.group)}</span><b>${esc(s.name)}</b><span>${esc(s.area)}</span></div>`;

  /* ---------- Fleet ---------- */
  function pageFleet() {
    setTitle("Fleet");
    const filters = [["all", "All cars"], ["amg", "AMG"], ["suv", "SUVs"], ["sedan", "Sedans"], ["electric", "Electric & hybrid"]];
    view.innerHTML = `
      <section class="wrap page-top"><span class="eyebrow">The fleet</span><h1>Choose your car</h1>
        <p class="lede">All prices are per 24-hour day with ${C.includedMilesPerDay} miles included. Every car takes a ${money(C.deposit)} refundable deposit. Book 3+ days for 5% off, 7+ days for 12% off.</p></section>
      <section class="wrap" style="padding-bottom:4rem">
        <div class="filters" role="group" aria-label="Filter cars" style="margin-bottom:1.2rem">${filters.map(([k, l], i) => `<button type="button" data-k="${k}" aria-pressed="${i === 0}">${l}</button>`).join("")}</div>
        <div class="fleet" id="fleetGrid">${FLEET.map(card).join("")}</div>
      </section>`;
    const grid = $("#fleetGrid");
    $$(".filters button", view).forEach((b) => b.addEventListener("click", () => {
      $$(".filters button", view).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const k = b.dataset.k;
      $$(".car-card", grid).forEach((c) => {
        const show = k === "all" || (k === "amg" && c.dataset.amg === "1") || (k === "suv" && c.dataset.type === "SUV") || (k === "sedan" && c.dataset.type === "Sedan") || (k === "electric" && c.dataset.fuel !== "gas");
        c.hidden = !show;
        if (show && !reduce) { c.style.animation = "none"; void c.offsetWidth; c.style.animation = "fadeup .5s var(--ease-out) both"; }
      });
    }));
  }

  /* ---------- Car page ---------- */
  function pageCar(id) {
    const car = carById(id);
    setTitle(car.year + " " + car.short);
    const g = car.gallery;
    const extraTitle = car.mods ? "Build sheet" : "What's included";
    const extraList = car.mods || ["Phone mount and fast chargers", car.fuel === "gas" ? "Full tank at handoff" : car.fuel === "ev" ? "Charged to 90%+ with a charging cable" : "Full tank and full battery, with a charging cable", "Interior and exterior detail before every trip", "Roadside help: call or text the owner directly"];
    const others = FLEET.filter((c) => c.id !== id).slice(0, 3);
    view.innerHTML = `
      <div class="wrap crumbs"><a href="#fleet">Fleet</a> / ${esc(car.short)}</div>
      <section class="wrap car-top">
        <div>
          <div class="stage" id="stage">${g.length ? `<img src="${esc(g[0].src)}" alt="${esc(car.year + " " + car.make + " " + car.model)}" style="object-position:${g[0].pos}">` : photo(car)}
            ${g.length > 1 ? `<button class="arrow prev" type="button" aria-label="Previous photo">‹</button><button class="arrow next" type="button" aria-label="Next photo">›</button><span class="count gauge" id="count">1 / ${g.length}</span>` : ""}</div>
          ${g.length > 1 ? `<div class="thumbs" id="thumbs">${g.map((p, i) => `<button type="button" aria-label="Photo ${i + 1}" aria-current="${i === 0}"><img src="${esc(p.src)}" alt="" style="object-position:${p.pos}" loading="lazy"></button>`).join("")}</div>` : ""}
        </div>
        <aside class="spec-card">
          <span class="eyebrow">${esc(car.tag)}</span>
          <h1>${car.year} ${esc(car.make)} ${esc(car.model)}</h1>
          <p class="mute">${esc(car.tagline)}</p>
          <div class="price"><span class="gauge">${money(car.price)}</span><span class="mute">/ day</span></div>
          <div class="facts">
            <div class="fact"><b>${money(C.deposit)}</b><span>Refundable deposit</span></div>
            <div class="fact"><b>${C.includedMilesPerDay} mi</b><span>Included per day</span></div>
            <div class="fact"><b>${car.minAge}+</b><span>Driver age</span></div>
          </div>
          <dl class="kv">${car.specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
          <div class="acts-col">
            <a class="btn primary" href="#book-${car.id}">Book this car ${icon.arrow}</a>
            <button class="btn" type="button" id="toInquiry">Ask a question</button>
          </div>
          <div class="copy-row">${contactButtons(true)}</div>
        </aside>
      </section>
      <section class="wrap detail-grid">
        <div class="panel rv"><h3>Highlights</h3><ul class="ticks-list">${car.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>
        <div class="panel rv"><h3>${extraTitle}</h3><ul class="ticks-list">${extraList.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>
        <div class="panel rv"><h3>To book</h3><ul class="ticks-list">
          <li>Driver ${car.minAge}+ with a license held 2+ years</li><li>Photos of your license, front and back</li><li>Proof of full-coverage insurance</li><li>${money(C.deposit)} refundable deposit, released after the trip</li><li>A 5-minute photo check-in at pickup and return</li></ul></div>
      </section>
      <section class="wrap" style="padding-bottom:3rem" id="inquiry">
        <div class="panel rv" style="max-width:820px">
          <span class="eyebrow">Inquiry</span><h2>Ask about the ${esc(car.short)}</h2>
          <p class="mute">Questions about dates, a longer rental, an event or a walkaround video? We'll reply by email or text.</p>
          ${inquiryForm("inq", car)}
        </div>
      </section>
      <section class="section" style="padding-top:1rem"><div class="wrap">
        <div class="section-head"><div><span class="eyebrow">More from the fleet</span><h2>You might also like</h2></div></div>
        <div class="fleet">${others.map(card).join("")}</div></div></section>`;
    $("#toInquiry").addEventListener("click", () => { $("#inquiry").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); setTimeout(() => $("#inq-name").focus({ preventScroll: true }), 500); });
    bindInquiry("inq", car);
    if (g.length) galleryInit(car);
  }

  function galleryInit(car) {
    const g = car.gallery, stage = $("#stage"), thumbs = $$("#thumbs button"); let i = 0;
    function show(n) {
      i = (n + g.length) % g.length;
      const old = $("img", stage), img = new Image();
      img.src = g[i].src; img.alt = old.alt; img.style.objectPosition = g[i].pos; img.className = reduce ? "" : "in";
      stage.insertBefore(img, old.nextSibling);
      setTimeout(() => old.remove(), reduce ? 0 : 900);
      thumbs.forEach((t, k) => t.setAttribute("aria-current", String(k === i)));
      const c = $("#count"); if (c) c.textContent = `${i + 1} / ${g.length}`;
      if (thumbs[i]) thumbs[i].scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    }
    thumbs.forEach((t, k) => t.addEventListener("click", () => show(k)));
    const p = $(".arrow.prev", stage), n = $(".arrow.next", stage);
    if (p) p.addEventListener("click", (e) => { e.stopPropagation(); show(i - 1); });
    if (n) n.addEventListener("click", (e) => { e.stopPropagation(); show(i + 1); });
    let sx = null;
    stage.addEventListener("pointerdown", (e) => (sx = e.clientX));
    stage.addEventListener("pointerup", (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); else if (e.target.tagName === "IMG") openLightbox(g, i); });
  }

  const lb = $("#lightbox"); let lbList = [], lbI = 0;
  function openLightbox(list, i) { lbList = list; lbI = i; lbShow(); lb.hidden = false; $(".x", lb).focus(); }
  function lbShow() { const im = $("img", lb); im.src = lbList[lbI].src; im.alt = ""; im.style.animation = "none"; void im.offsetWidth; im.style.animation = ""; }
  lb.addEventListener("click", (e) => {
    const a = e.target.closest("[data-lb]")?.dataset.lb;
    if (a === "close" || e.target === lb) lb.hidden = true;
    if (a === "prev") { lbI = (lbI - 1 + lbList.length) % lbList.length; lbShow(); }
    if (a === "next") { lbI = (lbI + 1) % lbList.length; lbShow(); }
  });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lb.hidden = true;
    if (e.key === "ArrowRight") { lbI = (lbI + 1) % lbList.length; lbShow(); }
    if (e.key === "ArrowLeft") { lbI = (lbI - 1 + lbList.length) % lbList.length; lbShow(); }
  });

  /* ---------- Inquiry / contact forms ---------- */
  function inquiryForm(p, car) {
    return `<form class="form" id="${p}-form" novalidate>
      <input class="hp" id="${p}-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="grid2">${field(p + "-name", "Your name", inp(p + "-name", "text", 'autocomplete="name"'))}${field(p + "-email", "Email", inp(p + "-email", "email", 'autocomplete="email"'))}</div>
      <div class="grid2">${field(p + "-phone", "Phone", inp(p + "-phone", "tel", 'autocomplete="tel"'), "Optional. Add it if you'd rather we text.")}
        ${car ? field(p + "-start", "From", inp(p + "-start", "date")) + field(p + "-end", "To", inp(p + "-end", "date")) :
          field(p + "-topic", "Topic", `<select id="${p}-topic"><option>Booking question</option><option>Long-term rental</option><option>Event or photo shoot</option><option>Existing booking</option><option>Something else</option></select>`)}</div>
      ${field(p + "-msg", "Message", `<textarea id="${p}-msg" placeholder="${car ? "Dates, where you'd like it delivered, anything you want to know about the " + esc(car.short) : "How can we help?"}"></textarea>`)}
      <div class="wiz-nav" style="justify-content:flex-start"><button class="btn primary" type="submit">Send message</button></div>
      <div id="${p}-note" hidden></div>
    </form>`;
  }
  function bindInquiry(p, car) {
    const f = $("#" + p + "-form"); if (!f) return;
    if (car) { const t = new Date(); t.setDate(t.getDate() + 1); $("#" + p + "-start").min = dstr(new Date()); $("#" + p + "-end").min = dstr(t); }
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = (k) => ($("#" + p + "-" + k)?.value || "").trim();
      let ok = true;
      [["name", v("name") ? "" : "Enter your name."], ["email", validEmail(v("email")) ? "" : "Enter an email we can reply to."], ["msg", v("msg").length >= 5 ? "" : "Add a short message."]]
        .forEach(([k, m]) => { setErr(f, p + "-" + k, m); if (m) ok = false; });
      if (v("phone") && !validPhone(v("phone"))) { setErr(f, p + "-phone", "Check the phone number."); ok = false; } else setErr(f, p + "-phone", "");
      if (!ok) { f.querySelector(".bad input, .bad textarea")?.focus(); return; }
      if ($("#" + p + "-hp").value) return;
      const note = $("#" + p + "-note"), btn = f.querySelector('button[type="submit"]');
      const row = { kind: car ? "inquiry" : "contact", car_id: car ? car.id : null, name: v("name"), email: v("email"), phone: v("phone") || null, topic: car ? car.short : v("topic"), start_date: car && v("start") ? v("start") : null, end_date: car && v("end") ? v("end") : null, message: v("msg") };
      const subject = car ? `Inquiry: ${car.year} ${car.short}` : `Website message: ${row.topic}`;
      const body = `${row.message}\n\nName: ${row.name}\nEmail: ${row.email}\nPhone: ${row.phone || "-"}${car ? `\nCar: ${car.year} ${car.make} ${car.model}\nDates: ${row.start_date || "?"} to ${row.end_date || "?"}` : ""}`;
      const mailto = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (isPreview) { notice(note, "", previewMsg); return; }
      btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Sending';
      let saved = false;
      if (sb) { try { const { error } = await sb.from("inquiries").insert(row); saved = !error; } catch (err) { saved = false; } }
      btn.disabled = false; btn.textContent = "Send message";
      if (saved) { f.reset(); notice(note, "ok", `Message received. We'll reply to <b>${esc(row.email)}</b>${row.phone ? " or text you" : ""}, usually within a couple of hours.`); }
      else notice(note, "bad", `We couldn't send that from the site. <a href="${esc(mailto)}">Send it by email instead</a>${C.phone ? ` or text ${esc(C.phoneDisplay)}` : ""}.`);
    });
  }

  /* ---------- Delivery ---------- */
  function pageDelivery() {
    setTitle("Delivery");
    const groups = [...new Set(SPOTS.map((s) => s.group))];
    view.innerHTML = `
      <section class="wrap page-top"><span class="eyebrow">Delivery & pickup</span><h1>Handoff where it suits you</h1>
        <p class="lede">Free host pickup in the South Bay, or a flat ${money(C.deliveryFee)} delivery anywhere in the ${esc(C.serviceArea)}. Delivery includes picking the car back up from the same spot. Need a different return spot? Same fee covers it.</p></section>
      <section class="wrap" style="padding-bottom:4rem">
        <div class="fee-band rv"><div><span class="eyebrow">Flat delivery fee</span><p class="mute">Airports, stations, hotels, events or your door. Same price everywhere.</p></div><span class="gauge">${money(C.deliveryFee)}</span></div>
        ${groups.map((g) => `<h3 style="margin:1.6rem 0 .8rem">${esc(g)}</h3><div class="spots">${SPOTS.filter((s) => s.group === g).map(spotHTML).join("")}</div>`).join("")}
        <div class="detail-grid" style="margin-top:2rem">
          <div class="panel rv"><h3>Airport handoffs</h3><ul class="ticks-list"><li>Send your flight number and we'll track it.</li><li>We meet you at arrivals pickup or the cell-phone lot.</li><li>Returns at departures curbside, with time to walk the car.</li></ul></div>
          <div class="panel rv"><h3>Custom address</h3><ul class="ticks-list"><li>Homes, hotels, offices and event venues across the Bay Area.</li><li>Outside the Bay Area? Ask and we'll quote it.</li></ul></div>
          <div class="panel rv"><h3>Host pickup</h3><ul class="ticks-list"><li>Free, in the South Bay.</li><li>Exact address shared once your booking is confirmed.</li></ul></div>
        </div>
      </section>`;
  }

  /* ---------- Policies ---------- */
  function pagePolicies() {
    setTitle("Policies & FAQ");
    view.innerHTML = `
      <section class="wrap page-top"><span class="eyebrow">Policies</span><h1>The fine print, in plain English</h1>
        <p class="lede">What every renter agrees to. The signed rental agreement is the final word.</p></section>
      <section class="wrap" style="padding-bottom:3rem"><span class="eyebrow">Guest check-in & precautions</span><h2 style="margin:.6rem 0 1rem">Before, during and after your trip</h2>
        <div class="pol" style="margin-bottom:2.4rem">${PRE.map((p) => `<div class="panel rv"><h3>${esc(p.h)}</h3><ul class="ticks-list">${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div>
        <span class="eyebrow">Rental policies</span><h2 style="margin:.6rem 0 1rem">What every renter agrees to</h2><div class="pol">${POL.map((p) => `<div class="panel rv"><h3>${esc(p.h)}</h3><ul class="ticks-list">${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div></section>
      <section class="wrap" style="padding-bottom:4rem"><span class="eyebrow">FAQ</span><h2 style="margin:.6rem 0 1rem">Common questions</h2>
        <div class="faq">${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
        <div class="acts" style="display:flex;flex-wrap:wrap;gap:.6rem;margin-top:2rem"><a class="btn primary" href="#agreement">Read & sign the agreement</a><a class="btn" href="#checkin">Pickup & return check-in</a><a class="btn" href="#contact">Ask something else</a></div>
      </section>`;
  }

  /* ---------- Contact ---------- */
  function pageContact() {
    setTitle("Contact");
    view.innerHTML = `
      <section class="wrap page-top"><span class="eyebrow">Contact</span><h1>Talk to the owner</h1>
        <p class="lede">Call or text for anything same-day. For everything else, send a message and we'll reply by email.</p></section>
      <section class="wrap contact-grid">
        <div class="panel rv">
          ${C.phone ? `<div class="line-item"><span class="eyebrow">Call or text</span><div class="copy-row"><span class="gauge">${esc(C.phoneDisplay)}</span><button class="btn ghost" type="button" data-copy="${esc(C.phoneDisplay)}" style="min-height:34px;padding:0 .8rem">Copy</button></div>
            <div class="copy-row" style="margin-top:.5rem"><a class="btn primary" href="${telLink}">${icon.phone}Call now</a><a class="btn" href="${smsLink}">${icon.text}Send a text</a></div></div>` : ""}
          <div class="line-item"><span class="eyebrow">Email</span><div class="copy-row"><span class="gauge">${esc(C.email)}</span><button class="btn ghost" type="button" data-copy="${esc(C.email)}" style="min-height:34px;padding:0 .8rem">Copy</button></div></div>
          <div class="line-item"><span class="eyebrow">Hours</span><p>${esc(C.hours)}</p></div>
          <div class="line-item" style="border:0"><span class="eyebrow">Service area</span><p>${esc(C.serviceArea)}. Free host pickup in the South Bay, ${money(C.deliveryFee)} delivery everywhere else.</p></div>
        </div>
        <div class="panel rv"><h2>Send a message</h2>${inquiryForm("ct", null)}</div>
      </section>`;
    $$("[data-copy]", view).forEach((b) => b.addEventListener("click", () => copyText(b.dataset.copy, b)));
    bindInquiry("ct", null);
  }

  /* ---------- Dates & pricing ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const dstr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const TIMES = (() => { const t = []; for (let h = 7; h <= 22; h++) for (const m of [0, 30]) if (!(h === 22 && m === 30)) t.push(`${pad(h)}:${pad(m)}`); return t; })();
  const tlabel = (t) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`; };
  const timeSelect = (id, val) => `<select id="${id}">${TIMES.map((t) => `<option value="${t}"${t === val ? " selected" : ""}>${tlabel(t)}</option>`).join("")}</select>`;
  const toDate = (d, t) => (d && t ? new Date(`${d}T${t}:00`) : null);
  function tripDays(s, e) { if (!s || !e) return 0; const h = (e - s) / 36e5; if (h <= 0) return 0; return Math.max(1, Math.ceil((h - 0.5) / 24)); }
  const fmtDT = (d) => d ? d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
  function addonPrice(a, car) { if (a.carPrice && a.carPrice[car.id] != null) return a.carPrice[car.id]; if (a.byFuel) return a.byFuel[car.fuel]; return a.price; }
  function quote(st) {
    const car = st.car, days = tripDays(toDate(st.sd, st.st), toDate(st.ed, st.et));
    const base = days * car.price;
    const d = C.discounts.find((x) => days >= x.minDays);
    const disc = d ? Math.round(base * d.pct) / 100 : 0;
    const items = ADDONS.filter((a) => st.addons.has(a.id)).map((a) => { const p = addonPrice(a, car); return { id: a.id, name: a.name, amount: a.type === "perDay" ? p * days : p, unit: p, perDay: a.type === "perDay" }; });
    const delivery = st.handoff === "delivery" ? C.deliveryFee : 0;
    const total = base - disc + items.reduce((s, x) => s + x.amount, 0) + delivery;
    return { days, base, discPct: d ? d.pct : 0, disc, items, delivery, total, deposit: C.deposit };
  }

  /* ---------- Files & signature ---------- */
  const MAX_BYTES = 10 * 1024 * 1024;
  async function prepFile(file) {
    if (!file) return null;
    if (/^image\/(jpeg|png|webp)$/.test(file.type) && file.size > 1.5 * 1024 * 1024) {
      try {
        const bmp = await createImageBitmap(file);
        const s = Math.min(1, 2200 / Math.max(bmp.width, bmp.height));
        const cv = document.createElement("canvas"); cv.width = Math.round(bmp.width * s); cv.height = Math.round(bmp.height * s);
        cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
        const blob = await new Promise((r) => cv.toBlob(r, "image/jpeg", 0.86));
        if (blob) return { blob, type: "image/jpeg", ext: "jpg" };
      } catch (e) { /* fall back to the original */ }
    }
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
    return { blob: file, type: file.type || "application/octet-stream", ext };
  }
  function dropHTML(id, label, sub) {
    return `<div class="field" data-f="${id}"><span class="legend">${label}</span><label class="drop" id="${id}-drop"><input id="${id}" type="file" accept="image/*,.heic,.heif,application/pdf"><b>${label}</b><span>${sub || "Tap to take a photo or choose a file · JPG, PNG, HEIC or PDF · 10 MB max"}</span></label><span class="err" hidden></span></div>`;
  }
  function bindDrop(root, id, files) {
    const input = $("#" + id, root), drop = $("#" + id + "-drop", root);
    const set = (file) => {
      if (!file) return;
      if (file.size > MAX_BYTES) { setErr(root, id, "That file is over 10 MB. Try a smaller photo."); return; }
      if (!/^(image\/|application\/pdf)/.test(file.type) && !/\.(heic|heif|pdf)$/i.test(file.name)) { setErr(root, id, "Use a photo or PDF."); return; }
      files[id] = file; setErr(root, id, "");
      drop.classList.add("has"); drop.querySelector("b").textContent = file.name.length > 34 ? file.name.slice(0, 31) + "…" : file.name;
      const old = drop.querySelector("img.preview"); if (old) { URL.revokeObjectURL(old.src); old.remove(); }
      if (/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { const im = document.createElement("img"); im.className = "preview"; im.alt = ""; im.src = URL.createObjectURL(file); drop.prepend(im); }
    };
    input.addEventListener("change", () => set(input.files[0]));
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", (e) => set(e.dataTransfer.files[0]));
    if (files[id]) set(files[id]);
  }
  function sigPad(canvas, onChange) {
    const ctx = canvas.getContext("2d"); let drawing = false, dirty = false, last = null;
    function size() { const r = canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); const data = dirty ? canvas.toDataURL() : null;
      canvas.width = Math.max(1, r.width * dpr); canvas.height = Math.max(1, r.height * dpr); ctx.scale(dpr, dpr); ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#eeecf2";
      if (data) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, r.width, r.height); im.src = data; } }
    const pt = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener("pointerdown", (e) => { drawing = true; last = pt(e); canvas.setPointerCapture(e.pointerId); e.preventDefault(); });
    canvas.addEventListener("pointermove", (e) => { if (!drawing) return; const p = pt(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; dirty = true; });
    const end = () => { if (!drawing) return; drawing = false; if (dirty) onChange(exportPNG()); };
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
    function exportPNG() { // dark ink on white, for printing
      const w = canvas.width, h = canvas.height, src = ctx.getImageData(0, 0, w, h).data;
      const out = document.createElement("canvas"); out.width = w; out.height = h; const o = out.getContext("2d"); const img = o.createImageData(w, h), d = img.data;
      for (let k = 0; k < d.length; k += 4) { const a = src[k + 3] / 255, v = Math.round(255 - a * (255 - 17)); d[k] = d[k + 1] = v; d[k + 2] = Math.round(255 - a * (255 - 34)); d[k + 3] = 255; }
      o.putImageData(img, 0, 0); return out.toDataURL("image/png"); }
    size(); const ro = new ResizeObserver(() => size()); ro.observe(canvas); onCleanup(() => ro.disconnect());
    return { clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); dirty = false; onChange(""); } };
  }
  function agreementHTML(prefix, st) {
    const ids = Object.keys(AG.initials);
    return `
      <div class="agreement" tabindex="0" aria-label="Rental agreement text"><h4>${esc(AG.title)}</h4><p>${esc(AG.intro)}</p>${AG.sections.map((s) => `<div><h4>${esc(s.h)}</h4><p>${esc(s.p)}</p></div>`).join("")}<p class="gauge" style="font-size:.75rem">Version ${esc(C.agreementVersion)}</p></div>
      <div class="initials"><span class="legend">Initial each point</span>
        ${ids.map((k) => `<div class="field" data-f="${prefix}-ini-${k}"><div class="initial"><label for="${prefix}-ini-${k}" style="font-weight:600;color:var(--text)">${esc(AG.initials[k])}</label><input id="${prefix}-ini-${k}" type="text" maxlength="4" autocomplete="off" placeholder="AB" value="${esc(st.initials[k] || "")}"></div><span class="err" hidden></span></div>`).join("")}
      </div>
      ${field(prefix + "-signame", "Type your full legal name", inp(prefix + "-signame", "text", `autocomplete="name" value="${esc(st.sigName || "")}"`))}
      <div class="field" data-f="${prefix}-sig"><span class="legend">Sign with your finger or mouse</span><div class="sigpad"><canvas id="${prefix}-sig" aria-label="Signature pad"></canvas><span class="base"></span><span class="ph">Sign above the line</span><button class="clear" type="button" id="${prefix}-sigclear">Clear</button></div><span class="err" hidden></span></div>
      <div class="field" data-f="${prefix}-agree"><label class="check"><input type="checkbox" id="${prefix}-agree"${st.agree ? " checked" : ""}><span>I have read and agree to the ${esc(AG.title)}. I understand my electronic signature is legally binding.</span></label><span class="err" hidden></span></div>`;
  }
  function bindAgreement(root, prefix, st) {
    Object.keys(AG.initials).forEach((k) => $("#" + prefix + "-ini-" + k, root).addEventListener("input", (e) => (st.initials[k] = e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))));
    $("#" + prefix + "-signame", root).addEventListener("input", (e) => (st.sigName = e.target.value));
    $("#" + prefix + "-agree", root).addEventListener("change", (e) => (st.agree = e.target.checked));
    const pad = sigPad($("#" + prefix + "-sig", root), (d) => (st.sig = d));
    $("#" + prefix + "-sigclear", root).addEventListener("click", () => pad.clear());
  }
  function checkAgreement(root, prefix, st, legalName) {
    let ok = true; const errs = [];
    Object.keys(AG.initials).forEach((k) => { const v = (st.initials[k] || ""); const m = /^[A-Z]{2,4}$/.test(v) ? "" : "Add your initials."; setErr(root, prefix + "-ini-" + k, m); if (m) { ok = false; errs.push(prefix + "-ini-" + k); } });
    const norm = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");
    let m = "";
    if (!st.sigName || st.sigName.trim().split(/\s+/).length < 2) m = "Type your first and last name.";
    else if (legalName && !legalName.split(/\s+/).filter(Boolean).every((w) => norm(st.sigName).includes(norm(w)))) m = `Type the same name you entered for the driver (${legalName}).`;
    setErr(root, prefix + "-signame", m); if (m) { ok = false; errs.push(prefix + "-signame"); }
    m = st.sig ? "" : "Draw your signature in the box."; setErr(root, prefix + "-sig", m); if (m) { ok = false; errs.push(prefix + "-sig"); }
    m = st.agree ? "" : "Check the box to agree."; setErr(root, prefix + "-agree", m); if (m) { ok = false; errs.push(prefix + "-agree"); }
    if (!ok) { const el = root.querySelector(`[data-f="${errs[0]}"]`); el && el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); }
    return ok;
  }
  async function uploadDocs(folder, id, files, map) {
    const out = {};
    for (const [key, inputId] of Object.entries(map)) {
      const f = files[inputId]; if (!f) continue;
      const p = await prepFile(f);
      const path = `${folder}/${id}/${key}.${p.ext}`;
      const { error } = await sb.storage.from(C.docsBucket).upload(path, p.blob, { contentType: p.type, upsert: false });
      if (error) throw new Error("upload:" + key);
      out[key] = path;
    }
    return out;
  }
  function ageOn(dob, onDate) { const b = new Date(dob + "T12:00:00"); let a = onDate.getFullYear() - b.getFullYear(); const mm = onDate.getMonth() - b.getMonth(); if (mm < 0 || (mm === 0 && onDate.getDate() < b.getDate())) a--; return a; }

  /* ---------- Booking wizard ---------- */
  const STEPS = ["Dates", "Handoff", "Add-ons", "Driver", "Agreement", "Review"];
  function pageBook(id) {
    const car = carById(id);
    setTitle("Book the " + car.short);
    const t1 = new Date(); t1.setDate(t1.getDate() + 1); const t3 = new Date(); t3.setDate(t3.getDate() + 3);
    const st = { car, step: 0, maxStep: 0, sd: dstr(t1), st: "10:00", ed: dstr(t3), et: "10:00", handoff: "pickup", spot: "sfo", address: "", ret: "same", retAddress: "",
      addons: new Set(), driver: {}, files: {}, initials: {}, sigName: "", sig: "", agree: false, notes: "" };
    view.innerHTML = `
      <div class="wrap crumbs"><a href="#fleet">Fleet</a> / <a href="#car-${car.id}">${esc(car.short)}</a> / Book</div>
      <section class="wrap page-top" style="padding-top:1rem"><span class="eyebrow">Booking request</span><h1>Book the ${car.year} ${esc(car.short)}</h1>
        <p class="lede">Nothing is charged when you submit. We confirm availability and then send a secure link for payment and the deposit.</p></section>
      <section class="wrap book">
        <div class="panel" id="wiz">
          <nav class="progress" aria-label="Booking steps">${STEPS.map((s, i) => `<button type="button" data-s="${i}"${i ? " disabled" : ""}><i></i><b>${i + 1}. ${s}</b></button>`).join("")}</nav>
          <form id="wizForm" novalidate>
            <input class="hp" id="bk-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
            ${paneDates(st)}${paneHandoff(st)}${paneAddons(st)}${paneDriver(st)}
            <div class="pane" data-p="4"><div><span class="eyebrow">Step 5 of 6</span><h2>Rental agreement & liability waiver</h2></div>${agreementHTML("bk", st)}</div>
            <div class="pane" data-p="5"><div><span class="eyebrow">Step 6 of 6</span><h2>Review & send</h2></div><div id="reviewBox"></div>
              ${field("bk-notes", "Anything else we should know?", `<textarea id="bk-notes" placeholder="Flight number, occasion, questions…"></textarea>`)}
              <div id="bk-note" hidden></div></div>
            <div class="wiz-nav"><button class="btn ghost" type="button" id="wizBack">Back</button><button class="btn primary" type="submit" id="wizNext">Continue</button></div>
          </form>
        </div>
        <aside class="summary"><div class="panel" id="sumBox"></div></aside>
      </section>`;
    const form = $("#wizForm"), wiz = $("#wiz");
    bindDates(st); bindHandoff(st); bindAddons(st); bindDriver(st); bindAgreement(form, "bk", st);
    $("#bk-notes").addEventListener("input", (e) => (st.notes = e.target.value));
    const go = (n, back, quiet) => {
      st.step = n; st.maxStep = Math.max(st.maxStep, n);
      $$(".pane", form).forEach((p) => { const on = +p.dataset.p === n; p.classList.toggle("on", on); p.classList.toggle("back", on && !!back); });
      $$(".progress button", wiz).forEach((b, i) => { b.classList.toggle("on", i === n); b.classList.toggle("done", i < n); b.disabled = i > st.maxStep; b.setAttribute("aria-current", i === n ? "step" : "false"); });
      $("#wizBack").style.visibility = n === 0 ? "hidden" : "visible";
      $("#wizNext").innerHTML = n === STEPS.length - 1 ? "Send booking request" : `Continue to ${STEPS[n + 1].toLowerCase()} ${icon.arrow}`;
      if (n === 5) renderReview(st);
      if (n === 4) window.dispatchEvent(new Event("resize"));
      summary(st);
      if (!quiet) wiz.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    };
    $$(".progress button", wiz).forEach((b) => b.addEventListener("click", () => { const n = +b.dataset.s; if (n <= st.maxStep && (n < st.step || validate(st, st.step))) go(n, n < st.step); }));
    $("#wizBack").addEventListener("click", () => go(Math.max(0, st.step - 1), true));
    form.addEventListener("submit", (e) => { e.preventDefault(); if (!validate(st, st.step)) return; if (st.step < STEPS.length - 1) go(st.step + 1); else submitBooking(st); });
    form.addEventListener("input", () => summary(st)); form.addEventListener("change", () => summary(st));
    go(0, false, true);
  }

  function paneDates(st) {
    return `<div class="pane" data-p="0"><div><span class="eyebrow">Step 1 of 6</span><h2>When do you need it?</h2></div>
      <div class="grid2">${field("bk-sd", "Pickup date", inp("bk-sd", "date", `value="${st.sd}" min="${dstr(new Date())}"`))}${field("bk-st", "Pickup time", timeSelect("bk-st", st.st))}</div>
      <div class="grid2">${field("bk-ed", "Return date", inp("bk-ed", "date", `value="${st.ed}" min="${dstr(new Date())}"`))}${field("bk-et", "Return time", timeSelect("bk-et", st.et))}</div>
      <div class="notice" id="daysNote"></div></div>`;
  }
  function bindDates(st) {
    const upd = () => { st.sd = $("#bk-sd").value; st.st = $("#bk-st").value; st.ed = $("#bk-ed").value; st.et = $("#bk-et").value;
      const q = quote(st); const n = $("#daysNote");
      n.innerHTML = q.days ? `<b class="gauge">${q.days} day${q.days > 1 ? "s" : ""}</b> · ${C.includedMilesPerDay * q.days} miles included${q.discPct ? ` · <span style="color:var(--go)">${q.discPct}% multi-day discount applied</span>` : ` · Book 3+ days for 5% off`}` : "Pick a return time after pickup."; };
    ["bk-sd", "bk-st", "bk-ed", "bk-et"].forEach((i) => $("#" + i).addEventListener("change", upd)); upd();
  }
  function paneHandoff(st) {
    const opts = (sel) => SPOTS.map((s) => `<option value="${s.id}"${s.id === sel ? " selected" : ""}>${esc(s.name)} · ${esc(s.area)}</option>`).join("") + `<option value="custom">Custom address</option>`;
    return `<div class="pane" data-p="1"><div><span class="eyebrow">Step 2 of 6</span><h2>How do you want to get the car?</h2></div>
      <div class="choices" role="radiogroup" aria-label="Handoff">
        <label class="choice"><input type="radio" name="handoff" value="pickup" checked><span class="t"><b>Host pickup</b><span>South Bay. Exact address sent after confirmation.</span></span><span class="p">Free</span></label>
        <label class="choice"><input type="radio" name="handoff" value="delivery"><span class="t"><b>Delivery & return pickup</b><span>Airports, stations, hotels or any Bay Area address.</span></span><span class="p">${money(C.deliveryFee)}</span></label>
      </div>
      <div id="delBox" hidden class="form">
        ${field("bk-spot", "Delivery spot", `<select id="bk-spot">${opts(st.spot)}</select>`)}
        <div id="addrBox" hidden>${field("bk-addr", "Delivery address", inp("bk-addr", "text", 'autocomplete="street-address" placeholder="Street, city"'))}</div>
        ${field("bk-ret", "Return spot", `<select id="bk-ret"><option value="same">Same as delivery</option>${opts("")}</select>`, "A different return spot is included in the delivery fee.")}
        <div id="retAddrBox" hidden>${field("bk-retaddr", "Return address", inp("bk-retaddr", "text", 'placeholder="Street, city"'))}</div>
      </div></div>`;
  }
  function bindHandoff(st) {
    const upd = () => {
      st.handoff = $('input[name="handoff"]:checked').value; st.spot = $("#bk-spot").value; st.address = $("#bk-addr").value; st.ret = $("#bk-ret").value; st.retAddress = $("#bk-retaddr").value;
      $("#delBox").hidden = st.handoff !== "delivery"; $("#addrBox").hidden = st.spot !== "custom"; $("#retAddrBox").hidden = st.ret !== "custom";
    };
    $$('input[name="handoff"]').forEach((r) => r.addEventListener("change", upd));
    ["bk-spot", "bk-ret"].forEach((i) => $("#" + i).addEventListener("change", upd));
    ["bk-addr", "bk-retaddr"].forEach((i) => $("#" + i).addEventListener("input", upd)); upd();
  }
  const spotName = (id) => { const s = SPOTS.find((x) => x.id === id); return s ? `${s.name} (${s.area})` : ""; };
  function paneAddons(st) {
    const car = st.car;
    return `<div class="pane" data-p="2"><div><span class="eyebrow">Step 3 of 6</span><h2>Add-ons</h2><p class="mute">All optional. Prices shown for this car.</p></div>
      <div class="choices">${ADDONS.map((a) => { const off = a.exclude && a.exclude.includes(car.id); const p = addonPrice(a, car);
        return `<label class="choice${off ? " off" : ""}"><input type="checkbox" value="${a.id}"${off ? " disabled" : ""}><span class="t"><b>${esc(a.name)}</b><span>${off ? "Not available for this car." : esc(a.desc)}</span></span><span class="p">${money(p)}${a.type === "perDay" ? "/day" : ""}</span></label>`; }).join("")}</div></div>`;
  }
  function bindAddons(st) {
    $$('.pane[data-p="2"] input[type=checkbox]').forEach((c) => c.addEventListener("change", () => {
      c.checked ? st.addons.add(c.value) : st.addons.delete(c.value);
      if (c.value === "unlimited" && c.checked) { st.addons.delete("miles100"); const m = $('.pane[data-p="2"] input[value="miles100"]'); if (m) m.checked = false; }
      if (c.value === "miles100" && c.checked) { st.addons.delete("unlimited"); const m = $('.pane[data-p="2"] input[value="unlimited"]'); if (m) m.checked = false; }
      $("#xdBox").hidden = !st.addons.has("driver");
    }));
  }
  function paneDriver(st) {
    const states = ["CA", "AL", "AK", "AZ", "AR", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "Non-US"];
    return `<div class="pane" data-p="3"><div><span class="eyebrow">Step 4 of 6</span><h2>Driver & verification</h2><p class="mute">Your documents are stored privately and only used to verify this rental.</p></div>
      <div class="grid2">${field("dr-first", "First name", inp("dr-first", "text", 'autocomplete="given-name"'))}${field("dr-last", "Last name", inp("dr-last", "text", 'autocomplete="family-name"'))}</div>
      <div class="grid2">${field("dr-email", "Email", inp("dr-email", "email", 'autocomplete="email"'))}${field("dr-phone", "Mobile phone", inp("dr-phone", "tel", 'autocomplete="tel"'))}</div>
      <div class="grid2">${field("dr-dob", "Date of birth", inp("dr-dob", "date", 'autocomplete="bday"'), `Must be ${st.car.minAge}+ for this car.`)}${field("dr-addr", "Home address", inp("dr-addr", "text", 'autocomplete="street-address" placeholder="Street, city, state"'))}</div>
      <div class="grid2">${field("dr-lstate", "License state", `<select id="dr-lstate">${states.map((s) => `<option>${s}</option>`).join("")}</select>`)}${field("dr-lexp", "License expiration", inp("dr-lexp", "date"))}</div>
      <div class="grid2">${field("dr-years", "Years licensed", `<select id="dr-years"><option value="">Select</option><option>2–4 years</option><option>5–9 years</option><option>10+ years</option><option value="under2">Less than 2 years</option></select>`)}${field("dr-ins", "Insurance company", inp("dr-ins", "text", 'placeholder="e.g. State Farm"'))}</div>
      <div class="grid2">${dropHTML("dr-front", "License · front")}${dropHTML("dr-back", "License · back")}</div>
      <div class="grid2">${dropHTML("dr-insdoc", "Insurance card", "Current card or declarations page · photo or PDF")}${dropHTML("dr-selfie", "Selfie holding your license", "Optional, speeds up approval")}</div>
      <div id="xdBox" hidden class="form"><h3 style="font-size:1rem;margin-top:.6rem">Additional driver</h3>
        <div class="grid2">${field("xd-name", "Full name", inp("xd-name"))}${field("xd-phone", "Phone", inp("xd-phone", "tel"))}</div>
        <div class="grid2">${field("xd-dob", "Date of birth", inp("xd-dob", "date"))}${field("xd-email", "Email", inp("xd-email", "email"))}</div>
        <div class="grid2">${dropHTML("xd-front", "Their license · front")}${dropHTML("xd-back", "Their license · back")}</div></div></div>`;
  }
  function bindDriver(st) {
    ["dr-front", "dr-back", "dr-insdoc", "dr-selfie", "xd-front", "xd-back"].forEach((i) => bindDrop(view, i, st.files));
  }
  function validate(st, step) {
    const root = $("#wizForm"); let ok = true; const bad = [];
    const req = (id, cond, msg) => { setErr(root, id, cond ? "" : msg); if (!cond) { ok = false; bad.push(id); } };
    const val = (id) => ($("#" + id)?.value || "").trim();
    if (step === 0) {
      const s = toDate(st.sd, st.st), e = toDate(st.ed, st.et);
      req("bk-sd", s && s > new Date(Date.now() + 60 * 60 * 1000), "Pick a pickup time at least an hour from now.");
      req("bk-ed", e && s && e > s, "Return must be after pickup.");
      if (ok && tripDays(s, e) > 30) req("bk-ed", false, "For rentals over 30 days, send us an inquiry instead.");
    }
    if (step === 1 && st.handoff === "delivery") {
      if (st.spot === "custom") req("bk-addr", val("bk-addr").length > 6, "Enter the delivery address.");
      if (st.ret === "custom") req("bk-retaddr", val("bk-retaddr").length > 6, "Enter the return address.");
    }
    if (step === 3) {
      const d = st.driver; ["first", "last", "email", "phone", "dob", "addr", "lstate", "lexp", "years", "ins"].forEach((k) => (d[k] = val("dr-" + k)));
      req("dr-first", d.first, "Enter your first name."); req("dr-last", d.last, "Enter your last name.");
      req("dr-email", validEmail(d.email), "Enter a valid email."); req("dr-phone", validPhone(d.phone), "Enter a mobile number.");
      const start = toDate(st.sd, st.st) || new Date(), end = toDate(st.ed, st.et) || new Date();
      req("dr-dob", d.dob && ageOn(d.dob, start) >= st.car.minAge && ageOn(d.dob, start) < 100, `Drivers must be ${st.car.minAge}+ for the ${st.car.short}.`);
      req("dr-addr", d.addr.length > 6, "Enter your home address.");
      req("dr-lexp", d.lexp && new Date(d.lexp + "T23:59:00") >= end, "Your license must be valid through the end of the trip.");
      req("dr-years", d.years && d.years !== "under2", d.years === "under2" ? "Drivers need a license held at least 2 years." : "Select how long you've been licensed.");
      req("dr-ins", d.ins.length > 1, "Enter your insurance company.");
      req("dr-front", st.files["dr-front"], "Add a photo of the front of your license.");
      req("dr-back", st.files["dr-back"], "Add a photo of the back of your license.");
      req("dr-insdoc", st.files["dr-insdoc"], "Add your insurance card.");
      if (st.addons.has("driver")) {
        const x = st.xd = { name: val("xd-name"), phone: val("xd-phone"), dob: val("xd-dob"), email: val("xd-email") };
        req("xd-name", x.name.split(/\s+/).length >= 2, "Enter their full name."); req("xd-phone", validPhone(x.phone), "Enter their phone.");
        req("xd-dob", x.dob && ageOn(x.dob, start) >= st.car.minAge, `They must be ${st.car.minAge}+.`);
        req("xd-front", st.files["xd-front"], "Add the front of their license."); req("xd-back", st.files["xd-back"], "Add the back of their license.");
      } else st.xd = null;
    }
    if (step === 4) ok = checkAgreement(root, "bk", st, `${st.driver.first || ""} ${st.driver.last || ""}`.trim());
    if (!ok && step !== 4) { const el = root.querySelector(`[data-f="${bad[0]}"]`); if (el) { el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); el.querySelector("input,select,textarea")?.focus({ preventScroll: true }); } }
    return ok;
  }
  function summary(st) {
    const q = quote(st), car = st.car;
    $("#sumBox").innerHTML = `
      <div class="car"><div class="thumb">${photo(car)}</div><div><span class="yr gauge mute" style="font-size:.78rem">${car.year} · ${esc(car.make)}</span><h3 style="font-size:1.05rem">${esc(car.model)}</h3></div></div>
      ${q.days ? `<p class="mute" style="font-size:.88rem">${fmtDT(toDate(st.sd, st.st))} → ${fmtDT(toDate(st.ed, st.et))}</p>` : ""}
      <div class="lines">
        <div><span>${money(car.price)} × ${q.days || 0} day${q.days === 1 ? "" : "s"}</span><span>${money(q.base)}</span></div>
        ${q.disc ? `<div class="disc"><span>${q.discPct}% multi-day discount</span><span>−${money(q.disc)}</span></div>` : ""}
        ${q.delivery ? `<div><span>Delivery & return pickup</span><span>${money(q.delivery)}</span></div>` : ""}
        ${q.items.map((i) => `<div><span>${esc(i.name)}${i.perDay ? ` <small class="mute">× ${q.days}</small>` : ""}</span><span>${money(i.amount)}</span></div>`).join("")}
        <div class="total"><span>Trip total</span><span>${money(q.total)}</span></div>
        <div class="dep"><span>Refundable deposit (held)</span><span>${money(q.deposit)}</span></div>
      </div>
      <p class="mute" style="font-size:.8rem">${C.includedMilesPerDay} mi/day included, then $${C.overageRate.toFixed(2)}/mi. Taxes or fees, if any, are shown on your payment link.</p>`;
  }
  function renderReview(st) {
    const q = quote(st), d = st.driver;
    const where = st.handoff === "delivery" ? (st.spot === "custom" ? st.address : spotName(st.spot)) : "Host pickup, South Bay";
    const ret = st.handoff === "delivery" ? (st.ret === "same" ? "Same as delivery" : st.ret === "custom" ? st.retAddress : spotName(st.ret)) : "Return to host";
    $("#reviewBox").innerHTML = `<div class="review">
      <div><span>Car</span><span>${st.car.year} ${esc(st.car.make)} ${esc(st.car.model)}</span></div>
      <div><span>Pickup</span><span>${esc(fmtDT(toDate(st.sd, st.st)))}</span></div>
      <div><span>Return</span><span>${esc(fmtDT(toDate(st.ed, st.et)))}</span></div>
      <div><span>Handoff</span><span>${esc(where)}</span></div>
      <div><span>Return spot</span><span>${esc(ret)}</span></div>
      <div><span>Add-ons</span><span>${q.items.length ? q.items.map((i) => esc(i.name)).join(", ") : "None"}</span></div>
      <div><span>Driver</span><span>${esc(d.first + " " + d.last)} · ${esc(d.email)} · ${esc(d.phone)}</span></div>
      ${st.xd ? `<div><span>Additional driver</span><span>${esc(st.xd.name)}</span></div>` : ""}
      <div><span>Documents</span><span>License front & back, insurance card${st.files["dr-selfie"] ? ", selfie" : ""}</span></div>
      <div><span>Agreement</span><span>Signed by ${esc(st.sigName)} · ${esc(C.agreementVersion)}</span></div>
      <div><span>Trip total</span><span class="gauge">${money(q.total)} + ${money(q.deposit)} refundable deposit</span></div></div>`;
  }
  async function submitBooking(st) {
    const note = $("#bk-note"), btn = $("#wizNext");
    if ($("#bk-hp").value) return;
    if (isPreview) { notice(note, "", previewMsg); return; }
    if (!sb) { notice(note, "bad", `Online booking is offline right now. Please ${C.phone ? `call or text ${esc(C.phoneDisplay)} or ` : ""}email <a href="mailto:${esc(C.email)}">${esc(C.email)}</a>.`); return; }
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Uploading documents';
    const id = uuid(), ref = makeRef(), q = quote(st), d = st.driver;
    try {
      const docs = await uploadDocs("bookings", id, st.files, { license_front: "dr-front", license_back: "dr-back", insurance: "dr-insdoc", selfie: "dr-selfie", extra_license_front: "xd-front", extra_license_back: "xd-back" });
      btn.innerHTML = '<span class="spinner"></span>Sending request';
      const row = {
        id, ref, car_id: st.car.id, car_name: `${st.car.year} ${st.car.make} ${st.car.model}`,
        start_at: toDate(st.sd, st.st).toISOString(), end_at: toDate(st.ed, st.et).toISOString(), days: q.days,
        handoff: st.handoff, delivery_spot: st.handoff === "delivery" ? (st.spot === "custom" ? "custom" : spotName(st.spot)) : null,
        delivery_address: st.handoff === "delivery" && st.spot === "custom" ? st.address : null,
        return_spot: st.handoff === "delivery" ? (st.ret === "same" ? "same" : st.ret === "custom" ? st.retAddress : spotName(st.ret)) : null,
        addons: q.items, quote: q, total: q.total, deposit: q.deposit,
        driver: { first: d.first, last: d.last, email: d.email, phone: d.phone, dob: d.dob, address: d.addr, license_state: d.lstate, license_exp: d.lexp, years_licensed: d.years, insurer: d.ins },
        extra_driver: st.xd || null, docs, agreement_version: C.agreementVersion, initials: st.initials, signature_name: st.sigName, signature_png: st.sig,
        notes: st.notes || null, user_agent: navigator.userAgent.slice(0, 380)
      };
      const { error } = await sb.from("booking_requests").insert(row);
      if (error) throw error;
      ss.set("ala_last_ref", ref);
      $("#wiz").innerHTML = `<div class="done-card"><span class="eyebrow">Request sent</span><h2>You're on the list, ${esc(d.first)}.</h2>
        <p class="mute" style="max-width:52ch">We'll confirm the ${esc(st.car.short)} for ${esc(fmtDT(toDate(st.sd, st.st)))} and send a secure payment link to <b>${esc(d.email)}</b>, usually within a couple of hours.</p>
        <span class="ref">${ref}</span><p class="mute" style="font-size:.85rem;max-width:52ch">Your booking reference. Mention it if you call or text, and use it for the photo check-in at pickup and return.</p>
        <div class="copy-row" style="justify-content:center">${contactButtons(true)}<a class="btn" href="#fleet">Back to the fleet</a></div></div>`;
      $("#wiz").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    } catch (err) {
      btn.disabled = false; btn.textContent = "Try again";
      notice(note, "bad", `We couldn't send your request. Check your connection and try again${C.phone ? `, or call or text ${esc(C.phoneDisplay)}` : ""}.`);
    }
  }

  /* ---------- Standalone agreement ---------- */
  function pageAgreement() {
    setTitle("Rental agreement");
    const st = { initials: {}, sigName: "", sig: "", agree: false, files: {} };
    const t1 = new Date(); t1.setDate(t1.getDate() + 1);
    view.innerHTML = `
      <section class="wrap page-top"><span class="eyebrow">Rental agreement</span><h1>Sign before your trip</h1>
        <p class="lede">Booked by phone or text? Every driver signs here and uploads their license and insurance before handoff. Booked on the site? You already signed.</p></section>
      <section class="wrap" style="padding-bottom:4rem"><div class="panel" style="max-width:860px" id="agWrap">
        <form class="form" id="agForm" novalidate>
          <input class="hp" id="ag-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
          <h2 style="font-size:var(--step-1)">Your trip</h2>
          <div class="grid2">${field("ag-car", "Car", `<select id="ag-car"><option value="">Select</option>${FLEET.map((c) => `<option value="${c.id}">${c.year} ${esc(c.make)} ${esc(c.model)}</option>`).join("")}</select>`)}${field("ag-ref", "Booking reference", inp("ag-ref", "text", 'placeholder="Optional, e.g. ALA-4F2K9X"'))}</div>
          <div class="grid2">${field("ag-sd", "Pickup date", inp("ag-sd", "date", `value="${dstr(t1)}"`))}${field("ag-ed", "Return date", inp("ag-ed", "date"))}</div>
          <h2 style="font-size:var(--step-1);margin-top:.6rem">Driver</h2>
          <div class="grid2">${field("ag-name", "Full legal name", inp("ag-name", "text", 'autocomplete="name"'))}${field("ag-dob", "Date of birth", inp("ag-dob", "date"))}</div>
          <div class="grid2">${field("ag-email", "Email", inp("ag-email", "email", 'autocomplete="email"'))}${field("ag-phone", "Mobile phone", inp("ag-phone", "tel", 'autocomplete="tel"'))}</div>
          <div class="grid2">${field("ag-addr", "Home address", inp("ag-addr", "text", 'autocomplete="street-address"'))}${field("ag-ins", "Insurance company", inp("ag-ins"))}</div>
          <div class="grid2">${field("ag-lexp", "License expiration", inp("ag-lexp", "date"))}<div></div></div>
          <div class="grid2">${dropHTML("ag-front", "License · front")}${dropHTML("ag-back", "License · back")}</div>
          <div class="grid2">${dropHTML("ag-insdoc", "Insurance card", "Current card or declarations page · photo or PDF")}<div></div></div>
          <h2 style="font-size:var(--step-1);margin-top:.6rem">Agreement</h2>
          ${agreementHTML("ag", st)}
          <div class="wiz-nav" style="justify-content:flex-start"><button class="btn primary" type="submit" id="agSubmit">Sign & submit</button></div>
          <div id="ag-note" hidden></div>
        </form></div></section>`;
    const f = $("#agForm");
    ["ag-front", "ag-back", "ag-insdoc"].forEach((i) => bindDrop(view, i, st.files));
    bindAgreement(f, "ag", st);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = (k) => ($("#ag-" + k)?.value || "").trim(); let ok = true; const bad = [];
      const req = (id, cond, msg) => { setErr(f, id, cond ? "" : msg); if (!cond) { ok = false; bad.push(id); } };
      const car = carById(v("car"));
      req("ag-car", car, "Select your car."); req("ag-sd", v("sd"), "Pick your pickup date."); req("ag-ed", v("ed") && v("ed") >= v("sd"), "Pick a return date on or after pickup.");
      req("ag-name", v("name").split(/\s+/).length >= 2, "Enter your full legal name.");
      req("ag-dob", v("dob") && (!car || ageOn(v("dob"), new Date(v("sd") + "T12:00:00")) >= car.minAge), car ? `Drivers must be ${car.minAge}+ for this car.` : "Enter your date of birth.");
      req("ag-email", validEmail(v("email")), "Enter a valid email."); req("ag-phone", validPhone(v("phone")), "Enter a mobile number.");
      req("ag-addr", v("addr").length > 6, "Enter your home address."); req("ag-ins", v("ins").length > 1, "Enter your insurance company.");
      req("ag-lexp", v("lexp") && v("lexp") >= (v("ed") || v("sd")), "Your license must be valid through the end of the trip.");
      req("ag-front", st.files["ag-front"], "Add the front of your license."); req("ag-back", st.files["ag-back"], "Add the back of your license."); req("ag-insdoc", st.files["ag-insdoc"], "Add your insurance card.");
      if (!ok) { const el = f.querySelector(`[data-f="${bad[0]}"]`); el && el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); return; }
      if (!checkAgreement(f, "ag", st, v("name"))) return;
      if ($("#ag-hp").value) return;
      const note = $("#ag-note"), btn = $("#agSubmit");
      if (isPreview) { notice(note, "", previewMsg); return; }
      if (!sb) { notice(note, "bad", `Online signing is offline right now. Please email <a href="mailto:${esc(C.email)}">${esc(C.email)}</a>.`); return; }
      btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Uploading';
      const id = uuid(), ref = makeRef();
      try {
        const docs = await uploadDocs("agreements", id, st.files, { license_front: "ag-front", license_back: "ag-back", insurance: "ag-insdoc" });
        const { error } = await sb.from("agreements").insert({ id, ref, booking_ref: v("ref") || null, car_id: car.id,
          start_at: new Date(v("sd") + "T12:00:00").toISOString(), end_at: new Date(v("ed") + "T12:00:00").toISOString(),
          renter: { name: v("name"), dob: v("dob"), email: v("email"), phone: v("phone"), address: v("addr"), insurer: v("ins"), license_exp: v("lexp") },
          docs, agreement_version: C.agreementVersion, initials: st.initials, signature_name: st.sigName, signature_png: st.sig, user_agent: navigator.userAgent.slice(0, 380) });
        if (error) throw error;
        $("#agWrap").innerHTML = `<div class="done-card"><span class="eyebrow">Signed</span><h2>Thanks, ${esc(v("name").split(" ")[0])}. You're cleared for handoff.</h2>
          <p class="mute">We received your signed agreement and documents for the ${esc(car.short)}.</p><span class="ref">${ref}</span>
          <div class="copy-row" style="justify-content:center">${contactButtons(true)}</div></div>`;
      } catch (err) {
        btn.disabled = false; btn.textContent = "Try again";
        notice(note, "bad", `We couldn't submit that. Check your connection and try again${C.phone ? `, or text ${esc(C.phoneDisplay)}` : ""}.`);
      }
    });
  }

  /* ---------- Pickup / return check-in (vehicle inspection) ---------- */
  function carMapSVG() {
    // original top-down outline: body, cabin, glass lines, wheels, mirrors
    return `<svg viewBox="0 0 220 380" role="img" aria-label="Top-down car outline. Tap to mark damage.">
      <text x="110" y="14" text-anchor="middle" class="lbl">FRONT</text><text x="110" y="376" text-anchor="middle" class="lbl">REAR</text>
      <text x="10" y="194" class="lbl" transform="rotate(-90 10 194)" text-anchor="middle">DRIVER</text><text x="210" y="194" class="lbl" transform="rotate(90 210 194)" text-anchor="middle">PASSENGER</text>
      <rect x="40" y="24" width="140" height="332" rx="44" class="body"/>
      <rect x="60" y="118" width="100" height="148" rx="22" class="cabin"/>
      <path d="M60 150 Q110 134 160 150" class="glass"/><path d="M60 240 Q110 254 160 240" class="glass"/>
      <path d="M58 56 Q110 40 162 56" class="glass"/><path d="M58 326 Q110 342 162 326" class="glass"/>
      <rect x="28" y="70" width="14" height="46" rx="4" class="wheel"/><rect x="178" y="70" width="14" height="46" rx="4" class="wheel"/>
      <rect x="28" y="262" width="14" height="46" rx="4" class="wheel"/><rect x="178" y="262" width="14" height="46" rx="4" class="wheel"/>
      <rect x="24" y="140" width="16" height="9" rx="3" class="mirror"/><rect x="180" y="140" width="16" height="9" rx="3" class="mirror"/>
      <g id="pins"></g></svg>`;
  }
  function pageCheckin() {
    setTitle("Check-in");
    const st = { phase: "pickup", files: {}, marks: [], markType: "S", sig: "", sigName: "", initials: {}, agree: false };
    const now = new Date();
    view.innerHTML = `
      <section class="wrap page-top"><span class="eyebrow">Pickup & return check-in</span><h1>Vehicle inspection</h1>
        <p class="lede">Do this with the owner at handoff, on your phone. Six photos, the odometer, fuel or charge level, and any existing marks. It protects you as much as us: anything recorded here isn't charged to you.</p></section>
      <section class="wrap book" style="padding-bottom:4rem">
        <div class="panel" id="ciWrap"><form class="form" id="ciForm" novalidate>
          <input class="hp" id="ci-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="tabs" role="tablist" aria-label="Check-in type">
            <button type="button" role="tab" data-ph="pickup" aria-selected="true">Pickup</button>
            <button type="button" role="tab" data-ph="return" aria-selected="false">Return</button></div>
          <div class="grid2">${field("ci-trip", "Booking reference / trip ID", inp("ci-trip", "text", 'placeholder="e.g. ALA-4F2K9X" autocapitalize="characters"'), "On your confirmation. Ask the owner if you booked by phone.")}
            ${field("ci-car", "Car", `<select id="ci-car"><option value="">Select</option>${FLEET.map((c) => `<option value="${c.id}">${c.year} ${esc(c.make)} ${esc(c.model)}</option>`).join("")}</select>`)}</div>
          <div class="grid2">${field("ci-name", "Driver name", inp("ci-name", "text", 'autocomplete="name"'))}${field("ci-phone", "Mobile phone", inp("ci-phone", "tel", 'autocomplete="tel"'))}</div>
          <div class="grid2">${field("ci-odo", "Odometer (miles)", inp("ci-odo", "text", 'inputmode="numeric" placeholder="e.g. 36852"'))}
            <div class="field" data-f="ci-fuel"><label for="ci-fuel">Fuel / charge level: <b class="gauge" id="ci-fuelv">100%</b></label><input id="ci-fuel" type="range" min="0" max="100" step="5" value="100" style="accent-color:var(--ambient)"><span class="err" hidden></span></div></div>
          <p class="notice" style="margin:0">Check-in time is recorded automatically: <b class="gauge">${esc(fmtDT(now))}</b></p>

          <h2 style="font-size:var(--step-1);margin-top:.6rem">Photos</h2>
          <p class="mute" style="margin-top:-.6rem">Stand back so the whole side fits in frame. Daylight or a lit spot.</p>
          <div class="grid2">${INS.photos.map(([k, l]) => dropHTML("ci-p-" + k, l, "Tap to take a photo")).join("")}</div>

          <h2 style="font-size:var(--step-1);margin-top:.6rem">Damage map</h2>
          <p class="mute" style="margin-top:-.6rem">Pick a type, then tap the car where the mark is. Add a note for each one. No marks? Leave it empty.</p>
          <div class="dmg">
            <div class="dmg-map" id="dmgMap">${carMapSVG()}</div>
            <div class="dmg-side">
              <div class="filters" role="group" aria-label="Mark type">${Object.entries(INS.marks).map(([k, v], i) => `<button type="button" data-mt="${k}" aria-pressed="${i === 0}"><b>${k}</b> ${esc(v)}</button>`).join("")}</div>
              <ol class="dmg-list" id="dmgList"></ol>
              <p class="mute" id="dmgEmpty" style="font-size:.88rem">No marks recorded.</p>
              ${dropHTML("ci-p-damage", "Close-up of damage", "Optional: one close-up of the worst mark")}
            </div>
          </div>

          <h2 style="font-size:var(--step-1);margin-top:.6rem">Checklist</h2>
          <div class="choices" id="ciChecks"></div>
          ${field("ci-notes", "Notes", `<textarea id="ci-notes" placeholder="Anything else: smells, sounds, items in the car, low tire pressure…"></textarea>`)}

          <h2 style="font-size:var(--step-1);margin-top:.6rem">Confirm</h2>
          ${field("ci-signame", "Type your full name", inp("ci-signame", "text", 'autocomplete="name"'))}
          <div class="field" data-f="ci-sig"><span class="legend">Sign</span><div class="sigpad"><canvas id="ci-sig" aria-label="Signature pad"></canvas><span class="base"></span><span class="ph">Sign above the line</span><button class="clear" type="button" id="ci-sigclear">Clear</button></div><span class="err" hidden></span></div>
          <div class="field" data-f="ci-agree"><label class="check"><input type="checkbox" id="ci-agree"><span id="ci-agreetxt"></span></label><span class="err" hidden></span></div>
          <div class="wiz-nav" style="justify-content:flex-start"><button class="btn primary" type="submit" id="ciSubmit">Submit check-in</button></div>
          <div id="ci-note" hidden></div>
        </form></div>
        <aside class="summary ci-aside"><div class="panel">
          <span class="eyebrow">Precautions</span>
          ${PRE.map((p) => `<div><h3 style="font-size:.98rem;margin-bottom:.4rem">${esc(p.h)}</h3><ul class="ticks-list" style="font-size:.88rem">${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}
          <div class="copy-row">${contactButtons(true)}</div>
        </div></aside>
      </section>`;
    const f = $("#ciForm");
    INS.photos.forEach(([k]) => bindDrop(view, "ci-p-" + k, st.files)); bindDrop(view, "ci-p-damage", st.files);
    const fuel = $("#ci-fuel"); fuel.addEventListener("input", () => ($("#ci-fuelv").textContent = fuel.value + "%"));
    const pad = sigPad($("#ci-sig"), (d) => (st.sig = d)); $("#ci-sigclear").addEventListener("click", () => pad.clear());
    $("#ci-signame").addEventListener("input", (e) => (st.sigName = e.target.value));
    $("#ci-agree").addEventListener("change", (e) => (st.agree = e.target.checked));
    const prefill = (ss.get("ala_last_ref") || ""); if (prefill) $("#ci-trip").value = prefill;
    function renderChecks() {
      const items = INS.checklist.concat(st.phase === "return" ? INS.returnOnly : []);
      $("#ciChecks").innerHTML = items.map(([k, l]) => `<label class="choice"><input type="checkbox" data-ck="${k}"><span class="t"><b>${esc(l)}</b></span><span></span></label>`).join("");
      $("#ci-agreetxt").textContent = st.phase === "pickup"
        ? "I inspected the car with the owner. The photos, odometer, fuel/charge level and damage map above are accurate, and any damage not recorded here may be treated as new at return."
        : "I'm returning the car. The photos, odometer and fuel/charge level above are accurate as of now.";
      $("#ciSubmit").textContent = st.phase === "pickup" ? "Submit pickup check-in" : "Submit return check-in";
    }
    $$(".tabs [data-ph]", f).forEach((b) => b.addEventListener("click", () => {
      st.phase = b.dataset.ph; $$(".tabs [data-ph]", f).forEach((x) => x.setAttribute("aria-selected", String(x === b))); renderChecks();
    }));
    renderChecks();
    // damage map
    $$("[data-mt]", f).forEach((b) => b.addEventListener("click", () => { st.markType = b.dataset.mt; $$("[data-mt]", f).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
    const svg = $("#dmgMap svg");
    function drawMarks() {
      $("#pins").innerHTML = st.marks.map((m, i) => `<g class="pin"><circle cx="${m.x}" cy="${m.y}" r="11"/><text x="${m.x}" y="${m.y + 4}" text-anchor="middle">${i + 1}</text></g>`).join("");
      $("#dmgEmpty").hidden = st.marks.length > 0;
      $("#dmgList").innerHTML = st.marks.map((m, i) => `<li><span class="gauge">${i + 1} · ${m.type}</span><input type="text" data-mn="${i}" maxlength="120" placeholder="${esc(INS.marks[m.type])}: where, how big" value="${esc(m.note)}"><button type="button" class="btn ghost" data-mr="${i}" aria-label="Remove mark ${i + 1}">✕</button></li>`).join("");
      $$("[data-mn]", f).forEach((el) => el.addEventListener("input", () => (st.marks[+el.dataset.mn].note = el.value)));
      $$("[data-mr]", f).forEach((el) => el.addEventListener("click", () => { st.marks.splice(+el.dataset.mr, 1); drawMarks(); }));
    }
    svg.addEventListener("click", (e) => {
      if (st.marks.length >= 30) return;
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      st.marks.push({ type: st.markType, x: Math.round(p.x), y: Math.round(p.y), note: "" }); drawMarks();
      const last = $(`[data-mn="${st.marks.length - 1}"]`, f); last && last.focus({ preventScroll: true });
    });
    drawMarks();
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = (k) => ($("#ci-" + k)?.value || "").trim(); let ok = true; const bad = [];
      const req = (id, cond, msg) => { setErr(f, id, cond ? "" : msg); if (!cond) { ok = false; bad.push(id); } };
      const car = carById(v("car")); const odo = parseInt(v("odo").replace(/[^0-9]/g, ""), 10);
      req("ci-trip", v("trip").length >= 3, "Enter your booking reference."); req("ci-car", car, "Select the car.");
      req("ci-name", v("name").split(/\s+/).length >= 2, "Enter your full name."); req("ci-phone", validPhone(v("phone")), "Enter a mobile number.");
      req("ci-odo", odo > 0 && odo < 999999, "Enter the odometer reading.");
      INS.photos.forEach(([k, l]) => req("ci-p-" + k, st.files["ci-p-" + k], `Add the ${l.split(":")[0].toLowerCase()} photo.`));
      const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
      req("ci-signame", st.sigName.trim().split(/\s+/).length >= 2 && norm(st.sigName) === norm(v("name")), "Type the same name as above.");
      req("ci-sig", st.sig, "Sign in the box."); req("ci-agree", st.agree, "Check the box to confirm.");
      if (!ok) { const el = f.querySelector(`[data-f="${bad[0]}"]`); el && el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); return; }
      if ($("#ci-hp").value) return;
      const note = $("#ci-note"), btn = $("#ciSubmit");
      if (isPreview) { notice(note, "", previewMsg); return; }
      if (!sb) { notice(note, "bad", `Check-in is offline right now. Text the photos to ${esc(C.phoneDisplay || C.email)}.`); return; }
      const checklist = {}; $$("[data-ck]", f).forEach((c) => (checklist[c.dataset.ck] = c.checked));
      btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>Uploading photos';
      const id = uuid(), ref = makeRef();
      try {
        const map = {}; INS.photos.forEach(([k]) => (map[k] = "ci-p-" + k)); map.damage_closeup = "ci-p-damage";
        const photos = await uploadDocs("inspections", id, st.files, map);
        const { error } = await sb.from("inspections").insert({ id, ref, trip_id: v("trip").toUpperCase(), phase: st.phase, car_id: car.id, guest_name: v("name"), guest_phone: v("phone"),
          odometer: odo, fuel_pct: +fuel.value, checklist, damage: st.marks, photos, notes: v("notes") || null, signature_name: st.sigName, signature_png: st.sig, user_agent: navigator.userAgent.slice(0, 380) });
        if (error) throw error;
        $("#ciWrap").innerHTML = `<div class="done-card"><span class="eyebrow">${st.phase === "pickup" ? "Checked in" : "Returned"}</span>
          <h2>${st.phase === "pickup" ? `Enjoy the ${esc(car.short)}, ${esc(v("name").split(" ")[0])}.` : `Thanks, ${esc(v("name").split(" ")[0])}. Check-in received.`}</h2>
          <p class="mute" style="max-width:52ch">${st.phase === "pickup" ? `Odometer ${odo.toLocaleString()} mi, ${fuel.value}% ${car.fuel === "ev" ? "charge" : "fuel"}, ${st.marks.length} existing mark${st.marks.length === 1 ? "" : "s"} recorded. Call or text anytime during your trip.` : `Final odometer ${odo.toLocaleString()} mi. We'll review the photos and release your deposit within 3 business days.`}</p>
          <span class="ref">${ref}</span><div class="copy-row" style="justify-content:center">${contactButtons(true)}</div></div>`;
      } catch (err) {
        btn.disabled = false; btn.textContent = "Try again";
        notice(note, "bad", `We couldn't upload that. Check your signal and try again${C.phone ? `, or text the photos to ${esc(C.phoneDisplay)}` : ""}.`);
      }
    });
  }

  /* ---------- Boot ---------- */
  route();
})();
