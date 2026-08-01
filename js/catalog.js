/* ==========================================================================
   catalog.js
   Loads data/games.csv via PapaParse and provides shared helpers used by
   index.html (browse/search), game.html (detail lookup) and saved.html
   (saved list). Kept dependency-free beyond PapaParse.
   ========================================================================== */

const CATALOG_PATH = 'data/games.csv';
const SAVED_KEY = 'retrocart_saved_slugs';

function handleCartImgError(img) {
  img.onerror = null;
  img.src = 'images/cart-placeholder.png';
  const media = img.closest('.cart-media, .game-media');
  if (media && !media.classList.contains('no-photo')) {
    media.classList.add('no-photo');
    const label = document.createElement('span');
    label.className = 'no-photo-label';
    label.textContent = 'Photo coming soon';
    media.appendChild(label);
  }
}

/** Fetch + parse the CSV catalog. Returns a Promise<Array<Object>>. */
function loadCatalog() {
  return fetch(CATALOG_PATH)
    .then((res) => {
      if (!res.ok) throw new Error('Could not load catalog (' + res.status + ')');
      return res.text();
    })
    .then((csvText) => {
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      return parsed.data;
    });
}

/* ---------------------------------------------------------------------- */
/* Saved list (localStorage)                                              */
/* ---------------------------------------------------------------------- */

function getSavedSlugs() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isSaved(slug) {
  return getSavedSlugs().includes(slug);
}

function toggleSaved(slug) {
  const slugs = getSavedSlugs();
  const idx = slugs.indexOf(slug);
  if (idx > -1) {
    slugs.splice(idx, 1);
  } else {
    slugs.push(slug);
  }
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(slugs));
  } catch (e) {
    /* localStorage unavailable (private mode etc.) — fail silently */
  }
  return slugs.includes(slug);
}

/* ---------------------------------------------------------------------- */
/* Rendering helpers                                                       */
/* ---------------------------------------------------------------------- */

function conditionClass(condition) {
  return 'cond-' + String(condition || '').toLowerCase().replace(/\s+/g, '-');
}

function truthy(val) {
  if (typeof val === 'boolean') return val;
  return String(val).trim().toLowerCase() === 'yes' || val === true;
}

const INCLUDE_ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="13" rx="2" fill="currentColor" opacity="0.15"/><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><rect x="7" y="9" width="10" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>',
  manual: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4.5C4 3.7 4.7 3 5.5 3H17a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5.5A1.5 1.5 0 0 1 4 19.5v-15Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.12"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  case: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.1"/><rect x="4" y="3" width="4" height="18" fill="currentColor" fill-opacity="0.25"/></svg>',
  pamphlets: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5l7 2 9-2v14l-9 2-7-2V5Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.1"/><path d="M11 7v14" stroke="currentColor" stroke-width="1.4"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8l9-4 9 4-9 4-9-4Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.1"/><path d="M3 8v9l9 4 9-4V8M12 12v9" stroke="currentColor" stroke-width="1.4"/></svg>',
};

const INCLUDE_LABELS = { cart: 'Cart', manual: 'Manual', case: 'Case', pamphlets: 'Insert', box: 'Box' };

/** Small row of icons showing what's included, used on cartridge cards. */
function renderIncludesRow(game) {
  const keys = ['cart', 'manual', 'case', 'box'];
  return (
    '<div class="includes-row" aria-hidden="true">' +
    keys
      .map((k) => {
        const has = truthy(game[k]);
        return (
          '<span class="inc-icon' + (has ? '' : ' missing') + '" title="' + INCLUDE_LABELS[k] + (has ? ' included' : ' not included') + '">' +
          INCLUDE_ICONS[k] +
          '</span>'
        );
      })
      .join('') +
    '</div>'
  );
}

/** Full included panel with labels, used on the game detail page. */
function renderIncludedPanel(game) {
  const keys = ['cart', 'manual', 'case', 'pamphlets', 'box'];
  return (
    '<div class="included-grid">' +
    keys
      .map((k) => {
        const has = truthy(game[k]);
        return (
          '<div class="included-item' + (has ? '' : ' missing') + '">' +
          INCLUDE_ICONS[k] +
          '<span>' + INCLUDE_LABELS[k] + '</span>' +
          '</div>'
        );
      })
      .join('') +
    '</div>'
  );
}

/** Builds a single cartridge-card element (as an HTML string). */
function renderCartCard(game) {
  const img = game.image
    ? 'images/games/' + game.image
    : 'images/cart-placeholder.png';
  const saved = isSaved(game.slug);
  return (
    '<article class="cart-card" data-slug="' + game.slug + '">' +
    '<div class="cart-notch"></div>' +
    '<div class="cart-media">' +
    '<img src="' + img + '" alt="' + escapeHtml(game.title) + ' cartridge" loading="lazy" ' +
    'onerror="handleCartImgError(this)">' +
    '<span class="condition-flag ' + conditionClass(game.condition) + '">' + game.condition + '</span>' +
    '<button class="save-toggle' + (saved ? ' saved' : '') + '" data-save-slug="' + game.slug + '" ' +
    'aria-pressed="' + saved + '" aria-label="Save ' + escapeHtml(game.title) + ' to your list">' +
    (saved ? '&#9733;' : '&#9734;') +
    '</button>' +
    '</div>' +
    '<div class="cart-body">' +
    '<span class="cart-console">' + game.console + '</span>' +
    '<h3><a href="game.html?slug=' + encodeURIComponent(game.slug) + '">' + escapeHtml(game.title) + '</a></h3>' +
    renderIncludesRow(game) +
    '<div class="cart-meta">' +
    '<span>' + (game.genre || '') + ' &middot; ' + (game.release_year || '') + '</span>' +
    '<span class="price">$' + game.price + '</span>' +
    '</div>' +
    '</div>' +
    '</article>'
  );
}

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* ---------------------------------------------------------------------- */
/* Delegated click handling for save buttons (works for re-rendered grids) */
/* ---------------------------------------------------------------------- */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-save-slug]');
  if (!btn) return;
  const slug = btn.getAttribute('data-save-slug');
  const nowSaved = toggleSaved(slug);
  btn.classList.toggle('saved', nowSaved);
  btn.setAttribute('aria-pressed', String(nowSaved));
  btn.innerHTML = nowSaved ? '&#9733;' : '&#9734;';
  document.dispatchEvent(new CustomEvent('saved-list-changed'));
});
