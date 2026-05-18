
/* ── CURSOR ────────────────────────────────────────────────── */
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
    dot.style.transform  = `translate(${mx - 3}px, ${my - 3}px)`;
    requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .drop-card, .service-card, .ba-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        ring.style.transform += ' scale(1.6)';
        ring.style.background = 'rgba(4,57,213,0.15)';
        ring.style.borderColor = 'rgba(6,182,212,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        ring.style.background = '';
        ring.style.borderColor = 'rgba(79,110,255,0.7)';
    });
});

/* ── LOADER ─────────────────────────────────────────────────── */
(function() {
    const loader = document.getElementById('loader');
    const pct    = document.getElementById('loader-pct');
    let count = 0;
    const timer = setInterval(() => {
        count = Math.min(count + Math.random() * 8, 100);
        pct.textContent = Math.floor(count) + '%';
        if (count >= 100) {
            clearInterval(timer);
            setTimeout(() => {
                gsap.to(loader, { opacity: 0, duration: 0.6, onComplete: () => loader.remove() });
                startHeroAnim();
            }, 300);
        }
    }, 60);
})();

/* ── PARTICLES ──────────────────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
    const wrap = canvas.parentElement;
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x  = W * 0.5 + (Math.random() - 0.5) * 200;
        this.y  = H * 0.5 + (Math.random() - 0.5) * 100;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -Math.random() * 1.2 - 0.3;
        this.alpha = Math.random();
        this.size  = Math.random() * 2.5 + 0.5;
        this.life  = Math.random() * 120 + 60;
        this.age   = 0;
        this.hue   = Math.random() > 0.5 ? 220 : 190;
    }
    update() {
        this.x    += this.vx;
        this.y    += this.vy;
        this.age++;
        this.alpha = (1 - this.age / this.life) * 0.7;
        if (this.age >= this.life) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle   = `hsl(${this.hue}, 90%, 70%)`;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = `hsl(${this.hue}, 90%, 70%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < 80; i++) { const p = new Particle(); p.age = Math.random() * p.life; particles.push(p); }

function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animParticles);
}
animParticles();

/* ── MARQUEE ─────────────────────────────────────────────────── */
const words = ['Deep Clean','Restoration','Resell','KZN','Durban','PMB','Sneaker Care','Authentic Kicks','From R150','Premium Service'];
const track  = document.getElementById('marquee');
const items  = [...words, ...words].map((w, i) => {
    const div = document.createElement('div');
    div.className = 'marquee-item' + (i % 3 === 0 ? ' active' : '');
    div.innerHTML = `<span>${w}</span><span class="dot"></span>`;
    return div;
});
items.forEach(el => track.appendChild(el));

/* ── NAV SCROLL ─────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── HERO ANIMATION ─────────────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

function closeMobileNav() {
    navbar.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
}

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMobileNav();
    });

    document.addEventListener('click', e => {
        if (!navbar.classList.contains('nav-open')) return;
        if (navbar.contains(e.target)) return;
        closeMobileNav();
    });
}

function startHeroAnim() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // eyebrow
    tl.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.8 }, 0.1);

    // title words stagger
    tl.to('#hero-title', { opacity: 1, duration: 0 }, 0.1);
    tl.to('#hero-title .word', { y: '0%', duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.3);

    // sub + actions
    tl.to(['#hero-sub', '#hero-actions'], { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.9);

    // stats counter
    tl.to('#hero-stats', { opacity: 1, y: 0, duration: 0.7 }, 1.1);

    // sneaker reveal — cinematic
    tl.to('#sneaker-wrap', {
        opacity: 1, duration: 0,
    }, 0.6);

    tl.fromTo('#sneaker-wrap',
        { scale: 0.4, rotation: 25, filter: 'blur(30px) brightness(0)', y: 120 },
        { scale: 1, rotation: 0, filter: 'blur(0px) brightness(1)', y: 0, duration: 1.4, ease: 'expo.out' },
        0.6
    );

    // tags cascade in after shoe lands
    tl.to(['#tag-clean','#tag-line-clean','#tag-loc','#tag-price'], {
        opacity: 1, y: 0,
        stagger: 0.15, duration: 0.6,
        ease: 'power2.out'
    }, 1.7);

    // scroll hint
    tl.to('#scroll-hint', { opacity: 1, duration: 0.6 }, 2);

    // counter animation
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        gsap.to({ val: 0 }, {
            val: target, duration: 2, delay: 1.2, ease: 'power2.out',
            onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
        });
    });

    /* ── SCROLL REVEALS ─────────────────────────────────────── */
    gsap.utils.toArray('.sr').forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1, y: 0, duration: 0.9,
            ease: 'power3.out',
            delay: el.style.transitionDelay ? parseFloat(el.style.transitionDelay) : 0
        });
    });

    /* ── SNEAKER PARALLAX ON SCROLL ─────────────────────────── */
    gsap.to('#sneaker-wrap', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        },
        y: -120,
        rotation: -8,
        scale: 0.85,
        filter: 'blur(4px)',
        ease: 'none'
    });

    /* ── 3D TILT on mouse move ──────────────────────────────── */
    const heroRight = document.querySelector('.hero-right');
    heroRight.addEventListener('mousemove', e => {
        const r = heroRight.getBoundingClientRect();
        const xR = ((e.clientX - r.left) / r.width  - 0.5) * 22;
        const yR = ((e.clientY - r.top)  / r.height - 0.5) * 16;
        gsap.to('#sneaker-wrap img', {
            rotationY: xR, rotationX: -yR,
            duration: 0.6, ease: 'power2.out',
            transformPerspective: 900
        });
    });
    heroRight.addEventListener('mouseleave', () => {
        gsap.to('#sneaker-wrap img', {
            rotationY: 0, rotationX: 0,
            duration: 1, ease: 'elastic.out(1, 0.4)'
        });
    });

    /* ── SERVICE CARDS 3D TILT ──────────────────────────────── */
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const xR = ((e.clientX - r.left) / r.width  - 0.5) * 14;
            const yR = ((e.clientY - r.top)  / r.height - 0.5) * 10;
            gsap.to(card, {
                rotationY: xR, rotationX: -yR,
                duration: 0.4, ease: 'power2.out',
                transformPerspective: 800, z: 20
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, z: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        });
    });

    /* before/after image reveal stagger */
    gsap.utils.toArray('.ba-card').forEach((card, i) => {
        gsap.from(card.querySelectorAll('img'), {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            opacity: 0, scale: 1.1, duration: 0.9, stagger: 0.2,
            ease: 'power3.out', delay: i * 0.1
        });
    });
}

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ══════════════════════════════════════════════════════════════
   BOOKING SYSTEM
══════════════════════════════════════════════════════════════ */
const modal        = document.getElementById('booking-modal');
const modalPanel   = document.getElementById('modal-panel');
const modalClose   = document.getElementById('modal-close');
const backdrop     = document.getElementById('modal-backdrop');

let bookingData = { name:'', phone:'', email:'', service:'', location:'', date:'', msg:'' };
let currentStep = 1;

/* Open */
function openModal(preService) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    goToStep(1);
    if (preService) selectService(preService);
    // set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('m-date').min = today;
}

function closeModal() {
    gsap.to(modalPanel, { scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
            modal.style.display = 'none';
            modalPanel.style.transform = '';
            modalPanel.style.opacity = '';
            document.body.style.overflow = '';
        }
    });
}

/* All "open booking" triggers */
document.querySelectorAll('.open-booking').forEach(btn => {
    btn.addEventListener('click', () => openModal());
    btn.style.cursor = 'pointer';
});
modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── STEP NAVIGATION ──────────────────────────────────────── */
function goToStep(n) {
    [1,2,3,'success'].forEach(s => {
        const el = document.getElementById('step-' + s);
        if (el) el.style.display = 'none';
    });
    document.getElementById('step-' + n).style.display = 'block';
    currentStep = n;
    updateStepIndicator(n);
    modalPanel.scrollTop = 0;
}

function updateStepIndicator(active) {
    document.querySelectorAll('.modal-step').forEach(s => {
        const n = parseInt(s.dataset.step);
        s.classList.remove('active','done');
        if (n < active) s.classList.add('done');
        else if (n === active) s.classList.add('active');
    });
}

/* Next buttons */
document.querySelectorAll('.modal-next').forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
        const next = parseInt(btn.dataset.next);
        if (next === 2 && !validateStep1()) return;
        if (next === 3 && !validateStep2()) return;
        if (next === 3) buildSummary();
        goToStep(next);
    });
});

/* Back buttons */
document.querySelectorAll('.modal-back').forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.back)));
});

/* ── VALIDATION ───────────────────────────────────────────── */
function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
}
function clearError(id) {
    const el = document.getElementById(id);
    el.textContent = '';
    el.style.display = 'none';
}

function validateStep1() {
    clearError('step1-error');
    const name  = document.getElementById('m-name').value.trim();
    const phone = document.getElementById('m-phone').value.trim();
    if (!name)  { showError('step1-error', '⚠ Please enter your name.'); return false; }
    if (!phone) { showError('step1-error', '⚠ Please enter a phone number or WhatsApp.'); return false; }
    bookingData.name  = name;
    bookingData.phone = phone;
    bookingData.email = document.getElementById('m-email').value.trim();
    return true;
}

function validateStep2() {
    clearError('step2-error');
    if (!bookingData.service)  { showError('step2-error', '⚠ Please select a service.'); return false; }
    if (!bookingData.location) { showError('step2-error', '⚠ Please choose a location.'); return false; }
    bookingData.date = document.getElementById('m-date').value;
    bookingData.msg  = document.getElementById('m-msg').value.trim();
    return true;
}

/* ── SERVICE PICKER ───────────────────────────────────────── */
function selectService(val) {
    bookingData.service = val;
    document.querySelectorAll('.service-pill').forEach(p => {
        p.classList.toggle('selected', p.dataset.value === val);
    });
}
document.querySelectorAll('.service-pill').forEach(p => {
    p.style.cursor = 'pointer';
    p.addEventListener('click', () => selectService(p.dataset.value));
});

/* ── LOCATION PICKER ──────────────────────────────────────── */
document.querySelectorAll('.loc-pill').forEach(p => {
    p.style.cursor = 'pointer';
    p.addEventListener('click', () => {
        bookingData.location = p.dataset.value;
        document.querySelectorAll('.loc-pill').forEach(x => x.classList.remove('selected'));
        p.classList.add('selected');
    });
});

/* ── SUMMARY ──────────────────────────────────────────────── */
function buildSummary() {
    const rows = [
        { k: 'Name',     v: bookingData.name },
        { k: 'Contact',  v: bookingData.phone + (bookingData.email ? ' · ' + bookingData.email : '') },
        { k: 'Service',  v: bookingData.service, hi: true },
        { k: 'Location', v: bookingData.location },
        { k: 'Date',     v: bookingData.date ? new Date(bookingData.date).toDateString() : 'Flexible' },
        ...(bookingData.msg ? [{ k: 'Notes', v: bookingData.msg }] : [])
    ];
    document.getElementById('summary-card').innerHTML = rows.map(r =>
        `<div class="summary-row">
            <span class="summary-key">${r.k}</span>
            <span class="summary-val${r.hi ? ' highlight' : ''}">${r.v}</span>
        </div>`
    ).join('');
}

/* ── SUBMIT ───────────────────────────────────────────────── */
document.getElementById('modal-submit').addEventListener('click', () => {
    clearError('step3-error');
    const btn     = document.getElementById('modal-submit');
    const btnText = document.getElementById('modal-btn-text');
    const spinner = document.getElementById('modal-spinner');

    // Show spinner
    btn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'flex';

    // Simulate submission (replace with real API/email integration)
    setTimeout(() => {
        btn.disabled = false;
        btnText.style.display = 'inline';
        spinner.style.display = 'none';

        // Generate ref
        const ref = 'PMS-' + Date.now().toString(36).toUpperCase().slice(-6);
        document.getElementById('success-ref').innerHTML =
            `Booking Reference: <span>${ref}</span>`;

        goToStep('success');
        document.getElementById('modal-steps').style.display = 'none';
    }, 1800);
});

/* Done button */
document.getElementById('modal-done').addEventListener('click', () => {
    document.getElementById('modal-steps').style.display = 'flex';
    closeModal();
    // reset
    bookingData = { name:'', phone:'', email:'', service:'', location:'', date:'', msg:'' };
    ['m-name','m-phone','m-email','m-date','m-msg'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    document.querySelectorAll('.service-pill, .loc-pill').forEach(p => p.classList.remove('selected'));
});

/* ── INLINE CONTACT FORM ─────────────────────────────────── */
document.getElementById('cf-submit').addEventListener('click', () => {
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const service = document.getElementById('cf-service').value;
    const errEl   = document.getElementById('cf-error');
    errEl.style.display = 'none';

    if (!name || !service) {
        errEl.textContent = '⚠ Please fill in your name and select a service.';
        errEl.style.display = 'block';
        return;
    }

    const btn     = document.getElementById('cf-submit');
    const btnText = document.getElementById('cf-btn-text');
    const spinner = document.getElementById('cf-spinner');
    btn.disabled  = true;
    btnText.style.display = 'none';
    spinner.style.display = 'flex';

    setTimeout(() => {
        btn.disabled = false;
        btnText.textContent = '✓ Message Sent!';
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
        btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        setTimeout(() => {
            btnText.textContent = 'Send Booking Request';
            btn.style.background = '';
            ['cf-name','cf-phone','cf-email','cf-msg'].forEach(id => {
                document.getElementById(id).value = '';
            });
            document.getElementById('cf-service').value = '';
            document.getElementById('cf-location').value = '';
        }, 3000);
    }, 1600);
});
