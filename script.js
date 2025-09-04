const state = { lang: localStorage.getItem('lang') || 'en', data: null };

const LANG_FILES = {
  en: '/data/site_en.json',
  it: '/data/site_it.json',
  ru: '/data/site_ru.json'
};

async function loadJSON(path){ const r = await fetch(path); return await r.json(); }

async function init(){
  state.data = await loadJSON(LANG_FILES[state.lang]);
  const [products, reviews] = await Promise.all([
    loadJSON('/data/products.json'),
    loadJSON('/data/reviews.json'),
  ]);

  // texts
  document.getElementById('brand').textContent = state.data.brand;
  document.getElementById('tagline').textContent = state.data.tagline;
  document.querySelector('[data-i="nav0"]').textContent = state.data.nav[0];
  document.querySelector('[data-i="nav1"]').textContent = state.data.nav[1];
  document.querySelector('[data-i="nav2"]').textContent = state.data.nav[2];
  document.querySelector('[data-i="nav3"]').textContent = state.data.nav[3];
  document.getElementById('cta_primary').textContent = state.data.cta_primary;
  document.getElementById('cta_secondary').textContent = state.data.cta_secondary;
  document.querySelector('[data-point="0"]').textContent = state.data.hero_points[0];
  document.querySelector('[data-point="1"]').textContent = state.data.hero_points[1];
  document.querySelector('[data-point="2"]').textContent = state.data.hero_points[2];
  document.getElementById('about_title').textContent = state.data.about_title;
  document.getElementById('about_body').textContent = state.data.about_body;
  document.getElementById('reviews_title').textContent = state.data.reviews_title;
  document.getElementById('contact_title').textContent = state.data.contact_title;
  document.getElementById('wa').textContent = state.data.contact.whatsapp;
  document.getElementById('em').textContent = state.data.contact.email;
  document.getElementById('ad').textContent = state.data.contact.address;
  document.getElementById('footer').textContent = state.data.footer;

  // products grid
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title">${p.title}</div>
      <div class="price">${p.price} ${p.currency}</div>
      <div class="meta">${p.color} • ${p.stock.replace('_',' ')}</div>
    `;
    grid.appendChild(card);
  });

  // reviews
  const rwrap = document.getElementById('reviews_list');
  rwrap.innerHTML = '';
  reviews.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="title">“${r.text}”</div><div class="meta">— ${r.author}</div>`;
    rwrap.appendChild(card);
  });

  // Identity login flow: send to /admin after login
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
      if (!user) {
        window.netlifyIdentity.on('login', () => {
          document.location.href = '/admin/';
        });
      }
    });
  }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  state.lang = btn.dataset.lang;
  localStorage.setItem('lang', state.lang);
  init();
});

init();
