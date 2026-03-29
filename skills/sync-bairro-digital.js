#!/usr/bin/env node
/* global process */
/**
 * sync-bairro-digital.js — Extrai dados do Bairro Digital VRSA (via Mygon API)
 *
 * Uso: node skills/sync-bairro-digital.js
 *
 * O que faz:
 *   1. Para cada ID de loja (restaurantes VRSA no Bairro Digital)
 *   2. Chama api.mygon.com/mygon-middleware/rest/shop/{id}
 *   3. Extrai: nome, rating, phone, horários, menu, Instagram, coordenadas
 *   4. Escreve em src/data/bairro-db.json (keyed por nome normalizado)
 */

import fs   from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const DB_PATH   = path.join(ROOT, 'src', 'data', 'bairro-db.json')

// IDs das lojas de restaurantes no Bairro Digital VRSA
const SHOP_IDS = [
  80771, 86202, 80762, 80760, 87202, 86705, 81673, 80779, 80767, 80765,
  30073, 80757, 80756, 80746, 80745, 80741, 80729, 80706, 30252
]

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' } }, res => {
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

// Normaliza nome para key consistente (match com pins.js)
function normalizeName(n) {
  return (n || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim()
}

// Extrai horário legível
function extractHours(scheduleView) {
  if (!scheduleView?.schedules?.length) return null
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
  const result = {}
  for (const s of scheduleView.schedules) {
    const key = s.name?.slice(0,3) || days[s.weekday - 1] || s.name
    result[key] = s.isClosed ? 'Fechado' : (s.periods || null)
  }
  return result
}

// Extrai menu (máx 40 itens por secção)
function extractMenu(priceListViews) {
  if (!priceListViews?.length) return []
  const menu = []
  for (const pv of priceListViews) {
    if (pv.status !== 'ACTIVE') continue
    for (const section of (pv.sections || [])) {
      const items = (section.items || []).slice(0, 40).map(i => ({
        name:  i.name,
        desc:  i.description || null,
        price: i.price != null ? i.price : null,
        promo: i.promotionPrice != null ? i.promotionPrice : null,
      }))
      if (items.length) menu.push({ section: section.name, items })
    }
  }
  return menu
}

// Extrai amenidades
function extractFeatures(charView) {
  if (!charView?.characteristics?.length) return []
  return charView.characteristics
    .filter(c => c.description && c.description !== 'Não')
    .map(c => c.name + (c.description && c.description !== 'Sim' ? ': ' + c.description : ''))
}

// ── Loop principal ────────────────────────────────────────────
let db = {}
if (fs.existsSync(DB_PATH)) {
  try { db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) } catch { /* ignore */ }
}

let updated = 0
let failed  = 0

for (let i = 0; i < SHOP_IDS.length; i++) {
  const id  = SHOP_IDS[i]
  const pct = `[${i + 1}/${SHOP_IDS.length}]`

  process.stdout.write(`  🔍 ${pct} ID ${id} … `)

  try {
    const url = `https://api.mygon.com/mygon-middleware/rest/shop/${id}?clientApplication=WEB&language=pt_PT&entityId=19`
    const res = await get(url)
    const shop = res?.data
    if (!shop?.name) {
      console.log('sem dados')
      failed++
      await sleep(300)
      continue
    }

    const key = normalizeName(shop.name)
    const addr = shop.addressView

    db[key] = {
      bairroId:    id,
      name:        shop.name,
      rating:      shop.averageRating || null,
      totalReviews: shop.totalReviews || 0,
      phone:       shop.phone || addr?.phone || null,
      website:     shop.website || null,
      instagram:   shop.instagram || null,
      lat:         addr?.latitude  ? parseFloat(addr.latitude)  : null,
      lng:         addr?.longitude ? parseFloat(addr.longitude) : null,
      address:     addr ? `${addr.address1} ${addr.address2}`.trim() : null,
      category:    shop.categoryView?.categories?.[0]?.subcategories?.[0]?.subcategoryName || null,
      hours:       extractHours(shop.scheduleView),
      menu:        extractMenu(shop.priceListViews),
      features:    extractFeatures(shop.characteristicListView),
      booking:     shop.bookingType || null,
      bairroUrl:   `https://bairrodigital.vrsa.pt/pt/loja/${id}/`,
    }

    updated++
    const r = shop.averageRating
    console.log(`✅  ${shop.name} — ${r ? r + '⭐' : 'sem rating'} (${shop.totalReviews || 0} reviews)`)

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
  } catch (err) {
    console.log(`❌  erro: ${err.message}`)
    failed++
  }

  await sleep(300)
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
console.log(`\n✅ Concluído — ${updated} extraídos, ${failed} falhados`)
console.log(`📁 ${DB_PATH} (${Object.keys(db).length} entradas)`)
