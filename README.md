# Bento

Personal start page for Balakrishnan: bookmarks, a daily quote, search, weather, and directions from Hyderabad.

**Live site:** https://balakrishnan2k00.github.io/bento/

**Repo:** https://github.com/balakrishnan2k00/bento

## What you need

- [Node.js](https://nodejs.org/) 20 or newer
- Git
- [GitHub CLI](https://cli.github.com/) (`gh`) if you want to log in from the terminal

## Run locally

From `e:\Projects\dashboard`:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Press `/` to focus search. Choose **Google** or **Bing**, then Enter. Directions opens Google Maps from Hyderabad, 500018. Weather comes from [Open-Meteo](https://open-meteo.com/) (falls back to 32°C). The quote of the day comes from [DummyJSON](https://dummyjson.com/) and is cached in this browser until tomorrow. Bookmark icons are each site’s favicon.

## Edit the page

Most personal details live in `src/data.ts`:

- `profile.name` — greeting name
- `profile.address` / `addressDisplay` — Directions origin
- `profile.latitude` / `longitude` — weather
- `personal`, `favorites`, `entertainment`, `work` — bookmark lists (`label`, `href`)

India flag, logo, and search engines are in `src/icons.tsx` and `src/dashboard.tsx`. Favicon is `public/favicon.svg`.

After local edits, refresh http://localhost:5173.

## Save to GitHub and publish

The source lives on the `main` branch. The live site is the `gh-pages` branch.

### 1. Log in (once)

```bash
gh auth login --hostname github.com --git-protocol https --web
```

Complete the browser prompt. You only need the extra `workflow` permission if you add GitHub Actions later. This project publishes with `gh-pages`, so `repo` access is enough.

### 2. Commit your changes

```bash
git status
git add -A
git commit -m "Describe why you changed the start page."
git push origin main
```

Do not commit `.env` files or secrets. `node_modules` and `dist` are already ignored.

### 3. Deploy the live site

```bash
npm run deploy
```

That builds the React app and pushes `dist` to `gh-pages`. After a minute, open https://balakrishnan2k00.github.io/bento/.

If Pages is not on yet: GitHub repo → **Settings → Pages → Source** → branch **`gh-pages`** / folder **`/`** → Save.

### Full sequence after an edit

```bash
cd e:\Projects\dashboard
npm run dev
```

Check the page in the browser, then:

```bash
git add -A
git commit -m "Your message"
git push origin main
npm run deploy
```

## Other scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local app at http://localhost:5173 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint |
| `npm run deploy` | Build and publish to GitHub Pages |
