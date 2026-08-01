document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const overlay = document.getElementById('page-loading-overlay');
  if (!toggle || !nav) return;

  let loadingStartedAt = 0;
  let hideTimer = null;

  const showLoading = () => {
    if (!overlay) return;
    loadingStartedAt = Date.now();
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const hideLoading = () => {
    if (!overlay) return;
    const elapsed = Date.now() - loadingStartedAt;
    const remaining = Math.max(0, 650 - elapsed);
    if (hideTimer) {
      window.clearTimeout(hideTimer);
    }
    hideTimer = window.setTimeout(() => {
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
      hideTimer = null;
    }, remaining);
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const isExternal = /^https?:/i.test(href);
    const isSamePage = href.startsWith('index.html') || href.startsWith('about.html') || href.startsWith('contact.html') || href.startsWith('saved.html') || href.startsWith('game.html');
    if (isExternal || !isSamePage) return;
    link.addEventListener('click', (event) => {
      const samePage = link.getAttribute('href') === window.location.pathname.split('/').pop();
      if (samePage) return;
      event.preventDefault();
      showLoading();
      setTimeout(() => {
        window.location.href = link.href;
      }, 420);
    });
  });

  window.addEventListener('pageshow', hideLoading);
  window.addEventListener('load', hideLoading);
});
