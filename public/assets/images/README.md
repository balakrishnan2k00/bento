# Movie posters (GitHub Pages)

Drop poster files here. Vite copies this folder to the site root on deploy, so posters load from:

`./assets/images/your-file.jpg` (via `import.meta.env.BASE_URL`)

## Naming

1. **Optional column in `movielist.txt`** — third tab-separated field is the filename only, e.g. `poster.webp`
2. **Otherwise auto slug from title** — e.g. `Mookuthi Amman 2` → try `mookuthi-amman-2.webp`, `.jpg`, `.jpeg`, `.png`

Local files are tried **before** TMDB / IMDb lookup.

Use reasonably sized JPG/WebP (e.g. 342px wide) to keep the repo small. Use [Git LFS](https://git-lfs.com/) if you add many large files.

Re-download all posters from IMDb search (after editing `movielist.txt`):

```bash
node scripts/download-posters.mjs
```
