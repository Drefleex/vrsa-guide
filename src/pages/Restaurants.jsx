import { useState, useMemo, useEffect } from 'react'
import { getInitials, getAvatarColor } from '../utils/avatarUtils'
import { tr } from '../utils/i18n'
import DB from '../data/places-db.json'
import BAIRRO from '../data/bairro-db.json'
import { Share } from 'lucide-react'

function normalizeName(n) {
  return (n || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim()
}

function getBairro(pinName) {
  const key = normalizeName(pinName)
  if (BAIRRO[key]) return BAIRRO[key]
  // fuzzy: check if bairro key contains or is contained in pin key
  const found = Object.keys(BAIRRO).find(k => k.includes(key) || key.includes(k))
  return found ? BAIRRO[found] : null
}

const CAT_DEFAULTS = {
  restaurante: { rating:4.0, price:'€€', hours:'12:00–15:00 · 19:00–22:30', closedDays:[1],
    desc:{PT:'Restaurante tradicional português. Peixe fresco e petiscos da região do Algarve.',EN:'Traditional Portuguese restaurant. Fresh fish and regional Algarve specialties.',ES:'Restaurante tradicional portugués. Pescado fresco y especialidades del Algarve.',FR:'Restaurant traditionnel portugais. Poisson frais et spécialités de l\'Algarve.',DE:'Traditionelles portugiesisches Restaurant. Frischer Fisch und regionale Spezialitäten.'} },
  pastelaria: { rating:4.1, price:'€', hours:'08:00–20:00',
    desc:{PT:'Café e pastelaria com produtos artesanais. Perfeito para pequeno-almoço ou lanche.',EN:'Café and bakery with artisan products. Perfect for breakfast or a snack.',ES:'Café y pastelería artesanal. Perfecto para desayuno o merienda.',FR:'Café et pâtisserie artisanale. Parfait pour le petit-déjeuner ou le goûter.',DE:'Café und Bäckerei mit handgemachten Produkten. Ideal für Frühstück oder Snack.'} },
  gelataria: { rating:4.2, price:'€', hours:'10:00–23:00',
    desc:{PT:'Gelataria artesanal com sabores frescos e criativos.',EN:'Artisan ice cream shop with fresh and creative flavours.',ES:'Heladería artesanal con sabores frescos y creativos.',FR:'Glacier artisanal avec des saveurs fraîches et créatives.',DE:'Handwerkliche Eisdiele mit frischen und kreativen Eissorten.'} },
  hamburgaria: { rating:3.9, price:'€', hours:'12:00–23:00',
    desc:{PT:'Hambúrgueres artesanais e refeições rápidas.',EN:'Artisan burgers and quick meals.',ES:'Hamburguesas artesanales y comidas rápidas.',FR:'Burgers artisanaux et repas rapides.',DE:'Handgemachte Burger und Schnellgerichte.'} },
  pizzaria: { rating:4.0, price:'€€', hours:'12:00–15:00 · 18:00–23:00',
    desc:{PT:'Pizzaria com ingredientes frescos e massa artesanal.',EN:'Pizza restaurant with fresh ingredients and handmade dough.',ES:'Pizzería con ingredientes frescos y masa artesanal.',FR:'Pizzeria avec ingrédients frais et pâte artisanale.',DE:'Pizzeria mit frischen Zutaten und handgemachtem Teig.'} },
  kebab: { rating:3.8, price:'€', hours:'12:00–00:00',
    desc:{PT:'Kebab e grelhados. Rápido, saboroso e económico.',EN:'Kebab and grilled meats. Fast, tasty and affordable.',ES:'Kebab y carnes a la brasa. Rápido, sabroso y económico.',FR:'Kebab et grillades. Rapide, savoureux et abordable.',DE:'Kebab und Grillgerichte. Schnell, lecker und günstig.'} },
}

// Parses bairro hours "11h30 - 15h00 / 19h00 - 23h00" for today
function isOpenFromBairro(bdHours) {
  if (!bdHours) return null
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
  const today = days[new Date().getDay()]
  const todayH = bdHours[today]
  if (!todayH || todayH === 'Fechado') return false
  const cur = new Date().getHours() * 60 + new Date().getMinutes()
  for (const slot of todayH.split('/')) {
    const m = slot.trim().match(/(\d+)h(\d+)\s*-\s*(\d+)h(\d+)/)
    if (!m) continue
    const s = parseInt(m[1]) * 60 + parseInt(m[2])
    const e = parseInt(m[3]) * 60 + parseInt(m[4])
    if (cur >= s && cur <= e) return true
  }
  return false
}

function getTodayHoursText(bdHours) {
  if (!bdHours) return null
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab']
  const today = days[new Date().getDay()]
  return bdHours[today] || null
}

function getRich(id, cat, pinName) {
  const def  = CAT_DEFAULTS[cat] || CAT_DEFAULTS.restaurante
  const real = DB[id]
  const bd   = getBairro(pinName || '')
  const base = {
    rating:     real?.rating || bd?.rating || def.rating,
    reviews:    real?.user_ratings_total || bd?.totalReviews || (30 + (id * 13 % 170)),
    phone:      real?.phone || bd?.phone || null,
    hours:      getTodayHoursText(bd?.hours) || real?.hours_text || def.hours,
    price:      real?.price_level ? '€'.repeat(real.price_level) : def.price,
    closedDays: def.closedDays,
    desc:       def.desc,
    bdHours:    bd?.hours || null,
    bdCategory: bd?.category || null,
    bdMenu:     bd?.menu || [],
    bdFeatures: bd?.features || [],
    bdInstagram: bd?.instagram || null,
    bdUrl:      bd?.bairroUrl || null,
  }
  const open = bd ? isOpenFromBairro(bd.hours) : isOpenNow(real?.hours_text || def.hours, def.closedDays)
  return { ...base, open: open !== null ? open : true, realReviews: real?.reviews || [] }
}

// closedDays: array of JS weekday numbers (0=Sun, 1=Mon, … 6=Sat)
function parseSlot(slot) {
  const [s, e] = slot.split('–').map(t => {
    const [h, m] = t.trim().split(':').map(Number)
    return h * 60 + (m || 0)
  })
  // 00:00 closing = midnight = end of day (1440 min)
  const end = e === 0 ? 1440 : e
  return { s, end }
}

function isOpenNow(hours, closedDays) {
  if (!hours) return null
  const now = new Date()
  if (closedDays?.includes(now.getDay())) return false
  const cur = now.getHours() * 60 + now.getMinutes()
  for (const slot of hours.split(' · ')) {
    const { s, end } = parseSlot(slot)
    // crosses midnight (e.g. 23:00–02:00)
    if (end < s) { if (cur >= s || cur <= end) return true }
    else         { if (cur >= s && cur <= end) return true }
  }
  return false
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
export default function Restaurants({ lang, pins, favs, toggleFav, focusPin, onFocusClear }) {
  const L  = lang || 'PT'
  const t  = tr('restaurants', L)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [detail, setDetail]   = useState(focusPin || null)

  useEffect(() => {
    if (focusPin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetail(focusPin)
      onFocusClear?.()
    }
  }, [focusPin]) // eslint-disable-line react-hooks/exhaustive-deps

  const foodPins = useMemo(() => {
    return pins.filter(p => FOOD_CATS.includes(p.cat))
  }, [pins])

  const filtered = useMemo(() => {
    let list = foodPins.filter(p => matchFilter(p, filter))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    return list
  }, [foodPins, filter, search])

  const handleShare = async (itemTitle) => {
    const shareData = {
      title: 'VRSA Guide - ' + itemTitle,
      text: `Vê este local fantástico no VRSA Guide: ${itemTitle}!`,
      url: window.location.href
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch { /* ignore */ }
    } else {
      navigator.clipboard?.writeText(`${shareData.text} ${shareData.url}`)
    }
  }

  // ── Detail view ──────────────────────────────────────────────
  const [openMenuSection, setOpenMenuSection] = useState(null)
  const [showAllHours, setShowAllHours] = useState(false)

  if (detail) {
    const r    = detail
    const rich = getRich(r.id, r.cat, r.name)
    const isFav = favs.includes('pin-' + r.id)

    return (
      <div className="page" style={{ display:'flex', flexDirection:'column' }}>
        {/* Avatar header */}
        <div style={{ background:`linear-gradient(160deg, ${getAvatarColor(r.name)} 0%, ${getAvatarColor(r.name)}bb 60%, #0F172A 100%)`, paddingTop:'calc(64px + env(safe-area-inset-top,0px))', paddingRight:'18px', paddingBottom:'24px', paddingLeft:'18px', flexShrink:0, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute', bottom:-30, left:-20, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
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

          {rich.bdCategory && (
            <span style={{ display:'inline-block', fontSize:11, fontWeight:700, color:'var(--primary)', background:'var(--primary-lt)', borderRadius:50, padding:'3px 10px', marginBottom:10 }}>
              {rich.bdCategory}
            </span>
          )}

          <p style={{ fontSize:13, color:'var(--ink-40)', lineHeight:1.7, margin:'14px 0' }}>
            {(rich.desc[L] || rich.desc.PT)}
          </p>

          {rich.realReviews?.length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)', marginBottom:12 }}>Google Reviews</div>
              <div style={{ display:'flex', overflowX:'auto', gap:10, paddingBottom:8, msOverflowStyle:'none', scrollbarWidth:'none' }}>
                {rich.realReviews.map((rev, idx) => (
                  <div key={idx} className="card" style={{ padding:14, borderRadius:12, minWidth:260, maxWidth:280, flexShrink:0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:'var(--ink)' }}>{rev.author}</div>
                      <Stars rating={rev.rating} />
                    </div>
                    <div style={{ fontSize:12, color:'var(--ink-40)', lineHeight:1.5 }}>&ldquo;{rev.text.length > 130 ? rev.text.substring(0,130)+'...' : rev.text}&rdquo;</div>
                    <div style={{ fontSize:10, color:'var(--ink-20)', marginTop:8 }}>{rev.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Full weekly hours (collapsible) */}
          {rich.bdHours && (
            <div style={{ marginBottom:16 }}>
              <button
                onClick={() => setShowAllHours(v => !v)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--surface)', border:'none', borderRadius:12, padding:'10px 14px', cursor:'pointer', marginBottom: showAllHours ? 0 : 0 }}
              >
                <span style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>
                  {L==='EN'?'Weekly hours':L==='FR'?'Horaires':L==='DE'?'Öffnungszeiten':L==='ES'?'Horarios':'Horário semanal'}
                </span>
                <span style={{ fontSize:11, color:'var(--ink-40)' }}>{showAllHours ? '▲' : '▼'}</span>
              </button>
              {showAllHours && (
                <div className="card" style={{ borderRadius:'0 0 12px 12px', overflow:'hidden' }}>
                  {Object.entries(rich.bdHours).map(([day, h]) => (
                    <div key={day} style={{ display:'flex', justifyContent:'space-between', padding:'8px 14px', borderBottom:'1px solid var(--surface)', fontSize:12 }}>
                      <span style={{ fontWeight:700, color:'var(--ink)', minWidth:36 }}>{day}</span>
                      <span style={{ color: h==='Fechado' ? '#B91C1C' : 'var(--ink-40)', fontWeight: h==='Fechado' ? 700 : 400 }}>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Menu */}
          {rich.bdMenu?.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'var(--ink)', marginBottom:10 }}>
                {L==='EN'?'Menu':L==='FR'?'Carte':L==='DE'?'Speisekarte':L==='ES'?'Carta':'Ementa'}
              </div>
              {rich.bdMenu.map((sec, si) => (
                <div key={si} style={{ marginBottom:8 }}>
                  <button
                    onClick={() => setOpenMenuSection(openMenuSection === si ? null : si)}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background: openMenuSection===si ? 'var(--primary)' : 'var(--surface)', border:'none', borderRadius: openMenuSection===si ? '12px 12px 0 0' : 12, padding:'10px 14px', cursor:'pointer' }}
                  >
                    <span style={{ fontSize:13, fontWeight:700, color: openMenuSection===si ? '#fff' : 'var(--ink)' }}>{sec.section}</span>
                    <span style={{ fontSize:11, color: openMenuSection===si ? 'rgba(255,255,255,.7)' : 'var(--ink-40)' }}>{openMenuSection===si ? '▲' : '▼'} {sec.items.length} pratos</span>
                  </button>
                  {openMenuSection === si && (
                    <div className="card" style={{ borderRadius:'0 0 12px 12px', overflow:'hidden', marginTop:0 }}>
                      {sec.items.map((item, ii) => (
                        <div key={ii} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'9px 14px', borderBottom: ii < sec.items.length-1 ? '1px solid var(--surface)' : 'none', gap:8 }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:'var(--ink)', textTransform:'capitalize' }}>{item.name.toLowerCase()}</div>
                            {item.desc && <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:2 }}>{item.desc}</div>}
                          </div>
                          {item.price != null && (
                            <div style={{ flexShrink:0 }}>
                              {item.promo != null && (
                                <span style={{ fontSize:10, color:'#B91C1C', textDecoration:'line-through', marginRight:4 }}>{item.price}€</span>
                              )}
                              <span style={{ fontSize:13, fontWeight:800, color: item.promo != null ? '#15803D' : 'var(--primary)' }}>
                                {item.promo != null ? item.promo : item.price}€
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Features */}
          {rich.bdFeatures?.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
              {rich.bdFeatures.map((f, i) => (
                <span key={i} style={{ fontSize:11, fontWeight:600, color:'var(--ink-40)', background:'var(--surface)', borderRadius:50, padding:'4px 10px', border:'1px solid var(--border)' }}>
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button
              onClick={() => { const c = r.lat+','+r.lng; window.open('https://www.google.com/maps/search/?api=1&query='+c,'_blank','noopener,noreferrer') }}
              style={{ flex:1, minWidth:120, padding:'13px 0', background:'var(--navy)', color:'#fff', border:'none', borderRadius:14, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 16px rgba(6,21,43,.25)' }}
            >🧭 {t.navigate}</button>
            {rich.phone && (
              <a href={'tel:' + rich.phone} style={{ textDecoration:'none' }}>
                <button aria-label={t.call} style={{ width:50, height:50, background:'var(--blue-lt)', border:'none', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>📞</button>
              </a>
            )}
            {rich.bdInstagram && (
              <a href={rich.bdInstagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <button aria-label="Instagram" style={{ width:50, height:50, background:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', border:'none', borderRadius:14, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>📸</button>
              </a>
            )}
            {rich.bdUrl && (
              <a href={rich.bdUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <button aria-label="Bairro Digital" style={{ width:50, height:50, background:'var(--primary-lt)', border:'none', borderRadius:14, fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>🏪</button>
              </a>
            )}
            <button
              onClick={() => handleShare(r.name)}
              style={{ width:50, height:50, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
            ><Share size={20} color="var(--ink)" /></button>
          </div>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="page" style={{ display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{
        background: 'url("/images/restaurants_hero_hr.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: 'calc(64px + env(safe-area-inset-top,0px))',
        paddingRight: '20px',
        paddingBottom: 0,
        paddingLeft: '20px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {/* Cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)' }} />
        
        <div style={{ position:'relative', zIndex:1, fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-.5px', textShadow: '0 2px 14px rgba(0,0,0,0.5)', marginBottom:16 }}>{t.title}</div>
        {/* Search */}
        <div style={{ position:'relative', zIndex:1, marginBottom:12, backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)' }}>
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
              const rich  = getRich(r.id, r.cat, r.name)
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