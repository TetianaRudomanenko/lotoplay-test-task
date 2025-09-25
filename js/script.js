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
  const ticketInfo = document.getElementById('ticketInfo');

  document.querySelectorAll('.js-ticket').forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      const date = btn.dataset.date;

      if (ticketInfo) {
        ticketInfo.innerHTML = `
          <p><strong>Місто / Заклад:</strong> ${city}</p>
          <p><strong>Дата і час:</strong> ${date}</p>
        `;
      }

      openModal('#ticketModal');
    });
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


/* — Form validation / submission mock with GET requests — */
function initForms() {
  const contact = document.getElementById('contactForm');
  contact?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    try {
      const res = await fetch(
        `https://example.com/api/contact?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`
      );
      if (res.ok) {
        alert('Дякуємо! Ми зв’яжемось з вами.');
        form.reset();
      } else {
        alert('Помилка при відправці форми.');
      }
    } catch (err) {
      console.error(err);
      alert('Не вдалося відправити форму.');
    }
  });

  const ticket = document.getElementById('ticketForm');
  ticket?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    try {
      const res = await fetch(
        `https://example.com/api/ticket?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      );
      if (res.ok) {
        alert('Квиток заброньовано! Деталі відправлено на Email.');
        document.querySelector('#ticketModal .modal__close')?.click();
        form.reset();
      } else {
        alert('Помилка при бронюванні квитка.');
      }
    } catch (err) {
      console.error(err);
      alert('Не вдалося відправити квиток.');
    }
  });
}

