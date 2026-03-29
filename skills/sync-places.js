#!/usr/bin/env node
/* global process, URL */
/**
 * sync-places.js — Extrai dados do Google Places API para places-db.json
 *
 * Uso: node skills/sync-places.js
 *
 * Requer:
 *   - .env na raiz com VITE_GOOGLE_MAPS_KEY
 *   - npm install papaparse (já instalado)
 *
 * O que faz:
 *   1. Lê os pins de restaurantes e hotéis de src/data/pins.js
 *   2. Para cada pin, faz Text Search → Place Details na API Google Places
 *   3. Extrai: rating, user_ratings_total, phone, hours_text, price_level, reviews, website
 *   4. Escreve tudo em src/data/places-db.json (keyed por pin ID)
 *
 * Rate limit: pausa de 600ms entre chamadas para não ultrapassar quotas.
 */

import fs   from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')

// ── 1. Carregar .env ──────────────────────────────────────────
const envPath = path.join(ROOT, '.env')
const envVars = {}
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#')) envVars[k.trim()] = v.join('=').trim()
  })
}
const API_KEY = envVars['VITE_GOOGLE_MAPS_KEY']
if (!API_KEY) {
  console.error('❌ VITE_GOOGLE_MAPS_KEY não encontrada em .env')
  process.exit(1)
}

// ── 2. Categorias a sincronizar ───────────────────────────────
const SYNC_CATS = new Set([
  'restaurante','pastelaria','gelataria','hamburgaria','pizzaria','kebab',
  'hotel','bar','sushi'
])

// ── 3. Carregar pins.js ───────────────────────────────────────
const pinsPath = path.join(ROOT, 'src', 'data', 'pins.js')
const pinsText = fs.readFileSync(pinsPath, 'utf8')
const PIN_RE   = /\{id:(\d+),name:"((?:[^"\\]|\\.)*)",emoji:"[^"]*",cat:"([^"]*)",color:"[^"]*",lat:([\d.+-]+),lng:([\d.+-]+)\}/g

const pins = []
let m
while ((m = PIN_RE.exec(pinsText)) !== null) {
  const cat = m[3]
  if (SYNC_CATS.has(cat)) {
    pins.push({ id: parseInt(m[1]), name: m[2], cat, lat: parseFloat(m[4]), lng: parseFloat(m[5]) })
  }
}
console.log(`📍 ${pins.length} pins para sincronizar (${[...SYNC_CATS].join(', ')})`)

// ── 4. Utilitários HTTP ───────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { reject(new Error('JSON parse error: ' + data.slice(0, 200))) }
      })
    }).on('error', reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── 5. Google Places: Text Search ────────────────────────────
async function textSearch(name, lat, lng) {
  const query   = encodeURIComponent(`${name} VRSA Portugal`)
  const loc     = `${lat},${lng}`
  const url     = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${loc}&radius=200&key=${API_KEY}`
  const res     = await get(url)
  if (res.status !== 'OK' || !res.results?.length) return null
  return res.results[0].place_id
}

// ── 6. Google Places: Place Details ──────────────────────────
const FIELDS = [
  'rating','user_ratings_total','formatted_phone_number',
  'opening_hours','price_level','reviews','website','name'
].join(',')

async function placeDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${FIELDS}&language=pt&key=${API_KEY}`
  const res = await get(url)
  if (res.status !== 'OK') return null
  return res.result
}

// ── 7. Transformar resultado em formato compacto ──────────────
function transform(detail) {
  const reviews = (detail.reviews || []).slice(0, 5).map(r => ({
    author: r.author_name,
    rating: r.rating,
    text:   r.text,
    time:   r.relative_time_description
  }))

  // Concatenar horários num string legível (ex: "12:00–15:00 · 19:00–23:00")
  let hours_text = null
  if (detail.opening_hours?.periods) {
    // Simplify: join weekday_text first line or build from periods
    const wt = detail.opening_hours.weekday_text
    if (wt?.length) {
      // Tentar extrair horas do dia de hoje ou usar o primeiro período disponível
      const today = new Date().getDay() // 0=Sun … 6=Sat
      const todayLine = wt[today === 0 ? 6 : today - 1] || wt[0]
      // ex: "segunda-feira: 12:00 – 22:00"
      const match = todayLine?.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/)
      if (match) hours_text = `${match[1]}–${match[2]}`
    }
  }

  return {
    rating:             detail.rating || null,
    user_ratings_total: detail.user_ratings_total || 0,
    phone:              detail.formatted_phone_number || null,
    hours_text,
    price_level:        detail.price_level ?? null,
    website:            detail.website || null,
    reviews
  }
}

// ── 8. Loop principal ─────────────────────────────────────────
const DB_PATH = path.join(ROOT, 'src', 'data', 'places-db.json')
let db = {}
if (fs.existsSync(DB_PATH)) {
  try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) } catch { /* ignore */ }
}

let updated = 0
let failed  = 0

for (let i = 0; i < pins.length; i++) {
  const pin = pins[i]
  const pct = `[${i + 1}/${pins.length}]`

  // Skip já existentes (re-correr apenas novos)
  if (db[pin.id]) {
    console.log(`  ⏭  ${pct} ${pin.name} — já existe, a saltar`)
    continue
  }

  process.stdout.write(`  🔍 ${pct} ${pin.name} … `)

  try {
    const placeId = await textSearch(pin.name, pin.lat, pin.lng)
    if (!placeId) {
      console.log('não encontrado')
      failed++
      await sleep(600)
      continue
    }

    await sleep(400) // pausa entre Text Search e Details

    const detail = await placeDetails(placeId)
    if (!detail) {
      console.log('sem detalhes')
      failed++
      await sleep(600)
      continue
    }

    db[pin.id] = transform(detail)
    updated++
    console.log(`✅  ${detail.rating ?? '?'}⭐ (${detail.user_ratings_total ?? 0} reviews)`)

    // Guardar incrementalmente — não perde trabalho em caso de erro
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
  } catch (err) {
    console.log(`❌  erro: ${err.message}`)
    failed++
  }

  await sleep(600) // rate limit: ~100 req/min máx
}

// ── 9. Resultado final ────────────────────────────────────────
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
console.log(`\n✅ Concluído — ${updated} atualizados, ${failed} falhados`)
console.log(`📁 Ficheiro: src/data/places-db.json (${Object.keys(db).length} entradas)`)
