import { useState, useMemo } from 'react'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'
import { tr } from '../utils/i18n'
import { RICH } from '../data/restaurants'

function getRich(id) {
  const base = RICH[id] || { rating:4.0, reviews:Math.floor(30+Math.random()*200), price:'€', hours:'12:00–22:00', phone:null, desc:{PT:'Restaurante local em VRSA.',EN:'Local restaurant in VRSA.',ES:'Restaurante local en VRSA.',FR:'Restaurant local à VRSA.',DE:'Lokales Restaurant em VRSA.'} }
  const open = isOpenNow(base.hours, base.closedDays)
  return { ...base, open: open !== null ? open : true }
}

// closedDays: array of JS weekday numbers (0=Sun, 1=Mon, … 6=Sat)
function isOpenNow(hours, closedDays) {
  if (!hours) return null
  const now = new Date()
  if (closedDays?.includes(now.getDay())) return false
  const cur = now.getHours() * 60 + now.getMinutes()
  const slots = hours.split(' · ')
  for (const slot of slots) {
    const [s, e] = slot.split('–').map(t => {
      const [h, m] = t.trim().split(':').map(Number)
      return h * 60 + (m || 0)
    })
    if (cur >= s && cur <= e) return true
  }
  return false
}

function closesAt(hours, closedDays) {
  if (!hours) return null
  const now = new Date()
  if (closedDays?.includes(now.getDay())) return null
  const cur = now.getHours() * 60 + now.getMinutes()
  const slots = hours.split(' · ')
  for (const slot of slots) {
    const [s, e] = slot.split('–').map(t => {
      const [h, m] = t.trim().split(':').map(Number)
      return h * 60 + (m || 0)
    })
    if (cur >= s && cur <= e) {
      const hh = Math.floor(e/60), mm = e%60
      return `${hh}:${mm.toString().padStart(2,'0')}`
    }
  }
  return null
}

// Haversine distance in minutes walking (avg 5km/h)
function walkMins(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2-lat1) * Math.PI/180
  const dLng = (lng2-lng1) * Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(km / 5 * 60)
}
const CENTER = { lat: 37.1944, lng: -7.4155 }

// ─── Translations ─────────────────────────────────────────────
const FOOD_CATS = ['restaurante','pastelaria','gelataria','hamburgaria','pizzaria','kebab']
const FILTERS = [
  { k:'all',        match: FOOD_CATS },
  { k:'fish',       match:['restaurante'], sub:['marisco','peixe','marisqueira','pescador','ribeirinha','cuca','arcos','cisne','naval','guadiana','salgada','cantarinha','moleiro','fresco','petisco'] },
  { k:'cafe',       match:['pastelaria','gelataria'] },
  { k:'pizza',      match:['pizzaria'] },
  { k:'burger',     match:['hamburgaria'] },
  { k:'kebab',      match:['kebab'] },
  { k:'sushi',      match:['restaurante'], sub:['sushi','kazami','hot street'] },
  { k:'icecream',   match:['gelataria'] },
]

function matchFilter(pin, fk) {
  if (fk === 'all') return FOOD_CATS.includes(pin.cat)
  const f = FILTERS.find(x => x.k === fk)
  if (!f) return false
  if (!f.match.includes(pin.cat)) return false
  if (f.sub) return f.sub.some(s => pin.name.toLowerCase().includes(s))
  return true
}

// ─── Star component ───────────────────────────────────────────
function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span style={{ color:'#F59E0B', fontSize:12, letterSpacing:1 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5-full-(half?1:0))}
      <span style={{ color:'var(--ink-40)', fontWeight:700, marginLeft:4 }}>{rating.toFixed(1)}</span>
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function Restaurants({ lang, pins, favs, toggleFav, onNav, cmsRestaurants }) {
  const L  = lang || 'PT'
  const t  = tr('restaurants', L)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [detail, setDetail]   = useState(null)

  const foodPins = useMemo(() => {
    const base = cmsRestaurants && cmsRestaurants.length > 0
      ? [...pins.filter(p => !FOOD_CATS.includes(p.cat)), ...cmsRestaurants]
      : pins
    return base.filter(p => FOOD_CATS.includes(p.cat))
  }, [pins, cmsRestaurants])

  const filtered = useMemo(() => {
    let list = foodPins.filter(p => matchFilter(p, filter))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    return list
  }, [foodPins, filter, search])

  // ── Detail view ──────────────────────────────────────────────
  if (detail) {
    const r    = detail
    const rich = getRich(r.id)
    const isFav = favs.includes('pin-' + r.id)

    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        {/* Avatar header */}
        <div style={{ background:getAvatarColor(r.name), padding:'20px 18px 24px', paddingTop:'calc(64px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
            <button aria-label={t.back} onClick={() => setDetail(null)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <button aria-label={t.fav} onClick={() => toggleFav('pin-' + r.id)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,.2)', border:'none', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{isFav ? '❤️' : '🤍'}</button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:64, height:64, borderRadius:16, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:26, fontWeight:700, color:'#fff', letterSpacing:'-1px' }}>{getInitials(r.name)}</span>
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:'#fff', lineHeight:1.2 }}>{r.name}</div>
              <div style={{ display:'flex', gap:6, marginTop:5, alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.75)', background:'rgba(255,255,255,.15)', padding:'2px 8px', borderRadius:50 }}>{rich.price}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.7)' }}>⭐ {rich.rating}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,.5)' }}>({rich.reviews})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 40px' }}>
          {/* Name + badge */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:22, fontWeight:800, color:'var(--ink)', lineHeight:1.2, marginBottom:4 }}>{r.name}</div>
              <div style={{ fontSize:12, color:'var(--ink-40)', fontWeight:600 }}>
                {rich.price} · {r.cat === 'pastelaria' ? (L === 'EN' ? 'Café / Pastries' : L === 'FR' ? 'Café / Pâtisserie' : L === 'DE' ? 'Café / Gebäck' : L === 'ES' ? 'Café / Pasteles' : 'Café / Pastelaria') : r.cat === 'gelataria' ? (L === 'EN' ? 'Ice Cream' : L === 'FR' ? 'Glacier' : L === 'DE' ? 'Eiscafé' : L === 'ES' ? 'Heladería' : 'Gelataria') : r.cat === 'pizzaria' ? 'Pizzaria' : r.cat === 'hamburgaria' ? (L === 'EN' ? 'Burgers' : L === 'FR' ? 'Burgers' : L === 'DE' ? 'Burger' : 'Hamburgaria') : r.cat === 'kebab' ? 'Kebab' : (L === 'EN' ? 'Restaurant' : L === 'FR' ? 'Restaurant' : L === 'DE' ? 'Restaurant' : L === 'ES' ? 'Restaurante' : 'Restaurante')}
              </div>
            </div>
            <span style={{ fontSize:13, fontWeight:800, padding:'4px 10px', borderRadius:50, background: rich.open ? '#DCFCE7' : '#FEE2E2', color: rich.open ? '#15803D' : '#B91C1C' }}>
              {rich.open ? t.open : t.closed}
            </span>
          </div>

          <Stars rating={rich.rating} />
          <span style={{ fontSize:11, color:'var(--ink-20)', marginLeft:6 }}>({rich.reviews} {t.reviews})</span>

          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.7, margin:'14px 0' }}>
            {(rich.desc[L] || rich.desc.PT)}
          </p>

          {/* Info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            <div className="card" style={{ padding:'12px 14px', borderRadius:12 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{t.hours}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--ink)' }}>{rich.hours}</div>
            </div>
            {rich.phone ? (
              <a href={'tel:' + rich.phone} style={{ textDecoration:'none' }}>
                <div className="card" style={{ padding:'12px 14px', borderRadius:12, cursor:'pointer' }}>
                  <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{t.phone}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--blue)' }}>{rich.phone}</div>
                </div>
              </a>
            ) : (
              <div className="card" style={{ padding:'12px 14px', borderRadius:12, opacity:.4 }}>
                <div style={{ fontSize:9, fontWeight:700, color:'var(--ink-20)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{t.phone}</div>
                <div style={{ fontSize:12, color:'var(--ink-40)' }}>—</div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={() => { const c = r.lat+','+r.lng; window.open('https://www.google.com/maps/search/?api=1&query='+c,'_blank') }}
              style={{ flex:1, padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 16px rgba(6,21,43,.25)' }}
            >🧭 {t.navigate}</button>
            {rich.phone && (
              <a href={'tel:' + rich.phone} style={{ textDecoration:'none' }}>
                <button aria-label={t.call} style={{ width:50, height:50, background:'var(--blue-lt)', border:'none', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>📞</button>
              </a>
            )}
            <button
              onClick={() => { if (navigator.share) { navigator.share({title:r.name, text:r.name+' — VRSA Guide', url:window.location.href}) } }}
              style={{ width:50, height:50, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            >↗️</button>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(160deg,var(--navy) 0%,#162844 100%)', padding:'18px 20px 0', paddingTop:'calc(62px + env(safe-area-inset-top,0px))', flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-.3px', marginBottom:12 }}>{t.title}</div>
        {/* Search */}
        <div style={{ position:'relative', marginBottom:12 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.search}
            style={{ width:'100%', padding:'10px 14px 10px 40px', border:'1px solid rgba(255,255,255,.15)', borderRadius:50, background:'rgba(255,255,255,.1)', color:'#fff', fontSize:13, outline:'none', fontFamily:'var(--font)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,.6)', fontSize:16, cursor:'pointer' }}>×</button>
          )}
        </div>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:14 }}>
          {FILTERS.map(f => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              style={{ flexShrink:0, padding:'6px 14px', borderRadius:50, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, transition:'all .15s',
                background: filter === f.k ? '#fff' : 'rgba(255,255,255,.1)',
                color:      filter === f.k ? 'var(--navy)' : 'rgba(255,255,255,.6)',
              }}
            >
              {t[f.k] || f.k}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ padding:'10px 20px 6px', fontSize:11, fontWeight:600, color:'var(--ink-20)', flexShrink:0 }}>
        {filtered.length} {L === 'EN' ? 'places' : L === 'FR' ? 'établissements' : L === 'DE' ? 'Orte' : L === 'ES' ? 'lugares' : 'locais'}
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 16px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--ink-20)' }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🍽️</div>
            <div style={{ fontSize:13 }}>{t.noResults}</div>
          </div>
        ) : (
          <div className="card" style={{ overflow:'hidden' }}>
            {filtered.map((r, i) => {
              const rich  = getRich(r.id)
              const isFav = favs.includes('pin-' + r.id)
                      return (
                <div
                  key={r.id}
                  onClick={() => setDetail(r)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < filtered.length-1 ? '1px solid var(--surface)' : 'none', cursor:'pointer', transition:'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div style={{ width:50, height:50, borderRadius:12, background:getAvatarColor(r.name), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-.5px' }}>{getInitials(r.name)}</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                      <Stars rating={rich.rating} />
                      <span style={{ fontSize:10, color:'var(--ink-20)' }}>({rich.reviews})</span>
                    </div>
                    <div style={{ display:'flex', gap:6, marginTop:3, alignItems:'center' }}>
                      <span style={{ fontSize:10, fontWeight:700, color: rich.open ? '#15803D' : '#B91C1C', background: rich.open ? '#DCFCE7' : '#FEE2E2', padding:'1px 7px', borderRadius:50 }}>
                        {rich.open ? t.open : t.closed}
                      </span>
                      <span style={{ fontSize:11, color:'var(--ink-40)' }}>{rich.price}</span>
                      {rich.phone && (
                        <span style={{ fontSize:11, color:'var(--blue)', fontWeight:600 }}>{rich.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    {rich.phone && (
                      <a href={'tel:' + rich.phone} onClick={e => e.stopPropagation()} style={{ textDecoration:'none' }}>
                        <button aria-label={t.call} style={{ width:34, height:34, borderRadius:10, background:'var(--mint-lt)', border:'none', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>📞</button>
                      </a>
                    )}
                    <button
                      aria-label={t.fav}
                      onClick={e => { e.stopPropagation(); toggleFav('pin-' + r.id) }}
                      style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', padding:4 }}
                    >{isFav ? '❤️' : '🤍'}</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}