/* ==========================================================================
   main.js — homepage catalog: load, filter, search, render
   ========================================================================== */

(function () {
  let allGames = [];

  const grid = document.getElementById('cart-grid');
  const emptyState = document.getElementById('empty-state');
  const resultCount = document.getElementById('result-count');
  const consoleSelect = document.getElementById('filter-console');
  const genreSelect = document.getElementById('filter-genre');
  const conditionSelect = document.getElementById('filter-condition');
  const searchInput = document.getElementById('filter-search');
  const heroSearchForm = document.getElementById('hero-search-form');
  const heroSearchInput = document.getElementById('hero-search');
  const clearBtn = document.getElementById('clear-filters-btn');

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  function populateFilterOptions(games) {
    const consoles = uniqueSorted(games.map((g) => g.console));
    const genres = uniqueSorted(games.map((g) => g.genre));
    const conditions = ['Mint', 'Excellent', 'Good', 'Fair', 'Poor'].filter((c) =>
      games.some((g) => String(g.condition).toLowerCase() === c.toLowerCase())
    );

    consoles.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      consoleSelect.appendChild(opt);
    });
    genres.forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      genreSelect.appendChild(opt);
    });
    conditions.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      conditionSelect.appendChild(opt);
    });
  }

  function applyFilters() {
    const consoleVal = consoleSelect.value;
    const genreVal = genreSelect.value;
    const conditionVal = conditionSelect.value;
    const searchVal = searchInput.value.trim().toLowerCase();

    const filtered = allGames.filter((g) => {
      if (consoleVal && g.console !== consoleVal) return false;
      if (genreVal && g.genre !== genreVal) return false;
      if (conditionVal && String(g.condition).toLowerCase() !== conditionVal.toLowerCase()) return false;
      if (searchVal && !String(g.title).toLowerCase().includes(searchVal)) return false;
      return true;
    });

    renderGrid(filtered);
  }

  function renderGrid(games) {
    if (!games.length) {
      grid.innerHTML = '';
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      grid.innerHTML = games.map(renderCartCard).join('');
    }
    resultCount.textContent = games.length + (games.length === 1 ? ' game' : ' games');
  }

  function wireEvents() {
    [consoleSelect, genreSelect, conditionSelect].forEach((el) =>
      el.addEventListener('change', applyFilters)
    );
    searchInput.addEventListener('input', applyFilters);

    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchInput.value = heroSearchInput.value;
      applyFilters();
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });

    clearBtn.addEventListener('click', () => {
      consoleSelect.value = '';
      genreSelect.value = '';
      conditionSelect.value = '';
      searchInput.value = '';
      applyFilters();
    });

    // Keep card star icons in sync if saved elsewhere (e.g. saved.html in another tab)
    document.addEventListener('saved-list-changed', () => {
      /* no-op here; card itself updates its own icon on click */
    });
  }

  loadCatalog()
    .then((games) => {
      allGames = games;
      populateFilterOptions(games);
      wireEvents();
      renderGrid(games);
    })
    .catch((err) => {
      grid.innerHTML =
        '<p class="text-mute">Could not load the catalog right now. (' + err.message + ')</p>';
      console.error(err);
    });
})();
