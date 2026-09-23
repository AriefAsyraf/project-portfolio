// ── NOISE TEXTURE ────────────────────────────────────────────────
(function() {
  const tile = document.createElement('canvas');
  const tileSize = 256;
  tile.width = tileSize;
  tile.height = tileSize;
  const tCtx = tile.getContext('2d');
  const imageData = tCtx.createImageData(tileSize, tileSize);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    data[i] = v;
    data[i+1] = v;
    data[i+2] = v;
    data[i+3] = 255;
  }
  tCtx.putImageData(imageData, 0, 0);
  const tileUrl = tile.toDataURL();

  const canvas = document.getElementById('noise-canvas');
  canvas.style.backgroundImage = `url(${tileUrl})`;
  canvas.style.backgroundRepeat = 'repeat';
  canvas.style.backgroundSize = '256px 256px';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = 1;
  canvas.height = 1;
})();

// ── CONTACT FORM (Formspree AJAX) ────────────────────────────────
window.formspree = window.formspree || function() { (formspree.q = formspree.q || []).push(arguments); };
formspree('initForm', {
  formElement: '#contact-form',
  formId: 'meaokqvg',
  onSuccess: function() {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('fs-success').style.display = 'block';
  }
});

// ── SIDEBAR ──────────────────────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const hamburger = document.getElementById('hamburger');

function toggleSidebar() {
  const isOpen = sidebar.classList.contains('open');
  isOpen ? closeSidebar() : openSidebar();
}

function openSidebar() {
  sidebar.classList.add('open');
  overlay.style.display = 'block';
  requestAnimationFrame(() => overlay.classList.add('open'));
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

// ── PROJECT DATA ─────────────────────────────────────────────────
const projects = [
  {
    title: 'Project Onion',
    tags: ['Next.js', 'Supabase', 'OpenAI'],
    img: './images/project-onion.png',
    desc: 'Onion is a daily Q&A web app I designed and built solo from scratch. Every day, OpenAI generates fresh questions across five categories — Relationships, Career, Money, Pop Culture, and Hot Takes — and users submit their honest answers for the community to read and vote on.\n\nBuilt with Next.js and Supabase for real-time data and auth, the app currently has 20 active users. The biggest challenge wasn\'t the AI integration — it was getting the animations to feel genuinely smooth and polished, which I consider just as important as the engineering underneath.',
    url: 'https://projectonion.vercel.app/'
  },
];

function openModal(index) {
  const p = projects[index];
  document.getElementById('modal-img').src = p.img;
  document.getElementById('modal-img').alt = p.title;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-desc').innerHTML = p.desc.split('\n\n').map(t => `<p style="margin-bottom:12px">${t}</p>`).join('');
  document.getElementById('modal-link').href = p.url;
  document.getElementById('modal-tags').innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  document.getElementById('project-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('project-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('project-modal')) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── PARALLAX ENGINE ──────────────────────────────────────────────
const isMobile = () => window.innerWidth < 768;

let ticking = false;
let scrollY = 0;

function onScroll() {
  scrollY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(runParallax);
    ticking = true;
  }
}

function runParallax() {
  ticking = false;
  if (isMobile()) return;

  const vy = scrollY;

  const heroTitle = document.querySelector('.hero-title');
  const heroSub   = document.querySelector('.hero-subtitle');
  const heroEye   = document.querySelector('.hero-eyebrow');
  const heroActs  = document.querySelector('.hero-actions');
  if (heroTitle) heroTitle.style.transform = `translateY(${vy * 0.22}px)`;
  if (heroSub)   heroSub.style.transform   = `translateY(${vy * 0.14}px)`;
  if (heroEye)   heroEye.style.transform   = `translateY(${vy * 0.30}px)`;
  if (heroActs)  heroActs.style.transform  = `translateY(${vy * 0.10}px)`;

  document.querySelectorAll('.project-img-wrap').forEach((wrap, i) => {
    const rect = wrap.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (window.innerHeight / 2 - center) * 0.12;
    const img = wrap.querySelector('.project-img');
    if (img) img.style.transform = `translateY(${offset}px) scale(1.08)`;
  });

  const aboutCard = document.querySelector('.about-img-card');
  if (aboutCard) {
    const rect = aboutCard.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.10;
    aboutCard.style.transform = `rotate(4deg) translateY(${-offset}px)`;
  }

  document.querySelectorAll('.section-title, .contact-title, .about-title').forEach(el => {
    const rect = el.getBoundingClientRect();
    const progress = 1 - Math.max(0, Math.min(1, rect.top / (window.innerHeight * 0.3)));
    const shift = (1 - progress) * 8;
    el.style.transform = `translateY(${shift}px)`;
    el.style.opacity = 0.85 + progress * 0.15;
  });

  document.querySelectorAll('.service-card').forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * (0.04 + i * 0.015);
    card.style.transform = `translateY(${-offset}px)`;
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(s => {
    if (vy >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current) a.style.color = 'rgb(25,29,33)';
  });
}

// Set initial scale on project images
document.querySelectorAll('.project-img').forEach(img => {
  img.style.transform = 'translateY(0px) scale(1.08)';
});

// Scroll-reveal
const revealEls = document.querySelectorAll(
  '.project-card, .service-card, .faq-item, .about-badge, .contact-link'
);
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = (el.style.transform || '') + ' translateY(16px)';
  el.style.transition = 'opacity 0.22s cubic-bezier(0.22,1,0.36,1), transform 0.22s cubic-bezier(0.22,1,0.36,1)';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = [...el.parentElement.children];
      const delay = siblings.indexOf(el) * 30;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = el.style.transform.replace(/translateY\([^)]+\)/, 'translateY(0px)');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px 0px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

window.addEventListener('scroll', onScroll, { passive: true });
runParallax();
