/* ==========================================================================
   contact.js
   - Pre-fills the "game" field when arriving from a game detail page
     (contact.html?game=slug&title=Some+Title)
   - Submits the form via fetch to Formspree (or any endpoint that accepts
     the same POST + JSON-accept pattern) without leaving the page, showing
     an inline success/error message instead of a redirect.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  const gameField = document.getElementById('game');
  if (title && gameField) {
    gameField.value = title;
  }

  const form = document.getElementById('enquiry-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    // If the placeholder endpoint hasn't been replaced yet, don't pretend it worked —
    // let it fall through to a normal (failing) submit so the person notices during setup.
    if (form.action.includes('YOUR_FORM_ID')) return;

    e.preventDefault();
    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (res.ok) {
          showStatus('Thanks — your enquiry has been sent. We\'ll reply by email soon.', 'ok');
          form.reset();
        } else {
          showStatus('Something went wrong sending that. Please try again shortly.', 'err');
        }
      })
      .catch(() => {
        showStatus('Something went wrong sending that. Please check your connection and try again.', 'err');
      });
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'form-status show ' + type;
  }
});
