/* ==========================================================================
   boot.js
   A brief console-style boot sequence shown ONLY on a visitor's first ever
   page load (flagged in localStorage), and skipped entirely if the visitor
   has requested reduced motion. Always skippable via a visible button.
   ========================================================================== */

(function () {
  const FLAG_KEY = 'retrocart_booted';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (localStorage.getItem(FLAG_KEY) || prefersReducedMotion) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'boot-overlay';
  overlay.setAttribute('role', 'status');
  overlay.innerHTML =
    '<div id="boot-text"></div>' +
    '<button class="boot-skip" type="button">Skip &rarr;</button>';
  document.body.appendChild(overlay);

  const lines = [
    'RETROCART SYSTEM BIOS v1.0',
    'CHECKING CARTRIDGE SLOT ..... OK',
    'LOADING CATALOG INDEX ....... OK',
    'MEMORY UNIT DETECTED ........ OK',
    '',
    'INSERT CARTRIDGE TO CONTINUE_',
  ];

  const textEl = overlay.querySelector('#boot-text');
  let lineIndex = 0;
  let charIndex = 0;
  let currentText = '';
  let timer = null;

  function typeNext() {
    if (lineIndex >= lines.length) {
      finish();
      return;
    }
    const line = lines[lineIndex];
    if (charIndex <= line.length) {
      textEl.textContent = currentText + line.slice(0, charIndex);
      charIndex++;
      timer = setTimeout(typeNext, 14);
    } else {
      currentText += line + '\n';
      lineIndex++;
      charIndex = 0;
      timer = setTimeout(typeNext, 120);
    }
  }

  function finish() {
    localStorage.setItem(FLAG_KEY, '1');
    overlay.classList.add('hide');
    setTimeout(() => overlay.remove(), 450);
  }

  overlay.querySelector('.boot-skip').addEventListener('click', () => {
    clearTimeout(timer);
    finish();
  });

  // Safety timeout in case something goes wrong — never trap the user.
  setTimeout(finish, 6000);

  typeNext();
})();
