# RetroCart

A static, no-backend catalog site for retro game cartridges, built to run on GitHub Pages. Starts with Sega Mega Drive, designed to expand to other consoles.

## What's included

- `index.html` — homepage: hero, search, filters, catalog grid
- `game.html` — single template page for every game (reads `?slug=` from the URL)
- `saved.html` — a visitor's saved list (stored in their browser's localStorage, not a real account)
- `about.html`, `contact.html` — content pages
- `data/games.csv` — the catalog. **This is the file you edit to add/remove/update games.**
- `images/games/` — where you'll drop photos of each cartridge
- `css/style.css` — all styling, as CSS variables (tokens) at the top
- `js/` — catalog loading, search/filter, saved-list, and per-page logic

No build step, no npm install, no server required to deploy. It's all static files.

---

## Running it locally

Browsers block `fetch()` on local files opened directly (`file://`), so the CSV won't load if you just double-click `index.html`. Instead, run a tiny local server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. (Or use VS Code's "Live Server" extension if you prefer.)

---

## Adding a game

1. **Take a photo** of the cartridge (and case/manual if you're photographing those too). Square or 4:3 works best.
2. **Name the file to match the game's slug**, lowercase with hyphens, e.g. `streets-of-rage-2.jpg`.
3. **Drop it into** `images/games/`.
4. **Add a row to `data/games.csv`** with the matching `slug` and `image` filename.

If you add a row before you've taken the photo, or leave `image` blank, the site automatically falls back to a generic placeholder cartridge graphic — nothing breaks.

### CSV columns

| Column | Notes |
|---|---|
| `id` | Any unique number |
| `slug` | Lowercase, hyphenated, unique. Used in the URL and the image filename. |
| `title` | Game title |
| `console` | e.g. `Mega Drive` |
| `genre` | e.g. `Platformer` |
| `release_year` | e.g. `1992` |
| `condition` | One of: `Mint`, `Excellent`, `Good`, `Fair`, `Poor` |
| `cart`, `manual`, `case`, `pamphlets`, `box` | `Yes` or `No` — what's included |
| `price` | Number, no currency symbol |
| `notes` | Free text — condition specifics, anything worth flagging |
| `image` | Filename only, e.g. `streets-of-rage-2.jpg` — must match a file in `images/games/` |

You can edit this CSV directly on GitHub (it has a built-in editor for small text files), or in Excel/Google Sheets and re-export as CSV — either works.

---

## Setting up the contact form

The enquiry form in `contact.html` currently points at a placeholder:

```html
<form id="enquiry-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

To make it actually send you emails:

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a new form — it'll give you a unique endpoint URL like `https://formspree.io/f/xxxxxxx`.
3. Replace `YOUR_FORM_ID` in `contact.html` with that URL.
4. Formspree will ask you to confirm your email address the first time someone submits — just a one-time verification step.

Until you do this, the form will not send anywhere — worth testing once with a real submission before you consider the site "live."

---

## Saved list (localStorage)

The star icon on any game card saves it to a visitor's own browser (`localStorage`), viewable at `saved.html`. This is **not a real user account system** — it's per-browser, per-device, and will disappear if someone clears their browser data or switches devices. That's a deliberate, simple choice for a static site with no backend. If you later want saved lists that follow a person across devices, that would need a real backend (e.g. Supabase or Firebase with email login) — a bigger step up from this.

---

## Deploying to GitHub Pages

1. Push this whole folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch", pick your branch (usually `main`) and the root folder (`/`).
4. Save — GitHub will give you a URL like `https://yourusername.github.io/your-repo-name/`.

No further configuration needed — it's all static files.

---

## A note on images

The hero banner, empty-state graphic, and about-page image are original AI-generated illustrations chosen specifically to avoid depicting any real Sega branding or copyrighted character art. When you photograph actual cartridges for the catalog, that's fine — those are photos of items you own. Just be mindful about not reproducing official box art or promotional material at scale elsewhere on the site.

---

## What's not built yet (by design)

- Purchasing / checkout — enquiry-only for now, as planned
- Real user accounts — saved list is localStorage-only, see above
- Multiple photos per game — currently one `image` per row; the README for adding a gallery version is a natural next step once you're happy with the single-image structure
