/**
 * Load partials by [data-include] attribute
 * and initialize interactive features after insertion.
 */
document.addEventListener('DOMContentLoaded', async () => {
  await includePartials();
  initSmoothScroll();
  initBurger();
  initModals();
  initForms();
});

async function includePartials() {
  const blocks = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(blocks.map(async el => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      el.outerHTML = await res.text();
    } catch (e) {
      console.error('Include error:', url, e);
    }
  }));
}

/* — Navigation: smooth scroll — */
function initSmoothScroll() {
  document.body.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
    document.querySelector('.nav')?.classList.remove('open');
  });
}

/* — Burger menu — */
function initBurger() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => nav.classList.toggle('open'));
}

/* — Modals — */
function initModals() {
  // open ticket modal
  document.querySelectorAll('.js-ticket').forEach(btn => {
    btn.addEventListener('click', () => openModal('#ticketModal'));
  });

  // delegate close actions
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]')) closeModal(e.target.closest('.modal'));
  });

  function openModal(sel){
    const m = document.querySelector(sel);
    if (!m) return;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(m){
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* — Form validation / submission mock — */
function initForms() {
  const contact = document.getElementById('contactForm');
  contact?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Дякуємо! Ми зв’яжемось з вами.');
    e.target.reset();
  });

  const ticket = document.getElementById('ticketForm');
  ticket?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Квиток заброньовано! Деталі відправлено на Email.');
    document.querySelector('#ticketModal .modal__close')?.click();
    e.target.reset();
  });
}
