# Bento

A personal start page: bookmarks, today’s schedule, headlines, a daily quote, search, and directions.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Weather is loaded for Lawrenceville, GA from [Open-Meteo](https://open-meteo.com/). If that request fails, the page keeps 79°F.

Press `/` to focus search. Choose Google or Wiki, then press Enter. Directions opens Google Maps from the saved address.

## Deploy on GitHub Pages

Push `main` to GitHub, then set **Settings → Pages → Source** to **GitHub Actions**. Each push to `main` builds the React app and publishes `dist`.
