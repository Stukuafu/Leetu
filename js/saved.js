/* ==========================================================================
   saved.js — renders the visitor's saved list (matched against the CSV
   catalog by slug, so it stays a lightweight list of IDs in localStorage
   rather than duplicating game data).
   ========================================================================== */

(function () {
  const grid = document.getElementById('saved-grid');
  const emptyState = document.getElementById('saved-empty');

  function render() {
    loadCatalog().then((games) => {
      const savedSlugs = getSavedSlugs();
      const savedGames = games.filter((g) => savedSlugs.includes(g.slug));

      if (!savedGames.length) {
        grid.innerHTML = '';
        emptyState.hidden = false;
      } else {
        emptyState.hidden = true;
        grid.innerHTML = savedGames.map(renderCartCard).join('');
      }
    });
  }

  document.addEventListener('saved-list-changed', render);
  render();
})();
