/**
 * Download movie posters into public/assets/images/{slug}.jpg
 * Usage: node scripts/download-posters.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outDir = path.join(root, 'public', 'assets', 'images')
const listPath = path.join(root, 'movielist.txt')

function posterSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseMovies(source) {
  const entries = []
  let language = ''
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('Release date')) continue
    const tab = trimmed.indexOf('\t')
    if (tab === -1) {
      language = trimmed
      continue
    }
    const dateStr = trimmed.slice(0, tab).trim()
    const title = trimmed.slice(tab + 1).split('\t')[0].trim()
    if (!title) continue
    const year = new Date(Date.parse(dateStr)).getFullYear()
    entries.push({ title, year, language })
  }
  return entries
}

function titleVariants(title) {
  const variants = [title.trim()]
  const colon = title.split(':')[0]?.trim()
  if (colon && !variants.includes(colon)) variants.push(colon)
  const dash = title.split('—')[0]?.trim()
  if (dash && !variants.includes(dash)) variants.push(dash)
  const hyphen = title.split(' - ')[0]?.trim()
  if (hyphen && !variants.includes(hyphen)) variants.push(hyphen)
  const words = title.trim().split(/\s+/).slice(0, 4).join(' ')
  if (words && !variants.includes(words)) variants.push(words)
  return variants
}

function normalizeTitle(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function scoreTitle(query, candidate, year, candidateYear) {
  const q = normalizeTitle(query)
  const c = normalizeTitle(candidate)
  if (!q || !c) return 0
  let score = 0
  if (c === q) score += 100
  else if (c.startsWith(q) || q.startsWith(c)) score += 75
  else {
    const qWords = new Set(q.split(' ').filter(Boolean))
    score += c.split(' ').filter((w) => qWords.has(w)).length * 18
  }
  if (candidateYear && Math.abs(candidateYear - year) <= 1) score += 35
  return score
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function fetchImdbPosterUrl(title, year) {
  let best = null
  for (const variant of titleVariants(title)) {
    const slug = encodeURIComponent(variant)
    const res = await fetch(`https://v2.sg.media-imdb.com/suggestion/t/${slug}.json`)
    if (!res.ok) continue
    const data = await res.json()
    for (const hit of data.d ?? []) {
      const imageUrl = hit.i?.imageUrl
      if (!imageUrl) continue
      const score = scoreTitle(title, hit.l ?? variant, year, hit.y)
      if (!best || score > best.score) best = { url: imageUrl, score }
    }
    await sleep(150)
  }
  return best && best.score >= 45 ? best.url : null
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bento-poster-fetch/1.0)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  const movies = parseMovies(fs.readFileSync(listPath, 'utf8'))
  const results = []

  for (const { title, year } of movies) {
    const slug = posterSlug(title)
    const dest = path.join(outDir, `${slug}.jpg`)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      results.push({ title, slug, status: 'skipped (exists)' })
      continue
    }

    process.stdout.write(`… ${title}\n`)
    try {
      const url = await fetchImdbPosterUrl(title, year)
      if (!url) {
        results.push({ title, slug, status: 'no match' })
        continue
      }
      await downloadFile(url, dest)
      results.push({ title, slug, status: 'ok' })
    } catch (err) {
      results.push({ title, slug, status: `error: ${err.message}` })
    }
    await sleep(200)
  }

  console.log('\n--- Summary ---')
  for (const r of results) {
    console.log(`${r.status.padEnd(16)} ${r.slug}`)
  }
  const ok = results.filter((r) => r.status === 'ok').length
  console.log(`\nDownloaded: ${ok}/${movies.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
