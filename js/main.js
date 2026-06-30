/* ===========================
   Custom Cursor
   =========================== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
            cursor.style.background = 'var(--gold-light)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.6)';
            cursorFollower.style.borderColor = 'rgba(229,201,110,0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'var(--gold)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.borderColor = 'rgba(201,168,76,0.5)';
        });
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
}

/* ===========================
   Navigation
   =========================== */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
}

document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* ===========================
   Scroll Animations
   =========================== */
const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

/* ===========================
   Animated Counters
   =========================== */
const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const startTime = performance.now();
        const duration = 1800;

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }

        requestAnimationFrame(tick);
        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => countObserver.observe(el));

/* ===========================
   Testimonials Slider
   =========================== */
const testimonials = document.querySelectorAll('.testimonial');
const dotsContainer = document.getElementById('dots');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let currentSlide = 0;
let autoTimer;

if (testimonials.length && dotsContainer) {
    testimonials.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(n) {
        testimonials[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');
        currentSlide = ((n % testimonials.length) + testimonials.length) % testimonials.length;
        testimonials[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(currentSlide + 1), 5500);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentSlide + 1));

    autoTimer = setInterval(() => goTo(currentSlide + 1), 5500);
}

/* ===========================
   Contact Form
   =========================== */
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Message Sent ✓';
        btn.style.cssText = 'background:#2d7a50; pointer-events:none;';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.cssText = '';
            form.reset();
        }, 3500);
    });
}

/* ===========================
   Smooth Anchor Scrolling
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
});

/* ===========================
   Portfolio 3D Tilt
   =========================== */
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease';
        card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.025)`;
        card.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(0,0,0,0.4)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

/* ===========================
   Hero Parallax
   =========================== */
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
        }
    }, { passive: true });
}
