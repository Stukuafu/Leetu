/* ==========================================================================
   game.js — single game detail page, driven by ?slug= in the URL
   ========================================================================== */

(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const content = document.getElementById('game-content');
  const notFound = document.getElementById('not-found');

  function renderGame(game) {
    document.title = game.title + ' — RetroCart';
    document.getElementById('page-title').textContent = game.title + ' — RetroCart';

    const img = game.image ? 'images/games/' + game.image : 'images/cart-placeholder.png';
    const saved = isSaved(game.slug);

    content.innerHTML =
      '<div class="game-detail">' +
      '<div>' +
      '<div class="game-media">' +
      '<img src="' + img + '" alt="' + escapeHtml(game.title) + ' cartridge photo" ' +
      'onerror="this.onerror=null;this.src=\'images/cart-placeholder.png\';">' +
      '</div>' +
      '</div>' +
      '<div>' +
      '<span class="game-console-tag">' + game.console + '</span>' +
      '<h1>' + escapeHtml(game.title) + '</h1>' +
      '<p class="game-sub">' + (game.genre || '') + ' &middot; ' + (game.release_year || '') + '</p>' +
      '<div class="price-tag">$' + game.price + '</div>' +

      '<table class="spec-table">' +
      '<tr><td>Console</td><td>' + game.console + '</td></tr>' +
      '<tr><td>Genre</td><td>' + (game.genre || '&mdash;') + '</td></tr>' +
      '<tr><td>Release year</td><td>' + (game.release_year || '&mdash;') + '</td></tr>' +
      '<tr><td>Condition</td><td>' + game.condition + '</td></tr>' +
      '</table>' +

      '<div class="included-panel">' +
      '<h4>What comes with it</h4>' +
      renderIncludedPanel(game) +
      '</div>' +

      (game.notes ? '<div class="game-notes">' + escapeHtml(game.notes) + '</div>' : '') +

      '<div class="detail-actions">' +
      '<a class="btn btn-primary" href="contact.html?game=' + encodeURIComponent(game.slug) +
      '&title=' + encodeURIComponent(game.title) + '">Enquire about this cart</a>' +
      '<button class="btn btn-ghost" id="detail-save-btn" data-save-slug="' + game.slug + '" aria-pressed="' + saved + '">' +
      (saved ? '&#9733; Saved' : '&#9734; Save to list') +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    // Keep the ghost "Save" button text in sync with the shared star toggle logic.
    const detailBtn = document.getElementById('detail-save-btn');
    detailBtn.addEventListener('click', () => {
      const nowSaved = detailBtn.getAttribute('aria-pressed') === 'true';
      detailBtn.innerHTML = !nowSaved ? '&#9733; Saved' : '&#9734; Save to list';
      detailBtn.setAttribute('aria-pressed', String(!nowSaved));
    });
  }

  if (!slug) {
    content.hidden = true;
    notFound.hidden = false;
  } else {
    loadCatalog()
      .then((games) => {
        const game = games.find((g) => g.slug === slug);
        if (!game) {
          content.hidden = true;
          notFound.hidden = false;
        } else {
          renderGame(game);
        }
      })
      .catch((err) => {
        content.innerHTML = '<p class="text-mute">Could not load this listing right now.</p>';
        console.error(err);
      });
  }
})();
