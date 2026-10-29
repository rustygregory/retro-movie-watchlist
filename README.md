# Retro Movie Watchlist

A mobile-friendly Vite + React SPA for marking which 1980s and 1990s classics you’ve seen. No backend — answers are saved as a draft in `localStorage`, and submitted results live in a shareable `#/r/...` base64url hash link.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Deploy (textable HTTPS link)

1. Run `npm run build` — output lands in `dist/`.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag the `dist` folder onto the page.
4. Copy the HTTPS URL Netlify gives you and text that link to people filling out the watchlist.

After they submit, they copy their **results link** and text it back to you. Opening that link shows `[Name]'s Retro Movie Watchlist` with Seen / Not seen counts and lists.

SPA note: Netlify Drop serves static files fine for this app because routing uses the URL hash (`#/share/...`, `#/r/...`), so no rewrite rules are required.
