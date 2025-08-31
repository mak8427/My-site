# Repository Guidelines

## Project Structure & Module Organization
- Root entry: `index.html` loads content into `#main-content` via `script.js`.
- Styles: `style.css` (theme, variables) and `mediaqueries.css` (responsive rules).
- Sections: HTML partials in `sections/` (e.g., `about.html`, `projects.html`).
- Assets: images and documents in `assets/`.
- Data/experiments: domain folders like `ML/`, `finance/`, `UAV/` (some are Git submodules; see `.gitmodules`).

## Build, Test, and Development Commands
- Serve locally: `python3 -m http.server 8080` then open `http://localhost:8080`.
- Update submodules: `git submodule update --init --force --remote`.
- Auto-pull loop (optional): `bash updater.sh` (runs a continuous fetch/reset + submodule update; use with care).

## Coding Style & Naming Conventions
- HTML/CSS: 2-space indentation; classes/ids use kebab-case (e.g., `section__pic-container`).
- JavaScript: 4-space indentation; prefer `const`/`let`, early returns, and small functions.
- Files: lowercase with hyphens (e.g., `mediaqueries.css`, `projects.html`). Keep new sections in `sections/` and reference from JS.
- Formatting: keep CSS variables for theme; avoid inline styles.

## Testing Guidelines
- Manual: load locally, verify no console errors; check dark/light toggle and hamburger menu.
- Responsiveness: validate main breakpoints defined in `mediaqueries.css` (>=1200px, ~992px, 768px, 600px).
- Content loading: ensure every nav target has a matching `sections/<name>.html` and that `script.js` includes it in the `sections` array.
- Assets: confirm links and image paths resolve (no 404s).

## Commit & Pull Request Guidelines
- Commits: short, imperative mood. Prefix scope when useful.
  - Examples: `Fix: prevent profile text overlap on tablet`, `Add: volunteering section partial`, `Chore: update submodules`.
- PRs: include a clear summary, before/after screenshots for UI changes, and reference issues (e.g., `Fixes #12`). Note any submodule updates.

## Architecture Notes & Tips
- SPA-lite: `script.js` fetches and concatenates `sections/*.html` at runtime; anchors navigate within the page.
- Theme: CSS variables with `body.dark-theme` and `localStorage` persistence.
- Avoid secrets; keep large binaries out of Git when possible. Prefer optimized images in `assets/`.
