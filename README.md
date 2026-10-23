# SmartWills Malaysia Website

Static marketing website for SmartWills Malaysia.

## Project Structure

- `index.html` - Homepage markup and inline interaction scripts.
- `style.css` - Global styles and responsive layout rules.
- `Asset/` - Branding, icons, flags, and homepage imagery.
- `docs/seo/` - SEO reference material.

## Local Preview

Because this is a static site, you can open `index.html` directly in a browser.
For a local server preview, run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/index.html
```

## Deployment

This project can be deployed to GitHub Pages or any static hosting provider.
Use the repository root as the publishing source.

## Notes

- Keep SmartWills brand assets inside `Asset/`.
- Do not commit local Playwright sessions, screenshots, `.DS_Store`, or environment files.
