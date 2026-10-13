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

## Connect a calendar

The calendar card can show today’s events from **Google Calendar**. Apple Calendar has no browser sign-in API, so use an iCal link or subscribe that calendar in Google, then connect Google.

### Google Calendar (recommended)

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project, enable **Google Calendar API**.
3. Create an **OAuth client ID** of type **Web application**.
4. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://balakrishnan2k00.github.io`
5. On the dashboard, open **Connect calendar**, paste the client ID, then **Connect Google Calendar**.

The site only asks for read-only calendar access. The client ID is stored in this browser; Google’s access token stays in the tab session.

### Apple Calendar / iCal

In Apple Calendar, publish or share the calendar and copy the iCal URL (`webcal://` is fine). Paste it under **Connect calendar**. If the browser blocks the link (common), add that calendar in Google Calendar with **From URL**, then connect Google.

## Deploy on GitHub Pages

Publishes the production build to the `gh-pages` branch:

```bash
npm run deploy
```
