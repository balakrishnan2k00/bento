# Bento

A personal start page: bookmarks, today’s schedule, headlines, a daily quote, search, and directions.

Live site: https://balakrishnan2k00.github.io/bento/

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Weather is loaded for Lawrenceville, GA from [Open-Meteo](https://open-meteo.com/). If that request fails, the page keeps 79°F.

Press `/` to focus search. Choose Google or Wiki, then press Enter. Directions opens Google Maps from the saved address.

## Deploy on GitHub Pages

Publishes the production build to the `gh-pages` branch:

```bash
npm run deploy
```
