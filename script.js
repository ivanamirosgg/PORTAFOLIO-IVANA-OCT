/* ═══════════════════════════════════════════════
   GSAP + ScrollTrigger — Ivana Miroslava Portfolio
═══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// ─── Año actual ───────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── Cursor personalizado ─────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower && window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.10;
    followerY += (mouseY - followerY) * 0.10;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  })();

  const hoverTargets = document.querySelectorAll('a, button, .card, .softskill-item, .exp-pills span');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(follower, { width: 52, height: 52, borderColor: 'rgba(77,141,255,.5)', duration: .2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(follower, { width: 32, height: 32, borderColor: 'rgba(255,255,255,.35)', duration: .2 });
    });
  });
}

// ─── Efecto glow de mouse en cards ───────────
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// ─── Vistas previas en vivo: escalar iframe al ancho del contenedor ───
const livePreviews = document.querySelectorAll('[data-live-preview]');
if (livePreviews.length) {
  const PREVIEW_WIDTH = 1280;
  const scalePreview = (el) => {
    el.style.setProperty('--preview-scale', (el.clientWidth / PREVIEW_WIDTH).toFixed(4));
  };
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(entries => entries.forEach(entry => scalePreview(entry.target)));
    livePreviews.forEach(el => ro.observe(el));
  } else {
    const scaleAll = () => livePreviews.forEach(scalePreview);
    scaleAll();
    window.addEventListener('resize', scaleAll);
  }
}

// ════════════════════════════════════════════════
// ANIMACIONES DE ENTRADA — HERO
// ════════════════════════════════════════════════
const nameEl = document.getElementById('hero-name');
if (nameEl && typeof SplitType !== 'undefined') {
  const split = new SplitType(nameEl, { types: 'chars' });

  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .from('.nav', { y: -60, opacity: 0, duration: .7, ease: 'power2.out' })
    .from('.pill', { opacity: 0, y: -18, duration: .6 }, '-=.3')
    .from('.hero-inner h1', { opacity: 0, y: 35, duration: .7 }, '-=.35')
    .from(split.chars, {
      opacity: 0, y: 50, rotateX: -80,
      stagger: .035, duration: .5, ease: 'back.out(1.6)'
    }, '-=.45')
    .from('.lead',     { opacity: 0, y: 22, duration: .6 }, '-=.3')
    .from('.cta > *',  { opacity: 0, y: 16, stagger: .1,   duration: .5 }, '-=.35')
    .from('.links > *',{ opacity: 0, y: 10, stagger: .08,  duration: .4 }, '-=.3')
    .from('.skills-inline li', {
      opacity: 0, y: 10, scale: .88, stagger: .055, duration: .4, ease: 'back.out(1.2)'
    }, '-=.25')
    .from('.hero-card', { opacity: 0, x: 40, duration: .75, ease: 'power2.out' }, .35)
    .from('.stat', { opacity: 0, x: 20, stagger: .09, duration: .45, ease: 'power2.out' }, '-=.45');

} else {
  gsap.from('.hero-inner > *', { opacity: 0, y: 24, stagger: .12, duration: .65, ease: 'power3.out' });
  gsap.from('.hero-card',      { opacity: 0, x: 30, duration: .7, delay: .4, ease: 'power2.out' });
}

// ════════════════════════════════════════════════
// SECTION LABELS
// ════════════════════════════════════════════════
gsap.utils.toArray('.section-label').forEach(label => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: label, start: 'top 90%' } });
  tl.from(label.querySelector('.section-number'), { opacity: 0, x: -20, duration: .45, ease: 'power2.out' })
    .from(label.querySelector('.section-title'),  { opacity: 0, x: -14, duration: .5,  ease: 'power2.out' }, '-=.2');
});

// ════════════════════════════════════════════════
// CARDS — scroll stagger con dirección alterna
// ════════════════════════════════════════════════
gsap.utils.toArray('.card').forEach((card, i) => {
  if (card.closest('.hero')) return;
  const dir = i % 2 === 0 ? 1 : -1;
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
    opacity: 0, y: 32, x: dir * 10,
    duration: .65, delay: (i % 3) * .06,
    ease: 'power3.out', clearProps: 'opacity,transform'
  });
});

// ════════════════════════════════════════════════
// MÁS PROYECTOS — filas en secuencia
// ════════════════════════════════════════════════
const projectRows = document.querySelector('.project-rows');
if (projectRows) {
  gsap.from('.project-row', {
    scrollTrigger: { trigger: projectRows, start: 'top 88%' },
    opacity: 0, y: 12, stagger: .06, duration: .45,
    ease: 'power2.out', clearProps: 'opacity,transform'
  });
}

// ════════════════════════════════════════════════
// SKILLS LIST — stagger al scroll
// ════════════════════════════════════════════════
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
  gsap.from('.skills li', {
    scrollTrigger: { trigger: skillsSection, start: 'top 85%' },
    opacity: 0, scale: .82, y: 14, stagger: .06, duration: .45,
    ease: 'back.out(1.25)', clearProps: 'all'
  });
}

// ════════════════════════════════════════════════
// TIMELINE ITEMS — aparecen uno a uno
// ════════════════════════════════════════════════
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: { trigger: item, start: 'top 88%' },
    opacity: 0, x: -28,
    duration: .55, delay: i * .1,
    ease: 'power2.out', clearProps: 'all'
  });
});

// ════════════════════════════════════════════════
// EXP PILLS — stagger al scroll
// ════════════════════════════════════════════════
gsap.utils.toArray('.exp-pills').forEach(group => {
  gsap.from(group.querySelectorAll('span'), {
    scrollTrigger: { trigger: group, start: 'top 90%' },
    opacity: 0, scale: .85, y: 8,
    stagger: .05, duration: .4,
    ease: 'back.out(1.2)', clearProps: 'all'
  });
});

// ════════════════════════════════════════════════
// EXP COLS — entran desde lados opuestos
// ════════════════════════════════════════════════
const expCols = document.querySelectorAll('.exp-col');
expCols.forEach((col, i) => {
  gsap.from(col, {
    scrollTrigger: { trigger: col, start: 'top 88%' },
    opacity: 0, x: i % 2 === 0 ? -24 : 24,
    duration: .6, ease: 'power2.out', clearProps: 'all'
  });
});

// ════════════════════════════════════════════════
// SOFTSKILLS — escalonado tipo grid
// ════════════════════════════════════════════════
const softGrid = document.querySelector('.softskill-grid');
if (softGrid) {
  gsap.from('.softskill-item', {
    scrollTrigger: { trigger: softGrid, start: 'top 88%' },
    opacity: 0, y: 20, scale: .9,
    stagger: { amount: .4, from: 'random' },
    duration: .5, ease: 'back.out(1.3)', clearProps: 'all'
  });
}

// ════════════════════════════════════════════════
// CONTACTO — items entran desde abajo
// ════════════════════════════════════════════════
gsap.utils.toArray('.contact-item').forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: { trigger: item, start: 'top 90%' },
    opacity: 0, y: 18,
    duration: .5, delay: i * .08,
    ease: 'power2.out', clearProps: 'all'
  });
});

// ════════════════════════════════════════════════
// NAV — highlight de sección activa
// ════════════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.menu a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--soft)';
          link.style.background = 'rgba(255,255,255,0.05)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

// ─── Atajo teclado: "m" → Contacto ───────────
document.addEventListener('keydown', (e) => {
  if (e.key?.toLowerCase() === 'm') {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }
});