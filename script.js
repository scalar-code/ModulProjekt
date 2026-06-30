/* ─── Page Transitions ──────────────────────────────────────────── */
document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http')) return;
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { location.href = href; }, 300);
  });
});

/* ─── Loader ─────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('hidden'); document.body.style.overflow = ''; }
    revealHeroElements();
  }, 1800);
});
if (document.getElementById('loader')) document.body.style.overflow = 'hidden';

/* ─── Cursor ─────────────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx+'px'; cursor.style.top = my+'px'; }
});
function followRing() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  if (ring) { ring.style.left = rx+'px'; ring.style.top = ry+'px'; }
  requestAnimationFrame(followRing);
}
followRing();

document.querySelectorAll('a,button,.feat-card,.proj-card,.pillar,.svc-card,.award-item,.faq-q,.filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor?.classList.add('hover'); ring?.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor?.classList.remove('hover'); ring?.classList.remove('hover'); });
});

/* ─── Navigation ─────────────────────────────────────────────────── */
const nav    = document.querySelector('.nav');
const toggle = document.getElementById('nav-toggle');
const mob    = document.getElementById('mobile-menu');
let menuOpen = false;

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

toggle?.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mob?.classList.toggle('open', menuOpen);
  const ss = toggle.querySelectorAll('span');
  ss[0].style.transform = menuOpen ? 'translateY(3px) rotate(45deg)' : '';
  ss[1].style.transform = menuOpen ? 'translateY(-3px) rotate(-45deg)' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    menuOpen = false;
    mob?.classList.remove('open');
    toggle?.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

/* ─── Hero Reveal ─────────────────────────────────────────────────── */
function revealHeroElements() {
  document.querySelectorAll('.home-hero .rv, .page-hero .rv').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 130);
  });
}

/* ─── Intersection Observer ──────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.rv:not(.home-hero .rv):not(.page-hero .rv)').forEach(el => revealObs.observe(el));

/* ─── Section Rule Draw ───────────────────────────────────────────── */
const ruleObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('drawn'); });
}, { threshold: 0.3 });
document.querySelectorAll('.section-rule').forEach(el => ruleObs.observe(el));

/* ─── Counter ─────────────────────────────────────────────────────── */
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / 1800, 1);
    const v = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(v * target);
    if (p < 1) requestAnimationFrame(tick); else el.textContent = target + '+';
  }
  requestAnimationFrame(tick);
}
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); countObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ─── Timeline Spine ──────────────────────────────────────────────── */
const spineEl = document.querySelector('.timeline-spine-fill');
if (spineEl) {
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) spineEl.classList.add('grow'); });
  }, { threshold: 0.1 }).observe(spineEl.parentElement);
}

/* ─── Process Step Lines ──────────────────────────────────────────── */
const stepObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.3 });
document.querySelectorAll('.process-step').forEach(el => stepObs.observe(el));

/* ─── Home Parallax ───────────────────────────────────────────────── */
if (document.querySelector('.home-hero')) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const inner = document.querySelector('.home-hero-inner');
    if (inner) { inner.style.transform = `translateY(${y * 0.22}px)`; inner.style.opacity = 1 - y * 0.0012; }
    const grid = document.querySelector('.hero-grid-bg');
    if (grid) grid.style.transform = `translateY(${y * 0.12}px)`;
  });
}

/* ─── Card Tilt ───────────────────────────────────────────────────── */
document.querySelectorAll('.feat-card, .proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ─── Project Filter ──────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards  = document.querySelectorAll('.proj-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projCards.forEach(card => {
      const match = cat === 'all' || card.dataset.category === cat;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ─── FAQ Accordion ───────────────────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── Contact Form ────────────────────────────────────────────────── */
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn span');
  if (!btn) return;
  btn.textContent = 'Sending…';
  setTimeout(() => {
    btn.textContent = 'Sent!';
    e.target.reset();
    setTimeout(() => { btn.textContent = 'Send Message'; }, 3000);
  }, 1200);
});
